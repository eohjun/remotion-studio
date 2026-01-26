import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface GaugeChartProps {
  /** Current value */
  value: number;
  /** Maximum value (default: 100) */
  maxValue?: number;
  /** Minimum value (default: 0) */
  minValue?: number;
  /** Label to display */
  label?: string;
  /** Unit suffix (e.g., "%", "km/h") */
  unit?: string;
  /** Gauge color */
  color?: string;
  /** Background track color */
  trackColor?: string;
  /** Show value text (default: true) */
  showValue?: boolean;
  /** Show min/max labels (default: true) */
  showRange?: boolean;
  /** Gauge thickness (default: 20) */
  thickness?: number;
  /** Start angle in degrees (default: 135) */
  startAngle?: number;
  /** End angle in degrees (default: 405) */
  endAngle?: number;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Chart size (default: 250) */
  size?: number;
  /** Color zones for different ranges */
  zones?: Array<{
    upTo: number;
    color: string;
  }>;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * GaugeChart component - Speedometer/gauge visualization
 *
 * Displays a value on an arc gauge with optional color zones.
 *
 * @example
 * ```tsx
 * <GaugeChart
 *   value={75}
 *   label="Performance"
 *   unit="%"
 *   zones={[
 *     { upTo: 30, color: "#dc3545" },
 *     { upTo: 70, color: "#ffc107" },
 *     { upTo: 100, color: "#28a745" },
 *   ]}
 * />
 * ```
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue = 100,
  minValue = 0,
  label,
  unit = "",
  color = COLORS.primary,
  trackColor = "rgba(255,255,255,0.1)",
  showValue = true,
  showRange = true,
  thickness = 20,
  startAngle = 135,
  endAngle = 405,
  animate = true,
  delay = 0,
  size = 250,
  zones,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: SPRING_CONFIGS.normal,
      })
    : 1;

  const radius = (size - thickness) / 2;
  const center = size / 2;

  // Calculate angle range
  const totalAngle = endAngle - startAngle;

  // Calculate value position
  const valueRatio = Math.min(
    1,
    Math.max(0, (value - minValue) / (maxValue - minValue))
  );
  const animatedRatio = valueRatio * progress;

  // Get color based on zones or default
  const getColor = () => {
    if (!zones) return color;
    for (const zone of zones) {
      if (value <= zone.upTo) return zone.color;
    }
    return zones[zones.length - 1]?.color || color;
  };

  const activeColor = getColor();

  // SVG arc path
  const describeArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  // Needle position
  const needleAngle = startAngle + totalAngle * animatedRatio;
  const needleLength = radius - 15;
  const needleEnd = polarToCartesian(center, center, needleLength, needleAngle);

  // Display value
  const displayValue = Math.round(value * progress);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(0deg)" }}
      >
        {/* Background track */}
        <path
          d={describeArc(center, center, radius, startAngle, endAngle)}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Zone indicators (if provided) */}
        {zones &&
          zones.map((zone, i) => {
            const prevUpTo = i > 0 ? zones[i - 1].upTo : minValue;
            const zoneStart =
              startAngle +
              ((prevUpTo - minValue) / (maxValue - minValue)) * totalAngle;
            const zoneEnd =
              startAngle +
              ((zone.upTo - minValue) / (maxValue - minValue)) * totalAngle;

            return (
              <path
                key={i}
                d={describeArc(center, center, radius, zoneStart, zoneEnd)}
                fill="none"
                stroke={zone.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                opacity={0.3}
              />
            );
          })}

        {/* Value arc */}
        <path
          d={describeArc(
            center,
            center,
            radius,
            startAngle,
            startAngle + totalAngle * animatedRatio
          )}
          fill="none"
          stroke={activeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${activeColor}60)`,
          }}
        />

        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke={COLORS.white}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Needle center dot */}
        <circle cx={center} cy={center} r={10} fill={COLORS.white} />
        <circle cx={center} cy={center} r={6} fill={activeColor} />

        {/* Min/Max labels */}
        {showRange && (
          <>
            <text
              x={polarToCartesian(center, center, radius + 25, startAngle).x}
              y={polarToCartesian(center, center, radius + 25, startAngle).y}
              textAnchor="middle"
              fill={COLORS.light}
              fontSize={FONT_SIZES.xs}
              fontFamily={FONT_FAMILY.body}
              opacity={0.6}
            >
              {minValue}
            </text>
            <text
              x={polarToCartesian(center, center, radius + 25, endAngle).x}
              y={polarToCartesian(center, center, radius + 25, endAngle).y}
              textAnchor="middle"
              fill={COLORS.light}
              fontSize={FONT_SIZES.xs}
              fontFamily={FONT_FAMILY.body}
              opacity={0.6}
            >
              {maxValue}
            </text>
          </>
        )}
      </svg>

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {showValue && (
          <div
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 800,
              color: activeColor,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1,
            }}
          >
            {displayValue}
            {unit && (
              <span
                style={{ fontSize: FONT_SIZES.md, fontWeight: 600, marginLeft: 4 }}
              >
                {unit}
              </span>
            )}
          </div>
        )}
        {label && (
          <div
            style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.light,
              fontFamily: FONT_FAMILY.body,
              marginTop: 4,
              opacity: 0.8,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default GaugeChart;
