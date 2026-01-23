/**
 * Embodied Awareness Scene - Merleau-Ponty
 */

import React from "react";
import { QuoteTemplate } from "../../../shared/templates/scenes";
import { SCENE_DURATIONS } from "../constants";

export const EmbodiedScene: React.FC = () => {
  return (
    <QuoteTemplate
      quote="We don't have bodies. We are bodies that think."
      attribution="Merleau-Ponty's Insight"
      icon="🫀"
      background="primary"
      durationInFrames={SCENE_DURATIONS.embodiedAwareness}
    />
  );
};

export default EmbodiedScene;
