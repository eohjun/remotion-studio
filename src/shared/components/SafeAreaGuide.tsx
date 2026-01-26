/**
 * SafeAreaGuide - Development Overlay for Broadcast-Safe Content Areas
 *
 * Displays visual guides for:
 * - Action Safe Area (3.5% inset) - Red dashed line
 * - Title Safe Area (10% inset) - Yellow dashed line
 * - Center crosshair and guides - Cyan
 * - Rule of thirds grid - Optional
 * - Custom padding area - Green solid line
 *
 * @example
 * ```tsx
 * // Development mode overlay
 * const isDev = process.env.NODE_ENV === "development";
 *
 * <AbsoluteFill>
 *   <YourContent />
 *   {isDev && <SafeAreaGuide showRuleOfThirds />}
 * </AbsoluteFill>
 * ```
 */

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// ============================================================================
// Types
// ============================================================================

export interface SafeAreaGuideProps {
  /** Show action safe area (3.5% inset) */
  showActionSafe?: boolean;
  /** Show title safe area (10% inset) */
  showTitleSafe?: boolean;
  /** Show center crosshair */
  showCenter?: boolean;
  /** Show rule of thirds grid */
  showRuleOfThirds?: boolean;
  /** Custom padding to visualize (in pixels) */
  customPadding?: number;
  /** Color for action safe guide */
  actionSafeColor?: string;
  /** Color for title safe guide */
  titleSafeColor?: string;
  /** Color for center guide */
  centerColor?: string;
  /** Color for rule of thirds */
  thirdsColor?: string;
  /** Color for custom padding */
  customColor?: string;
  /** Overall opacity */
  opacity?: number;
  /** Label for custom padding */
  customLabel?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_COLORS = {
  actionSafe: "rgba(255, 0, 0, 0.4)",
  titleSafe: "rgba(255, 255, 0, 0.4)",
  center: "rgba(0, 255, 255, 0.3)",
  thirds: "rgba(255, 255, 255, 0.15)",
  custom: "rgba(0, 255, 0, 0.4)",
};

// ============================================================================
// SafeAreaGuide Component
// ============================================================================

export const SafeAreaGuide: React.FC<SafeAreaGuideProps> = ({
  showActionSafe = true,
  showTitleSafe = true,
  showCenter = true,
  showRuleOfThirds = false,
  customPadding,
  actionSafeColor = DEFAULT_COLORS.actionSafe,
  titleSafeColor = DEFAULT_COLORS.titleSafe,
  centerColor = DEFAULT_COLORS.center,
  thirdsColor = DEFAULT_COLORS.thirds,
  customColor = DEFAULT_COLORS.custom,
  opacity = 1,
  customLabel,
}) => {
  const { width, height } = useVideoConfig();

  // Calculate safe area insets
  const actionSafeInset = Math.min(width, height) * 0.035; // 3.5%
  const titleSafeInset = Math.min(width, height) * 0.1; // 10%

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9999,
        opacity,
      }}
    >
      {/* Action Safe Area (outer boundary) */}
      {showActionSafe && (
        <div
          style={{
            position: "absolute",
            top: actionSafeInset,
            left: actionSafeInset,
            right: actionSafeInset,
            bottom: actionSafeInset,
            border: `2px dashed ${actionSafeColor}`,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              fontSize: 10,
              color: actionSafeColor,
              fontFamily: "monospace",
            }}
          >
            ACTION SAFE
          </span>
        </div>
      )}

      {/* Title Safe Area (inner boundary) */}
      {showTitleSafe && (
        <div
          style={{
            position: "absolute",
            top: titleSafeInset,
            left: titleSafeInset,
            right: titleSafeInset,
            bottom: titleSafeInset,
            border: `2px dashed ${titleSafeColor}`,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              fontSize: 10,
              color: titleSafeColor,
              fontFamily: "monospace",
            }}
          >
            TITLE SAFE
          </span>
        </div>
      )}

      {/* Custom Padding Area */}
      {customPadding !== undefined && (
        <div
          style={{
            position: "absolute",
            top: customPadding,
            left: customPadding,
            right: customPadding,
            bottom: customPadding,
            border: `2px solid ${customColor}`,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              fontSize: 10,
              color: customColor,
              fontFamily: "monospace",
            }}
          >
            {customLabel || `CUSTOM (${customPadding}px)`}
          </span>
        </div>
      )}

      {/* Rule of Thirds Grid */}
      {showRuleOfThirds && (
        <>
          {/* Vertical lines */}
          <div
            style={{
              position: "absolute",
              left: "33.33%",
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: thirdsColor,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "66.66%",
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: thirdsColor,
            }}
          />
          {/* Horizontal lines */}
          <div
            style={{
              position: "absolute",
              top: "33.33%",
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: thirdsColor,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "66.66%",
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: thirdsColor,
            }}
          />
          {/* Intersection points */}
          {[
            { x: "33.33%", y: "33.33%" },
            { x: "66.66%", y: "33.33%" },
            { x: "33.33%", y: "66.66%" },
            { x: "66.66%", y: "66.66%" },
          ].map((point, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: point.x,
                top: point.y,
                width: 10,
                height: 10,
                marginLeft: -5,
                marginTop: -5,
                borderRadius: "50%",
                border: `2px solid ${thirdsColor}`,
              }}
            />
          ))}
        </>
      )}

      {/* Center Guides */}
      {showCenter && (
        <>
          {/* Horizontal center line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: centerColor,
            }}
          />
          {/* Vertical center line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: centerColor,
            }}
          />
          {/* Center circle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 60,
              height: 60,
              marginTop: -30,
              marginLeft: -30,
              borderRadius: "50%",
              border: `2px solid ${centerColor}`,
            }}
          />
          {/* Center point */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 8,
              height: 8,
              marginTop: -4,
              marginLeft: -4,
              borderRadius: "50%",
              backgroundColor: centerColor,
            }}
          />
        </>
      )}

      {/* Resolution indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          fontSize: 10,
          color: "rgba(255, 255, 255, 0.5)",
          fontFamily: "monospace",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        {width}×{height}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// Preset Configurations
// ============================================================================

/**
 * Minimal guide showing only center crosshair
 */
export const MinimalGuide: React.FC = () => (
  <SafeAreaGuide
    showActionSafe={false}
    showTitleSafe={false}
    showCenter={true}
    opacity={0.5}
  />
);

/**
 * Full broadcast guide with all safe areas
 */
export const BroadcastGuide: React.FC = () => (
  <SafeAreaGuide showActionSafe showTitleSafe showCenter opacity={0.8} />
);

/**
 * Photography-style guide with rule of thirds
 */
export const CompositionGuide: React.FC = () => (
  <SafeAreaGuide
    showActionSafe={false}
    showTitleSafe={false}
    showCenter
    showRuleOfThirds
    opacity={0.6}
  />
);

/**
 * Full development guide with everything enabled
 */
export const FullDevGuide: React.FC = () => (
  <SafeAreaGuide
    showActionSafe
    showTitleSafe
    showCenter
    showRuleOfThirds
    opacity={0.7}
  />
);

export default SafeAreaGuide;
