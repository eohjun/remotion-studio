import React from "react";
import {
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SPRING_CONFIGS,
  TEXT_STYLES,
} from "../constants";

export interface CycleStep {
  /** Step text (supports \n for explicit line breaks) */
  text: string;
  /** Emoji or icon */
  icon?: string;
  /** Custom color for this step */
  color?: string;
}

export interface CycleDiagramProps {
  /** Steps in the cycle (2-8 recommended) */
  steps: CycleStep[];
  /** Center label text */
  centerLabel?: string;
  /** Diagram size preset */
  size?: "small" | "medium" | "large" | "auto";
  /** Primary color for the cycle ring */
  color?: string;
  /** Enable rotation animation */
  animated?: boolean;
  /** Animation speed multiplier (default: 1) */
  animationSpeed?: number;
  /** Font size for step text */
  fontSize?: "sm" | "md" | "lg" | "xl";
  /** Language for text styling */
  language?: "ko" | "en" | "auto";
  /** Custom style overrides */
  style?: React.CSSProperties;
}

// Size presets
// Note: diagram size includes padding for step boxes that extend beyond the circle radius
// Visual height = diagram size (step boxes are contained within)
const SIZE_PRESETS = {
  small: { diagram: 400, radius: 120, boxWidth: 110, iconSize: 32, fontSize: "md" as const },
  medium: { diagram: 500, radius: 160, boxWidth: 140, iconSize: 40, fontSize: "lg" as const },
  large: { diagram: 650, radius: 210, boxWidth: 170, iconSize: 48, fontSize: "xl" as const },
};

type SizePreset = { diagram: number; radius: number; boxWidth: number; iconSize: number; fontSize: "sm" | "md" | "lg" | "xl" };

// Calculate auto size based on step count
const getAutoSize = (stepCount: number): SizePreset => {
  if (stepCount <= 3) return SIZE_PRESETS.small;
  if (stepCount <= 5) return SIZE_PRESETS.medium;
  return SIZE_PRESETS.large;
};

// Default font size fallback
const DEFAULT_FONT_SIZE = "lg" as const;

// Detect if text contains Korean characters
const containsKorean = (text: string): boolean => {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
};

export const CycleDiagram: React.FC<CycleDiagramProps> = ({
  steps,
  centerLabel,
  size = "auto",
  color = COLORS.accent,
  animated = true,
  animationSpeed = 1,
  fontSize = "lg",
  language = "auto",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine sizes
  const sizes = size === "auto" ? getAutoSize(steps.length) : SIZE_PRESETS[size];
  const { diagram: diagramSize, radius, boxWidth, iconSize, fontSize: presetFontSize } = sizes;
  const actualFontSize = fontSize !== "lg" ? fontSize : presetFontSize || DEFAULT_FONT_SIZE;
  const centerX = diagramSize / 2;
  const centerY = diagramSize / 2;

  // Rotation animation
  const rotation = animated
    ? interpolate(frame, [0, 300], [0, 360 * animationSpeed], { extrapolateRight: "clamp" })
    : 0;

  // Calculate angle between steps
  const angleStep = 360 / steps.length;

  // Determine text style based on language
  const getTextStyle = (text: string): React.CSSProperties => {
    const isKorean = language === "ko" || (language === "auto" && containsKorean(text));
    return isKorean ? TEXT_STYLES.korean : TEXT_STYLES.default;
  };

  return (
    <div
      style={{
        position: "relative",
        width: diagramSize,
        height: diagramSize,
        margin: "0 auto",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Rotating dashed circle */}
      <svg
        width={diagramSize}
        height={diagramSize}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `rotate(${rotation * 0.1}deg)`,
        }}
      >
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray="25,12"
          opacity="0.6"
        />
      </svg>

      {/* Center label */}
      {centerLabel && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZES["2xl"],
              fontWeight: 700,
              color: color,
              fontFamily: FONT_FAMILY.title,
              ...getTextStyle(centerLabel),
            }}
          >
            {centerLabel}
          </span>
        </div>
      )}

      {/* Cycle steps */}
      {steps.map((step, i) => {
        const progress = spring({
          frame: frame - 30 - i * 15,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        // Calculate position (start from top, go clockwise)
        const angle = i * angleStep - 90; // -90 to start from top
        const radian = angle * (Math.PI / 180);
        const x = centerX + Math.cos(radian) * radius;
        const y = centerY + Math.sin(radian) * radius;

        const stepColor = step.color || COLORS.white;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - boxWidth / 2,
              top: y - (iconSize + 40) / 2,
              width: boxWidth,
              maxHeight: diagramSize / 3,
              overflow: "hidden",
              textAlign: "center",
              opacity: interpolate(progress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
            }}
          >
            {step.icon && (
              <div style={{ fontSize: iconSize, marginBottom: 8 }}>
                {step.icon}
              </div>
            )}
            <div
              style={{
                fontSize: FONT_SIZES[actualFontSize],
                fontWeight: 600,
                color: stepColor,
                fontFamily: FONT_FAMILY.body,
                whiteSpace: "pre-line",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                ...getTextStyle(step.text),
              }}
            >
              {step.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CycleDiagram;
