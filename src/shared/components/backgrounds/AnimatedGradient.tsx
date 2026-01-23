import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AnimatedGradientProps } from "./types";

/**
 * Convert hex color to HSL values
 */
function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 50];

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

/**
 * Interpolate between two HSL colors
 */
function interpolateHsl(
  color1: [number, number, number],
  color2: [number, number, number],
  progress: number
): string {
  // Handle hue interpolation across the 360 boundary
  let h1 = color1[0];
  let h2 = color2[0];

  // Choose the shortest path around the color wheel
  if (Math.abs(h2 - h1) > 180) {
    if (h1 < h2) {
      h1 += 360;
    } else {
      h2 += 360;
    }
  }

  const h = ((h1 + (h2 - h1) * progress) % 360 + 360) % 360;
  const s = color1[1] + (color2[1] - color1[1]) * progress;
  const l = color1[2] + (color2[2] - color1[2]) * progress;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * AnimatedGradient - Dynamic background with animated color transitions
 *
 * Supports multiple animation modes:
 * - cycle: Smoothly transition through colors
 * - rotate: Rotate gradient angle
 * - shift: Move gradient position
 * - pulse: Pulsating intensity effect
 */
export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  animationMode,
  cycleDuration = 60,
  angle = 135,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Convert all colors to HSL for smooth interpolation
  const hslColors = useMemo(
    () => colors.map((color) => hexToHsl(color)),
    [colors]
  );

  const background = useMemo(() => {
    const cycleProgress = (frame % cycleDuration) / cycleDuration;
    const totalColors = hslColors.length;

    switch (animationMode) {
      case "cycle": {
        // Smoothly cycle through colors
        const expandedIndex = cycleProgress * totalColors;
        const colorIndex1 = Math.floor(expandedIndex) % totalColors;
        const colorIndex2 = (colorIndex1 + 1) % totalColors;
        const localProgress = expandedIndex - Math.floor(expandedIndex);

        const currentColor = interpolateHsl(
          hslColors[colorIndex1],
          hslColors[colorIndex2],
          localProgress
        );

        const nextColorIndex = (colorIndex2 + 1) % totalColors;
        const nextColor = interpolateHsl(
          hslColors[colorIndex2],
          hslColors[nextColorIndex],
          localProgress
        );

        return `linear-gradient(${angle}deg, ${currentColor} 0%, ${nextColor} 100%)`;
      }

      case "rotate": {
        // Rotate the gradient angle
        const rotatedAngle = angle + cycleProgress * 360;
        const color1 = `hsl(${hslColors[0][0]}, ${hslColors[0][1]}%, ${hslColors[0][2]}%)`;
        const color2 =
          totalColors > 1
            ? `hsl(${hslColors[1][0]}, ${hslColors[1][1]}%, ${hslColors[1][2]}%)`
            : color1;
        return `linear-gradient(${rotatedAngle}deg, ${color1} 0%, ${color2} 100%)`;
      }

      case "shift": {
        // Shift gradient position
        const shiftAmount = interpolate(cycleProgress, [0, 0.5, 1], [0, 50, 0]);
        const color1 = `hsl(${hslColors[0][0]}, ${hslColors[0][1]}%, ${hslColors[0][2]}%)`;
        const color2 =
          totalColors > 1
            ? `hsl(${hslColors[1][0]}, ${hslColors[1][1]}%, ${hslColors[1][2]}%)`
            : color1;
        return `linear-gradient(${angle}deg, ${color1} ${shiftAmount}%, ${color2} ${100 - shiftAmount}%)`;
      }

      case "pulse": {
        // Pulsating lightness effect
        const pulseIntensity = interpolate(
          cycleProgress,
          [0, 0.5, 1],
          [1, 1.2, 1]
        );
        const pulsedColors = hslColors.map((hsl) => {
          const adjustedL = Math.min(100, hsl[2] * pulseIntensity);
          return `hsl(${hsl[0]}, ${hsl[1]}%, ${adjustedL}%)`;
        });
        return `linear-gradient(${angle}deg, ${pulsedColors[0]} 0%, ${pulsedColors[1] || pulsedColors[0]} 100%)`;
      }

      default:
        return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1] || colors[0]} 100%)`;
    }
  }, [frame, cycleDuration, hslColors, animationMode, angle, colors]);

  return (
    <AbsoluteFill
      style={{
        background,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export default AnimatedGradient;
