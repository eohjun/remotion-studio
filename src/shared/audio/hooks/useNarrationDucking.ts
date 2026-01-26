/**
 * useNarrationDucking - Hook for automatic background music ducking
 *
 * Calculates appropriate background music volume based on narration timing,
 * automatically reducing music volume when narration is playing.
 */

import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import {
  advancedDuckVolume,
  ADVANCED_DUCKING_PRESETS,
  AdvancedDuckingConfig,
} from "../utils/advancedDucking";
import type { NarrationRange } from "../types";

/**
 * Narration segment with timing information
 */
export interface NarrationSegment {
  /** Start time in seconds or frames */
  start: number;
  /** End time in seconds or frames */
  end: number;
  /** Whether times are in seconds (default: true) */
  inSeconds?: boolean;
}

/**
 * Hook options
 */
export interface UseNarrationDuckingOptions {
  /** Narration segments (timing info) */
  narrationSegments: NarrationSegment[];
  /** Normal background music volume (0-1, default: 0.4) */
  normalVolume?: number;
  /** Ducking preset name or custom config */
  preset?: keyof typeof ADVANCED_DUCKING_PRESETS | AdvancedDuckingConfig;
  /** Whether narration times are in seconds (default: true) */
  timesInSeconds?: boolean;
  /** Disable ducking entirely */
  disabled?: boolean;
}

/**
 * Hook return type
 */
export interface UseNarrationDuckingResult {
  /** Current background music volume (0-1) */
  musicVolume: number;
  /** Whether currently ducking (narration is active) */
  isDucking: boolean;
  /** Gain reduction in dB (for metering) */
  gainReduction: number;
  /** Narration ranges in frames */
  narrationRanges: NarrationRange[];
}

/**
 * useNarrationDucking - Automatic background music ducking
 *
 * Automatically calculates background music volume based on narration timing.
 * Uses advanced ducking with configurable attack, release, and lookahead.
 *
 * @example
 * ```tsx
 * function MyScene() {
 *   const narrationSegments = [
 *     { start: 1, end: 5 },    // 1s to 5s
 *     { start: 8, end: 15 },   // 8s to 15s
 *   ];
 *
 *   const { musicVolume, isDucking } = useNarrationDucking({
 *     narrationSegments,
 *     normalVolume: 0.4,
 *     preset: 'natural',
 *   });
 *
 *   return (
 *     <>
 *       <Audio src={bgMusic} volume={musicVolume} />
 *       <Audio src={narration} />
 *       {isDucking && <DuckingIndicator />}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using frames directly
 * const { musicVolume } = useNarrationDucking({
 *   narrationSegments: [
 *     { start: 30, end: 150, inSeconds: false },
 *     { start: 240, end: 450, inSeconds: false },
 *   ],
 *   preset: 'cinematic',
 * });
 * ```
 */
export function useNarrationDucking(
  options: UseNarrationDuckingOptions
): UseNarrationDuckingResult {
  const {
    narrationSegments,
    normalVolume = 0.4,
    preset = "natural",
    timesInSeconds = true,
    disabled = false,
  } = options;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Convert narration segments to frame-based ranges
  const narrationRanges = useMemo((): NarrationRange[] => {
    return narrationSegments.map((segment) => {
      const useSeconds = segment.inSeconds ?? timesInSeconds;
      return {
        start: useSeconds ? Math.round(segment.start * fps) : segment.start,
        end: useSeconds ? Math.round(segment.end * fps) : segment.end,
      };
    });
  }, [narrationSegments, fps, timesInSeconds]);

  // Calculate current volume
  const result = useMemo(() => {
    if (disabled) {
      return {
        musicVolume: normalVolume,
        isDucking: false,
        gainReduction: 0,
        narrationRanges,
      };
    }

    const musicVolume = advancedDuckVolume(
      frame,
      narrationRanges,
      normalVolume,
      preset
    );

    // Determine if currently ducking
    const isDucking = musicVolume < normalVolume * 0.9;

    // Calculate gain reduction in dB
    const gainReduction =
      musicVolume > 0 ? 20 * Math.log10(musicVolume / normalVolume) : -60;

    return {
      musicVolume,
      isDucking,
      gainReduction,
      narrationRanges,
    };
  }, [frame, narrationRanges, normalVolume, preset, disabled]);

  return result;
}

/**
 * Generate narration ranges from audio duration array
 *
 * Utility to convert an array of audio durations into narration ranges.
 *
 * @param durations - Array of [startTime, duration] pairs in seconds
 * @returns Array of NarrationSegment
 */
export function createNarrationSegments(
  durations: Array<[number, number]>
): NarrationSegment[] {
  return durations.map(([start, duration]) => ({
    start,
    end: start + duration,
    inSeconds: true,
  }));
}

/**
 * Merge overlapping narration segments
 *
 * Combines segments that overlap to prevent ducking fluctuations.
 *
 * @param segments - Array of narration segments
 * @param gapThreshold - Minimum gap (seconds) to keep segments separate
 * @returns Merged segments
 */
export function mergeNarrationSegments(
  segments: NarrationSegment[],
  gapThreshold: number = 0.5
): NarrationSegment[] {
  if (segments.length === 0) return [];

  // Sort by start time
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const merged: NarrationSegment[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // If gap is small enough, merge
    if (current.start - last.end <= gapThreshold) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

export default useNarrationDucking;
