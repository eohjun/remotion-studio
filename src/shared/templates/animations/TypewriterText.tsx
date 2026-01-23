import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Props for TypewriterText component
 */
export interface TypewriterTextProps {
  /** The text to display with typewriter effect */
  text: string;
  /** Characters revealed per frame (default: 0.5) */
  speed?: number;
  /** Show blinking cursor */
  cursor?: boolean;
  /** Custom cursor character (default: '|') */
  cursorChar?: string;
  /** Cursor blink rate in frames per blink cycle (default: 15) */
  cursorBlinkRate?: number;
  /** Initial delay before typing starts (in frames) */
  delay?: number;
  /** Text style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Called when typing is complete */
  onComplete?: () => void;
}

/**
 * TypewriterText - Animated typing effect for text
 *
 * Reveals text character by character with optional blinking cursor.
 * Speed is controlled by characters per frame for precise timing.
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 0.5,
  cursor = true,
  cursorChar = "|",
  cursorBlinkRate = 15,
  delay = 0,
  style = {},
  className,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  // Calculate how many characters to show
  const totalChars = text.length;
  const charsToShow = Math.min(totalChars, Math.floor(adjustedFrame * speed));
  const isComplete = charsToShow >= totalChars;

  // Calculate cursor visibility (blink effect)
  // Simple on/off blink: visible for first half, hidden for second half
  const blinkProgress = (adjustedFrame % cursorBlinkRate) / cursorBlinkRate;
  const cursorOpacity = cursor ? (blinkProgress < 0.5 ? 1 : 0) : 0;

  // Get the visible portion of text
  const visibleText = text.slice(0, charsToShow);

  return (
    <span className={className} style={{ display: "inline", ...style }}>
      <span style={{ whiteSpace: "pre-wrap" }}>{visibleText}</span>
      {cursor && (
        <span
          style={{
            opacity: cursorOpacity,
            fontWeight: "normal",
            marginLeft: 2,
            animation: isComplete ? undefined : "none",
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

/**
 * Calculate the duration needed for a TypewriterText animation
 * @param text The text to type
 * @param speed Characters per frame
 * @param delay Initial delay in frames
 * @returns Total frames needed
 */
export const calculateTypewriterDuration = (
  text: string,
  speed = 0.5,
  delay = 0
): number => {
  return Math.ceil(text.length / speed) + delay;
};

export default TypewriterText;
