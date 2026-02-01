import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { evolvePath, getLength } from "@remotion/paths";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { SelfDrawingPathProps } from "./types";

/**
 * SelfDrawingPath - Animated path that draws itself
 *
 * Uses @remotion/paths evolvePath to create a pen-drawing effect
 * where the path appears to be drawn progressively.
 *
 * @example
 * ```tsx
 * <SelfDrawingPath
 *   path="M10 80 Q 95 10 180 80"
 *   stroke={COLORS.accent}
 *   drawDuration={60}
 * />
 * ```
 */
export const SelfDrawingPath: React.FC<SelfDrawingPathProps> = ({
  path,
  stroke = COLORS.primary,
  strokeWidth = 3,
  fill = "none",
  delay = 0,
  animate = true,
  width = 200,
  height = 200,
  drawDuration = 60,
  drawEasing = "ease-out",
  reverse = false,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate draw progress
  let drawProgress: number;

  if (animate) {
    const animationFrame = frame - delay;

    if (drawEasing === "linear") {
      drawProgress = interpolate(animationFrame, [0, drawDuration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      // Use spring for other easings
      drawProgress = spring({
        frame: animationFrame,
        fps,
        config: {
          ...SPRING_CONFIGS.normal,
          damping: drawEasing === "ease-in" ? 50 : drawEasing === "ease-out" ? 200 : 100,
        },
        durationInFrames: drawDuration,
      });
    }
  } else {
    drawProgress = 1;
  }

  // Reverse if needed
  const progress = reverse ? 1 - drawProgress : drawProgress;

  // Get stroke dash properties using @remotion/paths evolvePath
  // evolvePath returns { strokeDasharray, strokeDashoffset } for animating path drawing
  const strokeAnimation = evolvePath(progress, path);

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
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        strokeDasharray={strokeAnimation.strokeDasharray}
        strokeDashoffset={strokeAnimation.strokeDashoffset}
      />
    </svg>
  );
};

/**
 * Get the total length of a path (useful for timing calculations)
 */
export const getPathLength = getLength;

export default SelfDrawingPath;
