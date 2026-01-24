/**
 * CardFlip - 3D card flip animation
 * Perfect for before/after, comparisons, reveals
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, RADIUS, FONT_SIZES } from "../constants";

export interface CardFlipProps {
  /** Text shown on front face */
  frontContent: React.ReactNode;
  /** Text shown on back face */
  backContent: React.ReactNode;
  /** Front face background color */
  frontBackground?: string;
  /** Back face background color */
  backBackground?: string;
  /** Front face text color */
  frontTextColor?: string;
  /** Back face text color */
  backTextColor?: string;
  /** Card width */
  width?: number | string;
  /** Card height */
  height?: number | string;
  /** Border radius */
  borderRadius?: number | string;
  /** Font size */
  fontSize?: number | string;
  /** Frame to start flipping */
  flipAtFrame?: number;
  /** Duration of flip animation in frames */
  durationInFrames?: number;
  /** Spring damping */
  damping?: number;
  /** Spring mass */
  mass?: number;
  /** Spring stiffness */
  stiffness?: number;
  /** Flip direction: horizontal (Y-axis) or vertical (X-axis) */
  flipDirection?: "horizontal" | "vertical";
  /** Card style override */
  style?: React.CSSProperties;
}

export const CardFlip: React.FC<CardFlipProps> = ({
  frontContent,
  backContent,
  frontBackground = COLORS.primary,
  backBackground = COLORS.secondary,
  frontTextColor = COLORS.white,
  backTextColor = COLORS.white,
  width = 300,
  height = 400,
  borderRadius = RADIUS.lg,
  fontSize = FONT_SIZES.lg,
  flipAtFrame = 0,
  durationInFrames = 60,
  damping = 18,
  mass = 0.5,
  stiffness = 100,
  flipDirection = "horizontal",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate flip progress
  const flipProgress = spring({
    frame: Math.max(0, frame - flipAtFrame),
    fps,
    from: 0,
    to: 180,
    durationInFrames,
    config: { damping, mass, stiffness },
  });

  const rotateAxis = flipDirection === "horizontal" ? "rotateY" : "rotateX";

  // Determine which face is visible
  const showBack = flipProgress > 90;

  const cardFaceStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
    borderRadius,
    fontSize,
    fontWeight: 600,
    textAlign: "center",
    lineHeight: 1.3,
  };

  return (
    <div
      style={{
        width,
        height,
        perspective: 1000,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `${rotateAxis}(${flipProgress}deg)`,
        }}
      >
        {/* Front Face */}
        <div
          style={{
            ...cardFaceStyle,
            background: frontBackground,
            color: frontTextColor,
            transform: "rotateY(0deg)",
            opacity: showBack ? 0 : 1,
          }}
        >
          {frontContent}
        </div>

        {/* Back Face */}
        <div
          style={{
            ...cardFaceStyle,
            background: backBackground,
            color: backTextColor,
            transform: `${rotateAxis}(180deg)`,
            opacity: showBack ? 1 : 0,
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default CardFlip;
