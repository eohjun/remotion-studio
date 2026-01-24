/**
 * Constants for AI Basic Law Video
 * "대한민국 AI 기본법, 3분 완벽 정리"
 *
 * Scene durations synced with actual audio lengths (2026-01-24)
 */

export const FPS = 30;

// Scene durations in frames (30fps) - synced from audio metadata
export const SCENE_DURATIONS = {
  INTRO: 420,                    // 14.0s (audio: 12.5s)
  HOOK: 419,                     // 14.0s (audio: 12.5s)
  TWO_PILLARS: 483,              // 16.1s (audio: 14.6s)
  HIGH_IMPACT_AI: 426,           // 14.2s (audio: 12.7s)
  HIGH_IMPACT_OBLIGATION: 403,   // 13.4s (audio: 11.9s)
  WATERMARK: 396,                // 13.2s (audio: 11.7s)
  COMMITTEE: 447,                // 14.9s (audio: 13.4s)
  EU_COMPARISON: 495,            // 16.5s (audio: 15.0s)
  CONCERNS: 482,                 // 16.0s (audio: 14.5s)
  OUTRO: 377,                    // 12.6s (audio: 11.1s)
} as const;

// Calculate scene start times
export const SCENES = {
  INTRO: { start: 0, duration: SCENE_DURATIONS.INTRO },
  HOOK: {
    start: SCENE_DURATIONS.INTRO,
    duration: SCENE_DURATIONS.HOOK
  },
  TWO_PILLARS: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK,
    duration: SCENE_DURATIONS.TWO_PILLARS
  },
  HIGH_IMPACT_AI: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS,
    duration: SCENE_DURATIONS.HIGH_IMPACT_AI
  },
  HIGH_IMPACT_OBLIGATION: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS + SCENE_DURATIONS.HIGH_IMPACT_AI,
    duration: SCENE_DURATIONS.HIGH_IMPACT_OBLIGATION
  },
  WATERMARK: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS + SCENE_DURATIONS.HIGH_IMPACT_AI + SCENE_DURATIONS.HIGH_IMPACT_OBLIGATION,
    duration: SCENE_DURATIONS.WATERMARK
  },
  COMMITTEE: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS + SCENE_DURATIONS.HIGH_IMPACT_AI + SCENE_DURATIONS.HIGH_IMPACT_OBLIGATION + SCENE_DURATIONS.WATERMARK,
    duration: SCENE_DURATIONS.COMMITTEE
  },
  EU_COMPARISON: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS + SCENE_DURATIONS.HIGH_IMPACT_AI + SCENE_DURATIONS.HIGH_IMPACT_OBLIGATION + SCENE_DURATIONS.WATERMARK + SCENE_DURATIONS.COMMITTEE,
    duration: SCENE_DURATIONS.EU_COMPARISON
  },
  CONCERNS: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS + SCENE_DURATIONS.HIGH_IMPACT_AI + SCENE_DURATIONS.HIGH_IMPACT_OBLIGATION + SCENE_DURATIONS.WATERMARK + SCENE_DURATIONS.COMMITTEE + SCENE_DURATIONS.EU_COMPARISON,
    duration: SCENE_DURATIONS.CONCERNS
  },
  OUTRO: {
    start: SCENE_DURATIONS.INTRO + SCENE_DURATIONS.HOOK + SCENE_DURATIONS.TWO_PILLARS + SCENE_DURATIONS.HIGH_IMPACT_AI + SCENE_DURATIONS.HIGH_IMPACT_OBLIGATION + SCENE_DURATIONS.WATERMARK + SCENE_DURATIONS.COMMITTEE + SCENE_DURATIONS.EU_COMPARISON + SCENE_DURATIONS.CONCERNS,
    duration: SCENE_DURATIONS.OUTRO
  },
} as const;

// Total duration: 4348 frames = ~2:25 at 30fps
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Visual theme
export const THEME = {
  primaryColor: "#667eea",
  secondaryColor: "#1a1a2e",
  accentColor: "#00c2ff",
  warningColor: "#dc3545",
  successColor: "#28a745",
  textColor: "#ffffff",
  backgroundColor: "#0d1117",
} as const;

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "대한민국 AI 기본법, 3분 완벽 정리",
  description: `2026년 1월 시행되는 AI 기본법의 모든 것.
고영향 AI, 생성형 AI 워터마크, 국가인공지능위원회까지.
EU와 비교해서 한국은 어디가 다를까요?`,
  tags: [
    "AI 기본법",
    "인공지능 기본법",
    "고영향 AI",
    "생성형 AI",
    "워터마크",
    "EU AI Act",
    "인공지능 규제",
    "2026년 시행",
    "국가인공지능위원회",
  ],
} as const;
