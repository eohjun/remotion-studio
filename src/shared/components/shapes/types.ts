import { CSSProperties } from "react";

/**
 * Common props for animated shape components
 */
export interface BaseShapeProps {
  /** Size of the shape in pixels */
  size?: number;
  /** Fill color */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Animation delay in frames */
  delay?: number;
  /** Whether to animate */
  animate?: boolean;
  /** Custom style overrides */
  style?: CSSProperties;
}

export interface AnimatedStarProps extends BaseShapeProps {
  /** Number of points (default: 5) */
  points?: number;
  /** Inner radius ratio (default: 0.5) */
  innerRadius?: number;
  /** Rotation speed (degrees per frame) */
  rotationSpeed?: number;
  /** Pulsing animation */
  pulse?: boolean;
}

export interface AnimatedPieProps extends BaseShapeProps {
  /** Progress 0-1 for partial pie */
  progress?: number;
  /** Start angle in degrees (default: 0) */
  startAngle?: number;
  /** Whether to animate the fill progress */
  animateProgress?: boolean;
  /** Clockwise direction (default: true) */
  clockwise?: boolean;
}

export interface AnimatedPolygonProps extends BaseShapeProps {
  /** Number of sides (default: 6 for hexagon) */
  sides?: number;
  /** Corner radius for rounded corners */
  cornerRadius?: number;
  /** Rotation animation */
  rotationSpeed?: number;
  /** Morph to different polygon */
  morphToSides?: number;
  /** Morph progress 0-1 */
  morphProgress?: number;
}

export interface AnimatedTriangleProps extends BaseShapeProps {
  /** Direction the triangle points (default: "up") */
  direction?: "up" | "down" | "left" | "right";
  /** Corner radius */
  cornerRadius?: number;
  /** Rotation speed */
  rotationSpeed?: number;
}

export interface AnimatedRectProps extends BaseShapeProps {
  /** Width (default: same as size) */
  width?: number;
  /** Height (default: same as size) */
  height?: number;
  /** Corner radius */
  cornerRadius?: number;
  /** Rotation speed */
  rotationSpeed?: number;
}

export interface AnimatedEllipseProps extends BaseShapeProps {
  /** X radius */
  rx?: number;
  /** Y radius */
  ry?: number;
  /** Rotation speed */
  rotationSpeed?: number;
  /** Pulsing animation */
  pulse?: boolean;
}
