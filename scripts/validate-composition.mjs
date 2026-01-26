/**
 * Composition Validation Script
 *
 * Pre-render validation checks for Remotion compositions:
 * - Scene duration vs audio duration (5% tolerance)
 * - Referenced templates/components exist
 * - Audio files exist
 * - Total duration matches
 * - Transition overlap validation
 *
 * Usage:
 *   node scripts/validate-composition.mjs <compositionId>
 *   node scripts/validate-composition.mjs TwoMinuteRule
 *   node scripts/validate-composition.mjs TwoMinuteRule --strict
 *   node scripts/validate-composition.mjs TwoMinuteRule --json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI argument parsing
const args = process.argv.slice(2);
const compositionId = args.find((arg) => !arg.startsWith("-"));
const strictMode = args.includes("--strict") || args.includes("-s");
const outputJson = args.includes("--json") || args.includes("-j");
const verbose = args.includes("--verbose") || args.includes("-v");

if (!compositionId) {
  console.error("Usage: node scripts/validate-composition.mjs <compositionId>");
  console.error("Options:");
  console.error("  -s, --strict   Treat warnings as errors");
  console.error("  -j, --json     Output results as JSON");
  console.error("  -v, --verbose  Show detailed validation info");
  process.exit(1);
}

// ============================================
// Path Resolution
// ============================================

const paths = {
  narration: path.join(projectRoot, "projects", compositionId, "narration.json"),
  audioDir: path.join(projectRoot, "public/videos", compositionId, "audio"),
  audioMetadata: path.join(
    projectRoot,
    "public/videos",
    compositionId,
    "audio/audio-metadata.json"
  ),
  videoDir: path.join(projectRoot, "src/videos", compositionId),
  sharedTemplates: path.join(projectRoot, "src/shared/templates/scenes"),
  sharedComponents: path.join(projectRoot, "src/shared/components"),
};

// ============================================
// Validation Functions
// ============================================

const errors = [];
const warnings = [];
const info = [];

function addError(category, message, details = null) {
  errors.push({ category, message, details });
}

function addWarning(category, message, details = null) {
  warnings.push({ category, message, details });
}

function addInfo(category, message, details = null) {
  info.push({ category, message, details });
}

/**
 * Check if narration.json exists and is valid
 */
function validateNarrationFile() {
  if (!fs.existsSync(paths.narration)) {
    addError(
      "narration",
      `narration.json not found: ${paths.narration}`,
      { path: paths.narration }
    );
    return null;
  }

  try {
    const narration = JSON.parse(fs.readFileSync(paths.narration, "utf-8"));

    if (!narration.metadata?.compositionId) {
      addError("narration", "Missing metadata.compositionId in narration.json");
    } else if (narration.metadata.compositionId !== compositionId) {
      addWarning(
        "narration",
        `compositionId mismatch: expected "${compositionId}", got "${narration.metadata.compositionId}"`
      );
    }

    if (!narration.scenes || narration.scenes.length === 0) {
      addError("narration", "No scenes defined in narration.json");
      return null;
    }

    addInfo("narration", `Found ${narration.scenes.length} scenes`);
    return narration;
  } catch (e) {
    addError("narration", `Invalid JSON: ${e.message}`);
    return null;
  }
}

/**
 * Validate audio files exist and match scenes
 */
function validateAudioFiles(narration) {
  if (!narration) return null;

  const audioFiles = {};

  if (!fs.existsSync(paths.audioDir)) {
    addWarning(
      "audio",
      `Audio directory not found: ${paths.audioDir}`,
      { suggestion: "Run: node scripts/generate-tts.mjs -f projects/" + compositionId + "/narration.json" }
    );
    return null;
  }

  for (const scene of narration.scenes) {
    const audioPath = path.join(paths.audioDir, `${scene.id}.mp3`);
    if (!fs.existsSync(audioPath)) {
      addError(
        "audio",
        `Missing audio file for scene "${scene.id}"`,
        { expected: audioPath }
      );
    } else {
      audioFiles[scene.id] = audioPath;
    }
  }

  // Check for orphaned audio files
  const existingFiles = fs.readdirSync(paths.audioDir).filter((f) => f.endsWith(".mp3"));
  const expectedFiles = narration.scenes.map((s) => `${s.id}.mp3`);
  const orphaned = existingFiles.filter(
    (f) => !expectedFiles.includes(f) && f !== "music.mp3"
  );

  if (orphaned.length > 0) {
    addWarning(
      "audio",
      `Found ${orphaned.length} orphaned audio file(s)`,
      { files: orphaned }
    );
  }

  const audioCount = Object.keys(audioFiles).length;
  if (audioCount > 0) {
    addInfo("audio", `Found ${audioCount}/${narration.scenes.length} audio files`);
  }

  return audioFiles;
}

/**
 * Validate scene durations against audio metadata
 */
function validateDurations(narration) {
  if (!narration) return;

  if (!fs.existsSync(paths.audioMetadata)) {
    addWarning(
      "duration",
      "No audio-metadata.json found, cannot validate durations",
      { suggestion: "Audio metadata is generated by generate-tts.mjs" }
    );
    return;
  }

  const audioMetadata = JSON.parse(fs.readFileSync(paths.audioMetadata, "utf-8"));
  const tolerance = strictMode ? 0.03 : 0.05; // 3% strict, 5% normal

  let totalNarrationDuration = 0;
  let totalAudioDuration = 0;

  for (const scene of narration.scenes) {
    const audioScene = audioMetadata.scenes.find((s) => s.id === scene.id);

    if (!audioScene || !audioScene.durationSeconds) {
      addWarning(
        "duration",
        `No audio duration data for scene "${scene.id}"`
      );
      continue;
    }

    const narrationDuration = scene.duration || 5;
    const audioDuration = audioScene.durationSeconds;

    totalNarrationDuration += narrationDuration;
    totalAudioDuration += audioDuration;

    const diff = Math.abs(narrationDuration - audioDuration);
    const diffPercent = diff / audioDuration;

    if (diffPercent > tolerance) {
      addWarning(
        "duration",
        `Scene "${scene.id}" duration mismatch: narration ${narrationDuration}s vs audio ${audioDuration.toFixed(1)}s (${(diffPercent * 100).toFixed(1)}% diff)`,
        {
          scene: scene.id,
          narrationDuration,
          audioDuration,
          diffPercent: diffPercent * 100,
        }
      );
    }
  }

  // Total duration check
  const totalDiff = Math.abs(totalNarrationDuration - totalAudioDuration);
  const totalDiffPercent = totalDiff / totalAudioDuration;

  if (totalDiffPercent > tolerance) {
    addWarning(
      "duration",
      `Total duration mismatch: narration ${totalNarrationDuration}s vs audio ${totalAudioDuration.toFixed(1)}s`,
      {
        narrationTotal: totalNarrationDuration,
        audioTotal: totalAudioDuration,
        diffPercent: totalDiffPercent * 100,
      }
    );
  } else {
    addInfo(
      "duration",
      `Total duration: ${totalAudioDuration.toFixed(1)}s (${(totalDiffPercent * 100).toFixed(1)}% variance)`
    );
  }
}

/**
 * Validate scene visual references (templates, components)
 */
async function validateVisualReferences(narration) {
  if (!narration) return;

  // Get available templates
  const templateFiles = await glob("*.tsx", { cwd: paths.sharedTemplates });
  const availableTemplates = templateFiles.map((f) => f.replace(".tsx", "").toLowerCase());

  // Get available components
  const componentDirs = fs.existsSync(paths.sharedComponents)
    ? fs.readdirSync(paths.sharedComponents, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name.toLowerCase())
    : [];

  // Check video-specific components
  const videoComponentsDir = path.join(paths.videoDir, "components");
  const videoComponents = fs.existsSync(videoComponentsDir)
    ? fs.readdirSync(videoComponentsDir).map((f) => f.replace(".tsx", "").toLowerCase())
    : [];

  const allComponents = [...availableTemplates, ...componentDirs, ...videoComponents];

  for (const scene of narration.scenes) {
    if (scene.template) {
      const templateLower = scene.template.toLowerCase();
      if (!availableTemplates.some((t) => templateLower.includes(t))) {
        addWarning(
          "visual",
          `Scene "${scene.id}" references unknown template: ${scene.template}`,
          { available: availableTemplates }
        );
      }
    }

    if (scene.components) {
      for (const comp of scene.components) {
        const compLower = comp.toLowerCase();
        if (!allComponents.some((c) => compLower.includes(c))) {
          addWarning(
            "visual",
            `Scene "${scene.id}" references unknown component: ${comp}`
          );
        }
      }
    }
  }

  addInfo("visual", `Available templates: ${availableTemplates.length}`);
}

/**
 * Validate video source directory
 */
function validateVideoSource() {
  if (!fs.existsSync(paths.videoDir)) {
    addWarning(
      "source",
      `Video source directory not found: ${paths.videoDir}`,
      { suggestion: "Create the composition directory in src/videos/" }
    );
    return false;
  }

  // Check for main composition file
  const mainFile = path.join(paths.videoDir, "index.tsx");
  const compositionFile = path.join(paths.videoDir, `${compositionId}.tsx`);

  if (!fs.existsSync(mainFile) && !fs.existsSync(compositionFile)) {
    addWarning(
      "source",
      `No main composition file found in ${paths.videoDir}`,
      { checked: [mainFile, compositionFile] }
    );
  } else {
    addInfo("source", "Composition source files found");
  }

  return true;
}

/**
 * Validate transition overlaps
 */
function validateTransitions(narration) {
  if (!narration || !narration.scenes) return;

  let currentTime = 0;
  const sceneTimings = [];

  for (const scene of narration.scenes) {
    const duration = scene.duration || 5;
    const transitionIn = scene.transitionIn?.duration || 0;
    const transitionOut = scene.transitionOut?.duration || 0;

    const effectiveStart = currentTime;
    const effectiveEnd = currentTime + duration;

    // Check for negative overlap with previous scene
    if (sceneTimings.length > 0) {
      const prevScene = sceneTimings[sceneTimings.length - 1];
      const prevTransitionOut = prevScene.transitionOut || 0;

      if (transitionIn + prevTransitionOut > duration * 0.5) {
        addWarning(
          "transition",
          `Potential transition overlap: "${prevScene.id}" → "${scene.id}"`,
          {
            prevTransitionOut,
            transitionIn,
            sceneDuration: duration,
          }
        );
      }
    }

    sceneTimings.push({
      id: scene.id,
      start: effectiveStart,
      end: effectiveEnd,
      transitionIn,
      transitionOut,
    });

    currentTime += duration;
  }

  addInfo("transition", `Validated ${sceneTimings.length} scene transitions`);
}

// ============================================
// Main Validation
// ============================================

async function runValidation() {
  console.log(`\n========================================`);
  console.log(`  COMPOSITION VALIDATION: ${compositionId}`);
  console.log(`========================================\n`);

  // Run all validations
  const narration = validateNarrationFile();
  validateAudioFiles(narration);
  validateDurations(narration);
  await validateVisualReferences(narration);
  validateVideoSource();
  validateTransitions(narration);

  // Results
  const result = {
    compositionId,
    validatedAt: new Date().toISOString(),
    strictMode,
    passed: errors.length === 0 && (!strictMode || warnings.length === 0),
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
    },
    errors,
    warnings,
    info: verbose ? info : undefined,
  };

  if (outputJson) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // Console output
  if (errors.length > 0) {
    console.log("❌ ERRORS:");
    for (const err of errors) {
      console.log(`   [${err.category}] ${err.message}`);
      if (verbose && err.details) {
        console.log(`      Details: ${JSON.stringify(err.details)}`);
      }
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS:");
    for (const warn of warnings) {
      console.log(`   [${warn.category}] ${warn.message}`);
      if (verbose && warn.details) {
        console.log(`      Details: ${JSON.stringify(warn.details)}`);
      }
    }
    console.log("");
  }

  if (verbose && info.length > 0) {
    console.log("ℹ️  INFO:");
    for (const i of info) {
      console.log(`   [${i.category}] ${i.message}`);
    }
    console.log("");
  }

  // Summary
  console.log("----------------------------------------");
  if (result.passed) {
    console.log("✅ VALIDATION PASSED");
  } else if (errors.length > 0) {
    console.log("❌ VALIDATION FAILED");
    console.log(`   ${errors.length} error(s), ${warnings.length} warning(s)`);
  } else {
    console.log("⚠️  VALIDATION PASSED WITH WARNINGS");
    console.log(`   ${warnings.length} warning(s)`);
  }
  console.log("");

  process.exit(result.passed ? 0 : 1);
}

runValidation().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});
