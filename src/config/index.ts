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
