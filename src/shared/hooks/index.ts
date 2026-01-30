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

// Dynamic text sizing using @remotion/layout-utils
export { useFitText, useFitMultilineText } from "./useFitText";
export type {
  UseFitTextOptions,
  UseFitMultilineOptions,
  FitTextResult,
} from "./useFitText";
