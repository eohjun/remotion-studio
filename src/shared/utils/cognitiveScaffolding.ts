/**
 * Cognitive Scaffolding Utilities
 *
 * Tools for enhancing viewer comprehension and retention through:
 * - Automatic recap insertion every 3-4 scenes
 * - Progress indicators ("Part X of Y")
 * - Bridge phrases for smooth transitions
 */

export interface ScaffoldingScene {
  id: string;
  title?: string;
  text: string;
  duration?: number;
  visual?: string;
  [key: string]: unknown;
}

export interface RecapScene extends ScaffoldingScene {
  id: string;
  title: string;
  text: string;
  duration: number;
  visual: string;
  type: "recap";
  recapPoints: string[];
}

export interface ProgressIndicator {
  part: number;
  total: number;
  label: string;
  percentage: number;
}

// ============================================
// Recap Insertion
// ============================================

/**
 * Generate recap points from recent scenes
 */
function generateRecapPoints(scenes: ScaffoldingScene[]): string[] {
  return scenes
    .filter((s) => s.title && s.title.toLowerCase() !== "hook")
    .slice(-3)
    .map((s) => {
      // Extract key point from scene
      const text = s.text;
      // Get first sentence or first 50 chars
      const firstSentence = text.split(/[.!?]/)[0];
      return firstSentence.length > 60
        ? firstSentence.substring(0, 57) + "..."
        : firstSentence;
    });
}

/**
 * Generate recap text from points
 */
function generateRecapText(points: string[]): string {
  if (points.length === 0) return "Let's recap what we've covered so far.";

  const intro = "Quick recap: ";
  const items = points
    .map((p, i) => {
      if (i === 0) return p;
      if (i === points.length - 1) return `and ${p}`;
      return p;
    })
    .join(", ");

  return intro + items + ".";
}

/**
 * Insert recap scenes every N content scenes
 *
 * @param scenes - Original scenes array
 * @param interval - Number of scenes between recaps (default: 4)
 * @param minScenes - Minimum scenes before first recap (default: 3)
 * @returns Scenes array with recaps inserted
 */
export function insertRecaps(
  scenes: ScaffoldingScene[],
  interval: number = 4,
  minScenes: number = 3
): ScaffoldingScene[] {
  if (scenes.length < minScenes + 1) {
    return scenes; // Too short for recaps
  }

  const result: ScaffoldingScene[] = [];
  let contentCount = 0;
  let recapIndex = 1;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    result.push(scene);

    // Skip non-content scenes (hook, outro, etc.)
    const isContent =
      !["hook", "intro", "outro", "conclusion", "cta"].some((type) =>
        scene.id.toLowerCase().includes(type)
      );

    if (isContent) {
      contentCount++;
    }

    // Insert recap after interval content scenes
    if (contentCount > 0 && contentCount % interval === 0 && i < scenes.length - 2) {
      const recentScenes = result.filter(
        (s) =>
          !s.id.startsWith("recap-") &&
          !["hook", "intro", "outro"].some((t) => s.id.toLowerCase().includes(t))
      );
      const recapPoints = generateRecapPoints(recentScenes.slice(-interval));

      const recapScene: RecapScene = {
        id: `recap-${recapIndex}`,
        title: `Quick Recap ${recapIndex}`,
        text: generateRecapText(recapPoints),
        duration: 4 + recapPoints.length, // ~4-7 seconds
        visual: "Recap template with bullet points",
        type: "recap",
        recapPoints,
      };

      result.push(recapScene);
      recapIndex++;
    }
  }

  return result;
}

// ============================================
// Progress Indicators
// ============================================

/**
 * Calculate progress indicator for a scene
 */
export function getProgressIndicator(
  sceneIndex: number,
  totalScenes: number
): ProgressIndicator {
  return {
    part: sceneIndex + 1,
    total: totalScenes,
    label: `${sceneIndex + 1} of ${totalScenes}`,
    percentage: ((sceneIndex + 1) / totalScenes) * 100,
  };
}

/**
 * Add progress indicators to scenes
 */
export function addProgressIndicators(
  scenes: ScaffoldingScene[]
): Array<ScaffoldingScene & { progress?: ProgressIndicator }> {
  // Filter out non-content scenes for progress calculation
  const contentScenes = scenes.filter(
    (s) =>
      !["hook", "intro", "outro", "recap", "conclusion"].some((type) =>
        s.id.toLowerCase().includes(type)
      )
  );

  let contentIndex = 0;

  return scenes.map((scene) => {
    const isContent = !["hook", "intro", "outro", "recap", "conclusion"].some(
      (type) => scene.id.toLowerCase().includes(type)
    );

    if (isContent) {
      const progress = getProgressIndicator(contentIndex, contentScenes.length);
      contentIndex++;
      return { ...scene, progress };
    }

    return scene;
  });
}

// ============================================
// Bridge Phrases
// ============================================

const BRIDGE_TEMPLATES = {
  continuation: [
    "Building on that...",
    "Following this logic...",
    "With that foundation...",
    "Taking this further...",
    "Here's where it gets interesting...",
  ],
  contrast: [
    "But here's the twist...",
    "On the other hand...",
    "However...",
    "That said...",
    "But wait...",
  ],
  example: [
    "Let me show you...",
    "Here's an example...",
    "Consider this...",
    "Think about it this way...",
    "Imagine...",
  ],
  conclusion: [
    "So what does this mean?",
    "The bottom line...",
    "Here's the key takeaway...",
    "What this tells us...",
    "In essence...",
  ],
  transition: [
    "Now...",
    "Next...",
    "Moving on...",
    "Let's look at...",
    "This brings us to...",
  ],
};

export type BridgeType = keyof typeof BRIDGE_TEMPLATES;

/**
 * Get a bridge phrase for a transition type
 * Uses deterministic selection based on index to avoid Remotion flickering
 */
export function getBridgePhrase(
  type: BridgeType = "transition",
  index: number = 0
): string {
  const templates = BRIDGE_TEMPLATES[type];
  return templates[index % templates.length];
}

/**
 * Detect appropriate bridge type based on scene content
 */
function detectBridgeType(
  _currentScene: ScaffoldingScene,
  nextScene: ScaffoldingScene
): BridgeType {
  const nextText = nextScene.text.toLowerCase();
  const nextId = nextScene.id.toLowerCase();

  if (
    nextId.includes("example") ||
    nextText.includes("for example") ||
    nextText.includes("consider")
  ) {
    return "example";
  }

  if (
    nextId.includes("conclusion") ||
    nextId.includes("takeaway") ||
    nextId.includes("summary")
  ) {
    return "conclusion";
  }

  if (
    nextText.includes("but") ||
    nextText.includes("however") ||
    nextText.includes("on the other hand")
  ) {
    return "contrast";
  }

  if (
    nextText.includes("building on") ||
    nextText.includes("furthermore") ||
    nextText.includes("additionally")
  ) {
    return "continuation";
  }

  return "transition";
}

/**
 * Generate bridge phrases between scenes
 */
export function generateBridgePhrases(
  scenes: ScaffoldingScene[]
): Array<{ fromScene: string; toScene: string; phrase: string; type: BridgeType }> {
  const bridges: Array<{
    fromScene: string;
    toScene: string;
    phrase: string;
    type: BridgeType;
  }> = [];

  for (let i = 0; i < scenes.length - 1; i++) {
    const current = scenes[i];
    const next = scenes[i + 1];

    // Skip bridges for certain scene types
    if (
      current.id.includes("outro") ||
      next.id.includes("hook") ||
      (current as RecapScene).type === "recap"
    ) {
      continue;
    }

    const type = detectBridgeType(current, next);
    bridges.push({
      fromScene: current.id,
      toScene: next.id,
      phrase: getBridgePhrase(type, i),
      type,
    });
  }

  return bridges;
}

// ============================================
// Scene Enhancement
// ============================================

export interface EnhancedNarration {
  scenes: ScaffoldingScene[];
  bridges: Array<{
    fromScene: string;
    toScene: string;
    phrase: string;
    type: BridgeType;
  }>;
  recapCount: number;
  hasProgressIndicators: boolean;
}

/**
 * Apply all cognitive scaffolding enhancements
 */
export function enhanceNarration(
  scenes: ScaffoldingScene[],
  options: {
    insertRecaps?: boolean;
    recapInterval?: number;
    addProgress?: boolean;
    generateBridges?: boolean;
  } = {}
): EnhancedNarration {
  const {
    insertRecaps: shouldInsertRecaps = true,
    recapInterval = 4,
    addProgress = true,
    generateBridges: shouldGenerateBridges = true,
  } = options;

  let enhancedScenes = [...scenes];
  let recapCount = 0;

  // Insert recaps
  if (shouldInsertRecaps && scenes.length >= 5) {
    enhancedScenes = insertRecaps(enhancedScenes, recapInterval);
    recapCount = enhancedScenes.filter((s) => s.id.startsWith("recap-")).length;
  }

  // Add progress indicators
  if (addProgress) {
    enhancedScenes = addProgressIndicators(enhancedScenes);
  }

  // Generate bridge phrases
  const bridges = shouldGenerateBridges
    ? generateBridgePhrases(enhancedScenes)
    : [];

  return {
    scenes: enhancedScenes,
    bridges,
    recapCount,
    hasProgressIndicators: addProgress,
  };
}
