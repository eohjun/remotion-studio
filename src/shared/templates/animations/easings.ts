/**
 * Easing Functions for Remotion Animations
 *
 * All easing functions take a value t (0-1) and return a transformed value.
 * The output may exceed 0-1 range for effects like bounce and elastic.
 */

/** Easing function type: input 0-1, output typically 0-1 (may overshoot) */
export type EasingFunction = (t: number) => number;

// =============================================================================
// Standard Easings (Quadratic)
// =============================================================================

/**
 * Quadratic ease-in: slow start, fast end
 */
export const easeIn: EasingFunction = (t) => t * t;

/**
 * Quadratic ease-out: fast start, slow end
 */
export const easeOut: EasingFunction = (t) => t * (2 - t);

/**
 * Quadratic ease-in-out: slow start and end, fast middle
 */
export const easeInOut: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// =============================================================================
// Cubic Easings
// =============================================================================

/**
 * Cubic ease-in: slower start than quadratic
 */
export const easeInCubic: EasingFunction = (t) => t * t * t;

/**
 * Cubic ease-out: slower end than quadratic
 */
export const easeOutCubic: EasingFunction = (t) => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

/**
 * Cubic ease-in-out: smooth acceleration and deceleration
 */
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

// =============================================================================
// Quartic Easings
// =============================================================================

/**
 * Quartic ease-in: even slower start
 */
export const easeInQuart: EasingFunction = (t) => t * t * t * t;

/**
 * Quartic ease-out: even slower end
 */
export const easeOutQuart: EasingFunction = (t) => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

/**
 * Quartic ease-in-out
 */
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * (t - 1) * (t - 1) * (t - 1);

// =============================================================================
// Quintic Easings
// =============================================================================

/**
 * Quintic ease-in: very slow start
 */
export const easeInQuint: EasingFunction = (t) => t * t * t * t * t;

/**
 * Quintic ease-out: very slow end
 */
export const easeOutQuint: EasingFunction = (t) => {
  const t1 = t - 1;
  return 1 + t1 * t1 * t1 * t1 * t1;
};

/**
 * Quintic ease-in-out
 */
export const easeInOutQuint: EasingFunction = (t) =>
  t < 0.5
    ? 16 * t * t * t * t * t
    : 1 + 16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1);

// =============================================================================
// Sinusoidal Easings
// =============================================================================

/**
 * Sinusoidal ease-in: gentle start using sine curve
 */
export const easeInSine: EasingFunction = (t) =>
  1 - Math.cos((t * Math.PI) / 2);

/**
 * Sinusoidal ease-out: gentle end using sine curve
 */
export const easeOutSine: EasingFunction = (t) => Math.sin((t * Math.PI) / 2);

/**
 * Sinusoidal ease-in-out
 */
export const easeInOutSine: EasingFunction = (t) =>
  -(Math.cos(Math.PI * t) - 1) / 2;

// =============================================================================
// Exponential Easings
// =============================================================================

/**
 * Exponential ease-in: starts very slowly, accelerates exponentially
 */
export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * (t - 1));

/**
 * Exponential ease-out: decelerates exponentially
 */
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Exponential ease-in-out
 */
export const easeInOutExpo: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) {
    return Math.pow(2, 20 * t - 10) / 2;
  }
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

// =============================================================================
// Circular Easings
// =============================================================================

/**
 * Circular ease-in: starts slowly following circular arc
 */
export const easeInCirc: EasingFunction = (t) => 1 - Math.sqrt(1 - t * t);

/**
 * Circular ease-out: ends slowly following circular arc
 */
export const easeOutCirc: EasingFunction = (t) => Math.sqrt(1 - (t - 1) * (t - 1));

/**
 * Circular ease-in-out
 */
export const easeInOutCirc: EasingFunction = (t) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

// =============================================================================
// Back Easings (Anticipation/Overshoot)
// =============================================================================

const BACK_CONSTANT = 1.70158;
const BACK_CONSTANT_INOUT = BACK_CONSTANT * 1.525;

/**
 * Back ease-in: overshoots backwards before moving forward
 * Creates an anticipation effect
 */
export const easeInBack: EasingFunction = (t) =>
  (BACK_CONSTANT + 1) * t * t * t - BACK_CONSTANT * t * t;

/**
 * Back ease-out: overshoots target before settling
 */
export const easeOutBack: EasingFunction = (t) => {
  const t1 = t - 1;
  return 1 + (BACK_CONSTANT + 1) * t1 * t1 * t1 + BACK_CONSTANT * t1 * t1;
};

/**
 * Back ease-in-out: anticipation and overshoot
 */
export const easeInOutBack: EasingFunction = (t) =>
  t < 0.5
    ? (Math.pow(2 * t, 2) * ((BACK_CONSTANT_INOUT + 1) * 2 * t - BACK_CONSTANT_INOUT)) / 2
    : (Math.pow(2 * t - 2, 2) * ((BACK_CONSTANT_INOUT + 1) * (t * 2 - 2) + BACK_CONSTANT_INOUT) + 2) / 2;

// =============================================================================
// Bounce Easings
// =============================================================================

/**
 * Bounce ease-out: bounces like a ball
 */
export const easeOutBounce: EasingFunction = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    const t1 = t - 1.5 / d1;
    return n1 * t1 * t1 + 0.75;
  } else if (t < 2.5 / d1) {
    const t1 = t - 2.25 / d1;
    return n1 * t1 * t1 + 0.9375;
  } else {
    const t1 = t - 2.625 / d1;
    return n1 * t1 * t1 + 0.984375;
  }
};

/**
 * Bounce ease-in: bounces at the start
 */
export const easeInBounce: EasingFunction = (t) => 1 - easeOutBounce(1 - t);

/**
 * Bounce ease-in-out: bounces at both ends
 */
export const easeInOutBounce: EasingFunction = (t) =>
  t < 0.5
    ? (1 - easeOutBounce(1 - 2 * t)) / 2
    : (1 + easeOutBounce(2 * t - 1)) / 2;

// =============================================================================
// Elastic Easings
// =============================================================================

const ELASTIC_CONSTANT = (2 * Math.PI) / 3;
const ELASTIC_CONSTANT_INOUT = (2 * Math.PI) / 4.5;

/**
 * Elastic ease-in: wobbles in from the start
 */
export const easeInElastic: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ELASTIC_CONSTANT);
};

/**
 * Elastic ease-out: wobbles at the end
 */
export const easeOutElastic: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ELASTIC_CONSTANT) + 1;
};

/**
 * Elastic ease-in-out: wobbles at both ends
 */
export const easeInOutElastic: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) {
    return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ELASTIC_CONSTANT_INOUT)) / 2;
  }
  return (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ELASTIC_CONSTANT_INOUT)) / 2 + 1;
};

// =============================================================================
// Cubic Bezier
// =============================================================================

/**
 * Create a custom cubic bezier easing function
 * Similar to CSS cubic-bezier(x1, y1, x2, y2)
 *
 * @param x1 - First control point X (0-1)
 * @param y1 - First control point Y (can exceed 0-1)
 * @param x2 - Second control point X (0-1)
 * @param y2 - Second control point Y (can exceed 0-1)
 * @returns Easing function
 */
export const cubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunction => {
  // Using Newton's method to find t for given x
  const sampleCurveX = (t: number): number =>
    ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t + 3 * x1 * t;

  const sampleCurveY = (t: number): number =>
    ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t + 3 * y1 * t;

  const sampleCurveDerivativeX = (t: number): number =>
    (3 * (1 - 3 * x2 + 3 * x1) * t + 2 * (3 * x2 - 6 * x1)) * t + 3 * x1;

  const solveCurveX = (x: number, epsilon = 1e-6): number => {
    // Newton's method
    let t = x;
    for (let i = 0; i < 8; i++) {
      const x2calc = sampleCurveX(t) - x;
      if (Math.abs(x2calc) < epsilon) return t;
      const d2 = sampleCurveDerivativeX(t);
      if (Math.abs(d2) < epsilon) break;
      t -= x2calc / d2;
    }

    // Fallback to bisection
    let t0 = 0;
    let t1 = 1;
    t = x;

    while (t0 < t1) {
      const x2calc = sampleCurveX(t);
      if (Math.abs(x2calc - x) < epsilon) return t;
      if (x > x2calc) {
        t0 = t;
      } else {
        t1 = t;
      }
      t = (t1 - t0) / 2 + t0;
    }

    return t;
  };

  return (x: number): number => {
    if (x === 0) return 0;
    if (x === 1) return 1;
    return sampleCurveY(solveCurveX(x));
  };
};

// =============================================================================
// Linear (no easing)
// =============================================================================

/**
 * Linear: no easing, constant speed
 */
export const linear: EasingFunction = (t) => t;

// =============================================================================
// Preset Collection
// =============================================================================

/**
 * Collection of all easing presets for easy access
 */
export const EASING_PRESETS = {
  // Linear
  linear,

  // Quadratic
  easeIn,
  easeOut,
  easeInOut,

  // Cubic
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,

  // Quartic
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,

  // Quintic
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,

  // Sinusoidal
  easeInSine,
  easeOutSine,
  easeInOutSine,

  // Exponential
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,

  // Circular
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,

  // Back
  easeInBack,
  easeOutBack,
  easeInOutBack,

  // Bounce
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,

  // Elastic
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
} as const;

/**
 * Common CSS-style bezier presets
 */
export const BEZIER_PRESETS = {
  /** CSS ease: cubic-bezier(0.25, 0.1, 0.25, 1.0) */
  ease: cubicBezier(0.25, 0.1, 0.25, 1.0),

  /** CSS ease-in: cubic-bezier(0.42, 0, 1.0, 1.0) */
  cssEaseIn: cubicBezier(0.42, 0, 1.0, 1.0),

  /** CSS ease-out: cubic-bezier(0, 0, 0.58, 1.0) */
  cssEaseOut: cubicBezier(0, 0, 0.58, 1.0),

  /** CSS ease-in-out: cubic-bezier(0.42, 0, 0.58, 1.0) */
  cssEaseInOut: cubicBezier(0.42, 0, 0.58, 1.0),

  /** Material Design standard curve */
  materialStandard: cubicBezier(0.4, 0.0, 0.2, 1.0),

  /** Material Design deceleration curve */
  materialDecelerate: cubicBezier(0.0, 0.0, 0.2, 1.0),

  /** Material Design acceleration curve */
  materialAccelerate: cubicBezier(0.4, 0.0, 1.0, 1.0),
} as const;
