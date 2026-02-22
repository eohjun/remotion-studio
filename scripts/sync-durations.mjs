/**
 * 오디오 메타데이터를 기반으로 constants.ts의 SCENE_FRAMES만 업데이트
 *
 * 사용법:
 *   node scripts/sync-durations.mjs <audio-metadata.json 경로> [옵션]
 *
 * 옵션:
 *   --output, -o <경로>   출력 constants.ts 경로 (기본: src/videos/<compositionId>/constants.ts)
 *   --buffer, -b <프레임> 각 씬에 추가할 버퍼 프레임 (기본: 5)
 *   --fps <숫자>          프레임 레이트 (기본: 60)
 *   --dry-run             파일 생성 없이 미리보기만
 *   --create              constants.ts가 없으면 새로 생성
 *
 * 예시:
 *   node scripts/sync-durations.mjs public/videos/ZeigarnikEffect/audio/audio-metadata.json
 *   node scripts/sync-durations.mjs public/videos/ZeigarnikEffect/audio/audio-metadata.json --buffer 10
 *
 * ⚠️ 중요: 버퍼는 프레임 단위입니다 (초가 아님!)
 *    - 5프레임 = 0.17초 (권장)
 *    - 이전 기본값 1.5초(45프레임)는 과도한 공백을 유발했음
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI 인자 파싱
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
사용법: node scripts/sync-durations.mjs <audio-metadata.json 경로> [옵션]

옵션:
  --output, -o <경로>   출력 constants.ts 경로
  --buffer, -b <프레임> 각 씬에 추가할 버퍼 프레임 (기본: 5)
  --fps <숫자>          프레임 레이트 (기본: 60)
  --dry-run             파일 생성 없이 미리보기만
  --create              constants.ts가 없으면 새로 생성

⚠️ 버퍼는 프레임 단위입니다! (5프레임 = 약 0.17초)

예시:
  node scripts/sync-durations.mjs public/videos/ZeigarnikEffect/audio/audio-metadata.json
  node scripts/sync-durations.mjs public/videos/ZeigarnikEffect/audio/audio-metadata.json --buffer 10
`);
  process.exit(0);
}

// 메타데이터 파일 경로
const metadataPath = args[0].startsWith("/")
  ? args[0]
  : path.join(projectRoot, args[0]);

if (!fs.existsSync(metadataPath)) {
  console.error(`❌ 메타데이터 파일을 찾을 수 없습니다: ${metadataPath}`);
  process.exit(1);
}

// 옵션 파싱
const outputArgIndex = args.findIndex(arg => arg === "--output" || arg === "-o");
const bufferArgIndex = args.findIndex(arg => arg === "--buffer" || arg === "-b");
const fpsArgIndex = args.findIndex(arg => arg === "--fps");
const dryRun = args.includes("--dry-run");
const createIfMissing = args.includes("--create");

// 버퍼: 프레임 단위 (기본 5프레임 = ~0.17초)
const bufferFrames = bufferArgIndex !== -1 && args[bufferArgIndex + 1]
  ? parseInt(args[bufferArgIndex + 1], 10)
  : 5;

const fps = fpsArgIndex !== -1 && args[fpsArgIndex + 1]
  ? parseInt(args[fpsArgIndex + 1], 10)
  : 60; // 기본 60fps (이 프로젝트의 표준)

// 메타데이터 로드
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
console.log(`📄 메타데이터 로드: ${metadataPath}`);
console.log(`🎬 Composition: ${metadata.compositionId || "(미지정)"}`);
console.log(`📊 씬 개수: ${metadata.scenes.length}`);
console.log(`⏱️  버퍼: ${bufferFrames}프레임 (${(bufferFrames / fps).toFixed(2)}초), FPS: ${fps}\n`);

// 출력 경로 결정
let outputPath;
if (outputArgIndex !== -1 && args[outputArgIndex + 1]) {
  outputPath = args[outputArgIndex + 1].startsWith("/")
    ? args[outputArgIndex + 1]
    : path.join(projectRoot, args[outputArgIndex + 1]);
} else if (metadata.compositionId) {
  outputPath = path.join(projectRoot, "src", "videos", metadata.compositionId, "constants.ts");
} else {
  console.error("❌ 출력 경로를 지정해주세요 (--output) 또는 메타데이터에 compositionId가 필요합니다.");
  process.exit(1);
}

// ============================================
// SCENE_FRAMES 생성
// ============================================
function generateSceneFrames() {
  const lines = [];
  lines.push("export const SCENE_FRAMES = {");

  for (const scene of metadata.scenes) {
    const audioFrames = scene.durationFrames || Math.ceil((scene.durationSeconds || 0) * fps);
    const totalFrames = audioFrames + bufferFrames;
    const audioSeconds = scene.durationSeconds?.toFixed(1) || "?";

    const sceneId = scene.id;
    const padding = " ".repeat(Math.max(1, 20 - sceneId.length));
    lines.push(`  ${sceneId}: ${totalFrames},${padding}// ${audioFrames} + ${bufferFrames} (${audioSeconds}s audio)`);
  }

  lines.push("} as const;");
  return lines.join("\n");
}

// ============================================
// SCENES 생성 (start/duration in seconds 형식)
// PomodoroTechnique 등 일부 비디오에서 사용
// ============================================
function generateScenes() {
  const lines = [];
  lines.push("export const SCENES = {");

  let currentStart = 0;
  for (const scene of metadata.scenes) {
    const audioSeconds = scene.durationSeconds || 0;
    // 버퍼를 초 단위로 변환하여 추가
    const bufferSeconds = bufferFrames / fps;
    const totalDuration = Math.ceil(audioSeconds + bufferSeconds);

    const sceneId = scene.id;
    const padding = " ".repeat(Math.max(1, 20 - sceneId.length));
    lines.push(`  ${sceneId}: { start: ${currentStart}, duration: ${totalDuration} },${padding}// ${audioSeconds.toFixed(2)}s audio`);

    currentStart += totalDuration;
  }

  lines.push("} as const;");
  return { code: lines.join("\n"), totalDuration: currentStart };
}

// ============================================
// SCENE_START_FRAMES 생성
// ============================================
function generateSceneStartFrames() {
  const sceneIds = metadata.scenes.map(s => s.id);
  const lines = [];
  lines.push("export const SCENE_START_FRAMES = {");

  for (let i = 0; i < sceneIds.length; i++) {
    const id = sceneIds[i];
    if (i === 0) {
      lines.push(`  ${id}: 0,`);
    } else {
      const prevIds = sceneIds.slice(0, i);
      const calc = prevIds.map(pid => `SCENE_FRAMES.${pid}`).join(" + ");
      lines.push(`  ${id}: ${calc},`);
    }
  }

  lines.push("} as const;");
  return lines.join("\n");
}

// ============================================
// 기존 파일 업데이트 또는 새로 생성
// ============================================
function updateOrCreateConstants() {
  const sceneFramesCode = generateSceneFrames();
  const sceneStartFramesCode = generateSceneStartFrames();
  const { code: scenesCode, totalDuration } = generateScenes();

  // 기존 파일이 있는지 확인
  if (fs.existsSync(outputPath)) {
    console.log(`📝 기존 파일 업데이트: ${outputPath}`);

    let content = fs.readFileSync(outputPath, "utf-8");
    const originalContent = content;

    // 파일에서 사용 중인 형식 감지
    const usesScenesFormat = /export const SCENES = \{/.test(content);
    const usesSceneFramesFormat = /export const SCENE_FRAMES = \{/.test(content);

    if (usesScenesFormat) {
      // SCENES 형식 (start/duration in seconds)
      const scenesRegex = /export const SCENES = \{[\s\S]*?\} as const;/;
      content = content.replace(scenesRegex, scenesCode);
      console.log("   ✅ SCENES 업데이트됨 (start/duration 형식)");

      // TOTAL_DURATION_SECONDS 업데이트
      const totalDurationRegex = /export const TOTAL_DURATION_SECONDS = \d+;/;
      if (totalDurationRegex.test(content)) {
        content = content.replace(totalDurationRegex, `export const TOTAL_DURATION_SECONDS = ${totalDuration};`);
        console.log(`   ✅ TOTAL_DURATION_SECONDS 업데이트됨: ${totalDuration}초`);
      }
    } else if (usesSceneFramesFormat) {
      // SCENE_FRAMES 형식 (기존 방식)
      const sceneFramesRegex = /export const SCENE_FRAMES = \{[\s\S]*?\} as const;/;
      content = content.replace(sceneFramesRegex, sceneFramesCode);
      console.log("   ✅ SCENE_FRAMES 업데이트됨");

      // SCENE_START_FRAMES 블록 교체
      const sceneStartFramesRegex = /export const SCENE_START_FRAMES = \{[\s\S]*?\} as const;/;
      if (sceneStartFramesRegex.test(content)) {
        content = content.replace(sceneStartFramesRegex, sceneStartFramesCode);
        console.log("   ✅ SCENE_START_FRAMES 업데이트됨");
      } else {
        console.log("   ⚠️ SCENE_START_FRAMES를 찾을 수 없음 - 건너뜀");
      }
    } else {
      console.log("   ⚠️ SCENE_FRAMES 또는 SCENES를 찾을 수 없음 - 건너뜀");
    }

    // 헤더 주석 업데이트 (날짜)
    const dateComment = `// Updated: ${new Date().toISOString().split("T")[0]} from audio-metadata.json`;
    const headerRegex = /\/\/ Updated: \d{4}-\d{2}-\d{2} from audio-metadata\.json/;
    if (headerRegex.test(content)) {
      content = content.replace(headerRegex, dateComment);
    }

    if (content === originalContent) {
      console.log("   ℹ️ 변경 사항 없음");
      return content;
    }

    return content;
  } else if (createIfMissing) {
    console.log(`📝 새 파일 생성: ${outputPath}`);

    // 새 파일 생성
    const newContent = `// ${metadata.compositionId || "Video"} Constants
// Based on audio-metadata.json durations
// Updated: ${new Date().toISOString().split("T")[0]} from audio-metadata.json

export const FPS = ${fps};

// Scene durations in frames (오디오 길이 + 버퍼 ${bufferFrames}프레임)
${sceneFramesCode}

// Calculate cumulative start frames
${sceneStartFramesCode}

// Total duration
export const TOTAL_FRAMES = Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0);
`;
    return newContent;
  } else {
    console.error(`❌ constants.ts가 존재하지 않습니다: ${outputPath}`);
    console.error(`   --create 옵션을 사용하면 새로 생성할 수 있습니다.`);
    process.exit(1);
  }
}

// 실행
const updatedContent = updateOrCreateConstants();

console.log("\n" + "─".repeat(60));
console.log("📋 SCENE_FRAMES 미리보기:");
console.log("─".repeat(60));
console.log(generateSceneFrames());
console.log("─".repeat(60));

if (dryRun) {
  console.log("\n🔍 Dry run 모드 - 파일이 저장되지 않았습니다.");
} else {
  // 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, updatedContent);
  console.log(`\n✅ 저장됨: ${outputPath}`);
}

// 요약 출력
console.log("\n📊 씬별 duration 요약:");
let totalAudioFrames = 0;
let totalFrames = 0;

for (const scene of metadata.scenes) {
  const audioFrames = scene.durationFrames || Math.ceil((scene.durationSeconds || 0) * fps);
  const sceneTotal = audioFrames + bufferFrames;
  const audioSeconds = scene.durationSeconds?.toFixed(1) || "?";
  const sceneId = scene.id;

  totalAudioFrames += audioFrames;
  totalFrames += sceneTotal;

  console.log(`   ${sceneId}: ${audioSeconds}s → ${audioFrames} + ${bufferFrames} = ${sceneTotal} frames`);
}

const totalSeconds = totalFrames / fps;
const minutes = Math.floor(totalSeconds / 60);
const seconds = Math.round(totalSeconds % 60);

console.log(`\n⏱️  총 길이: ${totalFrames} frames (${minutes}:${seconds.toString().padStart(2, "0")})`);
console.log(`   오디오: ${totalAudioFrames} frames, 버퍼: ${metadata.scenes.length * bufferFrames} frames`);
