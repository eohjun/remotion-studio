import React, { useRef, useEffect, useState, useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { LAYOUT } from "../constants";

export interface AutoFitContainerProps {
  children: React.ReactNode;
  /** Horizontal padding (default: 80px from LAYOUT.safeArea.horizontal) */
  horizontalPadding?: number;
  /** Vertical padding (default: 60px from LAYOUT.safeArea.vertical) */
  verticalPadding?: number;
  /** Minimum scale factor (default: 0.7 - won't scale below this) */
  minScale?: number;
  /** Enable debug mode to show boundary visualization */
  debug?: boolean;
  /** Additional style overrides for the container */
  style?: React.CSSProperties;
  /** Callback when content overflows (useful for warnings) */
  onOverflow?: (overflow: { width: number; height: number }) => void;
}

/**
 * AutoFitContainer - Automatically scales content to fit within safe area
 *
 * This component:
 * 1. Measures the content's natural dimensions
 * 2. Compares against available space (contentArea after padding)
 * 3. Applies uniform scale to fit content if it overflows
 *
 * Usage:
 * ```tsx
 * <AutoFitContainer>
 *   <YourContent />
 * </AutoFitContainer>
 * ```
 *
 * Note: Uses CSS transform for scaling, which doesn't affect layout.
 * Content is centered when scaled down.
 */
export const AutoFitContainer: React.FC<AutoFitContainerProps> = ({
  children,
  horizontalPadding = LAYOUT.safeArea.horizontal,
  verticalPadding = LAYOUT.safeArea.vertical,
  minScale = 0.7,
  debug = false,
  style,
  onOverflow,
}) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

  // Calculate available space
  const availableWidth = videoWidth - horizontalPadding * 2;
  const availableHeight = videoHeight - verticalPadding * 2;

  // Measure content and calculate scale
  useEffect(() => {
    if (!contentRef.current) return;

    const measureContent = () => {
      const el = contentRef.current;
      if (!el) return;

      // Get the natural scroll dimensions (content size without constraints)
      const naturalWidth = el.scrollWidth;
      const naturalHeight = el.scrollHeight;

      setContentSize({ width: naturalWidth, height: naturalHeight });

      // Calculate required scale
      const widthScale = availableWidth / naturalWidth;
      const heightScale = availableHeight / naturalHeight;
      const requiredScale = Math.min(widthScale, heightScale, 1); // Never scale up

      // Apply minimum scale constraint
      const finalScale = Math.max(requiredScale, minScale);
      setScale(finalScale);

      // Notify if overflow occurred
      if (requiredScale < 1 && onOverflow) {
        onOverflow({
          width: naturalWidth - availableWidth,
          height: naturalHeight - availableHeight,
        });
      }
    };

    // Measure after a short delay to ensure content is rendered
    const timeoutId = setTimeout(measureContent, 10);

    return () => clearTimeout(timeoutId);
  }, [children, availableWidth, availableHeight, minScale, onOverflow]);

  // Memoize the transform origin and transform
  const transformStyle = useMemo(() => {
    if (scale >= 1) return {};

    return {
      transform: `scale(${scale})`,
      transformOrigin: "center top",
    };
  }, [scale]);

  return (
    <AbsoluteFill
      style={{
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Debug boundary visualization */}
      {debug && (
        <div
          style={{
            position: "absolute",
            top: verticalPadding,
            left: horizontalPadding,
            width: availableWidth,
            height: availableHeight,
            border: "2px dashed rgba(255, 0, 0, 0.5)",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              background: "rgba(255, 0, 0, 0.8)",
              color: "white",
              padding: "4px 8px",
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            Safe: {availableWidth}×{availableHeight} | Content: {contentSize.width}×{contentSize.height} | Scale: {scale.toFixed(2)}
          </div>
        </div>
      )}

      {/* Content wrapper with auto-scaling */}
      <div
        ref={contentRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          ...transformStyle,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Content density guidelines for 1920x1080 video
 * Use these to plan content layout and avoid overflow
 */
export const CONTENT_LIMITS = {
  /** Maximum recommended items for different list styles */
  lists: {
    /** Full-width list items with icons (padding ~70px each) */
    fullWidthSteps: 4,
    /** Compact list items (padding ~50px each) */
    compactSteps: 5,
    /** Bullet points (line height ~50px each) */
    bulletPoints: 8,
    /** Two-column grid items */
    gridItems: 6,
  },
  /** Recommended spacing ranges based on item count (검증된 값) */
  spacing: {
    /** 1-3 items: generous spacing */
    few: { gap: 35, padding: 32 },
    /** 4 items: moderate spacing (검증됨) */
    moderate: { gap: 28, padding: 28 },
    /** 5+ items: compact spacing */
    many: { gap: 22, padding: 22 },
  },
  /** Height estimates for planning */
  heights: {
    /** Title section (title + subtitle + margin) */
    titleSection: 180,
    /** Single list item with icon (approx) */
    listItemWithIcon: 140,
    /** Compact list item */
    listItemCompact: 100,
    /** Footer/CTA section */
    footer: 120,
    /** Available for content (960 - title - footer) */
    contentArea: 660,
  },
} as const;

/**
 * Helper to calculate if content will fit
 * @param itemCount Number of list items
 * @param itemHeight Height per item (including gap)
 * @param hasTitle Whether scene has a title section
 * @param hasFooter Whether scene has a footer/CTA section
 * @returns Whether content fits and recommended scale if not
 */
export function calculateContentFit(
  itemCount: number,
  itemHeight: number,
  hasTitle = true,
  hasFooter = false
): { fits: boolean; requiredScale: number; suggestedItemHeight?: number } {
  const titleHeight = hasTitle ? CONTENT_LIMITS.heights.titleSection : 0;
  const footerHeight = hasFooter ? CONTENT_LIMITS.heights.footer : 0;
  const availableHeight = LAYOUT.contentArea.height - titleHeight - footerHeight;

  const totalContentHeight = itemCount * itemHeight;

  if (totalContentHeight <= availableHeight) {
    return { fits: true, requiredScale: 1 };
  }

  const requiredScale = availableHeight / totalContentHeight;
  const suggestedItemHeight = Math.floor(availableHeight / itemCount);

  return {
    fits: false,
    requiredScale,
    suggestedItemHeight,
  };
}

export default AutoFitContainer;
