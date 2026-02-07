/**
 * Solution Intro Scene - 물음표 → 느낌표 전환 (Crossfade)
 *
 * Features tested: SVG crossfade animation
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

export const SolutionIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 아이콘 등장
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 모핑 진행
  const morphProgress = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 텍스트 등장
  const textOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [90, 120], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4단계 텍스트 강조
  const highlightOpacity = interpolate(frame, [110, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={[COLORS.dark, "#1e3a5f", COLORS.darkAlt]}
        animationMode="pulse"
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Crossfade: ? → ! */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            marginBottom: 60,
            position: "relative",
            width: 120,
            height: 120,
          }}
        >
          {/* Question mark */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 1 - morphProgress,
              fontSize: 100,
              fontWeight: 800,
              color: COLORS.warning,
              filter: `drop-shadow(0 0 20px ${COLORS.warning}50)`,
            }}
          >
            ?
          </div>
          {/* Exclamation mark */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: morphProgress,
              fontSize: 100,
              fontWeight: 800,
              color: COLORS.success,
              filter: `drop-shadow(0 0 20px ${COLORS.success}50)`,
            }}
          >
            !
          </div>
        </div>

        {/* 솔루션 소개 텍스트 */}
        <div
          style={{
            textAlign: "center",
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: COLORS.light,
              margin: 0,
              marginBottom: 24,
            }}
          >
            아이디어를 현실로 만드는
          </h2>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: COLORS.white,
              margin: 0,
            }}
          >
            <span
              style={{
                color: COLORS.accent,
                opacity: highlightOpacity,
                textShadow: `0 0 30px ${COLORS.accent}60`,
              }}
            >
              4단계
            </span>{" "}
            프레임워크
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SolutionIntroScene;
