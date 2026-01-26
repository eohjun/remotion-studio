/**
 * Type definitions for the scene transition system
 */
import { SpringConfig } from "remotion";
import React from "react";

/**
 * Available transition types
 * - Built-in: fade, slide, wipe, flip, clockWipe
 * - Custom: dissolve, zoom
 * - none: Hard cut with no transition
 */
export type TransitionType =
  | "fade"
  | "slide"
  | "wipe"
  | "flip"
  | "clockWipe"
  | "dissolve"
  | "zoom"
  | "morph"
  | "glitch"
  | "blinds"
  | "ripple"
  | "none";

/**
 * Direction for directional transitions (slide, wipe)
 */
export type TransitionDirection =
  | "from-left"
  | "from-right"
  | "from-top"
  | "from-bottom";

/**
 * Configuration for a transition effect
 */
export interface TransitionConfig {
  /** Type of transition effect */
  type: TransitionType;
  /** Direction for directional transitions */
  direction?: TransitionDirection;
  /** Duration of transition in frames (default: 20) */
  durationInFrames?: number;
  /** Spring configuration for physics-based animations */
  springConfig?: Partial<SpringConfig>;
  /** Perspective for 3D transitions like flip (default: 1000) */
  perspective?: number;
}

/**
 * Definition for a single scene in a composition
 */
export interface SceneDefinition {
  /** Unique identifier for the scene */
  id: string;
  /** React component to render for this scene */
  component: React.ComponentType<SceneComponentProps>;
  /** Duration of the scene in frames */
  durationInFrames: number;
  /** Optional audio file path (relative to public/) */
  audio?: string;
  /** Transition to apply AFTER this scene (to next scene) */
  transition?: TransitionConfig;
}

/**
 * Props passed to scene components
 */
export interface SceneComponentProps {
  /** Total duration of the scene in frames */
  durationInFrames?: number;
}

/**
 * Props for TransitionComposition wrapper
 */
export interface TransitionCompositionProps {
  /** Array of scene definitions */
  scenes: SceneDefinition[];
  /** Default transition to use when scene doesn't specify one */
  defaultTransition?: TransitionConfig;
  /** Whether to apply transition after the last scene */
  transitionAfterLast?: boolean;
}

/**
 * Preset name type for quick preset selection
 */
export type TransitionPresetName =
  | "fade"
  | "fadeQuick"
  | "fadeSlow"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "wipeLeft"
  | "wipeRight"
  | "wipeUp"
  | "wipeDown"
  | "flipHorizontal"
  | "flipVertical"
  | "clockWipe"
  | "dissolve"
  | "dissolveQuick"
  | "zoomIn"
  | "zoomOut"
  | "morph"
  | "morphLeft"
  | "morphRight"
  | "glitch"
  | "glitchIntense"
  | "blindsHorizontal"
  | "blindsVertical"
  | "ripple"
  | "rippleCorner"
  | "cut";
