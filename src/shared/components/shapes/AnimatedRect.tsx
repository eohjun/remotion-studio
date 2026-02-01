import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Rect } from "@remotion/shapes";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { AnimatedRectProps } from "./types";

/**
 * AnimatedRect - Animated rectangle using @remotion/shapes
 *
 * Creates a rectangle or square with animations.
 *
 * @example
 * ```tsx
 * <AnimatedRect size={100} fill={COLORS.primary} />
 * <AnimatedRect width={200} height={100} cornerRadius={10} />
 * ```
 */
export const AnimatedRect: React.FC<AnimatedRectProps> = ({
  size = 100,
  width,
  height,
  fill = COLORS.primary,
  stroke,
  strokeWidth = 0,
  delay = 0,
  animate = true,
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
        config: SPRING_CONFIGS.normal,
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

  const rectWidth = width ?? size;
  const rectHeight = height ?? size;

  return (
    <div
      style={{
        width: rectWidth,
        height: rectHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
    >
      <Rect
        width={rectWidth}
        height={rectHeight}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        cornerRadius={cornerRadius}
      />
    </div>
  );
};

export default AnimatedRect;
