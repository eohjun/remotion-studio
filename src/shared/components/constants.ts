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

// Common card background helpers
export const cardBackground = (color: string, opacity = 0.15) =>
  `rgba(${hexToRgb(color)}, ${opacity})`;

// Helper to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
