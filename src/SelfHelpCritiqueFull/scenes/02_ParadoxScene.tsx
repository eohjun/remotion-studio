/**
 * Paradox Scene - The self-help paradox explained
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATIONS } from "../constants";

export const ParadoxScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE CENTRAL PARADOX"
      sectionLabelColor={COLORS.warning}
      title="The More You Read, The Worse You Feel"
      titleIcon="📚"
      content={[
        "Every year, millions buy self-help books hoping for transformation. Yet studies show that heavy self-help readers often report lower life satisfaction.",
        "The industry promises solutions while creating new insecurities. Each book implies you're not good enough—yet.",
      ]}
      items={[
        { icon: "🔄", text: "Endless cycle of inadequacy", color: COLORS.warning },
        { icon: "💸", text: "$13 billion industry", color: COLORS.warning },
        { icon: "😰", text: "More anxiety, not less", color: COLORS.danger },
      ]}
      highlightContent="What if the problem isn't your effort, but the ideology itself?"
      highlightIcon="🤔"
      durationInFrames={SCENE_DURATIONS.PARADOX}
    />
  );
};

export default ParadoxScene;
