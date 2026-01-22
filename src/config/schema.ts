import { z } from "zod";

/**
 * Zod schemas for video composition configuration
 * Enables type-safe dynamic composition generation from JSON configs
 */

// =============================================================================
// BASE SCHEMAS
// =============================================================================

/** Color definition - hex or named color */
export const ColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$|^[a-z]+$/i);

/** Animation config */
export const AnimationConfigSchema = z.object({
  delay: z.number().default(0),
  staggerDuration: z.number().default(3),
  springType: z.enum(["subtle", "moderate", "snappy", "energetic", "bouncy"]).default("moderate"),
});

// =============================================================================
// SCENE CONTENT SCHEMAS
// =============================================================================

/** Styled text item for lists */
export const StyledTextSchema = z.object({
  text: z.string(),
  color: ColorSchema.optional(),
  highlight: z.boolean().optional(),
  fontWeight: z.number().optional(),
});

/** Icon item for lists */
export const IconItemSchema = z.object({
  icon: z.string(),
  text: z.string(),
  subtext: z.string().optional(),
  color: ColorSchema.optional(),
});

/** Card data for comparison layouts */
export const CardDataSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  items: z.array(StyledTextSchema),
  color: ColorSchema,
  backgroundColor: z.string().optional(),
});

// =============================================================================
// SCENE SCHEMAS
// =============================================================================

/** Base scene props */
const BaseSceneSchema = z.object({
  id: z.string(),
  type: z.string(),
  durationInFrames: z.number().optional(),
  durationInSeconds: z.number().optional(),
  audioFile: z.string().optional(),
});

/** Intro scene */
export const IntroSceneSchema = BaseSceneSchema.extend({
  type: z.literal("intro"),
  preTitle: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  background: z.string().default("primary"),
  titleSize: z.union([z.string(), z.number()]).optional(),
  subtitleSize: z.union([z.string(), z.number()]).optional(),
});

/** Content scene */
export const ContentSceneSchema = BaseSceneSchema.extend({
  type: z.literal("content"),
  sectionLabel: z.string().optional(),
  sectionLabelColor: ColorSchema.optional(),
  title: z.string(),
  titleIcon: z.string().optional(),
  content: z.array(z.string()).optional(),
  items: z.array(IconItemSchema).optional(),
  backgroundColor: ColorSchema.optional(),
  highlightContent: z.string().optional(),
  highlightIcon: z.string().optional(),
});

/** Comparison scene */
export const ComparisonSceneSchema = BaseSceneSchema.extend({
  type: z.literal("comparison"),
  sectionLabel: z.string().optional(),
  sectionLabelColor: ColorSchema.optional(),
  heading: z.string(),
  leftCard: CardDataSchema,
  rightCard: CardDataSchema,
  separator: z.string().default("VS"),
  backgroundColor: ColorSchema.optional(),
});

/** Quote scene */
export const QuoteSceneSchema = BaseSceneSchema.extend({
  type: z.literal("quote"),
  quote: z.string(),
  attribution: z.string().optional(),
  icon: z.string().optional(),
  background: z.string().default("primary"),
  showQuoteMarks: z.boolean().default(false),
  context: z.string().optional(),
});

/** Outro scene */
export const OutroSceneSchema = BaseSceneSchema.extend({
  type: z.literal("outro"),
  title: z.string(),
  titleIcon: z.string().optional(),
  takeaways: z.array(IconItemSchema).optional(),
  closingMessage: z.string(),
  closingIcon: z.string().optional(),
  background: z.string().default("primary"),
});

/** Union of all scene types */
export const SceneSchema = z.discriminatedUnion("type", [
  IntroSceneSchema,
  ContentSceneSchema,
  ComparisonSceneSchema,
  QuoteSceneSchema,
  OutroSceneSchema,
]);

// =============================================================================
// COMPOSITION SCHEMA
// =============================================================================

/** Video composition configuration */
export const CompositionConfigSchema = z.object({
  /** Unique composition ID */
  id: z.string(),
  /** Display name */
  name: z.string(),
  /** Video dimensions */
  width: z.number().default(1920),
  height: z.number().default(1080),
  /** Frames per second */
  fps: z.number().default(30),
  /** Scenes in order */
  scenes: z.array(SceneSchema),
  /** Global audio file (optional) */
  audioFile: z.string().optional(),
  /** Default scene transition duration */
  transitionDuration: z.number().default(15),
  /** Buffer frames between scenes */
  sceneBuffer: z.number().default(15),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type StyledText = z.infer<typeof StyledTextSchema>;
export type IconItem = z.infer<typeof IconItemSchema>;
export type CardData = z.infer<typeof CardDataSchema>;
export type IntroScene = z.infer<typeof IntroSceneSchema>;
export type ContentScene = z.infer<typeof ContentSceneSchema>;
export type ComparisonScene = z.infer<typeof ComparisonSceneSchema>;
export type QuoteScene = z.infer<typeof QuoteSceneSchema>;
export type OutroScene = z.infer<typeof OutroSceneSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type CompositionConfig = z.infer<typeof CompositionConfigSchema>;
