import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface PieChartDataItem {
  /** Label for the slice */
  label: string;
  /** Value of the slice */
  value: number;
  /** Optional custom color */
  color?: string;
}

export interface PieChartProps {
  /** Chart data */
  data: PieChartDataItem[];
  /** Size of the chart in pixels (default: 300) */
  size?: number;
  /** Inner radius for donut chart (0 = pie, >0 = donut) (default: 0) */
  innerRadius?: number;
  /** Show labels (default: true) */
  showLabels?: boolean;
  /** Show values in labels (default: true) */
  showValues?: boolean;
  /** Label position (default: "outside") */
  labelPosition?: "inside" | "outside";
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Default color palette */
  colors?: string[];
  /** Index of slice to highlight */
  highlight?: number;
  /** Stroke color between slices */
  strokeColor?: string;
  /** Stroke width between slices (default: 2) */
  strokeWidth?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

// Default color palette
const DEFAULT_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.success,
  COLORS.warning,
  COLORS.orange,
  COLORS.purple,
  COLORS.danger,
];

/**
 * PieChart component - SVG-based pie or donut chart
 *
 * Displays a pie chart with animated slices.
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={[
 *     { label: "Desktop", value: 55 },
 *     { label: "Mobile", value: 35 },
 *     { label: "Tablet", value: 10 },
 *   ]}
 * />
 * <PieChart data={data} innerRadius={0.6} /> // Donut chart
 * ```
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 300,
  innerRadius = 0,
  showLabels = true,
  showValues = true,
  labelPosition = "outside",
  animate = true,
  delay = 0,
  colors = DEFAULT_COLORS,
  highlight,
  strokeColor = COLORS.dark,
  strokeWidth = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate total
  const total = data.reduce((acc, d) => acc + d.value, 0);

  // Animation progress
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

  // Entry opacity
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const center = size / 2;
  const outerRadius = (size / 2) - 10; // Leave some padding
  const actualInnerRadius = outerRadius * innerRadius;

  // Calculate slice angles
  let startAngle = -90; // Start from top
  const slices = data.map((item, i) => {
    const sliceAngle = (item.value / total) * 360 * progress;
    const endAngle = startAngle + sliceAngle;
    const slice = {
      ...item,
      startAngle,
      endAngle,
      midAngle: startAngle + sliceAngle / 2,
      color: item.color || colors[i % colors.length],
      percentage: Math.round((item.value / total) * 100),
      index: i,
    };
    startAngle = endAngle;
    return slice;
  });

  // Convert polar to cartesian
  const polarToCartesian = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  // Create arc path
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    outerR: number,
    innerR: number
  ) => {
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const innerStart = polarToCartesian(endAngle, innerR);
    const innerEnd = polarToCartesian(startAngle, innerR);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (innerR === 0) {
      // Pie slice (no hole)
      return [
        `M ${center} ${center}`,
        `L ${start.x} ${start.y}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        "Z",
      ].join(" ");
    }

    // Donut slice
    return [
      `M ${start.x} ${start.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      "Z",
    ].join(" ");
  };

  // Label line offset (used for future outside-on-chart labels)
  // const labelOffset = labelPosition === "outside" ? 30 : 0;
  // const labelRadius = outerRadius + labelOffset;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        opacity,
        ...style,
      }}
    >
      <svg width={size} height={size}>
        {slices.map((slice, i) => {
          const isHighlighted = highlight === i;
          const sliceProgress = animate
            ? spring({
                frame: frame - delay - i * 5,
                fps,
                config: SPRING_CONFIGS.snappy,
              })
            : 1;

          // Highlight effect - move slice outward
          const highlightOffset = isHighlighted ? 10 : 0;
          const offsetAngle = (slice.midAngle * Math.PI) / 180;
          const offsetX = Math.cos(offsetAngle) * highlightOffset * sliceProgress;
          const offsetY = Math.sin(offsetAngle) * highlightOffset * sliceProgress;

          return (
            <g key={i} transform={`translate(${offsetX}, ${offsetY})`}>
              <path
                d={createArcPath(
                  slice.startAngle,
                  slice.endAngle,
                  outerRadius,
                  actualInnerRadius
                )}
                fill={slice.color}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={isHighlighted ? 1 : 0.9}
                style={{
                  filter: isHighlighted
                    ? `drop-shadow(0 0 10px ${slice.color}80)`
                    : undefined,
                }}
              />
              {/* Inside labels */}
              {showLabels && labelPosition === "inside" && slice.endAngle - slice.startAngle > 20 && (
                <text
                  x={polarToCartesian(slice.midAngle, (outerRadius + actualInnerRadius) / 2).x}
                  y={polarToCartesian(slice.midAngle, (outerRadius + actualInnerRadius) / 2).y}
                  fill={COLORS.white}
                  fontSize={FONT_SIZES.xs - 2}
                  fontFamily={FONT_FAMILY.body}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {showValues ? `${slice.percentage}%` : slice.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {showLabels && labelPosition === "outside" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {slices.map((slice, i) => {
            const labelProgress = animate
              ? spring({
                  frame: frame - delay - 30 - i * 8,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                })
              : 1;
            const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const isHighlighted = highlight === i;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: labelOpacity,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: slice.color,
                    boxShadow: isHighlighted
                      ? `0 0 8px ${slice.color}`
                      : undefined,
                  }}
                />
                <span
                  style={{
                    fontSize: FONT_SIZES.sm - 2,
                    color: isHighlighted ? COLORS.white : COLORS.light,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: isHighlighted ? 600 : 400,
                  }}
                >
                  {slice.label}
                  {showValues && (
                    <span style={{ marginLeft: 8, color: slice.color }}>
                      {slice.percentage}%
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PieChart;
