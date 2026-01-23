/**
 * Structural Balance Scene - Individual vs structural attribution
 */

import React from "react";
import { ComparisonTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const StructuralBalanceScene: React.FC = () => {
  return (
    <ComparisonTemplate
      sectionLabel="FINDING BALANCE"
      heading="Individual Effort + Structural Awareness"
      leftCard={{
        icon: "👤",
        title: "Personal Agency",
        color: COLORS.primary,
        items: [
          { text: "• Skills can be developed" },
          { text: "• Effort often matters" },
          { text: "• Mindset affects experience" },
          { text: "• Small actions compound" },
        ],
      }}
      rightCard={{
        icon: "🏛️",
        title: "Structural Reality",
        color: COLORS.secondary,
        items: [
          { text: "• Systems shape opportunities" },
          { text: "• Not all failures are personal" },
          { text: "• Collective action is needed" },
          { text: "• Context always matters" },
        ],
      }}
      separator="+"
      durationInFrames={SCENE_DURATIONS.STRUCTURAL_BALANCE}
    />
  );
};

export default StructuralBalanceScene;
