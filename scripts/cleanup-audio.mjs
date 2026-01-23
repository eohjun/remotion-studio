/**
 * Audio Cleanup Script
 *
 * Detects and optionally removes unused audio files in public/videos/{compositionId}/audio/.
 *
 * Usage:
 *   node scripts/cleanup-audio.mjs              # List unused files (dry run)
 *   node scripts/cleanup-audio.mjs --delete     # Delete unused files
 *   node scripts/cleanup-audio.mjs --verbose    # Show detailed analysis
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const videosDir = path.join(projectRoot, "public", "videos");
const srcDir = path.join(projectRoot, "src");

// CLI args
const args = process.argv.slice(2);
const shouldDelete = args.includes("--delete") || args.includes("-d");
const verbose = args.includes("--verbose") || args.includes("-v");

/**
 * Get all audio files recursively from videos/{compositionId}/audio/ folders
 */
function getAllAudioFiles(videosDir, files = []) {
  if (!fs.existsSync(videosDir)) return files;

  const compositionDirs = fs.readdirSync(videosDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const compDir of compositionDirs) {
    const audioDir = path.join(videosDir, compDir.name, "audio");
    if (!fs.existsSync(audioDir)) continue;

    const entries = fs.readdirSync(audioDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(audioDir, entry.name);
      if (entry.isFile() && /\.(mp3|wav|ogg|m4a|aac)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Get all audio references in source code
 */
function getAudioReferences() {
  const references = new Set();

  try {
    // Search for all videos/*/audio/ patterns in source files
    const grepResult = execSync(
      `grep -rh "videos/" "${srcDir}" --include="*.tsx" --include="*.ts" 2>/dev/null || true`,
      { encoding: "utf-8" }
    );

    // Extract paths like: videos/SelfHelpCritiqueEN/audio/intro.mp3
    const pathRegex = /videos\/[A-Za-z0-9_-]+\/audio\/[A-Za-z0-9_-]+\.mp3/g;
    let match;
    while ((match = pathRegex.exec(grepResult)) !== null) {
      references.add(match[0]);
    }
  } catch (error) {
    console.error("Error searching source files:", error.message);
  }

  return references;
}

/**
 * Get composition folders with audio (videos/{compositionId}/audio/)
 */
function getCompositionFolders() {
  const folders = [];
  if (!fs.existsSync(videosDir)) return folders;

  const entries = fs.readdirSync(videosDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const audioPath = path.join(videosDir, entry.name, "audio");
      if (fs.existsSync(audioPath)) {
        folders.push(entry.name);
      }
    }
  }
  return folders;
}

/**
 * Main analysis
 */
function analyze() {
  console.log("🔍 Analyzing audio files in public/videos/*/audio/...\n");

  const allAudioFiles = getAllAudioFiles(videosDir);
  const references = getAudioReferences();
  const compositionFolders = getCompositionFolders();

  if (verbose) {
    console.log(`📁 Composition folders: ${compositionFolders.join(", ") || "none"}`);
    console.log(`📄 Total audio files: ${allAudioFiles.length}`);
    console.log(`🔗 References found in code: ${references.size}\n`);
  }

  const unusedFiles = [];
  const usedFiles = [];

  for (const audioFile of allAudioFiles) {
    const relativePath = path.relative(path.join(projectRoot, "public"), audioFile);

    // Check if this file is referenced
    const isReferenced = Array.from(references).some((ref) =>
      relativePath.includes(ref) || ref.includes(relativePath.replace(/\\/g, "/"))
    );

    if (isReferenced) {
      usedFiles.push(relativePath);
    } else {
      unusedFiles.push(relativePath);
    }
  }

  // Report
  console.log("═══════════════════════════════════════════════════════════");
  console.log("📊 AUDIO FILE ANALYSIS REPORT");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Composition folders
  if (compositionFolders.length > 0) {
    console.log("📁 Composition Folders with Audio:");
    for (const folder of compositionFolders) {
      const audioPath = path.join(videosDir, folder, "audio");
      const fileCount = fs.existsSync(audioPath)
        ? fs.readdirSync(audioPath).filter(f => /\.(mp3|wav|ogg|m4a|aac)$/i.test(f)).length
        : 0;
      console.log(`   videos/${folder}/audio/ (${fileCount} files)`);
    }
    console.log("");
  }

  // Used files
  if (verbose && usedFiles.length > 0) {
    console.log(`✅ Used files (${usedFiles.length}):`);
    for (const file of usedFiles) {
      console.log(`   ${file}`);
    }
    console.log("");
  }

  // Unused files in composition folders
  if (unusedFiles.length > 0) {
    console.log(`❌ Unused files in composition folders (${unusedFiles.length}):`);
    for (const file of unusedFiles) {
      const fullPath = path.join(projectRoot, "public", file);
      const size = fs.statSync(fullPath).size;
      console.log(`   ${file} (${(size / 1024).toFixed(1)} KB)`);
    }
    console.log("");
  }

  // Summary
  const totalUnused = unusedFiles.length;
  const totalSize = unusedFiles.reduce((sum, file) => {
    const fullPath = path.join(projectRoot, "public", file);
    return sum + fs.statSync(fullPath).size;
  }, 0);

  console.log("───────────────────────────────────────────────────────────");
  console.log(`📈 Summary:`);
  console.log(`   Total audio files: ${allAudioFiles.length}`);
  console.log(`   Used: ${usedFiles.length}`);
  console.log(`   Potentially unused: ${totalUnused} (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
  console.log("───────────────────────────────────────────────────────────\n");

  // Delete if requested
  if (shouldDelete && totalUnused > 0) {
    console.log("🗑️  Deleting unused files...\n");

    for (const file of unusedFiles) {
      const fullPath = path.join(projectRoot, "public", file);
      try {
        fs.unlinkSync(fullPath);
        console.log(`   ✅ Deleted: ${file}`);
      } catch (error) {
        console.log(`   ❌ Failed to delete: ${file} - ${error.message}`);
      }
    }

    console.log("\n✨ Cleanup complete!");
  } else if (totalUnused > 0) {
    console.log("💡 To delete unused files, run:");
    console.log("   node scripts/cleanup-audio.mjs --delete\n");
  } else {
    console.log("✨ No unused audio files found!\n");
  }
}

analyze();
