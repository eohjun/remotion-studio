/**
 * Theme System for Remotion Compositions
 *
 * Provides consistent color schemes and design tokens
 * for video compositions.
 */

/**
 * Color palette for a theme
 */
export interface ThemeColors {
  /** Primary brand color */
  primary: string;
  /** Secondary/accent color */
  secondary: string;
  /** Background color */
  background: string;
  /** Surface color (cards, panels) */
  surface: string;
  /** Primary text color */
  text: string;
  /** Secondary/muted text color */
  textMuted: string;
  /** Success/positive color */
  success: string;
  /** Warning color */
  warning: string;
  /** Error/danger color */
  error: string;
  /** Accent/highlight color */
  accent: string;
  /** Border color */
  border: string;
}

/**
 * Typography settings for a theme
 */
export interface ThemeTypography {
  /** Primary font family */
  fontFamily: string;
  /** Heading font family (optional, defaults to fontFamily) */
  headingFamily?: string;
  /** Monospace font family for code */
  monoFamily: string;
  /** Base font size in pixels */
  baseFontSize: number;
  /** Line height multiplier */
  lineHeight: number;
  /** Font weights */
  fontWeights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

/**
 * Spacing scale for a theme
 */
export interface ThemeSpacing {
  /** Extra small spacing */
  xs: number;
  /** Small spacing */
  sm: number;
  /** Medium spacing */
  md: number;
  /** Large spacing */
  lg: number;
  /** Extra large spacing */
  xl: number;
  /** 2x extra large spacing */
  xxl: number;
}

/**
 * Complete theme definition
 */
export interface Theme {
  /** Theme name */
  name: string;
  /** Theme mode (light/dark) */
  mode: "light" | "dark";
  /** Color palette */
  colors: ThemeColors;
  /** Typography settings */
  typography: ThemeTypography;
  /** Spacing scale */
  spacing: ThemeSpacing;
  /** Border radius values */
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  /** Shadow definitions */
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

/**
 * Default typography settings
 */
const DEFAULT_TYPOGRAPHY: ThemeTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headingFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  monoFamily: "'JetBrains Mono', 'Fira Code', monospace",
  baseFontSize: 16,
  lineHeight: 1.5,
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Default spacing scale (in pixels)
 */
const DEFAULT_SPACING: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Pre-defined themes
 */
export const THEMES: Record<string, Theme> = {
  // === Default Dark Theme ===
  default: {
    name: "Default Dark",
    mode: "dark",
    colors: {
      primary: "#6366F1",
      secondary: "#8B5CF6",
      background: "#0A0A0F",
      surface: "#1A1A2E",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      accent: "#06B6D4",
      border: "#334155",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
      md: "0 4px 6px rgba(0, 0, 0, 0.5)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
    },
  },

  // === Light Theme ===
  light: {
    name: "Light",
    mode: "light",
    colors: {
      primary: "#4F46E5",
      secondary: "#7C3AED",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#0F172A",
      textMuted: "#64748B",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
      accent: "#0891B2",
      border: "#E2E8F0",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    },
  },

  // === Midnight Theme ===
  midnight: {
    name: "Midnight",
    mode: "dark",
    colors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      background: "#020617",
      surface: "#0F172A",
      text: "#F1F5F9",
      textMuted: "#64748B",
      success: "#22C55E",
      warning: "#EAB308",
      error: "#F43F5E",
      accent: "#14B8A6",
      border: "#1E293B",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 1px 3px rgba(0, 0, 0, 0.8)",
      md: "0 4px 8px rgba(0, 0, 0, 0.8)",
      lg: "0 10px 20px rgba(0, 0, 0, 0.8)",
    },
  },

  // === Sunset Theme (Warm) ===
  sunset: {
    name: "Sunset",
    mode: "dark",
    colors: {
      primary: "#F97316",
      secondary: "#FB923C",
      background: "#1C1917",
      surface: "#292524",
      text: "#FEF3C7",
      textMuted: "#A8A29E",
      success: "#84CC16",
      warning: "#FBBF24",
      error: "#EF4444",
      accent: "#F43F5E",
      border: "#44403C",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
      md: "0 4px 6px rgba(0, 0, 0, 0.5)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
    },
  },

  // === Ocean Theme (Cool) ===
  ocean: {
    name: "Ocean",
    mode: "dark",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4",
      background: "#0C1222",
      surface: "#162032",
      text: "#E0F2FE",
      textMuted: "#7DD3FC",
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
      accent: "#22D3EE",
      border: "#1E3A5F",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 1px 3px rgba(0, 0, 0, 0.6)",
      md: "0 4px 8px rgba(0, 0, 0, 0.6)",
      lg: "0 10px 20px rgba(0, 0, 0, 0.6)",
    },
  },

  // === Forest Theme (Green) ===
  forest: {
    name: "Forest",
    mode: "dark",
    colors: {
      primary: "#22C55E",
      secondary: "#10B981",
      background: "#0A1A0A",
      surface: "#14251A",
      text: "#ECFDF5",
      textMuted: "#86EFAC",
      success: "#4ADE80",
      warning: "#FDE047",
      error: "#FB7185",
      accent: "#2DD4BF",
      border: "#1F3D2A",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 1px 3px rgba(0, 0, 0, 0.6)",
      md: "0 4px 8px rgba(0, 0, 0, 0.6)",
      lg: "0 10px 20px rgba(0, 0, 0, 0.6)",
    },
  },

  // === Neon Theme (Vibrant) ===
  neon: {
    name: "Neon",
    mode: "dark",
    colors: {
      primary: "#E879F9",
      secondary: "#A855F7",
      background: "#0A000A",
      surface: "#1A0A1A",
      text: "#FAFAFA",
      textMuted: "#D4D4D8",
      success: "#4ADE80",
      warning: "#FACC15",
      error: "#F43F5E",
      accent: "#22D3EE",
      border: "#3F1F3F",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: {
      sm: "0 0 5px rgba(232, 121, 249, 0.3)",
      md: "0 0 15px rgba(232, 121, 249, 0.4)",
      lg: "0 0 30px rgba(232, 121, 249, 0.5)",
    },
  },

  // === Minimal Theme ===
  minimal: {
    name: "Minimal",
    mode: "dark",
    colors: {
      primary: "#FFFFFF",
      secondary: "#A1A1AA",
      background: "#18181B",
      surface: "#27272A",
      text: "#FAFAFA",
      textMuted: "#71717A",
      success: "#86EFAC",
      warning: "#FDE047",
      error: "#FCA5A5",
      accent: "#E4E4E7",
      border: "#3F3F46",
    },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: DEFAULT_SPACING,
    borderRadius: { sm: 2, md: 4, lg: 8, full: 9999 },
    shadows: {
      sm: "none",
      md: "0 2px 4px rgba(0, 0, 0, 0.3)",
      lg: "0 4px 8px rgba(0, 0, 0, 0.4)",
    },
  },
};

/**
 * Get theme by name
 */
export function getTheme(name: string): Theme {
  return THEMES[name] || THEMES.default;
}

/**
 * Get all theme names
 */
export function getThemeNames(): string[] {
  return Object.keys(THEMES);
}

/**
 * Create a custom theme by extending an existing one
 */
export function createTheme(
  baseName: string,
  overrides: Partial<Theme>
): Theme {
  const base = getTheme(baseName);

  return {
    ...base,
    ...overrides,
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    spacing: { ...base.spacing, ...overrides.spacing },
    borderRadius: { ...base.borderRadius, ...overrides.borderRadius },
    shadows: { ...base.shadows, ...overrides.shadows },
  };
}

/**
 * Get CSS custom properties for a theme
 */
export function getThemeCSSVars(theme: Theme): Record<string, string> {
  return {
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-text": theme.colors.text,
    "--color-text-muted": theme.colors.textMuted,
    "--color-success": theme.colors.success,
    "--color-warning": theme.colors.warning,
    "--color-error": theme.colors.error,
    "--color-accent": theme.colors.accent,
    "--color-border": theme.colors.border,
    "--font-family": theme.typography.fontFamily,
    "--font-family-heading": theme.typography.headingFamily || theme.typography.fontFamily,
    "--font-family-mono": theme.typography.monoFamily,
    "--font-size-base": `${theme.typography.baseFontSize}px`,
    "--line-height": `${theme.typography.lineHeight}`,
    "--spacing-xs": `${theme.spacing.xs}px`,
    "--spacing-sm": `${theme.spacing.sm}px`,
    "--spacing-md": `${theme.spacing.md}px`,
    "--spacing-lg": `${theme.spacing.lg}px`,
    "--spacing-xl": `${theme.spacing.xl}px`,
    "--spacing-xxl": `${theme.spacing.xxl}px`,
    "--border-radius-sm": `${theme.borderRadius.sm}px`,
    "--border-radius-md": `${theme.borderRadius.md}px`,
    "--border-radius-lg": `${theme.borderRadius.lg}px`,
    "--shadow-sm": theme.shadows.sm,
    "--shadow-md": theme.shadows.md,
    "--shadow-lg": theme.shadows.lg,
  };
}
