/**
 * OpenAI translation provider
 */

import type {
  TranslationProvider,
  TranslationRequest,
  TranslationResult,
  SupportedLanguage,
} from "../types";
import { detectLanguage } from "../detector";

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
};

/**
 * OpenAI-based translation provider using GPT models
 */
export class OpenAITranslator implements TranslationProvider {
  readonly name = "openai";
  private apiKey: string | null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || null;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const { text, sourceLanguage, targetLanguage, context } = request;

    const systemPrompt = `You are a professional translator. Translate the following text from ${LANGUAGE_NAMES[sourceLanguage]} to ${LANGUAGE_NAMES[targetLanguage]}.
Maintain the original tone and meaning. Only output the translation, nothing else.
${context ? `Context: ${context}` : ""}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        max_tokens: Math.max(text.length * 2, 500),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim() || "";

    return {
      translatedText,
      sourceLanguage,
      targetLanguage,
      provider: this.name,
      confidence: 0.9,
    };
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    // Process in parallel with rate limiting
    const results: TranslationResult[] = [];
    const batchSize = 5;

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((request) => this.translate(request))
      );
      results.push(...batchResults);

      // Rate limiting pause between batches
      if (i + batchSize < requests.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  async detectLanguage(text: string): Promise<SupportedLanguage> {
    // Use local detection first for efficiency
    const localResult = detectLanguage(text);
    if (localResult.confidence >= 0.8) {
      return localResult.language;
    }

    // Fall back to API detection for uncertain cases
    if (!this.apiKey) {
      return localResult.language;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Detect the language of the given text. Respond with only the language code: ko (Korean), en (English), ja (Japanese), or zh (Chinese).",
            },
            { role: "user", content: text.slice(0, 500) },
          ],
          temperature: 0,
          max_tokens: 5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const detected = data.choices[0]?.message?.content?.trim().toLowerCase();
        if (["ko", "en", "ja", "zh"].includes(detected)) {
          return detected as SupportedLanguage;
        }
      }
    } catch {
      // Fall back to local detection
    }

    return localResult.language;
  }
}

/**
 * Create an OpenAI translator instance
 */
export function createOpenAITranslator(apiKey?: string): OpenAITranslator {
  return new OpenAITranslator(apiKey);
}
