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
- API keys are stored in `.env` file (copy from `.env.example`)
- Generate narration audio:
  - `node scripts/generate-tts.mjs -f ../projects/{compositionId}/narration.json` - OpenAI 사용
  - Add `--elevenlabs` flag for ElevenLabs
- **Audio file structure**: `public/videos/{compositionId}/audio/`
  - 각 컴포지션별로 폴더 분리
  - narration.json의 `metadata.compositionId`로 자동 결정
- Use `<Audio src={staticFile("videos/{compositionId}/audio/filename.mp3")} />` in compositions
- TTS 설정은 `projects/{compositionId}/narration.json`에서 조정 가능
- **Audio cleanup**: `node scripts/cleanup-audio.mjs` - 미사용 오디오 파일 감지/삭제

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
User Review (승인 필요)
        ↓
generate-tts.mjs → Audio files
        ↓
npx remotion render → video.mp4
        ↓
video-publisher → YouTube upload (optional)
```

### Reference Documents

- `docs/component-catalog.md` - Component reference (50+ components)
- `docs/visual-strategy-guide.md` - Topic-to-visual mapping
- `projects/templates/video-plan.md` - Manual planning template
