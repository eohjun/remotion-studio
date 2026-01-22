/**
 * Constants for Self-Help Ideology Critique (English version)
 */

export const SCENE_DURATION = 210; // 7 seconds at 30fps

export const SCENES = {
  INTRO: { start: 0, duration: SCENE_DURATION },
  TWO_FACES: { start: SCENE_DURATION, duration: SCENE_DURATION },
  NEOLIBERALISM: { start: SCENE_DURATION * 2, duration: 240 }, // 8 seconds
  TOXIC_POSITIVITY: { start: SCENE_DURATION * 2 + 240, duration: SCENE_DURATION },
  THE_TRAP: { start: SCENE_DURATION * 3 + 240, duration: SCENE_DURATION },
  COUNTERBALANCE: { start: SCENE_DURATION * 4 + 240, duration: SCENE_DURATION },
  BALANCE: { start: SCENE_DURATION * 5 + 240, duration: SCENE_DURATION },
  OUTRO: { start: SCENE_DURATION * 6 + 240, duration: SCENE_DURATION },
} as const;

export const TOTAL_DURATION =
  SCENES.INTRO.duration +
  SCENES.TWO_FACES.duration +
  SCENES.NEOLIBERALISM.duration +
  SCENES.TOXIC_POSITIVITY.duration +
  SCENES.THE_TRAP.duration +
  SCENES.COUNTERBALANCE.duration +
  SCENES.BALANCE.duration +
  SCENES.OUTRO.duration;

// Video metadata for YouTube
export const VIDEO_METADATA = {
  title: "The Dark Side of Self-Help: A Critical Analysis",
  description:
    "Explore the hidden ideology behind the self-help industry and learn how to pursue authentic personal growth.",
  tags: [
    "self-help",
    "personal development",
    "neoliberalism",
    "toxic positivity",
    "self-efficacy",
    "psychology",
    "social criticism",
  ],
} as const;
