# Remotion Studio

AI 에이전트 기반 프로그래매틱 영상 제작 시스템.

주제만 입력하면 리서치부터 나레이션, 시각 기획, Remotion 컴포지션 구현까지 전 과정을 자동화합니다. 50개 이상의 재사용 가능한 컴포넌트와 템플릿으로 일관된 품질의 영상을 빠르게 제작할 수 있습니다.

## Features

- **AI 에이전트 시스템**: 4단계 영상 제작 파이프라인
  - `video-researcher`: 주제 조사 및 리서치 리포트 생성
  - `video-narrator`: 나레이션 스크립트 작성
  - `video-planner`: 시각 전략 및 씬 구성 기획
  - `video-producer`: Remotion 컴포지션 구현
- **50+ 컴포넌트 라이브러리**: 재사용 가능한 템플릿, 애니메이션, 이펙트
- **TTS 통합**: OpenAI / ElevenLabs TTS 자동 생성
- **오디오 동기화**: 오디오 길이 기반 씬 타이밍 자동 설정

## Quick Start

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 린트 검사
npm run lint

# 영상 렌더링
npx remotion render <CompositionId> out/video.mp4
```

## Project Structure

```
remotion-studio/
├── .claude/agents/           # AI 에이전트 정의
│   ├── video-researcher.md   # 리서치 에이전트
│   ├── video-narrator.md     # 나레이션 에이전트
│   ├── video-planner.md      # 기획 에이전트
│   └── video-producer.md     # 제작 에이전트
│
├── src/
│   ├── shared/               # 공유 컴포넌트 (삭제 금지)
│   │   ├── components/       # UI 컴포넌트
│   │   │   ├── backgrounds/  # AnimatedGradient, ParticleField, FloatingShapes
│   │   │   ├── effects/      # Vignette, FilmGrain, LightLeak
│   │   │   ├── charts/       # BarChart, LineChart, PieChart
│   │   │   ├── metaphors/    # BreathingCircle, FlowingWaves, LayeredMind
│   │   │   └── layouts/      # Stack, Grid, Split, ComparisonLayout
│   │   ├── templates/
│   │   │   ├── scenes/       # Intro, Content, Quote, News, Timeline, DataViz...
│   │   │   └── animations/   # AnimatedText, TypewriterText, CaptionText...
│   │   ├── audio/            # AudioLayer, BackgroundMusic, SoundEffect
│   │   └── transitions/      # 씬 전환 효과
│   │
│   ├── videos/               # 영상별 컴포지션 (개별 삭제 가능)
│   │   ├── OpenAICrisis/
│   │   ├── SelfHelpCritiqueEN/
│   │   └── SelfHelpCritiqueFull/
│   │
│   ├── demos/                # 컴포넌트 데모
│   └── Root.tsx              # Composition 등록
│
├── projects/                 # 프로젝트별 에셋
│   ├── OpenAICrisis/
│   │   ├── narration.json    # TTS 소스 텍스트
│   │   ├── video-plan.json   # 시각 전략
│   │   ├── research-report.md
│   │   └── youtube/          # 썸네일, 설명
│   └── templates/
│       └── video-plan.md     # 기획 템플릿
│
├── public/videos/            # 오디오 파일
│   └── {compositionId}/audio/
│
├── docs/                     # 문서
│   ├── component-catalog.md  # 컴포넌트 카탈로그
│   └── visual-strategy-guide.md
│
└── scripts/                  # 유틸리티 스크립트
    ├── generate-tts.mjs      # TTS 생성
    ├── cleanup-audio.mjs     # 미사용 오디오 정리
    └── delete-video.mjs      # 비디오 삭제
```

## Video Production Pipeline

### 1. Research (video-researcher)
```
주제 입력 → 웹 검색 → 자료 분석 → research-report.md
```

### 2. Narration (video-narrator)
```
research-report.md → 스크립트 작성 → narration.json
```

### 3. Planning (video-planner)
```
narration.json → 시각 전략 수립 → video-plan.json
```

### 4. Production (video-producer)
```
video-plan.json → Remotion 컴포지션 구현 → src/videos/{id}/
```

## TTS Generation

```bash
# OpenAI TTS (기본)
node scripts/generate-tts.mjs -f projects/{compositionId}/narration.json

# ElevenLabs TTS
node scripts/generate-tts.mjs -f projects/{compositionId}/narration.json --elevenlabs
```

출력: `public/videos/{compositionId}/audio/`

## Scene Templates

| 템플릿 | 용도 |
|--------|------|
| IntroTemplate | 영상 시작, 제목 |
| ContentTemplate | 본문, 리스트, 하이라이트 |
| QuoteTemplate | 인용문, 출처 |
| NewsTemplate | 뉴스 스타일, 브레이킹 뉴스 |
| TimelineTemplate | 타임라인, 연대기 |
| DataVisualizationTemplate | 차트, 통계 |
| ComparisonTemplate | 비교 (A vs B) |
| OutroTemplate | 마무리, CTA |

## Video Management

```bash
# 비디오 삭제 (미리보기)
node scripts/delete-video.mjs <compositionId>

# 비디오 삭제 (실행)
node scripts/delete-video.mjs <compositionId> --confirm

# 미사용 오디오 정리
node scripts/cleanup-audio.mjs
```

## Compositions

| ID | 설명 | 언어 |
|----|------|------|
| OpenAICrisis | OpenAI 위기 분석 | 한국어 |
| SelfHelpCritiqueEN | Self-Help 비판 (요약) | 영어 |
| SelfHelpCritiqueFull | Self-Help 비판 (풀버전) | 영어 |
| MindfulnessPhenomenology | 마음챙김과 현상학 | 영어 |

## Environment Variables

`.env` 파일에 API 키 설정:

```env
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Documentation

- [Component Catalog](docs/component-catalog.md) - 컴포넌트 카탈로그
- [Visual Strategy Guide](docs/visual-strategy-guide.md) - 시각 전략 가이드
- [Video Plan Template](projects/templates/video-plan.md) - 기획 템플릿

## License

See [Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
