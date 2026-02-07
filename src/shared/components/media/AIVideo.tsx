/**
 * AIVideo - Component for displaying AI-generated video clips
 *
 * Wraps Remotion's OffthreadVideo for optimal playback of
 * AI-generated motion clips (typically 2-5 seconds).
 *
 * @example
 * ```tsx
 * <AIVideo
 *   src={staticFile("videos/MyVideo/ai-assets/scene1-motion.mp4")}
 *   loop
 * />
 * ```
 */

import React from "react";
import { AbsoluteFill, OffthreadVideo, Loop } from "remotion";

export interface AIVideoProps {
  /** Video source URL or staticFile path */
  src: string;
  /** Loop the video */
  loop?: boolean;
  /** Duration for looping in frames */
  loopDurationInFrames?: number;
  /** Volume (0-1, default: 0 for background clips) */
  volume?: number;
  /** Playback rate */
  playbackRate?: number;
  /** Object-fit behavior */
  fit?: React.CSSProperties["objectFit"];
  /** Additional styles */
  style?: React.CSSProperties;
  /** Fallback content when video is unavailable */
  fallback?: React.ReactNode;
  /** Fallback background color */
  fallbackColor?: string;
}

export const AIVideo: React.FC<AIVideoProps> = ({
  src,
  loop = false,
  loopDurationInFrames = 150,
  volume = 0,
  playbackRate = 1,
  fit = "cover",
  style,
  fallback,
  fallbackColor = "#1a1a2e",
}) => {
  if (!src) {
    return (
      <AbsoluteFill style={{ backgroundColor: fallbackColor }}>
        {fallback}
      </AbsoluteFill>
    );
  }

  const videoElement = (
    <OffthreadVideo
      src={src}
      volume={volume}
      playbackRate={playbackRate}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
      }}
    />
  );

  if (loop) {
    return (
      <AbsoluteFill style={style}>
        <Loop durationInFrames={loopDurationInFrames}>
          {videoElement}
        </Loop>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={style}>
      {videoElement}
    </AbsoluteFill>
  );
};

export default AIVideo;
