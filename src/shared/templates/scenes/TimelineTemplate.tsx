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
  SPRING_CONFIGS,
} from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp, scaleIn, combine } from "../animations";
import { calculateStrokeDraw } from "../animations/svg";
import type { BaseSceneProps, TimelineEvent } from "./types";

export interface TimelineTemplateProps extends BaseSceneProps {
  /** Optional title */
  title?: string;
  /** Timeline events */
  events: TimelineEvent[];
  /** Layout direction */
  layout: "horizontal" | "vertical";
  /** Show connector line (default: true) */
  showConnector?: boolean;
  /** Connector line color */
  connectorColor?: string;
  /** Reveal mode */
  revealMode?: "sequential" | "all";
  /** Stagger delay for sequential mode (default: 15) */
  staggerDelay?: number;
  /** Background color */
  backgroundColor?: string;
}

// Sub-component: Horizontal Timeline
const HorizontalTimeline: React.FC<{
  events: TimelineEvent[];
  showConnector: boolean;
  connectorColor: string;
  revealMode: "sequential" | "all";
  staggerDelay: number;
  frame: number;
  fps: number;
}> = ({
  events,
  showConnector,
  connectorColor,
  revealMode,
  staggerDelay,
  frame,
  fps,
}) => {
  // Increased sizes for better visibility on 1920x1080
  const totalWidth = 1700;
  const eventSpacing = totalWidth / (events.length + 1);
  const lineY = 280;
  const lineLength = totalWidth - 150;

  // Line draw animation
  const lineProgress = spring({
    frame: frame - 20,
    fps,
    config: { ...SPRING_CONFIGS.normal, damping: 120 },
  });
  const lineStroke = calculateStrokeDraw({
    pathLength: lineLength,
    progress: lineProgress,
  });

  return (
    <div style={{ position: "relative", width: totalWidth, height: 550 }}>
      {/* Connector Line */}
      {showConnector && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: totalWidth,
            height: 600,
          }}
        >
          <line
            x1={75}
            y1={lineY}
            x2={totalWidth - 75}
            y2={lineY}
            stroke={connectorColor}
            strokeWidth={5}
            strokeLinecap="round"
            style={{
              strokeDasharray: lineStroke.strokeDasharray,
              strokeDashoffset: lineStroke.strokeDashoffset,
            }}
          />
        </svg>
      )}

      {/* Events */}
      {events.map((event, i) => {
        const eventDelay = revealMode === "sequential" ? 50 + i * staggerDelay : 50;
        const eventProgress = spring({
          frame: frame - eventDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const x = eventSpacing * (i + 1);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 120,
              top: 0,
              width: 240,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: interpolate(eventProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(
                eventProgress,
                [0, 1],
                [20, 0]
              )}px)`,
            }}
          >
            {/* Date */}
            <div
              style={{
                fontSize: FONT_SIZES.xl,
                fontWeight: 700,
                color: event.color || COLORS.accent,
                fontFamily: FONT_FAMILY.body,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              {event.date}
            </div>

            {/* Marker */}
            <div
              style={{
                position: "absolute",
                top: lineY - 20,
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: event.highlight
                  ? event.color || COLORS.accent
                  : COLORS.dark,
                border: `4px solid ${event.color || COLORS.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${interpolate(eventProgress, [0, 1], [0, 1])})`,
                boxShadow: event.highlight
                  ? `0 0 25px ${event.color || COLORS.accent}60`
                  : undefined,
              }}
            >
              {event.icon && (
                <span style={{ fontSize: 20 }}>{event.icon}</span>
              )}
            </div>

            {/* Content (below line) */}
            <div
              style={{
                position: "absolute",
                top: lineY + 50,
                textAlign: "center",
                width: 240,
              }}
            >
              <div
                style={{
                  fontSize: FONT_SIZES.md,
                  fontWeight: 600,
                  color: event.highlight ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  marginBottom: 8,
                }}
              >
                {event.title}
              </div>
              {event.description && (
                <div
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.light,
                    fontFamily: FONT_FAMILY.body,
                    opacity: 0.8,
                    lineHeight: 1.5,
                  }}
                >
                  {event.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: Vertical Timeline
const VerticalTimeline: React.FC<{
  events: TimelineEvent[];
  showConnector: boolean;
  connectorColor: string;
  revealMode: "sequential" | "all";
  staggerDelay: number;
  frame: number;
  fps: number;
}> = ({
  events,
  showConnector,
  connectorColor,
  revealMode,
  staggerDelay,
  frame,
  fps,
}) => {
  const eventHeight = 100;
  const totalHeight = events.length * eventHeight;
  const lineX = 150;

  // Line draw animation
  const lineProgress = spring({
    frame: frame - 20,
    fps,
    config: { ...SPRING_CONFIGS.normal, damping: 120 },
  });
  const lineStroke = calculateStrokeDraw({
    pathLength: totalHeight,
    progress: lineProgress,
  });

  return (
    <div
      style={{
        position: "relative",
        width: 900,
        height: totalHeight + 40,
        paddingLeft: 20,
      }}
    >
      {/* Connector Line */}
      {showConnector && (
        <svg
          style={{
            position: "absolute",
            top: 20,
            left: 0,
            width: 200,
            height: totalHeight,
          }}
        >
          <line
            x1={lineX}
            y1={0}
            x2={lineX}
            y2={totalHeight}
            stroke={connectorColor}
            strokeWidth={3}
            strokeLinecap="round"
            style={{
              strokeDasharray: lineStroke.strokeDasharray,
              strokeDashoffset: lineStroke.strokeDashoffset,
            }}
          />
        </svg>
      )}

      {/* Events */}
      {events.map((event, i) => {
        const eventDelay = revealMode === "sequential" ? 50 + i * staggerDelay : 50;
        const eventProgress = spring({
          frame: frame - eventDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const y = i * eventHeight + 20;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: 0,
              right: 0,
              height: eventHeight,
              display: "flex",
              alignItems: "flex-start",
              opacity: interpolate(eventProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(
                eventProgress,
                [0, 1],
                [-20, 0]
              )}px)`,
            }}
          >
            {/* Date (left side) */}
            <div
              style={{
                width: 120,
                textAlign: "right",
                paddingRight: 20,
              }}
            >
              <div
                style={{
                  fontSize: FONT_SIZES.sm - 2,
                  fontWeight: 700,
                  color: event.color || COLORS.accent,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {event.date}
              </div>
            </div>

            {/* Marker */}
            <div
              style={{
                width: 60,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: event.highlight
                    ? event.color || COLORS.accent
                    : COLORS.dark,
                  border: `3px solid ${event.color || COLORS.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${interpolate(eventProgress, [0, 1], [0, 1])})`,
                  boxShadow: event.highlight
                    ? `0 0 12px ${event.color || COLORS.accent}60`
                    : undefined,
                }}
              >
                {event.icon && (
                  <span style={{ fontSize: 10 }}>{event.icon}</span>
                )}
              </div>
            </div>

            {/* Content (right side) */}
            <div style={{ flex: 1, paddingLeft: 20 }}>
              <div
                style={{
                  fontSize: FONT_SIZES.sm,
                  fontWeight: 600,
                  color: event.highlight ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  marginBottom: 4,
                }}
              >
                {event.title}
              </div>
              {event.description && (
                <div
                  style={{
                    fontSize: FONT_SIZES.xs,
                    color: COLORS.light,
                    fontFamily: FONT_FAMILY.body,
                    opacity: 0.8,
                    lineHeight: 1.5,
                    maxWidth: 500,
                  }}
                >
                  {event.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TimelineTemplate: React.FC<TimelineTemplateProps> = ({
  title,
  events,
  layout,
  showConnector = true,
  connectorColor = COLORS.accent,
  revealMode = "sequential",
  staggerDelay = 15,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });

  const sceneContent = (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding: SPACING.xl,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Title */}
      {title && (
        <div
          style={{
            opacity: interpolate(titleProgress, [0, 1], [0, 1]),
            marginBottom: SPACING.lg,
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
            <AnimatedText
              text={title}
              animation={combine([fadeInUp(20), scaleIn(0.95)])}
              stagger="word"
              staggerDuration={5}
              delay={0}
              style={{ fontWeight: 700 }}
            />
          </h2>
        </div>
      )}

      {/* Timeline Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {layout === "horizontal" ? (
          <HorizontalTimeline
            events={events}
            showConnector={showConnector}
            connectorColor={connectorColor}
            revealMode={revealMode}
            staggerDelay={staggerDelay}
            frame={frame}
            fps={fps}
          />
        ) : (
          <VerticalTimeline
            events={events}
            showConnector={showConnector}
            connectorColor={connectorColor}
            revealMode={revealMode}
            staggerDelay={staggerDelay}
            frame={frame}
            fps={fps}
          />
        )}
      </div>
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

export default TimelineTemplate;
