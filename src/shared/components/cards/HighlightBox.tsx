import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SPRING_CONFIGS, FONT_SIZES, SPACING, RADIUS } from "../constants";
import { AnimatedText, fadeInUp, popIn, combine, scaleIn } from "../../templates/animations";

export interface HighlightBoxProps {
  /** Main content text */
  content: string;
  /** Optional icon or emoji */
  icon?: string;
  /** Background color with transparency */
  backgroundColor?: string;
  /** Border color (optional) */
  borderColor?: string;
  /** Text color */
  textColor?: string;
  /** Animation delay in frames */
  delay?: number;
  /** Font size */
  fontSize?: keyof typeof FONT_SIZES | number;
  /** Show backdrop blur effect */
  useBackdropBlur?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({
  content,
  icon,
  backgroundColor = "rgba(255, 255, 255, 0.15)",
  borderColor,
  textColor = COLORS.white,
  delay = 0,
  fontSize = "lg",
  useBackdropBlur = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxProgress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const resolvedFontSize = typeof fontSize === "number" ? fontSize : FONT_SIZES[fontSize];

  return (
    <div
      style={{
        opacity: interpolate(boxProgress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(boxProgress, [0, 1], [0.95, 1])})`,
        backgroundColor,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        border: borderColor ? `3px solid ${borderColor}` : undefined,
        backdropFilter: useBackdropBlur ? "blur(10px)" : undefined,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: SPACING.sm }}>
        {icon && (
          <AnimatedText
            text={icon}
            animation={popIn()}
            stagger="none"
            delay={delay + 5}
            style={{ fontSize: FONT_SIZES.xl }}
          />
        )}
        <div
          style={{
            fontSize: resolvedFontSize,
            color: textColor,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          <AnimatedText
            text={content}
            animation={combine([fadeInUp(15), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={4}
            delay={delay + 10}
            style={{ fontWeight: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default HighlightBox;
