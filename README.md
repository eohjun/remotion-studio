# Remotion Studio

Obsidian 노트 기반 영상 제작을 위한 Remotion 프로젝트입니다.

## Features

- **컴포넌트 라이브러리**: 재사용 가능한 씬 템플릿 및 애니메이션
- **TTS 통합**: OpenAI / ElevenLabs TTS 자동 생성
- **오디오 동기화**: 오디오 길이 기반 씬 타이밍 자동 설정
- **다국어 지원**: 한국어, 영어, 일본어, 중국어
- **YouTube 최적화**: 메타데이터, 챕터, 썸네일 자동 생성

## Commands

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

## TTS 음성 생성

```bash
# OpenAI TTS (기본)
node scripts/generate-tts.mjs -f narration.json

# ElevenLabs TTS
node scripts/generate-tts.mjs -f narration.json --elevenlabs

# 커스텀 출력 디렉토리
node scripts/generate-tts.mjs -f narration.json -o en-full

# 영어로 번역 후 생성
node scripts/generate-tts.mjs -f narration.json --translate --lang en
```

출력:
- `public/audio/<dir>/*.mp3` - 씬별 오디오 파일
- `public/audio/<dir>/audio-metadata.json` - 오디오 길이 메타데이터

## 씬 타이밍 자동 동기화

TTS 생성 후 실제 오디오 길이에 맞춰 constants.ts를 자동 생성합니다.

```bash
# 미리보기
node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json --dry-run

# constants.ts 생성
node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json

# 버퍼 시간 조정 (기본: 1.5초)
node scripts/sync-durations.mjs public/audio/en-full/audio-metadata.json --buffer 2
```

## Project Structure

```
src/
├── components/          # 공통 UI 컴포넌트
├── templates/
│   ├── animations/      # 애니메이션 프리셋 및 AnimatedText
│   └── scenes/          # 씬 템플릿 (Intro, Content, Quote, Outro 등)
├── SelfHelpCritiqueEN/  # 1분 영어 버전
├── SelfHelpCritiqueFull/ # 6분 풀버전
└── Root.tsx             # Composition 등록

scripts/
├── generate-tts.mjs     # TTS 생성 + 오디오 메타데이터
├── sync-durations.mjs   # constants.ts 자동 생성
└── narration-*.json     # 나레이션 스크립트

public/audio/            # 생성된 오디오 파일
youtube/                 # YouTube 에셋 (메타데이터, 챕터 등)
```

## Compositions

| ID | 설명 | 길이 |
|----|------|------|
| SelfHelpCritiqueEN | Self-Help 비판 (영어, 요약) | ~1분 |
| SelfHelpCritiqueFull | Self-Help 비판 (영어, 풀버전) | ~6분 |

## Environment Variables

`.env` 파일에 API 키를 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Workflow

```
1. narration.json 작성 (씬별 텍스트)
       ↓
2. TTS 생성: node scripts/generate-tts.mjs -f narration.json -o output-dir
       ↓
3. 타이밍 동기화: node scripts/sync-durations.mjs public/audio/output-dir/audio-metadata.json
       ↓
4. 프리뷰: npm run dev
       ↓
5. 렌더링: npx remotion render <CompositionId> out/video.mp4
```

## License

See [Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
