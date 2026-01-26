import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";

/**
 * Grid pattern type
 */
export type GridType = "lines" | "dots" | "squares" | "hexagons";

/**
 * Props for GridPattern
 */
export interface GridPatternProps {
  /** Type of grid pattern */
  type?: GridType;
  /** Grid cell size in pixels (default: 40) */
  size?: number;
  /** Grid line/dot color */
  color?: string;
  /** Line width or dot size (default: 1) */
  strokeWidth?: number;
  /** Pattern opacity (0-1, default: 0.3) */
  opacity?: number;
  /** Enable subtle animation */
  animated?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Background color */
  backgroundColor?: string;
  /** Optional children to render on top */
  children?: React.ReactNode;
}

/**
 * GridPattern - Decorative grid background
 *
 * Creates various grid patterns for use as backgrounds
 * in video compositions.
 *
 * @example
 * ```tsx
 * <GridPattern type="dots" size={30} color="#ffffff" opacity={0.2}>
 *   <Content />
 * </GridPattern>
 * ```
 */
export const GridPattern: React.FC<GridPatternProps> = ({
  type = "lines",
  size = 40,
  color = "#ffffff",
  strokeWidth = 1,
  opacity = 0.3,
  animated = false,
  animationSpeed = 0.5,
  backgroundColor,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation offset
  const animationOffset = useMemo(() => {
    if (!animated) return 0;
    const time = frame / fps;
    return (time * animationSpeed * size) % size;
  }, [animated, frame, fps, animationSpeed, size]);

  // Generate pattern based on type (deterministic ID)
  const patternId = useMemo(
    () => `grid-pattern-${random("grid-pattern-id").toString(36).slice(2, 9)}`,
    []
  );

  const renderPattern = () => {
    switch (type) {
      case "dots":
        return (
          <pattern
            id={patternId}
            x={animationOffset}
            y={animationOffset}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={strokeWidth}
              fill={color}
            />
          </pattern>
        );

      case "squares":
        return (
          <pattern
            id={patternId}
            x={animationOffset}
            y={animationOffset}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <rect
              x={strokeWidth / 2}
              y={strokeWidth / 2}
              width={size - strokeWidth}
              height={size - strokeWidth}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </pattern>
        );

      case "hexagons": {
        const hexWidth = size;
        const hexHeight = size * 0.866; // sqrt(3)/2
        return (
          <pattern
            id={patternId}
            x={animationOffset}
            y={animationOffset * 0.866}
            width={hexWidth * 1.5}
            height={hexHeight * 2}
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points={`
                ${hexWidth * 0.25},0
                ${hexWidth * 0.75},0
                ${hexWidth},${hexHeight * 0.5}
                ${hexWidth * 0.75},${hexHeight}
                ${hexWidth * 0.25},${hexHeight}
                0,${hexHeight * 0.5}
              `}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <polygon
              points={`
                ${hexWidth},${hexHeight}
                ${hexWidth * 1.25},${hexHeight}
                ${hexWidth * 1.5},${hexHeight * 1.5}
                ${hexWidth * 1.25},${hexHeight * 2}
                ${hexWidth},${hexHeight * 2}
                ${hexWidth * 0.75},${hexHeight * 1.5}
              `}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </pattern>
        );
      }

      case "lines":
      default:
        return (
          <pattern
            id={patternId}
            x={animationOffset}
            y={animationOffset}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={size}
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <line
              x1="0"
              y1="0"
              x2={size}
              y2="0"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </pattern>
        );
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity,
        }}
      >
        <defs>{renderPattern()}</defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {children && <AbsoluteFill>{children}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

export default GridPattern;
