import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPRING_CONFIGS } from "../constants";

export interface StepIndicatorProps {
  /** Array of step labels */
  steps: string[];
  /** Current active step (0-indexed) */
  currentStep: number;
  /** Orientation of the indicator (default: "horizontal") */
  orientation?: "horizontal" | "vertical";
  /** Show step labels (default: true) */
  showLabels?: boolean;
  /** Show step numbers (default: true) */
  showNumbers?: boolean;
  /** Color for completed steps */
  completedColor?: string;
  /** Color for active step */
  activeColor?: string;
  /** Color for pending steps */
  pendingColor?: string;
  /** Size of step circles (default: 36) */
  stepSize?: number;
  /** Gap between steps (default: 60) */
  gap?: number;
  /** Whether to animate (default: true) */
  animate?: boolean;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

type StepStatus = "completed" | "active" | "pending";

/**
 * StepIndicator component - Multi-step progress visualization
 *
 * Shows a sequence of steps with completion status.
 *
 * @example
 * ```tsx
 * <StepIndicator
 *   steps={["Start", "Process", "Review", "Complete"]}
 *   currentStep={2}
 * />
 * ```
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  orientation = "horizontal",
  showLabels = true,
  showNumbers = true,
  completedColor = COLORS.success,
  activeColor = COLORS.primary,
  pendingColor = "rgba(255, 255, 255, 0.3)",
  stepSize = 36,
  gap = 60,
  animate = true,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isHorizontal = orientation === "horizontal";

  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const getStepColor = (status: StepStatus): string => {
    switch (status) {
      case "completed":
        return completedColor;
      case "active":
        return activeColor;
      case "pending":
        return pendingColor;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        alignItems: "center",
        gap: 0,
        ...style,
      }}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const color = getStepColor(status);
        const isLast = index === steps.length - 1;

        // Staggered animation
        const progress = animate
          ? spring({
              frame: frame - delay - index * 10,
              fps,
              config: SPRING_CONFIGS.snappy,
            })
          : 1;

        const opacity = interpolate(progress, [0, 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const scale = interpolate(progress, [0, 1], [0.5, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Connector line animation
        const lineProgress = animate
          ? spring({
              frame: frame - delay - index * 10 - 5,
              fps,
              config: SPRING_CONFIGS.normal,
            })
          : 1;

        return (
          <React.Fragment key={index}>
            {/* Step circle and label */}
            <div
              style={{
                display: "flex",
                flexDirection: isHorizontal ? "column" : "row",
                alignItems: "center",
                gap: 8,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: stepSize,
                  height: stepSize,
                  borderRadius: "50%",
                  backgroundColor: status === "pending" ? "transparent" : color,
                  border: `3px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: status === "active" ? `0 0 15px ${color}60` : undefined,
                }}
              >
                {status === "completed" ? (
                  // Checkmark
                  <svg
                    width={stepSize * 0.5}
                    height={stepSize * 0.5}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.white}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : showNumbers ? (
                  <span
                    style={{
                      fontSize: stepSize * 0.4,
                      fontWeight: 700,
                      color: status === "active" ? COLORS.white : color,
                      fontFamily: FONT_FAMILY.body,
                    }}
                  >
                    {index + 1}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              {showLabels && (
                <span
                  style={{
                    fontSize: FONT_SIZES.xs,
                    fontWeight: status === "active" ? 600 : 400,
                    color: status === "pending" ? pendingColor : COLORS.white,
                    fontFamily: FONT_FAMILY.body,
                    textAlign: "center",
                    maxWidth: isHorizontal ? 100 : undefined,
                    whiteSpace: isHorizontal ? "nowrap" : undefined,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {step}
                </span>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  width: isHorizontal ? gap : 3,
                  height: isHorizontal ? 3 : gap,
                  backgroundColor: pendingColor,
                  position: "relative",
                  overflow: "hidden",
                  marginLeft: isHorizontal ? 0 : (stepSize - 3) / 2,
                  marginTop: isHorizontal ? -(showLabels ? 28 : 0) : 0,
                }}
              >
                {/* Filled portion for completed steps */}
                {index < currentStep && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: isHorizontal ? `${lineProgress * 100}%` : "100%",
                      height: isHorizontal ? "100%" : `${lineProgress * 100}%`,
                      backgroundColor: completedColor,
                    }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
