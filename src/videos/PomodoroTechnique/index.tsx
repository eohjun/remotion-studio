import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
} from "remotion";
import { z } from "zod";
import { SCENES, THEME, TOTAL_DURATION, AUDIO_BASE, toFrames } from "./constants";
import { FONT_FAMILY, FONT_SIZES, SPACING } from "../../shared/components/constants";
import { Vignette, LightLeak, FilmGrain } from "../../shared/components/effects";

// Schema
export const PomodoroTechniqueSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = "rgba(231, 76, 60, 0.15)" }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7) % 100;
    const baseY = (seed * 11) % 100;
    const size = 30 + (seed % 60);
    const speed = 0.2 + (seed % 10) / 30;
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
          filter: "blur(3px)",
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
        background: "rgba(255, 255, 255, 0.1)",
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

// Tomato timer visual
const TomatoTimer: React.FC<{ size?: number; animated?: boolean }> = ({
  size = 300,
  animated = true
}) => {
  const frame = useCurrentFrame();

  const pulse = animated
    ? interpolate(Math.sin(frame * 0.1), [-1, 1], [0.95, 1.05])
    : 1;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${THEME.primary}, #c0392b)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pulse})`,
        boxShadow: `0 20px 60px ${THEME.primary}66`,
        position: "relative",
      }}
    >
      {/* Timer face */}
      <div
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: size * 0.3,
            fontWeight: 900,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
          }}
        >
          25
        </div>
      </div>
      {/* Stem */}
      <div
        style={{
          position: "absolute",
          top: -size * 0.08,
          width: size * 0.08,
          height: size * 0.15,
          background: THEME.secondary,
          borderRadius: size * 0.04,
        }}
      />
    </div>
  );
};

// ============================================
// SCENE: INTRO (Title Card)
// ============================================

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const subtitleOpacity = spring({ frame: frame - 30, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #4a1a1a)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles color="rgba(231, 76, 60, 0.2)" count={30} />

      <div
        style={{
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <TomatoTimer size={200} />

        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            textShadow: `0 0 60px ${THEME.primary}, 0 4px 20px rgba(0,0,0,0.5)`,
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          뽀모도로 테크닉
        </div>

        <div
          style={{
            fontSize: 48,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.body,
            opacity: subtitleOpacity,
          }}
        >
          25분의 마법
        </div>
      </div>

      <Vignette intensity={0.4} />
      <LightLeak type="gradient" position="top-right" intensity={0.2} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOOK (Attention Crisis)
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.hook.duration);

  // Panel timings
  const panels = [
    { text: "당신은 지금 이 영상을\n끝까지 볼 수 있을까요?", start: 0, end: 180 },
    { text: "2003년: 평균 집중 시간 2분 30초", start: 200, end: 450, stat: "2:30" },
    { text: "최근: 단 40초로 급락", start: 480, end: 700, stat: "0:40", warning: true },
    { text: "스마트폰 알림, 이메일, SNS...\n끊임없는 방해 속에서", start: 730, end: 1100 },
    { text: "어떻게 집중할 수 있을까요?", start: 1130, end: duration },
  ];

  const activePanel = panels.find((p) => frame >= p.start && frame < p.end);
  if (!activePanel) return null;

  const localFrame = frame - activePanel.start;
  const panelDuration = activePanel.end - activePanel.start;
  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 20;
  const fadeOut = localFrame > fadeOutStart
    ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const opacity = fadeIn * fadeOut;

  const isStatPanel = "stat" in activePanel;
  const isQuestion = activePanel.text.includes("?");

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #2d1b4e)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles color="rgba(231, 76, 60, 0.1)" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
        }}
      >
        {isStatPanel && activePanel.stat && (
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: activePanel.warning ? THEME.danger : THEME.accent,
              fontFamily: FONT_FAMILY.title,
              marginBottom: 30,
              textShadow: `0 0 60px ${activePanel.warning ? THEME.danger : THEME.accent}`,
            }}
          >
            {activePanel.stat}
          </div>
        )}

        <div
          style={{
            fontSize: isQuestion ? 80 : FONT_SIZES["2xl"],
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 1400,
            padding: SPACING["2xl"],
            textShadow: "0 6px 30px rgba(0,0,0,0.5)",
            whiteSpace: "pre-line",
          }}
        >
          {activePanel.text}
        </div>
      </div>

      <Vignette intensity={0.5} />
      <FilmGrain intensity={0.03} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: ORIGIN (Tomato Timer Birth)
// ============================================

const OriginScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.origin.duration);

  const panels = [
    { text: "1980년대 후반, 이탈리아", emoji: "🇮🇹", start: 0, end: 200 },
    { text: "대학생 프란체스코 시릴로\n집중력 문제로 고민 중", emoji: "👨‍🎓", start: 220, end: 550 },
    { text: "\"단 10분만이라도 집중해보자\"", quote: true, start: 580, end: 900 },
    { text: "토마토 모양의 주방 타이머", emoji: "🍅", start: 930, end: 1300 },
    { text: "Pomodoro\n이탈리아어로 '토마토'", highlight: true, start: 1330, end: 1700 },
    { text: "세계적인 시간 관리 기법의 시작", emoji: "🌍", start: 1730, end: duration },
  ];

  const activePanel = panels.find((p) => frame >= p.start && frame < p.end);
  if (!activePanel) return null;

  const localFrame = frame - activePanel.start;
  const panelDuration = activePanel.end - activePanel.start;
  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 20;
  const fadeOut = localFrame > fadeOutStart
    ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const opacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.backgroundAlt}, #1a2e1a)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles color="rgba(39, 174, 96, 0.1)" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
        }}
      >
        {"emoji" in activePanel && activePanel.emoji && (
          <div style={{ fontSize: 150, marginBottom: 40 }}>
            {activePanel.emoji}
          </div>
        )}

        {activePanel.highlight && (
          <TomatoTimer size={250} animated={true} />
        )}

        <div
          style={{
            fontSize: activePanel.quote ? 72 : FONT_SIZES["2xl"],
            fontWeight: 700,
            color: activePanel.quote ? THEME.accent : THEME.text,
            fontFamily: FONT_FAMILY.title,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 1400,
            padding: SPACING.xl,
            fontStyle: activePanel.quote ? "italic" : "normal",
            whiteSpace: "pre-line",
            marginTop: activePanel.highlight ? 40 : 0,
          }}
        >
          {activePanel.text}
        </div>
      </div>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: METHODOLOGY (25+5 Method)
// ============================================

const MethodologyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { number: 1, text: "타이머를 25분으로 설정", icon: "⏱️", color: THEME.primary },
    { number: 2, text: "하나의 작업에만 집중", icon: "🎯", color: THEME.accent },
    { number: 3, text: "타이머가 울리면 5분 휴식", icon: "☕", color: THEME.secondary },
    { number: 4, text: "4회 반복 후 15-30분 긴 휴식", icon: "🌟", color: THEME.success },
  ];

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #2d1b3d)`,
        padding: 80,
      }}
    >
      <FloatingParticles color="rgba(231, 76, 60, 0.1)" />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, color: THEME.text, fontFamily: FONT_FAMILY.title }}>
          25분 + 5분의 마법
        </div>
        <div style={{ fontSize: 36, color: THEME.textMuted, fontFamily: FONT_FAMILY.body, marginTop: 10 }}>
          뽀모도로 테크닉의 핵심
        </div>
      </div>

      {/* Steps Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 50,
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {steps.map((step, i) => {
          const delay = 40 + i * 25;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                background: `${step.color}20`,
                padding: "40px 50px",
                borderRadius: 30,
                borderLeft: `8px solid ${step.color}`,
                opacity: progress,
                transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 80 }}>{step.icon}</div>
              <div>
                <div style={{ fontSize: 32, color: step.color, fontWeight: 700, marginBottom: 8 }}>
                  STEP {step.number}
                </div>
                <div style={{ fontSize: 46, fontWeight: 600, color: THEME.text, fontFamily: FONT_FAMILY.body }}>
                  {step.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom emphasis */}
      <div
        style={{
          textAlign: "center",
          marginTop: 60,
          opacity: spring({ frame: frame - 150, fps }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: THEME.primary,
            padding: "20px 60px",
            borderRadius: 50,
            fontSize: 42,
            fontWeight: 700,
            color: THEME.text,
          }}
        >
          이것이 전부입니다 ✨
        </div>
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: SCIENCE (Brain Science)
// ============================================

const ScienceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.science.duration);

  const panels = [
    { text: "왜 하필 25분일까요?", question: true, start: 0, end: 200 },
    { text: "인간의 뇌는 20-45분\n최적의 집중 상태 유지", stat: "20-45분", start: 220, end: 600 },
    { text: "이후 인지적 피로가 급격히 증가", warning: true, start: 630, end: 900 },
    { text: "방해 후 재집중까지\n평균 23분 소요", stat: "23분", start: 930, end: 1300 },
    { text: "현대인은 평균 11분마다 방해받음", stat: "11분", warning: true, start: 1330, end: 1700 },
    { text: "우리는 항상\n'반쯤 집중한 상태'로 일합니다", start: 1730, end: duration },
  ];

  const activePanel = panels.find((p) => frame >= p.start && frame < p.end);
  if (!activePanel) return null;

  const localFrame = frame - activePanel.start;
  const panelDuration = activePanel.end - activePanel.start;
  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 20;
  const fadeOut = localFrame > fadeOutStart
    ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const opacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #1b3d4e)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles color="rgba(0, 194, 255, 0.1)" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
        }}
      >
        {!activePanel.question && (
          <div style={{ fontSize: 120, marginBottom: 30 }}>🧠</div>
        )}

        {"stat" in activePanel && activePanel.stat && (
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: activePanel.warning ? THEME.warning : THEME.accent,
              fontFamily: FONT_FAMILY.title,
              marginBottom: 30,
              textShadow: `0 0 60px ${activePanel.warning ? THEME.warning : THEME.accent}`,
            }}
          >
            {activePanel.stat}
          </div>
        )}

        <div
          style={{
            fontSize: activePanel.question ? 80 : FONT_SIZES["2xl"],
            fontWeight: 700,
            color: activePanel.warning ? THEME.warning : THEME.text,
            fontFamily: FONT_FAMILY.title,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 1400,
            padding: SPACING.xl,
            whiteSpace: "pre-line",
          }}
        >
          {activePanel.text}
        </div>
      </div>

      <Vignette intensity={0.5} />
      <FilmGrain intensity={0.02} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: BENEFITS (Statistics)
// ============================================

const BenefitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const stats = [
    { label: "집중력/효율성 향상", value: 92, icon: "📈", color: THEME.success },
    { label: "스트레스 감소", value: 86, icon: "😌", color: THEME.secondary },
    { label: "번아웃 가능성 감소", value: 40, icon: "🛡️", color: THEME.accent },
    { label: "직원 만족도 상승", value: 40, icon: "😊", color: THEME.primary },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.backgroundAlt}, #1a3d2e)`,
        padding: 80,
      }}
    >
      <FloatingParticles color="rgba(46, 204, 113, 0.1)" />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, color: THEME.text, fontFamily: FONT_FAMILY.title }}>
          놀라운 효과 📊
        </div>
        <div style={{ fontSize: 36, color: THEME.textMuted, fontFamily: FONT_FAMILY.body, marginTop: 10 }}>
          실제 연구 결과
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 35,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {stats.map((stat, i) => {
          const delay = 40 + i * 20;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const barWidth = interpolate(progress, [0, 1], [0, stat.value]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                opacity: progress,
              }}
            >
              <div style={{ fontSize: 60, width: 80 }}>{stat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 38, color: THEME.text, fontWeight: 600, marginBottom: 12 }}>
                  {stat.label}
                </div>
                <div style={{ height: 50, background: "rgba(255,255,255,0.1)", borderRadius: 25, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`,
                      borderRadius: 25,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: 20,
                    }}
                  >
                    <span style={{ fontSize: 32, fontWeight: 700, color: THEME.text }}>
                      {stat.value}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Source */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          opacity: spring({ frame: frame - 140, fps }),
          fontSize: 28,
          color: THEME.textMuted,
        }}
      >
        출처: Toggl Survey, Harvard Business Review
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: MISTAKES (Common Errors)
// ============================================

const MistakesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const mistakes = [
    {
      number: 1,
      wrong: "휴식 시간에 SNS 확인",
      right: "진짜 휴식하기",
      icon: "📱",
    },
    {
      number: 2,
      wrong: "휴식 건너뛰기",
      right: "반드시 휴식 취하기",
      icon: "⏭️",
    },
    {
      number: 3,
      wrong: "25분 무조건 고수",
      right: "몰입 상태면 유연하게",
      icon: "🔒",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #3d1b1b)`,
        padding: 80,
      }}
    >
      <FloatingParticles color="rgba(231, 76, 60, 0.1)" />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, color: THEME.text, fontFamily: FONT_FAMILY.title }}>
          흔한 실수 ⚠️
        </div>
        <div style={{ fontSize: 36, color: THEME.textMuted, fontFamily: FONT_FAMILY.body, marginTop: 10 }}>
          역효과를 피하려면
        </div>
      </div>

      {/* Mistakes Grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        {mistakes.map((mistake, i) => {
          const delay = 50 + i * 30;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });

          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 80px 1fr",
                alignItems: "center",
                gap: 30,
                opacity: progress,
                transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 70 }}>{mistake.icon}</div>

              {/* Wrong */}
              <div
                style={{
                  background: `${THEME.danger}30`,
                  padding: "30px 40px",
                  borderRadius: 20,
                  borderLeft: `6px solid ${THEME.danger}`,
                }}
              >
                <div style={{ fontSize: 24, color: THEME.danger, marginBottom: 8 }}>❌ 잘못된 방법</div>
                <div style={{ fontSize: 38, color: THEME.text, fontWeight: 600 }}>{mistake.wrong}</div>
              </div>

              <div style={{ fontSize: 50, textAlign: "center" }}>→</div>

              {/* Right */}
              <div
                style={{
                  background: `${THEME.success}30`,
                  padding: "30px 40px",
                  borderRadius: 20,
                  borderLeft: `6px solid ${THEME.success}`,
                }}
              >
                <div style={{ fontSize: 24, color: THEME.success, marginBottom: 8 }}>✅ 올바른 방법</div>
                <div style={{ fontSize: 38, color: THEME.text, fontWeight: 600 }}>{mistake.right}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: VARIATIONS (Different Rhythms)
// ============================================

const VariationsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const variations = [
    { name: "클래식 뽀모도로", work: 25, rest: 5, color: THEME.primary },
    { name: "DeskTime 연구", work: 52, rest: 17, color: THEME.accent },
    { name: "최신 연구", work: 75, rest: 33, color: THEME.secondary },
  ];

  const maxWork = Math.max(...variations.map(v => v.work));

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.backgroundAlt}, #1b2d4e)`,
        padding: 80,
      }}
    >
      <FloatingParticles color="rgba(243, 156, 18, 0.1)" />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 80,
          opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, color: THEME.text, fontFamily: FONT_FAMILY.title }}>
          나만의 리듬 찾기 🎵
        </div>
        <div style={{ fontSize: 36, color: THEME.textMuted, fontFamily: FONT_FAMILY.body, marginTop: 10 }}>
          25분은 시작점일 뿐입니다
        </div>
      </div>

      {/* Variations */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 50,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {variations.map((v, i) => {
          const delay = 50 + i * 25;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const workWidth = (v.work / maxWork) * 100;

          return (
            <div
              key={i}
              style={{
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 42, color: v.color, fontWeight: 700, marginBottom: 20 }}>
                {v.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Work bar */}
                <div
                  style={{
                    width: `${workWidth * progress}%`,
                    height: 70,
                    background: `linear-gradient(90deg, ${v.color}, ${v.color}88)`,
                    borderRadius: 15,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 30,
                    transition: "width 0.3s",
                  }}
                >
                  <span style={{ fontSize: 32, fontWeight: 700, color: THEME.text }}>
                    작업 {v.work}분
                  </span>
                </div>
                {/* Rest indicator */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "15px 30px",
                    borderRadius: 15,
                    fontSize: 28,
                    color: THEME.text,
                  }}
                >
                  휴식 {v.rest}분
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key message */}
      <div
        style={{
          textAlign: "center",
          marginTop: 70,
          opacity: spring({ frame: frame - 150, fps }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.1)",
            padding: "25px 50px",
            borderRadius: 20,
            fontSize: 38,
            color: THEME.text,
            fontWeight: 600,
          }}
        >
          💡 중요한 것은 자신만의 리듬을 찾는 것
        </div>
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: IMPLEMENTATION (Start Today)
// ============================================

const ImplementationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });

  const steps = [
    "오늘 해야 할 일 중 하나를 선택하세요",
    "자신과 약속하세요: 25분을 투자하고, 스스로를 방해하지 않겠다",
    "타이머를 시작하고, 오직 그 작업에만 집중하세요",
    "다른 생각이 나면 종이에 적어두고 나중에 처리하세요",
  ];

  // 4개 아이템 + footer: 적절한 균형 (화면 채우면서 오버플로우 방지)
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #1b4a3d)`,
        padding: "60px 80px",
      }}
    >
      <FloatingParticles color="rgba(46, 204, 113, 0.15)" />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 800, color: THEME.text, fontFamily: FONT_FAMILY.title }}>
          오늘부터 시작하기 🚀
        </div>
        <div style={{ fontSize: 34, color: THEME.textMuted, fontFamily: FONT_FAMILY.body, marginTop: 10 }}>
          지금 바로 시작할 수 있습니다
        </div>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {steps.map((step, i) => {
          const delay = 40 + i * 25;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                background: "rgba(255,255,255,0.08)",
                padding: "28px 40px",
                borderRadius: 22,
                opacity: progress,
                transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${THEME.success}, ${THEME.secondary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: THEME.text,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 40, color: THEME.text, fontFamily: FONT_FAMILY.body }}>
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          opacity: spring({ frame: frame - 160, fps }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: THEME.success,
            padding: "18px 48px",
            borderRadius: 50,
            fontSize: 38,
            fontWeight: 700,
            color: THEME.text,
          }}
        >
          할 수 있다. 결국 25분일 뿐이니까 💪
        </div>
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: TAKEAWAY (Conclusion Quote)
// ============================================

const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteProgress = spring({ frame, fps, config: { damping: 15 } });
  const attributionProgress = spring({ frame: frame - 50, fps, config: { damping: 15 } });
  const ctaProgress = spring({ frame: frame - 100, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #4a1a1a)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <FloatingParticles color="rgba(231, 76, 60, 0.15)" count={25} />

      <div style={{ textAlign: "center", maxWidth: 1400 }}>
        {/* Quote */}
        <div
          style={{
            opacity: quoteProgress,
            transform: `scale(${interpolate(quoteProgress, [0, 1], [0.9, 1])})`,
          }}
        >
          <div style={{ fontSize: 100, marginBottom: 30 }}>💬</div>
          <blockquote
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.6,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            "시간을 다루는 법을 배우면,
            <br />
            시간은 사악한 포식자에서
            <br />
            생산성을 높이는 동맹이 된다"
          </blockquote>
        </div>

        {/* Attribution */}
        <div
          style={{
            marginTop: 50,
            opacity: attributionProgress,
            fontSize: 36,
            color: THEME.textMuted,
          }}
        >
          — 프란체스코 시릴로
        </div>

        {/* Final CTA */}
        <div
          style={{
            marginTop: 80,
            opacity: ctaProgress,
            transform: `translateY(${interpolate(ctaProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <TomatoTimer size={150} animated={true} />
          <div
            style={{
              marginTop: 30,
              fontSize: 48,
              fontWeight: 700,
              color: THEME.primary,
              textShadow: `0 0 30px ${THEME.primary}`,
            }}
          >
            오늘, 단 하나의 뽀모도로부터 시작하세요
          </div>
          <div
            style={{
              marginTop: 15,
              fontSize: 36,
              color: THEME.textMuted,
            }}
          >
            25분. 그것이 당신의 시간을 되찾는 첫걸음입니다.
          </div>
        </div>
      </div>

      <Vignette intensity={0.5} />
      <LightLeak type="gradient" position="bottom-left" intensity={0.15} />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const PomodoroTechnique: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* Intro Scene */}
      <Sequence from={toFrames(SCENES.intro.start)} durationInFrames={toFrames(SCENES.intro.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/intro.mp3`)} />
        <IntroScene />
      </Sequence>

      {/* Hook Scene */}
      <Sequence from={toFrames(SCENES.hook.start)} durationInFrames={toFrames(SCENES.hook.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
        <HookScene />
      </Sequence>

      {/* Origin Scene */}
      <Sequence from={toFrames(SCENES.origin.start)} durationInFrames={toFrames(SCENES.origin.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/origin.mp3`)} />
        <OriginScene />
      </Sequence>

      {/* Methodology Scene */}
      <Sequence from={toFrames(SCENES.methodology.start)} durationInFrames={toFrames(SCENES.methodology.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/methodology.mp3`)} />
        <MethodologyScene />
      </Sequence>

      {/* Science Scene */}
      <Sequence from={toFrames(SCENES.science.start)} durationInFrames={toFrames(SCENES.science.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/science.mp3`)} />
        <ScienceScene />
      </Sequence>

      {/* Benefits Scene */}
      <Sequence from={toFrames(SCENES.benefits.start)} durationInFrames={toFrames(SCENES.benefits.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/benefits.mp3`)} />
        <BenefitsScene />
      </Sequence>

      {/* Mistakes Scene */}
      <Sequence from={toFrames(SCENES.mistakes.start)} durationInFrames={toFrames(SCENES.mistakes.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/mistakes.mp3`)} />
        <MistakesScene />
      </Sequence>

      {/* Variations Scene */}
      <Sequence from={toFrames(SCENES.variations.start)} durationInFrames={toFrames(SCENES.variations.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/variations.mp3`)} />
        <VariationsScene />
      </Sequence>

      {/* Implementation Scene */}
      <Sequence from={toFrames(SCENES.implementation.start)} durationInFrames={toFrames(SCENES.implementation.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/implementation.mp3`)} />
        <ImplementationScene />
      </Sequence>

      {/* Takeaway Scene */}
      <Sequence from={toFrames(SCENES.takeaway.start)} durationInFrames={toFrames(SCENES.takeaway.duration)}>
        <Audio src={staticFile(`${AUDIO_BASE}/takeaway.mp3`)} />
        <TakeawayScene />
      </Sequence>

      <ProgressBar />
    </AbsoluteFill>
  );
};

export default PomodoroTechnique;
