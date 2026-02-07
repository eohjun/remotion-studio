/**
 * Step 2: Clarify Scene - SelfDrawingPath로 마인드맵
 *
 * Features tested: SelfDrawingPath (mind map effect)
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SelfDrawingPath } from "../../../shared/components/paths";
import { AnimatedGradient } from "../../../shared/components/backgrounds";
import { COLORS } from "../../../shared/components/constants";

// 마인드맵 구조
const MINDMAP_CENTER = "M 300 200 m -40, 0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0";
const MINDMAP_BRANCHES = [
  // 상단 가지
  { path: "M 300 160 L 300 100 L 250 70", delay: 40 },
  { path: "M 300 160 L 300 100 L 350 70", delay: 50 },
  // 우측 가지
  { path: "M 340 200 L 400 200 L 430 170", delay: 60 },
  { path: "M 340 200 L 400 200 L 430 230", delay: 70 },
  // 하단 가지
  { path: "M 300 240 L 300 300 L 250 330", delay: 80 },
  { path: "M 300 240 L 300 300 L 350 330", delay: 90 },
  // 좌측 가지
  { path: "M 260 200 L 200 200 L 170 170", delay: 100 },
  { path: "M 260 200 L 200 200 L 170 230", delay: 110 },
];

// 질문 텍스트들
const QUESTIONS = [
  { text: "왜?", x: 230, y: 55, delay: 60 },
  { text: "누구를 위해?", x: 350, y: 55, delay: 70 },
  { text: "어떻게?", x: 440, y: 155, delay: 80 },
  { text: "언제?", x: 440, y: 240, delay: 90 },
  { text: "무엇을?", x: 350, y: 340, delay: 100 },
  { text: "문제는?", x: 200, y: 340, delay: 110 },
];

export const Step2ClarifyScene: React.FC = () => {
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

  return (
    <AbsoluteFill>
      <AnimatedGradient
        colors={["#1a2a3a", "#162447", "#1f4068"]}
        animationMode="shift"
      />

      {/* 좌측: 마인드맵 */}
      <AbsoluteFill
        style={{
          width: "55%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: 600, height: 400 }}>
          {/* 중앙 원 */}
          <SelfDrawingPath
            path={MINDMAP_CENTER}
            stroke={COLORS.accent}
            strokeWidth={4}
            width={600}
            height={400}
            drawDuration={40}
            delay={20}
          />

          {/* 가지들 */}
          {MINDMAP_BRANCHES.map((branch, i) => (
            <div key={i} style={{ position: "absolute", top: 0, left: 0 }}>
              <SelfDrawingPath
                path={branch.path}
                stroke={COLORS.primary}
                strokeWidth={2}
                width={600}
                height={400}
                drawDuration={30}
                delay={branch.delay}
              />
            </div>
          ))}

          {/* 질문 텍스트들 */}
          {QUESTIONS.map((q, i) => {
            const qOpacity = interpolate(
              frame,
              [q.delay + 20, q.delay + 40],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: q.x,
                  top: q.y,
                  opacity: qOpacity,
                  fontSize: 18,
                  fontWeight: 600,
                  color: COLORS.light,
                  background: `${COLORS.dark}cc`,
                  padding: "6px 12px",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {q.text}
              </div>
            );
          })}

          {/* 중앙 라벨 */}
          <div
            style={{
              position: "absolute",
              left: 300,
              top: 200,
              transform: "translate(-50%, -50%)",
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.accent,
            }}
          >
            아이디어
          </div>
        </div>
      </AbsoluteFill>

      {/* 우측: 텍스트 */}
      <AbsoluteFill
        style={{
          left: "55%",
          width: "45%",
          justifyContent: "center",
          padding: "0 60px",
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
              background: COLORS.primary,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.white,
            }}
          >
            2
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: COLORS.primary,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            CLARIFY
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
            명확화하기
          </h2>
          <p
            style={{
              fontSize: 36,
              color: COLORS.light,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            포착한 아이디어를
            <br />
            질문으로 구체화하세요
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Step2ClarifyScene;
