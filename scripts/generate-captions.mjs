/**
 * Caption/SRT Generation Script
 *
 * Generates SRT/VTT subtitle files from narration.json + audio-metadata.json
 *
 * Usage:
 *   node scripts/generate-captions.mjs -f projects/TwoMinuteRule/narration.json
 *   node scripts/generate-captions.mjs -f projects/TwoMinuteRule/narration.json --format vtt
 *   node scripts/generate-captions.mjs -f projects/TwoMinuteRule/narration.json --words-per-caption 8
 *
 * Output:
 *   - projects/{id}/captions/video.srt
 *   - projects/{id}/captions/video.vtt
 *   - projects/{id}/captions/timing-data.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI argument parsing
const args = process.argv.slice(2);
const fileArgIndex = args.findIndex((arg) => arg === "--file" || arg === "-f");
const narrationFile =
  fileArgIndex !== -1 && args[fileArgIndex + 1] ? args[fileArgIndex + 1] : null;

const formatArgIndex = args.findIndex((arg) => arg === "--format");
const outputFormat = formatArgIndex !== -1 && args[formatArgIndex + 1]
  ? args[formatArgIndex + 1]
  : "both"; // srt, vtt, or both

const wordsArgIndex = args.findIndex((arg) => arg === "--words-per-caption" || arg === "-w");
const wordsPerCaption = wordsArgIndex !== -1 && args[wordsArgIndex + 1]
  ? parseInt(args[wordsArgIndex + 1], 10)
  : 7;

const fps = 60; // Default FPS for frame calculations

if (!narrationFile) {
  console.error("Usage: node scripts/generate-captions.mjs -f <narration.json>");
  console.error("Options:");
  console.error("  -f, --file              Path to narration.json (required)");
  console.error("  --format                Output format: srt, vtt, or both (default: both)");
  console.error("  -w, --words-per-caption Max words per caption line (default: 7)");
  process.exit(1);
}

// Resolve paths
const narrationPath = path.isAbsolute(narrationFile)
  ? narrationFile
  : path.join(projectRoot, narrationFile);

if (!fs.existsSync(narrationPath)) {
  console.error(`Error: File not found: ${narrationPath}`);
  process.exit(1);
}

const narration = JSON.parse(fs.readFileSync(narrationPath, "utf-8"));
const compositionId = narration.metadata?.compositionId;

if (!compositionId) {
  console.error("Error: narration.json must have metadata.compositionId");
  process.exit(1);
}

// Try to find audio metadata for accurate timing
const audioMetadataPath = path.join(
  projectRoot,
  "public/videos",
  compositionId,
  "audio/audio-metadata.json"
);
let audioMetadata = null;
if (fs.existsSync(audioMetadataPath)) {
  audioMetadata = JSON.parse(fs.readFileSync(audioMetadataPath, "utf-8"));
  console.log(`📊 Using audio metadata for accurate timing`);
} else {
  console.log(`⚠️  No audio metadata found, using estimated timing`);
}

// Output directory
const captionsDir = path.join(projectRoot, "projects", compositionId, "captions");
if (!fs.existsSync(captionsDir)) {
  fs.mkdirSync(captionsDir, { recursive: true });
}

// ============================================
// Timing Calculation
// ============================================

/**
 * Estimate word-level timing based on scene duration
 * Returns array of { word, startTime, endTime } in seconds
 */
function estimateWordTiming(text, startTime, duration) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // Calculate time per word based on speaking rate
  // Average speaking rate: ~150 words per minute = 2.5 words per second
  // Add pauses for punctuation
  const baseTimePerWord = duration / words.length;

  const wordTimings = [];
  let currentTime = startTime;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let wordDuration = baseTimePerWord;

    // Add slight pause after punctuation
    if (/[.!?]$/.test(word)) {
      wordDuration *= 1.3;
    } else if (/[,;:]$/.test(word)) {
      wordDuration *= 1.15;
    }

    const endTime = Math.min(currentTime + wordDuration, startTime + duration);

    wordTimings.push({
      word,
      startTime: currentTime,
      endTime,
      index: i,
    });

    currentTime = endTime;
  }

  return wordTimings;
}

/**
 * Group words into caption segments
 */
function groupIntoSegments(wordTimings, maxWords = 7) {
  const segments = [];
  let currentSegment = [];
  let segmentStart = 0;

  for (const wordTiming of wordTimings) {
    if (currentSegment.length === 0) {
      segmentStart = wordTiming.startTime;
    }

    currentSegment.push(wordTiming);

    // Check if we should end this segment
    const shouldBreak =
      currentSegment.length >= maxWords ||
      /[.!?]$/.test(wordTiming.word);

    if (shouldBreak && currentSegment.length > 0) {
      segments.push({
        text: currentSegment.map((w) => w.word).join(" "),
        startTime: segmentStart,
        endTime: wordTiming.endTime,
        words: currentSegment,
      });
      currentSegment = [];
    }
  }

  // Add remaining words
  if (currentSegment.length > 0) {
    segments.push({
      text: currentSegment.map((w) => w.word).join(" "),
      startTime: segmentStart,
      endTime: currentSegment[currentSegment.length - 1].endTime,
      words: currentSegment,
    });
  }

  return segments;
}

// ============================================
// Format Functions
// ============================================

/**
 * Format time for SRT (HH:MM:SS,mmm)
 */
function formatSrtTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

/**
 * Format time for VTT (HH:MM:SS.mmm)
 */
function formatVttTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

/**
 * Generate SRT content
 */
function generateSrt(segments) {
  let srt = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    srt += `${i + 1}\n`;
    srt += `${formatSrtTime(segment.startTime)} --> ${formatSrtTime(segment.endTime)}\n`;
    srt += `${segment.text}\n\n`;
  }
  return srt.trim();
}

/**
 * Generate VTT content
 */
function generateVtt(segments) {
  let vtt = "WEBVTT\n\n";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    vtt += `${i + 1}\n`;
    vtt += `${formatVttTime(segment.startTime)} --> ${formatVttTime(segment.endTime)}\n`;
    vtt += `${segment.text}\n\n`;
  }
  return vtt.trim();
}

// ============================================
// Main Generation
// ============================================

function generateCaptions() {
  const scenes = narration.scenes || [];
  let currentTime = 0;
  const allSegments = [];
  const timingData = {
    compositionId,
    generatedAt: new Date().toISOString(),
    fps,
    scenes: [],
  };

  console.log(`\n📝 Generating captions for: ${compositionId}`);
  console.log(`   Scenes: ${scenes.length}`);
  console.log(`   Max words per caption: ${wordsPerCaption}\n`);

  for (const scene of scenes) {
    // Get scene duration from audio metadata if available
    let duration = scene.duration || 5;
    if (audioMetadata) {
      const audioScene = audioMetadata.scenes.find((s) => s.id === scene.id);
      if (audioScene && audioScene.durationSeconds) {
        duration = audioScene.durationSeconds;
      }
    }

    // Calculate word timings
    const wordTimings = estimateWordTiming(scene.text, currentTime, duration);
    const segments = groupIntoSegments(wordTimings, wordsPerCaption);

    // Add to all segments
    allSegments.push(...segments);

    // Store timing data
    timingData.scenes.push({
      id: scene.id,
      startTime: currentTime,
      endTime: currentTime + duration,
      duration,
      wordCount: scene.text.split(/\s+/).length,
      segmentCount: segments.length,
      segments: segments.map((s) => ({
        text: s.text,
        startTime: s.startTime,
        endTime: s.endTime,
        startFrame: Math.round(s.startTime * fps),
        endFrame: Math.round(s.endTime * fps),
      })),
    });

    currentTime += duration;
    console.log(`   ✓ ${scene.id}: ${segments.length} caption segments`);
  }

  // Generate output files
  const outputs = [];

  if (outputFormat === "srt" || outputFormat === "both") {
    const srtContent = generateSrt(allSegments);
    const srtPath = path.join(captionsDir, "video.srt");
    fs.writeFileSync(srtPath, srtContent);
    outputs.push(srtPath);
    console.log(`\n✅ SRT: ${srtPath}`);
  }

  if (outputFormat === "vtt" || outputFormat === "both") {
    const vttContent = generateVtt(allSegments);
    const vttPath = path.join(captionsDir, "video.vtt");
    fs.writeFileSync(vttPath, vttContent);
    outputs.push(vttPath);
    console.log(`✅ VTT: ${vttPath}`);
  }

  // Save timing data for Remotion integration
  const timingPath = path.join(captionsDir, "timing-data.json");
  fs.writeFileSync(timingPath, JSON.stringify(timingData, null, 2));
  outputs.push(timingPath);
  console.log(`✅ Timing: ${timingPath}`);

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Total segments: ${allSegments.length}`);
  console.log(`   Total duration: ${Math.round(currentTime)}s`);
  console.log(`   Output files: ${outputs.length}`);

  return {
    compositionId,
    segments: allSegments.length,
    duration: currentTime,
    outputs,
  };
}

generateCaptions();
