/**
 * Problem Scene - LiquidPath로 흩어지는 아이디어들 표현
 *
 * Features tested: LiquidPath
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { LiquidPath } from "../../../shared/components/paths";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

// 흩어지는 선들 - 아이디어가 사라지는 느낌
const SCATTER_PATHS = [
  { path: "M 200 540 Q 400 480 600 540", color: COLORS.accent, delay: 0 },
  { path: "M 300 540 Q 500 450 700 540", color: COLORS.primary, delay: 10 },
  { path: "M 400 540 Q 600 420 800 540", color: COLORS.secondary, delay: 20 },
  { path: "M 500 540 Q 700 390 900 540", color: COLORS.warning, delay: 30 },
  { path: "M 600 540 Q 800 360 1000 540", color: COLORS.accent, delay: 40 },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 텍스트 애니메이션
  const textOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 전체 페이드
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <AnimatedGradient
        colors={["#1a1a2e", "#16213e", "#0f0f23"]}
        animationMode="shift"
      />

      {/* LiquidPath로 흩어지는 아이디어 시각화 */}
      <AbsoluteFill>
        {SCATTER_PATHS.map((item, i) => {
          const pathOpacity = interpolate(
            frame,
            [item.delay, item.delay + 30, 150, 180],
            [0, 0.6, 0.6, 0.2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: pathOpacity,
              }}
            >
              <LiquidPath
                path={item.path}
                stroke={item.color}
                strokeWidth={3}
                width={1920}
                height={1080}
                waveCount={2 + i * 0.5}
                amplitude={15 + i * 5}
                speed={0.8}
                direction="vertical"
                delay={item.delay}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 메인 메시지 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: textOpacity,
            maxWidth: 1200,
            padding: "0 80px",
          }}
        >
          <h2
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.white,
              margin: 0,
              marginBottom: 40,
            }}
          >
            왜 아이디어는 사라질까요?
          </h2>
          <p
            style={{
              fontSize: 40,
              color: COLORS.light,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            대부분의 아이디어는 구체화 과정 없이
            <br />
            머릿속에만 맴돌다가 잊혀집니다
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default ProblemScene;
