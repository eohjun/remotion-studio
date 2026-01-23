/**
 * BackgroundMusic Component
 *
 * A component for playing background music with automatic volume
 * automation (fade in/out) and support for looping.
 *
 * @example
 * ```tsx
 * <BackgroundMusic
 *   src={staticFile("audio/music/ambient.mp3")}
 *   volume={0.3}
 *   fadeInDuration={60}
 *   fadeOutDuration={90}
 *   loop={true}
 * />
 * ```
 */

import React from "react";
import { Audio, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import type { BackgroundMusicProps } from "../types";
import { fadeInOut } from "../utils/volumeUtils";
import { MUSIC_PRESETS } from "../presets";

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  src,
  volume = 0.3,
  loop = true,
  fadeInDuration = MUSIC_PRESETS.ambient.fadeIn,
  fadeOutDuration = MUSIC_PRESETS.ambient.fadeOut,
  startFrom = 0,
  startFrame = 0,
  endFrame,
  playbackRate = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Calculate effective duration
  const effectiveDuration = endFrame
    ? endFrame - startFrame
    : durationInFrames - startFrame;

  // Calculate current volume with fades
  const currentVolume = fadeInOut(
    frame - startFrame,
    effectiveDuration,
    fadeInDuration,
    fadeOutDuration,
    volume
  );

  // Don't render before start frame
  if (startFrame > 0) {
    return (
      <Sequence from={startFrame} durationInFrames={effectiveDuration}>
        <BackgroundMusicInner
          src={src}
          volume={currentVolume}
          loop={loop}
          startFrom={startFrom}
          playbackRate={playbackRate}
        />
      </Sequence>
    );
  }

  return (
    <BackgroundMusicInner
      src={src}
      volume={currentVolume}
      loop={loop}
      startFrom={startFrom}
      playbackRate={playbackRate}
    />
  );
};

/**
 * Inner component without sequence wrapper
 */
const BackgroundMusicInner: React.FC<{
  src: string;
  volume: number;
  loop: boolean;
  startFrom: number;
  playbackRate: number;
}> = ({ src, volume, loop, startFrom, playbackRate }) => {
  return (
    <Audio
      src={src}
      volume={volume}
      loop={loop}
      startFrom={startFrom}
      playbackRate={playbackRate}
    />
  );
};

/**
 * BackgroundMusic with preset configuration
 */
export const BackgroundMusicWithPreset: React.FC<
  Omit<BackgroundMusicProps, "volume" | "fadeInDuration" | "fadeOutDuration"> & {
    preset: keyof typeof MUSIC_PRESETS;
    volumeMultiplier?: number;
  }
> = ({ preset, volumeMultiplier = 1, ...props }) => {
  const presetConfig = MUSIC_PRESETS[preset];

  return (
    <BackgroundMusic
      {...props}
      volume={presetConfig.volume * volumeMultiplier}
      fadeInDuration={presetConfig.fadeIn}
      fadeOutDuration={presetConfig.fadeOut}
    />
  );
};

export default BackgroundMusic;
