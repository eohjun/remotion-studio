import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Star } from "@remotion/shapes";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { AnimatedStarProps } from "./types";

/**
 * AnimatedStar - Animated star shape using @remotion/shapes
 *
 * Creates a star with optional rotation, pulsing, and entry animations.
 *
 * @example
 * ```tsx
 * <AnimatedStar size={100} points={5} fill={COLORS.accent} />
 * <AnimatedStar points={6} rotationSpeed={2} pulse />
 * ```
 */
export const AnimatedStar: React.FC<AnimatedStarProps> = ({
  size = 100,
  fill = COLORS.accent,
  stroke,
  strokeWidth = 0,
  delay = 0,
  animate = true,
  points = 5,
  innerRadius = 0.5,
  rotationSpeed = 0,
  pulse = false,
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

  // Continuous rotation
  const rotation = rotationSpeed * (frame - delay);

  // Pulsing scale effect
  const pulseScale = pulse
    ? 1 + Math.sin((frame - delay) * 0.1) * 0.1
    : 1;

  const outerRadius = size / 2;
  const actualInnerRadius = outerRadius * innerRadius;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale * pulseScale}) rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
    >
      <Star
        points={points}
        innerRadius={actualInnerRadius}
        outerRadius={outerRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

export default AnimatedStar;
