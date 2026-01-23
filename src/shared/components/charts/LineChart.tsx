import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface LineChartDataPoint {
  /** X coordinate or label */
  x: number | string;
  /** Y value */
  y: number;
}

export interface LineChartProps {
  /** Chart data - array of points or just y values */
  data: LineChartDataPoint[] | number[];
  /** Width of the chart (default: 600) */
  width?: number;
  /** Height of the chart (default: 300) */
  height?: number;
  /** Line stroke color */
  strokeColor?: string;
  /** Line stroke width (default: 3) */
  strokeWidth?: number;
  /** Show data points (default: true) */
  showDots?: boolean;
  /** Dot radius (default: 6) */
  dotRadius?: number;
  /** Show filled area below line (default: false) */
  showArea?: boolean;
  /** Area fill opacity (default: 0.2) */
  areaOpacity?: number;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Show X axis labels (default: false) */
  showXLabels?: boolean;
  /** Show Y axis labels (default: false) */
  showYLabels?: boolean;
  /** Number of Y axis ticks (default: 5) */
  yTicks?: number;
  /** Show grid lines (default: false) */
  showGrid?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * LineChart component - SVG-based line chart
 *
 * Displays a line chart with optional area fill and animated drawing.
 *
 * @example
 * ```tsx
 * <LineChart data={[10, 45, 23, 67, 35, 85]} />
 * <LineChart
 *   data={[
 *     { x: "Jan", y: 30 },
 *     { x: "Feb", y: 45 },
 *     { x: "Mar", y: 62 },
 *   ]}
 *   showArea
 *   showXLabels
 * />
 * ```
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 300,
  strokeColor = COLORS.primary,
  strokeWidth = 3,
  showDots = true,
  dotRadius = 6,
  showArea = false,
  areaOpacity = 0.2,
  animate = true,
  delay = 0,
  showXLabels = false,
  showYLabels = false,
  yTicks = 5,
  showGrid = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Normalize data to array of points
  const points: { x: number; y: number; label?: string }[] = data.map((d, i) => {
    if (typeof d === "number") {
      return { x: i, y: d };
    }
    return {
      x: typeof d.x === "number" ? d.x : i,
      y: d.y,
      label: typeof d.x === "string" ? d.x : undefined,
    };
  });

  // Calculate bounds
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(0, ...yValues);
  const maxY = Math.max(...yValues) * 1.1;

  // Padding for labels
  const paddingLeft = showYLabels ? 50 : 20;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = showXLabels ? 40 : 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Scale functions
  const scaleX = (x: number) =>
    paddingLeft + ((x - minX) / (maxX - minX || 1)) * chartWidth;
  const scaleY = (y: number) =>
    paddingTop + chartHeight - ((y - minY) / (maxY - minY || 1)) * chartHeight;

  // Generate path
  const pathPoints = points.map((p) => `${scaleX(p.x)},${scaleY(p.y)}`);
  const linePath = `M ${pathPoints.join(" L ")}`;

  // Area path
  const areaPath = `${linePath} L ${scaleX(points[points.length - 1].x)},${
    paddingTop + chartHeight
  } L ${scaleX(points[0].x)},${paddingTop + chartHeight} Z`;

  // Animation progress
  const progress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.normal,
      })
    : 1;

  // Calculate total path length for stroke-dasharray animation
  const pathLength = points.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    const dx = scaleX(p.x) - scaleX(prev.x);
    const dy = scaleY(p.y) - scaleY(prev.y);
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  // Entry opacity
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate Y axis ticks
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    minY + ((maxY - minY) / (yTicks - 1)) * i
  );

  return (
    <div style={{ opacity, ...style }}>
      <svg width={width} height={height}>
        {/* Grid lines */}
        {showGrid && (
          <g>
            {yTickValues.map((tick) => (
              <line
                key={tick}
                x1={paddingLeft}
                y1={scaleY(tick)}
                x2={width - paddingRight}
                y2={scaleY(tick)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Y axis labels */}
        {showYLabels && (
          <g>
            {yTickValues.map((tick) => (
              <text
                key={tick}
                x={paddingLeft - 10}
                y={scaleY(tick)}
                fill={COLORS.light}
                fontSize={FONT_SIZES.xs - 4}
                fontFamily={FONT_FAMILY.body}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {Math.round(tick)}
              </text>
            ))}
          </g>
        )}

        {/* Area fill */}
        {showArea && (
          <path
            d={areaPath}
            fill={strokeColor}
            fillOpacity={areaOpacity * progress}
          />
        )}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress)}
          style={{
            filter: `drop-shadow(0 0 4px ${strokeColor}60)`,
          }}
        />

        {/* Dots */}
        {showDots &&
          points.map((point, i) => {
            const dotProgress = animate
              ? spring({
                  frame: frame - delay - i * 3,
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                })
              : 1;
            const dotScale = interpolate(dotProgress, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <circle
                key={i}
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r={dotRadius * dotScale}
                fill={strokeColor}
                stroke={COLORS.dark}
                strokeWidth={2}
              />
            );
          })}

        {/* X axis labels */}
        {showXLabels && (
          <g>
            {points.map((point, i) => (
              <text
                key={i}
                x={scaleX(point.x)}
                y={height - 10}
                fill={COLORS.light}
                fontSize={FONT_SIZES.xs - 4}
                fontFamily={FONT_FAMILY.body}
                textAnchor="middle"
              >
                {point.label || point.x}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

export default LineChart;
