import React, { createContext, useContext, useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { Theme, getTheme, getThemeCSSVars, THEMES } from "../config/themes";

/**
 * Theme context value
 */
interface ThemeContextValue {
  /** Current theme */
  theme: Theme;
  /** Get a color from the theme */
  color: (key: keyof Theme["colors"]) => string;
  /** Get a spacing value */
  spacing: (key: keyof Theme["spacing"]) => number;
  /** Get a font weight */
  fontWeight: (key: keyof Theme["typography"]["fontWeights"]) => number;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Props for ThemeProvider
 */
export interface ThemeProviderProps {
  /** Theme name or custom theme object */
  theme?: string | Theme;
  /** Children to render */
  children: React.ReactNode;
  /** Apply theme as background (default: true) */
  applyBackground?: boolean;
  /** Additional styles for the container */
  style?: React.CSSProperties;
  /** Additional className */
  className?: string;
}

/**
 * ThemeProvider - Provides theme context to children
 *
 * Wraps content with theme variables and optionally applies
 * the theme background color.
 *
 * @example
 * ```tsx
 * <ThemeProvider theme="midnight">
 *   <MyScene />
 * </ThemeProvider>
 * ```
 *
 * @example
 * ```tsx
 * <ThemeProvider theme={customTheme} applyBackground={false}>
 *   <TransparentOverlay />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = "default",
  children,
  applyBackground = true,
  style,
  className,
}) => {
  // Resolve theme
  const resolvedTheme = useMemo(() => {
    if (typeof theme === "string") {
      return getTheme(theme);
    }
    return theme;
  }, [theme]);

  // Create context value
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme: resolvedTheme,
      color: (key) => resolvedTheme.colors[key],
      spacing: (key) => resolvedTheme.spacing[key],
      fontWeight: (key) => resolvedTheme.typography.fontWeights[key],
    }),
    [resolvedTheme]
  );

  // Get CSS variables
  const cssVars = useMemo(() => getThemeCSSVars(resolvedTheme), [resolvedTheme]);

  // Container styles
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      ...(cssVars as React.CSSProperties),
      fontFamily: resolvedTheme.typography.fontFamily,
      color: resolvedTheme.colors.text,
      ...(applyBackground && {
        backgroundColor: resolvedTheme.colors.background,
      }),
      ...style,
    }),
    [cssVars, resolvedTheme, applyBackground, style]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <AbsoluteFill className={className} style={containerStyle}>
        {children}
      </AbsoluteFill>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the current theme
 *
 * @example
 * ```tsx
 * const { theme, color, spacing } = useTheme();
 *
 * return (
 *   <div style={{
 *     backgroundColor: color('surface'),
 *     padding: spacing('md'),
 *   }}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    // Return default theme if not in provider
    const defaultTheme = THEMES.default;
    return {
      theme: defaultTheme,
      color: (key) => defaultTheme.colors[key],
      spacing: (key) => defaultTheme.spacing[key],
      fontWeight: (key) => defaultTheme.typography.fontWeights[key],
    };
  }

  return context;
}

/**
 * Higher-order component to inject theme props
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>
): React.FC<Omit<P, "theme">> {
  const WrappedComponent: React.FC<Omit<P, "theme">> = (props) => {
    const { theme } = useTheme();
    return <Component {...(props as P)} theme={theme} />;
  };

  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
}

export default ThemeProvider;
