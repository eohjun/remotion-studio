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
import { AnimatedText, fadeInUp, scaleIn, combine } from "../animations";
import type { BaseSceneProps } from "./types";

/**
 * Display mode for TableListTemplate
 */
export type DisplayMode = "table" | "list" | "grid";

/**
 * Table row data
 */
export interface TableRow {
  cells: string[];
  highlight?: boolean;
  icon?: string;
  color?: string;
}

/**
 * List item data
 */
export interface ListItem {
  text: string;
  subtext?: string;
  icon?: string;
  badge?: string;
  highlight?: boolean;
  color?: string;
}

export interface TableListTemplateProps extends BaseSceneProps {
  /** Section label (small text above title) */
  sectionLabel?: string;
  /** Section label color */
  sectionLabelColor?: string;
  /** Main title */
  title: string;
  /** Title icon */
  titleIcon?: string;
  /** Display mode */
  displayMode: DisplayMode;
  /** Table headers (for table mode) */
  headers?: string[];
  /** Table rows (for table mode) */
  rows?: TableRow[];
  /** List items (for list and grid modes) */
  items?: ListItem[];
  /** Number of columns (for grid mode, default: 2) */
  gridColumns?: number;
  /** Show row/item numbers */
  showNumbers?: boolean;
  /** Highlight color */
  highlightColor?: string;
  /** Stagger animation delay between items (frames) */
  staggerDelay?: number;
  /** Source attribution */
  source?: string;
  /** Background color */
  backgroundColor?: string;
  /** Compact mode - reduces spacing for more items (default: auto based on item count) */
  compact?: boolean | "auto";
}

// Sub-component: Table Display
const TableDisplay: React.FC<{
  headers?: string[];
  rows: TableRow[];
  showNumbers: boolean;
  highlightColor: string;
  staggerDelay: number;
  frame: number;
  fps: number;
}> = ({ headers, rows, showNumbers, highlightColor, staggerDelay, frame, fps }) => {
  const hasHeaders = headers && headers.length > 0;
  const columnCount = hasHeaders
    ? headers.length
    : Math.max(...rows.map(r => r.cells.length));

  const baseDelay = 40;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1600,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: RADIUS.lg,
        overflow: "hidden",
      }}
    >
      {/* Header Row */}
      {hasHeaders && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showNumbers
              ? `60px repeat(${columnCount}, 1fr)`
              : `repeat(${columnCount}, 1fr)`,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderBottom: "2px solid rgba(255,255,255,0.1)",
          }}
        >
          {showNumbers && (
            <div
              style={{
                padding: `${SPACING.md}px ${SPACING.sm}px`,
                fontSize: FONT_SIZES.md,
                fontWeight: 600,
                color: COLORS.light,
                fontFamily: FONT_FAMILY.body,
                textAlign: "center",
              }}
            >
              #
            </div>
          )}
          {headers.map((header, i) => {
            const headerProgress = spring({
              frame: frame - baseDelay - i * 3,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            return (
              <div
                key={i}
                style={{
                  padding: `${SPACING.md}px ${SPACING.sm}px`,
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 700,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.title,
                  opacity: interpolate(headerProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(headerProgress, [0, 1], [10, 0])}px)`,
                }}
              >
                {header}
              </div>
            );
          })}
        </div>
      )}

      {/* Data Rows */}
      {rows.map((row, rowIndex) => {
        const rowProgress = spring({
          frame: frame - baseDelay - (hasHeaders ? 20 : 0) - rowIndex * staggerDelay,
          fps,
          config: SPRING_CONFIGS.normal,
        });
        const isHighlighted = row.highlight;
        const rowColor = row.color || highlightColor;

        return (
          <div
            key={rowIndex}
            style={{
              display: "grid",
              gridTemplateColumns: showNumbers
                ? `60px repeat(${columnCount}, 1fr)`
                : `repeat(${columnCount}, 1fr)`,
              backgroundColor: isHighlighted
                ? `${rowColor}20`
                : rowIndex % 2 === 0
                ? "transparent"
                : "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              opacity: interpolate(rowProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(rowProgress, [0, 1], [-20, 0])}px)`,
            }}
          >
            {showNumbers && (
              <div
                style={{
                  padding: `${SPACING.sm}px`,
                  fontSize: FONT_SIZES.md,
                  fontWeight: 600,
                  color: isHighlighted ? rowColor : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                {rowIndex + 1}
              </div>
            )}
            {row.cells.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                style={{
                  padding: `${SPACING.sm}px`,
                  fontSize: FONT_SIZES.lg,
                  color: isHighlighted && cellIndex === 0 ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  fontWeight: isHighlighted && cellIndex === 0 ? 600 : 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {cellIndex === 0 && row.icon && (
                  <span style={{ marginRight: 4 }}>{row.icon}</span>
                )}
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: List Display
const ListDisplay: React.FC<{
  items: ListItem[];
  showNumbers: boolean;
  highlightColor: string;
  staggerDelay: number;
  frame: number;
  fps: number;
  compact: boolean;
}> = ({ items, showNumbers, highlightColor, staggerDelay, frame, fps, compact }) => {
  const baseDelay = 40;

  // Compact mode sizing
  const gap = compact ? SPACING.xs : SPACING.md;
  const padding = compact ? SPACING.sm : SPACING.md;
  const numberSize = compact ? 36 : 50;
  const numberFontSize = compact ? FONT_SIZES.md : FONT_SIZES.lg;
  const textFontSize = compact ? FONT_SIZES.lg : FONT_SIZES.xl;
  const subtextFontSize = compact ? FONT_SIZES.sm : FONT_SIZES.md;
  const iconFontSize = compact ? FONT_SIZES.xl : FONT_SIZES["2xl"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        width: "100%",
        maxWidth: 1400,
      }}
    >
      {items.map((item, index) => {
        const itemProgress = spring({
          frame: frame - baseDelay - index * staggerDelay,
          fps,
          config: SPRING_CONFIGS.normal,
        });
        const isHighlighted = item.highlight;
        const itemColor = item.color || highlightColor;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? SPACING.sm : SPACING.md,
              padding,
              backgroundColor: isHighlighted
                ? `${itemColor}20`
                : "rgba(255,255,255,0.05)",
              borderRadius: RADIUS.md,
              borderLeft: isHighlighted ? `4px solid ${itemColor}` : "4px solid transparent",
              opacity: interpolate(itemProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(itemProgress, [0, 1], [-30, 0])}px)`,
            }}
          >
            {/* Number or Icon */}
            {showNumbers && (
              <div
                style={{
                  width: numberSize,
                  height: numberSize,
                  borderRadius: "50%",
                  backgroundColor: isHighlighted ? itemColor : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: numberFontSize,
                  fontWeight: 700,
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.title,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>
            )}
            {!showNumbers && item.icon && (
              <div
                style={{
                  fontSize: iconFontSize,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
            )}

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: textFontSize,
                  fontWeight: 600,
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {item.text}
              </div>
              {item.subtext && (
                <div
                  style={{
                    fontSize: subtextFontSize,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: FONT_FAMILY.body,
                    marginTop: compact ? 2 : 4,
                  }}
                >
                  {item.subtext}
                </div>
              )}
            </div>

            {/* Badge */}
            {item.badge && (
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: isHighlighted ? itemColor : "rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  fontSize: FONT_SIZES.sm,
                  fontWeight: 600,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {item.badge}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: Grid Display
const GridDisplay: React.FC<{
  items: ListItem[];
  gridColumns: number;
  showNumbers: boolean;
  highlightColor: string;
  staggerDelay: number;
  frame: number;
  fps: number;
  compact: boolean;
}> = ({ items, gridColumns, showNumbers, highlightColor, staggerDelay, frame, fps, compact }) => {
  const baseDelay = 40;

  // Compact mode sizing
  const gridGap = compact ? SPACING.sm : SPACING.lg;
  const cellPadding = compact ? SPACING.md : SPACING.lg;
  const numberSize = compact ? 44 : 60;
  const iconFontSize = compact ? FONT_SIZES["2xl"] : FONT_SIZES["3xl"];
  const textFontSize = compact ? FONT_SIZES.lg : FONT_SIZES.xl;
  const subtextFontSize = compact ? FONT_SIZES.sm : FONT_SIZES.md;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: gridGap,
        width: "100%",
        maxWidth: 1600,
      }}
    >
      {items.map((item, index) => {
        const itemProgress = spring({
          frame: frame - baseDelay - index * staggerDelay,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        const isHighlighted = item.highlight;
        const itemColor = item.color || highlightColor;

        return (
          <div
            key={index}
            style={{
              padding: cellPadding,
              backgroundColor: isHighlighted
                ? `${itemColor}15`
                : "rgba(255,255,255,0.05)",
              borderRadius: RADIUS.lg,
              border: isHighlighted
                ? `2px solid ${itemColor}`
                : "2px solid transparent",
              opacity: interpolate(itemProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(itemProgress, [0, 1], [0.8, 1])})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: compact ? SPACING.xs : SPACING.sm,
              textAlign: "center",
            }}
          >
            {/* Icon or Number */}
            {item.icon ? (
              <div style={{ fontSize: iconFontSize }}>{item.icon}</div>
            ) : showNumbers ? (
              <div
                style={{
                  width: numberSize,
                  height: numberSize,
                  borderRadius: "50%",
                  backgroundColor: isHighlighted ? itemColor : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: compact ? FONT_SIZES.lg : FONT_SIZES.xl,
                  fontWeight: 700,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                {index + 1}
              </div>
            ) : null}

            {/* Text */}
            <div
              style={{
                fontSize: textFontSize,
                fontWeight: 600,
                color: isHighlighted ? COLORS.white : COLORS.light,
                fontFamily: FONT_FAMILY.body,
              }}
            >
              {item.text}
            </div>

            {/* Subtext */}
            {item.subtext && (
              <div
                style={{
                  fontSize: subtextFontSize,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {item.subtext}
              </div>
            )}

            {/* Badge */}
            {item.badge && (
              <div
                style={{
                  padding: compact ? "4px 10px" : "6px 12px",
                  backgroundColor: isHighlighted ? itemColor : "rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  fontSize: FONT_SIZES.sm,
                  fontWeight: 600,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                  marginTop: compact ? 0 : SPACING.xs,
                }}
              >
                {item.badge}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TableListTemplate: React.FC<TableListTemplateProps> = ({
  sectionLabel,
  sectionLabelColor = COLORS.accent,
  title,
  titleIcon,
  displayMode,
  headers,
  rows = [],
  items = [],
  gridColumns = 2,
  showNumbers = false,
  highlightColor = COLORS.primary,
  staggerDelay = 8,
  source,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
  compact: compactProp = "auto",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate compact mode: auto enables compact when 5+ items
  const itemCount = displayMode === "table" ? rows.length : items.length;
  const isCompact = compactProp === "auto" ? itemCount >= 5 : compactProp;

  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const sourceProgress = spring({
    frame: frame - 110,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

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
      {/* Header */}
      <div
        style={{
          opacity: interpolate(titleProgress, [0, 1], [0, 1]),
          marginBottom: SPACING.lg,
        }}
      >
        {sectionLabel && (
          <AnimatedText
            text={sectionLabel}
            animation={fadeInUp(15)}
            stagger="none"
            delay={0}
            style={{
              fontSize: FONT_SIZES.lg,
              color: sectionLabelColor,
              fontFamily: FONT_FAMILY.body,
              marginBottom: 8,
            }}
          />
        )}
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
          }}
        >
          {titleIcon && <span style={{ marginRight: 12 }}>{titleIcon}</span>}
          <AnimatedText
            text={title}
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={10}
            style={{ fontWeight: 700 }}
          />
        </h2>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {displayMode === "table" && (
          <TableDisplay
            headers={headers}
            rows={rows}
            showNumbers={showNumbers}
            highlightColor={highlightColor}
            staggerDelay={staggerDelay}
            frame={frame}
            fps={fps}
          />
        )}
        {displayMode === "list" && (
          <ListDisplay
            items={items}
            showNumbers={showNumbers}
            highlightColor={highlightColor}
            staggerDelay={staggerDelay}
            frame={frame}
            fps={fps}
            compact={isCompact}
          />
        )}
        {displayMode === "grid" && (
          <GridDisplay
            items={items}
            gridColumns={gridColumns}
            showNumbers={showNumbers}
            highlightColor={highlightColor}
            staggerDelay={staggerDelay}
            frame={frame}
            fps={fps}
            compact={isCompact}
          />
        )}
      </div>

      {/* Source Attribution */}
      {source && (
        <div
          style={{
            opacity: interpolate(sourceProgress, [0, 1], [0, 0.7]),
            fontSize: FONT_SIZES.sm,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
            textAlign: "right",
            marginTop: SPACING.md,
          }}
        >
          Source: {source}
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

export default TableListTemplate;
