// Parkinson's Law Video Constants
// Synced with audio durations from TTS generation

export const FPS = 60;

// Scene durations in seconds (synced from audio metadata + buffer)
export const SCENES = {
  hook: { start: 0, duration: 12 },       // audio: 11.3s
  intro: { start: 12, duration: 18 },     // audio: 17.4s
  problem: { start: 30, duration: 14 },   // audio: 13.1s
  evidence: { start: 44, duration: 17 },  // audio: 16.1s
  realworld: { start: 61, duration: 14 }, // audio: 13.1s
  solution1: { start: 75, duration: 11 }, // audio: 9.9s
  solution2: { start: 86, duration: 9 },  // audio: 8.0s
  solution3: { start: 95, duration: 9 },  // audio: 8.4s
  conclusion: { start: 104, duration: 11 }, // audio: 10.3s
  takeaway: { start: 115, duration: 11 }, // audio: 10.1s
} as const;

// Total duration: ~126 seconds (2:06)
export const TOTAL_DURATION = 126 * FPS; // 7560 frames

// Theme colors - philosophical/productivity palette
export const THEME = {
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#f093fb",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
  background: "#1a1a2e",
  backgroundAlt: "#16213e",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
};

// Convert to frames helper
export const toFrames = (seconds: number) => seconds * FPS;

// Audio paths
export const AUDIO_BASE = "videos/ParkinsonsLaw/audio";
