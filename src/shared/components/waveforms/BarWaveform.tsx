/**
 * BarWaveform - Audio visualization with vertical bars
 * Syncs with audio data from @remotion/media-utils
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { visualizeAudioWaveform } from "@remotion/media-utils";

// Type for audio data returned by getAudioData()
type AudioDataType = Parameters<typeof visualizeAudioWaveform>[0]["audioData"];

export interface BarWaveformProps {
  /** Audio data from getAudioData() */
  audioData?: AudioDataType | null;
  /** Number of bars to display */
  numberOfSamples?: number;
  /** Bar color (CSS value) */
  barColor?: string;
  /** Width of each bar in pixels */
  barWidth?: number;
  /** Gap between bars in pixels */
  barGap?: number;
  /** Maximum bar height */
  waveAmplitude?: number;
  /** Animation speed for fallback animation */
  waveSpeed?: number;
  /** Container width */
  width?: number | string;
  /** Container height */
  height?: number | string;
  /** Bar border radius */
  barBorderRadius?: number | string;
  /** If true, bars only grow upward from bottom */
  growUpwardsOnly?: boolean;
  /** Container style override */
  style?: React.CSSProperties;
}

export const BarWaveform: React.FC<BarWaveformProps> = ({
  audioData,
  numberOfSamples = 32,
  barColor = "#667eea",
  barWidth = 4,
  barGap = 2,
  waveAmplitude = 100,
  waveSpeed = 0.1,
  width,
  height,
  barBorderRadius,
  growUpwardsOnly = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: videoWidth } = useVideoConfig();

  const containerWidth = width ?? videoWidth * 0.8;
  const containerHeight = height ?? waveAmplitude * 1.5;
  const actualBarRadius = barBorderRadius ?? barWidth / 2;

  // Generate waveform values
  const getWaveformValues = (): number[] => {
    if (audioData) {
      try {
        const waveform = visualizeAudioWaveform({
          audioData,
          frame,
          fps,
          numberOfSamples,
          windowInSeconds: 0.1, // 100ms window for responsive visualization
        });
        return waveform;
      } catch {
        // Fallback to synthetic waveform
      }
    }

    // Synthetic waveform when no audio data
    return Array.from({ length: numberOfSamples }, (_, i) => {
      const phase = (frame * waveSpeed + i * 0.3) % (Math.PI * 2);
      const baseWave = Math.sin(phase) * 0.5 + 0.5;
      const secondaryWave = Math.sin(phase * 2.5 + i * 0.1) * 0.3;
      return Math.max(0.1, Math.min(1, baseWave + secondaryWave));
    });
  };

  const waveformValues = getWaveformValues();

  // Calculate total width needed
  const totalBarsWidth =
    numberOfSamples * barWidth + (numberOfSamples - 1) * barGap;

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        display: "flex",
        alignItems: growUpwardsOnly ? "flex-end" : "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        width={totalBarsWidth}
        height={containerHeight}
        viewBox={`0 0 ${totalBarsWidth} ${containerHeight}`}
      >
        {waveformValues.map((value, index) => {
          const barHeight = Math.max(4, value * waveAmplitude);
          const x = index * (barWidth + barGap);
          const y = growUpwardsOnly
            ? Number(containerHeight) - barHeight
            : (Number(containerHeight) - barHeight) / 2;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={actualBarRadius}
              ry={actualBarRadius}
              fill={barColor}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default BarWaveform;
