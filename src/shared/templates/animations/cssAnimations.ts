/**
 * CSS Animation Utilities
 *
 * Utilities leveraging @remotion/animation-utils for
 * CSS transform and style animations.
 */

import {
  makeTransform,
  translateX,
  translateY,
  translateZ,
  scale,
  scaleX,
  scaleY,
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  skewX,
  skewY,
  matrix,
  matrix3d,
} from "@remotion/animation-utils";

// Re-export all transform utilities
export {
  makeTransform,
  translateX,
  translateY,
  translateZ,
  scale,
  scaleX,
  scaleY,
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  skewX,
  skewY,
  matrix,
  matrix3d,
};

/**
 * Create a combined transform string from multiple transforms
 *
 * @param transforms - Array of transform strings
 * @returns Combined transform string
 *
 * @example
 * const transform = combineTransforms([
 *   translateY(-20),
 *   scale(1.1),
 *   rotate(5),
 * ]);
 * // Returns: "translateY(-20px) scale(1.1) rotate(5deg)"
 */
export function combineTransforms(transforms: string[]): string {
  return makeTransform(transforms);
}

/**
 * Create an entrance animation transform
 *
 * @param progress - Animation progress (0 = hidden, 1 = visible)
 * @param direction - Direction to enter from
 * @param distance - Distance to travel in pixels (default: 50)
 * @returns Transform string
 */
export function entranceTransform(
  progress: number,
  direction: "up" | "down" | "left" | "right" | "fade" = "up",
  distance: number = 50
): { transform: string; opacity: number } {
  const offset = (1 - progress) * distance;

  let transform: string;
  switch (direction) {
    case "up":
      transform = makeTransform([translateY(offset)]);
      break;
    case "down":
      transform = makeTransform([translateY(-offset)]);
      break;
    case "left":
      transform = makeTransform([translateX(offset)]);
      break;
    case "right":
      transform = makeTransform([translateX(-offset)]);
      break;
    case "fade":
    default:
      transform = makeTransform([scale(0.95 + progress * 0.05)]);
      break;
  }

  return {
    transform,
    opacity: progress,
  };
}

/**
 * Create a pop/bounce entrance animation
 *
 * @param progress - Animation progress (0 = hidden, 1 = visible)
 * @param overshoot - Amount of scale overshoot (default: 0.1)
 * @returns Transform and opacity styles
 */
export function popTransform(
  progress: number,
  overshoot: number = 0.1
): { transform: string; opacity: number } {
  // Scale with overshoot: 0 → 1+overshoot → 1
  let scaleValue: number;
  if (progress < 0.7) {
    // Scale up with overshoot
    scaleValue = (progress / 0.7) * (1 + overshoot);
  } else {
    // Settle back to 1
    scaleValue = 1 + overshoot * (1 - (progress - 0.7) / 0.3);
  }

  return {
    transform: makeTransform([scale(scaleValue)]),
    opacity: Math.min(progress * 2, 1),
  };
}

/**
 * Create a shake animation transform
 *
 * @param intensity - Shake intensity in pixels
 * @param frame - Current frame for random seed
 * @returns Transform string
 */
export function shakeTransform(intensity: number, frame: number): string {
  const x = Math.sin(frame * 0.5) * intensity;
  const y = Math.cos(frame * 0.7) * intensity * 0.5;
  const rotation = Math.sin(frame * 0.3) * intensity * 0.1;

  return makeTransform([translateX(x), translateY(y), rotate(rotation)]);
}

/**
 * Create a flip animation transform
 *
 * @param progress - Animation progress (0 to 1)
 * @param axis - Flip axis ('x' or 'y')
 * @returns Transform string
 */
export function flipTransform(
  progress: number,
  axis: "x" | "y" = "y"
): string {
  const angle = progress * 180;

  if (axis === "x") {
    return makeTransform([rotateX(angle)]);
  }
  return makeTransform([rotateY(angle)]);
}

/**
 * Create a 3D tilt effect based on position
 *
 * @param positionX - X position ratio (-1 to 1)
 * @param positionY - Y position ratio (-1 to 1)
 * @param maxAngle - Maximum tilt angle in degrees (default: 15)
 * @returns Transform string with perspective
 */
export function tilt3DTransform(
  positionX: number,
  positionY: number,
  maxAngle: number = 15
): string {
  const rotateYAngle = positionX * maxAngle;
  const rotateXAngle = -positionY * maxAngle;

  return makeTransform([rotateY(rotateYAngle), rotateX(rotateXAngle)]);
}

/**
 * Create a parallax transform based on scroll/progress
 *
 * @param progress - Scroll/animation progress
 * @param speed - Parallax speed multiplier (1 = normal, 0.5 = half speed)
 * @param direction - Movement direction
 * @returns Transform string
 */
export function parallaxTransform(
  progress: number,
  speed: number,
  direction: "vertical" | "horizontal" = "vertical"
): string {
  const distance = progress * 100 * speed;

  if (direction === "horizontal") {
    return makeTransform([translateX(distance)]);
  }
  return makeTransform([translateY(distance)]);
}

/**
 * Create a zoom transform centered on a point
 *
 * @param scaleValue - Scale factor
 * @param originX - Origin X percentage (0-100)
 * @param originY - Origin Y percentage (0-100)
 * @returns Style object with transform and transformOrigin
 */
export function zoomTransform(
  scaleValue: number,
  originX: number = 50,
  originY: number = 50
): { transform: string; transformOrigin: string } {
  return {
    transform: makeTransform([scale(scaleValue)]),
    transformOrigin: `${originX}% ${originY}%`,
  };
}

/**
 * Create Ken Burns effect (slow zoom + pan)
 *
 * @param progress - Animation progress (0 to 1)
 * @param config - Ken Burns configuration
 * @returns Style object
 */
export function kenBurnsTransform(
  progress: number,
  config: {
    startScale?: number;
    endScale?: number;
    startX?: number;
    endX?: number;
    startY?: number;
    endY?: number;
  } = {}
): { transform: string; transformOrigin: string } {
  const {
    startScale = 1,
    endScale = 1.2,
    startX = 50,
    endX = 50,
    startY = 50,
    endY = 50,
  } = config;

  const currentScale = startScale + (endScale - startScale) * progress;
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  return {
    transform: makeTransform([scale(currentScale)]),
    transformOrigin: `${currentX}% ${currentY}%`,
  };
}

/**
 * Utility type for animation keyframes
 */
export interface AnimationKeyframe {
  frame: number;
  transform?: string;
  opacity?: number;
  [key: string]: unknown;
}

/**
 * Interpolate between animation keyframes
 *
 * @param currentFrame - Current frame
 * @param keyframes - Array of keyframes
 * @returns Interpolated style properties
 */
export function interpolateKeyframes(
  currentFrame: number,
  keyframes: AnimationKeyframe[]
): Partial<AnimationKeyframe> {
  if (keyframes.length === 0) return {};
  if (keyframes.length === 1) return keyframes[0];

  // Find surrounding keyframes
  let prevKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (
      currentFrame >= keyframes[i].frame &&
      currentFrame <= keyframes[i + 1].frame
    ) {
      prevKeyframe = keyframes[i];
      nextKeyframe = keyframes[i + 1];
      break;
    }
  }

  // Calculate progress between keyframes
  const frameDiff = nextKeyframe.frame - prevKeyframe.frame;
  if (frameDiff === 0) return prevKeyframe;

  const progress = (currentFrame - prevKeyframe.frame) / frameDiff;

  // Interpolate numeric properties
  const result: Partial<AnimationKeyframe> = { frame: currentFrame };

  if (prevKeyframe.opacity !== undefined && nextKeyframe.opacity !== undefined) {
    result.opacity =
      prevKeyframe.opacity + (nextKeyframe.opacity - prevKeyframe.opacity) * progress;
  }

  // Transform needs special handling - return the nearest keyframe's transform
  if (progress < 0.5 && prevKeyframe.transform) {
    result.transform = prevKeyframe.transform;
  } else if (nextKeyframe.transform) {
    result.transform = nextKeyframe.transform;
  }

  return result;
}
