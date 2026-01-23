import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, random } from "remotion";

/**
 * Type of audio visualization
 */
export type VisualizerType = "waveform" | "bars" | "circle" | "dots";

/**
 * Audio data point for pre-analyzed audio
 */
export interface AudioDataPoint {
  /** Frame number */
  frame: number;
  /** Amplitude values (0-1) for each frequency band */
  amplitudes: number[];
}

/**
 * Props for Audiogram component
 */
export interface AudiogramProps {
  /** Pre-analyzed audio data (optional - uses simulation if not provided) */
  audioData?: AudioDataPoint[];
  /** Type of visualization */
  visualizerType?: VisualizerType;
  /** Primary color */
  color?: string;
  /** Secondary/gradient color */
  secondaryColor?: string;
  /** Number of bars/points */
  barCount?: number;
  /** Width of the visualizer */
  width?: number;
  /** Height of the visualizer */
  height?: number;
  /** Gap between bars */
  gap?: number;
  /** Bar width (for bars type) */
  barWidth?: number;
  /** Border radius for bars */
  barRadius?: number;
  /** Animation smoothing (0-1, higher = smoother) */
  smoothing?: number;
  /** Seed for random simulation */
  seed?: string;
  /** Show reflection effect */
  showReflection?: boolean;
  /** Minimum bar height (0-1) */
  minHeight?: number;
  /** Custom container style */
  containerStyle?: React.CSSProperties;
}

/**
 * Generate simulated audio data using noise
 */
const generateSimulatedAmplitudes = (
  frame: number,
  barCount: number,
  seed: string,
): number[] => {
  return Array.from({ length: barCount }, (_, i) => {
    // Combine multiple frequencies for natural look
    const baseFreq = 0.05;
    const noise1 = random(`${seed}-${i}-1-${Math.floor(frame * baseFreq)}`);
    const noise2 = random(`${seed}-${i}-2-${Math.floor(frame * baseFreq * 2)}`);
    const noise3 = random(`${seed}-${i}-3-${Math.floor(frame * baseFreq * 4)}`);

    // Create smooth interpolation between random values
    const t = (frame * baseFreq) % 1;
    const smoothNoise = noise1 * (1 - t) + noise2 * t;

    // Add some variation based on bar position (bass heavier in middle)
    const positionFactor = 1 - Math.abs(i - barCount / 2) / (barCount / 2) * 0.3;

    // Combine noises with different weights
    const amplitude = (smoothNoise * 0.5 + noise3 * 0.3 + 0.2) * positionFactor;

    return Math.max(0.1, Math.min(1, amplitude));
  });
};

/**
 * Get amplitude for current frame from audio data
 */
const getAmplitudesFromData = (
  audioData: AudioDataPoint[],
  frame: number,
  barCount: number,
): number[] => {
  // Find closest data point
  const dataPoint = audioData.find((d) => d.frame === frame) ||
    audioData.reduce((prev, curr) =>
      Math.abs(curr.frame - frame) < Math.abs(prev.frame - frame) ? curr : prev
    );

  if (!dataPoint) {
    return Array(barCount).fill(0.1);
  }

  // Resample if bar count doesn't match
  if (dataPoint.amplitudes.length === barCount) {
    return dataPoint.amplitudes;
  }

  const resampled: number[] = [];
  for (let i = 0; i < barCount; i++) {
    const srcIndex = (i / barCount) * dataPoint.amplitudes.length;
    const lower = Math.floor(srcIndex);
    const upper = Math.min(lower + 1, dataPoint.amplitudes.length - 1);
    const t = srcIndex - lower;
    resampled.push(dataPoint.amplitudes[lower] * (1 - t) + dataPoint.amplitudes[upper] * t);
  }

  return resampled;
};

/**
 * Waveform visualizer
 */
const WaveformVisualizer: React.FC<{
  amplitudes: number[];
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
  showReflection: boolean;
}> = ({ amplitudes, width, height, color, secondaryColor, showReflection }) => {
  const points = useMemo(() => {
    const pointWidth = width / (amplitudes.length - 1);
    return amplitudes.map((amp, i) => ({
      x: i * pointWidth,
      y: (1 - amp) * height * 0.5,
    }));
  }, [amplitudes, width, height]);

  const pathD = useMemo(() => {
    if (points.length < 2) return "";

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` Q ${cpX} ${prev.y} ${curr.x} ${curr.y}`;
    }

    return d;
  }, [points]);

  // Mirror path for bottom half
  const mirrorPathD = useMemo(() => {
    if (points.length < 2) return "";

    let d = `M ${points[0].x} ${height - points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` Q ${cpX} ${height - prev.y} ${curr.x} ${height - curr.y}`;
    }

    return d;
  }, [points, height]);

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {showReflection && (
        <path
          d={mirrorPathD}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.3}
        />
      )}
    </svg>
  );
};

/**
 * Bar visualizer
 */
const BarsVisualizer: React.FC<{
  amplitudes: number[];
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
  gap: number;
  barWidth?: number;
  barRadius: number;
  showReflection: boolean;
  minHeight: number;
}> = ({
  amplitudes,
  width,
  height,
  color,
  secondaryColor,
  gap,
  barWidth: customBarWidth,
  barRadius,
  showReflection,
  minHeight,
}) => {
  const barWidth = customBarWidth || (width - gap * (amplitudes.length - 1)) / amplitudes.length;

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {amplitudes.map((amp, i) => {
        const normalizedAmp = Math.max(minHeight, amp);
        const barHeight = normalizedAmp * height * 0.8;
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="url(#barGradient)"
              rx={barRadius}
              ry={barRadius}
            />
            {showReflection && (
              <rect
                x={x}
                y={y + barHeight + 4}
                width={barWidth}
                height={barHeight * 0.3}
                fill="url(#barGradient)"
                rx={barRadius}
                ry={barRadius}
                opacity={0.2}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Circle visualizer
 */
const CircleVisualizer: React.FC<{
  amplitudes: number[];
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
}> = ({ amplitudes, width, height, color, secondaryColor }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.25;

  const points = useMemo(() => {
    return amplitudes.map((amp, i) => {
      const angle = (i / amplitudes.length) * Math.PI * 2 - Math.PI / 2;
      const radius = baseRadius + amp * baseRadius * 0.8;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
  }, [amplitudes, baseRadius, centerX, centerY]);

  const pathD = useMemo(() => {
    if (points.length < 3) return "";

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i <= points.length; i++) {
      const prev = points[(i - 1) % points.length];
      const curr = points[i % points.length];
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2;
      d += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`;
    }

    return d + " Z";
  }, [points]);

  return (
    <svg width={width} height={height}>
      <defs>
        <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity={0.8} />
        </radialGradient>
      </defs>
      <circle
        cx={centerX}
        cy={centerY}
        r={baseRadius * 0.5}
        fill={color}
        opacity={0.3}
      />
      <path
        d={pathD}
        fill="url(#circleGradient)"
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
};

/**
 * Dots visualizer
 */
const DotsVisualizer: React.FC<{
  amplitudes: number[];
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
  gap: number;
}> = ({ amplitudes, width, height, color, secondaryColor, gap }) => {
  const dotSize = (width - gap * (amplitudes.length - 1)) / amplitudes.length;

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="dotGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {amplitudes.map((amp, i) => {
        const x = i * (dotSize + gap) + dotSize / 2;
        const radius = (dotSize / 2) * (0.3 + amp * 0.7);

        return (
          <circle
            key={i}
            cx={x}
            cy={height / 2}
            r={radius}
            fill="url(#dotGradient)"
          />
        );
      })}
    </svg>
  );
};

/**
 * Audiogram - Audio waveform visualization component
 *
 * Creates animated audio visualizations that can sync with audio
 * or run with simulated data for decorative purposes.
 *
 * @example
 * ```tsx
 * // Simple usage with simulation
 * <Audiogram
 *   visualizerType="bars"
 *   color="#667eea"
 *   barCount={32}
 *   width={600}
 *   height={200}
 * />
 *
 * // With pre-analyzed audio data
 * <Audiogram
 *   audioData={analyzedAudio}
 *   visualizerType="waveform"
 *   color="#00c2ff"
 * />
 * ```
 */
export const Audiogram: React.FC<AudiogramProps> = ({
  audioData,
  visualizerType = "bars",
  color = "#667eea",
  secondaryColor = "#764ba2",
  barCount = 32,
  width = 600,
  height = 200,
  gap = 4,
  barWidth,
  barRadius = 4,
  smoothing = 0.3,
  seed = "audiogram",
  showReflection = false,
  minHeight = 0.1,
  containerStyle = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Get amplitudes from data or simulation
  const amplitudes = useMemo(() => {
    if (audioData && audioData.length > 0) {
      return getAmplitudesFromData(audioData, frame, barCount);
    }
    return generateSimulatedAmplitudes(frame, barCount, seed);
  }, [audioData, frame, barCount, seed]);

  // Apply smoothing
  const smoothedAmplitudes = useMemo(() => {
    return amplitudes.map((amp) => {
      return spring({
        frame: 0,
        fps,
        config: {
          damping: 60 + smoothing * 40,
          mass: 0.5,
          stiffness: 200 - smoothing * 100,
        },
        from: amp,
        to: amp,
      });
    });
  }, [amplitudes, fps, smoothing]);

  const visualizerProps = {
    amplitudes: smoothedAmplitudes,
    width,
    height,
    color,
    secondaryColor,
  };

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...containerStyle,
      }}
    >
      {visualizerType === "waveform" && (
        <WaveformVisualizer
          {...visualizerProps}
          showReflection={showReflection}
        />
      )}
      {visualizerType === "bars" && (
        <BarsVisualizer
          {...visualizerProps}
          gap={gap}
          barWidth={barWidth}
          barRadius={barRadius}
          showReflection={showReflection}
          minHeight={minHeight}
        />
      )}
      {visualizerType === "circle" && (
        <CircleVisualizer {...visualizerProps} />
      )}
      {visualizerType === "dots" && (
        <DotsVisualizer {...visualizerProps} gap={gap} />
      )}
    </div>
  );
};

export default Audiogram;
