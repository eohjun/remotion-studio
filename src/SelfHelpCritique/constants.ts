// 자기개발 비판 영상 상수

export const COLORS = {
  primary: "#667eea",
  secondary: "#764ba2",
  dark: "#343a40",
  light: "#f8f9fa",
  white: "#ffffff",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#fff3cd",
  accent: "#00c2ff",
};

export const GRADIENT = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`;

export const FONT_FAMILY = {
  title: "Pretendard, SF Pro Display, -apple-system, sans-serif",
  body: "Pretendard, SF Pro Text, -apple-system, sans-serif",
};

// Scene timing (in frames at 30fps) - synced with audio durations
export const SCENES = {
  intro: { start: 0, duration: 320 },           // 10.4s + buffer
  keyInsight: { start: 320, duration: 310 },    // 10.1s + buffer
  stats: { start: 630, duration: 160 },         // 4.9s + buffer
  viciousCycle: { start: 790, duration: 320 },  // 10.4s + buffer
  comparison: { start: 1110, duration: 330 },   // 10.7s + buffer
  outro: { start: 1440, duration: 280 },        // 8.9s + buffer
};

export const TOTAL_DURATION = 1720; // ~57 seconds at 30fps
