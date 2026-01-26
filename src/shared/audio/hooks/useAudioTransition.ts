/**
 * useAudioTransition - Hook for audio crossfades between scenes
 *
 * Provides volume calculations for smooth audio transitions
 * using various crossfade curve types.
 */

import { useCurrentFrame } from "remotion";
import { useMemo } from "react";
import {
  crossfade,
  CrossfadeConfig,
  CrossfadeVolumes,
  CrossfadeCurve,
  getCombinedPower,
} from "../utils/crossfade";

/**
 * Transition timing configuration
 */
export interface TransitionTiming {
  /** Frame where transition starts */
  startFrame: number;
  /** Duration of transition in frames */
  durationFrames: number;
}

/**
 * Hook options
 */
export interface UseAudioTransitionOptions {
  /** Transition timing */
  timing: TransitionTiming;
  /** Crossfade curve type (default: equal-power) */
  curve?: CrossfadeCurve;
  /** Maximum volume (default: 1) */
  maxVolume?: number;
  /** Overlap adjustment (default: 1) */
  overlap?: number;
}

/**
 * Hook return type
 */
export interface UseAudioTransitionResult {
  /** Volume for outgoing audio (fading out) */
  outgoingVolume: number;
  /** Volume for incoming audio (fading in) */
  incomingVolume: number;
  /** Progress through transition (0-1) */
  progress: number;
  /** Whether currently in transition */
  isTransitioning: boolean;
  /** Combined power level (for metering) */
  combinedPower: number;
  /** Phase: 'before' | 'during' | 'after' */
  phase: "before" | "during" | "after";
}

/**
 * useAudioTransition - Audio crossfade hook
 *
 * Calculates volume levels for two audio tracks during a crossfade transition.
 * Supports multiple curve types including equal-power for constant loudness.
 *
 * @example
 * ```tsx
 * function SceneTransition({ transitionFrame }) {
 *   const { outgoingVolume, incomingVolume, isTransitioning } = useAudioTransition({
 *     timing: { startFrame: transitionFrame, durationFrames: 30 },
 *     curve: 'equal-power',
 *   });
 *
 *   return (
 *     <>
 *       <Audio src={sceneAMusic} volume={outgoingVolume} />
 *       <Audio src={sceneBMusic} volume={incomingVolume} />
 *       {isTransitioning && <TransitionOverlay />}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With fade-out only (no incoming track)
 * function FadeOutScene({ endFrame }) {
 *   const { outgoingVolume } = useAudioTransition({
 *     timing: { startFrame: endFrame - 60, durationFrames: 60 },
 *     curve: 's-curve',
 *   });
 *
 *   return <Audio src={sceneMusic} volume={outgoingVolume} />;
 * }
 * ```
 */
export function useAudioTransition(
  options: UseAudioTransitionOptions
): UseAudioTransitionResult {
  const {
    timing,
    curve = "equal-power",
    maxVolume = 1,
    overlap = 1,
  } = options;

  const frame = useCurrentFrame();

  const result = useMemo(() => {
    const { startFrame, durationFrames } = timing;
    const endFrame = startFrame + durationFrames;

    // Determine phase
    let phase: "before" | "during" | "after";
    if (frame < startFrame) {
      phase = "before";
    } else if (frame > endFrame) {
      phase = "after";
    } else {
      phase = "during";
    }

    // Calculate crossfade volumes
    const config: CrossfadeConfig = { curve, maxVolume, overlap };
    const volumes: CrossfadeVolumes = crossfade(
      frame,
      startFrame,
      durationFrames,
      config
    );

    // Calculate progress
    const progress = Math.max(
      0,
      Math.min(1, (frame - startFrame) / durationFrames)
    );

    return {
      outgoingVolume: volumes.outgoing,
      incomingVolume: volumes.incoming,
      progress,
      isTransitioning: phase === "during",
      combinedPower: getCombinedPower(volumes),
      phase,
    };
  }, [frame, timing, curve, maxVolume, overlap]);

  return result;
}

/**
 * Scene audio configuration
 */
export interface SceneAudioConfig {
  /** Scene start frame */
  startFrame: number;
  /** Scene end frame */
  endFrame: number;
  /** Scene audio source */
  src?: string;
  /** Base volume for this scene */
  volume?: number;
}

/**
 * Multi-scene audio transition hook options
 */
export interface UseMultiSceneAudioOptions {
  /** Array of scene configurations */
  scenes: SceneAudioConfig[];
  /** Crossfade duration between scenes */
  crossfadeDuration: number;
  /** Crossfade curve type */
  curve?: CrossfadeCurve;
}

/**
 * useMultiSceneAudio - Handle audio across multiple scenes
 *
 * Returns volume array for each scene, handling crossfades automatically.
 *
 * @example
 * ```tsx
 * function VideoWithScenes() {
 *   const scenes = [
 *     { startFrame: 0, endFrame: 300, volume: 0.5 },
 *     { startFrame: 270, endFrame: 600, volume: 0.6 },
 *     { startFrame: 570, endFrame: 900, volume: 0.4 },
 *   ];
 *
 *   const volumes = useMultiSceneAudio({
 *     scenes,
 *     crossfadeDuration: 30,
 *     curve: 'equal-power',
 *   });
 *
 *   return (
 *     <>
 *       {scenes.map((scene, i) => (
 *         <Audio key={i} src={scene.src} volume={volumes[i]} />
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export function useMultiSceneAudio(
  options: UseMultiSceneAudioOptions
): number[] {
  const { scenes, crossfadeDuration, curve = "equal-power" } = options;

  const frame = useCurrentFrame();

  return useMemo(() => {
    return scenes.map((scene, index) => {
      const baseVolume = scene.volume ?? 1;

      // Before scene starts
      if (frame < scene.startFrame) {
        // Check if we should be fading in
        if (index > 0) {
          const prevScene = scenes[index - 1];
          const fadeStart = prevScene.endFrame - crossfadeDuration;
          if (frame >= fadeStart) {
            const { incoming } = crossfade(
              frame,
              fadeStart,
              crossfadeDuration,
              { curve }
            );
            return incoming * baseVolume;
          }
        }
        return 0;
      }

      // After scene ends
      if (frame > scene.endFrame) {
        return 0;
      }

      // During scene
      let volume = baseVolume;

      // Fade in
      if (index > 0 && frame < scene.startFrame + crossfadeDuration) {
        const prevScene = scenes[index - 1];
        const fadeStart = prevScene.endFrame - crossfadeDuration;
        const { incoming } = crossfade(frame, fadeStart, crossfadeDuration, {
          curve,
        });
        volume = incoming * baseVolume;
      }

      // Fade out
      if (
        index < scenes.length - 1 &&
        frame > scene.endFrame - crossfadeDuration
      ) {
        const { outgoing } = crossfade(
          frame,
          scene.endFrame - crossfadeDuration,
          crossfadeDuration,
          { curve }
        );
        volume = outgoing * baseVolume;
      }

      return volume;
    });
  }, [frame, scenes, crossfadeDuration, curve]);
}

/**
 * Create transition timing from seconds
 */
export function createTransitionTiming(
  startSeconds: number,
  durationSeconds: number,
  fps: number
): TransitionTiming {
  return {
    startFrame: Math.round(startSeconds * fps),
    durationFrames: Math.round(durationSeconds * fps),
  };
}

export default useAudioTransition;
