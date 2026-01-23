import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

/**
 * Types of highlight effects
 */
export type HighlightType = "background" | "underline" | "strike" | "box";

/**
 * Props for HighlightText component
 */
export interface HighlightTextProps {
  /** The text to highlight */
  text: string;
  /** Type of highlight effect */
  highlightType: HighlightType;
  /** Color of the highlight (default: yellow) */
  highlightColor?: string;
  /** Frame at which highlight animation triggers */
  triggerFrame?: number;
  /** Duration of highlight animation in frames */
  duration?: number;
  /** Text color */
  textColor?: string;
  /** Text style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Thickness for underline/strike (default: 3) */
  thickness?: number;
}

/**
 * HighlightText - Animated text highlighting effects
 *
 * Supports multiple highlight styles:
 * - background: Animated background color fill
 * - underline: Animated underline from left to right
 * - strike: Animated strikethrough
 * - box: Animated box border around text
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlightType,
  highlightColor = "rgba(255, 235, 59, 0.6)",
  triggerFrame = 0,
  duration = 20,
  textColor,
  style = {},
  className,
  thickness = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate animation progress
  const progress = spring({
    frame: frame - triggerFrame,
    fps,
    config: {
      damping: 80,
      mass: 0.5,
      stiffness: 200,
    },
    durationInFrames: duration,
  });

  // Calculate styles based on highlight type
  const getHighlightStyles = (): React.CSSProperties => {
    switch (highlightType) {
      case "background": {
        // Animated gradient fill from left to right
        const gradientPosition = interpolate(progress, [0, 1], [100, 0]);
        return {
          background: `linear-gradient(90deg, ${highlightColor} ${100 - gradientPosition}%, transparent ${100 - gradientPosition}%)`,
          padding: "2px 6px",
          borderRadius: 4,
        };
      }

      case "underline": {
        return {
          position: "relative",
          display: "inline-block",
        };
      }

      case "strike": {
        return {
          position: "relative",
          display: "inline-block",
        };
      }

      case "box": {
        const borderProgress = interpolate(progress, [0, 1], [0, 1]);
        // Animated border using clip-path
        return {
          border: `${thickness}px solid ${highlightColor}`,
          padding: "4px 8px",
          borderRadius: 4,
          clipPath: `polygon(0 0, ${borderProgress * 100}% 0, ${borderProgress * 100}% ${borderProgress * 100}%, 0 ${borderProgress * 100}%)`,
        };
      }

      default:
        return {};
    }
  };

  // Render underline/strike as pseudo-element replacement
  const renderDecorationLine = () => {
    if (highlightType !== "underline" && highlightType !== "strike") {
      return null;
    }

    const lineStyle: React.CSSProperties = {
      position: "absolute",
      left: 0,
      right: 0,
      height: thickness,
      background: highlightColor,
      transform: `scaleX(${progress})`,
      transformOrigin: "left",
    };

    if (highlightType === "underline") {
      return <span style={{ ...lineStyle, bottom: -2 }} />;
    }

    if (highlightType === "strike") {
      return <span style={{ ...lineStyle, top: "50%", marginTop: -thickness / 2 }} />;
    }

    return null;
  };

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        color: textColor,
        ...style,
        ...getHighlightStyles(),
      }}
    >
      {text}
      {renderDecorationLine()}
    </span>
  );
};

export default HighlightText;
