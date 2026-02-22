// DunbarNumber - 던바의 수: 인간관계의 한계
// Actual duration: ~125 seconds (2:05)

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (synced with actual TTS audio)
export const SCENES = {
  hook: { start: 0, duration: 21 },       // 20.112s audio
  science: { start: 21, duration: 31 },    // 30.744s audio
  layers: { start: 52, duration: 32 },     // 31.68s audio
  digital: { start: 84, duration: 29 },    // 28.704s audio
  outro: { start: 113, duration: 12 },     // 11.472s audio
} as const;

// Total duration: ~125 seconds
export const TOTAL_DURATION_SECONDS = 125;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS;

// Theme colors
export const THEME = {
  primary: "#6366f1",      // Indigo
  secondary: "#4f46e5",    // Deep indigo
  accent: "#f59e0b",       // Amber
  tertiary: "#06b6d4",     // Cyan
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
  background: "#0f0a1a",
  backgroundAlt: "#1a1033",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
} as const;

// Convert seconds to frames helper
export const toFrames = (seconds: number) => Math.round(seconds * FPS);

// Audio paths
export const AUDIO_BASE = "videos/DunbarNumber/audio";

// AI assets base path
export const AI_ASSETS_BASE = "videos/DunbarNumber/ai-assets";

// Video configuration export
export const VIDEO_CONFIG = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  totalFrames: TOTAL_DURATION,
  durationSeconds: TOTAL_DURATION_SECONDS,
} as const;
