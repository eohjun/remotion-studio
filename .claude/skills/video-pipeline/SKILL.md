---
name: video-pipeline
description: |
  Remotion 영상 제작 파이프라인 오케스트레이터. 사용 시점:
  (1) 영상 제작 요청 ("영상 만들어줘", "Create a video about X", "이 주제로 영상 제작"),
  (2) narration.json 작성/수정,
  (3) TTS/AI 에셋/렌더링 등 파이프라인 스크립트 실행,
  (4) Remotion 컴포지션 구현,
  (5) YouTube 메타데이터 생성.
  Keywords: video, 영상, 제작, render, TTS, narration, composition, remotion, YouTube, pipeline, 렌더링
---

# Video Production Pipeline

영상 제작의 전체 흐름을 8단계로 관리합니다. 각 단계는 순서대로 실행하며, 중간에 건너뛰지 않습니다.

## Pipeline Overview

```
Source → Research → Narration → AI Assets → Composition → TTS → Review → Render → YouTube Assets
```

## 8-Step Pipeline

### Step 1: 소스 분석 (선택)
- **언제**: 주제 리서치가 필요할 때만
- **위임**: video-researcher 에이전트
- **산출물**: `projects/{id}/research-report.md`
- **건너뛰기**: 사용자가 충분한 소스를 제공했거나, Obsidian 노트를 직접 읽을 수 있을 때

### Step 2: 나레이션 작성
- **위임**: video-narrator 에이전트
- **산출물**: `projects/{id}/narration.json`
- **필수 검증**: → See references/narration-schema.md
  - `metadata.compositionId` 존재
  - `metadata.language` = "ko" | "en"
  - 모든 scene에 `text` 필드 (not `narration`, not `content`)
  - `scene.id`가 유효한 파일명
  - 첫 씬 `type: "intro"`

### Step 3: AI 에셋 생성
- **조건**: narration.json에 `visual_description` 필드가 있는 씬이 1개 이상
- **명령어**: `node scripts/generate-ai-assets.mjs {id}`
- **산출물**: `public/videos/{id}/ai-assets/*.jpg`
- **건너뛰기**: `visual_description`이 없는 경우

```bash
# 드라이런 (프롬프트 확인)
node scripts/generate-ai-assets.mjs {id} --dry-run

# 특정 씬만
node scripts/generate-ai-assets.mjs {id} --scenes hook,discovery

# 비디오 타입
node scripts/generate-ai-assets.mjs {id} --type video
```

### Step 4: 컴포지션 구현
- **산출물**: `src/videos/{id}/index.tsx`, `scenes.ts`, `constants.ts`
- **필수 규칙**: → See references/implementation-rules.md
  - AI 에셋 있으면 모든 씬에서 AI 배경 사용
  - FPS 하드코딩 금지 (`useVideoConfig()` 또는 `VIDEO_CONFIG.fps`)
  - 모든 씬 중앙 정렬 (flexbox center)
  - 화면 70-90% 활용
  - `fontFamily` 항상 명시
- **템플릿 선택**: → See references/template-selection.md
- **Root.tsx 등록**: `<Composition>` 추가

### Step 5: TTS + 타임스탬프
- **사용자 확인 없이 바로 실행**
- **명령어**: `node scripts/generate-tts.mjs -f ../projects/{id}/narration.json`
- **자동 실행**: 품질 검증 + constants.ts 동기화 + Whisper 타임스탬프
- **산출물**: `public/videos/{id}/audio/*.mp3`, `timestamps.json`

```bash
# ElevenLabs (고품질)
node scripts/generate-tts.mjs -f ../projects/{id}/narration.json --elevenlabs

# 특정 씬만 재생성
node scripts/generate-tts.mjs -f ../projects/{id}/narration.json --scene hook,discovery
```

**TTS 후 필수 작업**: 하드코딩된 패널 타이밍 → `visual-panels.json` 실제값으로 교체

### Step 6: 검증 + 프리뷰
- **검증**: `node scripts/validate-composition.mjs {id}`
- **프리뷰**: `npm run dev` → Studio에서 확인
- **사용자 피드백 반영**: 나레이션 수정 시 → TTS 재생성, 비주얼 수정 시 → 컴포지션만 수정

### Step 7: 렌더링 (사용자 요청 시)
```bash
# Draft (빠른 프리뷰)
node scripts/render-quality.mjs {id} --preset draft

# Standard (YouTube 업로드용)
node scripts/render-quality.mjs {id} --preset standard

# Premium (편집용 마스터)
node scripts/render-quality.mjs {id} --preset premium

# 수동 렌더링
npx remotion render {id} out/video.mp4
```

### Step 8: YouTube 에셋 (렌더링 직후 필수)
- **렌더링 완료 즉시 자동 실행** — 사용자에게 묻지 않음
- **명령어**: `node scripts/generate-youtube-assets.mjs {id}`
- **산출물**: `projects/{id}/youtube/metadata.json`, `description.txt`

---

## Script Quick Reference

| Script | 용도 | 입력 | 출력 |
|--------|------|------|------|
| `generate-ai-assets.mjs {id}` | AI 배경 이미지 | narration.json | ai-assets/*.jpg |
| `generate-tts.mjs -f ../projects/{id}/narration.json` | TTS 오디오 | narration.json | audio/*.mp3 |
| `generate-visual-panels.mjs {id}` | 비주얼 패널 타이밍 | timestamps.json | visual-panels.json |
| `validate-composition.mjs {id}` | 컴포지션 검증 | src/videos/{id}/ | 검증 결과 |
| `analyze-narration.mjs -f projects/{id}/narration.json` | 나레이션 품질 | narration.json | 품질 점수 |
| `render-quality.mjs {id} --preset standard` | 렌더링 | 컴포지션 | out/video.mp4 |
| `generate-youtube-assets.mjs {id}` | YouTube 메타데이터 | narration.json | youtube/ |
| `sync-durations.mjs` | 오디오 duration 동기화 | audio-metadata.json | constants.ts |
| `cleanup-audio.mjs` | 미사용 오디오 삭제 | audio/ | 삭제 보고 |
| `delete-video.mjs {id} --confirm` | 영상 삭제 | compositionId | 삭제 |

→ See references/script-reference.md for full details.

---

## Pipeline Rules

1. **끊기지 않게 연속 실행**: 각 단계 완료 후 다음 단계를 사용자에게 묻지 말고 바로 진행
2. **AI assets BEFORE implementation**: `visual_description` 있으면 반드시 Step 3 → Step 4 순서
3. **TTS 전 사용자 확인 불필요**: 오디오 포함 완성본으로 제공해야 검토 가능
4. **YouTube 에셋은 렌더링 직후 자동**: `generate-youtube-assets.mjs` 즉시 실행
5. **FPS 하드코딩 금지**: `useVideoConfig()` 또는 `VIDEO_CONFIG.fps` 사용
6. **버퍼는 5프레임**: 씬 duration = 오디오 프레임 + 5프레임 (최대)

## Project Structure

```
projects/{id}/
├── research-report.md      # Step 1 (선택)
├── narration.json          # Step 2
├── visual-panels.json      # Step 5 (자동)
└── youtube/                # Step 8
    ├── metadata.json
    └── description.txt

public/videos/{id}/
├── audio/                  # Step 5
│   ├── intro.mp3
│   ├── hook.mp3
│   ├── audio-metadata.json
│   └── timestamps.json
└── ai-assets/              # Step 3
    ├── intro-bg.jpg
    └── hook-bg.jpg

src/videos/{id}/
├── index.tsx               # Step 4
├── scenes.ts
└── constants.ts
```

## Error Recovery

| 문제 | 해결 |
|------|------|
| TTS 실패 | narration.json 포맷 확인, API 키 확인 |
| AI 에셋 실패 | `.env`의 `FAL_KEY` 확인, `--dry-run`으로 프롬프트 점검 |
| 렌더링 오류 | `npm run lint` 실행, 컴포지션 에러 확인 |
| 씬 타이밍 불일치 | `visual-panels.json` 실제값으로 교체 |
| 화면 오버플로우 | 아이템 수 제한 (카드 4개, 리스트 5개, 불릿 8개) |
