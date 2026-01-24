import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimationConfig, fadeInUp, getAnimatedStyle, DEFAULT_SPRING } from "./presets";

/**
 * StrokedText - Text with stroke outline for improved readability
 *
 * Uses dual-layer rendering with stroke layer behind fill layer.
 * Works well on any background (light or dark).
 *
 * Inspired by Remotion's template-prompt-to-video subtitle system.
 *
 * @example
 * <StrokedText
 *   text="Hello World"
 *   strokeColor="black"
 *   strokeWidth={4}
 *   fillColor="white"
 *   fontSize={64}
 * />
 */
export interface StrokedTextProps {
  text: string;
  /** Fill color of the text (default: white) */
  fillColor?: string;
  /** Stroke color for the outline (default: black) */
  strokeColor?: string;
  /** Stroke width in pixels (default: 4) */
  strokeWidth?: number;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight (default: 700) */
  fontWeight?: number;
  /** Font family (default: inherit) */
  fontFamily?: string;
  /** Additional style for the container */
  style?: React.CSSProperties;
  /** CSS class name */
  className?: string;
  /** Enable animation on entry */
  animated?: boolean;
  /** Animation configuration (used when animated=true) */
  animation?: AnimationConfig;
  /** Animation delay in frames */
  delay?: number;
}

export const StrokedText: React.FC<StrokedTextProps> = ({
  text,
  fillColor = "white",
  strokeColor = "black",
  strokeWidth = 4,
  fontSize = 48,
  fontWeight = 700,
  fontFamily = "inherit",
  style = {},
  className,
  animated = false,
  animation = fadeInUp(),
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate animation progress
  const progress = animated
    ? spring({
        frame: frame - delay,
        fps,
        config: animation.springConfig || DEFAULT_SPRING,
      })
    : 1;

  const animatedStyle = animated ? getAnimatedStyle(progress, animation.preset) : {};

  const baseTextStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    fontFamily,
    lineHeight: 1.2,
    margin: 0,
    padding: 0,
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
        ...animatedStyle,
      }}
    >
      {/* Stroke layer (behind) */}
      <span
        style={{
          ...baseTextStyle,
          position: "absolute",
          top: 0,
          left: 0,
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          color: "transparent",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Fill layer (in front) */}
      <span
        style={{
          ...baseTextStyle,
          position: "relative",
          color: fillColor,
          zIndex: 1,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/**
 * AnimatedStrokedText - Stroked text with word-by-word animation
 *
 * Each word animates in sequence for dynamic text reveals.
 */
export interface AnimatedStrokedTextProps extends Omit<StrokedTextProps, "text" | "animated"> {
  text: string;
  /** Stagger duration between words in frames (default: 5) */
  staggerDuration?: number;
}

export const AnimatedStrokedText: React.FC<AnimatedStrokedTextProps> = ({
  text,
  staggerDuration = 5,
  delay = 0,
  animation = fadeInUp(),
  ...props
}) => {
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.3em",
      }}
    >
      {words.map((word, index) => (
        <StrokedText
          key={index}
          text={word}
          animated
          animation={animation}
          delay={delay + index * staggerDuration}
          {...props}
        />
      ))}
    </div>
  );
};

/**
 * SubtitleText - Cinema-style subtitle with stroked text
 *
 * Positioned at the bottom of the screen with proper padding.
 * Optimized for video subtitles with high readability.
 */
export interface SubtitleTextProps extends StrokedTextProps {
  /** Position from bottom in pixels (default: 100) */
  bottomOffset?: number;
  /** Maximum width as percentage (default: 80) */
  maxWidth?: number;
  /** Enable text shadow for extra depth */
  shadow?: boolean;
}

export const SubtitleText: React.FC<SubtitleTextProps> = ({
  bottomOffset = 100,
  maxWidth = 80,
  shadow = true,
  strokeWidth = 3,
  fontSize = 42,
  style = {},
  ...props
}) => {
  const shadowStyle: React.CSSProperties = shadow
    ? { textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)" }
    : {};

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomOffset,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 40px",
      }}
    >
      <StrokedText
        {...props}
        fontSize={fontSize}
        strokeWidth={strokeWidth}
        style={{
          textAlign: "center",
          maxWidth: `${maxWidth}%`,
          ...shadowStyle,
          ...style,
        }}
      />
    </div>
  );
};

export default StrokedText;
