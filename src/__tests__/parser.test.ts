import { describe, it, expect } from "vitest";
import { parseNote, getSectionContent, extractKeyPoints } from "../shared/obsidian/parser";

describe("Obsidian Parser", () => {
  const sampleNote = `---
id: "202601160105"
created: "2026-01-16 01:05"
type: permanent
---
# Sample Note Title

## 핵심 아이디어
- First key point
- Second key point
- Third key point

## 상세 설명
This is the detailed explanation of the concept.
It spans multiple lines and paragraphs.

## 연결된 생각
Some related thoughts here.
[[202601160106 Related Note]]
[[202601160107 Another Note|Custom Alias]]

## 참고 자료
- Reference 1
- Reference 2
`;

  describe("parseNote", () => {
    it("parses frontmatter correctly", () => {
      const note = parseNote(sampleNote, "202601160105 Sample Note.md");
      expect(note.frontmatter.id).toBe("202601160105");
      expect(note.frontmatter.type).toBe("permanent");
    });

    it("extracts note ID from filename", () => {
      const note = parseNote(sampleNote, "202601160105 Sample Note.md");
      expect(note.id).toBe("202601160105");
    });

    it("extracts title from first heading", () => {
      const note = parseNote(sampleNote, "202601160105 Sample Note.md");
      expect(note.title).toBe("Sample Note Title");
    });

    it("parses sections correctly", () => {
      const note = parseNote(sampleNote, "test.md");
      expect(note.sections.length).toBeGreaterThan(0);
      expect(note.sections[0].heading).toBe("Sample Note Title");
    });

    it("extracts wiki links", () => {
      const note = parseNote(sampleNote, "test.md");
      expect(note.linkedNotes.length).toBe(2);
      expect(note.linkedNotes[0].id).toBe("202601160106");
      expect(note.linkedNotes[0].title).toBe("Related Note");
      expect(note.linkedNotes[1].alias).toBe("Custom Alias");
    });
  });

  describe("getSectionContent", () => {
    it("finds section by exact heading", () => {
      const note = parseNote(sampleNote, "test.md");
      const content = getSectionContent(note, "상세 설명");
      expect(content.length).toBeGreaterThan(0);
      expect(content[0]).toContain("detailed explanation");
    });

    it("finds section by regex pattern", () => {
      const note = parseNote(sampleNote, "test.md");
      const content = getSectionContent(note, /핵심/);
      expect(content.length).toBeGreaterThan(0);
    });

    it("returns empty array for non-existent section", () => {
      const note = parseNote(sampleNote, "test.md");
      const content = getSectionContent(note, "Non-existent Section");
      expect(content).toEqual([]);
    });
  });

  describe("extractKeyPoints", () => {
    it("extracts bullet points from key sections", () => {
      const note = parseNote(sampleNote, "test.md");
      const points = extractKeyPoints(note);
      expect(points.length).toBeGreaterThan(0);
      expect(points).toContain("First key point");
    });
  });

  describe("edge cases", () => {
    it("handles note without frontmatter", () => {
      const content = "# Simple Note\n\nJust content here.";
      const note = parseNote(content, "simple.md");
      expect(note.title).toBe("Simple Note");
      expect(note.frontmatter).toEqual({});
    });

    it("handles note without headings", () => {
      const content = "---\nid: test\n---\nJust plain text content.";
      const note = parseNote(content, "plain.md");
      expect(note.sections).toEqual([]);
    });

    it("handles empty note", () => {
      const note = parseNote("", "empty.md");
      expect(note.title).toBe("empty");
      expect(note.sections).toEqual([]);
      expect(note.linkedNotes).toEqual([]);
    });
  });
});
