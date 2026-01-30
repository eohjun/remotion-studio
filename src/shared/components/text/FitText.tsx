/**
 * FitText - Component that automatically sizes text to fit container
 *
 * Uses @remotion/layout-utils to calculate optimal font size.
 */
import React from "react";
import { useFitText, useFitMultilineText, UseFitTextOptions, UseFitMultilineOptions } from "../../hooks/useFitText";
import { COLORS, FONT_FAMILY, FONT_SIZES } from "../constants";

export interface FitTextProps extends Omit<UseFitTextOptions, "text"> {
  /** Text content to display */
  children: string;
  /** HTML tag to render (default: "span") */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  /** Text color (default: COLORS.white) */
  color?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles (merged with calculated styles) */
  style?: React.CSSProperties;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
}

/**
 * Single-line text that automatically scales to fit width
 *
 * @example
 * ```tsx
 * <FitText maxWidth={800} maxFontSize={100}>
 *   This Title Will Scale Down If Too Long
 * </FitText>
 * ```
 */
export const FitText: React.FC<FitTextProps> = ({
  children,
  as: Tag = "span",
  color = COLORS.white,
  className,
  style: customStyle,
  textAlign = "center",
  ...fitOptions
}) => {
  const { style: fitStyle } = useFitText({
    text: children,
    ...fitOptions,
  });

  const mergedStyle: React.CSSProperties = {
    ...fitStyle,
    color,
    textAlign,
    display: "block",
    ...customStyle,
  };

  return (
    <Tag className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
};

export interface FitMultilineTextProps extends Omit<UseFitMultilineOptions, "text"> {
  /** Text content to display */
  children: string;
  /** HTML tag to render (default: "p") */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  /** Text color (default: COLORS.white) */
  color?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
}

/**
 * Multi-line text that scales to fit within line constraints
 *
 * @example
 * ```tsx
 * <FitMultilineText maxWidth={800} maxLines={3}>
 *   A longer paragraph that can wrap to multiple lines
 *   but will scale down if it would exceed the max lines.
 * </FitMultilineText>
 * ```
 */
export const FitMultilineText: React.FC<FitMultilineTextProps> = ({
  children,
  as: Tag = "p",
  color = COLORS.white,
  className,
  style: customStyle,
  textAlign = "center",
  ...fitOptions
}) => {
  const { style: fitStyle } = useFitMultilineText({
    text: children,
    ...fitOptions,
  });

  const mergedStyle: React.CSSProperties = {
    ...fitStyle,
    color,
    textAlign,
    display: "block",
    ...customStyle,
  };

  return (
    <Tag className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
};

/**
 * Title component with automatic text fitting
 * Preset for large, bold titles
 */
export interface FitTitleProps {
  children: string;
  maxWidth?: number;
  maxFontSize?: number;
  color?: string;
  style?: React.CSSProperties;
  textAlign?: "left" | "center" | "right";
}

export const FitTitle: React.FC<FitTitleProps> = ({
  children,
  maxWidth,
  maxFontSize = FONT_SIZES["4xl"],
  color = COLORS.white,
  style,
  textAlign = "center",
}) => {
  return (
    <FitText
      as="h1"
      maxWidth={maxWidth}
      maxFontSize={maxFontSize}
      minFontSize={FONT_SIZES.xl}
      fontFamily={FONT_FAMILY.title}
      fontWeight={800}
      letterSpacing={2}
      color={color}
      textAlign={textAlign}
      style={style}
    >
      {children}
    </FitText>
  );
};

/**
 * Subtitle component with automatic text fitting
 * Preset for medium-sized subtitles
 */
export const FitSubtitle: React.FC<FitTitleProps> = ({
  children,
  maxWidth,
  maxFontSize = FONT_SIZES["2xl"],
  color = "rgba(255,255,255,0.8)",
  style,
  textAlign = "center",
}) => {
  return (
    <FitText
      as="h2"
      maxWidth={maxWidth}
      maxFontSize={maxFontSize}
      minFontSize={FONT_SIZES.md}
      fontFamily={FONT_FAMILY.body}
      fontWeight={600}
      letterSpacing={1}
      color={color}
      textAlign={textAlign}
      style={style}
    >
      {children}
    </FitText>
  );
};

export default FitText;
