// Animation presets and utilities
export {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  blurIn,
  popIn,
  rotateIn,
  combine,
  getAnimatedStyle,
  DEFAULT_SPRING,
  SPRING_PRESETS,
  // New eased presets
  fadeInEased,
  slideInEased,
  scaleInEased,
  glowIn,
  shadowIn,
  blurOut,
  blurInEffect,
  getEasedAnimatedStyle,
} from "./presets";

export type {
  AnimationConfig,
  AnimationPreset,
  EasedAnimationConfig,
  SlideDirection,
} from "./presets";

// Easing functions
export {
  // Standard easings
  linear,
  easeIn,
  easeOut,
  easeInOut,
  // Cubic
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  // Quartic
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  // Quintic
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  // Sinusoidal
  easeInSine,
  easeOutSine,
  easeInOutSine,
  // Exponential
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  // Circular
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  // Back
  easeInBack,
  easeOutBack,
  easeInOutBack,
  // Bounce
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  // Elastic
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  // Custom bezier
  cubicBezier,
  // Presets
  EASING_PRESETS,
  BEZIER_PRESETS,
} from "./easings";

export type { EasingFunction } from "./easings";

// Color animation utilities
export {
  // Color conversion
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  rgbToHsl,
  hslToRgb,
  // Color interpolation
  interpolateColor,
  interpolateColors,
  // Gradient helpers
  animatedGradientStops,
  rotatingGradient,
  pulsingGradient,
  // Color utilities
  lighten,
  darken,
  saturate,
  desaturate,
  withAlpha,
  mix,
  complement,
  contrastColor,
} from "./colors";

export type { ColorInterpolationMode } from "./colors";

// SVG animation utilities
export {
  // Stroke animations
  calculateStrokeDraw,
  useStrokeDraw, // @deprecated - use calculateStrokeDraw
  getStrokeDrawStyle,
  // Circle/arc animations
  animatedCircle,
  progressRing,
  // Path morphing
  interpolatePath,
  // Filter animations
  useAnimatedBlur,
  animatedGaussianBlur,
  animatedDropShadow,
  // Transform animations
  animatedRotation,
  animatedScale,
  combineTransforms,
} from "./svg";

export type { StrokeDrawResult, CircleAnimationResult } from "./svg";

// Animated components
export {
  AnimatedText,
  AnimatedHeading,
  AnimatedParagraph,
} from "./AnimatedText";

export type {
  AnimatedTextProps,
  AnimatedHeadingProps,
  AnimatedParagraphProps,
  StaggerMode,
} from "./AnimatedText";

// Advanced text animations
export { TypewriterText, calculateTypewriterDuration } from "./TypewriterText";
export type { TypewriterTextProps } from "./TypewriterText";

export { HighlightText } from "./HighlightText";
export type { HighlightTextProps, HighlightType } from "./HighlightText";

export { RevealText } from "./RevealText";
export type { RevealTextProps, RevealMode, RevealDirection } from "./RevealText";

export { GlitchText } from "./GlitchText";
export type { GlitchTextProps, GlitchIntensity } from "./GlitchText";

// Phase 17: Video Strategy System - New Components
export { CaptionText, createCaptionWords, createCaptionWordsFromTranscript } from "./CaptionText";
export type {
  CaptionTextProps,
  CaptionWord,
  CaptionStyle,
  CaptionPosition,
  TranscriptWord,
} from "./CaptionText";

export { CodeBlock, calculateCodeTypingDuration } from "./CodeBlock";
export type {
  CodeBlockProps,
  CodeLanguage,
  CodeAnimation,
  CodeTheme,
} from "./CodeBlock";

// Stroked text for improved readability
export { StrokedText, AnimatedStrokedText, SubtitleText } from "./StrokedText";
export type {
  StrokedTextProps,
  AnimatedStrokedTextProps,
  SubtitleTextProps,
} from "./StrokedText";

// Popping text animation
export { PoppingText, calculatePoppingDuration } from "./PoppingText";
export type { PoppingTextProps } from "./PoppingText";
