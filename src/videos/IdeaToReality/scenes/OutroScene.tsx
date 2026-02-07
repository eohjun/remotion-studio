/**
 * Outro Scene - SelfDrawingPath로 체크마크 완성 + AnimatedStar 강조
 *
 * Features tested: SelfDrawingPath, AnimatedStar
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SelfDrawingPath } from "../../../shared/components/paths";
import { AnimatedStar } from "../../../shared/components/shapes";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

// 체크마크 path
const CHECKMARK_PATH = "M 60 150 L 120 210 L 240 90";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 체크마크 원 등장
  const circleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // CTA 텍스트
  const ctaOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaY = interpolate(frame, [80, 110], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={[COLORS.dark, "#1a3a2a", COLORS.darkAlt]}
        animationMode="pulse"
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 체크마크 영역 */}
        <div
          style={{
            position: "relative",
            width: 300,
            height: 300,
            marginBottom: 40,
          }}
        >
          {/* 원 배경 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${circleScale})`,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `${COLORS.success}20`,
              border: `4px solid ${COLORS.success}`,
              boxShadow: `0 0 40px ${COLORS.success}40`,
            }}
          />

          {/* SelfDrawingPath 체크마크 */}
          <SelfDrawingPath
            path={CHECKMARK_PATH}
            stroke={COLORS.success}
            strokeWidth={12}
            width={300}
            height={300}
            drawDuration={40}
            delay={30}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* AnimatedStar들 */}
          <div style={{ position: "absolute", top: 20, right: 30 }}>
            <AnimatedStar
              size={40}
              points={5}
              fill={COLORS.warning}
              delay={70}
              pulse
              rotationSpeed={0.5}
            />
          </div>
          <div style={{ position: "absolute", top: 60, left: 20 }}>
            <AnimatedStar
              size={30}
              points={5}
              fill={COLORS.accent}
              delay={80}
              pulse
              rotationSpeed={-0.3}
            />
          </div>
          <div style={{ position: "absolute", bottom: 40, right: 20 }}>
            <AnimatedStar
              size={35}
              points={5}
              fill={COLORS.primary}
              delay={90}
              pulse
              rotationSpeed={0.4}
            />
          </div>
        </div>

        {/* CTA 텍스트 */}
        <div
          style={{
            textAlign: "center",
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: COLORS.white,
              margin: 0,
              marginBottom: 28,
            }}
          >
            오늘 떠오른 아이디어가 있다면
          </h2>
          <p
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.accent,
              margin: 0,
            }}
          >
            지금 바로 첫 번째 단계부터 시작하세요
          </p>
        </div>

        {/* 4단계 리마인더 */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            display: "flex",
            gap: 50,
            opacity: ctaOpacity,
          }}
        >
          {["포착", "명확화", "프로토타입", "반복"].map((step, i) => (
            <span
              key={i}
              style={{
                fontSize: 28,
                color: COLORS.light,
                padding: "12px 24px",
                background: `${COLORS.white}10`,
                borderRadius: 24,
              }}
            >
              {i + 1}. {step}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default OutroScene;
