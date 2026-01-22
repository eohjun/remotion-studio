import { SpringConfig } from "remotion";

/**
 * Base props for all scene templates
 */
export interface BaseSceneProps {
  /** Duration of the scene in frames */
  durationInFrames: number;
  /** Enable scene transition wrapper (default: true) */
  useTransition?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * Animation configuration for scene elements
 */
export interface SceneAnimationConfig {
  /** Delay before animation starts (in frames) */
  delay?: number;
  /** Spring config for the animation */
  springConfig?: Partial<SpringConfig>;
}

/**
 * Text content with optional styling
 */
export interface StyledText {
  text: string;
  color?: string;
  fontWeight?: number;
  highlight?: boolean;
}

/**
 * Item with icon for lists
 */
export interface IconItem {
  icon: string;
  text: string;
  subtext?: string;
  color?: string;
}

/**
 * Card data for comparison layouts
 */
export interface CardData {
  icon?: string;
  title: string;
  items: StyledText[];
  color: string;
  backgroundColor?: string;
}
