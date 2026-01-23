/**
 * Being Mode Scene - Erich Fromm's Being mode
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const BeingModeScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="ERICH FROMM'S INSIGHT — PART 2"
      sectionLabelColor={COLORS.success}
      title="The Being Mode of Existence"
      titleIcon="🌱"
      content={[
        "The 'Being Mode' focuses not on having more, but on becoming more fully alive. It's about deepening experience, authentic connection, and creative expression.",
        "Learning becomes transformation, not accumulation. Growth happens through engagement with life, not consumption of content.",
      ]}
      items={[
        { icon: "🧘", text: "Present-moment awareness", color: COLORS.success },
        { icon: "💚", text: "Authentic relationships", color: COLORS.success },
        { icon: "🎨", text: "Creative expression", color: COLORS.success },
        { icon: "✨", text: "Inner fulfillment", color: COLORS.success },
      ]}
      highlightContent="True growth is becoming, not acquiring"
      highlightIcon="💡"
      durationInFrames={SCENE_DURATIONS.BEING_MODE}
    />
  );
};

export default BeingModeScene;
