import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, RADIUS, SPRING_CONFIGS } from "../constants";

export interface ProgressBarProps {
  /** Progress value (0-100 by default, or 0-maxValue if specified) */
  value: number;
  /** Maximum value (default: 100) */
  maxValue?: number;
  /** Bar fill color */
  color?: string;
  /** Background track color */
  backgroundColor?: string;
  /** Height of the bar in pixels (default: 24) */
  height?: number;
  /** Width of the bar (default: "100%") */
  width?: string | number;
  /** Show percentage label (default: false) */
  showLabel?: boolean;
  /** Label position (default: "right") */
  labelPosition?: "inside" | "right" | "top";
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Border radius (default: RADIUS.sm) */
  borderRadius?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * ProgressBar component - Horizontal progress indicator
 *
 * Displays a horizontal bar that fills to represent progress.
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} showLabel />
 * <ProgressBar value={50} color={COLORS.success} height={12} />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue = 100,
  color = COLORS.primary,
  backgroundColor = "rgba(255, 255, 255, 0.15)",
  height = 40,  // 24 → 40: 프로그레스바 높이 증가!
  width = "100%",
  showLabel = false,
  labelPosition = "right",
  animate = true,
  delay = 0,
  borderRadius = RADIUS.md,  // sm → md
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Normalize value to 0-1 range
  const normalizedValue = Math.min(Math.max(value / maxValue, 0), 1);

  // Calculate animated progress
  const progress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.normal,
      })
    : 1;

  const animatedValue = normalizedValue * progress;
  const percentage = Math.round(animatedValue * 100);

  // Entry opacity
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelElement = showLabel && (
    <span
      style={{
        fontSize: FONT_SIZES.md,  // xs(24) → md(38): 라벨 크기 증가!
        fontWeight: 700,  // 600 → 700
        color: labelPosition === "inside" ? COLORS.white : color,
        fontFamily: FONT_FAMILY.body,
        whiteSpace: "nowrap",
      }}
    >
      {percentage}%
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: labelPosition === "top" ? "column" : "row",
        gap: labelPosition === "top" ? 8 : 16,
        width,
        opacity,
        ...style,
      }}
    >
      {labelPosition === "top" && labelElement}
      <div
        style={{
          flex: 1,
          width: labelPosition === "top" ? "100%" : undefined,
          height,
          backgroundColor,
          borderRadius,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${animatedValue * 100}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: labelPosition === "inside" && percentage > 10 ? 8 : 0,
          }}
        >
          {labelPosition === "inside" && percentage > 10 && labelElement}
        </div>
      </div>
      {labelPosition === "right" && labelElement}
    </div>
  );
};

export default ProgressBar;
