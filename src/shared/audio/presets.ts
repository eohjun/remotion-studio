/**
 * Audio Presets
 *
 * Pre-configured settings for common audio scenarios.
 */

import type { MusicPreset, SFXPreset, DuckingConfig } from "./types";

/**
 * Background music presets for different moods/styles
 */
export const MUSIC_PRESETS: Record<string, MusicPreset> = {
  /** Calm, unobtrusive background */
  ambient: {
    volume: 0.2,
    fadeIn: 60, // 2 seconds at 30fps
    fadeOut: 60,
  },
  /** Upbeat, engaging content */
  energetic: {
    volume: 0.35,
    fadeIn: 30, // 1 second
    fadeOut: 45,
  },
  /** Very quiet, barely noticeable */
  subtle: {
    volume: 0.15,
    fadeIn: 90, // 3 seconds
    fadeOut: 90,
  },
  /** Tutorial/educational content */
  tutorial: {
    volume: 0.18,
    fadeIn: 45,
    fadeOut: 60,
  },
  /** Dramatic/cinematic */
  cinematic: {
    volume: 0.4,
    fadeIn: 90,
    fadeOut: 120,
  },
} as const;

/**
 * Sound effect presets for common use cases
 */
export const SFX_PRESETS: Record<string, SFXPreset> = {
  /** Scene transitions (plays slightly before) */
  transition: {
    volume: 0.5,
    offset: -5, // 5 frames before trigger
  },
  /** Element appearing on screen */
  appear: {
    volume: 0.4,
    offset: 0,
  },
  /** Important point emphasis */
  emphasis: {
    volume: 0.6,
    offset: 0,
  },
  /** UI interaction feedback */
  uiFeedback: {
    volume: 0.3,
    offset: 0,
  },
  /** Success/completion sound */
  success: {
    volume: 0.5,
    offset: 2,
  },
} as const;

/**
 * Volume ducking presets for narration
 */
export const DUCKING_PRESETS: Record<string, DuckingConfig> = {
  /** Standard ducking for most content */
  standard: {
    duckedVolume: 0.1,
    transitionFrames: 15, // 0.5 seconds
  },
  /** Gentler transition, more music audible */
  gentle: {
    duckedVolume: 0.15,
    transitionFrames: 30, // 1 second
  },
  /** Quick, aggressive ducking */
  aggressive: {
    duckedVolume: 0.05,
    transitionFrames: 10,
  },
  /** For speech-heavy content */
  speech: {
    duckedVolume: 0.08,
    transitionFrames: 12,
  },
} as const;

/**
 * Common audio volume levels
 */
export const VOLUME_LEVELS = {
  /** Silent */
  mute: 0,
  /** Very quiet background */
  whisper: 0.1,
  /** Quiet background */
  quiet: 0.2,
  /** Standard background */
  low: 0.3,
  /** Medium/balanced */
  medium: 0.5,
  /** Foreground */
  high: 0.7,
  /** Full volume */
  full: 1.0,
} as const;

/**
 * Get a music preset by name
 */
export function getMusicPreset(name: keyof typeof MUSIC_PRESETS): MusicPreset {
  return MUSIC_PRESETS[name];
}

/**
 * Get an SFX preset by name
 */
export function getSFXPreset(name: keyof typeof SFX_PRESETS): SFXPreset {
  return SFX_PRESETS[name];
}

/**
 * Get a ducking preset by name
 */
export function getDuckingPreset(
  name: keyof typeof DUCKING_PRESETS
): DuckingConfig {
  return DUCKING_PRESETS[name];
}

/**
 * Create a custom music preset
 */
export function createMusicPreset(
  base: keyof typeof MUSIC_PRESETS,
  overrides: Partial<MusicPreset>
): MusicPreset {
  return {
    ...MUSIC_PRESETS[base],
    ...overrides,
  };
}

/**
 * Create a custom SFX preset
 */
export function createSFXPreset(
  base: keyof typeof SFX_PRESETS,
  overrides: Partial<SFXPreset>
): SFXPreset {
  return {
    ...SFX_PRESETS[base],
    ...overrides,
  };
}
