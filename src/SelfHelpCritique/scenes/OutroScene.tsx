import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENT } from "../constants";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quote card animation
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.8 },
  });

  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  // Quote text typing effect (simplified)
  const textProgress = interpolate(frame, [20, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Closing message
  const closingProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 80 },
  });

  const closingOpacity = interpolate(closingProgress, [0, 1], [0, 1]);
  const closingY = interpolate(closingProgress, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        background: GRADIENT,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Quote Card */}
      <div
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          backgroundColor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          padding: 60,
          borderRadius: 24,
          maxWidth: 1400,
          borderLeft: `6px solid ${COLORS.accent}`,
        }}
      >
        {/* Quote Icon */}
        <div
          style={{
            fontSize: 60,
            marginBottom: 24,
            opacity: 0.8,
          }}
        >
          💬
        </div>

        {/* Quote Text */}
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.7,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.body,
            fontStyle: "italic",
            opacity: textProgress,
          }}
        >
          "당신이 지친 건 노력이 부족해서가 아닙니다.
          <br />
          어쩌면 이 세상이 당신에게 너무 많은 것을 요구하고 있는 건지도 모릅니다.
          <br />
          <br />
          때로는 멈추고, 숨 쉬고,
          <br />
          <span style={{ color: COLORS.warning, fontWeight: 600 }}>
            지금의 당신으로도 충분하다는 것을 기억하세요.
          </span>
          "
        </div>

        {/* Attribution */}
        <div
          style={{
            marginTop: 30,
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            fontFamily: FONT_FAMILY.body,
          }}
        >
          — 이 글을 읽는 모든 분께
        </div>
      </div>

      {/* Closing CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          transform: `translateY(${closingY}px)`,
          opacity: closingOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            fontFamily: FONT_FAMILY.body,
          }}
        >
          우리는 혼자가 아닙니다 ❤️
        </div>
      </div>
    </AbsoluteFill>
  );
};
