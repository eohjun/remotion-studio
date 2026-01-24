/**
 * AI Basic Law Video
 * "대한민국 AI 기본법, 3분 완벽 정리"
 *
 * 2026년 시행되는 AI 기본법의 핵심 내용을 알기 쉽게 설명합니다.
 *
 * Visual Design Upgrade (2026-01-24):
 * - TimelineTemplate for law progression
 * - QuoteTemplate for impactful statements
 * - CountUp for statistics
 * - LightLeak/FilmGrain for cinematic quality
 * - Varied backgrounds for visual interest
 */

import React from "react";
import { Sequence, Audio, staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

import {
  ContentTemplate,
  ComparisonTemplate,
  OutroTemplate,
  TimelineTemplate,
  QuoteTemplate,
} from "../../shared/templates/scenes";
import { AnimatedGradient, ParticleField, FloatingShapes } from "../../shared/components/backgrounds";
import { EffectsComposer, Vignette, LightLeak, FilmGrain } from "../../shared/components/effects";
import { CountUp } from "../../shared/components/progress";
import { HighlightBox } from "../../shared/components/cards";
import { SCENES, TOTAL_DURATION, THEME } from "./constants";
import { FONT_SIZES, FONT_FAMILY, COLORS, SPACING } from "../../shared/components/constants";

/** Composition props schema */
export const aiBasicLawKRSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type AIBasicLawKRProps = z.infer<typeof aiBasicLawKRSchema>;

// Cinematic Background with depth layers
const CinematicBackground: React.FC<{ variant?: "dark" | "accent" | "warm" }> = ({ variant = "dark" }) => {
  const colors = {
    dark: ["#0d1117", "#1a1a2e", "#16213e"],
    accent: ["#1a1a2e", "#16213e", "#0f3460"],
    warm: ["#1a1a2e", "#2d1b4e", "#0f3460"],
  };

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={colors[variant]}
        animationMode="shift"
        cycleDuration={180}
      />
      <FloatingShapes
        shapeTypes={["circle", "hexagon"]}
        shapeCount={8}
        colors={["rgba(102, 126, 234, 0.05)", "rgba(0, 194, 255, 0.03)"]}
      />
    </AbsoluteFill>
  );
};

// Cinematic Effects wrapper with film-like quality
const CinematicEffects: React.FC<{
  children: React.ReactNode;
  lightLeakColor?: string;
  lightLeakPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}> = ({ children, lightLeakColor, lightLeakPosition = "top-right" }) => (
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
    <Vignette intensity={0.5} color="#000000" />
    <FilmGrain intensity={0.03} animated />
  </EffectsComposer>
);

// Custom stat display with CountUp
const StatDisplay: React.FC<{
  value: number;
  suffix: string;
  label: string;
  color: string;
  delay?: number;
}> = ({ value, suffix, label, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelProgress = spring({
    frame: frame - delay - 30,
    fps,
    config: { damping: 100 },
  });

  return (
    <div style={{
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: SPACING.md,
    }}>
      <CountUp
        value={value}
        suffix={suffix}
        delay={delay}
        duration={90}
        fontSize={180}
        color={color}
      />
      <div style={{
        fontSize: FONT_SIZES.xl,
        color: COLORS.light,
        fontFamily: FONT_FAMILY.body,
        opacity: interpolate(labelProgress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(labelProgress, [0, 1], [20, 0])}px)`,
      }}>
        {label}
      </div>
    </div>
  );
};

// Key point card with animation
const KeyPointCard: React.FC<{
  icon: string;
  text: string;
  color: string;
  delay: number;
}> = ({ icon, text, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80 },
  });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: SPACING.md,
      padding: SPACING.md,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 16,
      borderLeft: `4px solid ${color}`,
      opacity: interpolate(progress, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`,
    }}>
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span style={{
        fontSize: FONT_SIZES.lg,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.body,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}>{text}</span>
    </div>
  );
};

export const AIBasicLawKR: React.FC<AIBasicLawKRProps> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.backgroundColor }}>
      {/* Scene 1: Intro - 타임라인으로 법안 진행 과정 표시 */}
      <Sequence from={SCENES.INTRO.start} durationInFrames={SCENES.INTRO.duration}>
        <CinematicBackground variant="accent" />
        <CinematicEffects lightLeakColor="rgba(102, 126, 234, 0.4)" lightLeakPosition="top-left">
          <TimelineTemplate
            title="대한민국 AI 기본법"
            layout="horizontal"
            events={[
              {
                date: "2024.12",
                title: "국회 통과",
                description: "세계 두 번째, 아시아 최초",
                icon: "🏛️",
                color: THEME.primaryColor,
                highlight: true,
              },
              {
                date: "2025.01",
                title: "법률 공포",
                description: "대통령 서명",
                icon: "📜",
                color: THEME.accentColor,
              },
              {
                date: "2026.01",
                title: "시행",
                description: "본격 적용 시작",
                icon: "🚀",
                color: THEME.warningColor,
                highlight: true,
              },
            ]}
            revealMode="sequential"
            staggerDelay={25}
            connectorColor={THEME.primaryColor}
            durationInFrames={SCENES.INTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/intro.mp3")} />
      </Sequence>

      {/* Scene 2: Hook - 강렬한 인용문으로 시청자 관심 유도 */}
      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
        <CinematicBackground variant="warm" />
        <CinematicEffects lightLeakColor="rgba(220, 53, 69, 0.3)" lightLeakPosition="bottom-right">
          <QuoteTemplate
            quote="2026년 1월부터 AI를 만들거나 사용하는 모든 기업이 새로운 의무를 지게 됩니다"
            attribution="당신의 회사도 예외가 아닐 수 있습니다"
            icon="⚠️"
            background="linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #16213e 100%)"
            showQuoteMarks={false}
            durationInFrames={SCENES.HOOK.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/hook.mp3")} />
      </Sequence>

      {/* Scene 3: Two Pillars - 산업 진흥 vs 신뢰 확보 */}
      <Sequence from={SCENES.TWO_PILLARS.start} durationInFrames={SCENES.TWO_PILLARS.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects lightLeakColor="rgba(40, 167, 69, 0.2)" lightLeakPosition="top-left">
          <ComparisonTemplate
            heading="AI 기본법의 두 축"
            leftCard={{
              title: "산업 진흥",
              color: THEME.successColor,
              items: [
                { text: "R&D 지원 확대" },
                { text: "인프라 확충" },
                { text: "인력 양성 프로그램" },
              ],
            }}
            rightCard={{
              title: "신뢰 확보",
              color: THEME.warningColor,
              items: [
                { text: "고영향 AI 규제" },
                { text: "투명성 의무" },
                { text: "AI 안전 연구소" },
              ],
            }}
            separator="&"
            durationInFrames={SCENES.TWO_PILLARS.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/two_pillars.mp3")} />
      </Sequence>

      {/* Scene 4: High Impact AI - 핵심 개념 강조 */}
      <Sequence from={SCENES.HIGH_IMPACT_AI.start} durationInFrames={SCENES.HIGH_IMPACT_AI.duration}>
        <CinematicBackground variant="accent" />
        <CinematicEffects lightLeakColor="rgba(255, 193, 7, 0.25)" lightLeakPosition="top-right">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
          }}>
            {/* Section Label */}
            <div style={{
              fontSize: FONT_SIZES.md,
              color: THEME.warningColor,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: SPACING.md,
            }}>
              핵심 개념
            </div>

            {/* Title with Icon */}
            <div style={{
              fontSize: FONT_SIZES["3xl"],
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              fontWeight: 800,
              marginBottom: SPACING.lg,
              display: "flex",
              alignItems: "center",
              gap: SPACING.md,
            }}>
              <span>🎯</span>
              <span>고영향 AI란?</span>
            </div>

            {/* Definition Box */}
            <HighlightBox
              content="사람의 생명, 안전, 기본권에 중대한 영향을 미치는 AI"
              backgroundColor="rgba(255, 193, 7, 0.15)"
              borderColor={THEME.warningColor}
              fontSize="xl"
              delay={20}
              style={{ marginBottom: SPACING.xl, maxWidth: 900 }}
            />

            {/* Examples Grid - 2x2 for wider boxes */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: SPACING.lg,
              maxWidth: 1000,
            }}>
              <KeyPointCard icon="🏥" text="의료 진단" color={THEME.primaryColor} delay={40} />
              <KeyPointCard icon="👔" text="채용 심사" color={THEME.accentColor} delay={55} />
              <KeyPointCard icon="💳" text="대출 결정" color={THEME.warningColor} delay={70} />
              <KeyPointCard icon="📚" text="학생 평가" color={THEME.successColor} delay={85} />
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/high_impact_ai.mp3")} />
      </Sequence>

      {/* Scene 5: High Impact Obligation - 의무사항 체크리스트 */}
      <Sequence from={SCENES.HIGH_IMPACT_OBLIGATION.start} durationInFrames={SCENES.HIGH_IMPACT_OBLIGATION.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects lightLeakColor="rgba(102, 126, 234, 0.2)">
          <ContentTemplate
            sectionLabel="의무사항"
            sectionLabelColor={THEME.accentColor}
            title="고영향 AI 운영 기업의 의무"
            titleIcon="✅"
            items={[
              { icon: "🔍", text: "사전 위험 평가 실시", color: THEME.primaryColor },
              { icon: "📢", text: "이용자에게 AI 사용 고지", color: THEME.accentColor },
              { icon: "🛡️", text: "안전 조치 및 모니터링", color: THEME.warningColor },
              { icon: "📋", text: "기본권 영향평가 수행", color: THEME.successColor },
            ]}
            durationInFrames={SCENES.HIGH_IMPACT_OBLIGATION.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/high_impact_obligation.mp3")} />
      </Sequence>

      {/* Scene 6: Watermark - 생성형 AI 규제 */}
      <Sequence from={SCENES.WATERMARK.start} durationInFrames={SCENES.WATERMARK.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={["#1a1a2e", "#0f3460", "#16213e"]}
            animationMode="pulse"
            cycleDuration={90}
          />
          <ParticleField
            particleCount={40}
            colors={[THEME.accentColor, "rgba(255, 255, 255, 0.3)"]}
          />
        </AbsoluteFill>
        <CinematicEffects lightLeakColor="rgba(0, 194, 255, 0.3)" lightLeakPosition="bottom-left">
          <ContentTemplate
            sectionLabel="생성형 AI"
            sectionLabelColor={THEME.accentColor}
            title="AI 생성물 워터마크 의무"
            titleIcon="🏷️"
            content={["ChatGPT, Midjourney 같은 생성형 AI도 규제 대상"]}
            items={[
              { icon: "👁️", text: "가시적 워터마크 삽입", color: THEME.primaryColor },
              { icon: "📊", text: "비가시적 메타데이터 포함", color: THEME.accentColor },
              { icon: "🚫", text: "딥페이크 범죄 방지", color: THEME.warningColor },
            ]}
            durationInFrames={SCENES.WATERMARK.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/watermark.mp3")} />
      </Sequence>

      {/* Scene 7: Committee - 조직 구조 시각화 */}
      <Sequence from={SCENES.COMMITTEE.start} durationInFrames={SCENES.COMMITTEE.duration}>
        <CinematicBackground variant="accent" />
        <CinematicEffects lightLeakColor="rgba(102, 126, 234, 0.25)" lightLeakPosition="top-right">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
          }}>
            {/* Section Label */}
            <div style={{
              fontSize: FONT_SIZES.md,
              color: THEME.primaryColor,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: SPACING.md,
            }}>
              거버넌스
            </div>

            {/* Title */}
            <div style={{
              fontSize: FONT_SIZES["3xl"],
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              fontWeight: 800,
              marginBottom: SPACING.lg,
              display: "flex",
              alignItems: "center",
              gap: SPACING.md,
            }}>
              <span>🏛️</span>
              <span>국가인공지능위원회</span>
            </div>

            {/* Org Structure */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: SPACING.lg,
            }}>
              {/* Top Level */}
              <HighlightBox
                icon="🇰🇷"
                content="대통령 직속 국가 AI 정책 컨트롤타워"
                backgroundColor="rgba(102, 126, 234, 0.2)"
                borderColor={THEME.primaryColor}
                fontSize="xl"
                delay={20}
                style={{ maxWidth: 600 }}
              />

              {/* Stats */}
              <div style={{
                display: "flex",
                gap: SPACING.xl,
                marginTop: SPACING.lg,
              }}>
                <KeyPointCard icon="👥" text="정부 장관 + 민간 전문가" color={THEME.primaryColor} delay={50} />
                <KeyPointCard icon="📊" text="약 50명 구성" color={THEME.accentColor} delay={65} />
                <KeyPointCard icon="🔧" text="8개 분과위원회" color={THEME.successColor} delay={80} />
              </div>
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/committee.mp3")} />
      </Sequence>

      {/* Scene 8: EU Comparison - 비교 분석 */}
      <Sequence from={SCENES.EU_COMPARISON.start} durationInFrames={SCENES.EU_COMPARISON.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects lightLeakColor="rgba(231, 76, 60, 0.2)" lightLeakPosition="bottom-right">
          <ComparisonTemplate
            heading="🇰🇷 한국 vs 🇪🇺 EU"
            leftCard={{
              title: "한국",
              color: THEME.primaryColor,
              items: [
                { text: "과태료 최대 3천만원" },
                { text: "1년 이상 계도기간" },
                { text: "기업 친화적 접근" },
              ],
            }}
            rightCard={{
              title: "EU",
              color: "#e74c3c",
              items: [
                { text: "매출 최대 7%까지" },
                { text: "즉시 적용" },
                { text: "규제 중심 접근" },
              ],
            }}
            separator="VS"
            durationInFrames={SCENES.EU_COMPARISON.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/eu_comparison.mp3")} />
      </Sequence>

      {/* Scene 9: Concerns - 업계 우려 (CountUp 통계) */}
      <Sequence from={SCENES.CONCERNS.start} durationInFrames={SCENES.CONCERNS.duration}>
        <CinematicBackground variant="warm" />
        <CinematicEffects lightLeakColor="rgba(220, 53, 69, 0.25)" lightLeakPosition="top-left">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
          }}>
            {/* Section Label */}
            <div style={{
              fontSize: FONT_SIZES.md,
              color: THEME.warningColor,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: SPACING.md,
            }}>
              업계 현실
            </div>

            {/* Title */}
            <div style={{
              fontSize: FONT_SIZES["2xl"],
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              fontWeight: 800,
              marginBottom: SPACING.xl,
            }}>
              스타트업 준비 현황
            </div>

            {/* Big Stat with CountUp */}
            <StatDisplay
              value={98}
              suffix="%"
              label="아직 준비가 안 됐다고 응답"
              color={THEME.warningColor}
              delay={30}
            />

            {/* Context Box */}
            <div style={{ marginTop: SPACING.xl, maxWidth: 800 }}>
              <HighlightBox
                icon="📊"
                content="규제 기준이 불명확하다는 지적도 있지만, 정부는 적극적으로 지원하겠다고 약속"
                backgroundColor="rgba(255, 255, 255, 0.08)"
                fontSize="lg"
                delay={90}
              />
            </div>

            {/* Source */}
            <div style={{
              marginTop: SPACING.lg,
              fontSize: FONT_SIZES.sm,
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: FONT_FAMILY.body,
            }}>
              출처: 스타트업얼라이언스 조사
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/concerns.mp3")} />
      </Sequence>

      {/* Scene 10: Outro - 마무리 */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={[THEME.primaryColor, "#764ba2", "#667eea"]}
            animationMode="pulse"
            cycleDuration={60}
          />
        </AbsoluteFill>
        <CinematicEffects>
          <OutroTemplate
            title="2026년 1월 22일"
            titleIcon="📅"
            takeaways={[
              { icon: "🌏", text: "세계 두 번째 AI 법" },
              { icon: "⚖️", text: "진흥과 규제의 균형" },
              { icon: "🏃", text: "준비하는 자가 기회를 잡는다" },
            ]}
            closingMessage="AI 시대의 새로운 게임 규칙이 시작됩니다"
            closingIcon="🎯"
            background={THEME.secondaryColor}
            closingBackgroundColor={THEME.primaryColor}
            closingTextColor={THEME.textColor}
            durationInFrames={SCENES.OUTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/AIBasicLawKR/audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_DURATION };
export default AIBasicLawKR;
