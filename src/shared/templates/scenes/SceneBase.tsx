/**
 * SceneBase - Unified Base Component for All Scene Templates
 *
 * Provides consistent styling, effects, safe areas, and transitions
 * for all scene templates in the system.
 *
 * @example
 * ```tsx
 * <SceneBase
 *   background="primary"
 *   effectsPreset="cinematic"
 *   showSafeArea={isDev}
 *   padding="comfortable"
 * >
 *   <YourSceneContent />
 * </SceneBase>
 * ```
 */

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, GRADIENTS } from "../../components/constants";
import { EffectsStack } from "../../components/effects/EffectsStack";
import type { EffectsConfig } from "../../components/effects";
import { SceneTransition } from "../../components/SceneTransition";
import type { BaseSceneProps } from "./types";

// ============================================================================
// Types
// ============================================================================

/**
 * Safe area padding levels for broadcast-safe content placement
 */
export type SafeAreaPadding = "none" | "action" | "title" | "comfortable" | "spacious";

/**
 * Content alignment options
 */
export type ContentAlignment =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Scene entry animation types
 */
export type SceneEntryAnimation = "none" | "fade" | "scale" | "slide-up" | "slide-down";

export interface SceneBaseProps extends BaseSceneProps {
  children: React.ReactNode;

  // Background
  /** Background gradient key or custom CSS */
  background?: keyof typeof GRADIENTS | string;
  /** Custom background component (takes precedence over background) */
  backgroundComponent?: React.ReactNode;

  // Effects
  /** Effects preset name or custom config */
  effectsPreset?: string | EffectsConfig;
  /** Disable all effects */
  disableEffects?: boolean;

  // Safe Areas
  /** Safe area padding level (default: "comfortable") */
  padding?: SafeAreaPadding;
  /** Show safe area guides in development */
  showSafeArea?: boolean;

  // Content Layout
  /** Content alignment within the scene */
  contentAlignment?: ContentAlignment;
  /** Maximum content width (default: no limit) */
  maxContentWidth?: number;

  // Entry Animation
  /** Scene entry animation type */
  entryAnimation?: SceneEntryAnimation;
  /** Entry animation duration in frames */
  entryDuration?: number;

  // Additional options
  /** Additional class name */
  className?: string;
  /** Content wrapper style */
  contentStyle?: React.CSSProperties;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Safe area padding values in pixels
 * Based on broadcast-safe area standards
 */
const SAFE_AREA_PADDING: Record<SafeAreaPadding, number> = {
  none: 0,
  action: 32, // 3.5% of 1080p - Action safe
  title: 64, // 10% of 1080p - Title safe
  comfortable: 80, // Comfortable reading margin
  spacious: 120, // Extra breathing room
};

/**
 * Alignment to flexbox mapping
 */
const ALIGNMENT_MAP: Record<ContentAlignment, React.CSSProperties> = {
  center: { justifyContent: "center", alignItems: "center" },
  "top-left": { justifyContent: "flex-start", alignItems: "flex-start" },
  "top-center": { justifyContent: "flex-start", alignItems: "center" },
  "top-right": { justifyContent: "flex-start", alignItems: "flex-end" },
  "center-left": { justifyContent: "center", alignItems: "flex-start" },
  "center-right": { justifyContent: "center", alignItems: "flex-end" },
  "bottom-left": { justifyContent: "flex-end", alignItems: "flex-start" },
  "bottom-center": { justifyContent: "flex-end", alignItems: "center" },
  "bottom-right": { justifyContent: "flex-end", alignItems: "flex-end" },
};

// ============================================================================
// SafeAreaGuide Component
// ============================================================================

interface SafeAreaGuideProps {
  padding: SafeAreaPadding;
  visible: boolean;
}

const SafeAreaGuide: React.FC<SafeAreaGuideProps> = ({ padding, visible }) => {
  if (!visible || padding === "none") return null;

  const paddingValue = SAFE_AREA_PADDING[padding];

  return (
    <>
      {/* Action Safe (outer) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_AREA_PADDING.action,
          left: SAFE_AREA_PADDING.action,
          right: SAFE_AREA_PADDING.action,
          bottom: SAFE_AREA_PADDING.action,
          border: "1px dashed rgba(255, 0, 0, 0.3)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {/* Title Safe (inner) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_AREA_PADDING.title,
          left: SAFE_AREA_PADDING.title,
          right: SAFE_AREA_PADDING.title,
          bottom: SAFE_AREA_PADDING.title,
          border: "1px dashed rgba(255, 255, 0, 0.3)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {/* Current padding area */}
      {padding !== "action" && padding !== "title" && (
        <div
          style={{
            position: "absolute",
            top: paddingValue,
            left: paddingValue,
            right: paddingValue,
            bottom: paddingValue,
            border: "1px solid rgba(0, 255, 0, 0.3)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
      {/* Center crosshair */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 40,
          height: 40,
          marginTop: -20,
          marginLeft: -20,
          border: "1px solid rgba(0, 255, 255, 0.3)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "rgba(0, 255, 255, 0.15)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: "rgba(0, 255, 255, 0.15)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
};

// ============================================================================
// Entry Animation Hook
// ============================================================================

function useEntryAnimation(
  animation: SceneEntryAnimation,
  duration: number
): { opacity: number; transform: string } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return useMemo(() => {
    if (animation === "none") {
      return { opacity: 1, transform: "none" };
    }

    const progress = spring({
      frame,
      fps,
      config: { damping: 20, mass: 0.8, stiffness: 100 },
      durationInFrames: duration,
    });

    switch (animation) {
      case "fade":
        return {
          opacity: progress,
          transform: "none",
        };

      case "scale":
        return {
          opacity: progress,
          transform: `scale(${interpolate(progress, [0, 1], [0.95, 1])})`,
        };

      case "slide-up":
        return {
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        };

      case "slide-down":
        return {
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [-30, 0])}px)`,
        };

      default:
        return { opacity: 1, transform: "none" };
    }
  }, [animation, duration, frame, fps]);
}

// ============================================================================
// SceneBase Component
// ============================================================================

export const SceneBase: React.FC<SceneBaseProps> = ({
  children,
  // Background
  background = "dark",
  backgroundComponent,
  // Effects
  effectsPreset,
  disableEffects = false,
  effects,
  // Safe Areas
  padding = "comfortable",
  showSafeArea = false,
  // Content Layout
  contentAlignment = "center",
  maxContentWidth,
  // Entry Animation
  entryAnimation = "none",
  entryDuration = 20,
  // Transitions
  durationInFrames,
  useTransition = false,
  // Styling
  style,
  contentStyle,
  className,
}) => {
  const entryStyles = useEntryAnimation(entryAnimation, entryDuration);

  // Resolve background
  const backgroundValue = useMemo(() => {
    if (backgroundComponent) return undefined;
    if (background in GRADIENTS) {
      return GRADIENTS[background as keyof typeof GRADIENTS];
    }
    if (background in COLORS) {
      return COLORS[background as keyof typeof COLORS];
    }
    return background;
  }, [background, backgroundComponent]);

  // Resolve padding
  const paddingValue = SAFE_AREA_PADDING[padding];

  // Resolve alignment
  const alignmentStyles = ALIGNMENT_MAP[contentAlignment];

  // Build content
  const content = (
    <AbsoluteFill
      className={className}
      style={{
        background: backgroundValue,
        ...style,
      }}
    >
      {/* Background component layer */}
      {backgroundComponent && (
        <AbsoluteFill style={{ zIndex: 0 }}>{backgroundComponent}</AbsoluteFill>
      )}

      {/* Safe area guides (development only) */}
      <SafeAreaGuide padding={padding} visible={showSafeArea} />

      {/* Content layer with safe area padding */}
      <AbsoluteFill
        style={{
          padding: paddingValue,
          display: "flex",
          flexDirection: "column",
          ...alignmentStyles,
          zIndex: 1,
          opacity: entryStyles.opacity,
          transform: entryStyles.transform,
          ...contentStyle,
        }}
      >
        {maxContentWidth ? (
          <div style={{ maxWidth: maxContentWidth, width: "100%" }}>
            {children}
          </div>
        ) : (
          children
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // Apply effects
  const withEffects = disableEffects ? (
    content
  ) : (
    <EffectsStack
      preset={effectsPreset || effects || "standard"}
      overrides={effects}
      disabled={disableEffects}
    >
      {content}
    </EffectsStack>
  );

  // Apply transition if needed
  if (useTransition && durationInFrames) {
    return (
      <SceneTransition durationInFrames={durationInFrames}>
        {withEffects}
      </SceneTransition>
    );
  }

  return withEffects;
};

// ============================================================================
// Convenience Wrappers
// ============================================================================

/**
 * CenteredScene - SceneBase with centered content and comfortable padding
 */
export const CenteredScene: React.FC<Omit<SceneBaseProps, "contentAlignment" | "padding">> = (
  props
) => <SceneBase {...props} contentAlignment="center" padding="comfortable" />;

/**
 * FullBleedScene - SceneBase with no padding (edge-to-edge content)
 */
export const FullBleedScene: React.FC<Omit<SceneBaseProps, "padding">> = (props) => (
  <SceneBase {...props} padding="none" />
);

/**
 * BroadcastSafeScene - SceneBase with title-safe padding for broadcast
 */
export const BroadcastSafeScene: React.FC<Omit<SceneBaseProps, "padding">> = (props) => (
  <SceneBase {...props} padding="title" />
);

/**
 * CinematicScene - SceneBase with cinematic effects preset
 */
export const CinematicScene: React.FC<Omit<SceneBaseProps, "effectsPreset">> = (props) => (
  <SceneBase {...props} effectsPreset="cinematic-intro" />
);

export default SceneBase;
