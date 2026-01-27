import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SPRING_CONFIGS, FONT_SIZES, SPACING, RADIUS, cardBackground } from "../constants";
import { SceneTransition } from "../SceneTransition";
import {
  AnimatedText,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  popIn,
  combine,
} from "../../templates/animations";

export interface ComparisonItem {
  text: string;
  highlight?: boolean;
  color?: string;
}

export interface ComparisonCardData {
  icon: string;
  title: string;
  items: ComparisonItem[];
  color: string;
}

export interface ComparisonLayoutProps {
  /** Section title (e.g., author name) */
  sectionTitle?: string;
  /** Main heading */
  heading: string;
  /** Left card data */
  leftCard: ComparisonCardData;
  /** Right card data */
  rightCard: ComparisonCardData;
  /** Background color */
  backgroundColor?: string;
  /** Scene duration in frames */
  durationInFrames: number;
  /** VS separator text */
  separator?: string;
  /** Use SceneTransition wrapper */
  useTransition?: boolean;
}

export const ComparisonLayout: React.FC<ComparisonLayoutProps> = ({
  sectionTitle,
  heading,
  leftCard,
  rightCard,
  backgroundColor = COLORS.dark,
  durationInFrames,
  separator = "VS",
  useTransition = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const leftCardProgress = spring({ frame: frame - 30, fps, config: SPRING_CONFIGS.normal });
  const rightCardProgress = spring({ frame: frame - 50, fps, config: SPRING_CONFIGS.normal });

  const renderCard = (
    card: ComparisonCardData,
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
          maxWidth: 750,  // 700 → 750
          backgroundColor: cardBackground(card.color),
          borderRadius: RADIUS.xl,
          padding: SPACING.lg,  // md(40) → lg(60)
          border: `3px solid ${card.color}`,
        }}
      >
        {/* Icon - 크게! */}
        <AnimatedText
          text={card.icon}
          animation={popIn()}
          stagger="none"
          delay={baseDelay}
          style={{ fontSize: 80, display: "block", marginBottom: 24 }}  // 56 → 80
        />
        <h3
          style={{
            fontSize: FONT_SIZES["2xl"],  // lg(46) → 2xl(68)
            fontWeight: 700,
            color: card.color,
            fontFamily: FONT_FAMILY.title,
            marginBottom: SPACING.md,  // sm → md
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
            fontSize: FONT_SIZES.lg,  // sm+2(34) → lg(46)
            color: COLORS.white,
            fontFamily: FONT_FAMILY.body,
            lineHeight: 1.7,
            paddingLeft: 32,  // 24 → 32
            listStyle: "none",
            margin: 0,
          }}
        >
          {card.items.map((item, i) => (
            <li
              key={i}
              style={{
                color: item.highlight && item.color ? item.color : COLORS.white,
                marginBottom: i < card.items.length - 1 ? 20 : 0,  // 8 → 20
                fontWeight: item.highlight ? 600 : 500,
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
    <AbsoluteFill style={{ backgroundColor, padding: SPACING.lg }}>
      {/* Section Title & Heading */}
      <div
        style={{
          textAlign: "center",
          marginBottom: SPACING.md + 10,
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
        }}
      >
        {sectionTitle && (
          <AnimatedText
            text={sectionTitle}
            animation={fadeInUp(15)}
            stagger="none"
            delay={0}
            style={{
              fontSize: FONT_SIZES.lg,  // sm(32) → lg(46)
              color: COLORS.accent,
              fontFamily: FONT_FAMILY.body,
            }}
          />
        )}
        <h2
          style={{
            fontSize: FONT_SIZES["3xl"],  // 2xl(68) → 3xl(84)
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: "16px 0",  // 10px → 16px
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

      {/* Cards Container - 간격 확대! */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: SPACING.xl,  // lg(60) → xl(80)
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* Left Card */}
        {renderCard(leftCard, "left", leftCardProgress, 35)}

        {/* Separator - 크게! */}
        <div style={{ fontSize: FONT_SIZES["2xl"], fontWeight: 800, color: COLORS.white }}>  {/* xl(56) → 2xl(68) */}
          <AnimatedText
            text={separator}
            animation={popIn()}
            stagger="none"
            delay={55}
            style={{ fontWeight: 800 }}
          />
        </div>

        {/* Right Card */}
        {renderCard(rightCard, "right", rightCardProgress, 55)}
      </div>
    </AbsoluteFill>
  );

  if (useTransition) {
    return <SceneTransition durationInFrames={durationInFrames}>{content}</SceneTransition>;
  }

  return content;
};

export default ComparisonLayout;
