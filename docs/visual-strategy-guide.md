# Visual Strategy Guide

**Purpose**: Topic-to-visual mapping for purposeful video design
**Last Updated**: 2026-01-30

---

## Core Principle

> **Content drives visuals, not the other way around.**
>
> Before selecting any component, ask:
> 1. What is the topic type?
> 2. What emotional tone should this convey?
> 3. How dense is the information?
> 4. What is the core message?

---

## Topic Type Mapping

### Philosophical / Abstract Content
**Examples**: Life lessons, ethics, psychology, self-help critique

| Element | Recommendation | Rationale |
|---------|---------------|-----------|
| **Background** | `AnimatedGradient` (mode: `pulse` or `cycle`) | Evokes thought, introspection |
| **Effects** | `Vignette` (0.5), `FilmGrain` (subtle) | Cinematic depth, timeless feel |
| **Transitions** | `dissolve`, `fade` | Smooth, contemplative flow |
| **Templates** | `ContentTemplate`, `QuoteTemplate`, `StoryTemplate` | Space for ideas to breathe |
| **Text Style** | `TypewriterText`, `RevealText` (word mode) | Deliberate, thoughtful pacing |
| **Pacing** | Slower scenes (8-12 seconds each) | Allow absorption |

**Avoid**: Rapid transitions, bright particle effects, data charts (unless supporting philosophical point)

---

### Data-Driven Content
**Examples**: Statistics, research findings, surveys, market analysis

| Element | Recommendation | Rationale |
|---------|---------------|-----------|
| **Background** | `FloatingShapes` (hexagon/square), Solid dark | Clean, professional, organized |
| **Effects** | Minimal or `Vignette` (light, 0.3) | Don't distract from data |
| **Transitions** | `slide`, `wipe` | Clear directional movement |
| **Templates** | `DataVisualizationTemplate`, `TimelineTemplate`, `ComparisonTemplate` | Data-first design |
| **Charts** | `BarChart`, `LineChart`, `PieChart` | Appropriate visualization |
| **Progress** | `CountUp`, `ProgressBar` | Animated numbers |
| **Pacing** | Medium (6-10 seconds per data point) | Time to read and understand |

**Avoid**: `FilmGrain`, `LightLeak`, overly artistic transitions, `GlitchText`

---

### Narrative / Story Content
**Examples**: Case studies, biographies, user journeys, historical accounts

| Element | Recommendation | Rationale |
|---------|---------------|-----------|
| **Background** | `AnimatedGradient` (mode: `cycle`), Mood-based colors | Emotional undertones |
| **Effects** | `LightLeak` (for warm moments), `Vignette` | Cinematic storytelling |
| **Transitions** | `dissolve` (time passage), `zoomIn/Out` (emphasis) | Narrative flow |
| **Templates** | `StoryTemplate`, `QuoteTemplate`, `ImageTemplate` | Story-centric design |
| **Text Style** | `RevealText` (line mode) | Dramatic reveals |
| **Pacing** | Variable (fast/slow based on tension) | Rhythm matters |

**Key**: Match visual intensity to narrative beats

---

### Technical / Tutorial Content
**Examples**: How-to guides, code explanations, process documentation

| Element | Recommendation | Rationale |
|---------|---------------|-----------|
| **Background** | Solid dark (`#1a1a2e`), `ParticleField` (sparse), `GridPattern` (lines/dots) | Focus on content, modern tech feel |
| **Effects** | None or minimal `Vignette`, `ChromaticAberration` (subtle, 0.1-0.2) | Clarity with subtle tech aesthetic |
| **Transitions** | `slide`, `fade` | Predictable, non-distracting |
| **Templates** | `ContentTemplate`, `AnnotationTemplate`, `TableListTemplate` | Information delivery |
| **Text Style** | `HighlightText`, `TypewriterText`, `StaggerGroup` | Code-like, precise, sequential reveals |
| **Progress** | `StepIndicator` | Clear progression |
| **Pacing** | Consistent (5-8 seconds per concept) | Learnable rhythm |

**Avoid**: `GlitchText` (intense), `LightLeak`, dramatic effects, `Bloom`

**New Recommendations**:
- Use `GridPattern` (type: 'dots') for modern programming tutorials
- Use `ChromaticAberration` (intensity: 0.15) sparingly for tech accent
- Use `StaggerGroup` for revealing code steps or bullet points

---

## Text Sizing Strategy

### When to Use Auto-Sizing Text (FitText Components)

**Decision Flow:**
```
Is text length predictable and short (<30 chars)?
├─ YES → Use regular text (TypewriterText, RevealText, etc.)
└─ NO → Does it need to fit a specific container?
    ├─ YES → Use FitText components
    └─ NO → Use regular text with appropriate font size
```

### Component Selection

| Scenario | Component | Example |
|----------|-----------|---------|
| Video title (varies by language) | `FitTitle` | "자기계발서의 숨겨진 진실" vs "Hidden Truth of Self-Help Books" |
| Scene subtitle (longer than expected) | `FitSubtitle` | Dynamic taglines, contextual subtitles |
| Custom text fitting | `FitText` | Custom styled text that must fit |
| Quote that varies in length | `FitMultilineText` | User testimonials, varying quotes |
| Short, fixed title | Regular text | "Chapter 1", "결론" |

### Best Practices

**DO:**
- Use `FitTitle` for main scene titles when text length varies
- Set appropriate `maxWidth` based on safe area (typically 1400-1600px)
- Test with longest expected text to ensure minimum font size is readable

**DON'T:**
- Use FitText for very short text (unnecessary overhead)
- Set `minFontSize` too small (below 32px becomes hard to read in video)
- Ignore the `fitsAtMax` return value when debugging sizing issues

### Example Usage

```tsx
// Good: Dynamic title that may vary
<FitTitle maxWidth={1500}>
  {sceneTitle}  // Could be 10 or 50 characters
</FitTitle>

// Good: Multi-line quote
<FitMultilineText maxWidth={1200} maxLines={3}>
  {quote}  // Varying length quotes
</FitMultilineText>

// Bad: Short fixed text (use regular styling instead)
<FitTitle>Chapter 1</FitTitle>  // Overkill for 9 characters
```

---

## Vector Animation (Lottie) Strategy

### When to Use Lottie Animations

**Decision Flow:**
```
Need animated visual element?
├─ Is it a simple state indicator (loading, success, error)?
│   └─ YES → Use preset components (LoadingSpinner, SuccessCheck, etc.)
├─ Is it a complex custom animation?
│   └─ YES → Use LottieAnimation with custom JSON
├─ Is it photo-realistic or detailed?
│   └─ YES → Use GIF or Video instead
└─ Is it a static icon?
    └─ YES → Use emoji or SVG instead
```

### Preset Components

| State | Component | Asset Required |
|-------|-----------|----------------|
| Loading/Processing | `LoadingSpinner` | `public/lottie/loading-spinner.json` |
| Success/Completion | `SuccessCheck` | `public/lottie/success-check.json` |
| Error/Failure | `ErrorAnimation` | `public/lottie/error-x.json` |
| Celebration | `ConfettiAnimation` | `public/lottie/confetti.json` |

### Content Type Mapping

| Content Type | Lottie Usage | Examples |
|--------------|--------------|----------|
| Technical | `LoadingSpinner`, `SuccessCheck` | Process completions, API responses |
| Tutorial | `SuccessCheck` after steps | Step completion indicators |
| Celebratory | `ConfettiAnimation` | Achievements, milestones |
| Error States | `ErrorAnimation` | Failed operations, warnings |

### Best Practices

**DO:**
- Place Lottie JSON files in `public/lottie/`
- Use `fadeIn` and `scaleIn` for smooth entry animations
- Set appropriate `size` for visibility (100-300px typically)

**DON'T:**
- Use Lottie for simple icons (emoji or SVG is lighter)
- Loop animations that should play once (success, error)
- Use very large Lottie files (>500KB) - impacts render time

### Finding Lottie Animations

- LottieFiles: https://lottiefiles.com/
- IconScout: https://iconscout.com/lottie-animations
- Lordicon: https://lordicon.com/

---

## GIF Playback Strategy

### When to Use GIFs

**Decision Flow:**
```
Need embedded visual content?
├─ Is it meme/reaction content?
│   └─ YES → Use ReactionGif
├─ Is it a full-width ambient visual?
│   └─ YES → Use BannerGif
├─ Is it a quick demonstration?
│   └─ YES → Use GifPlayer
├─ Does it need high quality/resolution?
│   └─ YES → Use Video instead
└─ Is it a simple animation?
    └─ YES → Use Lottie instead
```

### Component Selection

| Use Case | Component | Configuration |
|----------|-----------|---------------|
| Meme reactions | `ReactionGif` | Circular, shadow, size: 150-250px |
| General GIF | `GifPlayer` | Custom width/height, fit mode |
| Scene dividers | `BannerGif` | Full width, height: 200-400px |

### Content Appropriateness

| Content Type | GIF Suitability | Alternative |
|--------------|-----------------|-------------|
| Philosophical | ❌ Low | AnimatedGradient, Vignette |
| Data-Driven | ❌ Low | Charts, DataVisualizationTemplate |
| Humorous/Casual | ✅ High | - |
| Tutorial | ⚠️ Medium | Screen recording video |
| Narrative | ⚠️ Medium | StoryTemplate panels |

### Best Practices

**DO:**
- Place GIF files in `public/gifs/`
- Use `fit="cover"` for ReactionGif to fill circular container
- Use `fadeIn` for smooth entry
- Keep GIF file sizes reasonable (<5MB)

**DON'T:**
- Use GIFs for serious/professional content
- Use very long GIFs (>10 seconds) - use video instead
- Use GIFs when Lottie animations would be smoother

### GIF Sources

- GIPHY: https://giphy.com/
- Tenor: https://tenor.com/
- Custom screen recordings

---

### Critical / Analytical Content
**Examples**: Critique, comparison analysis, pros/cons, evaluations

| Element | Recommendation | Rationale |
|---------|---------------|-----------|
| **Background** | Solid dark, `AnimatedGradient` (subtle) | Serious, professional |
| **Effects** | `Vignette` (medium) | Focused attention |
| **Transitions** | `wipe` (comparisons), `fade` | Clean, deliberate |
| **Templates** | `ComparisonTemplate`, `ContentTemplate`, `QuoteTemplate` | Balanced presentation |
| **Layout** | `Split`, `ComparisonLayout` | Side-by-side analysis |
| **Colors** | Contrasting colors for opposing views | Visual distinction |
| **Pacing** | Balanced (7-10 seconds) | Fair treatment |

---

## Emotional Tone Mapping

### Serious / Heavy
- Colors: Dark palette (`#1a1a2e`, `#16213e`)
- Effects: `Vignette` (heavy), `FilmGrain`
- Transitions: `dissolve`, slow `fade`
- Speed: Slower overall

### Inspirational / Uplifting
- Colors: Warm gradient (`#667eea` → `#764ba2`)
- Effects: `LightLeak` (gradient type)
- Transitions: `zoomIn`, upward `slide`
- Background: `AnimatedGradient` (pulse mode)

### Critical / Questioning
- Colors: Cooler tones, high contrast
- Effects: `Vignette` (focused)
- Transitions: `wipe` (directional)
- Text: `HighlightText` for key points

### Calm / Educational
- Colors: Muted, balanced
- Effects: Minimal
- Transitions: `fade`, gentle `slide`
- Pacing: Consistent, predictable

### Dynamic / Energetic
- Colors: Bright accents (`#00c2ff`, `#e67e22`)
- Background: `ParticleField` (fast), `FloatingShapes`
- Transitions: Quick `slide`, `zoomIn`
- Pacing: Faster scenes (4-6 seconds)

---

## New Effects Usage Guide

### Effect-to-Content Mapping

| Effect | Best For | Avoid For |
|--------|----------|-----------|
| `CameraMotionBlur` | Fast transitions, action sequences, dynamic reveals | Static data, calm explanations |
| `ChromaticAberration` | Tech content, retro aesthetics, impact moments | Data analysis, educational content |
| `GlitchEffect` | Tech themes, error states, tension/drama | Philosophical, calming content |
| `ColorGrading` | All content (preset-dependent) | - |
| `Bloom` | Dramatic highlights, sci-fi, magical moments | Text-heavy scenes (reduces readability) |

### ColorGrading Preset Guide

| Preset | Mood/Feeling | Best Content Types |
|--------|--------------|-------------------|
| `cinematic` | Professional, serious, film-like | Storytelling, documentaries, case studies |
| `vintage` | Nostalgic, warm, retro | Historical content, retrospectives, memories |
| `cold` | Analytical, detached, serious | Data analysis, critiques, technical reviews |
| `warm` | Friendly, inviting, positive | Inspirational, motivational, tutorials |
| `noir` | Mysterious, dramatic, artistic | Philosophical, noir themes, dramatic reveals |
| `teal-orange` | Modern cinematic, Hollywood | General content, interviews, vlogs |

### Effect Intensity Guidelines

```
SUBTLE (0.1-0.3):
  - ChromaticAberration: Accent only, barely noticeable
  - GlitchEffect: Brief flickers, not distracting
  - Bloom: Soft glow, maintains readability

MEDIUM (0.4-0.6):
  - ChromaticAberration: Visible but not overwhelming
  - GlitchEffect: Clear digital aesthetic
  - Bloom: Noticeable highlights

INTENSE (0.7-1.0):
  - ChromaticAberration: Strong retro/distortion look
  - GlitchEffect: Heavy distortion, dramatic
  - Bloom: Dramatic glow, reduced readability
```

### Effect Combinations (Safe)

| Combination | Effect | Use Case |
|-------------|--------|----------|
| `ColorGrading` + `Vignette` | Cinematic depth | Most content types |
| `ChromaticAberration` + `GlitchEffect` | Heavy tech aesthetic | Tech content, errors |
| `Bloom` + `ColorGrading (warm)` | Dreamy, magical | Inspirational moments |
| `CameraMotionBlur` + `ChromaticAberration` | Dynamic action | Fast sequences |

### Effect Combinations (Avoid)

| Combination | Problem |
|-------------|---------|
| `FilmGrain` + `NoiseTexture` | Redundant noise |
| `GlitchEffect` + `Bloom` | Visual confusion |
| `ChromaticAberration` (intense) + `ColorGrading` | Unpredictable color shifts |

---

## Background Selection (Extended)

### Background-to-Content Mapping

| Content Type | Primary Options | New Options |
|--------------|-----------------|-------------|
| Tech/Tutorial | `ParticleField` (sparse) | `GridPattern` (lines/dots) |
| Data-Driven | `FloatingShapes` | `GridPattern` (squares) |
| Film/Vintage | - | `NoiseTexture` (grain) |
| Modern/Clean | Solid color | `GridPattern` (hexagons) |
| Professional | `AnimatedGradient` (subtle) | `GridPattern` (lines) |

### GridPattern Type Guide

| Grid Type | Aesthetic | Best For |
|-----------|-----------|----------|
| `lines` | Clean, technical | Programming, tutorials, minimalist |
| `dots` | Modern, subtle | General tech, dashboards |
| `squares` | Structured, organized | Data content, grids, tables |
| `hexagons` | Futuristic, organic | Science, nature-tech fusion |

### NoiseTexture Type Guide

| Noise Type | Effect | Best For |
|------------|--------|----------|
| `static` | TV static, digital | Glitch themes, errors |
| `perlin` | Smooth, flowing | Abstract backgrounds, organic |
| `grain` | Film-like texture | Cinematic, vintage |
| `stipple` | Dotted, artistic | Artistic, illustration style |

---

## Scene Pattern Templates

### Academic Pattern
**For**: Educational, philosophical, research-based content

```
Intro (10s)
  └─ IntroTemplate + AnimatedGradient
Content 1-3 (8-10s each)
  └─ ContentTemplate + bullet points
Quote (8s)
  └─ QuoteTemplate + LightLeak
Comparison (12s)
  └─ ComparisonTemplate
Conclusion (8s)
  └─ ContentTemplate + key takeaways
Outro (8s)
  └─ OutroTemplate
```

**Transitions**: `dissolve` between sections, `fade` within sections

---

### Data Story Pattern
**For**: Statistics-heavy, research findings, market analysis

```
Intro (8s)
  └─ IntroTemplate + hook statistic
Data 1 (10s)
  └─ DataVisualizationTemplate + BarChart
Content (8s)
  └─ ContentTemplate + interpretation
Data 2 (10s)
  └─ DataVisualizationTemplate + LineChart
Timeline (12s)
  └─ TimelineTemplate + progression
Conclusion (8s)
  └─ DataVisualizationTemplate + key metric
Outro (6s)
  └─ OutroTemplate
```

**Transitions**: `wipe` for data changes, `slide` for progression

---

### Narrative Pattern
**For**: Stories, case studies, biographical content

```
Hook (6s)
  └─ QuoteTemplate or ImageTemplate
Introduction (10s)
  └─ StoryTemplate + context setup
Rising Action (3-4 scenes, 8-10s each)
  └─ StoryTemplate panels + mood progression
Climax (12s)
  └─ ContentTemplate or QuoteTemplate (dramatic)
Resolution (8s)
  └─ StoryTemplate + outcome
Reflection (8s)
  └─ QuoteTemplate + takeaway
Outro (6s)
  └─ OutroTemplate
```

**Transitions**: `dissolve` for time passage, `zoomIn` for emphasis

---

### Tutorial Pattern
**For**: How-to, step-by-step, educational guides

```
Intro (6s)
  └─ IntroTemplate + what you'll learn
Overview (8s)
  └─ ContentTemplate + steps preview
Step 1-N (8-12s each)
  └─ AnnotationTemplate or ContentTemplate
      + StepIndicator progress
Demo (varies)
  └─ ImageTemplate or custom
Recap (8s)
  └─ ContentTemplate + checklist
Outro (6s)
  └─ OutroTemplate + next steps
```

**Transitions**: `slideLeft` for forward progress

---

### Comparison Pattern
**For**: Versus videos, product comparisons, theory analysis

```
Intro (8s)
  └─ IntroTemplate + what we're comparing
Option A Overview (10s)
  └─ ContentTemplate + key points
Option B Overview (10s)
  └─ ContentTemplate + key points
Direct Comparison (12s)
  └─ ComparisonTemplate + side-by-side
Deep Dive 1-2 (10s each)
  └─ ContentTemplate or DataVisualizationTemplate
Verdict (10s)
  └─ ContentTemplate or QuoteTemplate
Outro (6s)
  └─ OutroTemplate
```

**Transitions**: `wipe` for comparisons, `fade` otherwise

---

## Anti-Patterns to Avoid

### Visual Mismatch
- **DON'T**: Use `GlitchText` for serious philosophical content
- **DON'T**: Use `LightLeak` for data-heavy presentations
- **DON'T**: Use rapid transitions for calm, contemplative topics

### Effect Overload
- **DON'T**: Combine `FilmGrain` + `LightLeak` + `Vignette` unless intentional
- **DON'T**: Use multiple text animations in same scene
- **DON'T**: Stack background effects (pick one)

### Pacing Problems
- **DON'T**: Use 3-second scenes for complex explanations
- **DON'T**: Use 15-second scenes for simple bullet points
- **DON'T**: Vary pacing randomly without narrative reason

### Information Density Mismatch
- **DON'T**: Cram 10 data points in one `DataVisualizationTemplate`
- **DON'T**: Use sparse `ContentTemplate` when data would be clearer
- **DON'T**: Use `AnnotationTemplate` with 20+ annotations

---

## Quick Decision Matrix

| Content Type | Background | Effects | Primary Template | Transition |
|-------------|-----------|---------|-----------------|------------|
| Philosophy | AnimatedGradient(pulse) | Vignette, FilmGrain, ColorGrading(noir) | Content, Quote | dissolve |
| Data | FloatingShapes, GridPattern(squares) | Minimal, Vignette(light) | DataViz, Timeline | wipe, slide |
| Story | AnimatedGradient(cycle), NoiseTexture(grain) | LightLeak, Vignette, ColorGrading(cinematic) | Story, Image | dissolve, zoom |
| Tutorial | Solid dark, GridPattern(lines) | None or minimal | Annotation, Content | slide |
| Critical | Solid, AnimatedGradient | Vignette, ColorGrading(cold) | Comparison, Content | wipe, fade |
| Tech | GridPattern(dots), ParticleField | ChromaticAberration(subtle), Vignette | Content, Annotation | slide, fade |
| Dramatic | AnimatedGradient, NoiseTexture | GlitchEffect, Bloom, ChromaticAberration | Quote, Content | zoom, dissolve |

### Extended Decision Criteria

**When to use new effects:**

| Scenario | Effect Choice |
|----------|---------------|
| Fast-paced action or transitions | `CameraMotionBlur` (shutterAngle: 180) |
| Tech/programming content | `ChromaticAberration` (subtle) + `GridPattern` |
| Error or failure states | `GlitchEffect` (medium) |
| Establishing overall mood | `ColorGrading` (choose preset by tone) |
| Highlighting key moments | `Bloom` (threshold: 0.6) |
| Vintage/nostalgic feel | `NoiseTexture` (grain) + `ColorGrading` (vintage) |

**When to use new charts:**

| Data Pattern | Chart Choice |
|--------------|--------------|
| Cumulative changes (budget flow) | `WaterfallChart` |
| Multi-dimensional comparison | `RadarChart` |
| Correlation/intensity matrix | `HeatmapChart` |
| Before/after comparison | `ComparisonBars` |
| Progress toward goal | `GaugeChart` |

**When to use auto-sizing text (FitText):**

| Scenario | Component | Notes |
|----------|-----------|-------|
| Dynamic title length (>30 chars or varies) | `FitTitle` | Automatically scales to fit |
| Localized/translated titles | `FitTitle` | Different languages = different lengths |
| Variable-length subtitles | `FitSubtitle` | Maintains hierarchy with scaling |
| Quotes of varying length | `FitMultilineText` | Fits within line constraints |
| Short, fixed text (<20 chars) | Regular text | No auto-sizing needed |

**When to use Lottie animations:**

| Scenario | Component | Asset Required |
|----------|-----------|----------------|
| Success/completion feedback | `SuccessCheck` | `public/lottie/success-check.json` |
| Error/failure indication | `ErrorAnimation` | `public/lottie/error-x.json` |
| Loading/processing state | `LoadingSpinner` | `public/lottie/loading-spinner.json` |
| Celebration/achievement | `ConfettiAnimation` | `public/lottie/confetti.json` |
| Custom vector animation | `LottieAnimation` | Custom JSON in `public/lottie/` |

**When to use GIFs:**

| Scenario | Component | Notes |
|----------|-----------|-------|
| Meme/reaction content | `ReactionGif` | Circular, shadowed, engaging |
| Humorous moments | `ReactionGif` | Relatable, casual tone |
| Full-width ambient visual | `BannerGif` | Scene dividers, backgrounds |
| Quick demonstrations | `GifPlayer` | Lightweight, looping |
| Serious/professional content | ❌ Avoid GIFs | Use other components |

**When to use advanced transitions (Phase 6):**

| Scenario | Transition | Notes |
|----------|------------|-------|
| Conceptual shifts, thoughtful content | `morph` | Smooth, elegant - best for philosophical content |
| Forward/backward conceptual flow | `morphLeft` / `morphRight` | Directional morphing |
| Tech content, error states | `glitch` | Digital aesthetic - use sparingly |
| Climax moments, maximum impact | `glitchIntense` | Heavy distortion - use only for key reveals |
| Data list reveals | `blindsHorizontal` | Structured, rhythmic reveal |
| Side-by-side comparisons | `blindsVertical` | Creates visual separation |
| Emotional moments, change themes | `ripple` | Water/change metaphor - center origin |
| Unique corner reveals | `rippleCorner` | Asymmetric, distinctive feel |
| Hard cuts, quick pacing | `cut` | No transition effect |

**Transition Style Guide:**

| Content Type | Recommended | Avoid |
|--------------|-------------|-------|
| Philosophical | `morph`, `dissolve`, `fade` | `glitch`, `blinds` |
| Technical | `slide`, `fade`, `glitch` | `ripple`, `morph` |
| Emotional | `ripple`, `dissolve`, `morph` | `blinds`, `wipe` |
| Data-Driven | `blinds`, `wipe`, `slide` | `ripple`, `glitch` |
| Dramatic | `glitch`, `zoomIn`, `morph` | `fade`, `cut` |

---

## Color Harmony Guidelines

### Monochromatic (Single Color)
- **Use for**: Serious, focused content
- **Example**: Dark blues (`#1a1a2e` to `#16213e`)

### Complementary (Opposite Colors)
- **Use for**: Comparisons, contrasts
- **Example**: Blue vs Orange for A/B comparisons

### Analogous (Adjacent Colors)
- **Use for**: Harmonious, flowing content
- **Example**: Purple gradient (`#667eea` → `#764ba2`)

### Triadic (Three Evenly Spaced)
- **Use for**: Dynamic, varied content
- **Example**: Primary, accent, and success colors

---

## Multi-Format Strategy

### Video Format Presets

| Format | Resolution | Ratio | Platform |
|--------|-----------|-------|----------|
| LANDSCAPE | 1920×1080 | 16:9 | YouTube, Desktop |
| PORTRAIT | 1080×1920 | 9:16 | Shorts, TikTok, Reels |
| SQUARE | 1080×1080 | 1:1 | Instagram, Facebook |

### Format-Specific Adaptations

#### PORTRAIT (9:16) - Vertical Video

**Layout Adjustments**:
- Stack elements vertically instead of side-by-side
- Avoid `ComparisonTemplate` (use sequential scenes)
- Center-align all content
- Increase vertical spacing between elements

**Typography**:
- Title: 48px (down from 56px)
- Body: 24px (down from 28px)
- Increase line height to 1.6

**Safe Zones**:
- Top 8%: Platform UI (title, profile)
- Bottom 8%: Platform UI (buttons, CTA)
- Keep critical content in middle 84%

**Template Recommendations**:
| Standard Template | Portrait Alternative |
|-------------------|---------------------|
| ComparisonTemplate | 2 sequential ContentTemplates |
| DataVisualizationTemplate | Use vertical bar chart |
| TimelineTemplate | Vertical timeline (default) |

#### SQUARE (1:1) - Social Media

**Layout Adjustments**:
- Center-weighted compositions
- Balanced margins all sides
- Works well for data visualizations

**Typography**:
- Title: 48px
- Body: 26px
- More compact layouts needed

**Template Recommendations**:
- All templates work with minor adjustments
- `BarChart` in vertical orientation
- `PieChart` centered with labels

### Responsive Component Guidelines

When creating components, use the `useResponsive()` hook pattern:

```tsx
import { useVideoConfig } from "remotion";
import { detectFormat, getResponsiveFontSize } from "@shared/config/formats";

const { width, height } = useVideoConfig();
const format = detectFormat(width, height);

const titleSize = getResponsiveFontSize(56, format);
```

### Platform-Specific Considerations

| Platform | Format | Duration | Special Notes |
|----------|--------|----------|---------------|
| YouTube | 16:9 | 3-15 min | Long-form optimization |
| YouTube Shorts | 9:16 | ≤60s | Hook in first 3s |
| TikTok | 9:16 | 15-60s | Trending audio integration |
| Instagram Reels | 9:16 | ≤90s | Caption overlay space |
| Instagram Feed | 1:1 | ≤60s | Static thumbnail important |

---

## Cognitive Scaffolding in Visual Design

### Recap Scene Placement

For videos >3 minutes with multiple concepts:

```
Scene 1 (Hook)
Scene 2 (Content)
Scene 3 (Content)
Scene 4 (Content)
Scene 5 (RECAP) ← Insert RecapTemplate
Scene 6 (Content)
...
```

### Progress Indicators

Add visual progress for long content:
- Part X of Y labels
- Progress bar in corner
- Chapter markers

### Visual Bridging

Use transitions that signal relationship:

| Relationship | Transition |
|--------------|-----------|
| Same topic continues | `fade`, `dissolve` |
| New topic begins | `slide`, `wipe` |
| Contrast/twist | `zoomIn` |
| Time passage | `dissolve` (longer) |
| Recap/summary | `fade` (with blur) |

---

## Related Documents

- `docs/component-catalog.md` - Full component reference
- `projects/templates/video-plan.md` - Pre-production planning template
- `Roadmap.md` - Development roadmap
