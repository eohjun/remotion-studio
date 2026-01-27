/**
 * Render Time Estimation Script
 *
 * Predicts render time based on composition complexity:
 * - Scene count and total duration
 * - Particle effects
 * - 3D elements
 * - Audio processing
 * - Visual effects (film grain, etc.)
 *
 * Usage:
 *   node scripts/estimate-render-time.mjs <compositionId>
 *   node scripts/estimate-render-time.mjs TwoMinuteRule
 *   node scripts/estimate-render-time.mjs TwoMinuteRule --json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI argument parsing
const args = process.argv.slice(2);
const compositionId = args.find((arg) => !arg.startsWith("-"));
const outputJson = args.includes("--json") || args.includes("-j");
const verbose = args.includes("--verbose") || args.includes("-v");

if (!compositionId) {
  console.error("Usage: node scripts/estimate-render-time.mjs <compositionId>");
  console.error("Options:");
  console.error("  -j, --json     Output results as JSON");
  console.error("  -v, --verbose  Show detailed complexity breakdown");
  process.exit(1);
}

// ============================================
// Complexity Weights
// ============================================

const COMPLEXITY_WEIGHTS = {
  // Base weights per element type
  scene: 1.0,
  particle: 2.5,
  "3d": 4.0,
  audio: 0.5,
  filmGrain: 0.8,
  lightLeak: 0.6,
  vignette: 0.3,
  animatedGradient: 0.5,
  chart: 0.7,
  transition: 0.4,
  textAnimation: 0.3,

  // Resolution multipliers
  resolution: {
    "720p": 0.5,
    "1080p": 1.0,
    "1440p": 1.8,
    "4k": 3.5,
  },

  // Codec multipliers
  codec: {
    h264: 1.0,
    h265: 1.5,
    prores: 2.0,
    gif: 0.3,
  },
};

// System performance baseline (renders per second at 1080p)
const BASELINE_FPS = 2.5; // Conservative estimate

// ============================================
// Analysis Functions
// ============================================

/**
 * Analyze narration.json for basic composition info
 */
function analyzeNarration(compositionId) {
  const narrationPath = path.join(
    projectRoot,
    "projects",
    compositionId,
    "narration.json"
  );

  if (!fs.existsSync(narrationPath)) {
    return null;
  }

  const narration = JSON.parse(fs.readFileSync(narrationPath, "utf-8"));

  return {
    sceneCount: narration.scenes?.length || 0,
    totalDuration:
      narration.scenes?.reduce((sum, s) => sum + (s.duration || 5), 0) || 0,
    fps: narration.metadata?.fps || 60,
    format: narration.metadata?.format || "standard",
  };
}

/**
 * Analyze source files for complexity indicators
 */
function analyzeSourceFiles(compositionId) {
  const videoDir = path.join(projectRoot, "src/videos", compositionId);

  if (!fs.existsSync(videoDir)) {
    return {
      particles: 0,
      "3d": 0,
      filmGrain: 0,
      lightLeak: 0,
      vignette: 0,
      animatedGradient: 0,
      charts: 0,
      transitions: 0,
      textAnimations: 0,
    };
  }

  // Find all TSX files
  const tsxFiles = [];
  function findTsxFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findTsxFiles(fullPath);
      } else if (entry.name.endsWith(".tsx")) {
        tsxFiles.push(fullPath);
      }
    }
  }
  findTsxFiles(videoDir);

  // Analyze content
  let content = "";
  for (const file of tsxFiles) {
    content += fs.readFileSync(file, "utf-8") + "\n";
  }

  const patterns = {
    particles: /ParticleField|Particle|confetti/gi,
    "3d": /Three|3D|WebGL|Canvas3D/gi,
    filmGrain: /FilmGrain|filmGrain/g,
    lightLeak: /LightLeak|lightLeak/g,
    vignette: /Vignette|vignette/g,
    animatedGradient: /AnimatedGradient|GradientMesh/gi,
    charts: /BarChart|LineChart|PieChart|AreaChart|ScatterPlot|FunnelChart|GaugeChart/g,
    transitions: /SceneTransition|Transition|transition/gi,
    textAnimations: /AnimatedText|TypeWriter|PopText|TextReveal/gi,
  };

  const counts = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = content.match(pattern) || [];
    counts[key] = matches.length;
  }

  return counts;
}

/**
 * Check for audio files
 */
function countAudioFiles(compositionId) {
  const audioDir = path.join(
    projectRoot,
    "public/videos",
    compositionId,
    "audio"
  );

  if (!fs.existsSync(audioDir)) {
    return 0;
  }

  const files = fs.readdirSync(audioDir).filter((f) => f.endsWith(".mp3"));
  return files.length;
}

/**
 * Get system info for adjustment
 */
function getSystemInfo() {
  try {
    // Get CPU info
    const cpuInfo = execSync("cat /proc/cpuinfo | grep 'model name' | head -1", {
      encoding: "utf-8",
    });
    const cpuMatch = cpuInfo.match(/model name\s*:\s*(.+)/);
    const cpuModel = cpuMatch ? cpuMatch[1].trim() : "Unknown";

    // Get core count
    const coreCount = parseInt(
      execSync("nproc", { encoding: "utf-8" }).trim(),
      10
    );

    // Get memory
    const memInfo = execSync("free -g | grep Mem", { encoding: "utf-8" });
    const memMatch = memInfo.match(/Mem:\s+(\d+)/);
    const memoryGb = memMatch ? parseInt(memMatch[1], 10) : 8;

    return {
      cpuModel,
      coreCount,
      memoryGb,
      // Performance multiplier based on resources
      performanceMultiplier: Math.min(1.5, Math.max(0.5, coreCount / 8)),
    };
  } catch {
    return {
      cpuModel: "Unknown",
      coreCount: 4,
      memoryGb: 8,
      performanceMultiplier: 1.0,
    };
  }
}

// ============================================
// Estimation Logic
// ============================================

function estimateRenderTime(compositionId) {
  const narrationInfo = analyzeNarration(compositionId);
  const complexityInfo = analyzeSourceFiles(compositionId);
  const audioCount = countAudioFiles(compositionId);
  const systemInfo = getSystemInfo();

  // Default values if narration not found
  const sceneCount = narrationInfo?.sceneCount || 5;
  const totalDurationSeconds = narrationInfo?.totalDuration || 30;
  const fps = narrationInfo?.fps || 60;
  const totalFrames = totalDurationSeconds * fps;

  // Calculate complexity score
  let complexityScore = 0;
  const breakdown = {};

  // Scene complexity
  breakdown.scenes = sceneCount * COMPLEXITY_WEIGHTS.scene;
  complexityScore += breakdown.scenes;

  // Effect complexity
  for (const [key, count] of Object.entries(complexityInfo)) {
    if (count > 0 && COMPLEXITY_WEIGHTS[key]) {
      breakdown[key] = count * COMPLEXITY_WEIGHTS[key];
      complexityScore += breakdown[key];
    }
  }

  // Audio complexity
  breakdown.audio = audioCount * COMPLEXITY_WEIGHTS.audio;
  complexityScore += breakdown.audio;

  // Normalize complexity score (baseline ~10 for simple composition)
  const baselineComplexity = 10;
  const complexityMultiplier = Math.max(0.5, complexityScore / baselineComplexity);

  // Calculate estimated time
  const baseRenderTimeSeconds = totalFrames / BASELINE_FPS;
  const adjustedRenderTime =
    (baseRenderTimeSeconds * complexityMultiplier) / systemInfo.performanceMultiplier;

  // Format time
  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Calculate ranges (±20%)
  const minTime = adjustedRenderTime * 0.8;
  const maxTime = adjustedRenderTime * 1.2;

  return {
    compositionId,
    estimation: {
      estimated: formatTime(adjustedRenderTime),
      estimatedSeconds: Math.round(adjustedRenderTime),
      range: {
        min: formatTime(minTime),
        max: formatTime(maxTime),
        minSeconds: Math.round(minTime),
        maxSeconds: Math.round(maxTime),
      },
    },
    composition: {
      scenes: sceneCount,
      duration: `${totalDurationSeconds}s`,
      frames: totalFrames,
      fps,
    },
    complexity: {
      score: Math.round(complexityScore * 10) / 10,
      multiplier: Math.round(complexityMultiplier * 100) / 100,
      breakdown,
    },
    system: {
      cpu: systemInfo.cpuModel,
      cores: systemInfo.coreCount,
      memory: `${systemInfo.memoryGb}GB`,
      performanceMultiplier: systemInfo.performanceMultiplier,
    },
    recommendations: generateRecommendations(complexityInfo, adjustedRenderTime),
  };
}

function generateRecommendations(complexityInfo, estimatedTime) {
  const recommendations = [];

  if (complexityInfo.particles > 3) {
    recommendations.push({
      area: "particles",
      suggestion: "Consider reducing particle count or complexity for faster renders",
      impact: "medium",
    });
  }

  if (complexityInfo["3d"] > 0) {
    recommendations.push({
      area: "3d",
      suggestion: "3D elements significantly increase render time. Consider pre-rendering or simplifying",
      impact: "high",
    });
  }

  if (complexityInfo.filmGrain > 2) {
    recommendations.push({
      area: "effects",
      suggestion: "Multiple film grain effects can be consolidated into one",
      impact: "low",
    });
  }

  if (estimatedTime > 300) {
    recommendations.push({
      area: "general",
      suggestion: "For faster iteration, consider rendering at 720p during development",
      impact: "high",
    });
  }

  return recommendations;
}

// ============================================
// Main
// ============================================

const result = estimateRenderTime(compositionId);

if (outputJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log("\n========================================");
  console.log("  RENDER TIME ESTIMATION");
  console.log("========================================\n");

  console.log(`Composition: ${result.compositionId}`);
  console.log(`Duration: ${result.composition.duration} (${result.composition.frames} frames @ ${result.composition.fps}fps)`);
  console.log(`Scenes: ${result.composition.scenes}\n`);

  console.log("--- Estimated Render Time ---");
  console.log(`⏱️  ${result.estimation.estimated}`);
  console.log(`   Range: ${result.estimation.range.min} - ${result.estimation.range.max}\n`);

  console.log("--- Complexity Analysis ---");
  console.log(`Score: ${result.complexity.score} (multiplier: ${result.complexity.multiplier}x)`);

  if (verbose) {
    console.log("\nBreakdown:");
    for (const [key, value] of Object.entries(result.complexity.breakdown)) {
      if (value > 0) {
        console.log(`  ${key}: ${value.toFixed(1)}`);
      }
    }
  }

  console.log("\n--- System Info ---");
  console.log(`CPU: ${result.system.cpu}`);
  console.log(`Cores: ${result.system.cores}`);
  console.log(`Memory: ${result.system.memory}`);
  console.log(`Performance: ${result.system.performanceMultiplier}x\n`);

  if (result.recommendations.length > 0) {
    console.log("--- Recommendations ---");
    for (const rec of result.recommendations) {
      const icon = rec.impact === "high" ? "🔴" : rec.impact === "medium" ? "🟡" : "🟢";
      console.log(`${icon} [${rec.area}] ${rec.suggestion}`);
    }
    console.log("");
  }

  console.log("----------------------------------------");
  console.log("Note: Actual render time may vary based on");
  console.log("      system load and specific content.\n");
}
