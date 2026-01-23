/**
 * Self-Help Ideology Critique - English Version
 *
 * A critical examination of the self-help industry and its ideological underpinnings.
 * Based on insights from Erich Fromm, Ulrich Bröckling, Barbara Ehrenreich,
 * Micki McGee, and Albert Bandura.
 */

import React from "react";
import { Sequence, Audio, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  IntroScene,
  TwoFacesScene,
  NeoliberalismScene,
  ToxicPositivityScene,
  TheTrapScene,
  CounterbalanceScene,
  BalanceScene,
  OutroScene,
} from "./scenes";
import { SCENES, TOTAL_DURATION } from "./constants";

/** Composition props schema */
export const selfHelpCritiqueENSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type SelfHelpCritiqueENProps = z.infer<typeof selfHelpCritiqueENSchema>;

export const SelfHelpCritiqueEN: React.FC<SelfHelpCritiqueENProps> = () => {
  return (
    <>
      {/* Scene 1: Introduction */}
      <Sequence from={SCENES.INTRO.start} durationInFrames={SCENES.INTRO.duration}>
        <IntroScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/intro.mp3")} />
      </Sequence>

      {/* Scene 2: Two Faces of Self-Development (Fromm) */}
      <Sequence from={SCENES.TWO_FACES.start} durationInFrames={SCENES.TWO_FACES.duration}>
        <TwoFacesScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/twoFaces.mp3")} />
      </Sequence>

      {/* Scene 3: The Entrepreneurial Self (Neoliberalism) */}
      <Sequence from={SCENES.NEOLIBERALISM.start} durationInFrames={SCENES.NEOLIBERALISM.duration}>
        <NeoliberalismScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/neoliberalism.mp3")} />
      </Sequence>

      {/* Scene 4: Toxic Positivity (Ehrenreich) */}
      <Sequence
        from={SCENES.TOXIC_POSITIVITY.start}
        durationInFrames={SCENES.TOXIC_POSITIVITY.duration}
      >
        <ToxicPositivityScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/toxicPositivity.mp3")} />
      </Sequence>

      {/* Scene 5: The Trap - Belabored Self (McGee) */}
      <Sequence from={SCENES.THE_TRAP.start} durationInFrames={SCENES.THE_TRAP.duration}>
        <TheTrapScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/theTrap.mp3")} />
      </Sequence>

      {/* Scene 6: Counterbalance - Self-Efficacy (Bandura) */}
      <Sequence
        from={SCENES.COUNTERBALANCE.start}
        durationInFrames={SCENES.COUNTERBALANCE.duration}
      >
        <CounterbalanceScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/counterbalance.mp3")} />
      </Sequence>

      {/* Scene 7: Balance - Individual vs Structural */}
      <Sequence from={SCENES.BALANCE.start} durationInFrames={SCENES.BALANCE.duration}>
        <BalanceScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/balance.mp3")} />
      </Sequence>

      {/* Scene 8: Outro */}
      <Sequence from={SCENES.OUTRO.start} durationInFrames={SCENES.OUTRO.duration}>
        <OutroScene />
        <Audio src={staticFile("videos/SelfHelpCritiqueEN/audio/outro.mp3")} />
      </Sequence>
    </>
  );
};

export { TOTAL_DURATION };
export default SelfHelpCritiqueEN;
