/**
 * Video Registry - Centralized video composition configuration
 *
 * This file serves as the single source of truth for all video compositions.
 * When adding a new video, simply add an entry to the VIDEO_REGISTRY array.
 *
 * Benefits:
 * - Reduces boilerplate in Root.tsx
 * - Standardizes video configuration
 * - Makes it easy to add/remove videos
 * - Type-safe video definitions
 */

import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Standard schema for most videos
export const standardVideoSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

export type StandardVideoProps = z.infer<typeof standardVideoSchema>;

// Video configuration type
export interface VideoConfig {
  /** Unique ID for the composition (used for rendering: npx remotion render <id>) */
  id: string;
  /** React component that renders the video */
  component: React.ComponentType<StandardVideoProps>;
  /** Zod schema for props validation */
  schema: z.ZodObject<{
    primaryColor: z.ZodType<string>;
    secondaryColor: z.ZodType<string>;
  }>;
  /** Total duration in frames */
  durationInFrames: number;
  /** Default props for the composition */
  defaultProps: StandardVideoProps;
  /** FPS (default: 30) */
  fps?: number;
  /** Width (default: 1920) */
  width?: number;
  /** Height (default: 1080) */
  height?: number;
}

// Import all videos
import {
  SelfHelpCritiqueFull,
  selfHelpCritiqueFullSchema,
  TOTAL_DURATION as TOTAL_DURATION_FULL,
} from "./SelfHelpCritiqueFull";

import {
  MindfulnessPhenomenology,
  mindfulnessPhenomenologySchema,
  TOTAL_DURATION as TOTAL_DURATION_MINDFULNESS,
} from "./MindfulnessPhenomenology";

import {
  OpenAICrisis,
  openAICrisisSchema,
  TOTAL_DURATION as TOTAL_DURATION_OPENAI,
} from "./OpenAICrisis";

import {
  AIBasicLawKR,
  aiBasicLawKRSchema,
  TOTAL_DURATION as TOTAL_DURATION_AILAW,
} from "./AIBasicLawKR";

import {
  ProcrastinationPsychology,
  procrastinationPsychologySchema,
  TOTAL_DURATION as TOTAL_DURATION_PROCRASTINATION,
} from "./ProcrastinationPsychology";

/**
 * Video Registry - Add new videos here
 *
 * Each entry automatically creates a <Composition> in Root.tsx
 */
export const VIDEO_REGISTRY: VideoConfig[] = [
  {
    id: "SelfHelpCritiqueFull",
    component: SelfHelpCritiqueFull,
    schema: selfHelpCritiqueFullSchema,
    durationInFrames: TOTAL_DURATION_FULL,
    defaultProps: {
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
    },
  },
  {
    id: "MindfulnessPhenomenology",
    component: MindfulnessPhenomenology,
    schema: mindfulnessPhenomenologySchema,
    durationInFrames: TOTAL_DURATION_MINDFULNESS,
    defaultProps: {
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
    },
  },
  {
    id: "OpenAICrisis",
    component: OpenAICrisis,
    schema: openAICrisisSchema,
    durationInFrames: TOTAL_DURATION_OPENAI,
    defaultProps: {
      primaryColor: "#dc3545",
      secondaryColor: "#1a1a2e",
    },
  },
  {
    id: "AIBasicLawKR",
    component: AIBasicLawKR,
    schema: aiBasicLawKRSchema,
    durationInFrames: TOTAL_DURATION_AILAW,
    defaultProps: {
      primaryColor: "#667eea",
      secondaryColor: "#1a1a2e",
    },
  },
  {
    id: "ProcrastinationPsychology",
    component: ProcrastinationPsychology,
    schema: procrastinationPsychologySchema,
    durationInFrames: TOTAL_DURATION_PROCRASTINATION,
    defaultProps: {
      primaryColor: "#1a1a2e",
      secondaryColor: "#e94560",
    },
  },
];

/**
 * Get a video configuration by ID
 */
export const getVideoConfig = (id: string): VideoConfig | undefined => {
  return VIDEO_REGISTRY.find((video) => video.id === id);
};

/**
 * Get all video IDs
 */
export const getVideoIds = (): string[] => {
  return VIDEO_REGISTRY.map((video) => video.id);
};
