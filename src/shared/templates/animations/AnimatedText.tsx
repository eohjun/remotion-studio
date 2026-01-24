import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AnimationConfig,
  fadeInUp,
  getAnimatedStyle,
  DEFAULT_SPRING,
} from "./presets";
import { containsKorean, getTextStyleForContent } from "../../utils/text";

export type StaggerMode = "none" | "word" | "character";

export interface AnimatedTextProps {
  text: string;
  animation?: AnimationConfig;
  stagger?: StaggerMode;
  staggerDuration?: number; // frames between each element
  delay?: number; // initial delay in frames
  style?: React.CSSProperties;
  className?: string;
  /** Language for text styling: "ko" for Korean, "en" for English, "auto" for detection */
  language?: "ko" | "en" | "auto";
}

interface AnimatedElementProps {
  children: React.ReactNode;
  animation: AnimationConfig;
  delay: number;
  style?: React.CSSProperties;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  delay,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: animation.springConfig || DEFAULT_SPRING,
  });

  const animatedStyle = getAnimatedStyle(progress, animation.preset);

  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        ...style,
        ...animatedStyle,
      }}
    >
      {children}
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  animation = fadeInUp(),
  stagger = "word",
  staggerDuration = 3,
  delay = 0,
  style = {},
  className,
  language = "auto",
}) => {
  const renderContent = () => {
    // Get text style based on language
    const textStyle = getTextStyleForContent(text, language);
    const mergedStyle = { ...textStyle, ...style };

    if (stagger === "none") {
      return (
        <AnimatedElement animation={animation} delay={delay} style={mergedStyle}>
          {text}
        </AnimatedElement>
      );
    }

    if (stagger === "word") {
      // For Korean text without spaces, treat the entire text as one unit
      const isKorean =
        language === "ko" || (language === "auto" && containsKorean(text));
      if (isKorean && !text.includes(" ")) {
        return (
          <AnimatedElement animation={animation} delay={delay} style={mergedStyle}>
            {text}
          </AnimatedElement>
        );
      }

      // Group words that should stay together:
      // - Words after "-" or "—" until next punctuation or end
      // - Words inside parentheses
      const words = text.split(" ");
      const groups: string[][] = [];
      let currentGroup: string[] = [];
      let inParenthesis = false;
      let afterDash = false;

      for (const word of words) {
        const startsWithParen = word.startsWith("(");
        const endsWithParen = word.endsWith(")");
        const isDash = word === "-" || word === "—";
        const endsWithDash = word.endsWith("-") || word.endsWith("—");

        if (isDash || endsWithDash) {
          currentGroup.push(word);
          afterDash = true;
        } else if (startsWithParen) {
          if (currentGroup.length > 0 && !afterDash) {
            groups.push(currentGroup);
            currentGroup = [];
          }
          currentGroup.push(word);
          inParenthesis = !endsWithParen;
          afterDash = false;
        } else if (inParenthesis) {
          currentGroup.push(word);
          if (endsWithParen) {
            inParenthesis = false;
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else if (afterDash) {
          // Keep name parts together after dash (capitalized words)
          currentGroup.push(word);
          // Check if this might be end of a name (next word starts with lowercase or punctuation)
          const isCapitalized = /^[A-Z]/.test(word);
          if (!isCapitalized || endsWithParen || word.includes(",")) {
            afterDash = false;
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
          groups.push([word]);
        }
      }
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }

      return (
        <span
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.3em",
            ...textStyle,
          }}
        >
          {groups.map((group, groupIndex) => (
            <span
              key={groupIndex}
              style={{ display: "inline-flex", gap: "0.3em", whiteSpace: "nowrap" }}
            >
              {group.map((word, wordIndex) => {
                const globalIndex = groups
                  .slice(0, groupIndex)
                  .reduce((sum, g) => sum + g.length, 0) + wordIndex;
                return (
                  <AnimatedElement
                    key={wordIndex}
                    animation={animation}
                    delay={delay + globalIndex * staggerDuration}
                    style={mergedStyle}
                  >
                    {word}
                  </AnimatedElement>
                );
              })}
            </span>
          ))}
        </span>
      );
    }

    if (stagger === "character") {
      // 단어 단위로 그룹핑하여 단어 중간에서 줄바꿈 방지
      const lines = text.split("\n");
      let globalCharIndex = 0;

      return lines.map((line, lineIndex) => (
        <React.Fragment key={`line-${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {line.split(" ").map((word, wordIndex, wordsArray) => (
            <React.Fragment key={`word-${lineIndex}-${wordIndex}`}>
              <span style={{ display: "inline-block", whiteSpace: "nowrap", ...textStyle }}>
                {word.split("").map((char) => {
                  const currentCharIndex = globalCharIndex++;
                  return (
                    <AnimatedElement
                      key={`char-${currentCharIndex}`}
                      animation={animation}
                      delay={delay + currentCharIndex * staggerDuration}
                      style={mergedStyle}
                    >
                      {char}
                    </AnimatedElement>
                  );
                })}
              </span>
              {wordIndex < wordsArray.length - 1 && (
                <span style={{ display: "inline-block", width: "0.3em" }}> </span>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ));
    }

    return text;
  };

  return (
    <span className={className} style={{ display: "inline-block" }}>
      {renderContent()}
    </span>
  );
};

// Convenience component for animated headings with wrapper
export interface AnimatedHeadingProps extends AnimatedTextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  headingStyle?: React.CSSProperties;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  level = 2,
  headingStyle = {},
  ...props
}) => {
  const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <HeadingTag style={headingStyle}>
      <AnimatedText {...props} />
    </HeadingTag>
  );
};

// Convenience component for animated paragraphs
export interface AnimatedParagraphProps extends AnimatedTextProps {
  paragraphStyle?: React.CSSProperties;
}

export const AnimatedParagraph: React.FC<AnimatedParagraphProps> = ({
  paragraphStyle = {},
  ...props
}) => {
  return (
    <p style={paragraphStyle}>
      <AnimatedText {...props} />
    </p>
  );
};

export default AnimatedText;
