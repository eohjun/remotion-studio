# Remotion Studio 개발 로드맵

**Status**: ✅ Phase 1-9 Complete
**Created**: 2026-01-23
**Last Updated**: 2026-01-23

---

## 📋 Project Vision

Obsidian 노트 기반 프로그래매틱 영상 제작 시스템 - 노트에서 고품질 영상까지의 완전 자동화된 파이프라인

### 확장 목표 (2026-01-23 추가)
- **다양한 콘텐츠 소스**: Obsidian, PDF, DOCX, 블로그/웹 URL
- **다국어 지원**: 한글 소스 → 영어 영상 생성
- **YouTube 최적화**: 썸네일, 챕터, 메타데이터 자동 생성

---

## ✅ Completed Phases

### Phase 1: Foundation - 공통 컴포넌트 추출
- `src/components/` - TitleCard, ComparisonLayout, HighlightBox, QuoteCard, ChecklistDisplay
- `src/components/constants.ts` - 통합 COLORS, GRADIENTS, FONTS, SPACING
- 기존 씬 리팩토링 (35-78% 코드 감소)

### Phase 2: Animation System
- `src/hooks/useSceneFrame.ts` - 씬 프레임 계산 훅
- `src/utils/timing.ts` - 프레임/초 변환, 타이밍 프리셋
- `SPRING_PRESETS` - subtle, moderate, snappy, energetic, bouncy

### Phase 3: Scene Templates
- `src/templates/scenes/` - 5개 재사용 템플릿
  - IntroTemplate, ContentTemplate, ComparisonTemplate, QuoteTemplate, OutroTemplate

### Phase 4: Configuration System
- `src/config/schema.ts` - Zod 스키마
- `src/config/timing.ts` - 씬 타이밍 자동 계산
- `src/config/validate.ts` - 설정 검증 유틸리티

### Phase 5: Obsidian Integration
- `src/obsidian/parser.ts` - Markdown 파서
- `src/obsidian/loader.ts` - 볼트/노트 로더
- `src/obsidian/narration.ts` - 나레이션 생성
- `scripts/create-video-from-note.mjs` - CLI 스크립트

### Phase 6: Testing & Polish
- Vitest 설정
- 35개 테스트 (timing, config, parser)
- `npm run test` / `npm run test:coverage`

### Phase 7: Multi-Source Support ✅ (2026-01-23)
- `src/sources/types.ts` - ContentSource, SourceParser 인터페이스
- `src/sources/base.ts` - 공통 유틸리티 (ID 생성, 섹션 추출)
- `src/sources/pdf/parser.ts` - PDF 파서 (pdf-parse)
- `src/sources/docx/parser.ts` - DOCX 파서 (mammoth)
- `src/sources/web/parser.ts` - 웹 페이지 파서 (cheerio)
- `src/sources/factory.ts` - 소스 자동 감지 팩토리
- CLI 업데이트: `--source` 옵션 추가

### Phase 8: Multi-Language Support ✅ (2026-01-23)
- `src/i18n/types.ts` - 언어 타입, TranslationProvider 인터페이스
- `src/i18n/detector.ts` - 언어 자동 감지 (ko/en/ja/zh)
- `src/i18n/providers/openai.ts` - OpenAI 번역 프로바이더
- `src/i18n/providers/deepl.ts` - DeepL 번역 프로바이더
- `src/i18n/translator.ts` - 고수준 번역 유틸리티
- `src/i18n/tts/voices.ts` - 언어별 TTS 음성 설정
- TTS 스크립트 업데이트: `--lang`, `--translate` 옵션

### Phase 9: YouTube Optimization ✅ (2026-01-23)
- `src/youtube/types.ts` - YouTubeChapter, YouTubeMetadata, RenderPreset 타입
- `src/youtube/chapters.ts` - 씬 타이밍 기반 챕터 생성
- `src/youtube/metadata.ts` - 제목/설명/태그 자동 생성
- `src/youtube/thumbnail.ts` - 썸네일 커맨드 생성
- `src/youtube/render-presets.ts` - 1080p/1440p/4K 렌더링 프리셋
- `src/youtube/templates/endscreen-default.tsx` - 엔드스크린 컴포넌트
- `scripts/generate-youtube-assets.mjs` - YouTube 에셋 생성 CLI

---

## 📁 Project Structure

```
remotion-studio/
├── src/
│   ├── components/      # 재사용 컴포넌트
│   ├── templates/       # 애니메이션 & 씬 템플릿
│   ├── config/          # Zod 스키마 & 검증
│   ├── hooks/           # 커스텀 훅
│   ├── utils/           # 유틸리티 함수
│   ├── obsidian/        # Obsidian 연동
│   ├── sources/         # 다중 소스 파서 (PDF, DOCX, Web)
│   ├── i18n/            # 다국어 지원 (번역, TTS)
│   ├── youtube/         # YouTube 최적화
│   └── __tests__/       # 테스트
├── scripts/             # CLI 스크립트
├── public/audio/        # TTS 오디오
├── CLAUDE.md            # 프로젝트 컨텍스트
└── ROADMAP.md           # 이 파일
```

---

## 🔧 Commands

```bash
# 개발
npm run dev          # Remotion Studio 시작
npm run build        # 번들 빌드
npm run lint         # ESLint + TypeScript 검사
npm run test         # 테스트 실행
npm run test:coverage # 커버리지 리포트

# 영상 생성 (Obsidian 노트)
node scripts/create-video-from-note.mjs <noteId>

# 다중 소스 영상 생성 (Phase 7)
node scripts/create-video-from-note.mjs --source ./docs/sample.pdf
node scripts/create-video-from-note.mjs --source ./docs/sample.docx
node scripts/create-video-from-note.mjs --source https://blog.example.com/post

# 다국어 TTS (Phase 8)
node scripts/generate-tts.mjs                      # 기본 (한국어)
node scripts/generate-tts.mjs --lang en            # 영어 음성
node scripts/generate-tts.mjs --lang en --translate # 번역 후 영어 음성

# YouTube 에셋 (Phase 9)
node scripts/generate-youtube-assets.mjs <compositionId> --output ./youtube/
node scripts/generate-youtube-assets.mjs <compositionId> --preset 4k --thumbnail

# 렌더링
npx remotion render <compositionId> out/video.mp4
npx remotion render <compositionId> out/video-4k.mp4 --width=3840 --height=2160 --codec=h265
```

---

## 📦 Dependencies Added (Phase 7-9)

```json
{
  "dependencies": {
    "pdf-parse": "^1.x",
    "mammoth": "^1.x",
    "cheerio": "^1.x"
  }
}
```

## 🔑 Environment Variables

```bash
# .env
OPENAI_API_KEY=sk-...        # TTS, 번역
ELEVENLABS_API_KEY=...       # 고품질 TTS
DEEPL_API_KEY=...            # 고품질 번역 (선택)
```

---

## 📚 References

- **Vault**: `/mnt/c/Users/SaintEoh/Documents/SecondBrain`
- **GitHub**: https://github.com/eohjun/remotion-studio
