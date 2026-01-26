/**
 * Video Format Configuration
 *
 * Defines video format presets for multi-platform support:
 * - LANDSCAPE (16:9): YouTube, standard video
 * - PORTRAIT (9:16): YouTube Shorts, TikTok, Instagram Reels
 * - SQUARE (1:1): Instagram feed, social media
 */

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "21:9";

export interface VideoFormat {
  name: string;
  width: number;
  height: number;
  ratio: AspectRatio;
  /** Common platforms for this format */
  platforms: string[];
  /** Safe zone margin from edges (percentage) */
  safeZoneMargin: number;
  /** Recommended maximum font size */
  maxTitleFontSize: number;
  /** Recommended body font size */
  bodyFontSize: number;
}

/**
 * Standard video format presets
 */
export const VIDEO_FORMATS: Record<string, VideoFormat> = {
  LANDSCAPE: {
    name: "Landscape",
    width: 1920,
    height: 1080,
    ratio: "16:9",
    platforms: ["YouTube", "Vimeo", "Desktop"],
    safeZoneMargin: 5,
    maxTitleFontSize: 72,
    bodyFontSize: 32,
  },
  PORTRAIT: {
    name: "Portrait",
    width: 1080,
    height: 1920,
    ratio: "9:16",
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels"],
    safeZoneMargin: 8,
    maxTitleFontSize: 56,
    bodyFontSize: 28,
  },
  SQUARE: {
    name: "Square",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    safeZoneMargin: 6,
    maxTitleFontSize: 56,
    bodyFontSize: 28,
  },
  ULTRAWIDE: {
    name: "Ultrawide",
    width: 2560,
    height: 1080,
    ratio: "21:9",
    platforms: ["Cinematic", "Desktop Wallpaper"],
    safeZoneMargin: 10,
    maxTitleFontSize: 72,
    bodyFontSize: 32,
  },
  CLASSIC: {
    name: "Classic 4:3",
    width: 1440,
    height: 1080,
    ratio: "4:3",
    platforms: ["Legacy", "Presentations"],
    safeZoneMargin: 5,
    maxTitleFontSize: 64,
    bodyFontSize: 30,
  },
} as const;

export type FormatKey = keyof typeof VIDEO_FORMATS;

/**
 * Get video format by key
 */
export function getFormat(key: FormatKey): VideoFormat {
  return VIDEO_FORMATS[key];
}

/**
 * Get video format by aspect ratio
 */
export function getFormatByRatio(ratio: AspectRatio): VideoFormat {
  const format = Object.values(VIDEO_FORMATS).find((f) => f.ratio === ratio);
  return format || VIDEO_FORMATS.LANDSCAPE;
}

/**
 * Detect appropriate format from width/height
 */
export function detectFormat(width: number, height: number): VideoFormat {
  const ratio = width / height;

  if (ratio > 1.9) return VIDEO_FORMATS.ULTRAWIDE;
  if (ratio > 1.5) return VIDEO_FORMATS.LANDSCAPE;
  if (ratio > 1.2) return VIDEO_FORMATS.CLASSIC;
  if (ratio > 0.9) return VIDEO_FORMATS.SQUARE;
  return VIDEO_FORMATS.PORTRAIT;
}

/**
 * Calculate scaled dimensions maintaining aspect ratio
 */
export function scaleDimensions(
  format: VideoFormat,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  if (targetWidth && !targetHeight) {
    const scale = targetWidth / format.width;
    return {
      width: targetWidth,
      height: Math.round(format.height * scale),
    };
  }

  if (targetHeight && !targetWidth) {
    const scale = targetHeight / format.height;
    return {
      width: Math.round(format.width * scale),
      height: targetHeight,
    };
  }

  return { width: format.width, height: format.height };
}

/**
 * Calculate safe zone boundaries (pixels from edge)
 */
export function getSafeZone(format: VideoFormat): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const marginX = Math.round(format.width * (format.safeZoneMargin / 100));
  const marginY = Math.round(format.height * (format.safeZoneMargin / 100));

  return {
    top: marginY,
    right: marginX,
    bottom: marginY,
    left: marginX,
  };
}

/**
 * Get responsive font size based on format
 */
export function getResponsiveFontSize(
  baseFontSize: number,
  format: VideoFormat,
  baseFormat: VideoFormat = VIDEO_FORMATS.LANDSCAPE
): number {
  const scaleFactor = format.width / baseFormat.width;
  return Math.round(baseFontSize * scaleFactor);
}

/**
 * Check if dimensions fit within safe zone
 */
export function isWithinSafeZone(
  x: number,
  y: number,
  elementWidth: number,
  elementHeight: number,
  format: VideoFormat
): boolean {
  const safeZone = getSafeZone(format);

  return (
    x >= safeZone.left &&
    y >= safeZone.top &&
    x + elementWidth <= format.width - safeZone.right &&
    y + elementHeight <= format.height - safeZone.bottom
  );
}

/**
 * Format presets for common use cases
 */
export const FORMAT_PRESETS = {
  /** Standard YouTube video */
  youtube: VIDEO_FORMATS.LANDSCAPE,
  /** YouTube Shorts */
  shorts: VIDEO_FORMATS.PORTRAIT,
  /** TikTok */
  tiktok: VIDEO_FORMATS.PORTRAIT,
  /** Instagram Reels */
  reels: VIDEO_FORMATS.PORTRAIT,
  /** Instagram Feed */
  instagram: VIDEO_FORMATS.SQUARE,
  /** LinkedIn/Twitter */
  social: VIDEO_FORMATS.LANDSCAPE,
} as const;
