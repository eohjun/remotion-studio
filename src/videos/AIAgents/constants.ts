// AIAgents - The Rise of AI Agents
// Estimated duration: ~240 seconds (4:00) — will be synced by generate-tts.mjs

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (estimates, will be synced with actual TTS audio)
export const SCENES = {
  hook: { start: 0, duration: 21 },                // 20.28s audio
  whatAre: { start: 21, duration: 31 },             // 30.26s audio
  howWork: { start: 52, duration: 36 },             // 35.09s audio
  examples: { start: 88, duration: 45 },            // 44.26s audio
  multiAgent: { start: 133, duration: 40 },          // 39.29s audio
  risks: { start: 173, duration: 26 },               // 25.51s audio
  outro: { start: 199, duration: 15 },               // 13.97s audio
} as const;

// Total duration
export const TOTAL_DURATION_SECONDS = 214;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS;

// Theme colors — tech/futuristic
export const THEME = {
  primary: "#00D4FF",       // Electric cyan
  secondary: "#7B61FF",     // Purple
  accent: "#00FF88",        // Neon green
  tertiary: "#FF6B35",      // Orange
  success: "#00FF88",
  warning: "#FFB800",
  danger: "#FF4444",
  background: "#0a0f1a",    // Deep navy
  backgroundAlt: "#0f1428",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
} as const;

// Convert seconds to frames helper
export const toFrames = (seconds: number) => Math.round(seconds * FPS);

// Audio paths
export const AUDIO_BASE = "videos/AIAgents/audio";

// AI assets base path
export const AI_ASSETS_BASE = "videos/AIAgents/ai-assets";

// Video configuration export for registry
export const VIDEO_CONFIG = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  totalFrames: TOTAL_DURATION,
  durationSeconds: TOTAL_DURATION_SECONDS,
} as const;
