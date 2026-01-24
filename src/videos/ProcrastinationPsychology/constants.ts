/**
 * Constants for Procrastination Psychology Video
 * "프로크래스티네이션의 심리학 - 당신의 뇌 안에서 벌어지는 전쟁"
 *
 * Scene durations calculated to match 270 seconds total (8100 frames at 30fps)
 */

export const FPS = 30;

// Scene durations in frames (30fps) - synced from audio metadata
// Total: 10050 frames = 335 seconds = 5:35
export const SCENE_DURATIONS = {
  INTRO: 109,                    // 3.6s (audio: 2.1s)
  HOOK: 477,                     // 15.9s (audio: 14.4s)
  STATISTICS: 652,               // 21.7s (audio: 20.2s)
  BRAIN_SYSTEMS: 620,            // 20.7s (audio: 19.2s)
  CONFLICT_MECHANISM: 574,       // 19.1s (audio: 17.6s)
  FMRI_EVIDENCE: 685,            // 22.8s (audio: 21.3s)
  STEEL_EQUATION_INTRO: 609,     // 20.3s (audio: 18.8s)
  EQUATION_INSIGHT: 593,         // 19.7s (audio: 18.2s)
  PROCRASTINATOR_TYPES: 645,     // 21.5s (audio: 20.0s)
  HEALTH_IMPACT: 849,            // 28.3s (audio: 26.8s)
  STRATEGY_INTRO: 223,           // 7.4s (audio: 5.9s)
  FIVE_SECOND_RULE: 457,         // 15.2s (audio: 13.7s)
  TASK_DECOMPOSITION: 501,       // 16.7s (audio: 15.2s)
  SPECIFIC_DEADLINES: 592,       // 19.7s (audio: 18.2s)
  HABIT_FORMATION: 613,          // 20.4s (audio: 18.9s)
  NEUROSCIENCE_TOOLS: 891,       // 29.7s (audio: 28.2s)
  CONCLUSION: 711,               // 23.7s (audio: 22.2s)
  OUTRO: 249,                    // 8.3s (audio: 6.8s)
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

// Total duration: 8100 frames = 270 seconds at 30fps
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Visual theme - from video-plan.json colorScheme
export const THEME = {
  primaryColor: "#1a1a2e",
  secondaryColor: "#16213e",
  accentColor: "#e94560",
  limbicColor: "#e94560",      // Red for limbic system (emotional, instinctive)
  prefrontalColor: "#4a90d9",  // Blue for prefrontal cortex (rational, planning)
  successColor: "#22c55e",
  textColor: "#ffffff",
  backgroundColor: "#1a1a2e",
} as const;

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "프로크래스티네이션의 심리학 - 당신의 뇌 안에서 벌어지는 전쟁",
  description: `미루기는 게으름이 아니라 뇌의 구조적 갈등이다.
변연계와 전전두엽 피질의 전투를 이해하고, 과학적 전략으로 프로크래스티네이션을 극복하는 방법.

#미루기 #프로크래스티네이션 #뇌과학 #심리학 #자기개발`,
  tags: [
    "프로크래스티네이션",
    "미루기",
    "뇌과학",
    "심리학",
    "변연계",
    "전전두엽",
    "습관",
    "자기개발",
    "동기부여",
    "5초 규칙",
  ],
} as const;
