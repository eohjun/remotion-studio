import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Ellipse } from "@remotion/shapes";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { AnimatedEllipseProps } from "./types";

/**
 * AnimatedEllipse - Animated ellipse/circle using @remotion/shapes
 *
 * Creates an ellipse or circle with animations.
 *
 * @example
 * ```tsx
 * <AnimatedEllipse size={100} fill={COLORS.success} /> // Circle
 * <AnimatedEllipse rx={100} ry={50} pulse /> // Ellipse
 * ```
 */
export const AnimatedEllipse: React.FC<AnimatedEllipseProps> = ({
  size = 100,
  rx,
  ry,
  fill = COLORS.success,
  stroke,
  strokeWidth = 0,
  delay = 0,
  animate = true,
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

  const radiusX = rx ?? size / 2;
  const radiusY = ry ?? size / 2;
  const displayWidth = radiusX * 2;
  const displayHeight = radiusY * 2;

  return (
    <div
      style={{
        width: displayWidth,
        height: displayHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale * pulseScale}) rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
    >
      <Ellipse
        rx={radiusX}
        ry={radiusY}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

export default AnimatedEllipse;
