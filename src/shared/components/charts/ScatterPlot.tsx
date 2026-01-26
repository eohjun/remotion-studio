import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface ScatterDataPoint {
  /** X-axis value */
  x: number;
  /** Y-axis value */
  y: number;
  /** Optional label */
  label?: string;
  /** Optional custom color */
  color?: string;
  /** Optional size multiplier (default: 1) */
  size?: number;
}

export interface ScatterPlotProps {
  /** Data points */
  data: ScatterDataPoint[];
  /** X-axis label */
  xLabel?: string;
  /** Y-axis label */
  yLabel?: string;
  /** X-axis range [min, max] (auto-calculated if not provided) */
  xRange?: [number, number];
  /** Y-axis range [min, max] (auto-calculated if not provided) */
  yRange?: [number, number];
  /** Default point color */
  pointColor?: string;
  /** Default point radius (default: 8) */
  pointRadius?: number;
  /** Show grid lines (default: true) */
  showGrid?: boolean;
  /** Show trend line (default: false) */
  showTrendLine?: boolean;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Stagger delay between points (default: 2) */
  staggerDelay?: number;
  /** Chart width (default: 700) */
  width?: number;
  /** Chart height (default: 500) */
  height?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * ScatterPlot component - 2D scatter plot visualization
 *
 * Displays data points on a 2D plane with optional trend line.
 *
 * @example
 * ```tsx
 * <ScatterPlot
 *   data={[
 *     { x: 10, y: 20, label: "A" },
 *     { x: 30, y: 45, label: "B" },
 *     { x: 50, y: 35, label: "C" },
 *   ]}
 *   xLabel="Time (hours)"
 *   yLabel="Score"
 * />
 * ```
 */
export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xLabel,
  yLabel,
  xRange: providedXRange,
  yRange: providedYRange,
  pointColor = COLORS.primary,
  pointRadius = 8,
  showGrid = true,
  showTrendLine = false,
  animate = true,
  delay = 0,
  staggerDelay = 2,
  width = 700,
  height = 500,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate ranges with padding
  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);
  const xMin = providedXRange?.[0] ?? Math.min(...xValues) * 0.9;
  const xMax = providedXRange?.[1] ?? Math.max(...xValues) * 1.1;
  const yMin = providedYRange?.[0] ?? Math.min(...yValues) * 0.9;
  const yMax = providedYRange?.[1] ?? Math.max(...yValues) * 1.1;

  // Chart dimensions
  const padding = { top: 30, right: 40, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scaleX = (value: number) =>
    padding.left + ((value - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (value: number) =>
    padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  // Calculate trend line (linear regression)
  const calculateTrendLine = () => {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.x, 0);
    const sumY = data.reduce((sum, d) => sum + d.y, 0);
    const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
    const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
      start: { x: xMin, y: slope * xMin + intercept },
      end: { x: xMax, y: slope * xMax + intercept },
    };
  };

  const trendLine = showTrendLine ? calculateTrendLine() : null;

  // Grid lines
  const xGridCount = 5;
  const yGridCount = 5;
  const xGridLines = Array.from({ length: xGridCount }, (_, i) => {
    const value = xMin + (i / (xGridCount - 1)) * (xMax - xMin);
    return { x: scaleX(value), value };
  });
  const yGridLines = Array.from({ length: yGridCount }, (_, i) => {
    const value = yMax - (i / (yGridCount - 1)) * (yMax - yMin);
    return { y: scaleY(value), value };
  });

  // Animation progress for trend line
  const trendProgress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 1;

  return (
    <div style={{ position: "relative", ...style }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {showGrid && (
          <>
            {/* Vertical grid lines */}
            {xGridLines.map((line, i) => (
              <g key={`x-${i}`}>
                <line
                  x1={line.x}
                  y1={padding.top}
                  x2={line.x}
                  y2={height - padding.bottom}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
                <text
                  x={line.x}
                  y={height - padding.bottom + 25}
                  textAnchor="middle"
                  fill={COLORS.light}
                  fontSize={FONT_SIZES.xs}
                  fontFamily={FONT_FAMILY.body}
                  opacity={0.6}
                >
                  {Math.round(line.value)}
                </text>
              </g>
            ))}
            {/* Horizontal grid lines */}
            {yGridLines.map((line, i) => (
              <g key={`y-${i}`}>
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
          </>
        )}

        {/* Trend line */}
        {trendLine && (
          <line
            x1={scaleX(trendLine.start.x)}
            y1={scaleY(trendLine.start.y)}
            x2={interpolate(
              trendProgress,
              [0, 1],
              [scaleX(trendLine.start.x), scaleX(trendLine.end.x)]
            )}
            y2={interpolate(
              trendProgress,
              [0, 1],
              [scaleY(trendLine.start.y), scaleY(trendLine.end.y)]
            )}
            stroke={COLORS.accent}
            strokeWidth={2}
            strokeDasharray="8 4"
            opacity={0.8}
          />
        )}

        {/* Data points */}
        {data.map((point, i) => {
          const pointProgress = animate
            ? spring({
                frame: frame - delay - i * staggerDelay,
                fps,
                config: SPRING_CONFIGS.bouncy,
              })
            : 1;

          const cx = scaleX(point.x);
          const cy = scaleY(point.y);
          const color = point.color || pointColor;
          const radius = pointRadius * (point.size || 1);

          return (
            <g key={i}>
              {/* Glow effect */}
              <circle
                cx={cx}
                cy={cy}
                r={radius * 2 * pointProgress}
                fill={color}
                opacity={0.2 * pointProgress}
              />
              {/* Main point */}
              <circle
                cx={cx}
                cy={cy}
                r={radius * pointProgress}
                fill={color}
                stroke={COLORS.white}
                strokeWidth={2}
              />
              {/* Label */}
              {point.label && pointProgress > 0.5 && (
                <text
                  x={cx}
                  y={cy - radius - 8}
                  textAnchor="middle"
                  fill={COLORS.white}
                  fontSize={FONT_SIZES.xs}
                  fontFamily={FONT_FAMILY.body}
                  opacity={interpolate(pointProgress, [0.5, 1], [0, 1])}
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Axis labels */}
        {xLabel && (
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fill={COLORS.light}
            fontSize={FONT_SIZES.sm}
            fontFamily={FONT_FAMILY.body}
          >
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            fill={COLORS.light}
            fontSize={FONT_SIZES.sm}
            fontFamily={FONT_FAMILY.body}
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            {yLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

export default ScatterPlot;
