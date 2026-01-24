/**
 * Procrastination Psychology Video
 * "프로크래스티네이션의 심리학 - 당신의 뇌 안에서 벌어지는 전쟁"
 *
 * A comprehensive exploration of the neuroscience behind procrastination
 * and evidence-based strategies to overcome it.
 *
 * Visual Design:
 * - Brain battle visualization (red limbic vs blue prefrontal cortex)
 * - Animated statistics with CountUp
 * - Steel's TMT equation display
 * - 3-column grid for procrastinator types
 * - 5-4-3-2-1 countdown animation
 * - Vicious cycle diagram
 */

import React from "react";
import { Sequence, Audio, staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

import {
  IntroTemplate,
  ComparisonTemplate,
  ContentTemplate,
  DataVisualizationTemplate,
  QuoteTemplate,
  TableListTemplate,
  OutroTemplate,
} from "../../shared/templates/scenes";
import { AnimatedGradient, FloatingShapes } from "../../shared/components/backgrounds";
import { EffectsComposer, Vignette, LightLeak, FilmGrain } from "../../shared/components/effects";
import { CountUp } from "../../shared/components/progress";
import { HighlightBox } from "../../shared/components/cards";
import { CycleDiagram } from "../../shared/components/diagrams";
import { SCENES, TOTAL_DURATION, THEME } from "./constants";
import { FONT_SIZES, FONT_FAMILY, COLORS, SPACING, RADIUS, SPRING_CONFIGS } from "../../shared/components/constants";

/** Composition props schema */
export const procrastinationPsychologySchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type ProcrastinationPsychologyProps = z.infer<typeof procrastinationPsychologySchema>;

// Cinematic Background with brain battle gradient
const CinematicBackground: React.FC<{
  variant?: "dark" | "limbic" | "prefrontal" | "battle" | "success";
}> = ({ variant = "dark" }) => {
  const colors = {
    dark: ["#1a1a2e", "#16213e"],
    limbic: ["#1a1a2e", "#e94560", "#1a1a2e"],
    prefrontal: ["#16213e", "#4a90d9", "#16213e"],
    battle: ["#e94560", "#1a1a2e", "#4a90d9"],
    success: ["#16213e", "#22c55e", "#4a90d9"],
  };

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={colors[variant]}
        animationMode={variant === "battle" ? "cycle" : "pulse"}
        cycleDuration={variant === "battle" ? 90 : 120}
      />
      <FloatingShapes
        shapeTypes={["circle"]}
        shapeCount={8}
        colors={["rgba(233, 69, 96, 0.05)", "rgba(74, 144, 217, 0.05)"]}
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
}> = ({ children, lightLeakColor, lightLeakPosition = "top-right", vignetteIntensity = 0.4 }) => (
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

// Custom brain comparison visualization for hook scene
const BrainBattleVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 150 },
  });

  const rightProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 80, stiffness: 150 },
  });

  const vsProgress = spring({
    frame: frame - 40,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.02;

  return (
    <AbsoluteFill style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 80,
      padding: SPACING.xl,
    }}>
      {/* Limbic System - Left */}
      <div style={{
        opacity: interpolate(leftProgress, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(leftProgress, [0, 1], [-100, 0])}px) scale(${pulseScale})`,
        textAlign: "center",
        flex: 1,
        maxWidth: 550,
      }}>
        <div style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.limbicColor}80, ${THEME.limbicColor}20)`,
          margin: "0 auto 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${THEME.limbicColor}40`,
        }}>
          <span style={{ fontSize: 80 }}>🔥</span>
        </div>
        <h3 style={{
          fontSize: FONT_SIZES["2xl"],
          fontWeight: 700,
          color: THEME.limbicColor,
          fontFamily: FONT_FAMILY.title,
          marginBottom: SPACING.sm,
        }}>
          변연계
        </h3>
        <p style={{
          fontSize: FONT_SIZES.lg,
          color: COLORS.white,
          fontFamily: FONT_FAMILY.body,
          opacity: 0.9,
        }}>
          즐거움 추구, 고통 회피
        </p>
      </div>

      {/* VS Separator */}
      <div style={{
        opacity: interpolate(vsProgress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(vsProgress, [0, 1], [0.5, 1])})`,
      }}>
        <span style={{
          fontSize: FONT_SIZES["3xl"],
          fontWeight: 800,
          color: COLORS.white,
          fontFamily: FONT_FAMILY.title,
          textShadow: "0 0 20px rgba(255,255,255,0.5)",
        }}>
          VS
        </span>
      </div>

      {/* Prefrontal Cortex - Right */}
      <div style={{
        opacity: interpolate(rightProgress, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(rightProgress, [0, 1], [100, 0])}px)`,
        textAlign: "center",
        flex: 1,
        maxWidth: 550,
      }}>
        <div style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.prefrontalColor}80, ${THEME.prefrontalColor}20)`,
          margin: "0 auto 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${THEME.prefrontalColor}40`,
        }}>
          <span style={{ fontSize: 80 }}>🧠</span>
        </div>
        <h3 style={{
          fontSize: FONT_SIZES["2xl"],
          fontWeight: 700,
          color: THEME.prefrontalColor,
          fontFamily: FONT_FAMILY.title,
          marginBottom: SPACING.sm,
        }}>
          전전두엽 피질
        </h3>
        <p style={{
          fontSize: FONT_SIZES.lg,
          color: COLORS.white,
          fontFamily: FONT_FAMILY.body,
          opacity: 0.9,
        }}>
          장기 계획, 합리적 판단
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Animated Equation Component
const EquationDisplay: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const equationProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100, stiffness: 200 },
  });

  const variablesProgress = spring({
    frame: frame - 90,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: SPACING.xl,
    }}>
      {/* Equation */}
      <div style={{
        opacity: interpolate(equationProgress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(equationProgress, [0, 1], [0.8, 1])})`,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: `${SPACING.lg}px ${SPACING.xl}px`,
        borderRadius: RADIUS.xl,
        border: "2px solid rgba(255, 255, 255, 0.2)",
      }}>
        <div style={{
          fontSize: FONT_SIZES["2xl"],
          fontWeight: 700,
          color: COLORS.white,
          fontFamily: FONT_FAMILY.title,
          textAlign: "center",
        }}>
          <span style={{ color: THEME.prefrontalColor }}>동기</span>
          <span style={{ margin: "0 16px" }}>=</span>
          <span style={{ color: THEME.successColor }}>(기대감 x 가치)</span>
          <span style={{ margin: "0 16px" }}>/</span>
          <span style={{ color: THEME.limbicColor }}>(충동성 x 지연)</span>
        </div>
      </div>

      {/* Variables */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: SPACING.md,
        opacity: interpolate(variablesProgress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(variablesProgress, [0, 1], [20, 0])}px)`,
        maxWidth: 1200,
      }}>
        {[
          { name: "기대감(E)", desc: "결과 발생 확률", color: THEME.successColor, icon: "🎯" },
          { name: "가치(V)", desc: "보상의 가치", color: THEME.successColor, icon: "💎" },
          { name: "충동성(I)", desc: "지연 민감도", color: THEME.limbicColor, icon: "⚡" },
          { name: "지연(D)", desc: "보상까지의 시간", color: THEME.limbicColor, icon: "⏰" },
        ].map((v, i) => (
          <div key={i} style={{
            backgroundColor: `${v.color}15`,
            padding: SPACING.md,
            borderRadius: RADIUS.lg,
            borderLeft: `4px solid ${v.color}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{v.icon}</div>
            <div style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: 700,
              color: v.color,
              fontFamily: FONT_FAMILY.title,
              marginBottom: 4,
            }}>
              {v.name}
            </div>
            <div style={{
              fontSize: FONT_SIZES.md,
              color: COLORS.light,
              fontFamily: FONT_FAMILY.body,
            }}>
              {v.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Countdown Animation Component for 5-Second Rule
const CountdownAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countdownStart = 180; // Start countdown after intro text

  const numbers = [5, 4, 3, 2, 1];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.md,
      marginTop: SPACING.lg,
    }}>
      {numbers.map((num, i) => {
        const showAt = countdownStart + i * 20;
        const progress = spring({
          frame: frame - showAt,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        const isActive = frame >= showAt && frame < showAt + 20;

        return (
          <div
            key={num}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: isActive ? THEME.prefrontalColor : "rgba(74, 144, 217, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(progress, [0, 1], [0.5, isActive ? 1.2 : 1], { extrapolateRight: "clamp" })})`,
              boxShadow: isActive ? `0 0 30px ${THEME.prefrontalColor}80` : "none",
            }}
          >
            <span style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
            }}>
              {num}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const ProcrastinationPsychology: React.FC<ProcrastinationPsychologyProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.backgroundColor }}>
      {/* Scene 1: Intro - Title Card */}
      <Sequence from={SCENES.INTRO.start} durationInFrames={SCENES.INTRO.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects lightLeakColor="rgba(233, 69, 96, 0.3)" lightLeakPosition="top-left">
          <IntroTemplate
            title="프로크래스티네이션의 심리학"
            subtitle="당신의 뇌 안에서 벌어지는 전쟁"
            background="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            durationInFrames={SCENES.INTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/intro.mp3")} />
      </Sequence>

      {/* Scene 2: Hook - Brain War Visualization */}
      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
        <CinematicBackground variant="battle" />
        <CinematicEffects vignetteIntensity={0.5}>
          <BrainBattleVisualization />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/hook.mp3")} />
      </Sequence>

      {/* Scene 3: Statistics - Data Visualization */}
      <Sequence from={SCENES.STATISTICS.start} durationInFrames={SCENES.STATISTICS.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects lightLeakColor="rgba(74, 144, 217, 0.2)">
          <DataVisualizationTemplate
            sectionLabel="현황"
            title="프로크래스티네이션 통계"
            titleIcon="📊"
            chartType="progress"
            data={[
              { label: "대학생 미루기", value: 75, color: THEME.limbicColor, icon: "🎓" },
              { label: "직장인 매일 미루기", value: 88, color: THEME.prefrontalColor, icon: "💼" },
              { label: "만성적 미루기 (현재)", value: 20, color: THEME.accentColor, icon: "📈" },
            ]}
            source="심리학 연구 종합"
            durationInFrames={SCENES.STATISTICS.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/statistics.mp3")} />
      </Sequence>

      {/* Scene 4: Brain Systems - Split Explanation */}
      <Sequence from={SCENES.BRAIN_SYSTEMS.start} durationInFrames={SCENES.BRAIN_SYSTEMS.duration}>
        <CinematicBackground variant="battle" />
        <CinematicEffects>
          <ComparisonTemplate
            heading="두 뇌 시스템의 전쟁"
            leftCard={{
              title: "변연계",
              color: THEME.limbicColor,
              icon: "🔥",
              items: [
                { text: "뇌의 오래된 부분" },
                { text: "본능적이고 강력함" },
                { text: "즐거움 추구, 고통 회피" },
              ],
            }}
            rightCard={{
              title: "전전두엽 피질",
              color: THEME.prefrontalColor,
              icon: "🧠",
              items: [
                { text: "뇌의 새롭고 덜 발달된 부분" },
                { text: "상대적으로 약함" },
                { text: "합리적 판단, 장기 계획" },
              ],
            }}
            separator="VS"
            durationInFrames={SCENES.BRAIN_SYSTEMS.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/brain_systems.mp3")} />
      </Sequence>

      {/* Scene 5: Conflict Mechanism - Custom Sequential Flow */}
      <Sequence from={SCENES.CONFLICT_MECHANISM.start} durationInFrames={SCENES.CONFLICT_MECHANISM.duration}>
        <CinematicBackground variant="limbic" />
        <CinematicEffects lightLeakColor="rgba(233, 69, 96, 0.3)">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            padding: SPACING.xl,
          }}>
            {/* Title */}
            <div style={{
              textAlign: "center",
              marginBottom: SPACING.lg,
            }}>
              <h2 style={{
                fontSize: FONT_SIZES["2xl"],
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                margin: 0,
              }}>
                변연계의 승리 과정
              </h2>
            </div>

            {/* Flow Steps */}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: SPACING.md,
            }}>
              {[
                { icon: "📋", text: "불쾌한 과제 발생", step: 1 },
                { icon: "⚡", text: "변연계 즉각 반응", step: 2 },
                { icon: "😰", text: "편도체가 불안 생성", step: 3 },
                { icon: "📱", text: "즉각적 안도감 추구", step: 4 },
                { icon: "😔", text: "전전두엽 피질 패배", step: 5 },
              ].map((item, index) => {
                const stepProgress = spring({
                  frame: frame - SCENES.CONFLICT_MECHANISM.start - 30 - index * 15,
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                });
                const isLast = index === 4;
                return (
                  <React.Fragment key={index}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: SPACING.sm,
                      padding: SPACING.md,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderRadius: RADIUS.lg,
                      border: `2px solid ${THEME.limbicColor}40`,
                      minWidth: 160,
                      opacity: interpolate(stepProgress, [0, 1], [0, 1]),
                      transform: `scale(${interpolate(stepProgress, [0, 1], [0.8, 1])})`,
                    }}>
                      <span style={{ fontSize: 48 }}>{item.icon}</span>
                      <span style={{
                        fontSize: FONT_SIZES.lg,
                        fontWeight: 600,
                        color: COLORS.white,
                        fontFamily: FONT_FAMILY.body,
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}>
                        {item.text}
                      </span>
                    </div>
                    {!isLast && (
                      <div style={{
                        fontSize: 32,
                        color: THEME.limbicColor,
                        opacity: interpolate(stepProgress, [0, 1], [0, 0.8]),
                      }}>
                        →
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/conflict_mechanism.mp3")} />
      </Sequence>

      {/* Scene 6: fMRI Evidence */}
      <Sequence from={SCENES.FMRI_EVIDENCE.start} durationInFrames={SCENES.FMRI_EVIDENCE.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={["#1a1a2e", "#0f3460", "#16213e"]}
            animationMode="pulse"
            cycleDuration={120}
          />
          <FloatingShapes
            shapeTypes={["hexagon"]}
            shapeCount={12}
            colors={["rgba(74, 144, 217, 0.08)", "rgba(233, 69, 96, 0.05)"]}
          />
        </AbsoluteFill>
        <CinematicEffects vignetteIntensity={0.5}>
          <ContentTemplate
            sectionLabel="과학적 증거"
            sectionLabelColor={THEME.prefrontalColor}
            title="fMRI 스캔 연구 결과"
            titleIcon="🔬"
            content={[
              "미루는 사람들의 뇌에서 변연계 영역이 과도하게 활성화되고,",
              "전전두엽 피질은 덜 활성화됩니다."
            ]}
            highlightContent="프로크래스티네이션 = 인지 통제의 실패"
            highlightIcon="💡"
            durationInFrames={SCENES.FMRI_EVIDENCE.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/fmri_evidence.mp3")} />
      </Sequence>

      {/* Scene 7: Steel's Equation Intro */}
      <Sequence from={SCENES.STEEL_EQUATION_INTRO.start} durationInFrames={SCENES.STEEL_EQUATION_INTRO.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects lightLeakColor="rgba(74, 144, 217, 0.2)" lightLeakPosition="bottom-right">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
          }}>
            {/* Section Label */}
            <div style={{
              fontSize: FONT_SIZES.lg,
              color: THEME.prefrontalColor,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: SPACING.md,
            }}>
              피어스 스틸의 동기 공식
            </div>

            <EquationDisplay frame={frame - SCENES.STEEL_EQUATION_INTRO.start} fps={fps} />
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/steel_equation_intro.mp3")} />
      </Sequence>

      {/* Scene 8: Equation Insight */}
      <Sequence from={SCENES.EQUATION_INSIGHT.start} durationInFrames={SCENES.EQUATION_INSIGHT.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects>
          <ContentTemplate
            sectionLabel="핵심 인사이트"
            sectionLabelColor={THEME.successColor}
            title="마감 효과"
            titleIcon="📈"
            content={[
              "마감이 멀 때는 동기가 낮고,",
              "마감이 임박해야 동기가 급상승합니다."
            ]}
            highlightContent="이것은 비합리적이 아니라, 뇌의 수학이다"
            highlightIcon="🧮"
            durationInFrames={SCENES.EQUATION_INSIGHT.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/equation_insight.mp3")} />
      </Sequence>

      {/* Scene 9: Procrastinator Types - Grid Layout */}
      <Sequence from={SCENES.PROCRASTINATOR_TYPES.start} durationInFrames={SCENES.PROCRASTINATOR_TYPES.duration}>
        <CinematicBackground variant="dark" />
        <CinematicEffects>
          <TableListTemplate
            sectionLabel="유형 분류"
            sectionLabelColor={THEME.accentColor}
            title="미루는 사람의 3가지 유형"
            titleIcon="👥"
            displayMode="grid"
            gridColumns={3}
            items={[
              {
                text: "감정 회피자",
                subtext: "불안과 지루함을 피하려고 미룸",
                icon: "😰",
                color: THEME.limbicColor,
              },
              {
                text: "완벽주의자",
                subtext: "실패가 두려워 시작조차 못함",
                icon: "🎯",
                color: THEME.prefrontalColor,
              },
              {
                text: "아드레날린 중독자",
                subtext: "막판 스트레스를 즐기며 미룸",
                icon: "⚡",
                color: THEME.successColor,
              },
            ]}
            durationInFrames={SCENES.PROCRASTINATOR_TYPES.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/procrastinator_types.mp3")} />
      </Sequence>

      {/* Scene 10: Health Impact */}
      <Sequence from={SCENES.HEALTH_IMPACT.start} durationInFrames={SCENES.HEALTH_IMPACT.duration}>
        <CinematicBackground variant="limbic" />
        <CinematicEffects vignetteIntensity={0.6} lightLeakColor="rgba(233, 69, 96, 0.25)">
          <AbsoluteFill style={{
            display: "flex",
            padding: SPACING.xl,
          }}>
            {/* Left side - Content */}
            <div style={{ flex: 1, paddingRight: SPACING.lg }}>
              <ContentTemplate
                sectionLabel="경고"
                sectionLabelColor={THEME.limbicColor}
                title="건강에 미치는 영향"
                titleIcon="⚠️"
                items={[
                  { icon: "😔", text: "우울, 불안, 스트레스 수준 상승", color: THEME.limbicColor },
                  { icon: "😴", text: "수면의 질 저하", color: THEME.limbicColor },
                  { icon: "🚶", text: "신체 활동 감소", color: THEME.limbicColor },
                  { icon: "😢", text: "외로움 증가", color: THEME.limbicColor },
                ]}
                durationInFrames={SCENES.HEALTH_IMPACT.duration}
                useTransition={false}
                style={{ flex: 1, backgroundColor: "transparent" }}
              />
            </div>

            {/* Right side - Vicious Cycle */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <CycleDiagram
                steps={[
                  { text: "스트레스", icon: "😫" },
                  { text: "미루기", icon: "📱" },
                  { text: "불안 증가", icon: "😰" },
                  { text: "더 큰\n스트레스", icon: "💥" },
                ]}
                centerLabel="악순환"
                color={THEME.limbicColor}
                size="large"
                language="ko"
              />
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/health_impact.mp3")} />
      </Sequence>

      {/* Scene 11: Strategy Intro - Transition Quote */}
      <Sequence from={SCENES.STRATEGY_INTRO.start} durationInFrames={SCENES.STRATEGY_INTRO.duration}>
        <CinematicBackground variant="battle" />
        <CinematicEffects lightLeakColor="rgba(255, 255, 255, 0.2)">
          <QuoteTemplate
            quote="어떻게 이 전쟁에서 이길 수 있을까?"
            attribution="과학은 답을 제시합니다"
            icon="💡"
            background="linear-gradient(135deg, #e94560 0%, #1a1a2e 50%, #4a90d9 100%)"
            showQuoteMarks={false}
            durationInFrames={SCENES.STRATEGY_INTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/strategy_intro.mp3")} />
      </Sequence>

      {/* Scene 12: Five Second Rule */}
      <Sequence from={SCENES.FIVE_SECOND_RULE.start} durationInFrames={SCENES.FIVE_SECOND_RULE.duration}>
        <CinematicBackground variant="prefrontal" />
        <CinematicEffects lightLeakColor="rgba(74, 144, 217, 0.3)">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
          }}>
            <div style={{
              fontSize: FONT_SIZES.lg,
              color: THEME.prefrontalColor,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 700,
              marginBottom: SPACING.sm,
            }}>
              전략 1
            </div>
            <h2 style={{
              fontSize: FONT_SIZES["3xl"],
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              marginBottom: SPACING.md,
            }}>
              5초 규칙 ⏱️
            </h2>
            <p style={{
              fontSize: FONT_SIZES.xl,
              color: COLORS.light,
              fontFamily: FONT_FAMILY.body,
              textAlign: "center",
              maxWidth: 900,
              marginBottom: SPACING.lg,
            }}>
              불쾌한 과제가 주어지면 5초 안에 즉각 행동
            </p>

            <CountdownAnimation />

            <div style={{
              marginTop: SPACING.xl,
              padding: `${SPACING.md}px ${SPACING.xl}px`,
              backgroundColor: "rgba(74, 144, 217, 0.2)",
              borderRadius: RADIUS.lg,
              maxWidth: 1100,
            }}>
              <p style={{
                fontSize: FONT_SIZES.xl,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                textAlign: "center",
                margin: 0,
                whiteSpace: "nowrap",
              }}>
                💡 변연계 활성화 전에 전전두엽 피질이 통제권 획득
              </p>
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/five_second_rule.mp3")} />
      </Sequence>

      {/* Scene 13: Task Decomposition */}
      <Sequence from={SCENES.TASK_DECOMPOSITION.start} durationInFrames={SCENES.TASK_DECOMPOSITION.duration}>
        <CinematicBackground variant="prefrontal" />
        <CinematicEffects>
          <ContentTemplate
            sectionLabel="전략 2"
            sectionLabelColor={THEME.prefrontalColor}
            title="과제 분해"
            titleIcon="🧩"
            content={["큰 과제를 작은 조각으로 나누기"]}
            items={[
              { icon: "📈", text: "기대감(E) 상승", color: THEME.successColor },
              { icon: "📉", text: "지연(D) 감소", color: THEME.successColor },
              { icon: "🚀", text: "동기 자연 상승", color: THEME.prefrontalColor },
            ]}
            highlightContent="첫 걸음에만 집중하세요"
            highlightIcon="👣"
            durationInFrames={SCENES.TASK_DECOMPOSITION.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/task_decomposition.mp3")} />
      </Sequence>

      {/* Scene 14: Specific Deadlines */}
      <Sequence from={SCENES.SPECIFIC_DEADLINES.start} durationInFrames={SCENES.SPECIFIC_DEADLINES.duration}>
        <CinematicBackground variant="prefrontal" />
        <CinematicEffects>
          <ContentTemplate
            sectionLabel="전략 3"
            sectionLabelColor={THEME.prefrontalColor}
            title="구체적 마감 설정"
            titleIcon="📅"
            content={[
              "모호한 목표 → 지연 값 무한대",
              "명확한 마감 → 동기 상승"
            ]}
            highlightContent="타인에게 공개하여 사회적 압력 활용"
            highlightIcon="📢"
            durationInFrames={SCENES.SPECIFIC_DEADLINES.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/specific_deadlines.mp3")} />
      </Sequence>

      {/* Scene 15: Habit Formation - 66 Days */}
      <Sequence from={SCENES.HABIT_FORMATION.start} durationInFrames={SCENES.HABIT_FORMATION.duration}>
        <CinematicBackground variant="prefrontal" />
        <CinematicEffects lightLeakColor="rgba(34, 197, 94, 0.2)">
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
          }}>
            <div style={{
              fontSize: FONT_SIZES.lg,
              color: THEME.prefrontalColor,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 700,
              marginBottom: SPACING.sm,
            }}>
              전략 4
            </div>
            <h2 style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              marginBottom: SPACING.lg,
            }}>
              66일 습관 법칙 📆
            </h2>

            {/* Big Number with CountUp */}
            <div style={{
              marginBottom: SPACING.lg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <CountUp
                  value={66}
                  suffix="일"
                  delay={30}
                  duration={60}
                  fontSize={140}
                  color={THEME.successColor}
                />
              </div>
              <p style={{
                fontSize: FONT_SIZES.xl,
                color: COLORS.light,
                fontFamily: FONT_FAMILY.body,
                textAlign: "center",
                marginTop: SPACING.sm,
              }}>
                습관 자동화까지 평균 소요 시간
              </p>
            </div>

            {/* Insight Box */}
            <HighlightBox
              icon="💡"
              content="한 번에 하나씩만 시도 - 의지력은 제한적 자원"
              backgroundColor="rgba(34, 197, 94, 0.2)"
              borderColor={THEME.successColor}
              fontSize="xl"
              delay={90}
              style={{ maxWidth: 700 }}
            />
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/habit_formation.mp3")} />
      </Sequence>

      {/* Scene 16: Neuroscience Tools - Compact List */}
      <Sequence from={SCENES.NEUROSCIENCE_TOOLS.start} durationInFrames={SCENES.NEUROSCIENCE_TOOLS.duration}>
        <CinematicBackground variant="prefrontal" />
        <CinematicEffects>
          <AbsoluteFill style={{
            display: "flex",
            flexDirection: "column",
            padding: SPACING.lg,
          }}>
            {/* Header */}
            <div style={{ marginBottom: SPACING.md }}>
              <div style={{
                fontSize: FONT_SIZES.lg,
                color: THEME.prefrontalColor,
                fontFamily: FONT_FAMILY.body,
                fontWeight: 700,
                marginBottom: 4,
              }}>
                전략 5
              </div>
              <h2 style={{
                fontSize: FONT_SIZES["2xl"],
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                margin: 0,
              }}>
                🧠 신경과학 기반 5가지 도구
              </h2>
            </div>

            {/* Compact Tools List */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 12,
              maxWidth: 1400,
            }}>
              {[
                { num: 1, text: "2분 규칙", subtext: "2분 안에 할 수 있으면 즉시 실행" },
                { num: 2, text: "환경 설계", subtext: "주의 산만 요소 물리적 제거" },
                { num: 3, text: "시각화", subtext: "완료된 과제의 긍정적 결과 상상" },
                { num: 4, text: "보상 시스템", subtext: "작은 마일스톤마다 즉각적 보상" },
                { num: 5, text: "마인드풀니스", subtext: "감정 인식으로 변연계 반응 조절" },
              ].map((item, index) => {
                const itemProgress = spring({
                  frame: frame - SCENES.NEUROSCIENCE_TOOLS.start - 40 - index * 8,
                  fps,
                  config: SPRING_CONFIGS.normal,
                });
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING.md,
                      padding: `${SPACING.sm}px ${SPACING.md}px`,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: RADIUS.md,
                      borderLeft: `4px solid ${THEME.prefrontalColor}`,
                      opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(itemProgress, [0, 1], [-30, 0])}px)`,
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: THEME.prefrontalColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: FONT_SIZES.lg,
                      fontWeight: 700,
                      color: COLORS.white,
                      fontFamily: FONT_FAMILY.title,
                      flexShrink: 0,
                    }}>
                      {item.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: FONT_SIZES.xl,
                        fontWeight: 600,
                        color: COLORS.white,
                        fontFamily: FONT_FAMILY.body,
                      }}>
                        {item.text}
                      </div>
                      <div style={{
                        fontSize: FONT_SIZES.md,
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: FONT_FAMILY.body,
                      }}>
                        {item.subtext}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/neuroscience_tools.mp3")} />
      </Sequence>

      {/* Scene 17: Conclusion - Empowerment */}
      <Sequence from={SCENES.CONCLUSION.start} durationInFrames={SCENES.CONCLUSION.duration}>
        <CinematicBackground variant="success" />
        <CinematicEffects lightLeakColor="rgba(34, 197, 94, 0.3)" vignetteIntensity={0.3}>
          <ContentTemplate
            title="당신은 이길 수 있습니다"
            titleIcon="🏆"
            content={[
              "프로크래스티네이션은 당신의 잘못이 아닙니다.",
              "그것은 뇌의 진화적 유산입니다."
            ]}
            items={[
              { icon: "🧠", text: "변연계와 전전두엽 피질의 전쟁", color: THEME.prefrontalColor },
              { icon: "🧮", text: "동기 공식의 비밀", color: THEME.prefrontalColor },
              { icon: "🔬", text: "과학적으로 검증된 전략들", color: THEME.successColor },
            ]}
            highlightContent="5초 안에 시작하세요. 지금 바로."
            highlightIcon="⚡"
            durationInFrames={SCENES.CONCLUSION.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/conclusion.mp3")} />
      </Sequence>

      {/* Scene 18: Outro */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <AbsoluteFill>
          <AnimatedGradient
            colors={[THEME.primaryColor, "#4a90d9", "#22c55e"]}
            animationMode="pulse"
            cycleDuration={60}
          />
        </AbsoluteFill>
        <CinematicEffects>
          <OutroTemplate
            title="프로크래스티네이션의 심리학"
            titleIcon="🧠"
            takeaways={[
              { icon: "🔥", text: "뇌의 전쟁을 이해하고" },
              { icon: "🔬", text: "과학으로 승리하세요" },
            ]}
            closingMessage="당신의 뇌 안에서 벌어지는 전쟁, 이제 승리하세요"
            closingIcon="🏆"
            background={THEME.secondaryColor}
            closingBackgroundColor={THEME.prefrontalColor}
            closingTextColor={COLORS.white}
            durationInFrames={SCENES.OUTRO.duration}
            useTransition={false}
          />
        </CinematicEffects>
        <Audio src={staticFile("videos/ProcrastinationPsychology/audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_DURATION };
export default ProcrastinationPsychology;
