import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Pie } from "@remotion/shapes";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { AnimatedPieProps } from "./types";

/**
 * AnimatedPie - Animated pie/arc shape using @remotion/shapes
 *
 * Creates a pie slice or full circle with animated progress.
 *
 * @example
 * ```tsx
 * <AnimatedPie size={100} progress={0.75} fill={COLORS.success} />
 * <AnimatedPie animateProgress startAngle={-90} />
 * ```
 */
export const AnimatedPie: React.FC<AnimatedPieProps> = ({
  size = 100,
  fill = COLORS.primary,
  stroke,
  strokeWidth = 0,
  delay = 0,
  animate = true,
  progress = 1,
  startAngle = 0,
  animateProgress = false,
  clockwise = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.normal,
      })
    : 1;

  // Scale from entry
  const scale = interpolate(entryProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opacity from entry
  const opacity = interpolate(entryProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated progress
  const animatedProgress = animateProgress
    ? spring({
        frame: frame - delay,
        fps,
        config: {
          ...SPRING_CONFIGS.normal,
          damping: 100,
        },
      }) * progress
    : progress;

  const radius = size / 2;

  // Pie component expects progress as 0-1 representing the arc completion
  // and rotation in radians for the start angle
  const rotationRadians = (startAngle * Math.PI) / 180;
  const directionMultiplier = clockwise ? 1 : -1;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      <Pie
        radius={radius}
        progress={animatedProgress * directionMultiplier}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        rotation={rotationRadians}
        closePath
      />
    </div>
  );
};

export default AnimatedPie;
