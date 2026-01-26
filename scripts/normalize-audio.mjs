#!/usr/bin/env node

/**
 * LUFS Normalization Script
 *
 * Normalizes audio files to a target loudness level using ffmpeg.
 * Uses EBU R128 standard for loudness measurement.
 *
 * Usage:
 *   node scripts/normalize-audio.mjs --input <file> [options]
 *
 * Options:
 *   --input, -i <file>    Input audio file
 *   --output, -o <file>   Output file (default: input_normalized.mp3)
 *   --target, -t <lufs>   Target loudness in LUFS (default: -14)
 *   --format <ext>        Output format (mp3, wav, aac) (default: same as input)
 *   --measure             Only measure loudness, don't normalize
 *   --batch <dir>         Batch process all audio files in directory
 *   --dry-run             Show commands without executing
 *   --help                Show help
 *
 * Examples:
 *   node scripts/normalize-audio.mjs -i audio.mp3 -t -14
 *   node scripts/normalize-audio.mjs -i narration.wav -o normalized.mp3 -t -16
 *   node scripts/normalize-audio.mjs --batch public/videos/MyVideo/audio/
 *   node scripts/normalize-audio.mjs -i audio.mp3 --measure
 *
 * Target Loudness Guidelines:
 *   -14 LUFS: YouTube, Spotify, general streaming
 *   -16 LUFS: Apple Podcasts, background music
 *   -23 LUFS: Broadcast television (EBU R128)
 *   -24 LUFS: Broadcast (ATSC A/85)
 */

import { execSync, exec } from "child_process";
import { existsSync, readdirSync, mkdirSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default target loudness (YouTube recommendation)
const DEFAULT_TARGET_LUFS = -14;

// Supported audio formats
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".aac", ".m4a", ".ogg", ".flac"];

/**
 * Check if ffmpeg is available
 */
function checkFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Measure loudness of an audio file using ffmpeg loudnorm filter
 * Returns LUFS values: integrated, true peak, LRA
 */
async function measureLoudness(inputFile) {
  const cmd = `ffmpeg -i "${inputFile}" -af loudnorm=print_format=json -f null - 2>&1`;

  try {
    const { stdout, stderr } = await execAsync(cmd);
    const output = stdout + stderr;

    // Parse the JSON output from loudnorm
    const jsonMatch = output.match(
      /\{[\s\S]*"input_i"[\s\S]*"input_tp"[\s\S]*\}/
    );

    if (!jsonMatch) {
      throw new Error("Could not parse loudness data from ffmpeg output");
    }

    const data = JSON.parse(jsonMatch[0]);

    return {
      integratedLoudness: parseFloat(data.input_i),
      truePeak: parseFloat(data.input_tp),
      lra: parseFloat(data.input_lra),
      threshold: parseFloat(data.input_thresh),
    };
  } catch (error) {
    throw new Error(`Failed to measure loudness: ${error.message}`);
  }
}

/**
 * Normalize audio to target loudness using two-pass loudnorm
 */
async function normalizeAudio(inputFile, outputFile, targetLufs, dryRun = false) {
  console.log(`\nNormalizing: ${inputFile}`);
  console.log(`Target: ${targetLufs} LUFS`);

  // First pass: measure
  console.log("Pass 1: Measuring loudness...");
  const measurement = await measureLoudness(inputFile);
  console.log(`  Current loudness: ${measurement.integratedLoudness.toFixed(1)} LUFS`);
  console.log(`  True peak: ${measurement.truePeak.toFixed(1)} dBTP`);
  console.log(`  LRA: ${measurement.lra.toFixed(1)} LU`);

  // Calculate gain needed
  const gainNeeded = targetLufs - measurement.integratedLoudness;
  console.log(`  Gain adjustment: ${gainNeeded > 0 ? "+" : ""}${gainNeeded.toFixed(1)} dB`);

  // Second pass: normalize
  console.log("Pass 2: Applying normalization...");

  // Build the loudnorm filter with measured values for accurate normalization
  const loudnormFilter = [
    `loudnorm=I=${targetLufs}`,
    `TP=-1.5`, // True peak ceiling
    `LRA=11`, // Target loudness range
    `measured_I=${measurement.integratedLoudness}`,
    `measured_TP=${measurement.truePeak}`,
    `measured_LRA=${measurement.lra}`,
    `measured_thresh=${measurement.threshold}`,
    `linear=true`, // Linear mode for higher quality
    `print_format=summary`,
  ].join(":");

  // Determine output codec based on extension
  const ext = extname(outputFile).toLowerCase();
  let codecArgs = "";
  switch (ext) {
    case ".mp3":
      codecArgs = "-codec:a libmp3lame -b:a 192k";
      break;
    case ".aac":
    case ".m4a":
      codecArgs = "-codec:a aac -b:a 192k";
      break;
    case ".wav":
      codecArgs = "-codec:a pcm_s16le";
      break;
    case ".flac":
      codecArgs = "-codec:a flac";
      break;
    case ".ogg":
      codecArgs = "-codec:a libvorbis -q:a 6";
      break;
    default:
      codecArgs = "-codec:a libmp3lame -b:a 192k";
  }

  const cmd = `ffmpeg -y -i "${inputFile}" -af "${loudnormFilter}" ${codecArgs} "${outputFile}"`;

  if (dryRun) {
    console.log("\nDry run - command:");
    console.log(cmd);
    return;
  }

  try {
    await execAsync(cmd);
    console.log(`\n✅ Normalized audio saved to: ${outputFile}`);

    // Verify result
    console.log("\nVerifying output...");
    const verifyMeasurement = await measureLoudness(outputFile);
    console.log(
      `  Output loudness: ${verifyMeasurement.integratedLoudness.toFixed(1)} LUFS`
    );
    console.log(`  Output true peak: ${verifyMeasurement.truePeak.toFixed(1)} dBTP`);
  } catch (error) {
    throw new Error(`Normalization failed: ${error.message}`);
  }
}

/**
 * Batch process all audio files in a directory
 */
async function batchNormalize(directory, targetLufs, dryRun = false) {
  if (!existsSync(directory)) {
    throw new Error(`Directory not found: ${directory}`);
  }

  const files = readdirSync(directory).filter((f) =>
    AUDIO_EXTENSIONS.includes(extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No audio files found in directory");
    return;
  }

  console.log(`Found ${files.length} audio file(s) to process\n`);

  // Create normalized output directory
  const outputDir = join(directory, "normalized");
  if (!dryRun && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const file of files) {
    const inputPath = join(directory, file);
    const outputPath = join(outputDir, file);

    try {
      await normalizeAudio(inputPath, outputPath, targetLufs, dryRun);
    } catch (error) {
      console.error(`❌ Failed to process ${file}: ${error.message}`);
    }
  }

  console.log(`\n✅ Batch processing complete. Output directory: ${outputDir}`);
}

function printHelp() {
  console.log(`
LUFS Normalization Script

Normalizes audio files to a target loudness level using ffmpeg.

Usage:
  node scripts/normalize-audio.mjs --input <file> [options]

Options:
  --input, -i <file>    Input audio file
  --output, -o <file>   Output file (default: input_normalized.ext)
  --target, -t <lufs>   Target loudness in LUFS (default: -14)
  --format <ext>        Output format (mp3, wav, aac)
  --measure             Only measure loudness, don't normalize
  --batch <dir>         Batch process all audio files in directory
  --dry-run             Show commands without executing
  --help                Show this help

Target Loudness Guidelines:
  -14 LUFS  YouTube, Spotify, general streaming
  -16 LUFS  Apple Podcasts, background music
  -23 LUFS  Broadcast television (EBU R128)
  -24 LUFS  Broadcast (ATSC A/85)

Examples:
  node scripts/normalize-audio.mjs -i audio.mp3 -t -14
  node scripts/normalize-audio.mjs -i narration.wav -o normalized.mp3
  node scripts/normalize-audio.mjs --batch public/videos/MyVideo/audio/
  node scripts/normalize-audio.mjs -i audio.mp3 --measure
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  // Check ffmpeg
  if (!checkFfmpeg()) {
    console.error("Error: ffmpeg is not installed or not in PATH");
    console.error("Please install ffmpeg: https://ffmpeg.org/download.html");
    process.exit(1);
  }

  // Parse arguments
  const getArg = (flags) => {
    for (const flag of flags) {
      const idx = args.indexOf(flag);
      if (idx !== -1 && args[idx + 1]) {
        return args[idx + 1];
      }
    }
    return null;
  };

  const inputFile = getArg(["--input", "-i"]);
  const outputFile = getArg(["--output", "-o"]);
  const targetLufs = parseFloat(getArg(["--target", "-t"]) || DEFAULT_TARGET_LUFS);
  const format = getArg(["--format"]);
  const batchDir = getArg(["--batch"]);
  const measureOnly = args.includes("--measure");
  const dryRun = args.includes("--dry-run");

  // Batch processing
  if (batchDir) {
    await batchNormalize(batchDir, targetLufs, dryRun);
    return;
  }

  // Single file processing
  if (!inputFile) {
    console.error("Error: Input file is required (--input or -i)");
    process.exit(1);
  }

  if (!existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  // Measure only
  if (measureOnly) {
    console.log(`\nMeasuring: ${inputFile}\n`);
    const measurement = await measureLoudness(inputFile);
    console.log(`Integrated Loudness: ${measurement.integratedLoudness.toFixed(1)} LUFS`);
    console.log(`True Peak: ${measurement.truePeak.toFixed(1)} dBTP`);
    console.log(`Loudness Range (LRA): ${measurement.lra.toFixed(1)} LU`);
    return;
  }

  // Determine output file
  let finalOutputFile = outputFile;
  if (!finalOutputFile) {
    const inputExt = extname(inputFile);
    const inputBase = basename(inputFile, inputExt);
    const inputDir = dirname(inputFile);
    const outputExt = format ? `.${format}` : inputExt;
    finalOutputFile = join(inputDir, `${inputBase}_normalized${outputExt}`);
  }

  await normalizeAudio(inputFile, finalOutputFile, targetLufs, dryRun);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
