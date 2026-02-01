import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { interpolatePath } from "@remotion/paths";
import { COLORS, SPRING_CONFIGS } from "../constants";
import { MorphingPathProps, ICON_PATHS, IconName } from "./types";

/**
 * MorphingIcon - Animated path morphing between two shapes
 *
 * Uses @remotion/paths interpolatePath to smoothly morph between
 * two SVG paths, perfect for icon transitions.
 *
 * @example
 * ```tsx
 * <MorphingIcon
 *   fromPath={ICON_PATHS.play}
 *   toPath={ICON_PATHS.pause}
 *   morphDuration={30}
 * />
 *
 * // Or use convenience props
 * <MorphingIcon
 *   fromIcon="play"
 *   toIcon="pause"
 * />
 * ```
 */
export const MorphingIcon: React.FC<MorphingPathProps & {
  /** Convenience prop: use predefined icon name instead of path */
  fromIcon?: IconName;
  /** Convenience prop: use predefined icon name instead of path */
  toIcon?: IconName;
}> = ({
  fromPath: fromPathProp,
  toPath: toPathProp,
  fromIcon,
  toIcon,
  progress: manualProgress,
  morphDuration = 30,
  stroke,
  strokeWidth = 0,
  fill = COLORS.white,
  delay = 0,
  animate = true,
  width = 24,
  height = 24,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve paths from icons if provided
  const fromPath = fromIcon ? ICON_PATHS[fromIcon] : fromPathProp;
  const toPath = toIcon ? ICON_PATHS[toIcon] : toPathProp;

  if (!fromPath || !toPath) {
    console.warn("MorphingIcon: Both fromPath and toPath are required");
    return null;
  }

  // Calculate morph progress
  let morphProgress: number;

  if (manualProgress !== undefined) {
    morphProgress = manualProgress;
  } else if (animate) {
    morphProgress = spring({
      frame: frame - delay,
      fps,
      config: SPRING_CONFIGS.snappy,
      durationInFrames: morphDuration,
    });
  } else {
    morphProgress = 1;
  }

  // Clamp progress
  morphProgress = Math.max(0, Math.min(1, morphProgress));

  // Get interpolated path using @remotion/paths
  const morphedPath = interpolatePath(morphProgress, fromPath, toPath);

  // Entry opacity
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      style={{
        opacity,
        ...style,
      }}
    >
      <path
        d={morphedPath}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

/**
 * Preset morphing icon transitions
 */
export const IconTransitions = {
  PlayPause: (props: Omit<MorphingPathProps, "fromPath" | "toPath">) => (
    <MorphingIcon fromPath={ICON_PATHS.play} toPath={ICON_PATHS.pause} {...props} />
  ),
  MenuClose: (props: Omit<MorphingPathProps, "fromPath" | "toPath">) => (
    <MorphingIcon fromPath={ICON_PATHS.menu} toPath={ICON_PATHS.close} {...props} />
  ),
  CheckCross: (props: Omit<MorphingPathProps, "fromPath" | "toPath">) => (
    <MorphingIcon fromPath={ICON_PATHS.checkmark} toPath={ICON_PATHS.cross} {...props} />
  ),
};

export { ICON_PATHS };
export default MorphingIcon;
