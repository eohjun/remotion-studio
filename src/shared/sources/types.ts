/**
 * Multi-source content types for video generation
 * Supports Obsidian, PDF, DOCX, and Web sources
 */

import type { NoteSection } from "../obsidian/types";

/** Supported source types */
export type SourceType = "obsidian" | "pdf" | "docx" | "web";

/** Source metadata */
export interface SourceMetadata {
  /** Original source type */
  sourceType: SourceType;
  /** Original file path or URL */
  sourcePath: string;
  /** Creation date (if available) */
  createdAt?: string;
  /** Last modified date (if available) */
  modifiedAt?: string;
  /** Author information */
  author?: string;
  /** Page count (for documents) */
  pageCount?: number;
  /** Word count estimate */
  wordCount?: number;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Unified content source interface
 * All source parsers produce this format for video generation
 */
export interface ContentSource {
  /** Unique identifier */
  id: string;
  /** Document title */
  title: string;
  /** Source metadata */
  metadata: SourceMetadata;
  /** Parsed content sections (reuses NoteSection from obsidian) */
  sections: NoteSection[];
  /** Raw content without formatting */
  rawContent: string;
  /** Related source IDs (links, references) */
  relatedSources?: string[];
}

/** Parse options for source parsers */
export interface ParseOptions {
  /** Maximum number of sections to extract */
  maxSections?: number;
  /** Whether to extract images/media */
  extractMedia?: boolean;
  /** Custom section heading patterns */
  sectionPatterns?: RegExp[];
  /** Language hint for parsing */
  languageHint?: string;
}

/**
 * Source parser interface
 * Each source type implements this to convert to ContentSource
 */
export interface SourceParser {
  /** Check if parser can handle this source */
  canParse(source: string): boolean;
  /** Parse source to ContentSource */
  parse(source: string, options?: ParseOptions): Promise<ContentSource>;
  /** Parser's source type */
  readonly sourceType: SourceType;
}

/** PDF-specific metadata */
export interface PDFMetadata extends SourceMetadata {
  sourceType: "pdf";
  /** PDF version */
  pdfVersion?: string;
  /** PDF producer software */
  producer?: string;
  /** PDF creator software */
  creator?: string;
}

/** DOCX-specific metadata */
export interface DOCXMetadata extends SourceMetadata {
  sourceType: "docx";
  /** Document template */
  template?: string;
  /** Revision number */
  revision?: number;
}

/** Web-specific metadata */
export interface WebMetadata extends SourceMetadata {
  sourceType: "web";
  /** Page URL */
  url: string;
  /** Page language */
  language?: string;
  /** Open Graph metadata */
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/** Factory result with source type detection */
export interface SourceDetectionResult {
  sourceType: SourceType;
  confidence: number;
  reason: string;
}
