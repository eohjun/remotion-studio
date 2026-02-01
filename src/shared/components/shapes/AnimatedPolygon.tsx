import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Polygon } from "@remotion/shapes";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { AnimatedPolygonProps } from "./types";

/**
 * AnimatedPolygon - Animated regular polygon using @remotion/shapes
 *
 * Creates regular polygons (triangles, squares, hexagons, etc.) with animations.
 *
 * @example
 * ```tsx
 * <AnimatedPolygon sides={6} size={100} fill={COLORS.accent} />
 * <AnimatedPolygon sides={3} rotationSpeed={1} cornerRadius={5} />
 * ```
 */
export const AnimatedPolygon: React.FC<AnimatedPolygonProps> = ({
  size = 100,
  fill = COLORS.secondary,
  stroke,
  strokeWidth = 0,
  delay = 0,
  animate = true,
  sides = 6,
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

  // Continuous rotation
  const rotation = rotationSpeed * (frame - delay);

  const radius = size / 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
    >
      <Polygon
        points={sides}
        radius={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        cornerRadius={cornerRadius}
      />
    </div>
  );
};

export default AnimatedPolygon;
