import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { z } from "zod";

// Shared components
import { GridPattern } from "../../shared/components/backgrounds";
import {
  ChromaticAberration,
  ColorGrading,
  Vignette,
} from "../../shared/components/effects";
import { RadarChart } from "../../shared/components/charts";
import { FONT_FAMILY } from "../../shared/components/constants";

// Constants
import {
  COMPETENCY_DATA,
  COLORS,
  SCENE_FRAMES,
  SCENE_START_FRAMES,
} from "./constants";

// Schema
export const DevCompetencyComparisonSchema = z.object({});

/**
 * Animated Title Component
 */
const AnimatedTitle: React.FC<{
  children: string;
  delay?: number;
  size?: number;
}> = ({ children, delay = 0, size = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 100 },
  });

  const translateY = interpolate(opacity, [0, 1], [30, 0]);

  return (
    <h1
      style={{
        fontSize: size,
        fontWeight: 800,
        fontFamily: FONT_FAMILY.title,
        color: COLORS.text,
        textAlign: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </h1>
  );
};

/**
 * Animated Bullet List with Stagger
 */
const StaggeredBullets: React.FC<{
  items: string[];
  startDelay?: number;
  itemDelay?: number;
  fontSize?: number;
}> = ({ items, startDelay = 30, itemDelay = 15, fontSize = 36 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {items.map((item, index) => {
        const delay = startDelay + index * itemDelay;
        const opacity = spring({
          frame: frame - delay,
          fps,
          config: { damping: 15, mass: 0.5, stiffness: 80 },
        });
        const translateX = interpolate(opacity, [0, 1], [-20, 0]);

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity,
              transform: `translateX(${translateX}px)`,
            }}
          >
            <span style={{ color: COLORS.accent, fontSize: fontSize * 0.8, fontFamily: FONT_FAMILY.body }}>{"▸"}</span>
            <span style={{ color: COLORS.text, fontSize, fontFamily: FONT_FAMILY.body }}>{item}</span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Scene 1: Hook
 */
const HookScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridPattern
        type="lines"
        size={50}
        color={COLORS.accent}
        opacity={0.25}
        animated
        backgroundColor={COLORS.dark}
      />
      <ChromaticAberration intensity={0.15} direction="radial">
        <ColorGrading preset="cold" intensity={0.6}>
          <Vignette intensity={0.4}>
            <AbsoluteFill
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 80,
              }}
            >
              <AnimatedTitle size={64}>백엔드가 더 어렵다?</AnimatedTitle>
              <div style={{ height: 40 }} />
              <AnimatedTitle delay={20} size={32}>
                2026년 개발자 역량 데이터가 말하는 진실
              </AnimatedTitle>
            </AbsoluteFill>
          </Vignette>
        </ColorGrading>
      </ChromaticAberration>
    </AbsoluteFill>
  );
};

/**
 * Scene 2: Promise
 */
const PromiseScene: React.FC = () => {
  const bullets = [
    "기술 깊이 vs 폭",
    "학습 곡선 vs AI 활용",
    "문제해결 vs 시스템 사고",
    "커뮤니케이션 vs DevOps",
  ];

  return (
    <AbsoluteFill>
      <GridPattern
        type="dots"
        size={40}
        color={COLORS.primary}
        opacity={0.2}
        animated
        backgroundColor={COLORS.dark}
      />
      <Vignette intensity={0.3}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 80,
          }}
        >
          <AnimatedTitle>4가지 개발자 유형 비교</AnimatedTitle>
          <div style={{ height: 60 }} />
          <StaggeredBullets items={bullets} />
        </AbsoluteFill>
      </Vignette>
    </AbsoluteFill>
  );
};

/**
 * Scene 3: Radar Chart Reveal - CORE VISUALIZATION
 */
const RadarRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <GridPattern
        type="hexagons"
        size={60}
        color={COLORS.primary}
        opacity={0.15}
        animated
        backgroundColor={COLORS.darkAlt}
      />
      <ColorGrading preset="teal-orange" intensity={0.5}>
        <Vignette intensity={0.3}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 60,
            }}
          >
            <h1
              style={{
                fontSize: 48,
                fontWeight: 800,
                fontFamily: FONT_FAMILY.title,
                color: COLORS.text,
                marginBottom: 40,
                opacity: titleOpacity,
              }}
            >
              개발자 역량 8차원 비교
            </h1>

            {/* RadarChart - NEW COMPONENT */}
            <RadarChart
              labels={[...COMPETENCY_DATA.labels]}
              series={COMPETENCY_DATA.series.map((s) => ({
                name: s.name,
                values: [...s.values],
                color: s.color,
                fillOpacity: 0.25,
              }))}
              size={620}
              maxValue={100}
              rings={5}
              gridColor="#ffffff"
              textColor="#ffffff"
              showDots={true}
              showLegend={true}
              animationStart={15}
              labelFontSize={18}
              legendFontSize={18}
            />
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 4: Learning Paradox
 */
const LearningParadoxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <GridPattern
        type="dots"
        size={40}
        color={COLORS.primary}
        opacity={0.2}
        backgroundColor={COLORS.dark}
      />
      <ColorGrading preset="cold" intensity={0.7}>
        <Vignette intensity={0.35}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 80,
            }}
          >
            <AnimatedTitle>프론트엔드 학습 역설</AnimatedTitle>
            <div style={{ height: 40 }} />

            {/* Comparison visualization */}
            <div
              style={{
                display: "flex",
                gap: 80,
                alignItems: "flex-end",
                marginTop: 40,
              }}
            >
              {/* Frontend */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 160,
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 200 * progress,
                    background: `linear-gradient(to top, ${COLORS.frontend}, ${COLORS.frontend}88)`,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                />
                <span style={{ color: COLORS.text, fontSize: 26, fontWeight: 600, fontFamily: FONT_FAMILY.body }}>
                  Frontend
                </span>
                <div style={{ color: COLORS.textMuted, fontSize: 16, marginTop: 4, fontFamily: FONT_FAMILY.body, whiteSpace: "nowrap" }}>
                  진입: 쉬움 | 학습: 90
                </div>
              </div>

              {/* Backend */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 160,
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 160 * progress,
                    background: `linear-gradient(to top, ${COLORS.backend}, ${COLORS.backend}88)`,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                />
                <span style={{ color: COLORS.text, fontSize: 26, fontWeight: 600, fontFamily: FONT_FAMILY.body }}>
                  Backend
                </span>
                <div style={{ color: COLORS.textMuted, fontSize: 16, marginTop: 4, fontFamily: FONT_FAMILY.body, whiteSpace: "nowrap" }}>
                  진입: 어려움 | 학습: 70
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 60,
                color: COLORS.accent,
                fontSize: 28,
                fontFamily: FONT_FAMILY.body,
                opacity: progress,
              }}
            >
              쉽게 시작 → 끝없는 학습 vs 어렵게 시작 → 안정적 성장
            </div>
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 5: Full-Stack Tradeoff
 */
const FullstackTradeoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15 },
  });
  const rightOpacity = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill>
      <GridPattern
        type="squares"
        size={45}
        color={COLORS.primary}
        opacity={0.2}
        backgroundColor={COLORS.dark}
      />
      <ColorGrading preset="cold" intensity={0.7}>
        <Vignette intensity={0.35}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 80,
            }}
          >
            <AnimatedTitle>풀스택의 트레이드오프</AnimatedTitle>
            <div style={{ height: 60 }} />

            <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
              {/* Left: Technical Depth */}
              <div
                style={{
                  background: "rgba(233, 69, 96, 0.2)",
                  border: `2px solid ${COLORS.danger}`,
                  borderRadius: 16,
                  padding: 40,
                  width: 350,
                  opacity: leftOpacity,
                }}
              >
                <h3
                  style={{
                    color: COLORS.danger,
                    fontSize: 32,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 24,
                  }}
                >
                  기술 깊이
                </h3>
                {["Frontend: 70", "Backend: 85", "Full-Stack: 70"].map(
                  (item, i) => (
                    <div
                      key={i}
                      style={{ color: COLORS.text, fontSize: 24, marginTop: 12, fontFamily: FONT_FAMILY.body }}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              {/* VS */}
              <div
                style={{
                  color: COLORS.text,
                  fontSize: 48,
                  fontWeight: 800,
                  fontFamily: FONT_FAMILY.title,
                  opacity: Math.min(leftOpacity, rightOpacity),
                }}
              >
                vs
              </div>

              {/* Right: System Thinking */}
              <div
                style={{
                  background: "rgba(40, 167, 69, 0.2)",
                  border: `2px solid ${COLORS.fullstack}`,
                  borderRadius: 16,
                  padding: 40,
                  width: 350,
                  opacity: rightOpacity,
                }}
              >
                <h3
                  style={{
                    color: COLORS.fullstack,
                    fontSize: 32,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 24,
                  }}
                >
                  시스템 사고
                </h3>
                {["Frontend: 60", "Backend: 80", "Full-Stack: 90"].map(
                  (item, i) => (
                    <div
                      key={i}
                      style={{ color: COLORS.text, fontSize: 24, marginTop: 12, fontFamily: FONT_FAMILY.body }}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 6: AI Amplifier
 */
const AIAmplifierScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [
    { label: "AI 코드 비율", value: 41, color: COLORS.primary },
    { label: "Frontend AI", value: 80, color: COLORS.frontend },
    { label: "Full-Stack AI", value: 85, color: COLORS.fullstack },
  ];

  return (
    <AbsoluteFill>
      <GridPattern
        type="dots"
        size={35}
        color={COLORS.primary}
        opacity={0.2}
        animated
        backgroundColor={COLORS.darkAlt}
      />
      <ChromaticAberration intensity={0.18} direction="horizontal">
        <ColorGrading preset="teal-orange" intensity={0.6}>
          <Vignette intensity={0.3}>
            <AbsoluteFill
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 80,
              }}
            >
              <AnimatedTitle>AI는 역량 증폭기</AnimatedTitle>
              <div style={{ height: 60 }} />

              <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
                {bars.map((bar, index) => {
                  const progress = spring({
                    frame: frame - 30 - index * 15,
                    fps,
                    config: { damping: 15, mass: 0.5, stiffness: 80 },
                  });

                  return (
                    <div key={bar.label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: 140,
                          height: (bar.value / 100) * 250 * progress,
                          background: `linear-gradient(to top, ${bar.color}, ${bar.color}88)`,
                          borderRadius: 8,
                          marginBottom: 16,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          paddingTop: 12,
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: 28,
                            fontWeight: 700,
                            fontFamily: FONT_FAMILY.title,
                          }}
                        >
                          {Math.round(bar.value * progress)}%
                        </span>
                      </div>
                      <span style={{ color: COLORS.text, fontSize: 22, fontFamily: FONT_FAMILY.body }}>
                        {bar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AbsoluteFill>
          </Vignette>
        </ColorGrading>
      </ChromaticAberration>
    </AbsoluteFill>
  );
};

/**
 * Scene 7: DevOps Uniqueness
 */
const DevOpsUniquenessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <GridPattern
        type="dots"
        size={35}
        color={COLORS.devops}
        opacity={0.25}
        animated
        backgroundColor={COLORS.dark}
      />
      <ColorGrading preset="cold" intensity={0.6}>
        <Vignette intensity={0.35}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 80,
            }}
          >
            <AnimatedTitle>DevOps의 독보적 영역</AnimatedTitle>
            <div style={{ height: 60 }} />

            <div style={{ display: "flex", gap: 100 }}>
              {/* Gauge 1: System Thinking */}
              <div style={{ textAlign: "center" }}>
                <svg width={200} height={200} viewBox="0 0 200 200">
                  <circle
                    cx={100}
                    cy={100}
                    r={80}
                    fill="none"
                    stroke="#333"
                    strokeWidth={16}
                  />
                  <circle
                    cx={100}
                    cy={100}
                    r={80}
                    fill="none"
                    stroke={COLORS.devops}
                    strokeWidth={16}
                    strokeDasharray={`${95 * 5.02 * progress} 999`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x={100}
                    y={100}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={COLORS.text}
                    fontSize={48}
                    fontWeight={700}
                    fontFamily="Pretendard, SF Pro Display, -apple-system, sans-serif"
                  >
                    {Math.round(95 * progress)}
                  </text>
                </svg>
                <div
                  style={{ color: COLORS.text, fontSize: 24, marginTop: 16, fontFamily: FONT_FAMILY.body }}
                >
                  시스템 사고
                </div>
              </div>

              {/* Gauge 2: Infrastructure */}
              <div style={{ textAlign: "center" }}>
                <svg width={200} height={200} viewBox="0 0 200 200">
                  <circle
                    cx={100}
                    cy={100}
                    r={80}
                    fill="none"
                    stroke="#333"
                    strokeWidth={16}
                  />
                  <circle
                    cx={100}
                    cy={100}
                    r={80}
                    fill="none"
                    stroke={COLORS.devops}
                    strokeWidth={16}
                    strokeDasharray={`${95 * 5.02 * progress} 999`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x={100}
                    y={100}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={COLORS.text}
                    fontSize={48}
                    fontWeight={700}
                    fontFamily="Pretendard, SF Pro Display, -apple-system, sans-serif"
                  >
                    {Math.round(95 * progress)}
                  </text>
                </svg>
                <div
                  style={{ color: COLORS.text, fontSize: 24, marginTop: 16, fontFamily: FONT_FAMILY.body }}
                >
                  인프라 역량
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 50,
                color: COLORS.devops,
                fontSize: 28,
                fontFamily: FONT_FAMILY.body,
                opacity: progress,
              }}
            >
              두 영역 모두 95점으로 독보적
            </div>
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 8: Stats 2026
 */
const Stats2026Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { label: "신규 일자리", value: "900,000+", icon: "💼" },
    { label: "AI 도구 사용률", value: "76%", icon: "🤖" },
    { label: "연봉 차이", value: "~$270", icon: "💰" },
  ];

  return (
    <AbsoluteFill>
      <GridPattern
        type="dots"
        size={40}
        color={COLORS.primary}
        opacity={0.2}
        backgroundColor={COLORS.dark}
      />
      <ColorGrading preset="teal-orange" intensity={0.65}>
        <Vignette intensity={0.3}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 80,
            }}
          >
            <AnimatedTitle>2026년 개발자 시장</AnimatedTitle>
            <div style={{ height: 60 }} />

            <div style={{ display: "flex", gap: 80 }}>
              {stats.map((stat, index) => {
                const opacity = spring({
                  frame: frame - 30 - index * 20,
                  fps,
                  config: { damping: 15 },
                });

                return (
                  <div
                    key={stat.label}
                    style={{
                      textAlign: "center",
                      opacity,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 16,
                      padding: "40px 50px",
                    }}
                  >
                    <div style={{ fontSize: 56, marginBottom: 16 }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        color: COLORS.accent,
                        fontSize: 48,
                        fontWeight: 700,
                        fontFamily: FONT_FAMILY.title,
                        marginBottom: 8,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ color: COLORS.text, fontSize: 24, fontFamily: FONT_FAMILY.body }}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 9: Synthesis
 */
const SynthesisScene: React.FC = () => {
  const bullets = [
    "Frontend: 학습 지속성 + AI 활용",
    "Backend: 기술 깊이 + 시스템 사고",
    "Full-Stack: 폭넓은 이해 + 통합 능력",
    "DevOps: 인프라 + 시스템 설계",
  ];

  return (
    <AbsoluteFill>
      <GridPattern
        type="lines"
        size={50}
        color={COLORS.primary}
        opacity={0.2}
        animated
        backgroundColor={COLORS.dark}
      />
      <ColorGrading preset="cinematic" intensity={0.7}>
        <Vignette intensity={0.4}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 80,
            }}
          >
            <AnimatedTitle>역량은 단일 차원이 아니다</AnimatedTitle>
            <div style={{ height: 60 }} />
            <StaggeredBullets items={bullets} itemDelay={20} />
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 10: Conclusion
 */
const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20, mass: 0.8, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <GridPattern
        type="hexagons"
        size={70}
        color={COLORS.primary}
        opacity={0.15}
        animated
        backgroundColor={COLORS.darkAlt}
      />
      <ColorGrading preset="cold" intensity={0.6}>
        <Vignette intensity={0.5}>
          <AbsoluteFill
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 100,
            }}
          >
            <div
              style={{
                maxWidth: 1000,
                textAlign: "center",
                opacity,
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  color: COLORS.text,
                  lineHeight: 1.6,
                  fontWeight: 500,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                "개발자의 역량은 레이더 차트처럼
                <br />
                <span style={{ color: COLORS.accent, fontWeight: 700 }}>
                  다차원적
                </span>
                입니다"
              </div>
            </div>
          </AbsoluteFill>
        </Vignette>
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Scene 11: Outro
 */
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  return (
    <AbsoluteFill>
      <GridPattern
        type="dots"
        size={40}
        color={COLORS.primary}
        opacity={0.25}
        backgroundColor={COLORS.dark}
      />
      <Vignette intensity={0.3}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity,
          }}
        >
          <div
            style={{ color: COLORS.text, fontSize: 48, fontWeight: 700, fontFamily: FONT_FAMILY.title }}
          >
            구독과 좋아요
          </div>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 28,
              marginTop: 20,
              fontFamily: FONT_FAMILY.body,
            }}
          >
            다음 영상에서 만나요
          </div>
        </AbsoluteFill>
      </Vignette>
    </AbsoluteFill>
  );
};

/**
 * Main Composition
 */
export const DevCompetencyComparison: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Scene 1: Hook */}
      <Sequence from={SCENE_START_FRAMES.hook} durationInFrames={SCENE_FRAMES.hook}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Promise */}
      <Sequence from={SCENE_START_FRAMES.promise} durationInFrames={SCENE_FRAMES.promise}>
        <PromiseScene />
      </Sequence>

      {/* Scene 3: Radar Chart Reveal */}
      <Sequence from={SCENE_START_FRAMES.radarReveal} durationInFrames={SCENE_FRAMES.radarReveal}>
        <RadarRevealScene />
      </Sequence>

      {/* Scene 4: Learning Paradox */}
      <Sequence from={SCENE_START_FRAMES.learningParadox} durationInFrames={SCENE_FRAMES.learningParadox}>
        <LearningParadoxScene />
      </Sequence>

      {/* Scene 5: Full-Stack Tradeoff */}
      <Sequence from={SCENE_START_FRAMES.fullstackTradeoff} durationInFrames={SCENE_FRAMES.fullstackTradeoff}>
        <FullstackTradeoffScene />
      </Sequence>

      {/* Scene 6: AI Amplifier */}
      <Sequence from={SCENE_START_FRAMES.aiAmplifier} durationInFrames={SCENE_FRAMES.aiAmplifier}>
        <AIAmplifierScene />
      </Sequence>

      {/* Scene 7: DevOps Uniqueness */}
      <Sequence from={SCENE_START_FRAMES.devopsUniqueness} durationInFrames={SCENE_FRAMES.devopsUniqueness}>
        <DevOpsUniquenessScene />
      </Sequence>

      {/* Scene 8: Stats 2026 */}
      <Sequence from={SCENE_START_FRAMES.stats2026} durationInFrames={SCENE_FRAMES.stats2026}>
        <Stats2026Scene />
      </Sequence>

      {/* Scene 9: Synthesis */}
      <Sequence from={SCENE_START_FRAMES.synthesis} durationInFrames={SCENE_FRAMES.synthesis}>
        <SynthesisScene />
      </Sequence>

      {/* Scene 10: Conclusion */}
      <Sequence from={SCENE_START_FRAMES.conclusion} durationInFrames={SCENE_FRAMES.conclusion}>
        <ConclusionScene />
      </Sequence>

      {/* Scene 11: Outro */}
      <Sequence from={SCENE_START_FRAMES.outro} durationInFrames={SCENE_FRAMES.outro}>
        <OutroScene />
      </Sequence>

      {/* Audio tracks */}
      <Sequence from={SCENE_START_FRAMES.hook}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/hook.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.promise}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/promise.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.radarReveal}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/radar_reveal.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.learningParadox}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/insight_learning_paradox.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.fullstackTradeoff}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/insight_fullstack_tradeoff.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.aiAmplifier}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/insight_ai_amplifier.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.devopsUniqueness}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/insight_devops_uniqueness.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.stats2026}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/stats_2026.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.synthesis}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/synthesis.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.conclusion}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/conclusion.mp3")} />
      </Sequence>
      <Sequence from={SCENE_START_FRAMES.outro}>
        <Audio src={staticFile("videos/DevCompetencyComparison/audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default DevCompetencyComparison;
