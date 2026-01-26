/**
 * Visual Regression Testing Utilities
 *
 * Provides utilities for visual regression testing of Remotion compositions:
 * - Frame snapshot capture configuration
 * - Comparison utilities for frame differences
 * - Baseline management helpers
 * - Test report generation
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";

// ============================================================================
// Types
// ============================================================================

export interface SnapshotConfig {
  /** Composition ID to capture */
  compositionId: string;
  /** Frames to capture */
  frames: number[];
  /** Output directory for snapshots */
  outputDir: string;
  /** Image format */
  format: "png" | "jpeg";
  /** JPEG quality (if format is jpeg) */
  quality?: number;
  /** Scale factor for captures */
  scale?: number;
}

export interface ComparisonResult {
  /** Frame number */
  frame: number;
  /** Whether the frames match */
  matches: boolean;
  /** Difference percentage (0-100) */
  diffPercentage: number;
  /** Path to baseline image */
  baselinePath: string;
  /** Path to current image */
  currentPath: string;
  /** Path to diff image (if generated) */
  diffPath?: string;
}

export interface RegressionReport {
  /** Timestamp of the test run */
  timestamp: string;
  /** Composition ID tested */
  compositionId: string;
  /** Total frames compared */
  totalFrames: number;
  /** Number of frames that passed */
  passedFrames: number;
  /** Number of frames that failed */
  failedFrames: number;
  /** Detailed results per frame */
  results: ComparisonResult[];
  /** Overall pass/fail status */
  passed: boolean;
}

export interface BaselineMetadata {
  /** When the baseline was created */
  createdAt: string;
  /** Remotion version used */
  remotionVersion?: string;
  /** Video config used */
  videoConfig: {
    width: number;
    height: number;
    fps: number;
  };
  /** Hash of composition source (for change detection) */
  sourceHash?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_SNAPSHOT_CONFIG: Partial<SnapshotConfig> = {
  format: "png",
  quality: 90,
  scale: 1,
};

export const DEFAULT_DIFF_THRESHOLD = 0.1; // 0.1% difference allowed

// ============================================================================
// Directory Management
// ============================================================================

/**
 * Ensure snapshot directories exist
 */
export function ensureSnapshotDirs(baseDir: string): {
  baselines: string;
  current: string;
  diffs: string;
  reports: string;
} {
  const dirs = {
    baselines: join(baseDir, "baselines"),
    current: join(baseDir, "current"),
    diffs: join(baseDir, "diffs"),
    reports: join(baseDir, "reports"),
  };

  Object.values(dirs).forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  return dirs;
}

/**
 * Get snapshot path for a specific frame
 */
export function getSnapshotPath(
  baseDir: string,
  compositionId: string,
  frame: number,
  type: "baseline" | "current" | "diff",
  format: "png" | "jpeg" = "png"
): string {
  const typeDir = type === "baseline" ? "baselines" : type === "current" ? "current" : "diffs";
  return join(baseDir, typeDir, compositionId, `frame-${String(frame).padStart(6, "0")}.${format}`);
}

// ============================================================================
// Snapshot Configuration Generators
// ============================================================================

/**
 * Generate frames for key moments in a composition
 */
export function generateKeyFrames(
  durationInFrames: number,
  options: {
    /** Include first frame */
    includeStart?: boolean;
    /** Include last frame */
    includeEnd?: boolean;
    /** Number of evenly spaced samples */
    sampleCount?: number;
    /** Specific frames to always include */
    mandatoryFrames?: number[];
  } = {}
): number[] {
  const {
    includeStart = true,
    includeEnd = true,
    sampleCount = 5,
    mandatoryFrames = [],
  } = options;

  const frames = new Set<number>(mandatoryFrames);

  if (includeStart) frames.add(0);
  if (includeEnd) frames.add(durationInFrames - 1);

  // Add evenly spaced samples
  const step = durationInFrames / (sampleCount + 1);
  for (let i = 1; i <= sampleCount; i++) {
    frames.add(Math.round(step * i));
  }

  return Array.from(frames).sort((a, b) => a - b);
}

/**
 * Generate frames for transition testing
 */
export function generateTransitionFrames(
  transitionStart: number,
  transitionDuration: number,
  samples: number = 5
): number[] {
  const frames: number[] = [];
  const step = transitionDuration / (samples - 1);

  for (let i = 0; i < samples; i++) {
    frames.push(Math.round(transitionStart + step * i));
  }

  return frames;
}

/**
 * Generate frames for animation curve testing
 */
export function generateAnimationTestFrames(
  animationStart: number,
  animationDuration: number
): number[] {
  // Key points in an animation: start, 25%, 50%, 75%, end
  return [
    animationStart,
    animationStart + Math.round(animationDuration * 0.25),
    animationStart + Math.round(animationDuration * 0.5),
    animationStart + Math.round(animationDuration * 0.75),
    animationStart + animationDuration,
  ];
}

// ============================================================================
// Baseline Management
// ============================================================================

/**
 * Create baseline metadata
 */
export function createBaselineMetadata(
  videoConfig: { width: number; height: number; fps: number },
  remotionVersion?: string,
  sourceHash?: string
): BaselineMetadata {
  return {
    createdAt: new Date().toISOString(),
    remotionVersion,
    videoConfig,
    sourceHash,
  };
}

/**
 * Save baseline metadata
 */
export function saveBaselineMetadata(
  baseDir: string,
  compositionId: string,
  metadata: BaselineMetadata
): void {
  const metadataPath = join(baseDir, "baselines", compositionId, "metadata.json");
  const dir = dirname(metadataPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Load baseline metadata
 */
export function loadBaselineMetadata(
  baseDir: string,
  compositionId: string
): BaselineMetadata | null {
  const metadataPath = join(baseDir, "baselines", compositionId, "metadata.json");

  if (!existsSync(metadataPath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(metadataPath, "utf-8"));
  } catch {
    return null;
  }
}

// ============================================================================
// Comparison Utilities
// ============================================================================

/**
 * Compare two image buffers (simplified pixel comparison)
 * Note: For real visual regression, use libraries like pixelmatch
 */
export function compareImages(
  baseline: Buffer,
  current: Buffer,
  threshold: number = DEFAULT_DIFF_THRESHOLD
): { matches: boolean; diffPercentage: number } {
  // Simple byte comparison for basic testing
  // In production, use proper image comparison libraries
  if (baseline.length !== current.length) {
    return { matches: false, diffPercentage: 100 };
  }

  let diffPixels = 0;
  const totalPixels = baseline.length;

  for (let i = 0; i < totalPixels; i++) {
    if (baseline[i] !== current[i]) {
      diffPixels++;
    }
  }

  const diffPercentage = (diffPixels / totalPixels) * 100;
  const matches = diffPercentage <= threshold;

  return { matches, diffPercentage };
}

// ============================================================================
// Report Generation
// ============================================================================

/**
 * Generate a visual regression test report
 */
export function generateReport(
  compositionId: string,
  results: ComparisonResult[]
): RegressionReport {
  const passedFrames = results.filter((r) => r.matches).length;
  const failedFrames = results.filter((r) => !r.matches).length;

  return {
    timestamp: new Date().toISOString(),
    compositionId,
    totalFrames: results.length,
    passedFrames,
    failedFrames,
    results,
    passed: failedFrames === 0,
  };
}

/**
 * Save report to file
 */
export function saveReport(
  baseDir: string,
  report: RegressionReport
): string {
  const reportPath = join(
    baseDir,
    "reports",
    `${report.compositionId}-${Date.now()}.json`
  );

  const dir = dirname(reportPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  return reportPath;
}

/**
 * Generate HTML report for visual inspection
 */
export function generateHtmlReport(report: RegressionReport): string {
  const failedResults = report.results.filter((r) => !r.matches);

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Visual Regression Report - ${report.compositionId}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; background: #1a1a2e; color: #eee; }
    .header { margin-bottom: 30px; }
    .status { padding: 10px 20px; border-radius: 8px; display: inline-block; }
    .status.passed { background: #2ecc71; color: #fff; }
    .status.failed { background: #e74c3c; color: #fff; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
    .summary-card { background: #16213e; padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card .value { font-size: 32px; font-weight: bold; }
    .summary-card .label { color: #888; margin-top: 5px; }
    .results { margin-top: 30px; }
    .result-item { background: #16213e; padding: 20px; border-radius: 8px; margin: 10px 0; }
    .result-item.failed { border-left: 4px solid #e74c3c; }
    .result-item.passed { border-left: 4px solid #2ecc71; }
    .frame-number { font-size: 18px; font-weight: bold; }
    .diff-percentage { color: #888; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual Regression Report</h1>
    <p>Composition: <strong>${report.compositionId}</strong></p>
    <p>Generated: ${report.timestamp}</p>
    <span class="status ${report.passed ? "passed" : "failed"}">
      ${report.passed ? "✓ PASSED" : "✗ FAILED"}
    </span>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="value">${report.totalFrames}</div>
      <div class="label">Total Frames</div>
    </div>
    <div class="summary-card">
      <div class="value" style="color: #2ecc71">${report.passedFrames}</div>
      <div class="label">Passed</div>
    </div>
    <div class="summary-card">
      <div class="value" style="color: #e74c3c">${report.failedFrames}</div>
      <div class="label">Failed</div>
    </div>
  </div>

  ${
    failedResults.length > 0
      ? `
  <div class="results">
    <h2>Failed Frames</h2>
    ${failedResults
      .map(
        (r) => `
      <div class="result-item failed">
        <div class="frame-number">Frame ${r.frame}</div>
        <div class="diff-percentage">Difference: ${r.diffPercentage.toFixed(2)}%</div>
      </div>
    `
      )
      .join("")}
  </div>
  `
      : ""
  }
</body>
</html>
`;
}

// ============================================================================
// CLI Command Generators
// ============================================================================

/**
 * Generate Remotion render command for snapshot capture
 */
export function generateRenderCommand(config: SnapshotConfig): string {
  const { compositionId, frames, outputDir, format, quality, scale } = {
    ...DEFAULT_SNAPSHOT_CONFIG,
    ...config,
  };

  const commands = frames.map((frame) => {
    const outputPath = getSnapshotPath(outputDir, compositionId, frame, "current", format);
    const qualityFlag = format === "jpeg" ? `--jpeg-quality=${quality}` : "";
    const scaleFlag = scale !== 1 ? `--scale=${scale}` : "";

    return `npx remotion still ${compositionId} ${outputPath} --frame=${frame} ${qualityFlag} ${scaleFlag}`.trim();
  });

  return commands.join(" && ");
}

/**
 * Generate baseline update command
 */
export function generateBaselineUpdateCommand(
  snapshotDir: string,
  compositionId: string
): string {
  return `cp -r "${join(snapshotDir, "current", compositionId)}" "${join(snapshotDir, "baselines", compositionId)}"`;
}

// ============================================================================
// Export
// ============================================================================

export const visualRegression = {
  ensureSnapshotDirs,
  getSnapshotPath,
  generateKeyFrames,
  generateTransitionFrames,
  generateAnimationTestFrames,
  createBaselineMetadata,
  saveBaselineMetadata,
  loadBaselineMetadata,
  compareImages,
  generateReport,
  saveReport,
  generateHtmlReport,
  generateRenderCommand,
  generateBaselineUpdateCommand,
  DEFAULT_SNAPSHOT_CONFIG,
  DEFAULT_DIFF_THRESHOLD,
};

export default visualRegression;
