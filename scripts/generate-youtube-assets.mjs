#!/usr/bin/env node
/**
 * YouTube 에셋 생성 스크립트
 *
 * 사용법:
 *   node scripts/generate-youtube-assets.mjs <composition-id> [options]
 *
 * Options:
 *   --output <path>    출력 디렉토리 (기본: ./youtube/)
 *   --preset <name>    렌더링 프리셋 (1080p, 1440p, 4k)
 *   --thumbnail        썸네일 생성
 *   --lang <code>      언어 설정 (ko, en, ja, zh)
 *   --dry-run          미리보기 (파일 생성 안함)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// 렌더링 프리셋
const RENDER_PRESETS = {
  "1080p": {
    name: "1080p HD",
    width: 1920,
    height: 1080,
    crf: 18,
    codec: "h264",
  },
  "1440p": {
    name: "1440p QHD",
    width: 2560,
    height: 1440,
    crf: 18,
    codec: "h264",
  },
  "4k": {
    name: "4K UHD",
    width: 3840,
    height: 2160,
    crf: 18,
    codec: "h265",
  },
};

// CLI 인자 파싱
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help")) {
  console.log(`
YouTube 에셋 생성 스크립트

사용법:
  node scripts/generate-youtube-assets.mjs <composition-id> [options]

Options:
  --output <path>    출력 디렉토리 (기본: ./youtube/)
  --config <path>    컴포지션 설정 파일 경로
  --preset <name>    렌더링 프리셋 (1080p, 1440p, 4k)
  --thumbnail        썸네일 생성
  --lang <code>      언어 설정 (ko, en, ja, zh)
  --dry-run          미리보기 (파일 생성 안함)

예시:
  node scripts/generate-youtube-assets.mjs SelfHelpCritiqueV2 --output ./youtube/
  node scripts/generate-youtube-assets.mjs note_202601160105 --preset 4k --thumbnail
  `);
  process.exit(0);
}

// 인자 파싱
const compositionId = args.find(a => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const generateThumbnail = args.includes("--thumbnail");

const outputIndex = args.indexOf("--output");
const outputDir = outputIndex !== -1 && args[outputIndex + 1]
  ? args[outputIndex + 1]
  : path.join(projectRoot, "youtube");

const presetIndex = args.indexOf("--preset");
const presetName = presetIndex !== -1 && args[presetIndex + 1]
  ? args[presetIndex + 1]
  : "1080p";

const langIndex = args.indexOf("--lang");
const language = langIndex !== -1 && args[langIndex + 1]
  ? args[langIndex + 1]
  : "ko";

const configIndex = args.indexOf("--config");
const configPath = configIndex !== -1 && args[configIndex + 1]
  ? args[configIndex + 1]
  : null;

// 프리셋 검증
const preset = RENDER_PRESETS[presetName];
if (!preset) {
  console.error(`❌ 알 수 없는 프리셋: ${presetName}`);
  console.error(`   사용 가능: ${Object.keys(RENDER_PRESETS).join(", ")}`);
  process.exit(1);
}

console.log(`\n🎬 YouTube 에셋 생성`);
console.log(`   Composition: ${compositionId}`);
console.log(`   출력 디렉토리: ${outputDir}`);
console.log(`   프리셋: ${presetName} (${preset.name})`);
console.log(`   언어: ${language}\n`);

// 컴포지션 설정 로드 (있는 경우)
let compositionConfig = null;
if (configPath && fs.existsSync(configPath)) {
  compositionConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  console.log(`📄 설정 파일 로드: ${configPath}`);
} else {
  // generated 폴더에서 찾기
  const generatedPath = path.join(projectRoot, "src/generated", `${compositionId}.json`);
  if (fs.existsSync(generatedPath)) {
    compositionConfig = JSON.parse(fs.readFileSync(generatedPath, "utf-8"));
    console.log(`📄 설정 파일 로드: ${generatedPath}`);
  }
}

// 타임스탬프 포맷
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// 챕터 생성
function generateChapters(scenes, fps = 30, sceneDuration = 150) {
  const chapters = [];
  let currentTime = 0;

  // YouTube 요구사항: 첫 챕터는 0:00에서 시작
  chapters.push({
    timestamp: "0:00",
    timestampSeconds: 0,
    title: scenes[0]?.type === "intro" ? "인트로" : "시작",
    sceneId: scenes[0]?.id || "intro",
  });

  for (let i = 1; i < scenes.length; i++) {
    const scene = scenes[i];
    currentTime += sceneDuration / fps;

    // 짧은 씬이나 트랜지션 건너뛰기
    if (scene.type === "transition" || scene.type === "buffer") continue;

    // YouTube는 최소 10초 간격 필요
    if (currentTime < chapters[chapters.length - 1].timestampSeconds + 10) continue;

    let title = scene.title || scene.heading || `파트 ${i}`;
    if (scene.type === "outro") title = "마무리";
    if (scene.type === "intro") title = "인트로";

    chapters.push({
      timestamp: formatTimestamp(currentTime),
      timestampSeconds: currentTime,
      title,
      sceneId: scene.id,
    });
  }

  return chapters;
}

// 메타데이터 생성
function generateMetadata(config, chapters, lang = "ko") {
  const title = config?.name || compositionId;

  // 설명 생성
  const descParts = [];
  const emoji = true;

  descParts.push(emoji ? `📚 ${title}에 대해 알아봅니다.` : `${title}에 대해 알아봅니다.`);
  descParts.push("");

  // 챕터 추가 (3개 이상일 때만)
  if (chapters.length >= 3) {
    descParts.push(emoji ? "⏱️ 목차:" : "목차:");
    for (const chapter of chapters) {
      descParts.push(`${chapter.timestamp} ${chapter.title}`);
    }
    descParts.push("");
  }

  // CTA
  const ctaByLang = {
    ko: "👍 도움이 되셨다면 좋아요와 구독 부탁드립니다!",
    en: "👍 If you found this helpful, please like and subscribe!",
    ja: "👍 お役に立ちましたら、いいねとチャンネル登録をお願いします！",
    zh: "👍 如果对您有帮助，请点赞和订阅！",
  };
  descParts.push(ctaByLang[lang] || ctaByLang.ko);
  descParts.push("");
  descParts.push("#지식 #교육 #개념정리");

  // 태그 생성
  const tags = [];
  if (config?.name) {
    const words = config.name.split(/\s+/).filter(w => w.length > 2);
    tags.push(...words.slice(0, 5));
  }
  tags.push("교육", "학습", "지식", "설명");

  return {
    title: title.slice(0, 100), // YouTube 제한
    description: descParts.join("\n"),
    tags,
    chapters,
    language: lang,
    categoryId: "27", // Education
  };
}

// 렌더 커맨드 생성
function generateRenderCommand(compositionId, outputPath, preset) {
  const args = [
    "npx remotion render",
    compositionId,
    outputPath,
    `--width=${preset.width}`,
    `--height=${preset.height}`,
    `--crf=${preset.crf}`,
  ];

  if (preset.codec === "h265") {
    args.push("--codec=h265");
  }

  return args.join(" ");
}

// 썸네일 커맨드 생성
function generateThumbnailCommand(compositionId, outputPath, frame = 30) {
  return `npx remotion still ${compositionId} ${outputPath} --frame=${frame}`;
}

// 메인 실행
async function main() {
  // 출력 디렉토리 생성
  if (!dryRun && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 디렉토리 생성: ${outputDir}`);
  }

  // 씬 정보 가져오기
  const scenes = compositionConfig?.scenes || [];
  const fps = compositionConfig?.fps || 30;
  const sceneDuration = compositionConfig?.sceneDuration || 150;

  // 챕터 생성
  console.log("\n📝 챕터 생성 중...");
  const chapters = generateChapters(scenes, fps, sceneDuration);
  console.log(`   ${chapters.length}개 챕터 생성`);

  // 메타데이터 생성
  console.log("\n📋 메타데이터 생성 중...");
  const metadata = generateMetadata(compositionConfig, chapters, language);
  console.log(`   제목: ${metadata.title}`);
  console.log(`   태그: ${metadata.tags.length}개`);

  // 렌더 커맨드 생성
  const videoPath = path.join(outputDir, `video_${presetName}.mp4`);
  const renderCommand = generateRenderCommand(compositionId, videoPath, preset);

  // 썸네일 커맨드 생성
  let thumbnailCommand = null;
  if (generateThumbnail) {
    const thumbnailPath = path.join(outputDir, "thumbnail.png");
    const thumbnailFrame = fps * 2; // 2초 지점
    thumbnailCommand = generateThumbnailCommand(compositionId, thumbnailPath, thumbnailFrame);
  }

  if (dryRun) {
    console.log("\n🔍 미리보기 모드 - 파일 생성 안함\n");

    console.log("📄 메타데이터:");
    console.log(JSON.stringify(metadata, null, 2));

    console.log("\n📼 렌더 커맨드:");
    console.log(`   ${renderCommand}`);

    if (thumbnailCommand) {
      console.log("\n🖼️  썸네일 커맨드:");
      console.log(`   ${thumbnailCommand}`);
    }

    return;
  }

  // 파일 저장
  // 1. 메타데이터 JSON
  const metadataPath = path.join(outputDir, "metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`\n✅ 메타데이터 저장: ${metadataPath}`);

  // 2. 챕터 텍스트 파일
  if (chapters.length >= 3) {
    const chaptersPath = path.join(outputDir, "chapters.txt");
    const chaptersText = chapters.map(c => `${c.timestamp} ${c.title}`).join("\n");
    fs.writeFileSync(chaptersPath, chaptersText);
    console.log(`✅ 챕터 저장: ${chaptersPath}`);
  }

  // 3. 설명 텍스트 파일
  const descriptionPath = path.join(outputDir, "description.txt");
  fs.writeFileSync(descriptionPath, metadata.description);
  console.log(`✅ 설명 저장: ${descriptionPath}`);

  // 4. 태그 파일
  const tagsPath = path.join(outputDir, "tags.txt");
  fs.writeFileSync(tagsPath, metadata.tags.join(", "));
  console.log(`✅ 태그 저장: ${tagsPath}`);

  // 5. 렌더 스크립트
  const renderScriptPath = path.join(outputDir, "render.sh");
  let renderScript = `#!/bin/bash\n# YouTube 영상 렌더링 스크립트\n\n`;
  renderScript += `echo "🎬 영상 렌더링 시작..."\n`;
  renderScript += `${renderCommand}\n`;
  renderScript += `echo "✅ 렌더링 완료: ${videoPath}"\n`;

  if (thumbnailCommand) {
    renderScript += `\necho "🖼️  썸네일 생성 중..."\n`;
    renderScript += `${thumbnailCommand}\n`;
    renderScript += `echo "✅ 썸네일 생성 완료"\n`;
  }

  fs.writeFileSync(renderScriptPath, renderScript);
  fs.chmodSync(renderScriptPath, "755");
  console.log(`✅ 렌더 스크립트 저장: ${renderScriptPath}`);

  // 완료 메시지
  console.log(`\n🎉 YouTube 에셋 생성 완료!`);
  console.log(`\n📁 생성된 파일:`);
  console.log(`   - metadata.json     메타데이터`);
  console.log(`   - description.txt   영상 설명`);
  console.log(`   - tags.txt          태그`);
  if (chapters.length >= 3) {
    console.log(`   - chapters.txt      챕터/타임스탬프`);
  }
  console.log(`   - render.sh         렌더링 스크립트`);

  console.log(`\n🚀 다음 단계:`);
  console.log(`   1. 렌더링: bash ${renderScriptPath}`);
  console.log(`   2. 또는 직접: ${renderCommand}`);
  console.log(`   3. YouTube Studio에서 업로드 및 메타데이터 적용`);
}

main().catch(console.error);
