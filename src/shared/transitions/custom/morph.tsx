/**
 * Custom morph transition presentation
 *
 * Creates a morphing transition where one scene transforms
 * into another with scaling, rotation, and blur effects.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type MorphProps = {
  /** Rotation amount in degrees (default: 5) */
  rotation?: number;
  /** Scale factor during transition (default: 1.1) */
  scaleFactor?: number;
  /** Blur amount during mid-transition (default: 8) */
  blurAmount?: number;
  /** Morph direction: "left", "right", "center" (default: "center") */
  direction?: "left" | "right" | "center";
};

const MorphPresentation: React.FC<
  TransitionPresentationComponentProps<MorphProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const {
    rotation = 5,
    scaleFactor = 1.1,
    blurAmount = 8,
    direction = "center",
  } = passedProps;
  const isEntering = presentationDirection === "entering";

  // Calculate opacity with overlap
  const opacity = isEntering
    ? interpolate(presentationProgress, [0, 0.3, 1], [0, 1, 1])
    : interpolate(presentationProgress, [0, 0.7, 1], [1, 1, 0]);

  // Calculate scale - bulge during transition
  const scale = interpolate(
    presentationProgress,
    [0, 0.5, 1],
    isEntering ? [0.9, scaleFactor, 1] : [1, scaleFactor, 0.9]
  );

  // Calculate rotation based on direction
  let rotationValue: number;
  if (direction === "center") {
    rotationValue = 0;
  } else {
    const rotationDirection = direction === "right" ? 1 : -1;
    rotationValue = interpolate(
      presentationProgress,
      [0, 0.5, 1],
      isEntering
        ? [rotation * rotationDirection, 0, 0]
        : [0, 0, -rotation * rotationDirection]
    );
  }

  // Calculate blur - peaks at middle of transition
  const blur = interpolate(
    presentationProgress,
    [0, 0.4, 0.6, 1],
    [0, blurAmount, blurAmount, 0]
  );

  // Calculate transform origin based on direction
  const transformOrigin =
    direction === "left"
      ? "left center"
      : direction === "right"
        ? "right center"
        : "center center";

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: blurAmount > 0 ? `blur(${blur}px)` : undefined,
        transform: `scale(${scale}) rotate(${rotationValue}deg)`,
        transformOrigin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Create a morph transition presentation
 */
export const morph = (props: MorphProps = {}): TransitionPresentation<MorphProps> => {
  return {
    component: MorphPresentation,
    props,
  };
};

export default morph;
