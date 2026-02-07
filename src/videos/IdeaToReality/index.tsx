/**
 * IdeaToReality - 아이디어가 현실이 되기까지
 *
 * Test video showcasing new Remotion features:
 * - @remotion/shapes: AnimatedStar, AnimatedPolygon, AnimatedTriangle, AnimatedRect
 * - @remotion/paths: SelfDrawingPath, LiquidPath, MorphingIcon
 *
 * 4단계 프레임워크: 포착 → 명확화 → 프로토타입 → 반복
 */

import React from "react";
import { Composition, Sequence, Audio, staticFile } from "remotion";
import { z } from "zod";

import { SCENES, TOTAL_DURATION, FPS } from "./constants";

// Audio paths
const AUDIO_BASE = "videos/IdeaToReality/audio";
import {
  HookScene,
  ProblemScene,
  SolutionIntroScene,
  Step1CaptureScene,
  Step2ClarifyScene,
  Step3PrototypeScene,
  Step4IterateScene,
  RecapScene,
  OutroScene,
} from "./scenes";

// Props schema
export const ideaToRealitySchema = z.object({
  showDebugInfo: z.boolean().optional().default(false),
});

export type IdeaToRealityProps = z.infer<typeof ideaToRealitySchema>;

/**
 * Main IdeaToReality composition
 */
export const IdeaToReality: React.FC<IdeaToRealityProps> = ({ showDebugInfo = false }) => {
  return (
    <>
      {/* Scene 1: Hook - 전구 아이콘 SelfDrawingPath */}
      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
        <HookScene />
        <Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      {/* Scene 2: Problem - 흩어진 아이디어들 LiquidPath */}
      <Sequence from={SCENES.PROBLEM.start} durationInFrames={SCENES.PROBLEM.duration}>
        <ProblemScene />
        <Audio src={staticFile(`${AUDIO_BASE}/problem.mp3`)} />
      </Sequence>

      {/* Scene 3: Solution Intro - ? → ! Crossfade */}
      <Sequence from={SCENES.SOLUTION_INTRO.start} durationInFrames={SCENES.SOLUTION_INTRO.duration}>
        <SolutionIntroScene />
        <Audio src={staticFile(`${AUDIO_BASE}/solution_intro.mp3`)} />
      </Sequence>

      {/* Scene 4: Step 1 Capture - AnimatedStar + SelfDrawingPath */}
      <Sequence from={SCENES.STEP1_CAPTURE.start} durationInFrames={SCENES.STEP1_CAPTURE.duration}>
        <Step1CaptureScene />
        <Audio src={staticFile(`${AUDIO_BASE}/step1_capture.mp3`)} />
      </Sequence>

      {/* Scene 5: Step 2 Clarify - 마인드맵 SelfDrawingPath */}
      <Sequence from={SCENES.STEP2_CLARIFY.start} durationInFrames={SCENES.STEP2_CLARIFY.duration}>
        <Step2ClarifyScene />
        <Audio src={staticFile(`${AUDIO_BASE}/step2_clarify.mp3`)} />
      </Sequence>

      {/* Scene 6: Step 3 Prototype - AnimatedPolygon/Rect/Triangle 조합 */}
      <Sequence from={SCENES.STEP3_PROTOTYPE.start} durationInFrames={SCENES.STEP3_PROTOTYPE.duration}>
        <Step3PrototypeScene />
        <Audio src={staticFile(`${AUDIO_BASE}/step3_prototype.mp3`)} />
      </Sequence>

      {/* Scene 7: Step 4 Iterate - LiquidPath 순환 */}
      <Sequence from={SCENES.STEP4_ITERATE.start} durationInFrames={SCENES.STEP4_ITERATE.duration}>
        <Step4IterateScene />
        <Audio src={staticFile(`${AUDIO_BASE}/step4_iterate.mp3`)} />
      </Sequence>

      {/* Scene 8: Recap - 플로우 차트 SelfDrawingPath */}
      <Sequence from={SCENES.RECAP.start} durationInFrames={SCENES.RECAP.duration}>
        <RecapScene />
        <Audio src={staticFile(`${AUDIO_BASE}/recap.mp3`)} />
      </Sequence>

      {/* Scene 9: Outro - 체크마크 SelfDrawingPath + AnimatedStar */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <OutroScene />
        <Audio src={staticFile(`${AUDIO_BASE}/outro.mp3`)} />
      </Sequence>

      {/* Debug overlay */}
      {showDebugInfo && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 12px",
            fontSize: 12,
            fontFamily: "monospace",
            borderRadius: 4,
            zIndex: 9999,
          }}
        >
          Duration: {TOTAL_DURATION} frames ({(TOTAL_DURATION / FPS).toFixed(1)}s)
        </div>
      )}
    </>
  );
};

/**
 * Composition registration component
 */
export const IdeaToRealityComposition: React.FC = () => {
  return (
    <Composition
      id="IdeaToReality"
      component={IdeaToReality}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      schema={ideaToRealitySchema}
      defaultProps={{
        showDebugInfo: false,
      }}
    />
  );
};

export default IdeaToReality;
