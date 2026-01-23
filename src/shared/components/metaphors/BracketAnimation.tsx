/**
 * BracketAnimation - Visual metaphor for Husserl's epoché
 *
 * Animated brackets that "bracket" or suspend assumptions,
 * visually representing phenomenological reduction.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

export interface BracketAnimationProps {
  /** Text or element to bracket */
  children?: React.ReactNode;
  /** Bracket color */
  color?: string;
  /** Bracket thickness */
  thickness?: number;
  /** Size of brackets */
  size?: number;
  /** Gap between bracket and content */
  gap?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Whether to show the fade-out/suspend effect */
  showSuspend?: boolean;
  /** Additional style */
  style?: React.CSSProperties;
}

export const BracketAnimation: React.FC<BracketAnimationProps> = ({
  children,
  color = "rgba(255, 255, 255, 0.8)",
  thickness = 4,
  size = 60,
  gap = 40,
  delay = 0,
  showSuspend = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bracket slide-in animation
  const bracketProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 1, stiffness: 80 },
  });

  // Content fade for "suspension" effect
  const suspendProgress = showSuspend
    ? interpolate(frame - delay - 30, [0, 30], [1, 0.4], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Bracket positions (start far, end close)
  const leftOffset = interpolate(bracketProgress, [0, 1], [-200, 0]);
  const rightOffset = interpolate(bracketProgress, [0, 1], [200, 0]);

  const bracketStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: "80%",
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    opacity: bracketProgress,
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      {/* Left bracket [ */}
      <div
        style={{
          ...bracketStyle,
          left: `calc(50% - 300px - ${gap}px)`,
          top: "10%",
          borderLeftWidth: thickness,
          borderTopWidth: thickness,
          borderBottomWidth: thickness,
          transform: `translateX(${leftOffset}px)`,
        }}
      />

      {/* Right bracket ] */}
      <div
        style={{
          ...bracketStyle,
          right: `calc(50% - 300px - ${gap}px)`,
          top: "10%",
          borderRightWidth: thickness,
          borderTopWidth: thickness,
          borderBottomWidth: thickness,
          transform: `translateX(${rightOffset}px)`,
        }}
      />

      {/* Content with suspension effect */}
      <div
        style={{
          opacity: suspendProgress,
          filter: showSuspend ? `blur(${interpolate(suspendProgress, [0.4, 1], [2, 0])}px)` : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {children}
      </div>

      {/* Suspension label */}
      {showSuspend && suspendProgress < 0.8 && (
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            color: color,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(suspendProgress, [0.4, 0.6], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          ⟨ SUSPENDED ⟩
        </div>
      )}
    </AbsoluteFill>
  );
};

export default BracketAnimation;
