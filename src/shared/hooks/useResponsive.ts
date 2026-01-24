import { useVideoConfig } from "remotion";

/**
 * Supported aspect ratios for video production
 */
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";

/**
 * Resolution presets for different aspect ratios
 */
export const RESOLUTION_PRESETS = {
  // Standard YouTube/Landscape (16:9)
  "16:9": {
    width: 1920,
    height: 1080,
    aspectRatio: 16 / 9,
  },
  // YouTube Shorts/TikTok/Reels (9:16)
  "9:16": {
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
  },
  // Square (Instagram/Facebook)
  "1:1": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
  },
  // Legacy/4:3
  "4:3": {
    width: 1440,
    height: 1080,
    aspectRatio: 4 / 3,
  },
} as const;

/**
 * Responsive utilities returned by useResponsive hook
 */
export interface ResponsiveUtils {
  /** Current aspect ratio */
  aspectRatio: AspectRatio;
  /** Whether the video is in portrait/vertical mode (Shorts) */
  isPortrait: boolean;
  /** Whether the video is in landscape mode */
  isLandscape: boolean;
  /** Whether the video is square */
  isSquare: boolean;
  /** Current video width */
  width: number;
  /** Current video height */
  height: number;
  /** Scale a value based on the current resolution (relative to 1080p) */
  scale: (value: number) => number;
  /** Scale font size for readability on different aspect ratios */
  scaleFont: (baseSize: number) => number;
  /** Scale spacing/padding based on current resolution */
  scaleSpacing: (baseSpacing: number) => number;
  /** Get layout direction based on aspect ratio */
  layoutDirection: "row" | "column";
  /** Get optimal number of columns for grid layouts */
  optimalColumns: (baseColumns: number) => number;
  /** Get optimal padding for the current aspect ratio */
  padding: {
    horizontal: number;
    vertical: number;
  };
  /** Text size adjustments for current aspect ratio */
  textScale: {
    title: number;
    body: number;
    small: number;
  };
}

/**
 * Detect aspect ratio from dimensions
 */
function detectAspectRatio(width: number, height: number): AspectRatio {
  const ratio = width / height;

  // Allow some tolerance for detection
  if (Math.abs(ratio - 16 / 9) < 0.05) return "16:9";
  if (Math.abs(ratio - 9 / 16) < 0.05) return "9:16";
  if (Math.abs(ratio - 1) < 0.05) return "1:1";
  if (Math.abs(ratio - 4 / 3) < 0.05) return "4:3";

  // Default based on whether portrait or landscape
  return ratio < 1 ? "9:16" : "16:9";
}

/**
 * useResponsive hook for responsive video layouts
 *
 * Provides utilities for creating videos that work across different
 * aspect ratios including 16:9 (landscape), 9:16 (Shorts), and more.
 *
 * @example
 * ```tsx
 * const { isPortrait, scale, scaleFont, layoutDirection } = useResponsive();
 *
 * return (
 *   <div style={{
 *     flexDirection: layoutDirection,
 *     fontSize: scaleFont(48),
 *     padding: scale(40),
 *   }}>
 *     {isPortrait ? <PortraitLayout /> : <LandscapeLayout />}
 *   </div>
 * );
 * ```
 */
export function useResponsive(): ResponsiveUtils {
  const { width, height } = useVideoConfig();

  const aspectRatio = detectAspectRatio(width, height);
  const isPortrait = height > width;
  const isLandscape = width > height;
  const isSquare = Math.abs(width - height) < 10;

  // Base scale factor relative to 1080p (standard reference)
  const baseWidth = 1920;
  const scaleFactor = isPortrait
    ? width / RESOLUTION_PRESETS["9:16"].width
    : width / baseWidth;

  /**
   * Scale a value based on the current resolution
   */
  const scale = (value: number): number => {
    return Math.round(value * scaleFactor);
  };

  /**
   * Scale font size with additional adjustments for portrait mode
   * Portrait mode typically needs larger fonts for mobile viewing
   */
  const scaleFont = (baseSize: number): number => {
    const scaled = baseSize * scaleFactor;
    // Boost font size slightly for portrait mode (better mobile readability)
    const portraitBoost = isPortrait ? 1.15 : 1;
    return Math.round(scaled * portraitBoost);
  };

  /**
   * Scale spacing/padding based on resolution
   */
  const scaleSpacing = (baseSpacing: number): number => {
    const scaled = baseSpacing * scaleFactor;
    // Reduce spacing in portrait mode to maximize content area
    const portraitAdjust = isPortrait ? 0.8 : 1;
    return Math.round(scaled * portraitAdjust);
  };

  /**
   * Get layout direction based on aspect ratio
   * Portrait videos typically use vertical (column) layouts
   * Landscape videos use horizontal (row) layouts
   */
  const layoutDirection: "row" | "column" = isPortrait ? "column" : "row";

  /**
   * Get optimal number of columns for grid layouts
   * Reduces columns in portrait mode for better fit
   */
  const optimalColumns = (baseColumns: number): number => {
    if (isPortrait) {
      // Portrait: reduce columns, min 1
      return Math.max(1, Math.floor(baseColumns / 2));
    }
    if (isSquare) {
      // Square: slightly reduce columns
      return Math.max(1, baseColumns - 1);
    }
    return baseColumns;
  };

  /**
   * Get optimal padding for the current aspect ratio
   */
  const padding = {
    horizontal: isPortrait ? scale(40) : scale(80),
    vertical: isPortrait ? scale(60) : scale(60),
  };

  /**
   * Text size scale multipliers for different text types
   */
  const textScale = {
    title: isPortrait ? 1.2 : 1,
    body: isPortrait ? 1.15 : 1,
    small: isPortrait ? 1.1 : 1,
  };

  return {
    aspectRatio,
    isPortrait,
    isLandscape,
    isSquare,
    width,
    height,
    scale,
    scaleFont,
    scaleSpacing,
    layoutDirection,
    optimalColumns,
    padding,
    textScale,
  };
}

/**
 * Helper function to create responsive styles
 * Use outside of React components when you have width/height available
 */
export function createResponsiveStyles(width: number, height: number) {
  const aspectRatio = detectAspectRatio(width, height);
  const isPortrait = height > width;
  const scaleFactor = isPortrait
    ? width / RESOLUTION_PRESETS["9:16"].width
    : width / RESOLUTION_PRESETS["16:9"].width;

  return {
    aspectRatio,
    isPortrait,
    scaleFactor,
    scale: (value: number) => Math.round(value * scaleFactor),
    scaleFont: (value: number) => Math.round(value * scaleFactor * (isPortrait ? 1.15 : 1)),
  };
}

export default useResponsive;
