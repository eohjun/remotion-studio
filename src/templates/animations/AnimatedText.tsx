import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AnimationConfig,
  fadeInUp,
  getAnimatedStyle,
  DEFAULT_SPRING,
} from "./presets";

export type StaggerMode = "none" | "word" | "character";

export interface AnimatedTextProps {
  text: string;
  animation?: AnimationConfig;
  stagger?: StaggerMode;
  staggerDuration?: number; // frames between each element
  delay?: number; // initial delay in frames
  style?: React.CSSProperties;
  className?: string;
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
}) => {
  const renderContent = () => {
    if (stagger === "none") {
      return (
        <AnimatedElement animation={animation} delay={delay} style={style}>
          {text}
        </AnimatedElement>
      );
    }

    if (stagger === "word") {
      const words = text.split(" ");
      return words.map((word, index) => (
        <React.Fragment key={index}>
          <AnimatedElement
            animation={animation}
            delay={delay + index * staggerDuration}
            style={style}
          >
            {word}
          </AnimatedElement>
          {index < words.length - 1 && (
            <span style={{ display: "inline-block", width: "0.3em" }}> </span>
          )}
        </React.Fragment>
      ));
    }

    if (stagger === "character") {
      const characters = text.split("");
      return characters.map((char, index) => (
        <AnimatedElement
          key={index}
          animation={animation}
          delay={delay + index * staggerDuration}
          style={style}
        >
          {char === " " ? "\u00A0" : char}
        </AnimatedElement>
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
