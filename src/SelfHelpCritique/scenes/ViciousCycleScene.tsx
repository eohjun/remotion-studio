import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../constants";

const STEPS = [
  { text: "자기개발서 읽기", emoji: "📚" },
  { text: "높은 기대 형성", emoji: "✨" },
  { text: "현실과 괴리", emoji: "😕" },
  { text: "자책감", emoji: "😞", highlight: true },
  { text: "또 다른 책 찾기", emoji: "🔄" },
];

export const ViciousCycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.light,
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <span style={{ fontSize: 32, marginRight: 16 }}>📈</span>
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.dark,
            fontFamily: FONT_FAMILY.title,
          }}
        >
          자기개발 피로의 악순환
        </span>
      </div>

      {/* Cycle Steps */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          padding: "0 40px",
        }}
      >
        {STEPS.map((step, index) => {
          // Staggered animation for each step
          const stepProgress = spring({
            frame: frame - 20 - index * 15,
            fps,
            config: { damping: 80, mass: 0.5 },
          });

          const stepScale = interpolate(stepProgress, [0, 1], [0.5, 1]);
          const stepOpacity = interpolate(stepProgress, [0, 1], [0, 1]);

          // Arrow animation
          const arrowProgress = spring({
            frame: frame - 30 - index * 15,
            fps,
            config: { damping: 100 },
          });

          const arrowOpacity = interpolate(arrowProgress, [0, 1], [0, 1]);

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Step Card */}
              <div
                style={{
                  transform: `scale(${stepScale})`,
                  opacity: stepOpacity,
                  backgroundColor: step.highlight ? "#f8d7da" : "#e9ecef",
                  border: step.highlight ? `3px solid ${COLORS.danger}` : "none",
                  padding: "24px 36px",
                  borderRadius: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: step.highlight
                    ? "0 8px 24px rgba(220, 53, 69, 0.3)"
                    : "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ fontSize: 32 }}>{step.emoji}</span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: step.highlight ? COLORS.danger : COLORS.dark,
                    fontFamily: FONT_FAMILY.body,
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.text}
                </span>
              </div>

              {/* Arrow (not for last item) */}
              {index < STEPS.length - 1 && (
                <div
                  style={{
                    opacity: arrowOpacity,
                    fontSize: 40,
                    margin: "0 16px",
                    color: COLORS.dark,
                  }}
                >
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loop indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [90, 110], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: COLORS.danger,
            fontWeight: 600,
            fontFamily: FONT_FAMILY.body,
            textAlign: "center",
          }}
        >
          🔁 끝없이 반복되는 사이클
        </div>
      </div>
    </AbsoluteFill>
  );
};
