/**
 * Recap Scene - 4단계가 SelfDrawingPath로 연결되는 플로우 차트
 *
 * Features tested: SelfDrawingPath (flow chart)
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SelfDrawingPath } from "../../../shared/components/paths";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

const STEPS = [
  { num: 1, label: "포착", color: COLORS.accent, x: 240 },
  { num: 2, label: "명확화", color: COLORS.primary, x: 560 },
  { num: 3, label: "프로토타입", color: COLORS.success, x: 960 },
  { num: 4, label: "반복", color: COLORS.warning, x: 1360 },
];

// 연결선 paths
const CONNECTION_PATHS = [
  "M 340 540 L 460 540",
  "M 660 540 L 860 540",
  "M 1060 540 L 1260 540",
];

export const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const conclusionOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={[COLORS.dark, "#1a2a3a", COLORS.darkAlt]}
        animationMode="shift"
      />

      {/* 타이틀 */}
      <div
        style={{
          position: "absolute",
          top: 100,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.white,
            margin: 0,
          }}
        >
          정리하면
        </h1>
      </div>

      {/* 플로우 차트 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 스텝 원들 */}
        {STEPS.map((step, i) => {
          const stepScale = spring({
            frame: frame - (20 + i * 25),
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const labelOpacity = interpolate(
            frame,
            [40 + i * 25, 60 + i * 25],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: step.x,
                top: 540,
                transform: `translate(-50%, -50%) scale(${stepScale})`,
              }}
            >
              {/* 원 */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: step.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0 0 30px ${step.color}50`,
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: i === 0 || i === 3 ? COLORS.dark : COLORS.white,
                  }}
                >
                  {step.num}
                </span>
              </div>

              {/* 라벨 */}
              <div
                style={{
                  marginTop: 24,
                  textAlign: "center",
                  opacity: labelOpacity,
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    color: step.color,
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* 연결선들 - SelfDrawingPath */}
        {CONNECTION_PATHS.map((path, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <SelfDrawingPath
              path={path}
              stroke={COLORS.light}
              strokeWidth={3}
              width={1920}
              height={1080}
              drawDuration={25}
              delay={50 + i * 25}
            />
          </div>
        ))}

        {/* 화살표 머리 */}
        {[460, 860, 1260].map((x, i) => {
          const arrowOpacity = interpolate(
            frame,
            [70 + i * 25, 80 + i * 25],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: 540,
                transform: "translate(-50%, -50%)",
                opacity: arrowOpacity,
                fontSize: 24,
                color: COLORS.light,
              }}
            >
              →
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 결론 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          width: "100%",
          textAlign: "center",
          opacity: conclusionOpacity,
        }}
      >
        <p
          style={{
            fontSize: 40,
            color: COLORS.white,
            margin: 0,
          }}
        >
          이 4단계를 거치면{" "}
          <span style={{ color: COLORS.accent }}>막연했던 아이디어</span>가{" "}
          <span style={{ color: COLORS.success }}>구체적인 현실</span>이 됩니다
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default RecapScene;
