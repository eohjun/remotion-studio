/**
 * Spectrum - Audio frequency spectrum visualization
 *
 * Displays audio data as animated frequency bars.
 * Can be driven by actual audio data or simulated for visual effect.
 *
 * @example
 * // Simulated spectrum (no actual audio analysis)
 * <Spectrum barCount={32} animated />
 *
 * // With audio data (from Web Audio API)
 * <Spectrum frequencyData={analyzerData} />
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export interface SpectrumProps {
  /** Number of bars to display (default: 32) */
  barCount?: number;
  /** Frequency data from audio analyzer (0-255 values) */
  frequencyData?: number[];
  /** Bar width in pixels (default: 8) */
  barWidth?: number;
  /** Gap between bars in pixels (default: 4) */
  barGap?: number;
  /** Maximum bar height in pixels (default: 200) */
  maxHeight?: number;
  /** Bar color (default: white) */
  color?: string;
  /** Gradient colors for bars [bottom, top] */
  gradientColors?: [string, string];
  /** Enable simulated animation when no data (default: true) */
  animated?: boolean;
  /** Animation speed multiplier (default: 1) */
  animationSpeed?: number;
  /** Bar corner radius (default: 4) */
  borderRadius?: number;
  /** Vertical alignment (default: bottom) */
  align?: "top" | "center" | "bottom";
  /** Enable glow effect (default: false) */
  glow?: boolean;
  /** Glow color (default: same as bar color) */
  glowColor?: string;
  /** Entry animation delay in frames */
  delay?: number;
  /** Container style */
  style?: React.CSSProperties;
}

export const Spectrum: React.FC<SpectrumProps> = ({
  barCount = 32,
  frequencyData,
  barWidth = 8,
  barGap = 4,
  maxHeight = 200,
  color = "#ffffff",
  gradientColors,
  animated = true,
  animationSpeed = 1,
  borderRadius = 4,
  align = "bottom",
  glow = false,
  glowColor,
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 200 },
  });

  // Calculate container width
  const containerWidth = barCount * (barWidth + barGap) - barGap;

  // Generate bar heights
  const getBarHeight = (index: number): number => {
    if (frequencyData && frequencyData[index] !== undefined) {
      // Use actual frequency data (0-255 range)
      return (frequencyData[index] / 255) * maxHeight;
    }

    if (animated) {
      // Simulated animation based on frame
      const baseFreq = 0.1 * animationSpeed;
      const phase = (index / barCount) * Math.PI * 2;
      const time = frame * baseFreq;

      // Combine multiple sine waves for organic movement
      const wave1 = Math.sin(time + phase) * 0.4;
      const wave2 = Math.sin(time * 1.5 + phase * 2) * 0.3;
      const wave3 = Math.sin(time * 0.7 + phase * 0.5) * 0.3;

      const combined = (wave1 + wave2 + wave3 + 1) / 2;
      return combined * maxHeight;
    }

    // Static default (bass-heavy distribution)
    const normalizedIndex = index / barCount;
    return Math.max(0.1, 1 - normalizedIndex) * maxHeight * 0.5;
  };

  // Alignment transform
  const getAlignmentStyle = (): React.CSSProperties => {
    switch (align) {
      case "top":
        return { alignItems: "flex-start" };
      case "center":
        return { alignItems: "center" };
      case "bottom":
      default:
        return { alignItems: "flex-end" };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        ...getAlignmentStyle(),
        height: maxHeight,
        width: containerWidth,
        gap: barGap,
        opacity: entryProgress,
        transform: `scaleY(${entryProgress})`,
        transformOrigin: align === "top" ? "top" : align === "center" ? "center" : "bottom",
        ...style,
      }}
    >
      {Array.from({ length: barCount }).map((_, index) => {
        const barHeight = getBarHeight(index);

        // Staggered entry animation for each bar
        const barDelay = delay + index * 1;
        const barProgress = spring({
          frame: frame - barDelay,
          fps,
          config: { damping: 60, stiffness: 200 },
        });

        const background = gradientColors
          ? `linear-gradient(to top, ${gradientColors[0]}, ${gradientColors[1]})`
          : color;

        const glowStyle = glow
          ? {
              boxShadow: `0 0 10px ${glowColor ?? color}, 0 0 20px ${glowColor ?? color}40`,
            }
          : {};

        return (
          <div
            key={index}
            style={{
              width: barWidth,
              height: barHeight * barProgress,
              minHeight: 2,
              background,
              borderRadius,
              transition: frequencyData ? "height 50ms ease-out" : undefined,
              ...glowStyle,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * CircularSpectrum - Spectrum arranged in a circle
 */
export interface CircularSpectrumProps extends Omit<SpectrumProps, "align" | "style"> {
  /** Circle radius in pixels (default: 100) */
  radius?: number;
  /** Start angle in degrees (default: 0) */
  startAngle?: number;
  /** End angle in degrees (default: 360) */
  endAngle?: number;
  /** Whether bars point outward or inward (default: outward) */
  direction?: "outward" | "inward";
  /** Container style */
  style?: React.CSSProperties;
}

export const CircularSpectrum: React.FC<CircularSpectrumProps> = ({
  barCount = 64,
  radius = 100,
  startAngle = 0,
  endAngle = 360,
  direction = "outward",
  barWidth = 4,
  maxHeight = 50,
  color = "#ffffff",
  animated = true,
  animationSpeed = 1,
  delay = 0,
  frequencyData,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 200 },
  });

  const angleRange = endAngle - startAngle;
  const angleStep = angleRange / barCount;

  const getBarHeight = (index: number): number => {
    if (frequencyData && frequencyData[index] !== undefined) {
      return (frequencyData[index] / 255) * maxHeight;
    }

    if (animated) {
      const baseFreq = 0.1 * animationSpeed;
      const phase = (index / barCount) * Math.PI * 2;
      const time = frame * baseFreq;

      const wave1 = Math.sin(time + phase) * 0.4;
      const wave2 = Math.sin(time * 1.5 + phase * 2) * 0.3;
      const wave3 = Math.sin(time * 0.7 + phase * 0.5) * 0.3;

      const combined = (wave1 + wave2 + wave3 + 1) / 2;
      return combined * maxHeight;
    }

    return maxHeight * 0.5;
  };

  const containerSize = (radius + maxHeight) * 2;

  return (
    <div
      style={{
        position: "relative",
        width: containerSize,
        height: containerSize,
        opacity: entryProgress,
        transform: `scale(${entryProgress})`,
        ...style,
      }}
    >
      {Array.from({ length: barCount }).map((_, index) => {
        const angle = startAngle + index * angleStep;
        const angleRad = (angle * Math.PI) / 180;
        const barHeight = getBarHeight(index);

        const x = Math.cos(angleRad);
        const y = Math.sin(angleRad);

        const barX = containerSize / 2 + x * radius;
        const barY = containerSize / 2 + y * radius;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: barX,
              top: barY,
              width: barWidth,
              height: barHeight,
              backgroundColor: color,
              borderRadius: barWidth / 2,
              transform: `translate(-50%, ${direction === "outward" ? "0" : "-100%"}) rotate(${angle + 90}deg)`,
              transformOrigin: direction === "outward" ? "center top" : "center bottom",
            }}
          />
        );
      })}
    </div>
  );
};

export default Spectrum;
