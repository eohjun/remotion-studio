/**
 * TransitionComposition - Wrapper component for scene-based compositions with transitions
 *
 * Uses @remotion/transitions TransitionSeries to handle transitions between scenes.
 */
import React from "react";
import { staticFile, useVideoConfig } from "remotion";
import { Audio } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
  TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

import { TransitionCompositionProps, TransitionConfig, SceneDefinition } from "./types";
import { DEFAULT_TRANSITION_DURATION, TRANSITION_PRESETS } from "./presets";
import { dissolve as customDissolve } from "./custom/dissolve";
import { zoom as customZoom } from "./custom/zoom";

/**
 * Get the presentation for a transition config
 */
const getPresentation = (
  config: TransitionConfig,
  width: number,
  height: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): TransitionPresentation<any> => {
  const { type, direction, perspective } = config;

  switch (type) {
    case "fade":
      return fade();

    case "slide":
      return slide({
        direction: direction ?? "from-left",
      });

    case "wipe":
      return wipe({
        direction: direction ?? "from-left",
      });

    case "flip":
      return flip({
        direction: direction === "from-top" || direction === "from-bottom" ? "from-top" : "from-left",
        perspective: perspective ?? 1000,
      });

    case "clockWipe":
      return clockWipe({ width, height });

    case "dissolve":
      return customDissolve({ blurAmount: 2, addScale: true });

    case "zoom":
      return customZoom({
        direction: direction === "from-right" ? "out" : "in",
      });

    case "none":
    default:
      return fade(); // Fallback, but shouldn't be used for "none"
  }
};

/**
 * Get timing configuration for a transition
 */
const getTiming = (config: TransitionConfig) => {
  const duration = config.durationInFrames ?? DEFAULT_TRANSITION_DURATION;

  if (config.springConfig) {
    return springTiming({
      config: config.springConfig,
      durationInFrames: duration,
      durationRestThreshold: 0.001,
    });
  }

  return linearTiming({ durationInFrames: duration });
};

/**
 * Render a scene with its audio
 */
const SceneWithAudio: React.FC<{
  scene: SceneDefinition;
}> = ({ scene }) => {
  const SceneComponent = scene.component;

  return (
    <>
      <SceneComponent durationInFrames={scene.durationInFrames} />
      {scene.audio && <Audio src={staticFile(scene.audio)} />}
    </>
  );
};

/**
 * TransitionComposition component
 *
 * Wraps scenes in TransitionSeries with configurable transitions between them.
 */
export const TransitionComposition: React.FC<TransitionCompositionProps> = ({
  scenes,
  defaultTransition = TRANSITION_PRESETS.fade,
  transitionAfterLast = false,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <TransitionSeries>
      {scenes.map((scene, index) => {
        const isLastScene = index === scenes.length - 1;
        const shouldAddTransition = !isLastScene || transitionAfterLast;
        const transition = scene.transition ?? defaultTransition;
        const hasTransition = shouldAddTransition && transition.type !== "none";

        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
              <SceneWithAudio scene={scene} />
            </TransitionSeries.Sequence>

            {hasTransition && (
              <TransitionSeries.Transition
                presentation={getPresentation(transition, width, height)}
                timing={getTiming(transition)}
              />
            )}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

export default TransitionComposition;
