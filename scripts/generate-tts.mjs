/**
 * TTS 음성 생성 스크립트
 *
 * 사용법:
 *   node scripts/generate-tts.mjs              # OpenAI 사용 (기본값)
 *   node scripts/generate-tts.mjs --openai     # OpenAI 사용
 *   node scripts/generate-tts.mjs --elevenlabs # ElevenLabs 사용
 *   node scripts/generate-tts.mjs --lang en    # 영어 음성 생성
 *   node scripts/generate-tts.mjs --translate --lang en # 번역 후 영어 음성 생성
 *
 * 출력:
 *   - 각 씬별 MP3 파일
 *   - audio-metadata.json (오디오 길이 정보 포함)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import dotenv from "dotenv";

// 경로 설정
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, ".env") });

// 지원 언어
const SUPPORTED_LANGUAGES = ["ko", "en", "ja", "zh"];
const LANGUAGE_NAMES = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

// 언어별 기본 음성 설정
const VOICE_CONFIGS = {
  ko: { openai: "nova", elevenlabs: "pNInz6obpgDQGcFmaJgB", model: "eleven_multilingual_v2" },
  en: { openai: "alloy", elevenlabs: "21m00Tcm4TlvDq8ikWAM", model: "eleven_monolingual_v1" },
  ja: { openai: "nova", elevenlabs: "pNInz6obpgDQGcFmaJgB", model: "eleven_multilingual_v2" },
  zh: { openai: "nova", elevenlabs: "pNInz6obpgDQGcFmaJgB", model: "eleven_multilingual_v2" },
};

// CLI 인자 파싱
const args = process.argv.slice(2);
const useElevenLabs = args.includes("--elevenlabs") || args.includes("-e");
const provider = useElevenLabs ? "elevenlabs" : "openai";
const doTranslate = args.includes("--translate") || args.includes("-t");

// 언어 설정
const langArgIndex = args.findIndex(arg => arg === "--lang" || arg === "-l");
const targetLang = langArgIndex !== -1 && args[langArgIndex + 1]
  ? args[langArgIndex + 1]
  : "ko";

if (!SUPPORTED_LANGUAGES.includes(targetLang)) {
  console.error(`❌ 지원하지 않는 언어: ${targetLang}`);
  console.error(`   지원 언어: ${SUPPORTED_LANGUAGES.join(", ")}`);
  process.exit(1);
}

// 나레이션 파일 경로 (--file 옵션으로 지정 가능)
const fileArgIndex = args.findIndex(arg => arg === "--file" || arg === "-f");
const narrationFile = fileArgIndex !== -1 && args[fileArgIndex + 1]
  ? args[fileArgIndex + 1]
  : "narration.json";
const narrationPath = path.join(__dirname, narrationFile);

if (!fs.existsSync(narrationPath)) {
  console.error(`❌ 나레이션 파일을 찾을 수 없습니다: ${narrationPath}`);
  process.exit(1);
}

const narration = JSON.parse(fs.readFileSync(narrationPath, "utf-8"));
console.log(`📄 나레이션 파일: ${narrationFile}`);
console.log(`🌐 대상 언어: ${LANGUAGE_NAMES[targetLang]} (${targetLang})\n`);

// 출력 디렉토리 결정 (우선순위: --output > metadata.compositionId > 언어별 폴더)
const outputArgIndex = args.findIndex(arg => arg === "--output" || arg === "-o");
const customOutputDir = outputArgIndex !== -1 && args[outputArgIndex + 1]
  ? args[outputArgIndex + 1]
  : null;

// compositionId 기반 출력 (권장)
const compositionId = narration.metadata?.compositionId;

let outputDir;
if (customOutputDir) {
  // 명시적 --output 옵션 사용
  outputDir = path.join(projectRoot, "public", "videos", customOutputDir, "audio");
} else if (compositionId) {
  // metadata.compositionId 사용 (권장)
  outputDir = path.join(projectRoot, "public", "videos", compositionId, "audio");
  console.log(`📁 compositionId 기반 출력: public/videos/${compositionId}/audio/`);
} else {
  // 폴백: compositionId 필수
  console.error(`❌ metadata.compositionId가 없습니다.`);
  console.error(`   narration.json에 "metadata": { "compositionId": "YourVideoName" } 추가 필요`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ============================================
// 언어 감지
// ============================================
function detectLanguage(text) {
  const koPattern = /[\uAC00-\uD7AF]/g;
  const jaPattern = /[\u3040-\u309F\u30A0-\u30FF]/g;
  const zhPattern = /[\u4E00-\u9FFF]/g;

  const koCount = (text.match(koPattern) || []).length;
  const jaCount = (text.match(jaPattern) || []).length;
  const zhCount = (text.match(zhPattern) || []).length;

  if (koCount > 10) return "ko";
  if (jaCount > 10) return "ja";
  if (zhCount > 20 && jaCount < 5) return "zh";
  return "en";
}

// ============================================
// 번역 (OpenAI 사용)
// ============================================
async function translateText(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) return text;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("번역을 위해 OPENAI_API_KEY가 필요합니다.");
  }

  const sourceName = LANGUAGE_NAMES[sourceLang] || sourceLang;
  const targetName = LANGUAGE_NAMES[targetLang] || targetLang;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}. Maintain the original tone and meaning. Only output the translation, nothing else.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`번역 API 오류: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || text;
}

// ============================================
// OpenAI TTS
// ============================================
async function generateWithOpenAI(text, outputPath, lang) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("여기에")) {
    throw new Error("OPENAI_API_KEY가 .env에 설정되지 않았습니다.");
  }

  const voiceConfig = VOICE_CONFIGS[lang] || VOICE_CONFIGS.en;
  const voice = narration.openai?.voice || voiceConfig.openai;

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: narration.openai?.model || "tts-1-hd",
      input: text,
      voice: voice,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API 오류: ${JSON.stringify(error)}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

// ============================================
// ElevenLabs TTS
// ============================================
async function generateWithElevenLabs(text, outputPath, lang) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.includes("여기에")) {
    throw new Error("ELEVENLABS_API_KEY가 .env에 설정되지 않았습니다.");
  }

  const voiceConfig = VOICE_CONFIGS[lang] || VOICE_CONFIGS.en;
  const voiceId = narration.elevenlabs?.voiceId || voiceConfig.elevenlabs;
  const modelId = narration.elevenlabs?.modelId || voiceConfig.model;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: modelId,
        voice_settings: {
          stability: narration.elevenlabs?.stability || 0.5,
          similarity_boost: narration.elevenlabs?.similarityBoost || 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API 오류: ${error}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

// ============================================
// 오디오 길이 측정 (ffprobe 사용)
// ============================================
function getAudioDuration(filePath) {
  try {
    const result = execSync(
      `ffprobe -i "${filePath}" -show_entries format=duration -v quiet -of csv="p=0"`,
      { encoding: "utf-8" }
    );
    return parseFloat(result.trim());
  } catch (error) {
    console.error(`⚠️ 오디오 길이 측정 실패: ${filePath}`);
    return null;
  }
}

// ============================================
// 메인 실행
// ============================================
async function main() {
  const providerName = provider === "elevenlabs" ? "ElevenLabs" : "OpenAI";
  const generateFn =
    provider === "elevenlabs" ? generateWithElevenLabs : generateWithOpenAI;

  console.log(`🎙️  ${providerName} TTS 음성 생성 시작`);
  console.log(`Provider: ${providerName}`);
  console.log(`씬 개수: ${narration.scenes.length}`);
  if (doTranslate) {
    console.log(`번역: 활성화 (→ ${LANGUAGE_NAMES[targetLang]})`);
  }
  console.log("");

  // 번역된 텍스트 저장 (나중에 참조용)
  const translatedScenes = [];
  // 오디오 메타데이터 저장
  const audioMetadata = {
    generatedAt: new Date().toISOString(),
    provider: providerName,
    language: targetLang,
    outputDir: outputDir,
    compositionId: narration.metadata?.compositionId || null,
    scenes: [],
  };

  for (const scene of narration.scenes) {
    const outputPath = path.join(outputDir, `${scene.id}.mp3`);
    let textToSpeak = scene.text;

    // 번역 처리
    if (doTranslate) {
      const detectedLang = detectLanguage(scene.text);
      if (detectedLang !== targetLang) {
        console.log(`🔄 [${scene.id}] 번역 중 (${detectedLang} → ${targetLang})...`);
        try {
          textToSpeak = await translateText(scene.text, detectedLang, targetLang);
          translatedScenes.push({
            id: scene.id,
            original: scene.text,
            translated: textToSpeak,
          });
        } catch (error) {
          console.error(`   번역 실패: ${error.message}`);
          // 번역 실패 시 원본 사용
        }
      }
    }

    console.log(`⏳ [${scene.id}] 생성 중...`);
    console.log(`   "${textToSpeak.substring(0, 50)}..."`);

    try {
      await generateFn(textToSpeak, outputPath, targetLang);

      // 오디오 길이 측정
      const durationSeconds = getAudioDuration(outputPath);
      const sceneMetadata = {
        id: scene.id,
        file: `${scene.id}.mp3`,
        durationSeconds: durationSeconds,
        durationFrames: durationSeconds ? Math.ceil(durationSeconds * 30) : null, // 30fps 기준
        text: textToSpeak.substring(0, 100) + (textToSpeak.length > 100 ? "..." : ""),
      };
      audioMetadata.scenes.push(sceneMetadata);

      console.log(`✅ [${scene.id}] 완료 (${durationSeconds?.toFixed(1)}s) → ${outputPath}\n`);
    } catch (error) {
      console.error(`❌ [${scene.id}] 실패: ${error.message}\n`);
      audioMetadata.scenes.push({
        id: scene.id,
        file: `${scene.id}.mp3`,
        durationSeconds: null,
        durationFrames: null,
        error: error.message,
      });
    }
  }

  // 번역된 내용 저장 (참조용)
  if (doTranslate && translatedScenes.length > 0) {
    const translatedPath = path.join(__dirname, `narration_${targetLang}.json`);
    const translatedNarration = {
      ...narration,
      language: targetLang,
      originalLanguage: detectLanguage(narration.scenes[0]?.text || ""),
      scenes: narration.scenes.map(scene => {
        const translated = translatedScenes.find(t => t.id === scene.id);
        return {
          ...scene,
          text: translated ? translated.translated : scene.text,
          originalText: translated ? translated.original : undefined,
        };
      }),
    };
    fs.writeFileSync(translatedPath, JSON.stringify(translatedNarration, null, 2));
    console.log(`📝 번역된 나레이션 저장: ${translatedPath}`);
  }

  // 오디오 메타데이터 저장
  const metadataPath = path.join(outputDir, "audio-metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(audioMetadata, null, 2));
  console.log(`\n📊 오디오 메타데이터 저장: ${metadataPath}`);

  // 총 길이 계산
  const totalSeconds = audioMetadata.scenes
    .filter(s => s.durationSeconds)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  console.log(`⏱️  총 오디오 길이: ${minutes}분 ${seconds}초`);

  console.log("\n🎉 모든 음성 생성 완료!");
  console.log(`📁 출력 위치: ${outputDir}`);
  console.log(`\n💡 Tip: 'node scripts/sync-durations.mjs ${metadataPath}' 로 constants.ts 자동 생성 가능`);
}

main().catch(console.error);
