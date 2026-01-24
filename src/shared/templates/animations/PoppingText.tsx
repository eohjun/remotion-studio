/**
 * PoppingText - Staggered character pop animation
 * Each character pops in with spring physics for dynamic text reveals
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_SIZES } from "../../components/constants";

export interface PoppingTextProps {
  /** Text to animate */
  text: string;
  /** Array of colors to cycle through characters */
  colors?: string[];
  /** Font size */
  fontSize?: number | string;
  /** Font weight */
  fontWeight?: number | string;
  /** Frame delay between each character animation */
  delayPerChar?: number;
  /** Frame to start the animation */
  startFrame?: number;
  /** Spring damping for opacity */
  opacityDamping?: number;
  /** Spring damping for scale */
  scaleDamping?: number;
  /** Container style override */
  style?: React.CSSProperties;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
}

export const PoppingText: React.FC<PoppingTextProps> = ({
  text,
  colors = [COLORS.primary, COLORS.secondary, COLORS.accent],
  fontSize = FONT_SIZES["2xl"],
  fontWeight = "bold",
  delayPerChar = 4,
  startFrame = 0,
  opacityDamping = 8,
  scaleDamping = 7,
  style,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const characters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          textAlign === "center"
            ? "center"
            : textAlign === "right"
              ? "flex-end"
              : "flex-start",
        alignItems: "center",
        ...style,
      }}
    >
      {characters.map((char, index) => {
        const charDelay = startFrame + index * delayPerChar;
        const adjustedFrame = Math.max(0, frame - charDelay);

        // Opacity animation
        const opacity = spring({
          frame: adjustedFrame,
          fps,
          from: 0,
          to: 1,
          config: {
            mass: 0.3,
            damping: opacityDamping,
            stiffness: 100,
          },
        });

        // Scale animation
        const scale = spring({
          frame: adjustedFrame,
          fps,
          from: 0,
          to: 1,
          config: {
            mass: 0.4,
            damping: scaleDamping,
            stiffness: 150,
          },
        });

        // Cycle through colors
        const color = colors[index % colors.length];

        // Handle spaces
        if (char === " ") {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                width: "0.3em",
                fontSize,
              }}
            >
              &nbsp;
            </span>
          );
        }

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              opacity,
              transform: `scale(${scale})`,
              color,
              fontSize,
              fontWeight,
              transformOrigin: "center bottom",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Calculate total duration needed for PoppingText animation
 */
export const calculatePoppingDuration = (
  textLength: number,
  delayPerChar: number = 4,
  settleDuration: number = 20
): number => {
  return textLength * delayPerChar + settleDuration;
};

export default PoppingText;
