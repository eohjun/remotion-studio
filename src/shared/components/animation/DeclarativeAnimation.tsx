/**
 * DeclarativeAnimation - Wrapper for remotion-animated library
 *
 * Provides declarative animation primitives that reduce
 * interpolate() boilerplate by 30-40%. Use for new compositions;
 * existing code can continue using interpolate().
 *
 * @example
 * ```tsx
 * <AnimatedEntry type="fadeUp" delay={10}>
 *   <h1>Title</h1>
 * </AnimatedEntry>
 * ```
 */

import React from "react";
import { Animated, Fade, Move, Scale, Rotate } from "remotion-animated";
import type { Animation } from "remotion-animated";

/** Preset animation types for common entry patterns */
export type EntryPreset =
  | "fadeIn"
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "scaleUp"
  | "rotateIn";

export interface AnimatedEntryProps {
  children: React.ReactNode;
  /** Animation preset */
  type?: EntryPreset;
  /** Delay in frames before animation starts */
  delay?: number;
  /** Duration of animation in frames (default: 20) */
  duration?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

function getAnimations(
  type: EntryPreset,
  delay: number,
  duration: number
): Animation[] {
  const opts = { start: delay, duration };

  switch (type) {
    case "fadeIn":
      return [Fade({ to: 1, ...opts })];
    case "fadeUp":
      return [Fade({ to: 1, ...opts }), Move({ y: -30, initialY: 0, ...opts })];
    case "fadeDown":
      return [Fade({ to: 1, ...opts }), Move({ y: 30, initialY: 0, ...opts })];
    case "fadeLeft":
      return [Fade({ to: 1, ...opts }), Move({ x: -30, initialX: 0, ...opts })];
    case "fadeRight":
      return [Fade({ to: 1, ...opts }), Move({ x: 30, initialX: 0, ...opts })];
    case "scaleIn":
      return [Fade({ to: 1, ...opts }), Scale({ by: 1, initial: 0.8, ...opts })];
    case "scaleUp":
      return [
        Fade({ to: 1, ...opts }),
        Scale({ by: 1, initial: 0.5, ...opts }),
        Move({ y: -20, initialY: 0, ...opts }),
      ];
    case "rotateIn":
      return [Fade({ to: 1, ...opts }), Rotate({ degrees: 0, initial: -10, ...opts })];
    default:
      return [Fade({ to: 1, ...opts })];
  }
}

/**
 * AnimatedEntry - Apply preset entry animations to children.
 *
 * Reduces boilerplate compared to manual interpolate() calls.
 * Combine with Remotion's <Sequence> for timeline control.
 */
export const AnimatedEntry: React.FC<AnimatedEntryProps> = ({
  children,
  type = "fadeIn",
  delay = 0,
  duration = 20,
  style,
}) => {
  const animations = getAnimations(type, delay, duration);

  return (
    <Animated animations={animations} style={style}>
      {children}
    </Animated>
  );
};

// Re-export remotion-animated primitives for direct use
export { Animated, Fade, Move, Scale, Rotate };
export type { Animation };
