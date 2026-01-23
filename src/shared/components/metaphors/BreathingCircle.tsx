/**
 * BreathingCircle - Visual metaphor for meditation and mindfulness
 *
 * An expanding and contracting circle that mimics breathing rhythm.
 * Perfect for intro scenes or meditation-focused content.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export interface BreathingCircleProps {
  /** Base size in pixels */
  size?: number;
  /** Primary color */
  color?: string;
  /** Secondary color for gradient */
  colorSecondary?: string;
  /** Breath cycle duration in frames (inhale + exhale) */
  cycleDuration?: number;
  /** Number of concentric rings */
  rings?: number;
  /** Opacity of the circles */
  opacity?: number;
  /** Position: 'center', 'left', 'right' */
  position?: "center" | "left" | "right";
  /** Additional style */
  style?: React.CSSProperties;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  size = 400,
  color = "rgba(102, 126, 234, 0.3)",
  colorSecondary = "rgba(118, 75, 162, 0.2)",
  cycleDuration = 120, // 4 seconds at 30fps
  rings = 3,
  opacity = 1,
  position = "center",
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Breathing uses sine wave for natural rhythm
  // 0 -> 0.5 = inhale (expand), 0.5 -> 1 = exhale (contract)
  const cycleProgress = (frame % cycleDuration) / cycleDuration;

  // Smooth breathing curve using easing
  const breathPhase = interpolate(
    cycleProgress,
    [0, 0.4, 0.5, 0.9, 1],
    [0, 1, 1, 0, 0],
    { easing: Easing.inOut(Easing.ease) }
  );

  // Scale oscillates between 0.8 and 1.2
  const baseScale = interpolate(breathPhase, [0, 1], [0.85, 1.15]);

  const positionStyle: React.CSSProperties = {
    center: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
    left: { left: "25%", top: "50%", transform: "translate(-50%, -50%)" },
    right: { left: "75%", top: "50%", transform: "translate(-50%, -50%)" },
  }[position];

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, ...style }}>
      <div
        style={{
          position: "absolute",
          ...positionStyle,
          width: size,
          height: size,
        }}
      >
        {Array.from({ length: rings }).map((_, i) => {
          // Each ring has slightly different timing (wave effect)
          const ringDelay = i * 0.15;
          const ringProgress = (cycleProgress + ringDelay) % 1;
          const ringBreath = interpolate(
            ringProgress,
            [0, 0.4, 0.5, 0.9, 1],
            [0, 1, 1, 0, 0],
            { easing: Easing.inOut(Easing.ease) }
          );
          const ringScale = interpolate(ringBreath, [0, 1], [0.85, 1.15]);

          // Outer rings are larger and more transparent
          const ringSize = size * (1 + i * 0.4);
          const ringOpacity = 1 - i * 0.25;

          // Alternate colors
          const ringColor = i % 2 === 0 ? color : colorSecondary;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: ringSize,
                height: ringSize,
                borderRadius: "50%",
                background: `radial-gradient(circle, transparent 40%, ${ringColor} 100%)`,
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
                filter: `blur(${i * 2}px)`,
              }}
            />
          );
        })}

        {/* Center glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            transform: `translate(-50%, -50%) scale(${baseScale})`,
            filter: "blur(10px)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export default BreathingCircle;
