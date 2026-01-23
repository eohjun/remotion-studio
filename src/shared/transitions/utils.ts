/**
 * Utility functions for the transition system
 */
import { SceneDefinition, TransitionConfig } from "./types";
import { DEFAULT_TRANSITION_DURATION, TRANSITION_PRESETS } from "./presets";

/**
 * Calculate the total duration of a composition including transitions
 *
 * When using TransitionSeries, transitions overlap with scene content.
 * The total duration is: sum(scene durations) - sum(transition durations)
 * This is because each transition "borrows" time from both adjacent scenes.
 */
export const calculateTotalDuration = (
  scenes: SceneDefinition[],
  defaultTransition?: TransitionConfig
): number => {
  let totalDuration = 0;
  let totalTransitionDuration = 0;

  for (let i = 0; i < scenes.length; i++) {
    totalDuration += scenes[i].durationInFrames;

    // Add transition duration (except for last scene if no transition after)
    if (i < scenes.length - 1) {
      const transition = scenes[i].transition ?? defaultTransition;
      if (transition && transition.type !== "none") {
        totalTransitionDuration += transition.durationInFrames ?? DEFAULT_TRANSITION_DURATION;
      }
    }
  }

  // Transitions overlap, so we subtract their duration
  return totalDuration - totalTransitionDuration;
};

/**
 * Calculate scene start times accounting for transitions
 */
export const calculateSceneTimings = (
  scenes: SceneDefinition[],
  defaultTransition?: TransitionConfig
): Array<{ start: number; duration: number; transitionDuration: number }> => {
  const timings: Array<{ start: number; duration: number; transitionDuration: number }> = [];
  let currentStart = 0;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const transition = scene.transition ?? defaultTransition;
    const transitionDuration =
      transition && transition.type !== "none"
        ? (transition.durationInFrames ?? DEFAULT_TRANSITION_DURATION)
        : 0;

    timings.push({
      start: currentStart,
      duration: scene.durationInFrames,
      transitionDuration: i < scenes.length - 1 ? transitionDuration : 0,
    });

    // Next scene starts at current position + scene duration - transition overlap
    currentStart += scene.durationInFrames - (i < scenes.length - 1 ? transitionDuration : 0);
  }

  return timings;
};

/**
 * Convert TransitionConfig direction to @remotion/transitions direction
 */
export const mapDirection = (
  direction?: "from-left" | "from-right" | "from-top" | "from-bottom"
): "from-left" | "from-right" | "from-top" | "from-bottom" => {
  return direction ?? "from-left";
};

/**
 * Validate scene definitions
 */
export const validateScenes = (scenes: SceneDefinition[]): void => {
  if (scenes.length === 0) {
    throw new Error("At least one scene is required");
  }

  const ids = new Set<string>();
  for (const scene of scenes) {
    if (ids.has(scene.id)) {
      throw new Error(`Duplicate scene id: ${scene.id}`);
    }
    ids.add(scene.id);

    if (scene.durationInFrames <= 0) {
      throw new Error(`Scene "${scene.id}" has invalid duration: ${scene.durationInFrames}`);
    }
  }
};

/**
 * Get effective transition for a scene
 */
export const getEffectiveTransition = (
  scene: SceneDefinition,
  defaultTransition?: TransitionConfig
): TransitionConfig => {
  return scene.transition ?? defaultTransition ?? TRANSITION_PRESETS.fade;
};

/**
 * Format duration in frames to human readable time
 */
export const formatDuration = (frames: number, fps: number = 30): string => {
  const seconds = frames / fps;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
