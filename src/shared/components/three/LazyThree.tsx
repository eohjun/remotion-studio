/**
 * LazyThree - Lazy-loaded Three.js components
 *
 * Provides lazy-loaded versions of Three.js components to reduce
 * initial bundle size and improve load times.
 *
 * Use these when 3D content is not immediately needed or when
 * the composition has non-3D parts that should load quickly.
 */

import React, { lazy, Suspense, useState } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// ============================================================================
// Loading Fallbacks
// ============================================================================

/**
 * Default loading placeholder for 3D content
 */
export const ThreeLoadingPlaceholder: React.FC<{
  backgroundColor?: string;
  message?: string;
}> = ({ backgroundColor = "#1a1a2e", message }) => (
  <AbsoluteFill
    style={{
      backgroundColor,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(255, 255, 255, 0.6)",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid rgba(255, 255, 255, 0.2)",
        borderTopColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    {message && (
      <div style={{ marginTop: 16, fontSize: 14 }}>{message}</div>
    )}
    <style>
      {`@keyframes spin { to { transform: rotate(360deg); } }`}
    </style>
  </AbsoluteFill>
);

// ============================================================================
// Lazy Component Imports
// ============================================================================

// Lazy load heavy Three.js components
const LazyThreeCanvasComponent = lazy(() =>
  import("./ThreeCanvas").then((mod) => ({ default: mod.ThreeCanvas }))
);

const LazyText3DComponent = lazy(() =>
  import("./Text3D").then((mod) => ({ default: mod.Text3D }))
);

const LazyFloatingText3DComponent = lazy(() =>
  import("./Text3D").then((mod) => ({ default: mod.FloatingText3D }))
);

const LazyDeviceMockupComponent = lazy(() =>
  import("./DeviceMockup").then((mod) => ({ default: mod.DeviceMockup }))
);

// ============================================================================
// Lazy Wrapper Components
// ============================================================================

// Import types
import type { ThreeCanvasProps } from "./ThreeCanvas";
import type { Text3DProps, FloatingText3DProps } from "./Text3D";
import type { DeviceMockupProps } from "./DeviceMockup";

/**
 * LazyThreeCanvas - Lazy-loaded ThreeCanvas
 *
 * @example
 * ```tsx
 * <LazyThreeCanvas fallback={<MyCustomLoader />}>
 *   <mesh>...</mesh>
 * </LazyThreeCanvas>
 * ```
 */
export const LazyThreeCanvas: React.FC<
  ThreeCanvasProps & { fallback?: React.ReactNode }
> = ({ fallback, ...props }) => (
  <Suspense
    fallback={fallback || <ThreeLoadingPlaceholder message="Loading 3D..." />}
  >
    <LazyThreeCanvasComponent {...props} />
  </Suspense>
);

/**
 * LazyText3D - Lazy-loaded 3D Text
 */
export const LazyText3D: React.FC<
  Text3DProps & { fallback?: React.ReactNode }
> = ({ fallback, ...props }) => (
  <Suspense fallback={fallback || null}>
    <LazyText3DComponent {...props} />
  </Suspense>
);

/**
 * LazyFloatingText3D - Lazy-loaded Floating 3D Text
 */
export const LazyFloatingText3D: React.FC<
  FloatingText3DProps & { fallback?: React.ReactNode }
> = ({ fallback, ...props }) => (
  <Suspense fallback={fallback || null}>
    <LazyFloatingText3DComponent {...props} />
  </Suspense>
);

/**
 * LazyDeviceMockup - Lazy-loaded Device Mockup
 */
export const LazyDeviceMockup: React.FC<
  DeviceMockupProps & { fallback?: React.ReactNode }
> = ({ fallback, ...props }) => (
  <Suspense fallback={fallback || null}>
    <LazyDeviceMockupComponent {...props} />
  </Suspense>
);

// ============================================================================
// Frame-triggered Lazy Loading
// ============================================================================

/**
 * DelayedThreeCanvas - Only load 3D content after specified frame
 *
 * Useful when 3D content appears later in the video and you want
 * to optimize initial load time.
 *
 * @example
 * ```tsx
 * // Load 3D content 30 frames before it appears
 * <DelayedThreeCanvas
 *   loadAtFrame={270}
 *   preloadBuffer={30}
 *   placeholder={<ImageFallback />}
 * >
 *   <Heavy3DScene />
 * </DelayedThreeCanvas>
 * ```
 */
export const DelayedThreeCanvas: React.FC<
  ThreeCanvasProps & {
    /** Frame at which 3D content should be visible */
    loadAtFrame: number;
    /** Frames before loadAtFrame to start loading (default: 30) */
    preloadBuffer?: number;
    /** Placeholder while loading or before load frame */
    placeholder?: React.ReactNode;
  }
> = ({ loadAtFrame, preloadBuffer = 30, placeholder, children, ...props }) => {
  const frame = useCurrentFrame();

  // Should we start loading?
  const shouldLoad = frame >= loadAtFrame - preloadBuffer;

  // Before load trigger, show placeholder
  if (!shouldLoad) {
    return <>{placeholder || <ThreeLoadingPlaceholder />}</>;
  }

  // After load trigger, show 3D content (with Suspense)
  return (
    <Suspense
      fallback={placeholder || <ThreeLoadingPlaceholder message="Loading 3D scene..." />}
    >
      <LazyThreeCanvasComponent {...props}>
        {children}
      </LazyThreeCanvasComponent>
    </Suspense>
  );
};

// ============================================================================
// Preload Helpers
// ============================================================================

/**
 * Preload Three.js components
 *
 * Call this early to start loading 3D components in the background.
 *
 * @example
 * ```tsx
 * // In your composition setup
 * useEffect(() => {
 *   preloadThreeComponents();
 * }, []);
 * ```
 */
export function preloadThreeComponents(): void {
  // Trigger lazy imports to start loading
  import("./ThreeCanvas");
  import("./Text3D");
  import("./DeviceMockup");
}

/**
 * usePreloadThree - Hook to preload 3D components at specific frame
 *
 * @param preloadFrame - Frame to start preloading (default: 0)
 */
export function usePreloadThree(preloadFrame: number = 0): void {
  const frame = useCurrentFrame();
  const [preloaded, setPreloaded] = useState(false);

  React.useEffect(() => {
    if (frame >= preloadFrame && !preloaded) {
      preloadThreeComponents();
      setPreloaded(true);
    }
  }, [frame, preloadFrame, preloaded]);
}
