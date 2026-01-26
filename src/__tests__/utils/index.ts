/**
 * Test Utilities Index
 *
 * Exports all test utilities for Remotion compositions.
 */

// Remotion mock utilities
export {
  // Mock state management
  setMockFrame,
  getMockFrame,
  setMockVideoConfig,
  resetMocks,
  // Mock hooks
  mockUseCurrentFrame,
  mockUseVideoConfig,
  mockSpring,
  mockInterpolate,
  // Setup helpers
  setupRemotionMocks,
  RemotionTestProvider,
  // Frame-based testing
  testAtFrames,
  testFrameRange,
  createFrameSamples,
  // Animation assertions
  expectAnimation,
  expectSmoothAnimation,
  // Snapshot helpers
  getKeyFrameSnapshots,
  STANDARD_KEY_FRAMES,
  DEFAULT_VIDEO_CONFIG,
  // All utilities
  remotionTestUtils,
} from "./remotion-test-utils";

export type {
  MockVideoConfig,
  FrameTestContext,
  AnimationAssertion,
  AnimationValueAssertion,
  AnimationRangeAssertion,
} from "./remotion-test-utils";

// Visual regression utilities
export {
  // Directory management
  ensureSnapshotDirs,
  getSnapshotPath,
  // Frame generators
  generateKeyFrames,
  generateTransitionFrames,
  generateAnimationTestFrames,
  // Baseline management
  createBaselineMetadata,
  saveBaselineMetadata,
  loadBaselineMetadata,
  // Comparison utilities
  compareImages,
  // Report generation
  generateReport,
  saveReport,
  generateHtmlReport,
  // CLI command generators
  generateRenderCommand,
  generateBaselineUpdateCommand,
  // Constants
  DEFAULT_SNAPSHOT_CONFIG,
  DEFAULT_DIFF_THRESHOLD,
  // All utilities
  visualRegression,
} from "./visual-regression";

export type {
  SnapshotConfig,
  ComparisonResult,
  RegressionReport,
  BaselineMetadata,
} from "./visual-regression";
