import type {
  VideoContext,
  ParsedNote,
  NarrationScript,
  NarrationSection,
} from "./types";
import { extractKeyPoints, getSectionContent } from "./parser";

/**
 * Generate narration script from video context
 */

/**
 * Generate a complete narration script from video context
 */
export function generateNarrationScript(context: VideoContext): NarrationScript {
  const { mainNote, linkedNotes } = context;

  return {
    intro: generateIntroSection(mainNote),
    sections: generateMainSections(mainNote, linkedNotes),
    outro: generateOutroSection(mainNote),
  };
}

/**
 * Generate intro narration section
 */
function generateIntroSection(note: ParsedNote): NarrationSection {
  // Look for introduction-like sections
  const introPatterns = [/도입|서론|개요|introduction/i];

  for (const pattern of introPatterns) {
    const content = getSectionContent(note, pattern);
    if (content.length > 0) {
      return {
        id: "intro",
        suggestedSceneType: "intro",
        text: content.join(" ").trim(),
        sourceNotes: [note.id],
      };
    }
  }

  // Generate default intro from title
  return {
    id: "intro",
    suggestedSceneType: "intro",
    text: `오늘은 ${note.title}에 대해 이야기해보겠습니다.`,
    sourceNotes: [note.id],
  };
}

/**
 * Generate main content sections
 */
function generateMainSections(
  mainNote: ParsedNote,
  linkedNotes: ParsedNote[]
): NarrationSection[] {
  const sections: NarrationSection[] = [];
  let sectionIndex = 0;

  // Process main note sections
  for (const section of mainNote.sections) {
    // Skip intro/outro-like sections
    if (/도입|서론|결론|마무리|참고/i.test(section.heading)) {
      continue;
    }

    if (section.content.length > 0) {
      const keyPoints = extractKeyPoints(mainNote);

      sections.push({
        id: `section_${sectionIndex++}`,
        suggestedSceneType: suggestSceneType(section.heading, section.content),
        text: section.content.join(" ").trim(),
        keyPoints: keyPoints.slice(0, 4),
        sourceNotes: [mainNote.id],
      });
    }
  }

  // Add context from linked notes
  for (const linkedNote of linkedNotes.slice(0, 3)) {
    const keyPoints = extractKeyPoints(linkedNote);

    if (keyPoints.length > 0) {
      sections.push({
        id: `linked_${linkedNote.id}`,
        suggestedSceneType: "content",
        text: `관련 개념으로 ${linkedNote.title}이 있습니다. ${keyPoints.slice(0, 2).join(" ")}`,
        keyPoints: keyPoints.slice(0, 4),
        sourceNotes: [linkedNote.id],
      });
    }
  }

  return sections;
}

/**
 * Generate outro narration section
 */
function generateOutroSection(note: ParsedNote): NarrationSection {
  // Look for conclusion-like sections
  const outroPatterns = [/결론|마무리|정리|요약|takeaway/i];

  for (const pattern of outroPatterns) {
    const content = getSectionContent(note, pattern);
    if (content.length > 0) {
      return {
        id: "outro",
        suggestedSceneType: "outro",
        text: content.join(" ").trim(),
        keyPoints: extractKeyPoints(note).slice(0, 4),
        sourceNotes: [note.id],
      };
    }
  }

  // Generate default outro
  const keyPoints = extractKeyPoints(note);

  return {
    id: "outro",
    suggestedSceneType: "outro",
    text: `${note.title}에 대해 알아보았습니다. 핵심은 ${keyPoints[0] || "주요 내용을 기억해주세요"}.`,
    keyPoints: keyPoints.slice(0, 4),
    sourceNotes: [note.id],
  };
}

/**
 * Suggest scene type based on content
 */
function suggestSceneType(heading: string, content: string[]): string {
  const headingLower = heading.toLowerCase();
  const contentJoined = content.join(" ").toLowerCase();

  // Check for comparison indicators
  if (/vs|대|비교|차이|versus/i.test(headingLower) ||
      /반면|하지만|그러나|반대로/.test(contentJoined)) {
    return "comparison";
  }

  // Check for quote indicators
  if (/인용|명언|말씀|quote/i.test(headingLower) ||
      contentJoined.includes('"') ||
      contentJoined.includes("'")) {
    return "quote";
  }

  // Default to content
  return "content";
}

/**
 * Convert narration script to JSON config for video generation
 */
export function narrationToSceneConfig(narration: NarrationScript) {
  const scenes: Array<{
    id: string;
    type: string;
    title?: string;
    content?: string[];
    [key: string]: unknown;
  }> = [];

  // Intro scene
  scenes.push({
    id: narration.intro.id,
    type: "intro",
    title: narration.intro.text.split(".")[0],
    subtitle: narration.intro.text,
  });

  // Main sections
  for (const section of narration.sections) {
    scenes.push({
      id: section.id,
      type: section.suggestedSceneType,
      title: section.text.split(".")[0],
      content: section.text.split(".").filter((s) => s.trim()),
      keyPoints: section.keyPoints,
    });
  }

  // Outro scene
  scenes.push({
    id: narration.outro.id,
    type: "outro",
    title: "마무리",
    takeaways: narration.outro.keyPoints?.map((point) => ({
      icon: "✓",
      text: point,
    })),
    closingMessage: narration.outro.text.split(".")[0],
  });

  return scenes;
}
