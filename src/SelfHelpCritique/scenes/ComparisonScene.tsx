import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../constants";

const COMPARISONS = [
  { label: "초점", having: "더 많이 갖는 것", being: "더 충만하게 되는 것" },
  { label: "동기", having: "불안, 비교, 경쟁", being: "호기심, 의미, 성장" },
  { label: "결과", having: "만족 없는 갈증", being: "내면의 풍요로움" },
];

export const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  // Left card (Having mode)
  const leftProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 80 },
  });

  const leftX = interpolate(leftProgress, [0, 1], [-100, 0]);
  const leftOpacity = interpolate(leftProgress, [0, 1], [0, 1]);

  // Right card (Being mode)
  const rightProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 80 },
  });

  const rightX = interpolate(rightProgress, [0, 1], [100, 0]);
  const rightOpacity = interpolate(rightProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        padding: 60,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <span style={{ fontSize: 28, marginRight: 12 }}>🧠</span>
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
          }}
        >
          에리히 프롬: 소유 vs 존재
        </span>
      </div>

      {/* Comparison Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          flex: 1,
        }}
      >
        {/* Having Mode Card */}
        <div
          style={{
            transform: `translateX(${leftX}px)`,
            opacity: leftOpacity,
            flex: 1,
            maxWidth: 700,
            backgroundColor: "#f8d7da",
            borderRadius: 24,
            padding: 40,
            border: `4px solid ${COLORS.danger}`,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: COLORS.danger,
              marginBottom: 30,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
            }}
          >
            ❌ 소유 양식
          </div>

          {COMPARISONS.map((item, index) => {
            const rowProgress = spring({
              frame: frame - 40 - index * 10,
              fps,
              config: { damping: 100 },
            });

            return (
              <div
                key={index}
                style={{
                  opacity: interpolate(rowProgress, [0, 1], [0, 1]),
                  marginBottom: 24,
                  padding: "16px 20px",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#721c24",
                    marginBottom: 8,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: "#721c24",
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.having}
                </div>
              </div>
            );
          })}
        </div>

        {/* VS divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            VS
          </span>
        </div>

        {/* Being Mode Card */}
        <div
          style={{
            transform: `translateX(${rightX}px)`,
            opacity: rightOpacity,
            flex: 1,
            maxWidth: 700,
            backgroundColor: "#d4edda",
            borderRadius: 24,
            padding: 40,
            border: `4px solid ${COLORS.success}`,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: COLORS.success,
              marginBottom: 30,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
            }}
          >
            ✅ 존재 양식
          </div>

          {COMPARISONS.map((item, index) => {
            const rowProgress = spring({
              frame: frame - 50 - index * 10,
              fps,
              config: { damping: 100 },
            });

            return (
              <div
                key={index}
                style={{
                  opacity: interpolate(rowProgress, [0, 1], [0, 1]),
                  marginBottom: 24,
                  padding: "16px 20px",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#155724",
                    marginBottom: 8,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: "#155724",
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.being}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
