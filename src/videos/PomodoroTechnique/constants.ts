// Pomodoro Technique Video Constants
// 뽀모도로 테크닉: 25분의 마법
// Synced with actual TTS audio durations

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in seconds (synced with actual TTS audio + padding)
// Total audio: ~235 seconds (3:55) + transitions = ~254 seconds
export const SCENES = {
  intro: { start: 0, duration: 3 },               // 2.28s audio
  hook: { start: 3, duration: 26 },                // 25.20s audio
  origin: { start: 29, duration: 28 },              // 27.31s audio
  methodology: { start: 57, duration: 23 },         // 22.34s audio
  science: { start: 80, duration: 30 },             // 28.92s audio
  benefits: { start: 110, duration: 32 },            // 30.94s audio
  mistakes: { start: 142, duration: 32 },            // 31.13s audio
  variations: { start: 174, duration: 26 },          // 25.85s audio
  implementation: { start: 200, duration: 25 },      // 24.62s audio
  takeaway: { start: 225, duration: 18 },            // 16.94s audio
} as const;

// Total duration: ~254 seconds (4:14)
export const TOTAL_DURATION_SECONDS = 243;
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
