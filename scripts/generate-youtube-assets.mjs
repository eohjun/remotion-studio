#!/usr/bin/env node
/**
 * YouTube 에셋 생성 스크립트
 *
 * projects/{compositionId}/ 폴더의 narration.json, video-plan.json,
 * research-report.md를 읽어서 YouTube용 metadata.json과 description.txt를 생성합니다.
 *
 * 사용법:
 *   node scripts/generate-youtube-assets.mjs <composition-id> [options]
 *
 * Options:
 *   --dry-run          미리보기 (파일 생성 안함)
 *   --thumbnail        썸네일 생성 커맨드 포함
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI 인자 파싱
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help")) {
  console.log(`
YouTube 에셋 생성 스크립트

사용법:
  node scripts/generate-youtube-assets.mjs <composition-id> [options]

Options:
  --dry-run          미리보기 (파일 생성 안함)
  --thumbnail        썸네일 생성

읽는 파일:
  - projects/{id}/narration.json     (씬 제목, 내용)
  - projects/{id}/video-plan.json    (메타데이터)
  - projects/{id}/research-report.md (참고 자료)
  - src/videos/{id}/constants.ts     (씬 듀레이션)

출력 위치:
  - projects/{id}/youtube/metadata.json
  - projects/{id}/youtube/description.txt

예시:
  node scripts/generate-youtube-assets.mjs DevCompetencyComparison
  node scripts/generate-youtube-assets.mjs SelfHelpCritiqueFull --dry-run
  `);
  process.exit(0);
}

// 인자 파싱
const compositionId = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const generateThumbnail = args.includes("--thumbnail");

if (!compositionId) {
  console.error("❌ composition-id를 입력해주세요.");
  process.exit(1);
}

// 경로 설정
const projectDir = path.join(projectRoot, "projects", compositionId);
const srcDir = path.join(projectRoot, "src/videos", compositionId);
const outputDir = path.join(projectDir, "youtube");

console.log(`\n🎬 YouTube 에셋 생성`);
console.log(`   Composition: ${compositionId}`);
console.log(`   프로젝트 폴더: ${projectDir}`);
console.log(`   출력 위치: ${outputDir}\n`);

// 파일 존재 확인
if (!fs.existsSync(projectDir)) {
  console.error(`❌ 프로젝트 폴더를 찾을 수 없습니다: ${projectDir}`);
  process.exit(1);
}

// narration.json 로드
let narration = null;
const narrationPath = path.join(projectDir, "narration.json");
if (fs.existsSync(narrationPath)) {
  narration = JSON.parse(fs.readFileSync(narrationPath, "utf-8"));
  console.log(`📄 narration.json 로드: ${narration.scenes?.length || 0}개 씬`);
}

// video-plan.json 로드
let videoPlan = null;
const videoPlanPath = path.join(projectDir, "video-plan.json");
if (fs.existsSync(videoPlanPath)) {
  videoPlan = JSON.parse(fs.readFileSync(videoPlanPath, "utf-8"));
  console.log(`📄 video-plan.json 로드`);
}

// research-report.md 로드
let researchReport = null;
const researchPath = path.join(projectDir, "research-report.md");
if (fs.existsSync(researchPath)) {
  researchReport = fs.readFileSync(researchPath, "utf-8");
  console.log(`📄 research-report.md 로드`);
}

// constants.ts에서 SCENE_START_FRAMES 파싱
let sceneFrames = null;
let fps = 60;
const constantsPath = path.join(srcDir, "constants.ts");
if (fs.existsSync(constantsPath)) {
  const constantsContent = fs.readFileSync(constantsPath, "utf-8");

  // FPS 추출
  const fpsMatch = constantsContent.match(/fps:\s*(\d+)/);
  if (fpsMatch) fps = parseInt(fpsMatch[1]);

  // SCENE_START_FRAMES 추출
  const startFramesMatch = constantsContent.match(
    /SCENE_START_FRAMES\s*=\s*\{([^}]+)\}/s
  );
  if (startFramesMatch) {
    sceneFrames = {};
    const entries = startFramesMatch[1].matchAll(/(\w+):\s*(\d+)/g);
    for (const entry of entries) {
      sceneFrames[entry[1]] = parseInt(entry[2]);
    }
    console.log(`📄 constants.ts 로드: ${Object.keys(sceneFrames).length}개 씬 프레임`);
  }
}

// 데이터 검증
if (!narration && !videoPlan) {
  console.error(`❌ narration.json 또는 video-plan.json이 필요합니다.`);
  process.exit(1);
}

// 언어 감지
const language = narration?.metadata?.language || videoPlan?.metadata?.language || "ko";
console.log(`🌐 언어: ${language}`);

// 타임스탬프 포맷
function formatTimestamp(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// 챕터 생성 (narration.json 기반)
function generateChapters() {
  const chapters = [];

  if (narration?.scenes && sceneFrames) {
    // constants.ts의 프레임 정보 사용
    const sceneKeys = Object.keys(sceneFrames);
    const narrationScenes = narration.scenes;

    for (let i = 0; i < narrationScenes.length; i++) {
      const scene = narrationScenes[i];
      const sceneKey = sceneKeys[i];
      const startFrame = sceneFrames[sceneKey] || 0;
      const seconds = startFrame / fps;

      chapters.push({
        time: formatTimestamp(seconds),
        title: scene.title || scene.id || `파트 ${i + 1}`,
      });
    }
  } else if (narration?.scenes) {
    // startFrame 정보 사용
    for (const scene of narration.scenes) {
      const seconds = (scene.startFrame || 0) / fps;
      chapters.push({
        time: formatTimestamp(seconds),
        title: scene.title || scene.id || "파트",
      });
    }
  }

  return chapters;
}

// 제목 생성
function generateTitle() {
  // 우선순위: videoPlan > narration > compositionId
  if (videoPlan?.metadata?.title) {
    return videoPlan.metadata.title;
  }
  if (narration?.metadata?.title) {
    return narration.metadata.title;
  }
  return compositionId;
}

// 태그 생성
function generateTags() {
  const tags = new Set();

  // video-plan에서 키워드 추출
  if (videoPlan?.metadata?.title) {
    const words = videoPlan.metadata.title.split(/[\s:,]+/).filter((w) => w.length > 1);
    words.forEach((w) => tags.add(w));
  }

  // narration에서 키워드 추출
  if (narration?.scenes) {
    for (const scene of narration.scenes) {
      if (scene.title) {
        const words = scene.title.split(/[\s:,]+/).filter((w) => w.length > 1);
        words.slice(0, 3).forEach((w) => tags.add(w));
      }
    }
  }

  // 기본 태그 추가
  const defaultTags =
    language === "ko"
      ? ["교육", "학습", "지식"]
      : ["education", "learning", "knowledge"];
  defaultTags.forEach((t) => tags.add(t));

  return Array.from(tags).slice(0, 15);
}

// 참고 자료 추출
function extractSources() {
  if (!researchReport) return [];

  const sources = [];
  const lines = researchReport.split("\n");

  for (const line of lines) {
    // "- Source Name" 또는 "• Source Name" 패턴
    const match = line.match(/^[-•]\s*(.+)/);
    if (match && match[1].length > 5 && match[1].length < 100) {
      sources.push(match[1].trim());
    }
  }

  return sources.slice(0, 5);
}

// 메타데이터 생성
function generateMetadata(chapters) {
  const title = generateTitle();
  const tags = generateTags();

  return {
    youtube: {
      title: title.slice(0, 100),
      description: "", // description.txt에서 별도 생성
      tags,
      category: "27", // Education
      language,
      defaultLanguage: language,
      privacyStatus: "public",
      madeForKids: false,
      chapters,
    },
    seo: {
      primaryKeyword: tags[0] || title.split(" ")[0],
      secondaryKeywords: tags.slice(1, 5),
    },
  };
}

// description.txt 생성
function generateDescription(chapters, metadata) {
  const lines = [];
  const title = metadata.youtube.title;

  // 훅 문장
  if (language === "ko") {
    lines.push(`🎯 ${title}`);
    lines.push("");

    // 내용 요약 (narration 첫 씬에서 추출)
    if (narration?.scenes?.[0]?.text) {
      const hookText = narration.scenes[0].text.slice(0, 150);
      lines.push(hookText + (hookText.length >= 150 ? "..." : ""));
      lines.push("");
    }
  } else {
    lines.push(`🎯 ${title}`);
    lines.push("");
  }

  // 챕터
  if (chapters.length >= 3) {
    lines.push("⏱️ 챕터:");
    for (const chapter of chapters) {
      lines.push(`${chapter.time} ${chapter.title}`);
    }
    lines.push("");
  }

  // 참고 자료
  const sources = extractSources();
  if (sources.length > 0) {
    lines.push(language === "ko" ? "📚 참고 자료:" : "📚 Sources:");
    for (const source of sources) {
      lines.push(`• ${source}`);
    }
    lines.push("");
  }

  // CTA
  if (language === "ko") {
    lines.push("👍 도움이 되셨다면 좋아요와 구독 부탁드립니다!");
  } else {
    lines.push("👍 If you found this helpful, please like and subscribe!");
  }
  lines.push("");

  // 해시태그
  const hashtags = metadata.youtube.tags.slice(0, 5).map((t) => `#${t}`);
  lines.push(hashtags.join(" "));

  return lines.join("\n");
}

// 메인 실행
async function main() {
  // 챕터 생성
  console.log("\n📝 챕터 생성 중...");
  const chapters = generateChapters();
  console.log(`   ${chapters.length}개 챕터 생성`);

  // 메타데이터 생성
  console.log("\n📋 메타데이터 생성 중...");
  const metadata = generateMetadata(chapters);
  console.log(`   제목: ${metadata.youtube.title}`);
  console.log(`   태그: ${metadata.youtube.tags.length}개`);

  // description 생성
  const description = generateDescription(chapters, metadata);
  metadata.youtube.description = description;

  if (dryRun) {
    console.log("\n🔍 미리보기 모드 - 파일 생성 안함\n");
    console.log("📄 metadata.json:");
    console.log(JSON.stringify(metadata, null, 2));
    console.log("\n📄 description.txt:");
    console.log(description);
    return;
  }

  // 출력 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`\n📁 디렉토리 생성: ${outputDir}`);
  }

  // 파일 저장
  const metadataPath = path.join(outputDir, "metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`\n✅ 메타데이터 저장: ${metadataPath}`);

  const descriptionPath = path.join(outputDir, "description.txt");
  fs.writeFileSync(descriptionPath, description);
  console.log(`✅ 설명 저장: ${descriptionPath}`);

  // 완료 메시지
  console.log(`\n🎉 YouTube 에셋 생성 완료!`);
  console.log(`\n📁 생성된 파일:`);
  console.log(`   - ${outputDir}/metadata.json`);
  console.log(`   - ${outputDir}/description.txt`);

  if (generateThumbnail) {
    console.log(`\n🖼️  썸네일 생성:`);
    console.log(`   npx remotion still ${compositionId} ${outputDir}/thumbnail.png --frame=60`);
  }
}

main().catch(console.error);
