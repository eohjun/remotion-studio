/**
 * 오디오에서 문장별 타임스탬프 추출 (OpenAI Whisper 사용)
 *
 * 사용법:
 *   node scripts/extract-timestamps.mjs <compositionId>
 *   node scripts/extract-timestamps.mjs ZeigarnikEffect
 *   node scripts/extract-timestamps.mjs ZeigarnikEffect --scene hook
 *
 * 출력:
 *   - public/videos/{compositionId}/audio/timestamps.json
 *   - 각 씬별 문장/단어 타임스탬프
 *
 * ⚠️ 요구사항:
 *   - OPENAI_API_KEY 환경변수 필요
 *   - TTS 오디오가 먼저 생성되어 있어야 함
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, ".env") });

// CLI 인자 파싱
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
사용법: node scripts/extract-timestamps.mjs <compositionId> [옵션]

옵션:
  --scene, -s <id>    특정 씬만 처리 (예: hook,discovery)
  --verbose, -v       상세 출력

예시:
  node scripts/extract-timestamps.mjs ZeigarnikEffect
  node scripts/extract-timestamps.mjs ZeigarnikEffect --scene hook
`);
  process.exit(0);
}

const compositionId = args[0];
const sceneArgIndex = args.findIndex(arg => arg === "--scene" || arg === "-s");
const sceneFilter = sceneArgIndex !== -1 && args[sceneArgIndex + 1]
  ? args[sceneArgIndex + 1].split(",").map(s => s.trim())
  : null;
const verbose = args.includes("--verbose") || args.includes("-v");

// 경로 설정
const audioDir = path.join(projectRoot, "public", "videos", compositionId, "audio");
const metadataPath = path.join(audioDir, "audio-metadata.json");

if (!fs.existsSync(metadataPath)) {
  console.error(`❌ audio-metadata.json을 찾을 수 없습니다: ${metadataPath}`);
  console.error(`   먼저 TTS를 생성하세요: node scripts/generate-tts.mjs -f projects/${compositionId}/narration.json`);
  process.exit(1);
}

const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

// ============================================
// FPS 읽기 (constants.ts에서)
// ============================================
function getFpsFromConstants(compositionId) {
  const DEFAULT_FPS = 60;
  const constantsPath = path.join(projectRoot, "src", "videos", compositionId, "constants.ts");

  if (!fs.existsSync(constantsPath)) {
    console.log(`⚠️ constants.ts 없음, 기본 FPS 사용: ${DEFAULT_FPS}`);
    return DEFAULT_FPS;
  }

  try {
    const content = fs.readFileSync(constantsPath, "utf-8");
    const match = content.match(/export\s+const\s+FPS\s*=\s*(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  } catch (error) {
    console.error(`⚠️ constants.ts 읽기 실패: ${error.message}`);
  }

  return DEFAULT_FPS;
}

const PROJECT_FPS = getFpsFromConstants(compositionId);
console.log(`📄 메타데이터 로드: ${compositionId}`);
console.log(`📊 씬 개수: ${metadata.scenes.length}`);
if (sceneFilter) {
  console.log(`🎯 선택된 씬: ${sceneFilter.join(", ")}`);
}
console.log("");

// ============================================
// Whisper API로 타임스탬프 추출
// ============================================
async function extractTimestamps(audioPath, language = "ko") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 .env에 설정되지 않았습니다.");
  }

  // 파일 읽기
  const audioBuffer = fs.readFileSync(audioPath);
  const fileName = path.basename(audioPath);

  // FormData 생성 (Node.js 18+ native)
  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
  formData.append("file", blob, fileName);
  formData.append("model", "whisper-1");
  formData.append("language", language);
  formData.append("response_format", "verbose_json");
  formData.append("timestamp_granularities[]", "word");
  formData.append("timestamp_granularities[]", "segment");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Whisper API 오류: ${error}`);
  }

  return await response.json();
}

// ============================================
// 메인 실행
// ============================================
async function main() {
  // Load existing timestamps to preserve unfiltered scenes
  const timestampsPath = path.join(audioDir, "timestamps.json");
  let existingScenes = [];
  if (sceneFilter && fs.existsSync(timestampsPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(timestampsPath, "utf-8"));
      existingScenes = (existing.scenes || []).filter(
        (s) => !sceneFilter.includes(s.id)
      );
    } catch {}
  }

  const timestamps = {
    compositionId,
    generatedAt: new Date().toISOString(),
    fps: PROJECT_FPS,
    scenes: [...existingScenes],
  };

  for (const scene of metadata.scenes) {
    if (sceneFilter && !sceneFilter.includes(scene.id)) {
      console.log(`⏭️  [${scene.id}] 스킵 (기존 유지)`);
      continue;
    }

    const audioPath = path.join(audioDir, scene.file);
    if (!fs.existsSync(audioPath)) {
      console.log(`⚠️  [${scene.id}] 오디오 파일 없음: ${scene.file}`);
      continue;
    }

    console.log(`⏳ [${scene.id}] 타임스탬프 추출 중...`);

    try {
      const result = await extractTimestamps(audioPath, metadata.language || "ko");

      const sceneTimestamps = {
        id: scene.id,
        duration: scene.durationSeconds,
        durationFrames: scene.durationFrames,
        text: result.text,
        segments: result.segments?.map(seg => ({
          text: seg.text.trim(),
          start: seg.start,
          end: seg.end,
          startFrame: Math.round(seg.start * PROJECT_FPS),
          endFrame: Math.round(seg.end * PROJECT_FPS),
        })) || [],
        words: result.words?.map(word => ({
          word: word.word,
          start: word.start,
          end: word.end,
          startFrame: Math.round(word.start * PROJECT_FPS),
          endFrame: Math.round(word.end * PROJECT_FPS),
        })) || [],
      };

      timestamps.scenes.push(sceneTimestamps);

      if (verbose) {
        console.log(`   📝 텍스트: "${result.text.substring(0, 50)}..."`);
        console.log(`   📊 세그먼트: ${sceneTimestamps.segments.length}개`);
        console.log(`   📊 단어: ${sceneTimestamps.words.length}개`);
      }

      console.log(`✅ [${scene.id}] 완료 - ${sceneTimestamps.segments.length}개 세그먼트, ${sceneTimestamps.words.length}개 단어\n`);

    } catch (error) {
      console.error(`❌ [${scene.id}] 실패: ${error.message}\n`);
      timestamps.scenes.push({
        id: scene.id,
        error: error.message,
      });
    }
  }

  // 타임스탬프 저장
  const outputPath = path.join(audioDir, "timestamps.json");
  fs.writeFileSync(outputPath, JSON.stringify(timestamps, null, 2));
  console.log(`📊 타임스탬프 저장: ${outputPath}`);

  // 요약 출력
  console.log("\n📊 추출 완료 요약:");
  for (const scene of timestamps.scenes) {
    if (scene.error) {
      console.log(`   ❌ ${scene.id}: 실패`);
    } else {
      console.log(`   ✅ ${scene.id}: ${scene.segments?.length || 0} 세그먼트, ${scene.words?.length || 0} 단어`);
    }
  }

  console.log(`\n💡 다음 단계: node scripts/generate-visual-panels.mjs ${compositionId}`);
}

main().catch(console.error);
