# Remotion Studio

AI 에이전트 기반 프로그래매틱 영상 제작 시스템.

주제만 입력하면 리서치부터 나레이션, AI 이미지 생성, 시각 기획, Remotion 컴포지션 구현까지 전 과정을 자동화합니다. 25개 컴포넌트 카테고리, 16개 씬 템플릿, 29개 트랜지션 프리셋으로 일관된 품질의 영상을 빠르게 제작할 수 있습니다.

## Features

- **AI 에이전트 파이프라인**: 6단계 영상 제작 자동화
  - `video-ingestor`: PDF/DOCX/URL 소스 변환
  - `video-researcher`: 주제 조사 및 리서치 리포트 생성
  - `video-narrator`: 나레이션 스크립트 작성 (TTS 최적화)
  - `video-planner`: 시각 전략 및 씬 구성 기획
  - `video-producer`: Remotion 컴포지션 구현
  - `video-publisher`: YouTube SEO 최적화 및 업로드
- **fal.ai AI 이미지 생성**: `visual_description` 기반 씬별 배경 이미지 자동 생성
- **컴포넌트 라이브러리**: 배경, 이펙트, 차트, 메타포, 레이아웃, 캡션, 미디어 등 25개 카테고리
- **16개 씬 템플릿**: Intro, Content, Quote, News, Timeline, DataVisualization 등
- **29개 트랜지션 프리셋**: 커스텀 트랜지션 + 오버레이 프리셋
- **TTS 통합**: OpenAI / ElevenLabs TTS 자동 생성 + Whisper 타임스탬프
- **오디오 동기화**: 오디오 길이 기반 constants.ts 자동 동기화
- **성능 최적화**: GPU 가속, `@remotion/shapes`, `@remotion/paths` 하드웨어 가속

## Quick Start

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 린트 검사
npm run lint

# 영상 렌더링
node scripts/render-quality.mjs <CompositionId> --preset standard
```

## Project Structure

```
remotion-studio/
├── .claude/agents/           # AI 에이전트 정의
│   ├── video-ingestor.md
│   ├── video-researcher.md
│   ├── video-narrator.md
│   ├── video-planner.md
│   ├── video-producer.md
│   └── video-publisher.md
│
├── src/
│   ├── shared/               # 공유 컴포넌트 (삭제 금지)
│   │   ├── components/
│   │   │   ├── backgrounds/  # AnimatedGradient, ParticleField, FloatingShapes
│   │   │   ├── effects/      # Vignette, FilmGrain, LightLeak, OfficialLightLeak
│   │   │   ├── captions/     # AnimatedCaption (@remotion/captions)
│   │   │   ├── media/        # AIImage, AIVideo (fal.ai)
│   │   │   ├── charts/       # BarChart, LineChart, PieChart
│   │   │   ├── metaphors/    # BreathingCircle, FlowingWaves, LayeredMind
│   │   │   ├── layouts/      # Stack, Grid, Split, ComparisonLayout
│   │   │   └── ...           # shapes, paths, icons, diagrams 등
│   │   ├── ai/               # fal.ai 클라이언트
│   │   ├── templates/
│   │   │   ├── scenes/       # 16개 씬 템플릿
│   │   │   └── animations/   # AnimatedText, TypewriterText, CaptionText
│   │   ├── transitions/      # 씬 전환 + 오버레이 프리셋
│   │   ├── hooks/            # useResponsive, useSceneFrame
│   │   ├── audio/            # AudioLayer, BackgroundMusic, SoundEffect
│   │   └── styles/           # typography
│   │
│   ├── videos/               # 영상별 컴포지션 (개별 삭제 가능)
│   └── Root.tsx              # Composition 등록
│
├── projects/                 # 프로젝트별 에셋
│   └── {compositionId}/
│       ├── narration.json    # TTS 소스 텍스트
│       ├── visual-panels.json
│       └── youtube/          # 썸네일, 설명, 메타데이터
│
├── public/videos/            # 오디오 및 AI 에셋
│   └── {compositionId}/
│       ├── audio/            # MP3, timestamps.json
│       └── ai-assets/        # fal.ai 생성 이미지
│
├── scripts/                  # 유틸리티 스크립트
│   ├── generate-tts.mjs      # TTS 생성 + 검증 + 동기화
│   ├── generate-ai-assets.mjs # fal.ai AI 이미지 생성
│   ├── render-quality.mjs    # 품질 프리셋별 렌더링
│   ├── generate-visual-panels.mjs
│   ├── generate-youtube-assets.mjs
│   ├── validate-composition.mjs
│   ├── cleanup-audio.mjs
│   └── delete-video.mjs
│
└── docs/
    ├── component-catalog.md
    └── visual-strategy-guide.md
```

## Video Production Pipeline

```
Source (PDF/DOCX/URL/Topic/Obsidian Note)
        ↓
video-ingestor → source.md (optional)
        ↓
video-researcher → research-report.md
        ↓
video-narrator → narration.json (visual_description 포함)
        ↓
generate-ai-assets.mjs → ai-assets/*.jpg (fal.ai)
        ↓
video-planner → video-plan.json
        ↓
video-producer → Remotion 컴포지션
        ↓
generate-tts.mjs → 오디오 + 타임스탬프 + constants.ts 동기화
        ↓
npm run dev → 프리뷰 확인
        ↓
render-quality.mjs → video.mp4
        ↓
video-publisher → YouTube 업로드 (optional)
```

## Scripts

### TTS 생성

```bash
# OpenAI TTS (기본) - 자동으로 검증 + constants.ts 동기화 + 타임스탬프 추출
node scripts/generate-tts.mjs -f projects/{compositionId}/narration.json

# ElevenLabs TTS
node scripts/generate-tts.mjs -f projects/{compositionId}/narration.json --elevenlabs

# 특정 씬만 재생성
node scripts/generate-tts.mjs -f projects/{compositionId}/narration.json --scene hook,outro
```

### AI 이미지 생성 (fal.ai)

```bash
# narration.json의 visual_description으로 배경 이미지 생성
node scripts/generate-ai-assets.mjs {compositionId}

# 드라이런 (생성 없이 프롬프트만 확인)
node scripts/generate-ai-assets.mjs {compositionId} --dry-run
```

### 렌더링

```bash
# 표준 품질 (H.264, CRF 18)
node scripts/render-quality.mjs {compositionId} --preset standard

# 고품질
node scripts/render-quality.mjs {compositionId} --preset high
```

### 관리

```bash
# 비디오 삭제 (미리보기)
node scripts/delete-video.mjs {compositionId}

# 비디오 삭제 (실행)
node scripts/delete-video.mjs {compositionId} --confirm

# 미사용 오디오 정리
node scripts/cleanup-audio.mjs
```

## Compositions

| ID | 설명 | 언어 |
|----|------|------|
| AIAgents | AI 에이전트의 부상 (2026) | English |
| LucidDream | 루시드 드림 가이드 | 한국어 |
| IdeaToReality | 아이디어를 현실로 | 한국어 |
| AIBasicLawKR | AI 기본법 해설 | 한국어 |
| OpenAICrisis | OpenAI 위기 분석 | 한국어 |
| PomodoroTechnique | 뽀모도로 테크닉 | 한국어 |
| TwoMinuteRule | 2분 법칙 | 한국어 |
| ZeigarnikEffect | 자이가르닉 효과 | 한국어 |
| ParkinsonsLaw | 파킨슨의 법칙 | 한국어 |
| ProcrastinationPsychology | 미루기의 심리학 | 한국어 |
| PositiveThinkingTrap | 긍정사고의 함정 | 한국어 |
| StressManagementCycle | 스트레스 관리 사이클 | 한국어 |
| ProcessAndInterbeing | 과정과 상호존재 | 한국어 |
| DevCompetencyComparison | 개발자 역량 비교 | 한국어 |
| MindfulnessPhenomenology | 마음챙김과 현상학 | English |
| SelfHelpCritiqueEN | 자기계발서 비판 (요약) | English |
| SelfHelpCritiqueFull | 자기계발서 비판 (풀버전) | English |

## Environment Variables

`.env` 파일에 API 키 설정:

```env
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
FAL_KEY=your_fal_ai_key
```

## Tech Stack

- **Remotion** 4.0.419 - React 기반 프로그래매틱 비디오
- **@remotion/captions** - 워드 레벨 애니메이션 자막
- **@remotion/light-leaks** - WebGL 라이트 리크 이펙트
- **@remotion/shapes, @remotion/paths** - 하드웨어 가속 도형/경로
- **@fal-ai/client** - AI 이미지/비디오 생성
- **React 19** + **TypeScript**
- **Zod** - Props 스키마 검증

## Documentation

- [Component Catalog](docs/component-catalog.md) - 컴포넌트 카탈로그
- [Visual Strategy Guide](docs/visual-strategy-guide.md) - 시각 전략 가이드
- [MCP Setup Guide](docs/MCP_SETUP_GUIDE.md) - MCP 서버 설정 가이드

## License

See [Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
