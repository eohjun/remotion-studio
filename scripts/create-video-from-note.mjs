#!/usr/bin/env node
/**
 * CLI script to create a video composition from various sources
 *
 * Usage:
 *   node scripts/create-video-from-note.mjs <noteId> [options]
 *   node scripts/create-video-from-note.mjs --source <file-or-url> [options]
 *
 * Options:
 *   --source <path>    Source file (PDF, DOCX) or URL
 *   --vault <path>     Path to Obsidian vault
 *   --output <path>    Output directory for generated files
 *   --dry-run          Preview without writing files
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default configuration
const DEFAULT_CONFIG = {
  vaultPath: "/mnt/c/Users/SaintEoh/Documents/SecondBrain",
  zettelkastenPath: "04_Zettelkasten",
  outputDir: path.join(__dirname, "../src/generated"),
};

/**
 * Detect source type from path or URL
 */
function detectSourceType(source) {
  const lowerSource = source.toLowerCase();

  if (lowerSource.startsWith("http://") || lowerSource.startsWith("https://")) {
    return "web";
  }
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

/**
 * Parse PDF source
 */
async function parsePDFSource(sourcePath) {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = pdfParseModule.default;

  const buffer = fs.readFileSync(sourcePath);
  const data = await pdfParse(buffer);

  const filename = path.basename(sourcePath, ".pdf");
  const rawContent = data.text.trim();

  // Extract title from PDF info or first line
  const title = data.info?.Title || extractTitleFromContent(rawContent) || filename;

  // Parse sections from content
  const sections = parseSectionsFromText(rawContent);

  return {
    id: generateSourceId(sourcePath),
    title,
    sections,
    links: [],
    rawContent,
    metadata: {
      sourceType: "pdf",
      pageCount: data.numpages,
      author: data.info?.Author,
    },
  };
}

/**
 * Parse DOCX source
 */
async function parseDOCXSource(sourcePath) {
  const mammoth = await import("mammoth");

  const buffer = fs.readFileSync(sourcePath);
  const result = await mammoth.extractRawText({ buffer });
  const rawContent = result.value.trim();

  const filename = path.basename(sourcePath, path.extname(sourcePath));
  const title = extractTitleFromContent(rawContent) || filename;

  const sections = parseSectionsFromText(rawContent);

  return {
    id: generateSourceId(sourcePath),
    title,
    sections,
    links: [],
    rawContent,
    metadata: {
      sourceType: "docx",
    },
  };
}

/**
 * Parse Web source
 */
async function parseWebSource(url) {
  const cheerio = await import("cheerio");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; RemotionStudio/1.0)",
      "Accept": "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${url} (${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, nav, footer, header, aside").remove();

  const title = $("title").text().trim() ||
    $("h1").first().text().trim() ||
    url;

  const rawContent = $("body").text().trim();
  const sections = extractSectionsFromHTML($);

  return {
    id: generateSourceId(url),
    title,
    sections,
    links: [],
    rawContent,
    metadata: {
      sourceType: "web",
      url,
    },
  };
}

/**
 * Extract sections from HTML DOM
 */
function extractSectionsFromHTML($) {
  const sections = [];
  const headings = $("h1, h2, h3, h4, h5, h6");

  headings.each((_, elem) => {
    const $heading = $(elem);
    const tagName = elem.tagName?.toLowerCase() || "h2";
    const level = parseInt(tagName.charAt(1), 10) || 2;
    const heading = $heading.text().trim();

    if (!heading) return;

    const content = [];
    let next = $heading.next();

    while (next.length > 0 && !next.is("h1, h2, h3, h4, h5, h6")) {
      const text = next.text().trim();
      if (text && text.length > 10) {
        content.push(text);
      }
      next = next.next();
    }

    if (heading && content.length > 0) {
      sections.push({ heading, level, content });
    }
  });

  return sections;
}

/**
 * Parse sections from plain text content
 */
function parseSectionsFromText(content) {
  const lines = content.split("\n");
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    // Check for markdown heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        currentSection.content = currentContent.filter(c => c.trim());
        sections.push(currentSection);
      }
      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: [],
      };
      currentContent = [];
      continue;
    }

    // Check for numbered heading (e.g., "1. Introduction")
    const numberedMatch = line.match(/^(\d+)\.\s+([A-Z].{5,})$/);
    if (numberedMatch && line.length < 100) {
      if (currentSection) {
        currentSection.content = currentContent.filter(c => c.trim());
        sections.push(currentSection);
      }
      currentSection = {
        heading: numberedMatch[2].trim(),
        level: 2,
        content: [],
      };
      currentContent = [];
      continue;
    }

    if (currentSection) {
      currentContent.push(line);
    } else if (line.trim()) {
      // Create implicit section for content before first heading
      currentSection = {
        heading: "Introduction",
        level: 1,
        content: [],
      };
      currentContent.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = currentContent.filter(c => c.trim());
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Extract title from content
 */
function extractTitleFromContent(content) {
  // Try markdown heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  // First non-empty short line
  const lines = content.split("\n").filter(l => l.trim());
  if (lines.length > 0 && lines[0].length < 100) {
    return lines[0].trim();
  }

  return null;
}

/**
 * Generate source ID
 */
function generateSourceId(source) {
  const timestamp = Date.now().toString(36);
  const hash = Buffer.from(source).toString("base64").slice(0, 8);
  return `src_${timestamp}_${hash}`;
}

/**
 * Simple frontmatter parser
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();

  const frontmatter = {};
  for (const line of yamlContent.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Extract wiki links
 */
function extractLinks(content) {
  const links = [];
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const linkText = match[1].trim();
    const idMatch = linkText.match(/^(\d+)\s+(.+)$/);
    if (idMatch) {
      links.push({ id: idMatch[1], title: idMatch[2] });
    }
  }

  return links;
}

/**
 * Parse sections from content (markdown)
 */
function parseSections(content) {
  const lines = content.split("\n");
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        currentSection.content = currentContent.filter(c => c.trim());
        sections.push(currentSection);
      }
      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: [],
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = currentContent.filter(c => c.trim());
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Find and load a note by ID (Obsidian)
 */
function loadNote(noteId, config) {
  const zettelPath = path.join(config.vaultPath, config.zettelkastenPath);

  try {
    const files = fs.readdirSync(zettelPath);
    const filename = files.find(f => f.startsWith(noteId) && f.endsWith(".md"));

    if (!filename) {
      console.error(`Note not found: ${noteId}`);
      return null;
    }

    const filePath = path.join(zettelPath, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    const sections = parseSections(body);
    const links = extractLinks(body);

    // Parse title from filename
    const nameMatch = filename.replace(".md", "").match(/^(\d+)\s+(.+)$/);
    const title = nameMatch ? nameMatch[2] : filename.replace(".md", "");

    return {
      id: noteId,
      title,
      frontmatter,
      sections,
      links,
      rawContent: body,
    };
  } catch (error) {
    console.error(`Error loading note: ${error.message}`);
    return null;
  }
}

/**
 * Generate scene configuration from note/source
 */
function generateSceneConfig(note, linkedNotes = []) {
  const scenes = [];

  // Intro scene
  scenes.push({
    id: "intro",
    type: "intro",
    title: note.title,
    subtitle: `${note.title}에 대해 알아봅니다`,
    background: "primary",
  });

  // Content scenes from sections
  let sceneIndex = 0;
  for (const section of note.sections) {
    if (/참고|출처|링크|reference/i.test(section.heading)) continue;

    const content = section.content.join(" ").trim();
    if (!content) continue;

    scenes.push({
      id: `section_${sceneIndex++}`,
      type: "content",
      sectionLabel: note.title,
      title: section.heading,
      content: section.content.slice(0, 5),
      backgroundColor: "#1a1a2e",
    });
  }

  // Add linked note context if available
  for (const linked of linkedNotes.slice(0, 2)) {
    const keySection = linked.sections.find(s => s.content.length > 0);
    if (keySection) {
      scenes.push({
        id: `linked_${linked.id}`,
        type: "content",
        sectionLabel: "연결된 개념",
        title: linked.title,
        content: keySection.content.slice(0, 3),
        backgroundColor: "#16213e",
      });
    }
  }

  // Outro scene
  scenes.push({
    id: "outro",
    type: "outro",
    title: "정리",
    titleIcon: "✨",
    takeaways: note.sections
      .slice(0, 4)
      .filter(s => s.heading)
      .map(s => ({ icon: "📌", text: s.heading })),
    closingMessage: `${note.title}에 대해 알아보았습니다`,
    closingIcon: "💡",
    background: "primary",
  });

  return scenes;
}

/**
 * Generate composition config
 */
function generateCompositionConfig(note, scenes) {
  return {
    id: `note_${note.id}`,
    name: note.title,
    width: 1920,
    height: 1080,
    fps: 30,
    scenes: scenes,
    transitionDuration: 15,
    sceneBuffer: 15,
  };
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
Usage: node scripts/create-video-from-note.mjs <noteId> [options]
       node scripts/create-video-from-note.mjs --source <file-or-url> [options]

Options:
  --source <path>    Source file (PDF, DOCX) or URL
  --vault <path>     Path to Obsidian vault
  --output <path>    Output directory for generated files
  --dry-run          Preview without writing files
  --help             Show this help message

Supported Sources:
  - Obsidian notes (by ID): 202601160105
  - PDF files: ./document.pdf
  - DOCX files: ./document.docx
  - Web URLs: https://example.com/article

Examples:
  node scripts/create-video-from-note.mjs 202601160105
  node scripts/create-video-from-note.mjs --source ./docs/sample.pdf
  node scripts/create-video-from-note.mjs --source https://blog.example.com/post
    `);
    process.exit(0);
  }

  // Parse arguments
  const config = { ...DEFAULT_CONFIG };
  const dryRun = args.includes("--dry-run");

  const sourceIndex = args.indexOf("--source");
  const sourcePath = sourceIndex !== -1 ? args[sourceIndex + 1] : null;

  const vaultIndex = args.indexOf("--vault");
  if (vaultIndex !== -1 && args[vaultIndex + 1]) {
    config.vaultPath = args[vaultIndex + 1];
  }

  const outputIndex = args.indexOf("--output");
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    config.outputDir = args[outputIndex + 1];
  }

  let mainNote;
  let linkedNotes = [];

  if (sourcePath) {
    // Multi-source mode
    const sourceType = detectSourceType(sourcePath);
    console.log(`\n🔍 Loading source: ${sourcePath}`);
    console.log(`   Type: ${sourceType || "unknown"}`);

    if (!sourceType) {
      console.error(`❌ Unknown source type: ${sourcePath}`);
      process.exit(1);
    }

    try {
      if (sourceType === "pdf") {
        mainNote = await parsePDFSource(sourcePath);
      } else if (sourceType === "docx") {
        mainNote = await parseDOCXSource(sourcePath);
      } else if (sourceType === "web") {
        mainNote = await parseWebSource(sourcePath);
      } else if (sourceType === "obsidian") {
        const content = fs.readFileSync(sourcePath, "utf-8");
        const filename = path.basename(sourcePath);
        const { frontmatter, body } = parseFrontmatter(content);
        const sections = parseSections(body);
        const links = extractLinks(body);
        const nameMatch = filename.replace(".md", "").match(/^(\d+)\s+(.+)$/);

        mainNote = {
          id: nameMatch ? nameMatch[1] : filename.replace(".md", ""),
          title: nameMatch ? nameMatch[2] : filename.replace(".md", ""),
          frontmatter,
          sections,
          links,
          rawContent: body,
        };
      }
    } catch (error) {
      console.error(`❌ Error parsing source: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Obsidian note ID mode (original behavior)
    const noteId = args.find(a => !a.startsWith("--"));
    if (!noteId) {
      console.error("❌ Please provide a note ID or use --source");
      process.exit(1);
    }

    console.log(`\n🔍 Loading note: ${noteId}`);
    console.log(`   Vault: ${config.vaultPath}`);

    mainNote = loadNote(noteId, config);
    if (!mainNote) {
      process.exit(1);
    }

    // Load linked notes for Obsidian
    for (const link of mainNote.links.slice(0, 5)) {
      const linked = loadNote(link.id, config);
      if (linked) {
        linkedNotes.push(linked);
        console.log(`   📎 Linked: ${linked.title}`);
      }
    }
  }

  console.log(`✅ Loaded: ${mainNote.title}`);
  console.log(`   Sections: ${mainNote.sections.length}`);
  if (mainNote.links?.length) {
    console.log(`   Links: ${mainNote.links.length}`);
  }

  // Generate configuration
  const scenes = generateSceneConfig(mainNote, linkedNotes);
  const compositionConfig = generateCompositionConfig(mainNote, scenes);

  console.log(`\n📝 Generated composition:`);
  console.log(`   ID: ${compositionConfig.id}`);
  console.log(`   Scenes: ${scenes.length}`);

  if (dryRun) {
    console.log(`\n🔍 Dry run - configuration preview:`);
    console.log(JSON.stringify(compositionConfig, null, 2));
    return;
  }

  // Write output files
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const configPath = path.join(config.outputDir, `${compositionConfig.id}.json`);
  fs.writeFileSync(configPath, JSON.stringify(compositionConfig, null, 2));
  console.log(`\n✅ Written: ${configPath}`);

  console.log(`\n🎬 Next steps:`);
  console.log(`   1. Generate narration audio with: node scripts/generate-tts.mjs`);
  console.log(`   2. Preview in Remotion Studio: npm run dev`);
  console.log(`   3. Render video: npx remotion render ${compositionConfig.id}`);
}

main().catch(console.error);
