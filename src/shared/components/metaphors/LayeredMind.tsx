/**
 * LayeredMind - Visual metaphor for metacognition and decentering
 *
 * Shows consciousness as stacked layers that can separate,
 * representing the ability to observe one's own thoughts.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

export interface LayerConfig {
  label: string;
  color: string;
  icon?: string;
}

export interface LayeredMindProps {
  /** Configuration for each layer (bottom to top) */
  layers?: LayerConfig[];
  /** Delay before separation animation starts */
  separationDelay?: number;
  /** Whether layers are separated */
  separated?: boolean;
  /** Separation distance in pixels */
  separationDistance?: number;
  /** Layer dimensions */
  layerWidth?: number;
  layerHeight?: number;
  /** Position */
  position?: "center" | "left" | "right";
  /** Additional style */
  style?: React.CSSProperties;
}

const defaultLayers: LayerConfig[] = [
  { label: "Experience", color: "rgba(102, 126, 234, 0.8)", icon: "💭" },
  { label: "Awareness", color: "rgba(118, 75, 162, 0.8)", icon: "👁️" },
  { label: "Meta-Awareness", color: "rgba(236, 72, 153, 0.8)", icon: "🔍" },
];

export const LayeredMind: React.FC<LayeredMindProps> = ({
  layers = defaultLayers,
  separationDelay = 30,
  separated = true,
  separationDistance = 80,
  layerWidth = 400,
  layerHeight = 80,
  position = "center",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const positionStyle: React.CSSProperties = {
    center: { justifyContent: "center", alignItems: "center" },
    left: { justifyContent: "center", alignItems: "flex-start", paddingLeft: 200 },
    right: { justifyContent: "center", alignItems: "flex-end", paddingRight: 200 },
  }[position];

  return (
    <AbsoluteFill style={{ ...positionStyle, ...style }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          gap: 10,
        }}
      >
        {layers.map((layer, index) => {
          // Each layer animates with increasing delay
          const layerDelay = separationDelay + index * 15;

          const separationProgress = separated
            ? spring({
                frame: frame - layerDelay,
                fps,
                config: { damping: 20, mass: 1, stiffness: 60 },
              })
            : 0;

          // Higher layers move up more
          const yOffset = interpolate(
            separationProgress,
            [0, 1],
            [0, -separationDistance * index]
          );

          // Layers become more distinct when separated
          const layerOpacity = interpolate(
            separationProgress,
            [0, 1],
            [0.6 + index * 0.1, 0.9]
          );

          // Scale effect for emphasis
          const scale = interpolate(separationProgress, [0, 1], [1, 1 + index * 0.02]);

          // Glow effect on top layer
          const isTopLayer = index === layers.length - 1;
          const glowIntensity = isTopLayer
            ? interpolate(separationProgress, [0, 1], [0, 15])
            : 0;

          return (
            <div
              key={index}
              style={{
                width: layerWidth - index * 20, // Slightly narrower as we go up
                height: layerHeight,
                background: `linear-gradient(135deg, ${layer.color} 0%, ${layer.color.replace("0.8", "0.6")} 100%)`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transform: `translateY(${yOffset}px) scale(${scale})`,
                opacity: layerOpacity,
                boxShadow: glowIntensity > 0
                  ? `0 0 ${glowIntensity}px ${layer.color}, 0 4px 20px rgba(0,0,0,0.3)`
                  : "0 4px 20px rgba(0,0,0,0.3)",
                zIndex: index,
                transition: "box-shadow 0.3s ease",
              }}
            >
              {layer.icon && (
                <span style={{ fontSize: 28 }}>{layer.icon}</span>
              )}
              <span
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {layer.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Observer indicator */}
      {separated && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: position === "left" ? "30%" : position === "right" ? "60%" : "25%",
            opacity: interpolate(
              spring({
                frame: frame - separationDelay - layers.length * 15 - 20,
                fps,
                config: { damping: 20 },
              }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "rgba(255,255,255,0.8)",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 24 }}>👤</span>
            <span>The Observer</span>
            <svg width="60" height="30" style={{ marginLeft: 10 }}>
              <path
                d="M 0 15 Q 30 0, 60 15"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4,4"
              />
              <polygon
                points="55,10 60,15 55,20"
                fill="rgba(255,255,255,0.5)"
              />
            </svg>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default LayeredMind;
