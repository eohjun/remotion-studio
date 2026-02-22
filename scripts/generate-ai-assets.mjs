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
const KIE_VIDEO_MODEL = "veo3_fast";
const KIE_MUSIC_MODEL = "V4";

const KIE_BASE_URL = "https://api.kie.ai/api";
const KIE_POLL_INTERVAL_MS = 5000;
const KIE_MAX_POLL_ATTEMPTS = 120;

// Kie.ai API endpoints (per docs.kie.ai)
const KIE_ENDPOINTS = {
  image: {
    submit: "/v1/gpt4o-image/generate",
    poll: "/v1/gpt4o-image/record-info",
  },
  video: {
    submit: "/v1/veo/generate",
    poll: "/v1/veo/record-info",
  },
  music: {
    submit: "/v1/generate",
    poll: "/v1/generate/record-info",
  },
};

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
  if (!data.data?.taskId) {
    throw new Error(`No taskId returned from Kie.ai: ${JSON.stringify(data)}`);
  }
  return data.data.taskId;
}

/**
 * Poll Kie.ai task status. Each API type has different poll endpoint and completion logic.
 * @param {string} pollEndpoint - e.g. KIE_ENDPOINTS.music.poll
 * @param {string} taskId
 * @param {"image"|"video"|"music"} apiType - determines completion check
 */
async function kiePollResult(pollEndpoint, taskId, apiType) {
  for (let attempt = 0; attempt < KIE_MAX_POLL_ATTEMPTS; attempt++) {
    const url = `${KIE_BASE_URL}${pollEndpoint}?taskId=${taskId}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.KIE_KEY}` },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Kie.ai poll error (${response.status}): ${text}`);
    }

    const result = await response.json();
    const data = result.data;

    if (apiType === "music") {
      // Music: status field with string enum
      const status = data?.status;
      if (status === "SUCCESS" || status === "FIRST_SUCCESS") return result;
      if (status === "CREATE_TASK_FAILED" || status === "GENERATE_AUDIO_FAILED" || status === "SENSITIVE_WORD_ERROR") {
        throw new Error(`Kie.ai music task failed: ${status} - ${data?.errorMessage || "Unknown"}`);
      }
    } else {
      // Image & Video: successFlag integer
      const flag = data?.successFlag;
      if (flag === 1) return result;
      if (flag === 2 || flag === 3) {
        throw new Error(`Kie.ai ${apiType} task failed: ${data?.errorMessage || data?.errorCode || "Unknown"}`);
      }
    }

    if (attempt % 6 === 5) {
      console.log(`   ⏳ Polling... (attempt ${attempt + 1}/${KIE_MAX_POLL_ATTEMPTS})`);
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
    const taskId = await kieSubmitTask(KIE_ENDPOINTS.image.submit, {
      prompt: item.prompt,
      size: "3:2", // 1920x1080 equivalent
    });

    const result = await kiePollResult(KIE_ENDPOINTS.image.poll, taskId, "image");
    const urls = result.data?.response?.resultUrls;
    const imageUrl = urls?.[0];
    if (imageUrl) {
      const filename = `${item.sceneId}-bg.jpg`;
      await downloadFile(imageUrl, path.join(outputDir, filename));
      return { sceneId: item.sceneId, status: "success", file: filename };
    }
  } else if (type === "video") {
    const taskId = await kieSubmitTask(KIE_ENDPOINTS.video.submit, {
      prompt: item.prompt,
      model: model || KIE_VIDEO_MODEL,
      aspect_ratio: "16:9",
      generationType: "TEXT_2_VIDEO",
    });

    const result = await kiePollResult(KIE_ENDPOINTS.video.poll, taskId, "video");
    const urls = result.data?.response?.resultUrls || result.data?.response?.originUrls;
    const videoUrl = urls?.[0];
    if (videoUrl) {
      const filename = `${item.sceneId}-motion.mp4`;
      await downloadFile(videoUrl, path.join(outputDir, filename));
      return { sceneId: item.sceneId, status: "success", file: filename };
    }
  }
  return null;
}

async function generateMusic(narration, compositionId, outputDir, dryRun) {
  const meta = narration.metadata || {};
  const musicPrompt =
    meta.music_description ||
    meta.music_style ||
    narration.music_description ||
    narration.music_style ||
    `Cinematic ambient background music for: ${meta.title || compositionId}`;

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
    const taskId = await kieSubmitTask(KIE_ENDPOINTS.music.submit, {
      model: KIE_MUSIC_MODEL,
      prompt: musicPrompt,
      customMode: false,
      instrumental: true,
      callBackUrl: "https://localhost/callback",
    });

    console.log(`   🔄 Task submitted: ${taskId}`);
    const result = await kiePollResult(KIE_ENDPOINTS.music.poll, taskId, "music");
    const sunoData = result.data?.response?.sunoData;
    const audioUrl = sunoData?.[0]?.audioUrl || sunoData?.[0]?.streamAudioUrl;
    if (audioUrl) {
      const filename = "bgm.mp3";
      await downloadFile(audioUrl, path.join(outputDir, filename));
      console.log(`   ✅ Saved: ${filename} (${sunoData[0].duration || "?"}s)`);
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

  // Music-only mode: --music without --type video or --scene means ONLY generate music
  const musicOnly = music && type === "img" && !scene;

  // Check API keys
  if (!dryRun) {
    if (!musicOnly && provider === "fal" && !process.env.FAL_KEY) {
      console.error("Error: FAL_KEY environment variable is required for fal provider");
      process.exit(1);
    }
    if (!musicOnly && provider === "kie" && !process.env.KIE_KEY) {
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
  if (musicOnly) {
    console.log(`🎵 Mode: music-only (Kie.ai Suno)`);
  } else {
    console.log(`🎨 Type: ${type}`);
    console.log(`🔌 Provider: ${provider}`);
    if (music) console.log(`🎵 Music: enabled (after visual assets)`);
    console.log(`📋 Scenes: ${prompts.length}`);
  }
  console.log("");

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
  for (const item of musicOnly ? [] : prompts) {
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
