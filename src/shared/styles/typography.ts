/**
 * Typography Standards for 1920x1080 Video
 *
 * These are MINIMUM recommended font sizes for readable video content.
 * Fonts smaller than these will appear too small on most screens.
 */

export const TYPOGRAPHY = {
  // Hero/Title text - main headlines, video titles
  hero: {
    fontSize: 72,
    fontWeight: 800,
    lineHeight: 1.2,
  },

  // H1 - Scene titles, main section headers
  h1: {
    fontSize: 64,
    fontWeight: 700,
    lineHeight: 1.3,
  },

  // H2 - Subtitles, secondary headers
  h2: {
    fontSize: 52,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // H3 - Step labels, category headers
  h3: {
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // Body Large - Main content text
  bodyLarge: {
    fontSize: 36,
    fontWeight: 400,
    lineHeight: 1.6,
  },

  // Body - Standard content text
  body: {
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.6,
  },

  // Body Small - Supporting text, captions
  bodySmall: {
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 1.5,
  },

  // Label - Tags, badges, step indicators
  label: {
    fontSize: 26,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // Caption - Minimum readable size, use sparingly
  caption: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.4,
  },
} as const;

/**
 * Step indicator sizes for numbered steps (1, 2, 3, 4...)
 */
export const STEP_INDICATOR = {
  // Large step circles (main step displays)
  large: {
    circleSize: 100,
    fontSize: 52,
    fontWeight: 800,
  },

  // Medium step circles (recap, summaries)
  medium: {
    circleSize: 80,
    fontSize: 44,
    fontWeight: 800,
  },

  // Small step circles (inline references)
  small: {
    circleSize: 60,
    fontSize: 36,
    fontWeight: 700,
  },
} as const;

/**
 * Spacing recommendations for text elements
 */
export const TEXT_SPACING = {
  // Space after hero titles
  afterHero: 40,

  // Space after section titles
  afterTitle: 32,

  // Space after paragraphs
  afterParagraph: 24,

  // Space between list items
  listGap: 20,

  // Padding for text containers
  containerPadding: {
    horizontal: 80,
    vertical: 60,
  },
} as const;

/**
 * Quick reference for common text styles
 */
export const TEXT_STYLES = {
  // Main video title
  videoTitle: {
    ...TYPOGRAPHY.hero,
    letterSpacing: 2,
  },

  // Scene title (e.g., "포착하기")
  sceneTitle: TYPOGRAPHY.h1,

  // Step label (e.g., "CAPTURE", "PROTOTYPE")
  stepLabel: {
    ...TYPOGRAPHY.h3,
    textTransform: "uppercase" as const,
    letterSpacing: 3,
  },

  // Main explanation text
  explanation: TYPOGRAPHY.bodyLarge,

  // Supporting/secondary text
  supporting: TYPOGRAPHY.body,

  // Accent callouts
  callout: {
    ...TYPOGRAPHY.body,
    fontWeight: 600,
  },

  // Tags and badges
  tag: {
    ...TYPOGRAPHY.label,
    padding: "14px 28px",
    borderRadius: 24,
  },
} as const;

export type TypographyKey = keyof typeof TYPOGRAPHY;
export type StepIndicatorSize = keyof typeof STEP_INDICATOR;
