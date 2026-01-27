import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SPRING_CONFIGS, FONT_SIZES, SPACING, RADIUS } from "../constants";
import { AnimatedText, fadeInUp, popIn, combine, scaleIn } from "../../templates/animations";

export interface QuoteCardProps {
  /** Quote text */
  quote: string;
  /** Attribution (author, source) */
  attribution?: string;
  /** Icon or emoji */
  icon?: string;
  /** Background color */
  backgroundColor?: string;
  /** Quote text color */
  quoteColor?: string;
  /** Attribution text color */
  attributionColor?: string;
  /** Animation delay in frames */
  delay?: number;
  /** Font size for quote */
  fontSize?: keyof typeof FONT_SIZES | number;
  /** Show quote marks */
  showQuoteMarks?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  attribution,
  icon,
  backgroundColor = COLORS.white,
  quoteColor = COLORS.primary,
  attributionColor = COLORS.dark,
  delay = 0,
  fontSize = "xl",  // lg(46) → xl(56): 인용문은 더 크게!
  showQuoteMarks = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const resolvedFontSize = typeof fontSize === "number" ? fontSize : FONT_SIZES[fontSize];
  const displayQuote = showQuoteMarks ? `"${quote}"` : quote;

  return (
    <div
      style={{
        opacity: interpolate(cardProgress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(cardProgress, [0, 1], [0.95, 1])})`,
        backgroundColor,
        borderRadius: RADIUS.xl,  // lg → xl
        padding: SPACING.lg,  // md(40) → lg(60)
        textAlign: "center",
        ...style,
      }}
    >
      {/* Icon - 크게! */}
      {icon && (
        <div style={{ marginBottom: SPACING.md }}>  {/* sm → md */}
          <AnimatedText
            text={icon}
            animation={popIn()}
            stagger="none"
            delay={delay + 5}
            style={{ fontSize: FONT_SIZES["2xl"] }}  // xl(56) → 2xl(68)
          />
        </div>
      )}
      <p
        style={{
          fontSize: resolvedFontSize,
          color: quoteColor,
          fontFamily: FONT_FAMILY.title,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        <AnimatedText
          text={displayQuote}
          animation={combine([fadeInUp(15), scaleIn(0.95)])}
          stagger="character"
          staggerDuration={2}
          delay={delay + 10}
          style={{ fontWeight: 700 }}
        />
      </p>
      {attribution && (
        <p
          style={{
            fontSize: FONT_SIZES.md,  // sm(32) → md(38)
            color: attributionColor,
            fontFamily: FONT_FAMILY.body,
            marginTop: SPACING.md,  // sm → md
            opacity: 0.8,
          }}
        >
          <AnimatedText
            text={attribution}
            animation={fadeInUp(10)}
            stagger="word"
            staggerDuration={3}
            delay={delay + 40}
          />
        </p>
      )}
    </div>
  );
};

export default QuoteCard;
