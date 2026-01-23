import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

/**
 * Caption animation style types
 */
export type CaptionStyle = "bounce" | "highlight" | "scale" | "karaoke";

/**
 * Caption position on screen
 */
export type CaptionPosition = "bottom" | "center" | "top";

/**
 * Individual word timing data
 */
export interface CaptionWord {
  /** The word text */
  text: string;
  /** Frame when this word becomes active */
  startFrame: number;
  /** Frame when this word becomes inactive (optional, defaults to next word start) */
  endFrame?: number;
}

/**
 * Props for CaptionText component
 */
export interface CaptionTextProps {
  /** Array of words with timing information */
  words: CaptionWord[];
  /** Animation style for active words */
  style?: CaptionStyle;
  /** Vertical position on screen */
  position?: CaptionPosition;
  /** Color for active/current word */
  activeColor?: string;
  /** Color for inactive words */
  inactiveColor?: string;
  /** Background color for caption container */
  backgroundColor?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: number;
  /** Font family */
  fontFamily?: string;
  /** Show all words or only active word (TikTok style) */
  showAllWords?: boolean;
  /** Number of words to show at a time (for partial display) */
  wordsPerLine?: number;
  /** Padding around text */
  padding?: number | string;
  /** Border radius for background */
  borderRadius?: number;
  /** Custom container style */
  containerStyle?: React.CSSProperties;
  /** Custom text style */
  textStyle?: React.CSSProperties;
}

/**
 * Get styles for a word based on animation style
 */
const getWordStyles = (
  isActive: boolean,
  progress: number,
  animStyle: CaptionStyle,
  activeColor: string,
  inactiveColor: string,
): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    display: "inline-block",
    transition: "color 0.1s ease",
    color: isActive ? activeColor : inactiveColor,
    marginRight: "0.3em",
    whiteSpace: "nowrap",
  };

  if (!isActive) {
    return baseStyles;
  }

  switch (animStyle) {
    case "bounce": {
      const bounceY = interpolate(progress, [0, 0.5, 1], [0, -8, 0]);
      return {
        ...baseStyles,
        transform: `translateY(${bounceY}px)`,
      };
    }

    case "scale": {
      const scale = interpolate(progress, [0, 0.3, 1], [1, 1.15, 1]);
      return {
        ...baseStyles,
        transform: `scale(${scale})`,
        transformOrigin: "center bottom",
      };
    }

    case "highlight": {
      const bgOpacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.4, 0.4, 0]);
      return {
        ...baseStyles,
        backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
        padding: "0.1em 0.2em",
        borderRadius: 4,
      };
    }

    case "karaoke": {
      // Karaoke style: fill from left to right
      const fillProgress = interpolate(progress, [0, 1], [0, 100]);
      return {
        ...baseStyles,
        background: `linear-gradient(90deg, ${activeColor} ${fillProgress}%, ${inactiveColor} ${fillProgress}%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    }

    default:
      return baseStyles;
  }
};

/**
 * Get position styles based on position prop
 */
const getPositionStyles = (position: CaptionPosition): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    textAlign: "center",
  };

  switch (position) {
    case "top":
      return { ...base, top: "10%" };
    case "center":
      return { ...base, top: "50%", transform: "translate(-50%, -50%)" };
    case "bottom":
    default:
      return { ...base, bottom: "15%" };
  }
};

/**
 * CaptionText - TikTok-style word-by-word caption component
 *
 * Displays animated captions synchronized with narration/audio.
 * Supports multiple animation styles and positioning options.
 *
 * @example
 * ```tsx
 * const words = [
 *   { text: "Hello", startFrame: 0, endFrame: 30 },
 *   { text: "world", startFrame: 30, endFrame: 60 },
 *   { text: "!", startFrame: 60, endFrame: 90 },
 * ];
 *
 * <CaptionText
 *   words={words}
 *   style="bounce"
 *   position="bottom"
 *   activeColor="#ffffff"
 *   inactiveColor="rgba(255,255,255,0.5)"
 * />
 * ```
 */
export const CaptionText: React.FC<CaptionTextProps> = ({
  words,
  style: animStyle = "bounce",
  position = "bottom",
  activeColor = "#ffffff",
  inactiveColor = "rgba(255, 255, 255, 0.5)",
  backgroundColor = "rgba(0, 0, 0, 0.6)",
  fontSize = 48,
  fontWeight = 700,
  fontFamily = "Pretendard, SF Pro Display, -apple-system, sans-serif",
  showAllWords = true,
  wordsPerLine,
  padding = "16px 24px",
  borderRadius = 12,
  containerStyle = {},
  textStyle = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which words to display based on current frame
  const getVisibleWords = (): CaptionWord[] => {
    if (showAllWords) {
      return words;
    }

    // Find current active word index
    const activeIndex = words.findIndex((word, idx) => {
      const nextWord = words[idx + 1];
      const endFrame = word.endFrame ?? nextWord?.startFrame ?? Infinity;
      return frame >= word.startFrame && frame < endFrame;
    });

    if (activeIndex === -1) {
      // Before first word or after last word
      if (frame < (words[0]?.startFrame ?? 0)) {
        return words.slice(0, wordsPerLine ?? 5);
      }
      return words.slice(Math.max(0, words.length - (wordsPerLine ?? 5)));
    }

    // Show words around active word
    const halfWindow = Math.floor((wordsPerLine ?? 5) / 2);
    const start = Math.max(0, activeIndex - halfWindow);
    const end = Math.min(words.length, start + (wordsPerLine ?? 5));
    return words.slice(start, end);
  };

  const visibleWords = getVisibleWords();

  return (
    <div style={{ ...getPositionStyles(position), ...containerStyle }}>
      <div
        style={{
          display: "inline-block",
          backgroundColor,
          padding,
          borderRadius,
          fontSize,
          fontWeight,
          fontFamily,
          lineHeight: 1.4,
          ...textStyle,
        }}
      >
        {visibleWords.map((word, index) => {
          // Calculate if this word is currently active
          const nextWord = words[words.indexOf(word) + 1];
          const endFrame = word.endFrame ?? nextWord?.startFrame ?? Infinity;
          const isActive = frame >= word.startFrame && frame < endFrame;

          // Calculate animation progress for active word
          const wordDuration = endFrame - word.startFrame;
          const progress = isActive
            ? spring({
                frame: frame - word.startFrame,
                fps,
                config: {
                  damping: 60,
                  mass: 0.4,
                  stiffness: 300,
                },
                durationInFrames: Math.min(wordDuration, 15),
              })
            : 0;

          return (
            <span
              key={`${word.text}-${index}`}
              style={getWordStyles(
                isActive,
                progress,
                animStyle,
                activeColor,
                inactiveColor,
              )}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Helper function to create words array from text and timing data
 *
 * @example
 * ```tsx
 * const text = "Hello world this is a test";
 * const words = createCaptionWords(text, 0, 180, 30); // 6 words, starting at frame 0, ~30fps per word
 * ```
 */
export const createCaptionWords = (
  text: string,
  startFrame: number,
  totalDuration: number,
): CaptionWord[] => {
  const wordArray = text.split(/\s+/).filter(Boolean);
  const framesPerWord = Math.floor(totalDuration / wordArray.length);

  return wordArray.map((word, index) => ({
    text: word,
    startFrame: startFrame + index * framesPerWord,
    endFrame: startFrame + (index + 1) * framesPerWord,
  }));
};

/**
 * Helper function to create words array from transcript with timestamps
 *
 * @example
 * ```tsx
 * const transcript = [
 *   { word: "Hello", start: 0, end: 0.5 },
 *   { word: "world", start: 0.5, end: 1.0 },
 * ];
 * const words = createCaptionWordsFromTranscript(transcript, 30);
 * ```
 */
export interface TranscriptWord {
  word: string;
  start: number; // seconds
  end: number; // seconds
}

export const createCaptionWordsFromTranscript = (
  transcript: TranscriptWord[],
  fps: number,
): CaptionWord[] => {
  return transcript.map((item) => ({
    text: item.word,
    startFrame: Math.round(item.start * fps),
    endFrame: Math.round(item.end * fps),
  }));
};

export default CaptionText;
