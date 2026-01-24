/**
 * Constants for Stress Management Cycle Video
 * "스트레스 사이클: 당신이 지친 진짜 이유"
 *
 * Based on Emily Nagoski's research and HPA axis science.
 * Scene durations calculated for ~2:25 total (8700 frames at 60fps)
 */

export const FPS = 60;

// Scene durations in frames (60fps) - synced with actual audio durations
// Total: 9256 frames = 154.3 seconds = 2:34
export const SCENE_DURATIONS = {
  HOOK: 798,                 // 13.3s - Shocking statistic
  PROBLEM: 932,              // 15.5s - Emily Nagoski insight
  CYCLE_EXPLAINED: 1126,     // 18.8s - Stress cycle (CycleDiagram)
  INCOMPLETE_CYCLE: 1144,    // 19.1s - Ancient vs modern comparison
  MINDSET: 1328,             // 22.1s - 43% study data
  SOLUTION_PHYSICAL: 1364,   // 22.7s - Physical activity
  SOLUTION_BREATHING: 1282,  // 21.4s - Breathing techniques
  CONCLUSION: 1008,          // 16.8s - Core message
  OUTRO: 274,                // 4.6s - Call to action
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

// Total duration: 9256 frames = 154 seconds at 60fps
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Visual theme - Health/wellness focused
export const THEME = {
  primaryColor: "#667eea",     // Base purple (calm)
  secondaryColor: "#764ba2",   // Darker purple
  accentColor: "#00c2ff",      // Cyan (cycle visualization)
  dangerColor: "#dc3545",      // Red (warning/stress)
  successColor: "#28a745",     // Green (solutions/hope)
  warningColor: "#ffc107",     // Yellow (caution)
  backgroundColor: "#1a1a2e",  // Dark background
  textColor: "#ffffff",        // White text
} as const;

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "스트레스 사이클: 당신이 지친 진짜 이유",
  description: `충분히 쉬어도 피곤한 이유, 알고 계셨나요?
스트레스 자체가 아니라 '완료되지 않은 스트레스 사이클'이 문제입니다.

Emily Nagoski 박사의 연구와 HPA 축 과학을 바탕으로,
스트레스 사이클을 완료하는 과학적 방법을 알아봅니다.

#스트레스관리 #번아웃 #HPA축 #코르티솔 #스트레스사이클`,
  tags: [
    "스트레스 관리",
    "스트레스 사이클",
    "번아웃",
    "Emily Nagoski",
    "HPA 축",
    "코르티솔",
    "호흡법",
    "박스 호흡",
    "만성 피로",
    "건강 심리학",
  ],
} as const;
