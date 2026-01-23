/**
 * AudioLayer Component
 *
 * A multi-track audio management component that handles multiple
 * audio sources with individual volume controls and fading.
 *
 * @example
 * ```tsx
 * <AudioLayer
 *   tracks={[
 *     {
 *       id: "bg-music",
 *       src: staticFile("audio/music/ambient.mp3"),
 *       volume: 0.3,
 *       startFrame: 0,
 *       fadeIn: 60,
 *       fadeOut: 90,
 *       loop: true,
 *     },
 *     {
 *       id: "narration",
 *       src: staticFile("audio/narration.mp3"),
 *       volume: 1,
 *       startFrame: 30,
 *     },
 *   ]}
 *   masterVolume={1}
 * />
 * ```
 */

import React from "react";
import { Audio, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { AudioLayerProps, AudioTrack } from "../types";
import { fadeInOut, clampVolume } from "../utils/volumeUtils";

/**
 * Individual track renderer
 */
const TrackRenderer: React.FC<{
  track: AudioTrack;
  masterVolume: number;
}> = ({ track, masterVolume }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const {
    src,
    volume,
    startFrame,
    durationInFrames: trackDuration,
    fadeIn = 0,
    fadeOut = 0,
    loop = false,
    playbackRate = 1,
  } = track;

  // Calculate effective duration for this track
  const effectiveDuration = trackDuration || durationInFrames - startFrame;

  // Calculate local frame (relative to track start)
  const localFrame = frame - startFrame;

  // Only calculate volume if we're within the track's duration
  if (localFrame < 0 || localFrame >= effectiveDuration) {
    return null;
  }

  // Calculate volume with fades
  let trackVolume = volume;

  if (fadeIn > 0 || fadeOut > 0) {
    trackVolume = fadeInOut(
      localFrame,
      effectiveDuration,
      fadeIn,
      fadeOut,
      volume
    );
  }

  // Apply master volume
  const finalVolume = clampVolume(trackVolume * masterVolume);

  return (
    <Sequence
      from={startFrame}
      durationInFrames={effectiveDuration}
      layout="none"
    >
      <Audio
        src={src}
        volume={finalVolume}
        loop={loop}
        playbackRate={playbackRate}
      />
    </Sequence>
  );
};

/**
 * AudioLayer component for multi-track audio management
 */
export const AudioLayer: React.FC<AudioLayerProps> = ({
  tracks,
  masterVolume = 1,
}) => {
  return (
    <>
      {tracks.map((track) => (
        <TrackRenderer
          key={track.id}
          track={track}
          masterVolume={masterVolume}
        />
      ))}
    </>
  );
};

/**
 * Create a track configuration helper
 */
export function createTrack(
  id: string,
  src: string,
  config: Partial<Omit<AudioTrack, "id" | "src">> = {}
): AudioTrack {
  return {
    id,
    src,
    volume: 1,
    startFrame: 0,
    ...config,
  };
}

/**
 * Create a music track with common defaults
 */
export function createMusicTrack(
  id: string,
  src: string,
  config: Partial<Omit<AudioTrack, "id" | "src">> = {}
): AudioTrack {
  return createTrack(id, src, {
    volume: 0.3,
    loop: true,
    fadeIn: 60,
    fadeOut: 60,
    ...config,
  });
}

/**
 * Create a narration track with common defaults
 */
export function createNarrationTrack(
  id: string,
  src: string,
  startFrame: number,
  config: Partial<Omit<AudioTrack, "id" | "src" | "startFrame">> = {}
): AudioTrack {
  return createTrack(id, src, {
    volume: 1,
    startFrame,
    loop: false,
    ...config,
  });
}

/**
 * Create an SFX track with common defaults
 */
export function createSFXTrack(
  id: string,
  src: string,
  startFrame: number,
  config: Partial<Omit<AudioTrack, "id" | "src" | "startFrame">> = {}
): AudioTrack {
  return createTrack(id, src, {
    volume: 0.5,
    startFrame,
    loop: false,
    ...config,
  });
}

export default AudioLayer;
