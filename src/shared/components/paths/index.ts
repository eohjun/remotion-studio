/**
 * Animated Path Components
 *
 * Wrapper components around @remotion/paths for advanced SVG path animations.
 * These provide self-drawing effects, path morphing, and wave distortions.
 */

// Re-export utilities from @remotion/paths for direct usage
export {
  // Path manipulation
  evolvePath,
  interpolatePath,
  warpPath,
  // Path info
  getLength,
  getPointAtLength,
  getTangentAtLength,
  getSubpaths,
  // Path construction
  extendViewBox,
  resetPath,
  scalePath,
  translatePath,
  // Bounding box
  getBoundingBox,
} from "@remotion/paths";

// Animated wrapper components
export { SelfDrawingPath, getPathLength } from "./SelfDrawingPath";
export { MorphingIcon, IconTransitions, ICON_PATHS } from "./MorphingIcon";
export { LiquidPath } from "./LiquidPath";

// Types
export type {
  BasePathProps,
  SelfDrawingPathProps,
  MorphingPathProps,
  WarpedPathProps,
  IconName,
} from "./types";
