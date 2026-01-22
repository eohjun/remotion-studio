import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SCENES } from "../constants";
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

export const PositivityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 100 } });
  const cardProgress = spring({ frame: frame - 30, fps, config: { damping: 80 } });
  const bottomProgress = spring({ frame: frame - 70, fps, config: { damping: 80 } });

  const leftItems = [
    { text: "부정적 감정 = 실패의 징후", highlight: true },
    { text: '"마음가짐의 문제야!"', highlight: false },
    { text: '"긍정적으로 생각해!"', highlight: false },
  ];

  const rightItems = [
    { text: "구조적 문제 외면", highlight: true },
    { text: "현실 인식 왜곡", highlight: false },
    { text: "개인에게 책임 전가", highlight: false },
  ];

  return (
    <SceneTransition durationInFrames={SCENES.positivity.duration}>
      <AbsoluteFill style={{ backgroundColor: "#fdf6e3", padding: 80 }}>
      {/* Title */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          marginBottom: 50,
        }}
      >
        <AnimatedText
          text="바버라 에런라이크"
          animation={fadeInUp(15)}
          stagger="none"
          delay={0}
          style={{ fontSize: 24, color: COLORS.purple, fontFamily: FONT_FAMILY.body }}
        />
        <h2 style={{ fontSize: 56, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_FAMILY.title, margin: "10px 0" }}>
          <span style={{ marginRight: 12 }}>😊</span>
          <AnimatedText
            text="긍정의 배신"
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Main Card */}
      <div
        style={{
          opacity: interpolate(cardProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(cardProgress, [0, 1], [0.95, 1])})`,
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          borderRadius: 24,
          padding: 50,
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", gap: 60 }}>
          {/* Left */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 32, color: COLORS.dark, fontFamily: FONT_FAMILY.title, marginBottom: 24 }}>
              <AnimatedText
                text="긍정적 사고의 강박"
                animation={fadeInLeft(20)}
                stagger="word"
                staggerDuration={4}
                delay={35}
                style={{ fontWeight: 600 }}
              />
            </h3>
            <ul style={{ fontSize: 26, color: COLORS.dark, fontFamily: FONT_FAMILY.body, lineHeight: 2, paddingLeft: 24 }}>
              {leftItems.map((item, i) => (
                <li key={i}>
                  <AnimatedText
                    text={item.text}
                    animation={fadeInLeft(15)}
                    stagger="word"
                    staggerDuration={3}
                    delay={45 + i * 10}
                    style={{ color: item.highlight ? COLORS.danger : COLORS.dark, fontWeight: item.highlight ? 600 : 400 }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 32, color: COLORS.dark, fontFamily: FONT_FAMILY.title, marginBottom: 24 }}>
              <AnimatedText
                text="숨겨진 결과"
                animation={fadeInRight(20)}
                stagger="word"
                staggerDuration={4}
                delay={40}
                style={{ fontWeight: 600 }}
              />
            </h3>
            <ul style={{ fontSize: 26, color: COLORS.dark, fontFamily: FONT_FAMILY.body, lineHeight: 2, paddingLeft: 24 }}>
              {rightItems.map((item, i) => (
                <li key={i}>
                  <AnimatedText
                    text={item.text}
                    animation={fadeInRight(15)}
                    stagger="word"
                    staggerDuration={3}
                    delay={50 + i * 10}
                    style={{ color: item.highlight ? COLORS.danger : COLORS.dark, fontWeight: item.highlight ? 600 : 400 }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Quote */}
      <div
        style={{
          opacity: interpolate(bottomProgress, [0, 1], [0, 1]),
          backgroundColor: COLORS.dark,
          borderRadius: 16,
          padding: 30,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 28, color: COLORS.white, fontFamily: FONT_FAMILY.body, margin: 0 }}>
          <span style={{ marginRight: 8 }}>💡</span>
          <AnimatedText
            text="2008년 금융위기 = 집단적 현실 부정의 결과?"
            animation={combine([fadeInUp(15), popIn()])}
            stagger="word"
            staggerDuration={4}
            delay={80}
          />
        </p>
      </div>
      </AbsoluteFill>
    </SceneTransition>
  );
};
