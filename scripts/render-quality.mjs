#!/usr/bin/env node

/**
 * Render Quality Script
 *
 * Renders Remotion compositions with quality presets.
 *
 * Usage:
 *   node scripts/render-quality.mjs <compositionId> [options]
 *
 * Options:
 *   --preset <name>     Quality preset (draft, standard, high, premium, 4k-premium, cinematic, vintage, clean, master, shorts)
 *   --output <path>     Output file path (default: projects/<compositionId>/output/)
 *   --list              List available presets
 *   --dry-run           Show command without executing
 *   --help              Show help
 *
 * Examples:
 *   node scripts/render-quality.mjs MyVideo --preset premium
 *   node scripts/render-quality.mjs MyVideo --preset master --output ./masters/
 *   node scripts/render-quality.mjs --list
 */

import { execSync, spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Quality preset configurations (mirror of qualityPresets.ts)
const QUALITY_PRESETS = {
  draft: {
    name: "Draft",
    render: {
      width: 1280,
      height: 720,
      crf: 28,
      codec: "h264",
    },
    description: "Fast preview with minimal effects",
  },
  standard: {
    name: "Standard",
    render: {
      width: 1920,
      height: 1080,
      crf: 18,
      codec: "h264",
      colorSpace: "bt709",
    },
    description: "Balanced quality and render time",
  },
  high: {
    name: "High Quality",
    render: {
      width: 1920,
      height: 1080,
      crf: 15,
      codec: "h264",
      colorSpace: "bt709",
    },
    description: "High quality for YouTube upload",
  },
  premium: {
    name: "Premium",
    render: {
      width: 1920,
      height: 1080,
      crf: 12,
      codec: "h264",
      colorSpace: "bt709",
      pixelFormat: "yuv420p10le",
    },
    description: "Maximum quality with 10-bit color",
  },
  "4k-premium": {
    name: "4K Premium",
    render: {
      width: 3840,
      height: 2160,
      crf: 15,
      codec: "h265",
      colorSpace: "bt709",
      pixelFormat: "yuv420p10le",
    },
    description: "4K with full effects suite",
  },
  cinematic: {
    name: "Cinematic",
    render: {
      width: 1920,
      height: 1080,
      crf: 15,
      codec: "h264",
      colorSpace: "bt709",
    },
    description: "Film-like aesthetic with strong color grade",
  },
  vintage: {
    name: "Vintage",
    render: {
      width: 1920,
      height: 1080,
      crf: 18,
      codec: "h264",
      colorSpace: "bt709",
    },
    description: "Retro film look with warm tones",
  },
  clean: {
    name: "Clean",
    render: {
      width: 1920,
      height: 1080,
      crf: 15,
      codec: "h264",
      colorSpace: "bt709",
    },
    description: "Minimal effects for clean look",
  },
  master: {
    name: "Master",
    render: {
      width: 1920,
      height: 1080,
      codec: "prores",
      proresProfile: "hq",
    },
    description: "ProRes master for post-production",
  },
  shorts: {
    name: "Shorts",
    render: {
      width: 1080,
      height: 1920,
      crf: 18,
      codec: "h264",
      colorSpace: "bt709",
    },
    description: "Optimized for YouTube Shorts",
  },
};

function printHelp() {
  console.log(`
Render Quality Script - Render with quality presets

Usage:
  node scripts/render-quality.mjs <compositionId> [options]

Options:
  --preset <name>     Quality preset name (default: standard)
  --output <path>     Output directory or file path
  --list              List available presets
  --dry-run           Show command without executing
  --help              Show this help

Available Presets:
${Object.entries(QUALITY_PRESETS)
  .map(([key, preset]) => `  ${key.padEnd(15)} ${preset.description}`)
  .join("\n")}

Examples:
  node scripts/render-quality.mjs MyVideo --preset premium
  node scripts/render-quality.mjs MyVideo --preset master --output ./masters/
  node scripts/render-quality.mjs --list
`);
}

function printPresets() {
  console.log("\nAvailable Quality Presets:\n");
  console.log(
    "Name".padEnd(15) +
      "Resolution".padEnd(12) +
      "Codec".padEnd(10) +
      "Description"
  );
  console.log("-".repeat(70));

  for (const [key, preset] of Object.entries(QUALITY_PRESETS)) {
    const resolution = `${preset.render.width}x${preset.render.height}`;
    const codec = preset.render.codec;
    console.log(
      key.padEnd(15) +
        resolution.padEnd(12) +
        codec.padEnd(10) +
        preset.description
    );
  }
  console.log();
}

function buildRenderCommand(compositionId, preset, outputPath) {
  const renderConfig = preset.render;
  const ext = renderConfig.codec === "prores" ? "mov" : "mp4";

  // Determine output path
  let finalOutputPath = outputPath;
  if (!finalOutputPath) {
    const outputDir = join(projectRoot, "projects", compositionId, "output");
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    finalOutputPath = join(outputDir, `video.${ext}`);
  } else if (!finalOutputPath.endsWith(`.${ext}`)) {
    // If output is a directory, append filename
    if (!existsSync(finalOutputPath)) {
      mkdirSync(finalOutputPath, { recursive: true });
    }
    finalOutputPath = join(finalOutputPath, `${compositionId}.${ext}`);
  }

  const args = [
    "remotion",
    "render",
    compositionId,
    finalOutputPath,
    `--width=${renderConfig.width}`,
    `--height=${renderConfig.height}`,
  ];

  // Add CRF for non-ProRes codecs
  if (renderConfig.codec !== "prores" && renderConfig.crf) {
    args.push(`--crf=${renderConfig.crf}`);
  }

  // Add codec
  if (renderConfig.codec && renderConfig.codec !== "h264") {
    args.push(`--codec=${renderConfig.codec}`);
  }

  // Add ProRes profile
  if (renderConfig.proresProfile) {
    args.push(`--prores-profile=${renderConfig.proresProfile}`);
  }

  // Add color space
  if (renderConfig.colorSpace) {
    args.push(`--color-space=${renderConfig.colorSpace}`);
  }

  // Add pixel format
  if (renderConfig.pixelFormat) {
    args.push(`--pixel-format=${renderConfig.pixelFormat}`);
  }

  return { command: "npx", args, outputPath: finalOutputPath };
}

async function main() {
  const args = process.argv.slice(2);

  // Handle flags
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  if (args.includes("--list") || args.includes("-l")) {
    printPresets();
    process.exit(0);
  }

  // Parse arguments
  const compositionId = args.find((arg) => !arg.startsWith("--"));
  if (!compositionId) {
    console.error("Error: Composition ID is required");
    printHelp();
    process.exit(1);
  }

  // Get preset
  const presetIndex = args.indexOf("--preset");
  const presetName =
    presetIndex !== -1 ? args[presetIndex + 1] : "standard";
  const preset = QUALITY_PRESETS[presetName];

  if (!preset) {
    console.error(`Error: Unknown preset "${presetName}"`);
    console.log("Available presets:", Object.keys(QUALITY_PRESETS).join(", "));
    process.exit(1);
  }

  // Get output path
  const outputIndex = args.indexOf("--output");
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  // Check for dry run
  const dryRun = args.includes("--dry-run");

  // Build command
  const { command, args: cmdArgs, outputPath: finalOutput } = buildRenderCommand(
    compositionId,
    preset,
    outputPath
  );

  console.log(`\n🎬 Rendering "${compositionId}" with ${preset.name} preset\n`);
  console.log(`   Resolution: ${preset.render.width}x${preset.render.height}`);
  console.log(`   Codec: ${preset.render.codec}`);
  if (preset.render.crf) console.log(`   CRF: ${preset.render.crf}`);
  if (preset.render.colorSpace)
    console.log(`   Color Space: ${preset.render.colorSpace}`);
  console.log(`   Output: ${finalOutput}\n`);

  const fullCommand = `${command} ${cmdArgs.join(" ")}`;
  console.log(`Command: ${fullCommand}\n`);

  if (dryRun) {
    console.log("Dry run - command not executed");
    process.exit(0);
  }

  // Execute render
  console.log("Starting render...\n");

  const child = spawn(command, cmdArgs, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log(`\n✅ Render complete: ${finalOutput}`);
    } else {
      console.error(`\n❌ Render failed with code ${code}`);
      process.exit(code);
    }
  });

  child.on("error", (err) => {
    console.error("Failed to start render:", err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
