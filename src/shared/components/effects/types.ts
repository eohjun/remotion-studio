import React from "react";

/**
 * Props for Vignette effect
 */
export interface VignetteProps {
  /** Intensity of the vignette (0-1, default: 0.3) */
  intensity?: number;
  /** Color of the vignette (default: black) */
  color?: string;
  /** Size of the vignette (0-1, larger = smaller dark area) */
  size?: number;
  /** Softness of the vignette edge */
  softness?: number;
  /** Optional children to render */
  children?: React.ReactNode;
}

/**
 * Position options for light leak
 */
export type LightLeakPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

/**
 * Light leak visual style
 */
export type LightLeakType = "gradient" | "flare" | "streak";

/**
 * Props for LightLeak effect
 */
export interface LightLeakProps {
  /** Color of the light leak (default: warm orange) */
  color?: string;
  /** Position of the light leak */
  position?: LightLeakPosition;
  /** Intensity of the effect (0-1, default: 0.3) */
  intensity?: number;
  /** Enable animation */
  animated?: boolean;
  /** Type of light leak visual */
  type?: LightLeakType;
  /** Animation cycle duration in frames */
  cycleDuration?: number;
  /** Optional children to render */
  children?: React.ReactNode;
}

/**
 * Blend mode options for film grain
 */
export type GrainBlendMode = "overlay" | "multiply" | "soft-light" | "screen";

/**
 * Props for FilmGrain effect
 */
export interface FilmGrainProps {
  /** Intensity of the grain (0-1, default: 0.15) */
  intensity?: number;
  /** Animate the grain pattern */
  animated?: boolean;
  /** Use monochrome grain */
  monochrome?: boolean;
  /** CSS blend mode for the grain layer */
  blendMode?: GrainBlendMode;
  /** Speed of grain animation (1 = full speed) */
  speed?: number;
  /** Optional children to render */
  children?: React.ReactNode;
}

/**
 * Props for MotionBlurWrapper
 */
export interface MotionBlurWrapperProps {
  /** Content to apply motion blur to */
  children: React.ReactNode;
  /** Number of blur samples (default: 10) */
  samples?: number;
  /** Shutter angle (0-360, default: 180) */
  shutterAngle?: number;
  /** Enable/disable motion blur */
  enabled?: boolean;
}

/**
 * Configuration for EffectsComposer
 */
export interface EffectsConfig {
  /** Film grain effect settings */
  filmGrain?: FilmGrainProps | boolean;
  /** Light leak effect settings */
  lightLeak?: LightLeakProps | boolean;
  /** Vignette effect settings */
  vignette?: VignetteProps | boolean;
  /** Motion blur settings */
  motionBlur?: MotionBlurWrapperProps | boolean;
}

/**
 * Props for EffectsComposer
 */
export interface EffectsComposerProps {
  /** Content to apply effects to */
  children: React.ReactNode;
  /** Effects configuration */
  effects?: EffectsConfig;
}
