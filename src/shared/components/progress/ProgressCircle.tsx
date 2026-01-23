import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, SPRING_CONFIGS } from "../constants";

export interface ProgressCircleProps {
  /** Progress value (0-100) */
  value: number;
  /** Size of the circle in pixels (default: 120) */
  size?: number;
  /** Stroke width in pixels (default: 12) */
  strokeWidth?: number;
  /** Progress stroke color */
  color?: string;
  /** Background track color */
  backgroundColor?: string;
  /** Show value inside the circle (default: true) */
  showValue?: boolean;
  /** Value suffix (default: "%") */
  valueSuffix?: string;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Stroke line cap style (default: "round") */
  strokeLinecap?: "round" | "butt" | "square";
  /** Content to render inside the circle (overrides showValue) */
  children?: React.ReactNode;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * ProgressCircle component - Circular progress indicator
 *
 * Displays a circular progress ring with optional center value.
 *
 * @example
 * ```tsx
 * <ProgressCircle value={75} />
 * <ProgressCircle value={85} color={COLORS.success} size={150} />
 * <ProgressCircle value={50}>
 *   <span>Custom Content</span>
 * </ProgressCircle>
 * ```
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 120,
  strokeWidth = 12,
  color = COLORS.primary,
  backgroundColor = "rgba(255, 255, 255, 0.15)",
  showValue = true,
  valueSuffix = "%",
  animate = true,
  delay = 0,
  strokeLinecap = "round",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Normalize value to 0-1 range
  const normalizedValue = Math.min(Math.max(value / 100, 0), 1);

  // Calculate animated progress
  const progress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: {
          ...SPRING_CONFIGS.normal,
          damping: 100,
        },
      })
    : 1;

  const animatedValue = normalizedValue * progress;
  const displayValue = Math.round(animatedValue * 100);

  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - animatedValue);

  // Entry opacity
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Value fade-in
  const valueOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: valueOpacity,
        }}
      >
        {children ? (
          children
        ) : showValue ? (
          <span
            style={{
              fontSize: size * 0.25,
              fontWeight: 700,
              color,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            {displayValue}
            <span style={{ fontSize: size * 0.15 }}>{valueSuffix}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ProgressCircle;
