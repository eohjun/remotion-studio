import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import * as LucideIcons from "lucide-react";
import { COLORS } from "../constants";

// Get all icon names from lucide-react
type LucideIconName = keyof typeof LucideIcons;

// Filter to only get actual icon components (they are PascalCase and are functions)
const isIconComponent = (key: string): key is LucideIconName => {
  const value = LucideIcons[key as LucideIconName];
  return (
    typeof value === "function" &&
    key[0] === key[0].toUpperCase() &&
    key !== "createLucideIcon" &&
    !key.startsWith("Lucide")
  );
};

export interface IconProps {
  /** Lucide icon name (e.g., "Check", "ArrowRight", "Home") */
  name: string;
  /** Size in pixels (default: 24) */
  size?: number;
  /** Icon color */
  color?: string;
  /** Stroke width (default: 2) */
  strokeWidth?: number;
  /** Continuous animation type */
  animate?: "spin" | "pulse" | "bounce" | "none";
  /** Animation duration in frames for continuous animations (default: 60) */
  animationDuration?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * Icon component - Lucide icon wrapper with animations
 *
 * Wraps Lucide icons with optional continuous animations.
 *
 * @example
 * ```tsx
 * <Icon name="Check" size={32} color={COLORS.success} />
 * <Icon name="Loader" animate="spin" />
 * <Icon name="Heart" animate="pulse" color={COLORS.danger} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = COLORS.white,
  strokeWidth = 2,
  animate = "none",
  animationDuration = 60,
  style,
}) => {
  const frame = useCurrentFrame();
  useVideoConfig(); // Hook must be called but fps not needed

  // Find the icon component
  const IconComponent = useMemo(() => {
    // Try exact match first
    if (isIconComponent(name) && LucideIcons[name]) {
      return LucideIcons[name] as React.FC<LucideIcons.LucideProps>;
    }

    // Try with common variations
    const variations = [
      name,
      name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), // kebab-case to PascalCase
    ];

    for (const variation of variations) {
      if (isIconComponent(variation) && LucideIcons[variation]) {
        return LucideIcons[variation] as React.FC<LucideIcons.LucideProps>;
      }
    }

    // Default to a placeholder icon
    console.warn(`Icon "${name}" not found in lucide-react`);
    return LucideIcons.HelpCircle as React.FC<LucideIcons.LucideProps>;
  }, [name]);

  // Calculate animation styles
  const animationStyles = useMemo((): React.CSSProperties => {
    const loopFrame = frame % animationDuration;
    const progress = loopFrame / animationDuration;

    switch (animate) {
      case "spin":
        return {
          transform: `rotate(${progress * 360}deg)`,
        };

      case "pulse": {
        const scale = interpolate(
          Math.sin(progress * Math.PI * 2),
          [-1, 1],
          [0.8, 1.2]
        );
        return {
          transform: `scale(${scale})`,
        };
      }

      case "bounce": {
        const y = interpolate(
          Math.abs(Math.sin(progress * Math.PI * 2)),
          [0, 1],
          [0, -8]
        );
        return {
          transform: `translateY(${y}px)`,
        };
      }

      case "none":
      default:
        return {};
    }
  }, [animate, frame, animationDuration]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...animationStyles,
        ...style,
      }}
    >
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

// Export icon names for type checking
export const iconNames = Object.keys(LucideIcons).filter(isIconComponent);

export default Icon;
