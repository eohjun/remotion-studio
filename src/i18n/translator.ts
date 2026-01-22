/**
 * High-level translation utilities
 */

import type {
  TranslationProvider,
  TranslationRequest,
  TranslationResult,
  SupportedLanguage,
} from "./types";
import { detectLanguage, detectLanguageAdvanced } from "./detector";
import { createOpenAITranslator } from "./providers/openai";
import { createDeepLTranslator } from "./providers/deepl";

/** Translation provider type */
export type TranslatorType = "openai" | "deepl" | "auto";

/**
 * Get the best available translator
 */
export function getTranslator(type: TranslatorType = "auto"): TranslationProvider | null {
  if (type === "deepl") {
    const deepl = createDeepLTranslator();
    if (deepl.isAvailable()) return deepl;
    return null;
  }

  if (type === "openai") {
    const openai = createOpenAITranslator();
    if (openai.isAvailable()) return openai;
    return null;
  }

  // Auto: prefer DeepL for quality, fall back to OpenAI
  const deepl = createDeepLTranslator();
  if (deepl.isAvailable()) return deepl;

  const openai = createOpenAITranslator();
  if (openai.isAvailable()) return openai;

  return null;
}

/**
 * Translate text to target language
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage,
  options?: {
    sourceLanguage?: SupportedLanguage;
    translatorType?: TranslatorType;
    context?: string;
  }
): Promise<TranslationResult> {
  const translator = getTranslator(options?.translatorType);

  if (!translator) {
    throw new Error("No translation provider available. Set OPENAI_API_KEY or DEEPL_API_KEY.");
  }

  // Detect source language if not provided
  const sourceLanguage =
    options?.sourceLanguage || detectLanguageAdvanced(text).language;

  // Skip translation if already in target language
  if (sourceLanguage === targetLanguage) {
    return {
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      provider: "none",
      confidence: 1.0,
    };
  }

  const request: TranslationRequest = {
    text,
    sourceLanguage,
    targetLanguage,
    context: options?.context,
  };

  return translator.translate(request);
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: SupportedLanguage,
  options?: {
    sourceLanguage?: SupportedLanguage;
    translatorType?: TranslatorType;
  }
): Promise<TranslationResult[]> {
  const translator = getTranslator(options?.translatorType);

  if (!translator) {
    throw new Error("No translation provider available.");
  }

  // Detect source language from first substantial text if not provided
  const sourceLanguage =
    options?.sourceLanguage ||
    detectLanguageAdvanced(texts.find((t) => t.length > 20) || texts[0]).language;

  // Skip translation if already in target language
  if (sourceLanguage === targetLanguage) {
    return texts.map((text) => ({
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      provider: "none",
      confidence: 1.0,
    }));
  }

  const requests: TranslationRequest[] = texts.map((text) => ({
    text,
    sourceLanguage,
    targetLanguage,
  }));

  return translator.translateBatch(requests);
}

/**
 * Translate a narration script for video
 */
export async function translateNarrationScript(
  script: { id: string; text: string }[],
  targetLanguage: SupportedLanguage,
  options?: {
    sourceLanguage?: SupportedLanguage;
    translatorType?: TranslatorType;
  }
): Promise<{ id: string; text: string; originalText: string }[]> {
  const texts = script.map((s) => s.text);
  const results = await translateBatch(texts, targetLanguage, options);

  return script.map((section, index) => ({
    id: section.id,
    text: results[index].translatedText,
    originalText: section.text,
  }));
}

/**
 * Check if translation is needed
 */
export function needsTranslation(
  text: string,
  targetLanguage: SupportedLanguage
): boolean {
  const detected = detectLanguage(text);
  return detected.language !== targetLanguage && detected.confidence >= 0.6;
}

/**
 * Get available translators
 */
export function getAvailableTranslators(): TranslatorType[] {
  const available: TranslatorType[] = [];

  const deepl = createDeepLTranslator();
  if (deepl.isAvailable()) available.push("deepl");

  const openai = createOpenAITranslator();
  if (openai.isAvailable()) available.push("openai");

  return available;
}
