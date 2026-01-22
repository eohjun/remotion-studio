/**
 * DOCX parser implementation using mammoth
 */

import * as fs from "fs";
import * as path from "path";
import type { ContentSource, DOCXMetadata, ParseOptions, SourceParser } from "../types";
import {
  createContentSource,
  extractSectionsFromText,
  extractTitle,
  normalizeText,
} from "../base";

/** Mammoth extraction result */
interface MammothResult {
  value: string;
  messages: Array<{ type: string; message: string }>;
}

/** Mammoth module type */
interface MammothModule {
  extractRawText: (options: { buffer: Buffer }) => Promise<MammothResult>;
  convertToHtml: (options: { buffer: Buffer }) => Promise<MammothResult>;
}

/**
 * DOCX Source Parser
 */
export class DOCXParser implements SourceParser {
  readonly sourceType = "docx" as const;

  /**
   * Check if this parser can handle the source
   */
  canParse(source: string): boolean {
    const lowerSource = source.toLowerCase();
    return (
      (lowerSource.endsWith(".docx") || lowerSource.endsWith(".doc")) &&
      fs.existsSync(source)
    );
  }

  /**
   * Parse DOCX file to ContentSource
   */
  async parse(source: string, options?: ParseOptions): Promise<ContentSource> {
    if (!this.canParse(source)) {
      throw new Error(`Cannot parse source: ${source}`);
    }

    // Dynamic import for CommonJS module
    const mammoth = (await import("mammoth")) as unknown as MammothModule;

    const buffer = fs.readFileSync(source);

    // Extract raw text with mammoth
    const result = await mammoth.extractRawText({ buffer });
    const rawContent = normalizeText(result.value);

    // Also get HTML for better structure detection
    const htmlResult = await mammoth.convertToHtml({ buffer });

    const filename = path.basename(source, path.extname(source));
    const title = extractTitleFromHtml(htmlResult.value) || extractTitle(rawContent, filename);

    // Extract sections from HTML structure or plain text
    let sections = extractSectionsFromHtml(htmlResult.value);
    if (sections.length === 0) {
      sections = extractSectionsFromText(rawContent);
    }

    // Apply maxSections limit
    if (options?.maxSections && sections.length > options.maxSections) {
      sections = sections.slice(0, options.maxSections);
    }

    // Build metadata
    const stats = fs.statSync(source);
    const metadata: DOCXMetadata = {
      sourceType: "docx",
      sourcePath: source,
      modifiedAt: stats.mtime.toISOString(),
    };

    return createContentSource({
      sourcePath: source,
      sourceType: "docx",
      title,
      sections,
      rawContent,
      metadata,
    });
  }
}

/**
 * Extract title from HTML (first h1 or strong element)
 */
function extractTitleFromHtml(html: string): string | null {
  // Try to find h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Try to find first strong that looks like a title
  const strongMatch = html.match(/<strong>([^<]{5,100})<\/strong>/i);
  if (strongMatch) {
    return strongMatch[1].trim();
  }

  return null;
}

/**
 * Extract sections from HTML structure
 */
function extractSectionsFromHtml(html: string): Array<{
  heading: string;
  level: number;
  content: string[];
}> {
  const sections: Array<{ heading: string; level: number; content: string[] }> = [];

  // Split by heading tags
  const headingPattern = /<h([1-6])[^>]*>([^<]+)<\/h\1>/gi;
  const parts = html.split(headingPattern);

  for (let i = 1; i < parts.length; i += 3) {
    const level = parseInt(parts[i], 10);
    const heading = parts[i + 1]?.trim();
    const contentHtml = parts[i + 2] || "";

    if (heading) {
      // Extract paragraphs from content
      const paragraphs: string[] = [];
      const pPattern = /<p[^>]*>([^<]+)<\/p>/gi;
      let pMatch;
      while ((pMatch = pPattern.exec(contentHtml)) !== null) {
        const text = pMatch[1].trim();
        if (text) {
          paragraphs.push(text);
        }
      }

      sections.push({
        heading,
        level,
        content: paragraphs,
      });
    }
  }

  return sections;
}

/**
 * Convenience function to parse a DOCX file
 */
export async function parseDOCX(
  filePath: string,
  options?: ParseOptions
): Promise<ContentSource> {
  const parser = new DOCXParser();
  return parser.parse(filePath, options);
}
