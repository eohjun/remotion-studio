/**
 * Therapeutic Scene - MBSR and MBCT
 */

import React from "react";
import { ComparisonTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const TherapeuticScene: React.FC = () => {
  return (
    <ComparisonTemplate
      sectionLabel="THERAPEUTIC APPLICATIONS"
      heading="Evidence-Based Treatments"
      leftCard={{
        icon: "🏥",
        title: "MBSR",
        color: COLORS.primary,
        items: [
          { text: "• Mindfulness-Based Stress Reduction" },
          { text: "• 8-week program" },
          { text: "• Chronic pain management" },
          { text: "• Stress reduction" },
        ],
      }}
      rightCard={{
        icon: "💊",
        title: "MBCT",
        color: COLORS.success,
        items: [
          { text: "• Mindfulness-Based Cognitive Therapy" },
          { text: "• Prevents depression relapse" },
          { text: "• As effective as medication" },
          { text: "• Breaks thought-emotion loops" },
        ],
      }}
      separator="&"
      durationInFrames={SCENE_DURATIONS.therapeuticPower}
    />
  );
};

export default TherapeuticScene;
