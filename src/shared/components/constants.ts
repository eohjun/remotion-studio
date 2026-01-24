// Unified constants for Remotion Studio
// This file consolidates shared styling values across all compositions

export const COLORS = {
  // Primary palette
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00c2ff",

  // Neutral palette
  dark: "#1a1a2e",
  darkAlt: "#16213e",
  light: "#f8f9fa",
  white: "#ffffff",

  // Semantic colors
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",

  // Extended palette
  purple: "#9b59b6",
  orange: "#e67e22",
} as const;

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
  dark: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.success} 0%, #20c997 100%)`,
  danger: `linear-gradient(135deg, ${COLORS.danger} 0%, #e74c3c 100%)`,
} as const;

export const FONT_FAMILY = {
  title: "Pretendard, SF Pro Display, -apple-system, sans-serif",
  body: "Pretendard, SF Pro Text, -apple-system, sans-serif",
} as const;

// Typography scale
export const FONT_SIZES = {
  xs: 20,
  sm: 24,
  md: 28,
  lg: 36,
  xl: 48,
  "2xl": 56,
  "3xl": 72,
  "4xl": 80,
} as const;

// Spacing scale
export const SPACING = {
  xs: 10,
  sm: 20,
  md: 40,
  lg: 60,
  xl: 80,
  "2xl": 100,
} as const;

// Layout constants for 1920x1080 video
export const LAYOUT = {
  /** Video dimensions */
  width: 1920,
  height: 1080,

  /** Safe area padding (content should stay within) */
  safeArea: {
    horizontal: 80, // SPACING.xl
    vertical: 60, // SPACING.lg
  },

  /** Maximum content dimensions */
  maxContentWidth: 1760, // 1920 - 80*2
  maxContentHeight: 960, // 1080 - 60*2

  /** Usable content area (after safe padding) */
  contentArea: {
    width: 1760,
    height: 960,
  },

  /** Two-column layout helpers */
  twoColumn: {
    /** 50/50 split */
    equal: { left: "50%", right: "50%" },
    /** 55/45 split (text/visual) */
    textVisual: { left: "55%", right: "45%" },
    /** 60/40 split (primary/secondary) */
    primarySecondary: { left: "60%", right: "40%" },
  },

  /** Maximum heights for common components */
  maxHeights: {
    /** Cycle diagram (with overflow allowance) */
    cycleDiagram: 500,
    /** Comparison cards */
    comparisonCards: 550,
    /** Content section */
    contentSection: 700,
  },
} as const;

// Border radius scale
export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

// Spring config presets
export const SPRING_CONFIGS = {
  snappy: { damping: 100, mass: 0.5, stiffness: 300 },
  normal: { damping: 80, mass: 0.5, stiffness: 200 },
  gentle: { damping: 100, mass: 0.8, stiffness: 150 },
  bouncy: { damping: 60, mass: 0.4, stiffness: 300 },
} as const;

// Text styles for different languages
export const TEXT_STYLES = {
  /** Korean text - prevents character-level line breaks */
  korean: {
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
    lineHeight: 1.4,
  },
  /** Default text style */
  default: {
    lineHeight: 1.5,
  },
} as const;

// Common card background helpers
export const cardBackground = (color: string, opacity = 0.15) =>
  `rgba(${hexToRgb(color)}, ${opacity})`;

// Helper to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
