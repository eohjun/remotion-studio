import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, RADIUS, SPRING_CONFIGS } from "../constants";

export interface ComparisonBarItem {
  /** Item label */
  label: string;
  /** First value (left/before) */
  valueA: number;
  /** Second value (right/after) */
  valueB: number;
  /** Optional icon */
  icon?: string;
}

export interface ComparisonBarsProps {
  /** Comparison data */
  data: ComparisonBarItem[];
  /** Label for first value column */
  labelA?: string;
  /** Label for second value column */
  labelB?: string;
  /** Color for first bars */
  colorA?: string;
  /** Color for second bars */
  colorB?: string;
  /** Show percentage change (default: true) */
  showChange?: boolean;
  /** Show values (default: true) */
  showValues?: boolean;
  /** Maximum value for scaling (auto-calculated if not provided) */
  maxValue?: number;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Stagger delay between items (default: 8) */
  staggerDelay?: number;
  /** Bar height (default: 32) */
  barHeight?: number;
  /** Gap between items (default: 24) */
  gap?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * ComparisonBars component - Side-by-side bar comparison
 *
 * Displays paired bars for comparing two values (e.g., before/after, A/B test).
 *
 * @example
 * ```tsx
 * <ComparisonBars
 *   data={[
 *     { label: "Sales", valueA: 100, valueB: 150 },
 *     { label: "Users", valueA: 500, valueB: 750 },
 *     { label: "Revenue", valueA: 1000, valueB: 1800 },
 *   ]}
 *   labelA="Q1 2024"
 *   labelB="Q2 2024"
 * />
 * ```
 */
export const ComparisonBars: React.FC<ComparisonBarsProps> = ({
  data,
  labelA = "Before",
  labelB = "After",
  colorA = COLORS.secondary,
  colorB = COLORS.primary,
  showChange = true,
  showValues = true,
  maxValue: providedMaxValue,
  animate = true,
  delay = 0,
  staggerDelay = 8,
  barHeight = 32,
  gap = 24,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allValues = data.flatMap((d) => [d.valueA, d.valueB]);
  const maxValue = providedMaxValue || Math.max(...allValues) * 1.1;

  const labelWidth = 120;
  const valueWidth = 80;
  const changeWidth = 100;
  const barMaxWidth = 300;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: gap,
        width: "100%",
        maxWidth: 900,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 8,
        }}
      >
        <div style={{ width: labelWidth }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            maxWidth: barMaxWidth,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: FONT_SIZES.sm,
              color: colorA,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: colorA,
              }}
            />
            {labelA}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: FONT_SIZES.sm,
              color: colorB,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: colorB,
              }}
            />
            {labelB}
          </div>
        </div>
        {showValues && <div style={{ width: valueWidth * 2 + 16 }} />}
        {showChange && <div style={{ width: changeWidth }} />}
      </div>

      {/* Data rows */}
      {data.map((item, i) => {
        const progress = animate
          ? spring({
              frame: frame - delay - i * staggerDelay,
              fps,
              config: SPRING_CONFIGS.normal,
            })
          : 1;

        const widthA = (item.valueA / maxValue) * barMaxWidth * progress;
        const widthB = (item.valueB / maxValue) * barMaxWidth * progress;
        const change = ((item.valueB - item.valueA) / item.valueA) * 100;
        const isPositive = change >= 0;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Label */}
            <div
              style={{
                width: labelWidth,
                fontSize: FONT_SIZES.sm,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                fontWeight: 500,
                opacity: interpolate(progress, [0, 0.3], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
              {item.label}
            </div>

            {/* Bars container */}
            <div
              style={{
                flex: 1,
                maxWidth: barMaxWidth,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* Bar A */}
              <div
                style={{
                  height: barHeight / 2,
                  width: widthA,
                  backgroundColor: colorA,
                  borderRadius: RADIUS.sm,
                  opacity: 0.9,
                }}
              />
              {/* Bar B */}
              <div
                style={{
                  height: barHeight / 2,
                  width: widthB,
                  backgroundColor: colorB,
                  borderRadius: RADIUS.sm,
                  boxShadow: `0 2px 10px ${colorB}40`,
                }}
              />
            </div>

            {/* Values */}
            {showValues && (
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  opacity: interpolate(progress, [0.5, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <div
                  style={{
                    width: valueWidth,
                    fontSize: FONT_SIZES.sm,
                    color: colorA,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {item.valueA.toLocaleString()}
                </div>
                <div
                  style={{
                    width: valueWidth,
                    fontSize: FONT_SIZES.sm,
                    color: colorB,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: 700,
                    textAlign: "right",
                  }}
                >
                  {item.valueB.toLocaleString()}
                </div>
              </div>
            )}

            {/* Change indicator */}
            {showChange && (
              <div
                style={{
                  width: changeWidth,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                  opacity: interpolate(progress, [0.7, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <span
                  style={{
                    fontSize: FONT_SIZES.sm,
                    fontWeight: 700,
                    color: isPositive ? COLORS.success : COLORS.danger,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ComparisonBars;
