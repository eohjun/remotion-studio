/**
 * Color Animation Utilities for Remotion
 *
 * Provides color interpolation, conversion, and gradient animation helpers.
 * Supports both RGB and HSL color space interpolation.
 */

/** Color interpolation mode */
export type ColorInterpolationMode = "rgb" | "hsl";

// =============================================================================
// Color Conversion Utilities
// =============================================================================

/**
 * Parse a hex color string to RGB values
 * Supports 3-digit (#RGB) and 6-digit (#RRGGBB) formats
 *
 * @param hex - Hex color string (e.g., "#ff0000" or "#f00")
 * @returns RGB tuple [r, g, b] with values 0-255
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, "");

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    // 3-digit format (#RGB)
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    // 6-digit format (#RRGGBB)
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return [r, g, b];
};

/**
 * Convert RGB values to hex color string
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string (e.g., "#ff0000")
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Convert hex color to HSL values
 *
 * @param hex - Hex color string
 * @returns HSL tuple [h, s, l] with h: 0-360, s: 0-100, l: 0-100
 */
export const hexToHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
};

/**
 * Convert RGB values to HSL
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL tuple [h, s, l] with h: 0-360, s: 0-100, l: 0-100
 */
export const rgbToHsl = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
};

/**
 * Convert HSL values to hex color string
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
};

/**
 * Convert HSL values to RGB
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB tuple [r, g, b] with values 0-255
 */
export const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// =============================================================================
// Color Interpolation
// =============================================================================

/**
 * Interpolate between two colors
 *
 * @param color1 - Start color (hex string)
 * @param color2 - End color (hex string)
 * @param progress - Progress value (0-1)
 * @param mode - Interpolation mode ('rgb' or 'hsl')
 * @returns Interpolated hex color string
 */
export const interpolateColor = (
  color1: string,
  color2: string,
  progress: number,
  mode: ColorInterpolationMode = "rgb"
): string => {
  // Clamp progress to 0-1
  const t = Math.max(0, Math.min(1, progress));

  if (mode === "rgb") {
    return interpolateColorRgb(color1, color2, t);
  } else {
    return interpolateColorHsl(color1, color2, t);
  }
};

/**
 * Interpolate between two colors in RGB space
 */
const interpolateColorRgb = (
  color1: string,
  color2: string,
  t: number
): string => {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const r = r1 + (r2 - r1) * t;
  const g = g1 + (g2 - g1) * t;
  const b = b1 + (b2 - b1) * t;

  return rgbToHex(r, g, b);
};

/**
 * Interpolate between two colors in HSL space
 * This produces smoother color transitions for hue changes
 */
const interpolateColorHsl = (
  color1: string,
  color2: string,
  t: number
): string => {
  const [h1, s1, l1] = hexToHsl(color1);
  const [h2, s2, l2] = hexToHsl(color2);

  // Handle hue interpolation (shortest path around the color wheel)
  let hDiff = h2 - h1;
  if (hDiff > 180) hDiff -= 360;
  if (hDiff < -180) hDiff += 360;

  const h = (h1 + hDiff * t + 360) % 360;
  const s = s1 + (s2 - s1) * t;
  const l = l1 + (l2 - l1) * t;

  return hslToHex(h, s, l);
};

/**
 * Interpolate through multiple colors
 *
 * @param colors - Array of hex color strings
 * @param progress - Progress value (0-1)
 * @param mode - Interpolation mode ('rgb' or 'hsl')
 * @returns Interpolated hex color string
 */
export const interpolateColors = (
  colors: string[],
  progress: number,
  mode: ColorInterpolationMode = "rgb"
): string => {
  if (colors.length === 0) {
    throw new Error("Colors array must not be empty");
  }
  if (colors.length === 1) {
    return colors[0];
  }

  // Clamp progress
  const t = Math.max(0, Math.min(1, progress));

  // Calculate which segment we're in
  const segments = colors.length - 1;
  const scaledProgress = t * segments;
  const segmentIndex = Math.min(Math.floor(scaledProgress), segments - 1);
  const segmentProgress = scaledProgress - segmentIndex;

  return interpolateColor(
    colors[segmentIndex],
    colors[segmentIndex + 1],
    segmentProgress,
    mode
  );
};

// =============================================================================
// Gradient Animation Helpers
// =============================================================================

/**
 * Generate animated gradient stops for CSS linear-gradient
 *
 * @param colors - Array of hex color strings
 * @param progress - Progress value (0-1) for animation
 * @returns CSS gradient string (without 'linear-gradient()' wrapper)
 */
export const animatedGradientStops = (
  colors: string[],
  progress: number
): string => {
  if (colors.length === 0) return "transparent";
  if (colors.length === 1) return colors[0];

  // Shift colors based on progress
  const shiftAmount = progress % 1;
  const shiftedColors = [...colors];

  // Interpolate the shift
  if (shiftAmount > 0) {
    const newFirst = interpolateColors(
      [...colors, colors[0]],
      shiftAmount,
      "hsl"
    );
    shiftedColors.unshift(newFirst);
    shiftedColors.push(newFirst);
  }

  // Generate gradient stops
  return shiftedColors
    .map((color, i) => {
      const position = (i / (shiftedColors.length - 1)) * 100;
      return `${color} ${position}%`;
    })
    .join(", ");
};

/**
 * Generate a rotating gradient CSS string
 *
 * @param colors - Array of hex color strings
 * @param progress - Progress value for rotation (0-1 = 0-360 degrees)
 * @param stops - Additional color stop configuration
 * @returns Complete CSS linear-gradient string
 */
export const rotatingGradient = (
  colors: string[],
  progress: number,
  stops?: string
): string => {
  const angle = progress * 360;
  const colorStops = stops || colors.join(", ");
  return `linear-gradient(${angle}deg, ${colorStops})`;
};

/**
 * Generate a pulsing gradient where colors shift along the gradient
 *
 * @param colors - Array of hex color strings
 * @param progress - Progress value (0-1)
 * @param angle - Gradient angle in degrees (default: 135)
 * @returns Complete CSS linear-gradient string
 */
export const pulsingGradient = (
  colors: string[],
  progress: number,
  angle = 135
): string => {
  if (colors.length < 2) {
    return `linear-gradient(${angle}deg, ${colors[0] || "transparent"})`;
  }

  // Cycle colors based on progress
  const cycleIndex = Math.floor(progress * colors.length) % colors.length;
  const cycledColors = [
    ...colors.slice(cycleIndex),
    ...colors.slice(0, cycleIndex),
  ];

  return `linear-gradient(${angle}deg, ${cycledColors.join(", ")})`;
};

// =============================================================================
// Color Utility Functions
// =============================================================================

/**
 * Lighten a color by a percentage
 *
 * @param hex - Hex color string
 * @param amount - Amount to lighten (0-100)
 * @returns Lightened hex color
 */
export const lighten = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  const newL = Math.min(100, l + amount);
  return hslToHex(h, s, newL);
};

/**
 * Darken a color by a percentage
 *
 * @param hex - Hex color string
 * @param amount - Amount to darken (0-100)
 * @returns Darkened hex color
 */
export const darken = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  const newL = Math.max(0, l - amount);
  return hslToHex(h, s, newL);
};

/**
 * Saturate a color by a percentage
 *
 * @param hex - Hex color string
 * @param amount - Amount to saturate (0-100)
 * @returns Saturated hex color
 */
export const saturate = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  const newS = Math.min(100, s + amount);
  return hslToHex(h, newS, l);
};

/**
 * Desaturate a color by a percentage
 *
 * @param hex - Hex color string
 * @param amount - Amount to desaturate (0-100)
 * @returns Desaturated hex color
 */
export const desaturate = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  const newS = Math.max(0, s - amount);
  return hslToHex(h, newS, l);
};

/**
 * Set the alpha/opacity of a color
 *
 * @param hex - Hex color string
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Mix two colors together
 *
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @param weight - Weight of first color (0-1, default: 0.5)
 * @returns Mixed hex color
 */
export const mix = (
  color1: string,
  color2: string,
  weight = 0.5
): string => {
  return interpolateColor(color1, color2, 1 - weight, "rgb");
};

/**
 * Get the complementary color (opposite on color wheel)
 *
 * @param hex - Hex color string
 * @returns Complementary hex color
 */
export const complement = (hex: string): string => {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex((h + 180) % 360, s, l);
};

/**
 * Get the contrast color (black or white) for readability
 *
 * @param hex - Background hex color
 * @returns "#000000" or "#ffffff" for best contrast
 */
export const contrastColor = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};
