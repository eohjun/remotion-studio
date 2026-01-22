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

export const SelfEfficacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 100 } });
  const cardProgress = spring({ frame: frame - 30, fps, config: { damping: 80 } });
  const conclusionProgress = spring({ frame: frame - 60, fps, config: { damping: 80 } });

  const sourceItems = ["성취 경험", "대리 경험", "언어적 설득", "정서 상태"];

  return (
    <SceneTransition durationInFrames={SCENES.selfEfficacy.duration}>
      <AbsoluteFill style={{ backgroundColor: "#1e3a5f", padding: 80 }}>
      {/* Title */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          marginBottom: 50,
        }}
      >
        <AnimatedText
          text="알버트 반두라"
          animation={fadeInUp(15)}
          stagger="none"
          delay={0}
          style={{ fontSize: 24, color: COLORS.warning, fontFamily: FONT_FAMILY.body }}
        />
        <h2 style={{ fontSize: 56, fontWeight: 700, color: COLORS.white, fontFamily: FONT_FAMILY.title, margin: "10px 0" }}>
          <span style={{ marginRight: 12 }}>💪</span>
          <AnimatedText
            text="자기효능감의 양면"
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Definition Card */}
      <div
        style={{
          opacity: interpolate(cardProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(cardProgress, [0, 1], [20, 0])}px)`,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 40,
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", gap: 60 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 28, color: COLORS.accent, fontFamily: FONT_FAMILY.title, marginBottom: 20 }}>
              <AnimatedText
                text="핵심 개념"
                animation={fadeInLeft(20)}
                stagger="word"
                staggerDuration={4}
                delay={35}
                style={{ fontWeight: 600 }}
              />
            </h3>
            <div style={{ fontSize: 26, color: COLORS.white, fontFamily: FONT_FAMILY.body, lineHeight: 1.7 }}>
              <AnimatedText
                text='"나는 이것을 할 수 있다"는 신념'
                animation={fadeInLeft(15)}
                stagger="word"
                staggerDuration={3}
                delay={45}
              />
              <br />
              <span style={{ fontSize: 22, color: "rgba(255,255,255,0.7)" }}>
                <AnimatedText
                  text="→ 행동 변화와 성과에 직접적 영향"
                  animation={fadeInLeft(15)}
                  stagger="word"
                  staggerDuration={3}
                  delay={60}
                />
              </span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 28, color: COLORS.accent, fontFamily: FONT_FAMILY.title, marginBottom: 20 }}>
              <AnimatedText
                text="형성 원천"
                animation={fadeInRight(20)}
                stagger="word"
                staggerDuration={4}
                delay={40}
                style={{ fontWeight: 600 }}
              />
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {sourceItems.map((item, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "rgba(0, 194, 255, 0.3)",
                    padding: "10px 20px",
                    borderRadius: 20,
                    fontSize: 22,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  <AnimatedText
                    text={item}
                    animation={popIn()}
                    stagger="none"
                    delay={55 + i * 8}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div
        style={{
          opacity: interpolate(conclusionProgress, [0, 1], [0, 1]),
          backgroundColor: COLORS.warning,
          borderRadius: 16,
          padding: 30,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 28, color: COLORS.dark, fontFamily: FONT_FAMILY.body, margin: 0, fontWeight: 600 }}>
          <span style={{ marginRight: 8 }}>⚖️</span>
          <AnimatedText
            text="과도한 자기효능감 → 비현실적 낙관주의"
            animation={combine([fadeInUp(15), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={4}
            delay={70}
            style={{ fontWeight: 600 }}
          />
          <br />
          <span style={{ fontSize: 24, fontWeight: 400 }}>
            <AnimatedText
              text="개인의 노력만큼 환경과 구조가 중요합니다"
              animation={fadeInUp(10)}
              stagger="word"
              staggerDuration={3}
              delay={95}
              style={{ fontWeight: 400 }}
            />
          </span>
        </p>
      </div>
      </AbsoluteFill>
    </SceneTransition>
  );
};
