export const FPS = 60;

// Scene timings (synced from audio-metadata.json with 1.5s buffer)
// Audio durations: hook=10.32, problem=9.84, promise=9.14, whitehead-intro=11.57,
// actual-occasions=10.99, dependent-origination=12.17, emptiness=13.63, journey=13.06,
// convergence=12.77, interbeing=10.78, differences=11.26, ethics=11.14,
// modern-relevance=11.95, conclusion=11.90, takeaway=8.16
// Total audio: ~169 seconds

export const SCENES = {
  hook: { start: 0, duration: 12 },
  problem: { start: 12, duration: 11 },
  promise: { start: 23, duration: 11 },
  whiteheadIntro: { start: 34, duration: 13 },
  actualOccasions: { start: 47, duration: 13 },
  dependentOrigination: { start: 60, duration: 14 },
  emptiness: { start: 74, duration: 15 },
  journey: { start: 89, duration: 15 },
  convergence: { start: 104, duration: 14 },
  interbeing: { start: 118, duration: 12 },
  differences: { start: 130, duration: 13 },
  ethics: { start: 143, duration: 13 },
  modernRelevance: { start: 156, duration: 13 },
  conclusion: { start: 169, duration: 14 },
  takeaway: { start: 183, duration: 10 },
};

// Total duration in seconds (~3:13)
export const TOTAL_DURATION_SECONDS = 193;
export const TOTAL_DURATION = TOTAL_DURATION_SECONDS * FPS;

// Color palette - philosophical/mystical theme
export const COLORS = {
  primary: '#667eea',      // Indigo
  secondary: '#764ba2',    // Purple
  accent: '#f093fb',       // Pink
  background: '#0f0f23',   // Deep navy
  backgroundAlt: '#1a1a2e', // Slightly lighter navy
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  gold: '#ffd700',
  eastern: '#ff6b6b',      // Warm red for Buddhist concepts
  western: '#4ecdc4',      // Teal for Western philosophy
};

// Typography
export const TYPOGRAPHY = {
  title: {
    fontSize: 72,
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: 700,
  },
  body: {
    fontSize: 36,
    fontWeight: 500,
  },
  caption: {
    fontSize: 28,
    fontWeight: 400,
  },
};
