// Pomodoro Technique Video Constants
// 뽀모도로 테크닉: 25분의 마법
// Synced with actual TTS audio durations

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (synced with actual TTS audio + padding)
// Total audio: ~235 seconds (3:55) + transitions = ~254 seconds
export const SCENES = {
  intro: { start: 0, duration: 4 },        // 2.28s audio + padding
  hook: { start: 4, duration: 27 },        // 25.2s audio
  origin: { start: 31, duration: 29 },     // 27.312s audio
  methodology: { start: 60, duration: 24 }, // 22.344s audio
  science: { start: 84, duration: 31 },    // 28.92s audio
  benefits: { start: 115, duration: 32 },  // 30.24s audio
  mistakes: { start: 147, duration: 33 },  // 31.128s audio
  variations: { start: 180, duration: 28 }, // 25.848s audio
  implementation: { start: 208, duration: 27 }, // 24.624s audio
  takeaway: { start: 235, duration: 19 },  // 16.944s audio
} as const;

// Total duration: ~254 seconds (4:14)
export const TOTAL_DURATION_SECONDS = 254;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS;

// Theme colors - Tomato red inspired
export const THEME = {
  primary: "#e74c3c",        // Tomato red
  secondary: "#27ae60",      // Fresh green (for breaks)
  accent: "#f39c12",         // Timer yellow
  success: "#2ecc71",        // Success green
  warning: "#e67e22",        // Warning orange
  danger: "#c0392b",         // Deep red
  background: "#1a1a2e",     // Dark background
  backgroundAlt: "#16213e",  // Alt background
  text: "#ffffff",           // White text
  textMuted: "rgba(255, 255, 255, 0.7)",
} as const;

// Convert seconds to frames helper
export const toFrames = (seconds: number) => seconds * FPS;

// Audio paths
export const AUDIO_BASE = "videos/PomodoroTechnique/audio";

// Video configuration export for registry
export const VIDEO_CONFIG = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  totalFrames: TOTAL_DURATION,
  durationSeconds: TOTAL_DURATION_SECONDS,
} as const;
