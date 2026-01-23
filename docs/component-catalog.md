# Component Catalog

**Remotion Studio Component Library Reference**
**Last Updated**: 2026-01-24
**Total Components**: 50+

---

## Quick Reference

| Category | Components | Import From |
|----------|-----------|-------------|
| Scene Templates | 13 | `@shared/templates/scenes` |
| Backgrounds | 3 | `@shared/components/backgrounds` |
| Effects | 5 | `@shared/components/effects` |
| Text Animations | 4 | `@shared/templates/animations` |
| Charts | 3 | `@shared/components/charts` |
| Progress | 4 | `@shared/components/progress` |
| Layouts | 4 | `@shared/components/layouts` |
| Audio | 3+ | `@shared/audio` |
| Icons | 2 | `@shared/components/icons` |
| Transitions | 10+ | `@shared/transitions` |

---

## Scene Templates

### IntroTemplate
**Purpose**: Video opening with title animation

**Props**:
```typescript
{
  title: string;
  subtitle?: string;
  preTitle?: string;
  titleColor?: string;
  durationInFrames: number;
  backgroundComponent?: React.ReactNode;
  effects?: EffectsConfig;
}
```

**When to Use**:
- First 5-15 seconds of video
- Establishing topic and tone
- Brand introduction

**Avoid When**:
- Videos < 30 seconds (too much overhead)
- Immediate action required

**Combinations**:
- `AnimatedGradient` + `fadeInUp` for elegant intro
- `ParticleField` for tech topics
- `Vignette` for cinematic feel

---

### ContentTemplate
**Purpose**: Main content presentation

**Props**:
```typescript
{
  title: string;
  content: string | React.ReactNode;
  bullets?: string[];
  icon?: string;
  durationInFrames: number;
  backgroundComponent?: React.ReactNode;
}
```

**When to Use**:
- Core explanations
- List of points
- General information delivery

**Combinations**:
- 3-5 ContentTemplates for academic pattern
- Pair with `TypewriterText` for emphasis
- Use `HighlightBox` for key terms

---

### ComparisonTemplate
**Purpose**: Side-by-side analysis

**Props**:
```typescript
{
  title: string;
  leftCard: CardData;
  rightCard: CardData;
  vsText?: string;
  durationInFrames: number;
}
```

**When to Use**:
- Pros vs Cons
- Before/After
- Option A vs Option B
- Theory vs Practice

**Visual Tips**:
- Use contrasting colors for cards
- Keep item count balanced (3-5 per side)
- `wipe` transition works well

---

### QuoteTemplate
**Purpose**: Quote or key insight highlight

**Props**:
```typescript
{
  quote: string;
  author?: string;
  source?: string;
  durationInFrames: number;
  quoteStyle?: 'centered' | 'left' | 'dramatic';
}
```

**When to Use**:
- Expert quotes
- Key takeaways
- Memorable phrases
- Transitions between sections

**Combinations**:
- `LightLeak` for warmth
- `FilmGrain` for vintage feel
- `dissolve` transition in/out

---

### OutroTemplate
**Purpose**: Video closing with CTA

**Props**:
```typescript
{
  title?: string;
  subtitle?: string;
  cta?: string;
  socialLinks?: string[];
  durationInFrames: number;
}
```

**When to Use**:
- Last 5-15 seconds
- Call to action
- Subscribe reminder

---

### DataVisualizationTemplate
**Purpose**: Chart and statistical display

**Props**:
```typescript
{
  title: string;
  chartType: 'bar' | 'horizontalBar' | 'progress' | 'metric';
  data: DataItem[];
  source?: string;
  highlight?: string;
  durationInFrames: number;
}
```

**When to Use**:
- Statistics presentation
- Survey results
- Numerical comparisons
- Progress indicators

**Combinations**:
- `FloatingShapes` background
- `slide` or `wipe` transitions
- Pair with `CountUp` for numbers

---

### TimelineTemplate
**Purpose**: Chronological event display

**Props**:
```typescript
{
  title: string;
  events: TimelineEvent[];
  orientation?: 'horizontal' | 'vertical';
  highlight?: string;
  durationInFrames: number;
}
```

**When to Use**:
- Historical progression
- Process steps
- Development phases
- Biography milestones

**Visual Tips**:
- 4-6 events maximum
- Use icons for visual anchors
- `highlight` for current event

---

### ImageTemplate
**Purpose**: Image-centric content

**Props**:
```typescript
{
  images: ImageItem[];
  layout: 'single' | 'side-by-side' | 'gallery';
  effect?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'reveal';
  title?: string;
  durationInFrames: number;
}
```

**When to Use**:
- Ken Burns effect sequences
- Before/after comparisons
- Photo galleries
- Product showcases

---

### AnnotationTemplate
**Purpose**: Diagram with labels

**Props**:
```typescript
{
  backgroundImage?: string;
  annotations: Annotation[];
  style?: 'tooltip' | 'callout' | 'label';
  pointerType?: 'arrow' | 'line' | 'dot';
  revealMode?: 'sequential' | 'all';
  durationInFrames: number;
}
```

**When to Use**:
- Technical diagrams
- Infographics
- UI explanations
- Anatomy/structure breakdowns

---

### StoryTemplate
**Purpose**: Narrative flow

**Props**:
```typescript
{
  panels: StoryPanel[];
  layout?: 'single' | 'split' | 'sequence';
  character?: { name: string; avatar: string };
  narrator?: { text: string; style: 'quote' | 'caption' };
  durationInFrames: number;
}
```

**When to Use**:
- Case studies
- User journeys
- Storytelling sequences
- Scenario walkthroughs

---

### NewsTemplate
**Purpose**: Breaking news and headline style

**Props**:
```typescript
{
  newsStyle?: 'breaking' | 'headline' | 'update' | 'alert';
  banner?: string;
  headline: string;
  subheadline?: string;
  keyPoints?: string[];
  source?: string;
  timestamp?: string;
  location?: string;
  showTicker?: boolean;
  tickerText?: string;
  durationInFrames: number;
}
```

**When to Use**:
- Urgent announcements
- News-style content
- Alert/update presentations

**Combinations**:
- Solid dark background
- `wipe` or `slide` transitions
- Minimal effects for clarity

---

### InterviewTemplate
**Purpose**: Dialogue and conversation style

**Props**:
```typescript
{
  layout?: 'split' | 'focus' | 'stacked' | 'bubble';
  topic?: string;
  speakers: [Speaker, Speaker];
  dialogue: DialogueEntry[];
  activeSpeaker?: number;
  showAvatars?: boolean;
  durationInFrames: number;
}

interface Speaker {
  name: string;
  role?: string;
  avatar?: string;
  color?: string;
}

interface DialogueEntry {
  speakerIndex: number;
  text: string;
  emphasis?: boolean;
}
```

**When to Use**:
- Interview content
- Q&A sessions
- Debates
- Conversational explanations

**Layouts**:
- `split`: Side-by-side panels with avatars
- `focus`: Single speaker focus with quote
- `bubble`: Chat bubble style dialogue
- `stacked`: Vertical dialogue flow

---

### ProductShowcaseTemplate
**Purpose**: Product presentation and review style

**Props**:
```typescript
{
  layout?: 'hero' | 'features' | 'specs' | 'comparison' | 'pricing';
  productName: string;
  tagline?: string;
  productImage?: string;
  badge?: string;
  features?: FeatureItem[];
  specs?: SpecItem[];
  price?: string;
  originalPrice?: string;
  rating?: RatingInfo;
  ctaText?: string;
  durationInFrames: number;
}
```

**When to Use**:
- Product reviews
- Feature presentations
- Sales/promotional content
- Tech showcases

**Layouts**:
- `hero`: Large product image with info
- `features`: Feature grid
- `specs`: Specification list
- `comparison`: Feature comparison
- `pricing`: Pricing display

---

## Backgrounds

### AnimatedGradient
**Purpose**: Dynamic gradient backgrounds

**Props**:
```typescript
{
  colors?: string[];
  mode?: 'cycle' | 'rotate' | 'shift' | 'pulse';
  speed?: number;
  angle?: number;
}
```

**Modes**:
- `cycle`: Colors shift through spectrum
- `rotate`: Gradient angle rotates
- `shift`: Colors move position
- `pulse`: Brightness pulses

**Best For**: Philosophical, abstract, emotional content

---

### ParticleField
**Purpose**: Floating particle effects

**Props**:
```typescript
{
  particleCount?: number;
  particleType?: 'circle' | 'square' | 'blur';
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'random';
  speed?: number;
}
```

**Best For**: Technology, futuristic, modern topics

---

### FloatingShapes
**Purpose**: Geometric pattern backgrounds

**Props**:
```typescript
{
  shapes?: ('circle' | 'square' | 'triangle' | 'hexagon')[];
  count?: number;
  colors?: string[];
  speed?: number;
}
```

**Best For**: Data-driven, analytical, structured content

---

## Cinematic Effects

### Vignette
**Purpose**: Edge darkening for focus

**Props**:
```typescript
{
  intensity?: number;  // 0.0 - 1.0
  color?: string;
  spread?: number;
}
```

**Intensity Guide**:
- `0.3`: Subtle, barely noticeable
- `0.5`: Medium, noticeable but not distracting
- `0.8`: Heavy, dramatic focus

---

### FilmGrain
**Purpose**: Analog film texture

**Props**:
```typescript
{
  amount?: number;      // 0.01 - 0.2
  blendMode?: 'overlay' | 'multiply' | 'screen';
  animated?: boolean;
}
```

**Best For**: Vintage, nostalgic, artistic content

---

### LightLeak
**Purpose**: Warm light overlay effects

**Props**:
```typescript
{
  type?: 'gradient' | 'flare' | 'streak';
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  color?: string;
  intensity?: number;
}
```

**Best For**: Warm, hopeful, cinematic moments

---

### MotionBlurWrapper
**Purpose**: Motion blur on moving elements

**Props**:
```typescript
{
  samples?: number;
  shutterAngle?: number;
  children: React.ReactNode;
}
```

**Note**: Wraps moving content, increases render time

---

### EffectsComposer
**Purpose**: Combine multiple effects

**Props**:
```typescript
{
  effects: EffectsConfig;
  children: React.ReactNode;
}

// EffectsConfig
{
  vignette?: VignetteProps | boolean;
  filmGrain?: FilmGrainProps | boolean;
  lightLeak?: LightLeakProps | boolean;
}
```

---

## Text Animations

### TypewriterText
**Purpose**: Character-by-character reveal

**Props**:
```typescript
{
  text: string;
  speed?: number;           // chars per frame
  cursor?: boolean;
  cursorChar?: string;
  style?: React.CSSProperties;
}
```

**Best For**: Quotes, emphasis, technical output simulation

---

### HighlightText
**Purpose**: Text with animated highlight

**Props**:
```typescript
{
  text: string;
  highlightType?: 'background' | 'underline' | 'strike' | 'box';
  highlightColor?: string;
  delay?: number;
}
```

**Best For**: Key terms, definitions, emphasis

---

### RevealText
**Purpose**: Progressive text reveal

**Props**:
```typescript
{
  text: string;
  mode?: 'word' | 'line' | 'clip';
  direction?: 'left' | 'right' | 'up' | 'down';
  stagger?: number;
}
```

**Best For**: Headlines, titles, dramatic reveals

---

### GlitchText
**Purpose**: Digital glitch effect

**Props**:
```typescript
{
  text: string;
  intensity?: 'subtle' | 'medium' | 'intense';
  colors?: string[];
}
```

**Best For**: Tech content, error states, edgy aesthetic

---

## Charts

### BarChart
**Purpose**: Bar/column visualization

**Props**:
```typescript
{
  data: BarChartDataItem[];
  orientation?: 'vertical' | 'horizontal';
  showLabels?: boolean;
  showValues?: boolean;
  animationDelay?: number;
  barColor?: string;
}
```

---

### LineChart
**Purpose**: Line/area chart

**Props**:
```typescript
{
  data: LineChartDataPoint[];
  showArea?: boolean;
  showPoints?: boolean;
  lineColor?: string;
  areaColor?: string;
  strokeWidth?: number;
}
```

---

### PieChart
**Purpose**: Pie/donut chart

**Props**:
```typescript
{
  data: PieChartDataItem[];
  type?: 'pie' | 'donut';
  showLabels?: boolean;
  showPercentages?: boolean;
  innerRadius?: number;
}
```

---

## Progress Components

### CountUp
**Purpose**: Animated number counting

**Props**:
```typescript
{
  from?: number;
  to: number;
  duration?: number;       // in frames
  prefix?: string;
  suffix?: string;
  decimals?: number;
}
```

---

### ProgressBar
**Purpose**: Linear progress indicator

**Props**:
```typescript
{
  progress: number;        // 0-100
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  height?: number;
}
```

---

### ProgressCircle
**Purpose**: Circular progress indicator

**Props**:
```typescript
{
  progress: number;        // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
}
```

---

### StepIndicator
**Purpose**: Multi-step progress

**Props**:
```typescript
{
  steps: string[];
  currentStep: number;
  completedColor?: string;
  activeColor?: string;
  pendingColor?: string;
}
```

---

## Layout Components

### Stack
**Purpose**: Vertical/horizontal stacking

**Props**:
```typescript
{
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  children: React.ReactNode;
}
```

---

### Grid
**Purpose**: Responsive grid layout

**Props**:
```typescript
{
  columns?: number;
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  children: React.ReactNode;
}
```

---

### Split
**Purpose**: Two-panel layout

**Props**:
```typescript
{
  ratio?: string;          // e.g., "1:1", "2:1", "1:2"
  direction?: 'horizontal' | 'vertical';
  gap?: number;
  children: [React.ReactNode, React.ReactNode];
}
```

---

### ComparisonLayout
**Purpose**: Side-by-side comparison

**Props**:
```typescript
{
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  vsText?: string;
}
```

---

## Audio Components

### BackgroundMusic
**Purpose**: Background music track

**Props**:
```typescript
{
  src: string;
  volume?: number | ((frame: number) => number);
  loop?: boolean;
  startFrom?: number;
}
```

**Presets**: `ambient`, `energetic`, `subtle`, `tutorial`, `cinematic`

---

### SoundEffect
**Purpose**: One-shot sound effects

**Props**:
```typescript
{
  src: string;
  startFrame: number;
  volume?: number;
}
```

**Presets**: `transition`, `appear`, `emphasis`, `uiFeedback`, `success`

**Shortcut Components**: `TransitionSound`, `AppearSound`, `EmphasisSound`

---

### AudioLayer
**Purpose**: Multi-track audio management

**Props**:
```typescript
{
  tracks: AudioTrack[];
}

// AudioTrack
{
  id: string;
  src: string;
  type: 'music' | 'narration' | 'sfx';
  volume?: number | ((frame: number) => number);
  startFrame?: number;
  loop?: boolean;
}
```

**Helper Functions**:
- `createMusicTrack(src, options)`
- `createNarrationTrack(src, options)`
- `createSFXTrack(src, startFrame, options)`

---

## Transitions

### Available Presets

| Preset | Effect | Best For |
|--------|--------|----------|
| `fade` | Opacity crossfade | Default, smooth |
| `dissolve` | Soft blend | Time passage, dreams |
| `slideLeft` | Slide from right | Forward progression |
| `slideRight` | Slide from left | Looking back |
| `slideUp` | Slide from bottom | Rising, growth |
| `slideDown` | Slide from top | Falling, descending |
| `wipeLeft` | Horizontal reveal | Data, comparisons |
| `wipeRight` | Horizontal reveal | Data, comparisons |
| `wipeUp` | Vertical reveal | Reveals, builds |
| `wipeDown` | Vertical reveal | Reveals, builds |
| `zoomIn` | Scale up | Emphasis, focus |
| `zoomOut` | Scale down | Conclusion, overview |
| `flipLeft` | 3D flip | Reveals, fun |
| `flipRight` | 3D flip | Reveals, fun |
| `clockWipe` | Radial wipe | Time, progress |

### Usage
```typescript
import { TransitionComposition, TRANSITION_PRESETS } from "@shared/transitions";

const scenes = [
  { id: "intro", component: IntroScene, durationInFrames: 300 },
  { id: "content", component: ContentScene, durationInFrames: 600, transition: TRANSITION_PRESETS.slideLeft },
];

<TransitionComposition scenes={scenes} defaultTransition={TRANSITION_PRESETS.fade} />
```

---

## Design System Constants

### Colors
```typescript
COLORS = {
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00c2ff",
  dark: "#1a1a2e",
  darkAlt: "#16213e",
  light: "#f8f9fa",
  white: "#ffffff",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  purple: "#9b59b6",
  orange: "#e67e22",
}
```

### Gradients
```typescript
GRADIENTS = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  dark: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  success: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
  danger: "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)",
}
```

### Typography
```typescript
FONT_SIZES = {
  xs: 20, sm: 24, md: 28, lg: 36,
  xl: 48, "2xl": 56, "3xl": 72, "4xl": 80,
}

FONT_FAMILY = {
  title: "Pretendard, SF Pro Display, -apple-system, sans-serif",
  body: "Pretendard, SF Pro Text, -apple-system, sans-serif",
}
```

### Spacing
```typescript
SPACING = {
  xs: 10, sm: 20, md: 40, lg: 60, xl: 80, "2xl": 100,
}

RADIUS = {
  sm: 12, md: 16, lg: 20, xl: 24,
}
```

### Spring Configs
```typescript
SPRING_CONFIGS = {
  snappy: { damping: 100, mass: 0.5, stiffness: 300 },
  normal: { damping: 80, mass: 0.5, stiffness: 200 },
  gentle: { damping: 100, mass: 0.8, stiffness: 150 },
  bouncy: { damping: 60, mass: 0.4, stiffness: 300 },
}
```

---

## Import Examples

```typescript
// Scene Templates
import {
  IntroTemplate,
  ContentTemplate,
  ComparisonTemplate,
  QuoteTemplate,
  OutroTemplate,
  DataVisualizationTemplate,
  TimelineTemplate,
  ImageTemplate,
  AnnotationTemplate,
  StoryTemplate,
} from "@shared/templates/scenes";

// Backgrounds
import {
  AnimatedGradient,
  ParticleField,
  FloatingShapes,
} from "@shared/components/backgrounds";

// Effects
import {
  Vignette,
  FilmGrain,
  LightLeak,
  MotionBlurWrapper,
  EffectsComposer,
} from "@shared/components/effects";

// Text Animations
import {
  TypewriterText,
  HighlightText,
  RevealText,
  GlitchText,
} from "@shared/templates/animations";

// Charts
import { BarChart, LineChart, PieChart } from "@shared/components/charts";

// Progress
import { CountUp, ProgressBar, ProgressCircle, StepIndicator } from "@shared/components/progress";

// Layouts
import { Stack, Grid, Split, ComparisonLayout } from "@shared/components/layouts";

// Audio
import {
  BackgroundMusic,
  SoundEffect,
  AudioLayer,
  MUSIC_PRESETS,
  duckVolume,
} from "@shared/audio";

// Transitions
import { TransitionComposition, TRANSITION_PRESETS } from "@shared/transitions";

// Design System
import { COLORS, GRADIENTS, FONT_SIZES, SPACING, SPRING_CONFIGS } from "@shared/components/constants";
```

---

## Related Documents

- `docs/visual-strategy-guide.md` - Topic-to-visual mapping
- `projects/templates/video-plan.md` - Pre-production template
- `Roadmap.md` - Development roadmap
