/**
 * YouTube rendering presets
 */

import type { RenderPreset } from "./types";

/** Available render presets */
export const RENDER_PRESETS: Record<string, RenderPreset> = {
  "1080p": {
    name: "1080p HD",
    width: 1920,
    height: 1080,
    crf: 18,
    codec: "h264",
    description: "Standard HD quality, fast upload",
  },
  "1080p-hq": {
    name: "1080p High Quality",
    width: 1920,
    height: 1080,
    crf: 15,
    codec: "h264",
    description: "Higher quality 1080p, larger file",
  },
  "1440p": {
    name: "1440p QHD",
    width: 2560,
    height: 1440,
    crf: 18,
    codec: "h264",
    description: "2K quality for larger displays",
  },
  "4k": {
    name: "4K UHD",
    width: 3840,
    height: 2160,
    crf: 18,
    codec: "h265",
    description: "Ultra HD quality, best for large screens",
  },
  "4k-vp9": {
    name: "4K VP9",
    width: 3840,
    height: 2160,
    crf: 20,
    codec: "vp9",
    description: "4K with VP9 codec (smaller file, slower encode)",
  },
  "youtube-shorts": {
    name: "YouTube Shorts",
    width: 1080,
    height: 1920,
    crf: 18,
    codec: "h264",
    description: "Vertical format for Shorts",
  },
};

/**
 * Get render preset by name
 */
export function getPreset(name: string): RenderPreset | null {
  return RENDER_PRESETS[name] || null;
}

/**
 * Get all available preset names
 */
export function getPresetNames(): string[] {
  return Object.keys(RENDER_PRESETS);
}

/**
 * Generate Remotion CLI render command
 */
export function generateRenderCommand(
  compositionId: string,
  outputPath: string,
  preset: RenderPreset | string
): string {
  const presetConfig = typeof preset === "string" ? getPreset(preset) : preset;

  if (!presetConfig) {
    throw new Error(`Unknown preset: ${preset}`);
  }

  const args = [
    "npx remotion render",
    compositionId,
    outputPath,
    `--width=${presetConfig.width}`,
    `--height=${presetConfig.height}`,
    `--crf=${presetConfig.crf}`,
  ];

  // Add codec-specific options
  switch (presetConfig.codec) {
    case "h265":
      args.push("--codec=h265");
      break;
    case "vp9":
      args.push("--codec=vp9");
      break;
    default:
      // h264 is default
      break;
  }

  return args.join(" ");
}

/**
 * Generate render commands for multiple presets
 */
export function generateMultipleRenderCommands(
  compositionId: string,
  outputDir: string,
  presets: string[] = ["1080p", "4k"]
): Array<{ preset: string; command: string }> {
  return presets.map((presetName) => {
    const preset = getPreset(presetName);
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    const outputFile = `${outputDir}/video_${presetName}.mp4`;
    return {
      preset: presetName,
      command: generateRenderCommand(compositionId, outputFile, preset),
    };
  });
}

/**
 * Get recommended preset based on requirements
 */
export function getRecommendedPreset(options: {
  targetPlatform?: "youtube" | "shorts" | "general";
  prioritize?: "quality" | "speed" | "size";
  maxWidth?: number;
}): RenderPreset {
  const { targetPlatform = "youtube", prioritize = "quality", maxWidth } = options;

  // Shorts format
  if (targetPlatform === "shorts") {
    return RENDER_PRESETS["youtube-shorts"];
  }

  // Width constraint
  if (maxWidth) {
    if (maxWidth <= 1920) return RENDER_PRESETS["1080p"];
    if (maxWidth <= 2560) return RENDER_PRESETS["1440p"];
    return RENDER_PRESETS["4k"];
  }

  // Priority-based selection
  switch (prioritize) {
    case "speed":
      return RENDER_PRESETS["1080p"];
    case "size":
      return RENDER_PRESETS["4k-vp9"];
    case "quality":
    default:
      return RENDER_PRESETS["1080p-hq"];
  }
}

/**
 * Estimated file size (rough approximation)
 */
export function estimateFileSize(
  preset: RenderPreset,
  durationSeconds: number
): { min: number; max: number; unit: string } {
  // Rough bitrate estimates (Mbps)
  const bitrateEstimates: Record<string, { min: number; max: number }> = {
    "h264-1080p": { min: 8, max: 12 },
    "h264-1440p": { min: 16, max: 24 },
    "h264-2160p": { min: 35, max: 45 },
    "h265-2160p": { min: 20, max: 30 },
    "vp9-2160p": { min: 18, max: 25 },
  };

  const key = `${preset.codec}-${preset.height}p`;
  const bitrate = bitrateEstimates[key] || { min: 10, max: 20 };

  const minMB = (bitrate.min * durationSeconds) / 8;
  const maxMB = (bitrate.max * durationSeconds) / 8;

  if (maxMB > 1000) {
    return {
      min: Math.round(minMB / 1000 * 10) / 10,
      max: Math.round(maxMB / 1000 * 10) / 10,
      unit: "GB",
    };
  }

  return {
    min: Math.round(minMB),
    max: Math.round(maxMB),
    unit: "MB",
  };
}
