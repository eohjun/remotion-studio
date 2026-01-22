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
} from "./presets";

export type { AnimationConfig, AnimationPreset } from "./presets";

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
