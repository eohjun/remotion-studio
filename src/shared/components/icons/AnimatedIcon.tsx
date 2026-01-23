import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Icon, IconProps } from "./Icon";
import { SPRING_CONFIGS } from "../constants";

export interface AnimatedIconProps extends Omit<IconProps, "animate"> {
  /** Entry animation type (default: "fadeIn") */
  animation?: "fadeIn" | "scaleIn" | "slideIn" | "popIn" | "none";
  /** Slide direction when using slideIn animation */
  slideDirection?: "up" | "down" | "left" | "right";
  /** Slide distance in pixels (default: 20) */
  slideDistance?: number;
  /** Animation delay in frames (default: 0) */
  delay?: number;
  /** Continuous animation (passed to Icon) */
  continuousAnimation?: IconProps["animate"];
}

/**
 * AnimatedIcon component - Icon with entry animations
 *
 * Extends the Icon component with animated entry effects.
 *
 * @example
 * ```tsx
 * <AnimatedIcon name="Check" animation="scaleIn" />
 * <AnimatedIcon name="ArrowRight" animation="slideIn" slideDirection="left" />
 * <AnimatedIcon name="Loader" animation="fadeIn" continuousAnimation="spin" />
 * ```
 */
export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  animation = "fadeIn",
  slideDirection = "up",
  slideDistance = 20,
  delay = 0,
  continuousAnimation = "none",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate animation progress
  const progress = spring({
    frame: frame - delay,
    fps,
    config: animation === "popIn" ? SPRING_CONFIGS.bouncy : SPRING_CONFIGS.snappy,
  });

  // Calculate animated styles based on animation type
  const getAnimatedStyle = (): React.CSSProperties => {
    switch (animation) {
      case "fadeIn":
        return {
          opacity: interpolate(progress, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        };

      case "scaleIn": {
        const scale = interpolate(progress, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(progress, [0, 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return {
          opacity,
          transform: `scale(${scale})`,
        };
      }

      case "slideIn": {
        const opacity = interpolate(progress, [0, 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        let translateX = 0;
        let translateY = 0;

        switch (slideDirection) {
          case "up":
            translateY = interpolate(progress, [0, 1], [slideDistance, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            break;
          case "down":
            translateY = interpolate(progress, [0, 1], [-slideDistance, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            break;
          case "left":
            translateX = interpolate(progress, [0, 1], [slideDistance, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            break;
          case "right":
            translateX = interpolate(progress, [0, 1], [-slideDistance, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            break;
        }

        return {
          opacity,
          transform: `translate(${translateX}px, ${translateY}px)`,
        };
      }

      case "popIn": {
        const scale = interpolate(progress, [0, 1], [0.3, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return {
          opacity,
          transform: `scale(${scale})`,
        };
      }

      case "none":
      default:
        return {};
    }
  };

  const animatedStyle = getAnimatedStyle();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...animatedStyle,
      }}
    >
      <Icon
        name={name}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        animate={continuousAnimation}
        style={style}
      />
    </div>
  );
};

export default AnimatedIcon;
