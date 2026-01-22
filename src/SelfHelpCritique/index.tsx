import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { IntroScene } from "./scenes/IntroScene";
import { KeyInsightScene } from "./scenes/KeyInsightScene";
import { StatsScene } from "./scenes/StatsScene";
import { ViciousCycleScene } from "./scenes/ViciousCycleScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { OutroScene } from "./scenes/OutroScene";
import { SCENES } from "./constants";

export const selfHelpCritiqueSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

export const SelfHelpCritique: React.FC<z.infer<typeof selfHelpCritiqueSchema>> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      {/* Scene 1: Intro */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <IntroScene />
        <Audio src={staticFile("audio/intro.mp3")} />
      </Sequence>

      {/* Scene 2: Key Insight */}
      <Sequence from={SCENES.keyInsight.start} durationInFrames={SCENES.keyInsight.duration}>
        <KeyInsightScene />
        <Audio src={staticFile("audio/keyInsight.mp3")} />
      </Sequence>

      {/* Scene 3: Statistics */}
      <Sequence from={SCENES.stats.start} durationInFrames={SCENES.stats.duration}>
        <StatsScene />
        <Audio src={staticFile("audio/stats.mp3")} />
      </Sequence>

      {/* Scene 4: Vicious Cycle */}
      <Sequence from={SCENES.viciousCycle.start} durationInFrames={SCENES.viciousCycle.duration}>
        <ViciousCycleScene />
        <Audio src={staticFile("audio/viciousCycle.mp3")} />
      </Sequence>

      {/* Scene 5: Comparison (Having vs Being) */}
      <Sequence from={SCENES.comparison.start} durationInFrames={SCENES.comparison.duration}>
        <ComparisonScene />
        <Audio src={staticFile("audio/comparison.mp3")} />
      </Sequence>

      {/* Scene 6: Outro */}
      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}>
        <OutroScene />
        <Audio src={staticFile("audio/outro.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
