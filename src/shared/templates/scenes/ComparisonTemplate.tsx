import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING, RADIUS, SPRING_CONFIGS, cardBackground } from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp, fadeInLeft, fadeInRight, popIn, combine } from "../animations";
import type { BaseSceneProps, CardData } from "./types";

export interface ComparisonTemplateProps extends BaseSceneProps {
  /** Section label */
  sectionLabel?: string;
  /** Section label color */
  sectionLabelColor?: string;
  /** Main heading */
  heading: string;
  /** Left card data */
  leftCard: CardData;
  /** Right card data */
  rightCard: CardData;
  /** Separator text between cards */
  separator?: string;
  /** Background color */
  backgroundColor?: string;
}

export const ComparisonTemplate: React.FC<ComparisonTemplateProps> = ({
  sectionLabel,
  sectionLabelColor = COLORS.accent,
  heading,
  leftCard,
  rightCard,
  separator = "VS",
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const leftProgress = spring({ frame: frame - 30, fps, config: SPRING_CONFIGS.normal });
  const rightProgress = spring({ frame: frame - 50, fps, config: SPRING_CONFIGS.normal });

  const renderCard = (
    card: CardData,
    side: "left" | "right",
    progress: number,
    baseDelay: number
  ) => {
    const isLeft = side === "left";
    const direction = isLeft ? -50 : 50;
    const animation = isLeft ? fadeInLeft(20) : fadeInRight(20);
    const itemAnimation = isLeft ? fadeInLeft(15) : fadeInRight(15);

    return (
      <div
        style={{
          opacity: interpolate(progress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(progress, [0, 1], [direction, 0])}px)`,
          flex: 1,
          maxWidth: 700,
          backgroundColor: card.backgroundColor || cardBackground(card.color),
          borderRadius: RADIUS.xl,
          padding: SPACING.lg,
          border: `3px solid ${card.color}`,
        }}
      >
        {card.icon && (
          <AnimatedText
            text={card.icon}
            animation={popIn()}
            stagger="none"
            delay={baseDelay}
            style={{ fontSize: FONT_SIZES.xl, display: "block", marginBottom: 16 }}
          />
        )}
        <h3
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: card.color,
            fontFamily: FONT_FAMILY.title,
            marginBottom: SPACING.sm,
          }}
        >
          <AnimatedText
            text={card.title}
            animation={animation}
            stagger="word"
            staggerDuration={4}
            delay={baseDelay + 5}
            style={{ fontWeight: 700 }}
          />
        </h3>
        <ul
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.body,
            lineHeight: 1.8,
            paddingLeft: 24,
            listStyle: "none",
            margin: 0,
          }}
        >
          {card.items.map((item, i) => (
            <li
              key={i}
              style={{
                color: item.highlight && item.color ? item.color : COLORS.white,
                fontWeight: item.fontWeight || (item.highlight ? 600 : 400),
                marginBottom: i < card.items.length - 1 ? 8 : 0,
              }}
            >
              <AnimatedText
                text={item.text}
                animation={itemAnimation}
                stagger="word"
                staggerDuration={3}
                delay={baseDelay + 15 + i * 12}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const content = (
    <AbsoluteFill style={{ backgroundColor, padding: SPACING.lg, ...style }}>
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.md + 10,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
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
          <AnimatedText
            text={heading}
            animation={combine([fadeInUp(20), popIn()])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Cards Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: SPACING.lg,
          flex: 1,
          alignItems: "center",
        }}
      >
        {renderCard(leftCard, "left", leftProgress, 35)}

        <div style={{ fontSize: FONT_SIZES.xl, fontWeight: 800, color: COLORS.white }}>
          <AnimatedText
            text={separator}
            animation={popIn()}
            stagger="none"
            delay={55}
            style={{ fontWeight: 800 }}
          />
        </div>

        {renderCard(rightCard, "right", rightProgress, 55)}
      </div>
    </AbsoluteFill>
  );

  if (useTransition) {
    return <SceneTransition durationInFrames={durationInFrames}>{content}</SceneTransition>;
  }

  return content;
};

export default ComparisonTemplate;
