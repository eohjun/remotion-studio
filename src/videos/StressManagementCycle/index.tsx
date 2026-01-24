/**
 * Stress Management Cycle Video
 * "스트레스 사이클: 당신이 지친 진짜 이유"
 *
 * Based on Emily Nagoski's research and HPA axis science.
 * Testing: CycleDiagram overflow fixes, Korean text handling, SafeAreaContainer
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

import { QuoteTemplate } from "../../shared/templates/scenes";
import { AnimatedGradient, FloatingShapes } from "../../shared/components/backgrounds";
import { EffectsComposer, Vignette, LightLeak, FilmGrain } from "../../shared/components/effects";
import { CountUp } from "../../shared/components/progress";
import { CycleDiagram } from "../../shared/components/diagrams";
import { SafeAreaContainer } from "../../shared/components/layouts";
import { SCENES, TOTAL_DURATION, THEME, FPS } from "./constants";
import {
  FONT_SIZES,
  FONT_FAMILY,
  COLORS,
  SPACING,
  RADIUS,
  SPRING_CONFIGS,
  TEXT_STYLES,
} from "../../shared/components/constants";

/** Composition props schema */
export const stressManagementCycleSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type StressManagementCycleProps = z.infer<typeof stressManagementCycleSchema>;

// Cinematic Background with thematic gradients
const CinematicBackground: React.FC<{
  variant?: "dark" | "danger" | "hope" | "calm" | "data";
}> = ({ variant = "dark" }) => {
  const colors = {
    dark: ["#1a1a2e", "#16213e"],
    danger: ["#1a1a2e", "#dc354520", "#1a1a2e"],
    hope: ["#1a1a2e", "#28a74520", "#1a1a2e"],
    calm: ["#16213e", "#667eea20", "#16213e"],
    data: ["#1a1a2e", "#00c2ff10", "#1a1a2e"],
  };

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={colors[variant]}
        animationMode="pulse"
        cycleDuration={120}
      />
      <FloatingShapes
        shapeTypes={["circle"]}
        shapeCount={6}
        colors={[
          variant === "danger" ? "rgba(220, 53, 69, 0.03)" : "rgba(102, 126, 234, 0.03)",
          variant === "hope" ? "rgba(40, 167, 69, 0.03)" : "rgba(118, 75, 162, 0.03)",
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

// Scene 1: Hook - Shocking Statistic
const HookScene: React.FC = () => {
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

  const subtitleProgress = spring({
    frame: frame - 90,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: FONT_SIZES.xl,
          color: COLORS.light,
          fontFamily: FONT_FAMILY.body,
          marginBottom: SPACING.md,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
          ...TEXT_STYLES.korean,
        }}
      >
        충분히 쉬어도 피곤하신가요?
      </div>

      <div
        style={{
          marginBottom: SPACING.lg,
          opacity: interpolate(countProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(countProgress, [0, 1], [0.8, 1])})`,
        }}
      >
        <CountUp
          value={5}
          suffix="배"
          delay={30}
          duration={60}
          fontSize={140}
          color={THEME.dangerColor}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          opacity: interpolate(subtitleProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <p
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          심혈관 질환 사망률 증가
        </p>
        <p
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
            marginTop: SPACING.sm,
            ...TEXT_STYLES.korean,
          }}
        >
          높은 스트레스 수치가 당신의 건강을 위협합니다
        </p>
      </div>
    </SafeAreaContainer>
  );
};

// Scene 3: Stress Cycle Visualization - Testing CycleDiagram
const StressCycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.lg,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            color: THEME.accentColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 700,
            letterSpacing: 4,
            marginBottom: SPACING.xs,
          }}
        >
          HPA 축 (시상하부-뇌하수체-부신)
        </div>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          스트레스의 생리학적 사이클
        </h2>
      </div>

      {/* CycleDiagram - Testing overflow fixes and Korean text */}
      <CycleDiagram
        steps={[
          { text: "위협\n감지", icon: "👁️", color: COLORS.white },
          { text: "시상하부\n호르몬 분비", icon: "🧠", color: COLORS.white },
          { text: "뇌하수체\n신호 증폭", icon: "⚡", color: COLORS.white },
          { text: "부신 코르티솔\n10-12배 분비", icon: "💥", color: THEME.warningColor },
          { text: "심장/혈압\n혈당 상승", icon: "❤️", color: THEME.dangerColor },
        ]}
        centerLabel="HPA 축"
        color={THEME.accentColor}
        size="large"
        language="ko"
        animated
        animationSpeed={0.5}
        fontSize="md"
      />
    </SafeAreaContainer>
  );
};

// Scene 4: Incomplete Cycle Comparison
const IncompleteCycleScene: React.FC = () => {
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

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.lg,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
        }}
      >
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          스트레스 사이클의 완료
        </h2>
      </div>

      {/* Comparison Cards */}
      <div
        style={{
          display: "flex",
          gap: SPACING.xl,
          alignItems: "stretch",
        }}
      >
        {/* Left - Ancient */}
        <div
          style={{
            flex: 1,
            backgroundColor: `${THEME.successColor}15`,
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            borderTop: `4px solid ${THEME.successColor}`,
            opacity: interpolate(leftProgress, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(leftProgress, [0, 1], [-50, 0])}px)`,
          }}
        >
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: SPACING.sm }}>🦁</div>
          <h3
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 700,
              color: THEME.successColor,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              marginBottom: SPACING.md,
              ...TEXT_STYLES.korean,
            }}
          >
            원시시대
          </h3>
          {["사자 발견 → 위험 감지", "도망 → 생리적 반응", "안전한 곳 도착", "✅ 사이클 완료"].map(
            (text, i) => (
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
                  ...TEXT_STYLES.korean,
                }}
              >
                {text}
              </div>
            )
          )}
        </div>

        {/* VS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            VS
          </span>
        </div>

        {/* Right - Modern */}
        <div
          style={{
            flex: 1,
            backgroundColor: `${THEME.dangerColor}15`,
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            borderTop: `4px solid ${THEME.dangerColor}`,
            opacity: interpolate(rightProgress, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(rightProgress, [0, 1], [50, 0])}px)`,
          }}
        >
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: SPACING.sm }}>💼</div>
          <h3
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 700,
              color: THEME.dangerColor,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              marginBottom: SPACING.md,
              ...TEXT_STYLES.korean,
            }}
          >
            현대
          </h3>
          {["업무 압박, 재정 문제", "관계 갈등, 불확실성", "끝없는 스트레스 요인", "❌ 사이클 미완료"].map(
            (text, i) => (
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
                  ...TEXT_STYLES.korean,
                }}
              >
                {text}
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom message */}
      <div
        style={{
          marginTop: SPACING.lg,
          padding: SPACING.md,
          backgroundColor: `${THEME.dangerColor}20`,
          borderRadius: RADIUS.lg,
          border: `2px solid ${THEME.dangerColor}40`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.body,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          💡 <strong>이것이 번아웃의 정체입니다</strong> - 완료되지 않은 스트레스가 몸에 축적됩니다
        </p>
      </div>
    </SafeAreaContainer>
  );
};

// Scene 5: Mindset Study Data
const MindsetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const dataProgress = spring({
    frame: frame - 45,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const insightProgress = spring({
    frame: frame - 120,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.lg,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.lg,
            color: THEME.accentColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 700,
            letterSpacing: 4,
            marginBottom: SPACING.xs,
          }}
        >
          30,000명 | 8년 추적 연구
        </div>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          스트레스에 대한 인식의 힘
        </h2>
      </div>

      {/* Data Comparison */}
      <div
        style={{
          display: "flex",
          gap: SPACING.xl,
          marginBottom: SPACING.xl,
          opacity: interpolate(dataProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(dataProgress, [0, 1], [0.9, 1])})`,
        }}
      >
        {/* Negative belief */}
        <div
          style={{
            textAlign: "center",
            padding: SPACING.lg,
            backgroundColor: `${THEME.dangerColor}15`,
            borderRadius: RADIUS.xl,
            minWidth: 300,
          }}
        >
          <div style={{ fontSize: FONT_SIZES.md, color: COLORS.light, marginBottom: SPACING.sm }}>
            "스트레스가 해롭다"고 믿음
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: THEME.dangerColor,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            -43%
          </div>
          <div style={{ fontSize: FONT_SIZES.lg, color: THEME.dangerColor }}>기대수명 단축</div>
        </div>

        {/* Positive belief */}
        <div
          style={{
            textAlign: "center",
            padding: SPACING.lg,
            backgroundColor: `${THEME.successColor}15`,
            borderRadius: RADIUS.xl,
            minWidth: 300,
          }}
        >
          <div style={{ fontSize: FONT_SIZES.md, color: COLORS.light, marginBottom: SPACING.sm }}>
            "스트레스가 해롭지 않다"고 믿음
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: THEME.successColor,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            ≈0%
          </div>
          <div style={{ fontSize: FONT_SIZES.lg, color: THEME.successColor }}>
            낮은 스트레스 집단과 동일
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div
        style={{
          padding: SPACING.lg,
          backgroundColor: `${THEME.primaryColor}20`,
          borderRadius: RADIUS.xl,
          border: `2px solid ${THEME.primaryColor}`,
          maxWidth: 800,
          opacity: interpolate(insightProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(insightProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <p
          style={{
            fontSize: FONT_SIZES.xl,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            textAlign: "center",
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          💡 인식이 현실을 만듭니다
        </p>
      </div>
    </SafeAreaContainer>
  );
};

// Scene 6: Solution - Physical Activity
const SolutionPhysicalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const itemsProgress = spring({
    frame: frame - 45,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const items = [
    { icon: "🏃", title: "주 2회 유산소 운동", desc: "185명 대학생 연구: 스트레스 크게 감소" },
    { icon: "⏱️", title: "코르티솔 정상화", desc: "회복 시간 단축" },
    { icon: "😊", title: "엔도르핀 생성", desc: "피로감을 만족감으로 전환" },
  ];

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
            letterSpacing: 4,
            marginBottom: SPACING.xs,
          }}
        >
          과학적 해결책 1
        </div>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          🏃 신체 활동 - 가장 효과적인 방법
        </h2>
      </div>

      {/* Items */}
      <div
        style={{
          display: "flex",
          gap: SPACING.lg,
          opacity: interpolate(itemsProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(itemsProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        {items.map((item, i) => {
          const itemDelay = spring({
            frame: frame - 60 - i * 20,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: `${THEME.successColor}15`,
                padding: SPACING.lg,
                borderRadius: RADIUS.xl,
                borderLeft: `4px solid ${THEME.successColor}`,
                opacity: interpolate(itemDelay, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(itemDelay, [0, 1], [20, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: SPACING.sm }}>{item.icon}</div>
              <h3
                style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 700,
                  color: THEME.successColor,
                  fontFamily: FONT_FAMILY.title,
                  marginBottom: SPACING.xs,
                  ...TEXT_STYLES.korean,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: FONT_SIZES.md,
                  color: COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  margin: 0,
                  ...TEXT_STYLES.korean,
                }}
              >
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: SPACING.xl,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: `${SPACING.md}px ${SPACING.xl}px`,
            backgroundColor: THEME.successColor,
            borderRadius: RADIUS.xl,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            하루 30분, 주 3회
          </span>
        </div>
      </div>
    </SafeAreaContainer>
  );
};

// Scene 7: Solution - Breathing Techniques
const SolutionBreathingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const techniques = [
    {
      name: "박스 호흡 (Box Breathing)",
      steps: "4초 들숨 → 4초 멈춤 → 4초 날숨 → 4초 멈춤",
      note: "미 해군 네이비실 사용",
      icon: "📦",
    },
    {
      name: "4-7-8 호흡법",
      steps: "4초 들숨 → 7초 멈춤 → 8초 날숨",
      note: "산화 스트레스 최대 40% 감소",
      icon: "🌬️",
    },
  ];

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
            color: THEME.accentColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 700,
            letterSpacing: 4,
            marginBottom: SPACING.xs,
          }}
        >
          과학적 해결책 2
        </div>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
            ...TEXT_STYLES.korean,
          }}
        >
          🧘 호흡법 - 즉각적 효과
        </h2>
      </div>

      {/* Techniques */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACING.lg }}>
        {techniques.map((tech, i) => {
          const techProgress = spring({
            frame: frame - 45 - i * 30,
            fps,
            config: SPRING_CONFIGS.normal,
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: SPACING.lg,
                padding: SPACING.lg,
                backgroundColor: `${THEME.accentColor}15`,
                borderRadius: RADIUS.xl,
                borderLeft: `4px solid ${THEME.accentColor}`,
                opacity: interpolate(techProgress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(techProgress, [0, 1], [-30, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  width: 100,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${THEME.accentColor}30`,
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              >
                {tech.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: FONT_SIZES.xl,
                    fontWeight: 700,
                    color: THEME.accentColor,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: SPACING.xs,
                    ...TEXT_STYLES.korean,
                  }}
                >
                  {tech.name}
                </h3>
                <p
                  style={{
                    fontSize: FONT_SIZES.lg,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                    marginBottom: SPACING.xs,
                    ...TEXT_STYLES.korean,
                  }}
                >
                  {tech.steps}
                </p>
                <p
                  style={{
                    fontSize: FONT_SIZES.md,
                    color: THEME.warningColor,
                    fontFamily: FONT_FAMILY.body,
                    margin: 0,
                  }}
                >
                  ⭐ {tech.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SafeAreaContainer>
  );
};

// Scene 9: Simple Outro
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: interpolate(progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
        }}
      >
        <div style={{ fontSize: 64, marginBottom: SPACING.md }}>🔄</div>
        <h1
          style={{
            fontSize: FONT_SIZES["3xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            marginBottom: SPACING.lg,
            ...TEXT_STYLES.korean,
          }}
        >
          오늘부터 시작하세요
        </h1>
        <p
          style={{
            fontSize: FONT_SIZES.xl,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
            ...TEXT_STYLES.korean,
          }}
        >
          당신의 몸은 이미 답을 알고 있습니다
        </p>
      </div>
    </SafeAreaContainer>
  );
};

// Scene 8: Conclusion
const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const actionsProgress = spring({
    frame: frame - 60,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const actions = [
    { icon: "🚶", text: "매일 30분 걷기" },
    { icon: "🧘", text: "5분 호흡 연습" },
    { icon: "😴", text: "충분한 수면" },
  ];

  return (
    <SafeAreaContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main Quote */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.xl,
          maxWidth: 1000,
          opacity: interpolate(quoteProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(quoteProgress, [0, 1], [0.95, 1])})`,
        }}
      >
        <p
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            ...TEXT_STYLES.korean,
          }}
        >
          스트레스를 느끼는 것은 문제가 아닙니다.
        </p>
        <p
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: THEME.accentColor,
            fontFamily: FONT_FAMILY.title,
            marginTop: SPACING.md,
            ...TEXT_STYLES.korean,
          }}
        >
          스트레스 사이클을 완료하지 못하는 것이 문제입니다.
        </p>
      </div>

      {/* Action Items */}
      <div
        style={{
          display: "flex",
          gap: SPACING.lg,
          opacity: interpolate(actionsProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(actionsProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        {actions.map((action, i) => {
          const itemProgress = spring({
            frame: frame - 90 - i * 15,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });

          return (
            <div
              key={i}
              style={{
                padding: SPACING.lg,
                backgroundColor: `${THEME.successColor}20`,
                borderRadius: RADIUS.xl,
                textAlign: "center",
                minWidth: 200,
                opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                transform: `scale(${interpolate(itemProgress, [0, 1], [0.8, 1])})`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: SPACING.sm }}>{action.icon}</div>
              <p
                style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 600,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                  margin: 0,
                  ...TEXT_STYLES.korean,
                }}
              >
                {action.text}
              </p>
            </div>
          );
        })}
      </div>
    </SafeAreaContainer>
  );
};

export const StressManagementCycle: React.FC<StressManagementCycleProps> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.backgroundColor }}>
      {/* Scene 1: Hook - Shocking Statistic */}
      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
        <CinematicBackground variant="danger" />
        <CinematicEffects lightLeakColor="rgba(220, 53, 69, 0.2)" lightLeakPosition="top-left">
          <HookScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/hook.mp3")} />
      </Sequence>

      {/* Scene 2: Problem - Emily Nagoski Quote */}
      <Sequence from={SCENES.PROBLEM.start} durationInFrames={SCENES.PROBLEM.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects vignetteIntensity={0.5}>
          <QuoteTemplate
            quote="스트레스 유발 요인을 제거하더라도, 몸 안에 떠도는 스트레스는 여전히 처리해야 한다."
            attribution="에밀리 나고스키 박사"
            icon="📚"
            background="transparent"
            showQuoteMarks={true}
            durationInFrames={SCENES.PROBLEM.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/problem.mp3")} />
      </Sequence>

      {/* Scene 3: Stress Cycle - CycleDiagram */}
      <Sequence
        from={SCENES.CYCLE_EXPLAINED.start}
        durationInFrames={SCENES.CYCLE_EXPLAINED.duration}
      >
        <CinematicBackground variant="data" />
        <CinematicEffects lightLeakColor="rgba(0, 194, 255, 0.15)">
          <StressCycleScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/cycle_explained.mp3")} />
      </Sequence>

      {/* Scene 4: Incomplete Cycle - Comparison */}
      <Sequence
        from={SCENES.INCOMPLETE_CYCLE.start}
        durationInFrames={SCENES.INCOMPLETE_CYCLE.duration}
      >
        <CinematicBackground variant="danger" />
        <CinematicEffects vignetteIntensity={0.5}>
          <IncompleteCycleScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/incomplete_cycle.mp3")} />
      </Sequence>

      {/* Scene 5: Mindset Study */}
      <Sequence from={SCENES.MINDSET.start} durationInFrames={SCENES.MINDSET.duration}>
        <CinematicBackground variant="calm" />
        <CinematicEffects lightLeakColor="rgba(102, 126, 234, 0.15)">
          <MindsetScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/mindset.mp3")} />
      </Sequence>

      {/* Scene 6: Solution - Physical Activity */}
      <Sequence
        from={SCENES.SOLUTION_PHYSICAL.start}
        durationInFrames={SCENES.SOLUTION_PHYSICAL.duration}
      >
        <CinematicBackground variant="hope" />
        <CinematicEffects lightLeakColor="rgba(40, 167, 69, 0.2)">
          <SolutionPhysicalScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/solution_physical.mp3")} />
      </Sequence>

      {/* Scene 7: Solution - Breathing */}
      <Sequence
        from={SCENES.SOLUTION_BREATHING.start}
        durationInFrames={SCENES.SOLUTION_BREATHING.duration}
      >
        <CinematicBackground variant="calm" />
        <CinematicEffects lightLeakColor="rgba(0, 194, 255, 0.15)">
          <SolutionBreathingScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/solution_breathing.mp3")} />
      </Sequence>

      {/* Scene 8: Conclusion */}
      <Sequence from={SCENES.CONCLUSION.start} durationInFrames={SCENES.CONCLUSION.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={[THEME.primaryColor, "#4a90d9", THEME.successColor]}
            animationMode="pulse"
            cycleDuration={90}
          />
        </AbsoluteFill>
        <CinematicEffects vignetteIntensity={0.3}>
          <ConclusionScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/conclusion.mp3")} />
      </Sequence>

      {/* Scene 9: Outro */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={[THEME.successColor, THEME.primaryColor]}
            animationMode="pulse"
            cycleDuration={60}
          />
        </AbsoluteFill>
        <CinematicEffects vignetteIntensity={0.3}>
          <OutroScene />
        </CinematicEffects>
        <Audio src={staticFile("videos/StressManagementCycle/audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_DURATION, FPS };
export default StressManagementCycle;
