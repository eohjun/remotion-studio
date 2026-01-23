/**
 * Mindfulness Phenomenology - The Philosophy of Mindfulness
 *
 * Exploring the connection between phenomenology, mindfulness,
 * metacognition, and neuroscience.
 *
 * Based on insights from Husserl, Varela, Kabat-Zinn, and others.
 */

import React from "react";
import { Sequence, Audio, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  IntroScene,
  EpocheScene,
  ParallelScene,
  NaturalAttitudeScene,
  MetacognitionScene,
  DecenteringScene,
  NeurophenomenologyScene,
  BrainChangesScene,
  VipassanaScene,
  TherapeuticScene,
  McmindfulnessScene,
  EmbodiedScene,
  SynthesisScene,
  OutroScene,
} from "./scenes";
import { SCENES, TOTAL_DURATION } from "./constants";

/** Composition props schema */
export const mindfulnessPhenomenologySchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type MindfulnessPhenomenologyProps = z.infer<typeof mindfulnessPhenomenologySchema>;

export const MindfulnessPhenomenology: React.FC<MindfulnessPhenomenologyProps> = () => {
  const audioBasePath = "videos/MindfulnessPhenomenology/audio";

  return (
    <>
      {/* Scene 1: Introduction */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <IntroScene />
        <Audio src={staticFile(`${audioBasePath}/intro.mp3`)} />
      </Sequence>

      {/* Scene 2: Husserl's Epoché */}
      <Sequence from={SCENES.epocheIntro.start} durationInFrames={SCENES.epocheIntro.duration}>
        <EpocheScene />
        <Audio src={staticFile(`${audioBasePath}/epocheIntro.mp3`)} />
      </Sequence>

      {/* Scene 3: Phenomenology-Mindfulness Parallel */}
      <Sequence from={SCENES.mindfulnessParallel.start} durationInFrames={SCENES.mindfulnessParallel.duration}>
        <ParallelScene />
        <Audio src={staticFile(`${audioBasePath}/mindfulnessParallel.mp3`)} />
      </Sequence>

      {/* Scene 4: Natural Attitude */}
      <Sequence from={SCENES.naturalAttitude.start} durationInFrames={SCENES.naturalAttitude.duration}>
        <NaturalAttitudeScene />
        <Audio src={staticFile(`${audioBasePath}/naturalAttitude.mp3`)} />
      </Sequence>

      {/* Scene 5: Metacognition */}
      <Sequence from={SCENES.metacognition.start} durationInFrames={SCENES.metacognition.duration}>
        <MetacognitionScene />
        <Audio src={staticFile(`${audioBasePath}/metacognition.mp3`)} />
      </Sequence>

      {/* Scene 6: Decentering */}
      <Sequence from={SCENES.decentering.start} durationInFrames={SCENES.decentering.duration}>
        <DecenteringScene />
        <Audio src={staticFile(`${audioBasePath}/decentering.mp3`)} />
      </Sequence>

      {/* Scene 7: Neurophenomenology */}
      <Sequence from={SCENES.neurophenomenology.start} durationInFrames={SCENES.neurophenomenology.duration}>
        <NeurophenomenologyScene />
        <Audio src={staticFile(`${audioBasePath}/neurophenomenology.mp3`)} />
      </Sequence>

      {/* Scene 8: Brain Changes */}
      <Sequence from={SCENES.brainChanges.start} durationInFrames={SCENES.brainChanges.duration}>
        <BrainChangesScene />
        <Audio src={staticFile(`${audioBasePath}/brainChanges.mp3`)} />
      </Sequence>

      {/* Scene 9: Vipassana Origins */}
      <Sequence from={SCENES.vipassanaOrigins.start} durationInFrames={SCENES.vipassanaOrigins.duration}>
        <VipassanaScene />
        <Audio src={staticFile(`${audioBasePath}/vipassanaOrigins.mp3`)} />
      </Sequence>

      {/* Scene 10: Therapeutic Power */}
      <Sequence from={SCENES.therapeuticPower.start} durationInFrames={SCENES.therapeuticPower.duration}>
        <TherapeuticScene />
        <Audio src={staticFile(`${audioBasePath}/therapeuticPower.mp3`)} />
      </Sequence>

      {/* Scene 11: McMindfulness Critique */}
      <Sequence from={SCENES.mcmindfulness.start} durationInFrames={SCENES.mcmindfulness.duration}>
        <McmindfulnessScene />
        <Audio src={staticFile(`${audioBasePath}/mcmindfulness.mp3`)} />
      </Sequence>

      {/* Scene 12: Embodied Awareness */}
      <Sequence from={SCENES.embodiedAwareness.start} durationInFrames={SCENES.embodiedAwareness.duration}>
        <EmbodiedScene />
        <Audio src={staticFile(`${audioBasePath}/embodiedAwareness.mp3`)} />
      </Sequence>

      {/* Scene 13: Synthesis */}
      <Sequence from={SCENES.synthesis.start} durationInFrames={SCENES.synthesis.duration}>
        <SynthesisScene />
        <Audio src={staticFile(`${audioBasePath}/synthesis.mp3`)} />
      </Sequence>

      {/* Scene 14: Outro */}
      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}>
        <OutroScene />
        <Audio src={staticFile(`${audioBasePath}/outro.mp3`)} />
      </Sequence>
    </>
  );
};

export { TOTAL_DURATION };
export default MindfulnessPhenomenology;
