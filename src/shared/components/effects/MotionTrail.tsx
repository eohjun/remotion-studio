/**
 * MotionTrail - Trail effect presets using @remotion/motion-blur
 *
 * Provides ready-to-use Trail presets for common motion effects.
 * Wraps Remotion's Trail component with curated configurations.
 *
 * @example
 * ```tsx
 * <MotionTrail preset="ghost">
 *   <MovingElement />
 * </MotionTrail>
 * ```
 */

import React from "react";
import { Trail } from "@remotion/motion-blur";

export type TrailPreset = "ghost" | "speedLines" | "echo" | "smooth" | "heavy";

export interface MotionTrailProps {
  children: React.ReactNode;
  /** Preset configuration */
  preset?: TrailPreset;
  /** Override lag in frames (default set by preset) */
  lagInFrames?: number;
  /** Override number of trail layers (default set by preset) */
  layers?: number;
  /** Override trail opacity per layer (default set by preset) */
  trailOpacity?: number;
  /** Disable the effect (renders children directly) */
  enabled?: boolean;
}

interface TrailConfig {
  lagInFrames: number;
  layers: number;
  trailOpacity: number;
}

const PRESETS: Record<TrailPreset, TrailConfig> = {
  /** Subtle ghosting - good for text reveals */
  ghost: {
    lagInFrames: 0.3,
    layers: 5,
    trailOpacity: 0.15,
  },
  /** Fast motion lines - good for sliding elements */
  speedLines: {
    lagInFrames: 0.8,
    layers: 8,
    trailOpacity: 0.08,
  },
  /** Repeating echo - good for emphasis animations */
  echo: {
    lagInFrames: 0.5,
    layers: 4,
    trailOpacity: 0.25,
  },
  /** Smooth cinema-like blur */
  smooth: {
    lagInFrames: 0.5,
    layers: 10,
    trailOpacity: 0.1,
  },
  /** Heavy dramatic blur */
  heavy: {
    lagInFrames: 1.0,
    layers: 15,
    trailOpacity: 0.07,
  },
};

export const MotionTrail: React.FC<MotionTrailProps> = ({
  children,
  preset = "ghost",
  lagInFrames,
  layers,
  trailOpacity,
  enabled = true,
}) => {
  if (!enabled) {
    return <>{children}</>;
  }

  const config = PRESETS[preset];

  return (
    <Trail
      lagInFrames={lagInFrames ?? config.lagInFrames}
      layers={layers ?? config.layers}
      trailOpacity={trailOpacity ?? config.trailOpacity}
    >
      {children}
    </Trail>
  );
};
