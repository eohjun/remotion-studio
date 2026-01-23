import React from "react";
import { Trail } from "@remotion/motion-blur";
import { MotionBlurWrapperProps } from "./types";

/**
 * MotionBlurWrapper - Apply motion blur to animated content
 *
 * Wraps content with Remotion's Trail component to create
 * realistic motion blur effects on moving elements.
 *
 * Uses frame interpolation to simulate camera shutter blur.
 *
 * Performance note:
 * - Higher sample counts produce smoother blur but impact rendering time
 * - Development: samples=10 (fast preview)
 * - Production: samples=15-20 (quality output)
 *
 * @example
 * ```tsx
 * <MotionBlurWrapper samples={15} shutterAngle={180}>
 *   <AnimatedElement />
 * </MotionBlurWrapper>
 * ```
 */
export const MotionBlurWrapper: React.FC<MotionBlurWrapperProps> = ({
  children,
  samples = 10,
  shutterAngle = 180,
  enabled = true,
}) => {
  // If disabled, render children directly
  if (!enabled) {
    return <>{children}</>;
  }

  // Convert shutter angle to lag frames
  // 180 degrees = 0.5 frame lag (standard cinema shutter)
  // 360 degrees = 1 frame lag (full rotary shutter)
  const lagInFrames = shutterAngle / 360;

  return (
    <Trail
      lagInFrames={lagInFrames}
      trailOpacity={1 / samples}
      layers={samples}
    >
      {children}
    </Trail>
  );
};

export default MotionBlurWrapper;
