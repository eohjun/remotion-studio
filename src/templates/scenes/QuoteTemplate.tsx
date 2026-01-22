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
      <div style={{ textAlign: "center", maxWidth: 1200 }}>
        {/* Icon */}
        {icon && (
          <div
            style={{
              opacity: interpolate(iconProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(iconProgress, [0, 1], [0.5, 1])})`,
              marginBottom: SPACING.md,
            }}
          >
            <AnimatedText
              text={icon}
              animation={popIn()}
              stagger="none"
              delay={0}
              style={{ fontSize: FONT_SIZES["4xl"] }}
            />
          </div>
        )}

        {/* Quote */}
        <div
          style={{
            opacity: interpolate(quoteProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(quoteProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <blockquote
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 700,
              color: quoteColor,
              fontFamily: FONT_FAMILY.title,
              margin: 0,
              lineHeight: 1.4,
              fontStyle: showQuoteMarks ? "italic" : "normal",
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

        {/* Attribution */}
        {attribution && (
          <div
            style={{
              opacity: interpolate(attributionProgress, [0, 1], [0, 1]),
              marginTop: SPACING.md,
            }}
          >
            <AnimatedText
              text={`— ${attribution}`}
              animation={fadeInUp(15)}
              stagger="word"
              staggerDuration={3}
              delay={50}
              style={{
                fontSize: FONT_SIZES.md,
                color: attributionColor,
                fontFamily: FONT_FAMILY.body,
              }}
            />
          </div>
        )}

        {/* Context */}
        {context && (
          <div
            style={{
              opacity: interpolate(contextProgress, [0, 1], [0, 1]),
              marginTop: SPACING.lg,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: RADIUS.md,
              padding: SPACING.md,
            }}
          >
            <AnimatedText
              text={context}
              animation={fadeInUp(10)}
              stagger="word"
              staggerDuration={3}
              delay={70}
              style={{
                fontSize: FONT_SIZES.sm + 2,
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
