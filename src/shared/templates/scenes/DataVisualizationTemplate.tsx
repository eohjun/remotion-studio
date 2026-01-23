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
import { progressRing } from "../animations/svg";
import type { BaseSceneProps, DataItem } from "./types";

export interface DataVisualizationTemplateProps extends BaseSceneProps {
  /** Section label (small text above title) */
  sectionLabel?: string;
  /** Main title */
  title: string;
  /** Title icon */
  titleIcon?: string;
  /** Chart type */
  chartType: "bar" | "horizontalBar" | "progress" | "metric";
  /** Data items */
  data: DataItem[];
  /** Show values on chart (default: true) */
  showValues?: boolean;
  /** Show labels (default: true) */
  showLabels?: boolean;
  /** Default bar color */
  barColor?: string;
  /** Max value for scaling (auto-calculated if not provided) */
  maxValue?: number;
  /** Data source attribution */
  source?: string;
  /** Index of item to highlight */
  highlight?: number;
  /** Background color */
  backgroundColor?: string;
}

// Sub-component: Bar Chart (Vertical)
const BarChart: React.FC<{
  data: DataItem[];
  maxValue: number;
  barColor: string;
  showValues: boolean;
  showLabels: boolean;
  highlight?: number;
  frame: number;
  fps: number;
}> = ({
  data,
  maxValue,
  barColor,
  showValues,
  showLabels,
  highlight,
  frame,
  fps,
}) => {
  // Increased sizes for better visibility on 1920x1080
  const barWidth = Math.min(160, (1400 - data.length * 40) / data.length);
  const maxBarHeight = 500;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 60,
        height: maxBarHeight + 120,
        width: "100%",
      }}
    >
      {data.map((item, i) => {
        const barProgress = spring({
          frame: frame - 40 - i * 8,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        const barHeight = (item.value / maxValue) * maxBarHeight * barProgress;
        const isHighlighted = highlight === i;
        const itemColor = item.color || barColor;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Value Label */}
            {showValues && (
              <div
                style={{
                  opacity: interpolate(barProgress, [0.5, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  fontSize: FONT_SIZES.xl,
                  fontWeight: 700,
                  color: isHighlighted ? itemColor : COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {item.value}
              </div>
            )}
            {/* Bar */}
            <div
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: itemColor,
                borderRadius: `${RADIUS.sm}px ${RADIUS.sm}px 0 0`,
                opacity: isHighlighted ? 1 : 0.8,
                boxShadow: isHighlighted
                  ? `0 0 20px ${itemColor}60`
                  : undefined,
              }}
            />
            {/* Label */}
            {showLabels && (
              <div
                style={{
                  opacity: interpolate(barProgress, [0, 0.5], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  fontSize: FONT_SIZES.lg,
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "center",
                  maxWidth: barWidth + 60,
                }}
              >
                {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: Horizontal Bar Chart
const HorizontalBarChart: React.FC<{
  data: DataItem[];
  maxValue: number;
  barColor: string;
  showValues: boolean;
  showLabels: boolean;
  highlight?: number;
  frame: number;
  fps: number;
}> = ({
  data,
  maxValue,
  barColor,
  showValues,
  showLabels,
  highlight,
  frame,
  fps,
}) => {
  // Increased sizes for better visibility on 1920x1080
  const maxBarWidth = 1000;
  const barHeight = Math.min(80, 500 / data.length);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 40,
        width: "100%",
        maxWidth: 1400,
      }}
    >
      {data.map((item, i) => {
        const barProgress = spring({
          frame: frame - 40 - i * 10,
          fps,
          config: SPRING_CONFIGS.normal,
        });
        const barWidth = (item.value / maxValue) * maxBarWidth * barProgress;
        const isHighlighted = highlight === i;
        const itemColor = item.color || barColor;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
            }}
          >
            {/* Label */}
            {showLabels && (
              <div
                style={{
                  width: 220,
                  fontSize: FONT_SIZES.lg,
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "right",
                  opacity: interpolate(barProgress, [0, 0.3], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                {item.label}
              </div>
            )}
            {/* Bar Container */}
            <div
              style={{
                flex: 1,
                height: barHeight,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: RADIUS.sm,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: barWidth,
                  height: "100%",
                  backgroundColor: itemColor,
                  borderRadius: RADIUS.sm,
                  opacity: isHighlighted ? 1 : 0.85,
                  boxShadow: isHighlighted
                    ? `0 0 15px ${itemColor}50`
                    : undefined,
                }}
              />
            </div>
            {/* Value */}
            {showValues && (
              <div
                style={{
                  width: 100,
                  fontSize: FONT_SIZES.xl,
                  fontWeight: 700,
                  color: isHighlighted ? itemColor : COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                  opacity: interpolate(barProgress, [0.6, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {item.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: Progress Ring Chart
const ProgressChart: React.FC<{
  data: DataItem[];
  barColor: string;
  showValues: boolean;
  showLabels: boolean;
  highlight?: number;
  frame: number;
  fps: number;
}> = ({ data, barColor, showValues, showLabels, highlight, frame, fps }) => {
  // Increased sizes for better visibility on 1920x1080
  const ringSize = 220;
  const strokeWidth = 20;
  const radius = (ringSize - strokeWidth) / 2;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 80,
        maxWidth: 1400,
      }}
    >
      {data.map((item, i) => {
        const progress = spring({
          frame: frame - 40 - i * 12,
          fps,
          config: { ...SPRING_CONFIGS.normal, damping: 100 },
        });
        const ringProgress = Math.min(item.value / 100, 1) * progress;
        const isHighlighted = highlight === i;
        const itemColor = item.color || barColor;
        const ringStyle = progressRing(ringProgress, radius);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ position: "relative", width: ringSize, height: ringSize }}>
              <svg
                width={ringSize}
                height={ringSize}
                style={{ transform: "rotate(-90deg)" }}
              >
                {/* Background Circle */}
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={strokeWidth}
                />
                {/* Progress Circle */}
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  fill="none"
                  stroke={itemColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  style={{
                    ...ringStyle,
                    filter: isHighlighted ? `drop-shadow(0 0 8px ${itemColor})` : undefined,
                  }}
                />
              </svg>
              {/* Center Value */}
              {showValues && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: FONT_SIZES["2xl"],
                    fontWeight: 700,
                    color: isHighlighted ? itemColor : COLORS.white,
                    fontFamily: FONT_FAMILY.title,
                    opacity: interpolate(progress, [0.5, 1], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {Math.round(item.value)}%
                </div>
              )}
            </div>
            {/* Label */}
            {showLabels && (
              <div
                style={{
                  fontSize: FONT_SIZES.lg,
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "center",
                  opacity: interpolate(progress, [0, 0.5], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Sub-component: Metric Display
const MetricChart: React.FC<{
  data: DataItem[];
  barColor: string;
  showLabels: boolean;
  highlight?: number;
  frame: number;
  fps: number;
}> = ({ data, barColor, showLabels, highlight, frame, fps }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 100,
        maxWidth: 1600,
      }}
    >
      {data.map((item, i) => {
        const progress = spring({
          frame: frame - 40 - i * 15,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const countProgress = interpolate(progress, [0, 1], [0, item.value], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isHighlighted = highlight === i;
        const itemColor = item.color || barColor;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: interpolate(progress, [0, 0.3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(progress, [0, 1], [0.8, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
            }}
          >
            {/* Icon */}
            {item.icon && (
              <div style={{ fontSize: FONT_SIZES["3xl"], marginBottom: 8 }}>
                {item.icon}
              </div>
            )}
            {/* Value */}
            <div
              style={{
                fontSize: FONT_SIZES["4xl"] + 20,
                fontWeight: 800,
                color: isHighlighted ? itemColor : COLORS.white,
                fontFamily: FONT_FAMILY.title,
                textShadow: isHighlighted
                  ? `0 0 40px ${itemColor}80`
                  : undefined,
              }}
            >
              {Math.round(countProgress).toLocaleString()}
            </div>
            {/* Label */}
            {showLabels && (
              <div
                style={{
                  fontSize: FONT_SIZES.xl,
                  color: isHighlighted ? COLORS.white : COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "center",
                }}
              >
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const DataVisualizationTemplate: React.FC<DataVisualizationTemplateProps> = ({
  sectionLabel,
  title,
  titleIcon,
  chartType,
  data,
  showValues = true,
  showLabels = true,
  barColor = COLORS.primary,
  maxValue: providedMaxValue,
  source,
  highlight,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate max value from data if not provided
  const maxValue =
    providedMaxValue || Math.max(...data.map((d) => d.value)) * 1.1;

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
              fontSize: FONT_SIZES.sm,
              color: COLORS.accent,
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

      {/* Chart Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {chartType === "bar" && (
          <BarChart
            data={data}
            maxValue={maxValue}
            barColor={barColor}
            showValues={showValues}
            showLabels={showLabels}
            highlight={highlight}
            frame={frame}
            fps={fps}
          />
        )}
        {chartType === "horizontalBar" && (
          <HorizontalBarChart
            data={data}
            maxValue={maxValue}
            barColor={barColor}
            showValues={showValues}
            showLabels={showLabels}
            highlight={highlight}
            frame={frame}
            fps={fps}
          />
        )}
        {chartType === "progress" && (
          <ProgressChart
            data={data}
            barColor={barColor}
            showValues={showValues}
            showLabels={showLabels}
            highlight={highlight}
            frame={frame}
            fps={fps}
          />
        )}
        {chartType === "metric" && (
          <MetricChart
            data={data}
            barColor={barColor}
            showLabels={showLabels}
            highlight={highlight}
            frame={frame}
            fps={fps}
          />
        )}
      </div>

      {/* Source Attribution */}
      {source && (
        <div
          style={{
            opacity: interpolate(sourceProgress, [0, 1], [0, 0.7]),
            fontSize: FONT_SIZES.xs,
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

export default DataVisualizationTemplate;
