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
import { calculateStrokeDraw } from "../animations/svg";
import type { BaseSceneProps, Annotation } from "./types";

export interface AnnotationTemplateProps extends BaseSceneProps {
  /** Base content to annotate (image, diagram, code, etc.) */
  baseContent: React.ReactNode;
  /** Custom style for base content container */
  baseContentStyle?: React.CSSProperties;
  /** Annotations to overlay */
  annotations: Annotation[];
  /** Pointer style */
  pointerStyle?: "arrow" | "line" | "dot";
  /** Default pointer color */
  pointerColor?: string;
  /** Annotation box style */
  annotationStyle?: "tooltip" | "callout" | "label";
  /** Reveal mode */
  revealMode?: "sequential" | "all";
  /** Stagger delay for sequential mode */
  staggerDelay?: number;
  /** Background color */
  backgroundColor?: string;
}

// Calculate pointer path based on direction
const getPointerPath = (
  direction: "top" | "bottom" | "left" | "right",
  length: number
): { startX: number; startY: number; endX: number; endY: number } => {
  switch (direction) {
    case "top":
      return { startX: 0, startY: 0, endX: 0, endY: -length };
    case "bottom":
      return { startX: 0, startY: 0, endX: 0, endY: length };
    case "left":
      return { startX: 0, startY: 0, endX: -length, endY: 0 };
    case "right":
      return { startX: 0, startY: 0, endX: length, endY: 0 };
    default:
      return { startX: 0, startY: 0, endX: 0, endY: -length };
  }
};

// Get annotation box offset based on pointer direction
const getAnnotationOffset = (
  direction: "top" | "bottom" | "left" | "right",
  pointerLength: number
): { x: number; y: number } => {
  const offset = pointerLength + 10;
  switch (direction) {
    case "top":
      return { x: 0, y: -offset };
    case "bottom":
      return { x: 0, y: offset };
    case "left":
      return { x: -offset, y: 0 };
    case "right":
      return { x: offset, y: 0 };
    default:
      return { x: 0, y: -offset };
  }
};

// Sub-component: Annotation Item
const AnnotationItem: React.FC<{
  annotation: Annotation;
  pointerStyle: "arrow" | "line" | "dot";
  pointerColor: string;
  annotationStyle: "tooltip" | "callout" | "label";
  progress: number;
  containerWidth: number;
  containerHeight: number;
}> = ({
  annotation,
  pointerStyle,
  pointerColor,
  annotationStyle,
  progress,
  containerWidth,
  containerHeight,
}) => {
  const direction = annotation.pointerDirection || "top";
  const color = annotation.color || pointerColor;
  const pointerLength = 50;
  const dotSize = 12;

  // Calculate position in pixels
  const posX = (annotation.x / 100) * containerWidth;
  const posY = (annotation.y / 100) * containerHeight;

  // Get pointer path
  const path = getPointerPath(direction, pointerLength);
  const strokeDraw = calculateStrokeDraw({
    pathLength: pointerLength,
    progress: progress,
  });

  // Get annotation offset
  const offset = getAnnotationOffset(direction, pointerLength);

  // Annotation box styles based on style type
  const getAnnotationBoxStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: posX + offset.x,
      top: posY + offset.y,
      transform: `translate(${direction === "left" ? "-100%" : direction === "right" ? "0" : "-50%"}, ${direction === "top" ? "-100%" : direction === "bottom" ? "0" : "-50%"})`,
      opacity: interpolate(progress, [0.5, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      maxWidth: 200,
      zIndex: annotation.highlight ? 10 : 5,
    };

    switch (annotationStyle) {
      case "tooltip":
        return {
          ...baseStyle,
          backgroundColor: "rgba(0,0,0,0.9)",
          padding: "8px 12px",
          borderRadius: RADIUS.sm,
          border: `2px solid ${color}`,
          boxShadow: annotation.highlight
            ? `0 0 20px ${color}50`
            : "0 4px 12px rgba(0,0,0,0.3)",
        };
      case "callout":
        return {
          ...baseStyle,
          backgroundColor: color,
          padding: "10px 16px",
          borderRadius: RADIUS.md,
          boxShadow: annotation.highlight
            ? `0 0 25px ${color}60`
            : "0 6px 16px rgba(0,0,0,0.3)",
        };
      case "label":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          padding: "4px 8px",
          borderLeft: `3px solid ${color}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Pointer */}
      {pointerStyle !== "dot" ? (
        <svg
          style={{
            position: "absolute",
            left: posX - 30,
            top: posY - 30,
            width: 60,
            height: 60,
            overflow: "visible",
            zIndex: 4,
          }}
        >
          {pointerStyle === "line" && (
            <line
              x1={30 + path.startX}
              y1={30 + path.startY}
              x2={30 + path.endX}
              y2={30 + path.endY}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              style={{
                strokeDasharray: strokeDraw.strokeDasharray,
                strokeDashoffset: strokeDraw.strokeDashoffset,
              }}
            />
          )}
          {pointerStyle === "arrow" && (
            <>
              <line
                x1={30 + path.startX}
                y1={30 + path.startY}
                x2={30 + path.endX}
                y2={30 + path.endY}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                style={{
                  strokeDasharray: strokeDraw.strokeDasharray,
                  strokeDashoffset: strokeDraw.strokeDashoffset,
                }}
              />
              {/* Arrow head */}
              <polygon
                points={getArrowHead(direction, 30 + path.endX, 30 + path.endY)}
                fill={color}
                style={{
                  opacity: interpolate(progress, [0.7, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </>
          )}
        </svg>
      ) : (
        // Dot pointer
        <div
          style={{
            position: "absolute",
            left: posX - dotSize / 2,
            top: posY - dotSize / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: color,
            border: "2px solid white",
            transform: `scale(${interpolate(progress, [0, 0.5], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
            boxShadow: annotation.highlight
              ? `0 0 15px ${color}`
              : "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 4,
          }}
        />
      )}

      {/* Annotation Box */}
      <div style={getAnnotationBoxStyle()}>
        {annotation.icon && (
          <span
            style={{
              marginRight: 6,
              fontSize: FONT_SIZES.sm - 2,
            }}
          >
            {annotation.icon}
          </span>
        )}
        <span
          style={{
            fontSize: FONT_SIZES.sm - 4,
            color:
              annotationStyle === "callout" ? COLORS.dark : COLORS.white,
            fontFamily: FONT_FAMILY.body,
            fontWeight: annotation.highlight ? 600 : 400,
            lineHeight: 1.4,
          }}
        >
          {annotation.text}
        </span>
      </div>
    </>
  );
};

// Helper function for arrow head points
const getArrowHead = (
  direction: "top" | "bottom" | "left" | "right",
  x: number,
  y: number
): string => {
  const size = 8;
  switch (direction) {
    case "top":
      return `${x},${y} ${x - size},${y + size} ${x + size},${y + size}`;
    case "bottom":
      return `${x},${y} ${x - size},${y - size} ${x + size},${y - size}`;
    case "left":
      return `${x},${y} ${x + size},${y - size} ${x + size},${y + size}`;
    case "right":
      return `${x},${y} ${x - size},${y - size} ${x - size},${y + size}`;
    default:
      return `${x},${y} ${x - size},${y + size} ${x + size},${y + size}`;
  }
};

export const AnnotationTemplate: React.FC<AnnotationTemplateProps> = ({
  baseContent,
  baseContentStyle,
  annotations,
  pointerStyle = "arrow",
  pointerColor = COLORS.accent,
  annotationStyle = "tooltip",
  revealMode = "sequential",
  staggerDelay = 20,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container dimensions (using standard 1920x1080)
  const containerWidth = 1920 - SPACING.xl * 2;
  const containerHeight = 1080 - SPACING.xl * 2;

  // Base content fade in
  const baseProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const sceneContent = (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding: SPACING.xl,
        ...style,
      }}
    >
      {/* Base Content Container */}
      <div
        style={{
          position: "relative",
          width: containerWidth,
          height: containerHeight,
          opacity: interpolate(baseProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(baseProgress, [0, 1], [0.98, 1])})`,
        }}
      >
        {/* Base Content */}
        <div
          style={{
            width: "100%",
            height: "100%",
            ...baseContentStyle,
          }}
        >
          {baseContent}
        </div>

        {/* Annotations Overlay */}
        {annotations.map((annotation, i) => {
          const delay =
            revealMode === "sequential" ? 20 + i * staggerDelay : 20;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <AnnotationItem
              key={annotation.id}
              annotation={annotation}
              pointerStyle={pointerStyle}
              pointerColor={pointerColor}
              annotationStyle={annotationStyle}
              progress={progress}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          );
        })}
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

export default AnnotationTemplate;
