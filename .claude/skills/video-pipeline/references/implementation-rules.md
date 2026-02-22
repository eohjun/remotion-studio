# Implementation Rules

컴포지션 구현 시 반드시 따라야 하는 규칙. video-producer.md에서 추출.

## AI 배경 패턴

AI 에셋이 있을 때 (`public/videos/{id}/ai-assets/` 존재), 모든 씬에서 반드시 사용:

```tsx
import { Img, staticFile } from "remotion";

const SceneBackground: React.FC<{
  sceneId: string;
  overlayOpacity?: number;
}> = ({ sceneId, overlayOpacity = 0.6 }) => (
  <AbsoluteFill>
    {/* 그라데이션 폴백 (이미지 로드 전/실패 시) */}
    <AbsoluteFill style={{ background: `radial-gradient(...)` }} />
    {/* AI 생성 이미지 */}
    <AbsoluteFill>
      <Img
        src={staticFile(`${AI_ASSETS_BASE}/${sceneId}-bg.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={undefined}
      />
    </AbsoluteFill>
    {/* 텍스트 가독성을 위한 다크 오버레이 */}
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,${overlayOpacity + 0.15}) 100%)`
    }} />
  </AbsoluteFill>
);
```

- `constants.ts`에 `AI_ASSETS_BASE` 경로 정의
- overlayOpacity: 텍스트 많은 씬 0.65-0.7, 비주얼 중심 0.4-0.5
- 단색/그라데이션만 사용 금지 (AI 에셋 있을 때)

## FPS 동적 읽기

FPS 하드코딩 절대 금지:

```typescript
// ❌ WRONG
const FPS = 30;
const frames = duration * 30;

// ✅ CORRECT: constants.ts에서 읽기
import { VIDEO_CONFIG } from "./constants";
const frames = duration * VIDEO_CONFIG.fps;

// ✅ CORRECT: useVideoConfig 훅 사용
import { useVideoConfig } from "remotion";
const { fps } = useVideoConfig();
```

## 씬 중앙 정렬

모든 씬의 최상위 AbsoluteFill에 반드시 적용:

```tsx
<AbsoluteFill style={{
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}}>
```

예외 시 의도를 주석으로 명시.

## 화면 공간 활용

1920x1080 화면의 70-90%를 콘텐츠로 채워야 함.

### 최소 크기 기준

| 요소 | 최소 | 권장 |
|------|------|------|
| Main title | 64px | 72-100px |
| Section title | 48px | 56-72px |
| Subtitle | 32px | 36-46px |
| Body text | 28px | 32-42px |
| Caption/label | 24px | 28-36px |
| Hero icon | 200px | 250-350px |
| Main icon | 80px | 100-150px |
| Bullet icon | 48px | 56-80px |
| Card width | 380px | 420-550px |
| Card padding | 30px | 40-60px |
| Progress bar width | 250px | 300-500px |

### 금지 사항

- Title < 48px
- Body text < 28px
- Icon < 80px
- Hero < 200px
- Card width < 380px
- 화면 50% 이상 빈 공간

### 필수 import

```tsx
import {
  FONT_FAMILY,
  RECOMMENDED_SIZES,
  LAYOUT
} from "../../shared/components/constants";
```

## Typography

커스텀 텍스트 스타일링 시 반드시 `fontFamily` 포함:

```tsx
import { FONT_FAMILY } from "../../shared/components/constants";

<div style={{
  fontSize: 48,
  fontFamily: FONT_FAMILY.title,  // REQUIRED
}}>텍스트</div>
```

공유 텍스트 컴포넌트 우선 사용:
- `AnimatedText` - 애니메이션 텍스트
- `TitleCard` - 제목 + 부제
- `TypewriterText` - 타이프라이터 효과
- `HighlightText` - 하이라이트
- `StaggerGroup` - 순차 애니메이션

## Visual Panel 타이밍

하드코딩된 프레임값 사용 금지. `visual-panels.json` 또는 `visualPanels` percent 기반 계산 사용:

```tsx
// ✅ visual-panels.json에서 가져오기
import visualPanels from "../../../projects/{id}/visual-panels.json";
const hookPanels = visualPanels.scenes.find(s => s.id === "hook")?.panels || [];

// ✅ 또는 percent 기반 계산
const sceneDurationFrames = SCENE_FRAMES.hook;
const panels = narration.visualPanels.map(p => ({
  text: p.text,
  start: Math.round(sceneDurationFrames * p.startPercent / 100),
  end: Math.round(sceneDurationFrames * p.endPercent / 100),
}));
```

## 버퍼 규칙

씬 duration = 오디오 프레임 + 5프레임 (최대). 과도한 버퍼 금지:

```typescript
// ❌ WRONG: 버퍼가 너무 큼
intro: 85,  // 38 + 47 = 1.5초 공백!

// ✅ CORRECT: 최소 버퍼
intro: 43,  // 38 + 5 = 0.17초
```

## 콘텐츠 밀도 제한 (오버플로우 방지)

Safe Area 높이 960px 기준:

| 레이아웃 | 아이템당 높이 | 최대 개수 |
|---------|-------------|----------|
| 큰 스텝 카드 | ~120px | 4개 |
| 컴팩트 리스트 | ~90px | 5개 |
| 불릿 포인트 | ~60px | 8개 |
| 2열 그리드 | ~180px/행 | 6개 (3행) |

5개 이상 → 씬 분할 권장.

## 배지/인라인 박스

- `whiteSpace: "nowrap"` 사용하여 줄바꿈 방지
- `minWidth` 설정하여 텍스트 한 줄 보장
- 비례 너비: `Math.max(minWidth, 계산값)` 사용

## 핵심 인사이트 텍스트

씬의 핵심 메시지:
- 폰트 크기: 48-56px (최소 44px)
- 폰트 굵기: 600-700
- 색상: accent color
- 효과: text-shadow 또는 glow 권장

## 비교 카드 레이아웃

| 요소 | 최소 | 권장 |
|------|------|------|
| 카드 너비 | 480px | 520-620px |
| 카드 패딩 | 40px | 45-60px |
| 카드 gap | 60px | 70-100px |
| 헤더 이모지 | 48px | 56-72px |
| 헤더 텍스트 | 32px | 38-48px |
| 내용 텍스트 | 30px | 34-42px |

## Composition 등록 패턴

```tsx
// src/videos/{id}/index.tsx
import { VIDEO_CONFIG } from "./constants";

export const MyVideo: React.FC = () => {
  return (
    <TransitionComposition
      scenes={scenes}
      defaultTransition={TRANSITION_PRESETS.dissolve}
    />
  );
};

export const myVideoComposition = {
  id: "MyVideo",
  component: MyVideo,
  durationInFrames: VIDEO_CONFIG.totalFrames,
  fps: VIDEO_CONFIG.fps,
  width: VIDEO_CONFIG.width,
  height: VIDEO_CONFIG.height,
};

// src/Root.tsx에 등록
<Composition {...myVideoComposition} />
```

## 차트/데이터 시각화

| 요소 | 최소 | 권장 |
|------|------|------|
| 바 높이 | 70px | 80-100px |
| 바 라벨 | 32px | 38-46px |
| 바 내부 퍼센트 | 32px | 38-48px |
| 라벨 영역 너비 | 200px | 220-280px |
| 바 최대 너비 | 화면 50-60% | 900-1100px |
| 바 간격 | 35px | 40-60px |
