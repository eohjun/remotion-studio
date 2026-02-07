/**
 * Overlay Transition Presets
 *
 * Uses TransitionSeries.Overlay + @remotion/light-leaks for
 * cinematic scene transitions that don't shorten the timeline.
 *
 * These presets are designed to be used with TransitionSeries.Overlay
 * and complement the existing 29 transition presets in presets.ts.
 *
 * @example
 * ```tsx
 * import { TransitionSeries } from "@remotion/transitions";
 * import { OVERLAY_PRESETS } from "./overlayPresets";
 *
 * <TransitionSeries>
 *   <TransitionSeries.Sequence durationInFrames={300}>
 *     <Scene1 />
 *   </TransitionSeries.Sequence>
 *   <TransitionSeries.Overlay durationInFrames={40}>
 *     {OVERLAY_PRESETS.lightLeak.render()}
 *   </TransitionSeries.Overlay>
 *   <TransitionSeries.Sequence durationInFrames={300}>
 *     <Scene2 />
 *   </TransitionSeries.Sequence>
 * </TransitionSeries>
 * ```
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LightLeak } from "@remotion/light-leaks";

// ============================================================================
// Types
// ============================================================================

export type OverlayPresetName =
  | "lightLeak"
  | "lightLeakWarm"
  | "lightLeakCool"
  | "lightLeakGreen"
  | "flash"
  | "whiteFlash"
  | "glowPulse";

export interface OverlayPresetConfig {
  /** Duration of the overlay in frames */
  durationInFrames: number;
  /** Render function that returns the overlay content */
  render: () => React.ReactNode;
}

// ============================================================================
// Overlay Components
// ============================================================================

const FlashOverlay: React.FC<{
  color?: string;
  durationInFrames: number;
}> = ({ color = "rgba(255, 255, 255, 0.9)", durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, durationInFrames * 0.2, durationInFrames * 0.5, durationInFrames],
    [0, 1, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const GlowPulseOverlay: React.FC<{
  color?: string;
  durationInFrames: number;
}> = ({ color = "rgba(255, 200, 100, 0.6)", durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, durationInFrames * 0.3, durationInFrames * 0.7, durationInFrames],
    [0, 0.6, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [0, durationInFrames * 0.5, durationInFrames],
    [0.8, 1.2, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "120%",
          height: "120%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// Presets
// ============================================================================

export const OVERLAY_PRESETS: Record<OverlayPresetName, OverlayPresetConfig> = {
  lightLeak: {
    durationInFrames: 40,
    render: () => (
      <LightLeak seed={3} hueShift={30} durationInFrames={40} />
    ),
  },

  lightLeakWarm: {
    durationInFrames: 50,
    render: () => (
      <LightLeak seed={5} hueShift={0} durationInFrames={50} />
    ),
  },

  lightLeakCool: {
    durationInFrames: 50,
    render: () => (
      <LightLeak seed={7} hueShift={240} durationInFrames={50} />
    ),
  },

  lightLeakGreen: {
    durationInFrames: 45,
    render: () => (
      <LightLeak seed={2} hueShift={120} durationInFrames={45} />
    ),
  },

  flash: {
    durationInFrames: 20,
    render: () => (
      <FlashOverlay color="rgba(255, 240, 200, 0.9)" durationInFrames={20} />
    ),
  },

  whiteFlash: {
    durationInFrames: 15,
    render: () => (
      <FlashOverlay color="rgba(255, 255, 255, 0.95)" durationInFrames={15} />
    ),
  },

  glowPulse: {
    durationInFrames: 35,
    render: () => (
      <GlowPulseOverlay
        color="rgba(255, 200, 100, 0.5)"
        durationInFrames={35}
      />
    ),
  },
};

/**
 * Get an overlay preset by name with optional duration override
 */
export function getOverlayPreset(
  name: OverlayPresetName,
  durationOverride?: number
): OverlayPresetConfig {
  const preset = OVERLAY_PRESETS[name];
  if (durationOverride) {
    return {
      ...preset,
      durationInFrames: durationOverride,
    };
  }
  return preset;
}

/**
 * Create a custom light leak overlay preset
 */
export function createLightLeakOverlay(options: {
  seed?: number;
  hueShift?: number;
  durationInFrames?: number;
}): OverlayPresetConfig {
  const {
    seed = 1,
    hueShift = 0,
    durationInFrames = 40,
  } = options;

  return {
    durationInFrames,
    render: () => (
      <LightLeak
        seed={seed}
        hueShift={hueShift}
        durationInFrames={durationInFrames}
      />
    ),
  };
}
