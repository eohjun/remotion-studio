import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENTS, FONT_SIZES, SPACING, SPRING_CONFIGS } from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp, fadeInDown, scaleIn, combine } from "../animations";
import type { BaseSceneProps } from "./types";

export interface IntroTemplateProps extends BaseSceneProps {
  /** Pre-title text (small text above title) */
  preTitle?: string;
  /** Main title text */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Background gradient key or custom CSS */
  background?: keyof typeof GRADIENTS | string;
  /** Title font size */
  titleSize?: keyof typeof FONT_SIZES | number;
  /** Subtitle font size */
  subtitleSize?: keyof typeof FONT_SIZES | number;
}

export const IntroTemplate: React.FC<IntroTemplateProps> = ({
  preTitle,
  title,
  subtitle,
  background = "primary",
  durationInFrames,
  titleSize = "4xl",  // 3xl(84) → 4xl(100): 인트로 제목은 더 크게!
  subtitleSize = "lg",  // md(38) → lg(46): 부제목도 크게!
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const preTitleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const titleProgress = spring({ frame: frame - 10, fps, config: SPRING_CONFIGS.snappy });
  const subtitleProgress = spring({ frame: frame - 30, fps, config: SPRING_CONFIGS.snappy });

  const backgroundValue =
    background in GRADIENTS
      ? GRADIENTS[background as keyof typeof GRADIENTS]
      : background;

  const resolvedTitleSize = typeof titleSize === "number" ? titleSize : FONT_SIZES[titleSize];
  const resolvedSubtitleSize = typeof subtitleSize === "number" ? subtitleSize : FONT_SIZES[subtitleSize];

  const content = (
    <AbsoluteFill
      style={{
        background: backgroundValue,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <div style={{ textAlign: "center", padding: SPACING.xl, maxWidth: 1400 }}>
        {/* Pre-title */}
        {preTitle && (
          <div
            style={{
              opacity: interpolate(preTitleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(preTitleProgress, [0, 1], [20, 0])}px)`,
              marginBottom: SPACING.sm,
            }}
          >
            <AnimatedText
              text={preTitle}
              animation={fadeInDown(20)}
              stagger="word"
              staggerDuration={4}
              delay={5}
              style={{
                fontSize: FONT_SIZES.xl,  // lg(46) → xl(56)
                color: "rgba(255,255,255,0.85)",
                fontFamily: FONT_FAMILY.body,
              }}
            />
          </div>
        )}

        {/* Main Title */}
        <div
          style={{
            opacity: interpolate(titleProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleProgress, [0, 1], [40, 0])}px)`,
          }}
        >
          <h1
            style={{
              fontSize: resolvedTitleSize,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              margin: 0,
              lineHeight: 1.2,
              wordBreak: "keep-all",
              overflowWrap: "normal",
            }}
          >
            <AnimatedText
              text={title}
              animation={combine([fadeInUp(30), scaleIn(0.9)])}
              stagger="character"
              staggerDuration={2}
              delay={15}
              style={{ fontWeight: 800 }}
            />
          </h1>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              opacity: interpolate(subtitleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
              marginTop: SPACING.md,
            }}
          >
            <AnimatedText
              text={subtitle}
              animation={fadeInUp(15)}
              stagger="word"
              staggerDuration={5}
              delay={50}
              style={{
                fontSize: resolvedSubtitleSize,
                color: "rgba(255,255,255,0.7)",
                fontFamily: FONT_FAMILY.body,
              }}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );

  if (useTransition) {
    return <SceneTransition durationInFrames={durationInFrames}>{content}</SceneTransition>;
  }

  return content;
};

export default IntroTemplate;
