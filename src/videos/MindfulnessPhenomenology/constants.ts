/**
 * Constants for Mindfulness Phenomenology video
 * Auto-synced from audio-metadata.json
 */

// Scene durations based on actual audio lengths (at 30fps)
export const SCENE_DURATIONS = {
  intro: 526,              // 17.5s
  epocheIntro: 668,        // 22.2s
  mindfulnessParallel: 766, // 25.5s
  naturalAttitude: 587,    // 19.6s
  metacognition: 820,      // 27.3s
  decentering: 608,        // 20.3s
  neurophenomenology: 723, // 24.1s
  brainChanges: 699,       // 23.3s
  vipassanaOrigins: 705,   // 23.5s
  therapeuticPower: 678,   // 22.6s
  mcmindfulness: 802,      // 26.7s
  embodiedAwareness: 726,  // 24.2s
  synthesis: 782,          // 26.1s
  outro: 647,              // 21.6s
} as const;

// Calculate scene start times
let currentFrame = 0;
export const SCENES = Object.fromEntries(
  Object.entries(SCENE_DURATIONS).map(([key, duration]) => {
    const start = currentFrame;
    currentFrame += duration;
    return [key, { start, duration }];
  })
) as Record<keyof typeof SCENE_DURATIONS, { start: number; duration: number }>;

// Total duration: 5 min 24 sec = 324.4 seconds = 9737 frames
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "The Philosophy of Mindfulness: From Husserl to Your Brain",
  description:
    "Discover the surprising connection between ancient Buddhist mindfulness and 20th-century phenomenology. Learn how epoché, metacognition, and neurophenomenology reveal the deep structure of conscious experience.",
  tags: [
    "mindfulness",
    "phenomenology",
    "husserl",
    "meditation",
    "consciousness",
    "neurophenomenology",
    "vipassana",
    "MBSR",
    "MBCT",
    "philosophy",
    "neuroscience",
  ],
} as const;
