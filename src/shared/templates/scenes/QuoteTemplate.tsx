import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENTS, FONT_SIZES, SPACING, RADIUS, SPRING_CONFIGS } from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp, popIn, scaleIn, combine } from "../animations";
import type { BaseSceneProps } from "./types";

export interface QuoteTemplateProps extends BaseSceneProps {
  /** Main quote text */
  quote: string;
  /** Attribution (author/source) */
  attribution?: string;
  /** Icon displayed above quote */
  icon?: string;
  /** Background style */
  background?: keyof typeof GRADIENTS | string;
  /** Quote text color */
  quoteColor?: string;
  /** Attribution text color */
  attributionColor?: string;
  /** Show decorative quote marks */
  showQuoteMarks?: boolean;
  /** Additional context text below quote */
  context?: string;
}

export const QuoteTemplate: React.FC<QuoteTemplateProps> = ({
  quote,
  attribution,
  icon,
  background = "primary",
  quoteColor = COLORS.white,
  attributionColor = "rgba(255,255,255,0.7)",
  showQuoteMarks = false,
  context,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconProgress = spring({ frame, fps, config: SPRING_CONFIGS.bouncy });
  const quoteProgress = spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.snappy });
  const attributionProgress = spring({ frame: frame - 40, fps, config: SPRING_CONFIGS.normal });
  const contextProgress = spring({ frame: frame - 60, fps, config: SPRING_CONFIGS.normal });

  const backgroundValue =
    background in GRADIENTS
      ? GRADIENTS[background as keyof typeof GRADIENTS]
      : background;

  const displayQuote = showQuoteMarks ? `"${quote}"` : quote;

  const content = (
    <AbsoluteFill
      style={{
        background: backgroundValue,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
        ...style,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 1400 }}>  {/* 1200 → 1400 */}
        {/* Icon - 크게! */}
        {icon && (
          <div
            style={{
              opacity: interpolate(iconProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(iconProgress, [0, 1], [0.5, 1])})`,
              marginBottom: SPACING.lg,  // md → lg
            }}
          >
            <AnimatedText
              text={icon}
              animation={popIn()}
              stagger="none"
              delay={0}
              style={{ fontSize: 120 }}  // 4xl(100) → 120
            />
          </div>
        )}

        {/* Quote - 크게! */}
        <div
          style={{
            opacity: interpolate(quoteProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(quoteProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <blockquote
            style={{
              fontSize: FONT_SIZES["3xl"],  // 2xl(68) → 3xl(84)
              fontWeight: 700,
              color: quoteColor,
              fontFamily: FONT_FAMILY.title,
              margin: 0,
              lineHeight: 1.5,  // 1.4 → 1.5
              fontStyle: showQuoteMarks ? "italic" : "normal",
              wordBreak: "keep-all",
              overflowWrap: "normal",
            }}
          >
            <AnimatedText
              text={displayQuote}
              animation={combine([fadeInUp(20), scaleIn(0.95)])}
              stagger="word"
              staggerDuration={4}
              delay={20}
              style={{ fontWeight: 700 }}
            />
          </blockquote>
        </div>

        {/* Attribution - 크게! */}
        {attribution && (
          <div
            style={{
              opacity: interpolate(attributionProgress, [0, 1], [0, 1]),
              marginTop: SPACING.xl,  // lg → xl
            }}
          >
            <AnimatedText
              text={`— ${attribution}`}
              animation={fadeInUp(15)}
              stagger="word"
              staggerDuration={3}
              delay={50}
              style={{
                fontSize: FONT_SIZES["2xl"],  // xl(56) → 2xl(68)
                color: attributionColor,
                fontFamily: FONT_FAMILY.body,
              }}
            />
          </div>
        )}

        {/* Context - 크게! */}
        {context && (
          <div
            style={{
              opacity: interpolate(contextProgress, [0, 1], [0, 1]),
              marginTop: SPACING.xl,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: RADIUS.lg,  // md → lg
              padding: SPACING.xl,  // lg → xl
              wordBreak: "keep-all",
              overflowWrap: "normal",
            }}
          >
            <AnimatedText
              text={context}
              animation={fadeInUp(10)}
              stagger="word"
              staggerDuration={3}
              delay={70}
              style={{
                fontSize: FONT_SIZES.xl,  // lg(46) → xl(56)
                color: COLORS.white,
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

export default QuoteTemplate;
