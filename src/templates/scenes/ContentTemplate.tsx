import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING, RADIUS, SPRING_CONFIGS } from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp, fadeInLeft, popIn, scaleIn, combine } from "../animations";
import type { BaseSceneProps, IconItem } from "./types";

export interface ContentTemplateProps extends BaseSceneProps {
  /** Section label (small text above title) */
  sectionLabel?: string;
  /** Section label color */
  sectionLabelColor?: string;
  /** Main title with optional icon */
  title: string;
  /** Title icon */
  titleIcon?: string;
  /** Main content paragraphs */
  content?: string[];
  /** List items with icons */
  items?: IconItem[];
  /** Background color */
  backgroundColor?: string;
  /** Highlight box content */
  highlightContent?: string;
  /** Highlight icon */
  highlightIcon?: string;
}

export const ContentTemplate: React.FC<ContentTemplateProps> = ({
  sectionLabel,
  sectionLabelColor = COLORS.accent,
  title,
  titleIcon,
  content,
  items,
  backgroundColor = COLORS.dark,
  highlightContent,
  highlightIcon,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const contentProgress = spring({ frame: frame - 25, fps, config: SPRING_CONFIGS.normal });
  const highlightProgress = spring({ frame: frame - 60, fps, config: SPRING_CONFIGS.normal });

  const sceneContent = (
    <AbsoluteFill style={{ backgroundColor, padding: SPACING.xl, ...style }}>
      {/* Header */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          marginBottom: SPACING.md,
        }}
      >
        {sectionLabel && (
          <AnimatedText
            text={sectionLabel}
            animation={fadeInUp(15)}
            stagger="none"
            delay={0}
            style={{
              fontSize: FONT_SIZES.sm,
              color: sectionLabelColor,
              fontFamily: FONT_FAMILY.body,
            }}
          />
        )}
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: "10px 0",
          }}
        >
          {titleIcon && <span style={{ marginRight: 12 }}>{titleIcon}</span>}
          <AnimatedText
            text={title}
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Content Area */}
      <div
        style={{
          opacity: interpolate(contentProgress, [0, 1], [0, 1]),
          flex: 1,
        }}
      >
        {/* Paragraphs */}
        {content && content.length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              marginBottom: SPACING.md,
            }}
          >
            {content.map((paragraph, i) => (
              <div
                key={i}
                style={{
                  fontSize: FONT_SIZES.md,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                  lineHeight: 1.7,
                  marginBottom: i < content.length - 1 ? SPACING.sm : 0,
                }}
              >
                <AnimatedText
                  text={paragraph}
                  animation={fadeInLeft(15)}
                  stagger="word"
                  staggerDuration={3}
                  delay={35 + i * 15}
                />
              </div>
            ))}
          </div>
        )}

        {/* Icon Items */}
        {items && items.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: SPACING.sm }}>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: item.color
                    ? `${item.color}30`
                    : "rgba(0, 194, 255, 0.3)",
                  padding: "12px 24px",
                  borderRadius: 30,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AnimatedText
                  text={item.icon}
                  animation={popIn()}
                  stagger="none"
                  delay={50 + i * 8}
                  style={{ fontSize: FONT_SIZES.sm }}
                />
                <AnimatedText
                  text={item.text}
                  animation={fadeInLeft(10)}
                  stagger="none"
                  delay={55 + i * 8}
                  style={{
                    fontSize: FONT_SIZES.sm - 2,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                    fontWeight: 600,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Highlight Box */}
      {highlightContent && (
        <div
          style={{
            opacity: interpolate(highlightProgress, [0, 1], [0, 1]),
            transform: `scale(${interpolate(highlightProgress, [0, 1], [0.95, 1])})`,
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.md,
            padding: SPACING.md - 10,
            textAlign: "center",
            marginTop: SPACING.md,
          }}
        >
          <p
            style={{
              fontSize: FONT_SIZES.md,
              color: COLORS.primary,
              fontFamily: FONT_FAMILY.title,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {highlightIcon && <span style={{ marginRight: 8 }}>{highlightIcon}</span>}
            <AnimatedText
              text={highlightContent}
              animation={combine([fadeInUp(15), scaleIn(0.95)])}
              stagger="word"
              staggerDuration={4}
              delay={70}
              style={{ fontWeight: 700 }}
            />
          </p>
        </div>
      )}
    </AbsoluteFill>
  );

  if (useTransition) {
    return <SceneTransition durationInFrames={durationInFrames}>{sceneContent}</SceneTransition>;
  }

  return sceneContent;
};

export default ContentTemplate;
