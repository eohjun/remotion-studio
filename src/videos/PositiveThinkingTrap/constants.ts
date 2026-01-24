/**
 * Constants for Positive Thinking Trap Video
 * "긍정 사고의 함정 - 긍정성이 문제를 은폐하고 사회적 책임을 개인화하는 방식"
 *
 * Based on Barbara Ehrenreich's "Bright-Sided" and psychology research
 * Scene durations calculated for ~3:30 total (12600 frames at 60fps)
 */

export const FPS = 60;

// Scene durations in frames (60fps)
// Total: 12600 frames = 210 seconds = 3:30
export const SCENE_DURATIONS = {
  INTRO: 720,               // 12s - Title + hook
  INDUSTRY: 1200,           // 20s - Positivity industry overview
  EHRENREICH: 1200,         // 20s - Ehrenreich's criticism
  TOXIC_POSITIVITY: 2400,   // 40s - Psychology of toxic positivity
  SOCIAL_BLAME: 2400,       // 40s - Individualization of social responsibility
  ALTERNATIVE: 1800,        // 30s - Balanced alternatives
  OUTRO: 2880,              // 48s - Conclusion & takeaways
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

// Total duration: 12600 frames = 210 seconds at 60fps
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Visual theme - Critical, thought-provoking color scheme
export const THEME = {
  primaryColor: "#667eea",     // Base purple
  secondaryColor: "#764ba2",   // Darker purple
  accentColor: "#e94560",      // Warning red (for criticism)
  warningColor: "#f59e0b",     // Orange (toxic positivity)
  successColor: "#22c55e",     // Green (balanced alternative)
  backgroundColor: "#1a1a2e",  // Dark background
  textColor: "#ffffff",        // White text
} as const;

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "긍정 사고의 함정 - 낙관주의가 위험해지는 순간",
  description: `"긍정적으로 생각하면 모든 게 잘 될 거야" - 이 말이 위험한 이유.

Barbara Ehrenreich의 "Bright-Sided"와 심리학 연구를 바탕으로,
독성 긍정성(Toxic Positivity)의 문제점과 진정한 회복력을 탐구합니다.

#긍정심리학비판 #독성긍정성 #BarbaraEhrenreich #현실주의 #심리학`,
  tags: [
    "긍정 사고",
    "독성 긍정성",
    "toxic positivity",
    "Barbara Ehrenreich",
    "Bright-Sided",
    "심리학",
    "자기계발 비판",
    "사회적 책임",
    "현실주의",
    "회복력",
  ],
} as const;
