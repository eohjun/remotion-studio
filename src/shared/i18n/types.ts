/**
 * Multi-language support types
 */

/** Supported languages */
export type SupportedLanguage = "ko" | "en" | "ja" | "zh";

/** Language names for display */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

/** Translation request */
export interface TranslationRequest {
  /** Text to translate */
  text: string;
  /** Source language */
  sourceLanguage: SupportedLanguage;
  /** Target language */
  targetLanguage: SupportedLanguage;
  /** Context for better translation */
  context?: string;
}

/** Translation result */
export interface TranslationResult {
  /** Translated text */
  translatedText: string;
  /** Source language (detected or provided) */
  sourceLanguage: SupportedLanguage;
  /** Target language */
  targetLanguage: SupportedLanguage;
  /** Translation provider used */
  provider: string;
  /** Confidence score (0-1) */
  confidence?: number;
}

/** Translation provider interface */
export interface TranslationProvider {
  /** Provider name */
  readonly name: string;
  /** Translate single text */
  translate(request: TranslationRequest): Promise<TranslationResult>;
  /** Batch translate multiple texts */
  translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]>;
  /** Detect language of text */
  detectLanguage(text: string): Promise<SupportedLanguage>;
  /** Check if provider is available */
  isAvailable(): boolean;
}

/** Language detection result */
export interface LanguageDetectionResult {
  /** Detected language */
  language: SupportedLanguage;
  /** Detection confidence (0-1) */
  confidence: number;
  /** Detection method used */
  method: "pattern" | "api" | "heuristic";
}

/** Voice configuration for TTS */
export interface VoiceConfig {
  /** Voice ID for OpenAI TTS */
  openaiVoice: string;
  /** Speed multiplier */
  openaiSpeed?: number;
  /** Voice ID for ElevenLabs */
  elevenlabsVoiceId?: string;
  /** Model ID for ElevenLabs */
  elevenlabsModelId?: string;
}

/** Language-specific TTS configuration */
export interface LanguageVoiceConfig {
  /** Language code */
  language: SupportedLanguage;
  /** Default voice config */
  defaultVoice: VoiceConfig;
  /** Alternative voices */
  alternativeVoices?: VoiceConfig[];
}

/** Narration generation options */
export interface NarrationOptions {
  /** Target language for narration */
  targetLanguage: SupportedLanguage;
  /** TTS provider to use */
  ttsProvider?: "openai" | "elevenlabs";
  /** Voice configuration override */
  voiceConfig?: Partial<VoiceConfig>;
  /** Whether to translate if source differs */
  translateIfNeeded?: boolean;
}
