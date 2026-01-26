/**
 * YouTube rendering presets
 */

import type { RenderPreset } from "./types";

/** Available render presets */
export const RENDER_PRESETS: Record<string, RenderPreset> = {
  // === Standard Presets ===
  "1080p": {
    name: "1080p HD",
    width: 1920,
    height: 1080,
    crf: 18,
    codec: "h264",
    colorSpace: "bt709",
    description: "Standard HD quality, fast upload",
  },
  "1080p-hq": {
    name: "1080p High Quality",
    width: 1920,
    height: 1080,
    crf: 15,
    codec: "h264",
    colorSpace: "bt709",
    description: "Higher quality 1080p, larger file",
  },
  "1440p": {
    name: "1440p QHD",
    width: 2560,
    height: 1440,
    crf: 18,
    codec: "h264",
    colorSpace: "bt709",
    description: "2K quality for larger displays",
  },
  "4k": {
    name: "4K UHD",
    width: 3840,
    height: 2160,
    crf: 15,
    codec: "h265",
    colorSpace: "bt709",
    description: "Ultra HD quality, best for large screens",
  },
  "4k-vp9": {
    name: "4K VP9",
    width: 3840,
    height: 2160,
    crf: 20,
    codec: "vp9",
    colorSpace: "bt709",
    description: "4K with VP9 codec (smaller file, slower encode)",
  },
  "youtube-shorts": {
    name: "YouTube Shorts",
    width: 1080,
    height: 1920,
    crf: 18,
    codec: "h264",
    colorSpace: "bt709",
    description: "Vertical format for Shorts",
  },

  // === BT.709 Optimized Presets ===
  "1080p-bt709": {
    name: "1080p BT.709",
    width: 1920,
    height: 1080,
    crf: 18,
    codec: "h264",
    colorSpace: "bt709",
    description: "1080p with accurate BT.709 color space",
  },
  "4k-bt709": {
    name: "4K BT.709",
    width: 3840,
    height: 2160,
    crf: 18,
    codec: "h265",
    colorSpace: "bt709",
    description: "4K with accurate BT.709 color space",
  },

  // === ProRes Master Presets (for post-production) ===
  "prores-proxy": {
    name: "ProRes Proxy",
    width: 1920,
    height: 1080,
    crf: 0, // ProRes doesn't use CRF
    codec: "prores",
    proresProfile: "proxy",
    description: "Lightweight ProRes for offline editing",
  },
  "prores-lt": {
    name: "ProRes LT",
    width: 1920,
    height: 1080,
    crf: 0,
    codec: "prores",
    proresProfile: "lt",
    description: "ProRes LT for efficient workflows",
  },
  "prores-hq": {
    name: "ProRes HQ",
    width: 1920,
    height: 1080,
    crf: 0,
    codec: "prores",
    proresProfile: "hq",
    description: "High quality ProRes for mastering",
  },
  "prores-4444": {
    name: "ProRes 4444",
    width: 1920,
    height: 1080,
    crf: 0,
    codec: "prores",
    proresProfile: "4444",
    description: "ProRes 4444 with alpha channel support",
  },
  "prores-4k": {
    name: "ProRes 4K HQ",
    width: 3840,
    height: 2160,
    crf: 0,
    codec: "prores",
    proresProfile: "hq",
    description: "4K ProRes HQ master",
  },

  // === Premium Quality Presets ===
  "premium-1080p": {
    name: "Premium 1080p",
    width: 1920,
    height: 1080,
    crf: 12,
    codec: "h264",
    colorSpace: "bt709",
    pixelFormat: "yuv420p10le",
    jpegQuality: 95,
    x264Preset: "slow",
    description: "Maximum quality 1080p with 10-bit color",
  },
  "premium-4k": {
    name: "Premium 4K",
    width: 3840,
    height: 2160,
    crf: 12,
    codec: "h265",
    colorSpace: "bt709",
    pixelFormat: "yuv420p10le",
    jpegQuality: 95,
    description: "Maximum quality 4K with 10-bit color",
  },

  // === Supersampled Presets (for sharp text on high-density displays) ===
  "retina-1080p": {
    name: "Retina 1080p",
    width: 1920,
    height: 1080,
    crf: 15,
    codec: "h264",
    colorSpace: "bt709",
    scale: 1.5,
    jpegQuality: 95,
    description: "1080p with 1.5x supersampling for sharp text",
  },
  "supersampled-1080p": {
    name: "Supersampled 1080p",
    width: 1920,
    height: 1080,
    crf: 15,
    codec: "h264",
    colorSpace: "bt709",
    scale: 2,
    jpegQuality: 95,
    x264Preset: "slow",
    description: "4K render downscaled to 1080p for maximum sharpness",
  },

  // === Draft/Preview Presets ===
  "draft": {
    name: "Draft Preview",
    width: 1280,
    height: 720,
    crf: 28,
    codec: "h264",
    description: "Fast preview render for testing",
  },
  "draft-540p": {
    name: "Draft 540p",
    width: 960,
    height: 540,
    crf: 30,
    codec: "h264",
    description: "Extra fast preview for rapid iteration",
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
 * Get presets by category
 */
export function getPresetsByCategory(): Record<string, string[]> {
  return {
    standard: ["1080p", "1080p-hq", "1440p", "4k", "4k-vp9", "youtube-shorts"],
    bt709: ["1080p-bt709", "4k-bt709"],
    prores: ["prores-proxy", "prores-lt", "prores-hq", "prores-4444", "prores-4k"],
    premium: ["premium-1080p", "premium-4k"],
    supersampled: ["retina-1080p", "supersampled-1080p"],
    draft: ["draft", "draft-540p"],
  };
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
  ];

  // Add CRF for non-ProRes codecs
  if (presetConfig.codec !== "prores" && presetConfig.crf > 0) {
    args.push(`--crf=${presetConfig.crf}`);
  }

  // Add output scaling for supersampling
  if (presetConfig.scale && presetConfig.scale !== 1) {
    args.push(`--scale=${presetConfig.scale}`);
  }

  // Add JPEG quality if specified
  if (presetConfig.jpegQuality) {
    args.push(`--jpeg-quality=${presetConfig.jpegQuality}`);
  }

  // Add x264 preset if specified
  if (presetConfig.x264Preset && presetConfig.codec === "h264") {
    args.push(`--x264-preset=${presetConfig.x264Preset}`);
  }

  // Add codec-specific options
  switch (presetConfig.codec) {
    case "h265":
      args.push("--codec=h265");
      break;
    case "vp9":
      args.push("--codec=vp9");
      break;
    case "prores":
      args.push("--codec=prores");
      if (presetConfig.proresProfile) {
        args.push(`--prores-profile=${presetConfig.proresProfile}`);
      }
      break;
    default:
      // h264 is default
      break;
  }

  // Add color space
  if (presetConfig.colorSpace) {
    args.push(`--color-space=${presetConfig.colorSpace}`);
  }

  // Add pixel format
  if (presetConfig.pixelFormat) {
    args.push(`--pixel-format=${presetConfig.pixelFormat}`);
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

    // Determine file extension based on codec
    const ext = preset.codec === "prores" ? "mov" : "mp4";
    const outputFile = `${outputDir}/video_${presetName}.${ext}`;

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
  targetPlatform?: "youtube" | "shorts" | "general" | "master";
  prioritize?: "quality" | "speed" | "size";
  maxWidth?: number;
}): RenderPreset {
  const {
    targetPlatform = "youtube",
    prioritize = "quality",
    maxWidth,
  } = options;

  // Shorts format
  if (targetPlatform === "shorts") {
    return RENDER_PRESETS["youtube-shorts"];
  }

  // Master quality for post-production
  if (targetPlatform === "master") {
    return RENDER_PRESETS["prores-hq"];
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
      return RENDER_PRESETS["draft"];
    case "size":
      return RENDER_PRESETS["4k-vp9"];
    case "quality":
    default:
      return RENDER_PRESETS["premium-1080p"];
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
    "h264-720p": { min: 5, max: 8 },
    "h264-1080p": { min: 8, max: 12 },
    "h264-1440p": { min: 16, max: 24 },
    "h264-2160p": { min: 35, max: 45 },
    "h265-2160p": { min: 20, max: 30 },
    "vp9-2160p": { min: 18, max: 25 },
    "prores-1080p": { min: 100, max: 150 },
    "prores-2160p": { min: 400, max: 600 },
  };

  const key = `${preset.codec}-${preset.height}p`;
  const bitrate = bitrateEstimates[key] || { min: 10, max: 20 };

  const minMB = (bitrate.min * durationSeconds) / 8;
  const maxMB = (bitrate.max * durationSeconds) / 8;

  if (maxMB > 1000) {
    return {
      min: Math.round((minMB / 1000) * 10) / 10,
      max: Math.round((maxMB / 1000) * 10) / 10,
      unit: "GB",
    };
  }

  return {
    min: Math.round(minMB),
    max: Math.round(maxMB),
    unit: "MB",
  };
}
