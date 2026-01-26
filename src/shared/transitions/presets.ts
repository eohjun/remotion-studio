/**
 * Pre-defined transition presets for common use cases
 */
import { SpringConfig } from "remotion";
import { TransitionConfig, TransitionPresetName } from "./types";

/**
 * Spring configuration presets for transitions
 */
export const TRANSITION_SPRING_PRESETS = {
  /** Subtle, smooth transition */
  subtle: {
    damping: 100,
    mass: 0.8,
    stiffness: 150,
  } as SpringConfig,

  /** Standard balanced transition */
  standard: {
    damping: 80,
    mass: 0.5,
    stiffness: 200,
  } as SpringConfig,

  /** Quick, snappy transition */
  snappy: {
    damping: 100,
    mass: 0.5,
    stiffness: 300,
  } as SpringConfig,

  /** Smooth cinematic transition */
  cinematic: {
    damping: 120,
    mass: 1.0,
    stiffness: 100,
  } as SpringConfig,
} as const;

/**
 * Default transition duration in frames (at 30fps = ~0.67s)
 */
export const DEFAULT_TRANSITION_DURATION = 20;

/**
 * Pre-defined transition configurations
 */
export const TRANSITION_PRESETS: Record<TransitionPresetName, TransitionConfig> = {
  // Fade transitions
  fade: {
    type: "fade",
    durationInFrames: DEFAULT_TRANSITION_DURATION,
    springConfig: TRANSITION_SPRING_PRESETS.subtle,
  },
  fadeQuick: {
    type: "fade",
    durationInFrames: 12,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },
  fadeSlow: {
    type: "fade",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.cinematic,
  },

  // Slide transitions
  slideLeft: {
    type: "slide",
    direction: "from-right",
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },
  slideRight: {
    type: "slide",
    direction: "from-left",
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },
  slideUp: {
    type: "slide",
    direction: "from-bottom",
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },
  slideDown: {
    type: "slide",
    direction: "from-top",
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },

  // Wipe transitions
  wipeLeft: {
    type: "wipe",
    direction: "from-right",
    durationInFrames: 25,
  },
  wipeRight: {
    type: "wipe",
    direction: "from-left",
    durationInFrames: 25,
  },
  wipeUp: {
    type: "wipe",
    direction: "from-bottom",
    durationInFrames: 25,
  },
  wipeDown: {
    type: "wipe",
    direction: "from-top",
    durationInFrames: 25,
  },

  // Flip transitions
  flipHorizontal: {
    type: "flip",
    direction: "from-left",
    durationInFrames: 30,
    perspective: 1000,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },
  flipVertical: {
    type: "flip",
    direction: "from-top",
    durationInFrames: 30,
    perspective: 1000,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },

  // Clock wipe
  clockWipe: {
    type: "clockWipe",
    durationInFrames: 30,
  },

  // Custom transitions
  dissolve: {
    type: "dissolve",
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.cinematic,
  },
  dissolveQuick: {
    type: "dissolve",
    durationInFrames: 15,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },
  zoomIn: {
    type: "zoom",
    direction: "from-left", // zoom direction indicator
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },
  zoomOut: {
    type: "zoom",
    direction: "from-right", // zoom out indicator
    durationInFrames: 25,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },

  // Morph transitions
  morph: {
    type: "morph",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.cinematic,
  },
  morphLeft: {
    type: "morph",
    direction: "from-left",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },
  morphRight: {
    type: "morph",
    direction: "from-right",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },

  // Glitch transitions
  glitch: {
    type: "glitch",
    durationInFrames: 20,
    springConfig: TRANSITION_SPRING_PRESETS.snappy,
  },
  glitchIntense: {
    type: "glitch",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },

  // Blinds transitions
  blindsHorizontal: {
    type: "blinds",
    direction: "from-top",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },
  blindsVertical: {
    type: "blinds",
    direction: "from-left",
    durationInFrames: 30,
    springConfig: TRANSITION_SPRING_PRESETS.standard,
  },

  // Ripple transitions
  ripple: {
    type: "ripple",
    durationInFrames: 35,
    springConfig: TRANSITION_SPRING_PRESETS.cinematic,
  },
  rippleCorner: {
    type: "ripple",
    direction: "from-bottom", // indicator for corner origin
    durationInFrames: 40,
    springConfig: TRANSITION_SPRING_PRESETS.cinematic,
  },

  // Hard cut (no transition)
  cut: {
    type: "none",
    durationInFrames: 0,
  },
} as const;

/**
 * Get a preset by name with optional overrides
 */
export const getPreset = (
  name: TransitionPresetName,
  overrides?: Partial<TransitionConfig>
): TransitionConfig => {
  return {
    ...TRANSITION_PRESETS[name],
    ...overrides,
  };
};

/**
 * Create a custom transition config
 */
export const createTransition = (config: TransitionConfig): TransitionConfig => {
  return {
    durationInFrames: DEFAULT_TRANSITION_DURATION,
    ...config,
  };
};
