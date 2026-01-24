/**
 * Waveform - Audio waveform visualization
 *
 * Displays audio data as a continuous waveform.
 * Can be driven by actual audio data or simulated for visual effect.
 *
 * @example
 * // Simulated waveform
 * <Waveform width={400} height={100} animated />
 *
 * // With audio data
 * <Waveform waveformData={timedomainData} />
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface WaveformProps {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Waveform data from audio analyzer (-1 to 1 range or 0-255) */
  waveformData?: number[];
  /** Number of points when simulating (default: 100) */
  points?: number;
  /** Line color (default: white) */
  color?: string;
  /** Gradient colors [start, end] for stroke */
  gradientColors?: [string, string];
  /** Line width in pixels (default: 2) */
  lineWidth?: number;
  /** Enable simulated animation when no data (default: true) */
  animated?: boolean;
  /** Animation speed multiplier (default: 1) */
  animationSpeed?: number;
  /** Enable fill below the line (default: false) */
  fill?: boolean;
  /** Fill color (default: semi-transparent line color) */
  fillColor?: string;
  /** Display mode (default: line) */
  mode?: "line" | "bars" | "mirror";
  /** Entry animation delay in frames */
  delay?: number;
  /** Enable glow effect (default: false) */
  glow?: boolean;
  /** Container style */
  style?: React.CSSProperties;
}

export const Waveform: React.FC<WaveformProps> = ({
  width = 400,
  height = 100,
  waveformData,
  points = 100,
  color = "#ffffff",
  gradientColors,
  lineWidth = 2,
  animated = true,
  animationSpeed = 1,
  fill = false,
  fillColor,
  mode = "line",
  delay = 0,
  glow = false,
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

  // Generate waveform points
  const numPoints = waveformData ? waveformData.length : points;
  const stepX = width / (numPoints - 1);

  const getPointY = (index: number): number => {
    const centerY = height / 2;

    if (waveformData && waveformData[index] !== undefined) {
      // Normalize data (handle both -1 to 1 and 0-255 ranges)
      const value =
        waveformData[index] > 1
          ? (waveformData[index] - 128) / 128 // 0-255 range
          : waveformData[index]; // -1 to 1 range

      return centerY + value * (height / 2) * 0.9;
    }

    if (animated) {
      // Simulated animation
      const baseFreq = 0.08 * animationSpeed;
      const phase = (index / numPoints) * Math.PI * 4;
      const time = frame * baseFreq;

      // Combine waves for organic movement
      const wave1 = Math.sin(time + phase) * 0.5;
      const wave2 = Math.sin(time * 1.7 + phase * 0.5) * 0.3;
      const wave3 = Math.sin(time * 0.5 + phase * 2) * 0.2;

      const combined = wave1 + wave2 + wave3;
      return centerY + combined * (height / 2) * 0.8;
    }

    // Static sine wave
    return centerY + Math.sin((index / numPoints) * Math.PI * 4) * (height / 2) * 0.3;
  };

  // Build SVG path
  const buildPath = (): string => {
    const pathPoints: string[] = [];

    for (let i = 0; i < numPoints; i++) {
      const x = i * stepX;
      const y = getPointY(i);

      if (i === 0) {
        pathPoints.push(`M ${x} ${y}`);
      } else {
        // Use quadratic curves for smoother lines
        const prevX = (i - 1) * stepX;
        const prevY = getPointY(i - 1);
        const cpX = (prevX + x) / 2;
        pathPoints.push(`Q ${cpX} ${prevY}, ${x} ${y}`);
      }
    }

    return pathPoints.join(" ");
  };

  // Build mirrored path (for mirror mode)
  const buildMirrorPath = (): string => {
    const topPath: string[] = [];
    const bottomPath: string[] = [];
    const centerY = height / 2;

    for (let i = 0; i < numPoints; i++) {
      const x = i * stepX;
      const y = getPointY(i);
      const amplitude = Math.abs(y - centerY);

      if (i === 0) {
        topPath.push(`M ${x} ${centerY - amplitude}`);
        bottomPath.push(`L ${x} ${centerY + amplitude}`);
      } else {
        const prevX = (i - 1) * stepX;
        const prevY = getPointY(i - 1);
        const prevAmp = Math.abs(prevY - centerY);
        const cpX = (prevX + x) / 2;

        topPath.push(`Q ${cpX} ${centerY - prevAmp}, ${x} ${centerY - amplitude}`);
        bottomPath.unshift(`Q ${cpX} ${centerY + prevAmp}, ${prevX} ${centerY + prevAmp}`);
      }
    }

    // Close the path for fill
    return topPath.join(" ") + " " + bottomPath.reverse().join(" ") + " Z";
  };

  // Create deterministic gradient ID using useMemo
  const gradientId = React.useMemo(
    () => `waveform-gradient-${mode}-${width}-${height}`,
    [mode, width, height]
  );

  const strokeColor = gradientColors ? `url(#${gradientId})` : color;
  const actualFillColor = fillColor ?? `${color}40`;

  const glowFilter = glow ? "drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor)" : undefined;

  if (mode === "bars") {
    // Bar mode - vertical bars at each point
    const barWidth = (width / numPoints) * 0.8;
    const centerY = height / 2;

    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: entryProgress,
          transform: `scaleY(${entryProgress})`,
          ...style,
        }}
      >
        {Array.from({ length: numPoints }).map((_, index) => {
          const y = getPointY(index);
          const barHeight = Math.abs(y - centerY) * 2;

          return (
            <div
              key={index}
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: color,
                borderRadius: barWidth / 4,
                filter: glowFilter,
              }}
            />
          );
        })}
      </div>
    );
  }

  const path = mode === "mirror" ? buildMirrorPath() : buildPath();

  return (
    <svg
      width={width}
      height={height}
      style={{
        opacity: entryProgress,
        transform: `scaleY(${entryProgress})`,
        overflow: "visible",
        ...style,
      }}
    >
      {gradientColors && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
      )}

      {/* Fill (if enabled) */}
      {fill && mode !== "mirror" && (
        <path
          d={path + ` L ${width} ${height / 2} L 0 ${height / 2} Z`}
          fill={actualFillColor}
          stroke="none"
        />
      )}

      {/* Mirror mode fill */}
      {mode === "mirror" && (
        <path
          d={path}
          fill={actualFillColor}
          stroke={strokeColor}
          strokeWidth={lineWidth}
          style={{ filter: glowFilter }}
        />
      )}

      {/* Main line */}
      {mode !== "mirror" && (
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: glowFilter }}
        />
      )}
    </svg>
  );
};

/**
 * AudioPulse - Simple pulsing circle that reacts to audio
 */
export interface AudioPulseProps {
  /** Base radius in pixels */
  radius?: number;
  /** Maximum pulse radius */
  maxRadius?: number;
  /** Audio level (0-1) */
  audioLevel?: number;
  /** Color */
  color?: string;
  /** Enable simulated animation */
  animated?: boolean;
  /** Animation delay in frames */
  delay?: number;
  /** Style */
  style?: React.CSSProperties;
}

export const AudioPulse: React.FC<AudioPulseProps> = ({
  radius = 50,
  maxRadius = 100,
  audioLevel,
  color = "#ffffff",
  animated = true,
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 200 },
  });

  let currentLevel: number;

  if (audioLevel !== undefined) {
    currentLevel = audioLevel;
  } else if (animated) {
    const time = frame * 0.1;
    currentLevel = (Math.sin(time) + 1) / 2 * 0.5 + 0.3;
  } else {
    currentLevel = 0.5;
  }

  const currentRadius = interpolate(
    currentLevel,
    [0, 1],
    [radius, maxRadius]
  );

  const size = maxRadius * 2;

  return (
    <svg
      width={size}
      height={size}
      style={{
        opacity: entryProgress,
        transform: `scale(${entryProgress})`,
        ...style,
      }}
    >
      {/* Outer glow */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={currentRadius}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.3}
      />

      {/* Middle ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={currentRadius * 0.7}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.5}
      />

      {/* Inner circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius * 0.5}
        fill={color}
        opacity={0.8}
      />
    </svg>
  );
};

export default Waveform;
