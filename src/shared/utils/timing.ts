/**
 * Timing utilities for Remotion video production
 * Handles conversions between frames, seconds, and various timing calculations
 */

/** Default FPS for calculations when not specified */
export const DEFAULT_FPS = 30;

/**
 * Convert frames to seconds
 */
export function framesToSeconds(frames: number, fps: number = DEFAULT_FPS): number {
  return frames / fps;
}

/**
 * Convert seconds to frames
 */
export function secondsToFrames(seconds: number, fps: number = DEFAULT_FPS): number {
  return Math.round(seconds * fps);
}

/**
 * Format frames as MM:SS time string
 */
export function framesToTimeString(frames: number, fps: number = DEFAULT_FPS): string {
  const totalSeconds = Math.floor(frames / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Calculate scene timing with buffer
 * Useful for creating scene timing configs from audio durations
 */
export interface SceneTiming {
  start: number;
  duration: number;
  end: number;
}

export function calculateSceneTiming(
  startFrame: number,
  durationInSeconds: number,
  fps: number = DEFAULT_FPS,
  bufferFrames: number = 15
): SceneTiming {
  const duration = secondsToFrames(durationInSeconds, fps) + bufferFrames;
  return {
    start: startFrame,
    duration,
    end: startFrame + duration,
  };
}

/**
 * Calculate cumulative scene timings from an array of durations
 */
export function calculateSceneTimings(
  durations: number[],
  fps: number = DEFAULT_FPS,
  bufferFrames: number = 15
): SceneTiming[] {
  const timings: SceneTiming[] = [];
  let currentStart = 0;

  for (const durationSeconds of durations) {
    const timing = calculateSceneTiming(currentStart, durationSeconds, fps, bufferFrames);
    timings.push(timing);
    currentStart = timing.end;
  }

  return timings;
}

/**
 * Get total duration from scene timings
 */
export function getTotalDuration(timings: SceneTiming[]): number {
  if (timings.length === 0) return 0;
  const lastScene = timings[timings.length - 1];
  return lastScene.end;
}

/**
 * Animation timing presets (in frames at 30fps)
 */
export const TIMING_PRESETS = {
  /** Quick entrance animation */
  quick: 10,
  /** Normal entrance animation */
  normal: 15,
  /** Slow entrance animation */
  slow: 25,
  /** Very slow for emphasis */
  emphasis: 40,

  /** Standard delay between title and content */
  titleToContent: 20,
  /** Standard delay between content items */
  itemStagger: 12,
  /** Delay for secondary elements */
  secondary: 30,
  /** Delay for final/conclusion elements */
  conclusion: 60,

  /** Scene transition fade duration */
  fadeIn: 15,
  fadeOut: 15,
} as const;

/**
 * Calculate animation delay relative to scene progress
 */
export function progressDelay(
  progress: number,
  threshold: number,
  baseDelay: number = 0
): number {
  return progress >= threshold ? baseDelay : Infinity;
}
