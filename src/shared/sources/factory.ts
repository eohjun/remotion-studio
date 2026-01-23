/**
 * Source factory for automatic source type detection and parsing
 */

import type { ContentSource, ParseOptions, SourceDetectionResult, SourceParser, SourceType } from "./types";
import { detectSourceType } from "./base";
import { PDFParser } from "./pdf/parser";
import { DOCXParser } from "./docx/parser";
import { WebParser } from "./web/parser";

/** Registry of available parsers */
const parsers: SourceParser[] = [
  new PDFParser(),
  new DOCXParser(),
  new WebParser(),
];

/**
 * Detect source type with confidence
 */
export function detectSource(source: string): SourceDetectionResult {
  const detectedType = detectSourceType(source);

  if (detectedType) {
    return {
      sourceType: detectedType,
      confidence: 1.0,
      reason: `File extension or URL pattern matched: ${detectedType}`,
    };
  }

  // Try each parser's canParse method
  for (const parser of parsers) {
    if (parser.canParse(source)) {
      return {
        sourceType: parser.sourceType,
        confidence: 0.8,
        reason: `Parser ${parser.sourceType} can handle this source`,
      };
    }
  }

  // Default to obsidian for .md files or unknown
  return {
    sourceType: "obsidian",
    confidence: 0.5,
    reason: "Defaulting to obsidian source type",
  };
}

/**
 * Get parser for a specific source type
 */
export function getParser(sourceType: SourceType): SourceParser | null {
  for (const parser of parsers) {
    if (parser.sourceType === sourceType) {
      return parser;
    }
  }
  return null;
}

/**
 * Parse a source automatically detecting the type
 */
export async function parseSource(
  source: string,
  options?: ParseOptions
): Promise<ContentSource> {
  const detection = detectSource(source);

  // Handle obsidian separately (uses different loading mechanism)
  if (detection.sourceType === "obsidian") {
    throw new Error(
      "Obsidian sources should be loaded using the obsidian module. " +
      "Use loadNoteById() or loadNoteFromPath() from src/obsidian/loader.ts"
    );
  }

  const parser = getParser(detection.sourceType);
  if (!parser) {
    throw new Error(`No parser available for source type: ${detection.sourceType}`);
  }

  if (!parser.canParse(source)) {
    throw new Error(`Parser ${detection.sourceType} cannot parse source: ${source}`);
  }

  return parser.parse(source, options);
}

/**
 * Check if a source can be parsed
 */
export function canParseSource(source: string): boolean {
  const detection = detectSource(source);

  if (detection.sourceType === "obsidian") {
    return source.toLowerCase().endsWith(".md");
  }

  const parser = getParser(detection.sourceType);
  return parser ? parser.canParse(source) : false;
}

/**
 * Get all supported source types
 */
export function getSupportedSourceTypes(): SourceType[] {
  return ["obsidian", "pdf", "docx", "web"];
}

/**
 * Get file extensions supported for parsing
 */
export function getSupportedExtensions(): string[] {
  return [".md", ".pdf", ".docx", ".doc"];
}
