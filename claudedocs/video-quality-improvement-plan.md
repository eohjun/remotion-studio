# 고품질 영상 제작을 위한 개선 플랜

## 현재 상태 분석 요약

### 강점 ✅
- **90+ 재사용 컴포넌트** (cards, layouts, backgrounds, effects, charts 등)
- **7,562 LOC** TypeScript 코드베이스
- **12개 완성된 영상** 구현체
- **종합적인 애니메이션 시스템** (18+ easing 함수, 12+ 프리셋)
- **오디오 시스템** (ducking, crossfade, beat detection)
- **Quality Presets** (draft → premium → master)
- **BT.709 색공간** 지원

### 개선 필요 영역 ⚠️
- 테스트 커버리지 < 5%
- 신규 기능 (advancedDucking, crossfade, TextMorph) 미통합
- 성능 최적화 미흡 (memoization, lazy loading 부재)
- Output Scaling 미활용 (고밀도 디스플레이 대응)
- 고급 이펙트 활용도 낮음

---

## Phase 1: 렌더링 품질 강화 🎯

### 1.1 Output Scaling 도입 (고밀도 디스플레이 대응)
**문제**: 1080p 영상이 Retina/2x 디스플레이에서 선명하지 않음
**해결**: Output scaling으로 텍스트/그래픽 선명도 향상

```typescript
// src/shared/config/qualityPresets.ts 수정
export const QUALITY_PRESETS = {
  // 기존 preset에 outputScaling 추가
  "retina-1080p": {
    name: "Retina 1080p",
    render: "1080p-hq",
    outputScaling: 1.5, // 1.5x 슈퍼샘플링
    description: "1080p with 1.5x supersampling for sharp text",
  },
  "supersampled-4k": {
    name: "Supersampled",
    render: "premium-1080p",
    outputScaling: 2, // 4K 렌더 → 1080p 다운스케일
    description: "4K render downscaled to 1080p for maximum sharpness",
  },
};
```

**구현 작업**:
- [ ] `remotion.config.ts`에 `scale` 옵션 추가
- [ ] `render-presets.ts`에 scale 파라미터 통합
- [ ] 렌더 스크립트에 `--scale` 플래그 추가

### 1.2 JPEG Quality 최적화
**현재**: 기본값 80
**권장**: 프리미엄 프리셋에서 95로 상향

```typescript
// render-presets.ts 수정
"premium-1080p": {
  ...
  jpegQuality: 95, // 기본 80 → 95
  imageFormat: "jpeg", // PNG는 더 느림
}
```

### 1.3 CRF 세분화
**현재 분석**:
| Preset | CRF | 평가 |
|--------|-----|------|
| draft | 28 | OK (프리뷰용) |
| 1080p | 18 | OK |
| premium-1080p | 12 | 좋음 |
| 4k | 18 | ⚠️ 4K에서 다소 높음 |

**권장 변경**:
```typescript
"4k": { crf: 15 }, // 18 → 15
"premium-4k": { crf: 12 }, // 15 → 12
```

---

## Phase 2: 시각 이펙트 고도화 🎨

### 2.1 EffectsComposer 활용 표준화
**현재**: 개별 이펙트를 각 영상에서 직접 적용
**개선**: 통합 이펙트 레이어 시스템

```tsx
// src/shared/components/effects/EffectsStack.tsx 신규
import { EffectsComposer } from './EffectsComposer';
import { getQualityPreset } from '../../config/qualityPresets';

export const EffectsStack: React.FC<{
  preset: string;
  children: React.ReactNode;
}> = ({ preset, children }) => {
  const config = getQualityPreset(preset);

  return (
    <EffectsComposer {...config.effects}>
      {children}
    </EffectsComposer>
  );
};
```

### 2.2 모션 블러 개선
**현재**: motionBlurSamples 설정 있으나 미활용
**개선**: CameraMotionBlur 자동 적용

```tsx
// Scene 래퍼에 자동 적용
<CameraMotionBlur
  samples={preset.motionBlurSamples}
  shutterAngle={180}
>
  <SceneContent />
</CameraMotionBlur>
```

### 2.3 Color Grading 프리셋 확장
**현재 프리셋**: cinematic, teal-orange, vintage, vibrant
**추가 권장**:
- `moody-dark`: 다크 톤, 언더사추레이션
- `warm-sunset`: 따뜻한 골든아워 느낌
- `cool-tech`: 테크/AI 컨텐츠용 블루 톤
- `documentary`: 자연스러운 다큐 스타일

---

## Phase 3: 애니메이션 품질 향상 🎬

### 3.1 Spring 기반 자연스러운 모션
**현재**: 일부 spring 사용, 대부분 linear interpolate
**개선**: 기본 애니메이션을 spring 기반으로 전환

```typescript
// src/shared/templates/animations/presets.ts
export const SPRING_PRESETS = {
  // UI 요소 등장
  gentle: { damping: 200, mass: 0.5, stiffness: 80 },
  // 텍스트 애니메이션
  snappy: { damping: 15, mass: 0.3, stiffness: 200 },
  // 강조 효과
  bouncy: { damping: 10, mass: 0.5, stiffness: 150, overshootClamping: false },
  // 부드러운 전환
  smooth: { damping: 25, mass: 1, stiffness: 100 },
};
```

### 3.2 Stagger Animation 표준화
**현재**: 개별 구현
**개선**: 통합 stagger 유틸리티

```typescript
// src/shared/utils/stagger.ts
export function createStaggerAnimation(
  items: number,
  baseDelay: number = 3,
  options: { distribution: 'linear' | 'ease-out' | 'random' } = { distribution: 'linear' }
) {
  return items.map((_, i) => {
    switch (options.distribution) {
      case 'ease-out':
        return Math.pow(i / items, 0.7) * baseDelay * items;
      case 'random':
        return Math.random() * baseDelay * items;
      default:
        return i * baseDelay;
    }
  });
}
```

### 3.3 Easing 함수 현대화
**Remotion 권장 easing** 추가:
- `easeInOutQuint`: 부드러운 가속/감속
- `easeOutExpo`: 빠른 시작, 부드러운 착지
- `cubicBezier`: 커스텀 커브 지원

---

## Phase 4: 오디오-비주얼 싱크 강화 🔊

### 4.1 Advanced Ducking 통합
**현재**: advancedDucking.ts 존재하나 미사용
**개선**: 나레이션 기반 자동 ducking

```typescript
// 자동 ducking 적용
import { advancedDuckVolume } from '../audio/utils/advancedDucking';

// 나레이션 타이밍에 맞춰 배경음악 자동 ducking
const bgMusicVolume = advancedDuckVolume({
  frame,
  fps,
  narrationTimings, // 나레이션 구간 배열
  duckAmount: 0.3,  // 30%로 감소
  attackMs: 200,    // 200ms fade
  releaseMs: 500,   // 500ms recovery
});
```

### 4.2 Beat Sync 애니메이션
**현재**: calculateBeatFrames 존재하나 미활용
**개선**: 비트에 맞춘 시각적 강조

```typescript
// 비트 기반 펄스 효과
const isOnBeat = isOnBeat(frame, fps, bpm);
const beatScale = isOnBeat ? 1.05 : 1;
```

### 4.3 Crossfade 표준화
**현재**: crossfade.ts 신규 추가됨
**개선**: 씬 전환에 오디오 크로스페이드 자동 적용

---

## Phase 5: 성능 최적화 ⚡

### 5.1 컴포넌트 Memoization
**식별된 Heavy 컴포넌트**:
- `ParticleField`: 많은 파티클 시 성능 저하
- `Three.js 컴포넌트`: 3D 렌더링 부하
- `Charts`: 데이터 포인트 많을 시

```tsx
// React.memo + useMemo 적용
export const ParticleField = React.memo(({ count, ...props }) => {
  const particles = useMemo(() =>
    generateParticles(count), [count]
  );
  // ...
});
```

### 5.2 Lazy Loading for 3D
```tsx
// Three.js 동적 임포트
const ThreeCanvas = lazy(() => import('@remotion/three').then(m => ({ default: m.ThreeCanvas })));
```

### 5.3 Concurrency 최적화
**권장**: `npx remotion benchmark` 실행 후 최적값 설정

```bash
# remotion.config.ts
Config.setConcurrency(4); // 시스템별 최적값 측정 필요
```

---

## Phase 6: 템플릿 시스템 고도화 📐

### 6.1 Scene Template 표준화
**현재**: 11개 템플릿, 각자 다른 스타일
**개선**: 통합 스타일 시스템

```typescript
// src/shared/templates/scenes/base/SceneBase.tsx
export const SceneBase: React.FC<{
  layout: 'centered' | 'split' | 'thirds';
  background: BackgroundConfig;
  effects: EffectsConfig;
  children: React.ReactNode;
}> = ({ layout, background, effects, children }) => (
  <EffectsStack preset="high">
    <Background {...background}>
      <Layout type={layout}>
        {children}
      </Layout>
    </Background>
  </EffectsStack>
);
```

### 6.2 Transition 시스템 개선
**현재 전환**: fade, slide, wipe, flip, dissolve, zoom
**추가 권장**:
- `morph`: 형태 변형 전환
- `glitch`: 글리치 효과 전환
- `blinds`: 블라인드 효과
- `ripple`: 물결 효과

### 6.3 Safe Area 강화
```typescript
// YouTube/Shorts 안전 영역 시각화
export const SafeAreaOverlay: React.FC = () => (
  <>
    {/* 타이틀 안전 영역 (90%) */}
    <div style={{
      border: '1px dashed rgba(255,0,0,0.5)',
      position: 'absolute',
      inset: '5%'
    }} />
    {/* 액션 안전 영역 (95%) */}
    <div style={{
      border: '1px dashed rgba(255,255,0,0.5)',
      position: 'absolute',
      inset: '2.5%'
    }} />
  </>
);
```

---

## Phase 7: 품질 보증 시스템 🧪

### 7.1 테스트 커버리지 확대
**현재**: 3개 테스트 파일 (<5% 커버리지)
**목표**: 핵심 유틸리티 80% 이상

**우선순위**:
1. `volumeUtils.ts` - 오디오 계산 정확성
2. `colors.ts` - 색상 변환 정확성
3. `timing.ts` - 프레임 계산 정확성
4. `animationPresets.ts` - 애니메이션 출력 검증

### 7.2 Visual Regression Testing
```bash
# Playwright 기반 스크린샷 비교
npm run test:visual
```

### 7.3 렌더 품질 검증 스크립트
```bash
# scripts/verify-render-quality.mjs
# - 해상도 확인
# - 비트레이트 측정
# - 오디오 레벨 체크
# - 색공간 검증
```

---

## 구현 우선순위 및 로드맵

### 🔴 즉시 (1주차)
1. Output Scaling 도입 (Phase 1.1)
2. CRF 값 최적화 (Phase 1.3)
3. Spring 프리셋 표준화 (Phase 3.1)

### 🟡 단기 (2-3주차)
4. EffectsStack 컴포넌트 구현 (Phase 2.1)
5. Advanced Ducking 통합 (Phase 4.1)
6. 컴포넌트 Memoization (Phase 5.1)

### 🟢 중기 (4-6주차)
7. Color Grading 프리셋 확장 (Phase 2.3)
8. Scene Template 표준화 (Phase 6.1)
9. 테스트 커버리지 확대 (Phase 7.1)

### 🔵 장기
10. Visual Regression Testing
11. 신규 Transition 추가
12. Beat Sync 시스템

---

## 참고 자료

### Remotion 공식 문서
- [Quality Guide](https://www.remotion.dev/docs/quality)
- [Encoding Guide](https://www.remotion.dev/docs/encoding)
- [Performance Tips](https://www.remotion.dev/docs/performance)
- [Spring Animation](https://www.remotion.dev/docs/spring)
- [Interpolate](https://www.remotion.dev/docs/interpolate)

### 2026년 신규 기능
- [Remotion Skills](https://news.aibase.com/news/24827) - AI 에이전트 통합
- BT.709 색공간 (v5.0 기본값)
- 하드웨어 가속 인코딩 개선

---

## 예상 결과

| 영역 | 현재 | 개선 후 |
|------|------|---------|
| 텍스트 선명도 | 1x | 1.5-2x (supersampling) |
| 모션 자연스러움 | Linear | Spring 기반 |
| 오디오-비주얼 싱크 | 수동 | 자동 ducking |
| 렌더 시간 | 기준 | -20% (최적화) |
| 테스트 커버리지 | <5% | >60% |
| 색상 정확도 | 기본 | BT.709 표준 |

---

**WAITING FOR CONFIRMATION**: 이 플랜을 진행할까요? (yes/no/수정)
