# Script Reference

모든 영상 제작 스크립트의 사용법, 입출력, 의존성 정리.

## TTS & Audio

### generate-tts.mjs
TTS 오디오 생성 (자동: 검증 + 동기화 + 타임스탬프 추출)

```bash
# 기본 사용법
node scripts/generate-tts.mjs -f ../projects/{id}/narration.json

# ElevenLabs (고품질)
node scripts/generate-tts.mjs -f ../projects/{id}/narration.json --elevenlabs

# 특정 씬만 재생성
node scripts/generate-tts.mjs -f ../projects/{id}/narration.json --scene hook,discovery

# 옵션 비활성화
--no-sync        # constants.ts 동기화 건너뛰기
--no-validate    # 품질 검증 건너뛰기
--no-timestamps  # 타임스탬프 추출 건너뛰기
```

- **입력**: `projects/{id}/narration.json`
- **출력**: `public/videos/{id}/audio/{sceneId}.mp3`, `audio-metadata.json`, `timestamps.json`
- **자동 실행**: 품질 검증 → constants.ts SCENE_FRAMES 동기화 → Whisper 타임스탬프
- **의존성**: OpenAI API key (`.env`의 `OPENAI_API_KEY`) 또는 ElevenLabs key

### sync-durations.mjs
오디오 duration을 constants.ts에 동기화

```bash
node scripts/sync-durations.mjs public/videos/{id}/audio/audio-metadata.json
```

- **입력**: `audio-metadata.json`
- **출력**: `src/videos/{id}/constants.ts` (SCENE_FRAMES 업데이트)
- **참고**: `generate-tts.mjs`가 자동 호출하므로 수동 실행은 필요 시에만

### extract-timestamps.mjs
Whisper로 타임스탬프 추출

```bash
node scripts/extract-timestamps.mjs {id}
```

- **입력**: `public/videos/{id}/audio/*.mp3`
- **출력**: `public/videos/{id}/audio/timestamps.json`
- **참고**: `generate-tts.mjs`가 자동 호출

### normalize-audio.mjs
오디오 볼륨 정규화

```bash
node scripts/normalize-audio.mjs public/videos/{id}/audio/
```

### cleanup-audio.mjs
미사용 오디오 파일 감지/삭제

```bash
node scripts/cleanup-audio.mjs
```

## AI Assets

### generate-ai-assets.mjs
fal.ai로 AI 배경 이미지/비디오 생성

```bash
# 기본 (이미지)
node scripts/generate-ai-assets.mjs {id}

# 드라이런 (API 호출 없이 프롬프트만 확인)
node scripts/generate-ai-assets.mjs {id} --dry-run

# 특정 씬만
node scripts/generate-ai-assets.mjs {id} --scenes hook,discovery

# 비디오 타입
node scripts/generate-ai-assets.mjs {id} --type video

# Provider 선택
node scripts/generate-ai-assets.mjs {id} --provider fal|kie

# 배경 음악 포함
node scripts/generate-ai-assets.mjs {id} --music
```

- **입력**: `projects/{id}/narration.json` (visual_description 필드)
- **출력**: `public/videos/{id}/ai-assets/{sceneId}-bg.jpg` (또는 `.mp4`)
- **의존성**: `.env`의 `FAL_KEY`
- **전제조건**: narration.json에 `visual_description` 필드 필요

## Visual Panels

### generate-visual-panels.mjs
타임스탬프 기반 비주얼 패널 타이밍 자동 생성

```bash
node scripts/generate-visual-panels.mjs {id}
```

- **입력**: `public/videos/{id}/audio/timestamps.json`, `projects/{id}/narration.json`
- **출력**: `projects/{id}/visual-panels.json`

## Narration & Quality

### analyze-narration.mjs
나레이션 품질 분석

```bash
node scripts/analyze-narration.mjs -f projects/{id}/narration.json --verbose
```

- **출력 메트릭**: Engagement Score, Hook Strength, Cognitive Load, Narrative Arc, Rhythm Score

### generate-captions.mjs
자막 생성 (선택)

```bash
node scripts/generate-captions.mjs -f projects/{id}/narration.json
```

- **출력**: `projects/{id}/captions/video.srt`, `video.vtt`, `timing-data.json`

## Composition & Validation

### validate-composition.mjs
컴포지션 검증 (씬 duration vs 오디오, 참조 파일 존재 등)

```bash
node scripts/validate-composition.mjs {id}
```

### lint-video-styles.mjs
스타일 린트 (폰트 크기, 색상 대비, 디자인 시스템 준수)

```bash
node scripts/lint-video-styles.mjs src/videos/{id}/
```

### estimate-render-time.mjs
렌더링 시간 추정

```bash
node scripts/estimate-render-time.mjs {id}
```

## Rendering

### render-quality.mjs
품질 프리셋 기반 렌더링

```bash
# Draft (빠른 프리뷰)
node scripts/render-quality.mjs {id} --preset draft

# Standard (YouTube)
node scripts/render-quality.mjs {id} --preset standard

# Premium (편집용 마스터)
node scripts/render-quality.mjs {id} --preset premium
```

| Preset | Resolution | CRF | Codec | 용도 |
|--------|-----------|-----|-------|------|
| draft | 50% scale | 28 | h264 | 빠른 확인 |
| standard | Full | 18 | h264 | YouTube 업로드 |
| premium | Full | 10 | ProRes | 편집/보관용 |

수동 렌더링:
```bash
npx remotion render {id} out/video.mp4
```

### verify-render-quality.mjs
렌더링 결과 품질 검증

```bash
node scripts/verify-render-quality.mjs out/video.mp4
```

## YouTube & Publishing

### generate-youtube-assets.mjs
YouTube 메타데이터 자동 생성

```bash
node scripts/generate-youtube-assets.mjs {id}
```

- **입력**: `projects/{id}/narration.json`
- **출력**: `projects/{id}/youtube/metadata.json`, `description.txt`
- **타이밍**: 렌더링 완료 직후 즉시 실행 (사용자 요청 불필요)

### publish-video.mjs
YouTube 업로드

```bash
# 드라이런
node scripts/publish-video.mjs {id} --dry-run

# 실제 업로드
node scripts/publish-video.mjs {id}
```

## Utility

### create-video-from-note.mjs
Obsidian 노트에서 영상 생성 (전체 파이프라인)

```bash
node scripts/create-video-from-note.mjs {noteId}
```

### generate-avatar.mjs
HeyGen AI 아바타 비디오 생성

```bash
node scripts/generate-avatar.mjs {id}
```

### ingest-source.mjs
PDF/DOCX/URL을 Markdown으로 변환

```bash
node scripts/ingest-source.mjs <input> --output projects/{id}/source.md
```

### delete-video.mjs
영상 컴포지션 삭제

```bash
# 프리뷰
node scripts/delete-video.mjs {id}

# 실제 삭제
node scripts/delete-video.mjs {id} --confirm
```

- **삭제 대상**: `src/videos/{id}/`, `public/videos/{id}/`, `projects/{id}/`
- **보호 대상**: `src/shared/`, `src/demos/`, `src/Root.tsx`, `scripts/`
- **주의**: 삭제 후 `src/Root.tsx`에서 import와 `<Composition>` 수동 제거 필요
