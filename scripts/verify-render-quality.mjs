#!/usr/bin/env node

/**
 * Render Quality Verification Script
 *
 * Verifies the quality of rendered videos by checking:
 * - File size and codec settings
 * - Video metadata (resolution, fps, bitrate)
 * - Audio quality (sample rate, channels, codec)
 * - Duration accuracy
 *
 * Usage:
 *   node scripts/verify-render-quality.mjs <video-file> [options]
 *
 * Options:
 *   --preset <name>   Quality preset to validate against (draft, standard, premium, 4k)
 *   --json            Output results as JSON
 *   --strict          Fail on any quality deviation
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { basename, extname } from "path";

// ============================================================================
// Quality Presets
// ============================================================================

const QUALITY_PRESETS = {
  draft: {
    minWidth: 1280,
    minHeight: 720,
    minFps: 24,
    maxCrf: 28,
    minBitrate: 1_000_000, // 1 Mbps
    maxBitrate: 10_000_000, // 10 Mbps
    audioSampleRate: 44100,
    audioChannels: 2,
  },
  standard: {
    minWidth: 1920,
    minHeight: 1080,
    minFps: 30,
    maxCrf: 23,
    minBitrate: 5_000_000, // 5 Mbps
    maxBitrate: 25_000_000, // 25 Mbps
    audioSampleRate: 48000,
    audioChannels: 2,
  },
  premium: {
    minWidth: 1920,
    minHeight: 1080,
    minFps: 30,
    maxCrf: 18,
    minBitrate: 10_000_000, // 10 Mbps
    maxBitrate: 50_000_000, // 50 Mbps
    audioSampleRate: 48000,
    audioChannels: 2,
  },
  "4k": {
    minWidth: 3840,
    minHeight: 2160,
    minFps: 30,
    maxCrf: 18,
    minBitrate: 25_000_000, // 25 Mbps
    maxBitrate: 100_000_000, // 100 Mbps
    audioSampleRate: 48000,
    audioChannels: 2,
  },
  "premium-4k": {
    minWidth: 3840,
    minHeight: 2160,
    minFps: 30,
    maxCrf: 15,
    minBitrate: 40_000_000, // 40 Mbps
    maxBitrate: 150_000_000, // 150 Mbps
    audioSampleRate: 48000,
    audioChannels: 2,
  },
};

// ============================================================================
// Video Metadata Extraction
// ============================================================================

/**
 * Extract video metadata using ffprobe
 */
function getVideoMetadata(filePath) {
  try {
    const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
    const output = execSync(command, { encoding: "utf-8" });
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Failed to extract metadata: ${error.message}`);
  }
}

/**
 * Parse video stream metadata
 */
function parseVideoStream(metadata) {
  const videoStream = metadata.streams.find((s) => s.codec_type === "video");

  if (!videoStream) {
    return null;
  }

  // Parse frame rate (e.g., "30/1" -> 30)
  const fpsRaw = videoStream.r_frame_rate || videoStream.avg_frame_rate;
  const fpsParts = fpsRaw.split("/");
  const fps = fpsParts.length === 2 ? parseInt(fpsParts[0]) / parseInt(fpsParts[1]) : parseFloat(fpsRaw);

  return {
    codec: videoStream.codec_name,
    codecLong: videoStream.codec_long_name,
    width: videoStream.width,
    height: videoStream.height,
    fps: Math.round(fps * 100) / 100,
    bitrate: parseInt(videoStream.bit_rate) || null,
    pixelFormat: videoStream.pix_fmt,
    colorSpace: videoStream.color_space,
    colorRange: videoStream.color_range,
    profile: videoStream.profile,
    level: videoStream.level,
  };
}

/**
 * Parse audio stream metadata
 */
function parseAudioStream(metadata) {
  const audioStream = metadata.streams.find((s) => s.codec_type === "audio");

  if (!audioStream) {
    return null;
  }

  return {
    codec: audioStream.codec_name,
    codecLong: audioStream.codec_long_name,
    sampleRate: parseInt(audioStream.sample_rate),
    channels: audioStream.channels,
    channelLayout: audioStream.channel_layout,
    bitrate: parseInt(audioStream.bit_rate) || null,
  };
}

/**
 * Parse format metadata
 */
function parseFormat(metadata) {
  const format = metadata.format;

  return {
    filename: format.filename,
    formatName: format.format_name,
    formatLong: format.format_long_name,
    duration: parseFloat(format.duration),
    size: parseInt(format.size),
    bitrate: parseInt(format.bit_rate),
    streamCount: format.nb_streams,
  };
}

// ============================================================================
// Quality Validation
// ============================================================================

/**
 * Validate video against preset
 */
function validateAgainstPreset(videoInfo, audioInfo, formatInfo, preset) {
  const issues = [];
  const warnings = [];
  const specs = QUALITY_PRESETS[preset];

  if (!specs) {
    throw new Error(`Unknown preset: ${preset}`);
  }

  // Video validation
  if (videoInfo) {
    if (videoInfo.width < specs.minWidth) {
      issues.push(`Video width ${videoInfo.width}px is below minimum ${specs.minWidth}px`);
    }
    if (videoInfo.height < specs.minHeight) {
      issues.push(`Video height ${videoInfo.height}px is below minimum ${specs.minHeight}px`);
    }
    if (videoInfo.fps < specs.minFps) {
      issues.push(`Frame rate ${videoInfo.fps}fps is below minimum ${specs.minFps}fps`);
    }

    // Check bitrate
    const bitrate = videoInfo.bitrate || formatInfo.bitrate;
    if (bitrate) {
      if (bitrate < specs.minBitrate) {
        warnings.push(
          `Bitrate ${formatBitrate(bitrate)} is below recommended minimum ${formatBitrate(specs.minBitrate)}`
        );
      }
      if (bitrate > specs.maxBitrate) {
        warnings.push(
          `Bitrate ${formatBitrate(bitrate)} exceeds recommended maximum ${formatBitrate(specs.maxBitrate)}`
        );
      }
    }

    // Check codec
    if (videoInfo.codec !== "h264" && videoInfo.codec !== "hevc" && videoInfo.codec !== "vp9") {
      warnings.push(`Uncommon video codec: ${videoInfo.codec}. Consider h264/hevc/vp9 for compatibility.`);
    }

    // Check pixel format
    if (videoInfo.pixelFormat && !videoInfo.pixelFormat.includes("yuv")) {
      warnings.push(`Pixel format ${videoInfo.pixelFormat} may have compatibility issues. yuv420p recommended.`);
    }
  } else {
    issues.push("No video stream found");
  }

  // Audio validation
  if (audioInfo) {
    if (audioInfo.sampleRate < specs.audioSampleRate) {
      warnings.push(
        `Audio sample rate ${audioInfo.sampleRate}Hz is below recommended ${specs.audioSampleRate}Hz`
      );
    }
    if (audioInfo.channels < specs.audioChannels) {
      warnings.push(`Audio has ${audioInfo.channels} channel(s), expected ${specs.audioChannels}`);
    }

    // Check codec
    if (audioInfo.codec !== "aac" && audioInfo.codec !== "mp3" && audioInfo.codec !== "opus") {
      warnings.push(`Uncommon audio codec: ${audioInfo.codec}. Consider aac for compatibility.`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
    preset,
    specs,
  };
}

// ============================================================================
// Report Generation
// ============================================================================

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format bitrate to human readable
 */
function formatBitrate(bitrate) {
  if (bitrate >= 1_000_000) {
    return `${(bitrate / 1_000_000).toFixed(2)} Mbps`;
  }
  return `${(bitrate / 1000).toFixed(2)} Kbps`;
}

/**
 * Format duration to human readable
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${mins}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

/**
 * Generate text report
 */
function generateTextReport(filePath, videoInfo, audioInfo, formatInfo, validation) {
  const lines = [];

  lines.push("═".repeat(60));
  lines.push(" RENDER QUALITY VERIFICATION REPORT");
  lines.push("═".repeat(60));
  lines.push("");

  // File info
  lines.push("📁 FILE INFORMATION");
  lines.push("─".repeat(40));
  lines.push(`  Filename:    ${basename(filePath)}`);
  lines.push(`  Format:      ${formatInfo.formatLong}`);
  lines.push(`  File Size:   ${formatBytes(formatInfo.size)}`);
  lines.push(`  Duration:    ${formatDuration(formatInfo.duration)}`);
  lines.push(`  Total Bitrate: ${formatBitrate(formatInfo.bitrate)}`);
  lines.push("");

  // Video info
  if (videoInfo) {
    lines.push("🎬 VIDEO STREAM");
    lines.push("─".repeat(40));
    lines.push(`  Codec:       ${videoInfo.codecLong || videoInfo.codec}`);
    lines.push(`  Resolution:  ${videoInfo.width}x${videoInfo.height}`);
    lines.push(`  Frame Rate:  ${videoInfo.fps} fps`);
    if (videoInfo.bitrate) {
      lines.push(`  Bitrate:     ${formatBitrate(videoInfo.bitrate)}`);
    }
    lines.push(`  Pixel Format: ${videoInfo.pixelFormat || "N/A"}`);
    if (videoInfo.profile) {
      lines.push(`  Profile:     ${videoInfo.profile} (Level ${videoInfo.level})`);
    }
    if (videoInfo.colorSpace) {
      lines.push(`  Color Space: ${videoInfo.colorSpace}`);
    }
    lines.push("");
  }

  // Audio info
  if (audioInfo) {
    lines.push("🔊 AUDIO STREAM");
    lines.push("─".repeat(40));
    lines.push(`  Codec:       ${audioInfo.codecLong || audioInfo.codec}`);
    lines.push(`  Sample Rate: ${audioInfo.sampleRate} Hz`);
    lines.push(`  Channels:    ${audioInfo.channels} (${audioInfo.channelLayout || "N/A"})`);
    if (audioInfo.bitrate) {
      lines.push(`  Bitrate:     ${formatBitrate(audioInfo.bitrate)}`);
    }
    lines.push("");
  }

  // Validation results
  if (validation) {
    lines.push("✅ QUALITY VALIDATION");
    lines.push("─".repeat(40));
    lines.push(`  Preset:      ${validation.preset}`);
    lines.push(`  Status:      ${validation.passed ? "✓ PASSED" : "✗ FAILED"}`);

    if (validation.issues.length > 0) {
      lines.push("");
      lines.push("  ❌ Issues:");
      validation.issues.forEach((issue) => {
        lines.push(`     • ${issue}`);
      });
    }

    if (validation.warnings.length > 0) {
      lines.push("");
      lines.push("  ⚠️  Warnings:");
      validation.warnings.forEach((warning) => {
        lines.push(`     • ${warning}`);
      });
    }

    if (validation.passed && validation.warnings.length === 0) {
      lines.push("  ✓ All quality checks passed!");
    }
  }

  lines.push("");
  lines.push("═".repeat(60));

  return lines.join("\n");
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
Render Quality Verification Script

Usage:
  node scripts/verify-render-quality.mjs <video-file> [options]

Options:
  --preset <name>   Quality preset to validate against
                    Available: draft, standard, premium, 4k, premium-4k
  --json            Output results as JSON
  --strict          Exit with error code on any warning

Examples:
  node scripts/verify-render-quality.mjs out/video.mp4
  node scripts/verify-render-quality.mjs out/video.mp4 --preset premium
  node scripts/verify-render-quality.mjs out/video.mp4 --json
`);
    process.exit(0);
  }

  // Parse arguments
  const filePath = args.find((arg) => !arg.startsWith("--"));
  const presetArg = args.indexOf("--preset");
  const preset = presetArg !== -1 ? args[presetArg + 1] : "standard";
  const jsonOutput = args.includes("--json");
  const strictMode = args.includes("--strict");

  // Validate file exists
  if (!filePath || !existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Check file extension
  const ext = extname(filePath).toLowerCase();
  if (![".mp4", ".webm", ".mov", ".mkv", ".avi"].includes(ext)) {
    console.error(`Warning: Unusual file extension: ${ext}`);
  }

  try {
    // Extract metadata
    const metadata = getVideoMetadata(filePath);
    const videoInfo = parseVideoStream(metadata);
    const audioInfo = parseAudioStream(metadata);
    const formatInfo = parseFormat(metadata);

    // Validate against preset
    const validation = validateAgainstPreset(videoInfo, audioInfo, formatInfo, preset);

    // Output results
    if (jsonOutput) {
      console.log(
        JSON.stringify(
          {
            file: {
              path: filePath,
              size: formatInfo.size,
              duration: formatInfo.duration,
            },
            video: videoInfo,
            audio: audioInfo,
            format: formatInfo,
            validation,
          },
          null,
          2
        )
      );
    } else {
      console.log(generateTextReport(filePath, videoInfo, audioInfo, formatInfo, validation));
    }

    // Exit code based on validation
    if (!validation.passed) {
      process.exit(1);
    }
    if (strictMode && validation.warnings.length > 0) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
