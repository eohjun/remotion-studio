# Video Production Strategy System

**Status**: Completed
**Created**: 2026-01-24
**Phase**: Video Strategy System (Roadmap Phase 17)

---

## Overview

This document outlines the implementation plan for a video production strategy system that enables strategic planning before creating videos, ensuring each video is purposefully designed with appropriate components, visual styles, and narrative approaches.

---

## Problem Statement

### Current Workflow
```
Source -> Narration -> Template Application -> Similar Videos
```

### Issues
- No strategic planning before component selection
- Missing criteria for choosing components based on topic
- Videos lack differentiation and variety
- Components selected without purpose

---

## Solution Architecture

### Target Workflow
```
Source -> Content Analysis -> Strategy Development (via guides) -> Component Selection (via catalog) -> Differentiated Videos
```

---

## Available Assets (50+ Components)

| Category | Components |
|---------|---------|
| Scene Templates (10) | Intro, Content, Comparison, Quote, Outro, DataVisualization, Timeline, Image, Annotation, Story |
| Backgrounds (3) | AnimatedGradient, ParticleField, FloatingShapes |
| Effects (5) | Vignette, FilmGrain, LightLeak, MotionBlurWrapper, EffectsComposer |
| Metaphors (4) | BreathingCircle, LayeredMind, FlowingWaves, BracketAnimation |
| Text Animations (4) | TypewriterText, HighlightText, RevealText, GlitchText |
| Charts (3) | BarChart, LineChart, PieChart |
| Layouts (4) | Stack, Grid, Split, ComparisonLayout |
| Audio (3) | BackgroundMusic, SoundEffect, AudioLayer |

---

## Implementation Phases

### Phase 1: Video Planning Template (1 hour)
**Location**: `projects/templates/video-plan.md`

A pre-production planning template that forces strategic thinking before video creation.

**Sections**:
1. Content Analysis (topic type, tone, density, core messages)
2. Visual Strategy (backgrounds, effects, transitions)
3. Scene Composition (scene-by-scene breakdown)
4. Audio Strategy (music, ducking presets)

**Status**: ✅ Completed

---

### Phase 2: Component Catalog (3 hours)
**Location**: `docs/component-catalog.md`

A scannable reference document for all available components.

**Structure**:
- Quick Reference (visual icon grid)
- Scene Templates (with purpose, timing, props, combinations)
- Backgrounds, Effects, Metaphors, Text Animations
- Charts, Layouts, Audio Components
- Design System (COLORS, GRADIENTS, FONT_SIZES, SPACING)

**Status**: ✅ Completed

---

### Phase 3: Visual Strategy Guide (2 hours)
**Location**: `docs/visual-strategy-guide.md`

Topic-to-visual mapping guide for consistent, purposeful styling.

**Core Content**:
- Topic Type -> Visual Strategy mapping table
- Combination patterns (Academic, Data Story, Narrative)
- Mood-based style guides
- Anti-patterns to avoid

**Status**: ✅ Completed

---

### Phase 4: Template Library Expansion (5 hours)

#### 4.1 CaptionText (2 hours) - HIGHEST PRIORITY
**Location**: `src/shared/templates/animations/CaptionText.tsx`

TikTok-style word-by-word captions synchronized with narration.

```typescript
interface CaptionTextProps {
  words: Array<{
    text: string;
    startFrame: number;
    endFrame: number;
  }>;
  style?: 'bounce' | 'highlight' | 'scale' | 'karaoke';
  position?: 'bottom' | 'center' | 'top';
  activeColor?: string;
  inactiveColor?: string;
}
```

**Use Cases**: Narration sync, accessibility, engagement

**Status**: ✅ Completed

---

#### 4.2 CodeBlock (2 hours)
**Location**: `src/shared/templates/animations/CodeBlock.tsx`

Animated code display for technical content.

```typescript
interface CodeBlockProps {
  code: string;
  language: 'javascript' | 'typescript' | 'python' | 'jsx';
  animation: 'typewriter' | 'highlight-lines' | 'reveal';
  highlightLines?: number[];
  theme?: 'dark' | 'monokai' | 'github';
}
```

**Use Cases**: Technical tutorials, code explanations

**Status**: ✅ Completed

---

#### 4.3 Audiogram (1 hour)
**Location**: `src/shared/components/visualizers/Audiogram.tsx`

Audio waveform visualization.

```typescript
interface AudiogramProps {
  audioSrc: string;
  visualizerType: 'waveform' | 'bars' | 'circle';
  color?: string;
  barCount?: number;
}
```

**Use Cases**: Podcast style, audio emphasis

**Status**: ✅ Completed

---

## File Structure

```
remotion-studio/
├── docs/                              # Documentation
│   ├── IMPLEMENTATION_PLAN.md         # This file
│   ├── component-catalog.md           # Phase 2
│   └── visual-strategy-guide.md       # Phase 3
├── projects/
│   └── templates/                     # Templates
│       └── video-plan.md              # Phase 1
└── src/shared/
    ├── templates/animations/
    │   ├── CaptionText.tsx            # Phase 4.1
    │   └── CodeBlock.tsx              # Phase 4.2
    └── components/visualizers/        # New directory
        ├── Audiogram.tsx              # Phase 4.3
        └── index.ts
```

---

## Implementation Order

| Order | Task | Time | Rationale |
|-----|------|------|------|
| 0 | Save this plan + Update Roadmap | 10m | Session continuity |
| 1 | Video Planning Template | 1h | Immediately usable, forces strategic thinking |
| 2 | Component Catalog | 3h | Document existing assets |
| 3 | Visual Strategy Guide | 2h | Decision framework based on catalog |
| 4 | CaptionText | 2h | Highest impact, accessibility |
| 5 | CodeBlock | 2h | Technical content expansion |
| 6 | Audiogram | 1h | Special use cases |

**Total Estimated Time**: 11 hours

---

## Validation

```bash
# Phases 1-3: Documentation review
cat docs/component-catalog.md
cat docs/visual-strategy-guide.md

# Phase 4: Lint check
npm run lint

# Demo verification
npm run dev
# -> Check new components in ComponentLibraryDemo

# Real video test
# 1. Copy video-plan.md for new video planning
# 2. Implement according to plan
# 3. Evaluate result quality
```

---

## Expected Outcomes

**Before**:
```
Source -> Narration -> Template Application -> Similar Videos
```

**After**:
```
Source -> Content Analysis -> Strategy (via guide) -> Components (via catalog) -> Differentiated Videos
```

---

## Related Documents

- `Roadmap.md` - Main development roadmap (Phase 17: Video Strategy System)
- `CLAUDE.md` - Project conventions and structure
