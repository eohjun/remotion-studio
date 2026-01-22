/**
 * YouTube optimization module
 * Provides tools for YouTube-optimized video production
 */

// Types
export type {
  YouTubeChapter,
  YouTubeMetadata,
  RenderPreset,
  ThumbnailOptions,
  CompositionTiming,
  SceneTiming,
  YouTubeAssetBundle,
} from "./types";

// Chapters
export {
  formatTimestamp,
  parseTimestamp,
  generateChapters,
  generateChaptersText,
  calculateSceneTimings,
  validateChapters,
} from "./chapters";

// Metadata
export {
  generateMetadata,
  generateLocalizedMetadata,
  exportMetadataJSON,
  exportDescriptionText,
  exportTagsString,
  type MetadataOptions,
} from "./metadata";

// Thumbnails
export {
  DEFAULT_THUMBNAIL_OPTIONS,
  generateThumbnailCommand,
  getRecommendedThumbnailFrame,
  generateThumbnailVariants,
  YOUTUBE_THUMBNAIL_REQUIREMENTS,
} from "./thumbnail";

// Render presets
export {
  RENDER_PRESETS,
  getPreset,
  getPresetNames,
  generateRenderCommand,
  generateMultipleRenderCommands,
  getRecommendedPreset,
  estimateFileSize,
} from "./render-presets";

// Templates
export { EndscreenDefault, type EndscreenProps } from "./templates/endscreen-default";
