/**
 * Volume Utilities
 *
 * Functions for calculating volume levels, fades, and ducking.
 */

import { interpolate } from "remotion";
import type { NarrationRange, DuckingConfig } from "../types";
import { DUCKING_PRESETS } from "../presets";

/**
 * Calculate faded volume between two values
 *
 * @param frame - Current frame
 * @param startFrame - Frame at which fade begins
 * @param duration - Duration of fade in frames
 * @param fromVolume - Starting volume (0-1)
 * @param toVolume - Ending volume (0-1)
 * @returns Interpolated volume value
 *
 * @example
 * // Fade in from 0 to 1 over 30 frames starting at frame 0
 * const vol = fadeVolume(frame, 0, 30, 0, 1);
 */
export function fadeVolume(
  frame: number,
  startFrame: number,
  duration: number,
  fromVolume: number,
  toVolume: number
): number {
  if (duration <= 0) return toVolume;

  return interpolate(frame, [startFrame, startFrame + duration], [fromVolume, toVolume], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Calculate fade-in volume
 *
 * @param frame - Current frame
 * @param fadeInDuration - Duration of fade in frames
 * @param maxVolume - Target volume after fade (default: 1)
 * @returns Current volume level
 */
export function fadeIn(
  frame: number,
  fadeInDuration: number,
  maxVolume: number = 1
): number {
  return fadeVolume(frame, 0, fadeInDuration, 0, maxVolume);
}

/**
 * Calculate fade-out volume
 *
 * @param frame - Current frame
 * @param totalDuration - Total duration in frames
 * @param fadeOutDuration - Duration of fade out in frames
 * @param maxVolume - Volume before fade starts (default: 1)
 * @returns Current volume level
 */
export function fadeOut(
  frame: number,
  totalDuration: number,
  fadeOutDuration: number,
  maxVolume: number = 1
): number {
  const fadeStart = totalDuration - fadeOutDuration;
  return fadeVolume(frame, fadeStart, fadeOutDuration, maxVolume, 0);
}

/**
 * Calculate volume with both fade-in and fade-out
 *
 * @param frame - Current frame
 * @param totalDuration - Total duration in frames
 * @param fadeInDuration - Duration of fade in
 * @param fadeOutDuration - Duration of fade out
 * @param maxVolume - Peak volume (default: 1)
 * @returns Current volume level
 */
export function fadeInOut(
  frame: number,
  totalDuration: number,
  fadeInDuration: number,
  fadeOutDuration: number,
  maxVolume: number = 1
): number {
  const fadeOutStart = totalDuration - fadeOutDuration;

  // During fade in
  if (frame < fadeInDuration) {
    return fadeIn(frame, fadeInDuration, maxVolume);
  }

  // During fade out
  if (frame >= fadeOutStart) {
    return fadeVolume(frame, fadeOutStart, fadeOutDuration, maxVolume, 0);
  }

  // In between - full volume
  return maxVolume;
}

/**
 * Calculate ducked volume during narration
 *
 * Automatically lowers background music volume when narration is playing.
 *
 * @param frame - Current frame
 * @param narrationRanges - Array of [start, end] frame ranges where narration plays
 * @param normalVolume - Volume when not ducked
 * @param config - Ducking configuration (or preset name)
 * @returns Current volume level
 *
 * @example
 * const bgVolume = duckVolume(
 *   frame,
 *   [[30, 150], [200, 400]], // narration at frames 30-150 and 200-400
 *   0.3,
 *   "standard"
 * );
 */
export function duckVolume(
  frame: number,
  narrationRanges: NarrationRange[] | [number, number][],
  normalVolume: number,
  config: DuckingConfig | keyof typeof DUCKING_PRESETS = "standard"
): number {
  const duckConfig: DuckingConfig =
    typeof config === "string" ? DUCKING_PRESETS[config] : config;

  const { duckedVolume, transitionFrames } = duckConfig;

  // Normalize ranges to NarrationRange format
  const ranges: NarrationRange[] = narrationRanges.map((range) =>
    Array.isArray(range) ? { start: range[0], end: range[1] } : range
  );

  // Check if we're in any narration range (including transitions)
  let targetVolume = normalVolume;

  for (const range of ranges) {
    const duckStart = range.start - transitionFrames;
    const duckEnd = range.end;
    const releaseEnd = range.end + transitionFrames;

    // Transition into duck
    if (frame >= duckStart && frame < range.start) {
      const duckProgress = fadeVolume(
        frame,
        duckStart,
        transitionFrames,
        normalVolume,
        duckedVolume
      );
      targetVolume = Math.min(targetVolume, duckProgress);
    }
    // Fully ducked
    else if (frame >= range.start && frame <= duckEnd) {
      targetVolume = Math.min(targetVolume, duckedVolume);
    }
    // Transition out of duck
    else if (frame > duckEnd && frame <= releaseEnd) {
      const releaseProgress = fadeVolume(
        frame,
        duckEnd,
        transitionFrames,
        duckedVolume,
        normalVolume
      );
      targetVolume = Math.min(targetVolume, releaseProgress);
    }
  }

  return targetVolume;
}

/**
 * Clamp volume to valid range
 */
export function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}

/**
 * Convert decibels to linear volume (0-1)
 */
export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

/**
 * Convert linear volume (0-1) to decibels
 */
export function linearToDb(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

/**
 * Mix multiple volume levels (multiplicative)
 */
export function mixVolumes(...volumes: number[]): number {
  return clampVolume(volumes.reduce((acc, vol) => acc * vol, 1));
}

/**
 * Calculate crossfade volumes for two tracks
 *
 * @param frame - Current frame
 * @param crossfadeStart - Frame at which crossfade begins
 * @param crossfadeDuration - Duration of crossfade in frames
 * @returns Object with outgoing and incoming volumes
 */
export function crossfadeVolumes(
  frame: number,
  crossfadeStart: number,
  crossfadeDuration: number
): { outgoing: number; incoming: number } {
  const outgoing = fadeVolume(frame, crossfadeStart, crossfadeDuration, 1, 0);
  const incoming = fadeVolume(frame, crossfadeStart, crossfadeDuration, 0, 1);

  return { outgoing, incoming };
}
