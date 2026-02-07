/**
 * Step 3: Prototype Scene - AnimatedPolygon들이 조합되어 형태를 만드는 애니메이션
 *
 * Features tested: AnimatedPolygon, AnimatedRect, AnimatedTriangle
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AnimatedPolygon, AnimatedRect, AnimatedTriangle } from "../../../shared/components/shapes";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

export const Step3PrototypeScene: React.FC = () => {
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

  // 도형들이 모여서 집 형태를 만드는 애니메이션
  const buildProgress = interpolate(frame, [40, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 각 도형의 위치 계산
  const baseY = interpolate(buildProgress, [0, 0.3], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wallsY = interpolate(buildProgress, [0.2, 0.5], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const roofY = interpolate(buildProgress, [0.4, 0.7], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const detailsOpacity = interpolate(buildProgress, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={["#1a2a3a", "#1e3d59", "#17263b"]}
        animationMode="shift"
      />

      {/* 좌측: 도형 조합 애니메이션 */}
      <AbsoluteFill
        style={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 300,
            height: 280,
          }}
        >
          {/* 바닥 (육각형) */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: `translate(-50%, ${baseY}px)`,
            }}
          >
            <AnimatedPolygon
              sides={6}
              size={60}
              fill={COLORS.secondary}
              cornerRadius={4}
              delay={40}
            />
          </div>

          {/* 벽 (사각형들) */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 80,
              transform: `translateY(${wallsY}px)`,
            }}
          >
            <AnimatedRect
              width={140}
              height={100}
              fill={COLORS.primary}
              cornerRadius={8}
              delay={60}
            />
          </div>

          {/* 지붕 (삼각형) */}
          <div
            style={{
              position: "absolute",
              bottom: 160,
              left: 90,
              transform: `translateY(${roofY}px)`,
            }}
          >
            <AnimatedTriangle
              size={120}
              direction="up"
              fill={COLORS.accent}
              delay={80}
            />
          </div>

          {/* 디테일: 창문 */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 105,
              opacity: detailsOpacity,
            }}
          >
            <AnimatedRect
              width={30}
              height={40}
              fill={COLORS.warning}
              cornerRadius={4}
              delay={120}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 165,
              opacity: detailsOpacity,
            }}
          >
            <AnimatedRect
              width={30}
              height={40}
              fill={COLORS.warning}
              cornerRadius={4}
              delay={130}
            />
          </div>

          {/* 디테일: 문 */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 130,
              opacity: detailsOpacity,
            }}
          >
            <AnimatedRect
              width={40}
              height={50}
              fill={COLORS.dark}
              cornerRadius={4}
              delay={140}
            />
          </div>
        </div>

        {/* MVP 라벨 */}
        <div
          style={{
            marginTop: 30,
            opacity: detailsOpacity,
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.accent,
            textAlign: "center",
          }}
        >
          완벽하지 않아도 됩니다
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
              background: COLORS.success,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.white,
            }}
          >
            3
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: COLORS.success,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            PROTOTYPE
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
            프로토타입
          </h2>
          <p
            style={{
              fontSize: 36,
              color: COLORS.light,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            가장 간단한 형태로
            <br />
            만들어보세요
          </p>
          <p
            style={{
              fontSize: 30,
              color: COLORS.accent,
              margin: 0,
              marginTop: 40,
              lineHeight: 1.6,
            }}
          >
            아이디어는 머릿속에 있을 때보다
            <br />
            눈에 보일 때 훨씬 빠르게 발전합니다
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Step3PrototypeScene;
