import React from "react";
import { OffthreadVideo, RemotionOffthreadVideoProps } from "remotion";

/**
 * Props for OptimizedVideo component
 *
 * Extends OffthreadVideo props (the preferred video component in Remotion 4.0+)
 */
export interface OptimizedVideoProps extends RemotionOffthreadVideoProps {
  /**
   * Video component mode (for API documentation purposes)
   *
   * Note: In Remotion 4.0+, OffthreadVideo is the preferred component for all use cases.
   * It's 281% faster than the deprecated Video/Html5Video component.
   * This prop is kept for API documentation but always uses OffthreadVideo.
   */
  mode?: "auto" | "offthread";
}

/**
 * OptimizedVideo - Best-practice video component for Remotion 4.0+
 *
 * Uses OffthreadVideo which is the recommended component in Remotion 4.0+:
 * - Extracts frames using FFmpeg C API outside the browser
 * - 281% faster than the old Video component
 * - Better memory management for multiple video layers
 * - Consistent frame-perfect output
 *
 * @example
 * ```tsx
 * import { staticFile } from "remotion";
 *
 * // Basic usage
 * <OptimizedVideo src={staticFile("video.mp4")} />
 *
 * // With volume control
 * <OptimizedVideo
 *   src={staticFile("video.mp4")}
 *   volume={0.5}
 *   startFrom={30}
 * />
 * ```
 */
export const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  // mode is documented but always uses OffthreadVideo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode,
  ...props
}) => {
  return <OffthreadVideo {...props} />;
};

/**
 * MemorySafeVideo - Alias for OptimizedVideo
 *
 * In Remotion 4.0+, OffthreadVideo is both memory-efficient and performant.
 * This is an alias provided for semantic clarity when working with
 * many video layers or long videos.
 */
export const MemorySafeVideo: React.FC<RemotionOffthreadVideoProps> = (props) => {
  return <OffthreadVideo {...props} />;
};

export default OptimizedVideo;
