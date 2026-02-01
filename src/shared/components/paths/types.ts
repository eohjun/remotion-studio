import { CSSProperties } from "react";

/**
 * Common props for animated path components
 */
export interface BasePathProps {
  /** SVG path data (d attribute) */
  path: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Fill color */
  fill?: string;
  /** Animation delay in frames */
  delay?: number;
  /** Whether to animate */
  animate?: boolean;
  /** Width of the SVG */
  width?: number;
  /** Height of the SVG */
  height?: number;
  /** Custom style overrides */
  style?: CSSProperties;
}

export interface SelfDrawingPathProps extends BasePathProps {
  /** Duration of draw animation in frames */
  drawDuration?: number;
  /** Easing function for draw (default: linear) */
  drawEasing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  /** Whether to draw in reverse (undraw) */
  reverse?: boolean;
  /** Stroke line cap */
  strokeLinecap?: "butt" | "round" | "square";
  /** Stroke line join */
  strokeLinejoin?: "miter" | "round" | "bevel";
}

export interface MorphingPathProps {
  /** Starting path */
  fromPath: string;
  /** Ending path */
  toPath: string;
  /** Morph progress 0-1 (if not animated) */
  progress?: number;
  /** Duration of morph animation in frames */
  morphDuration?: number;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Fill color */
  fill?: string;
  /** Animation delay in frames */
  delay?: number;
  /** Whether to animate progress */
  animate?: boolean;
  /** Width of the SVG */
  width?: number;
  /** Height of the SVG */
  height?: number;
  /** Custom style overrides */
  style?: CSSProperties;
}

export interface WarpedPathProps extends BasePathProps {
  /** Number of warp waves */
  waveCount?: number;
  /** Amplitude of warp */
  amplitude?: number;
  /** Animation speed (cycles per second) */
  speed?: number;
  /** Warp direction */
  direction?: "horizontal" | "vertical" | "both";
}

/**
 * Common icon paths for morphing
 */
export const ICON_PATHS = {
  play: "M8 5v14l11-7z",
  pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
  stop: "M6 6h12v12H6z",
  checkmark: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  cross: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  arrowRight: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
  arrowLeft: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
} as const;

export type IconName = keyof typeof ICON_PATHS;
