import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import type { ChromaticAberrationProps } from "./types";

/**
 * ChromaticAberration - Create RGB channel separation effect
 *
 * Simulates the optical phenomenon where different wavelengths of light
 * refract at different angles, creating a color fringing effect.
 *
 * Commonly used for:
 * - Cinematic looks
 * - Retro/analog aesthetics
 * - Transition effects
 * - Impact emphasis
 *
 * @example
 * ```tsx
 * <ChromaticAberration intensity={0.5} direction="radial">
 *   <Scene />
 * </ChromaticAberration>
 * ```
 */
export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  intensity = 0.3,
  direction = "radial",
  offsetX = 0,
  offsetY = 0,
  animated = false,
  animationSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate animated intensity if enabled
  let currentIntensity = intensity;
  if (animated) {
    const time = frame / fps;
    // Subtle pulsing effect
    currentIntensity = intensity * (0.8 + 0.2 * Math.sin(time * animationSpeed * Math.PI * 2));
  }

  // Calculate pixel offset based on intensity (0-1 maps to 0-10 pixels)
  const maxOffset = currentIntensity * 10;

  // Calculate RGB offsets based on direction
  let redOffsetX = 0;
  let redOffsetY = 0;
  let blueOffsetX = 0;
  let blueOffsetY = 0;

  switch (direction) {
    case "horizontal":
      redOffsetX = -maxOffset + offsetX;
      blueOffsetX = maxOffset + offsetX;
      break;
    case "vertical":
      redOffsetY = -maxOffset + offsetY;
      blueOffsetY = maxOffset + offsetY;
      break;
    case "diagonal":
      redOffsetX = -maxOffset * 0.7 + offsetX;
      redOffsetY = -maxOffset * 0.7 + offsetY;
      blueOffsetX = maxOffset * 0.7 + offsetX;
      blueOffsetY = maxOffset * 0.7 + offsetY;
      break;
    case "radial":
    default:
      // Radial effect - offset from center
      redOffsetX = -maxOffset * 0.5 + offsetX;
      redOffsetY = -maxOffset * 0.5 + offsetY;
      blueOffsetX = maxOffset * 0.5 + offsetX;
      blueOffsetY = maxOffset * 0.5 + offsetY;
      break;
  }

  // SVG filter for chromatic aberration (deterministic ID)
  const filterId = `chromatic-aberration-${random("chromatic-filter-id").toString(36).slice(2, 9)}`;

  return (
    <AbsoluteFill>
      {/* SVG filter definition */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {/* Red channel offset */}
            <feOffset in="SourceGraphic" dx={redOffsetX} dy={redOffsetY} result="redOffset" />
            <feColorMatrix
              in="redOffset"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="redChannel"
            />

            {/* Green channel (no offset) */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="greenChannel"
            />

            {/* Blue channel offset */}
            <feOffset in="SourceGraphic" dx={blueOffsetX} dy={blueOffsetY} result="blueOffset" />
            <feColorMatrix
              in="blueOffset"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blueChannel"
            />

            {/* Merge channels */}
            <feBlend in="redChannel" in2="greenChannel" mode="screen" result="rgMerge" />
            <feBlend in="rgMerge" in2="blueChannel" mode="screen" result="final" />
          </filter>
        </defs>
      </svg>

      {/* Content with filter applied */}
      <AbsoluteFill style={{ filter: `url(#${filterId})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export default ChromaticAberration;
