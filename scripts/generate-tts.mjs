/**
 * TTS 음성 생성 스크립트
 *
 * 사용법:
 *   node scripts/generate-tts.mjs              # OpenAI 사용 (기본값)
 *   node scripts/generate-tts.mjs --openai     # OpenAI 사용
 *   node scripts/generate-tts.mjs --elevenlabs # ElevenLabs 사용
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 경로 설정
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, ".env") });

// CLI 인자 파싱
const args = process.argv.slice(2);
const useElevenLabs = args.includes("--elevenlabs") || args.includes("-e");
const provider = useElevenLabs ? "elevenlabs" : "openai";

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
console.log(`📄 나레이션 파일: ${narrationFile}\n`);

// 출력 디렉토리 생성
const outputDir = path.join(projectRoot, "public", "audio");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ============================================
// OpenAI TTS
// ============================================
async function generateWithOpenAI(text, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("여기에")) {
    throw new Error("OPENAI_API_KEY가 .env에 설정되지 않았습니다.");
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: narration.openai?.model || "tts-1-hd",
      input: text,
      voice: narration.openai?.voice || "nova",
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
async function generateWithElevenLabs(text, outputPath) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.includes("여기에")) {
    throw new Error("ELEVENLABS_API_KEY가 .env에 설정되지 않았습니다.");
  }

  // ElevenLabs 음성 ID (기본값: Rachel - 한국어 지원 음성)
  const voiceId = narration.elevenlabs?.voiceId || "21m00Tcm4TlvDq8ikWAM";
  const modelId = narration.elevenlabs?.modelId || "eleven_multilingual_v2";

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
// 메인 실행
// ============================================
async function main() {
  const providerName = provider === "elevenlabs" ? "ElevenLabs" : "OpenAI";
  const generateFn =
    provider === "elevenlabs" ? generateWithElevenLabs : generateWithOpenAI;

  console.log(`🎙️  ${providerName} TTS 음성 생성 시작\n`);
  console.log(`Provider: ${providerName}`);
  console.log(`씬 개수: ${narration.scenes.length}\n`);

  for (const scene of narration.scenes) {
    const outputPath = path.join(outputDir, `${scene.id}.mp3`);

    console.log(`⏳ [${scene.id}] 생성 중...`);
    console.log(`   "${scene.text.substring(0, 40)}..."`);

    try {
      await generateFn(scene.text, outputPath);
      console.log(`✅ [${scene.id}] 완료 → ${outputPath}\n`);
    } catch (error) {
      console.error(`❌ [${scene.id}] 실패: ${error.message}\n`);
    }
  }

  console.log("🎉 모든 음성 생성 완료!");
  console.log(`📁 출력 위치: ${outputDir}`);
}

main().catch(console.error);
