/**
 * Type definitions for AI asset generation
 */

export interface ImageGenerationOptions {
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** Number of inference steps */
  numInferenceSteps?: number;
  /** Guidance scale for generation */
  guidanceScale?: number;
  /** Model to use (e.g., "fal-ai/flux/schnell") */
  model?: string;
  /** Negative prompt */
  negativePrompt?: string;
}

export interface VideoGenerationOptions {
  /** Duration in seconds (typically 2-5s) */
  durationSeconds?: number;
  /** Video width in pixels */
  width?: number;
  /** Video height in pixels */
  height?: number;
  /** Model to use (e.g., "fal-ai/minimax-video") */
  model?: string;
  /** Optional reference image URL */
  imageUrl?: string;
}

export interface GeneratedAsset {
  /** URL of the generated asset */
  url: string;
  /** Local file path after download */
  localPath?: string;
  /** Original prompt used */
  prompt: string;
  /** Asset type */
  type: "image" | "video";
  /** Generation metadata */
  metadata?: Record<string, unknown>;
}

export interface AIAssetProvider {
  /** Generate an image from a text prompt */
  generateImage(
    prompt: string,
    opts?: ImageGenerationOptions
  ): Promise<GeneratedAsset>;

  /** Generate a short video clip from a text prompt */
  generateVideo(
    prompt: string,
    opts?: VideoGenerationOptions
  ): Promise<GeneratedAsset>;
}

export interface SceneAssetConfig {
  /** Scene ID */
  sceneId: string;
  /** Prompt for background image generation */
  backgroundPrompt?: string;
  /** Prompt for illustration/concept art */
  illustrationPrompt?: string;
  /** Prompt for motion clip */
  motionClipPrompt?: string;
}
