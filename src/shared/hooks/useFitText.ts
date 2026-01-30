/**
 * useFitText - Dynamic text sizing hook using @remotion/layout-utils
 *
 * Automatically calculates the optimal font size to fit text within a container.
 * Useful for titles, quotes, and other text that needs to scale dynamically.
 */
import { fitText } from "@remotion/layout-utils";
import { useMemo } from "react";
import { FONT_FAMILY, FONT_SIZES, LAYOUT } from "../components/constants";

export interface UseFitTextOptions {
  /** Text to measure */
  text: string;
  /** Maximum width in pixels (default: safe content area width) */
  maxWidth?: number;
  /** Maximum font size in pixels (default: FONT_SIZES["3xl"]) */
  maxFontSize?: number;
  /** Minimum font size in pixels (default: FONT_SIZES.sm) */
  minFontSize?: number;
  /** Font family (default: FONT_FAMILY.title) */
  fontFamily?: string;
  /** Font weight (default: 800) */
  fontWeight?: number | string;
  /** Letter spacing in pixels (default: 0) */
  letterSpacing?: number;
  /** Additional font variation settings */
  fontVariationSettings?: string;
}

export interface FitTextResult {
  /** Calculated optimal font size in pixels */
  fontSize: number;
  /** Whether the text fits at the maximum font size */
  fitsAtMax: boolean;
  /** The original max font size for reference */
  maxFontSize: number;
  /** Ready-to-use style object */
  style: React.CSSProperties;
}

/**
 * Hook to calculate optimal font size for text to fit within a container
 *
 * @example
 * ```tsx
 * const { style } = useFitText({
 *   text: "Very Long Title That Needs To Fit",
 *   maxWidth: 1400,
 * });
 *
 * return <h1 style={style}>{title}</h1>;
 * ```
 */
export function useFitText(options: UseFitTextOptions): FitTextResult {
  const {
    text,
    maxWidth = LAYOUT.maxContentWidth,
    maxFontSize = FONT_SIZES["3xl"],
    minFontSize = FONT_SIZES.sm,
    fontFamily = FONT_FAMILY.title,
    fontWeight = 800,
    letterSpacing = 0,
    fontVariationSettings,
  } = options;

  return useMemo(() => {
    if (!text || text.trim().length === 0) {
      return {
        fontSize: maxFontSize,
        fitsAtMax: true,
        maxFontSize,
        style: {
          fontSize: maxFontSize,
          fontFamily,
          fontWeight,
          letterSpacing,
        },
      };
    }

    // Use binary search to find optimal font size
    const { fontSize } = fitText({
      text,
      withinWidth: maxWidth,
      fontFamily,
      fontWeight: fontWeight as number | string,
      letterSpacing: `${letterSpacing}px`,
    });

    // Clamp to min/max bounds
    const clampedFontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));
    const fitsAtMax = fontSize >= maxFontSize;

    return {
      fontSize: clampedFontSize,
      fitsAtMax,
      maxFontSize,
      style: {
        fontSize: clampedFontSize,
        fontFamily,
        fontWeight,
        letterSpacing,
        whiteSpace: "nowrap" as const,
      },
    };
  }, [text, maxWidth, maxFontSize, minFontSize, fontFamily, fontWeight, letterSpacing, fontVariationSettings]);
}

/**
 * Calculate font size for multi-line text (fills available space)
 *
 * @example
 * ```tsx
 * const { fontSize } = useFitMultilineText({
 *   text: "Long paragraph that spans multiple lines",
 *   maxWidth: 800,
 *   maxLines: 3,
 * });
 * ```
 */
export interface UseFitMultilineOptions extends UseFitTextOptions {
  /** Maximum number of lines */
  maxLines?: number;
  /** Line height multiplier (default: 1.2) */
  lineHeight?: number;
}

export function useFitMultilineText(options: UseFitMultilineOptions): FitTextResult {
  const {
    text,
    maxWidth = LAYOUT.maxContentWidth,
    maxFontSize = FONT_SIZES["3xl"],
    minFontSize = FONT_SIZES.sm,
    fontFamily = FONT_FAMILY.title,
    fontWeight = 800,
    letterSpacing = 0,
    maxLines = 2,
    lineHeight = 1.2,
  } = options;

  return useMemo(() => {
    if (!text || text.trim().length === 0) {
      return {
        fontSize: maxFontSize,
        fitsAtMax: true,
        maxFontSize,
        style: {
          fontSize: maxFontSize,
          fontFamily,
          fontWeight,
          letterSpacing,
          lineHeight,
        },
      };
    }

    // Estimate characters per line based on average character width
    const avgCharWidth = 0.5; // Rough estimate for proportional fonts
    const charsPerLine = Math.floor(maxWidth / (maxFontSize * avgCharWidth));
    const totalChars = text.length;
    const estimatedLines = Math.ceil(totalChars / charsPerLine);

    // If text would exceed max lines at max font size, scale down
    let targetFontSize = maxFontSize;
    if (estimatedLines > maxLines) {
      // Scale down proportionally
      const scaleFactor = Math.sqrt(maxLines / estimatedLines);
      targetFontSize = Math.floor(maxFontSize * scaleFactor);
    }

    const clampedFontSize = Math.max(minFontSize, Math.min(maxFontSize, targetFontSize));
    const fitsAtMax = targetFontSize >= maxFontSize;

    return {
      fontSize: clampedFontSize,
      fitsAtMax,
      maxFontSize,
      style: {
        fontSize: clampedFontSize,
        fontFamily,
        fontWeight,
        letterSpacing,
        lineHeight,
        wordBreak: "keep-all" as const,
        overflowWrap: "break-word" as const,
      },
    };
  }, [text, maxWidth, maxFontSize, minFontSize, fontFamily, fontWeight, letterSpacing, maxLines, lineHeight]);
}

export default useFitText;
