import type { CompositionConfig, Scene } from "./schema";

/**
 * Scene timing utilities for automatic duration calculation
 */

export interface SceneTiming {
  id: string;
  start: number;
  duration: number;
  end: number;
}

export interface CompositionTiming {
  scenes: SceneTiming[];
  totalDuration: number;
}

/**
 * Default scene durations by type (in seconds)
 */
export const DEFAULT_SCENE_DURATIONS: Record<string, number> = {
  intro: 8,
  content: 15,
  comparison: 17,
  quote: 10,
  outro: 12,
};

/**
 * Calculate scene duration from various sources
 * Priority: audioFile > durationInFrames > durationInSeconds > default
 */
export async function getSceneDuration(
  scene: Scene,
  fps: number,
  buffer: number = 15
): Promise<number> {
  // If explicit frame duration is set, use it
  if (scene.durationInFrames) {
    return scene.durationInFrames;
  }

  // If explicit seconds duration is set, convert to frames
  if (scene.durationInSeconds) {
    return Math.round(scene.durationInSeconds * fps) + buffer;
  }

  // If audio file is specified, try to get duration
  if (scene.audioFile) {
    try {
      const audioDuration = await getAudioDuration(scene.audioFile);
      return Math.round(audioDuration * fps) + buffer;
    } catch {
      console.warn(`Could not get audio duration for ${scene.audioFile}, using default`);
    }
  }

  // Fall back to default duration for scene type
  const defaultSeconds = DEFAULT_SCENE_DURATIONS[scene.type] || 10;
  return Math.round(defaultSeconds * fps) + buffer;
}

/**
 * Get audio file duration (placeholder - requires actual implementation)
 */
async function getAudioDuration(audioPath: string): Promise<number> {
  // In browser/Remotion context, this would use the Audio API
  // For now, return a default that can be overridden
  console.log(`Getting duration for: ${audioPath}`);
  return 10; // Default 10 seconds
}

/**
 * Calculate timing for all scenes in a composition
 */
export async function calculateCompositionTiming(
  config: CompositionConfig
): Promise<CompositionTiming> {
  const scenes: SceneTiming[] = [];
  let currentStart = 0;

  for (const scene of config.scenes) {
    const duration = await getSceneDuration(scene, config.fps, config.sceneBuffer);

    scenes.push({
      id: scene.id,
      start: currentStart,
      duration,
      end: currentStart + duration,
    });

    currentStart += duration;
  }

  return {
    scenes,
    totalDuration: currentStart,
  };
}

/**
 * Synchronous version for when audio duration is pre-calculated
 */
export function calculateCompositionTimingSync(
  config: CompositionConfig,
  sceneDurations?: Record<string, number>
): CompositionTiming {
  const scenes: SceneTiming[] = [];
  let currentStart = 0;

  for (const scene of config.scenes) {
    let duration: number;

    // Check pre-calculated durations first
    if (sceneDurations && sceneDurations[scene.id]) {
      duration = sceneDurations[scene.id];
    } else if (scene.durationInFrames) {
      duration = scene.durationInFrames;
    } else if (scene.durationInSeconds) {
      duration = Math.round(scene.durationInSeconds * config.fps) + config.sceneBuffer;
    } else {
      const defaultSeconds = DEFAULT_SCENE_DURATIONS[scene.type] || 10;
      duration = Math.round(defaultSeconds * config.fps) + config.sceneBuffer;
    }

    scenes.push({
      id: scene.id,
      start: currentStart,
      duration,
      end: currentStart + duration,
    });

    currentStart += duration;
  }

  return {
    scenes,
    totalDuration: currentStart,
  };
}

/**
 * Generate SCENES constant from timing calculation
 */
export function generateScenesConstant(timing: CompositionTiming): string {
  const entries = timing.scenes.map((scene) => {
    return `  ${scene.id}: { start: ${scene.start}, duration: ${scene.duration} },`;
  });

  return `export const SCENES = {\n${entries.join("\n")}\n};\n\nexport const TOTAL_DURATION = ${timing.totalDuration};`;
}
