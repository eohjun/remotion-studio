/**
 * AnimatedCaption - Word-level animated captions using @remotion/captions
 *
 * Converts Whisper timestamps to TikTok-style animated captions
 * with per-word highlight effects.
 *
 * @example
 * ```tsx
 * <AnimatedCaption
 *   timestampsPath="ZeigarnikEffect"
 *   sceneId="intro"
 *   style="tiktok"
 *   fontSize={64}
 * />
 * ```
 */

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
} from "@remotion/captions";

// ============================================================================
// Types
// ============================================================================

export type CaptionStyle = "tiktok" | "subtitle" | "karaoke";

export type CaptionPosition = "bottom" | "center" | "top";

/** Word-level timestamp from Whisper output */
interface WhisperWord {
  word: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
}

/** Scene timestamp data from timestamps.json */
interface WhisperScene {
  id: string;
  duration: number;
  durationFrames: number;
  text: string;
  words: WhisperWord[];
}

/** Full timestamps.json structure */
interface WhisperTimestamps {
  compositionId: string;
  fps: number;
  scenes: WhisperScene[];
}

export interface AnimatedCaptionProps {
  /** Composition ID to load timestamps from */
  compositionId: string;
  /** Scene ID within the timestamps */
  sceneId: string;
  /** Caption animation style */
  style?: CaptionStyle;
  /** Whether captions are enabled */
  enabled?: boolean;
  /** Vertical position */
  position?: CaptionPosition;
  /** Font size in pixels */
  fontSize?: number;
  /** Font color */
  color?: string;
  /** Highlight color for active word */
  highlightColor?: string;
  /** Background color for caption box */
  backgroundColor?: string;
  /** Max words per page for TikTok style */
  combineTokensWithinMilliseconds?: number;
  /** Pre-loaded timestamps data (avoids staticFile loading) */
  timestamps?: WhisperTimestamps;
}

// ============================================================================
// Helpers
// ============================================================================

function whisperWordsToCaptions(words: WhisperWord[]): Caption[] {
  return words.map((w) => ({
    text: w.word,
    startMs: w.start * 1000,
    endMs: w.end * 1000,
    timestampMs: w.start * 1000,
    confidence: 1,
  }));
}

function getPositionStyle(position: CaptionPosition): React.CSSProperties {
  switch (position) {
    case "top":
      return { top: 80, bottom: "auto" };
    case "center":
      return { top: "50%", transform: "translateY(-50%)" };
    case "bottom":
    default:
      return { bottom: 100, top: "auto" };
  }
}

// ============================================================================
// Sub-components
// ============================================================================

interface TikTokCaptionPageProps {
  tokens: Array<{ text: string; fromMs: number; toMs: number }>;
  currentTimeMs: number;
  fontSize: number;
  color: string;
  highlightColor: string;
  backgroundColor: string;
}

const TikTokCaptionPage: React.FC<TikTokCaptionPageProps> = ({
  tokens,
  currentTimeMs,
  fontSize,
  color,
  highlightColor,
  backgroundColor,
}) => {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "12px 24px",
        borderRadius: 12,
        backgroundColor,
        textAlign: "center",
        maxWidth: "80%",
      }}
    >
      <span
        style={{
          whiteSpace: "pre-wrap",
          fontSize,
          fontWeight: 800,
          lineHeight: 1.3,
          fontFamily: "sans-serif",
        }}
      >
        {tokens.map((token, i) => {
          const isActive =
            currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
          return (
            <span
              key={i}
              style={{
                color: isActive ? highlightColor : color,
                transition: "color 0.1s ease",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

interface SubtitleCaptionProps {
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
}

const SubtitleCaption: React.FC<SubtitleCaptionProps> = ({
  text,
  fontSize,
  color,
  backgroundColor,
}) => {
  return (
    <div
      style={{
        padding: "8px 20px",
        borderRadius: 4,
        backgroundColor,
        textAlign: "center",
        maxWidth: "80%",
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color,
          fontFamily: "sans-serif",
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>
    </div>
  );
};

interface KaraokeCaptionProps {
  tokens: Array<{ text: string; fromMs: number; toMs: number }>;
  currentTimeMs: number;
  fontSize: number;
  color: string;
  highlightColor: string;
}

const KaraokeCaption: React.FC<KaraokeCaptionProps> = ({
  tokens,
  currentTimeMs,
  fontSize,
  color,
  highlightColor,
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "80%",
      }}
    >
      <span
        style={{
          whiteSpace: "pre-wrap",
          fontSize,
          fontWeight: 700,
          lineHeight: 1.3,
          fontFamily: "sans-serif",
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        {tokens.map((token, i) => {
          const isPast = currentTimeMs >= token.toMs;
          const isActive =
            currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

          let tokenColor = color;
          if (isPast || isActive) tokenColor = highlightColor;

          let scale = 1;
          if (isActive) scale = 1.1;

          return (
            <span
              key={i}
              style={{
                color: tokenColor,
                display: "inline-block",
                transform: `scale(${scale})`,
                transition: "transform 0.1s ease, color 0.1s ease",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const AnimatedCaption: React.FC<AnimatedCaptionProps> = ({
  sceneId,
  style = "tiktok",
  enabled = true,
  position = "bottom",
  fontSize = 64,
  color = "rgba(255, 255, 255, 0.8)",
  highlightColor = "#FFD700",
  backgroundColor = "rgba(0, 0, 0, 0.6)",
  combineTokensWithinMilliseconds = 1200,
  timestamps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Load and process timestamps
  const pages = useMemo(() => {
    if (!timestamps) {
      return [];
    }

    const scene = timestamps.scenes.find((s) => s.id === sceneId);
    if (!scene || !scene.words?.length) {
      return [];
    }

    const captions = whisperWordsToCaptions(scene.words);
    const result = createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds,
    });

    return result.pages;
  }, [timestamps, sceneId, combineTokensWithinMilliseconds]);

  if (!enabled || pages.length === 0) return null;

  const currentTimeMs = (frame / fps) * 1000;
  const positionStyle = getPositionStyle(position);

  // Find current page
  const currentPage = pages.find((page) => {
    const pageEndMs = page.startMs + (page.durationMs ?? 0);
    return currentTimeMs >= page.startMs && currentTimeMs < pageEndMs;
  });

  if (!currentPage) return null;

  // Fade in/out
  const pageEndMs = currentPage.startMs + (currentPage.durationMs ?? 0);
  const opacity = interpolate(
    currentTimeMs,
    [
      currentPage.startMs,
      currentPage.startMs + 100,
      pageEndMs - 100,
      pageEndMs,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        ...positionStyle,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        pointerEvents: "none",
        opacity,
        position: "absolute",
      }}
    >
      {style === "tiktok" && (
        <TikTokCaptionPage
          tokens={currentPage.tokens}
          currentTimeMs={currentTimeMs}
          fontSize={fontSize}
          color={color}
          highlightColor={highlightColor}
          backgroundColor={backgroundColor}
        />
      )}
      {style === "subtitle" && (
        <SubtitleCaption
          text={currentPage.text}
          fontSize={fontSize * 0.7}
          color={color}
          backgroundColor={backgroundColor}
        />
      )}
      {style === "karaoke" && (
        <KaraokeCaption
          tokens={currentPage.tokens}
          currentTimeMs={currentTimeMs}
          fontSize={fontSize}
          color={color}
          highlightColor={highlightColor}
        />
      )}
    </AbsoluteFill>
  );
};

export default AnimatedCaption;
