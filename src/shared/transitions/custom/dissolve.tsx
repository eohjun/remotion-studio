/**
 * Custom dissolve (cross-fade) transition presentation
 *
 * Creates a cinematic cross-dissolve effect where the outgoing
 * scene fades out while the incoming scene fades in simultaneously.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

export type DissolveProps = {
  /** Blur amount during transition (default: 0) */
  blurAmount?: number;
  /** Whether to add a slight scale during dissolve (default: false) */
  addScale?: boolean;
};

const DissolvePresentation: React.FC<
  TransitionPresentationComponentProps<DissolveProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const { blurAmount = 0, addScale = false } = passedProps;
  const isEntering = presentationDirection === "entering";

  // Calculate opacity
  const opacity = isEntering
    ? presentationProgress
    : 1 - presentationProgress;

  // Calculate optional blur
  const blur = interpolate(
    presentationProgress,
    [0, 0.5, 1],
    isEntering ? [blurAmount, blurAmount / 2, 0] : [0, blurAmount / 2, blurAmount]
  );

  // Calculate optional scale
  const scale = addScale
    ? interpolate(
        presentationProgress,
        [0, 1],
        isEntering ? [1.02, 1] : [1, 0.98]
      )
    : 1;

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: blurAmount > 0 ? `blur(${blur}px)` : undefined,
        transform: addScale ? `scale(${scale})` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Create a dissolve transition presentation
 */
export const dissolve = (props: DissolveProps = {}): TransitionPresentation<DissolveProps> => {
  return {
    component: DissolvePresentation,
    props,
  };
};

export default dissolve;
