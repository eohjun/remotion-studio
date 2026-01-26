/**
 * Quality Presets - Combined render and effects configurations
 *
 * These presets bundle render settings with visual effect configurations
 * for consistent output quality across different use cases.
 */

import type { EffectsConfig } from "../components/effects/types";
import type { RenderPreset } from "../youtube/types";
import { RENDER_PRESETS } from "../youtube/render-presets";

/**
 * Quality preset combining render settings and effects configuration
 */
export interface QualityPreset {
  /** Display name */
  name: string;
  /** Render preset name or custom config */
  render: RenderPreset | string;
  /** Visual effects configuration */
  effects?: Partial<EffectsConfig>;
  /** Motion blur sample count */
  motionBlurSamples?: number;
  /** Output scaling factor (1 = native, 2 = supersampling) */
  outputScaling?: number;
  /** Description of the preset */
  description: string;
}

/**
 * Pre-defined quality presets
 */
export const QUALITY_PRESETS: Record<string, QualityPreset> = {
  // === Draft Mode ===
  draft: {
    name: "Draft",
    render: "draft",
    effects: {
      // Minimal effects for fast preview
      filmGrain: false,
      vignette: false,
      motionBlur: false,
      bloom: false,
      colorGrading: false,
    },
    motionBlurSamples: 0,
    outputScaling: 1,
    description: "Fast preview with minimal effects",
  },

  // === Standard Quality ===
  standard: {
    name: "Standard",
    render: "1080p",
    effects: {
      filmGrain: { intensity: 0.08 },
      vignette: { intensity: 0.2 },
      motionBlur: { samples: 10, shutterAngle: 180 },
      colorGrading: { preset: "cinematic", intensity: 0.5 },
    },
    motionBlurSamples: 10,
    outputScaling: 1,
    description: "Balanced quality and render time",
  },

  // === High Quality ===
  high: {
    name: "High Quality",
    render: "1080p-hq",
    effects: {
      filmGrain: { intensity: 0.1 },
      vignette: { intensity: 0.25 },
      cameraMotionBlur: { samples: 15, shutterAngle: 180 },
      colorGrading: { preset: "cinematic", intensity: 0.7 },
      bloom: { intensity: 0.3, radius: 10 },
    },
    motionBlurSamples: 15,
    outputScaling: 1,
    description: "High quality for YouTube upload",
  },

  // === Premium Quality ===
  premium: {
    name: "Premium",
    render: "premium-1080p",
    effects: {
      filmGrain: { intensity: 0.12, monochrome: true },
      vignette: { intensity: 0.3, softness: 0.6 },
      cameraMotionBlur: { samples: 20, shutterAngle: 180 },
      colorGrading: { preset: "cinematic", intensity: 0.8 },
      bloom: { intensity: 0.4, radius: 15, threshold: 0.75 },
      lightLeak: { intensity: 0.15, animated: true },
    },
    motionBlurSamples: 20,
    outputScaling: 1,
    description: "Maximum quality with all effects enabled",
  },

  // === 4K Premium ===
  "4k-premium": {
    name: "4K Premium",
    render: "premium-4k",
    effects: {
      filmGrain: { intensity: 0.1, monochrome: true },
      vignette: { intensity: 0.3, softness: 0.6 },
      cameraMotionBlur: { samples: 20, shutterAngle: 180 },
      colorGrading: { preset: "cinematic", intensity: 0.8 },
      bloom: { intensity: 0.35, radius: 20, threshold: 0.75 },
      lightLeak: { intensity: 0.12, animated: true },
    },
    motionBlurSamples: 20,
    outputScaling: 1,
    description: "4K with full effects suite",
  },

  // === Cinematic ===
  cinematic: {
    name: "Cinematic",
    render: "1080p-hq",
    effects: {
      filmGrain: { intensity: 0.15, monochrome: true },
      vignette: { intensity: 0.4, softness: 0.5 },
      cameraMotionBlur: { samples: 15, shutterAngle: 180 },
      colorGrading: { preset: "teal-orange", intensity: 0.9 },
      bloom: { intensity: 0.3, radius: 12 },
      chromaticAberration: { intensity: 0.15, direction: "radial" },
    },
    motionBlurSamples: 15,
    outputScaling: 1,
    description: "Film-like aesthetic with strong color grade",
  },

  // === Vintage ===
  vintage: {
    name: "Vintage",
    render: "1080p",
    effects: {
      filmGrain: { intensity: 0.2, monochrome: false },
      vignette: { intensity: 0.5, softness: 0.4 },
      colorGrading: { preset: "vintage", intensity: 1.0 },
      lightLeak: { intensity: 0.25, color: "rgba(255, 180, 80, 0.4)" },
    },
    motionBlurSamples: 10,
    outputScaling: 1,
    description: "Retro film look with warm tones",
  },

  // === Clean/Minimal ===
  clean: {
    name: "Clean",
    render: "1080p-hq",
    effects: {
      vignette: { intensity: 0.15, softness: 0.7 },
      colorGrading: { preset: "vibrant", intensity: 0.3 },
    },
    motionBlurSamples: 10,
    outputScaling: 1,
    description: "Minimal effects for clean look",
  },

  // === Master/Archive ===
  master: {
    name: "Master",
    render: "prores-hq",
    effects: {
      // Minimal effects for master file (grade in post)
      vignette: false,
      filmGrain: false,
      colorGrading: false,
    },
    motionBlurSamples: 20,
    outputScaling: 1,
    description: "ProRes master for post-production",
  },

  // === Shorts/Vertical ===
  shorts: {
    name: "Shorts",
    render: "youtube-shorts",
    effects: {
      filmGrain: { intensity: 0.08 },
      vignette: { intensity: 0.2 },
      colorGrading: { preset: "vibrant", intensity: 0.6 },
    },
    motionBlurSamples: 10,
    outputScaling: 1,
    description: "Optimized for YouTube Shorts",
  },

  // === Supersampled Presets (for crisp text on high-density displays) ===
  "retina": {
    name: "Retina",
    render: "retina-1080p",
    effects: {
      filmGrain: { intensity: 0.08 },
      vignette: { intensity: 0.2 },
      colorGrading: { preset: "cinematic", intensity: 0.5 },
    },
    motionBlurSamples: 10,
    outputScaling: 1.5,
    description: "1.5x supersampling for sharp text on Retina displays",
  },
  "supersampled": {
    name: "Supersampled",
    render: "supersampled-1080p",
    effects: {
      filmGrain: { intensity: 0.1 },
      vignette: { intensity: 0.25 },
      cameraMotionBlur: { samples: 15, shutterAngle: 180 },
      colorGrading: { preset: "cinematic", intensity: 0.7 },
    },
    motionBlurSamples: 15,
    outputScaling: 2,
    description: "4K render downscaled to 1080p for maximum text clarity",
  },

  // === Professional Presets ===
  "broadcast": {
    name: "Broadcast",
    render: "1080p-bt709",
    effects: {
      vignette: { intensity: 0.15 },
      colorGrading: { preset: "cinematic", intensity: 0.4 },
    },
    motionBlurSamples: 12,
    outputScaling: 1,
    description: "Broadcast-safe with accurate BT.709 color",
  },
};

/**
 * Get quality preset by name
 */
export function getQualityPreset(name: string): QualityPreset | null {
  return QUALITY_PRESETS[name] || null;
}

/**
 * Get all quality preset names
 */
export function getQualityPresetNames(): string[] {
  return Object.keys(QUALITY_PRESETS);
}

/**
 * Resolve render preset from quality preset
 */
export function resolveRenderPreset(qualityPreset: QualityPreset): RenderPreset {
  if (typeof qualityPreset.render === "string") {
    return RENDER_PRESETS[qualityPreset.render] || RENDER_PRESETS["1080p"];
  }
  return qualityPreset.render;
}

/**
 * Get recommended quality preset based on context
 */
export function getRecommendedQualityPreset(options: {
  purpose?: "preview" | "upload" | "archive" | "shorts";
  style?: "clean" | "cinematic" | "vintage";
  resolution?: "720p" | "1080p" | "4k";
}): QualityPreset {
  const { purpose = "upload", style = "clean", resolution = "1080p" } = options;

  // Purpose-based selection
  if (purpose === "preview") {
    return QUALITY_PRESETS.draft;
  }

  if (purpose === "archive") {
    return QUALITY_PRESETS.master;
  }

  if (purpose === "shorts") {
    return QUALITY_PRESETS.shorts;
  }

  // Style-based selection for uploads
  if (style === "cinematic") {
    return resolution === "4k" ? QUALITY_PRESETS["4k-premium"] : QUALITY_PRESETS.cinematic;
  }

  if (style === "vintage") {
    return QUALITY_PRESETS.vintage;
  }

  // Default based on resolution
  if (resolution === "4k") {
    return QUALITY_PRESETS["4k-premium"];
  }

  return QUALITY_PRESETS.high;
}
