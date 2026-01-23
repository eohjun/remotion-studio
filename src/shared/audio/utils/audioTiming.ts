/**
 * Audio Timing Utilities
 *
 * Functions for converting between time units and calculating loop points.
 */

import type { LoopPoints, AudioTiming } from "../types";

/**
 * Convert seconds to frames
 *
 * @param seconds - Duration in seconds
 * @param fps - Frames per second (default: 30)
 * @returns Number of frames
 *
 * @example
 * const frames = secondsToFrames(2.5, 30); // 75
 */
export function secondsToFrames(seconds: number, fps: number = 30): number {
  return Math.round(seconds * fps);
}

/**
 * Convert frames to seconds
 *
 * @param frames - Number of frames
 * @param fps - Frames per second (default: 30)
 * @returns Duration in seconds
 *
 * @example
 * const seconds = framesToSeconds(90, 30); // 3
 */
export function framesToSeconds(frames: number, fps: number = 30): number {
  return frames / fps;
}

/**
 * Convert milliseconds to frames
 */
export function msToFrames(ms: number, fps: number = 30): number {
  return Math.round((ms / 1000) * fps);
}

/**
 * Convert frames to milliseconds
 */
export function framesToMs(frames: number, fps: number = 30): number {
  return (frames / fps) * 1000;
}

/**
 * Get audio timing in both frames and seconds
 */
export function getAudioTiming(
  durationInSeconds: number,
  fps: number = 30
): AudioTiming {
  return {
    frames: secondsToFrames(durationInSeconds, fps),
    seconds: durationInSeconds,
  };
}

/**
 * Calculate loop points for audio to fit scene duration
 *
 * Determines how many times to loop audio and when to start fade out
 * to smoothly end at the scene boundary.
 *
 * @param audioDuration - Duration of audio in seconds
 * @param sceneDuration - Duration of scene in frames
 * @param fps - Frames per second (default: 30)
 * @param fadeOutDuration - Fade out duration in frames (default: 60)
 * @returns Loop points configuration
 *
 * @example
 * // 30-second audio for a 900-frame (30 second) scene
 * const points = calculateLoopPoints(30, 900, 30, 60);
 * // { loopCount: 1, fadeOutStart: 840 }
 */
export function calculateLoopPoints(
  audioDuration: number,
  sceneDuration: number,
  fps: number = 30,
  fadeOutDuration: number = 60
): LoopPoints {
  const audioFrames = secondsToFrames(audioDuration, fps);

  // Calculate how many full loops we need
  const loopCount = Math.ceil(sceneDuration / audioFrames);

  // Calculate when to start fade out
  const fadeOutStart = sceneDuration - fadeOutDuration;

  return {
    loopCount,
    fadeOutStart: Math.max(0, fadeOutStart),
  };
}

/**
 * Calculate the offset frame for syncing audio to a specific point
 *
 * @param targetFrame - Frame where audio event should occur
 * @param audioEventTime - Time in the audio where the event occurs (seconds)
 * @param fps - Frames per second
 * @returns Start frame to sync the audio event to target frame
 *
 * @example
 * // Sync a beat at 1.5s in audio to appear at frame 90
 * const startFrame = calculateAudioOffset(90, 1.5, 30); // 45
 */
export function calculateAudioOffset(
  targetFrame: number,
  audioEventTime: number,
  fps: number = 30
): number {
  const audioEventFrame = secondsToFrames(audioEventTime, fps);
  return targetFrame - audioEventFrame;
}

/**
 * Format frame count as timecode (MM:SS:FF)
 */
export function framesToTimecode(frames: number, fps: number = 30): string {
  const totalSeconds = Math.floor(frames / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remainingFrames = frames % fps;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${remainingFrames.toString().padStart(2, "0")}`;
}

/**
 * Format seconds as MM:SS
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Calculate beat frames for music synchronization
 *
 * @param bpm - Beats per minute
 * @param fps - Frames per second
 * @param startFrame - Starting frame (default: 0)
 * @param count - Number of beats to calculate
 * @returns Array of frame numbers where beats occur
 *
 * @example
 * const beats = calculateBeatFrames(120, 30, 0, 8);
 * // [0, 15, 30, 45, 60, 75, 90, 105]
 */
export function calculateBeatFrames(
  bpm: number,
  fps: number = 30,
  startFrame: number = 0,
  count: number = 16
): number[] {
  const framesPerBeat = (60 / bpm) * fps;
  const beats: number[] = [];

  for (let i = 0; i < count; i++) {
    beats.push(Math.round(startFrame + i * framesPerBeat));
  }

  return beats;
}

/**
 * Check if current frame is on a beat
 */
export function isOnBeat(
  frame: number,
  bpm: number,
  fps: number = 30,
  tolerance: number = 1
): boolean {
  const framesPerBeat = (60 / bpm) * fps;
  const remainder = frame % framesPerBeat;

  return remainder <= tolerance || framesPerBeat - remainder <= tolerance;
}

/**
 * Get the nearest beat frame
 */
export function getNearestBeatFrame(
  frame: number,
  bpm: number,
  fps: number = 30
): number {
  const framesPerBeat = (60 / bpm) * fps;
  return Math.round(frame / framesPerBeat) * framesPerBeat;
}
