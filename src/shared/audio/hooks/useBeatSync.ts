/**
 * useBeatSync - Hook for beat-synchronized animations
 *
 * Provides timing information and helpers for syncing visual elements
 * to music beats, creating rhythmic visual effects.
 */

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useMemo } from "react";
import {
  calculateBeatFrames,
  isOnBeat,
  getNearestBeatFrame,
} from "../utils/audioTiming";

/**
 * Beat configuration
 */
export interface BeatConfig {
  /** Beats per minute of the music */
  bpm: number;
  /** Start frame for beat calculation (default: 0) */
  startFrame?: number;
  /** Beat subdivision (1 = quarter notes, 2 = eighth notes, etc.) */
  subdivision?: number;
  /** Tolerance in frames for beat detection */
  tolerance?: number;
}

/**
 * Beat info returned by the hook
 */
export interface BeatInfo {
  /** Current beat number (0-indexed) */
  beatNumber: number;
  /** Progress through current beat (0-1) */
  beatProgress: number;
  /** Whether exactly on a beat (within tolerance) */
  isOnBeat: boolean;
  /** Frames since last beat */
  framesSinceBeat: number;
  /** Frames until next beat */
  framesUntilBeat: number;
  /** Frames per beat at this BPM */
  framesPerBeat: number;
}

/**
 * Hook return type
 */
export interface UseBeatSyncResult extends BeatInfo {
  /** Get pulse animation value (0-1, peaks on beat) */
  getPulse: (options?: PulseOptions) => number;
  /** Get scale animation for beat emphasis */
  getScale: (options?: ScaleOptions) => number;
  /** Get opacity that pulses on beat */
  getOpacity: (options?: OpacityOptions) => number;
  /** Check if current frame is on a specific beat number */
  isOnBeatNumber: (beatNumber: number) => boolean;
  /** Array of all beat frame numbers */
  beatFrames: number[];
  /** Get beat-synced spring value */
  getBeatSpring: (options?: SpringOptions) => number;
}

interface PulseOptions {
  /** Peak value on beat (default: 1) */
  peak?: number;
  /** Minimum value between beats (default: 0) */
  min?: number;
  /** Decay speed (frames to reach min, default: fps/4) */
  decay?: number;
}

interface ScaleOptions {
  /** Scale on beat (default: 1.1) */
  beatScale?: number;
  /** Normal scale (default: 1) */
  normalScale?: number;
  /** Decay speed */
  decay?: number;
}

interface OpacityOptions {
  /** Opacity on beat (default: 1) */
  beatOpacity?: number;
  /** Opacity between beats (default: 0.7) */
  normalOpacity?: number;
  /** Decay speed */
  decay?: number;
}

interface SpringOptions {
  /** Spring damping (default: 10) */
  damping?: number;
  /** Spring stiffness (default: 100) */
  stiffness?: number;
  /** Spring mass (default: 0.5) */
  mass?: number;
}

/**
 * useBeatSync - Beat-synchronized animation hook
 *
 * Provides beat timing information and helper functions for creating
 * animations that sync to music rhythm.
 *
 * @example
 * ```tsx
 * function PulsingCircle({ bpm = 120 }) {
 *   const { getPulse, getScale, isOnBeat } = useBeatSync({ bpm });
 *
 *   return (
 *     <div style={{
 *       width: 100,
 *       height: 100,
 *       borderRadius: '50%',
 *       backgroundColor: isOnBeat ? '#ff0000' : '#ffffff',
 *       transform: `scale(${getScale()})`,
 *       opacity: getPulse({ min: 0.5 }),
 *     }} />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Staggered elements on different beats
 * function BeatBars({ bpm }) {
 *   const { isOnBeatNumber, beatNumber } = useBeatSync({ bpm });
 *
 *   return (
 *     <div style={{ display: 'flex', gap: 10 }}>
 *       {[0, 1, 2, 3].map(i => (
 *         <div
 *           key={i}
 *           style={{
 *             width: 20,
 *             height: 100,
 *             backgroundColor: (beatNumber % 4 === i) ? 'red' : 'gray',
 *           }}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBeatSync(config: BeatConfig): UseBeatSyncResult {
  const { bpm, startFrame = 0, subdivision = 1, tolerance = 2 } = config;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate beat timing info
  const beatInfo = useMemo((): BeatInfo => {
    const effectiveBpm = bpm * subdivision;
    const framesPerBeat = (60 / effectiveBpm) * fps;

    const adjustedFrame = frame - startFrame;
    if (adjustedFrame < 0) {
      return {
        beatNumber: -1,
        beatProgress: 0,
        isOnBeat: false,
        framesSinceBeat: 0,
        framesUntilBeat: Math.abs(adjustedFrame),
        framesPerBeat,
      };
    }

    const beatNumber = Math.floor(adjustedFrame / framesPerBeat);
    const beatProgress = (adjustedFrame % framesPerBeat) / framesPerBeat;
    const framesSinceBeat = adjustedFrame % framesPerBeat;
    const framesUntilBeat = framesPerBeat - framesSinceBeat;

    return {
      beatNumber,
      beatProgress,
      isOnBeat: isOnBeat(adjustedFrame, effectiveBpm, fps, tolerance),
      framesSinceBeat,
      framesUntilBeat,
      framesPerBeat,
    };
  }, [frame, startFrame, bpm, subdivision, fps, tolerance]);

  // Pre-calculate beat frames for the video
  const beatFrames = useMemo(() => {
    const effectiveBpm = bpm * subdivision;
    // Calculate enough beats for typical video length (10 min)
    return calculateBeatFrames(effectiveBpm, fps, startFrame, 600);
  }, [bpm, subdivision, fps, startFrame]);

  // Pulse animation (peaks on beat, decays between beats)
  const getPulse = useMemo(
    () =>
      (options: PulseOptions = {}): number => {
        const { peak = 1, min = 0, decay = fps / 4 } = options;

        const decayProgress = Math.min(1, beatInfo.framesSinceBeat / decay);
        const value = interpolate(decayProgress, [0, 1], [peak, min], {
          extrapolateRight: "clamp",
        });

        return value;
      },
    [beatInfo.framesSinceBeat, fps]
  );

  // Scale animation for beat emphasis
  const getScale = useMemo(
    () =>
      (options: ScaleOptions = {}): number => {
        const {
          beatScale = 1.1,
          normalScale = 1,
          decay = fps / 4,
        } = options;

        const decayProgress = Math.min(1, beatInfo.framesSinceBeat / decay);
        return interpolate(decayProgress, [0, 1], [beatScale, normalScale], {
          extrapolateRight: "clamp",
        });
      },
    [beatInfo.framesSinceBeat, fps]
  );

  // Opacity animation for beat pulse
  const getOpacity = useMemo(
    () =>
      (options: OpacityOptions = {}): number => {
        const {
          beatOpacity = 1,
          normalOpacity = 0.7,
          decay = fps / 4,
        } = options;

        const decayProgress = Math.min(1, beatInfo.framesSinceBeat / decay);
        return interpolate(
          decayProgress,
          [0, 1],
          [beatOpacity, normalOpacity],
          { extrapolateRight: "clamp" }
        );
      },
    [beatInfo.framesSinceBeat, fps]
  );

  // Check if on specific beat number
  const isOnBeatNumber = useMemo(
    () =>
      (targetBeat: number): boolean => {
        return beatInfo.beatNumber === targetBeat && beatInfo.isOnBeat;
      },
    [beatInfo.beatNumber, beatInfo.isOnBeat]
  );

  // Beat-synced spring (triggers on each beat)
  const getBeatSpring = useMemo(
    () =>
      (options: SpringOptions = {}): number => {
        const { damping = 10, stiffness = 100, mass = 0.5 } = options;

        // Reset spring on each beat
        const beatStartFrame =
          getNearestBeatFrame(frame - startFrame, bpm * subdivision, fps) +
          startFrame;

        return spring({
          fps,
          frame: frame - beatStartFrame,
          config: { damping, stiffness, mass },
        });
      },
    [frame, startFrame, bpm, subdivision, fps]
  );

  return {
    ...beatInfo,
    getPulse,
    getScale,
    getOpacity,
    isOnBeatNumber,
    beatFrames,
    getBeatSpring,
  };
}

/**
 * Calculate bar number from beat (assuming 4/4 time)
 */
export function getBarNumber(beatNumber: number, beatsPerBar: number = 4): number {
  return Math.floor(beatNumber / beatsPerBar);
}

/**
 * Get beat position within bar (0-indexed)
 */
export function getBeatInBar(beatNumber: number, beatsPerBar: number = 4): number {
  return beatNumber % beatsPerBar;
}

/**
 * Check if on downbeat (first beat of bar)
 */
export function isDownbeat(beatNumber: number, beatsPerBar: number = 4): boolean {
  return beatNumber % beatsPerBar === 0;
}

export default useBeatSync;
