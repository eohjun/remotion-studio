/**
 * Animated Shape Components
 *
 * Wrapper components around @remotion/shapes with built-in animations.
 * These provide entry animations, rotation, and other effects while
 * leveraging Remotion's optimized shape rendering.
 */

// Re-export raw shapes from @remotion/shapes for direct usage
export {
  Circle,
  Ellipse,
  Pie,
  Polygon,
  Rect,
  Star,
  Triangle,
  // Utility functions
  makeCircle,
  makeEllipse,
  makePie,
  makePolygon,
  makeRect,
  makeStar,
  makeTriangle,
} from "@remotion/shapes";

// Animated wrapper components
export { AnimatedStar } from "./AnimatedStar";
export { AnimatedPie } from "./AnimatedPie";
export { AnimatedPolygon } from "./AnimatedPolygon";
export { AnimatedTriangle } from "./AnimatedTriangle";
export { AnimatedRect } from "./AnimatedRect";
export { AnimatedEllipse } from "./AnimatedEllipse";

// Types
export type {
  BaseShapeProps,
  AnimatedStarProps,
  AnimatedPieProps,
  AnimatedPolygonProps,
  AnimatedTriangleProps,
  AnimatedRectProps,
  AnimatedEllipseProps,
} from "./types";
