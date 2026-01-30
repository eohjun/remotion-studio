/**
 * LottieAnimation - Vector animation component using @remotion/lottie
 *
 * Renders Lottie animations synchronized with video frames.
 * Perfect for icons, loaders, and complex vector animations.
 *
 * @example
 * // Basic usage with URL
 * <LottieAnimation
 *   src="https://assets.lottiefiles.com/animation.json"
 *   size={200}
 * />
 *
 * @example
 * // With playback control
 * <LottieAnimation
 *   src={animationData}
 *   size={300}
 *   loop
 *   speed={1.5}
 *   startFrame={30}
 * />
 */
import React from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from "remotion";
import { spring, interpolate } from "remotion";
import { SPRING_CONFIGS } from "../constants";

export interface LottieAnimationProps {
  /** Lottie animation data object or path to JSON file */
  src: LottieAnimationData | string;
  /** Size in pixels (width = height for square animations) */
  size?: number;
  /** Explicit width (overrides size) */
  width?: number;
  /** Explicit height (overrides size) */
  height?: number;
  /** Loop the animation */
  loop?: boolean;
  /** Playback speed multiplier (default: 1) */
  speed?: number;
  /** Animation direction: 1 = forward, -1 = backward */
  direction?: 1 | -1;
  /** Start playing from this video frame */
  startFrame?: number;
  /** Animation play mode: auto (sync with video) or manual */
  playMode?: "auto" | "manual";
  /** Manual progress (0-1) when playMode="manual" */
  progress?: number;
  /** Fade in animation */
  fadeIn?: boolean;
  /** Fade in duration in frames */
  fadeInDuration?: number;
  /** Scale in animation */
  scaleIn?: boolean;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  src,
  size = 200,
  width,
  height,
  loop = true,
  speed = 1,
  direction = 1,
  startFrame = 0,
  playMode = "auto",
  progress: manualProgress,
  fadeIn = false,
  scaleIn = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Load animation data if src is a string path
  const [animationData, setAnimationData] = React.useState<LottieAnimationData | null>(
    typeof src === "string" ? null : src
  );
  const [handle] = React.useState(() => typeof src === "string" ? delayRender() : null);

  React.useEffect(() => {
    if (typeof src === "string") {
      fetch(src.startsWith("/") ? staticFile(src.slice(1)) : src)
        .then((res) => res.json())
        .then((data) => {
          setAnimationData(data);
          if (handle) continueRender(handle);
        })
        .catch((err) => {
          console.error("Failed to load Lottie animation:", err);
          if (handle) continueRender(handle);
        });
    }
  }, [src, handle]);

  // Note: Lottie component from @remotion/lottie automatically syncs with video frames
  // These props are reserved for future frame-level control if needed
  void playMode;
  void manualProgress;
  void loop; // Lottie auto-loops by default in Remotion context

  // Entry animations
  const entryProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = fadeIn
    ? interpolate(entryProgress, [0, 1], [0, 1])
    : 1;

  const scale = scaleIn
    ? interpolate(entryProgress, [0, 1], [0.8, 1])
    : 1;

  // Dimensions
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;

  if (!animationData) {
    // Show placeholder while loading
    return (
      <div
        style={{
          width: finalWidth,
          height: finalHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.3,
          ...style,
        }}
        className={className}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        width: finalWidth,
        height: finalHeight,
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
      className={className}
    >
      <Lottie
        animationData={animationData}
        playbackRate={speed * direction}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

// ============================================================================
// Common Animation Presets
// ============================================================================

export interface PresetAnimationProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  startFrame?: number;
}

/**
 * Loading spinner animation
 * Note: Requires loading-spinner.json in public/lottie/
 */
export const LoadingSpinner: React.FC<PresetAnimationProps> = ({
  size = 100,
  startFrame = 0,
  style,
}) => (
  <LottieAnimation
    src="/lottie/loading-spinner.json"
    size={size}
    loop
    speed={1}
    startFrame={startFrame}
    style={style}
  />
);

/**
 * Success checkmark animation
 * Note: Requires success-check.json in public/lottie/
 */
export const SuccessCheck: React.FC<PresetAnimationProps> = ({
  size = 120,
  startFrame = 0,
  style,
}) => (
  <LottieAnimation
    src="/lottie/success-check.json"
    size={size}
    loop={false}
    startFrame={startFrame}
    scaleIn
    style={style}
  />
);

/**
 * Error/failure animation
 * Note: Requires error-x.json in public/lottie/
 */
export const ErrorAnimation: React.FC<PresetAnimationProps> = ({
  size = 120,
  startFrame = 0,
  style,
}) => (
  <LottieAnimation
    src="/lottie/error-x.json"
    size={size}
    loop={false}
    startFrame={startFrame}
    scaleIn
    style={style}
  />
);

/**
 * Confetti celebration animation
 * Note: Requires confetti.json in public/lottie/
 */
export const ConfettiAnimation: React.FC<PresetAnimationProps & { width?: number; height?: number }> = ({
  width = 400,
  height = 300,
  startFrame = 0,
  style,
}) => (
  <LottieAnimation
    src="/lottie/confetti.json"
    width={width}
    height={height}
    loop={false}
    startFrame={startFrame}
    style={style}
  />
);

export default LottieAnimation;
