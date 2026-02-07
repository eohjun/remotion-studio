/**
 * Step 4: Iterate Scene - MorphingIcon (순환 화살표) + LiquidPath 흐름
 *
 * Features tested: MorphingIcon, LiquidPath, AnimatedPolygon (cycle)
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { LiquidPath } from "../../../shared/components/paths";
import { AnimatedPolygon } from "../../../shared/components/shapes";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

// 순환 화살표 paths
const CYCLE_ARROWS = [
  { path: "M 150 100 A 80 80 0 0 1 250 180", startAngle: 0 },
  { path: "M 250 180 A 80 80 0 0 1 150 260", startAngle: 90 },
  { path: "M 150 260 A 80 80 0 0 1 50 180", startAngle: 180 },
  { path: "M 50 180 A 80 80 0 0 1 150 100", startAngle: 270 },
];

export const Step4IterateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const titleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 키워드 등장
  const keywordsOpacity = interpolate(frame, [140, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={["#1a2a3a", "#2d3a4a", "#1e2d3d"]}
        animationMode="shift"
      />

      {/* 좌측: 순환 비주얼 */}
      <AbsoluteFill
        style={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: 400, height: 400 }}>
          {/* LiquidPath로 순환 흐름 */}
          {CYCLE_ARROWS.map((arrow, i) => {
            const arrowOpacity = interpolate(
              frame,
              [40 + i * 20, 70 + i * 20],
              [0, 0.8],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 20,
                  left: 50,
                  opacity: arrowOpacity,
                }}
              >
                <LiquidPath
                  path={arrow.path}
                  stroke={COLORS.accent}
                  strokeWidth={5}
                  width={300}
                  height={360}
                  waveCount={1}
                  amplitude={3}
                  speed={0.5}
                  delay={40 + i * 20}
                />
              </div>
            );
          })}

          {/* 중앙에 4개의 육각형 스텝 표시 */}
          <div style={{ position: "absolute", top: 40, left: 140 }}>
            <AnimatedPolygon sides={6} size={70} fill={COLORS.accent} delay={60} />
            <span style={{ position: "absolute", top: 18, left: 22, fontSize: 32, color: COLORS.dark, fontWeight: 800 }}>1</span>
          </div>
          <div style={{ position: "absolute", top: 145, left: 245 }}>
            <AnimatedPolygon sides={6} size={70} fill={COLORS.primary} delay={80} />
            <span style={{ position: "absolute", top: 18, left: 22, fontSize: 32, color: COLORS.white, fontWeight: 800 }}>2</span>
          </div>
          <div style={{ position: "absolute", top: 250, left: 140 }}>
            <AnimatedPolygon sides={6} size={70} fill={COLORS.success} delay={100} />
            <span style={{ position: "absolute", top: 18, left: 22, fontSize: 32, color: COLORS.white, fontWeight: 800 }}>3</span>
          </div>
          <div style={{ position: "absolute", top: 145, left: 35 }}>
            <AnimatedPolygon sides={6} size={70} fill={COLORS.warning} delay={120} />
            <span style={{ position: "absolute", top: 18, left: 22, fontSize: 32, color: COLORS.dark, fontWeight: 800 }}>4</span>
          </div>

          {/* 중앙 텍스트 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.white,
              }}
            >
              반복
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* 우측: 텍스트 */}
      <AbsoluteFill
        style={{
          left: "50%",
          width: "50%",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 30,
            transform: `scale(${stepScale})`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: COLORS.warning,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.dark,
            }}
          >
            4
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: COLORS.warning,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            ITERATE
          </span>
        </div>

        <div style={{ opacity: titleOpacity }}>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.white,
              margin: 0,
              marginBottom: 24,
            }}
          >
            반복하기
          </h2>
          <p
            style={{
              fontSize: 36,
              color: COLORS.light,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            피드백을 받고, 수정하고,
            <br />
            다시 시도하세요
          </p>
        </div>

        {/* 키워드 */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            opacity: keywordsOpacity,
          }}
        >
          {["피드백", "수정", "개선", "반복"].map((word, i) => (
            <span
              key={i}
              style={{
                padding: "14px 28px",
                background: `${COLORS.warning}30`,
                borderRadius: 24,
                color: COLORS.warning,
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <p
          style={{
            fontSize: 30,
            color: COLORS.accent,
            margin: 0,
            marginTop: 40,
            opacity: keywordsOpacity,
          }}
        >
          한 번에 완성되는 아이디어는 없습니다
          <br />
          <strong>반복이 곧 완성입니다</strong>
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Step4IterateScene;
