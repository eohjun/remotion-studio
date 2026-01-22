import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../constants";

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  const cardY = interpolate(cardProgress, [0, 1], [100, 0]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  // Number counter animation (0 to 70)
  const counterProgress = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentNumber = Math.round(counterProgress * 70);

  // Percentage sign pop
  const percentPop = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, mass: 0.3, stiffness: 400 },
  });

  // Description fade in
  const descOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.light,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div
        style={{
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          backgroundColor: COLORS.dark,
          padding: 80,
          borderRadius: 24,
          textAlign: "center",
          minWidth: 800,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Number */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1,
            }}
          >
            {currentNumber}
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: COLORS.primary,
              fontFamily: FONT_FAMILY.title,
              transform: `scale(${percentPop})`,
              marginLeft: 8,
            }}
          >
            %
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            opacity: descOpacity,
            marginTop: 40,
            fontSize: 32,
            color: "rgba(255,255,255,0.8)",
            fontFamily: FONT_FAMILY.body,
            lineHeight: 1.5,
          }}
        >
          직장인의 자기개발 피로감 경험 비율
          <br />
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
            2025 직장인 스트레스 조사
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
