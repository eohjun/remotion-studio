import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SceneFrameResult {
  /** Current frame relative to scene start */
  frame: number;
  /** Progress from 0 to 1 within the scene */
  progress: number;
  /** Frames remaining in the scene */
  remaining: number;
  /** Whether the scene has started */
  hasStarted: boolean;
  /** Whether the scene is in its ending phase */
  isEnding: boolean;
  /** FPS from video config */
  fps: number;
}

export interface UseSceneFrameOptions {
  /** Duration of the scene in frames */
  duration: number;
  /** Start frame of the scene (default: 0) */
  start?: number;
  /** Frames before end to consider "ending" phase */
  endingThreshold?: number;
}

/**
 * Hook for calculating scene-relative frame values
 * Useful for managing animations within a scene context
 */
export function useSceneFrame(options: UseSceneFrameOptions): SceneFrameResult {
  const { duration, start = 0, endingThreshold = 30 } = options;
  const absoluteFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate scene-relative frame
  const frame = Math.max(0, absoluteFrame - start);
  const progress = Math.min(1, frame / duration);
  const remaining = Math.max(0, duration - frame);
  const hasStarted = absoluteFrame >= start;
  const isEnding = remaining <= endingThreshold;

  return {
    frame,
    progress,
    remaining,
    hasStarted,
    isEnding,
    fps,
  };
}

/**
 * Get frame value with delay applied
 * Returns 0 for negative values (before animation should start)
 */
export function delayedFrame(frame: number, delay: number): number {
  return Math.max(0, frame - delay);
}

/**
 * Calculate staggered delay for list items
 */
export function staggerDelay(
  baseDelay: number,
  index: number,
  staggerAmount: number = 15
): number {
  return baseDelay + index * staggerAmount;
}

export default useSceneFrame;
