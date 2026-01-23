import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface CountUpProps {
  /** Target value to count up to */
  value: number;
  /** Duration of count animation in frames (default: 60) */
  duration?: number;
  /** Prefix text (e.g., "$", "₩") */
  prefix?: string;
  /** Suffix text (e.g., "%", "M") */
  suffix?: string;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Font size in pixels */
  fontSize?: number;
  /** Text color */
  color?: string;
  /** Start frame offset (default: 0) */
  delay?: number;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Use locale number formatting with separators */
  useLocale?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * CountUp component - Animated number counter
 *
 * Displays a number that counts up from 0 to the target value with smooth animation.
 *
 * @example
 * ```tsx
 * <CountUp value={1500} prefix="$" suffix="M" />
 * <CountUp value={95.5} suffix="%" decimals={1} />
 * ```
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 60,
  prefix = "",
  suffix = "",
  decimals = 0,
  fontSize = FONT_SIZES["2xl"],
  color = COLORS.white,
  delay = 0,
  animate = true,
  useLocale = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate the animated progress using interpolate with duration
  const linearProgress = animate
    ? interpolate(frame - delay, [0, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Apply spring easing for smoother animation
  const progress = animate
    ? spring({
        frame: Math.round(linearProgress * fps),
        fps,
        config: {
          ...SPRING_CONFIGS.snappy,
          damping: 100,
        },
      })
    : 1;

  // Calculate current display value
  const currentValue = interpolate(progress, [0, 1], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Format the number
  const formattedValue = useLocale
    ? currentValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : currentValue.toFixed(decimals);

  // Entry animation opacity
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontSize,
        fontWeight: 700,
        color,
        fontFamily: FONT_FAMILY.title,
        opacity,
        display: "inline-block",
        ...style,
      }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export default CountUp;
