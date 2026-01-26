/**
 * Remotion Test Utilities
 *
 * Provides testing utilities specifically designed for Remotion compositions:
 * - Mock hooks for useCurrentFrame, useVideoConfig
 * - Frame-based snapshot testing
 * - Animation assertion helpers
 * - Composition rendering test wrappers
 */

import React, { ReactElement, ReactNode } from "react";
import { vi, expect } from "vitest";

// ============================================================================
// Types
// ============================================================================

export interface MockVideoConfig {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  id: string;
}

export interface FrameTestContext {
  frame: number;
  config: MockVideoConfig;
  setFrame: (frame: number) => void;
}

export interface AnimationAssertion {
  at: (frame: number) => AnimationValueAssertion;
  between: (startFrame: number, endFrame: number) => AnimationRangeAssertion;
}

export interface AnimationValueAssertion {
  toBeCloseTo: (expected: number, precision?: number) => void;
  toEqual: (expected: unknown) => void;
  toBeTruthy: () => void;
  toBeFalsy: () => void;
}

export interface AnimationRangeAssertion {
  toIncrease: () => void;
  toDecrease: () => void;
  toStayConstant: () => void;
  toOscillate: () => void;
}

// ============================================================================
// Default Config
// ============================================================================

export const DEFAULT_VIDEO_CONFIG: MockVideoConfig = {
  fps: 30,
  durationInFrames: 300,
  width: 1920,
  height: 1080,
  id: "test-composition",
};

// ============================================================================
// Mock State Management
// ============================================================================

let currentMockFrame = 0;
let currentMockConfig = { ...DEFAULT_VIDEO_CONFIG };

/**
 * Set the current mock frame for testing
 */
export function setMockFrame(frame: number): void {
  currentMockFrame = frame;
}

/**
 * Get the current mock frame
 */
export function getMockFrame(): number {
  return currentMockFrame;
}

/**
 * Set the mock video config
 */
export function setMockVideoConfig(config: Partial<MockVideoConfig>): void {
  currentMockConfig = { ...currentMockConfig, ...config };
}

/**
 * Reset all mocks to defaults
 */
export function resetMocks(): void {
  currentMockFrame = 0;
  currentMockConfig = { ...DEFAULT_VIDEO_CONFIG };
}

// ============================================================================
// Mock Remotion Hooks
// ============================================================================

/**
 * Mock implementation of useCurrentFrame
 */
export const mockUseCurrentFrame = vi.fn(() => currentMockFrame);

/**
 * Mock implementation of useVideoConfig
 */
export const mockUseVideoConfig = vi.fn(() => currentMockConfig);

/**
 * Mock implementation of spring
 */
export const mockSpring = vi.fn(
  (params: {
    frame: number;
    fps?: number;
    config?: { damping?: number; mass?: number; stiffness?: number };
    from?: number;
    to?: number;
    durationInFrames?: number;
  }) => {
    const { frame, from = 0, to = 1, durationInFrames } = params;
    // Simplified spring approximation for testing
    const duration = durationInFrames || 30;
    const progress = Math.min(1, Math.max(0, frame / duration));
    // Simple ease-out approximation
    const eased = 1 - Math.pow(1 - progress, 3);
    return from + (to - from) * eased;
  }
);

/**
 * Mock implementation of interpolate
 */
export const mockInterpolate = vi.fn(
  (
    value: number,
    inputRange: number[],
    outputRange: number[],
    options?: { extrapolateLeft?: string; extrapolateRight?: string }
  ) => {
    if (inputRange.length !== outputRange.length) {
      throw new Error("Input and output ranges must have the same length");
    }

    // Find the segment
    let segment = 0;
    for (let i = 0; i < inputRange.length - 1; i++) {
      if (value >= inputRange[i] && value <= inputRange[i + 1]) {
        segment = i;
        break;
      }
      if (value > inputRange[i + 1]) {
        segment = i + 1;
      }
    }

    // Clamp to last segment if beyond range
    segment = Math.min(segment, inputRange.length - 2);

    const inputStart = inputRange[segment];
    const inputEnd = inputRange[segment + 1];
    const outputStart = outputRange[segment];
    const outputEnd = outputRange[segment + 1];

    // Handle extrapolation
    if (value < inputRange[0]) {
      if (options?.extrapolateLeft === "clamp") {
        return outputRange[0];
      }
    }
    if (value > inputRange[inputRange.length - 1]) {
      if (options?.extrapolateRight === "clamp") {
        return outputRange[outputRange.length - 1];
      }
    }

    // Linear interpolation
    const progress = (value - inputStart) / (inputEnd - inputStart);
    return outputStart + (outputEnd - outputStart) * progress;
  }
);

// ============================================================================
// Setup Helpers
// ============================================================================

/**
 * Setup Remotion mocks for testing
 * Call this in beforeEach or at the start of your test
 */
export function setupRemotionMocks(): void {
  vi.mock("remotion", () => ({
    useCurrentFrame: mockUseCurrentFrame,
    useVideoConfig: mockUseVideoConfig,
    spring: mockSpring,
    interpolate: mockInterpolate,
    AbsoluteFill: ({ children, style }: { children: ReactNode; style?: React.CSSProperties }) => (
      <div data-testid="absolute-fill" style={{ position: "absolute", ...style }}>
        {children}
      </div>
    ),
    Sequence: ({
      children,
      from,
      durationInFrames,
      name,
    }: {
      children: ReactNode;
      from: number;
      durationInFrames?: number;
      name?: string;
    }) => (
      <div
        data-testid="sequence"
        data-from={from}
        data-duration={durationInFrames}
        data-name={name}
      >
        {currentMockFrame >= from ? children : null}
      </div>
    ),
    Audio: ({ src, volume }: { src: string; volume?: number }) => (
      <div data-testid="audio" data-src={src} data-volume={volume} />
    ),
    Img: ({ src, style }: { src: string; style?: React.CSSProperties }) => (
      // eslint-disable-next-line @remotion/warn-native-media-tag
      <img data-testid="remotion-img" src={src} style={style} alt="" />
    ),
    staticFile: (path: string) => `/static/${path}`,
  }));
}

// ============================================================================
// Test Wrapper Components
// ============================================================================

interface RemotionTestProviderProps {
  children: ReactNode;
  frame?: number;
  config?: Partial<MockVideoConfig>;
}

/**
 * Wrapper component for testing Remotion compositions
 */
export function RemotionTestProvider({
  children,
  frame = 0,
  config = {},
}: RemotionTestProviderProps): ReactElement {
  // Update mocks
  setMockFrame(frame);
  setMockVideoConfig(config);

  return <div data-testid="remotion-test-provider">{children}</div>;
}

// ============================================================================
// Frame-based Testing Utilities
// ============================================================================

/**
 * Run a test at multiple frames
 */
export function testAtFrames(
  frames: number[],
  testFn: (frame: number) => void
): void {
  frames.forEach((frame) => {
    setMockFrame(frame);
    testFn(frame);
  });
}

/**
 * Run a test across a frame range
 */
export function testFrameRange(
  startFrame: number,
  endFrame: number,
  step: number,
  testFn: (frame: number) => void
): void {
  for (let frame = startFrame; frame <= endFrame; frame += step) {
    setMockFrame(frame);
    testFn(frame);
  }
}

/**
 * Create frame samples for testing animations
 */
export function createFrameSamples(
  startFrame: number,
  endFrame: number,
  sampleCount: number = 10
): number[] {
  const samples: number[] = [];
  const step = (endFrame - startFrame) / (sampleCount - 1);

  for (let i = 0; i < sampleCount; i++) {
    samples.push(Math.round(startFrame + step * i));
  }

  return samples;
}

// ============================================================================
// Animation Assertions
// ============================================================================

/**
 * Create an animation assertion for a value getter function
 */
export function expectAnimation(
  getValue: (frame: number) => number
): AnimationAssertion {
  return {
    at: (frame: number) => {
      const value = getValue(frame);
      return {
        toBeCloseTo: (expected: number, precision = 2) => {
          expect(value).toBeCloseTo(expected, precision);
        },
        toEqual: (expected: unknown) => {
          expect(value).toEqual(expected);
        },
        toBeTruthy: () => {
          expect(value).toBeTruthy();
        },
        toBeFalsy: () => {
          expect(value).toBeFalsy();
        },
      };
    },
    between: (startFrame: number, endFrame: number) => {
      const startValue = getValue(startFrame);
      const endValue = getValue(endFrame);
      const midValue = getValue(Math.floor((startFrame + endFrame) / 2));

      return {
        toIncrease: () => {
          expect(endValue).toBeGreaterThan(startValue);
        },
        toDecrease: () => {
          expect(endValue).toBeLessThan(startValue);
        },
        toStayConstant: () => {
          expect(endValue).toBeCloseTo(startValue, 5);
          expect(midValue).toBeCloseTo(startValue, 5);
        },
        toOscillate: () => {
          // Check if the middle value is different from both start and end
          const isDifferentFromStart = Math.abs(midValue - startValue) > 0.01;
          const midBetweenStartEnd =
            (midValue > startValue && midValue < endValue) ||
            (midValue < startValue && midValue > endValue) ||
            isDifferentFromStart;
          expect(midBetweenStartEnd).toBe(true);
        },
      };
    },
  };
}

/**
 * Assert that an animation completes smoothly (no sudden jumps)
 */
export function expectSmoothAnimation(
  getValue: (frame: number) => number,
  startFrame: number,
  endFrame: number,
  maxDelta: number = 0.1
): void {
  let prevValue = getValue(startFrame);

  for (let frame = startFrame + 1; frame <= endFrame; frame++) {
    const currentValue = getValue(frame);
    const delta = Math.abs(currentValue - prevValue);

    expect(delta).toBeLessThanOrEqual(maxDelta);
    prevValue = currentValue;
  }
}

// ============================================================================
// Snapshot Helpers
// ============================================================================

/**
 * Generate snapshots at key animation frames
 */
export function getKeyFrameSnapshots<T>(
  renderFn: (frame: number) => T,
  keyFrames: number[]
): Record<number, T> {
  const snapshots: Record<number, T> = {};

  keyFrames.forEach((frame) => {
    setMockFrame(frame);
    snapshots[frame] = renderFn(frame);
  });

  return snapshots;
}

/**
 * Common key frames for testing standard animations
 */
export const STANDARD_KEY_FRAMES = {
  fadeIn: [0, 5, 10, 15, 20],
  fadeOut: [0, 5, 10, 15, 20],
  spring: [0, 5, 10, 15, 20, 25, 30],
  sequence: [0, 30, 60, 90, 120],
};

// ============================================================================
// Export All
// ============================================================================

export const remotionTestUtils = {
  setMockFrame,
  getMockFrame,
  setMockVideoConfig,
  resetMocks,
  setupRemotionMocks,
  testAtFrames,
  testFrameRange,
  createFrameSamples,
  expectAnimation,
  expectSmoothAnimation,
  getKeyFrameSnapshots,
  STANDARD_KEY_FRAMES,
  DEFAULT_VIDEO_CONFIG,
  mocks: {
    useCurrentFrame: mockUseCurrentFrame,
    useVideoConfig: mockUseVideoConfig,
    spring: mockSpring,
    interpolate: mockInterpolate,
  },
};

export default remotionTestUtils;
