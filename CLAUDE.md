# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Remotion Studio preview
npm run build        # Bundle the project
npm run lint         # Run ESLint and TypeScript checking (eslint src && tsc)
npx remotion render  # Render a video (e.g., npx remotion render HelloWorld out/video.mp4)
npx remotion upgrade # Upgrade Remotion to latest version
```

## Architecture

This is a Remotion project for creating programmatic videos using React components.

### Project Structure

```
src/
├── shared/              # 🔒 Shared code (NEVER delete)
│   ├── components/      # Reusable UI components
│   ├── templates/       # Scene templates (animations, presets)
│   ├── audio/           # Audio system components
│   ├── transitions/     # Transition effects
│   ├── styles/          # Global styles, fonts
│   └── config/          # Configuration
├── videos/              # 🎬 Per-video compositions (can delete individually)
│   ├── SelfHelpCritiqueEN/
│   └── SelfHelpCritiqueFull/
├── demos/               # Demo compositions
├── HelloWorld/          # Example composition
├── Root.tsx             # Main composition registry
└── index.ts             # Entry point

public/videos/           # 🔊 Audio files per composition
├── SelfHelpCritiqueEN/
│   └── audio/           # MP3 files for this video
└── SelfHelpCritiqueFull/
    └── audio/           # MP3 files for this video

projects/                # 📁 Project assets per composition
├── SelfHelpCritiqueEN/
│   ├── narration.json   # TTS source text
│   ├── youtube/         # Thumbnails, descriptions
│   └── output/          # Rendered videos
└── SelfHelpCritiqueFull/
    └── ...
```

### Entry Points
- `src/index.ts` - Application entry, registers `RemotionRoot` with Remotion
- `src/Root.tsx` - Defines all `<Composition>` entries (each appears in Studio sidebar)
- `remotion.config.ts` - Remotion CLI configuration (image format, overwrite settings)

### Composition Structure
Each video is a `<Composition>` in `Root.tsx` with:
- `id` - Used for rendering: `npx remotion render <id>`
- `component` - React component that renders the video
- `schema` - Zod schema for props (enables parametrized rendering)
- `defaultProps` - Default values matching the schema

### Animation Patterns
- Use `useCurrentFrame()` and `useVideoConfig()` hooks for frame-based animation
- `spring()` - Physics-based animations with configurable damping/mass
- `interpolate()` - Map frame numbers to values with extrapolation control
- `<Sequence from={N}>` - Delay child rendering until frame N
- `<AbsoluteFill>` - Full-size absolutely positioned container

### Props Validation
Props are validated using Zod schemas with `@remotion/zod-types` for Remotion-specific types like `zColor()`.

## Obsidian Vault Integration

### Vault Location
- **Path**: `/mnt/c/Users/SaintEoh/Documents/SecondBrain`
- **Zettelkasten**: `04_Zettelkasten/` - 영구 노트 저장 위치

### Video Creation from Notes
노트 기반 영상 제작 시:
1. **메인 노트 읽기**: `04_Zettelkasten/{노트ID} {노트제목}.md`
2. **연결 노트 파싱**: `[[노트ID 노트제목]]` 형식 추출
3. **연결 노트 읽기**: 관련 컨텍스트 수집
4. **통합 나레이션 작성**: 메인 + 연결 노트 내용으로 풍성한 스크립트 구성

### Note Structure
```
---
id: 202601160105
created: '2026-01-16 01:05'
type: permanent
---
# 노트 제목

## 핵심 아이디어
## 상세 설명
## 연결된 생각
## 적용 예시
## 참고 자료
### 🔗 연결된 노트
```

### Audio/TTS Generation

**기본 사용법:**
```bash
# TTS 생성 (자동: 검증 + 동기화 + 타임스탬프 추출)
node scripts/generate-tts.mjs -f ../projects/{compositionId}/narration.json

# 특정 씬만 재생성
node scripts/generate-tts.mjs -f ../projects/{compositionId}/narration.json --scene hook,discovery

# ElevenLabs 사용
node scripts/generate-tts.mjs -f ../projects/{compositionId}/narration.json --elevenlabs
```

**자동화 파이프라인 (generate-tts.mjs 실행 시):**
1. TTS 오디오 생성 (OpenAI/ElevenLabs)
2. 오디오 품질 검증 (비정상 길이/속도 감지)
3. constants.ts 자동 동기화 (SCENE_FRAMES 업데이트)
4. **Whisper 타임스탬프 추출** → timestamps.json 생성

**비활성화 옵션:**
- `--no-sync` - constants.ts 동기화 건너뛰기
- `--no-validate` - 품질 검증 건너뛰기
- `--no-timestamps` - 타임스탬프 추출 건너뛰기

### visualPanels 타이밍 (오디오-비주얼 동기화)

**문제**: 나레이션의 어떤 문장이 언제 시작/끝나는지 모르면 화면 타이밍이 맞지 않음

**해결책 - 타임스탬프 기반 자동화:**
```bash
# 1. TTS 생성 시 timestamps.json 자동 생성됨

# 2. visualPanels 자동 생성
node scripts/generate-visual-panels.mjs {compositionId}

# 3. 결과 확인
cat projects/{compositionId}/visual-panels.json
```

**출력 예시 (visual-panels.json):**
```json
{
  "scenes": [{
    "id": "hook",
    "panels": [
      { "text": "1920년대 비엔나", "startFrame": 0, "endFrame": 85 },
      { "text": "웨이터가 수십 개의 주문을...", "startFrame": 170, "endFrame": 320 }
    ]
  }]
}
```

**컴포지션에서 사용:**
```tsx
import visualPanels from "../../../projects/{compositionId}/visual-panels.json";

const panels = visualPanels.scenes.find(s => s.id === "hook")?.panels || [];
```

**⚠️ 중요 규칙:**
- `[pause:X]` 마커는 **문서화 전용** (TTS에 전송 안 됨)
- 버퍼는 **5프레임** (0.17초) - 과도하면 공백 누적
- snake_case (audio) → camelCase (constants) 자동 변환

**Audio file structure**: `public/videos/{compositionId}/audio/`
- audio-metadata.json: 씬별 길이 정보
- timestamps.json: Whisper 타임스탬프 (세그먼트/단어별)

**Audio cleanup**: `node scripts/cleanup-audio.mjs` - 미사용 오디오 파일 감지/삭제

### AI Asset Generation (fal.ai)

**환경 설정**: `.env`에 `FAL_KEY` 필요
```bash
FAL_KEY=your-fal-ai-api-key
```

**사용법:**
```bash
# AI 배경 이미지 생성 (narration.json의 visual_description 사용)
node scripts/generate-ai-assets.mjs {compositionId}

# 드라이런 (API 호출 없이 프롬프트만 확인)
node scripts/generate-ai-assets.mjs {compositionId} --dry-run

# 특정 씬만 생성
node scripts/generate-ai-assets.mjs {compositionId} --scenes hook,discovery

# 비디오 타입으로 생성
node scripts/generate-ai-assets.mjs {compositionId} --type video
```

**전제 조건**: `projects/{compositionId}/narration.json`의 씬에 `visual_description` 필드 필요
- `visual_description`: 영어로 작성된 구체적 이미지 묘사 (fal.ai 프롬프트)
- `visualCue`와 별개 - `visualCue`는 인간용, `visual_description`은 AI 모델용

**출력 경로**: `public/videos/{compositionId}/ai-assets/`
- `{sceneId}.jpg` - 이미지 (기본)
- `{sceneId}.mp4` - 비디오 (`--type video` 사용 시)

**기본 모델**: fal.ai flux/schnell (빠른 이미지 생성)

**컴포넌트 사용:**
- `AIImage` (`@shared/components/media`) - AI 이미지 표시 + fallback
- `AIVideo` (`@shared/components/media`) - AI 비디오 표시 + fallback
- `OfficialLightLeak` (`@shared/components/effects`) - @remotion/light-leaks WebGL 효과

**DreamBackground 패턴** (LucidDream 참조):
```tsx
<AbsoluteFill>
  <AIImage src={`/videos/${id}/ai-assets/${sceneId}.jpg`} fallbackColor="#1a1a2e" />
  <AbsoluteFill style={{
    background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)"
  }} />
  {/* Scene content on top */}
</AbsoluteFill>
```

### Video Management Scripts

```bash
# Delete a video composition (dry run - preview only)
node scripts/delete-video.mjs <compositionId>

# Delete a video composition (actually delete)
node scripts/delete-video.mjs <compositionId> --confirm

# Example
node scripts/delete-video.mjs SelfHelpCritiqueEN --confirm
```

**What gets deleted**:
- `src/videos/{compositionId}/` - Source code
- `public/videos/{compositionId}/` - Audio files
- `projects/{compositionId}/` - Narration, youtube assets, output

**What's PROTECTED** (never deleted):
- `src/shared/`, `src/demos/`, `src/Root.tsx`
- `scripts/`, `node_modules/`, `.git/`

**After deletion**: Manually remove import and `<Composition>` entry from `src/Root.tsx`

## Video Production Agent System

This project includes a multi-agent pipeline for automated video production.

### ⚠️ Custom Agent 호출 방법 (중요)

`.claude/agents/` 디렉토리의 커스텀 에이전트는 **Task tool로 호출할 수 없습니다**.

**올바른 호출 방식:**
```
"video-researcher 에이전트를 사용해서 이 주제를 조사해줘"
"Use the video-narrator agent to write narration from this research"
"video-planner 에이전트로 시각 계획을 세워줘"
```

**잘못된 호출 (실패함):**
```
Task tool의 subagent_type에 "video-researcher" 지정 → Agent type not found 에러
```

Task tool은 built-in 타입만 지원합니다 (Bash, Explore, Plan, general-purpose 등).
커스텀 에이전트는 명시적 요청이나 자동 위임으로 동작합니다.

### Agents (`.claude/agents/`)

| Agent | Purpose | Trigger |
|-------|---------|---------|
| **video-ingestor** | PDF, DOCX, URL을 Markdown으로 변환 | "Ingest this PDF for video" |
| **video-researcher** | Analyzes source, conducts web research, enriches content | "Research this topic for a video" |
| **video-narrator** | Creates structured narration scripts with storytelling principles | "Write narration from this research" |
| **video-planner** | Selects optimal templates, components, effects | "Plan visuals for this narration" |
| **video-producer** | Master orchestrator that chains all agents | "Create a video from this source" |
| **video-publisher** | Metadata 생성 및 YouTube 업로드 | "Publish this video" |

### Quick Start

```bash
# Create video from any source (delegates to all agents):
"Create a video from note 202601150123"
"Create a video about the psychology of habit formation"
"Create a video from this article: https://..."
```

### Pipeline Flow

```
Source (PDF/DOCX/URL/Topic)
        ↓
video-ingestor → source.md (optional, for non-text sources)
        ↓
video-researcher → research-report.md
        ↓
video-narrator → narration.json
        ↓
video-planner → video-plan.json
        ↓
video-producer → Remotion composition
        ↓
generate-tts.mjs → Audio files + 자동 검증 + constants.ts 자동 동기화
        ↓
npm run dev → 완성본 테스트 가능
        ↓
User Review (수정 요청 시 반복)
        ↓
npx remotion render → video.mp4
        ↓
video-publisher → YouTube upload (optional)
```

**중요**: TTS 생성 전에 사용자 확인을 요청하지 않습니다.
영상은 오디오가 포함된 완성 상태로 제공해야 제대로 된 검토가 가능합니다.

### Reference Documents

- `docs/component-catalog.md` - Component reference (50+ components)
- `docs/visual-strategy-guide.md` - Topic-to-visual mapping
- `projects/templates/video-plan.md` - Manual planning template
