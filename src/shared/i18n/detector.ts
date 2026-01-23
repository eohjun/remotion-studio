/**
 * Language detection utilities
 */

import type { LanguageDetectionResult, SupportedLanguage } from "./types";

/** Character range patterns for language detection */
const LANGUAGE_PATTERNS = {
  ko: {
    // Korean Hangul
    pattern: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g,
    minChars: 10,
    confidence: 0.95,
  },
  ja: {
    // Japanese Hiragana, Katakana
    pattern: /[\u3040-\u309F\u30A0-\u30FF]/g,
    minChars: 10,
    confidence: 0.9,
  },
  zh: {
    // Chinese CJK Unified Ideographs (excluding Japanese)
    pattern: /[\u4E00-\u9FFF]/g,
    minChars: 20,
    confidence: 0.85,
  },
};

/**
 * Detect language from text content
 */
export function detectLanguage(text: string): LanguageDetectionResult {
  const cleanText = text.trim();

  if (!cleanText) {
    return {
      language: "en",
      confidence: 0,
      method: "heuristic",
    };
  }

  // Count character matches for each language
  const scores: Record<SupportedLanguage, number> = {
    ko: 0,
    ja: 0,
    zh: 0,
    en: 0,
  };

  // Korean detection (highest priority for Hangul)
  const koMatches = cleanText.match(LANGUAGE_PATTERNS.ko.pattern) || [];
  scores.ko = koMatches.length;

  // Japanese detection (Hiragana/Katakana)
  const jaMatches = cleanText.match(LANGUAGE_PATTERNS.ja.pattern) || [];
  scores.ja = jaMatches.length;

  // Chinese detection (CJK characters, but not if Japanese markers present)
  const zhMatches = cleanText.match(LANGUAGE_PATTERNS.zh.pattern) || [];
  // Reduce Chinese score if Japanese characters are present
  scores.zh = jaMatches.length > 0 ? 0 : zhMatches.length;

  // English/Latin detection (default)
  const latinMatches = cleanText.match(/[a-zA-Z]/g) || [];
  const latinRatio = latinMatches.length / cleanText.length;

  // Determine language by highest score
  if (scores.ko >= LANGUAGE_PATTERNS.ko.minChars) {
    return {
      language: "ko",
      confidence: Math.min(scores.ko / 50, LANGUAGE_PATTERNS.ko.confidence),
      method: "pattern",
    };
  }

  if (scores.ja >= LANGUAGE_PATTERNS.ja.minChars) {
    return {
      language: "ja",
      confidence: Math.min(scores.ja / 30, LANGUAGE_PATTERNS.ja.confidence),
      method: "pattern",
    };
  }

  if (scores.zh >= LANGUAGE_PATTERNS.zh.minChars && scores.ja < 5) {
    return {
      language: "zh",
      confidence: Math.min(scores.zh / 50, LANGUAGE_PATTERNS.zh.confidence),
      method: "pattern",
    };
  }

  // Default to English if high Latin ratio
  if (latinRatio > 0.5) {
    return {
      language: "en",
      confidence: Math.min(latinRatio, 0.9),
      method: "heuristic",
    };
  }

  // Fallback
  return {
    language: "en",
    confidence: 0.5,
    method: "heuristic",
  };
}

/**
 * Detect language with higher confidence using multiple methods
 */
export function detectLanguageAdvanced(text: string): LanguageDetectionResult {
  const basicResult = detectLanguage(text);

  // If basic detection is confident, return it
  if (basicResult.confidence >= 0.8) {
    return basicResult;
  }

  // Try additional heuristics
  const words = text.split(/\s+/);

  // Check for language-specific common words
  const koCommonWords = /(?:이|가|을|를|에|의|와|과|로|으로|하고|그리고|또한|그러나|이것|저것)/;
  const jaCommonWords = /(?:です|ます|した|する|いる|ある|この|その|これ|それ)/;
  const zhCommonWords = /(?:的|是|在|了|和|与|这|那|有|没|不)/;

  if (koCommonWords.test(text)) {
    return {
      language: "ko",
      confidence: Math.min(basicResult.confidence + 0.2, 0.95),
      method: "heuristic",
    };
  }

  if (jaCommonWords.test(text)) {
    return {
      language: "ja",
      confidence: Math.min(basicResult.confidence + 0.2, 0.9),
      method: "heuristic",
    };
  }

  if (zhCommonWords.test(text) && words.length > 5) {
    return {
      language: "zh",
      confidence: Math.min(basicResult.confidence + 0.15, 0.85),
      method: "heuristic",
    };
  }

  return basicResult;
}

/**
 * Check if text is in a specific language
 */
export function isLanguage(text: string, language: SupportedLanguage): boolean {
  const result = detectLanguage(text);
  return result.language === language && result.confidence >= 0.6;
}

/**
 * Get the dominant language in a multi-language text
 */
export function getDominantLanguage(text: string): SupportedLanguage {
  const result = detectLanguageAdvanced(text);
  return result.language;
}
