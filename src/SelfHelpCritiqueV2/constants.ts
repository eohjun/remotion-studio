// 자기개발 비판 V2 - 옵시디언 노트 기반 풍성한 버전

export const COLORS = {
  primary: "#667eea",
  secondary: "#764ba2",
  dark: "#1a1a2e",
  light: "#f8f9fa",
  white: "#ffffff",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  accent: "#00c2ff",
  purple: "#9b59b6",
  orange: "#e67e22",
};

export const GRADIENT = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`;
export const DARK_GRADIENT = `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`;

export const FONT_FAMILY = {
  title: "Pretendard, SF Pro Display, -apple-system, sans-serif",
  body: "Pretendard, SF Pro Text, -apple-system, sans-serif",
};

// Scene timing (in frames at 30fps) - based on ElevenLabs audio durations
export const SCENES = {
  intro: { start: 0, duration: 250 },           // ~8s
  twoFaces: { start: 250, duration: 520 },      // ~17s
  neoliberalism: { start: 770, duration: 590 }, // ~19.4s
  positivity: { start: 1360, duration: 500 },   // ~16.3s
  mindsetLimit: { start: 1860, duration: 490 }, // ~16s
  selfEfficacy: { start: 2350, duration: 410 }, // ~13.4s
  outro: { start: 2760, duration: 480 },        // ~15.8s
};

export const TOTAL_DURATION = 3240; // ~108 seconds at 30fps
