/**
 * Hook Scene - SelfDrawingPath로 전구 아이콘 그리기
 *
 * Features tested: SelfDrawingPath
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SelfDrawingPath } from "../../../shared/components/paths";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";
import { SCENES } from "../constants";

// 전구 아이콘 SVG path
const LIGHTBULB_PATH = `
  M 100 20
  C 60 20 30 50 30 90
  C 30 120 50 140 70 155
  L 70 175
  L 130 175
  L 130 155
  C 150 140 170 120 170 90
  C 170 50 140 20 100 20
  M 70 185
  L 130 185
  M 75 195
  L 125 195
  M 85 205
  L 115 205
`;

// 아이디어 파티클 paths
const SPARKLE_PATHS = [
  "M 50 50 L 55 45 L 60 50 L 55 55 Z",
  "M 150 40 L 155 35 L 160 40 L 155 45 Z",
  "M 40 100 L 45 95 L 50 100 L 45 105 Z",
  "M 160 110 L 165 105 L 170 110 L 165 115 Z",
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = SCENES.HOOK;

  // 타이틀 애니메이션
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, 30], [30, 0], {
    extrapolateRight: "clamp",
  });

  // 통계 텍스트 페이드인
  const statOpacity = interpolate(frame, [duration - 90, duration - 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={[COLORS.dark, COLORS.darkAlt, "#1a1a3e"]}
        animationMode="shift"
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 전구 아이콘 - SelfDrawingPath */}
        <div style={{ position: "relative", width: 200, height: 220 }}>
          <SelfDrawingPath
            path={LIGHTBULB_PATH}
            stroke={COLORS.accent}
            strokeWidth={4}
            width={200}
            height={220}
            drawDuration={90}
            drawEasing="ease-out"
            delay={20}
          />

          {/* 스파클 효과들 */}
          {SPARKLE_PATHS.map((path, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <SelfDrawingPath
                path={path}
                stroke={COLORS.warning}
                strokeWidth={2}
                width={200}
                height={220}
                drawDuration={30}
                delay={80 + i * 15}
              />
            </div>
          ))}
        </div>

        {/* 타이틀 */}
        <div
          style={{
            marginTop: 60,
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: COLORS.white,
              margin: 0,
              letterSpacing: 2,
            }}
          >
            아이디어가 현실이 되기까지
          </h1>
        </div>

        {/* 통계 텍스트 */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            opacity: statOpacity,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 36,
              color: COLORS.light,
              margin: 0,
            }}
          >
            매일 수십 개의 아이디어 중, 현실이 되는 건 극소수
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default HookScene;
