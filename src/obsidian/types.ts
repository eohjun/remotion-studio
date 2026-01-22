/**
 * Types for Obsidian note parsing and video generation
 */

/** Note frontmatter metadata */
export interface NoteFrontmatter {
  id?: string;
  created?: string;
  type?: string;
  tags?: string[];
  [key: string]: unknown;
}

/** Parsed note structure */
export interface ParsedNote {
  /** Note ID from filename or frontmatter */
  id: string;
  /** Note title */
  title: string;
  /** Frontmatter metadata */
  frontmatter: NoteFrontmatter;
  /** Main content sections */
  sections: NoteSection[];
  /** Linked notes ([[note]] references) */
  linkedNotes: LinkedNote[];
  /** Raw content without frontmatter */
  rawContent: string;
}

/** Note section with heading */
export interface NoteSection {
  /** Section heading */
  heading: string;
  /** Heading level (1-6) */
  level: number;
  /** Section content (paragraphs) */
  content: string[];
  /** Sub-sections */
  subsections?: NoteSection[];
}

/** Linked note reference */
export interface LinkedNote {
  /** Note ID */
  id: string;
  /** Note title */
  title: string;
  /** Original link text */
  raw: string;
  /** Optional alias (display text) */
  alias?: string;
}

/** Video generation context from notes */
export interface VideoContext {
  /** Main note being converted */
  mainNote: ParsedNote;
  /** Connected notes for additional context */
  linkedNotes: ParsedNote[];
  /** Generated narration script */
  narration?: NarrationScript;
  /** Audio file durations (in seconds) */
  audioDurations?: Record<string, number>;
}

/** Narration script structure */
export interface NarrationScript {
  /** Introduction section */
  intro: NarrationSection;
  /** Main content sections */
  sections: NarrationSection[];
  /** Conclusion/outro */
  outro: NarrationSection;
}

/** Narration section */
export interface NarrationSection {
  /** Section ID for mapping to scenes */
  id: string;
  /** Scene type suggestion */
  suggestedSceneType: string;
  /** Narration text */
  text: string;
  /** Key points to highlight */
  keyPoints?: string[];
  /** Source note IDs */
  sourceNotes?: string[];
}
