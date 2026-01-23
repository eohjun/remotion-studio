// Obsidian integration barrel export

// Types
export type {
  NoteFrontmatter,
  ParsedNote,
  NoteSection,
  LinkedNote,
  VideoContext,
  NarrationScript,
  NarrationSection,
} from "./types";

// Parser
export {
  parseNote,
  getSectionContent,
  extractKeyPoints,
} from "./parser";

// Loader
export {
  loadNoteById,
  loadNoteFromPath,
  loadLinkedNotes,
  createVideoContext,
  listAllNotes,
  summarizeNote,
} from "./loader";

export type { VaultConfig } from "./loader";

// Narration
export {
  generateNarrationScript,
  narrationToSceneConfig,
} from "./narration";
