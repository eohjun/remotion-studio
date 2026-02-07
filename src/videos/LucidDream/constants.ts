// LucidDream - 자각몽의 과학
// Actual duration: ~212 seconds (3:32)

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (synced with actual TTS audio)
export const SCENES = {
  hook: { start: 0, duration: 20 },                // 19.44s audio
  whatIs: { start: 20, duration: 30 },              // 29.38s audio
  science: { start: 50, duration: 38 },             // 37.82s audio
  techniques: { start: 88, duration: 47 },          // 46.30s audio
  benefits: { start: 135, duration: 35 },            // 34.46s audio
  risks: { start: 170, duration: 28 },               // 27.29s audio
  outro: { start: 198, duration: 14 },               // 13.63s audio
} as const;

// Total duration: ~212 seconds (synced with actual audio)
export const TOTAL_DURATION_SECONDS = 212;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS;

// Theme colors
export const THEME = {
  primary: "#7B68EE",     // Slate blue
  secondary: "#4B0082",    // Indigo
  accent: "#FFD700",       // Gold
  tertiary: "#00CED1",     // Dark turquoise
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
  background: "#0a0a1a",
  backgroundAlt: "#0f0f2a",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
} as const;

// Convert seconds to frames helper
export const toFrames = (seconds: number) => Math.round(seconds * FPS);

// Audio paths
export const AUDIO_BASE = "videos/LucidDream/audio";

// AI assets base path
export const AI_ASSETS_BASE = "videos/LucidDream/ai-assets";

// Video configuration export for registry
export const VIDEO_CONFIG = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  totalFrames: TOTAL_DURATION,
  durationSeconds: TOTAL_DURATION_SECONDS,
} as const;
