import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

/**
 * Reveal modes for text
 */
export type RevealMode = "word" | "line" | "clip";

/**
 * Direction of reveal animation
 */
export type RevealDirection = "left" | "right" | "top" | "bottom";

/**
 * Props for RevealText component
 */
export interface RevealTextProps {
  /** The text to reveal */
  text: string;
  /** Reveal mode */
  revealMode: RevealMode;
  /** Direction of the reveal animation */
  direction?: RevealDirection;
  /** Delay between staggered elements in frames */
  staggerDelay?: number;
  /** Initial delay before animation starts */
  delay?: number;
  /** Text style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Enable mask overflow (shows partial text during reveal) */
  maskOverflow?: boolean;
}

/**
 * Single word reveal component
 */
const RevealWord: React.FC<{
  word: string;
  delay: number;
  direction: RevealDirection;
  style?: React.CSSProperties;
}> = ({ word, delay, direction, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 80,
      mass: 0.5,
      stiffness: 200,
    },
  });

  // Calculate transform based on direction
  const getTransform = (): string => {
    const distance = 30;
    switch (direction) {
      case "left":
        return `translateX(${interpolate(progress, [0, 1], [-distance, 0])}px)`;
      case "right":
        return `translateX(${interpolate(progress, [0, 1], [distance, 0])}px)`;
      case "top":
        return `translateY(${interpolate(progress, [0, 1], [-distance, 0])}px)`;
      case "bottom":
        return `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`;
      default:
        return "";
    }
  };

  return (
    <span
      style={{
        display: "inline-block",
        opacity: progress,
        transform: getTransform(),
        whiteSpace: "pre",
        ...style,
      }}
    >
      {word}
    </span>
  );
};

/**
 * Single line reveal component
 */
const RevealLine: React.FC<{
  line: string;
  delay: number;
  direction: RevealDirection;
  style?: React.CSSProperties;
}> = ({ line, delay, direction, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 80,
      mass: 0.5,
      stiffness: 200,
    },
  });

  // Get clip path based on direction
  const getClipPath = (): string => {
    switch (direction) {
      case "left":
        return `inset(0 ${interpolate(progress, [0, 1], [100, 0])}% 0 0)`;
      case "right":
        return `inset(0 0 0 ${interpolate(progress, [0, 1], [100, 0])}%)`;
      case "top":
        return `inset(0 0 ${interpolate(progress, [0, 1], [100, 0])}% 0)`;
      case "bottom":
        return `inset(${interpolate(progress, [0, 1], [100, 0])}% 0 0 0)`;
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        clipPath: getClipPath(),
        ...style,
      }}
    >
      {line}
    </div>
  );
};

/**
 * RevealText - Mask-based text reveal animation
 *
 * Supports multiple reveal modes:
 * - word: Reveal text word by word with stagger
 * - line: Reveal text line by line with stagger
 * - clip: Reveal entire text with clip-path animation
 */
export const RevealText: React.FC<RevealTextProps> = ({
  text,
  revealMode,
  direction = "left",
  staggerDelay = 5,
  delay = 0,
  style = {},
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clip mode - reveal entire text at once
  if (revealMode === "clip") {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: {
        damping: 80,
        mass: 0.5,
        stiffness: 200,
      },
    });

    const getClipPath = (): string => {
      switch (direction) {
        case "left":
          return `inset(0 ${interpolate(progress, [0, 1], [100, 0])}% 0 0)`;
        case "right":
          return `inset(0 0 0 ${interpolate(progress, [0, 1], [100, 0])}%)`;
        case "top":
          return `inset(0 0 ${interpolate(progress, [0, 1], [100, 0])}% 0)`;
        case "bottom":
          return `inset(${interpolate(progress, [0, 1], [100, 0])}% 0 0 0)`;
        default:
          return "";
      }
    };

    return (
      <span
        className={className}
        style={{
          display: "inline-block",
          clipPath: getClipPath(),
          ...style,
        }}
      >
        {text}
      </span>
    );
  }

  // Word mode
  if (revealMode === "word") {
    const words = text.split(" ");
    return (
      <span className={className} style={{ display: "inline-block", ...style }}>
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <RevealWord
              word={word}
              delay={delay + index * staggerDelay}
              direction={direction}
            />
            {index < words.length - 1 && (
              <span style={{ display: "inline-block", width: "0.3em" }}> </span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  }

  // Line mode
  if (revealMode === "line") {
    const lines = text.split("\n");
    return (
      <div className={className} style={style}>
        {lines.map((line, index) => (
          <RevealLine
            key={index}
            line={line}
            delay={delay + index * staggerDelay}
            direction={direction}
          />
        ))}
      </div>
    );
  }

  return <span style={style}>{text}</span>;
};

export default RevealText;
