// ═══════════════════════════════════════════════════════════════════════════
// Remotion Studio - Unified Design Constants
// ═══════════════════════════════════════════════════════════════════════════
//
// ⚠️ IMPORTANT: 1920x1080 영상에서 요소가 작으면 시청자가 읽기 어렵습니다!
//
// 📏 반드시 RECOMMENDED_SIZES를 사용하세요:
//    - hero.emoji: 300px (큰 이모지)
//    - title.main: 84px (제목)
//    - text.body: 38px (본문)
//    - bullet.icon: 64px, bullet.text: 46px (목록)
//    - progressBar: 350x14 (진행바)
//
// 🚫 절대 금지:
//    - 제목 < 48px
//    - 본문 < 28px
//    - 아이콘 < 80px
//    - 이모지 < 200px
//
// ═══════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Primary palette
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00c2ff",

  // Neutral palette
  dark: "#1a1a2e",
  darkAlt: "#16213e",
  light: "#f8f9fa",
  white: "#ffffff",

  // Semantic colors
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",

  // Extended palette
  purple: "#9b59b6",
  orange: "#e67e22",
} as const;

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
  dark: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.success} 0%, #20c997 100%)`,
  danger: `linear-gradient(135deg, ${COLORS.danger} 0%, #e74c3c 100%)`,
} as const;

export const FONT_FAMILY = {
  title: "Pretendard, SF Pro Display, -apple-system, sans-serif",
  body: "Pretendard, SF Pro Text, -apple-system, sans-serif",
} as const;

// Typography scale (optimized for 1920x1080 video)
export const FONT_SIZES = {
  xs: 24,
  sm: 32,
  md: 38,
  lg: 46,
  xl: 56,
  "2xl": 68,
  "3xl": 84,
  "4xl": 100,
} as const;

// Spacing scale
export const SPACING = {
  xs: 10,
  sm: 20,
  md: 40,
  lg: 60,
  xl: 80,
  "2xl": 100,
} as const;

// Layout constants for 1920x1080 video
export const LAYOUT = {
  /** Video dimensions */
  width: 1920,
  height: 1080,

  /** Safe area padding (content should stay within) */
  safeArea: {
    horizontal: 80, // SPACING.xl
    vertical: 60, // SPACING.lg
  },

  /** Maximum content dimensions */
  maxContentWidth: 1760, // 1920 - 80*2
  maxContentHeight: 960, // 1080 - 60*2

  /** Usable content area (after safe padding) */
  contentArea: {
    width: 1760,
    height: 960,
  },

  /** Two-column layout helpers */
  twoColumn: {
    /** 50/50 split */
    equal: { left: "50%", right: "50%" },
    /** 55/45 split (text/visual) */
    textVisual: { left: "55%", right: "45%" },
    /** 60/40 split (primary/secondary) */
    primarySecondary: { left: "60%", right: "40%" },
  },

  /** Maximum heights for common components */
  maxHeights: {
    /** Cycle diagram (with overflow allowance) */
    cycleDiagram: 550,
    /** Comparison cards */
    comparisonCards: 600,
    /** Content section */
    contentSection: 750,
  },

  /** Recommended sizes for diagrams */
  diagram: {
    /** Cycle diagram container */
    cycle: { width: 550, height: 550, radius: 200 },
    /** Process flow */
    flow: { width: 1400, height: 300 },
    /** Comparison layout */
    comparison: { width: 1600, cardWidth: 450 },
  },

  /** Recommended sizes for charts */
  chart: {
    /** Bar chart defaults */
    bar: { maxBarLength: 450, barSize: 120, gap: 80 },
    /** Pie chart */
    pie: { size: 400 },
  },

  /** Icon/circle element sizes */
  iconSizes: {
    sm: 50,
    md: 70,
    lg: 90,
    xl: 110,
  },
} as const;

// Minimum sizes for 1920x1080 video (화면 공간 활용 가이드라인)
export const MIN_SIZES = {
  /** Title text sizes */
  title: {
    main: 64,       // 권장: 72-100
    section: 48,    // 권장: 56-72
    subtitle: 32,   // 권장: 36-46
  },
  /** Card dimensions */
  card: {
    width: 380,     // 권장: 420-500
    padding: 30,    // 권장: 40
    gap: 50,        // 권장: 60-100
  },
  /** Badge/button sizes */
  badge: {
    fontSize: 40,   // 권장: 44-56
    paddingY: 20,   // 권장: 24-28
    paddingX: 40,   // 권장: 48-56
  },
  /** Icon/emoji sizes */
  icon: {
    main: 80,       // 권장: 100-150
    supporting: 40, // 권장: 48-64
  },
  /** Body text */
  body: 28,
} as const;

// Recommended sizes for 1920x1080 video (권장 크기)
// ⚠️ 이 값들을 기본으로 사용하세요. 이보다 작게 만들지 마세요!
export const RECOMMENDED_SIZES = {
  /** Title text sizes */
  title: {
    main: 84,       // 72-100 범위 (씬 제목)
    section: 64,    // 56-72 범위 (섹션 제목)
    subtitle: 42,   // 36-46 범위 (부제목)
  },
  /** Body/description text */
  text: {
    body: 38,       // 32-42 범위 (본문)
    description: 32, // 28-36 범위 (설명)
    label: 32,      // 28-36 범위 (라벨)
    caption: 28,    // 24-32 범위 (캡션)
  },
  /** Hero element (주인공 요소 - 씬의 중심) */
  hero: {
    emoji: 300,     // 250-350 범위 (큰 이모지)
    icon: 280,      // 250-320 범위 (큰 아이콘)
    image: 400,     // 350-500 범위 (이미지 크기)
  },
  /** Icon/emoji sizes */
  icon: {
    main: 120,      // 100-150 범위 (주요 아이콘)
    bullet: 64,     // 56-80 범위 (불릿 아이콘)
    supporting: 48, // 40-56 범위 (보조 아이콘)
  },
  /** Bullet list (목록 항목) */
  bullet: {
    icon: 64,       // 56-80 범위
    text: 46,       // 40-52 범위
    gap: 28,        // 24-32 범위
    marginBottom: 45, // 40-60 범위
  },
  /** Card dimensions */
  card: {
    width: 480,     // 420-550 범위
    padding: 50,    // 40-60 범위
    gap: 80,        // 60-100 범위
  },
  /** Progress bar / meter */
  progressBar: {
    width: 350,     // 300-500 범위
    height: 14,     // 12-20 범위
    gap: 24,        // 20-30 범위 (라벨과의 간격)
  },
  /** Charts and diagrams */
  chart: {
    width: 600,     // 500-800 범위
    height: 400,    // 350-500 범위
    barHeight: 50,  // 40-60 범위
    labelSize: 32,  // 28-38 범위
  },
  /** Badge/button sizes */
  badge: {
    fontSize: 48,
    paddingY: 26,
    paddingX: 52,
    borderRadius: 55,
  },
  /** DEPRECATED - use text.body instead */
  body: 38,
  /** DEPRECATED - use text.description instead */
  description: 32,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Content Density Guidelines (콘텐츠 밀도 가이드라인)
// ═══════════════════════════════════════════════════════════════════════════
//
// 📐 Available content height: 960px (after 60px padding top/bottom)
// 📝 Title section typically takes: ~180px
// 📝 Footer/CTA section typically takes: ~120px
// 📝 Remaining for list content: ~660px
//
// 🎯 Maximum items by layout type:
//    - Full-width steps (140px each): 4 items max
//    - Compact steps (100px each): 5 items max
//    - Bullet points (60px each): 8 items max
//
// ⚠️ If content exceeds, use:
//    1. AutoFitContainer for auto-scaling
//    2. Smaller spacing/padding
//    3. Split into multiple scenes
// ═══════════════════════════════════════════════════════════════════════════

export const CONTENT_DENSITY = {
  /** Maximum recommended items per layout type */
  maxItems: {
    fullWidthSteps: 4,    // Large cards with icons (140px each)
    compactSteps: 5,      // Medium list items (100px each)
    bulletPoints: 8,      // Simple text bullets (60px each)
    gridColumns2: 6,      // 2-column grid (3 rows)
    gridColumns3: 6,      // 3-column grid (2 rows)
  },
  /** Spacing recommendations based on item count */
  spacingByCount: {
    few: { gap: 35, itemPadding: "32px 42px" },      // 1-3 items (여유 있게)
    moderate: { gap: 28, itemPadding: "28px 40px" }, // 4 items (균형 - 검증됨)
    many: { gap: 22, itemPadding: "22px 32px" },     // 5+ items (컴팩트)
  },
  /** Height estimates for planning (pixels) */
  estimatedHeights: {
    titleSection: 180,      // Title + subtitle + bottom margin
    footerSection: 120,     // CTA button or conclusion text
    fullWidthItem: 140,     // Icon + text + padding
    compactItem: 100,       // Smaller icon + text + padding
    bulletItem: 60,         // Text + margin
  },
  /** Safe content area after title/footer */
  safeContentHeight: 660,   // 960 - 180 (title) - 120 (footer)
} as const;

/**
 * Calculate if content fits within safe area
 * @param itemCount Number of items
 * @param itemType Type of list item
 * @param hasFooter Whether there's a footer section
 * @returns Object with fits boolean and suggested adjustments
 */
export function checkContentFits(
  itemCount: number,
  itemType: "fullWidthSteps" | "compactSteps" | "bulletPoints" = "fullWidthSteps",
  hasFooter = true
): { fits: boolean; overflow: number; suggestion: string } {
  const heights = CONTENT_DENSITY.estimatedHeights;
  const maxItems = CONTENT_DENSITY.maxItems[itemType];

  const itemHeight = itemType === "fullWidthSteps" ? heights.fullWidthItem
    : itemType === "compactSteps" ? heights.compactItem
    : heights.bulletItem;

  const availableHeight = hasFooter
    ? CONTENT_DENSITY.safeContentHeight
    : LAYOUT.contentArea.height - heights.titleSection;

  const totalContentHeight = itemCount * itemHeight;
  const overflow = totalContentHeight - availableHeight;

  if (itemCount <= maxItems && overflow <= 0) {
    return { fits: true, overflow: 0, suggestion: "Content fits perfectly" };
  }

  const suggestion = overflow > 100
    ? `Split into ${Math.ceil(itemCount / maxItems)} scenes or use AutoFitContainer`
    : `Use 'moderate' or 'many' spacing from CONTENT_DENSITY.spacingByCount`;

  return { fits: false, overflow: Math.max(overflow, 0), suggestion };
}

// Border radius scale
export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

// Spring config presets
export const SPRING_CONFIGS = {
  snappy: { damping: 100, mass: 0.5, stiffness: 300 },
  normal: { damping: 80, mass: 0.5, stiffness: 200 },
  gentle: { damping: 100, mass: 0.8, stiffness: 150 },
  bouncy: { damping: 60, mass: 0.4, stiffness: 300 },
} as const;

// Text styles for different languages
export const TEXT_STYLES = {
  /** Korean text - prevents character-level line breaks */
  korean: {
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
    lineHeight: 1.4,
  },
  /** Default text style */
  default: {
    lineHeight: 1.5,
  },
} as const;

// Typography system with letter spacing
// Larger text needs more letter spacing for readability
export const TYPOGRAPHY = {
  /** Large titles (56px+) */
  title: {
    fontFamily: FONT_FAMILY.title,
    fontWeight: 800 as const,
    letterSpacing: 2,
    lineHeight: 1.2,
  },
  /** Medium headings (36-48px) */
  heading: {
    fontFamily: FONT_FAMILY.title,
    fontWeight: 700 as const,
    letterSpacing: 1,
    lineHeight: 1.3,
  },
  /** Body text (24-32px) */
  body: {
    fontFamily: FONT_FAMILY.body,
    fontWeight: 500 as const,
    letterSpacing: 0.5,
    lineHeight: 1.5,
  },
  /** Small captions (16-20px) */
  caption: {
    fontFamily: FONT_FAMILY.body,
    fontWeight: 400 as const,
    letterSpacing: 0.3,
    lineHeight: 1.4,
  },
} as const;

/**
 * Get appropriate letter spacing based on font size
 * Larger text needs proportionally more spacing for readability
 */
export function getLetterSpacingForSize(fontSize: number): number {
  if (fontSize >= 56) return 2;      // Large titles
  if (fontSize >= 40) return 1.5;    // Medium headings
  if (fontSize >= 28) return 1;      // Body text
  return 0.5;                         // Small text
}

// Common card background helpers
export const cardBackground = (color: string, opacity = 0.15) =>
  `rgba(${hexToRgb(color)}, ${opacity})`;

// Helper to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
