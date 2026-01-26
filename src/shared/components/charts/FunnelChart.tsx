import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, RADIUS, SPRING_CONFIGS } from "../constants";

export interface FunnelStage {
  /** Stage label */
  label: string;
  /** Stage value */
  value: number;
  /** Optional custom color */
  color?: string;
  /** Optional icon (emoji or text) */
  icon?: string;
}

export interface FunnelChartProps {
  /** Funnel stages (top to bottom) */
  data: FunnelStage[];
  /** Show percentage labels (default: true) */
  showPercentages?: boolean;
  /** Show value labels (default: true) */
  showValues?: boolean;
  /** Base color for gradient (default: primary) */
  baseColor?: string;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Stagger delay between stages (default: 10) */
  staggerDelay?: number;
  /** Chart width (default: 600) */
  width?: number;
  /** Chart height (default: 400) */
  height?: number;
  /** Minimum stage width percentage (default: 30) */
  minWidthPercent?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * FunnelChart component - Conversion funnel visualization
 *
 * Displays stages in a conversion funnel with animated widths.
 *
 * @example
 * ```tsx
 * <FunnelChart
 *   data={[
 *     { label: "Visitors", value: 10000 },
 *     { label: "Sign-ups", value: 3500 },
 *     { label: "Trials", value: 1200 },
 *     { label: "Customers", value: 400 },
 *   ]}
 * />
 * ```
 */
export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  showPercentages = true,
  showValues = true,
  animate = true,
  delay = 0,
  staggerDelay = 10,
  width = 600,
  height = 400,
  minWidthPercent = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxValue = data[0]?.value || 1;
  const stageHeight = height / data.length;
  const padding = 40;

  // Generate colors for stages
  const getStageColor = (index: number, customColor?: string) => {
    if (customColor) return customColor;
    const hue = 240 + (index / data.length) * 60; // Blue to purple gradient
    return `hsl(${hue}, 70%, 55%)`;
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      {data.map((stage, i) => {
        const progress = animate
          ? spring({
              frame: frame - delay - i * staggerDelay,
              fps,
              config: SPRING_CONFIGS.normal,
            })
          : 1;

        const percentage = (stage.value / maxValue) * 100;
        const stageWidth = Math.max(
          minWidthPercent,
          (stage.value / maxValue) * 100
        );
        const animatedWidth = interpolate(progress, [0, 1], [100, stageWidth]);

        const conversionRate = i > 0 ? (stage.value / data[i - 1].value) * 100 : 100;
        const color = stage.color || getStageColor(i);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * stageHeight,
              left: 0,
              width: "100%",
              height: stageHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Stage bar */}
            <div
              style={{
                position: "relative",
                width: `${animatedWidth}%`,
                height: stageHeight - 8,
                backgroundColor: color,
                borderRadius: RADIUS.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 20px ${color}40`,
                transition: "box-shadow 0.3s",
              }}
            >
              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: interpolate(progress, [0.3, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {/* Label with icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: FONT_SIZES.md,
                    fontWeight: 700,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.title,
                  }}
                >
                  {stage.icon && <span>{stage.icon}</span>}
                  {stage.label}
                </div>

                {/* Value and percentage */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontSize: FONT_SIZES.sm,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {showValues && (
                    <span style={{ fontWeight: 600 }}>
                      {stage.value.toLocaleString()}
                    </span>
                  )}
                  {showPercentages && (
                    <span style={{ opacity: 0.8 }}>
                      ({percentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Conversion rate indicator */}
            {i > 0 && showPercentages && (
              <div
                style={{
                  position: "absolute",
                  right: padding,
                  opacity: interpolate(progress, [0.5, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: FONT_SIZES.xs,
                    color: conversionRate >= 50 ? COLORS.success : COLORS.warning,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: 600,
                  }}
                >
                  ↓ {conversionRate.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Connector lines */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {data.slice(0, -1).map((stage, i) => {
          const currentWidth =
            Math.max(minWidthPercent, (stage.value / maxValue) * 100) / 100;
          const nextWidth =
            Math.max(minWidthPercent, (data[i + 1].value / maxValue) * 100) / 100;

          const y1 = (i + 1) * stageHeight - 4;
          const y2 = (i + 1) * stageHeight + 4;

          const progress = animate
            ? spring({
                frame: frame - delay - (i + 1) * staggerDelay,
                fps,
                config: SPRING_CONFIGS.gentle,
              })
            : 1;

          return (
            <g key={i} opacity={progress}>
              {/* Left connector */}
              <line
                x1={((1 - currentWidth) / 2) * width}
                y1={y1}
                x2={((1 - nextWidth) / 2) * width}
                y2={y2}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
              />
              {/* Right connector */}
              <line
                x1={((1 + currentWidth) / 2) * width}
                y1={y1}
                x2={((1 + nextWidth) / 2) * width}
                y2={y2}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FunnelChart;
