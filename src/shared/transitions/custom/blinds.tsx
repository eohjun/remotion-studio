/**
 * Custom blinds transition presentation
 *
 * Creates a venetian blinds effect where the scene is divided
 * into horizontal or vertical strips that rotate to reveal the next scene.
 */
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type BlindsProps = {
  /** Number of blinds/strips (default: 10) */
  count?: number;
  /** Direction: "horizontal" or "vertical" (default: "horizontal") */
  direction?: "horizontal" | "vertical";
  /** Stagger delay between blinds animation (default: 0.1) */
  stagger?: number;
  /** Whether blinds rotate or slide (default: "rotate") */
  mode?: "rotate" | "slide";
};

const BlindsPresentation: React.FC<
  TransitionPresentationComponentProps<BlindsProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const {
    count = 10,
    direction = "horizontal",
    stagger = 0.1,
    mode = "rotate",
  } = passedProps;
  const { width, height } = useVideoConfig();
  const isEntering = presentationDirection === "entering";

  // Calculate blind dimensions
  const isHorizontal = direction === "horizontal";
  const blindSize = isHorizontal ? height / count : width / count;

  // Create blinds
  const blinds = Array.from({ length: count }, (_, i) => {
    // Calculate staggered progress for each blind
    const blindProgress = interpolate(
      presentationProgress,
      [
        Math.max(0, i * stagger - stagger),
        Math.min(1, i * stagger + (1 - stagger)),
      ],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Calculate rotation or position based on mode
    let rotation = 0;
    let translateValue = 0;

    if (mode === "rotate") {
      rotation = isEntering
        ? interpolate(blindProgress, [0, 1], [-90, 0])
        : interpolate(blindProgress, [0, 1], [0, 90]);
    } else {
      // Slide mode
      if (isHorizontal) {
        translateValue = isEntering
          ? interpolate(blindProgress, [0, 1], [-blindSize, 0])
          : interpolate(blindProgress, [0, 1], [0, blindSize]);
      } else {
        translateValue = isEntering
          ? interpolate(blindProgress, [0, 1], [-blindSize, 0])
          : interpolate(blindProgress, [0, 1], [0, blindSize]);
      }
    }

    // Calculate opacity
    const opacity = isEntering
      ? interpolate(blindProgress, [0, 0.3, 1], [0, 1, 1])
      : interpolate(blindProgress, [0, 0.7, 1], [1, 1, 0]);

    // Position
    const position = i * blindSize;

    // Transform based on direction and mode
    const transform =
      mode === "rotate"
        ? isHorizontal
          ? `rotateX(${rotation}deg)`
          : `rotateY(${rotation}deg)`
        : isHorizontal
          ? `translateY(${translateValue}px)`
          : `translateX(${translateValue}px)`;

    const transformOrigin = isHorizontal
      ? isEntering
        ? "center top"
        : "center bottom"
      : isEntering
        ? "left center"
        : "right center";

    return {
      position,
      transform,
      transformOrigin,
      opacity,
      size: blindSize,
    };
  });

  return (
    <AbsoluteFill style={{ perspective: 1000 }}>
      {blinds.map((blind, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            [isHorizontal ? "top" : "left"]: blind.position,
            [isHorizontal ? "height" : "width"]: blind.size,
            [isHorizontal ? "width" : "height"]: "100%",
            overflow: "hidden",
            transform: blind.transform,
            transformOrigin: blind.transformOrigin,
            opacity: blind.opacity,
            backfaceVisibility: "hidden",
          }}
        >
          {/* Content positioned to show correct slice */}
          <div
            style={{
              position: "absolute",
              top: isHorizontal ? -blind.position : 0,
              left: isHorizontal ? 0 : -blind.position,
              width,
              height,
            }}
          >
            {children}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/**
 * Create a blinds transition presentation
 */
export const blinds = (props: BlindsProps = {}): TransitionPresentation<BlindsProps> => {
  return {
    component: BlindsPresentation,
    props,
  };
};

export default blinds;
