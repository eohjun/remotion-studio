import React, { Children, cloneElement, isValidElement } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * Stagger direction options
 */
export type StaggerDirection =
  | "forward"
  | "reverse"
  | "center-out"
  | "edges-in"
  | "random";

/**
 * Animation type for staggered children
 */
export type StaggerAnimation =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "pop"
  | "flip"
  | "none";

/**
 * Props for StaggerGroup
 */
export interface StaggerGroupProps {
  /** Children elements to stagger */
  children: React.ReactNode;
  /** Delay between each child in frames (default: 5) */
  staggerDelay?: number;
  /** Direction of stagger animation */
  direction?: StaggerDirection;
  /** Animation type to apply to each child */
  animation?: StaggerAnimation;
  /** Starting frame for the animation (default: 0) */
  from?: number;
  /** Animation duration per child in frames (default: 20) */
  duration?: number;
  /** Spring configuration for physics-based animation */
  springConfig?: {
    damping?: number;
    mass?: number;
    stiffness?: number;
  };
  /** Custom animation render function */
  renderAnimation?: (progress: number, index: number) => React.CSSProperties;
  /** Additional className for the container */
  className?: string;
  /** Container style */
  style?: React.CSSProperties;
}

/**
 * Get animation styles based on type and progress
 */
function getAnimationStyles(
  animation: StaggerAnimation,
  progress: number
): React.CSSProperties {
  const opacity = progress;
  const distance = 30;

  switch (animation) {
    case "fade":
      return { opacity };

    case "slide-up":
      return {
        opacity,
        transform: `translateY(${(1 - progress) * distance}px)`,
      };

    case "slide-down":
      return {
        opacity,
        transform: `translateY(${(1 - progress) * -distance}px)`,
      };

    case "slide-left":
      return {
        opacity,
        transform: `translateX(${(1 - progress) * distance}px)`,
      };

    case "slide-right":
      return {
        opacity,
        transform: `translateX(${(1 - progress) * -distance}px)`,
      };

    case "scale":
      return {
        opacity,
        transform: `scale(${0.8 + progress * 0.2})`,
      };

    case "pop": {
      // Pop with overshoot
      const scaleValue =
        progress < 0.7
          ? (progress / 0.7) * 1.1
          : 1.1 - 0.1 * ((progress - 0.7) / 0.3);
      return {
        opacity: Math.min(progress * 1.5, 1),
        transform: `scale(${scaleValue})`,
      };
    }

    case "flip":
      return {
        opacity,
        transform: `perspective(500px) rotateX(${(1 - progress) * -90}deg)`,
        transformOrigin: "center top",
      };

    case "none":
    default:
      return {};
  }
}

/**
 * Calculate stagger order indices based on direction
 */
function getStaggerOrder(
  count: number,
  direction: StaggerDirection,
  seed?: number
): number[] {
  const indices = Array.from({ length: count }, (_, i) => i);

  switch (direction) {
    case "reverse":
      return indices.reverse();

    case "center-out": {
      const center = Math.floor(count / 2);
      const result: number[] = [];
      for (let i = 0; i <= center; i++) {
        if (center - i >= 0) result.push(center - i);
        if (center + i < count && i !== 0) result.push(center + i);
      }
      return result.map((_, i) => {
        const idx = result.indexOf(i);
        return idx !== -1 ? idx : i;
      });
    }

    case "edges-in": {
      const result: number[] = [];
      let left = 0;
      let right = count - 1;
      while (left <= right) {
        if (left === right) {
          result.push(left);
        } else {
          result.push(left);
          result.push(right);
        }
        left++;
        right--;
      }
      return result.map((_, i) => {
        const idx = result.indexOf(i);
        return idx !== -1 ? idx : i;
      });
    }

    case "random": {
      const shuffled = [...indices];
      const random =
        seed !== undefined
          ? (i: number) => Math.abs(Math.sin(seed + i) * 10000) % 1
          : Math.random;

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random(i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    case "forward":
    default:
      return indices;
  }
}

/**
 * StaggerGroup - Animate children with staggered timing
 *
 * Wraps children and applies staggered entrance animations.
 * Useful for lists, grids, or any group of elements that should
 * animate in sequence.
 *
 * @example
 * ```tsx
 * <StaggerGroup
 *   staggerDelay={5}
 *   direction="forward"
 *   animation="slide-up"
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerGroup>
 * ```
 */
export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  staggerDelay = 5,
  direction = "forward",
  animation = "fade",
  from = 0,
  duration = 20,
  springConfig,
  renderAnimation,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const childArray = Children.toArray(children);
  const childCount = childArray.length;

  // Get stagger order based on direction
  const staggerOrder = getStaggerOrder(childCount, direction, frame);

  // Map each child to its stagger position
  const positionMap = new Map<number, number>();
  staggerOrder.forEach((originalIndex, staggerPosition) => {
    positionMap.set(originalIndex, staggerPosition);
  });

  return (
    <div className={className} style={style}>
      {childArray.map((child, index) => {
        // Get this child's position in the stagger sequence
        const staggerPosition = positionMap.get(index) ?? index;
        const childStart = from + staggerPosition * staggerDelay;

        // Calculate animation progress
        let progress: number;

        if (springConfig) {
          progress = spring({
            frame: frame - childStart,
            fps,
            config: {
              damping: springConfig.damping ?? 15,
              mass: springConfig.mass ?? 1,
              stiffness: springConfig.stiffness ?? 100,
            },
          });
        } else {
          progress = interpolate(
            frame,
            [childStart, childStart + duration],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        }

        // Get animation styles
        const animationStyles = renderAnimation
          ? renderAnimation(progress, index)
          : getAnimationStyles(animation, progress);

        // Clone child with animation styles if it's a valid element
        if (isValidElement<{ style?: React.CSSProperties }>(child)) {
          return cloneElement(child, {
            key: child.key ?? index,
            style: {
              ...(child.props.style || {}),
              ...animationStyles,
            },
          });
        }

        // For non-element children, wrap in a span
        return (
          <span key={index} style={animationStyles}>
            {child}
          </span>
        );
      })}
    </div>
  );
};

export default StaggerGroup;
