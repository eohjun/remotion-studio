/**
 * Advanced Ducking Utilities
 *
 * Provides sophisticated audio ducking with attack/release curves,
 * compression ratio, and multiple algorithm options.
 */

import { interpolate, Easing } from "remotion";
import type { NarrationRange } from "../types";
import { clampVolume } from "./volumeUtils";

/**
 * Advanced ducking configuration
 */
export interface AdvancedDuckingConfig {
  /** Volume when ducked (0-1, default: 0.15) */
  duckedVolume?: number;
  /** Attack time in frames (how quickly to duck, default: 8) */
  attackFrames?: number;
  /** Release time in frames (how quickly to recover, default: 15) */
  releaseFrames?: number;
  /** Compression ratio during ducking (1 = no compression, default: 1) */
  ratio?: number;
  /** Pre-duck lookahead in frames (start ducking early, default: 5) */
  lookahead?: number;
  /** Hold time in frames after narration ends before release (default: 3) */
  holdFrames?: number;
  /** Easing function for transitions */
  easing?: (t: number) => number;
}

/**
 * Ducking curve type
 */
export type DuckingCurve = "linear" | "exponential" | "logarithmic" | "smooth";

/**
 * Advanced ducking presets
 */
export const ADVANCED_DUCKING_PRESETS: Record<string, AdvancedDuckingConfig> = {
  /** Fast, aggressive ducking for prominent narration */
  aggressive: {
    duckedVolume: 0.1,
    attackFrames: 5,
    releaseFrames: 10,
    ratio: 1,
    lookahead: 3,
    holdFrames: 2,
    easing: Easing.out(Easing.quad),
  },
  /** Natural, smooth ducking for conversational content */
  natural: {
    duckedVolume: 0.2,
    attackFrames: 10,
    releaseFrames: 20,
    ratio: 1,
    lookahead: 5,
    holdFrames: 5,
    easing: Easing.inOut(Easing.sin),
  },
  /** Subtle ducking that maintains music presence */
  subtle: {
    duckedVolume: 0.35,
    attackFrames: 15,
    releaseFrames: 25,
    ratio: 1,
    lookahead: 8,
    holdFrames: 8,
    easing: Easing.inOut(Easing.cubic),
  },
  /** Podcast-style ducking with longer transitions */
  podcast: {
    duckedVolume: 0.15,
    attackFrames: 12,
    releaseFrames: 30,
    ratio: 1,
    lookahead: 6,
    holdFrames: 10,
    easing: Easing.inOut(Easing.quad),
  },
  /** Cinematic ducking with very smooth transitions */
  cinematic: {
    duckedVolume: 0.25,
    attackFrames: 18,
    releaseFrames: 45,
    ratio: 1,
    lookahead: 10,
    holdFrames: 15,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
};

/**
 * Calculate advanced ducked volume at a specific frame
 *
 * Provides more control than basic ducking with:
 * - Configurable attack/release times
 * - Lookahead for preemptive ducking
 * - Hold time to prevent pumping
 * - Custom easing curves
 *
 * @param frame - Current frame
 * @param narrationRanges - Array of narration start/end frames
 * @param normalVolume - Volume when not ducked
 * @param config - Advanced ducking configuration
 * @returns Current volume level
 *
 * @example
 * ```tsx
 * const bgVolume = advancedDuckVolume(
 *   frame,
 *   [[30, 150], [200, 400]],
 *   0.4,
 *   ADVANCED_DUCKING_PRESETS.natural
 * );
 * ```
 */
export function advancedDuckVolume(
  frame: number,
  narrationRanges: NarrationRange[] | [number, number][],
  normalVolume: number,
  config: AdvancedDuckingConfig | keyof typeof ADVANCED_DUCKING_PRESETS = "natural"
): number {
  const duckConfig: AdvancedDuckingConfig =
    typeof config === "string" ? ADVANCED_DUCKING_PRESETS[config] : config;

  const {
    duckedVolume = 0.15,
    attackFrames = 8,
    releaseFrames = 15,
    lookahead = 5,
    holdFrames = 3,
    easing = Easing.inOut(Easing.quad),
  } = duckConfig;

  // Normalize ranges to NarrationRange format
  const ranges: NarrationRange[] = narrationRanges.map((range) =>
    Array.isArray(range) ? { start: range[0], end: range[1] } : range
  );

  // Find the current ducking state based on proximity to narration
  let duckingAmount = 0; // 0 = no ducking, 1 = full ducking

  for (const range of ranges) {
    const duckStart = range.start - lookahead - attackFrames;
    const attackEnd = range.start - lookahead;
    const holdEnd = range.end + holdFrames;
    const releaseEnd = holdEnd + releaseFrames;

    // Attack phase: transition into duck
    if (frame >= duckStart && frame < attackEnd) {
      const progress = (frame - duckStart) / attackFrames;
      duckingAmount = Math.max(duckingAmount, easing(progress));
    }
    // Fully ducked (including lookahead and hold)
    else if (frame >= attackEnd && frame <= holdEnd) {
      duckingAmount = 1;
    }
    // Release phase: transition out of duck
    else if (frame > holdEnd && frame <= releaseEnd) {
      const progress = 1 - (frame - holdEnd) / releaseFrames;
      duckingAmount = Math.max(duckingAmount, easing(progress));
    }
  }

  // Calculate final volume by interpolating between normal and ducked
  const targetVolume = interpolate(
    duckingAmount,
    [0, 1],
    [normalVolume, duckedVolume],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return clampVolume(targetVolume);
}

/**
 * Calculate ducking envelope for visualization
 *
 * Returns an array of volume values for each frame, useful for
 * debugging or visualizing the ducking curve.
 *
 * @param totalFrames - Total number of frames
 * @param narrationRanges - Narration timing ranges
 * @param normalVolume - Base volume
 * @param config - Ducking configuration
 * @returns Array of volume values per frame
 */
export function getDuckingEnvelope(
  totalFrames: number,
  narrationRanges: NarrationRange[] | [number, number][],
  normalVolume: number,
  config: AdvancedDuckingConfig | keyof typeof ADVANCED_DUCKING_PRESETS = "natural"
): number[] {
  const envelope: number[] = [];

  for (let frame = 0; frame < totalFrames; frame++) {
    envelope.push(advancedDuckVolume(frame, narrationRanges, normalVolume, config));
  }

  return envelope;
}

/**
 * Multi-band ducking for frequency-selective volume reduction
 *
 * Allows different ducking amounts for different frequency ranges.
 * Useful for maintaining bass presence while ducking mids/highs.
 *
 * Note: This returns ducking parameters; actual frequency separation
 * would need to be done in post-processing or with Web Audio API.
 */
export interface MultiBandDuckingConfig {
  /** Low frequency (< 250Hz) ducking amount (0-1) */
  lowBand: number;
  /** Mid frequency (250Hz - 4kHz) ducking amount (0-1) */
  midBand: number;
  /** High frequency (> 4kHz) ducking amount (0-1) */
  highBand: number;
}

/**
 * Get multi-band ducking parameters
 *
 * @param preset - Preset name or 'voice' for voice-focused ducking
 * @returns MultiBandDuckingConfig
 */
export function getMultiBandDuckingParams(
  preset: "voice" | "full" | "bass-preserve" | "treble-preserve"
): MultiBandDuckingConfig {
  const presets: Record<string, MultiBandDuckingConfig> = {
    /** Standard ducking - reduce all frequencies equally */
    full: { lowBand: 0.15, midBand: 0.15, highBand: 0.15 },
    /** Voice-focused - duck mids most (where voice sits) */
    voice: { lowBand: 0.3, midBand: 0.1, highBand: 0.2 },
    /** Preserve bass - maintain low end energy */
    "bass-preserve": { lowBand: 0.4, midBand: 0.15, highBand: 0.15 },
    /** Preserve treble - maintain clarity/air */
    "treble-preserve": { lowBand: 0.15, midBand: 0.15, highBand: 0.35 },
  };

  return presets[preset] || presets.full;
}

/**
 * Calculate gain reduction in dB for sidechaining visualization
 *
 * @param normalVolume - Normal volume level (0-1)
 * @param currentVolume - Current ducked volume (0-1)
 * @returns Gain reduction in dB (negative number)
 */
export function getGainReductionDb(
  normalVolume: number,
  currentVolume: number
): number {
  if (currentVolume <= 0) return -Infinity;
  return 20 * Math.log10(currentVolume / normalVolume);
}
