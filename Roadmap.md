# Remotion Studio Roadmap

**Version**: 1.0
**Last Updated**: 2026-01-24
**Status**: Active Development

---

## 📊 Current Status (v1.0)

### Completed Features (Phase 1-9)

#### Core Infrastructure
- ✅ Remotion project setup with TypeScript
- ✅ Component-based architecture
- ✅ Zod schema validation for all compositions

#### Component Library
- ✅ **TitleCard** - Animated title displays
- ✅ **HighlightBox** - Emphasized content containers
- ✅ **QuoteCard** - Quote presentations with attribution
- ✅ **BulletPoint** - Sequential list animations
- ✅ **ComparisonTable** - Side-by-side comparisons

#### Animation System
- ✅ Core animations: `fadeIn`, `scaleIn`, `slideIn`
- ✅ Spring presets for physics-based motion
- ✅ `interpolate()` utilities for frame mapping
- ✅ `<Sequence>` based timing control

#### Scene Templates (5 Types)
- ✅ **IntroTemplate** - Video openings
- ✅ **ContentTemplate** - Main content sections
- ✅ **ComparisonTemplate** - Comparative analysis
- ✅ **QuoteTemplate** - Quote highlights
- ✅ **OutroTemplate** - Video endings

#### Content Integration
- ✅ Obsidian vault integration (Zettelkasten notes)
- ✅ Multi-source support (PDF, DOCX, Web)
- ✅ Connected notes parsing (`[[link]]` format)

#### Audio System
- ✅ TTS integration (OpenAI, ElevenLabs)
- ✅ Audio sync tooling (`sync-durations.mjs`)
- ✅ `<Audio>` component integration

#### Internationalization
- ✅ Multi-language support (한국어, English, 日本語, 中文)
- ✅ Localized content templates

#### Platform Support
- ✅ YouTube asset generation (thumbnails, metadata)
- ✅ Standard 16:9 (1920x1080) output

---

## 🚀 Future Development Phases

### Phase 10: Animation System Enhancement ✅ COMPLETED (2026-01-23)
**Priority**: High | **Impact**: Core Experience

Expand animation capabilities for more dynamic and professional videos.

#### Easing Functions
- [x] Standard easings: `easeIn`, `easeOut`, `easeInOut` → `easings.ts`
- [x] Advanced easings: `easeInBack`, `easeOutBounce`, `easeInOutElastic` → `easings.ts`
- [x] Custom bezier curve support → `cubicBezier()`
- [x] Easing preset library → `EASING_PRESETS`, `BEZIER_PRESETS`

#### Color Animations
- [x] `interpolateColor()` utility for smooth transitions → `colors.ts`
- [x] Gradient animations (linear, radial) → `pulsingGradient()`, `rotatingGradient()`
- [x] Color scheme transitions → `interpolateColors()` (multi-color HSL/RGB)
- [x] Color utilities → `lighten()`, `darken()`, `saturate()`, `withAlpha()`, `complement()`

#### Advanced Effects
- [x] Blur animations → `blurIn`, `blurOut`, `useAnimatedBlur()`
- [x] Glow effects with animation → `glowIn()` preset
- [x] Shadow depth animations → `shadowIn()` preset
- [x] Eased animation presets → `fadeInEased()`, `slideInEased()`, `scaleInEased()`

#### SVG Animations
- [x] Path morphing animations → `interpolatePath()` in `svg.ts`
- [x] Stroke draw animations → `calculateStrokeDraw()`, `getStrokeDrawStyle()`
- [x] SVG transform utilities → `animatedRotation()`, `animatedScale()`, `combineTransforms()`
- [x] Circle/arc animations → `animatedCircle()`, `progressRing()`
- [x] Filter animations → `animatedGaussianBlur()`, `animatedDropShadow()`

**Files Created:**
- `src/templates/animations/easings.ts` - 30+ easing functions + cubic bezier
- `src/templates/animations/colors.ts` - Color interpolation & utilities
- `src/templates/animations/svg.ts` - SVG animation utilities
- `src/demos/AnimationDemo.tsx` - Phase 10 demo composition

**Files Modified:**
- `src/templates/animations/presets.ts` - Added eased presets, glow/shadow effects
- `src/templates/animations/index.ts` - Exported all new modules

---

### Phase 11: Template Expansion ✅ COMPLETED (2026-01-23)
**Priority**: High | **Impact**: Content Variety

Add new scene templates for diverse content types.

#### DataVisualizationTemplate
- [x] Chart display scenes (bar, horizontalBar, progress, metric)
- [x] Animated data reveals (spring-based growth animations)
- [x] Statistical highlights (highlight prop)
- [x] Data source attribution (source prop)

#### TimelineTemplate
- [x] Horizontal timeline layout
- [x] Vertical timeline option
- [x] Event markers with animations (SVG stroke draw)
- [x] Period highlighting (highlight prop)

#### ImageTemplate
- [x] Ken Burns effect (zoomIn, zoomOut, panLeft, panRight)
- [x] Image reveal animations (reveal effect)
- [x] Before/after comparisons (side-by-side layout)
- [x] Gallery slideshows (gallery layout)

#### AnnotationTemplate
- [x] Diagram annotations (tooltip, callout, label styles)
- [x] Callout pointers (arrow, line, dot)
- [x] Highlight regions (highlight prop)
- [x] Sequential reveals (revealMode: sequential)

#### StoryTemplate
- [x] Narrative flow layout (single, split, sequence)
- [x] Character/avatar integration (character prop)
- [x] Dialogue formatting (narrator with styles)
- [x] Scene transitions (mood-based styling)

**Files Created:**
- `src/templates/scenes/DataVisualizationTemplate.tsx`
- `src/templates/scenes/TimelineTemplate.tsx`
- `src/templates/scenes/ImageTemplate.tsx`
- `src/templates/scenes/AnnotationTemplate.tsx`
- `src/templates/scenes/StoryTemplate.tsx`
- `src/demos/TemplateDemo.tsx`

**Files Modified:**
- `src/templates/scenes/types.ts` - Added DataItem, TimelineEvent, ImageItem, Annotation, StoryPanel
- `src/templates/scenes/index.ts` - Added new template exports
- `src/demos/index.ts` - Added TemplateDemo export
- `src/Root.tsx` - Registered TemplateDemo composition

---

### Phase 12: Visual Effects ✅ COMPLETED (2026-01-23)
**Priority**: Medium | **Impact**: Visual Appeal

Eye-catching visual effects for engagement.

#### Particle System
- [x] Floating particles → `ParticleField`
- [x] Custom particle shapes (circle, square, blur)
- [ ] Confetti effects
- [ ] Sparkle animations

#### Background Patterns
- [x] Animated gradients → `AnimatedGradient` (cycle, rotate, shift, pulse)
- [x] Geometric patterns → `FloatingShapes` (circle, square, triangle, hexagon)
- [x] Noise/grain textures → `FilmGrain`
- [ ] Video backgrounds

#### Text Effects
- [x] Typewriter effect → `TypewriterText`
- [x] Text reveal → `RevealText` (word, line, clip modes)
- [x] Glitch text effect → `GlitchText` (subtle, medium, intense)
- [x] Highlight/underline animations → `HighlightText` (background, underline, strike, box)

#### Cinematic Effects (추가 구현)
- [x] Vignette → `Vignette`
- [x] Light leaks → `LightLeak` (gradient, flare, streak)
- [x] Motion blur → `MotionBlurWrapper` (@remotion/motion-blur)
- [x] Effects composer → `EffectsComposer`

#### Transition Effects
- [x] Wipe transitions → `src/transitions/presets.ts` (wipeLeft, wipeRight, wipeUp, wipeDown)
- [x] Dissolve transitions → `src/transitions/custom/dissolve.tsx`
- [x] Zoom transitions → `src/transitions/custom/zoom.tsx` (zoomIn, zoomOut)
- [x] Slide transitions → `src/transitions/presets.ts` (slideLeft, slideRight, slideUp, slideDown)
- [x] Fade transitions → `src/transitions/presets.ts`
- [x] Flip transitions → `src/transitions/presets.ts` (flipLeft, flipRight)
- [x] Clock wipe → `src/transitions/presets.ts`
- [x] TransitionComposition wrapper → `src/transitions/TransitionComposition.tsx`

**Files Created:**
- `src/components/backgrounds/` - AnimatedGradient, ParticleField, FloatingShapes
- `src/components/effects/` - Vignette, LightLeak, FilmGrain, MotionBlurWrapper, EffectsComposer
- `src/templates/animations/` - TypewriterText, HighlightText, GlitchText, RevealText
- `src/transitions/` - TransitionComposition, presets, custom/dissolve, custom/zoom
- `src/demos/VisualEffectsDemo.tsx` - 데모 컴포지션

---

### Phase 13: Component Library Growth ✅ COMPLETED (2026-01-23)
**Priority**: High | **Impact**: Reusability

Build a comprehensive component library for rapid video creation.

#### Chart Components
- [x] **BarChart** - Horizontal/vertical bars with animation → `src/components/charts/BarChart.tsx`
- [x] **LineChart** - Animated line drawing with area fill → `src/components/charts/LineChart.tsx`
- [x] **PieChart** - Slice animations with labels (pie & donut) → `src/components/charts/PieChart.tsx`
- [ ] **AreaChart** - Filled area animations (covered by LineChart showArea)
- [ ] **RadarChart** - Multi-axis comparisons

#### Progress Components
- [x] **ProgressBar** - Linear progress with percentages → `src/components/progress/ProgressBar.tsx`
- [x] **ProgressCircle** - Circular progress indicators → `src/components/progress/ProgressCircle.tsx`
- [x] **StepIndicator** - Multi-step progress → `src/components/progress/StepIndicator.tsx`
- [x] **CountUp** - Animated number counting → `src/components/progress/CountUp.tsx`

#### Timeline Components
- [x] **Timeline** - Event sequence display (existing in TimelineTemplate)
- [ ] **Milestone** - Key event markers
- [ ] **Duration** - Time span visualization
- [ ] **Gantt** - Project timeline bars

#### Icon System
- [x] SVG icon component wrapper → `src/components/icons/Icon.tsx`
- [x] Icon animation utilities (spin, pulse, bounce) → `src/components/icons/Icon.tsx`
- [x] Icon set integration (Lucide) → `lucide-react` dependency
- [x] Entry animations → `src/components/icons/AnimatedIcon.tsx`

#### Layout Components
- [x] **Grid** - Responsive grid layouts → `src/components/layouts/Grid.tsx`
- [x] **Split** - Side-by-side layouts → `src/components/layouts/Split.tsx`
- [x] **Stack** - Vertical/horizontal stacking → `src/components/layouts/Stack.tsx`
- [ ] **Overlay** - Layered content

**Files Created:**
- `src/components/charts/BarChart.tsx`
- `src/components/charts/LineChart.tsx`
- `src/components/charts/PieChart.tsx`
- `src/components/charts/index.ts`
- `src/components/progress/CountUp.tsx`
- `src/components/progress/ProgressBar.tsx`
- `src/components/progress/ProgressCircle.tsx`
- `src/components/progress/StepIndicator.tsx`
- `src/components/progress/index.ts`
- `src/components/layouts/Stack.tsx`
- `src/components/layouts/Grid.tsx`
- `src/components/layouts/Split.tsx`
- `src/components/icons/Icon.tsx`
- `src/components/icons/AnimatedIcon.tsx`
- `src/components/icons/index.ts`
- `src/demos/ComponentLibraryDemo.tsx`

**Files Modified:**
- `src/components/index.ts` - Added charts, progress, icons exports
- `src/components/layouts/index.ts` - Added Stack, Grid, Split exports
- `src/demos/index.ts` - Added ComponentLibraryDemo export
- `src/Root.tsx` - Registered ComponentLibraryDemo composition
- `package.json` - Added lucide-react dependency

---

### Phase 14: Audio Enhancement ✅ COMPLETED (2026-01-23)
**Priority**: Medium | **Impact**: Production Quality

Create a professional audio layer system.

#### Background Music System
- [x] Music layer management → `BackgroundMusic.tsx`
- [x] Volume automation → `fadeInOut()`, `fadeVolume()` in `volumeUtils.ts`
- [x] Loop handling for varying lengths → `calculateLoopPoints()` in `audioTiming.ts`
- [x] Music presets → `MUSIC_PRESETS` (ambient, energetic, subtle, tutorial, cinematic)

#### Sound Effects
- [x] Sound effect component → `SoundEffect.tsx`
- [x] SFX presets → `SFX_PRESETS` (transition, appear, emphasis, uiFeedback, success)
- [x] Sound effect timing utilities → `startFrame` prop, offset support
- [x] Shortcut components → `TransitionSound`, `AppearSound`, `EmphasisSound`

#### Audio Mixing
- [x] Multi-track audio management → `AudioLayer.tsx`, `AudioTrack` type
- [x] Volume ducking (lower music during narration) → `duckVolume()` in `volumeUtils.ts`
- [x] Fade in/out utilities → `fadeIn()`, `fadeOut()`, `fadeInOut()`
- [x] Audio crossfades → `crossfadeVolumes()` in `volumeUtils.ts`
- [x] Ducking presets → `DUCKING_PRESETS` (standard, gentle, aggressive, speech)

#### Audio Timing Utilities
- [x] Frame/time conversion → `secondsToFrames()`, `framesToSeconds()`, `msToFrames()`
- [x] Beat synchronization → `calculateBeatFrames()`, `isOnBeat()`, `getNearestBeatFrame()`
- [x] Timecode formatting → `framesToTimecode()`, `formatDuration()`
- [x] Audio offset calculation → `calculateAudioOffset()` for sync

#### Track Creation Helpers
- [x] `createTrack()` - Generic track configuration
- [x] `createMusicTrack()` - Music-specific defaults
- [x] `createNarrationTrack()` - Voice-over defaults
- [x] `createSFXTrack()` - Sound effect defaults

**Files Created:**
- `src/audio/types.ts` - Type definitions for audio system
- `src/audio/presets.ts` - Music, SFX, and ducking presets
- `src/audio/utils/volumeUtils.ts` - Volume calculation utilities
- `src/audio/utils/audioTiming.ts` - Timing conversion utilities
- `src/audio/utils/index.ts` - Utils barrel export
- `src/audio/components/BackgroundMusic.tsx` - Background music component
- `src/audio/components/SoundEffect.tsx` - Sound effect component
- `src/audio/components/AudioLayer.tsx` - Multi-track audio management
- `src/audio/components/index.ts` - Components barrel export
- `src/audio/index.ts` - Main barrel export
- `src/demos/AudioDemo.tsx` - Phase 14 demo composition

**Files Modified:**
- `src/demos/index.ts` - Added AudioDemo export
- `src/Root.tsx` - Registered AudioDemo composition

---

### Phase 17: Video Strategy System ✅ COMPLETED (2026-01-24)
**Priority**: High | **Impact**: Production Quality

Strategic planning system for purposeful video creation.

#### Video Planning Template
- [x] Pre-production planning template → `projects/templates/video-plan.md`
- [x] Content analysis framework (topic type, tone, density)
- [x] Visual strategy checklist (backgrounds, effects, transitions)
- [x] Scene composition table
- [x] Audio strategy guide

#### Component Catalog
- [x] Comprehensive component reference → `docs/component-catalog.md`
- [x] Quick visual reference grid
- [x] Usage guidelines per component
- [x] Combination recommendations

#### Visual Strategy Guide
- [x] Topic-to-visual mapping → `docs/visual-strategy-guide.md`
- [x] Combination patterns (Academic, Data Story, Narrative)
- [x] Mood-based style guides
- [x] Anti-patterns documentation

#### New Components
- [x] **CaptionText** - TikTok-style word-by-word captions → `src/shared/templates/animations/CaptionText.tsx`
- [x] **CodeBlock** - Animated code display → `src/shared/templates/animations/CodeBlock.tsx`
- [x] **Audiogram** - Audio waveform visualization → `src/shared/components/visualizers/Audiogram.tsx`

**Files Created:**
- `docs/IMPLEMENTATION_PLAN.md` - Detailed implementation plan
- `docs/component-catalog.md` - Comprehensive component reference
- `docs/visual-strategy-guide.md` - Topic-to-visual mapping guide
- `projects/templates/video-plan.md` - Video pre-production template
- `src/shared/templates/animations/CaptionText.tsx` - TikTok-style captions
- `src/shared/templates/animations/CodeBlock.tsx` - Animated code display
- `src/shared/components/visualizers/Audiogram.tsx` - Audio visualization
- `src/shared/components/visualizers/index.ts` - Visualizers barrel export
- `src/shared/templates/scenes/NewsTemplate.tsx` - Breaking news style
- `src/shared/templates/scenes/InterviewTemplate.tsx` - Dialogue/conversation style
- `src/shared/templates/scenes/ProductShowcaseTemplate.tsx` - Product review style
- `.claude/agents/video-researcher.md` - Research agent
- `.claude/agents/video-narrator.md` - Narration agent
- `.claude/agents/video-planner.md` - Planning agent
- `.claude/agents/video-producer.md` - Orchestrator agent

**Files Modified:**
- `src/shared/templates/animations/index.ts` - Added CaptionText, CodeBlock exports
- `src/shared/components/index.ts` - Added visualizers export
- `src/shared/templates/scenes/index.ts` - Added News, Interview, ProductShowcase exports

**See**: `docs/IMPLEMENTATION_PLAN.md` for detailed implementation plan

#### Video Production Agents
- [x] **video-researcher** - Analyzes source, conducts web research, enriches content
- [x] **video-narrator** - Creates structured narration scripts with storytelling principles
- [x] **video-planner** - Selects optimal templates, components, effects
- [x] **video-producer** - Master orchestrator that chains all agents

---

### Phase 18: Template UX Improvements ✅ COMPLETED (2026-01-24)
**Priority**: High | **Impact**: Visual Quality

Improve readability and visual balance for 1080p video output.

#### Template Size Optimization
- [x] **DataVisualizationTemplate** - Bar/chart sizes increased (barWidth 80→160, maxBarHeight 300→500)
- [x] **TimelineTemplate** - Marker/font sizes increased (marker 24→40, line 3→5)
- [x] **NewsTemplate** - keyPoints font increased (md→xl)
- [x] **OutroTemplate** - takeaways font increased (md→xl)
- [x] **ContentTemplate** - items/paragraphs/highlight sizes increased
- [x] **QuoteTemplate** - attribution/context font increased

#### AnimatedText Word Grouping
- [x] Intelligent word grouping for proper line breaks
- [x] Keep names together (e.g., "- Daniel Kokotajlo" stays on one line)
- [x] Keep parenthetical content together
- [x] `word-break: keep-all` for Korean text support
- [x] Flexbox-based layout with `justifyContent: center`

**Files Modified:**
- `src/shared/templates/animations/AnimatedText.tsx` - Word grouping logic
- `src/shared/templates/scenes/DataVisualizationTemplate.tsx` - Size increases
- `src/shared/templates/scenes/TimelineTemplate.tsx` - Size increases
- `src/shared/templates/scenes/NewsTemplate.tsx` - Size increases
- `src/shared/templates/scenes/OutroTemplate.tsx` - Size increases
- `src/shared/templates/scenes/ContentTemplate.tsx` - Size increases, word-break
- `src/shared/templates/scenes/QuoteTemplate.tsx` - Size increases, word-break

---

### Phase 15: Testing & Quality
**Priority**: Medium | **Impact**: Reliability

Establish comprehensive testing infrastructure.

#### Component Render Tests
- [ ] Jest + React Testing Library setup
- [ ] Snapshot testing for components
- [ ] Animation frame testing
- [ ] Props validation tests

#### Visual Regression Tests
- [ ] Frame comparison tests
- [ ] Golden image testing
- [ ] Cross-resolution testing
- [ ] Color accuracy validation

#### Performance Benchmarks
- [ ] Render time tracking
- [ ] Memory usage monitoring
- [ ] Bundle size analysis
- [ ] Animation performance profiling

#### Integration Tests
- [ ] TTS generation tests
- [ ] Audio sync validation
- [ ] Full video render tests
- [ ] Output format verification

---

### Phase 16: Platform Optimization
**Priority**: Medium | **Impact**: Reach

Optimize for multiple video platforms.

#### Short-Form Vertical (9:16)
- [ ] TikTok format (1080x1920)
- [ ] Instagram Reels
- [ ] YouTube Shorts
- [ ] Vertical template variants

#### LinkedIn Video
- [ ] Square format (1080x1080)
- [ ] Professional styling
- [ ] Caption-friendly layouts
- [ ] Branded templates

#### Auto Subtitles/Captions
- [ ] Speech-to-text integration
- [ ] SRT/VTT generation
- [ ] Burned-in subtitle option
- [ ] Subtitle styling system

#### Platform-Specific Assets
- [ ] Platform thumbnail generators
- [ ] Aspect ratio auto-adaptation
- [ ] Platform metadata templates
- [ ] Preview generation

---

## 🔮 Future Vision

### Plugin Architecture
- Extensible template system
- Third-party component plugins
- Custom animation plugins
- Theme/style plugins

### AI-Assisted Creation
- AI scene suggestion from scripts
- Auto-layout optimization
- Smart timing recommendations
- Content summarization for videos

### Real-Time Collaboration
- Multi-user editing
- Live preview sharing
- Comment/annotation system
- Version control integration

### Advanced Rendering
- Cloud rendering support
- Distributed rendering
- Real-time preview optimization
- HDR output support

---

## 📈 Priority Matrix

| Phase | Priority | Complexity | Impact | Status |
|-------|----------|------------|--------|--------|
| 10: Animation Enhancement | 🔴 High | Medium | High | ✅ Done |
| 11: Template Expansion | 🔴 High | Medium | High | ✅ Done |
| 12: Visual Effects | 🟡 Medium | High | Medium | ✅ Done |
| 13: Component Library | 🔴 High | High | High | ✅ Done |
| 14: Audio Enhancement | 🟡 Medium | Medium | Medium | ✅ Done |
| 15: Testing & Quality | 🟡 Medium | Medium | High | Pending |
| 16: Platform Optimization | 🟡 Medium | Low | High | Pending |
| 17: Video Strategy System | 🔴 High | Medium | High | ✅ Done |

---

## 📁 Project Structure

```
remotion-studio/
├── src/
│   ├── components/          # 재사용 컴포넌트
│   │   ├── cards/           # TitleCard, QuoteCard, etc.
│   │   ├── layouts/         # ComparisonLayout, Stack, Grid, Split
│   │   ├── backgrounds/     # AnimatedGradient, ParticleField, FloatingShapes
│   │   ├── effects/         # Vignette, LightLeak, FilmGrain, etc.
│   │   ├── charts/          # BarChart, LineChart, PieChart
│   │   ├── progress/        # CountUp, ProgressBar, ProgressCircle, StepIndicator
│   │   └── icons/           # Icon, AnimatedIcon (Lucide wrapper)
│   ├── templates/           # 애니메이션 & 씬 템플릿
│   │   ├── animations/      # fadeIn, TypewriterText, GlitchText, etc.
│   │   └── scenes/          # IntroTemplate, ContentTemplate, etc.
│   ├── config/              # Zod 스키마 & 검증
│   ├── hooks/               # useSceneFrame, etc.
│   ├── utils/               # 유틸리티 함수
│   ├── obsidian/            # Obsidian 연동
│   ├── sources/             # 다중 소스 파서 (PDF, DOCX, Web)
│   ├── i18n/                # 다국어 지원 (번역, TTS)
│   ├── youtube/             # YouTube 최적화
│   ├── demos/               # 데모 컴포지션
│   └── __tests__/           # 테스트
├── scripts/                 # CLI 스크립트
├── public/audio/            # TTS 오디오
└── CLAUDE.md                # 프로젝트 컨텍스트
```

---

## 🔧 Commands

```bash
# 개발
npm run dev              # Remotion Studio 시작
npm run build            # 번들 빌드
npm run lint             # ESLint + TypeScript 검사
npm run test             # 테스트 실행
npm run test:coverage    # 커버리지 리포트

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

## 📦 Dependencies

```json
{
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "@remotion/transitions": "^4.0.409",
    "@remotion/motion-blur": "^4.0.409",
    "@remotion/noise": "^4.0.409",
    "@remotion/zod-types": "^4.0.0",
    "lucide-react": "^0.x",
    "pdf-parse": "^2.x",
    "mammoth": "^1.x",
    "cheerio": "^1.x",
    "remotion": "^4.0.0",
    "zod": "3.22.3"
  }
}
```

---

## 🔑 Environment Variables

```bash
# .env
OPENAI_API_KEY=sk-...        # TTS, 번역
ELEVENLABS_API_KEY=...       # 고품질 TTS
DEEPL_API_KEY=...            # 고품질 번역 (선택)
```

---

## 🛠 Implementation Guidelines

### Development Principles
1. **Backward Compatibility** - New features should not break existing compositions
2. **Progressive Enhancement** - Core functionality first, enhancements second
3. **Documentation First** - Document components before implementation
4. **Performance Aware** - Monitor render performance impact

### Contribution Flow
1. Create feature branch from `master`
2. Implement with tests
3. Update documentation
4. Submit PR with demo video

### Quality Gates
- All components must have TypeScript types
- Zod schemas for all props
- Animation performance < 60fps warning
- Bundle size monitoring

---

## 📝 Notes

- Phases can be developed in parallel where dependencies allow
- Community feedback will influence priority adjustments
- Each phase completion triggers a minor version bump
- Major visual changes require approval process

---

*This roadmap is a living document and will be updated as the project evolves.*
