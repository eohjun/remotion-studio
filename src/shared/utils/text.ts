// Text utilities for language detection and styling
import { TEXT_STYLES } from "../components/constants";

/**
 * Detect if text contains Korean characters (Hangul)
 * Covers: Hangul Syllables (AC00-D7AF), Hangul Jamo (1100-11FF), Hangul Compatibility Jamo (3130-318F)
 */
export const containsKorean = (text: string): boolean => {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
};

/**
 * Get appropriate text style based on content language
 * @param text - The text content to analyze
 * @param language - Force a specific language or use "auto" for detection
 * @returns React.CSSProperties with appropriate text styling
 */
export const getTextStyleForContent = (
  text: string,
  language?: "ko" | "en" | "auto"
): React.CSSProperties => {
  const isKorean =
    language === "ko" || (language !== "en" && containsKorean(text));
  return isKorean ? TEXT_STYLES.korean : TEXT_STYLES.default;
};

/**
 * Detect the primary language of text
 * @param text - The text to analyze
 * @returns "ko" for Korean, "en" for others
 */
export const detectLanguage = (text: string): "ko" | "en" => {
  return containsKorean(text) ? "ko" : "en";
};
