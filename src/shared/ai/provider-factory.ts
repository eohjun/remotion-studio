/**
 * AI Provider Factory - Unified provider selection
 *
 * Creates the appropriate AI asset provider based on configuration.
 * Supports fal.ai, Kie.ai, or auto-routing based on task type.
 *
 * Auto mode routes:
 * - Images (general): fal.ai Flux/schnell (fast, stable)
 * - Images (with text): Kie.ai 4o Image (better text rendering)
 * - Video (fast iteration): Kie.ai Veo 3 Fast (60% cheaper)
 * - Video (high quality): Kie.ai Veo 3 Quality
 * - Music: Kie.ai Suno (exclusive feature)
 */

import type { AIAssetProvider, AIMusicProvider } from "./types";
import { FalClient } from "./fal-client";
import { KieClient } from "./kie-client";

export type ProviderType = "fal" | "kie" | "auto";

/**
 * Create an AI asset provider by type.
 * "auto" returns a FalClient (default for images), use createKieProvider() for Kie-specific features.
 */
export function createAIProvider(type: ProviderType = "auto"): AIAssetProvider {
  switch (type) {
    case "fal":
      return new FalClient();
    case "kie":
      return new KieClient();
    case "auto":
    default:
      // Auto defaults to fal.ai for general image generation (fast, stable)
      // Use createKieProvider() explicitly for video/music where Kie excels
      return new FalClient();
  }
}

/**
 * Create a Kie.ai provider with music generation support.
 * Use this when you need generateMusic() or prefer Kie.ai for video.
 */
export function createKieProvider(): KieClient {
  return new KieClient();
}

/**
 * Create a music provider (Kie.ai only - fal.ai doesn't support music).
 */
export function createMusicProvider(): AIMusicProvider {
  return new KieClient();
}
