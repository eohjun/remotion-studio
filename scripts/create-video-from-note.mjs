#!/usr/bin/env node
/**
 * CLI script to create a video composition from an Obsidian note
 *
 * Usage:
 *   node scripts/create-video-from-note.mjs <noteId> [options]
 *
 * Options:
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
 * Parse sections from content
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
 * Find and load a note by ID
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
 * Generate scene configuration from note
 */
function generateSceneConfig(note, linkedNotes) {
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

Options:
  --vault <path>     Path to Obsidian vault
  --output <path>    Output directory for generated files
  --dry-run          Preview without writing files
  --help             Show this help message

Example:
  node scripts/create-video-from-note.mjs 202601160105
    `);
    process.exit(0);
  }

  // Parse arguments
  const noteId = args.find(a => !a.startsWith("--"));
  const config = { ...DEFAULT_CONFIG };
  const dryRun = args.includes("--dry-run");

  const vaultIndex = args.indexOf("--vault");
  if (vaultIndex !== -1 && args[vaultIndex + 1]) {
    config.vaultPath = args[vaultIndex + 1];
  }

  const outputIndex = args.indexOf("--output");
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    config.outputDir = args[outputIndex + 1];
  }

  console.log(`\n🔍 Loading note: ${noteId}`);
  console.log(`   Vault: ${config.vaultPath}`);

  // Load main note
  const mainNote = loadNote(noteId, config);
  if (!mainNote) {
    process.exit(1);
  }

  console.log(`✅ Loaded: ${mainNote.title}`);
  console.log(`   Sections: ${mainNote.sections.length}`);
  console.log(`   Links: ${mainNote.links.length}`);

  // Load linked notes
  const linkedNotes = [];
  for (const link of mainNote.links.slice(0, 5)) {
    const linked = loadNote(link.id, config);
    if (linked) {
      linkedNotes.push(linked);
      console.log(`   📎 Linked: ${linked.title}`);
    }
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
