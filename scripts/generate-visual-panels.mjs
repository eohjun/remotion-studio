/**
 * 타임스탬프 기반 visualPanels 자동 생성
 *
 * 사용법:
 *   node scripts/generate-visual-panels.mjs <compositionId>
 *   node scripts/generate-visual-panels.mjs ZeigarnikEffect
 *
 * 입력:
 *   - public/videos/{compositionId}/audio/timestamps.json (extract-timestamps.mjs 출력)
 *   - projects/{compositionId}/narration.json
 *
 * 출력:
 *   - projects/{compositionId}/narration.json (visualPanels 추가됨)
 *   - projects/{compositionId}/visual-panels.json (별도 파일)
 *
 * ⚠️ 요구사항:
 *   - 먼저 extract-timestamps.mjs 실행 필요
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

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
    const match = content.match(/export\s+const\s+FPS\s*=\s*(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  } catch (error) {
    console.error(`⚠️ constants.ts 읽기 실패: ${error.message}`);
  }

  return DEFAULT_FPS;
}

// CLI 인자 파싱
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
사용법: node scripts/generate-visual-panels.mjs <compositionId> [옵션]

옵션:
  --dry-run           파일 저장 없이 미리보기만
  --scene, -s <id>    특정 씬만 처리

예시:
  node scripts/generate-visual-panels.mjs ZeigarnikEffect
  node scripts/generate-visual-panels.mjs ZeigarnikEffect --dry-run
`);
  process.exit(0);
}

const compositionId = args[0];
const dryRun = args.includes("--dry-run");
const sceneArgIndex = args.findIndex(arg => arg === "--scene" || arg === "-s");
const sceneFilter = sceneArgIndex !== -1 && args[sceneArgIndex + 1]
  ? args[sceneArgIndex + 1].split(",").map(s => s.trim())
  : null;

// FPS 읽기
const PROJECT_FPS = getFpsFromConstants(compositionId);
console.log(`📊 프로젝트 FPS: ${PROJECT_FPS}`);

// 경로 설정
const timestampsPath = path.join(projectRoot, "public", "videos", compositionId, "audio", "timestamps.json");
const narrationPath = path.join(projectRoot, "projects", compositionId, "narration.json");

if (!fs.existsSync(timestampsPath)) {
  console.error(`❌ timestamps.json을 찾을 수 없습니다: ${timestampsPath}`);
  console.error(`   먼저 타임스탬프를 추출하세요: node scripts/extract-timestamps.mjs ${compositionId}`);
  process.exit(1);
}

if (!fs.existsSync(narrationPath)) {
  console.error(`❌ narration.json을 찾을 수 없습니다: ${narrationPath}`);
  process.exit(1);
}

const timestamps = JSON.parse(fs.readFileSync(timestampsPath, "utf-8"));
const narration = JSON.parse(fs.readFileSync(narrationPath, "utf-8"));

console.log(`📄 타임스탬프 로드: ${compositionId}`);
console.log(`📄 나레이션 로드: ${narration.scenes.length}개 씬`);
console.log("");

// ============================================
// 텍스트 유사도 계산 (Levenshtein distance 기반)
// ============================================
function similarity(s1, s2) {
  // 정규화: 공백, 구두점 제거
  const normalize = (s) => s.toLowerCase().replace(/[^\w\s가-힣]/g, "").replace(/\s+/g, " ").trim();
  const a = normalize(s1);
  const b = normalize(s2);

  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  // 짧은 문자열이 긴 문자열에 포함되어 있는지 확인
  if (a.includes(b) || b.includes(a)) {
    return 0.9;
  }

  // 시작 부분 매칭
  const minLen = Math.min(a.length, b.length);
  let matchCount = 0;
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matchCount++;
    else break;
  }

  return matchCount / Math.max(a.length, b.length);
}

// ============================================
// 패널 텍스트에 해당하는 타임스탬프 찾기
// ============================================
function findTimestampForPanel(panelText, segments, words) {
  // 1. 세그먼트에서 매칭 시도
  let bestSegment = null;
  let bestScore = 0;

  for (const segment of segments) {
    const score = similarity(panelText, segment.text);
    if (score > bestScore && score > 0.5) {
      bestScore = score;
      bestSegment = segment;
    }
  }

  if (bestSegment) {
    return {
      start: bestSegment.start,
      end: bestSegment.end,
      startFrame: bestSegment.startFrame,
      endFrame: bestSegment.endFrame,
      matchedText: bestSegment.text,
      confidence: bestScore,
      matchType: "segment",
    };
  }

  // 2. 단어 시퀀스에서 매칭 시도
  if (words && words.length > 0) {
    const panelWords = panelText.toLowerCase().split(/\s+/);
    const firstWord = panelWords[0]?.replace(/[^\w가-힣]/g, "");

    for (let i = 0; i < words.length; i++) {
      const word = words[i].word.replace(/[^\w가-힣]/g, "").toLowerCase();
      if (word.includes(firstWord) || firstWord.includes(word)) {
        // 연속된 단어들의 끝 찾기
        let endIndex = i;
        for (let j = i; j < Math.min(i + panelWords.length + 5, words.length); j++) {
          endIndex = j;
        }

        return {
          start: words[i].start,
          end: words[endIndex].end,
          startFrame: words[i].startFrame,
          endFrame: words[endIndex].endFrame,
          matchedText: words.slice(i, endIndex + 1).map(w => w.word).join(" "),
          confidence: 0.7,
          matchType: "words",
        };
      }
    }
  }

  return null;
}

// ============================================
// 씬별 visualPanels 생성
// ============================================
function generateVisualPanels(sceneNarration, sceneTimestamps) {
  const panels = [];

  // narration.json에 이미 visualPanels가 정의되어 있으면 그것을 기반으로 타이밍만 업데이트
  if (sceneNarration.visualPanels && sceneNarration.visualPanels.length > 0) {
    for (const panel of sceneNarration.visualPanels) {
      const match = findTimestampForPanel(
        panel.text,
        sceneTimestamps.segments || [],
        sceneTimestamps.words || []
      );

      if (match) {
        panels.push({
          text: panel.text,
          startSeconds: match.start,
          endSeconds: match.end,
          startFrame: match.startFrame,
          endFrame: match.endFrame,
          startPercent: Math.round((match.start / sceneTimestamps.duration) * 100),
          endPercent: Math.round((match.end / sceneTimestamps.duration) * 100),
          confidence: match.confidence,
          matchType: match.matchType,
        });
      } else {
        console.log(`   ⚠️ 매칭 실패: "${panel.text.substring(0, 30)}..."`);
        panels.push({
          text: panel.text,
          startPercent: panel.startPercent || 0,
          endPercent: panel.endPercent || 100,
          confidence: 0,
          matchType: "none",
          warning: "타임스탬프 매칭 실패 - 수동 확인 필요",
        });
      }
    }
  } else {
    // visualPanels가 없으면 세그먼트를 기반으로 자동 생성
    console.log(`   ℹ️ visualPanels 없음 - 세그먼트 기반 자동 생성`);

    for (const segment of sceneTimestamps.segments || []) {
      panels.push({
        text: segment.text,
        startSeconds: segment.start,
        endSeconds: segment.end,
        startFrame: segment.startFrame,
        endFrame: segment.endFrame,
        startPercent: Math.round((segment.start / sceneTimestamps.duration) * 100),
        endPercent: Math.round((segment.end / sceneTimestamps.duration) * 100),
        confidence: 1.0,
        matchType: "auto-segment",
      });
    }
  }

  return panels;
}

// ============================================
// 메인 실행
// ============================================
async function main() {
  const visualPanelsOutput = {
    compositionId,
    generatedAt: new Date().toISOString(),
    fps: PROJECT_FPS,
    scenes: [],
  };

  let updatedNarration = { ...narration };
  let hasUpdates = false;

  for (const narrationScene of narration.scenes) {
    if (sceneFilter && !sceneFilter.includes(narrationScene.id)) {
      continue;
    }

    const timestampScene = timestamps.scenes.find(s => s.id === narrationScene.id);
    if (!timestampScene || timestampScene.error) {
      console.log(`⚠️  [${narrationScene.id}] 타임스탬프 없음 - 스킵`);
      continue;
    }

    console.log(`🔄 [${narrationScene.id}] visualPanels 생성 중...`);

    const panels = generateVisualPanels(narrationScene, timestampScene);

    visualPanelsOutput.scenes.push({
      id: narrationScene.id,
      duration: timestampScene.duration,
      durationFrames: timestampScene.durationFrames,
      panels,
    });

    // narration.json 업데이트
    const sceneIndex = updatedNarration.scenes.findIndex(s => s.id === narrationScene.id);
    if (sceneIndex !== -1) {
      updatedNarration.scenes[sceneIndex].visualPanels = panels.map(p => ({
        text: p.text,
        startPercent: p.startPercent,
        endPercent: p.endPercent,
        startFrame: p.startFrame,
        endFrame: p.endFrame,
      }));
      hasUpdates = true;
    }

    console.log(`✅ [${narrationScene.id}] ${panels.length}개 패널 생성`);

    // 패널 미리보기
    for (const panel of panels) {
      const status = panel.confidence > 0.8 ? "✅" : panel.confidence > 0.5 ? "⚠️" : "❌";
      console.log(`   ${status} "${panel.text.substring(0, 30)}..." → ${panel.startPercent}%-${panel.endPercent}% (${panel.matchType})`);
    }
    console.log("");
  }

  if (dryRun) {
    console.log("🔍 Dry run 모드 - 파일이 저장되지 않았습니다.");
    console.log("\n📋 생성될 visualPanels 미리보기:");
    console.log(JSON.stringify(visualPanelsOutput, null, 2));
    return;
  }

  // visual-panels.json 저장
  const visualPanelsPath = path.join(projectRoot, "projects", compositionId, "visual-panels.json");
  fs.writeFileSync(visualPanelsPath, JSON.stringify(visualPanelsOutput, null, 2));
  console.log(`📊 visual-panels.json 저장: ${visualPanelsPath}`);

  // narration.json 업데이트
  if (hasUpdates) {
    fs.writeFileSync(narrationPath, JSON.stringify(updatedNarration, null, 2));
    console.log(`📝 narration.json 업데이트: ${narrationPath}`);
  }

  console.log("\n✅ 완료!");
  console.log("\n💡 다음 단계:");
  console.log(`   1. visual-panels.json 검토 및 필요시 수동 조정`);
  console.log(`   2. 비디오 컴포지션에서 visualPanels 사용`);
}

main().catch(console.error);
