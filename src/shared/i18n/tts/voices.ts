/**
 * Language-specific TTS voice configurations
 */

import type { LanguageVoiceConfig, SupportedLanguage, VoiceConfig } from "../types";

/**
 * Default voice configurations by language
 */
export const VOICE_CONFIGS: Record<SupportedLanguage, LanguageVoiceConfig> = {
  ko: {
    language: "ko",
    defaultVoice: {
      openaiVoice: "nova", // Good for Korean
      openaiSpeed: 1.0,
      elevenlabsVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam - multilingual
      elevenlabsModelId: "eleven_multilingual_v2",
    },
    alternativeVoices: [
      {
        openaiVoice: "shimmer",
        openaiSpeed: 1.0,
      },
      {
        openaiVoice: "alloy",
        openaiSpeed: 1.0,
      },
    ],
  },
  en: {
    language: "en",
    defaultVoice: {
      openaiVoice: "alloy",
      openaiSpeed: 1.0,
      elevenlabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
      elevenlabsModelId: "eleven_monolingual_v1",
    },
    alternativeVoices: [
      {
        openaiVoice: "echo",
        openaiSpeed: 1.0,
      },
      {
        openaiVoice: "fable",
        openaiSpeed: 1.0,
      },
      {
        openaiVoice: "onyx",
        openaiSpeed: 1.0,
      },
      {
        openaiVoice: "nova",
        openaiSpeed: 1.0,
      },
      {
        openaiVoice: "shimmer",
        openaiSpeed: 1.0,
      },
    ],
  },
  ja: {
    language: "ja",
    defaultVoice: {
      openaiVoice: "nova",
      openaiSpeed: 0.95, // Slightly slower for Japanese clarity
      elevenlabsVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam - multilingual
      elevenlabsModelId: "eleven_multilingual_v2",
    },
    alternativeVoices: [
      {
        openaiVoice: "shimmer",
        openaiSpeed: 0.95,
      },
    ],
  },
  zh: {
    language: "zh",
    defaultVoice: {
      openaiVoice: "nova",
      openaiSpeed: 1.0,
      elevenlabsVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam - multilingual
      elevenlabsModelId: "eleven_multilingual_v2",
    },
    alternativeVoices: [
      {
        openaiVoice: "shimmer",
        openaiSpeed: 1.0,
      },
    ],
  },
};

/**
 * Get voice configuration for a language
 */
export function getVoiceConfig(language: SupportedLanguage): VoiceConfig {
  return VOICE_CONFIGS[language].defaultVoice;
}

/**
 * Get all voice configurations for a language
 */
export function getAllVoicesForLanguage(language: SupportedLanguage): VoiceConfig[] {
  const config = VOICE_CONFIGS[language];
  return [config.defaultVoice, ...(config.alternativeVoices || [])];
}

/**
 * Get OpenAI voice for a language
 */
export function getOpenAIVoice(language: SupportedLanguage): string {
  return VOICE_CONFIGS[language].defaultVoice.openaiVoice;
}

/**
 * Get OpenAI speed for a language
 */
export function getOpenAISpeed(language: SupportedLanguage): number {
  return VOICE_CONFIGS[language].defaultVoice.openaiSpeed || 1.0;
}

/**
 * Get ElevenLabs configuration for a language
 */
export function getElevenLabsConfig(
  language: SupportedLanguage
): { voiceId: string; modelId: string } | null {
  const config = VOICE_CONFIGS[language].defaultVoice;

  if (config.elevenlabsVoiceId && config.elevenlabsModelId) {
    return {
      voiceId: config.elevenlabsVoiceId,
      modelId: config.elevenlabsModelId,
    };
  }

  return null;
}

/**
 * Check if a language supports ElevenLabs TTS
 */
export function supportsElevenLabs(language: SupportedLanguage): boolean {
  const config = VOICE_CONFIGS[language].defaultVoice;
  return !!(config.elevenlabsVoiceId && config.elevenlabsModelId);
}
