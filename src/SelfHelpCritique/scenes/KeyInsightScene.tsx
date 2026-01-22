import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../constants";

export const KeyInsightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card animation
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
  });

  const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  // Text highlight animation
  const highlightProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 80 },
  });

  const highlightWidth = interpolate(highlightProgress, [0, 1], [0, 100]);

  // Icon bounce
  const iconBounce = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, mass: 0.3, stiffness: 300 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 60,
          borderRadius: 24,
          maxWidth: 1400,
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.4)",
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            transform: `scale(${iconBounce})`,
          }}
        >
          <span style={{ fontSize: 32, marginRight: 12 }}>💡</span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              fontFamily: FONT_FAMILY.body,
              letterSpacing: 2,
            }}
          >
            KEY INSIGHT
          </span>
        </div>

        {/* Main text */}
        <div
          style={{
            fontSize: 42,
            lineHeight: 1.6,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 500,
          }}
        >
          자기개발 담론은{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: 4,
                left: 0,
                height: 12,
                width: `${highlightWidth}%`,
                backgroundColor: COLORS.warning,
                opacity: 0.8,
                zIndex: 0,
              }}
            />
            <span style={{ position: "relative", zIndex: 1, fontWeight: 700 }}>
              구조적 문제를 개인의 노력 부족으로 환원
            </span>
          </span>
          하며,
          <br />
          사회적 불평등을 개인 책임으로 전가합니다.
        </div>

        {/* Bottom emphasis */}
        <div
          style={{
            marginTop: 40,
            fontSize: 36,
            color: COLORS.warning,
            fontWeight: 700,
            fontFamily: FONT_FAMILY.body,
          }}
        >
          문제는 당신의 노력이 아니라, 시스템일 수 있습니다.
        </div>
      </div>
    </AbsoluteFill>
  );
};
