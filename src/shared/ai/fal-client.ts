/**
 * fal.ai Client - AI image and video generation
 *
 * Wraps the fal.ai REST API for generating visual assets.
 * Requires FAL_KEY environment variable.
 *
 * @example
 * ```ts
 * const client = new FalClient();
 * const image = await client.generateImage("A sunset over mountains");
 * const video = await client.generateVideo("Ocean waves on a beach");
 * ```
 */

import { fal } from "@fal-ai/client";
import type {
  AIAssetProvider,
  GeneratedAsset,
  ImageGenerationOptions,
  VideoGenerationOptions,
} from "./types";

// Default models
const DEFAULT_IMAGE_MODEL = "fal-ai/flux/schnell";
const DEFAULT_VIDEO_MODEL = "fal-ai/minimax-video/image-to-video";

interface FalImageResult {
  images: Array<{ url: string; content_type: string }>;
}

interface FalVideoResult {
  video: { url: string };
}

export class FalClient implements AIAssetProvider {
  constructor() {
    // fal.ai client reads FAL_KEY from env automatically
  }

  async generateImage(
    prompt: string,
    opts: ImageGenerationOptions = {}
  ): Promise<GeneratedAsset> {
    const {
      width = 1920,
      height = 1080,
      numInferenceSteps = 4,
      model = DEFAULT_IMAGE_MODEL,
      negativePrompt,
    } = opts;

    const input: Record<string, unknown> = {
      prompt,
      image_size: { width, height },
      num_inference_steps: numInferenceSteps,
      num_images: 1,
    };

    if (negativePrompt) {
      input.negative_prompt = negativePrompt;
    }

    const result = await fal.subscribe(model, { input }) as { data: FalImageResult };

    const imageUrl = result.data.images[0]?.url;
    if (!imageUrl) {
      throw new Error("No image generated from fal.ai");
    }

    return {
      url: imageUrl,
      prompt,
      type: "image",
      metadata: { model, width, height },
    };
  }

  async generateVideo(
    prompt: string,
    opts: VideoGenerationOptions = {}
  ): Promise<GeneratedAsset> {
    const {
      model = DEFAULT_VIDEO_MODEL,
      imageUrl,
    } = opts;

    const input: Record<string, unknown> = {
      prompt,
    };

    if (imageUrl) {
      input.image_url = imageUrl;
    }

    const result = await fal.subscribe(model, { input }) as { data: FalVideoResult };

    const videoUrl = result.data.video?.url;
    if (!videoUrl) {
      throw new Error("No video generated from fal.ai");
    }

    return {
      url: videoUrl,
      prompt,
      type: "video",
      metadata: { model },
    };
  }
}
