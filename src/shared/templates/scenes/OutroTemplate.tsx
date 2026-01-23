import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENTS, FONT_SIZES, SPACING, RADIUS, SPRING_CONFIGS } from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp, fadeInLeft, popIn, scaleIn, combine } from "../animations";
import type { BaseSceneProps, IconItem } from "./types";

export interface OutroTemplateProps extends BaseSceneProps {
  /** Title with optional icon */
  title: string;
  /** Title icon */
  titleIcon?: string;
  /** Takeaway items */
  takeaways?: IconItem[];
  /** Final closing message */
  closingMessage: string;
  /** Closing message icon */
  closingIcon?: string;
  /** Background style */
  background?: keyof typeof GRADIENTS | string;
  /** Closing card background color */
  closingBackgroundColor?: string;
  /** Closing text color */
  closingTextColor?: string;
}

export const OutroTemplate: React.FC<OutroTemplateProps> = ({
  title,
  titleIcon,
  takeaways,
  closingMessage,
  closingIcon,
  background = "primary",
  closingBackgroundColor = COLORS.white,
  closingTextColor = COLORS.primary,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const listProgress = spring({ frame: frame - 25, fps, config: SPRING_CONFIGS.normal });
  const closingProgress = spring({ frame: frame - 80, fps, config: SPRING_CONFIGS.normal });

  const backgroundValue =
    background in GRADIENTS
      ? GRADIENTS[background as keyof typeof GRADIENTS]
      : background;

  const content = (
    <AbsoluteFill style={{ background: backgroundValue, padding: SPACING.xl, ...style }}>
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
          {titleIcon && <span style={{ marginRight: 12 }}>{titleIcon}</span>}
          <AnimatedText
            text={title}
            animation={combine([fadeInUp(20), scaleIn(0.9)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Takeaways List */}
      {takeaways && takeaways.length > 0 && (
        <div
          style={{
            opacity: interpolate(listProgress, [0, 1], [0, 1]),
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
          }}
        >
          {takeaways.map((item, i) => {
            const itemDelay = 35 + i * 15;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.md,
                  marginBottom: i < takeaways.length - 1 ? SPACING.md + 8 : 0,
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                }}
              >
                <AnimatedText
                  text={item.icon}
                  animation={popIn()}
                  stagger="none"
                  delay={itemDelay}
                  style={{ fontSize: FONT_SIZES["2xl"] }}
                />
                <AnimatedText
                  text={item.text}
                  animation={fadeInLeft(30)}
                  stagger="word"
                  staggerDuration={4}
                  delay={itemDelay + 5}
                  style={{
                    fontSize: FONT_SIZES.xl,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Closing Message */}
      <div
        style={{
          opacity: interpolate(closingProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(closingProgress, [0, 1], [0.95, 1])})`,
          backgroundColor: closingBackgroundColor,
          borderRadius: RADIUS.lg,
          padding: SPACING.lg,
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <p
          style={{
            fontSize: FONT_SIZES["2xl"],
            color: closingTextColor,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            margin: 0,
            wordBreak: "keep-all",
            overflowWrap: "normal",
          }}
        >
          {closingIcon && <span style={{ marginRight: 8 }}>{closingIcon}</span>}
          <AnimatedText
            text={closingMessage}
            animation={combine([fadeInUp(15), scaleIn(0.95)])}
            stagger="character"
            staggerDuration={2}
            delay={90}
            style={{ fontWeight: 700 }}
          />
        </p>
      </div>
    </AbsoluteFill>
  );

  if (useTransition) {
    return <SceneTransition durationInFrames={durationInFrames}>{content}</SceneTransition>;
  }

  return content;
};

export default OutroTemplate;
