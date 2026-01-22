/**
 * Multi-source support for video generation
 * Supports Obsidian, PDF, DOCX, and Web sources
 */

// Types
export type {
  SourceType,
  SourceMetadata,
  ContentSource,
  ParseOptions,
  SourceParser,
  PDFMetadata,
  DOCXMetadata,
  WebMetadata,
  SourceDetectionResult,
} from "./types";

// Base utilities
export {
  generateSourceId,
  extractSectionsFromText,
  normalizeText,
  countWords,
  createContentSource,
  extractTitle,
  splitParagraphs,
  extractReferences,
  detectSourceType,
} from "./base";

// Parsers
export { PDFParser, parsePDF } from "./pdf";
export { DOCXParser, parseDOCX } from "./docx";
export { WebParser, parseWebPage } from "./web";

// Factory
export {
  detectSource,
  getParser,
  parseSource,
  canParseSource,
  getSupportedSourceTypes,
  getSupportedExtensions,
} from "./factory";
