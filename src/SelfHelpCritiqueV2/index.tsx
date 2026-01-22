import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { IntroScene } from "./scenes/IntroScene";
import { TwoFacesScene } from "./scenes/TwoFacesScene";
import { NeoliberalismScene } from "./scenes/NeoliberalismScene";
import { PositivityScene } from "./scenes/PositivityScene";
import { MindsetLimitScene } from "./scenes/MindsetLimitScene";
import { SelfEfficacyScene } from "./scenes/SelfEfficacyScene";
import { OutroScene } from "./scenes/OutroScene";
import { SCENES } from "./constants";

export const selfHelpCritiqueV2Schema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

export const SelfHelpCritiqueV2: React.FC<z.infer<typeof selfHelpCritiqueV2Schema>> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      {/* Scene 1: Intro */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <IntroScene />
        <Audio src={staticFile("audio/intro.mp3")} />
      </Sequence>

      {/* Scene 2: Two Faces (소유 vs 존재) */}
      <Sequence from={SCENES.twoFaces.start} durationInFrames={SCENES.twoFaces.duration}>
        <TwoFacesScene />
        <Audio src={staticFile("audio/twoFaces.mp3")} />
      </Sequence>

      {/* Scene 3: Neoliberalism (기업가적 자아) */}
      <Sequence from={SCENES.neoliberalism.start} durationInFrames={SCENES.neoliberalism.duration}>
        <NeoliberalismScene />
        <Audio src={staticFile("audio/neoliberalism.mp3")} />
      </Sequence>

      {/* Scene 4: Positivity (긍정의 배신) */}
      <Sequence from={SCENES.positivity.start} durationInFrames={SCENES.positivity.duration}>
        <PositivityScene />
        <Audio src={staticFile("audio/positivity.mp3")} />
      </Sequence>

      {/* Scene 5: Mindset Limit (성장 마인드셋의 한계) */}
      <Sequence from={SCENES.mindsetLimit.start} durationInFrames={SCENES.mindsetLimit.duration}>
        <MindsetLimitScene />
        <Audio src={staticFile("audio/mindsetLimit.mp3")} />
      </Sequence>

      {/* Scene 6: Self Efficacy (자기효능감의 양면) */}
      <Sequence from={SCENES.selfEfficacy.start} durationInFrames={SCENES.selfEfficacy.duration}>
        <SelfEfficacyScene />
        <Audio src={staticFile("audio/selfEfficacy.mp3")} />
      </Sequence>

      {/* Scene 7: Outro */}
      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}>
        <OutroScene />
        <Audio src={staticFile("audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
