/**
 * Balance Scene - Individual vs Structural Attribution
 */

import React from "react";
import { ComparisonTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATION } from "../constants";

export const BalanceScene: React.FC = () => {
  return (
    <ComparisonTemplate
      sectionLabel="FINDING THE BALANCE"
      heading="Beyond Self-Blame"
      leftCard={{
        icon: "👤",
        title: "Individual Effort",
        color: COLORS.primary,
        items: [
          { text: "• Personal responsibility matters" },
          { text: "• Skills can be developed" },
          { text: "• Mindset affects outcomes" },
          { text: "• Agency is empowering" },
        ],
      }}
      rightCard={{
        icon: "🏛️",
        title: "Structural Reality",
        color: COLORS.secondary,
        items: [
          { text: "• Systems shape opportunities" },
          { text: "• Not all failures are personal" },
          { text: "• Collective action needed" },
          { text: "• Context matters" },
        ],
      }}
      separator="+"
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default BalanceScene;
