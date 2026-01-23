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
import { AnimatedText, fadeInUp, fadeInLeft, scaleIn, combine } from "../animations";
import type { BaseSceneProps } from "./types";

/**
 * Breaking news style - urgent announcements
 */
export type NewsStyle = "breaking" | "headline" | "update" | "alert";

/**
 * Props for NewsTemplate component
 */
export interface NewsTemplateProps extends BaseSceneProps {
  /** News style variant */
  newsStyle?: NewsStyle;
  /** Breaking banner text */
  banner?: string;
  /** Banner background color */
  bannerColor?: string;
  /** Main headline */
  headline: string;
  /** Sub headline or summary */
  subheadline?: string;
  /** Bullet points or key facts */
  keyPoints?: string[];
  /** Source attribution */
  source?: string;
  /** Timestamp or date */
  timestamp?: string;
  /** Location tag */
  location?: string;
  /** Show ticker at bottom */
  showTicker?: boolean;
  /** Ticker text */
  tickerText?: string;
  /** Background color */
  backgroundColor?: string;
}

/**
 * Get style configuration for news variant
 */
const getNewsStyleConfig = (style: NewsStyle) => {
  switch (style) {
    case "breaking":
      return {
        bannerBg: "#dc3545",
        bannerText: "BREAKING NEWS",
        urgency: "high",
      };
    case "headline":
      return {
        bannerBg: COLORS.primary,
        bannerText: "TOP STORY",
        urgency: "medium",
      };
    case "update":
      return {
        bannerBg: COLORS.accent,
        bannerText: "UPDATE",
        urgency: "low",
      };
    case "alert":
      return {
        bannerBg: COLORS.warning,
        bannerText: "ALERT",
        urgency: "high",
      };
    default:
      return {
        bannerBg: COLORS.primary,
        bannerText: "NEWS",
        urgency: "medium",
      };
  }
};

/**
 * NewsTemplate - Breaking news and headline style
 *
 * Designed for urgent announcements, news updates, and headline content.
 * Features animated banner, headline reveal, and optional ticker.
 *
 * @example
 * ```tsx
 * <NewsTemplate
 *   newsStyle="breaking"
 *   headline="Major Discovery Changes Everything"
 *   subheadline="Scientists announce groundbreaking research findings"
 *   keyPoints={["Point 1", "Point 2", "Point 3"]}
 *   source="Research Journal"
 *   timestamp="2024"
 *   durationInFrames={300}
 * />
 * ```
 */
export const NewsTemplate: React.FC<NewsTemplateProps> = ({
  newsStyle = "headline",
  banner,
  bannerColor,
  headline,
  subheadline,
  keyPoints,
  source,
  timestamp,
  location,
  showTicker = false,
  tickerText,
  backgroundColor = "#0a0a12",
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const styleConfig = getNewsStyleConfig(newsStyle);

  // Animation timings
  const bannerProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const headlineProgress = spring({
    frame: frame - 15,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const subheadlineProgress = spring({
    frame: frame - 30,
    fps,
    config: SPRING_CONFIGS.normal,
  });
  const pointsProgress = spring({
    frame: frame - 45,
    fps,
    config: SPRING_CONFIGS.normal,
  });

  // Ticker animation
  const tickerOffset = frame * 2;

  const sceneContent = (
    <AbsoluteFill
      style={{
        backgroundColor,
        ...style,
      }}
    >
      {/* Breaking Banner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: bannerColor || styleConfig.bannerBg,
          padding: "16px 0",
          transform: `translateY(${interpolate(bannerProgress, [0, 1], [-100, 0])}px)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Animated dots for urgency */}
          {styleConfig.urgency === "high" && (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS.white,
                opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0.3,
              }}
            />
          )}
          <span
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {banner || styleConfig.bannerText}
          </span>
          {styleConfig.urgency === "high" && (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS.white,
                opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0.3,
              }}
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: SPACING.xl,
          right: SPACING.xl,
          bottom: showTicker ? 80 : SPACING.xl,
        }}
      >
        {/* Location & Timestamp */}
        {(location || timestamp) && (
          <div
            style={{
              opacity: interpolate(headlineProgress, [0, 1], [0, 1]),
              marginBottom: SPACING.sm,
              display: "flex",
              gap: SPACING.md,
            }}
          >
            {location && (
              <span
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.accent,
                  fontFamily: FONT_FAMILY.body,
                  fontWeight: 600,
                }}
              >
                📍 {location}
              </span>
            )}
            {timestamp && (
              <span
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {timestamp}
              </span>
            )}
          </div>
        )}

        {/* Headline */}
        <div
          style={{
            opacity: interpolate(headlineProgress, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(headlineProgress, [0, 1], [-30, 0])}px)`,
            marginBottom: SPACING.md,
          }}
        >
          <h1
            style={{
              fontSize: FONT_SIZES["3xl"],
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            <AnimatedText
              text={headline}
              animation={combine([fadeInUp(20), scaleIn(0.98)])}
              stagger="word"
              staggerDuration={4}
              delay={15}
              style={{ fontWeight: 800 }}
            />
          </h1>
        </div>

        {/* Subheadline */}
        {subheadline && (
          <div
            style={{
              opacity: interpolate(subheadlineProgress, [0, 1], [0, 1]),
              marginBottom: SPACING.lg,
            }}
          >
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: "rgba(255,255,255,0.8)",
                fontFamily: FONT_FAMILY.body,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              <AnimatedText
                text={subheadline}
                animation={fadeInLeft(15)}
                stagger="word"
                staggerDuration={3}
                delay={30}
              />
            </p>
          </div>
        )}

        {/* Key Points */}
        {keyPoints && keyPoints.length > 0 && (
          <div
            style={{
              opacity: interpolate(pointsProgress, [0, 1], [0, 1]),
              backgroundColor: "rgba(255,255,255,0.05)",
              borderLeft: `6px solid ${styleConfig.bannerBg}`,
              padding: SPACING.lg,
              borderRadius: `0 ${RADIUS.lg}px ${RADIUS.lg}px 0`,
              maxWidth: 1200,
            }}
          >
            {keyPoints.map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  marginBottom: i < keyPoints.length - 1 ? 24 : 0,
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                }}
              >
                <span
                  style={{
                    color: styleConfig.bannerBg,
                    fontWeight: 700,
                    fontSize: FONT_SIZES.xl,
                  }}
                >
                  ▸
                </span>
                <AnimatedText
                  text={point}
                  animation={fadeInLeft(12)}
                  stagger="none"
                  delay={50 + i * 10}
                  style={{
                    fontSize: FONT_SIZES.xl,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                    lineHeight: 1.5,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Source Attribution */}
        {source && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              opacity: interpolate(pointsProgress, [0, 1], [0, 0.7]),
            }}
          >
            <span
              style={{
                fontSize: FONT_SIZES.xs,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT_FAMILY.body,
              }}
            >
              Source: {source}
            </span>
          </div>
        )}
      </div>

      {/* Ticker */}
      {showTicker && tickerText && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.primary,
            padding: "12px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              transform: `translateX(${-tickerOffset % 2000}px)`,
            }}
          >
            <span
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                fontWeight: 600,
              }}
            >
              {tickerText} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {tickerText}{" "}
              &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {tickerText}
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );

  if (useTransition) {
    return (
      <SceneTransition durationInFrames={durationInFrames}>
        {sceneContent}
      </SceneTransition>
    );
  }

  return sceneContent;
};

export default NewsTemplate;
