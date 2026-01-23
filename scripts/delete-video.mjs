/**
 * Video Deletion Script
 *
 * Safely deletes all files associated with a video composition.
 *
 * Usage:
 *   node scripts/delete-video.mjs <compositionId>           # Dry run (preview)
 *   node scripts/delete-video.mjs <compositionId> --confirm # Actually delete
 *
 * Example:
 *   node scripts/delete-video.mjs SelfHelpCritiqueEN --confirm
 *
 * This will delete:
 *   - src/videos/<compositionId>/          (source code)
 *   - public/videos/<compositionId>/       (audio files)
 *   - projects/<compositionId>/            (narration, youtube assets, output)
 *   - Reference in src/Root.tsx (manual removal required)
 *
 * Protected paths (NEVER deleted):
 *   - src/shared/, src/demos/, src/Root.tsx, scripts/, node_modules/, .git/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI args
const args = process.argv.slice(2);
const compositionId = args.find(arg => !arg.startsWith("-"));
const shouldDelete = args.includes("--confirm") || args.includes("-y");

if (!compositionId) {
  console.log(`
📹 Video Deletion Script

Usage:
  node scripts/delete-video.mjs <compositionId>           # Preview (dry run)
  node scripts/delete-video.mjs <compositionId> --confirm # Delete

Example:
  node scripts/delete-video.mjs SelfHelpCritiqueEN --confirm

Available videos:
`);

  // List available videos
  const videosDir = path.join(projectRoot, "src", "videos");
  if (fs.existsSync(videosDir)) {
    const videos = fs.readdirSync(videosDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    if (videos.length > 0) {
      videos.forEach(v => console.log(`  - ${v}`));
    } else {
      console.log("  (no videos found)");
    }
  }

  process.exit(0);
}

// Protected items that should NEVER be deleted
const PROTECTED_PATHS = [
  "src/shared",
  "src/demos",
  "src/Root.tsx",
  "src/index.ts",
  "scripts",
  "node_modules",
  ".git",
];

// Paths to check for this video
const videoPaths = [
  {
    path: path.join(projectRoot, "src", "videos", compositionId),
    description: "Source code (src/videos/)",
  },
  {
    path: path.join(projectRoot, "public", "videos", compositionId),
    description: "Audio files (public/videos/)",
  },
  {
    path: path.join(projectRoot, "projects", compositionId),
    description: "Project files (projects/)",
  },
];

/**
 * Get directory size recursively
 */
function getDirSize(dirPath) {
  let size = 0;
  if (!fs.existsSync(dirPath)) return size;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      size += getDirSize(fullPath);
    } else {
      size += fs.statSync(fullPath).size;
    }
  }
  return size;
}

/**
 * Count files recursively
 */
function countFiles(dirPath) {
  let count = 0;
  if (!fs.existsSync(dirPath)) return count;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Delete directory recursively
 */
function deleteDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  fs.rmSync(dirPath, { recursive: true, force: true });
}

/**
 * Check if path is protected
 */
function isProtected(checkPath) {
  const relativePath = path.relative(projectRoot, checkPath);
  return PROTECTED_PATHS.some(p =>
    relativePath === p || relativePath.startsWith(p + path.sep)
  );
}

// Main execution
console.log(`
═══════════════════════════════════════════════════════════
📹 VIDEO DELETION: ${compositionId}
═══════════════════════════════════════════════════════════
`);

// Check each path
let totalSize = 0;
let totalFiles = 0;
const existingPaths = [];

for (const item of videoPaths) {
  const exists = fs.existsSync(item.path);
  const size = exists ? getDirSize(item.path) : 0;
  const files = exists ? countFiles(item.path) : 0;

  if (exists) {
    existingPaths.push(item);
    totalSize += size;
    totalFiles += files;
    console.log(`✅ ${item.description}`);
    console.log(`   ${item.path}`);
    console.log(`   ${files} files, ${(size / 1024 / 1024).toFixed(2)} MB\n`);
  } else {
    console.log(`⬜ ${item.description} - not found\n`);
  }
}

// Safety check
for (const item of existingPaths) {
  if (isProtected(item.path)) {
    console.error(`\n🚨 ERROR: Attempting to delete protected path!`);
    console.error(`   ${item.path}`);
    console.error(`\nAborting for safety.`);
    process.exit(1);
  }
}

console.log(`───────────────────────────────────────────────────────────`);
console.log(`📊 Total: ${totalFiles} files, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`───────────────────────────────────────────────────────────\n`);

if (existingPaths.length === 0) {
  console.log(`⚠️  No files found for "${compositionId}"`);
  process.exit(0);
}

// Check Root.tsx for reference
const rootPath = path.join(projectRoot, "src", "Root.tsx");
if (fs.existsSync(rootPath)) {
  const rootContent = fs.readFileSync(rootPath, "utf-8");
  if (rootContent.includes(compositionId)) {
    console.log(`⚠️  Note: "${compositionId}" is still referenced in src/Root.tsx`);
    console.log(`   You need to manually remove the import and <Composition> entry.\n`);
  }
}

// Delete or preview
if (shouldDelete) {
  console.log(`🗑️  Deleting...\n`);

  for (const item of existingPaths) {
    try {
      deleteDir(item.path);
      console.log(`   ✅ Deleted: ${item.description}`);
    } catch (error) {
      console.log(`   ❌ Failed: ${item.description} - ${error.message}`);
    }
  }

  console.log(`\n✨ Deletion complete!`);
  console.log(`\n⚠️  Remember to:`);
  console.log(`   1. Remove the import from src/Root.tsx`);
  console.log(`   2. Remove the <Composition> entry from src/Root.tsx`);
  console.log(`   3. Run 'npm run lint' to verify no broken imports`);
} else {
  console.log(`💡 This is a DRY RUN. No files were deleted.`);
  console.log(`   To actually delete, run:`);
  console.log(`   node scripts/delete-video.mjs ${compositionId} --confirm\n`);
}
