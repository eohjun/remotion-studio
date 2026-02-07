#!/usr/bin/env node

/**
 * generate-ai-assets.mjs - Generate AI visual assets for a composition
 *
 * Reads narration.json scene descriptions and generates images/videos
 * via fal.ai API, saving them to public/videos/{compositionId}/ai-assets/
 *
 * Usage:
 *   node scripts/generate-ai-assets.mjs <compositionId> [options]
 *
 * Options:
 *   --scene <id>       Generate for specific scene only
 *   --type <img|video>  Asset type (default: img)
 *   --model <model>     fal.ai model ID
 *   --dry-run           Show prompts without generating
 *
 * Environment:
 *   FAL_KEY             fal.ai API key (required)
 *
 * Example:
 *   node scripts/generate-ai-assets.mjs ZeigarnikEffect
 *   node scripts/generate-ai-assets.mjs ZeigarnikEffect --scene intro --type video
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

const DEFAULT_IMAGE_MODEL = "fal-ai/flux/schnell";
const DEFAULT_VIDEO_MODEL = "fal-ai/minimax-video/image-to-video";

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
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--scene" && args[i + 1]) options.scene = args[++i];
    if (args[i] === "--type" && args[i + 1]) options.type = args[++i];
    if (args[i] === "--model" && args[i + 1]) options.model = args[++i];
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
    // Use scene description, visual_description, or title as prompt basis
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
// Main
// ============================================================================

async function main() {
  const options = parseArgs();
  const { compositionId, scene, type, dryRun } = options;

  // Check API key
  if (!process.env.FAL_KEY && !dryRun) {
    console.error("Error: FAL_KEY environment variable is required");
    console.error("Set it with: export FAL_KEY=your-key-here");
    process.exit(1);
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

  // Dynamic import fal.ai client only when needed
  let fal;
  if (!dryRun) {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
  }

  const results = [];
  const model = options.model || (type === "video" ? DEFAULT_VIDEO_MODEL : DEFAULT_IMAGE_MODEL);

  for (const item of prompts) {
    console.log(`\n🔧 Scene: ${item.sceneId}`);
    console.log(`   Prompt: ${item.prompt.substring(0, 100)}...`);

    if (dryRun) {
      console.log(`   [DRY RUN] Would generate ${type} with model: ${model}`);
      results.push({ sceneId: item.sceneId, status: "dry-run" });
      continue;
    }

    try {
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
          const outputPath = path.join(outputDir, filename);
          await downloadFile(imageUrl, outputPath);
          console.log(`   ✅ Saved: ${filename}`);
          results.push({ sceneId: item.sceneId, status: "success", file: filename });
        }
      } else if (type === "video") {
        const result = await fal.subscribe(model, {
          input: {
            prompt: item.prompt,
          },
        });

        const videoUrl = result.data?.video?.url;
        if (videoUrl) {
          const filename = `${item.sceneId}-motion.mp4`;
          const outputPath = path.join(outputDir, filename);
          await downloadFile(videoUrl, outputPath);
          console.log(`   ✅ Saved: ${filename}`);
          results.push({ sceneId: item.sceneId, status: "success", file: filename });
        }
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({ sceneId: item.sceneId, status: "error", error: error.message });
    }
  }

  // Save manifest
  const manifestPath = path.join(outputDir, "manifest.json");
  const manifest = {
    compositionId,
    generatedAt: new Date().toISOString(),
    model,
    type,
    assets: results,
  };

  if (!dryRun) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n📄 Manifest saved: ${manifestPath}`);
  }

  console.log(`\n✨ Done! ${results.filter((r) => r.status === "success").length}/${prompts.length} assets generated\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
