/**
 * Positive Thinking Trap Video
 * "긍정 사고의 함정 - 긍정성이 문제를 은폐하고 사회적 책임을 개인화하는 방식"
 *
 * Based on Barbara Ehrenreich's "Bright-Sided" and psychology research.
 * A critical examination of toxic positivity and its societal implications.
 *
 * Visual Design:
 * - Critical red/warning accents for problematic content
 * - Warm gradients for positivity industry scenes
 * - Dark, thoughtful tones for criticism sections
 * - Green hopeful tones for alternatives
 */

import React from "react";
import {
  Sequence,
  Audio,
  staticFile,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

import {
  IntroTemplate,
  QuoteTemplate,
  OutroTemplate,
} from "../../shared/templates/scenes";
import { AnimatedGradient, FloatingShapes } from "../../shared/components/backgrounds";
import { EffectsComposer, Vignette, LightLeak, FilmGrain } from "../../shared/components/effects";
import { CountUp } from "../../shared/components/progress";
import { HighlightBox } from "../../shared/components/cards";
import { CycleDiagram } from "../../shared/components/diagrams";
import { SCENES, TOTAL_DURATION, THEME, FPS } from "./constants";
import {
  FONT_SIZES,
  FONT_FAMILY,
  COLORS,
  SPACING,
  RADIUS,
  SPRING_CONFIGS,
} from "../../shared/components/constants";

/** Composition props schema */
export const positiveThinkingTrapSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type PositiveThinkingTrapProps = z.infer<typeof positiveThinkingTrapSchema>;

// Cinematic Background with thematic gradients
const CinematicBackground: React.FC<{
  variant?: "dark" | "warm" | "critical" | "hope" | "balanced";
}> = ({ variant = "dark" }) => {
  const colors = {
    dark: ["#1a1a2e", "#16213e"],
    warm: ["#1a1a2e", "#f59e0b20", "#1a1a2e"], // Warm for positivity industry
    critical: ["#1a1a2e", "#e9456020", "#1a1a2e"], // Red for criticism
    hope: ["#16213e", "#22c55e20", "#16213e"], // Green for alternatives
    balanced: ["#1a1a2e", "#667eea20", "#16213e"], // Purple for balance
  };

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={colors[variant]}
        animationMode="pulse"
        cycleDuration={variant === "critical" ? 90 : 120}
      />
      <FloatingShapes
        shapeTypes={["circle"]}
        shapeCount={6}
        colors={[
          variant === "critical" ? "rgba(233, 69, 96, 0.03)" : "rgba(102, 126, 234, 0.03)",
          variant === "hope" ? "rgba(34, 197, 94, 0.03)" : "rgba(118, 75, 162, 0.03)",
        ]}
      />
    </AbsoluteFill>
  );
};

// Cinematic Effects wrapper
const CinematicEffects: React.FC<{
  children: React.ReactNode;
  lightLeakColor?: string;
  lightLeakPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  vignetteIntensity?: number;
}> = ({
  children,
  lightLeakColor,
  lightLeakPosition = "top-right",
  vignetteIntensity = 0.4,
}) => (
  <EffectsComposer>
    {children}
    {lightLeakColor && (
      <LightLeak
        color={lightLeakColor}
        position={lightLeakPosition}
        intensity={0.15}
        animated
        type="gradient"
      />
    )}
    <Vignette intensity={vignetteIntensity} color="#000000" />
    <FilmGrain intensity={0.02} animated />
  </EffectsComposer>
);

// Industry scale visualization for Scene 2
const IndustryScaleVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const countProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 80, stiffness: 100 },
  });

  const itemsProgress = spring({
    frame: frame - 90,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const industryItems = [
    { icon: "📚", text: "자기계발서", desc: "베스트셀러 목록 점령" },
    { icon: "🎤", text: "동기부여 강연", desc: "수천억 원 규모 산업" },
    { icon: "💼", text: "기업 마인드셋 교육", desc: "긍정 워크숍 필수화" },
    { icon: "🧘", text: "긍정 심리학 앱", desc: "명상, 긍정 확언 서비스" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
      }}
    >
      {/* Section Label */}
      <div
        style={{
          fontSize: FONT_SIZES.lg,
          color: THEME.warningColor,
          fontFamily: FONT_FAMILY.body,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: SPACING.sm,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
        }}
      >
        긍정 사고 산업
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: FONT_SIZES["2xl"],
          fontWeight: 700,
          color: COLORS.white,
          fontFamily: FONT_FAMILY.title,
          marginBottom: SPACING.lg,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        "생각이 현실을 만든다" - 시크릿, 끌어당김의 법칙
      </h2>

      {/* Big Number - Industry Scale */}
      <div
        style={{
          marginBottom: SPACING.xl,
          opacity: interpolate(countProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(countProgress, [0, 1], [0.8, 1])})`,
        }}
      >
        <CountUp
          value={130}
          prefix="$"
          suffix="억+"
          delay={30}
          duration={90}
          fontSize={120}
          color={THEME.warningColor}
        />
        <p
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
            textAlign: "center",
            marginTop: SPACING.xs,
          }}
        >
          전 세계 자기계발 산업 규모
        </p>
      </div>

      {/* Industry Items Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: SPACING.lg,
          opacity: interpolate(itemsProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(itemsProgress, [0, 1], [30, 0])}px)`,
          maxWidth: 1700,
          width: "100%",
        }}
      >
        {industryItems.map((item, i) => (
          <div
            key={i}
            style={{
              backgroundColor: `${THEME.warningColor}15`,
              padding: SPACING.md,
              borderRadius: RADIUS.lg,
              borderTop: `3px solid ${THEME.warningColor}`,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 48 }}>{item.icon}</span>
            <div
              style={{
                fontSize: FONT_SIZES.lg,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                marginTop: SPACING.xs,
                wordBreak: "keep-all",
              }}
            >
              {item.text}
            </div>
            <div
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.light,
                fontFamily: FONT_FAMILY.body,
                marginTop: 4,
                wordBreak: "keep-all",
              }}
            >
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Suppression Cycle Visualization for Scene 4
const SuppressionCycleVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const explanationProgress = spring({
    frame: frame - 60,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "row",
        padding: SPACING.xl,
        alignItems: "center",
      }}
    >
      {/* Left - Explanation */}
      <div
        style={{
          width: "55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: SPACING.xl,
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            color: THEME.accentColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: SPACING.sm,
            opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          }}
        >
          독성 긍정성의 심리학
        </div>

        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            marginBottom: SPACING.lg,
            opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          }}
        >
          감정 억압의 역설
        </h2>

        <div
          style={{
            opacity: interpolate(explanationProgress, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(explanationProgress, [0, 1], [-20, 0])}px)`,
          }}
        >
          {[
            {
              icon: "🐻",
              title: "백곰 실험 (Wegner)",
              text: '"백곰을 생각하지 마세요" → 더 많이 생각하게 됨',
            },
            {
              icon: "😢",
              title: "감정 반등 효과",
              text: "억압할수록 감정이 더 강해짐",
            },
            {
              icon: "🛡️",
              title: "방어적 비관주의 (Norem)",
              text: "부정적 감정도 정보적 가치가 있음",
            },
          ].map((item, i) => {
            const itemProgress = spring({
              frame: frame - 90 - i * 30,
              fps,
              config: SPRING_CONFIGS.normal,
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.md,
                  marginBottom: SPACING.md,
                  padding: SPACING.md,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: RADIUS.lg,
                  borderLeft: `4px solid ${THEME.accentColor}`,
                  opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemProgress, [0, 1], [-30, 0])}px)`,
                }}
              >
                <span style={{ fontSize: 40, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: FONT_SIZES.lg,
                      fontWeight: 700,
                      color: THEME.accentColor,
                      fontFamily: FONT_FAMILY.title,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: FONT_SIZES.md,
                      color: COLORS.light,
                      fontFamily: FONT_FAMILY.body,
                      marginTop: 4,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right - Cycle Diagram */}
      <div
        style={{
          width: "45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CycleDiagram
          steps={[
            { text: "부정적\n감정", icon: "😔" },
            { text: '"괜찮아"\n억압', icon: "😊" },
            { text: "감정\n증폭", icon: "😰" },
            { text: "폭발/\n번아웃", icon: "💥" },
          ]}
          centerLabel="억압 악순환"
          color={THEME.accentColor}
          size="medium"
          language="ko"
        />
      </div>
    </AbsoluteFill>
  );
};

// Social Blame Comparison for Scene 5
const SocialBlameComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const leftProgress = spring({
    frame: frame - 30,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const rightProgress = spring({
    frame: frame - 60,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const exampleProgress = spring({
    frame: frame - 120,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        padding: SPACING.xl,
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.md,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            color: THEME.accentColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: SPACING.xs,
          }}
        >
          이데올로기 분석
        </div>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
          }}
        >
          사회적 책임의 개인화
        </h2>
      </div>

      {/* Comparison Cards - Auto height, no stretch */}
      <div
        style={{
          display: "flex",
          gap: SPACING.lg,
          alignItems: "stretch",
        }}
      >
        {/* Left - Individual Blame */}
        <div
          style={{
            flex: 1,
            backgroundColor: `${THEME.accentColor}15`,
            borderRadius: RADIUS.xl,
            padding: SPACING.md,
            borderTop: `4px solid ${THEME.accentColor}`,
            display: "flex",
            flexDirection: "column",
            opacity: interpolate(leftProgress, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(leftProgress, [0, 1], [-50, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 40,
              textAlign: "center",
              marginBottom: SPACING.xs,
            }}
          >
            👤
          </div>
          <h3
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 700,
              color: THEME.accentColor,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              marginBottom: SPACING.sm,
            }}
          >
            개인 책임론
          </h3>
          {[
            '"긍정적으로 생각하지 않아서"',
            '"마음가짐이 부정적이라서"',
            '"노력이 부족해서"',
            '"우주에 잘못된 신호를 보내서"',
          ].map((text, i) => (
            <div
              key={i}
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.light,
                fontFamily: FONT_FAMILY.body,
                padding: `${SPACING.xs}px ${SPACING.md}px`,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: RADIUS.md,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* VS Separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${SPACING.sm}px`,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              textShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          >
            VS
          </span>
        </div>

        {/* Right - Structural Issues */}
        <div
          style={{
            flex: 1,
            backgroundColor: `${THEME.primaryColor}15`,
            borderRadius: RADIUS.xl,
            padding: SPACING.md,
            borderTop: `4px solid ${THEME.primaryColor}`,
            display: "flex",
            flexDirection: "column",
            opacity: interpolate(rightProgress, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(rightProgress, [0, 1], [50, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 40,
              textAlign: "center",
              marginBottom: SPACING.xs,
            }}
          >
            🏛️
          </div>
          <h3
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 700,
              color: THEME.primaryColor,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              marginBottom: SPACING.sm,
            }}
          >
            구조적 문제
          </h3>
          {[
            "경제 불평등 심화",
            "고용 불안정성 증가",
            "사회 안전망 부재",
            "제도적 차별과 장벽",
          ].map((text, i) => (
            <div
              key={i}
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.light,
                fontFamily: FONT_FAMILY.body,
                padding: `${SPACING.xs}px ${SPACING.md}px`,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: RADIUS.md,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Example */}
      <div
        style={{
          marginTop: SPACING.md,
          padding: SPACING.sm,
          backgroundColor: `${THEME.accentColor}20`,
          borderRadius: RADIUS.lg,
          border: `2px solid ${THEME.accentColor}40`,
          opacity: interpolate(exampleProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(exampleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <p
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.body,
            textAlign: "center",
            margin: 0,
          }}
        >
          💼 <strong>아이러니</strong>: 기업 구조조정 + "긍정 마인드셋 워크숍" = 사회적 책임 회피
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Checklist Display for Scene 6 (Alternatives)
const AlternativeChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const alternatives = [
    {
      icon: "🎯",
      title: "현실적 낙관주의 (Sandra Schneider)",
      text: "근거 있는 희망 + 현실적 위험 인식",
      color: THEME.successColor,
    },
    {
      icon: "🧘",
      title: "수용전념치료 (ACT)",
      text: "감정 인정 → 가치 기반 행동 연결",
      color: THEME.successColor,
    },
    {
      icon: "⚖️",
      title: "개인 + 구조 모두",
      text: "개인 노력과 구조적 변화 동시 추구",
      color: THEME.successColor,
    },
    {
      icon: "💪",
      title: "진정한 회복력",
      text: "현실 직시에서 시작되는 회복력",
      color: THEME.primaryColor,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: SPACING.xl,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.xl,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            color: THEME.successColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: SPACING.xs,
          }}
        >
          균형 잡힌 대안
        </div>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
          }}
        >
          긍정이 아닌 진실을, 희망이 아닌 행동을
        </h2>
      </div>

      {/* Alternatives Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: SPACING.lg,
          width: "100%",
        }}
      >
        {alternatives.map((item, i) => {
          const itemProgress = spring({
            frame: frame - 60 - i * 20,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: SPACING.lg,
                padding: SPACING.lg,
                backgroundColor: `${item.color}15`,
                borderRadius: RADIUS.xl,
                borderLeft: `5px solid ${item.color}`,
                opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(itemProgress, [0, 1], [30, 0])}px) scale(${interpolate(itemProgress, [0, 1], [0.95, 1])})`,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: `${item.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: FONT_SIZES.lg,
                    fontWeight: 700,
                    color: item.color,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: FONT_SIZES.md,
                    color: COLORS.light,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Insight */}
      <div
        style={{
          marginTop: SPACING.xl,
        }}
      >
        <HighlightBox
          icon="💡"
          content="진정한 회복력은 '다 잘 될 거야'가 아니라 '현실을 직시하고 행동하겠다'에서 시작됩니다"
          backgroundColor={`${THEME.successColor}20`}
          borderColor={THEME.successColor}
          fontSize="xl"
          delay={180}
        />
      </div>
    </AbsoluteFill>
  );
};

export const PositiveThinkingTrap: React.FC<PositiveThinkingTrapProps> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.backgroundColor }}>
      {/* Scene 1: Intro/Hook - Title Card */}
      <Sequence from={SCENES.INTRO.start} durationInFrames={SCENES.INTRO.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects
          lightLeakColor="rgba(233, 69, 96, 0.2)"
          lightLeakPosition="top-left"
        >
          <IntroTemplate
            title="긍정 사고의 함정"
            subtitle='"긍정적으로 생각하면 모든 게 잘 될 거야" - 이 말이 위험한 이유'
            background="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            durationInFrames={SCENES.INTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/intro.mp3")} />
      </Sequence>

      {/* Scene 2: Positivity Industry Overview */}
      <Sequence from={SCENES.INDUSTRY.start} durationInFrames={SCENES.INDUSTRY.duration}>
        <CinematicBackground variant="warm" />
        <CinematicEffects lightLeakColor="rgba(245, 158, 11, 0.15)">
          <IndustryScaleVisualization />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/industry.mp3")} />
      </Sequence>

      {/* Scene 3: Ehrenreich's Criticism - Quote */}
      <Sequence from={SCENES.EHRENREICH.start} durationInFrames={SCENES.EHRENREICH.duration}>
        <CinematicBackground variant="critical" />
        <CinematicEffects vignetteIntensity={0.5}>
          <QuoteTemplate
            quote="유방암 진단 후 사람들은 내게 '긍정적으로 생각하라'고 말했다. 왜 환자에게 긍정을 강요하는가?"
            attribution="Barbara Ehrenreich, 'Bright-Sided' 저자"
            icon="📚"
            background="linear-gradient(135deg, #1a1a2e 0%, #e9456015 50%, #1a1a2e 100%)"
            showQuoteMarks={true}
            durationInFrames={SCENES.EHRENREICH.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/ehrenreich.mp3")} />
      </Sequence>

      {/* Scene 4: Toxic Positivity Psychology */}
      <Sequence
        from={SCENES.TOXIC_POSITIVITY.start}
        durationInFrames={SCENES.TOXIC_POSITIVITY.duration}
      >
        <CinematicBackground variant="critical" />
        <CinematicEffects lightLeakColor="rgba(233, 69, 96, 0.2)">
          <SuppressionCycleVisualization />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/toxic_positivity.mp3")} />
      </Sequence>

      {/* Scene 5: Social Blame / Individualization */}
      <Sequence from={SCENES.SOCIAL_BLAME.start} durationInFrames={SCENES.SOCIAL_BLAME.duration}>
        <CinematicBackground variant="critical" />
        <CinematicEffects vignetteIntensity={0.5}>
          <SocialBlameComparison />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/social_blame.mp3")} />
      </Sequence>

      {/* Scene 6: Balanced Alternatives */}
      <Sequence from={SCENES.ALTERNATIVE.start} durationInFrames={SCENES.ALTERNATIVE.duration}>
        <CinematicBackground variant="hope" />
        <CinematicEffects lightLeakColor="rgba(34, 197, 94, 0.2)" vignetteIntensity={0.3}>
          <AlternativeChecklist />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/alternative.mp3")} />
      </Sequence>

      {/* Scene 7: Outro & Conclusion */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={[THEME.primaryColor, "#4a90d9", "#22c55e"]}
            animationMode="pulse"
            cycleDuration={90}
          />
        </AbsoluteFill>
        <CinematicEffects vignetteIntensity={0.3}>
          <OutroTemplate
            title="긍정 사고의 함정"
            titleIcon="🎭"
            takeaways={[
              { icon: "🔍", text: "긍정 강요의 위험성을 인식하고" },
              { icon: "⚖️", text: "현실과 희망의 균형을 찾으세요" },
            ]}
            closingMessage="긍정이 아닌 진실을, 희망이 아닌 행동을"
            closingIcon="💪"
            background={THEME.secondaryColor}
            closingBackgroundColor={THEME.successColor}
            closingTextColor={COLORS.white}
            durationInFrames={SCENES.OUTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/PositiveThinkingTrap/audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_DURATION, FPS };
export default PositiveThinkingTrap;
