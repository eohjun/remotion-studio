# Narration Schema

`narration.json` 필수 스키마. TTS 스크립트(`generate-tts.mjs`)가 기대하는 정확한 형식.

## 필수 구조

```json
{
  "metadata": {
    "compositionId": "MyVideoName",
    "title": "영상 제목",
    "description": "영상 설명",
    "targetDuration": 150,
    "language": "ko",
    "voice": "nova",
    "tone": "serious|inspirational|critical|calm|dynamic",
    "contentType": "philosophical|data-driven|narrative|technical|critical"
  },
  "scenes": [
    {
      "id": "intro",
      "type": "intro",
      "title": "타이틀",
      "text": "나레이션 텍스트...",
      "duration": 6,
      "visualCue": "인간용 비주얼 힌트",
      "visual_description": "AI 이미지 프롬프트 (영어)",
      "notes": "구현 참고 노트"
    }
  ],
  "totalDuration": 150,
  "sceneCount": 8
}
```

## 필수 필드 체크리스트

```
□ metadata.compositionId   ← 오디오 폴더 경로 결정
□ metadata.language        ← "ko" 또는 "en"
□ scenes[].id              ← MP3 파일명으로 사용
□ scenes[].text            ← TTS 나레이션 텍스트
□ scenes[0].type === "intro" ← 첫 씬은 반드시 intro
```

## 금지 필드명

```json
// ❌ "narration" 사용 금지 → TTS 생성 실패
{ "id": "hook", "narration": "텍스트..." }

// ❌ "content" 사용 금지 → TTS 생성 실패
{ "id": "hook", "content": "텍스트..." }

// ❌ compositionId 누락 금지 → 오디오 경로 오류
{ "metadata": { "title": "..." } }
```

반드시 `"text"` 필드를 사용:
```json
{ "id": "hook", "text": "나레이션 텍스트..." }
```

## scene.id 명명 규칙

MP3 파일명으로 직접 사용되므로 파일명으로 유효해야 함:

```
✅ 유효: "intro", "hook", "point_1", "conclusion"
❌ 무효: "포인트 1", "hook/intro", "point:1"
```

- 영문 소문자 + 숫자 + 언더스코어만
- 공백, 슬래시, 콜론, 한글 금지

## Scene Types

| Type | 용도 | 일반 duration | 필수 |
|------|------|--------------|------|
| `intro` | 제목 + 주제 소개 | 5-10초 | YES (첫 씬) |
| `hook` | 관심 끌기 | 8-12초 | YES |
| `content` | 본문 정보 | 15-30초 | |
| `data` | 통계/차트 | 10-20초 | |
| `quote` | 인용 | 8-15초 | |
| `comparison` | A vs B | 20-30초 | |
| `story` | 스토리/예시 | 20-40초 | |
| `transition` | 씬 연결 | 5-8초 | |
| `conclusion` | 요약 | 15-25초 | |
| `outro` | CTA/마무리 | 8-15초 | |

## visual_description 가이드

fal.ai AI 이미지 생성 프롬프트로 사용됨.

**규칙:**
1. 영어로 작성 (fal.ai 모델 최적화)
2. 구체적 시각 묘사: 색상, 구도, 조명, 분위기
3. 끝에 `"cinematic, 8k"` 포함
4. 텍스트/글자 묘사 금지
5. 사람 얼굴 최소화

```json
// ✅ 좋은 예시
{ "visual_description": "Abstract visualization of a human brain with glowing synapses firing, deep blue and purple color palette, ethereal atmosphere, cinematic, 8k" }

// ❌ 나쁜 예시
{ "visual_description": "자이가르닉 효과 설명 이미지" }
```

`visualCue`와 별개:
- `visualCue`: 인간용 비주얼 방향 ("Vienna cafe scene")
- `visual_description`: AI 모델용 프롬프트 (영어, 구체적)

불필요한 경우: 텍스트/차트만 표시하는 씬, 기본 배경이면 충분한 씬

## visualPanels (오디오-비주얼 동기화)

나레이션 텍스트 중 일부만 화면에 표시할 때 사용:

```json
{
  "id": "hook",
  "text": "전체 나레이션...",
  "visualPanels": [
    { "text": "화면에 표시할 텍스트", "startPercent": 0, "endPercent": 12 },
    { "text": "두 번째 패널", "startPercent": 30, "endPercent": 50 }
  ]
}
```

- `startPercent`/`endPercent`: 씬 시작 기준 0-100%
- 프레임 계산: `Math.round(sceneDurationFrames * percent / 100)`

**필요한 경우**: 스토리텔링 씬, 순차 텍스트 표시
**불필요한 경우**: 전체 텍스트 그대로 표시, 텍스트 없는 씬

## Pause 마커

```
[pause:short]   = 0.3초 (쉼표 후, 목록 항목 사이)
[pause:medium]  = 0.7초 (문장 후, 주요 전환 전)
[pause:long]    = 1.2초 (극적 강조, 큰 전환)
[pause:breath]  = 0.5초 (자연스러운 호흡점)
```

문서화 전용 — TTS에 전송되지 않음 (자동 제거). 실제 쉼은 TTS가 문장부호로 처리.

## 콘텐츠 밀도

화면 오버플로우 방지를 위한 아이템 수 제한:

| 레이아웃 | 최대 개수 |
|---------|----------|
| 큰 스텝 카드 | 4개 |
| 컴팩트 리스트 | 5개 |
| 불릿 포인트 | 8개 |
| 2열 그리드 | 6개 (3행) |

5개 이상 필요 시 → 씬 분할 권장.

## Duration 추정 공식

```
영어: wordsPerSecond = 2.5
한국어: syllablesPerSecond = 5.0

baseDuration = wordCount / wordsPerSecond
+ pauseCount * averagePauseDuration
+ emphasizedWords * 0.3초
+ technicalTerms * 0.5초
```
