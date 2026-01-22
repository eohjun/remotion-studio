import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENT } from "../constants";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.5 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Subtitle animation (delayed)
  const subtitleProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 100, mass: 0.5 },
  });

  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);

  // Emoji animation
  const emojiScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 50, mass: 0.3, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: GRADIENT,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Main Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            lineHeight: 1.2,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          자기개발서를 읽을수록
          <br />
          불행해지는 이유
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          marginTop: 40,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            fontFamily: FONT_FAMILY.body,
          }}
        >
          노력의 배신
        </div>
      </div>

      {/* Emoji */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          transform: `scale(${emojiScale})`,
          fontSize: 60,
        }}
      >
        📚 → 😰
      </div>
    </AbsoluteFill>
  );
};
