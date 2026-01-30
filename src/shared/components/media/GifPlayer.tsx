/**
 * GifPlayer - GIF animation component using @remotion/gif
 *
 * Renders GIF animations synchronized with video frames.
 * Perfect for memes, reactions, and embedded GIF content.
 *
 * @example
 * // Basic usage
 * <GifPlayer src="/gifs/reaction.gif" width={400} />
 *
 * @example
 * // With fit mode and effects
 * <GifPlayer
 *   src="https://media.giphy.com/example.gif"
 *   width={600}
 *   height={400}
 *   fit="cover"
 *   fadeIn
 * />
 */
import React from "react";
import { Gif } from "@remotion/gif";
import { useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { spring, interpolate } from "remotion";
import { SPRING_CONFIGS } from "../constants";

export interface GifPlayerProps {
  /** URL or path to GIF file (paths starting with / are treated as public assets) */
  src: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels (if not set, maintains aspect ratio) */
  height?: number;
  /** Object-fit mode for the GIF */
  fit?: "cover" | "contain" | "fill";
  /** Loop the GIF (default: true) */
  loop?: boolean;
  /** Start from this video frame */
  startFrame?: number;
  /** Fade in animation */
  fadeIn?: boolean;
  /** Scale in animation */
  scaleIn?: boolean;
  /** Play at a different speed (default: 1) */
  playbackRate?: number;
  /** Border radius */
  borderRadius?: number;
  /** Drop shadow */
  shadow?: boolean;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}

export const GifPlayer: React.FC<GifPlayerProps> = ({
  src,
  width,
  height,
  fit = "contain",
  loop = true,
  startFrame = 0,
  fadeIn = false,
  scaleIn = false,
  playbackRate = 1,
  borderRadius = 0,
  shadow = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve source path
  const resolvedSrc = src.startsWith("/") ? staticFile(src.slice(1)) : src;

  // Entry animations
  const entryProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = fadeIn
    ? interpolate(entryProgress, [0, 1], [0, 1])
    : frame >= startFrame ? 1 : 0;

  const scale = scaleIn
    ? interpolate(entryProgress, [0, 1], [0.85, 1])
    : 1;

  const containerStyle: React.CSSProperties = {
    width,
    height: height ?? "auto",
    opacity,
    transform: `scale(${scale})`,
    borderRadius,
    overflow: "hidden",
    ...(shadow && {
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    }),
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      <Gif
        src={resolvedSrc}
        width={width}
        height={height}
        fit={fit}
        playbackRate={playbackRate}
        loopBehavior={loop ? "loop" : "pause-after-finish"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

// ============================================================================
// Convenience Components
// ============================================================================

export interface ReactionGifProps {
  src: string;
  size?: number;
  startFrame?: number;
  style?: React.CSSProperties;
}

/**
 * Circular reaction GIF with shadow
 * Common for meme-style reactions
 */
export const ReactionGif: React.FC<ReactionGifProps> = ({
  src,
  size = 200,
  startFrame = 0,
  style,
}) => (
  <GifPlayer
    src={src}
    width={size}
    height={size}
    fit="cover"
    borderRadius={size / 2}
    shadow
    fadeIn
    scaleIn
    startFrame={startFrame}
    style={style}
  />
);

/**
 * Full-width banner GIF
 */
export const BannerGif: React.FC<{
  src: string;
  height?: number;
  startFrame?: number;
  style?: React.CSSProperties;
}> = ({
  src,
  height = 300,
  startFrame = 0,
  style,
}) => (
  <GifPlayer
    src={src}
    width={1920}
    height={height}
    fit="cover"
    fadeIn
    startFrame={startFrame}
    style={style}
  />
);

export default GifPlayer;
