/**
 * Scene-specific effect presets
 *
 * Pre-configured effect combinations optimized for common scene types
 */

import { EffectsConfig, ColorGradingPreset } from "./types";

/**
 * Scene type for effect selection
 */
export type SceneType =
  | "intro"
  | "content"
  | "quote"
  | "comparison"
  | "data"
  | "timeline"
  | "story"
  | "interview"
  | "outro"
  | "dramatic"
  | "educational"
  | "tech"
  | "nature"
  | "minimal";

/**
 * Scene effect preset configuration
 */
export interface SceneEffectPreset {
  /** Preset name */
  name: string;
  /** Scene types this preset works well with */
  sceneTypes: SceneType[];
  /** Effects configuration */
  effects: EffectsConfig;
  /** Recommended color grading */
  colorGrading: ColorGradingPreset;
  /** Description of the look */
  description: string;
}

/**
 * Pre-configured scene effect presets
 */
export const SCENE_EFFECT_PRESETS: Record<string, SceneEffectPreset> = {
  // === INTRO/OUTRO ===
  "cinematic-intro": {
    name: "Cinematic Intro",
    sceneTypes: ["intro", "outro"],
    effects: {
      vignette: { intensity: 0.35, softness: 0.6 },
      colorGrading: { preset: "cinematic", intensity: 0.8 },
      bloom: { intensity: 0.3, radius: 12, threshold: 0.75 },
      filmGrain: { intensity: 0.1, monochrome: true },
    },
    colorGrading: "cinematic",
    description: "Dramatic cinematic look for opening/closing sequences",
  },

  // === CONTENT/EDUCATIONAL ===
  "clean-content": {
    name: "Clean Content",
    sceneTypes: ["content", "educational"],
    effects: {
      vignette: { intensity: 0.15, softness: 0.7 },
      colorGrading: { preset: "documentary", intensity: 0.5 },
    },
    colorGrading: "documentary",
    description: "Clean, minimal look for educational content",
  },

  // === QUOTE ===
  "elegant-quote": {
    name: "Elegant Quote",
    sceneTypes: ["quote"],
    effects: {
      vignette: { intensity: 0.4, softness: 0.5 },
      colorGrading: { preset: "moody-dark", intensity: 0.7 },
      bloom: { intensity: 0.2, radius: 15 },
      filmGrain: { intensity: 0.08, monochrome: true },
    },
    colorGrading: "moody-dark",
    description: "Moody, contemplative look for quote scenes",
  },

  // === DATA VISUALIZATION ===
  "tech-data": {
    name: "Tech Data",
    sceneTypes: ["data", "tech"],
    effects: {
      vignette: { intensity: 0.2, softness: 0.6 },
      colorGrading: { preset: "cool-tech", intensity: 0.6 },
      chromaticAberration: { intensity: 0.1, direction: "radial" },
    },
    colorGrading: "cool-tech",
    description: "Cool, modern look for data and tech content",
  },

  // === STORY/NARRATIVE ===
  "warm-story": {
    name: "Warm Story",
    sceneTypes: ["story", "interview"],
    effects: {
      vignette: { intensity: 0.25, softness: 0.6 },
      colorGrading: { preset: "warm-sunset", intensity: 0.6 },
      filmGrain: { intensity: 0.12, monochrome: false },
      lightLeak: { intensity: 0.1, position: "top-right", animated: true },
    },
    colorGrading: "warm-sunset",
    description: "Warm, inviting look for storytelling",
  },

  // === DRAMATIC/INTENSE ===
  "high-drama": {
    name: "High Drama",
    sceneTypes: ["dramatic", "comparison"],
    effects: {
      vignette: { intensity: 0.45, softness: 0.4 },
      colorGrading: { preset: "dramatic", intensity: 0.9 },
      bloom: { intensity: 0.35, radius: 10, threshold: 0.7 },
      filmGrain: { intensity: 0.15, monochrome: true },
    },
    colorGrading: "dramatic",
    description: "High contrast dramatic look",
  },

  // === NATURE/ORGANIC ===
  "natural": {
    name: "Natural",
    sceneTypes: ["nature"],
    effects: {
      vignette: { intensity: 0.2, softness: 0.65 },
      colorGrading: { preset: "forest", intensity: 0.5 },
      filmGrain: { intensity: 0.06 },
    },
    colorGrading: "forest",
    description: "Natural, organic look with green tones",
  },

  // === MINIMAL ===
  "ultra-clean": {
    name: "Ultra Clean",
    sceneTypes: ["minimal"],
    effects: {
      vignette: { intensity: 0.1, softness: 0.8 },
    },
    colorGrading: "documentary",
    description: "Extremely minimal effects for clean look",
  },

  // === VINTAGE ===
  "retro-film": {
    name: "Retro Film",
    sceneTypes: ["story", "intro"],
    effects: {
      vignette: { intensity: 0.5, softness: 0.4 },
      colorGrading: { preset: "vintage", intensity: 1.0 },
      filmGrain: { intensity: 0.2, monochrome: false },
      lightLeak: { intensity: 0.25, color: "rgba(255, 180, 80, 0.4)", animated: true },
    },
    colorGrading: "vintage",
    description: "Classic retro film aesthetic",
  },

  // === NEON/CYBERPUNK ===
  "neon-cyber": {
    name: "Neon Cyber",
    sceneTypes: ["tech", "dramatic"],
    effects: {
      vignette: { intensity: 0.3, softness: 0.5 },
      colorGrading: { preset: "neon", intensity: 0.8 },
      bloom: { intensity: 0.5, radius: 20, threshold: 0.6 },
      chromaticAberration: { intensity: 0.2, direction: "radial" },
      glitch: { intensity: "subtle", animated: true },
    },
    colorGrading: "neon",
    description: "Vibrant cyberpunk aesthetic",
  },
};

/**
 * Get scene effect preset by name
 */
export function getSceneEffectPreset(name: string): SceneEffectPreset | null {
  return SCENE_EFFECT_PRESETS[name] || null;
}

/**
 * Get recommended presets for a scene type
 */
export function getPresetsForSceneType(sceneType: SceneType): SceneEffectPreset[] {
  return Object.values(SCENE_EFFECT_PRESETS).filter((preset) =>
    preset.sceneTypes.includes(sceneType)
  );
}

/**
 * Get all available scene preset names
 */
export function getScenePresetNames(): string[] {
  return Object.keys(SCENE_EFFECT_PRESETS);
}

/**
 * Get effects config from scene preset
 */
export function getSceneEffects(presetName: string): EffectsConfig {
  const preset = SCENE_EFFECT_PRESETS[presetName];
  return preset?.effects || {};
}

export default SCENE_EFFECT_PRESETS;
