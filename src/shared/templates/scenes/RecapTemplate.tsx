import React from "react";
import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SPACING,
  RADIUS,
  SPRING_CONFIGS,
} from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import type { BaseSceneProps } from "./types";

export interface RecapTemplateProps extends BaseSceneProps {
  /** Recap title (default: "Quick Recap") */
  title?: string;
  /** Recap points to display */
  points: string[];
  /** Optional icon for each point (default: checkmark) */
  pointIcon?: string;
  /** Background color */
  backgroundColor?: string;
  /** Accent color for icons and highlights */
  accentColor?: string;
  /** Show numbered list instead of icons */
  numbered?: boolean;
  /** Part indicator (e.g., "Part 1 of 3") */
  partIndicator?: string;
}

/**
 * RecapTemplate - Summary/recap scene for cognitive scaffolding
 *
 * Displays key points from previous scenes to reinforce learning.
 *
 * @example
 * ```tsx
 * <RecapTemplate
 *   durationInFrames={180}
 *   title="Quick Recap"
 *   points={[
 *     "First key insight",
 *     "Second important point",
 *     "Third takeaway"
 *   ]}
 * />
 * ```
 */
export const RecapTemplate: React.FC<RecapTemplateProps> = ({
  title = "Quick Recap",
  points,
  pointIcon = "✓",
  backgroundColor = COLORS.darkAlt,
  accentColor = COLORS.primary,
  numbered = false,
  partIndicator,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const getPointProgress = (index: number) =>
    spring({
      frame: frame - 15 - index * 12,
      fps,
      config: SPRING_CONFIGS.normal,
    });

  const partProgress = spring({
    frame: frame - 5,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const content = (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
        ...style,
      }}
    >
      {/* Content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: SPACING.lg,
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {/* Part indicator */}
        {partIndicator && (
          <div
            style={{
              opacity: interpolate(partProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(partProgress, [0, 1], [-10, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: FONT_SIZES.sm,
                color: accentColor,
                fontFamily: FONT_FAMILY.body,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {partIndicator}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            opacity: interpolate(titleProgress, [0, 1], [0, 1]),
            transform: `scale(${interpolate(titleProgress, [0, 1], [0.9, 1])})`,
          }}
        >
          <h2
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              margin: 0,
              textAlign: "center",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Recap points */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: SPACING.sm,
            width: "100%",
            maxWidth: 900,
          }}
        >
          {points.map((point, i) => {
            const progress = getPointProgress(i);
            const isVisible = progress > 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.sm,
                  opacity: interpolate(progress, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`,
                }}
              >
                {/* Icon/Number */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: numbered ? RADIUS.md : "50%",
                    backgroundColor: `${accentColor}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: `2px solid ${accentColor}`,
                    transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
                  }}
                >
                  <span
                    style={{
                      fontSize: numbered ? FONT_SIZES.md : FONT_SIZES.lg,
                      color: accentColor,
                      fontWeight: 700,
                      fontFamily: FONT_FAMILY.body,
                    }}
                  >
                    {numbered ? i + 1 : pointIcon}
                  </span>
                </div>

                {/* Point text */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    padding: `${SPACING.sm}px ${SPACING.md}px`,
                    borderRadius: RADIUS.md,
                    borderLeft: `4px solid ${accentColor}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: FONT_SIZES.md,
                      color: COLORS.white,
                      fontFamily: FONT_FAMILY.body,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {point}
                  </p>
                </div>

                {/* Checkmark animation on complete */}
                {isVisible && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: `${COLORS.success}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: interpolate(progress, [0.8, 1], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                      transform: `scale(${interpolate(progress, [0.8, 1], [0.5, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })})`,
                    }}
                  >
                    <span style={{ color: COLORS.success, fontSize: 18 }}>✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Decorative element */}
        <div
          style={{
            width: 100,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            marginTop: SPACING.md,
            opacity: interpolate(
              spring({
                frame: frame - 15 - points.length * 12,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 0.6]
            ),
          }}
        />
      </div>
    </AbsoluteFill>
  );

  if (useTransition) {
    return (
      <SceneTransition durationInFrames={durationInFrames}>
        {content}
      </SceneTransition>
    );
  }

  return content;
};

export default RecapTemplate;
