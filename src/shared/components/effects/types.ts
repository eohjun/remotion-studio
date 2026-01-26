import React from "react";

/**
 * Props for CameraMotionBlur effect
 */
export interface CameraMotionBlurProps {
  /** Content to apply motion blur to */
  children: React.ReactNode;
  /** Shutter angle in degrees (0-360, default: 180) */
  shutterAngle?: number;
  /** Number of samples for blur quality (default: 10) */
  samples?: number;
  /** Enable/disable the effect */
  enabled?: boolean;
}

/**
 * Chromatic aberration direction types
 */
export type ChromaticAberrationDirection =
  | "radial"
  | "horizontal"
  | "vertical"
  | "diagonal";

/**
 * Props for ChromaticAberration effect
 */
export interface ChromaticAberrationProps {
  /** Content to apply effect to */
  children: React.ReactNode;
  /** Intensity of the effect (0-1, default: 0.3) */
  intensity?: number;
  /** Direction of the aberration */
  direction?: ChromaticAberrationDirection;
  /** Custom X offset */
  offsetX?: number;
  /** Custom Y offset */
  offsetY?: number;
  /** Enable animation */
  animated?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
}

/**
 * Glitch intensity presets
 */
export type GlitchIntensity = "subtle" | "medium" | "intense";

/**
 * Props for GlitchEffect
 */
export interface GlitchEffectProps {
  /** Content to apply effect to */
  children: React.ReactNode;
  /** Intensity preset or value (0-1) */
  intensity?: GlitchIntensity | number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Random seed for deterministic glitches */
  seed?: number;
  /** Show scanline overlay (default: true) */
  showScanlines?: boolean;
  /** Enable RGB color shift (default: true) */
  colorShift?: boolean;
  /** Enable slice displacement (default: true) */
  sliceDisplacement?: boolean;
}

/**
 * Color grading preset types
 */
export type ColorGradingPreset =
  | "cinematic"
  | "vintage"
  | "cold"
  | "warm"
  | "noir"
  | "teal-orange"
  | "moody"
  | "vibrant"
  | "faded"
  | "dramatic";

/**
 * Custom color grading settings
 */
export interface CustomColorGrading {
  /** Brightness adjustment (1 = normal) */
  brightness?: number;
  /** Contrast adjustment (1 = normal) */
  contrast?: number;
  /** Saturation adjustment (1 = normal) */
  saturation?: number;
  /** Hue rotation in degrees */
  hueRotate?: number;
  /** Sepia effect (0-1) */
  sepia?: number;
  /** Grayscale effect (0-1) */
  grayscale?: number;
}

/**
 * Props for ColorGrading effect
 */
export interface ColorGradingProps {
  /** Content to apply grading to */
  children: React.ReactNode;
  /** Preset color grade */
  preset?: ColorGradingPreset;
  /** Intensity of the effect (0-1, default: 1) */
  intensity?: number;
  /** Custom color grading settings (overrides preset) */
  custom?: CustomColorGrading;
}

/**
 * Blend mode options for Bloom
 */
export type BloomBlendMode = "screen" | "lighten" | "overlay" | "color-dodge";

/**
 * Props for Bloom effect
 */
export interface BloomProps {
  /** Content to apply bloom to */
  children: React.ReactNode;
  /** Intensity of the glow (0-1, default: 0.5) */
  intensity?: number;
  /** Blur radius in pixels (default: 15) */
  radius?: number;
  /** Brightness threshold for bloom (0-1, default: 0.7) */
  threshold?: number;
  /** Optional color tint for the glow */
  color?: string;
  /** Blend mode for the glow layer */
  blendMode?: BloomBlendMode;
}

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
 * Configuration types (without children requirement)
 * Used for effect configuration in presets and EffectsComposer
 */
export type CameraMotionBlurConfig = Omit<CameraMotionBlurProps, "children">;
export type ChromaticAberrationConfig = Omit<ChromaticAberrationProps, "children">;
export type GlitchEffectConfig = Omit<GlitchEffectProps, "children">;
export type ColorGradingConfig = Omit<ColorGradingProps, "children">;
export type BloomConfig = Omit<BloomProps, "children">;
export type MotionBlurConfig = Omit<MotionBlurWrapperProps, "children">;

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
  /** Motion blur settings (Trail-based) */
  motionBlur?: MotionBlurConfig | boolean;
  /** Camera motion blur settings (more accurate) */
  cameraMotionBlur?: CameraMotionBlurConfig | boolean;
  /** Chromatic aberration effect */
  chromaticAberration?: ChromaticAberrationConfig | boolean;
  /** Glitch effect */
  glitch?: GlitchEffectConfig | boolean;
  /** Color grading effect */
  colorGrading?: ColorGradingConfig | boolean;
  /** Bloom/glow effect */
  bloom?: BloomConfig | boolean;
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
