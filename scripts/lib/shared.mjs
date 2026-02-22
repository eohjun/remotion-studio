/**
 * Shared utilities for video pipeline scripts.
 * Extracted to eliminate duplication across 20+ scripts.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, "..");

/** Default FPS when constants.ts is unavailable */
export const DEFAULT_FPS = 60;

/** Default scene duration fallback (seconds) - use consistently across all scripts */
export const DEFAULT_SCENE_DURATION = 5;

/**
 * Read FPS from a composition's constants.ts file.
 * Falls back to DEFAULT_FPS if unavailable.
 *
 * @param {string} compositionId
 * @returns {number}
 */
export function getFpsFromConstants(compositionId) {
  if (!compositionId) {
    return DEFAULT_FPS;
  }

  const constantsPath = path.join(
    PROJECT_ROOT,
    "src",
    "videos",
    compositionId,
    "constants.ts"
  );

  if (!fs.existsSync(constantsPath)) {
    return DEFAULT_FPS;
  }

  try {
    const content = fs.readFileSync(constantsPath, "utf-8");
    const match = content.match(/export\s+const\s+FPS\s*=\s*(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  } catch {
    // Fall through to default
  }

  return DEFAULT_FPS;
}

/**
 * Load and parse narration.json for a composition.
 *
 * @param {string} compositionId
 * @returns {object|null} Parsed narration or null if not found
 */
export function loadNarration(compositionId) {
  const narrationPath = path.join(
    PROJECT_ROOT,
    "projects",
    compositionId,
    "narration.json"
  );

  if (!fs.existsSync(narrationPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(narrationPath, "utf-8"));
  } catch (error) {
    console.error(`❌ Failed to parse narration.json: ${error.message}`);
    return null;
  }
}

/**
 * Load audio-metadata.json for a composition.
 *
 * @param {string} compositionId
 * @returns {object|null}
 */
export function loadAudioMetadata(compositionId) {
  const metadataPath = path.join(
    PROJECT_ROOT,
    "public",
    "videos",
    compositionId,
    "audio",
    "audio-metadata.json"
  );

  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Parse common CLI arguments.
 *
 * @param {string[]} args - process.argv.slice(2)
 * @param {Object} flagDefs - { flagName: { aliases: string[], hasValue: boolean, default: any } }
 * @returns {{ compositionId: string|null, flags: Object }}
 */
export function parseArgs(args, flagDefs = {}) {
  const flags = {};
  let compositionId = null;

  // Set defaults
  for (const [key, def] of Object.entries(flagDefs)) {
    if (def.default !== undefined) {
      flags[key] = def.default;
    }
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--") || arg.startsWith("-")) {
      let matched = false;
      for (const [key, def] of Object.entries(flagDefs)) {
        const allNames = [key, ...(def.aliases || [])].map((n) =>
          n.startsWith("-") ? n : `--${n}`
        );
        if (allNames.includes(arg)) {
          if (def.hasValue) {
            flags[key] = args[++i];
          } else {
            flags[key] = true;
          }
          matched = true;
          break;
        }
      }
      if (!matched && arg === "--help") {
        flags.help = true;
      }
    } else if (!compositionId) {
      compositionId = arg;
    }
  }

  return { compositionId, flags };
}
