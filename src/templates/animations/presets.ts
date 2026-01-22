import { SpringConfig } from "remotion";

// Animation preset types
export interface AnimationPreset {
  opacity?: { from: number; to: number };
  translateY?: { from: number; to: number };
  translateX?: { from: number; to: number };
  scale?: { from: number; to: number };
  blur?: { from: number; to: number };
  rotate?: { from: number; to: number };
}

export interface AnimationConfig {
  preset: AnimationPreset;
  springConfig?: Partial<SpringConfig>;
}

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
} as const;

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

  return style;
};
