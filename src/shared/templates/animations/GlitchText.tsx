import React, { useMemo } from "react";
import { useCurrentFrame, random, interpolate } from "remotion";

/**
 * Intensity levels for glitch effect
 */
export type GlitchIntensity = "subtle" | "medium" | "intense";

/**
 * Props for GlitchText component
 */
export interface GlitchTextProps {
  /** The text to display with glitch effect */
  text: string;
  /** Intensity of the glitch effect */
  intensity?: GlitchIntensity;
  /** Frame at which glitch starts */
  triggerFrame?: number;
  /** Duration of glitch effect in frames */
  duration?: number;
  /** Text style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Seed for deterministic randomization */
  seed?: number;
}

/**
 * Glitch character set for random replacement
 */
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/\\~`0123456789";

/**
 * Get intensity configuration
 */
function getIntensityConfig(intensity: GlitchIntensity) {
  switch (intensity) {
    case "subtle":
      return {
        charReplaceChance: 0.05,
        rgbOffset: 2,
        sliceCount: 2,
        sliceIntensity: 0.02,
      };
    case "medium":
      return {
        charReplaceChance: 0.15,
        rgbOffset: 4,
        sliceCount: 4,
        sliceIntensity: 0.05,
      };
    case "intense":
      return {
        charReplaceChance: 0.3,
        rgbOffset: 8,
        sliceCount: 8,
        sliceIntensity: 0.1,
      };
    default:
      return {
        charReplaceChance: 0.15,
        rgbOffset: 4,
        sliceCount: 4,
        sliceIntensity: 0.05,
      };
  }
}

/**
 * Generate glitched text with random character replacements
 */
function glitchText(
  text: string,
  replaceChance: number,
  seed: number
): string {
  return text
    .split("")
    .map((char, index) => {
      if (random(`char-${seed}-${index}`) < replaceChance) {
        const glitchIndex = Math.floor(
          random(`glitch-${seed}-${index}`) * GLITCH_CHARS.length
        );
        return GLITCH_CHARS[glitchIndex];
      }
      return char;
    })
    .join("");
}

/**
 * GlitchText - Digital glitch effect for text
 *
 * Creates a glitch effect with:
 * - Random character replacement
 * - RGB color channel offset
 * - Horizontal slice displacement
 *
 * The effect is deterministic based on frame and seed,
 * ensuring consistent results across renders.
 */
export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  intensity = "medium",
  triggerFrame = 0,
  duration = 15,
  style = {},
  className,
  seed = 12345,
}) => {
  const frame = useCurrentFrame();

  // Check if glitch is active
  const isActive = frame >= triggerFrame && frame < triggerFrame + duration;
  const localFrame = frame - triggerFrame;

  const config = getIntensityConfig(intensity);

  // Generate glitch values based on current frame
  const glitchValues = useMemo(() => {
    if (!isActive) return null;

    const frameSeed = seed + localFrame;

    // Calculate glitch intensity over duration (ramp up/down)
    const glitchProgress = interpolate(
      localFrame,
      [0, duration * 0.3, duration * 0.7, duration],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Glitched text
    const glitchedText = glitchText(
      text,
      config.charReplaceChance * glitchProgress,
      frameSeed
    );

    // RGB offset amounts
    const redOffset = (random(`red-${frameSeed}`) - 0.5) * config.rgbOffset * 2 * glitchProgress;
    const blueOffset = (random(`blue-${frameSeed}`) - 0.5) * config.rgbOffset * 2 * glitchProgress;

    // Slice data for horizontal displacement
    const slices = Array.from({ length: config.sliceCount }, (_, i) => ({
      top: random(`slice-top-${frameSeed}-${i}`) * 100,
      height: random(`slice-height-${frameSeed}-${i}`) * 20 + 5,
      offset: (random(`slice-offset-${frameSeed}-${i}`) - 0.5) * 20 * config.sliceIntensity * glitchProgress,
    }));

    return {
      glitchedText,
      redOffset,
      blueOffset,
      slices,
      glitchProgress,
    };
  }, [isActive, localFrame, seed, text, config, duration]);

  if (!isActive || !glitchValues) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  const { glitchedText, redOffset, blueOffset, slices, glitchProgress } = glitchValues;

  // Base container style
  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...style,
  };

  // RGB channel layer styles
  const baseLayerStyle: React.CSSProperties = {
    position: "relative",
  };

  const redLayerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: redOffset,
    color: "rgba(255, 0, 0, 0.7)",
    mixBlendMode: "screen",
    pointerEvents: "none",
  };

  const blueLayerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: blueOffset,
    color: "rgba(0, 0, 255, 0.7)",
    mixBlendMode: "screen",
    pointerEvents: "none",
  };

  // Generate clip-path for slice effect
  const getSliceClipPath = () => {
    if (glitchProgress < 0.1) return "none";

    const polygonPoints = slices.map((slice) => {
      const y1 = slice.top;
      const y2 = slice.top + slice.height;
      return `0% ${y1}%, 100% ${y1}%, 100% ${y2}%, 0% ${y2}%`;
    });

    return `polygon(${polygonPoints.join(", ")})`;
  };

  return (
    <span className={className} style={containerStyle}>
      {/* Base layer */}
      <span style={baseLayerStyle}>{glitchedText}</span>

      {/* Red channel offset */}
      {Math.abs(redOffset) > 0.5 && (
        <span style={redLayerStyle}>{glitchedText}</span>
      )}

      {/* Blue channel offset */}
      {Math.abs(blueOffset) > 0.5 && (
        <span style={blueLayerStyle}>{glitchedText}</span>
      )}

      {/* Slice displacement overlay */}
      {glitchProgress > 0.3 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: slices[0]?.offset || 0,
            clipPath: getSliceClipPath(),
            background: style.background || style.backgroundColor || "inherit",
            color: style.color || "inherit",
          }}
        >
          {glitchedText}
        </span>
      )}
    </span>
  );
};

export default GlitchText;
