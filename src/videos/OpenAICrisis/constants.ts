/**
 * Constants for OpenAI Crisis Video
 * "OpenAI의 위기 - 인류를 위한 AI, 그 약속은 어디로 갔는가"
 *
 * Scene durations synced with audio metadata (2026-01-23)
 */

export const FPS = 30;

// Scene timings synced with actual audio durations
export const SCENES = {
  HOOK: { start: 0, duration: 540 },
  PROMISE: { start: 540, duration: 502 },
  BOARD_DRAMA: { start: 1042, duration: 636 },
  BOARD_DRAMA_RESOLUTION: { start: 1678, duration: 570 },
  SAFETY_EXODUS: { start: 2248, duration: 558 },
  SAFETY_QUOTES: { start: 2806, duration: 600 },
  NDA_SCANDAL: { start: 3406, duration: 635 },
  ALTMAN_RESPONSE: { start: 4041, duration: 373 },
  STRUCTURE_CHANGE: { start: 4414, duration: 676 },
  STRUCTURE_NUMBERS: { start: 5090, duration: 504 },
  RESOLUTION: { start: 5594, duration: 664 },
} as const;

export const TOTAL_DURATION =
  SCENES.HOOK.duration +
  SCENES.PROMISE.duration +
  SCENES.BOARD_DRAMA.duration +
  SCENES.BOARD_DRAMA_RESOLUTION.duration +
  SCENES.SAFETY_EXODUS.duration +
  SCENES.SAFETY_QUOTES.duration +
  SCENES.NDA_SCANDAL.duration +
  SCENES.ALTMAN_RESPONSE.duration +
  SCENES.STRUCTURE_CHANGE.duration +
  SCENES.STRUCTURE_NUMBERS.duration +
  SCENES.RESOLUTION.duration;
// Total: 6258 frames = ~3:28 at 30fps

// Visual theme
export const THEME = {
  primaryColor: "#dc3545",
  secondaryColor: "#1a1a2e",
  accentColor: "#ff6b6b",
  warningColor: "#ffc107",
  successColor: "#28a745",
  textColor: "#ffffff",
  backgroundColor: "#0d1117",
} as const;

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "OpenAI의 위기 - 인류를 위한 AI, 그 약속은 어디로 갔는가",
  description: `CEO 해임 드라마, 안전팀 대탈주, NDA 스캔들, 비영리에서 영리로의 전환.
인류를 위한 AI를 만들겠다던 OpenAI에서 벌어진 충격적인 4가지 사건을 살펴봅니다.`,
  tags: [
    "OpenAI",
    "Sam Altman",
    "AI 안전",
    "인공지능",
    "테크 기업",
    "비영리",
    "스타트업",
    "NDA",
    "Ilya Sutskever",
  ],
} as const;
