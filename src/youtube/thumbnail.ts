/**
 * YouTube thumbnail generation utilities
 */

import type { ThumbnailOptions } from "./types";

/** Default thumbnail options for YouTube */
export const DEFAULT_THUMBNAIL_OPTIONS: Required<ThumbnailOptions> = {
  frame: 30, // 1 second into the video at 30fps
  width: 1280,
  height: 720,
  format: "png",
  quality: 90,
  overlayText: "",
};

/**
 * Generate Remotion CLI command for thumbnail
 */
export function generateThumbnailCommand(
  compositionId: string,
  outputPath: string,
  options?: ThumbnailOptions
): string {
  const opts = { ...DEFAULT_THUMBNAIL_OPTIONS, ...options };

  const args = [
    "npx remotion still",
    compositionId,
    outputPath,
    `--frame=${opts.frame}`,
  ];

  // Add dimensions if different from default
  if (opts.width !== 1280 || opts.height !== 720) {
    args.push(`--width=${opts.width}`);
    args.push(`--height=${opts.height}`);
  }

  // Add format if not png
  if (opts.format !== "png") {
    args.push(`--image-format=${opts.format}`);
  }

  // Add quality for JPEG
  if (opts.format === "jpeg" && opts.quality !== 90) {
    args.push(`--jpeg-quality=${opts.quality}`);
  }

  return args.join(" ");
}

/**
 * Get recommended frame for thumbnail based on composition
 */
export function getRecommendedThumbnailFrame(
  scenes: Array<{ id: string; type: string; startFrame: number; durationFrames: number }>,
  fps: number
): number {
  // Try to find intro scene
  const introScene = scenes.find((s) => s.type === "intro");
  if (introScene) {
    // Use frame in the middle of intro
    return introScene.startFrame + Math.floor(introScene.durationFrames / 2);
  }

  // Try to find first content scene
  const contentScene = scenes.find((s) => s.type === "content");
  if (contentScene) {
    // Use frame near the start of first content
    return contentScene.startFrame + fps; // 1 second into content
  }

  // Default to 2 seconds
  return fps * 2;
}

/**
 * Generate multiple thumbnail options for A/B testing
 */
export function generateThumbnailVariants(
  compositionId: string,
  outputDir: string,
  scenes: Array<{ id: string; type: string; startFrame: number; durationFrames: number }>,
  fps: number
): Array<{ name: string; command: string; description: string }> {
  const variants: Array<{ name: string; command: string; description: string }> = [];

  // Variant 1: Intro frame
  const introScene = scenes.find((s) => s.type === "intro");
  if (introScene) {
    variants.push({
      name: "intro",
      command: generateThumbnailCommand(
        compositionId,
        `${outputDir}/thumbnail_intro.png`,
        { frame: introScene.startFrame + Math.floor(introScene.durationFrames / 2) }
      ),
      description: "Thumbnail from intro scene",
    });
  }

  // Variant 2: First content frame
  const contentScene = scenes.find((s) => s.type === "content");
  if (contentScene) {
    variants.push({
      name: "content",
      command: generateThumbnailCommand(
        compositionId,
        `${outputDir}/thumbnail_content.png`,
        { frame: contentScene.startFrame + fps }
      ),
      description: "Thumbnail from first content scene",
    });
  }

  // Variant 3: Outro frame
  const outroScene = scenes.find((s) => s.type === "outro");
  if (outroScene) {
    variants.push({
      name: "outro",
      command: generateThumbnailCommand(
        compositionId,
        `${outputDir}/thumbnail_outro.png`,
        { frame: outroScene.startFrame + fps }
      ),
      description: "Thumbnail from outro scene",
    });
  }

  return variants;
}

/**
 * YouTube thumbnail requirements
 */
export const YOUTUBE_THUMBNAIL_REQUIREMENTS = {
  minWidth: 1280,
  minHeight: 720,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  aspectRatio: 16 / 9,
  supportedFormats: ["jpg", "jpeg", "png", "gif", "bmp"],
  recommendations: [
    "Use high contrast colors",
    "Include text that is readable at small sizes",
    "Show faces/expressions when relevant",
    "Maintain consistent branding",
    "Avoid cluttered designs",
  ],
};
