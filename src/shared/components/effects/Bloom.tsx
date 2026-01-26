import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import type { BloomProps } from "./types";

/**
 * Bloom - Glow effect for bright areas
 *
 * Creates a soft glow around bright elements in the scene.
 * Simulates the optical phenomenon where bright light
 * bleeds into surrounding areas.
 *
 * Uses CSS blur and blend modes for efficient rendering.
 *
 * @example
 * ```tsx
 * <Bloom intensity={0.5} radius={20} threshold={0.8}>
 *   <BrightScene />
 * </Bloom>
 * ```
 */
export const Bloom: React.FC<BloomProps> = ({
  children,
  intensity = 0.5,
  radius = 15,
  threshold = 0.7,
  color,
  blendMode = "screen",
}) => {
  // Calculate blur amount based on radius
  const blurAmount = useMemo(() => {
    return Math.max(1, radius);
  }, [radius]);

  // Threshold filter to extract bright areas
  // Higher threshold = only very bright areas glow
  const thresholdFilter = useMemo(() => {
    // Use brightness and contrast to create a threshold effect
    const contrast = 1 + threshold * 2;
    const brightness = 1 - threshold * 0.3;
    return `brightness(${brightness}) contrast(${contrast})`;
  }, [threshold]);

  // Color tint filter
  const colorTint = useMemo(() => {
    if (!color) return "";
    // Add a sepia base then hue-rotate for color tinting
    return `sepia(1) hue-rotate(0deg)`;
  }, [color]);

  // Combine filters for the bloom layer
  const bloomFilter = useMemo(() => {
    const filters = [thresholdFilter, `blur(${blurAmount}px)`];
    if (colorTint) {
      filters.push(colorTint);
    }
    return filters.join(" ");
  }, [thresholdFilter, blurAmount, colorTint]);

  return (
    <AbsoluteFill>
      {/* Base content layer */}
      <AbsoluteFill>{children}</AbsoluteFill>

      {/* Bloom glow layer */}
      <AbsoluteFill
        style={{
          filter: bloomFilter,
          opacity: intensity,
          mixBlendMode: blendMode,
          pointerEvents: "none",
          // Extend beyond bounds to prevent edge clipping of blur
          position: "absolute",
          top: -blurAmount,
          left: -blurAmount,
          right: -blurAmount,
          bottom: -blurAmount,
          width: `calc(100% + ${blurAmount * 2}px)`,
          height: `calc(100% + ${blurAmount * 2}px)`,
        }}
      >
        {/* Offset children to compensate for extended bounds */}
        <div
          style={{
            position: "absolute",
            top: blurAmount,
            left: blurAmount,
            width: `calc(100% - ${blurAmount * 2}px)`,
            height: `calc(100% - ${blurAmount * 2}px)`,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>

      {/* Optional color overlay for tinting */}
      {color && (
        <AbsoluteFill
          style={{
            backgroundColor: color,
            filter: `blur(${blurAmount * 1.5}px)`,
            opacity: intensity * 0.3,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export default Bloom;
