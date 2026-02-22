# Template Selection Guide

콘텐츠 유형 감지, 템플릿 선택 트리, 사용 가능한 컴포넌트 목록. video-planner에서 추출.

## Content Type Detection

나레이션 텍스트 키워드 분석으로 콘텐츠 유형 결정:

| Type | Keywords |
|------|----------|
| philosophical | meaning, purpose, existence, truth, wisdom, paradox, reflect, insight |
| data_driven | study, research, percent, statistics, data, survey, evidence, findings |
| narrative | story, journey, imagine, example, discovered, realized, transformed |
| technical | step, method, process, implement, system, code, algorithm, tutorial |
| critical | however, problem, issue, flaw, critique, myth, fallacy, debate, vs |

점수가 근접하면 (20% 이내) hybrid로 표시.

## Template Selection Decision Tree

```
scene.type === 'intro'           → IntroTemplate
scene.type === 'outro'           → OutroTemplate
scene.hasChart OR dataPoints > 2 → DataVisualizationTemplate
scene.hasQuote                   → QuoteTemplate (짧은 인용) 또는 ContentTemplate (긴 인용)
scene.hasComparison              → ComparisonTemplate
narrative + hasStory             → StoryTemplate
scene.hasAnnotations             → AnnotationTemplate
default                          → ContentTemplate
```

## Available Templates

```
IntroTemplate, ContentTemplate, ComparisonTemplate,
QuoteTemplate, OutroTemplate, DataVisualizationTemplate,
TimelineTemplate, ImageTemplate, AnnotationTemplate,
StoryTemplate, NewsTemplate, InterviewTemplate,
ProductShowcaseTemplate, TableListTemplate
```

## Available Backgrounds

```
AnimatedGradient, ParticleField, FloatingShapes,
GridPattern, NoiseTexture
```

AI 배경이 있을 때 (`visual_description` 존재):
- AI 배경이 모든 다른 배경보다 우선
- 패턴: `Img (staticFile) + dark overlay + gradient fallback`

## Available Effects

```
Vignette, FilmGrain, LightLeak, MotionBlurWrapper, EffectsComposer,
CameraMotionBlur, ChromaticAberration, GlitchEffect, ColorGrading,
Bloom, OfficialLightLeak
```

## Available Text Animations

```
TypewriterText, HighlightText, RevealText, GlitchText,
PoppingText, StaggerGroup, TextMorph,
FitText, FitTitle, FitSubtitle, FitMultilineText,
AnimatedCaption
```

## Available Charts

```
BarChart, LineChart, PieChart, AreaChart,
ScatterPlot, FunnelChart, GaugeChart, ComparisonBars,
WaterfallChart, RadarChart, HeatmapChart
```

## Available Shapes (@remotion/shapes)

```
AnimatedStar       - 별 (rating, achievement)
AnimatedPie        - 파이 (percentages, progress)
AnimatedPolygon    - 다각형 (sides로 n각형 설정)
AnimatedTriangle   - 삼각형 (direction, hierarchy)
AnimatedRect       - 사각형 (containers, cards)
AnimatedEllipse    - 타원 (highlight, focus)
```

## Available Paths (@remotion/paths)

```
SelfDrawingPath    - 셀프 드로잉 (flow charts, signatures)
MorphingIcon       - 아이콘 변환 (동일 SVG 커맨드 구조 필요!)
LiquidPath         - 액체 효과 (organic, flowing)
```

## Available Transitions (29 presets)

```
Fade:    fade, fadeQuick, fadeSlow
Dissolve: dissolve, dissolveQuick
Slide:   slideLeft, slideRight, slideUp, slideDown
Wipe:    wipeLeft, wipeRight, wipeUp, wipeDown
Flip:    flipHorizontal, flipVertical
Zoom:    zoomIn, zoomOut
Clock:   clockWipe
Morph:   morph, morphLeft, morphRight
Glitch:  glitch, glitchIntense
Blinds:  blindsHorizontal, blindsVertical
Ripple:  ripple, rippleCorner
Cut:     cut
```

## Available Media Components

```
GifPlayer, ReactionGif, BannerGif,
AIImage, AIVideo
```

## Visual Strategy by Content Type

### Philosophical/Abstract
- Background: `AnimatedGradient` (pulse/cycle) + `NoiseTexture` (grain, opacity 0.03)
- Effects: `Vignette`, `FilmGrain`, `ColorGrading` (noir/cinematic)
- Transitions: `dissolve`, `fade`
- Spring: `smooth`, `gentle`

### Data-Driven
- Background: `FloatingShapes` (hexagon) 또는 `GridPattern` (squares)
- Effects: minimal, light `Vignette`
- Transitions: `slide`, `wipe`
- Charts: `WaterfallChart`, `RadarChart`, `HeatmapChart`
- Spring: `crisp`, `moderate`

### Narrative/Story
- Background: `AnimatedGradient` (cycle) + `NoiseTexture`
- Effects: `LightLeak`, `Vignette`, `ColorGrading` (cinematic/teal-orange)
- Transitions: `dissolve`, `zoom`
- Spring: `smooth`, `elastic`

### Technical/Tutorial
- Background: `GridPattern` (lines/dots), sparse `ParticleField`
- Effects: minimal, `ChromaticAberration` (subtle, 0.15)
- Transitions: `slide`, `fade`
- Text: `TypewriterText`, `StaggerGroup`
- Spring: `snappy`, `crisp`

### Critical/Analytical
- Background: solid dark, subtle `AnimatedGradient`
- Effects: `Vignette`, `ColorGrading` (cold)
- Transitions: `wipe`, `fade`

## Color Palettes

| Type | Colors |
|------|--------|
| philosophical | #667eea, #764ba2, #1a1a2e |
| data_driven | #00c2ff, #667eea, #16213e |
| narrative | #ff6b6b, #4ecdc4, #2d1b4e |
| professional | #3498db, #2c3e50, #1a252f |
| warm | #ff7e5f, #feb47b, #2d2438 |
| calm | #56ccf2, #2f80ed, #1f2937 |
| tech | #00ff88, #0077ff, #0a0a0f |

## ColorGrading Presets

| Tone | Preset |
|------|--------|
| serious/philosophical | cinematic, noir |
| warm/inspirational | warm |
| analytical/critical | cold |
| nostalgic/historical | vintage |
| general | teal-orange |

## Spring Presets

| Preset | 용도 |
|--------|------|
| subtle | 보조 UI, 배경 |
| moderate | 기본 애니메이션 |
| snappy | 제목, 강조, 버튼 |
| energetic | 알림, CTA |
| bouncy | 재미 요소 |
| gentle | 모달, 툴팁 |
| smooth | 페이지 전환, 슬라이드 |
| quick | 호버, 토글 |
| elastic | 성공 상태, 축하 |
| heavy | 중요 알림 |
| crisp | 데이터 시각화, 차트 |

## Typography Standards

```
hero:      72px, weight 800   (비디오 타이틀)
h1:        64px, weight 700   (씬 타이틀)
h2:        52px, weight 600   (부제목)
h3:        40px, weight 600   (스텝 라벨)
bodyLarge: 36px, weight 400   (메인 설명)
body:      32px, weight 400   (일반 콘텐츠)
bodySmall: 28px, weight 400   (보조 텍스트)
label:     26px, weight 600   (태그, 배지)
caption:   24px, weight 400   (최소 가독 크기)
```

금지: title < 48px, body < 28px, label < 24px

## Reference Documents

구현 시 반드시 참조:
- `docs/component-catalog.md` - 전체 컴포넌트 레퍼런스
- `docs/visual-strategy-guide.md` - 주제별 비주얼 매핑
- `src/shared/styles/typography.ts` - 타이포그래피 기준
