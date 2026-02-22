#!/usr/bin/env node

/**
 * generate-ai-assets.mjs - Generate AI visual/audio assets for a composition
 *
 * Reads narration.json scene descriptions and generates images/videos/music
 * via fal.ai or Kie.ai API, saving them to public/videos/{compositionId}/ai-assets/
 *
 * Usage:
 *   node scripts/generate-ai-assets.mjs <compositionId> [options]
 *
 * Options:
 *   --scene <id>              Generate for specific scene only
 *   --type <img|video>        Asset type (default: img)
 *   --model <model>           Model ID override
 *   --provider <fal|kie|auto> AI provider (default: fal)
 *   --music                   Generate background music via Kie.ai Suno
 *   --dry-run                 Show prompts without generating
 *
 * Environment:
 *   FAL_KEY                   fal.ai API key (required for fal provider)
 *   KIE_KEY                   Kie.ai API key (required for kie provider)
 *   AI_PROVIDER               Default provider (fal | kie | auto)
 *
 * Example:
 *   node scripts/generate-ai-assets.mjs ZeigarnikEffect
 *   node scripts/generate-ai-assets.mjs ZeigarnikEffect --provider kie --type video
 *   node scripts/generate-ai-assets.mjs ZeigarnikEffect --music
 *   node scripts/generate-ai-assets.mjs ZeigarnikEffect --dry-run
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });

// ============================================================================
// Config
// ============================================================================

const FAL_IMAGE_MODEL = "fal-ai/flux/schnell";
const FAL_VIDEO_MODEL = "fal-ai/minimax-video/image-to-video";
const KIE_IMAGE_MODEL = "4o-image";
const KIE_VIDEO_MODEL = "veo3-fast";
const KIE_MUSIC_MODEL = "suno_v4";

const KIE_BASE_URL = "https://api.kie.ai";
const KIE_POLL_INTERVAL_MS = 3000;
const KIE_MAX_POLL_ATTEMPTS = 120;

// ============================================================================
// Helpers
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const compositionId = args.find((a) => !a.startsWith("--"));

  if (!compositionId) {
    console.error("Usage: node scripts/generate-ai-assets.mjs <compositionId> [options]");
    process.exit(1);
  }

  const options = {
    compositionId,
    scene: null,
    type: "img",
    model: null,
    provider: process.env.AI_PROVIDER || "fal",
    music: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--scene" && args[i + 1]) options.scene = args[++i];
    if (args[i] === "--type" && args[i + 1]) options.type = args[++i];
    if (args[i] === "--model" && args[i + 1]) options.model = args[++i];
    if (args[i] === "--provider" && args[i + 1]) options.provider = args[++i];
    if (args[i] === "--music") options.music = true;
    if (args[i] === "--dry-run") options.dryRun = true;
  }

  return options;
}

function loadNarration(compositionId) {
  const narrationPath = path.join(
    PROJECT_ROOT,
    "projects",
    compositionId,
    "narration.json"
  );

  if (!fs.existsSync(narrationPath)) {
    console.error(`Narration file not found: ${narrationPath}`);
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(narrationPath, "utf-8"));
}

function extractPrompts(narration) {
  const scenes = narration.scenes || [];

  return scenes.map((scene) => {
    const promptSource =
      scene.visual_description ||
      scene.description ||
      scene.title ||
      scene.text ||
      "";

    return {
      sceneId: scene.id || scene.scene_id,
      prompt: `Cinematic, high quality, 4K, ${promptSource}`,
      originalText: promptSource,
    };
  });
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// ============================================================================
// Kie.ai API helpers
// ============================================================================

async function kieSubmitTask(endpoint, body) {
  const response = await fetch(`${KIE_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.KIE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kie.ai API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  if (!data.data?.task_id) {
    throw new Error("No task_id returned from Kie.ai");
  }
  return data.data.task_id;
}

async function kiePollResult(taskId) {
  for (let attempt = 0; attempt < KIE_MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(`${KIE_BASE_URL}/v1/task/${taskId}`, {
      headers: { Authorization: `Bearer ${process.env.KIE_KEY}` },
    });

    if (!response.ok) {
      throw new Error(`Kie.ai poll error (${response.status})`);
    }

    const result = await response.json();
    const status = result.data?.status;

    if (status === "completed") return result;
    if (status === "failed") {
      throw new Error(`Kie.ai task failed: ${result.data.error || "Unknown"}`);
    }

    await new Promise((r) => setTimeout(r, KIE_POLL_INTERVAL_MS));
  }
  throw new Error("Kie.ai task timed out");
}

// ============================================================================
// Provider-specific generation
// ============================================================================

async function generateWithFal(fal, item, type, model, outputDir) {
  if (type === "img") {
    const result = await fal.subscribe(model, {
      input: {
        prompt: item.prompt,
        image_size: { width: 1920, height: 1080 },
        num_inference_steps: 4,
        num_images: 1,
      },
    });

    const imageUrl = result.data?.images?.[0]?.url;
    if (imageUrl) {
      const ext = imageUrl.includes(".png") ? "png" : "jpg";
      const filename = `${item.sceneId}-bg.${ext}`;
      await downloadFile(imageUrl, path.join(outputDir, filename));
      return { sceneId: item.sceneId, status: "success", file: filename };
    }
  } else if (type === "video") {
    const result = await fal.subscribe(model, {
      input: { prompt: item.prompt },
    });

    const videoUrl = result.data?.video?.url;
    if (videoUrl) {
      const filename = `${item.sceneId}-motion.mp4`;
      await downloadFile(videoUrl, path.join(outputDir, filename));
      return { sceneId: item.sceneId, status: "success", file: filename };
    }
  }
  return null;
}

async function generateWithKie(item, type, model, outputDir) {
  if (type === "img") {
    const taskId = await kieSubmitTask("/v1/image/generate", {
      model,
      prompt: item.prompt,
      width: 1920,
      height: 1080,
    });

    const result = await kiePollResult(taskId);
    const imageUrl = result.data.output?.url || result.data.output?.urls?.[0];
    if (imageUrl) {
      const filename = `${item.sceneId}-bg.jpg`;
      await downloadFile(imageUrl, path.join(outputDir, filename));
      return { sceneId: item.sceneId, status: "success", file: filename };
    }
  } else if (type === "video") {
    const taskId = await kieSubmitTask("/v1/video/generate", {
      model,
      prompt: item.prompt,
      duration: 8,
    });

    const result = await kiePollResult(taskId);
    const videoUrl = result.data.output?.url;
    if (videoUrl) {
      const filename = `${item.sceneId}-motion.mp4`;
      await downloadFile(videoUrl, path.join(outputDir, filename));
      return { sceneId: item.sceneId, status: "success", file: filename };
    }
  }
  return null;
}

async function generateMusic(narration, compositionId, outputDir, dryRun) {
  const musicPrompt =
    narration.music_description ||
    narration.music_style ||
    `Cinematic ambient background music for: ${narration.title || compositionId}`;

  console.log(`\n🎵 Music generation`);
  console.log(`   Prompt: ${musicPrompt.substring(0, 100)}...`);

  if (dryRun) {
    console.log(`   [DRY RUN] Would generate music with model: ${KIE_MUSIC_MODEL}`);
    return { type: "music", status: "dry-run" };
  }

  if (!process.env.KIE_KEY) {
    console.error("   ❌ KIE_KEY required for music generation");
    return { type: "music", status: "error", error: "KIE_KEY missing" };
  }

  try {
    const taskId = await kieSubmitTask("/v1/music/generate", {
      model: KIE_MUSIC_MODEL,
      prompt: musicPrompt,
      instrumental: true,
      duration: 30,
    });

    const result = await kiePollResult(taskId);
    const audioUrl = result.data.output?.audio_url || result.data.output?.url;
    if (audioUrl) {
      const filename = "bgm.mp3";
      await downloadFile(audioUrl, path.join(outputDir, filename));
      console.log(`   ✅ Saved: ${filename}`);
      return { type: "music", status: "success", file: filename };
    }
  } catch (error) {
    console.error(`   ❌ Music error: ${error.message}`);
    return { type: "music", status: "error", error: error.message };
  }

  return { type: "music", status: "error", error: "No audio URL returned" };
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const options = parseArgs();
  const { compositionId, scene, type, provider, music, dryRun } = options;

  // Check API keys
  if (!dryRun) {
    if (provider === "fal" && !process.env.FAL_KEY) {
      console.error("Error: FAL_KEY environment variable is required for fal provider");
      process.exit(1);
    }
    if (provider === "kie" && !process.env.KIE_KEY) {
      console.error("Error: KIE_KEY environment variable is required for kie provider");
      process.exit(1);
    }
    if (music && !process.env.KIE_KEY) {
      console.error("Error: KIE_KEY environment variable is required for music generation");
      process.exit(1);
    }
  }

  // Load narration
  const narration = loadNarration(compositionId);
  let prompts = extractPrompts(narration);

  // Filter by scene if specified
  if (scene) {
    prompts = prompts.filter((p) => p.sceneId === scene);
    if (prompts.length === 0) {
      console.error(`Scene "${scene}" not found in narration`);
      process.exit(1);
    }
  }

  console.log(`\n📦 Composition: ${compositionId}`);
  console.log(`🎨 Type: ${type}`);
  console.log(`🔌 Provider: ${provider}`);
  if (music) console.log(`🎵 Music: enabled`);
  console.log(`📋 Scenes: ${prompts.length}\n`);

  // Prepare output directory
  const outputDir = path.join(
    PROJECT_ROOT,
    "public",
    "videos",
    compositionId,
    "ai-assets"
  );

  if (!dryRun) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Initialize provider
  let fal;
  if (!dryRun && (provider === "fal" || provider === "auto")) {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
  }

  const results = [];

  // Determine model
  let model;
  if (options.model) {
    model = options.model;
  } else if (provider === "kie") {
    model = type === "video" ? KIE_VIDEO_MODEL : KIE_IMAGE_MODEL;
  } else {
    model = type === "video" ? FAL_VIDEO_MODEL : FAL_IMAGE_MODEL;
  }

  // Generate visual assets
  for (const item of prompts) {
    console.log(`\n🔧 Scene: ${item.sceneId}`);
    console.log(`   Prompt: ${item.prompt.substring(0, 100)}...`);

    if (dryRun) {
      console.log(`   [DRY RUN] Would generate ${type} with ${provider} model: ${model}`);
      results.push({ sceneId: item.sceneId, status: "dry-run" });
      continue;
    }

    try {
      let result;
      if (provider === "kie") {
        result = await generateWithKie(item, type, model, outputDir);
      } else {
        result = await generateWithFal(fal, item, type, model, outputDir);
      }

      if (result) {
        console.log(`   ✅ Saved: ${result.file}`);
        results.push(result);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({ sceneId: item.sceneId, status: "error", error: error.message });
    }
  }

  // Generate music if requested
  if (music) {
    const musicResult = await generateMusic(narration, compositionId, outputDir, dryRun);
    results.push(musicResult);
  }

  // Save manifest
  const manifestPath = path.join(outputDir, "manifest.json");
  const manifest = {
    compositionId,
    generatedAt: new Date().toISOString(),
    provider,
    model,
    type,
    music,
    assets: results,
  };

  if (!dryRun) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n📄 Manifest saved: ${manifestPath}`);
  }

  console.log(`\n✨ Done! ${results.filter((r) => r.status === "success").length}/${results.length} assets generated\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
