/**
 * 오디오 메타데이터를 기반으로 constants.ts 자동 생성
 *
 * 사용법:
 *   node scripts/sync-durations.mjs <audio-metadata.json 경로> [옵션]
 *
 * 옵션:
 *   --output, -o <경로>   출력 constants.ts 경로 (기본: src/<compositionId>/constants.ts)
 *   --buffer, -b <초>     각 씬에 추가할 버퍼 시간 (기본: 1.5초)
 *   --fps <숫자>          프레임 레이트 (기본: 30)
 *   --dry-run             파일 생성 없이 미리보기만
 *
 * 예시:
 *   node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json
 *   node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json --buffer 2
 *   node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json -o src/MyComp/constants.ts
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
  --buffer, -b <초>     각 씬에 추가할 버퍼 시간 (기본: 1.5초)
  --fps <숫자>          프레임 레이트 (기본: 30)
  --dry-run             파일 생성 없이 미리보기만

예시:
  node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json
  node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json --buffer 2
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

const bufferSeconds = bufferArgIndex !== -1 && args[bufferArgIndex + 1]
  ? parseFloat(args[bufferArgIndex + 1])
  : 1.5;

const fps = fpsArgIndex !== -1 && args[fpsArgIndex + 1]
  ? parseInt(args[fpsArgIndex + 1], 10)
  : 30;

// 메타데이터 로드
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
console.log(`📄 메타데이터 로드: ${metadataPath}`);
console.log(`🎬 Composition: ${metadata.compositionId || "(미지정)"}`);
console.log(`📊 씬 개수: ${metadata.scenes.length}`);
console.log(`⏱️  버퍼: ${bufferSeconds}초, FPS: ${fps}\n`);

// 출력 경로 결정
let outputPath;
if (outputArgIndex !== -1 && args[outputArgIndex + 1]) {
  outputPath = args[outputArgIndex + 1].startsWith("/")
    ? args[outputArgIndex + 1]
    : path.join(projectRoot, args[outputArgIndex + 1]);
} else if (metadata.compositionId) {
  outputPath = path.join(projectRoot, "src", metadata.compositionId, "constants.ts");
} else {
  console.error("❌ 출력 경로를 지정해주세요 (--output) 또는 메타데이터에 compositionId가 필요합니다.");
  process.exit(1);
}

// scene ID를 CONSTANT_CASE로 변환
function toConstantCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toUpperCase();
}

// constants.ts 생성
function generateConstants() {
  const sceneDurations = {};
  const sceneComments = {};

  for (const scene of metadata.scenes) {
    const constName = toConstantCase(scene.id);
    const audioSeconds = scene.durationSeconds || 0;
    const totalSeconds = audioSeconds + bufferSeconds;
    const frames = Math.ceil(totalSeconds * fps);

    sceneDurations[constName] = frames;
    sceneComments[constName] = `${totalSeconds.toFixed(1)}s (audio: ${audioSeconds.toFixed(1)}s)`;
  }

  // 씬 duration 코드 생성
  const durationEntries = Object.entries(sceneDurations)
    .map(([name, frames]) => `  ${name}: ${frames},${" ".repeat(Math.max(1, 25 - name.length))}// ${sceneComments[name]}`)
    .join("\n");

  // 씬 시작 시간 계산 코드 생성
  const sceneNames = Object.keys(sceneDurations);
  let sceneStartCode = "";

  for (let i = 0; i < sceneNames.length; i++) {
    const name = sceneNames[i];
    if (i === 0) {
      sceneStartCode += `  ${name}: { start: 0, duration: SCENE_DURATIONS.${name} },\n`;
    } else {
      const prevNames = sceneNames.slice(0, i);
      const startCalc = prevNames.map(n => `SCENE_DURATIONS.${n}`).join(" + ");
      sceneStartCode += `  ${name}: {\n`;
      sceneStartCode += `    start: ${startCalc},\n`;
      sceneStartCode += `    duration: SCENE_DURATIONS.${name}\n`;
      sceneStartCode += `  },\n`;
    }
  }

  // 총 길이 계산
  const totalFrames = Object.values(sceneDurations).reduce((a, b) => a + b, 0);
  const totalSeconds = totalFrames / fps;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalSecondsRemainder = Math.round(totalSeconds % 60);

  const code = `/**
 * Auto-generated constants for ${metadata.compositionId || "Composition"}
 * Generated: ${new Date().toISOString()}
 * Source: ${path.basename(metadataPath)}
 *
 * ⚠️ 이 파일은 sync-durations.mjs에 의해 자동 생성됩니다.
 *    수동으로 수정하면 다음 동기화 시 덮어씌워질 수 있습니다.
 */

// Scene durations in frames (${fps}fps) - synced from audio metadata
export const SCENE_DURATIONS = {
${durationEntries}
} as const;

// Calculate scene start times
export const SCENES = {
${sceneStartCode}} as const;

// Total duration
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
// ${totalFrames} frames = ${Math.round(totalSeconds)} seconds = ${totalMinutes}:${totalSecondsRemainder.toString().padStart(2, "0")}

export const VIDEO_METADATA = {
  title: "${metadata.compositionId || "Video"}",
  description: "Auto-generated video composition",
  language: "${metadata.language || "en"}",
  generatedFrom: "${path.basename(metadataPath)}",
} as const;
`;

  return code;
}

// 미리보기 또는 저장
const generatedCode = generateConstants();

console.log("📝 생성된 constants.ts:\n");
console.log("─".repeat(60));
console.log(generatedCode);
console.log("─".repeat(60));

if (dryRun) {
  console.log("\n🔍 Dry run 모드 - 파일이 저장되지 않았습니다.");
} else {
  // 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, generatedCode);
  console.log(`\n✅ 저장됨: ${outputPath}`);
}

// 요약 출력
console.log("\n📊 씬별 duration 요약:");
for (const scene of metadata.scenes) {
  const constName = toConstantCase(scene.id);
  const audioSeconds = scene.durationSeconds || 0;
  const totalSeconds = audioSeconds + bufferSeconds;
  const frames = Math.ceil(totalSeconds * fps);
  console.log(`   ${scene.id}: ${audioSeconds.toFixed(1)}s → ${frames} frames (${totalSeconds.toFixed(1)}s)`);
}
