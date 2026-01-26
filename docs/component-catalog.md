# Component Catalog

**Remotion Studio Component Library Reference**
**Last Updated**: 2026-01-26
**Total Components**: 70+

---

## Quick Reference

| Category | Components | Import From |
|----------|-----------|-------------|
| Scene Templates | 15 | `@shared/templates/scenes` |
| Backgrounds | 5 | `@shared/components/backgrounds` |
| Effects | 10 | `@shared/components/effects` |
| Text Animations | 7 | `@shared/templates/animations` |
| Audio Visualization | 1 | `@shared/components/waveforms` |
| Diagrams | 1 | `@shared/components/diagrams` |
| Cards | 5 | `@shared/components/cards` |
| Charts | 11 | `@shared/components/charts` |
| Progress | 4 | `@shared/components/progress` |
| Layouts | 4 | `@shared/components/layouts` |
| Audio | 3+ | `@shared/audio` |
| Icons | 2 | `@shared/components/icons` |
| Transitions | 10+ | `@shared/transitions` |
| Hooks | 2 | `@shared/hooks` |
| Config | 4 | `@shared/config` |
| Utils | 4 | `@shared/utils` |

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

### RecapTemplate
**Purpose**: Summary/recap scene for cognitive scaffolding

**Props**:
```typescript
{
  title?: string;              // Default: "Quick Recap"
  points: string[];            // Key points to summarize
  pointIcon?: string;          // Default: "✓"
  numbered?: boolean;          // Show numbered list instead of icons
  accentColor?: string;
  partIndicator?: string;      // e.g., "Part 1 of 3"
  durationInFrames: number;
}
```

**When to Use**:
- Every 3-4 content scenes in long videos
- Before major topic transitions
- Reinforcing key learning points
- Videos > 3 minutes with multiple concepts

**Combinations**:
- After 3-4 ContentTemplate scenes
- Use with cognitiveScaffolding utilities
- Pair with progress indicators

**Example**:
```tsx
<RecapTemplate
  title="Quick Recap"
  points={[
    "Point 1 from earlier",
    "Point 2 explained",
    "Point 3 insight"
  ]}
  partIndicator="Part 1 of 3"
  durationInFrames={240}
/>
```

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
  panelFontSize?: 'md' | 'lg' | 'xl' | '2xl';  // Control panel text size
  durationInFrames: number;
}
```

**Font Size Guidelines**:
- `md`: Sequence layout (many small panels)
- `lg`: Default for split layout
- `xl`: Single panel with longer text
- `2xl`: Short impactful statements

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

### GridPattern
**Purpose**: Decorative grid patterns for tech/modern aesthetics

**Import**: `@shared/components/backgrounds`

**Props**:
```typescript
{
  type?: 'lines' | 'dots' | 'squares' | 'hexagons';
  size?: number;              // Grid cell size
  color?: string;             // Grid color
  opacity?: number;           // 0-1
  animated?: boolean;         // Enable subtle animation
  animationSpeed?: number;    // Animation speed multiplier
}
```

**Grid Types**:
- `lines`: Clean intersecting lines (default)
- `dots`: Dot matrix pattern
- `squares`: Square grid cells
- `hexagons`: Honeycomb pattern

**Best For**: Tech tutorials, modern UI, programming content, data dashboards

**Example**:
```tsx
<GridPattern
  type="dots"
  size={40}
  color="#667eea"
  opacity={0.3}
  animated
/>
```

---

### NoiseTexture
**Purpose**: Procedural noise textures for film-like aesthetics

**Import**: `@shared/components/backgrounds`

**Props**:
```typescript
{
  type?: 'static' | 'perlin' | 'grain' | 'stipple';
  opacity?: number;           // 0-1
  animated?: boolean;         // Enable noise animation
  scale?: number;             // Noise scale
  color?: string;             // Tint color
}
```

**Noise Types**:
- `static`: Random TV static noise
- `perlin`: Smooth flowing Perlin noise
- `grain`: Film grain simulation
- `stipple`: Dotted stipple pattern

**Best For**: Film grain replacement, vintage aesthetics, texture overlay

**Example**:
```tsx
<NoiseTexture
  type="grain"
  opacity={0.05}
  animated
/>
```

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

### CameraMotionBlur
**Purpose**: Cinematic motion blur effect (based on @remotion/motion-blur)

**Import**: `@shared/components/effects`

**Props**:
```typescript
{
  shutterAngle?: number;      // 0-360, controls blur amount (default: 180)
  samples?: number;           // Blur quality samples (default: 10)
  enabled?: boolean;          // Toggle effect on/off
  children: React.ReactNode;
}
```

**Shutter Angle Guide**:
- `90`: Subtle blur, quick movements
- `180`: Natural motion blur (default, film-like)
- `270`: Heavy blur, dramatic effect
- `360`: Maximum blur, very cinematic

**Best For**: Fast-moving elements, action sequences, smooth transitions

**Example**:
```tsx
<CameraMotionBlur shutterAngle={180} samples={12}>
  <AnimatedElement />
</CameraMotionBlur>
```

---

### ChromaticAberration
**Purpose**: RGB channel separation for retro/cinematic look

**Import**: `@shared/components/effects`

**Props**:
```typescript
{
  intensity?: number;         // 0-1, strength of effect
  direction?: 'radial' | 'horizontal' | 'vertical' | 'diagonal';
  animated?: boolean;         // Animate intensity over time
  offset?: { r: number; g: number; b: number };  // Custom channel offsets
  children: React.ReactNode;
}
```

**Direction Guide**:
- `radial`: Classic lens distortion (default)
- `horizontal`: Left-right separation
- `vertical`: Top-bottom separation
- `diagonal`: Corner-to-corner separation

**Best For**: Tech content, retro aesthetics, impact moments, transitions

**Example**:
```tsx
<ChromaticAberration intensity={0.3} direction="radial" animated>
  <SceneContent />
</ChromaticAberration>
```

---

### GlitchEffect
**Purpose**: Digital glitch/distortion for tech and dramatic moments

**Import**: `@shared/components/effects`

**Props**:
```typescript
{
  intensity?: 'subtle' | 'medium' | 'intense' | number;  // 0-1 for custom
  showScanlines?: boolean;    // CRT scanline overlay
  colorShift?: boolean;       // RGB color separation
  sliceDisplacement?: boolean; // Horizontal slice displacement
  noiseAmount?: number;       // 0-1, digital noise
  flickerRate?: number;       // Flicker frequency
  children: React.ReactNode;
}
```

**Intensity Presets**:
- `subtle`: Light glitches, good for accents
- `medium`: Noticeable but not overwhelming
- `intense`: Heavy distortion, dramatic effect

**Best For**: Tech content, error states, tension/drama, digital themes

**Example**:
```tsx
<GlitchEffect intensity="medium" showScanlines colorShift>
  <ErrorMessage />
</GlitchEffect>
```

---

### ColorGrading
**Purpose**: CSS filter-based color correction presets

**Import**: `@shared/components/effects`

**Props**:
```typescript
{
  preset?: 'cinematic' | 'vintage' | 'cold' | 'warm' | 'noir' | 'teal-orange';
  intensity?: number;         // 0-1, blend with original
  customFilters?: {           // Custom CSS filter values
    brightness?: number;
    contrast?: number;
    saturate?: number;
    sepia?: number;
    hueRotate?: number;       // degrees
  };
  children: React.ReactNode;
}
```

**Preset Guide**:
| Preset | Effect | Best For |
|--------|--------|----------|
| `cinematic` | Crushed blacks, subtle teal | Storytelling, documentaries |
| `vintage` | Sepia tones, reduced saturation | Historical, nostalgic content |
| `cold` | Blue-shifted, desaturated | Analytical, serious topics |
| `warm` | Orange/yellow boost | Inspirational, friendly content |
| `noir` | High contrast B&W | Dramatic, mysterious themes |
| `teal-orange` | Hollywood blockbuster look | General cinematic content |

**Best For**: Establishing mood, visual consistency, cinematic look

**Example**:
```tsx
<ColorGrading preset="cinematic" intensity={0.8}>
  <WholeVideo />
</ColorGrading>
```

---

### Bloom
**Purpose**: Glow effect for bright areas

**Import**: `@shared/components/effects`

**Props**:
```typescript
{
  threshold?: number;         // Brightness threshold for bloom (0-1)
  intensity?: number;         // Bloom strength (0-1)
  radius?: number;            // Blur radius in pixels
  color?: string;             // Tint color for bloom
  children: React.ReactNode;
}
```

**Best For**: Highlights, dramatic lighting, sci-fi aesthetics, glowing text

**Example**:
```tsx
<Bloom threshold={0.6} intensity={0.5} radius={20} color="#ffffff">
  <BrightElement />
</Bloom>
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

### PoppingText
**Purpose**: Staggered character pop animation

**Import**: `@shared/templates/animations`

**Props**:
```typescript
{
  text: string;
  colors?: string[];           // Colors to cycle through characters
  fontSize?: number | string;
  fontWeight?: number | string;
  delayPerChar?: number;       // Frame delay between characters (default: 4)
  startFrame?: number;         // When to start animation
  textAlign?: 'left' | 'center' | 'right';
}
```

**Helper Function**:
```typescript
calculatePoppingDuration(textLength, delayPerChar?, settleDuration?)
```

**Best For**: Dynamic titles, energetic intros, Shorts content, key phrases

---

### StaggerGroup
**Purpose**: Sequential child element animation with configurable patterns

**Import**: `@shared/templates/animations`

**Props**:
```typescript
{
  direction?: 'forward' | 'reverse' | 'center-out' | 'edges-in';
  delayPerItem?: number;      // Frame delay between items (default: 8)
  animationType?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'scale' | 'custom';
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'spring';
  staggerOffset?: number;     // Starting frame offset
  children: React.ReactNode;
}
```

**Direction Patterns**:
- `forward`: First to last (default)
- `reverse`: Last to first
- `center-out`: Middle items first, then edges
- `edges-in`: Edge items first, then center

**Best For**: List reveals, bullet points, card grids, sequential content

**Example**:
```tsx
<StaggerGroup direction="forward" delayPerItem={10} animationType="slideUp">
  <ListItem>First</ListItem>
  <ListItem>Second</ListItem>
  <ListItem>Third</ListItem>
</StaggerGroup>
```

---

### TextMorph
**Purpose**: Character-by-character text transformation animation

**Import**: `@shared/templates/animations`

**Props**:
```typescript
{
  fromText: string;
  toText: string;
  morphStyle?: 'scramble' | 'fade' | 'slide' | 'flip';
  duration?: number;          // Duration in frames
  charDelay?: number;         // Delay between character transforms
  scrambleChars?: string;     // Characters for scramble effect
  style?: React.CSSProperties;
}
```

**Morph Styles**:
- `scramble`: Random character cycling before settling (default)
- `fade`: Opacity crossfade between characters
- `slide`: Vertical slide transition
- `flip`: 3D flip per character

**Best For**: Dramatic text changes, A→B transformations, number counters

**Example**:
```tsx
<TextMorph
  fromText="OLD VALUE"
  toText="NEW VALUE"
  morphStyle="scramble"
  duration={60}
/>
```

---

## Audio Visualization

### BarWaveform
**Purpose**: Audio-synced vertical bar visualization

**Import**: `@shared/components/waveforms`

**Props**:
```typescript
{
  audioData?: AudioData | null;  // From getAudioData()
  numberOfSamples?: number;      // Number of bars (default: 32)
  barColor?: string;
  barWidth?: number;             // Pixels (default: 4)
  barGap?: number;               // Pixels (default: 2)
  waveAmplitude?: number;        // Max bar height (default: 100)
  waveSpeed?: number;            // Fallback animation speed
  width?: number | string;
  height?: number | string;
  growUpwardsOnly?: boolean;     // Bars grow up from bottom
}
```

**Usage**:
```tsx
import { getAudioData } from "@remotion/media-utils";
import { BarWaveform } from "@shared/components/waveforms";

// In component:
const audioData = await getAudioData(audioSrc);
<BarWaveform audioData={audioData} barColor="#667eea" />
```

**Best For**: Narration visualization, music videos, podcast intros

---

## Card Components

### CardFlip
**Purpose**: 3D card flip animation

**Import**: `@shared/components/cards`

**Props**:
```typescript
{
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  frontBackground?: string;
  backBackground?: string;
  frontTextColor?: string;
  backTextColor?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  fontSize?: number | string;
  flipAtFrame?: number;          // When to start flip
  durationInFrames?: number;     // Flip duration (default: 60)
  flipDirection?: 'horizontal' | 'vertical';
  // Spring physics
  damping?: number;
  mass?: number;
  stiffness?: number;
}
```

**Best For**: Before/after reveals, myth vs reality, comparisons, quiz answers

---

## Diagrams

### CycleDiagram
**Purpose**: Circular cycle/loop visualization (e.g., vicious cycles, feedback loops)

**Import**: `@shared/components/diagrams`

**Props**:
```typescript
{
  steps: CycleStep[];           // Cycle steps (2-8 recommended)
  centerLabel?: string;         // Center label text
  size?: 'small' | 'medium' | 'large' | 'auto';  // auto adjusts by step count
  color?: string;               // Ring color
  animated?: boolean;           // Enable rotation animation
  animationSpeed?: number;      // Animation speed (default: 1)
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  language?: 'ko' | 'en' | 'auto';  // Text styling (auto-detects Korean)
}

interface CycleStep {
  text: string;    // Supports \n for line breaks
  icon?: string;
  color?: string;
}
```

**Features**:
- Auto-detects Korean text and applies `wordBreak: keep-all`
- Supports explicit line breaks with `\n` in text
- Auto-sizing based on step count
- Animated dashed ring rotation

**When to Use**:
- Vicious cycles, feedback loops
- Process flows that loop back
- Cause-and-effect cycles

**Example**:
```tsx
<CycleDiagram
  steps={[
    { text: "스트레스", icon: "😫" },
    { text: "미루기", icon: "📱" },
    { text: "불안 증가", icon: "😰" },
    { text: "더 큰\n스트레스", icon: "💥" },
  ]}
  centerLabel="악순환"
  color="#e94560"
  size="large"
  language="ko"
/>
```

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

### AreaChart
**Purpose**: Filled line chart for trends and time series

**Props**:
```typescript
{
  data: AreaChartDataPoint[];  // { label, value }
  fillColor?: string;
  strokeColor?: string;
  showDots?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  fillOpacity?: number;        // 0-1, default 0.3
  width?: number;
  height?: number;
}
```

**When to Use**:
- Time series data
- Trend visualization
- Cumulative data

---

### ScatterPlot
**Purpose**: 2D scatter plot for correlation visualization

**Props**:
```typescript
{
  data: ScatterDataPoint[];    // { x, y, label?, color?, size? }
  xLabel?: string;
  yLabel?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  showGrid?: boolean;
  showTrendLine?: boolean;
  pointRadius?: number;
}
```

**When to Use**:
- Correlation analysis
- Distribution visualization
- Multi-variable comparison

---

### FunnelChart
**Purpose**: Conversion funnel visualization

**Props**:
```typescript
{
  data: FunnelStage[];         // { label, value, color?, icon? }
  showPercentages?: boolean;
  showValues?: boolean;
  minWidthPercent?: number;    // Minimum stage width (default: 30)
  staggerDelay?: number;       // Animation stagger in frames
}
```

**When to Use**:
- Conversion funnels
- Process stages
- Drop-off analysis

---

### GaugeChart
**Purpose**: Speedometer/gauge meter visualization

**Props**:
```typescript
{
  value: number;
  maxValue?: number;
  minValue?: number;
  label?: string;
  unit?: string;               // e.g., "%", "km/h"
  showValue?: boolean;
  showRange?: boolean;
  thickness?: number;
  size?: number;
  zones?: Array<{
    upTo: number;
    color: string;
  }>;
}
```

**When to Use**:
- Performance metrics
- Progress indicators
- Score displays
- KPI dashboards

---

### ComparisonBars
**Purpose**: Side-by-side bar comparison for A/B or before/after

**Props**:
```typescript
{
  data: ComparisonBarItem[];   // { label, valueA, valueB, icon? }
  labelA?: string;             // e.g., "Before"
  labelB?: string;             // e.g., "After"
  colorA?: string;
  colorB?: string;
  showChange?: boolean;        // Show percentage change
  showValues?: boolean;
}
```

**When to Use**:
- Before/after comparisons
- A/B test results
- Year-over-year analysis
- Competitive comparison

---

### WaterfallChart
**Purpose**: Cumulative value change visualization (start → changes → end)

**Import**: `@shared/components/charts`

**Props**:
```typescript
{
  data: WaterfallDataPoint[];  // { label, value, isTotal?, color? }
  positiveColor?: string;      // Color for increases (default: "#22C55E")
  negativeColor?: string;      // Color for decreases (default: "#EF4444")
  totalColor?: string;         // Color for total bars (default: "#3B82F6")
  showConnectors?: boolean;    // Lines connecting bars (default: true)
  showValues?: boolean;        // Display values on bars (default: true)
  staggerDelay?: number;       // Stagger animation delay (default: 5)
  labelFontSize?: number;      // Font size for labels (default: 14)
  valueFontSize?: number;      // Font size for values (default: 13)
}
```

**When to Use**:
- Financial analysis (revenue → costs → profit)
- Budget breakdowns
- Performance attribution
- Change explanations

**Example**:
```tsx
<WaterfallChart
  data={[
    { label: "Start", value: 100, isTotal: true },
    { label: "Sales", value: 50 },
    { label: "Costs", value: -30 },
    { label: "Total", value: 120, isTotal: true }
  ]}
  labelFontSize={16}
  showConnectors
  showValues
/>
```

---

### RadarChart
**Purpose**: Multi-dimensional comparison (spider/radar chart)

**Import**: `@shared/components/charts`

**Props**:
```typescript
{
  labels: string[];              // Axis labels
  series: RadarDataSeries[];     // Data series to display
  size?: number;                 // Chart size (default: 400)
  maxValue?: number;             // Max scale value (auto-detected if not set)
  rings?: number;                // Number of concentric rings (default: 5)
  gridColor?: string;            // Grid/axis color
  textColor?: string;            // Text color
  showDots?: boolean;            // Show value dots (default: true)
  showLegend?: boolean;          // Show legend (default: true)
  animationStart?: number;       // Animation start frame
  labelFontSize?: number;        // Font size for axis labels (default: 16)
  legendFontSize?: number;       // Font size for legend text (default: 14)
}

interface RadarDataSeries {
  name: string;
  values: number[];
  color: string;
  fillOpacity?: number;
}
```

**When to Use**:
- Multi-attribute comparison (speed, price, quality, etc.)
- Skill assessments
- Product feature comparisons
- Competitive analysis

**Example**:
```tsx
<RadarChart
  labels={["Speed", "Quality", "Price", "Support", "Features"]}
  series={[
    { name: "Product A", values: [85, 70, 60, 90, 75], color: "#3B82F6" },
    { name: "Product B", values: [70, 85, 80, 60, 90], color: "#EF4444" }
  ]}
  size={500}
  labelFontSize={18}
  legendFontSize={16}
/>
```

---

### HeatmapChart
**Purpose**: Grid-based color intensity visualization

**Import**: `@shared/components/charts`

**Props**:
```typescript
{
  data: number[][];            // 2D array of values [rows][columns]
  rowLabels?: string[];        // Row labels
  columnLabels?: string[];     // Column labels
  minColor?: string;           // Color for minimum values
  maxColor?: string;           // Color for maximum values
  neutralColor?: string;       // Color for middle values
  showValues?: boolean;        // Display cell values (default: true)
  cellGap?: number;            // Gap between cells (default: 2)
  borderRadius?: number;       // Cell border radius (default: 4)
  labelFontSize?: number;      // Font size for labels (default: 13)
  animationStart?: number;     // Animation start frame
  staggerByRow?: boolean;      // Stagger animation by row (default: true)
}
```

**When to Use**:
- Correlation matrices
- Time-based patterns (hours × days)
- Geographic data grids
- Performance dashboards

**Example**:
```tsx
<HeatmapChart
  data={[[10, 20, 30], [40, 50, 60], [70, 80, 90]]}
  rowLabels={["A", "B", "C"]}
  columnLabels={["X", "Y", "Z"]}
  labelFontSize={16}
  showValues
/>
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
  RecapTemplate,
  DataVisualizationTemplate,
  TimelineTemplate,
  ImageTemplate,
  AnnotationTemplate,
  StoryTemplate,
  NewsTemplate,
  InterviewTemplate,
  ProductShowcaseTemplate,
  TableListTemplate,
} from "@shared/templates/scenes";

// Backgrounds (including new)
import {
  AnimatedGradient,
  ParticleField,
  FloatingShapes,
  GridPattern,          // NEW: Tech/modern grid patterns
  NoiseTexture,         // NEW: Film grain/noise textures
} from "@shared/components/backgrounds";

// Effects (including new)
import {
  Vignette,
  FilmGrain,
  LightLeak,
  MotionBlurWrapper,
  EffectsComposer,
  CameraMotionBlur,     // NEW: Cinematic motion blur
  ChromaticAberration,  // NEW: RGB channel separation
  GlitchEffect,         // NEW: Digital glitch
  ColorGrading,         // NEW: Color correction presets
  Bloom,                // NEW: Glow effect
} from "@shared/components/effects";

// Text Animations (including new)
import {
  TypewriterText,
  HighlightText,
  RevealText,
  GlitchText,
  PoppingText,
  StaggerGroup,         // NEW: Sequential child animation
  TextMorph,            // NEW: Character-by-character transform
} from "@shared/templates/animations";

// Charts (including new)
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ScatterPlot,
  FunnelChart,
  GaugeChart,
  ComparisonBars,
  WaterfallChart,       // NEW: Cumulative value changes
  RadarChart,           // NEW: Multi-dimensional comparison
  HeatmapChart,         // NEW: Grid color intensity
} from "@shared/components/charts";

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

// Theme System (NEW)
import { ThemeProvider, useTheme, THEMES } from "@shared/components/ThemeProvider";

// Quality Presets (NEW)
import { QUALITY_PRESETS, applyQualityPreset } from "@shared/config/qualityPresets";
```

---

## Theme System

### ThemeProvider
**Purpose**: Global theme management with 8 preset themes

**Import**: `@shared/components/ThemeProvider`

**Props**:
```typescript
{
  theme?: ThemeName;
  customTheme?: Partial<Theme>;
  children: React.ReactNode;
}

type ThemeName =
  | 'default'      // Primary purple gradient
  | 'dark'         // Deep dark mode
  | 'light'        // Clean light mode
  | 'cinematic'    // Film-inspired colors
  | 'neon'         // Bright cyberpunk
  | 'pastel'       // Soft muted colors
  | 'corporate'    // Professional blue
  | 'vintage'      // Retro warm tones
```

**Theme Structure**:
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    titleWeight: number;
    bodyWeight: number;
  };
  spacing: {
    xs: number; sm: number; md: number; lg: number; xl: number;
  };
}
```

**Usage**:
```tsx
import { ThemeProvider, useTheme } from "@shared/components/ThemeProvider";

// Wrap composition
<ThemeProvider theme="cinematic">
  <MyVideo />
</ThemeProvider>

// Use in components
const { colors, spacing } = useTheme();
```

---

## Quality Presets

### Render Quality Configuration

**Import**: `@shared/config/qualityPresets`

**Available Presets**:
```typescript
QUALITY_PRESETS = {
  draft: {
    scale: 0.5,           // 960x540 for 1080p
    codec: 'h264',
    crf: 28,              // Lower quality, faster
    pixelFormat: 'yuv420p',
    description: 'Quick preview renders'
  },
  standard: {
    scale: 1,             // Full resolution
    codec: 'h264',
    crf: 18,              // Good quality
    pixelFormat: 'yuv420p',
    description: 'Standard YouTube quality'
  },
  premium: {
    scale: 1,
    codec: 'prores',      // ProRes 422 for editing
    crf: 10,              // High quality
    pixelFormat: 'yuv422p10le',
    audioBitrate: '320k',
    description: 'Master quality for editing'
  }
}
```

**CLI Usage**:
```bash
# Draft preview
node scripts/render-quality.mjs {compositionId} --preset draft

# Standard YouTube upload
node scripts/render-quality.mjs {compositionId} --preset standard

# High quality master
node scripts/render-quality.mjs {compositionId} --preset premium
```

---

## Phase 19: New Components

### TableListTemplate
**Purpose**: Data tables, lists, and grid displays

**Props**:
```typescript
{
  title: string;
  displayMode: 'table' | 'list' | 'grid';
  headers?: string[];           // For table mode
  rows?: TableRow[];            // For table mode
  items?: ListItem[];           // For list/grid modes
  gridColumns?: number;         // For grid mode (default: 2)
  showNumbers?: boolean;
  highlightColor?: string;
  staggerDelay?: number;        // Animation delay between items
  source?: string;
  compact?: boolean | 'auto';   // Compact mode for many items (auto: 5+ items)
  durationInFrames: number;
}

interface TableRow {
  cells: string[];
  highlight?: boolean;
  icon?: string;
  color?: string;
}

interface ListItem {
  text: string;
  subtext?: string;
  icon?: string;
  badge?: string;
  highlight?: boolean;
  color?: string;
}
```

**Compact Mode**:
- `true`: Always use compact spacing
- `false`: Always use normal spacing
- `'auto'` (default): Compact when 5+ items

**Display Modes**:
- `table`: Grid with headers, ideal for structured data
- `list`: Vertical items with icons/badges, ideal for features/steps
- `grid`: Card grid layout, ideal for categories/options

**When to Use**:
- Feature lists
- Comparison tables
- Step-by-step processes
- Category displays
- Data summaries

**Combinations**:
- `FloatingShapes` background for professional look
- `slide` or `fade` transitions
- Use `highlight` for key items

---

## Responsive Utilities

### useResponsive Hook
**Purpose**: Multi-aspect-ratio support (16:9, 9:16 Shorts, 1:1, 4:3)

**Import**:
```typescript
import { useResponsive, RESOLUTION_PRESETS } from "@shared/hooks";
```

**Returns**:
```typescript
{
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  isPortrait: boolean;      // true for Shorts/vertical
  isLandscape: boolean;     // true for standard video
  isSquare: boolean;
  width: number;
  height: number;
  scale: (value: number) => number;         // Scale based on resolution
  scaleFont: (baseSize: number) => number;  // Font scaling with portrait boost
  scaleSpacing: (baseSpacing: number) => number;
  layoutDirection: 'row' | 'column';        // Auto layout direction
  optimalColumns: (baseColumns: number) => number;  // Grid column adjustment
  padding: { horizontal: number; vertical: number; };
  textScale: { title: number; body: number; small: number; };
}
```

**Usage**:
```tsx
const { isPortrait, scale, scaleFont, layoutDirection } = useResponsive();

return (
  <div style={{
    flexDirection: layoutDirection,
    fontSize: scaleFont(48),
    padding: scale(40),
  }}>
    {isPortrait ? <PortraitLayout /> : <LandscapeLayout />}
  </div>
);
```

**Resolution Presets**:
```typescript
RESOLUTION_PRESETS = {
  '16:9': { width: 1920, height: 1080 },  // Standard YouTube
  '9:16': { width: 1080, height: 1920 },  // Shorts/TikTok/Reels
  '1:1':  { width: 1080, height: 1080 },  // Square
  '4:3':  { width: 1440, height: 1080 },  // Legacy
}
```

---

## Performance Optimizations

### ParticleField (Enhanced)
**New Performance Options**:
```typescript
{
  // Existing props...
  maxParticles?: number;         // Default: 50, Max: 200
  viewportCulling?: boolean;     // Default: true (skip off-screen particles)
  useGPUAcceleration?: boolean;  // Default: true (use transform3d)
}
```

**Performance Tips**:
- Keep `particleCount` under 50 for smooth 30fps
- Enable `viewportCulling` for particles that leave the screen
- `useGPUAcceleration` uses CSS transforms for GPU compositing

---

## Related Documents

- `docs/visual-strategy-guide.md` - Topic-to-visual mapping
- `projects/templates/video-plan.md` - Pre-production template
- `Roadmap.md` - Development roadmap
