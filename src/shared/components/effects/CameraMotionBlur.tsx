import React from "react";
import { CameraMotionBlur as RemotionCameraMotionBlur } from "@remotion/motion-blur";
import type { CameraMotionBlurProps } from "./types";

/**
 * CameraMotionBlur - Apply realistic camera motion blur to content
 *
 * Uses @remotion/motion-blur's CameraMotionBlur for accurate
 * shutter-based motion blur simulation.
 *
 * This provides more accurate motion blur than Trail-based approach
 * by simulating camera shutter mechanics.
 *
 * @example
 * ```tsx
 * <CameraMotionBlur shutterAngle={180} samples={10}>
 *   <AnimatedScene />
 * </CameraMotionBlur>
 * ```
 */
export const CameraMotionBlur: React.FC<CameraMotionBlurProps> = ({
  children,
  shutterAngle = 180,
  samples = 10,
  enabled = true,
}) => {
  // If disabled, render children directly
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <RemotionCameraMotionBlur shutterAngle={shutterAngle} samples={samples}>
      {children}
    </RemotionCameraMotionBlur>
  );
};

export default CameraMotionBlur;
