/**
 * Two Faces Scene - Erich Fromm's Having vs Being
 */

import React from "react";
import { ComparisonTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATION } from "../constants";

export const TwoFacesScene: React.FC = () => {
  return (
    <ComparisonTemplate
      sectionLabel="ERICH FROMM'S INSIGHT"
      heading="Two Modes of Self-Development"
      leftCard={{
        icon: "📦",
        title: "Having Mode",
        color: COLORS.danger,
        items: [
          { text: "• Accumulating credentials, skills, certifications" },
          { text: "• Driven by anxiety and comparison" },
          { text: "• Never feels like enough" },
          { text: "• Self as commodity to optimize" },
        ],
      }}
      rightCard={{
        icon: "🌱",
        title: "Being Mode",
        color: COLORS.success,
        items: [
          { text: "• Deepening understanding and presence" },
          { text: "• Authentic expression and connection" },
          { text: "• Growth from inner motivation" },
          { text: "• Self as process of becoming" },
        ],
      }}
      separator="VS"
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default TwoFacesScene;
