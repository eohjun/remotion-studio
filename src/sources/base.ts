/**
 * Base utilities for source parsing
 */

import type { NoteSection } from "../obsidian/types";
import type { ContentSource, SourceMetadata, SourceType } from "./types";
import * as crypto from "crypto";

/**
 * Generate a unique ID for a content source
 */
export function generateSourceId(sourcePath: string, sourceType: SourceType): string {
  const hash = crypto.createHash("md5").update(sourcePath).digest("hex").slice(0, 8);
  const timestamp = Date.now().toString(36);
  return `${sourceType}_${timestamp}_${hash}`;
}

/**
 * Extract sections from plain text content
 * Supports markdown-style headings and common document patterns
 */
export function extractSectionsFromText(content: string): NoteSection[] {
  const sections: NoteSection[] = [];
  const lines = content.split("\n");

  let currentSection: NoteSection | null = null;
  let currentContent: string[] = [];

  const flushSection = () => {
    if (currentSection && currentContent.length > 0) {
      currentSection.content = currentContent.filter((c) => c.trim());
      sections.push(currentSection);
      currentContent = [];
    }
  };

  for (const line of lines) {
    // Check for markdown heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: [],
      };
      continue;
    }

    // Check for numbered heading (e.g., "1. Introduction")
    const numberedMatch = line.match(/^(\d+)\.\s+([A-Z].+)$/);
    if (numberedMatch && line.length < 100) {
      flushSection();
      currentSection = {
        heading: numberedMatch[2].trim(),
        level: 2,
        content: [],
      };
      continue;
    }

    // Accumulate content
    if (currentSection) {
      currentContent.push(line);
    } else if (line.trim()) {
      // Content before first heading goes to implicit section
      if (!currentSection) {
        currentSection = {
          heading: "Introduction",
          level: 1,
          content: [],
        };
      }
      currentContent.push(line);
    }
  }

  flushSection();
  return sections;
}

/**
 * Clean and normalize text content
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\t/g, "  ") // Convert tabs to spaces
    .replace(/\n{3,}/g, "\n\n") // Collapse multiple newlines
    .replace(/[ ]{2,}/g, " ") // Collapse multiple spaces
    .trim();
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  const words = text.match(/\b\w+\b/g);
  return words ? words.length : 0;
}

/**
 * Create a ContentSource object
 */
export function createContentSource(params: {
  sourcePath: string;
  sourceType: SourceType;
  title: string;
  sections: NoteSection[];
  rawContent: string;
  metadata?: Partial<SourceMetadata>;
  relatedSources?: string[];
}): ContentSource {
  const { sourcePath, sourceType, title, sections, rawContent, metadata, relatedSources } = params;

  return {
    id: generateSourceId(sourcePath, sourceType),
    title,
    metadata: {
      sourceType,
      sourcePath,
      wordCount: countWords(rawContent),
      ...metadata,
    },
    sections,
    rawContent,
    relatedSources,
  };
}

/**
 * Extract title from content if not provided
 */
export function extractTitle(content: string, fallbackTitle: string): string {
  // Try to find first heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  // Try to find first non-empty line that looks like a title
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length > 0 && lines[0].length < 100) {
    return lines[0].trim();
  }

  return fallbackTitle;
}

/**
 * Split content into paragraphs
 */
export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Extract links/references from content
 */
export function extractReferences(content: string): string[] {
  const references: string[] = [];

  // URL patterns
  const urlPattern = /https?:\/\/[^\s)>\]]+/g;
  let match;
  while ((match = urlPattern.exec(content)) !== null) {
    references.push(match[0]);
  }

  // Wiki-style links
  const wikiPattern = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  while ((match = wikiPattern.exec(content)) !== null) {
    references.push(match[1].trim());
  }

  return [...new Set(references)]; // Deduplicate
}

/**
 * Detect source type from path or URL
 */
export function detectSourceType(source: string): SourceType | null {
  const lowerSource = source.toLowerCase();

  // URL detection
  if (lowerSource.startsWith("http://") || lowerSource.startsWith("https://")) {
    return "web";
  }

  // File extension detection
  if (lowerSource.endsWith(".pdf")) {
    return "pdf";
  }

  if (lowerSource.endsWith(".docx") || lowerSource.endsWith(".doc")) {
    return "docx";
  }

  if (lowerSource.endsWith(".md")) {
    return "obsidian";
  }

  return null;
}
