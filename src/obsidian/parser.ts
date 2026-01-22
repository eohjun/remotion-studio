import type {
  ParsedNote,
  NoteFrontmatter,
  NoteSection,
  LinkedNote,
} from "./types";

/**
 * Parse Obsidian markdown note into structured data
 */

/** Regex patterns for parsing */
const PATTERNS = {
  frontmatter: /^---\n([\s\S]*?)\n---/,
  heading: /^(#{1,6})\s+(.+)$/m,
  wikiLink: /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
  noteIdTitle: /^(\d+)\s+(.+)$/,
};

/**
 * Parse frontmatter YAML
 */
function parseFrontmatter(content: string): {
  frontmatter: NoteFrontmatter;
  body: string;
} {
  const match = content.match(PATTERNS.frontmatter);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();

  // Simple YAML parser for common frontmatter
  const frontmatter: NoteFrontmatter = {};
  const lines = yamlContent.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Extract wiki links from content
 */
function extractLinks(content: string): LinkedNote[] {
  const links: LinkedNote[] = [];
  let match;

  while ((match = PATTERNS.wikiLink.exec(content)) !== null) {
    const linkText = match[1].trim();
    const alias = match[2]?.trim();

    // Try to parse ID and title from link text
    const idMatch = linkText.match(PATTERNS.noteIdTitle);

    if (idMatch) {
      links.push({
        id: idMatch[1],
        title: idMatch[2],
        raw: match[0],
        alias,
      });
    } else {
      // Link without ID format
      links.push({
        id: linkText,
        title: linkText,
        raw: match[0],
        alias,
      });
    }
  }

  return links;
}

/**
 * Parse content into sections
 */
function parseSections(content: string): NoteSection[] {
  const lines = content.split("\n");
  const sections: NoteSection[] = [];
  let currentSection: NoteSection | null = null;
  let currentContent: string[] = [];

  const flushContent = () => {
    if (currentSection && currentContent.length > 0) {
      currentSection.content = currentContent.filter((c) => c.trim());
      currentContent = [];
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      flushContent();

      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: [],
      };
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Flush final section
  flushContent();
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Parse note ID and title from filename
 */
function parseFilename(filename: string): { id: string; title: string } {
  // Remove .md extension
  const name = filename.replace(/\.md$/, "");

  // Try to match ID format: "202601160105 노트제목"
  const match = name.match(PATTERNS.noteIdTitle);

  if (match) {
    return { id: match[1], title: match[2] };
  }

  return { id: name, title: name };
}

/**
 * Parse a complete Obsidian note
 */
export function parseNote(content: string, filename: string): ParsedNote {
  const { frontmatter, body } = parseFrontmatter(content);
  const { id: filenameId, title: filenameTitle } = parseFilename(filename);

  // Use frontmatter ID if available, otherwise use filename
  const id = (frontmatter.id as string) || filenameId;

  // Extract title from first heading or use filename
  const firstHeadingMatch = body.match(/^#\s+(.+)$/m);
  const title = firstHeadingMatch ? firstHeadingMatch[1].trim() : filenameTitle;

  const sections = parseSections(body);
  const linkedNotes = extractLinks(body);

  return {
    id,
    title,
    frontmatter,
    sections,
    linkedNotes,
    rawContent: body,
  };
}

/**
 * Get content from specific sections
 */
export function getSectionContent(
  note: ParsedNote,
  headingPattern: RegExp | string
): string[] {
  const pattern =
    typeof headingPattern === "string"
      ? new RegExp(headingPattern, "i")
      : headingPattern;

  for (const section of note.sections) {
    if (pattern.test(section.heading)) {
      return section.content;
    }
  }

  return [];
}

/**
 * Extract key points from a note
 */
export function extractKeyPoints(note: ParsedNote): string[] {
  const points: string[] = [];

  // Look for common key point section names
  const keyPointPatterns = [
    /핵심.*아이디어/i,
    /핵심.*내용/i,
    /주요.*포인트/i,
    /key.*point/i,
    /요약/i,
  ];

  for (const pattern of keyPointPatterns) {
    const content = getSectionContent(note, pattern);
    if (content.length > 0) {
      // Extract bullet points
      for (const line of content) {
        const bulletMatch = line.match(/^[-*]\s+(.+)$/);
        if (bulletMatch) {
          points.push(bulletMatch[1].trim());
        }
      }
    }
  }

  return points;
}
