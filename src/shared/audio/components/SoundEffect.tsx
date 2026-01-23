/**
 * SoundEffect Component
 *
 * A component for playing short sound effects at specific frames.
 *
 * @example
 * ```tsx
 * <SoundEffect
 *   src={staticFile("audio/sfx/whoosh.mp3")}
 *   startFrame={30}
 *   volume={0.5}
 * />
 * ```
 */

import React from "react";
import { Audio, Sequence } from "remotion";
import type { SoundEffectProps } from "../types";
import { SFX_PRESETS } from "../presets";

export const SoundEffect: React.FC<SoundEffectProps> = ({
  src,
  startFrame = 0,
  volume = 1,
  playbackRate = 1,
  showInTimeline = true,
}) => {
  if (startFrame === 0) {
    return (
      <Audio
        src={src}
        volume={volume}
        playbackRate={playbackRate}
        showInTimeline={showInTimeline}
      />
    );
  }

  return (
    <Sequence from={startFrame} layout="none">
      <Audio
        src={src}
        volume={volume}
        playbackRate={playbackRate}
        showInTimeline={showInTimeline}
      />
    </Sequence>
  );
};

/**
 * SoundEffect with preset configuration
 */
export const SoundEffectWithPreset: React.FC<
  Omit<SoundEffectProps, "volume"> & {
    preset: keyof typeof SFX_PRESETS;
    triggerFrame: number;
    volumeMultiplier?: number;
  }
> = ({ preset, triggerFrame, volumeMultiplier = 1, ...props }) => {
  const presetConfig = SFX_PRESETS[preset];

  return (
    <SoundEffect
      {...props}
      startFrame={triggerFrame + presetConfig.offset}
      volume={presetConfig.volume * volumeMultiplier}
    />
  );
};

/**
 * Common sound effect shortcuts
 */

export const TransitionSound: React.FC<{
  src: string;
  triggerFrame: number;
  volume?: number;
}> = ({ src, triggerFrame, volume = SFX_PRESETS.transition.volume }) => (
  <SoundEffect
    src={src}
    startFrame={triggerFrame + SFX_PRESETS.transition.offset}
    volume={volume}
  />
);

export const AppearSound: React.FC<{
  src: string;
  triggerFrame: number;
  volume?: number;
}> = ({ src, triggerFrame, volume = SFX_PRESETS.appear.volume }) => (
  <SoundEffect
    src={src}
    startFrame={triggerFrame + SFX_PRESETS.appear.offset}
    volume={volume}
  />
);

export const EmphasisSound: React.FC<{
  src: string;
  triggerFrame: number;
  volume?: number;
}> = ({ src, triggerFrame, volume = SFX_PRESETS.emphasis.volume }) => (
  <SoundEffect
    src={src}
    startFrame={triggerFrame + SFX_PRESETS.emphasis.offset}
    volume={volume}
  />
);

export default SoundEffect;
