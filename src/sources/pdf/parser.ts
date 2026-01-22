/**
 * PDF parser implementation using pdf-parse
 */

import * as fs from "fs";
import * as path from "path";
import type { ContentSource, PDFMetadata, ParseOptions, SourceParser } from "../types";
import {
  createContentSource,
  extractSectionsFromText,
  extractTitle,
  normalizeText,
} from "../base";

/** PDF parse result */
interface PDFParseResult {
  numpages: number;
  numrender: number;
  info: {
    PDFFormatVersion?: string;
    Title?: string;
    Author?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
  };
  metadata: unknown;
  text: string;
}

/**
 * PDF Source Parser
 */
export class PDFParser implements SourceParser {
  readonly sourceType = "pdf" as const;

  /**
   * Check if this parser can handle the source
   */
  canParse(source: string): boolean {
    const lowerSource = source.toLowerCase();
    return lowerSource.endsWith(".pdf") && fs.existsSync(source);
  }

  /**
   * Parse PDF file to ContentSource
   */
  async parse(source: string, options?: ParseOptions): Promise<ContentSource> {
    if (!this.canParse(source)) {
      throw new Error(`Cannot parse source: ${source}`);
    }

    // Dynamic import for CommonJS module
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as unknown as { default: (buffer: Buffer) => Promise<PDFParseResult> }).default;

    const buffer = fs.readFileSync(source);
    const data = await pdfParse(buffer);

    const rawContent = normalizeText(data.text);
    const filename = path.basename(source, ".pdf");
    const title = data.info.Title || extractTitle(rawContent, filename);

    // Extract sections from text
    let sections = extractSectionsFromText(rawContent);

    // Apply maxSections limit
    if (options?.maxSections && sections.length > options.maxSections) {
      sections = sections.slice(0, options.maxSections);
    }

    // Build metadata
    const metadata: PDFMetadata = {
      sourceType: "pdf",
      sourcePath: source,
      pageCount: data.numpages,
      author: data.info.Author,
      createdAt: data.info.CreationDate,
      modifiedAt: data.info.ModDate,
      pdfVersion: data.info.PDFFormatVersion,
      producer: data.info.Producer,
      creator: data.info.Creator,
    };

    return createContentSource({
      sourcePath: source,
      sourceType: "pdf",
      title,
      sections,
      rawContent,
      metadata,
    });
  }
}

/**
 * Convenience function to parse a PDF file
 */
export async function parsePDF(
  filePath: string,
  options?: ParseOptions
): Promise<ContentSource> {
  const parser = new PDFParser();
  return parser.parse(filePath, options);
}
