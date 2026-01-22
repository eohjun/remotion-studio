import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, SPRING_CONFIGS, FONT_SIZES, SPACING, RADIUS } from "../constants";
import { AnimatedText, fadeInLeft, popIn } from "../../templates/animations";

export interface ChecklistItem {
  text: string;
  icon: string;
}

export interface ChecklistDisplayProps {
  /** List of items with icon and text */
  items: ChecklistItem[];
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Animation delay in frames */
  delay?: number;
  /** Stagger delay between items */
  itemStaggerDelay?: number;
  /** Font size for text */
  fontSize?: keyof typeof FONT_SIZES | number;
  /** Icon size */
  iconSize?: keyof typeof FONT_SIZES | number;
  /** Show background container */
  showBackground?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

export const ChecklistDisplay: React.FC<ChecklistDisplayProps> = ({
  items,
  backgroundColor = "rgba(255, 255, 255, 0.15)",
  textColor = COLORS.white,
  delay = 0,
  itemStaggerDelay = 15,
  fontSize = "md",
  iconSize = "lg",
  showBackground = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerProgress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  const resolvedFontSize = typeof fontSize === "number" ? fontSize : FONT_SIZES[fontSize];
  const resolvedIconSize = typeof iconSize === "number" ? iconSize : FONT_SIZES[iconSize];

  const containerStyle: React.CSSProperties = showBackground
    ? {
        backgroundColor,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
      }
    : {};

  return (
    <div
      style={{
        opacity: interpolate(containerProgress, [0, 1], [0, 1]),
        ...containerStyle,
        ...style,
      }}
    >
      {items.map((item, i) => {
        const itemDelay = delay + 10 + i * itemStaggerDelay;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.sm,
              marginBottom: i < items.length - 1 ? SPACING.sm + 4 : 0,
            }}
          >
            {/* Icon with pop animation */}
            <AnimatedText
              text={item.icon}
              animation={popIn()}
              stagger="none"
              delay={itemDelay}
              style={{ fontSize: resolvedIconSize }}
            />
            {/* Text with slide-in animation */}
            <AnimatedText
              text={item.text}
              animation={fadeInLeft(30)}
              stagger="word"
              staggerDuration={4}
              delay={itemDelay + 5}
              style={{
                fontSize: resolvedFontSize,
                color: textColor,
                fontFamily: FONT_FAMILY.body,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChecklistDisplay;
