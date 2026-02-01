import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { warpPath } from "@remotion/paths";
import { COLORS } from "../constants";
import { WarpedPathProps } from "./types";

/**
 * LiquidPath - Animated path with liquid/wave distortion effect
 *
 * Uses @remotion/paths warpPath to create a fluid, organic
 * animation effect on any SVG path.
 *
 * @example
 * ```tsx
 * <LiquidPath
 *   path="M10 50 L 100 50 L 150 50"
 *   stroke={COLORS.accent}
 *   waveCount={3}
 *   amplitude={10}
 * />
 * ```
 */
export const LiquidPath: React.FC<WarpedPathProps> = ({
  path,
  stroke = COLORS.primary,
  strokeWidth = 3,
  fill = "none",
  delay = 0,
  animate = true,
  width = 200,
  height = 200,
  waveCount = 2,
  amplitude = 5,
  speed = 1,
  direction = "vertical",
  style,
}) => {
  const frame = useCurrentFrame();

  // Calculate wave phase based on frame
  const animationFrame = animate ? frame - delay : 0;
  const phase = (animationFrame * speed * 0.1) % (Math.PI * 2);

  // Warp function for liquid effect
  // warpPath callback receives { x, y } for each point along the path
  const warpedPath = warpPath(path, ({ x, y }) => {
    // Use position along path for wave calculation
    // Normalize based on x coordinate for horizontal paths, y for vertical
    const normalizedPos = direction === "horizontal" ? y / height : x / width;
    const wavePosition = normalizedPos * waveCount * Math.PI * 2;

    // Calculate wave offset
    const waveOffset = Math.sin(wavePosition + phase) * amplitude;

    // Apply warp based on direction
    switch (direction) {
      case "horizontal":
        return { x: x + waveOffset, y };
      case "vertical":
        return { x, y: y + waveOffset };
      case "both":
        return {
          x: x + Math.sin(wavePosition + phase) * amplitude * 0.5,
          y: y + Math.cos(wavePosition + phase) * amplitude * 0.5,
        };
      default:
        return { x, y: y + waveOffset };
    }
  });

  // Entry opacity
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        opacity,
        ...style,
      }}
    >
      <path
        d={warpedPath}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LiquidPath;
