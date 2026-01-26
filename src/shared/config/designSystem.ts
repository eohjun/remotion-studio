/**
 * Design System Configuration
 *
 * Typography, colors, spacing, and visual standards for consistent video production.
 * All sizes are optimized for 1080p base resolution.
 */

// ============================================
// Typography
// ============================================

export interface TypographyStyle {
  size: number;
  weight: number;
  lineHeight?: number;
  letterSpacing?: number;
}

/**
 * Typography scale for different text hierarchies
 */
export const TYPOGRAPHY: Record<string, TypographyStyle> = {
  /** Main titles, headlines */
  title: {
    size: 56,
    weight: 800,
    lineHeight: 1.1,
    letterSpacing: -1,
  },
  /** Section headers, scene titles */
  subtitle: {
    size: 36,
    weight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  /** Main content text */
  body: {
    size: 28,
    weight: 500,
    lineHeight: 1.5,
  },
  /** Smaller supporting text */
  caption: {
    size: 20,
    weight: 400,
    lineHeight: 1.4,
  },
  /** Labels, metadata */
  label: {
    size: 16,
    weight: 600,
    lineHeight: 1.2,
    letterSpacing: 0.5,
  },
  /** Hero/splash text */
  hero: {
    size: 72,
    weight: 900,
    lineHeight: 1.0,
    letterSpacing: -2,
  },
  /** Quote text */
  quote: {
    size: 32,
    weight: 500,
    lineHeight: 1.6,
    letterSpacing: 0.2,
  },
} as const;

/**
 * Minimum readable font size (WCAG compliance)
 */
export const MIN_READABLE_SIZE = 24;

/**
 * Maximum recommended font sizes per viewport
 */
export const MAX_FONT_SIZES = {
  landscape: 72,
  portrait: 56,
  square: 56,
} as const;

// ============================================
// Color Palettes
// ============================================

export interface ColorPalette {
  /** Primary brand/accent color */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Background color */
  background: string;
  /** Main text color */
  text: string;
  /** Muted/secondary text */
  textMuted: string;
  /** Accent highlight */
  accent: string;
  /** Success/positive */
  success?: string;
  /** Warning */
  warning?: string;
  /** Error/negative */
  error?: string;
}

/**
 * Curated color palettes for different video themes
 */
export const COLOR_PALETTES: Record<string, ColorPalette> = {
  /** Philosophical, reflective content */
  philosophical: {
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#1a1a2e",
    text: "#ffffff",
    textMuted: "#a0a0b0",
    accent: "#f093fb",
  },
  /** Data-driven, analytical content */
  datadriven: {
    primary: "#00c2ff",
    secondary: "#667eea",
    background: "#16213e",
    text: "#ffffff",
    textMuted: "#8b9dc3",
    accent: "#00ff88",
  },
  /** Narrative, storytelling content */
  narrative: {
    primary: "#ff6b6b",
    secondary: "#4ecdc4",
    background: "#2d1b4e",
    text: "#ffffff",
    textMuted: "#b8a9c9",
    accent: "#ffe66d",
  },
  /** Professional, corporate content */
  professional: {
    primary: "#3498db",
    secondary: "#2c3e50",
    background: "#1a252f",
    text: "#ecf0f1",
    textMuted: "#95a5a6",
    accent: "#e74c3c",
  },
  /** Warm, inspiring content */
  warm: {
    primary: "#ff7e5f",
    secondary: "#feb47b",
    background: "#2d2438",
    text: "#ffffff",
    textMuted: "#c4b8d4",
    accent: "#ffe66d",
  },
  /** Cool, calming content */
  calm: {
    primary: "#56ccf2",
    secondary: "#2f80ed",
    background: "#1f2937",
    text: "#f3f4f6",
    textMuted: "#9ca3af",
    accent: "#10b981",
  },
  /** Dark tech/modern */
  tech: {
    primary: "#00ff88",
    secondary: "#0077ff",
    background: "#0a0a0f",
    text: "#ffffff",
    textMuted: "#6b7280",
    accent: "#ff00ff",
  },
  /** Light, clean */
  light: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    background: "#ffffff",
    text: "#1f2937",
    textMuted: "#6b7280",
    accent: "#f59e0b",
  },
} as const;

export type PaletteKey = keyof typeof COLOR_PALETTES;

/**
 * Get color palette by key
 */
export function getPalette(key: PaletteKey): ColorPalette {
  return COLOR_PALETTES[key] || COLOR_PALETTES.philosophical;
}

// ============================================
// Spacing
// ============================================

/**
 * Spacing scale (in pixels, based on 8px grid)
 */
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
  xxxl: 96,
} as const;

/**
 * Padding presets for containers
 */
export const PADDING = {
  /** Tight padding for compact layouts */
  tight: {
    x: SPACING.md,
    y: SPACING.sm,
  },
  /** Normal padding for standard content */
  normal: {
    x: SPACING.xl,
    y: SPACING.lg,
  },
  /** Loose padding for spacious layouts */
  loose: {
    x: SPACING.xxl,
    y: SPACING.xl,
  },
} as const;

// ============================================
// Animation & Motion
// ============================================

/**
 * Animation duration presets (in frames at 30fps)
 */
export const ANIMATION_DURATION = {
  instant: 5,
  fast: 10,
  normal: 15,
  slow: 25,
  verySlow: 40,
} as const;

/**
 * Spring animation presets
 */
export const SPRING_PRESETS = {
  /** Snappy, responsive feel */
  snappy: {
    damping: 15,
    mass: 0.5,
    stiffness: 200,
  },
  /** Smooth, gentle feel */
  smooth: {
    damping: 20,
    mass: 1,
    stiffness: 100,
  },
  /** Bouncy, playful feel */
  bouncy: {
    damping: 10,
    mass: 0.8,
    stiffness: 150,
  },
  /** Heavy, dramatic feel */
  heavy: {
    damping: 25,
    mass: 1.5,
    stiffness: 80,
  },
} as const;

// ============================================
// Visual Effects
// ============================================

/**
 * Box shadow presets
 */
export const SHADOWS = {
  sm: "0 2px 4px rgba(0, 0, 0, 0.2)",
  md: "0 4px 8px rgba(0, 0, 0, 0.25)",
  lg: "0 8px 16px rgba(0, 0, 0, 0.3)",
  xl: "0 16px 32px rgba(0, 0, 0, 0.35)",
  glow: (color: string) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
} as const;

/**
 * Border radius presets
 */
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ============================================
// Accessibility
// ============================================

/**
 * WCAG AA minimum contrast ratio for normal text
 */
export const MIN_CONTRAST_RATIO = 4.5;

/**
 * WCAG AA minimum contrast ratio for large text
 */
export const MIN_CONTRAST_RATIO_LARGE = 3;

/**
 * Calculate relative luminance of a hex color
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text color has sufficient contrast against background
 */
export function hasAccessibleContrast(
  textColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const minRatio = isLargeText ? MIN_CONTRAST_RATIO_LARGE : MIN_CONTRAST_RATIO;
  return ratio >= minRatio;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((c) => {
        const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Add alpha to hex color
 */
export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Lighten a color by percentage
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return rgbToHex(
    rgb.r + (255 - rgb.r) * (percent / 100),
    rgb.g + (255 - rgb.g) * (percent / 100),
    rgb.b + (255 - rgb.b) * (percent / 100)
  );
}

/**
 * Darken a color by percentage
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return rgbToHex(
    rgb.r * (1 - percent / 100),
    rgb.g * (1 - percent / 100),
    rgb.b * (1 - percent / 100)
  );
}

/**
 * Validate design system compliance
 */
export interface DesignValidation {
  valid: boolean;
  issues: string[];
}

export function validateDesign(config: {
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
}): DesignValidation {
  const issues: string[] = [];

  if (config.fontSize && config.fontSize < MIN_READABLE_SIZE) {
    issues.push(`Font size ${config.fontSize}px is below minimum readable size (${MIN_READABLE_SIZE}px)`);
  }

  if (config.textColor && config.backgroundColor) {
    if (!hasAccessibleContrast(config.textColor, config.backgroundColor)) {
      const ratio = getContrastRatio(config.textColor, config.backgroundColor);
      issues.push(`Insufficient contrast ratio: ${ratio.toFixed(2)} (minimum ${MIN_CONTRAST_RATIO})`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
