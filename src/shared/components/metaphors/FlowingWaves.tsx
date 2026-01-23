/**
 * FlowingWaves - Ambient wave pattern for backgrounds
 *
 * Creates flowing, organic wave patterns that evoke
 * calmness and continuous flow of consciousness.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export interface FlowingWavesProps {
  /** Wave colors */
  colors?: string[];
  /** Number of wave layers */
  layers?: number;
  /** Wave amplitude (height) */
  amplitude?: number;
  /** Wave frequency (how many waves across screen) */
  frequency?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Opacity of the waves */
  opacity?: number;
  /** Whether waves flow left or right */
  direction?: "left" | "right";
  /** Additional style */
  style?: React.CSSProperties;
}

export const FlowingWaves: React.FC<FlowingWavesProps> = ({
  colors = [
    "rgba(102, 126, 234, 0.15)",
    "rgba(118, 75, 162, 0.12)",
    "rgba(236, 72, 153, 0.08)",
  ],
  layers = 3,
  amplitude = 50,
  frequency = 2,
  speed = 1,
  opacity = 1,
  direction = "right",
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Direction multiplier
  const dirMult = direction === "right" ? 1 : -1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <defs>
          {colors.map((color, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`waveGradient-${i}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>

        {Array.from({ length: layers }).map((_, layerIndex) => {
          // Each layer has different timing and position
          const layerSpeed = speed * (1 - layerIndex * 0.2);
          const layerAmplitude = amplitude * (1 - layerIndex * 0.15);
          const layerFrequency = frequency * (1 + layerIndex * 0.3);
          const phaseOffset = layerIndex * Math.PI * 0.5;

          // Calculate wave offset based on frame
          const waveOffset = (frame * layerSpeed * dirMult * 2) % 360;

          // Generate wave path
          const points: string[] = [];
          const segments = 100;

          for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * 100;
            const radians = (x * layerFrequency * Math.PI) / 50 + (waveOffset * Math.PI) / 180 + phaseOffset;

            // Combine multiple sine waves for organic look
            const y1 = Math.sin(radians) * layerAmplitude;
            const y2 = Math.sin(radians * 2.3 + frame * 0.02) * (layerAmplitude * 0.3);
            const y3 = Math.sin(radians * 0.7 - frame * 0.01) * (layerAmplitude * 0.2);

            const totalY = y1 + y2 + y3;

            // Position from bottom, moving up
            const baseY = 85 - layerIndex * 15; // Each layer starts higher
            const finalY = baseY - (totalY / amplitude) * 10;

            points.push(`${x},${finalY}`);
          }

          // Complete the path to fill to bottom
          const pathD = `M 0,100 L ${points.join(" L ")} L 100,100 Z`;

          return (
            <path
              key={layerIndex}
              d={pathD}
              fill={`url(#waveGradient-${layerIndex % colors.length})`}
              style={{
                transform: "scaleY(1)",
                transformOrigin: "bottom",
              }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export default FlowingWaves;
