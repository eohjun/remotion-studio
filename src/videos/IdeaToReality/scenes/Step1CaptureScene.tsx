/**
 * Step 1: Capture Scene - SelfDrawingPath + AnimatedStar
 *
 * Features tested: SelfDrawingPath, AnimatedStar
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SelfDrawingPath } from "../../../shared/components/paths";
import { AnimatedStar } from "../../../shared/components/shapes";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

// 메모장 아이콘 path
const NOTEPAD_PATH = `
  M 40 20 L 160 20 L 160 180 L 40 180 Z
  M 60 50 L 140 50
  M 60 80 L 140 80
  M 60 110 L 120 110
`;

// 연필 path
const PENCIL_PATH = `
  M 170 30 L 190 50 L 140 100 L 120 80 Z
  M 115 85 L 125 95
`;

export const Step1CaptureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 스텝 번호 등장
  const stepScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // 텍스트 등장
  const textOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 통계 강조
  const statOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={["#1a2a3a", "#0d1b2a", "#1b263b"]}
        animationMode="shift"
      />

      {/* 좌측: 비주얼 */}
      <AbsoluteFill
        style={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: 220, height: 200 }}>
          {/* 메모장 그려지기 */}
          <SelfDrawingPath
            path={NOTEPAD_PATH}
            stroke={COLORS.accent}
            strokeWidth={3}
            width={220}
            height={200}
            drawDuration={60}
            delay={30}
          />

          {/* 연필 그려지기 */}
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <SelfDrawingPath
              path={PENCIL_PATH}
              stroke={COLORS.warning}
              strokeWidth={3}
              width={220}
              height={200}
              drawDuration={40}
              delay={80}
            />
          </div>

          {/* AnimatedStar 강조 */}
          <div style={{ position: "absolute", top: -20, right: -20 }}>
            <AnimatedStar
              size={50}
              points={5}
              fill={COLORS.warning}
              delay={120}
              pulse
            />
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
        {/* 스텝 번호 */}
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
              background: COLORS.accent,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.dark,
            }}
          >
            1
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: COLORS.accent,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            CAPTURE
          </span>
        </div>

        {/* 메인 텍스트 */}
        <div style={{ opacity: textOpacity }}>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.white,
              margin: 0,
              marginBottom: 24,
            }}
          >
            포착하기
          </h2>
          <p
            style={{
              fontSize: 36,
              color: COLORS.light,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            아이디어가 떠오르는 순간
            <br />
            바로 기록하세요
          </p>
        </div>

        {/* 통계 */}
        <div
          style={{
            marginTop: 50,
            padding: "24px 36px",
            background: `${COLORS.warning}20`,
            borderRadius: 12,
            borderLeft: `4px solid ${COLORS.warning}`,
            opacity: statOpacity,
          }}
        >
          <p
            style={{
              fontSize: 32,
              color: COLORS.warning,
              margin: 0,
              fontWeight: 600,
            }}
          >
            3분 안에 기록하지 않으면 70%는 잊혀집니다
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Step1CaptureScene;
