/**
 * Performance Utilities for Remotion
 *
 * Provides tools for optimizing rendering performance including:
 * - Memoization helpers
 * - Frame-based caching
 * - Lazy loading utilities
 * - Performance monitoring
 */

import React, { useMemo, useRef, lazy, Suspense } from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";

// ============================================================================
// Frame-based Memoization
// ============================================================================

/**
 * useFrameThrottle - Throttle updates to specific frame intervals
 *
 * Useful for expensive calculations that don't need to run every frame.
 *
 * @param value - Value to throttle
 * @param interval - Frame interval (e.g., 2 = update every 2 frames)
 * @returns Throttled value
 *
 * @example
 * ```tsx
 * // Update expensive calculation every 3 frames
 * const throttledValue = useFrameThrottle(expensiveCalc(), 3);
 * ```
 */
export function useFrameThrottle<T>(value: T, interval: number): T {
  const frame = useCurrentFrame();
  const cachedValue = useRef<T>(value);
  const lastUpdateFrame = useRef<number>(0);

  if (frame - lastUpdateFrame.current >= interval) {
    cachedValue.current = value;
    lastUpdateFrame.current = frame;
  }

  return cachedValue.current;
}

/**
 * useStableValue - Only update when value actually changes
 *
 * Prevents re-renders when value is referentially different but
 * semantically equal (e.g., recreated arrays/objects).
 *
 * @param value - Value to stabilize
 * @param isEqual - Comparison function (default: JSON.stringify)
 * @returns Stable reference to value
 */
export function useStableValue<T>(
  value: T,
  isEqual: (a: T, b: T) => boolean = (a, b) =>
    JSON.stringify(a) === JSON.stringify(b)
): T {
  const ref = useRef<T>(value);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * useFrameRange - Determine if current frame is within range
 *
 * Optimized for conditional rendering based on frame position.
 *
 * @param startFrame - Range start
 * @param endFrame - Range end
 * @param buffer - Buffer frames to start loading early (default: 30)
 * @returns Object with inRange and shouldPreload flags
 */
export function useFrameRange(
  startFrame: number,
  endFrame: number,
  buffer: number = 30
): { inRange: boolean; shouldPreload: boolean; progress: number } {
  const frame = useCurrentFrame();

  return useMemo(() => {
    const inRange = frame >= startFrame && frame <= endFrame;
    const shouldPreload = frame >= startFrame - buffer && frame <= endFrame;
    const progress = inRange
      ? (frame - startFrame) / (endFrame - startFrame)
      : frame < startFrame
        ? 0
        : 1;

    return { inRange, shouldPreload, progress };
  }, [frame, startFrame, endFrame, buffer]);
}

// ============================================================================
// Optimized Animation Hooks
// ============================================================================

/**
 * useCachedCalculation - Cached spring animation
 *
 * Caches spring calculation to prevent recalculation on re-renders.
 *
 * @param config - Spring configuration
 * @returns Cached spring value
 */
export function useCachedCalculation<T>(
  calculate: (frame: number) => T,
  deps: React.DependencyList
): T {
  const frame = useCurrentFrame();
  const cache = useRef<{ frame: number; value: T } | null>(null);

  return useMemo(() => {
    if (cache.current && cache.current.frame === frame) {
      return cache.current.value;
    }

    const value = calculate(frame);
    cache.current = { frame, value };
    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, ...deps]);
}

/**
 * useSkipFrames - Skip rendering on certain frames
 *
 * Useful for reducing render load on complex scenes.
 *
 * @param skipInterval - Render every N frames (default: 1 = no skip)
 * @returns Whether to render this frame
 */
export function useShouldRender(skipInterval: number = 1): boolean {
  const frame = useCurrentFrame();
  return frame % skipInterval === 0;
}

// ============================================================================
// Lazy Loading
// ============================================================================

/**
 * Loading placeholder component
 */
export const LoadingPlaceholder: React.FC<{
  backgroundColor?: string;
  children?: React.ReactNode;
}> = ({ backgroundColor = "transparent", children }) => (
  <AbsoluteFill
    style={{
      backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * Create a lazy-loaded component with Suspense wrapper
 *
 * @param importFn - Dynamic import function
 * @param fallback - Fallback component while loading
 * @returns Lazy component with Suspense
 *
 * @example
 * ```tsx
 * const LazyChart = createLazyComponent(
 *   () => import('./charts/HeavyChart'),
 *   <LoadingPlaceholder>Loading chart...</LoadingPlaceholder>
 * );
 * ```
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback: React.ReactNode = <LoadingPlaceholder />
): React.FC<P> {
  const LazyComponent = lazy(importFn);

  return (props: P) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy load with frame-based triggering
 *
 * Only loads component when approaching its display frame.
 */
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  triggerFrame: number,
  preloadBuffer: number = 60
): { data: T | null; isLoading: boolean; error: Error | null } {
  const frame = useCurrentFrame();
  const [state, setState] = React.useState<{
    data: T | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  React.useEffect(() => {
    if (frame >= triggerFrame - preloadBuffer && !state.data && !state.isLoading) {
      setState((s) => ({ ...s, isLoading: true }));
      loader()
        .then((data) => setState({ data, isLoading: false, error: null }))
        .catch((error) => setState({ data: null, isLoading: false, error }));
    }
  }, [frame, triggerFrame, preloadBuffer, loader, state.data, state.isLoading]);

  return state;
}

// ============================================================================
// Component Optimization HOCs
// ============================================================================

/**
 * Props comparison for React.memo
 */
type PropsComparator<P> = (prevProps: P, nextProps: P) => boolean;

/**
 * Create a memoized component with custom comparison
 *
 * @param Component - Component to memoize
 * @param propsAreEqual - Custom comparison function
 * @returns Memoized component
 */
export function createMemoizedComponent<P extends object>(
  Component: React.FC<P>,
  propsAreEqual?: PropsComparator<P>
): React.FC<P> {
  return React.memo(Component, propsAreEqual);
}

/**
 * Default props comparator that ignores function props
 */
export function shallowEqualIgnoreFunctions<P extends object>(
  prevProps: P,
  nextProps: P
): boolean {
  const prevKeys = Object.keys(prevProps) as (keyof P)[];
  const nextKeys = Object.keys(nextProps) as (keyof P)[];

  if (prevKeys.length !== nextKeys.length) return false;

  return prevKeys.every((key) => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    // Ignore function comparison
    if (typeof prevValue === "function" && typeof nextValue === "function") {
      return true;
    }

    return prevValue === nextValue;
  });
}

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * Frame timing data
 */
export interface FrameTiming {
  frame: number;
  renderTime: number;
  timestamp: number;
}

/**
 * useFramePerformance - Monitor frame render times
 *
 * Useful for identifying slow frames during development.
 *
 * @param enabled - Whether to track performance (default: true in dev)
 * @returns Performance data and helpers
 */
export function useFramePerformance(enabled: boolean = process.env.NODE_ENV === "development") {
  const frame = useCurrentFrame();
  const lastRenderTime = useRef<number>(performance.now());
  const timings = useRef<FrameTiming[]>([]);

  const renderTime = useMemo(() => {
    if (!enabled) return 0;

    const now = performance.now();
    const time = now - lastRenderTime.current;
    lastRenderTime.current = now;

    timings.current.push({ frame, renderTime: time, timestamp: now });

    // Keep last 100 frames
    if (timings.current.length > 100) {
      timings.current.shift();
    }

    return time;
  }, [frame, enabled]);

  const averageRenderTime = useMemo(() => {
    if (timings.current.length === 0) return 0;
    const sum = timings.current.reduce((acc, t) => acc + t.renderTime, 0);
    return sum / timings.current.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, enabled]);

  const slowFrames = useMemo(() => {
    const threshold = 16.67; // 60fps threshold
    return timings.current.filter((t) => t.renderTime > threshold);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, enabled]);

  return {
    renderTime,
    averageRenderTime,
    slowFrames,
    timings: timings.current,
  };
}

// ============================================================================
// Conditional Rendering Helpers
// ============================================================================

/**
 * RenderWhen - Only render children when condition is met
 *
 * More efficient than conditional && rendering for complex children.
 */
export const RenderWhen: React.FC<{
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ condition, children, fallback = null }) => {
  if (!condition) return <>{fallback}</>;
  return <>{children}</>;
};

/**
 * RenderInRange - Only render during frame range
 *
 * Efficiently skips rendering outside specified frame range.
 */
export const RenderInRange: React.FC<{
  start: number;
  end: number;
  buffer?: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ start, end, buffer = 0, children, fallback = null }) => {
  const { inRange } = useFrameRange(start, end, buffer);

  if (!inRange) return <>{fallback}</>;
  return <>{children}</>;
};
