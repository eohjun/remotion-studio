/**
 * Self-Help Ideology Critique - Full Version (English)
 *
 * A comprehensive critical examination of the self-help industry.
 * ~6 minutes runtime with 14 scenes.
 */

import React from "react";
import { Sequence, Audio, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  IntroScene,
  ParadoxScene,
  HavingModeScene,
  BeingModeScene,
  NeoliberalismScene,
  EntrepreneurialSelfScene,
  ToxicPositivityScene,
  BelaboredSelfScene,
  RealWorldExampleScene,
  SelfEfficacyScene,
  FourSourcesScene,
  GrowthMindsetLimitsScene,
  StructuralBalanceScene,
  OutroScene,
} from "./scenes";
import { SCENES, TOTAL_DURATION } from "./constants";

export const selfHelpCritiqueFullSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type SelfHelpCritiqueFullProps = z.infer<typeof selfHelpCritiqueFullSchema>;

export const SelfHelpCritiqueFull: React.FC<SelfHelpCritiqueFullProps> = () => {
  return (
    <>
      {/* Scene 1: Introduction */}
      <Sequence from={SCENES.INTRO.start} durationInFrames={SCENES.INTRO.duration}>
        <IntroScene />
        <Audio src={staticFile("audio/en-full/intro.mp3")} />
      </Sequence>

      {/* Scene 2: The Paradox */}
      <Sequence from={SCENES.PARADOX.start} durationInFrames={SCENES.PARADOX.duration}>
        <ParadoxScene />
        <Audio src={staticFile("audio/en-full/paradox.mp3")} />
      </Sequence>

      {/* Scene 3: Having Mode */}
      <Sequence from={SCENES.HAVING_MODE.start} durationInFrames={SCENES.HAVING_MODE.duration}>
        <HavingModeScene />
        <Audio src={staticFile("audio/en-full/havingMode.mp3")} />
      </Sequence>

      {/* Scene 4: Being Mode */}
      <Sequence from={SCENES.BEING_MODE.start} durationInFrames={SCENES.BEING_MODE.duration}>
        <BeingModeScene />
        <Audio src={staticFile("audio/en-full/beingMode.mp3")} />
      </Sequence>

      {/* Scene 5: Neoliberalism */}
      <Sequence from={SCENES.NEOLIBERALISM.start} durationInFrames={SCENES.NEOLIBERALISM.duration}>
        <NeoliberalismScene />
        <Audio src={staticFile("audio/en-full/neoliberalism.mp3")} />
      </Sequence>

      {/* Scene 6: Entrepreneurial Self */}
      <Sequence
        from={SCENES.ENTREPRENEURIAL_SELF.start}
        durationInFrames={SCENES.ENTREPRENEURIAL_SELF.duration}
      >
        <EntrepreneurialSelfScene />
        <Audio src={staticFile("audio/en-full/entrepreneurialSelf.mp3")} />
      </Sequence>

      {/* Scene 7: Toxic Positivity */}
      <Sequence
        from={SCENES.TOXIC_POSITIVITY.start}
        durationInFrames={SCENES.TOXIC_POSITIVITY.duration}
      >
        <ToxicPositivityScene />
        <Audio src={staticFile("audio/en-full/toxicPositivity.mp3")} />
      </Sequence>

      {/* Scene 8: Belabored Self */}
      <Sequence
        from={SCENES.BELABORED_SELF.start}
        durationInFrames={SCENES.BELABORED_SELF.duration}
      >
        <BelaboredSelfScene />
        <Audio src={staticFile("audio/en-full/belaboredSelf.mp3")} />
      </Sequence>

      {/* Scene 9: Real World Example */}
      <Sequence
        from={SCENES.REAL_WORLD_EXAMPLE.start}
        durationInFrames={SCENES.REAL_WORLD_EXAMPLE.duration}
      >
        <RealWorldExampleScene />
        <Audio src={staticFile("audio/en-full/realWorldExample.mp3")} />
      </Sequence>

      {/* Scene 10: Self-Efficacy */}
      <Sequence
        from={SCENES.SELF_EFFICACY.start}
        durationInFrames={SCENES.SELF_EFFICACY.duration}
      >
        <SelfEfficacyScene />
        <Audio src={staticFile("audio/en-full/selfEfficacy.mp3")} />
      </Sequence>

      {/* Scene 11: Four Sources */}
      <Sequence from={SCENES.FOUR_SOURCES.start} durationInFrames={SCENES.FOUR_SOURCES.duration}>
        <FourSourcesScene />
        <Audio src={staticFile("audio/en-full/fourSources.mp3")} />
      </Sequence>

      {/* Scene 12: Growth Mindset Limits */}
      <Sequence
        from={SCENES.GROWTH_MINDSET_LIMITS.start}
        durationInFrames={SCENES.GROWTH_MINDSET_LIMITS.duration}
      >
        <GrowthMindsetLimitsScene />
        <Audio src={staticFile("audio/en-full/growthMindsetLimits.mp3")} />
      </Sequence>

      {/* Scene 13: Structural Balance */}
      <Sequence
        from={SCENES.STRUCTURAL_BALANCE.start}
        durationInFrames={SCENES.STRUCTURAL_BALANCE.duration}
      >
        <StructuralBalanceScene />
        <Audio src={staticFile("audio/en-full/structuralBalance.mp3")} />
      </Sequence>

      {/* Scene 14: Outro */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <OutroScene />
        <Audio src={staticFile("audio/en-full/outro.mp3")} />
      </Sequence>
    </>
  );
};

export { TOTAL_DURATION };
export default SelfHelpCritiqueFull;
