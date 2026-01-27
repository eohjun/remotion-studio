import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, RADIUS, SPRING_CONFIGS } from "../constants";

export interface BarChartDataItem {
  /** Label for the bar */
  label: string;
  /** Value of the bar */
  value: number;
  /** Optional custom color */
  color?: string;
  /** Optional icon (emoji or text) */
  icon?: string;
}

export interface BarChartProps {
  /** Chart data */
  data: BarChartDataItem[];
  /** Chart orientation (default: "vertical") */
  orientation?: "vertical" | "horizontal";
  /** Maximum value for scaling (auto-calculated if not provided) */
  maxValue?: number;
  /** Show value labels (default: true) */
  showValues?: boolean;
  /** Show bar labels (default: true) */
  showLabels?: boolean;
  /** Default bar color */
  barColor?: string;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Stagger delay between bars in frames (default: 8) */
  staggerDelay?: number;
  /** Animation start delay in frames (default: 0) */
  delay?: number;
  /** Index of item to highlight */
  highlight?: number;
  /** Bar width/height depending on orientation (default: auto) */
  barSize?: number;
  /** Gap between bars (default: 20) */
  gap?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * BarChart component - Vertical or horizontal bar chart
 *
 * Displays a bar chart with animated bars.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[
 *     { label: "React", value: 85 },
 *     { label: "Vue", value: 72 },
 *     { label: "Angular", value: 58 },
 *   ]}
 * />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  orientation = "vertical",
  maxValue: providedMaxValue,
  showValues = true,
  showLabels = true,
  barColor = COLORS.primary,
  animate = true,
  staggerDelay = 8,
  delay = 0,
  highlight,
  barSize,
  gap = 40,  // 20 → 40: 더 넓은 간격
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate max value from data if not provided
  const maxValue = providedMaxValue || Math.max(...data.map((d) => d.value)) * 1.1;

  const isVertical = orientation === "vertical";

  // Calculate bar dimensions (optimized for 1920x1080 - 크게!)
  const defaultBarSize = isVertical
    ? Math.min(140, (1200 - data.length * gap) / data.length)  // 120 → 140
    : Math.min(90, 600 / data.length);  // 50 → 90 (바 높이)
  const actualBarSize = barSize || defaultBarSize;

  const maxBarLength = isVertical ? 550 : 1000;  // 450/800 → 550/1000

  if (isVertical) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap,
          height: maxBarLength + 80,
          width: "100%",
          ...style,
        }}
      >
        {data.map((item, i) => {
          const barProgress = animate
            ? spring({
                frame: frame - delay - i * staggerDelay,
                fps,
                config: SPRING_CONFIGS.bouncy,
              })
            : 1;
          const barHeight = (item.value / maxValue) * maxBarLength * barProgress;
          const isHighlighted = highlight === i;
          const itemColor = item.color || barColor;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Value Label - 크게! */}
              {showValues && (
                <div
                  style={{
                    opacity: interpolate(barProgress, [0.5, 1], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    fontSize: FONT_SIZES.lg,  // sm(32) → lg(46)
                    fontWeight: 700,
                    color: isHighlighted ? itemColor : COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.value}
                </div>
              )}
              {/* Bar */}
              <div
                style={{
                  width: actualBarSize,
                  height: barHeight,
                  backgroundColor: itemColor,
                  borderRadius: `${RADIUS.sm}px ${RADIUS.sm}px 0 0`,
                  opacity: isHighlighted ? 1 : 0.8,
                  boxShadow: isHighlighted ? `0 0 20px ${itemColor}60` : undefined,
                }}
              />
              {/* Label - 크게! */}
              {showLabels && (
                <div
                  style={{
                    opacity: interpolate(barProgress, [0, 0.5], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    fontSize: FONT_SIZES.md,  // xs(24) → md(38)
                    color: isHighlighted ? COLORS.white : COLORS.light,
                    fontFamily: FONT_FAMILY.body,
                    textAlign: "center",
                    maxWidth: actualBarSize + 40,
                    fontWeight: 500,
                  }}
                >
                  {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation - 크기 대폭 확대!
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 40,  // 16 → 40
        width: "100%",
        maxWidth: 1400,  // 900 → 1400
        ...style,
      }}
    >
      {data.map((item, i) => {
        const barProgress = animate
          ? spring({
              frame: frame - delay - i * staggerDelay,
              fps,
              config: SPRING_CONFIGS.normal,
            })
          : 1;
        const barWidth = (item.value / maxValue) * maxBarLength * barProgress;
        const isHighlighted = highlight === i;
        const itemColor = item.color || barColor;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,  // 16 → 32
            }}
          >
            {/* Label - 크게! */}
            {showLabels && (
              <div
                style={{
                  width: 240,  // 150 → 240
                  fontSize: FONT_SIZES.lg,  // sm-2(30) → lg(46)
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "right",
                  fontWeight: 500,
                  opacity: interpolate(barProgress, [0, 0.3], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {item.icon && <span style={{ marginRight: 12 }}>{item.icon}</span>}
                {item.label}
              </div>
            )}
            {/* Bar Container */}
            <div
              style={{
                flex: 1,
                height: actualBarSize,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: RADIUS.md,  // sm → md
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: barWidth,
                  height: "100%",
                  backgroundColor: itemColor,
                  borderRadius: RADIUS.md,
                  opacity: isHighlighted ? 1 : 0.85,
                  boxShadow: isHighlighted ? `0 0 20px ${itemColor}60` : undefined,
                }}
              />
            </div>
            {/* Value - 크게! */}
            {showValues && (
              <div
                style={{
                  width: 100,  // 60 → 100
                  fontSize: FONT_SIZES.xl,  // sm(32) → xl(56)
                  fontWeight: 700,
                  color: isHighlighted ? itemColor : COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                  opacity: interpolate(barProgress, [0.6, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {item.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;
