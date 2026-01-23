/**
 * SVG Animation Utilities for Remotion
 *
 * Provides utilities for animating SVG elements including:
 * - Stroke draw animations
 * - Path morphing
 * - Circle/arc animations
 * - Filter animations
 */

// =============================================================================
// Types
// =============================================================================

export interface StrokeDrawResult {
  /** SVG strokeDasharray property */
  strokeDasharray: string;
  /** SVG strokeDashoffset property */
  strokeDashoffset: number;
}

export interface CircleAnimationResult extends StrokeDrawResult {
  /** For arc animations, the rotation transform */
  transform?: string;
}

// =============================================================================
// Stroke Draw Animation
// =============================================================================

/**
 * Calculate stroke dash properties for drawing/unDrawing a path
 *
 * @param options.pathLength - Total length of the SVG path
 * @param options.progress - Animation progress (0-1)
 * @param options.reverse - If true, animates from drawn to undrawn
 * @returns Stroke dash properties for SVG element
 *
 * @example
 * ```tsx
 * const { strokeDasharray, strokeDashoffset } = calculateStrokeDraw({
 *   pathLength: 500,
 *   progress: spring({ frame, fps, config: { damping: 100 } })
 * });
 *
 * <path d="..." style={{ strokeDasharray, strokeDashoffset }} />
 * ```
 */
export const calculateStrokeDraw = (options: {
  pathLength: number;
  progress: number;
  reverse?: boolean;
}): StrokeDrawResult => {
  const { pathLength, progress, reverse = false } = options;

  // Clamp progress
  const t = Math.max(0, Math.min(1, progress));

  const offset = reverse
    ? -pathLength * t
    : pathLength * (1 - t);

  return {
    strokeDasharray: `${pathLength}`,
    strokeDashoffset: offset,
  };
};

/**
 * Alias for backward compatibility
 * @deprecated Use calculateStrokeDraw instead
 */
export const useStrokeDraw = calculateStrokeDraw;

/**
 * Get stroke draw style as CSS properties
 *
 * @param progress - Animation progress (0-1)
 * @param pathLength - Total length of the SVG path
 * @param reverse - If true, animates from drawn to undrawn
 * @returns CSS properties for SVG stroke animation
 */
export const getStrokeDrawStyle = (
  progress: number,
  pathLength: number,
  reverse = false
): React.CSSProperties => {
  const { strokeDasharray, strokeDashoffset } = calculateStrokeDraw({
    pathLength,
    progress,
    reverse,
  });

  return {
    strokeDasharray,
    strokeDashoffset,
    fill: "none",
  };
};

// =============================================================================
// Circle/Arc Animation
// =============================================================================

/**
 * Calculate stroke dash properties for animating a circle/arc
 *
 * @param options.progress - Animation progress (0-1)
 * @param options.radius - Circle radius (used to calculate circumference)
 * @param options.startAngle - Start angle in degrees (default: 0)
 * @param options.endAngle - End angle in degrees (default: 360)
 * @returns Stroke dash properties and optional transform
 *
 * @example
 * ```tsx
 * const circleAnim = animatedCircle({
 *   progress: frame / 60,
 *   radius: 50,
 *   startAngle: -90,  // Start from top
 * });
 *
 * <circle cx="50" cy="50" r="50" style={circleAnim} />
 * ```
 */
export const animatedCircle = (options: {
  progress: number;
  radius: number;
  startAngle?: number;
  endAngle?: number;
}): CircleAnimationResult => {
  const { progress, radius, startAngle = 0, endAngle = 360 } = options;

  // Calculate circumference
  const circumference = 2 * Math.PI * radius;

  // Calculate the arc length for the animation
  const arcDegrees = endAngle - startAngle;
  const arcLength = (arcDegrees / 360) * circumference;

  // Clamp progress
  const t = Math.max(0, Math.min(1, progress));

  return {
    strokeDasharray: `${arcLength * t} ${circumference}`,
    strokeDashoffset: 0,
    transform: startAngle !== 0 ? `rotate(${startAngle}deg)` : undefined,
  };
};

/**
 * Create a progress ring animation (like a loading indicator)
 *
 * @param progress - Progress value (0-1)
 * @param radius - Ring radius
 * @returns Style object for SVG circle
 */
export const progressRing = (
  progress: number,
  radius: number
): React.CSSProperties => {
  const circumference = 2 * Math.PI * radius;
  const t = Math.max(0, Math.min(1, progress));

  return {
    strokeDasharray: `${circumference}`,
    strokeDashoffset: circumference * (1 - t),
    transform: "rotate(-90deg)",
    transformOrigin: "50% 50%",
  };
};

// =============================================================================
// Path Morphing
// =============================================================================

/**
 * Simple path interpolation between two SVG paths
 * Note: Both paths must have the same number of points/commands
 *
 * @param pathA - Starting path d attribute
 * @param pathB - Ending path d attribute
 * @param progress - Interpolation progress (0-1)
 * @returns Interpolated path d attribute
 *
 * @example
 * ```tsx
 * // Morph from square to circle (simplified)
 * const pathA = "M10,10 L90,10 L90,90 L10,90 Z";
 * const pathB = "M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,10 50,10 Z";
 * const morphed = interpolatePath(pathA, pathB, progress);
 * ```
 */
export const interpolatePath = (
  pathA: string,
  pathB: string,
  progress: number
): string => {
  const t = Math.max(0, Math.min(1, progress));

  // Parse numbers from paths
  const numbersA = extractPathNumbers(pathA);
  const numbersB = extractPathNumbers(pathB);

  // If paths have different structures, return based on progress threshold
  if (numbersA.length !== numbersB.length) {
    return t < 0.5 ? pathA : pathB;
  }

  // Interpolate numbers
  const interpolatedNumbers = numbersA.map((numA, i) => {
    const numB = numbersB[i];
    return numA + (numB - numA) * t;
  });

  // Rebuild path with interpolated numbers
  return rebuildPath(pathA, interpolatedNumbers);
};

/**
 * Extract all numbers from an SVG path
 */
const extractPathNumbers = (path: string): number[] => {
  const numbers: number[] = [];
  const regex = /-?\d+\.?\d*/g;
  let match;

  while ((match = regex.exec(path)) !== null) {
    numbers.push(parseFloat(match[0]));
  }

  return numbers;
};

/**
 * Rebuild an SVG path with new numbers while preserving commands
 */
const rebuildPath = (originalPath: string, numbers: number[]): string => {
  let index = 0;
  return originalPath.replace(/-?\d+\.?\d*/g, () => {
    const num = numbers[index++];
    // Round to 2 decimal places to avoid floating point artifacts
    return num !== undefined ? num.toFixed(2) : "0";
  });
};

// =============================================================================
// SVG Filter Animations
// =============================================================================

/**
 * Generate an animated blur filter value
 *
 * @param progress - Animation progress (0-1)
 * @param maxBlur - Maximum blur amount in pixels
 * @param invert - If true, blur decreases as progress increases
 * @returns CSS filter string for blur
 *
 * @example
 * ```tsx
 * const blurFilter = useAnimatedBlur(progress, 10);
 * <g style={{ filter: blurFilter }}>...</g>
 * ```
 */
export const useAnimatedBlur = (
  progress: number,
  maxBlur: number,
  invert = false
): string => {
  const t = Math.max(0, Math.min(1, progress));
  const blurAmount = invert ? maxBlur * (1 - t) : maxBlur * t;
  return `blur(${blurAmount}px)`;
};

/**
 * Generate SVG feGaussianBlur attributes for animated blur
 *
 * @param progress - Animation progress (0-1)
 * @param maxDeviation - Maximum standard deviation
 * @returns Object with stdDeviation value
 */
export const animatedGaussianBlur = (
  progress: number,
  maxDeviation: number
): { stdDeviation: number } => {
  const t = Math.max(0, Math.min(1, progress));
  return {
    stdDeviation: maxDeviation * t,
  };
};

/**
 * Generate animated drop shadow properties
 *
 * @param progress - Animation progress (0-1)
 * @param options - Shadow configuration
 * @returns CSS filter string for drop-shadow
 */
export const animatedDropShadow = (
  progress: number,
  options: {
    maxOffsetX?: number;
    maxOffsetY?: number;
    maxBlur?: number;
    color?: string;
  } = {}
): string => {
  const {
    maxOffsetX = 0,
    maxOffsetY = 4,
    maxBlur = 8,
    color = "rgba(0, 0, 0, 0.25)",
  } = options;

  const t = Math.max(0, Math.min(1, progress));

  const offsetX = maxOffsetX * t;
  const offsetY = maxOffsetY * t;
  const blur = maxBlur * t;

  return `drop-shadow(${offsetX}px ${offsetY}px ${blur}px ${color})`;
};

// =============================================================================
// SVG Transform Animations
// =============================================================================

/**
 * Generate SVG transform string for rotation animation
 *
 * @param progress - Animation progress (0-1)
 * @param options - Rotation configuration
 * @returns SVG transform string
 */
export const animatedRotation = (
  progress: number,
  options: {
    startAngle?: number;
    endAngle?: number;
    centerX?: number;
    centerY?: number;
  } = {}
): string => {
  const {
    startAngle = 0,
    endAngle = 360,
    centerX = 0,
    centerY = 0,
  } = options;

  const t = Math.max(0, Math.min(1, progress));
  const angle = startAngle + (endAngle - startAngle) * t;

  return `rotate(${angle}, ${centerX}, ${centerY})`;
};

/**
 * Generate SVG transform string for scale animation
 *
 * @param progress - Animation progress (0-1)
 * @param options - Scale configuration
 * @returns SVG transform string
 */
export const animatedScale = (
  progress: number,
  options: {
    startScale?: number;
    endScale?: number;
    centerX?: number;
    centerY?: number;
  } = {}
): string => {
  const {
    startScale = 0,
    endScale = 1,
    centerX,
    centerY,
  } = options;

  const t = Math.max(0, Math.min(1, progress));
  const scale = startScale + (endScale - startScale) * t;

  if (centerX !== undefined && centerY !== undefined) {
    // Translate to origin, scale, translate back
    return `translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`;
  }

  return `scale(${scale})`;
};

/**
 * Combine multiple SVG transforms
 *
 * @param transforms - Array of transform strings
 * @returns Combined transform string
 */
export const combineTransforms = (...transforms: (string | undefined)[]): string => {
  return transforms.filter(Boolean).join(" ");
};
