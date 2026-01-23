/**
 * YouTube optimization types
 */

/** YouTube chapter/timestamp */
export interface YouTubeChapter {
  /** Timestamp in "MM:SS" format for YouTube */
  timestamp: string;
  /** Timestamp in seconds */
  timestampSeconds: number;
  /** Chapter title */
  title: string;
  /** Associated scene ID */
  sceneId: string;
}

/** YouTube video metadata */
export interface YouTubeMetadata {
  /** Video title (max 100 chars) */
  title: string;
  /** Video description */
  description: string;
  /** Search tags (max 500 chars total) */
  tags: string[];
  /** Chapter markers */
  chapters: YouTubeChapter[];
  /** Category ID (e.g., 22 = People & Blogs, 27 = Education) */
  categoryId?: string;
  /** Default language code */
  language?: string;
}

/** Render preset for video quality */
export interface RenderPreset {
  /** Preset name */
  name: string;
  /** Video width */
  width: number;
  /** Video height */
  height: number;
  /** Constant Rate Factor (lower = better quality) */
  crf: number;
  /** Video codec */
  codec: "h264" | "h265" | "vp9";
  /** Description */
  description: string;
}

/** Thumbnail generation options */
export interface ThumbnailOptions {
  /** Frame number to capture */
  frame?: number;
  /** Width (default: 1280 for YouTube) */
  width?: number;
  /** Height (default: 720 for YouTube) */
  height?: number;
  /** Output format */
  format?: "png" | "jpeg" | "webp";
  /** JPEG quality (if format is jpeg) */
  quality?: number;
  /** Custom text overlay */
  overlayText?: string;
}

/** Video composition timing info */
export interface CompositionTiming {
  /** Total duration in frames */
  totalFrames: number;
  /** Frames per second */
  fps: number;
  /** Total duration in seconds */
  durationSeconds: number;
  /** Scene timings */
  scenes: SceneTiming[];
}

/** Scene timing info */
export interface SceneTiming {
  /** Scene ID */
  id: string;
  /** Scene type */
  type: string;
  /** Start frame */
  startFrame: number;
  /** End frame */
  endFrame: number;
  /** Duration in frames */
  durationFrames: number;
  /** Start time in seconds */
  startSeconds: number;
  /** Duration in seconds */
  durationSeconds: number;
}

/** YouTube asset bundle */
export interface YouTubeAssetBundle {
  /** Generated metadata */
  metadata: YouTubeMetadata;
  /** Thumbnail file path */
  thumbnailPath?: string;
  /** Chapters text file path */
  chaptersPath?: string;
  /** Metadata JSON file path */
  metadataPath?: string;
  /** Render command */
  renderCommand: string;
}
