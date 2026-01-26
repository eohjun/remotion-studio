import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

/**
 * Data series for radar chart
 */
export interface RadarDataSeries {
  /** Series name */
  name: string;
  /** Values for each axis (same length as labels) */
  values: number[];
  /** Series color */
  color: string;
  /** Fill opacity */
  fillOpacity?: number;
}

/**
 * Props for RadarChart
 */
export interface RadarChartProps {
  /** Axis labels */
  labels: string[];
  /** Data series to display */
  series: RadarDataSeries[];
  /** Chart size (width and height) */
  size?: number;
  /** Maximum value for scaling (auto-detected if not provided) */
  maxValue?: number;
  /** Number of concentric rings */
  rings?: number;
  /** Background color */
  backgroundColor?: string;
  /** Grid/axis color */
  gridColor?: string;
  /** Text color */
  textColor?: string;
  /** Animation start frame */
  animationStart?: number;
  /** Show value dots */
  showDots?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Font size for axis labels */
  labelFontSize?: number;
  /** Font size for legend text */
  legendFontSize?: number;
  /** Spacing between legend items (default: auto-calculated based on series count) */
  legendSpacing?: number;
}

/**
 * RadarChart - Multi-dimensional data visualization
 *
 * Displays multiple variables on axes starting from the center.
 * Great for comparing entities across multiple attributes.
 *
 * @example
 * ```tsx
 * <RadarChart
 *   labels={["Speed", "Power", "Defense", "Magic", "Luck"]}
 *   series={[
 *     { name: "Player A", values: [80, 65, 90, 50, 70], color: "#3B82F6" },
 *     { name: "Player B", values: [70, 85, 60, 80, 60], color: "#EF4444" },
 *   ]}
 * />
 * ```
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  labels,
  series,
  size = 400,
  maxValue: propMaxValue,
  rings = 5,
  backgroundColor = "transparent",
  gridColor = "#ffffff",
  textColor = "#ffffff",
  animationStart = 0,
  showDots = true,
  showLegend = true,
  labelFontSize = 16,
  legendFontSize = 14,
  legendSpacing,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numAxes = labels.length;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) * 0.7; // Leave room for labels

  // Calculate max value
  const maxValue = useMemo(() => {
    if (propMaxValue) return propMaxValue;
    const allValues = series.flatMap((s) => s.values);
    return Math.max(...allValues, 1);
  }, [series, propMaxValue]);

  // Animation progress
  const progress = spring({
    frame: frame - animationStart,
    fps,
    config: { damping: 15, mass: 1, stiffness: 80 },
  });

  // Calculate point position on the radar
  const getPoint = (axisIndex: number, value: number): { x: number; y: number } => {
    const angle = (Math.PI * 2 * axisIndex) / numAxes - Math.PI / 2;
    const normalizedValue = value / maxValue;
    const distance = normalizedValue * radius * progress;

    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
    };
  };

  // Generate axis endpoint
  const getAxisEnd = (axisIndex: number): { x: number; y: number } => {
    const angle = (Math.PI * 2 * axisIndex) / numAxes - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  // Generate ring polygon points
  const getRingPoints = (ringRadius: number): string => {
    const points: string[] = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
      const x = centerX + Math.cos(angle) * ringRadius;
      const y = centerY + Math.sin(angle) * ringRadius;
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  // Generate series polygon points
  const getSeriesPath = (values: number[]): string => {
    const points = values.map((value, index) => {
      const point = getPoint(index, value);
      return `${point.x},${point.y}`;
    });
    return points.join(" ");
  };

  return (
    <svg
      width={size}
      height={size + (showLegend ? 40 : 0)}
      style={{ backgroundColor }}
    >
      <g>
        {/* Concentric rings */}
        {Array.from({ length: rings }, (_, i) => {
          const ringRadius = (radius / rings) * (i + 1);
          return (
            <polygon
              key={`ring-${i}`}
              points={getRingPoints(ringRadius)}
              fill="none"
              stroke={gridColor}
              strokeOpacity={0.2}
              strokeWidth={1}
            />
          );
        })}

        {/* Axes */}
        {labels.map((_, index) => {
          const end = getAxisEnd(index);
          return (
            <line
              key={`axis-${index}`}
              x1={centerX}
              y1={centerY}
              x2={end.x}
              y2={end.y}
              stroke={gridColor}
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          );
        })}

        {/* Data series */}
        {series.map((s, seriesIndex) => {
          const pathPoints = getSeriesPath(s.values);

          return (
            <g key={`series-${seriesIndex}`}>
              {/* Filled area */}
              <polygon
                points={pathPoints}
                fill={s.color}
                fillOpacity={(s.fillOpacity ?? 0.3) * progress}
                stroke={s.color}
                strokeWidth={2}
                strokeOpacity={progress}
              />

              {/* Dots */}
              {showDots &&
                s.values.map((value, index) => {
                  const point = getPoint(index, value);
                  return (
                    <circle
                      key={`dot-${seriesIndex}-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r={4}
                      fill={s.color}
                      stroke="#fff"
                      strokeWidth={2}
                      opacity={progress}
                    />
                  );
                })}
            </g>
          );
        })}

        {/* Labels */}
        {labels.map((label, index) => {
          const end = getAxisEnd(index);
          const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
          const labelOffset = 20;
          const labelX = end.x + Math.cos(angle) * labelOffset;
          const labelY = end.y + Math.sin(angle) * labelOffset;

          // Text anchor based on position
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (Math.abs(Math.cos(angle)) > 0.3) {
            textAnchor = Math.cos(angle) > 0 ? "start" : "end";
          }

          return (
            <text
              key={`label-${index}`}
              x={labelX}
              y={labelY}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fill={textColor}
              fontSize={labelFontSize}
              opacity={progress}
            >
              {label}
            </text>
          );
        })}
      </g>

      {/* Legend */}
      {showLegend && (() => {
        const itemSpacing = legendSpacing ?? Math.max(100, size / series.length);
        // Estimate last item width: colored box (16) + gap (6) + text (~60px average)
        const estimatedLastItemWidth = 80;
        // Total width = spacing between items + last item width
        const totalWidth = (series.length - 1) * itemSpacing + estimatedLastItemWidth;
        const startX = size / 2 - totalWidth / 2;

        return (
          <g transform={`translate(${startX}, ${size + 10})`}>
            {series.map((s, index) => (
              <g key={`legend-${index}`} transform={`translate(${index * itemSpacing}, 0)`}>
                <rect
                  x={0}
                  y={0}
                  width={16}
                  height={16}
                  fill={s.color}
                  rx={3}
                  opacity={progress}
                />
                <text
                  x={22}
                  y={12}
                  fill={textColor}
                  fontSize={legendFontSize}
                  opacity={progress}
                >
                  {s.name}
                </text>
              </g>
            ))}
          </g>
        );
      })()}
    </svg>
  );
};

export default RadarChart;
