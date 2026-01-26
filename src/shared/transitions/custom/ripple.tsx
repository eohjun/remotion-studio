/**
 * Custom ripple transition presentation
 *
 * Creates a water ripple effect emanating from a point,
 * revealing the next scene in expanding circular waves.
 */
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type RippleProps = {
  /** Origin point of ripple: "center", "top-left", "top-right", "bottom-left", "bottom-right" */
  origin?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Number of ripple rings (default: 3) */
  rings?: number;
  /** Distortion amount (default: 20) */
  distortion?: number;
  /** Ripple color for edge highlight (default: "rgba(255,255,255,0.3)") */
  rippleColor?: string;
};

const RipplePresentation: React.FC<
  TransitionPresentationComponentProps<RippleProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const {
    origin = "center",
    rings = 3,
    distortion = 20,
    rippleColor = "rgba(255, 255, 255, 0.3)",
  } = passedProps;
  const { width, height } = useVideoConfig();
  const isEntering = presentationDirection === "entering";

  // Calculate origin coordinates
  const originCoords = {
    center: { x: width / 2, y: height / 2 },
    "top-left": { x: 0, y: 0 },
    "top-right": { x: width, y: 0 },
    "bottom-left": { x: 0, y: height },
    "bottom-right": { x: width, y: height },
  }[origin];

  // Calculate maximum radius needed to cover entire viewport
  const maxRadius = Math.sqrt(
    Math.max(originCoords.x, width - originCoords.x) ** 2 +
      Math.max(originCoords.y, height - originCoords.y) ** 2
  );

  // Calculate current ripple radius
  const progress = isEntering ? presentationProgress : 1 - presentationProgress;
  const currentRadius = interpolate(progress, [0, 1], [0, maxRadius * 1.5]);

  // Calculate opacity
  const opacity = isEntering
    ? interpolate(presentationProgress, [0, 0.2, 1], [0, 1, 1])
    : interpolate(presentationProgress, [0, 0.8, 1], [1, 1, 0]);

  // Create ripple rings
  const rippleRings = Array.from({ length: rings }, (_, i) => {
    const ringOffset = (i + 1) * (maxRadius * 0.15);
    const ringRadius = Math.max(0, currentRadius - ringOffset);
    const ringOpacity = interpolate(
      ringRadius,
      [0, maxRadius * 0.3, maxRadius],
      [0, 0.5, 0]
    );

    return {
      radius: ringRadius,
      opacity: ringOpacity,
    };
  });

  // Calculate scale distortion based on distance from ripple edge
  const scaleDistortion = interpolate(
    presentationProgress,
    [0, 0.3, 0.7, 1],
    [1, 1 + distortion / 100, 1 + distortion / 200, 1]
  );

  // Create clip path for circular reveal
  const clipRadius = Math.max(0, currentRadius);
  const clipPath = `circle(${clipRadius}px at ${originCoords.x}px ${originCoords.y}px)`;

  return (
    <AbsoluteFill>
      {/* Main content with clip path */}
      <AbsoluteFill
        style={{
          opacity,
          clipPath,
          WebkitClipPath: clipPath,
          transform: `scale(${scaleDistortion})`,
          transformOrigin: `${originCoords.x}px ${originCoords.y}px`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Ripple rings overlay */}
      {rippleRings.map(
        (ring, i) =>
          ring.radius > 0 &&
          ring.opacity > 0 && (
            <div
              key={i}
              style={{
                position: "absolute",
                left: originCoords.x - ring.radius,
                top: originCoords.y - ring.radius,
                width: ring.radius * 2,
                height: ring.radius * 2,
                borderRadius: "50%",
                border: `2px solid ${rippleColor}`,
                opacity: ring.opacity,
                pointerEvents: "none",
                boxShadow: `0 0 ${10 + i * 5}px ${rippleColor}`,
              }}
            />
          )
      )}

      {/* Edge highlight at the current ripple front */}
      {currentRadius > 0 && currentRadius < maxRadius * 1.5 && (
        <div
          style={{
            position: "absolute",
            left: originCoords.x - currentRadius,
            top: originCoords.y - currentRadius,
            width: currentRadius * 2,
            height: currentRadius * 2,
            borderRadius: "50%",
            border: `3px solid ${rippleColor}`,
            opacity: interpolate(presentationProgress, [0, 0.5, 1], [0, 0.8, 0]),
            pointerEvents: "none",
            boxShadow: `0 0 20px ${rippleColor}, inset 0 0 20px ${rippleColor}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Create a ripple transition presentation
 */
export const ripple = (props: RippleProps = {}): TransitionPresentation<RippleProps> => {
  return {
    component: RipplePresentation,
    props,
  };
};

export default ripple;
