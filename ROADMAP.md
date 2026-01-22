# Remotion Studio 개발 로드맵

**Status**: ✅ Phase 1-6 Complete
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

---

## 🚀 Next Phases (TODO)

### Phase 7: Multi-Source Support
- [ ] 통합 ContentSource 인터페이스 설계
- [ ] PDF 파서 구현 (pdf-parse)
- [ ] DOCX 파서 구현 (mammoth)
- [ ] Web/Blog 파서 구현 (cheerio)

### Phase 8: Multi-Language Support
- [ ] 번역 파이프라인 설계
- [ ] DeepL/OpenAI 번역 API 연동
- [ ] 다국어 TTS 지원 (ElevenLabs multilingual)
- [ ] `--lang` CLI 옵션 추가

### Phase 9: YouTube Optimization
- [ ] 썸네일 자동 생성 (첫 프레임 기반)
- [ ] 챕터 타임스탬프 생성
- [ ] 메타데이터 (제목/설명/태그) 생성
- [ ] End Screen 템플릿
- [ ] 4K 렌더링 옵션

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
│   ├── sources/         # (TODO) 다중 소스 파서
│   └── __tests__/       # 테스트
├── scripts/             # CLI 스크립트
├── public/audio/        # TTS 오디오
├── CLAUDE.md            # 프로젝트 컨텍스트
└── ROADMAP.md           # 이 파일
```

---

## 🔧 Commands

```bash
npm run dev          # Remotion Studio 시작
npm run build        # 번들 빌드
npm run lint         # ESLint + TypeScript 검사
npm run test         # 테스트 실행
npm run test:coverage # 커버리지 리포트

# 영상 생성
node scripts/create-video-from-note.mjs <noteId>
node scripts/generate-tts.mjs
npx remotion render <compositionId> out/video.mp4
```

---

## 📚 References

- **Vault**: `/mnt/c/Users/SaintEoh/Documents/SecondBrain`
- **GitHub**: https://github.com/eohjun/remotion-studio
