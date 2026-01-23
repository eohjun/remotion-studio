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
import { AnimatedText, fadeInUp, fadeInLeft, fadeInRight, scaleIn } from "../animations";
import type { BaseSceneProps } from "./types";

/**
 * Layout style for interview
 */
export type InterviewLayout = "split" | "focus" | "stacked" | "bubble";

/**
 * Speaker information
 */
export interface Speaker {
  /** Speaker name */
  name: string;
  /** Speaker role/title */
  role?: string;
  /** Avatar image URL or emoji */
  avatar?: string;
  /** Speaker's color theme */
  color?: string;
}

/**
 * Dialogue entry
 */
export interface DialogueEntry {
  /** Which speaker (by index) */
  speakerIndex: number;
  /** The dialogue text */
  text: string;
  /** Optional emphasis/highlight */
  emphasis?: boolean;
}

/**
 * Props for InterviewTemplate component
 */
export interface InterviewTemplateProps extends BaseSceneProps {
  /** Layout style */
  layout?: InterviewLayout;
  /** Topic or title */
  topic?: string;
  /** Speakers in the conversation (2 for interview) */
  speakers: [Speaker, Speaker];
  /** Current dialogue entries to show */
  dialogue: DialogueEntry[];
  /** Currently active speaker (0 or 1) */
  activeSpeaker?: number;
  /** Show speaker avatars */
  showAvatars?: boolean;
  /** Background color */
  backgroundColor?: string;
}

/**
 * Avatar component for speakers
 */
const SpeakerAvatar: React.FC<{
  speaker: Speaker;
  isActive: boolean;
  size: number;
  progress: number;
}> = ({ speaker, isActive, size, progress }) => {
  const scale = isActive ? 1.1 : 1;
  const borderWidth = isActive ? 4 : 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: speaker.color || COLORS.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        border: `${borderWidth}px solid ${isActive ? COLORS.white : "rgba(255,255,255,0.3)"}`,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, scale])})`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        boxShadow: isActive ? `0 0 20px ${speaker.color || COLORS.primary}` : "none",
        transition: "all 0.3s ease",
      }}
    >
      {speaker.avatar || speaker.name.charAt(0).toUpperCase()}
    </div>
  );
};

/**
 * InterviewTemplate - Dialogue and conversation style
 *
 * Designed for interviews, Q&A, debates, and conversational content.
 * Supports multiple layouts and animated dialogue.
 *
 * @example
 * ```tsx
 * <InterviewTemplate
 *   layout="split"
 *   topic="The Future of AI"
 *   speakers={[
 *     { name: "Host", role: "Interviewer", avatar: "🎙️", color: "#667eea" },
 *     { name: "Expert", role: "AI Researcher", avatar: "🤖", color: "#764ba2" }
 *   ]}
 *   dialogue={[
 *     { speakerIndex: 0, text: "What do you think about AI?" },
 *     { speakerIndex: 1, text: "It's transforming everything." }
 *   ]}
 *   activeSpeaker={1}
 *   durationInFrames={300}
 * />
 * ```
 */
export const InterviewTemplate: React.FC<InterviewTemplateProps> = ({
  layout = "split",
  topic,
  speakers,
  dialogue,
  activeSpeaker = 0,
  showAvatars = true,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const headerProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const avatarProgress = spring({ frame: frame - 10, fps, config: SPRING_CONFIGS.normal });
  const dialogueProgress = spring({ frame: frame - 20, fps, config: SPRING_CONFIGS.normal });

  const renderSplitLayout = () => (
    <div
      style={{
        display: "flex",
        flex: 1,
        gap: SPACING.md,
        padding: SPACING.lg,
      }}
    >
      {/* Left Speaker Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: SPACING.md,
          backgroundColor:
            activeSpeaker === 0
              ? `${speakers[0].color || COLORS.primary}20`
              : "rgba(255,255,255,0.02)",
          borderRadius: RADIUS.lg,
          transition: "background-color 0.3s ease",
        }}
      >
        {showAvatars && (
          <SpeakerAvatar
            speaker={speakers[0]}
            isActive={activeSpeaker === 0}
            size={100}
            progress={avatarProgress}
          />
        )}
        <div style={{ marginTop: SPACING.sm, textAlign: "center" }}>
          <AnimatedText
            text={speakers[0].name}
            animation={fadeInUp(15)}
            stagger="none"
            delay={15}
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
            }}
          />
          {speakers[0].role && (
            <p
              style={{
                fontSize: FONT_SIZES.sm,
                color: speakers[0].color || COLORS.accent,
                fontFamily: FONT_FAMILY.body,
                margin: "4px 0 0 0",
              }}
            >
              {speakers[0].role}
            </p>
          )}
        </div>
      </div>

      {/* Center Divider with VS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 60,
        }}
      >
        <div
          style={{
            width: 2,
            height: "60%",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
      </div>

      {/* Right Speaker Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: SPACING.md,
          backgroundColor:
            activeSpeaker === 1
              ? `${speakers[1].color || COLORS.secondary}20`
              : "rgba(255,255,255,0.02)",
          borderRadius: RADIUS.lg,
          transition: "background-color 0.3s ease",
        }}
      >
        {showAvatars && (
          <SpeakerAvatar
            speaker={speakers[1]}
            isActive={activeSpeaker === 1}
            size={100}
            progress={avatarProgress}
          />
        )}
        <div style={{ marginTop: SPACING.sm, textAlign: "center" }}>
          <AnimatedText
            text={speakers[1].name}
            animation={fadeInUp(15)}
            stagger="none"
            delay={20}
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
            }}
          />
          {speakers[1].role && (
            <p
              style={{
                fontSize: FONT_SIZES.sm,
                color: speakers[1].color || COLORS.accent,
                fontFamily: FONT_FAMILY.body,
                margin: "4px 0 0 0",
              }}
            >
              {speakers[1].role}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderBubbleLayout = () => (
    <div
      style={{
        flex: 1,
        padding: SPACING.lg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: SPACING.md,
      }}
    >
      {dialogue.map((entry, i) => {
        const speaker = speakers[entry.speakerIndex];
        const isLeft = entry.speakerIndex === 0;
        const entryProgress = spring({
          frame: frame - 25 - i * 15,
          fps,
          config: SPRING_CONFIGS.normal,
        });

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: isLeft ? "row" : "row-reverse",
              alignItems: "flex-start",
              gap: SPACING.sm,
              opacity: interpolate(entryProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(
                entryProgress,
                [0, 1],
                [isLeft ? -30 : 30, 0],
              )}px)`,
            }}
          >
            {showAvatars && (
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: speaker.color || COLORS.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {speaker.avatar || speaker.name.charAt(0)}
              </div>
            )}
            <div
              style={{
                maxWidth: "70%",
                backgroundColor: isLeft
                  ? `${speaker.color || COLORS.primary}30`
                  : `${speaker.color || COLORS.secondary}30`,
                padding: SPACING.md,
                borderRadius: RADIUS.lg,
                borderTopLeftRadius: isLeft ? 4 : RADIUS.lg,
                borderTopRightRadius: isLeft ? RADIUS.lg : 4,
              }}
            >
              <p
                style={{
                  fontSize: FONT_SIZES.xs,
                  color: speaker.color || COLORS.accent,
                  fontFamily: FONT_FAMILY.body,
                  fontWeight: 600,
                  margin: "0 0 4px 0",
                }}
              >
                {speaker.name}
              </p>
              <AnimatedText
                text={entry.text}
                animation={isLeft ? fadeInLeft(12) : fadeInRight(12)}
                stagger="word"
                staggerDuration={2}
                delay={30 + i * 15}
                style={{
                  fontSize: FONT_SIZES.md,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderFocusLayout = () => {
    const currentEntry = dialogue[dialogue.length - 1];
    const speaker = currentEntry ? speakers[currentEntry.speakerIndex] : speakers[0];

    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: SPACING.xl,
        }}
      >
        {showAvatars && (
          <SpeakerAvatar
            speaker={speaker}
            isActive={true}
            size={120}
            progress={avatarProgress}
          />
        )}
        <div style={{ marginTop: SPACING.md, textAlign: "center" }}>
          <h3
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              margin: "0 0 4px 0",
            }}
          >
            {speaker.name}
          </h3>
          {speaker.role && (
            <p
              style={{
                fontSize: FONT_SIZES.md,
                color: speaker.color || COLORS.accent,
                fontFamily: FONT_FAMILY.body,
                margin: 0,
              }}
            >
              {speaker.role}
            </p>
          )}
        </div>
        {currentEntry && (
          <div
            style={{
              marginTop: SPACING.lg,
              maxWidth: "80%",
              textAlign: "center",
              opacity: interpolate(dialogueProgress, [0, 1], [0, 1]),
            }}
          >
            <AnimatedText
              text={`"${currentEntry.text}"`}
              animation={scaleIn(0.95)}
              stagger="word"
              staggerDuration={3}
              delay={25}
              style={{
                fontSize: FONT_SIZES["2xl"],
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                fontWeight: 500,
                lineHeight: 1.4,
                fontStyle: "italic",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const sceneContent = (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Topic Header */}
      {topic && (
        <div
          style={{
            padding: `${SPACING.md}px ${SPACING.xl}px`,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            opacity: interpolate(headerProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(headerProgress, [0, 1], [-20, 0])}px)`,
          }}
        >
          <AnimatedText
            text={topic}
            animation={fadeInUp(15)}
            stagger="word"
            staggerDuration={4}
            delay={0}
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: 600,
              color: COLORS.accent,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
            }}
          />
        </div>
      )}

      {/* Layout Content */}
      {layout === "split" && renderSplitLayout()}
      {layout === "bubble" && renderBubbleLayout()}
      {layout === "focus" && renderFocusLayout()}
      {layout === "stacked" && renderBubbleLayout()}
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

export default InterviewTemplate;
