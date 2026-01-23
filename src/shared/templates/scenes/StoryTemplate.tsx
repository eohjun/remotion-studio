import React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
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
import { AnimatedText, fadeInUp } from "../animations";
import type { BaseSceneProps, StoryPanel } from "./types";

export interface StoryTemplateProps extends BaseSceneProps {
  /** Story panels */
  panels: StoryPanel[];
  /** Layout type */
  layout: "single" | "split" | "sequence";
  /** Narrator configuration */
  narrator?: {
    text: string;
    position?: "top" | "bottom";
    style?: "subtitle" | "quote" | "caption";
  };
  /** Character configuration */
  character?: {
    image?: string;
    name?: string;
    position?: "left" | "right";
  };
  /** Background color */
  backgroundColor?: string;
}

// Mood color mapping
const getMoodStyle = (
  mood: "neutral" | "positive" | "negative" | "dramatic"
): React.CSSProperties => {
  switch (mood) {
    case "positive":
      return {
        filter: "brightness(1.05) saturate(1.1)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
      };
    case "negative":
      return {
        filter: "brightness(0.9) saturate(0.9)",
        backgroundColor: "rgba(220, 53, 69, 0.1)",
      };
    case "dramatic":
      return {
        filter: "contrast(1.1) brightness(0.95)",
        backgroundColor: "rgba(102, 126, 234, 0.15)",
      };
    default:
      return {};
  }
};

// Sub-component: Single Panel Layout
const SinglePanel: React.FC<{
  panel: StoryPanel;
  frame: number;
  fps: number;
}> = ({ panel, frame, fps }) => {
  const progress = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const moodStyle = getMoodStyle(panel.mood || "neutral");

  return (
    <AbsoluteFill
      style={{
        ...moodStyle,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      {/* Background */}
      {panel.background && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: panel.background.startsWith("http") ||
              panel.background.startsWith("/")
                ? undefined
                : panel.background,
          }}
        >
          {(panel.background.startsWith("http") ||
            panel.background.startsWith("/")) && (
            <Img
              src={
                panel.background.startsWith("http")
                  ? panel.background
                  : staticFile(panel.background)
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
              }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: SPACING["2xl"],
        }}
      >
        {typeof panel.content === "string" ? (
          <div
            style={{
              fontSize: FONT_SIZES.xl,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.body,
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 1200,
            }}
          >
            <AnimatedText
              text={panel.content}
              animation={fadeInUp(20)}
              stagger="word"
              staggerDuration={4}
              delay={15}
            />
          </div>
        ) : (
          panel.content
        )}
      </div>
    </AbsoluteFill>
  );
};

// Sub-component: Split Panel Layout
const SplitPanel: React.FC<{
  panels: StoryPanel[];
  frame: number;
  fps: number;
}> = ({ panels, frame, fps }) => {
  const leftProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const rightProgress = spring({
    frame: frame - 15,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          position: "relative",
          ...getMoodStyle(panels[0]?.mood || "neutral"),
          opacity: interpolate(leftProgress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(leftProgress, [0, 1], [-30, 0])}px)`,
        }}
      >
        {panels[0]?.background && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: panels[0].background.startsWith("http") ||
                panels[0].background.startsWith("/")
                  ? undefined
                  : panels[0].background,
            }}
          >
            {(panels[0].background.startsWith("http") ||
              panels[0].background.startsWith("/")) && (
              <Img
                src={
                  panels[0].background.startsWith("http")
                    ? panels[0].background
                    : staticFile(panels[0].background)
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.5,
                }}
              />
            )}
          </div>
        )}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: SPACING.xl,
          }}
        >
          {typeof panels[0]?.content === "string" ? (
            <div
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              <AnimatedText
                text={panels[0].content}
                animation={fadeInUp(15)}
                stagger="word"
                staggerDuration={3}
                delay={10}
              />
            </div>
          ) : (
            panels[0]?.content
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 2,
          backgroundColor: COLORS.accent,
          opacity: 0.5,
        }}
      />

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          position: "relative",
          ...getMoodStyle(panels[1]?.mood || "neutral"),
          opacity: interpolate(rightProgress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(rightProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        {panels[1]?.background && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: panels[1].background.startsWith("http") ||
                panels[1].background.startsWith("/")
                  ? undefined
                  : panels[1].background,
            }}
          >
            {(panels[1].background.startsWith("http") ||
              panels[1].background.startsWith("/")) && (
              <Img
                src={
                  panels[1].background.startsWith("http")
                    ? panels[1].background
                    : staticFile(panels[1].background)
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.5,
                }}
              />
            )}
          </div>
        )}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: SPACING.xl,
          }}
        >
          {typeof panels[1]?.content === "string" ? (
            <div
              style={{
                fontSize: FONT_SIZES.lg,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              <AnimatedText
                text={panels[1].content}
                animation={fadeInUp(15)}
                stagger="word"
                staggerDuration={3}
                delay={25}
              />
            </div>
          ) : (
            panels[1]?.content
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Sequence Panel Layout (Comic style)
const SequencePanel: React.FC<{
  panels: StoryPanel[];
  frame: number;
  fps: number;
}> = ({ panels, frame, fps }) => {
  const cols = panels.length <= 2 ? panels.length : panels.length <= 4 ? 2 : 3;
  const rows = Math.ceil(panels.length / cols);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: SPACING.sm,
        height: "100%",
        padding: SPACING.lg,
      }}
    >
      {panels.slice(0, 6).map((panel, i) => {
        const progress = spring({
          frame: frame - i * 12,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        return (
          <div
            key={i}
            style={{
              position: "relative",
              borderRadius: RADIUS.lg,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.1)",
              ...getMoodStyle(panel.mood || "neutral"),
              opacity: interpolate(progress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
            }}
          >
            {/* Background */}
            {panel.background && (
              <div style={{ position: "absolute", inset: 0 }}>
                {panel.background.startsWith("http") ||
                panel.background.startsWith("/") ? (
                  <Img
                    src={
                      panel.background.startsWith("http")
                        ? panel.background
                        : staticFile(panel.background)
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.4,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: panel.background,
                    }}
                  />
                )}
              </div>
            )}

            {/* Content */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: SPACING.md,
              }}
            >
              {typeof panel.content === "string" ? (
                <div
                  style={{
                    fontSize: FONT_SIZES.md - 4,
                    color: COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {panel.content}
                </div>
              ) : (
                panel.content
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: Narrator Text
const NarratorText: React.FC<{
  narrator: NonNullable<StoryTemplateProps["narrator"]>;
  frame: number;
  fps: number;
}> = ({ narrator, frame, fps }) => {
  const progress = spring({
    frame: frame - 40,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const position = narrator.position || "bottom";
  const style = narrator.style || "subtitle";

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    [position]: 0,
    padding: SPACING.lg,
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [position === "top" ? -20 : 20, 0])}px)`,
  };

  const getTextStyle = (): React.CSSProperties => {
    switch (style) {
      case "quote":
        return {
          fontSize: FONT_SIZES.lg,
          fontStyle: "italic",
          color: COLORS.white,
          fontFamily: FONT_FAMILY.body,
          textAlign: "center",
          padding: `${SPACING.md}px ${SPACING.xl}px`,
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: RADIUS.md,
          borderLeft: `4px solid ${COLORS.accent}`,
        };
      case "caption":
        return {
          fontSize: FONT_SIZES.sm,
          color: COLORS.light,
          fontFamily: FONT_FAMILY.body,
          textAlign: "center",
          padding: SPACING.sm,
        };
      case "subtitle":
      default:
        return {
          fontSize: FONT_SIZES.md,
          color: COLORS.white,
          fontFamily: FONT_FAMILY.body,
          textAlign: "center",
          padding: `${SPACING.sm}px ${SPACING.lg}px`,
          backgroundColor: "rgba(0,0,0,0.75)",
          borderRadius: RADIUS.sm,
          maxWidth: 1200,
          margin: "0 auto",
          lineHeight: 1.6,
        };
    }
  };

  return (
    <div style={containerStyle}>
      <div style={getTextStyle()}>
        <AnimatedText
          text={narrator.text}
          animation={fadeInUp(20)}
          stagger="word"
          staggerDuration={3}
          delay={50}
        />
      </div>
    </div>
  );
};

// Sub-component: Character
const Character: React.FC<{
  character: NonNullable<StoryTemplateProps["character"]>;
  frame: number;
  fps: number;
}> = ({ character, frame, fps }) => {
  const progress = spring({
    frame: frame - 20,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const position = character.position || "left";

  return (
    <div
      style={{
        position: "absolute",
        [position]: SPACING.lg,
        bottom: SPACING.lg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: SPACING.xs,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(
          progress,
          [0, 1],
          [position === "left" ? -50 : 50, 0]
        )}px)`,
      }}
    >
      {/* Character Image */}
      {character.image && (
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${COLORS.accent}`,
            boxShadow: `0 0 20px ${COLORS.accent}40`,
          }}
        >
          <Img
            src={
              character.image.startsWith("http")
                ? character.image
                : staticFile(character.image)
            }
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Character Name */}
      {character.name && (
        <div
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.accent,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 600,
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "4px 12px",
            borderRadius: RADIUS.sm,
          }}
        >
          {character.name}
        </div>
      )}
    </div>
  );
};

export const StoryTemplate: React.FC<StoryTemplateProps> = ({
  panels,
  layout,
  narrator,
  character,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneContent = (
    <AbsoluteFill style={{ backgroundColor, ...style }}>
      {/* Panels */}
      {layout === "single" && panels[0] && (
        <SinglePanel panel={panels[0]} frame={frame} fps={fps} />
      )}

      {layout === "split" && panels.length >= 2 && (
        <SplitPanel panels={panels} frame={frame} fps={fps} />
      )}

      {layout === "sequence" && panels.length > 0 && (
        <SequencePanel panels={panels} frame={frame} fps={fps} />
      )}

      {/* Character */}
      {character && <Character character={character} frame={frame} fps={fps} />}

      {/* Narrator */}
      {narrator && <NarratorText narrator={narrator} frame={frame} fps={fps} />}
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

export default StoryTemplate;
