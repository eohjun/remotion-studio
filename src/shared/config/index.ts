// Config module barrel export

// Schemas
export {
  CompositionConfigSchema,
  SceneSchema,
  IntroSceneSchema,
  ContentSceneSchema,
  ComparisonSceneSchema,
  QuoteSceneSchema,
  OutroSceneSchema,
  StyledTextSchema,
  IconItemSchema,
  CardDataSchema,
} from "./schema";

export type {
  CompositionConfig,
  Scene,
  IntroScene,
  ContentScene,
  ComparisonScene,
  QuoteScene,
  OutroScene,
  StyledText,
  IconItem,
  CardData,
} from "./schema";

// Timing
export {
  calculateCompositionTiming,
  calculateCompositionTimingSync,
  getSceneDuration,
  generateScenesConstant,
  DEFAULT_SCENE_DURATIONS,
} from "./timing";

export type { SceneTiming, CompositionTiming } from "./timing";

// Validation
export {
  validateConfig,
  parseConfig,
  validateSceneOrder,
  fullValidation,
} from "./validate";

export type { ValidationResult, ValidationError } from "./validate";

// Video Formats
export {
  VIDEO_FORMATS,
  FORMAT_PRESETS,
  getFormat,
  getFormatByRatio,
  detectFormat,
  scaleDimensions,
  getSafeZone,
  getResponsiveFontSize,
  isWithinSafeZone,
} from "./formats";

export type { VideoFormat, AspectRatio, FormatKey } from "./formats";

// Design System
export {
  TYPOGRAPHY,
  MIN_READABLE_SIZE,
  MAX_FONT_SIZES,
  COLOR_PALETTES,
  getPalette,
  SPACING,
  PADDING,
  ANIMATION_DURATION,
  SPRING_PRESETS,
  SHADOWS,
  BORDER_RADIUS,
  MIN_CONTRAST_RATIO,
  getContrastRatio,
  hasAccessibleContrast,
  hexToRgb,
  rgbToHex,
  withAlpha,
  lighten,
  darken,
  validateDesign,
} from "./designSystem";

export type {
  TypographyStyle,
  ColorPalette,
  PaletteKey,
  DesignValidation,
} from "./designSystem";
