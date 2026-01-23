/**
 * Parallel Scene - Mindfulness and Phenomenology Connection
 */

import React from "react";
import { ComparisonTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const ParallelScene: React.FC = () => {
  return (
    <ComparisonTemplate
      sectionLabel="THE REMARKABLE CONNECTION"
      heading="Two Traditions, One Insight"
      leftCard={{
        icon: "📚",
        title: "Phenomenology (1913)",
        color: COLORS.primary,
        items: [
          { text: "• Bracket assumptions" },
          { text: "• Non-judgmental observation" },
          { text: "• Return to direct experience" },
          { text: "• Reveal consciousness structure" },
        ],
      }}
      rightCard={{
        icon: "🧘",
        title: "Mindfulness (500 BCE)",
        color: COLORS.secondary,
        items: [
          { text: "• Non-judgmental awareness" },
          { text: "• Present-moment attention" },
          { text: "• Observe without reacting" },
          { text: "• See the nature of mind" },
        ],
      }}
      separator="≡"
      durationInFrames={SCENE_DURATIONS.mindfulnessParallel}
    />
  );
};

export default ParallelScene;
