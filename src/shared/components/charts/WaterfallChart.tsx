import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * Data point for waterfall chart
 */
export interface WaterfallDataPoint {
  /** Label for this segment */
  label: string;
  /** Value (positive or negative) */
  value: number;
  /** Whether this is a total/subtotal bar */
  isTotal?: boolean;
  /** Custom color for this bar */
  color?: string;
}

/**
 * Props for WaterfallChart
 */
export interface WaterfallChartProps {
  /** Data points for the chart */
  data: WaterfallDataPoint[];
  /** Chart width */
  width?: number;
  /** Chart height */
  height?: number;
  /** Color for positive values */
  positiveColor?: string;
  /** Color for negative values */
  negativeColor?: string;
  /** Color for total bars */
  totalColor?: string;
  /** Background color for the chart */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Animation start frame */
  animationStart?: number;
  /** Delay between bars animating in */
  staggerDelay?: number;
  /** Show value labels */
  showValues?: boolean;
  /** Show connecting lines */
  showConnectors?: boolean;
  /** Font size for labels */
  labelFontSize?: number;
  /** Font size for values */
  valueFontSize?: number;
}

/**
 * WaterfallChart - Visualize cumulative effect of sequential values
 *
 * Perfect for showing how an initial value is affected by positive
 * and negative changes over time.
 *
 * @example
 * ```tsx
 * <WaterfallChart
 *   data={[
 *     { label: "Start", value: 100, isTotal: true },
 *     { label: "Revenue", value: 50 },
 *     { label: "Costs", value: -30 },
 *     { label: "Tax", value: -10 },
 *     { label: "End", value: 110, isTotal: true },
 *   ]}
 * />
 * ```
 */
export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  width = 800,
  height = 400,
  positiveColor = "#22C55E",
  negativeColor = "#EF4444",
  totalColor = "#3B82F6",
  backgroundColor = "transparent",
  textColor = "#FFFFFF",
  animationStart = 0,
  staggerDelay = 5,
  showValues = true,
  showConnectors = true,
  labelFontSize = 14,
  valueFontSize = 13,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate running totals and bar positions
  const chartData = useMemo(() => {
    let runningTotal = 0;
    const processed = data.map((point, index) => {
      const startValue = point.isTotal ? 0 : runningTotal;
      const endValue = point.isTotal ? point.value : runningTotal + point.value;

      if (!point.isTotal) {
        runningTotal += point.value;
      } else {
        runningTotal = point.value;
      }

      return {
        ...point,
        startValue,
        endValue,
        index,
      };
    });

    // Find min/max for scaling
    const allValues = processed.flatMap((p) => [p.startValue, p.endValue]);
    const minValue = Math.min(...allValues, 0);
    const maxValue = Math.max(...allValues);

    return { processed, minValue, maxValue };
  }, [data]);

  // Chart dimensions
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = (chartWidth / data.length) * 0.6;
  const barGap = (chartWidth / data.length) * 0.4;

  // Scale functions
  const yScale = (value: number) => {
    const range = chartData.maxValue - chartData.minValue || 1;
    return chartHeight - ((value - chartData.minValue) / range) * chartHeight;
  };

  const zeroLine = yScale(0);

  return (
    <svg
      width={width}
      height={height}
      style={{ backgroundColor }}
    >
      {/* Chart area */}
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Zero line */}
        <line
          x1={0}
          y1={zeroLine}
          x2={chartWidth}
          y2={zeroLine}
          stroke={textColor}
          strokeOpacity={0.3}
          strokeWidth={1}
        />

        {/* Bars and connectors */}
        {chartData.processed.map((point, index) => {
          // Animation progress
          const barStart = animationStart + index * staggerDelay;
          const progress = spring({
            frame: frame - barStart,
            fps,
            config: { damping: 15, mass: 1, stiffness: 100 },
          });

          const barX = index * (barWidth + barGap) + barGap / 2;
          const barTop = Math.min(yScale(point.startValue), yScale(point.endValue));
          const barBottom = Math.max(yScale(point.startValue), yScale(point.endValue));
          const barHeight = (barBottom - barTop) * progress;

          // Determine color
          let color = point.color;
          if (!color) {
            if (point.isTotal) {
              color = totalColor;
            } else if (point.value >= 0) {
              color = positiveColor;
            } else {
              color = negativeColor;
            }
          }

          // For negative values, animate from top down
          const animatedTop = point.value >= 0 || point.isTotal
            ? barTop + (barBottom - barTop) * (1 - progress)
            : barTop;

          return (
            <g key={index}>
              {/* Connector line to previous bar */}
              {showConnectors && index > 0 && !point.isTotal && (
                <line
                  x1={barX - barGap / 2}
                  y1={yScale(point.startValue)}
                  x2={barX}
                  y2={yScale(point.startValue)}
                  stroke={textColor}
                  strokeOpacity={0.3 * progress}
                  strokeDasharray="4 2"
                />
              )}

              {/* Bar */}
              <rect
                x={barX}
                y={animatedTop}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={4}
              />

              {/* Value label */}
              {showValues && progress > 0.5 && (
                <text
                  x={barX + barWidth / 2}
                  y={barTop - 8}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={valueFontSize}
                  fontWeight="bold"
                  opacity={interpolate(progress, [0.5, 1], [0, 1])}
                >
                  {point.value >= 0 ? "+" : ""}
                  {point.value}
                </text>
              )}

              {/* Label */}
              <text
                x={barX + barWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                fill={textColor}
                fontSize={labelFontSize}
                opacity={progress}
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default WaterfallChart;
