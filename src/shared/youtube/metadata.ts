/**
 * YouTube metadata generation
 */

import type { YouTubeMetadata, YouTubeChapter } from "./types";
import { generateChaptersText } from "./chapters";

/** Metadata generation options */
export interface MetadataOptions {
  /** Video title */
  title: string;
  /** Topic/subject of the video */
  topic?: string;
  /** Key points to include */
  keyPoints?: string[];
  /** Target audience */
  audience?: string;
  /** Video language */
  language?: string;
  /** Category (default: Education) */
  category?: "education" | "howto" | "entertainment" | "science";
  /** Include emoji in description */
  includeEmoji?: boolean;
  /** Custom call to action */
  callToAction?: string;
}

/** YouTube category IDs */
const CATEGORY_IDS: Record<string, string> = {
  education: "27",
  howto: "26",
  entertainment: "24",
  science: "28",
  people: "22",
};

/**
 * Generate YouTube metadata from video info
 */
export function generateMetadata(
  options: MetadataOptions,
  chapters?: YouTubeChapter[]
): YouTubeMetadata {
  const title = truncateTitle(options.title);
  const description = generateDescription(options, chapters);
  const tags = generateTags(options);

  return {
    title,
    description,
    tags,
    chapters: chapters || [],
    categoryId: CATEGORY_IDS[options.category || "education"],
    language: options.language || "ko",
  };
}

/**
 * Truncate title to YouTube's 100 character limit
 */
function truncateTitle(title: string): string {
  if (title.length <= 100) return title;

  // Try to cut at word boundary
  const truncated = title.slice(0, 97);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 80) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Generate YouTube description
 */
function generateDescription(
  options: MetadataOptions,
  chapters?: YouTubeChapter[]
): string {
  const parts: string[] = [];
  const emoji = options.includeEmoji !== false;

  // Intro paragraph
  if (options.topic) {
    parts.push(
      emoji
        ? `📚 ${options.topic}에 대해 알아봅니다.`
        : `${options.topic}에 대해 알아봅니다.`
    );
  } else {
    parts.push(
      emoji
        ? `📚 ${options.title}에 대해 알아봅니다.`
        : `${options.title}에 대해 알아봅니다.`
    );
  }

  parts.push("");

  // Key points
  if (options.keyPoints && options.keyPoints.length > 0) {
    parts.push(emoji ? "✨ 주요 내용:" : "주요 내용:");
    for (const point of options.keyPoints.slice(0, 5)) {
      parts.push(emoji ? `• ${point}` : `- ${point}`);
    }
    parts.push("");
  }

  // Chapters (timestamps)
  if (chapters && chapters.length >= 3) {
    parts.push(emoji ? "⏱️ 목차:" : "목차:");
    parts.push(generateChaptersText(chapters));
    parts.push("");
  }

  // Call to action
  if (options.callToAction) {
    parts.push(options.callToAction);
  } else {
    parts.push(
      emoji
        ? "👍 도움이 되셨다면 좋아요와 구독 부탁드립니다!"
        : "도움이 되셨다면 좋아요와 구독 부탁드립니다!"
    );
  }

  parts.push("");

  // Footer
  parts.push("#지식 #교육 #개념정리");

  return parts.join("\n");
}

/**
 * Generate tags for video
 */
function generateTags(options: MetadataOptions): string[] {
  const tags: string[] = [];

  // Add title-based tags
  const titleWords = options.title
    .replace(/[^\w\s가-힣]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2);

  tags.push(...titleWords.slice(0, 5));

  // Add topic tags
  if (options.topic) {
    tags.push(options.topic);
  }

  // Add key point tags
  if (options.keyPoints) {
    for (const point of options.keyPoints.slice(0, 3)) {
      const words = point.split(/\s+/).filter((w) => w.length > 2);
      tags.push(...words.slice(0, 2));
    }
  }

  // Add category tags
  switch (options.category) {
    case "education":
      tags.push("교육", "학습", "지식");
      break;
    case "howto":
      tags.push("방법", "가이드", "튜토리얼");
      break;
    case "science":
      tags.push("과학", "연구", "분석");
      break;
    case "entertainment":
      tags.push("재미", "흥미", "이야기");
      break;
  }

  // Add language tag
  if (options.language === "en") {
    tags.push("english", "learn");
  } else if (options.language === "ko") {
    tags.push("한국어", "설명");
  }

  // Deduplicate and limit to 500 chars total
  const uniqueTags = [...new Set(tags)];
  const limitedTags: string[] = [];
  let totalLength = 0;

  for (const tag of uniqueTags) {
    if (totalLength + tag.length + 1 > 500) break;
    limitedTags.push(tag);
    totalLength += tag.length + 1;
  }

  return limitedTags;
}

/**
 * Generate metadata for different languages
 */
export function generateLocalizedMetadata(
  baseOptions: MetadataOptions,
  language: "ko" | "en" | "ja" | "zh",
  chapters?: YouTubeChapter[]
): YouTubeMetadata {
  const localizedOptions = { ...baseOptions, language };

  // Localize call to action
  const ctaByLanguage: Record<string, string> = {
    ko: "👍 도움이 되셨다면 좋아요와 구독 부탁드립니다!",
    en: "👍 If you found this helpful, please like and subscribe!",
    ja: "👍 お役に立ちましたら、いいねとチャンネル登録をお願いします！",
    zh: "👍 如果对您有帮助，请点赞和订阅！",
  };

  localizedOptions.callToAction = ctaByLanguage[language];

  return generateMetadata(localizedOptions, chapters);
}

/**
 * Export metadata as JSON file content
 */
export function exportMetadataJSON(metadata: YouTubeMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

/**
 * Export description as text file content
 */
export function exportDescriptionText(metadata: YouTubeMetadata): string {
  return metadata.description;
}

/**
 * Export tags as comma-separated string
 */
export function exportTagsString(metadata: YouTubeMetadata): string {
  return metadata.tags.join(", ");
}
