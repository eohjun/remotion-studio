/**
 * Constants for TwoMinuteRule YouTube Shorts
 * "The 2-Minute Rule" - Beating procrastination
 *
 * Format: 9:16 vertical (1080x1920)
 * Duration: 30 seconds at 60fps = 1800 frames
 */

export const FPS = 60;

// Video dimensions (Shorts format)
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Scene durations in frames (60fps) - synced with actual TTS audio
// Total: ~1500 frames = 25 seconds
export const SCENE_DURATIONS = {
  HOOK: 210,           // 3.5s (audio: 2.88s + padding)
  PROBLEM: 450,        // 7.5s (audio: 6.55s + padding)
  SOLUTION: 540,       // 9s (audio: 7.66s + padding)
  TAKEAWAY: 360,       // 6s (audio: 4.32s + padding)
} as const;

// Calculate scene start times
const createScenes = () => {
  let currentFrame = 0;
  const scenes: Record<string, { start: number; duration: number }> = {};

  for (const [key, duration] of Object.entries(SCENE_DURATIONS)) {
    scenes[key] = { start: currentFrame, duration };
    currentFrame += duration;
  }

  return scenes;
};

export const SCENES = createScenes() as {
  readonly [K in keyof typeof SCENE_DURATIONS]: { start: number; duration: number };
};

// Total duration
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Visual theme - Energetic, attention-grabbing
export const THEME = {
  primaryColor: "#ff6b6b",     // Coral red (energy)
  secondaryColor: "#4ecdc4",   // Teal (contrast)
  accentColor: "#ffe66d",      // Yellow (highlight)
  backgroundColor: "#1a1a2e",  // Dark background
  textColor: "#ffffff",        // White text
} as const;

// Shorts-specific layout
export const SHORTS_LAYOUT = {
  padding: {
    horizontal: 40,
    vertical: 80,
  },
  contentArea: {
    width: 1000,  // 1080 - 40*2
    height: 1760, // 1920 - 80*2
  },
  textArea: {
    maxWidth: 900,
  },
} as const;
