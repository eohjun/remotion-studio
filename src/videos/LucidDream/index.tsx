import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  Img,
} from "remotion";
import { z } from "zod";
import {
  SCENES,
  THEME,
  FPS,
  TOTAL_DURATION,
  AUDIO_BASE,
  AI_ASSETS_BASE,
  toFrames,
} from "./constants";
import { AnimatedText } from "../../shared/templates/animations/AnimatedText";
import { fadeInUp } from "../../shared/templates/animations/presets";
import { FONT_FAMILY } from "../../shared/components/constants";
import { AnimatedGradient } from "../../shared/components/backgrounds";
import { Vignette, FilmGrain } from "../../shared/components/effects";
import { OfficialLightLeak } from "../../shared/components/effects/OfficialLightLeak";

// Schema
export const LucidDreamSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 25, color = "rgba(123, 104, 238, 0.12)" }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7) % 100;
    const baseY = (seed * 11) % 100;
    const size = 20 + (seed % 50);
    const speed = 0.15 + (seed % 10) / 40;
    const y = (baseY + frame * speed) % 130 - 15;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          filter: "blur(4px)",
        }}
      />
    );
  });

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = (frame / TOTAL_DURATION) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})`,
        }}
      />
    </div>
  );
};

/** AI-generated background with dark overlay for text readability */
const DreamBackground: React.FC<{
  sceneId: string;
  overlayOpacity?: number;
}> = ({ sceneId, overlayOpacity = 0.6 }) => {
  const src = staticFile(`${AI_ASSETS_BASE}/${sceneId}-bg.jpg`);

  return (
    <AbsoluteFill>
      {/* Gradient fallback (always renders behind) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${THEME.background}, ${THEME.secondary}40, ${THEME.background})`,
        }}
      />
      {/* AI image (renders on top of fallback if available) */}
      <AbsoluteFill>
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={undefined}
        />
      </AbsoluteFill>
      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,10,26,${overlayOpacity}) 0%, rgba(10,10,26,${overlayOpacity + 0.15}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOOK (꿈 속에서 깨어나다)
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.hook.duration);

  const panels = [
    { text: "매일 밤, 당신은\n또 다른 세계로 들어갑니다", start: 0, end: 118 },
    { text: "하늘을 날고, 낯선 도시를 걸으며\n불가능한 일들을 경험하죠", start: 118, end: 262 },
    { text: "하지만 대부분은\n그것이 꿈이라는 걸 모릅니다", start: 262, end: 378 },
    { text: "만약 꿈 속에서\n이것이 꿈이라는 걸\n깨달을 수 있다면?", start: 378, end: 496 },
    { text: "이것이 바로\n루시드 드림, 자각몽입니다", start: 496, end: duration },
  ];

  const activePanel = panels.find((p) => frame >= p.start && frame < p.end);
  if (!activePanel) return null;

  const localFrame = frame - activePanel.start;
  const panelDuration = activePanel.end - activePanel.start;

  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 15;
  const fadeOut =
    localFrame > fadeOutStart
      ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = fadeIn * fadeOut;
  const isLast = activePanel === panels[panels.length - 1];

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="hook" />
      <FloatingParticles color="rgba(123, 104, 238, 0.1)" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: isLast ? 84 : 68,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 1400,
            padding: 80,
            opacity,
            transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
            textShadow: `0 4px 30px rgba(0,0,0,0.6), 0 0 80px ${THEME.primary}40`,
            whiteSpace: "pre-line",
          }}
        >
          {activePanel.text}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.5} />
      <FilmGrain intensity={0.03} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: WHAT IS (자각몽이란)
// ============================================

const WhatIsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Definition (0-7s)
  // Phase 2: 55% Stat (8-17s)
  // Phase 3: REM Sleep (18-end)
  const defOpacity = spring({ frame, fps, config: { damping: 20 } });
  const defFadeOut = frame > toFrames(5.5)
    ? interpolate(frame, [toFrames(5.5), toFrames(7)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const statProgress = spring({
    frame: frame - toFrames(8),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const remProgress = spring({
    frame: frame - toFrames(19),
    fps,
    config: { damping: 15 },
  });

  const showDef = frame < toFrames(8);
  const showStat = frame >= toFrames(7.5) && frame < toFrames(19);
  const showRem = frame >= toFrames(18);

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="what_is" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {/* Definition text (0-7s) */}
        {showDef && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1400,
              opacity: defOpacity * defFadeOut,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                lineHeight: 1.6,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              자각몽이란, 꿈을 꾸는 동안
              <br />
              자신이 꿈속에 있다는 것을
              <br />
              <span style={{ color: THEME.accent }}>인식하는 상태</span>입니다
            </div>
          </div>
        )}

        {/* 55% Statistic */}
        {showStat && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${statProgress})`,
              textAlign: "center",
              opacity: frame > toFrames(17)
                ? interpolate(frame, [toFrames(17), toFrames(19)], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : statProgress,
            }}
          >
            <div
              style={{
                fontSize: 180,
                fontWeight: 800,
                color: THEME.accent,
                fontFamily: FONT_FAMILY.title,
                textShadow: `0 0 80px ${THEME.accent}60`,
              }}
            >
              55%
            </div>
            <div
              style={{
                fontSize: 42,
                color: THEME.textMuted,
                fontFamily: FONT_FAMILY.body,
                marginTop: 20,
              }}
            >
              전체 인구가 일생에 한 번 이상 경험
            </div>
          </div>
        )}

        {/* REM Sleep Info */}
        {showRem && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              textAlign: "center",
              opacity: remProgress,
              maxWidth: 1200,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: THEME.tertiary,
                fontFamily: FONT_FAMILY.title,
                marginBottom: 30,
                textShadow: `0 0 40px ${THEME.tertiary}50`,
              }}
            >
              렘수면 (REM Sleep)
            </div>
            <div
              style={{
                fontSize: 42,
                color: THEME.text,
                fontFamily: FONT_FAMILY.body,
                lineHeight: 1.6,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              뇌가 깨어있을 때와 거의 비슷한 수준으로
              <br />
              활성화되는 특별한 수면 단계
            </div>
          </div>
        )}
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: SCIENCE (뇌과학)
// ============================================

const ScienceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline events
  const events = [
    { year: "1975", label: "키스 허른", desc: "안구 운동으로 자각몽 최초 입증" },
    { year: "스탠포드", label: "스티븐 라버지", desc: "연구 확장 및 MILD 개발" },
  ];

  // Prefrontal cortex explanation reveal
  const cortexReveal = spring({
    frame: frame - toFrames(12),
    fps,
    config: { damping: 15 },
  });

  // "Consciousness switch" moment
  const switchReveal = spring({
    frame: frame - toFrames(30),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="science" />

      <AbsoluteFill style={{ padding: 80 }}>
        {/* Title */}
        <AnimatedText
          text="자각몽의 뇌과학"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 60,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Timeline */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginBottom: 60,
          }}
        >
          {events.map((event, i) => {
            const delay = 15 + i * 20;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
                }}
              >
                <div
                  style={{
                    background: `${THEME.primary}40`,
                    padding: "20px 40px",
                    borderRadius: 50,
                    fontSize: 42,
                    fontWeight: 800,
                    color: THEME.accent,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 16,
                    border: `2px solid ${THEME.accent}60`,
                    display: "inline-block",
                  }}
                >
                  {event.year}
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.title,
                  }}
                >
                  {event.label}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    marginTop: 8,
                  }}
                >
                  {event.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prefrontal cortex */}
        <div
          style={{
            opacity: cortexReveal,
            transform: `translateY(${interpolate(cortexReveal, [0, 1], [30, 0])}px)`,
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 24,
            padding: "40px 50px",
            borderLeft: `4px solid ${THEME.accent}`,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              marginBottom: 16,
            }}
          >
            전전두엽 피질 활성화
          </div>
          <div
            style={{
              fontSize: 36,
              color: THEME.text,
              fontFamily: FONT_FAMILY.body,
              lineHeight: 1.5,
            }}
          >
            자기 인식과 비판적 사고를 담당하는 영역이 급격히 활성화
          </div>
        </div>

        {/* "Consciousness switch" */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 80,
            right: 80,
            textAlign: "center",
            opacity: switchReveal,
            transform: `scale(${switchReveal})`,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              textShadow: `0 0 60px ${THEME.accent}50`,
            }}
          >
            잠든 뇌에서 의식의 스위치가 켜지는 순간
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: TECHNIQUES (유도 기법)
// ============================================

const TechniquesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.techniques.duration);

  const techniques = [
    {
      icon: "✋",
      name: "현실 점검법",
      nameEn: "Reality Check",
      desc: "낮 동안 주기적으로 꿈인지 확인\n손가락 세기, 시계 확인",
      color: THEME.primary,
      startFrame: 0,
    },
    {
      icon: "🌙",
      name: "MILD 기법",
      nameEn: "Mnemonic Induction",
      desc: "잠들기 직전 꿈을 인식하겠다고\n반복해서 의도",
      color: THEME.accent,
      startFrame: toFrames(16),
    },
    {
      icon: "👁️",
      name: "WILD 기법",
      nameEn: "Wake Initiated",
      desc: "깨어있는 의식을 유지하며\n꿈 상태로 직접 진입",
      color: THEME.tertiary,
      startFrame: toFrames(32),
    },
  ];

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="techniques" overlayOpacity={0.65} />

      <AbsoluteFill style={{ padding: 80 }}>
        {/* Title */}
        <AnimatedText
          text="자각몽 유도 기법"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 60,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* 3 Technique Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 50,
            flex: 1,
            alignItems: "center",
          }}
        >
          {techniques.map((tech, i) => {
            const progress = spring({
              frame: frame - tech.startFrame,
              fps,
              config: { damping: 15 },
            });

            const isActive =
              frame >= tech.startFrame &&
              (i === techniques.length - 1 || frame < techniques[i + 1].startFrame);

            return (
              <div
                key={i}
                style={{
                  width: 500,
                  background: isActive
                    ? `${tech.color}15`
                    : "rgba(255, 255, 255, 0.03)",
                  border: `2px solid ${isActive ? tech.color : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 24,
                  padding: 45,
                  textAlign: "center",
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px) scale(${isActive ? 1.03 : 1})`,
                  transition: "border-color 0.3s, background 0.3s",
                }}
              >
                <div style={{ fontSize: 100, marginBottom: 20 }}>
                  {tech.icon}
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: tech.color,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 8,
                  }}
                >
                  {tech.name}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    marginBottom: 20,
                    letterSpacing: 1,
                  }}
                >
                  {tech.nameEn}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.body,
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {tech.desc}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sequence from={toFrames(20)} durationInFrames={duration - toFrames(20)}>
        <OfficialLightLeak
          seed={5}
          hueShift={270}
          durationInFrames={duration - toFrames(20)}
          opacity={0.15}
        />
      </Sequence>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: BENEFITS (효과)
// ============================================

const BenefitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const benefits = [
    {
      icon: "😴",
      title: "악몽 치료",
      desc: "자각몽 훈련으로 악몽의 빈도 크게 감소",
      color: THEME.primary,
    },
    {
      icon: "🎨",
      title: "창의성 폭발",
      desc: "달리, 셸리 등 예술가들의 꿈 영감",
      color: THEME.accent,
    },
    {
      icon: "💪",
      title: "심리적 회복력",
      desc: "꿈속 두려움 극복 → 현실 자신감",
      color: THEME.tertiary,
    },
  ];

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="benefits" />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="자각몽의 효과"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 70,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {benefits.map((item, i) => {
            const progress = spring({
              frame: frame - 20 - i * 20,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 36,
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: 20,
                  padding: "36px 50px",
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <span style={{ fontSize: 80, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 46,
                      fontWeight: 700,
                      color: item.color,
                      fontFamily: FONT_FAMILY.title,
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      color: THEME.text,
                      fontFamily: FONT_FAMILY.body,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.35} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: RISKS (주의사항)
// ============================================

const RisksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const warnings = [
    { icon: "⚠️", text: "수면 마비", desc: "몸은 깨어났지만 움직일 수 없는 상태" },
    { icon: "🔄", text: "거짓 각성", desc: "깼다고 생각했지만 또 다른 꿈" },
    { icon: "😴", text: "수면 질 저하", desc: "집착하면 충분한 휴식이 어려움" },
  ];

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="risks" overlayOpacity={0.7} />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="주의해야 할 점"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.danger,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 70,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {warnings.map((item, i) => {
            const progress = spring({
              frame: frame - 20 - i * 18,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 36,
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
                  background: "rgba(239, 68, 68, 0.06)",
                  borderRadius: 20,
                  padding: "36px 50px",
                  border: `2px solid rgba(239, 68, 68, 0.2)`,
                }}
              >
                <span style={{ fontSize: 80, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 46,
                      fontWeight: 700,
                      color: THEME.warning,
                      fontFamily: FONT_FAMILY.title,
                      marginBottom: 8,
                    }}
                  >
                    {item.text}
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      color: THEME.text,
                      fontFamily: FONT_FAMILY.body,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key message */}
        <AnimatedText
          text="충분한 휴식이 우선입니다"
          animation={fadeInUp()}
          delay={80}
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            textAlign: "center",
            marginTop: 50,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />
      </AbsoluteFill>

      <Vignette intensity={0.45} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: OUTRO (오늘 밤의 초대)
// ============================================

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.outro.duration);

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const ctaProgress = spring({
    frame: frame - toFrames(4),
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill>
      <DreamBackground sceneId="outro" overlayOpacity={0.5} />
      <FloatingParticles color="rgba(255, 215, 0, 0.08)" count={30} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 1300,
            transform: `scale(${titleScale})`,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.6,
              marginBottom: 50,
              textShadow: `0 4px 30px rgba(0,0,0,0.5), 0 0 80px ${THEME.accent}30`,
            }}
          >
            오늘 밤 잠들기 전,
            <br />
            한 번만 자신에게 물어보세요
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              opacity: ctaProgress,
              transform: `translateY(${interpolate(ctaProgress, [0, 1], [20, 0])}px)`,
              textShadow: `0 0 60px ${THEME.accent}60`,
            }}
          >
            &ldquo;지금 내가 꿈을 꾸고 있는 건 아닐까?&rdquo;
          </div>

          <div
            style={{
              fontSize: 38,
              color: THEME.textMuted,
              fontFamily: FONT_FAMILY.body,
              marginTop: 50,
              opacity: spring({
                frame: frame - toFrames(8),
                fps,
                config: { damping: 20 },
              }),
            }}
          >
            자각몽의 문은 항상 열려 있습니다
          </div>
        </div>
      </AbsoluteFill>

      <OfficialLightLeak
        seed={7}
        hueShift={45}
        durationInFrames={duration}
        opacity={0.2}
      />

      <Vignette intensity={0.35} color="rgba(0,0,0,0.4)" />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const LucidDream: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* Background gradient */}
      <AnimatedGradient
        colors={[THEME.background, THEME.backgroundAlt]}
        animationMode="pulse"
      />

      {/* Scenes */}
      <Sequence
        from={toFrames(SCENES.hook.start)}
        durationInFrames={toFrames(SCENES.hook.duration)}
      >
        <HookScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.whatIs.start)}
        durationInFrames={toFrames(SCENES.whatIs.duration)}
      >
        <WhatIsScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/what_is.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.science.start)}
        durationInFrames={toFrames(SCENES.science.duration)}
      >
        <ScienceScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/science.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.techniques.start)}
        durationInFrames={toFrames(SCENES.techniques.duration)}
      >
        <TechniquesScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/techniques.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.benefits.start)}
        durationInFrames={toFrames(SCENES.benefits.duration)}
      >
        <BenefitsScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/benefits.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.risks.start)}
        durationInFrames={toFrames(SCENES.risks.duration)}
      >
        <RisksScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/risks.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.outro.start)}
        durationInFrames={toFrames(SCENES.outro.duration)}
      >
        <OutroScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/outro.mp3`)} />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Export for registry
export const lucidDreamComposition = {
  id: "LucidDream",
  component: LucidDream,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: LucidDreamSchema,
  defaultProps: {},
};
