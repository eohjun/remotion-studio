import { SpringConfig } from "remotion";
import { EasingFunction } from "./easings";

// Animation preset types
export interface AnimationPreset {
  opacity?: { from: number; to: number };
  translateY?: { from: number; to: number };
  translateX?: { from: number; to: number };
  scale?: { from: number; to: number };
  blur?: { from: number; to: number };
  rotate?: { from: number; to: number };
  /** Box shadow with animated spread */
  boxShadow?: { from: string; to: string };
  /** Glow effect (outer shadow) */
  glow?: { from: string; to: string };
}

export interface AnimationConfig {
  preset: AnimationPreset;
  springConfig?: Partial<SpringConfig>;
}

/** Animation config with custom easing function instead of spring */
export interface EasedAnimationConfig {
  preset: AnimationPreset;
  easing: EasingFunction;
  /** Duration in frames */
  durationInFrames: number;
}

/** Direction for slide animations */
export type SlideDirection = "up" | "down" | "left" | "right";

// Default spring config for smooth animations
export const DEFAULT_SPRING: SpringConfig = {
  damping: 80,
  mass: 0.5,
  stiffness: 200,
  overshootClamping: false,
};

// Spring config presets for different animation feels
export const SPRING_PRESETS = {
  /** Subtle, gentle animation - good for secondary elements */
  subtle: {
    damping: 100,
    mass: 0.8,
    stiffness: 150,
  } as SpringConfig,

  /** Moderate, balanced animation - default for most uses */
  moderate: {
    damping: 80,
    mass: 0.5,
    stiffness: 200,
  } as SpringConfig,

  /** Snappy, quick animation - good for titles and emphasis */
  snappy: {
    damping: 100,
    mass: 0.5,
    stiffness: 300,
  } as SpringConfig,

  /** Energetic animation with some bounce */
  energetic: {
    damping: 60,
    mass: 0.4,
    stiffness: 300,
  } as SpringConfig,

  /** Bouncy animation - good for playful elements */
  bouncy: {
    damping: 50,
    mass: 0.3,
    stiffness: 200,
  } as SpringConfig,

  // === NEW: Enhanced Spring Presets for Professional Motion ===

  /** Gentle - UI elements appearing softly */
  gentle: {
    damping: 200,
    mass: 0.5,
    stiffness: 80,
    overshootClamping: true,
  } as SpringConfig,

  /** Smooth - Elegant, flowing transitions */
  smooth: {
    damping: 25,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
  } as SpringConfig,

  /** Quick - Fast response for micro-interactions */
  quick: {
    damping: 15,
    mass: 0.2,
    stiffness: 400,
    overshootClamping: true,
  } as SpringConfig,

  /** Elastic - Satisfying overshoot for emphasis */
  elastic: {
    damping: 8,
    mass: 0.3,
    stiffness: 180,
    overshootClamping: false,
  } as SpringConfig,

  /** Heavy - Weighty, deliberate movement */
  heavy: {
    damping: 40,
    mass: 2,
    stiffness: 200,
    overshootClamping: false,
  } as SpringConfig,

  /** Crisp - Sharp, precise animations */
  crisp: {
    damping: 30,
    mass: 0.4,
    stiffness: 350,
    overshootClamping: true,
  } as SpringConfig,
} as const;

/** Spring preset name type */
export type SpringPresetName = keyof typeof SPRING_PRESETS;

/**
 * Get spring config by preset name
 */
export const getSpringPreset = (name: SpringPresetName): SpringConfig => {
  return SPRING_PRESETS[name];
};

// =============================================================================
// Stagger Animation Utilities
// =============================================================================

/** Stagger distribution type */
export type StaggerDistribution = "linear" | "ease-out" | "ease-in" | "random" | "center-out";

/**
 * Calculate stagger delay for an item in a sequence
 *
 * @param index - Item index (0-based)
 * @param totalItems - Total number of items
 * @param baseDelayFrames - Base delay between items in frames
 * @param distribution - How delays are distributed
 * @returns Delay in frames for this item
 */
export const calculateStaggerDelay = (
  index: number,
  totalItems: number,
  baseDelayFrames: number = 3,
  distribution: StaggerDistribution = "linear"
): number => {
  if (totalItems <= 1) return 0;

  const normalizedIndex = index / (totalItems - 1);

  switch (distribution) {
    case "ease-out":
      // Items appear faster initially, then slow down
      return Math.pow(normalizedIndex, 0.5) * baseDelayFrames * (totalItems - 1);

    case "ease-in":
      // Items appear slowly initially, then speed up
      return Math.pow(normalizedIndex, 2) * baseDelayFrames * (totalItems - 1);

    case "center-out": {
      // Items appear from center outward
      const centerIndex = (totalItems - 1) / 2;
      const distanceFromCenter = Math.abs(index - centerIndex);
      return distanceFromCenter * baseDelayFrames;
    }

    case "random": {
      // Seeded random based on index for consistency
      const seed = index * 9301 + 49297;
      const random = ((seed % 233280) / 233280);
      return random * baseDelayFrames * (totalItems - 1);
    }

    case "linear":
    default:
      return index * baseDelayFrames;
  }
};

/**
 * Create an array of stagger delays for all items
 *
 * @param totalItems - Total number of items
 * @param baseDelayFrames - Base delay between items in frames
 * @param distribution - How delays are distributed
 * @returns Array of delays in frames
 */
export const createStaggerDelays = (
  totalItems: number,
  baseDelayFrames: number = 3,
  distribution: StaggerDistribution = "linear"
): number[] => {
  return Array.from({ length: totalItems }, (_, i) =>
    calculateStaggerDelay(i, totalItems, baseDelayFrames, distribution)
  );
};

/**
 * Get total duration of staggered animation sequence
 *
 * @param totalItems - Total number of items
 * @param baseDelayFrames - Base delay between items
 * @param itemDurationFrames - Duration of each item's animation
 * @param distribution - Stagger distribution type
 * @returns Total duration in frames
 */
export const getStaggerTotalDuration = (
  totalItems: number,
  baseDelayFrames: number,
  itemDurationFrames: number,
  distribution: StaggerDistribution = "linear"
): number => {
  const delays = createStaggerDelays(totalItems, baseDelayFrames, distribution);
  const maxDelay = Math.max(...delays);
  return maxDelay + itemDurationFrames;
};

// Preset animations
export const fadeIn = (config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const fadeInUp = (distance = 30, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    translateY: { from: distance, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const fadeInDown = (distance = 30, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    translateY: { from: -distance, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const fadeInLeft = (distance = 30, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    translateX: { from: -distance, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const fadeInRight = (distance = 30, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    translateX: { from: distance, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const scaleIn = (from = 0.8, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    scale: { from, to: 1 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const blurIn = (blurAmount = 10, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    blur: { from: blurAmount, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

export const popIn = (config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    scale: { from: 0.5, to: 1 },
  },
  springConfig: { damping: 60, mass: 0.4, stiffness: 300, ...config },
});

export const rotateIn = (degrees = 10, config?: Partial<SpringConfig>): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    rotate: { from: degrees, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

// Combine multiple animation presets
export const combine = (animations: AnimationConfig[]): AnimationConfig => {
  const combinedPreset: AnimationPreset = {};
  let combinedSpringConfig: Partial<SpringConfig> = { ...DEFAULT_SPRING };

  for (const anim of animations) {
    Object.assign(combinedPreset, anim.preset);
    if (anim.springConfig) {
      combinedSpringConfig = { ...combinedSpringConfig, ...anim.springConfig };
    }
  }

  return {
    preset: combinedPreset,
    springConfig: combinedSpringConfig as SpringConfig,
  };
};

// Calculate animated values from preset
export const getAnimatedStyle = (
  progress: number,
  preset: AnimationPreset
): React.CSSProperties => {
  const style: React.CSSProperties = {};
  const transforms: string[] = [];

  if (preset.opacity !== undefined) {
    const { from, to } = preset.opacity;
    style.opacity = from + (to - from) * progress;
  }

  if (preset.translateY !== undefined) {
    const { from, to } = preset.translateY;
    const value = from + (to - from) * progress;
    transforms.push(`translateY(${value}px)`);
  }

  if (preset.translateX !== undefined) {
    const { from, to } = preset.translateX;
    const value = from + (to - from) * progress;
    transforms.push(`translateX(${value}px)`);
  }

  if (preset.scale !== undefined) {
    const { from, to } = preset.scale;
    const value = from + (to - from) * progress;
    transforms.push(`scale(${value})`);
  }

  if (preset.rotate !== undefined) {
    const { from, to } = preset.rotate;
    const value = from + (to - from) * progress;
    transforms.push(`rotate(${value}deg)`);
  }

  if (preset.blur !== undefined) {
    const { from, to } = preset.blur;
    const value = from + (to - from) * progress;
    style.filter = `blur(${value}px)`;
  }

  if (transforms.length > 0) {
    style.transform = transforms.join(" ");
  }

  if (preset.boxShadow !== undefined) {
    const { from, to } = preset.boxShadow;
    // For simple interpolation, we'll just switch at 0.5
    // Complex shadow interpolation would require parsing
    style.boxShadow = progress < 0.5 ? from : to;
  }

  if (preset.glow !== undefined) {
    const { from, to } = preset.glow;
    style.boxShadow = progress < 0.5 ? from : to;
  }

  return style;
};

// =============================================================================
// Easing-based Animation Presets
// =============================================================================

/**
 * Create a fade-in animation with custom easing
 *
 * @param easing - Easing function to apply
 * @param durationInFrames - Animation duration in frames
 */
export const fadeInEased = (
  easing: EasingFunction,
  durationInFrames = 30
): EasedAnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
  },
  easing,
  durationInFrames,
});

/**
 * Create a slide-in animation with custom easing
 *
 * @param direction - Direction to slide from
 * @param easing - Easing function to apply
 * @param distance - Slide distance in pixels
 * @param durationInFrames - Animation duration in frames
 */
export const slideInEased = (
  direction: SlideDirection,
  easing: EasingFunction,
  distance = 50,
  durationInFrames = 30
): EasedAnimationConfig => {
  const preset: AnimationPreset = {
    opacity: { from: 0, to: 1 },
  };

  switch (direction) {
    case "up":
      preset.translateY = { from: distance, to: 0 };
      break;
    case "down":
      preset.translateY = { from: -distance, to: 0 };
      break;
    case "left":
      preset.translateX = { from: distance, to: 0 };
      break;
    case "right":
      preset.translateX = { from: -distance, to: 0 };
      break;
  }

  return {
    preset,
    easing,
    durationInFrames,
  };
};

/**
 * Create a scale-in animation with custom easing
 *
 * @param easing - Easing function to apply
 * @param fromScale - Starting scale (default: 0.8)
 * @param durationInFrames - Animation duration in frames
 */
export const scaleInEased = (
  easing: EasingFunction,
  fromScale = 0.8,
  durationInFrames = 30
): EasedAnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    scale: { from: fromScale, to: 1 },
  },
  easing,
  durationInFrames,
});

// =============================================================================
// Advanced Effect Presets
// =============================================================================

/**
 * Glow-in effect: element appears with an outer glow
 *
 * @param color - Glow color (default: current color with transparency)
 * @param config - Spring configuration
 */
export const glowIn = (
  color = "rgba(100, 150, 255, 0.6)",
  config?: Partial<SpringConfig>
): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    glow: {
      from: `0 0 0 0 transparent`,
      to: `0 0 20px 5px ${color}`,
    },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

/**
 * Shadow-in effect: element appears with a growing shadow
 *
 * @param depth - Shadow depth (default: 1 = subtle, 3 = deep)
 * @param config - Spring configuration
 */
export const shadowIn = (
  depth = 1,
  config?: Partial<SpringConfig>
): AnimationConfig => {
  const shadows: Record<number, { from: string; to: string }> = {
    1: {
      from: "0 0 0 0 rgba(0, 0, 0, 0)",
      to: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
    },
    2: {
      from: "0 0 0 0 rgba(0, 0, 0, 0)",
      to: "0 4px 8px 0 rgba(0, 0, 0, 0.15)",
    },
    3: {
      from: "0 0 0 0 rgba(0, 0, 0, 0)",
      to: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
  };

  const shadowPreset = shadows[Math.min(3, Math.max(1, depth))] || shadows[1];

  return {
    preset: {
      opacity: { from: 0, to: 1 },
      boxShadow: shadowPreset,
    },
    springConfig: { ...DEFAULT_SPRING, ...config },
  };
};

/**
 * Blur-out effect: element fades out while blurring
 *
 * @param blurAmount - Maximum blur in pixels
 * @param config - Spring configuration
 */
export const blurOut = (
  blurAmount = 10,
  config?: Partial<SpringConfig>
): AnimationConfig => ({
  preset: {
    opacity: { from: 1, to: 0 },
    blur: { from: 0, to: blurAmount },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

/**
 * Blur-in effect: element appears from blur
 *
 * @param blurAmount - Starting blur in pixels
 * @param config - Spring configuration
 */
export const blurInEffect = (
  blurAmount = 10,
  config?: Partial<SpringConfig>
): AnimationConfig => ({
  preset: {
    opacity: { from: 0, to: 1 },
    blur: { from: blurAmount, to: 0 },
  },
  springConfig: { ...DEFAULT_SPRING, ...config },
});

// =============================================================================
// Utility: Apply eased animation
// =============================================================================

/**
 * Calculate animated style from eased animation config
 *
 * @param frame - Current frame
 * @param startFrame - Frame when animation starts
 * @param config - Eased animation configuration
 * @returns CSS properties with animated values
 */
export const getEasedAnimatedStyle = (
  frame: number,
  startFrame: number,
  config: EasedAnimationConfig
): React.CSSProperties => {
  const { preset, easing, durationInFrames } = config;

  // Calculate linear progress
  const linearProgress = Math.max(
    0,
    Math.min(1, (frame - startFrame) / durationInFrames)
  );

  // Apply easing
  const easedProgress = easing(linearProgress);

  return getAnimatedStyle(easedProgress, preset);
}
