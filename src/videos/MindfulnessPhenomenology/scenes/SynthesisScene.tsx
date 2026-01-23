/**
 * Synthesis Scene - What we've learned
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const SynthesisScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="SYNTHESIS"
      sectionLabelColor={COLORS.accent}
      title="The Deep Truth"
      titleIcon="🌟"
      content={[
        "Phenomenology and mindfulness converge: by suspending automatic judgments and simply observing, we discover the constructed nature of experience.",
        "This isn't escapism — it's the deepest engagement with reality.",
      ]}
      items={[
        { icon: "🔍", text: "Suspend judgment → See clearly", color: COLORS.primary },
        { icon: "🧩", text: "Experience is constructed", color: COLORS.secondary },
        { icon: "⚖️", text: "Balance: transformation + ethics", color: COLORS.success },
      ]}
      highlightContent="The question: how to practice with integrity"
      highlightIcon="💫"
      durationInFrames={SCENE_DURATIONS.synthesis}
    />
  );
};

export default SynthesisScene;
