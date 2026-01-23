import * as fs from "fs";
import * as path from "path";
import { parseNote } from "./parser";
import type { ParsedNote, VideoContext } from "./types";

/**
 * Obsidian vault loader for video generation
 */

/** Default vault configuration */
export interface VaultConfig {
  /** Path to vault root */
  vaultPath: string;
  /** Path to Zettelkasten folder relative to vault */
  zettelkastenPath: string;
  /** Maximum depth for loading linked notes */
  maxLinkDepth: number;
}

const DEFAULT_VAULT_CONFIG: VaultConfig = {
  vaultPath: "/mnt/c/Users/SaintEoh/Documents/SecondBrain",
  zettelkastenPath: "04_Zettelkasten",
  maxLinkDepth: 1,
};

/**
 * Load a note by ID from the vault
 */
export function loadNoteById(
  noteId: string,
  config: Partial<VaultConfig> = {}
): ParsedNote | null {
  const fullConfig = { ...DEFAULT_VAULT_CONFIG, ...config };
  const zettelPath = path.join(fullConfig.vaultPath, fullConfig.zettelkastenPath);

  // Find file matching the ID
  const filename = findNoteFile(noteId, zettelPath);
  if (!filename) {
    console.warn(`Note not found: ${noteId}`);
    return null;
  }

  const filePath = path.join(zettelPath, filename);
  return loadNoteFromPath(filePath);
}

/**
 * Load a note from a file path
 */
export function loadNoteFromPath(filePath: string): ParsedNote | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const filename = path.basename(filePath);
    return parseNote(content, filename);
  } catch (error) {
    console.error(`Error loading note: ${filePath}`, error);
    return null;
  }
}

/**
 * Find note file by ID
 */
function findNoteFile(noteId: string, zettelPath: string): string | null {
  try {
    const files = fs.readdirSync(zettelPath);

    // Look for file starting with the note ID
    for (const file of files) {
      if (file.startsWith(noteId) && file.endsWith(".md")) {
        return file;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Load all linked notes from a parsed note
 */
export function loadLinkedNotes(
  note: ParsedNote,
  config: Partial<VaultConfig> = {},
  depth: number = 0
): ParsedNote[] {
  const fullConfig = { ...DEFAULT_VAULT_CONFIG, ...config };

  if (depth >= fullConfig.maxLinkDepth) {
    return [];
  }

  const linkedNotes: ParsedNote[] = [];
  const loadedIds = new Set<string>();

  for (const link of note.linkedNotes) {
    if (loadedIds.has(link.id)) continue;

    const linkedNote = loadNoteById(link.id, config);
    if (linkedNote) {
      loadedIds.add(link.id);
      linkedNotes.push(linkedNote);

      // Recursively load linked notes
      if (depth + 1 < fullConfig.maxLinkDepth) {
        const deeperNotes = loadLinkedNotes(linkedNote, config, depth + 1);
        for (const deepNote of deeperNotes) {
          if (!loadedIds.has(deepNote.id)) {
            loadedIds.add(deepNote.id);
            linkedNotes.push(deepNote);
          }
        }
      }
    }
  }

  return linkedNotes;
}

/**
 * Create video context from a note ID
 */
export function createVideoContext(
  noteId: string,
  config: Partial<VaultConfig> = {}
): VideoContext | null {
  const mainNote = loadNoteById(noteId, config);
  if (!mainNote) {
    return null;
  }

  const linkedNotes = loadLinkedNotes(mainNote, config);

  return {
    mainNote,
    linkedNotes,
  };
}

/**
 * Get all note IDs in the Zettelkasten folder
 */
export function listAllNotes(config: Partial<VaultConfig> = {}): string[] {
  const fullConfig = { ...DEFAULT_VAULT_CONFIG, ...config };
  const zettelPath = path.join(fullConfig.vaultPath, fullConfig.zettelkastenPath);

  try {
    const files = fs.readdirSync(zettelPath);
    const noteIds: string[] = [];

    for (const file of files) {
      if (file.endsWith(".md")) {
        const match = file.match(/^(\d+)/);
        if (match) {
          noteIds.push(match[1]);
        }
      }
    }

    return noteIds;
  } catch {
    return [];
  }
}

/**
 * Summarize a note for video narration
 */
export function summarizeNote(note: ParsedNote): string {
  const parts: string[] = [];

  // Add title
  parts.push(note.title);

  // Add key sections
  for (const section of note.sections) {
    if (section.heading && section.content.length > 0) {
      const contentSummary = section.content
        .slice(0, 3)
        .join(" ")
        .slice(0, 200);
      parts.push(`${section.heading}: ${contentSummary}`);
    }
  }

  return parts.join("\n\n");
}
