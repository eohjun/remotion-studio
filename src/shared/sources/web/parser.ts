/**
 * Web page parser implementation using cheerio
 */

import * as cheerio from "cheerio";
import type { ContentSource, WebMetadata, ParseOptions, SourceParser } from "../types";
import type { NoteSection } from "../../obsidian/types";
import {
  createContentSource,
  normalizeText,
} from "../base";

type CheerioAPI = ReturnType<typeof cheerio.load>;

/**
 * Web Source Parser
 */
export class WebParser implements SourceParser {
  readonly sourceType = "web" as const;

  /**
   * Check if this parser can handle the source
   */
  canParse(source: string): boolean {
    const lowerSource = source.toLowerCase();
    return lowerSource.startsWith("http://") || lowerSource.startsWith("https://");
  }

  /**
   * Parse web page to ContentSource
   */
  async parse(source: string, options?: ParseOptions): Promise<ContentSource> {
    if (!this.canParse(source)) {
      throw new Error(`Cannot parse source: ${source}`);
    }

    // Fetch the web page
    const response = await fetch(source, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RemotionStudio/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${source} (${response.status})`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, nav, footer elements
    $("script, style, nav, footer, header, aside, .ad, .advertisement").remove();

    // Extract metadata
    const title = $("title").text().trim() ||
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      source;

    const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const pageText = $("body").text();
    const language = $("html").attr("lang") || detectLanguageFromContent(pageText);

    // Extract main content
    const mainContent = extractMainContent($);
    const rawContent = normalizeText(mainContent);

    // Extract sections
    let sections = extractSectionsFromDom($);
    if (sections.length === 0) {
      // Fallback to simple paragraph extraction
      sections = extractParagraphsAsSections($);
    }

    // Apply maxSections limit
    if (options?.maxSections && sections.length > options.maxSections) {
      sections = sections.slice(0, options.maxSections);
    }

    // Extract related links
    const relatedSources = extractLinks($, source);

    // Build metadata
    const metadata: WebMetadata = {
      sourceType: "web",
      sourcePath: source,
      url: source,
      language,
      ogTitle: $('meta[property="og:title"]').attr("content"),
      ogDescription,
      ogImage,
    };

    return createContentSource({
      sourcePath: source,
      sourceType: "web",
      title,
      sections,
      rawContent,
      metadata,
      relatedSources,
    });
  }
}

/**
 * Extract main content from DOM
 */
function extractMainContent($: CheerioAPI): string {
  // Try common main content selectors
  const selectors = [
    "article",
    "main",
    '[role="main"]',
    ".post-content",
    ".article-content",
    ".entry-content",
    ".content",
    "#content",
    ".prose",
  ];

  for (const selector of selectors) {
    const content = $(selector).text().trim();
    if (content.length > 200) {
      return content;
    }
  }

  // Fallback to body content
  return $("body").text().trim();
}

/**
 * Extract sections from DOM headings
 */
function extractSectionsFromDom($: CheerioAPI): NoteSection[] {
  const sections: NoteSection[] = [];
  const headings = $("h1, h2, h3, h4, h5, h6");

  headings.each((_index: number, elem) => {
    const $heading = $(elem);
    const tagName = (elem as { tagName?: string }).tagName?.toLowerCase() || "h2";
    const level = parseInt(tagName.charAt(1), 10) || 2;
    const heading = $heading.text().trim();

    if (!heading) return;

    // Get content until next heading
    const content: string[] = [];
    let next = $heading.next();

    while (next.length > 0 && !next.is("h1, h2, h3, h4, h5, h6")) {
      const text = next.text().trim();
      if (text && text.length > 10) {
        content.push(text);
      }
      next = next.next();
    }

    if (heading && (content.length > 0 || level <= 2)) {
      sections.push({
        heading,
        level,
        content,
      });
    }
  });

  return sections;
}

/**
 * Extract paragraphs as sections (fallback)
 */
function extractParagraphsAsSections($: CheerioAPI): NoteSection[] {
  const paragraphs: string[] = [];

  $("p").each((_index: number, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 30) {
      paragraphs.push(text);
    }
  });

  if (paragraphs.length === 0) {
    return [];
  }

  // Group paragraphs into sections
  const sections: NoteSection[] = [];
  const chunkSize = 3;

  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    const chunk = paragraphs.slice(i, i + chunkSize);
    sections.push({
      heading: `Section ${Math.floor(i / chunkSize) + 1}`,
      level: 2,
      content: chunk,
    });
  }

  return sections;
}

/**
 * Extract internal links from page
 */
function extractLinks($: CheerioAPI, baseUrl: string): string[] {
  const links: string[] = [];
  const baseHost = new URL(baseUrl).host;

  $("a[href]").each((_index: number, elem) => {
    const href = $(elem).attr("href");
    if (!href) return;

    try {
      const url = new URL(href, baseUrl);
      // Only include links from same domain
      if (url.host === baseHost && !url.pathname.match(/\.(jpg|png|gif|pdf|css|js)$/i)) {
        links.push(url.href);
      }
    } catch {
      // Invalid URL, skip
    }
  });

  return [...new Set(links)].slice(0, 10); // Deduplicate and limit
}

/**
 * Simple language detection from content
 */
function detectLanguageFromContent(text: string): string {
  // Simple heuristic based on character ranges
  const koreanPattern = /[\uAC00-\uD7AF]/g;
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF]/g;
  const chinesePattern = /[\u4E00-\u9FFF]/g;

  const koreanCount = (text.match(koreanPattern) || []).length;
  const japaneseCount = (text.match(japanesePattern) || []).length;
  const chineseCount = (text.match(chinesePattern) || []).length;

  if (koreanCount > 50) return "ko";
  if (japaneseCount > 50) return "ja";
  if (chineseCount > 50) return "zh";

  return "en";
}

/**
 * Convenience function to parse a web page
 */
export async function parseWebPage(
  url: string,
  options?: ParseOptions
): Promise<ContentSource> {
  const parser = new WebParser();
  return parser.parse(url, options);
}
