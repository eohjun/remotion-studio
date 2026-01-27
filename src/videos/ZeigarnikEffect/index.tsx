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
} from "remotion";
import { z } from "zod";
import { SCENES, THEME, FPS, TOTAL_DURATION, AUDIO_BASE, toFrames } from "./constants";
import { AnimatedText } from "../../shared/templates/animations/AnimatedText";
import { fadeInUp } from "../../shared/templates/animations/presets";
import { FONT_FAMILY, FONT_SIZES, SPACING } from "../../shared/components/constants";
import { AnimatedGradient, FloatingShapes } from "../../shared/components/backgrounds";
import { Vignette, LightLeak, FilmGrain } from "../../shared/components/effects";

// Schema
export const ZeigarnikEffectSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = "rgba(102, 126, 234, 0.15)" }) => {
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
        background: `linear-gradient(135deg, ${THEME.background}, ${THEME.secondary})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles color="rgba(102, 126, 234, 0.2)" count={30} />

      <div
        style={{
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            textShadow: `0 0 60px ${THEME.primary}, 0 4px 20px rgba(0,0,0,0.5)`,
            marginBottom: 30,
          }}
        >
          자이가르닉 효과
        </div>

        <div
          style={{
            fontSize: 36,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.body,
            opacity: subtitleOpacity,
          }}
        >
          왜 미완성된 일이 더 오래 기억될까요?
        </div>
      </div>

      <Vignette intensity={0.4} />
      <LightLeak type="gradient" position="top-right" intensity={0.2} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOOK (Vienna Waiter Story)
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.hook.duration);

  // Panel timings (synced with audio timestamps at 60fps)
  // Audio segment 1: 0-7.46s (0-448 frames) - cafe + waiter memory
  // Audio segment 2: 8.4-15.76s (504-946 frames) - but then forgot
  // Audio segment 3: 16.6-18.44s (996-1106 frames) - why?
  const panels = [
    { text: "1920년대 비엔나의 한 카페", start: 0, end: 150 },
    { text: "메모 없이 수십 명의 주문을\n완벽하게 기억하는 웨이터", start: 160, end: 490 },
    { text: "그런데 계산 후에는...\n모든 것을 잊어버렸다", start: 504, end: 960 },
    { text: "왜?", start: 996, end: duration },
  ];

  const activePanel = panels.find((p) => frame >= p.start && frame < p.end);

  if (!activePanel) return null;

  const localFrame = frame - activePanel.start;
  const panelDuration = activePanel.end - activePanel.start;

  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 20;
  const fadeOut =
    localFrame > fadeOutStart
      ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = fadeIn * fadeOut;
  const isLastPanel = activePanel.text === "왜?";

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, #2d1b4e)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles color="rgba(102, 126, 234, 0.1)" />

      <div
        style={{
          fontSize: isLastPanel ? 120 : FONT_SIZES["2xl"],
          fontWeight: 700,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 1400,
          padding: SPACING["2xl"],
          opacity,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
          textShadow: "0 6px 30px rgba(0,0,0,0.5)",
          whiteSpace: "pre-line",
        }}
      >
        {activePanel.text}
      </div>

      <Vignette intensity={0.5} />
      <FilmGrain intensity={0.03} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: DISCOVERY (Timeline)
// ============================================

const DiscoveryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const events = [
    { year: "1920s", label: "비엔나 카페", desc: "쿠르트 레빈의 관찰" },
    { year: "1927", label: "베를린 대학", desc: "자이가르닉 실험" },
    { year: "결과", label: "90% 향상", desc: "중단된 과제 기억력" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.backgroundAlt}, ${THEME.background})`,
        padding: 60,
        justifyContent: "center",
      }}
    >
      <FloatingShapes
        shapeTypes={["circle", "hexagon"]}
        shapeCount={15}
        colors={["rgba(102, 126, 234, 0.15)", "rgba(118, 75, 162, 0.1)"]}
      />

      <AnimatedText
        text="자이가르닉 효과의 발견"
        animation={fadeInUp()}
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
          marginBottom: 100,
          textAlign: "center",
        }}
      />

      {/* Timeline */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 80,
        }}
      >
        {events.map((event, i) => {
          const delay = 30 + i * 25;
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
                alignItems: "center",
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
              }}
            >
              {/* Year badge */}
              <div
                style={{
                  background: event.year === "1927" ? THEME.primary : "rgba(102, 126, 234, 0.3)",
                  padding: "28px 56px",
                  borderRadius: 60,
                  fontSize: 48,
                  fontWeight: 800,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.title,
                  marginBottom: 32,
                  border: event.year === "1927" ? "4px solid #00c2ff" : "none",
                  boxShadow: event.year === "1927" ? "0 0 40px rgba(0, 194, 255, 0.5)" : "none",
                }}
              >
                {event.year}
              </div>

              {/* Event card */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 24,
                  padding: "40px 50px",
                  width: 420,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 16,
                  }}
                >
                  {event.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {event.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: MECHANISM (Brain Visualization)
// ============================================

const MechanismScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brainPulse = Math.sin(frame * 0.08) * 0.08 + 1;
  const tensionProgress = spring({ frame: frame - 40, fps, config: { damping: 20 } });

  const bullets = [
    { icon: "🔗", text: "심리적 긴장 유지" },
    { icon: "🧠", text: "작업 기억 활성화" },
    { icon: "✅", text: "완료 시 긴장 해소" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        display: "flex",
        flexDirection: "row",
        padding: 80,
        gap: 60,
      }}
    >
      <AnimatedGradient
        colors={[THEME.background, THEME.backgroundAlt]}
        animationMode="pulse"
      />

      {/* Left: Brain visualization */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 300,
            transform: `scale(${brainPulse})`,
            filter: `drop-shadow(0 0 60px ${THEME.primary})`,
          }}
        >
          🧠
        </div>

        {/* Tension indicator */}
        <div
          style={{
            marginTop: 50,
            opacity: tensionProgress,
            transform: `translateY(${interpolate(tensionProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 350,
                height: 14,
                background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})`,
                borderRadius: 7,
                transform: `scaleX(${0.5 + Math.sin(frame * 0.1) * 0.3})`,
                transformOrigin: "left",
              }}
            />
            <span style={{ color: THEME.textMuted, fontFamily: FONT_FAMILY.body, fontSize: 36, fontWeight: 500 }}>
              심리적 긴장
            </span>
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AnimatedText
          text="뇌의 작동 방식"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 60,
          }}
        />

        {bullets.map((bullet, i) => {
          const progress = spring({
            frame: frame - 30 - i * 18,
            fps,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                marginBottom: 45,
                opacity: progress,
                transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 64 }}>{bullet.icon}</span>
              <span
                style={{
                  fontSize: 46,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.body,
                  fontWeight: 500,
                }}
              >
                {bullet.text}
              </span>
            </div>
          );
        })}
      </div>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: STUDY APPLICATION (Data Visualization)
// ============================================

const StudyApplicationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartProgress = spring({ frame: frame - 40, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        padding: 80,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FloatingShapes
        shapeTypes={["square", "hexagon"]}
        shapeCount={12}
        colors={["rgba(102, 126, 234, 0.1)"]}
      />

      <AnimatedText
        text="학습 재개율 비교"
        animation={fadeInUp()}
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
          marginBottom: 16,
        }}
      />
      <AnimatedText
        text="Ovsiankina, 1928"
        animation={fadeInUp()}
        delay={15}
        style={{
          fontSize: 32,
          color: THEME.textMuted,
          fontFamily: FONT_FAMILY.body,
          marginBottom: 50,
        }}
      />

      {/* Bar Chart */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 50,
          opacity: chartProgress,
        }}
      >
        {/* Interrupted Learning Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              width: 240,
              fontSize: 40,
              fontWeight: 500,
              color: THEME.text,
              fontFamily: FONT_FAMILY.body,
              textAlign: "right",
            }}
          >
            중단된 학습
          </div>
          <div
            style={{
              height: 90,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 12,
              flex: 1,
              maxWidth: 1000,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${80 * chartProgress}%`,
                background: `linear-gradient(90deg, ${THEME.success}, #22c55e)`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 30,
              }}
            >
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                80%
              </span>
            </div>
          </div>
        </div>

        {/* Completed Learning Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              width: 240,
              fontSize: 40,
              fontWeight: 500,
              color: THEME.text,
              fontFamily: FONT_FAMILY.body,
              textAlign: "right",
            }}
          >
            완료된 학습
          </div>
          <div
            style={{
              height: 90,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 12,
              flex: 1,
              maxWidth: 1000,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${12 * chartProgress}%`,
                background: `linear-gradient(90deg, ${THEME.danger}, #dc2626)`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 30,
              }}
            >
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                12%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key insight - 핵심 메시지는 크게! */}
      <AnimatedText
        text="중단된 학습은 6.6배 더 높은 재개율을 보였다"
        animation={fadeInUp()}
        delay={70}
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: THEME.accent,
          fontFamily: FONT_FAMILY.title,
          textAlign: "center",
          marginTop: 50,
          textShadow: `0 0 40px ${THEME.accent}40`,
        }}
      />

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: PRODUCTIVITY HACK
// ============================================

const ProductivityHackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 15 } });
  const bullets = [
    "한 문장만 시작해도 효과 발동",
    "뇌가 완료 충동을 느낌",
    "헤밍웨이: 항상 문장 중간에 멈춤",
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.backgroundAlt}, ${THEME.background}, #2d1b4e)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <FloatingParticles />

      <div style={{ textAlign: "center", maxWidth: 1400 }}>
        {/* Icon - 히어로 이모지는 크게! */}
        <div
          style={{
            fontSize: 280,
            transform: `scale(${iconScale})`,
            marginBottom: 50,
            filter: `drop-shadow(0 0 40px ${THEME.primary})`,
          }}
        >
          ✍️
        </div>

        {/* Title - 84px로 충분히 크게 */}
        <AnimatedText
          text="생산성의 비밀"
          animation={fadeInUp()}
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 24,
          }}
        />

        <AnimatedText
          text="시작하면 끝내고 싶어진다"
          animation={fadeInUp()}
          delay={15}
          style={{
            fontSize: 46,
            color: THEME.accent,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 60,
            textShadow: `0 0 30px ${THEME.accent}50`,
          }}
        />

        {/* Bullets - 텍스트 46px, 아이콘 64px */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 40,
          }}
        >
          {bullets.map((bullet, i) => {
            const progress = spring({
              frame: frame - 50 - i * 15,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`,
                }}
              >
                <span
                  style={{
                    color: THEME.primary,
                    fontSize: 48,
                    fontWeight: 700,
                  }}
                >
                  ▶
                </span>
                <span
                  style={{
                    fontSize: 46,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: 500,
                  }}
                >
                  {bullet}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Vignette intensity={0.35} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: DARK SIDE (Comparison)
// ============================================

const DarkSideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const rightProgress = spring({ frame: frame - 40, fps, config: { damping: 15 } });

  const leftItems = ["적절한 동기부여", "집중력 유지", "건강한 긴장감"];
  const rightItems = ["스트레스 급증", "수면 방해", "인지 과부하"];

  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        padding: 80,
      }}
    >
      <AnimatedText
        text="주의해야 할 점"
        animation={fadeInUp()}
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
          marginBottom: 60,
          textAlign: "center",
        }}
      />

      {/* Comparison cards - 카드 크기와 텍스트 크기 확대 */}
      <div
        style={{
          display: "flex",
          gap: 80,
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* Left card - Good */}
        <div
          style={{
            width: 580,
            background: "rgba(74, 222, 128, 0.1)",
            border: `3px solid ${THEME.success}`,
            borderRadius: 28,
            padding: 50,
            opacity: leftProgress,
            transform: `translateX(${interpolate(leftProgress, [0, 1], [-50, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 40,
            }}
          >
            <span style={{ fontSize: 64 }}>✅</span>
            <span
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: THEME.success,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              1-3개 미완료
            </span>
          </div>
          {leftItems.map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: 38,
                color: THEME.text,
                fontFamily: FONT_FAMILY.body,
                marginBottom: 24,
                paddingLeft: 24,
                fontWeight: 500,
              }}
            >
              • {item}
            </div>
          ))}
        </div>

        {/* VS */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.title,
          }}
        >
          VS
        </div>

        {/* Right card - Bad */}
        <div
          style={{
            width: 580,
            background: "rgba(239, 68, 68, 0.1)",
            border: `3px solid ${THEME.danger}`,
            borderRadius: 28,
            padding: 50,
            opacity: rightProgress,
            transform: `translateX(${interpolate(rightProgress, [0, 1], [50, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 40,
            }}
          >
            <span style={{ fontSize: 64 }}>⚠️</span>
            <span
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: THEME.danger,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              4개 이상 미완료
            </span>
          </div>
          {rightItems.map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: 38,
                color: THEME.text,
                fontFamily: FONT_FAMILY.body,
                marginBottom: 24,
                paddingLeft: 24,
                fontWeight: 500,
              }}
            >
              • {item}
            </div>
          ))}
        </div>
      </div>

      <Vignette intensity={0.45} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: SOLUTION
// ============================================

const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 15 } });
  const bullets = [
    "할 일 목록 작성",
    "뇌의 심리적 긴장 해소",
    "계획 수립 = 완료와 유사한 효과",
  ];

  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedGradient
        colors={[THEME.background, "#1e3a5f"]}
        animationMode="pulse"
      />

      <div style={{ textAlign: "center", maxWidth: 1400 }}>
        {/* Icon - 히어로 이모지는 크게! */}
        <div
          style={{
            fontSize: 280,
            transform: `scale(${iconScale})`,
            marginBottom: 50,
            filter: `drop-shadow(0 0 40px ${THEME.success})`,
          }}
        >
          📝
        </div>

        {/* Title - 84px로 충분히 크게 */}
        <AnimatedText
          text="해결책: 외부화"
          animation={fadeInUp()}
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 24,
          }}
        />

        <AnimatedText
          text="적어두면 마음이 편해진다"
          animation={fadeInUp()}
          delay={15}
          style={{
            fontSize: 46,
            color: THEME.accent,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 60,
            textShadow: `0 0 30px ${THEME.accent}50`,
          }}
        />

        {/* Bullets - 텍스트 46px, 아이콘 64px */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 40,
          }}
        >
          {bullets.map((bullet, i) => {
            const progress = spring({
              frame: frame - 50 - i * 15,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`,
                }}
              >
                <span
                  style={{
                    color: THEME.success,
                    fontSize: 56,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: 46,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: 500,
                  }}
                >
                  {bullet}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: TAKEAWAY
// ============================================

const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteScale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 1300,
          transform: `scale(${quoteScale})`,
        }}
      >
        {/* 핵심 메시지 - 크고 명확하게 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            lineHeight: 1.5,
            marginBottom: 60,
            textShadow: "0 6px 30px rgba(0,0,0,0.4)",
          }}
        >
          시작하면 끝내고 싶어지고,
          <br />
          적어두면 마음이 편해진다.
        </div>

        <AnimatedText
          text="자이가르닉 효과를 전략적으로 활용하세요"
          animation={fadeInUp()}
          delay={50}
          style={{
            fontSize: 38,
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: FONT_FAMILY.body,
            fontWeight: 500,
          }}
        />
      </div>

      <LightLeak type="gradient" position="top-right" intensity={0.3} />
      <Vignette intensity={0.35} color="rgba(0,0,0,0.4)" />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const ZeigarnikEffect: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* Background gradient */}
      <AnimatedGradient
        colors={[THEME.background, THEME.backgroundAlt]}
        animationMode="pulse"
      />

      {/* Scenes */}
      <Sequence from={toFrames(SCENES.intro.start)} durationInFrames={toFrames(SCENES.intro.duration)}>
        <IntroScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/intro.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.hook.start)} durationInFrames={toFrames(SCENES.hook.duration)}>
        <HookScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.discovery.start)} durationInFrames={toFrames(SCENES.discovery.duration)}>
        <DiscoveryScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/discovery.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.mechanism.start)} durationInFrames={toFrames(SCENES.mechanism.duration)}>
        <MechanismScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/mechanism.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.studyApplication.start)} durationInFrames={toFrames(SCENES.studyApplication.duration)}>
        <StudyApplicationScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/study_application.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.productivityHack.start)} durationInFrames={toFrames(SCENES.productivityHack.duration)}>
        <ProductivityHackScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/productivity_hack.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.darkSide.start)} durationInFrames={toFrames(SCENES.darkSide.duration)}>
        <DarkSideScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/dark_side.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.solution.start)} durationInFrames={toFrames(SCENES.solution.duration)}>
        <SolutionScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/solution.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.takeaway.start)} durationInFrames={toFrames(SCENES.takeaway.duration)}>
        <TakeawayScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/takeaway.mp3`)} />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Export for registry
export const zeigarnikEffectComposition = {
  id: "ZeigarnikEffect",
  component: ZeigarnikEffect,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: ZeigarnikEffectSchema,
  defaultProps: {},
};
