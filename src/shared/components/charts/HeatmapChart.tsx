import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * Props for HeatmapChart
 */
export interface HeatmapChartProps {
  /** 2D array of values [rows][columns] */
  data: number[][];
  /** Row labels */
  rowLabels?: string[];
  /** Column labels */
  columnLabels?: string[];
  /** Chart width */
  width?: number;
  /** Chart height */
  height?: number;
  /** Color for minimum value */
  minColor?: string;
  /** Color for maximum value */
  maxColor?: string;
  /** Color for zero/neutral value */
  neutralColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Cell gap in pixels */
  cellGap?: number;
  /** Animation start frame */
  animationStart?: number;
  /** Stagger animation by row */
  staggerByRow?: boolean;
  /** Show values in cells */
  showValues?: boolean;
  /** Cell border radius */
  borderRadius?: number;
  /** Font size for axis labels */
  labelFontSize?: number;
}

/**
 * Interpolate between two colors
 */
function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // Parse hex colors
  const parseHex = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const c1 = parseHex(color1);
  const c2 = parseHex(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * HeatmapChart - Grid-based data visualization with color intensity
 *
 * Displays values in a matrix format where color intensity
 * represents the magnitude of values.
 *
 * @example
 * ```tsx
 * <HeatmapChart
 *   data={[
 *     [10, 20, 30],
 *     [40, 50, 60],
 *     [70, 80, 90],
 *   ]}
 *   rowLabels={["Row 1", "Row 2", "Row 3"]}
 *   columnLabels={["Col A", "Col B", "Col C"]}
 * />
 * ```
 */
export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  rowLabels,
  columnLabels,
  width = 600,
  height = 400,
  minColor = "#1E40AF", // Blue
  maxColor = "#DC2626", // Red
  neutralColor,
  backgroundColor = "transparent",
  textColor = "#FFFFFF",
  cellGap = 2,
  animationStart = 0,
  staggerByRow = true,
  showValues = true,
  borderRadius = 4,
  labelFontSize = 13,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numRows = data.length;
  const numCols = data[0]?.length || 0;

  // Calculate min/max values
  const { minValue, maxValue } = useMemo(() => {
    const flatValues = data.flat();
    return {
      minValue: Math.min(...flatValues),
      maxValue: Math.max(...flatValues),
    };
  }, [data]);

  // Padding for labels
  const padding = {
    top: columnLabels ? 40 : 20,
    right: 20,
    bottom: 20,
    left: rowLabels ? 80 : 20,
  };

  // Cell dimensions
  const cellWidth =
    (width - padding.left - padding.right - cellGap * (numCols - 1)) / numCols;
  const cellHeight =
    (height - padding.top - padding.bottom - cellGap * (numRows - 1)) / numRows;

  // Get color for a value
  const getColor = (value: number): string => {
    if (minValue === maxValue) return neutralColor || minColor;

    const normalized = (value - minValue) / (maxValue - minValue);

    if (neutralColor && minValue < 0 && maxValue > 0) {
      // Use three-color scale for values crossing zero
      const zeroPoint = -minValue / (maxValue - minValue);
      if (normalized < zeroPoint) {
        return interpolateColor(minColor, neutralColor, normalized / zeroPoint);
      } else {
        return interpolateColor(
          neutralColor,
          maxColor,
          (normalized - zeroPoint) / (1 - zeroPoint)
        );
      }
    }

    return interpolateColor(minColor, maxColor, normalized);
  };

  // Determine text color based on cell color brightness
  const getCellTextColor = (cellColor: string): string => {
    // Simple brightness check
    const rgb = cellColor.match(/\d+/g);
    if (rgb) {
      const brightness =
        (parseInt(rgb[0]) * 299 +
          parseInt(rgb[1]) * 587 +
          parseInt(rgb[2]) * 114) /
        1000;
      return brightness > 128 ? "#000000" : "#FFFFFF";
    }
    return textColor;
  };

  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      {/* Column labels */}
      {columnLabels && (
        <g>
          {columnLabels.map((label, colIndex) => {
            const x = padding.left + colIndex * (cellWidth + cellGap) + cellWidth / 2;
            return (
              <text
                key={`col-${colIndex}`}
                x={x}
                y={padding.top - 10}
                textAnchor="middle"
                fill={textColor}
                fontSize={labelFontSize}
              >
                {label}
              </text>
            );
          })}
        </g>
      )}

      {/* Row labels */}
      {rowLabels && (
        <g>
          {rowLabels.map((label, rowIndex) => {
            const y =
              padding.top + rowIndex * (cellHeight + cellGap) + cellHeight / 2;
            return (
              <text
                key={`row-${rowIndex}`}
                x={padding.left - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill={textColor}
                fontSize={labelFontSize}
              >
                {label}
              </text>
            );
          })}
        </g>
      )}

      {/* Cells */}
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {data.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            // Animation with stagger
            const delay = staggerByRow ? rowIndex * 3 : rowIndex * numCols + colIndex;
            const progress = spring({
              frame: frame - animationStart - delay,
              fps,
              config: { damping: 15, mass: 0.8, stiffness: 120 },
            });

            const x = colIndex * (cellWidth + cellGap);
            const y = rowIndex * (cellHeight + cellGap);
            const cellColor = getColor(value);

            return (
              <g key={`cell-${rowIndex}-${colIndex}`}>
                {/* Cell background */}
                <rect
                  x={x}
                  y={y}
                  width={cellWidth}
                  height={cellHeight}
                  fill={cellColor}
                  rx={borderRadius}
                  opacity={progress}
                  transform={`scale(${0.5 + progress * 0.5})`}
                  style={{
                    transformOrigin: `${x + cellWidth / 2}px ${y + cellHeight / 2}px`,
                  }}
                />

                {/* Value label */}
                {showValues && progress > 0.5 && (
                  <text
                    x={x + cellWidth / 2}
                    y={y + cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={getCellTextColor(cellColor)}
                    fontSize={Math.min(cellWidth, cellHeight) * 0.35}
                    fontWeight="500"
                    opacity={interpolate(progress, [0.5, 1], [0, 1])}
                  >
                    {value.toFixed(Number.isInteger(value) ? 0 : 1)}
                  </text>
                )}
              </g>
            );
          })
        )}
      </g>
    </svg>
  );
};

export default HeatmapChart;
