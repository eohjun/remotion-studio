// Zeigarnik Effect Video Constants
// Target duration: ~145 seconds (2:25)

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (synced with actual TTS audio)
export const SCENES = {
  intro: { start: 0, duration: 3.8 },
  hook: { start: 3.8, duration: 19.3 },
  discovery: { start: 23.1, duration: 16.5 },
  mechanism: { start: 39.6, duration: 16.2 },
  studyApplication: { start: 55.8, duration: 15.5 },
  productivityHack: { start: 71.3, duration: 19.1 },
  darkSide: { start: 90.4, duration: 14.7 },
  solution: { start: 105.1, duration: 15.6 },
  takeaway: { start: 120.7, duration: 17.7 },
} as const;

// Total duration: ~138 seconds (synced with actual audio)
export const TOTAL_DURATION_SECONDS = 139;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS; // 8700 frames

// Theme colors
export const THEME = {
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00c2ff",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
  background: "#1a1a2e",
  backgroundAlt: "#16213e",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
} as const;

// Convert seconds to frames helper
export const toFrames = (seconds: number) => seconds * FPS;

// Audio paths
export const AUDIO_BASE = "videos/ZeigarnikEffect/audio";

// Video configuration export for registry
export const VIDEO_CONFIG = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  totalFrames: TOTAL_DURATION,
  durationSeconds: TOTAL_DURATION_SECONDS,
} as const;
