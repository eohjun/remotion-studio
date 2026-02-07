/**
 * OfficialLightLeak - WebGL-based light leak effect wrapper
 *
 * Uses @remotion/light-leaks for GPU-accelerated light leak effects.
 * The existing CSS-based LightLeak.tsx is preserved for backward compatibility.
 *
 * @example
 * ```tsx
 * <OfficialLightLeak seed={3} hueShift={30} durationInFrames={60} />
 * ```
 */

import React from "react";
import { AbsoluteFill } from "remotion";
import { LightLeak as RemotionLightLeak } from "@remotion/light-leaks";

export interface OfficialLightLeakProps {
  /** Seed for the light leak pattern (different seeds = different shapes) */
  seed?: number;
  /** Hue shift in degrees (0-360). Default is yellow-orange, 120=green, 240=blue */
  hueShift?: number;
  /** Duration of the effect in frames */
  durationInFrames: number;
  /** Opacity of the light leak layer (0-1) */
  opacity?: number;
  /** Blend mode for compositing */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** Wrap children with the effect */
  children?: React.ReactNode;
}

export const OfficialLightLeak: React.FC<OfficialLightLeakProps> = ({
  seed = 1,
  hueShift = 0,
  durationInFrames,
  opacity = 1,
  blendMode = "screen",
  children,
}) => {
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill
        style={{
          opacity,
          mixBlendMode: blendMode,
          pointerEvents: "none",
        }}
      >
        <RemotionLightLeak
          seed={seed}
          hueShift={hueShift}
          durationInFrames={durationInFrames}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default OfficialLightLeak;
