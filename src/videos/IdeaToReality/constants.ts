/**
 * Constants for "아이디어가 현실이 되기까지" (From Idea to Reality)
 *
 * Test video for new Remotion features:
 * - @remotion/shapes: AnimatedStar, AnimatedPolygon, etc.
 * - @remotion/paths: SelfDrawingPath, LiquidPath, MorphingIcon
 */

import { DEFAULT_FPS as FPS } from "../../shared/utils/timing";

// Scene durations in frames (auto-synced from TTS)
export const SCENE_FRAMES = {
  hook: Math.ceil(8.06 * FPS),           // 8.06s
  problem: Math.ceil(8.86 * FPS),        // 8.86s
  solutionIntro: Math.ceil(5.30 * FPS),  // 5.30s
  step1Capture: Math.ceil(11.59 * FPS),  // 11.59s
  step2Clarify: Math.ceil(9.94 * FPS),   // 9.94s
  step3Prototype: Math.ceil(11.59 * FPS),// 11.59s
  step4Iterate: Math.ceil(9.14 * FPS),   // 9.14s
  recap: Math.ceil(8.09 * FPS),          // 8.09s
  outro: Math.ceil(5.81 * FPS),          // 5.81s
} as const;

// Calculate scene start times
const hookStart = 0;
const problemStart = hookStart + SCENE_FRAMES.hook;
const solutionIntroStart = problemStart + SCENE_FRAMES.problem;
const step1CaptureStart = solutionIntroStart + SCENE_FRAMES.solutionIntro;
const step2ClarifyStart = step1CaptureStart + SCENE_FRAMES.step1Capture;
const step3PrototypeStart = step2ClarifyStart + SCENE_FRAMES.step2Clarify;
const step4IterateStart = step3PrototypeStart + SCENE_FRAMES.step3Prototype;
const recapStart = step4IterateStart + SCENE_FRAMES.step4Iterate;
const outroStart = recapStart + SCENE_FRAMES.recap;

export const SCENES = {
  HOOK: {
    start: hookStart,
    duration: SCENE_FRAMES.hook,
  },
  PROBLEM: {
    start: problemStart,
    duration: SCENE_FRAMES.problem,
  },
  SOLUTION_INTRO: {
    start: solutionIntroStart,
    duration: SCENE_FRAMES.solutionIntro,
  },
  STEP1_CAPTURE: {
    start: step1CaptureStart,
    duration: SCENE_FRAMES.step1Capture,
  },
  STEP2_CLARIFY: {
    start: step2ClarifyStart,
    duration: SCENE_FRAMES.step2Clarify,
  },
  STEP3_PROTOTYPE: {
    start: step3PrototypeStart,
    duration: SCENE_FRAMES.step3Prototype,
  },
  STEP4_ITERATE: {
    start: step4IterateStart,
    duration: SCENE_FRAMES.step4Iterate,
  },
  RECAP: {
    start: recapStart,
    duration: SCENE_FRAMES.recap,
  },
  OUTRO: {
    start: outroStart,
    duration: SCENE_FRAMES.outro,
  },
} as const;

export const TOTAL_DURATION = Object.values(SCENE_FRAMES).reduce((sum, d) => sum + d, 0);

// Video metadata
export const VIDEO_METADATA = {
  title: "아이디어가 현실이 되기까지 - 4단계 프레임워크",
  description: "막연한 아이디어를 구체적인 현실로 만드는 4단계 과정: 포착, 명확화, 프로토타입, 반복",
  tags: [
    "아이디어",
    "창의성",
    "생산성",
    "프로젝트관리",
    "실행력",
    "프레임워크",
  ],
} as const;

export { FPS };
