/**
 * Growth Mindset Limits Scene - When it becomes ideology
 */

import React from "react";
import { ComparisonTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATIONS } from "../constants";

export const GrowthMindsetLimitsScene: React.FC = () => {
  return (
    <ComparisonTemplate
      sectionLabel="A NUANCED VIEW"
      heading="Growth Mindset: Tool or Ideology?"
      leftCard={{
        icon: "✅",
        title: "Helpful When...",
        color: COLORS.success,
        items: [
          { text: "• Combined with real support systems" },
          { text: "• Applied to genuinely learnable skills" },
          { text: "• Paired with structural change" },
          { text: "• Used as one tool among many" },
        ],
      }}
      rightCard={{
        icon: "⚠️",
        title: "Harmful When...",
        color: COLORS.danger,
        items: [
          { text: "• Used to ignore systemic barriers" },
          { text: "• Becomes sole explanation for outcomes" },
          { text: "• Replaces needed resources" },
          { text: "• Blames individuals for structural failures" },
        ],
      }}
      separator="VS"
      durationInFrames={SCENE_DURATIONS.GROWTH_MINDSET_LIMITS}
    />
  );
};

export default GrowthMindsetLimitsScene;
