import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Triangle } from "@remotion/shapes";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { AnimatedTriangleProps } from "./types";

/**
 * AnimatedTriangle - Animated triangle using @remotion/shapes
 *
 * Creates a triangle pointing in specified direction with animations.
 *
 * @example
 * ```tsx
 * <AnimatedTriangle size={100} direction="up" fill={COLORS.warning} />
 * <AnimatedTriangle direction="right" rotationSpeed={0.5} />
 * ```
 */
export const AnimatedTriangle: React.FC<AnimatedTriangleProps> = ({
  size = 100,
  fill = COLORS.warning,
  stroke,
  strokeWidth = 0,
  delay = 0,
  animate = true,
  direction = "up",
  cornerRadius = 0,
  rotationSpeed = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.bouncy,
      })
    : 1;

  // Scale from entry
  const scale = interpolate(entryProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opacity from entry
  const opacity = interpolate(entryProgress, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Direction-based rotation (Triangle component points up by default)
  const directionRotation: Record<string, number> = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  };
  const baseRotation = directionRotation[direction] || 0;

  // Continuous rotation
  const rotation = baseRotation + rotationSpeed * (frame - delay);

  const length = size;
  const triangleHeight = (length * Math.sqrt(3)) / 2;

  return (
    <div
      style={{
        width: size,
        height: triangleHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: "center center",
        opacity,
        ...style,
      }}
    >
      <Triangle
        length={length}
        direction={direction}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        cornerRadius={cornerRadius}
      />
    </div>
  );
};

export default AnimatedTriangle;
