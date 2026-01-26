import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface AreaChartDataPoint {
  /** X-axis label */
  label: string;
  /** Y-axis value */
  value: number;
}

export interface AreaChartProps {
  /** Chart data points */
  data: AreaChartDataPoint[];
  /** Maximum Y value (auto-calculated if not provided) */
  maxValue?: number;
  /** Minimum Y value (default: 0) */
  minValue?: number;
  /** Fill color */
  fillColor?: string;
  /** Line/stroke color */
  strokeColor?: string;
  /** Show data point dots (default: true) */
  showDots?: boolean;
  /** Show X-axis labels (default: true) */
  showLabels?: boolean;
  /** Show grid lines (default: true) */
  showGrid?: boolean;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Fill opacity (default: 0.3) */
  fillOpacity?: number;
  /** Chart width (default: 800) */
  width?: number;
  /** Chart height (default: 300) */
  height?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * AreaChart component - Filled line chart
 *
 * Displays an area chart with animated fill and optional data points.
 *
 * @example
 * ```tsx
 * <AreaChart
 *   data={[
 *     { label: "Jan", value: 100 },
 *     { label: "Feb", value: 150 },
 *     { label: "Mar", value: 120 },
 *   ]}
 *   fillColor="#667eea"
 * />
 * ```
 */
export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  maxValue: providedMaxValue,
  minValue = 0,
  fillColor = COLORS.primary,
  strokeColor,
  showDots = true,
  showLabels = true,
  showGrid = true,
  animate = true,
  delay = 0,
  fillOpacity = 0.3,
  width = 800,
  height = 300,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const actualStrokeColor = strokeColor || fillColor;
  const maxValue = providedMaxValue || Math.max(...data.map((d) => d.value)) * 1.1;
  const valueRange = maxValue - minValue;

  // Calculate animation progress
  const progress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 1;

  // Calculate point positions
  const padding = { top: 20, right: 40, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight,
    ...d,
  }));

  // Generate SVG path for the area
  const linePath = points
    .map((p, i) => {
      const animatedY = interpolate(
        progress,
        [0, 1],
        [padding.top + chartHeight, p.y],
        { extrapolateRight: "clamp" }
      );
      return `${i === 0 ? "M" : "L"} ${p.x} ${animatedY}`;
    })
    .join(" ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${padding.top + chartHeight}` +
    ` L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Grid lines
  const gridLineCount = 5;
  const gridLines = Array.from({ length: gridLineCount }, (_, i) => {
    const y = padding.top + (i / (gridLineCount - 1)) * chartHeight;
    const value = maxValue - (i / (gridLineCount - 1)) * valueRange;
    return { y, value };
  });

  return (
    <div style={{ position: "relative", ...style }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {showGrid &&
          gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={width - padding.right}
                y2={line.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              />
              <text
                x={padding.left - 10}
                y={line.y + 4}
                textAnchor="end"
                fill={COLORS.light}
                fontSize={FONT_SIZES.xs}
                fontFamily={FONT_FAMILY.body}
                opacity={0.6}
              >
                {Math.round(line.value)}
              </text>
            </g>
          ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={fillColor}
          opacity={fillOpacity * progress}
        />

        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke={actualStrokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={progress}
        />

        {/* Data point dots */}
        {showDots &&
          points.map((p, i) => {
            const animatedY = interpolate(
              progress,
              [0, 1],
              [padding.top + chartHeight, p.y],
              { extrapolateRight: "clamp" }
            );
            const dotProgress = animate
              ? spring({
                  frame: frame - delay - i * 3,
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                })
              : 1;

            return (
              <circle
                key={i}
                cx={p.x}
                cy={animatedY}
                r={6 * dotProgress}
                fill={COLORS.white}
                stroke={actualStrokeColor}
                strokeWidth={2}
              />
            );
          })}

        {/* X-axis labels */}
        {showLabels &&
          points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 15}
              textAnchor="middle"
              fill={COLORS.light}
              fontSize={FONT_SIZES.xs}
              fontFamily={FONT_FAMILY.body}
              opacity={progress}
            >
              {p.label}
            </text>
          ))}
      </svg>
    </div>
  );
};

export default AreaChart;
