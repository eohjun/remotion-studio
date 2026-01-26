/**
 * DevCompetencyComparison - Video Configuration
 *
 * 개발자 역량 비교: 백엔드 vs 프론트엔드 vs 풀스택 vs DevOps
 */

export const VIDEO_CONFIG = {
  id: "DevCompetencyComparison",
  title: "개발자 역량의 진실: 백엔드가 정말 더 어려울까?",
  fps: 30,
  width: 1920,
  height: 1080,
  totalFrames: 5857, // 195 seconds (synced from audio)
  language: "ko",
} as const;

// Radar chart data - 8 dimensions x 4 developer types
export const COMPETENCY_DATA = {
  labels: [
    "기술깊이",
    "기술폭",
    "문제해결",
    "커뮤니케이션",
    "학습곡선",
    "시스템사고",
    "AI활용",
    "인프라",
  ],
  series: [
    {
      name: "Frontend",
      values: [70, 85, 75, 80, 90, 60, 80, 45],
      color: "#00c2ff",
    },
    {
      name: "Backend",
      values: [85, 65, 85, 70, 70, 80, 75, 70],
      color: "#667eea",
    },
    {
      name: "Full-Stack",
      values: [70, 90, 80, 85, 85, 90, 85, 75],
      color: "#28a745",
    },
    {
      name: "DevOps",
      values: [75, 80, 85, 75, 80, 95, 70, 95],
      color: "#e67e22",
    },
  ],
} as const;

// Color palette
export const COLORS = {
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00c2ff",
  frontend: "#00c2ff",
  backend: "#667eea",
  fullstack: "#28a745",
  devops: "#e67e22",
  danger: "#e94560",
  dark: "#1a1a2e",
  darkAlt: "#16213e",
  text: "#ffffff",
  textMuted: "#b0b0b0",
} as const;

// Scene durations in frames (30fps) - synced from audio metadata
export const SCENE_FRAMES = {
  hook: 340,              // 11.3s (audio: 9.8s)
  promise: 421,           // 14.0s (audio: 12.5s)
  radarReveal: 467,       // 15.5s (audio: 14.0s)
  learningParadox: 758,   // 25.3s (audio: 23.8s)
  fullstackTradeoff: 657, // 21.9s (audio: 20.4s)
  aiAmplifier: 627,       // 20.9s (audio: 19.4s)
  devopsUniqueness: 495,  // 16.5s (audio: 15.0s)
  stats2026: 628,         // 20.9s (audio: 19.4s)
  synthesis: 785,         // 26.1s (audio: 24.6s)
  conclusion: 502,        // 16.7s (audio: 15.2s)
  outro: 177,             // 5.9s (audio: 4.4s)
} as const;

// Calculate start frames (cumulative)
export const SCENE_START_FRAMES = {
  hook: 0,
  promise: 340,
  radarReveal: 761,
  learningParadox: 1228,
  fullstackTradeoff: 1986,
  aiAmplifier: 2643,
  devopsUniqueness: 3270,
  stats2026: 3765,
  synthesis: 4393,
  conclusion: 5178,
  outro: 5680,
} as const;
