/**
 * Multi-language support (i18n)
 * Supports Korean, English, Japanese, and Chinese
 */

// Types
export type {
  SupportedLanguage,
  TranslationRequest,
  TranslationResult,
  TranslationProvider,
  LanguageDetectionResult,
  VoiceConfig,
  LanguageVoiceConfig,
  NarrationOptions,
} from "./types";

export { LANGUAGE_NAMES } from "./types";

// Language detection
export {
  detectLanguage,
  detectLanguageAdvanced,
  isLanguage,
  getDominantLanguage,
} from "./detector";

// Translation
export {
  getTranslator,
  translateText,
  translateBatch,
  translateNarrationScript,
  needsTranslation,
  getAvailableTranslators,
  type TranslatorType,
} from "./translator";

// Translation providers
export {
  OpenAITranslator,
  createOpenAITranslator,
  DeepLTranslator,
  createDeepLTranslator,
} from "./providers";

// TTS voices
export {
  VOICE_CONFIGS,
  getVoiceConfig,
  getAllVoicesForLanguage,
  getOpenAIVoice,
  getOpenAISpeed,
  getElevenLabsConfig,
  supportsElevenLabs,
} from "./tts";
