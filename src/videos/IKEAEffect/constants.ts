// IKEAEffect - 이케아 효과: 내가 만든 것이 왜 더 소중한가
// Estimated duration: ~164 seconds (2:44)

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (will be synced with actual TTS audio by generate-tts.mjs)
export const SCENES = {
  intro: { start: 0, duration: 4 },               // 3.41s audio
  hook: { start: 4, duration: 24 },                // 22.99s audio
  betty_crocker: { start: 28, duration: 28 },      // 27.77s audio
  experiment: { start: 56, duration: 31 },          // 30.50s audio
  origami: { start: 87, duration: 30 },             // 29.47s audio
  why_it_works: { start: 117, duration: 30 },       // 29.90s audio
  real_world: { start: 147, duration: 28 },          // 26.93s audio
  dark_side: { start: 175, duration: 31 },           // 30.43s audio
  takeaway: { start: 206, duration: 27 },            // 26.57s audio
  outro: { start: 233, duration: 14 },               // 13.51s audio
} as const;

// Total duration: ~184 seconds (with buffer)
export const TOTAL_DURATION_SECONDS = 247;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS;

// Theme colors - warm craft aesthetic
export const THEME = {
  primary: "#D4A574",     // Warm wood
  secondary: "#8B6F47",   // Dark wood
  accent: "#F4C430",      // Golden yellow
  tertiary: "#5B9BD5",    // Calm blue
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
  background: "#1a1510",
  backgroundAlt: "#251e15",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
} as const;

// Convert seconds to frames helper
export const toFrames = (seconds: number) => Math.round(seconds * FPS);

// Audio paths
export const AUDIO_BASE = "videos/IKEAEffect/audio";

// AI assets base path
export const AI_ASSETS_BASE = "videos/IKEAEffect/ai-assets";

// Video configuration export for registry
export const VIDEO_CONFIG = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  totalFrames: TOTAL_DURATION,
  durationSeconds: TOTAL_DURATION_SECONDS,
} as const;
