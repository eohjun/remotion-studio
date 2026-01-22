import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  SceneTransition,
  ChecklistDisplay,
  QuoteCard,
  COLORS,
  FONT_FAMILY,
  GRADIENTS,
  SPACING,
  FONT_SIZES,
  SPRING_CONFIGS,
} from "../../components";
import { AnimatedText, fadeInUp, scaleIn, combine } from "../../templates/animations";
import { SCENES } from "../constants";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });

  const checkItems = [
    { text: "내가 부족해서가 아닐 수 있다", icon: "🔍" },
    { text: "시스템의 문제일 수 있다", icon: "🏛️" },
    { text: "소유보다 존재에 집중하기", icon: "🌱" },
    { text: "때로는 멈추고 숨 쉬어도 괜찮다", icon: "🧘" },
  ];

  return (
    <SceneTransition durationInFrames={SCENES.outro.duration}>
      <AbsoluteFill style={{ background: GRADIENTS.primary, padding: SPACING.xl }}>
        {/* Title */}
        <div
          style={{
            opacity: interpolate(titleProgress, [0, 1], [0, 1]),
            textAlign: "center",
            marginBottom: SPACING.md + 10,
          }}
        >
          <h2
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              margin: 0,
            }}
          >
            <span style={{ marginRight: 12 }}>✨</span>
            <AnimatedText
              text="균형 잡힌 시각"
              animation={combine([fadeInUp(20), scaleIn(0.9)])}
              stagger="word"
              staggerDuration={5}
              delay={10}
              style={{ fontWeight: 700 }}
            />
          </h2>
        </div>

        {/* Checklist */}
        <ChecklistDisplay
          items={checkItems}
          delay={25}
          itemStaggerDelay={15}
          fontSize="md"
          iconSize="lg"
          style={{ marginBottom: SPACING.md }}
        />

        {/* Final Message */}
        <QuoteCard
          quote="지금의 당신도 이미 충분합니다"
          icon="💜"
          delay={80}
          fontSize="lg"
          style={{ marginTop: "auto" }}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
