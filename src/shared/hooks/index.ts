// Hooks barrel export
export { useSceneFrame, delayedFrame, staggerDelay } from "./useSceneFrame";
export type { SceneFrameResult, UseSceneFrameOptions } from "./useSceneFrame";

// Responsive utilities for multi-aspect-ratio support
export {
  useResponsive,
  createResponsiveStyles,
  RESOLUTION_PRESETS,
} from "./useResponsive";
export type { AspectRatio, ResponsiveUtils } from "./useResponsive";
