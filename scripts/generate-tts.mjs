/**
 * TTS 음성 생성 스크립트 (통합 파이프라인)
 *
 * 사용법:
 *   node scripts/generate-tts.mjs              # OpenAI 사용 (기본값)
 *   node scripts/generate-tts.mjs --openai     # OpenAI 사용
 *   node scripts/generate-tts.mjs --elevenlabs # ElevenLabs 사용
 *   node scripts/generate-tts.mjs --lang en    # 영어 음성 생성
 *   node scripts/generate-tts.mjs --translate --lang en # 번역 후 영어 음성 생성
 *   node scripts/generate-tts.mjs --scene hook # 특정 씬만 재생성
 *   node scripts/generate-tts.mjs --scene hook,discovery # 여러 씬 재생성
 *   node scripts/generate-tts.mjs --no-sync       # constants.ts 자동 동기화 비활성화
 *   node scripts/generate-tts.mjs --no-validate   # 오디오 검증 비활성화
 *   node scripts/generate-tts.mjs --no-timestamps # 타임스탬프 추출 비활성화
 *
 * 출력:
 *   - 각 씬별 MP3 파일
 *   - audio-metadata.json (오디오 길이 정보 포함)
 *   - timestamps.json (Whisper 타임스탬프 - visualPanels용)
 *   - constants.ts 자동 업데이트 (SCENE_FRAMES 동기화)
 *
 * 자동화 파이프라인 (기본 활성화):
 *   1. TTS 오디오 생성
 *   2. 오디오 품질 검증 (무음 구간, 이상 길이 감지)
 *   3. constants.ts 자동 동기화 (버퍼 5프레임)
 *   4. Whisper 타임스탬프 추출 (visualPanels 정확한 타이밍용)
 *   5. Visual Panels 자동 생성 (하드코딩 타이밍 대신 사용)
 *
 * ⚠️ 중요: 코드에 하드코딩된 패널 타이밍이 있다면
 *    visual-panels.json의 값으로 업데이트 필요!
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

// 특정 씬만 재생성 (--scene 옵션)
const sceneArgIndex = args.findIndex(arg => arg === "--scene" || arg === "-s");
const sceneFilter = sceneArgIndex !== -1 && args[sceneArgIndex + 1]
  ? args[sceneArgIndex + 1].split(",").map(s => s.trim())
  : null;

// 자동 동기화 및 검증 옵션 (기본값: 활성화)
const skipSync = args.includes("--no-sync");
const skipValidation = args.includes("--no-validate");
const skipTimestamps = args.includes("--no-timestamps");

// 나레이션 파일 경로 (--file 옵션으로 지정 가능)
const fileArgIndex = args.findIndex(arg => arg === "--file" || arg === "-f");
const narrationFile = fileArgIndex !== -1 && args[fileArgIndex + 1]
  ? args[fileArgIndex + 1]
  : "narration.json";
// projectRoot 기준으로 경로 해석 (scripts/ 디렉토리에서 실행해도 프로젝트 루트 기준)
const narrationPath = path.isAbsolute(narrationFile)
  ? narrationFile
  : path.join(projectRoot, narrationFile);

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
// FPS 읽기 (constants.ts에서)
// ============================================
function getFpsFromConstants(compositionId) {
  const DEFAULT_FPS = 60;

  if (!compositionId) {
    console.log(`⚠️ compositionId 없음, 기본 FPS 사용: ${DEFAULT_FPS}`);
    return DEFAULT_FPS;
  }

  const constantsPath = path.join(projectRoot, "src", "videos", compositionId, "constants.ts");

  if (!fs.existsSync(constantsPath)) {
    console.log(`⚠️ constants.ts 없음, 기본 FPS 사용: ${DEFAULT_FPS}`);
    return DEFAULT_FPS;
  }

  try {
    const content = fs.readFileSync(constantsPath, "utf-8");
    // export const FPS = 60; 또는 export const FPS = 30; 패턴 찾기
    const match = content.match(/export\s+const\s+FPS\s*=\s*(\d+)/);
    if (match) {
      const fps = parseInt(match[1], 10);
      console.log(`📊 constants.ts에서 FPS 읽음: ${fps}`);
      return fps;
    }
  } catch (error) {
    console.error(`⚠️ constants.ts 읽기 실패: ${error.message}`);
  }

  console.log(`⚠️ FPS를 찾을 수 없음, 기본값 사용: ${DEFAULT_FPS}`);
  return DEFAULT_FPS;
}

// 현재 프로젝트의 FPS
const PROJECT_FPS = getFpsFromConstants(compositionId);

// ============================================
// 텍스트 정리 (TTS용)
// ============================================
function cleanTextForTTS(text) {
  // [pause:X] 마커 제거 - TTS가 자연스럽게 문장부호로 쉼을 처리함
  let cleaned = text
    .replace(/\s*\[pause:short\]\s*/g, ' ')   // 짧은 쉼 - 공백으로
    .replace(/\s*\[pause:medium\]\s*/g, ' ')  // 중간 쉼 - 공백으로
    .replace(/\s*\[pause:long\]\s*/g, ' ')    // 긴 쉼 - 공백으로
    .replace(/\s*\[pause:breath\]\s*/g, ' ')  // 호흡 - 공백으로
    .replace(/\s*\[pause:\w+\]\s*/g, ' ')     // 기타 pause 마커
    .replace(/\s+/g, ' ')                      // 연속 공백 정리
    .trim();

  return cleaned;
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
// 오디오 품질 검증
// ============================================
function validateAudio(scenes) {
  const issues = [];
  const warnings = [];

  for (const scene of scenes) {
    if (scene.error) {
      issues.push(`❌ [${scene.id}] 생성 실패: ${scene.error}`);
      continue;
    }

    const duration = scene.durationSeconds;

    // 1. 너무 짧은 오디오 (0.5초 미만)
    if (duration && duration < 0.5) {
      warnings.push(`⚠️ [${scene.id}] 매우 짧은 오디오: ${duration.toFixed(2)}초`);
    }

    // 2. 텍스트 대비 이상한 길이 검사 (한국어 기준: 초당 약 4-6 음절)
    const textLength = scene.text?.length || 0;
    if (duration && textLength > 10) {
      const charPerSec = textLength / duration;

      // 너무 빠름: 초당 8자 이상 (TTS 생성 오류 가능성)
      if (charPerSec > 8) {
        warnings.push(`⚠️ [${scene.id}] 빠른 속도 감지: ${charPerSec.toFixed(1)}자/초 (${textLength}자, ${duration.toFixed(1)}초)`);
      }

      // 너무 느림: 초당 2자 미만 (긴 침묵 가능성)
      if (charPerSec < 2) {
        warnings.push(`⚠️ [${scene.id}] 느린 속도 감지: ${charPerSec.toFixed(1)}자/초 - 불필요한 침묵 가능성`);
      }
    }

    // 3. 씬 간 길이 일관성 검사 (intro/outro 제외)
    if (!["intro", "outro"].includes(scene.id)) {
      if (duration && duration < 5) {
        warnings.push(`⚠️ [${scene.id}] 콘텐츠 씬이 너무 짧음: ${duration.toFixed(1)}초`);
      }
      if (duration && duration > 45) {
        warnings.push(`⚠️ [${scene.id}] 콘텐츠 씬이 너무 김: ${duration.toFixed(1)}초 - 분할 고려`);
      }
    }
  }

  return { issues, warnings };
}

// ============================================
// constants.ts 자동 동기화
// ============================================
function syncConstants(metadataPath) {
  console.log("\n🔄 constants.ts 자동 동기화 중...");

  try {
    const syncScript = path.join(__dirname, "sync-durations.mjs");

    // sync-durations.mjs 실행
    const result = execSync(
      `node "${syncScript}" "${metadataPath}"`,
      { encoding: "utf-8", cwd: projectRoot }
    );

    // 주요 결과만 출력
    const lines = result.split("\n");
    for (const line of lines) {
      if (line.includes("✅") || line.includes("저장됨") || line.includes("총 길이")) {
        console.log(`   ${line.trim()}`);
      }
    }

    console.log("✅ constants.ts 동기화 완료");
    return true;
  } catch (error) {
    console.error(`❌ constants.ts 동기화 실패: ${error.message}`);
    return false;
  }
}

// ============================================
// 타임스탬프 추출 (Whisper API)
// ============================================
async function extractTimestamps(compositionId) {
  console.log("\n🕐 타임스탬프 추출 중 (Whisper API)...");

  try {
    const timestampScript = path.join(__dirname, "extract-timestamps.mjs");

    const result = execSync(
      `node "${timestampScript}" "${compositionId}"`,
      { encoding: "utf-8", cwd: projectRoot, timeout: 300000 } // 5분 타임아웃
    );

    // 주요 결과만 출력
    const lines = result.split("\n");
    for (const line of lines) {
      if (line.includes("✅") || line.includes("완료") || line.includes("저장")) {
        console.log(`   ${line.trim()}`);
      }
    }

    console.log("✅ 타임스탬프 추출 완료");
    return true;
  } catch (error) {
    console.error(`⚠️ 타임스탬프 추출 실패: ${error.message}`);
    console.log("   💡 수동 실행: node scripts/extract-timestamps.mjs " + compositionId);
    return false;
  }
}

// ============================================
// Visual Panels 생성 (timestamps.json 기반)
// ============================================
function generateVisualPanels(compositionId) {
  console.log("\n📊 Visual Panels 생성 중 (오디오 타이밍 동기화)...");

  try {
    const visualPanelsScript = path.join(__dirname, "generate-visual-panels.mjs");

    const result = execSync(
      `node "${visualPanelsScript}" "${compositionId}"`,
      { encoding: "utf-8", cwd: projectRoot }
    );

    // 주요 결과만 출력
    const lines = result.split("\n");
    for (const line of lines) {
      if (line.includes("✅") || line.includes("생성") || line.includes("저장")) {
        console.log(`   ${line.trim()}`);
      }
    }

    console.log("✅ Visual Panels 생성 완료");
    console.log("   ⚠️ 하드코딩된 패널 타이밍이 있다면 visual-panels.json 값으로 업데이트 필요!");
    return true;
  } catch (error) {
    console.error(`⚠️ Visual Panels 생성 실패: ${error.message}`);
    console.log("   💡 수동 실행: node scripts/generate-visual-panels.mjs " + compositionId);
    return false;
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
  if (sceneFilter) {
    console.log(`🎯 선택된 씬만 재생성: ${sceneFilter.join(", ")}`);
  }
  if (doTranslate) {
    console.log(`번역: 활성화 (→ ${LANGUAGE_NAMES[targetLang]})`);
  }
  console.log("");

  // 번역된 텍스트 저장 (나중에 참조용)
  const translatedScenes = [];

  // 기존 메타데이터 로드 (특정 씬만 재생성할 때 기존 정보 유지)
  const existingMetadataPath = path.join(outputDir, "audio-metadata.json");
  let existingMetadata = null;
  if (sceneFilter && fs.existsSync(existingMetadataPath)) {
    existingMetadata = JSON.parse(fs.readFileSync(existingMetadataPath, "utf-8"));
  }

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
    // 특정 씬만 재생성하는 경우, 필터에 없는 씬은 기존 메타데이터 사용
    if (sceneFilter && !sceneFilter.includes(scene.id)) {
      const existingScene = existingMetadata?.scenes?.find(s => s.id === scene.id);
      if (existingScene) {
        audioMetadata.scenes.push(existingScene);
        console.log(`⏭️  [${scene.id}] 스킵 (기존 오디오 유지)`);
      }
      continue;
    }
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

    // TTS용 텍스트 정리 ([pause:X] 마커 제거)
    textToSpeak = cleanTextForTTS(textToSpeak);

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
        durationFrames: durationSeconds ? Math.ceil(durationSeconds * PROJECT_FPS) : null, // constants.ts FPS 기준
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
  const savedMetadataPath = path.join(outputDir, "audio-metadata.json");
  fs.writeFileSync(savedMetadataPath, JSON.stringify(audioMetadata, null, 2));
  console.log(`\n📊 오디오 메타데이터 저장: ${savedMetadataPath}`);

  // 총 길이 계산
  const totalSeconds = audioMetadata.scenes
    .filter(s => s.durationSeconds)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  console.log(`⏱️  총 오디오 길이: ${minutes}분 ${seconds}초`);

  // ============================================
  // 오디오 품질 검증 (기본 활성화)
  // ============================================
  if (!skipValidation) {
    console.log("\n🔍 오디오 품질 검증 중...");
    const { issues, warnings } = validateAudio(audioMetadata.scenes);

    if (issues.length > 0) {
      console.log("\n🚨 심각한 문제 발견:");
      issues.forEach(issue => console.log(`   ${issue}`));
    }

    if (warnings.length > 0) {
      console.log("\n⚠️ 경고 (확인 권장):");
      warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (issues.length === 0 && warnings.length === 0) {
      console.log("✅ 품질 검증 통과 - 문제 없음");
    }
  }

  // ============================================
  // constants.ts 자동 동기화 (기본 활성화)
  // ============================================
  if (!skipSync && compositionId) {
    syncConstants(savedMetadataPath);
  } else if (!compositionId) {
    console.log("\n⚠️ compositionId가 없어 자동 동기화를 건너뜁니다.");
    console.log(`💡 수동 실행: node scripts/sync-durations.mjs "${savedMetadataPath}"`);
  } else {
    console.log(`\n💡 수동 동기화: node scripts/sync-durations.mjs "${savedMetadataPath}"`);
  }

  // ============================================
  // 타임스탬프 추출 (Whisper - 기본 활성화)
  // visualPanels 정확한 타이밍을 위해 필수
  // ============================================
  if (!skipTimestamps && compositionId) {
    const timestampsOk = await extractTimestamps(compositionId);

    // 타임스탬프 추출 성공 시 visual-panels 자동 생성
    if (timestampsOk) {
      generateVisualPanels(compositionId);
    }
  } else if (!skipTimestamps) {
    console.log("\n⚠️ compositionId가 없어 타임스탬프 추출을 건너뜁니다.");
  }

  console.log("\n🎉 모든 음성 생성 완료!");
  console.log(`📁 출력 위치: ${outputDir}`);
}

main().catch(console.error);
