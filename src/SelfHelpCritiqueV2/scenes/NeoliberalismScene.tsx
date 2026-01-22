import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, DARK_GRADIENT, SCENES } from "../constants";
import { SceneTransition } from "../../components";
import {
  AnimatedText,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  popIn,
  scaleIn,
  combine,
} from "../../templates/animations";

export const NeoliberalismScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 100 } });
  const contentProgress = spring({ frame: frame - 25, fps, config: { damping: 80 } });
  const quoteProgress = spring({ frame: frame - 60, fps, config: { damping: 80 } });

  const keyPoints = ["자기 브랜딩", "인적 자본", "자기 최적화"];

  return (
    <SceneTransition durationInFrames={SCENES.neoliberalism.duration}>
      <AbsoluteFill style={{ background: DARK_GRADIENT, padding: 80 }}>
      {/* Title */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          marginBottom: 50,
        }}
      >
        <AnimatedText
          text="울리히 브뢰클링"
          animation={fadeInUp(15)}
          stagger="none"
          delay={0}
          style={{ fontSize: 24, color: COLORS.orange, fontFamily: FONT_FAMILY.body }}
        />
        <h2 style={{ fontSize: 56, fontWeight: 700, color: COLORS.white, fontFamily: FONT_FAMILY.title, margin: "10px 0" }}>
          <span style={{ marginRight: 12 }}>🏢</span>
          <AnimatedText
            text="기업가적 자아"
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Main Content */}
      <div
        style={{
          opacity: interpolate(contentProgress, [0, 1], [0, 1]),
          display: "flex",
          gap: 60,
          flex: 1,
        }}
      >
        {/* Left: Description */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 20,
              padding: 40,
              marginBottom: 30,
            }}
          >
            <h3 style={{ fontSize: 32, color: COLORS.warning, fontFamily: FONT_FAMILY.title, marginBottom: 20 }}>
              <AnimatedText
                text="신자유주의 시대의 자기개발"
                animation={fadeInLeft(20)}
                stagger="word"
                staggerDuration={4}
                delay={30}
                style={{ fontWeight: 600 }}
              />
            </h3>
            <div style={{ fontSize: 26, color: COLORS.white, fontFamily: FONT_FAMILY.body, lineHeight: 1.7 }}>
              <AnimatedText
                text="복지국가 축소, 고용 불안정..."
                animation={fadeInLeft(15)}
                stagger="word"
                staggerDuration={3}
                delay={45}
              />
              <br />
              <AnimatedText
                text="개인은 시장에서 살아남기 위해"
                animation={fadeInLeft(15)}
                stagger="word"
                staggerDuration={3}
                delay={60}
              />
              <br />
              <AnimatedText
                text="끊임없이 자신을 업그레이드해야 한다"
                animation={fadeInLeft(15)}
                stagger="word"
                staggerDuration={3}
                delay={75}
                style={{ color: COLORS.accent, fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Key Points */}
          <div style={{ display: "flex", gap: 20 }}>
            {keyPoints.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: COLORS.orange,
                  padding: "12px 24px",
                  borderRadius: 30,
                  fontSize: 22,
                  fontWeight: 600,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                <AnimatedText
                  text={item}
                  animation={popIn()}
                  stagger="none"
                  delay={90 + i * 8}
                  style={{ fontWeight: 600 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quote Box */}
        <div
          style={{
            opacity: interpolate(quoteProgress, [0, 1], [0, 1]),
            flex: 1,
            backgroundColor: "rgba(220, 53, 69, 0.2)",
            borderLeft: `6px solid ${COLORS.danger}`,
            borderRadius: "0 20px 20px 0",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatedText
            text="⚠️"
            animation={popIn()}
            stagger="none"
            delay={65}
            style={{ fontSize: 60, display: "block", marginBottom: 20 }}
          />
          <div style={{ fontSize: 32, color: COLORS.white, fontFamily: FONT_FAMILY.body, lineHeight: 1.6, fontStyle: "italic" }}>
            <AnimatedText
              text="실패하면?"
              animation={fadeInRight(20)}
              stagger="none"
              delay={75}
            />
            <br />
            <AnimatedText
              text="전적으로 개인 탓이 됩니다"
              animation={combine([fadeInRight(25), scaleIn(0.95)])}
              stagger="word"
              staggerDuration={4}
              delay={85}
              style={{ color: COLORS.danger, fontSize: 38, fontWeight: 700 }}
            />
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 20, fontFamily: FONT_FAMILY.body }}>
            <AnimatedText
              text="구조적 문제 → 개인 책임으로 전가"
              animation={fadeInUp(10)}
              stagger="word"
              staggerDuration={3}
              delay={110}
            />
          </div>
        </div>
      </div>
      </AbsoluteFill>
    </SceneTransition>
  );
};
