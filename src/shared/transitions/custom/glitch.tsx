/**
 * Custom glitch transition presentation
 *
 * Creates a digital glitch effect with RGB split, scan lines,
 * and random displacement for a cyberpunk aesthetic.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type GlitchProps = {
  /** Intensity of the glitch effect (default: 1) */
  intensity?: number;
  /** Number of glitch slices (default: 10) */
  slices?: number;
  /** RGB split amount in pixels (default: 10) */
  rgbSplit?: number;
  /** Show scan lines (default: true) */
  showScanLines?: boolean;
  /** Random seed for reproducible glitch patterns */
  seed?: number;
};

const GlitchPresentation: React.FC<
  TransitionPresentationComponentProps<GlitchProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const {
    intensity = 1,
    rgbSplit = 10,
    showScanLines = true,
    seed = 0,
  } = passedProps;
  const isEntering = presentationDirection === "entering";

  // Calculate overall opacity
  const opacity = isEntering
    ? interpolate(presentationProgress, [0, 0.3, 1], [0, 1, 1])
    : interpolate(presentationProgress, [0, 0.7, 1], [1, 1, 0]);

  // Glitch intensity peaks at the middle of the transition
  const glitchIntensity = interpolate(
    presentationProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0, intensity * 0.5, intensity, intensity * 0.5, 0]
  );

  // Generate random offsets for the glitch effect
  const glitchOffsetX = useMemo(() => {
    const offset = random(`glitch-x-${seed}-${Math.floor(presentationProgress * 10)}`) * 2 - 1;
    return offset * 20 * glitchIntensity;
  }, [seed, presentationProgress, glitchIntensity]);

  const glitchOffsetY = useMemo(() => {
    const offset = random(`glitch-y-${seed}-${Math.floor(presentationProgress * 10)}`) * 2 - 1;
    return offset * 10 * glitchIntensity;
  }, [seed, presentationProgress, glitchIntensity]);

  // RGB split based on intensity
  const rgbOffset = rgbSplit * glitchIntensity;

  // Scale jitter
  const scaleJitter = useMemo(() => {
    const jitter = random(`scale-${seed}-${Math.floor(presentationProgress * 20)}`);
    return 1 + (jitter * 0.05 - 0.025) * glitchIntensity;
  }, [seed, presentationProgress, glitchIntensity]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Main content layer */}
      <AbsoluteFill
        style={{
          transform: `translate(${glitchOffsetX}px, ${glitchOffsetY}px) scale(${scaleJitter})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* RGB Split - Red channel */}
      {rgbOffset > 0 && (
        <AbsoluteFill
          style={{
            transform: `translate(${-rgbOffset + glitchOffsetX}px, ${glitchOffsetY}px)`,
            mixBlendMode: "screen",
            opacity: 0.5 * glitchIntensity,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 0, 0, 0.3)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* RGB Split - Blue channel */}
      {rgbOffset > 0 && (
        <AbsoluteFill
          style={{
            transform: `translate(${rgbOffset + glitchOffsetX}px, ${glitchOffsetY}px)`,
            mixBlendMode: "screen",
            opacity: 0.5 * glitchIntensity,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 255, 0.3)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Scan lines overlay */}
      {showScanLines && glitchIntensity > 0 && (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, ${0.1 * glitchIntensity}) 2px,
              rgba(0, 0, 0, ${0.1 * glitchIntensity}) 4px
            )`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Random noise overlay */}
      {glitchIntensity > 0.3 && (
        <AbsoluteFill
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.05 * glitchIntensity,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Create a glitch transition presentation
 */
export const glitch = (props: GlitchProps = {}): TransitionPresentation<GlitchProps> => {
  return {
    component: GlitchPresentation,
    props,
  };
};

export default glitch;
