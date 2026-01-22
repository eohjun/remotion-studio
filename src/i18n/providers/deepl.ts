/**
 * DeepL translation provider
 */

import type {
  TranslationProvider,
  TranslationRequest,
  TranslationResult,
  SupportedLanguage,
} from "../types";
import { detectLanguage } from "../detector";

/** DeepL language codes */
const DEEPL_LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  ko: "KO",
  en: "EN",
  ja: "JA",
  zh: "ZH",
};

/** DeepL API base URL */
const DEEPL_API_BASE = "https://api-free.deepl.com/v2";

/**
 * DeepL translation provider
 * Known for high-quality translations, especially for European languages
 */
export class DeepLTranslator implements TranslationProvider {
  readonly name = "deepl";
  private apiKey: string | null;
  private isPro: boolean;

  constructor(apiKey?: string, isPro = false) {
    this.apiKey = apiKey || process.env.DEEPL_API_KEY || null;
    this.isPro = isPro;
  }

  private get baseUrl(): string {
    return this.isPro ? "https://api.deepl.com/v2" : DEEPL_API_BASE;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    if (!this.apiKey) {
      throw new Error("DeepL API key not configured");
    }

    const { text, sourceLanguage, targetLanguage } = request;

    const params = new URLSearchParams({
      text,
      source_lang: DEEPL_LANGUAGE_CODES[sourceLanguage],
      target_lang: DEEPL_LANGUAGE_CODES[targetLanguage],
    });

    const response = await fetch(`${this.baseUrl}/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${this.apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const translatedText = data.translations?.[0]?.text || "";

    return {
      translatedText,
      sourceLanguage,
      targetLanguage,
      provider: this.name,
      confidence: 0.95, // DeepL is known for high quality
    };
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    if (!this.apiKey) {
      throw new Error("DeepL API key not configured");
    }

    // Group requests by language pair for efficient batch processing
    const groupedRequests = new Map<string, TranslationRequest[]>();

    for (const request of requests) {
      const key = `${request.sourceLanguage}-${request.targetLanguage}`;
      if (!groupedRequests.has(key)) {
        groupedRequests.set(key, []);
      }
      groupedRequests.get(key)!.push(request);
    }

    const allResults: TranslationResult[] = [];

    for (const [, groupRequests] of groupedRequests) {
      const { sourceLanguage, targetLanguage } = groupRequests[0];

      const params = new URLSearchParams();
      for (const req of groupRequests) {
        params.append("text", req.text);
      }
      params.append("source_lang", DEEPL_LANGUAGE_CODES[sourceLanguage]);
      params.append("target_lang", DEEPL_LANGUAGE_CODES[targetLanguage]);

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${this.apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepL API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      const translations = data.translations || [];

      for (let i = 0; i < groupRequests.length; i++) {
        allResults.push({
          translatedText: translations[i]?.text || "",
          sourceLanguage,
          targetLanguage,
          provider: this.name,
          confidence: 0.95,
        });
      }
    }

    return allResults;
  }

  async detectLanguage(text: string): Promise<SupportedLanguage> {
    // Use local detection for efficiency
    const localResult = detectLanguage(text);
    return localResult.language;
  }
}

/**
 * Create a DeepL translator instance
 */
export function createDeepLTranslator(apiKey?: string, isPro = false): DeepLTranslator {
  return new DeepLTranslator(apiKey, isPro);
}
