/**
 * Vipassana Scene - Buddhist origins
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const VipassanaScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE SOURCE"
      sectionLabelColor={COLORS.secondary}
      title="Vipassana: To See Clearly"
      titleIcon="🪷"
      content={[
        "Not about emptying the mind or achieving bliss.",
        "Systematic observation through the four foundations: body, feelings, mental states, and mental objects.",
      ]}
      items={[
        { icon: "🫁", text: "Body sensations", color: COLORS.primary },
        { icon: "💚", text: "Feelings (pleasant, unpleasant, neutral)", color: COLORS.success },
        { icon: "🧠", text: "Mental states", color: COLORS.secondary },
        { icon: "💭", text: "Mental objects", color: COLORS.accent },
      ]}
      highlightContent="Direct insight into impermanence and the constructed self"
      highlightIcon="🔮"
      durationInFrames={SCENE_DURATIONS.vipassanaOrigins}
    />
  );
};

export default VipassanaScene;
