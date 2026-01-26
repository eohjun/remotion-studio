import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

/**
 * Noise texture type
 */
export type NoiseType = "static" | "perlin" | "grain" | "stipple";

/**
 * Props for NoiseTexture
 */
export interface NoiseTextureProps {
  /** Type of noise pattern */
  type?: NoiseType;
  /** Base opacity (0-1, default: 0.1) */
  opacity?: number;
  /** Noise density/scale (default: 1) */
  density?: number;
  /** Enable animation (default: true for grain) */
  animated?: boolean;
  /** Noise color (default: white) */
  color?: string;
  /** Blend mode */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** Background color */
  backgroundColor?: string;
  /** Seed for deterministic noise */
  seed?: number;
  /** Optional children */
  children?: React.ReactNode;
}

/**
 * NoiseTexture - Procedural noise background
 *
 * Generates various noise patterns for texture and visual interest.
 * Uses inline SVG filters for Remotion compatibility.
 *
 * @example
 * ```tsx
 * <NoiseTexture type="grain" opacity={0.15} animated>
 *   <Content />
 * </NoiseTexture>
 * ```
 */
export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  type = "static",
  opacity = 0.1,
  density = 1,
  animated = false,
  color = "#ffffff",
  blendMode = "overlay",
  backgroundColor,
  seed: baseSeed,
  children,
}) => {
  const frame = useCurrentFrame();

  // Calculate current seed based on animation
  const currentSeed = useMemo(() => {
    if (!animated) return baseSeed ?? 0;
    // Change every few frames for animated grain effect
    return (baseSeed ?? 0) + Math.floor(frame / 2);
  }, [animated, frame, baseSeed]);

  // Generate filter ID (deterministic)
  const filterId = useMemo(() => {
    return `noise-filter-${random("noise-filter-id").toString(36).slice(2, 9)}`;
  }, []);

  // Generate noise content based on type
  const renderNoise = () => {
    switch (type) {
      case "grain":
        // Film grain using SVG turbulence filter
        return (
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity,
              mixBlendMode: blendMode,
            }}
          >
            <defs>
              <filter id={`${filterId}-grain`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={0.7 * density}
                  numOctaves={3}
                  seed={currentSeed}
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter={`url(#${filterId}-grain)`} />
          </svg>
        );

      case "perlin":
        // Perlin-like noise using SVG turbulence
        return (
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity,
              mixBlendMode: blendMode,
            }}
          >
            <defs>
              <filter id={`${filterId}-perlin`}>
                <feTurbulence
                  type="turbulence"
                  baseFrequency={0.02 * density}
                  numOctaves={4}
                  seed={currentSeed}
                />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0"
                />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter={`url(#${filterId}-perlin)`} />
          </svg>
        );

      case "stipple":
        // Stipple pattern using SVG circles
        return (
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity,
              mixBlendMode: blendMode,
            }}
          >
            <defs>
              <pattern
                id={`${filterId}-stipple`}
                x={animated ? (currentSeed % 4) * 2 : 0}
                y={animated ? (currentSeed % 4) * 2 : 0}
                width={8 / density}
                height={8 / density}
                patternUnits="userSpaceOnUse"
              >
                <circle cx={4 / density} cy={4 / density} r={density} fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${filterId}-stipple)`} />
          </svg>
        );

      case "static":
      default: {
        // Static noise using random dots
        const pointCount = Math.floor(200 * density);
        const points = [];
        for (let i = 0; i < pointCount; i++) {
          const x = random(`x-${currentSeed}-${i}`) * 100;
          const y = random(`y-${currentSeed}-${i}`) * 100;
          const size = random(`size-${currentSeed}-${i}`) * 2 + 0.5;
          const alpha = random(`alpha-${currentSeed}-${i}`) * 0.8 + 0.2;
          points.push({ x, y, size, alpha });
        }

        return (
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity,
              mixBlendMode: blendMode,
            }}
          >
            {points.map((point, i) => (
              <circle
                key={i}
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r={point.size}
                fill={color}
                fillOpacity={point.alpha}
              />
            ))}
          </svg>
        );
      }
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {renderNoise()}
      {children && <AbsoluteFill>{children}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

export default NoiseTexture;
