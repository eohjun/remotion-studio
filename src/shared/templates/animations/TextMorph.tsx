import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * Text morph animation type
 */
export type MorphType =
  | "fade"
  | "slide"
  | "flip"
  | "blur"
  | "scale"
  | "typewriter"
  | "wave";

/**
 * Props for TextMorph component
 */
export interface TextMorphProps {
  /** Starting text */
  from: string;
  /** Ending text */
  to: string;
  /** Frame at which morphing starts */
  startFrame?: number;
  /** Duration of the morph in frames */
  duration?: number;
  /** Type of morph animation */
  morphType?: MorphType;
  /** Use spring physics for smoother animation */
  useSpring?: boolean;
  /** Spring configuration */
  springConfig?: {
    damping?: number;
    mass?: number;
    stiffness?: number;
  };
  /** Character-by-character animation delay */
  characterDelay?: number;
  /** Text style */
  style?: React.CSSProperties;
  /** Additional className */
  className?: string;
}

/**
 * Get character animation styles based on morph type
 */
function getCharacterStyles(
  morphType: MorphType,
  progress: number,
  isFromChar: boolean,
  index: number,
  total: number
): React.CSSProperties {
  // Progress for "from" text goes 1 → 0, "to" text goes 0 → 1
  const charProgress = isFromChar ? 1 - progress : progress;

  switch (morphType) {
    case "fade":
      return {
        opacity: charProgress,
        display: "inline-block",
      };

    case "slide": {
      const offset = isFromChar ? -20 * (1 - charProgress) : 20 * (1 - charProgress);
      return {
        opacity: charProgress,
        transform: `translateY(${offset}px)`,
        display: "inline-block",
      };
    }

    case "flip":
      return {
        opacity: charProgress > 0.5 ? 1 : 0,
        transform: `perspective(200px) rotateX(${(1 - charProgress) * (isFromChar ? -90 : 90)}deg)`,
        display: "inline-block",
        transformOrigin: isFromChar ? "bottom" : "top",
      };

    case "blur":
      return {
        opacity: charProgress,
        filter: `blur(${(1 - charProgress) * 4}px)`,
        display: "inline-block",
      };

    case "scale":
      return {
        opacity: charProgress,
        transform: `scale(${0.5 + charProgress * 0.5})`,
        display: "inline-block",
      };

    case "typewriter":
      // Binary visibility based on position
      return {
        opacity: charProgress > 0.5 ? 1 : 0,
        display: "inline-block",
      };

    case "wave": {
      // Wave effect based on character position
      const waveOffset = Math.sin((index / total) * Math.PI + progress * Math.PI * 2) * 5;
      return {
        opacity: charProgress,
        transform: `translateY(${waveOffset * (1 - charProgress)}px)`,
        display: "inline-block",
      };
    }

    default:
      return {
        opacity: charProgress,
        display: "inline-block",
      };
  }
}

/**
 * TextMorph - Animated text transition between two strings
 *
 * Morphs from one text to another with character-by-character animations.
 *
 * @example
 * ```tsx
 * <TextMorph
 *   from="Hello"
 *   to="World"
 *   startFrame={30}
 *   duration={30}
 *   morphType="flip"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <TextMorph
 *   from="Loading..."
 *   to="Complete!"
 *   morphType="wave"
 *   characterDelay={2}
 *   useSpring
 * />
 * ```
 */
export const TextMorph: React.FC<TextMorphProps> = ({
  from,
  to,
  startFrame = 0,
  duration = 30,
  morphType = "fade",
  useSpring: useSpringAnim = false,
  springConfig,
  characterDelay = 1,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate overall morph progress
  const overallProgress = useMemo(() => {
    if (useSpringAnim) {
      return spring({
        frame: frame - startFrame,
        fps,
        config: {
          damping: springConfig?.damping ?? 15,
          mass: springConfig?.mass ?? 1,
          stiffness: springConfig?.stiffness ?? 100,
        },
      });
    }

    return interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }, [frame, startFrame, duration, fps, useSpringAnim, springConfig]);

  // Determine which text is currently visible
  const showFrom = overallProgress < 1;
  const showTo = overallProgress > 0;

  // Split texts into characters
  const fromChars = from.split("");
  const toChars = to.split("");

  // Calculate character-level progress
  const getCharProgress = (index: number, isFrom: boolean): number => {
    // Stagger the animation per character
    const charOffset = index * characterDelay;

    if (useSpringAnim) {
      return spring({
        frame: frame - startFrame - (isFrom ? 0 : charOffset),
        fps,
        config: {
          damping: springConfig?.damping ?? 15,
          mass: springConfig?.mass ?? 1,
          stiffness: springConfig?.stiffness ?? 100,
        },
      });
    }

    const charStart = startFrame + (isFrom ? 0 : charOffset);
    const charEnd = charStart + duration;

    return interpolate(
      frame,
      [charStart, charEnd],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  };

  return (
    <span className={className} style={{ position: "relative", ...style }}>
      {/* From text (fading out) */}
      {showFrom && (
        <span
          style={{
            position: overallProgress > 0 ? "absolute" : "relative",
            left: 0,
            top: 0,
          }}
        >
          {fromChars.map((char, i) => {
            const charProgress = getCharProgress(i, true);
            const charStyles = getCharacterStyles(
              morphType,
              charProgress,
              true,
              i,
              fromChars.length
            );

            return (
              <span key={`from-${i}`} style={charStyles}>
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      )}

      {/* To text (fading in) */}
      {showTo && (
        <span
          style={{
            position: overallProgress < 1 ? "absolute" : "relative",
            left: 0,
            top: 0,
          }}
        >
          {toChars.map((char, i) => {
            const charProgress = getCharProgress(i, false);
            const charStyles = getCharacterStyles(
              morphType,
              charProgress,
              false,
              i,
              toChars.length
            );

            return (
              <span key={`to-${i}`} style={charStyles}>
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      )}
    </span>
  );
};

export default TextMorph;
