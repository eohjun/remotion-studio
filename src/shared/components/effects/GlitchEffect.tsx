import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import type { GlitchEffectProps } from "./types";

/**
 * GlitchEffect - Digital glitch/distortion effect
 *
 * Creates a digital glitch aesthetic with:
 * - Horizontal slice displacement
 * - Color channel separation
 * - Scan line overlay
 * - Random noise artifacts
 *
 * @example
 * ```tsx
 * <GlitchEffect intensity="medium" animated>
 *   <Scene />
 * </GlitchEffect>
 * ```
 */
export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  intensity = "medium",
  animated = true,
  seed,
  showScanlines = true,
  colorShift = true,
  sliceDisplacement = true,
}) => {
  const frame = useCurrentFrame();

  // Intensity multipliers
  const intensityMap: Record<string, number> = {
    subtle: 0.3,
    medium: 0.6,
    intense: 1.0,
  };
  const intensityValue =
    typeof intensity === "number" ? intensity : intensityMap[intensity] ?? 0.6;

  // Seed for deterministic randomness
  const baseSeed = seed ?? frame;

  // Generate glitch slices
  const slices = useMemo(() => {
    if (!sliceDisplacement) return [];

    const numSlices = Math.floor(5 + intensityValue * 10);
    const sliceArr = [];

    for (let i = 0; i < numSlices; i++) {
      const sliceSeed = animated ? baseSeed * 1000 + i : i;
      const isActive = random(`active-${sliceSeed}`) < intensityValue * 0.7;

      if (isActive) {
        sliceArr.push({
          top: random(`top-${sliceSeed}`) * 100,
          height: random(`height-${sliceSeed}`) * 5 + 1,
          offsetX: (random(`offsetX-${sliceSeed}`) - 0.5) * 40 * intensityValue,
        });
      }
    }

    return sliceArr;
  }, [baseSeed, intensityValue, sliceDisplacement, animated]);

  // Generate scanlines
  const scanlineStyle = useMemo(() => {
    if (!showScanlines) return {};

    return {
      backgroundImage: `repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, ${0.1 * intensityValue}),
        rgba(0, 0, 0, ${0.1 * intensityValue}) 1px,
        transparent 1px,
        transparent 2px
      )`,
      backgroundSize: "100% 2px",
    };
  }, [showScanlines, intensityValue]);

  // Color shift values
  const colorShiftOffset = useMemo(() => {
    if (!colorShift) return { r: 0, g: 0, b: 0 };

    const shiftSeed = animated ? baseSeed : 0;
    return {
      r: (random(`r-${shiftSeed}`) - 0.5) * 6 * intensityValue,
      g: 0,
      b: (random(`b-${shiftSeed}`) - 0.5) * 6 * intensityValue,
    };
  }, [colorShift, baseSeed, intensityValue, animated]);

  // SVG filter for color shift (deterministic ID)
  const filterId = `glitch-filter-${random("glitch-filter-id").toString(36).slice(2, 9)}`;

  return (
    <AbsoluteFill>
      {/* SVG filter for RGB shift */}
      {colorShift && (
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB">
              <feOffset in="SourceGraphic" dx={colorShiftOffset.r} dy={0} result="redOffset" />
              <feColorMatrix
                in="redOffset"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="red"
              />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="green"
              />
              <feOffset in="SourceGraphic" dx={colorShiftOffset.b} dy={0} result="blueOffset" />
              <feColorMatrix
                in="blueOffset"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blue"
              />
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" />
            </filter>
          </defs>
        </svg>
      )}

      {/* Main content container */}
      <AbsoluteFill style={{ filter: colorShift ? `url(#${filterId})` : undefined }}>
        {children}
      </AbsoluteFill>

      {/* Slice displacement overlay */}
      {sliceDisplacement &&
        slices.map((slice, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${slice.top}%`,
              left: 0,
              width: "100%",
              height: `${slice.height}%`,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: `-${slice.top}%`,
                left: 0,
                width: "100%",
                height: `${10000 / slice.height}%`,
                transform: `translateX(${slice.offsetX}px)`,
              }}
            >
              {children}
            </div>
          </div>
        ))}

      {/* Scanline overlay */}
      {showScanlines && (
        <AbsoluteFill
          style={{
            ...scanlineStyle,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Random noise flicker */}
      {animated && random(`flicker-${baseSeed}`) < intensityValue * 0.3 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255, 255, 255, ${random(`brightness-${baseSeed}`) * 0.1 * intensityValue})`,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export default GlitchEffect;
