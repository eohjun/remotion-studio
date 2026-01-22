import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, GRADIENTS, SPRING_CONFIGS, FONT_SIZES, SPACING } from "../constants";
import { SceneTransition } from "../SceneTransition";
import { AnimatedText, fadeInUp, fadeInDown, scaleIn, combine } from "../../templates/animations";

export interface TitleCardProps {
  /** Main title text */
  title: string;
  /** Subtitle or tagline text */
  subtitle?: string;
  /** Emoji or icon displayed above the subtitle */
  preSubtitleIcon?: string;
  /** Background style - gradient name or CSS value */
  background?: keyof typeof GRADIENTS | string;
  /** Duration of the scene in frames (required for SceneTransition) */
  durationInFrames: number;
  /** Optional closing message at the bottom */
  closingMessage?: string;
  /** Optional closing icon */
  closingIcon?: string;
  /** Title font size */
  titleSize?: keyof typeof FONT_SIZES | number;
  /** Subtitle font size */
  subtitleSize?: keyof typeof FONT_SIZES | number;
  /** Animation delay offset */
  animationDelay?: number;
  /** Use SceneTransition wrapper (default: true) */
  useTransition?: boolean;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  preSubtitleIcon,
  background = "primary",
  durationInFrames,
  closingMessage,
  closingIcon,
  titleSize = "3xl",
  subtitleSize = "md",
  animationDelay = 0,
  useTransition = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - animationDelay,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const subtitleProgress = spring({
    frame: frame - animationDelay - 20,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const closingProgress = spring({
    frame: frame - animationDelay - 60,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  // Resolve background
  const backgroundValue =
    background in GRADIENTS
      ? GRADIENTS[background as keyof typeof GRADIENTS]
      : background;

  // Resolve font sizes
  const resolvedTitleSize =
    typeof titleSize === "number" ? titleSize : FONT_SIZES[titleSize];
  const resolvedSubtitleSize =
    typeof subtitleSize === "number" ? subtitleSize : FONT_SIZES[subtitleSize];

  const content = (
    <AbsoluteFill
      style={{
        background: backgroundValue,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", padding: SPACING.xl }}>
        {/* Pre-subtitle with icon */}
        {preSubtitleIcon && (
          <div
            style={{
              opacity: interpolate(titleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(titleProgress, [0, 1], [40, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: FONT_SIZES.lg,
                color: "rgba(255,255,255,0.8)",
                marginBottom: SPACING.sm,
                fontFamily: FONT_FAMILY.body,
              }}
            >
              <AnimatedText
                text={preSubtitleIcon}
                animation={fadeInDown(20)}
                stagger="word"
                staggerDuration={4}
                delay={animationDelay + 5}
              />
            </div>
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
            }}
          >
            <AnimatedText
              text={title}
              animation={combine([fadeInUp(30), scaleIn(0.9)])}
              stagger="character"
              staggerDuration={2}
              delay={animationDelay + 25}
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
            <div
              style={{
                fontSize: resolvedSubtitleSize,
                color: "rgba(255,255,255,0.7)",
                fontFamily: FONT_FAMILY.body,
              }}
            >
              <AnimatedText
                text={subtitle}
                animation={fadeInUp(15)}
                stagger="word"
                staggerDuration={5}
                delay={animationDelay + 60}
              />
            </div>
          </div>
        )}

        {/* Closing message */}
        {closingMessage && (
          <div
            style={{
              opacity: interpolate(closingProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(closingProgress, [0, 1], [0.95, 1])})`,
              marginTop: SPACING.lg,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              padding: SPACING.md,
            }}
          >
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.primary,
                fontFamily: FONT_FAMILY.title,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {closingIcon && <span style={{ marginRight: 8 }}>{closingIcon}</span>}
              <AnimatedText
                text={closingMessage}
                animation={combine([fadeInUp(15), scaleIn(0.95)])}
                stagger="character"
                staggerDuration={2}
                delay={animationDelay + 70}
                style={{ fontWeight: 700 }}
              />
            </p>
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

export default TitleCard;
