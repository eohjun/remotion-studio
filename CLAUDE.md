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
  - `node scripts/generate-tts.mjs` - OpenAI 사용 (기본값)
  - `node scripts/generate-tts.mjs --elevenlabs` - ElevenLabs 사용
- Audio files are saved to `public/audio/`
- Use `<Audio src={staticFile("audio/filename.mp3")} />` in compositions
- TTS 설정은 `scripts/narration.json`에서 조정 가능
