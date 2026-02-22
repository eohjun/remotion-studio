/**
 * Kie.ai Client - AI image, video, and music generation
 *
 * Wraps the Kie.ai REST API for generating visual and audio assets.
 * Requires KIE_KEY environment variable.
 *
 * Key differences from FalClient:
 * - Async task-based (POST → taskId → poll for result)
 * - Bearer token auth
 * - Multiple model options (Veo 3, 4o Image, Flux Kontext, Suno)
 *
 * @example
 * ```ts
 * const client = new KieClient();
 * const image = await client.generateImage("A sunset over mountains");
 * const video = await client.generateVideo("Ocean waves on a beach");
 * const music = await client.generateMusic("Ambient cinematic score");
 * ```
 */

import type {
  AIAssetProvider,
  AIMusicProvider,
  GeneratedAsset,
  ImageGenerationOptions,
  MusicGenerationOptions,
  VideoGenerationOptions,
} from "./types";

const BASE_URL = "https://api.kie.ai";
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 120; // 6 minutes max

// Default models
const DEFAULT_IMAGE_MODEL = "4o-image";
const DEFAULT_VIDEO_MODEL = "veo3-fast";
const DEFAULT_MUSIC_MODEL = "suno_v4";

interface KieTaskResponse {
  code: number;
  data: {
    task_id: string;
  };
}

interface KieTaskResult {
  code: number;
  data: {
    status: "pending" | "processing" | "completed" | "failed";
    output?: {
      url?: string;
      urls?: string[];
      audio_url?: string;
    };
    error?: string;
  };
}

export class KieClient implements AIAssetProvider, AIMusicProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.KIE_KEY || "";
    if (!this.apiKey) {
      throw new Error("KIE_KEY environment variable is required for KieClient");
    }
  }

  async generateImage(
    prompt: string,
    opts: ImageGenerationOptions = {}
  ): Promise<GeneratedAsset> {
    const {
      width = 1920,
      height = 1080,
      model = DEFAULT_IMAGE_MODEL,
    } = opts;

    const taskId = await this.submitTask("/v1/image/generate", {
      model,
      prompt,
      width,
      height,
    });

    const result = await this.pollTaskResult(taskId);
    const imageUrl = result.data.output?.url || result.data.output?.urls?.[0];

    if (!imageUrl) {
      throw new Error("No image generated from Kie.ai");
    }

    return {
      url: imageUrl,
      prompt,
      type: "image",
      metadata: { model, width, height, provider: "kie" },
    };
  }

  async generateVideo(
    prompt: string,
    opts: VideoGenerationOptions = {}
  ): Promise<GeneratedAsset> {
    const {
      model = DEFAULT_VIDEO_MODEL,
      durationSeconds = 8,
      imageUrl,
    } = opts;

    const body: Record<string, unknown> = {
      model,
      prompt,
      duration: durationSeconds,
    };

    if (imageUrl) {
      body.image_url = imageUrl;
    }

    const taskId = await this.submitTask("/v1/video/generate", body);
    const result = await this.pollTaskResult(taskId);
    const videoUrl = result.data.output?.url;

    if (!videoUrl) {
      throw new Error("No video generated from Kie.ai");
    }

    return {
      url: videoUrl,
      prompt,
      type: "video",
      metadata: { model, durationSeconds, provider: "kie" },
    };
  }

  async generateMusic(
    prompt: string,
    opts: MusicGenerationOptions = {}
  ): Promise<GeneratedAsset> {
    const {
      style,
      instrumental = true,
      durationSeconds = 30,
      model = DEFAULT_MUSIC_MODEL,
    } = opts;

    const fullPrompt = style ? `${style}: ${prompt}` : prompt;

    const taskId = await this.submitTask("/v1/music/generate", {
      model,
      prompt: fullPrompt,
      instrumental,
      duration: durationSeconds,
    });

    const result = await this.pollTaskResult(taskId);
    const audioUrl =
      result.data.output?.audio_url || result.data.output?.url;

    if (!audioUrl) {
      throw new Error("No music generated from Kie.ai");
    }

    return {
      url: audioUrl,
      prompt: fullPrompt,
      type: "music",
      metadata: { model, instrumental, durationSeconds, provider: "kie" },
    };
  }

  private async submitTask(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<string> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Kie.ai API error (${response.status}): ${text}`
      );
    }

    const data = (await response.json()) as KieTaskResponse;

    if (!data.data?.task_id) {
      throw new Error("No task_id returned from Kie.ai");
    }

    return data.data.task_id;
  }

  private async pollTaskResult(taskId: string): Promise<KieTaskResult> {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      const response = await fetch(
        `${BASE_URL}/v1/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Kie.ai poll error (${response.status}): ${await response.text()}`
        );
      }

      const result = (await response.json()) as KieTaskResult;
      const status = result.data?.status;

      if (status === "completed") {
        return result;
      }

      if (status === "failed") {
        throw new Error(
          `Kie.ai task failed: ${result.data.error || "Unknown error"}`
        );
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new Error(
      `Kie.ai task timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`
    );
  }
}
