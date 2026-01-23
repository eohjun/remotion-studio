/**
 * YouTube chapter generation from scene timings
 */

import type { YouTubeChapter, SceneTiming, CompositionTiming } from "./types";

/**
 * Format seconds to YouTube timestamp (MM:SS or HH:MM:SS)
 */
export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * Parse timestamp string to seconds
 */
export function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

/**
 * Generate YouTube chapters from scene timings
 */
export function generateChapters(timing: CompositionTiming): YouTubeChapter[] {
  const chapters: YouTubeChapter[] = [];

  for (const scene of timing.scenes) {
    // Skip very short scenes (less than 5 seconds)
    if (scene.durationSeconds < 5) continue;

    // Skip transition/buffer scenes
    if (scene.type === "transition" || scene.type === "buffer") continue;

    chapters.push({
      timestamp: formatTimestamp(scene.startSeconds),
      timestampSeconds: scene.startSeconds,
      title: getChapterTitle(scene),
      sceneId: scene.id,
    });
  }

  // YouTube requires first chapter to start at 0:00
  if (chapters.length > 0 && chapters[0].timestampSeconds > 0) {
    chapters.unshift({
      timestamp: "0:00",
      timestampSeconds: 0,
      title: "Intro",
      sceneId: "intro_implicit",
    });
  }

  return chapters;
}

/**
 * Get chapter title from scene
 */
function getChapterTitle(scene: SceneTiming): string {
  // Use scene type for common patterns
  switch (scene.type) {
    case "intro":
      return "Introduction";
    case "outro":
      return "Conclusion";
    case "content":
      // Try to extract title from scene ID
      return formatSceneIdAsTitle(scene.id);
    default:
      return formatSceneIdAsTitle(scene.id);
  }
}

/**
 * Format scene ID as readable title
 */
function formatSceneIdAsTitle(id: string): string {
  return id
    .replace(/^section_\d+$/, (match) => {
      const num = parseInt(match.split("_")[1], 10) + 1;
      return `Part ${num}`;
    })
    .replace(/^linked_/, "Related: ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate chapters text for YouTube description
 */
export function generateChaptersText(chapters: YouTubeChapter[]): string {
  return chapters
    .map((chapter) => `${chapter.timestamp} ${chapter.title}`)
    .join("\n");
}

/**
 * Calculate scene timings from composition config
 */
export function calculateSceneTimings(
  scenes: Array<{ id: string; type: string; durationFrames?: number }>,
  fps: number,
  defaultSceneDuration: number,
  transitionDuration: number
): CompositionTiming {
  const sceneTimings: SceneTiming[] = [];
  let currentFrame = 0;

  for (const scene of scenes) {
    const durationFrames = scene.durationFrames || defaultSceneDuration;
    const startSeconds = currentFrame / fps;
    const durationSeconds = durationFrames / fps;

    sceneTimings.push({
      id: scene.id,
      type: scene.type,
      startFrame: currentFrame,
      endFrame: currentFrame + durationFrames,
      durationFrames,
      startSeconds,
      durationSeconds,
    });

    // Add transition buffer
    currentFrame += durationFrames + transitionDuration;
  }

  const totalFrames = currentFrame > transitionDuration
    ? currentFrame - transitionDuration
    : currentFrame;

  return {
    totalFrames,
    fps,
    durationSeconds: totalFrames / fps,
    scenes: sceneTimings,
  };
}

/**
 * Validate chapters for YouTube requirements
 * - First chapter must be at 0:00
 * - Minimum 3 chapters
 * - Each chapter at least 10 seconds apart
 */
export function validateChapters(chapters: YouTubeChapter[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (chapters.length < 3) {
    errors.push("YouTube requires at least 3 chapters");
  }

  if (chapters.length > 0 && chapters[0].timestampSeconds !== 0) {
    errors.push("First chapter must start at 0:00");
  }

  for (let i = 1; i < chapters.length; i++) {
    const gap = chapters[i].timestampSeconds - chapters[i - 1].timestampSeconds;
    if (gap < 10) {
      errors.push(
        `Chapters ${i} and ${i + 1} are less than 10 seconds apart`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
