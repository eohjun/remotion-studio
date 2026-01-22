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

export const MindsetLimitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 100 } });
  const leftProgress = spring({ frame: frame - 25, fps, config: { damping: 80 } });
  const rightProgress = spring({ frame: frame - 45, fps, config: { damping: 80 } });

  const valueItems = [
    "능력은 노력으로 발전 가능",
    "실패 = 학습 기회",
    "회복탄력성 향상",
    "피드백 수용성 강화",
  ];

  const limitItems = [
    { text: "마인드셋 변화만으론 구조적 격차 해결 불가", highlight: true },
    { text: "자원 부족의 문제", highlight: false },
    { text: "학습 환경의 중요성", highlight: false },
    { text: "사회적 지원이 함께해야", highlight: true, accent: true },
  ];

  return (
    <SceneTransition durationInFrames={SCENES.mindsetLimit.duration}>
      <AbsoluteFill style={{ backgroundColor: "#2d3436", padding: 80 }}>
      {/* Title */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          marginBottom: 50,
        }}
      >
        <AnimatedText
          text="캐럴 드웩"
          animation={fadeInUp(15)}
          stagger="none"
          delay={0}
          style={{ fontSize: 24, color: COLORS.accent, fontFamily: FONT_FAMILY.body }}
        />
        <h2 style={{ fontSize: 56, fontWeight: 700, color: COLORS.white, fontFamily: FONT_FAMILY.title, margin: "10px 0" }}>
          <span style={{ marginRight: 12 }}>🧠</span>
          <AnimatedText
            text="성장 마인드셋의 한계"
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 50, flex: 1 }}>
        {/* Left: Value */}
        <div
          style={{
            opacity: interpolate(leftProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(leftProgress, [0, 1], [30, 0])}px)`,
            flex: 1,
            backgroundColor: "rgba(40, 167, 69, 0.15)",
            borderRadius: 20,
            padding: 40,
            border: `2px solid ${COLORS.success}`,
          }}
        >
          <AnimatedText
            text="✅"
            animation={popIn()}
            stagger="none"
            delay={30}
            style={{ fontSize: 48, display: "block", marginBottom: 20 }}
          />
          <h3 style={{ fontSize: 32, color: COLORS.success, fontFamily: FONT_FAMILY.title, marginBottom: 24 }}>
            <AnimatedText
              text="가치 있는 개념"
              animation={fadeInLeft(20)}
              stagger="word"
              staggerDuration={4}
              delay={35}
              style={{ fontWeight: 600 }}
            />
          </h3>
          <ul style={{ fontSize: 24, color: COLORS.white, fontFamily: FONT_FAMILY.body, lineHeight: 1.9, paddingLeft: 20 }}>
            {valueItems.map((item, i) => (
              <li key={i}>
                <AnimatedText
                  text={item}
                  animation={fadeInLeft(15)}
                  stagger="word"
                  staggerDuration={3}
                  delay={45 + i * 10}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Limitation */}
        <div
          style={{
            opacity: interpolate(rightProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(rightProgress, [0, 1], [30, 0])}px)`,
            flex: 1,
            backgroundColor: "rgba(220, 53, 69, 0.15)",
            borderRadius: 20,
            padding: 40,
            border: `2px solid ${COLORS.danger}`,
          }}
        >
          <AnimatedText
            text="⚠️"
            animation={popIn()}
            stagger="none"
            delay={50}
            style={{ fontSize: 48, display: "block", marginBottom: 20 }}
          />
          <h3 style={{ fontSize: 32, color: COLORS.danger, fontFamily: FONT_FAMILY.title, marginBottom: 24 }}>
            <AnimatedText
              text="하지만..."
              animation={fadeInRight(20)}
              stagger="none"
              delay={55}
              style={{ fontWeight: 600 }}
            />
          </h3>
          <ul style={{ fontSize: 24, color: COLORS.white, fontFamily: FONT_FAMILY.body, lineHeight: 1.9, paddingLeft: 20 }}>
            {limitItems.map((item, i) => (
              <li key={i}>
                <AnimatedText
                  text={item.text}
                  animation={fadeInRight(15)}
                  stagger="word"
                  staggerDuration={3}
                  delay={65 + i * 12}
                  style={{
                    color: item.accent ? COLORS.accent : item.highlight ? COLORS.danger : COLORS.white,
                    fontWeight: item.highlight ? 600 : 400,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      </AbsoluteFill>
    </SceneTransition>
  );
};
