import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { LightLeakProps, LightLeakPosition, LightLeakType } from "./types";

/**
 * Get gradient direction based on position
 */
function getGradientAngle(position: LightLeakPosition): number {
  switch (position) {
    case "top-left":
      return 135;
    case "top-right":
      return 225;
    case "bottom-left":
      return 45;
    case "bottom-right":
      return 315;
    case "center":
      return 90;
    default:
      return 135;
  }
}

/**
 * Get transform origin based on position
 */
function getTransformOrigin(position: LightLeakPosition): string {
  switch (position) {
    case "top-left":
      return "top left";
    case "top-right":
      return "top right";
    case "bottom-left":
      return "bottom left";
    case "bottom-right":
      return "bottom right";
    case "center":
      return "center";
    default:
      return "top left";
  }
}

/**
 * Generate gradient for different light leak types
 */
function getLightLeakGradient(
  type: LightLeakType,
  color: string,
  angle: number
): string {
  switch (type) {
    case "gradient":
      return `linear-gradient(${angle}deg, ${color} 0%, transparent 70%)`;

    case "flare":
      return `radial-gradient(ellipse at center, ${color} 0%, ${color}80 30%, transparent 70%)`;

    case "streak":
      return `linear-gradient(${angle}deg, transparent 20%, ${color}40 40%, ${color} 50%, ${color}40 60%, transparent 80%)`;

    default:
      return `linear-gradient(${angle}deg, ${color} 0%, transparent 70%)`;
  }
}

/**
 * LightLeak - Cinematic light leak overlay effect
 *
 * Creates a colored light leak effect typically seen in analog film.
 * Supports multiple styles: gradient, flare, and streak.
 *
 * Can be animated to create a dynamic, organic feel.
 */
export const LightLeak: React.FC<LightLeakProps> = ({
  color = "rgba(255, 150, 50, 0.5)",
  position = "top-left",
  intensity = 0.3,
  animated = false,
  type = "gradient",
  cycleDuration = 90,
  children,
}) => {
  const frame = useCurrentFrame();

  const angle = getGradientAngle(position);
  const transformOrigin = getTransformOrigin(position);

  // Calculate animation values
  const animationValues = useMemo(() => {
    if (!animated) {
      return { scale: 1, opacity: intensity, rotation: 0 };
    }

    const cycleProgress = (frame % cycleDuration) / cycleDuration;

    // Gentle pulsing effect
    const scale = interpolate(cycleProgress, [0, 0.5, 1], [1, 1.1, 1]);

    // Subtle opacity variation
    const opacity = interpolate(
      cycleProgress,
      [0, 0.5, 1],
      [intensity, intensity * 1.2, intensity]
    );

    // Slight rotation for organic feel
    const rotation = interpolate(cycleProgress, [0, 0.5, 1], [-2, 2, -2]);

    return { scale, opacity, rotation };
  }, [frame, cycleDuration, animated, intensity]);

  const lightLeakStyle: React.CSSProperties = {
    background: getLightLeakGradient(type, color, angle),
    opacity: animationValues.opacity,
    transform: `scale(${animationValues.scale}) rotate(${animationValues.rotation}deg)`,
    transformOrigin,
    mixBlendMode: "screen",
    pointerEvents: "none",
  };

  // Position-specific sizing for flare type
  const positionStyle: React.CSSProperties =
    type === "flare"
      ? {
          width: "80%",
          height: "80%",
          top: position.includes("top") ? "-20%" : "auto",
          bottom: position.includes("bottom") ? "-20%" : "auto",
          left: position.includes("left") ? "-20%" : "auto",
          right: position.includes("right") ? "-20%" : "auto",
        }
      : {};

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ ...lightLeakStyle, ...positionStyle }} />
    </AbsoluteFill>
  );
};

export default LightLeak;
