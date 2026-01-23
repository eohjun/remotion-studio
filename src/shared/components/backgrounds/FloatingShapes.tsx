import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { FloatingShapesProps, ShapeData, ShapeType } from "./types";

/**
 * Seeded random number generator for deterministic results
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generate shape data with deterministic randomization
 */
function generateShapes(
  count: number,
  colors: string[],
  shapeTypes: ShapeType[],
  sizeRange: [number, number],
  seed: number
): ShapeData[] {
  const random = seededRandom(seed);

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: random() * 100,
    y: random() * 100,
    size: sizeRange[0] + random() * (sizeRange[1] - sizeRange[0]),
    color: colors[Math.floor(random() * colors.length)],
    type: shapeTypes[Math.floor(random() * shapeTypes.length)],
    rotationSpeed: (random() - 0.5) * 2, // -1 to 1
    floatSpeed: 0.3 + random() * 0.7, // 0.3 to 1
    delay: random() * 100,
  }));
}

/**
 * SVG path for triangle shape
 */
const getTrianglePath = (size: number): string => {
  const h = (size * Math.sqrt(3)) / 2;
  return `M ${size / 2} 0 L ${size} ${h} L 0 ${h} Z`;
};

/**
 * SVG path for hexagon shape
 */
const getHexagonPath = (size: number): string => {
  const r = size / 2;
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = r + r * Math.cos(angle);
    const y = r + r * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(" L ")} Z`;
};

/**
 * Single shape component
 */
const Shape: React.FC<{
  shape: ShapeData;
  frame: number;
  opacity: number;
  rotate: boolean;
}> = ({ shape, frame, opacity, rotate }) => {
  const adjustedFrame = frame + shape.delay;

  // Floating motion
  const floatOffset = interpolate(
    Math.sin(adjustedFrame * shape.floatSpeed * 0.05),
    [-1, 1],
    [-30, 30]
  );

  // Horizontal drift
  const driftOffset = interpolate(
    Math.sin(adjustedFrame * shape.floatSpeed * 0.03 + shape.id),
    [-1, 1],
    [-20, 20]
  );

  // Rotation
  const rotation = rotate ? adjustedFrame * shape.rotationSpeed : 0;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `calc(${shape.x}% + ${driftOffset}px)`,
    top: `calc(${shape.y}% + ${floatOffset}px)`,
    width: shape.size,
    height: shape.size,
    transform: `rotate(${rotation}deg)`,
    opacity: opacity,
    pointerEvents: "none",
  };

  switch (shape.type) {
    case "circle":
      return (
        <div
          style={{
            ...baseStyle,
            background: shape.color,
            borderRadius: "50%",
          }}
        />
      );

    case "square":
      return (
        <div
          style={{
            ...baseStyle,
            background: shape.color,
            borderRadius: shape.size * 0.1,
          }}
        />
      );

    case "triangle":
      return (
        <svg
          style={baseStyle}
          viewBox={`0 0 ${shape.size} ${(shape.size * Math.sqrt(3)) / 2}`}
        >
          <path d={getTrianglePath(shape.size)} fill={shape.color} />
        </svg>
      );

    case "hexagon":
      return (
        <svg style={baseStyle} viewBox={`0 0 ${shape.size} ${shape.size}`}>
          <path d={getHexagonPath(shape.size)} fill={shape.color} />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * FloatingShapes - Geometric shapes floating in background
 *
 * Creates an animated background with various geometric shapes
 * that float and optionally rotate. Uses seeded randomization
 * for consistent results across renders.
 */
export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  shapeCount = 10,
  shapeTypes = ["circle", "square"],
  colors = ["rgba(102, 126, 234, 0.2)", "rgba(118, 75, 162, 0.2)"],
  sizeRange = [40, 100],
  opacity = 0.5,
  seed = 54321,
  rotate = true,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Generate shapes once with memoization
  const shapes = useMemo(
    () => generateShapes(shapeCount, colors, shapeTypes, sizeRange, seed),
    [shapeCount, colors, shapeTypes, sizeRange, seed]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      {/* Shape layer */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            shape={shape}
            frame={frame}
            opacity={opacity}
            rotate={rotate}
          />
        ))}
      </AbsoluteFill>
      {/* Content layer */}
      {children}
    </AbsoluteFill>
  );
};

export default FloatingShapes;
