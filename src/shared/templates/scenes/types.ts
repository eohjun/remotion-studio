import React from "react";
import { SpringConfig } from "remotion";
import { EffectsConfig } from "../../components/effects";

/**
 * Visual enhancement props for backgrounds and effects
 */
export interface VisualEnhancementProps {
  /** Custom background component (AnimatedGradient, ParticleField, etc.) */
  backgroundComponent?: React.ReactNode;
  /** Cinematic effects configuration */
  effects?: EffectsConfig;
}

/**
 * Base props for all scene templates
 */
export interface BaseSceneProps extends VisualEnhancementProps {
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

// =============================================================================
// Phase 11: New Template Types
// =============================================================================

/**
 * Data item for charts and visualizations
 */
export interface DataItem {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

/**
 * Timeline event for TimelineTemplate
 */
export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  highlight?: boolean;
}

/**
 * Image item for ImageTemplate
 */
export interface ImageItem {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * Annotation for AnnotationTemplate
 */
export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  icon?: string;
  pointerDirection?: "top" | "bottom" | "left" | "right";
  color?: string;
  highlight?: boolean;
}

/**
 * Story panel for StoryTemplate
 */
export interface StoryPanel {
  content: React.ReactNode | string;
  background?: string;
  mood?: "neutral" | "positive" | "negative" | "dramatic";
  transition?: "fade" | "slide" | "zoom";
  /** Start frame for timed-sequence layout */
  startFrame?: number;
  /** End frame for timed-sequence layout */
  endFrame?: number;
}
