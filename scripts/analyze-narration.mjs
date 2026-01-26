/**
 * Narration Quality Analyzer
 *
 * Analyzes narration.json files for:
 * - Engagement score (0-100): hook strength, question density, emotional variety
 * - Cognitive load estimation: words per scene, complexity, jargon density
 * - Narrative arc validation: hook → promise → journey → conclusion
 * - Pacing analysis: monotonous rhythm detection, improvement suggestions
 *
 * Usage:
 *   node scripts/analyze-narration.mjs -f projects/TwoMinuteRule/narration.json
 *   node scripts/analyze-narration.mjs -f projects/TwoMinuteRule/narration.json --json
 *   node scripts/analyze-narration.mjs -f projects/TwoMinuteRule/narration.json --update
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI argument parsing
const args = process.argv.slice(2);
const fileArgIndex = args.findIndex((arg) => arg === "--file" || arg === "-f");
const narrationFile =
  fileArgIndex !== -1 && args[fileArgIndex + 1]
    ? args[fileArgIndex + 1]
    : null;
const outputJson = args.includes("--json") || args.includes("-j");
const updateFile = args.includes("--update") || args.includes("-u");
const verbose = args.includes("--verbose") || args.includes("-v");

if (!narrationFile) {
  console.error("Usage: node scripts/analyze-narration.mjs -f <narration.json>");
  console.error("Options:");
  console.error("  -f, --file     Path to narration.json (required)");
  console.error("  -j, --json     Output results as JSON");
  console.error("  -u, --update   Update narration.json with quality metrics");
  console.error("  -v, --verbose  Show detailed analysis");
  process.exit(1);
}

// Resolve narration file path
const narrationPath = path.isAbsolute(narrationFile)
  ? narrationFile
  : path.join(projectRoot, narrationFile);

if (!fs.existsSync(narrationPath)) {
  console.error(`Error: File not found: ${narrationPath}`);
  process.exit(1);
}

const narration = JSON.parse(fs.readFileSync(narrationPath, "utf-8"));

// ============================================
// Analysis Constants
// ============================================

// Hook strength indicators
const HOOK_PATTERNS = {
  strong: [
    /^you(?:'re| are)/i,
    /^what if/i,
    /^imagine/i,
    /^here's (?:the|a) (?:secret|truth|thing)/i,
    /^stop /i,
    /^never /i,
    /^the (?:real|hidden|surprising)/i,
    /\?$/,
  ],
  moderate: [
    /^did you know/i,
    /^have you ever/i,
    /^most people/i,
    /^the problem/i,
    /^here's why/i,
  ],
  weak: [/^today/i, /^in this/i, /^let me/i, /^we're going to/i],
};

// Emotional words for variety scoring
const EMOTIONAL_WORDS = {
  positive: [
    "amazing",
    "powerful",
    "incredible",
    "love",
    "beautiful",
    "success",
    "win",
    "breakthrough",
    "freedom",
    "joy",
  ],
  negative: [
    "fear",
    "anxiety",
    "stress",
    "pain",
    "struggle",
    "fail",
    "problem",
    "crisis",
    "danger",
    "risk",
  ],
  urgent: [
    "now",
    "immediately",
    "urgent",
    "critical",
    "must",
    "need",
    "today",
    "stop",
  ],
  curious: [
    "secret",
    "hidden",
    "surprising",
    "unexpected",
    "discover",
    "reveal",
    "truth",
    "mystery",
  ],
};

// Complexity indicators
const COMPLEX_PATTERNS = [
  /\b\w{12,}\b/g, // Long words (12+ chars)
  /\b(?:furthermore|nevertheless|consequently|notwithstanding)\b/gi,
  /\b(?:paradigm|methodology|infrastructure|implementation)\b/gi,
];

// Narrative arc scene patterns
const ARC_PATTERNS = {
  hook: ["hook", "intro", "opening", "attention"],
  promise: ["promise", "preview", "what", "why", "problem", "challenge"],
  journey: [
    "content",
    "main",
    "body",
    "solution",
    "how",
    "step",
    "point",
    "example",
  ],
  conclusion: ["outro", "conclusion", "takeaway", "action", "cta", "summary"],
};

// ============================================
// Analysis Functions
// ============================================

/**
 * Calculate engagement score (0-100)
 */
function calculateEngagementScore(scenes) {
  let score = 50; // Base score
  const details = {};

  // 1. Hook strength (0-25 points)
  const firstScene = scenes[0];
  if (firstScene) {
    const text = firstScene.text;
    let hookScore = 5; // Default weak

    for (const pattern of HOOK_PATTERNS.strong) {
      if (pattern.test(text)) {
        hookScore = 25;
        details.hookStrength = "strong";
        break;
      }
    }
    if (hookScore < 25) {
      for (const pattern of HOOK_PATTERNS.moderate) {
        if (pattern.test(text)) {
          hookScore = 15;
          details.hookStrength = "moderate";
          break;
        }
      }
    }
    if (!details.hookStrength) {
      for (const pattern of HOOK_PATTERNS.weak) {
        if (pattern.test(text)) {
          details.hookStrength = "weak";
          break;
        }
      }
    }
    if (!details.hookStrength) {
      details.hookStrength = "minimal";
    }
    score += hookScore - 15; // Adjust from base
  }

  // 2. Question density (0-15 points)
  const allText = scenes.map((s) => s.text).join(" ");
  const questionCount = (allText.match(/\?/g) || []).length;
  const questionDensity = questionCount / scenes.length;
  const questionScore = Math.min(15, questionDensity * 10);
  score += questionScore;
  details.questionDensity = questionDensity.toFixed(2);

  // 3. Emotional variety (0-20 points)
  const emotionTypes = new Set();
  const textLower = allText.toLowerCase();
  for (const [type, words] of Object.entries(EMOTIONAL_WORDS)) {
    for (const word of words) {
      if (textLower.includes(word)) {
        emotionTypes.add(type);
        break;
      }
    }
  }
  const emotionScore = emotionTypes.size * 5;
  score += emotionScore;
  details.emotionalVariety = Array.from(emotionTypes);

  // 4. Call-to-action presence (0-10 points)
  const lastScene = scenes[scenes.length - 1];
  const ctaPatterns = [
    /subscribe/i,
    /follow/i,
    /comment/i,
    /share/i,
    /try (?:it|this)/i,
    /start (?:now|today)/i,
    /take action/i,
    /let me know/i,
  ];
  let hasCta = false;
  if (lastScene) {
    for (const pattern of ctaPatterns) {
      if (pattern.test(lastScene.text)) {
        hasCta = true;
        break;
      }
    }
  }
  score += hasCta ? 10 : 0;
  details.hasCallToAction = hasCta;

  // 5. Storytelling elements (0-10 points)
  const storyPatterns = [
    /\b(?:story|example|case|instance)\b/i,
    /\b(?:imagine|picture this|consider)\b/i,
    /\b(?:when i|i remember|once)\b/i,
  ];
  let storyScore = 0;
  for (const pattern of storyPatterns) {
    if (pattern.test(allText)) {
      storyScore += 3;
    }
  }
  score += Math.min(10, storyScore);
  details.hasStoryElements = storyScore > 0;

  return {
    score: Math.min(100, Math.max(0, Math.round(score))),
    details,
  };
}

/**
 * Estimate cognitive load per scene
 */
function estimateCognitiveLoad(scenes) {
  const results = [];
  const avgWordsPerScene =
    scenes.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0) /
    scenes.length;

  for (const scene of scenes) {
    const words = scene.text.split(/\s+/);
    const wordCount = words.length;

    // Calculate complexity factors
    let complexity = 0;

    // Word count factor
    if (wordCount > 50) complexity += 2;
    else if (wordCount > 35) complexity += 1;
    else if (wordCount < 15) complexity -= 1;

    // Long words factor
    const longWords = words.filter((w) => w.length >= 10).length;
    complexity += Math.min(2, longWords / 3);

    // Technical/complex patterns
    for (const pattern of COMPLEX_PATTERNS) {
      const matches = scene.text.match(pattern) || [];
      complexity += matches.length * 0.5;
    }

    // Sentence structure
    const sentences = scene.text.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = wordCount / Math.max(1, sentences.length);
    if (avgSentenceLength > 25) complexity += 1;
    if (avgSentenceLength > 35) complexity += 1;

    // Map to load level
    let load;
    if (complexity <= 0) load = "low";
    else if (complexity <= 2) load = "medium";
    else if (complexity <= 4) load = "high";
    else load = "very-high";

    results.push({
      sceneId: scene.id,
      wordCount,
      load,
      complexity: Math.round(complexity * 10) / 10,
      suggestion:
        load === "high" || load === "very-high"
          ? "Consider breaking into shorter sentences or simplifying vocabulary"
          : null,
    });
  }

  // Calculate average load
  const loadMap = { low: 1, medium: 2, high: 3, "very-high": 4 };
  const avgLoad =
    results.reduce((sum, r) => sum + loadMap[r.load], 0) / results.length;
  let avgLoadLabel;
  if (avgLoad <= 1.5) avgLoadLabel = "low";
  else if (avgLoad <= 2.5) avgLoadLabel = "medium";
  else if (avgLoad <= 3.5) avgLoadLabel = "high";
  else avgLoadLabel = "very-high";

  return {
    avgLoad: avgLoadLabel,
    avgWordsPerScene: Math.round(avgWordsPerScene),
    scenes: results,
  };
}

/**
 * Validate narrative arc structure
 */
function validateNarrativeArc(scenes) {
  const found = {
    hook: false,
    promise: false,
    journey: false,
    conclusion: false,
  };

  const sceneMapping = {};

  for (const scene of scenes) {
    const idLower = (scene.id || "").toLowerCase();
    const titleLower = (scene.title || "").toLowerCase();

    for (const [arcPart, patterns] of Object.entries(ARC_PATTERNS)) {
      for (const pattern of patterns) {
        if (idLower.includes(pattern) || titleLower.includes(pattern)) {
          found[arcPart] = true;
          sceneMapping[arcPart] = sceneMapping[arcPart] || [];
          sceneMapping[arcPart].push(scene.id);
          break;
        }
      }
    }
  }

  // Check sequence
  const sceneIds = scenes.map((s) => s.id);
  let sequenceValid = true;
  let sequenceIssues = [];

  // Hook should be first
  if (sceneMapping.hook && sceneIds.indexOf(sceneMapping.hook[0]) > 1) {
    sequenceValid = false;
    sequenceIssues.push("Hook scene should appear early");
  }

  // Conclusion should be last
  if (sceneMapping.conclusion) {
    const lastConclusionIndex = Math.max(
      ...sceneMapping.conclusion.map((id) => sceneIds.indexOf(id))
    );
    if (lastConclusionIndex < sceneIds.length - 2) {
      sequenceValid = false;
      sequenceIssues.push("Conclusion scene should appear near the end");
    }
  }

  const complete = Object.values(found).every(Boolean);
  const missing = Object.entries(found)
    .filter(([_, v]) => !v)
    .map(([k]) => k);

  return {
    complete,
    found,
    missing,
    sceneMapping,
    sequenceValid,
    sequenceIssues,
  };
}

/**
 * Analyze pacing and rhythm
 */
function analyzePacing(scenes) {
  const issues = [];
  const suggestions = [];

  // Scene duration analysis
  const durations = scenes.map((s) => s.duration || 5);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

  // Check for monotonous pacing
  const durationVariance =
    durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) /
    durations.length;
  const durationStdDev = Math.sqrt(durationVariance);

  if (durationStdDev < 1 && scenes.length > 3) {
    issues.push("Monotonous pacing: scene durations are very similar");
    suggestions.push(
      "Vary scene durations for better rhythm - shorter for impact, longer for explanation"
    );
  }

  // Check for overly long scenes
  const longScenes = scenes.filter((s) => (s.duration || 5) > 15);
  if (longScenes.length > 0) {
    issues.push(`${longScenes.length} scene(s) exceed 15 seconds`);
    suggestions.push(
      `Consider splitting long scenes: ${longScenes.map((s) => s.id).join(", ")}`
    );
  }

  // Check for too many short scenes
  const shortScenes = scenes.filter((s) => (s.duration || 5) < 3);
  if (shortScenes.length > scenes.length / 2) {
    issues.push("Too many very short scenes may feel choppy");
    suggestions.push("Combine some short scenes for smoother flow");
  }

  // Word density variation
  const wordCounts = scenes.map((s) => s.text.split(/\s+/).length);
  const wordsPerSecond = wordCounts.map(
    (w, i) => w / Math.max(1, durations[i])
  );
  const avgWps = wordsPerSecond.reduce((a, b) => a + b, 0) / wordsPerSecond.length;

  if (avgWps > 3.5) {
    issues.push("High word density may feel rushed");
    suggestions.push(
      "Consider extending scene durations or reducing text for better comprehension"
    );
  }

  // Rhythm score
  let rhythmScore = 100;
  rhythmScore -= issues.length * 15;
  rhythmScore = Math.max(0, rhythmScore);

  return {
    rhythmScore,
    avgDuration: Math.round(avgDuration * 10) / 10,
    avgWordsPerSecond: Math.round(avgWps * 10) / 10,
    issues,
    suggestions,
  };
}

// ============================================
// Main Analysis
// ============================================

function analyzeNarration(narration) {
  const scenes = narration.scenes || [];

  if (scenes.length === 0) {
    return {
      error: "No scenes found in narration",
    };
  }

  const engagement = calculateEngagementScore(scenes);
  const cognitiveLoad = estimateCognitiveLoad(scenes);
  const narrativeArc = validateNarrativeArc(scenes);
  const pacing = analyzePacing(scenes);

  // Overall quality score
  const overallScore = Math.round(
    engagement.score * 0.35 +
      (narrativeArc.complete ? 20 : 0) +
      (narrativeArc.sequenceValid ? 10 : 0) +
      pacing.rhythmScore * 0.25 +
      (cognitiveLoad.avgLoad === "medium" ? 10 : cognitiveLoad.avgLoad === "low" ? 5 : 0)
  );

  return {
    compositionId: narration.metadata?.compositionId || "unknown",
    analyzedAt: new Date().toISOString(),
    overallScore,
    qualityMetrics: {
      engagementScore: engagement.score,
      hookStrength: engagement.details.hookStrength,
      avgCognitiveLoad: cognitiveLoad.avgLoad,
      narrativeArcComplete: narrativeArc.complete,
      rhythmScore: pacing.rhythmScore,
    },
    engagement,
    cognitiveLoad,
    narrativeArc,
    pacing,
    recommendations: generateRecommendations(
      engagement,
      cognitiveLoad,
      narrativeArc,
      pacing
    ),
  };
}

function generateRecommendations(engagement, cognitiveLoad, narrativeArc, pacing) {
  const recommendations = [];

  // Engagement recommendations
  if (engagement.score < 60) {
    if (engagement.details.hookStrength === "weak" || engagement.details.hookStrength === "minimal") {
      recommendations.push({
        priority: "high",
        area: "hook",
        suggestion:
          "Strengthen opening hook with a provocative question, surprising fact, or direct address to viewer",
      });
    }
    if (parseFloat(engagement.details.questionDensity) < 0.5) {
      recommendations.push({
        priority: "medium",
        area: "engagement",
        suggestion:
          "Add rhetorical questions to increase viewer engagement (aim for 1 question per 2 scenes)",
      });
    }
    if (engagement.details.emotionalVariety.length < 2) {
      recommendations.push({
        priority: "medium",
        area: "emotion",
        suggestion:
          "Incorporate more emotional variety - mix curiosity, urgency, and positive/negative emotions",
      });
    }
    if (!engagement.details.hasCallToAction) {
      recommendations.push({
        priority: "low",
        area: "cta",
        suggestion: "Add a clear call-to-action in the final scene",
      });
    }
  }

  // Cognitive load recommendations
  if (cognitiveLoad.avgLoad === "high" || cognitiveLoad.avgLoad === "very-high") {
    recommendations.push({
      priority: "high",
      area: "comprehension",
      suggestion:
        "Reduce cognitive load by simplifying vocabulary and shortening sentences",
    });
    const highLoadScenes = cognitiveLoad.scenes.filter(
      (s) => s.load === "high" || s.load === "very-high"
    );
    if (highLoadScenes.length > 0) {
      recommendations.push({
        priority: "medium",
        area: "scenes",
        suggestion: `Focus simplification on: ${highLoadScenes.map((s) => s.sceneId).join(", ")}`,
      });
    }
  }

  // Narrative arc recommendations
  if (!narrativeArc.complete) {
    recommendations.push({
      priority: "high",
      area: "structure",
      suggestion: `Missing narrative elements: ${narrativeArc.missing.join(", ")}. Add scenes covering these parts.`,
    });
  }
  if (!narrativeArc.sequenceValid && narrativeArc.sequenceIssues.length > 0) {
    recommendations.push({
      priority: "medium",
      area: "sequence",
      suggestion: narrativeArc.sequenceIssues.join("; "),
    });
  }

  // Pacing recommendations
  if (pacing.issues.length > 0) {
    for (const suggestion of pacing.suggestions) {
      recommendations.push({
        priority: "medium",
        area: "pacing",
        suggestion,
      });
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// ============================================
// Output
// ============================================

const analysis = analyzeNarration(narration);

if (outputJson) {
  console.log(JSON.stringify(analysis, null, 2));
} else {
  console.log("\n========================================");
  console.log("  NARRATION QUALITY ANALYSIS");
  console.log("========================================\n");

  console.log(`Composition: ${analysis.compositionId}`);
  console.log(`Overall Score: ${analysis.overallScore}/100\n`);

  console.log("--- Quality Metrics ---");
  console.log(`Engagement Score: ${analysis.qualityMetrics.engagementScore}/100`);
  console.log(`Hook Strength: ${analysis.qualityMetrics.hookStrength}`);
  console.log(`Avg Cognitive Load: ${analysis.qualityMetrics.avgCognitiveLoad}`);
  console.log(`Narrative Arc Complete: ${analysis.qualityMetrics.narrativeArcComplete ? "Yes" : "No"}`);
  console.log(`Rhythm Score: ${analysis.qualityMetrics.rhythmScore}/100\n`);

  if (verbose) {
    console.log("--- Engagement Details ---");
    console.log(`Question Density: ${analysis.engagement.details.questionDensity} per scene`);
    console.log(`Emotional Variety: ${analysis.engagement.details.emotionalVariety.join(", ") || "limited"}`);
    console.log(`Has CTA: ${analysis.engagement.details.hasCallToAction ? "Yes" : "No"}`);
    console.log(`Has Story Elements: ${analysis.engagement.details.hasStoryElements ? "Yes" : "No"}\n`);

    console.log("--- Cognitive Load by Scene ---");
    for (const scene of analysis.cognitiveLoad.scenes) {
      const flag = scene.load === "high" || scene.load === "very-high" ? " ⚠️" : "";
      console.log(`  ${scene.sceneId}: ${scene.load} (${scene.wordCount} words)${flag}`);
    }
    console.log("");

    console.log("--- Narrative Arc ---");
    console.log(`Hook: ${analysis.narrativeArc.found.hook ? "✓" : "✗"}`);
    console.log(`Promise: ${analysis.narrativeArc.found.promise ? "✓" : "✗"}`);
    console.log(`Journey: ${analysis.narrativeArc.found.journey ? "✓" : "✗"}`);
    console.log(`Conclusion: ${analysis.narrativeArc.found.conclusion ? "✓" : "✗"}\n`);

    console.log("--- Pacing ---");
    console.log(`Avg Scene Duration: ${analysis.pacing.avgDuration}s`);
    console.log(`Avg Words/Second: ${analysis.pacing.avgWordsPerSecond}`);
    if (analysis.pacing.issues.length > 0) {
      console.log("Issues:");
      for (const issue of analysis.pacing.issues) {
        console.log(`  - ${issue}`);
      }
    }
    console.log("");
  }

  if (analysis.recommendations.length > 0) {
    console.log("--- Recommendations ---");
    for (const rec of analysis.recommendations) {
      const icon = rec.priority === "high" ? "🔴" : rec.priority === "medium" ? "🟡" : "🟢";
      console.log(`${icon} [${rec.area}] ${rec.suggestion}`);
    }
    console.log("");
  }
}

// Update file if requested
if (updateFile) {
  narration.qualityMetrics = analysis.qualityMetrics;
  narration.qualityMetrics.analyzedAt = analysis.analyzedAt;
  fs.writeFileSync(narrationPath, JSON.stringify(narration, null, 2));
  console.log(`\n✅ Updated ${narrationPath} with quality metrics`);
}
