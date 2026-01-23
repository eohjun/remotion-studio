/**
 * Self-Efficacy Scene - What actually works
 */

import React from "react";
import { QuoteTemplate } from "../../../shared/templates/scenes";
import { SCENE_DURATIONS } from "../constants";

export const SelfEfficacyScene: React.FC = () => {
  return (
    <QuoteTemplate
      icon="💪"
      quote="People's beliefs about their capabilities to produce effects directly influence their choices, effort, and persistence."
      attribution="Albert Bandura, Self-Efficacy Theory"
      background="success"
      showQuoteMarks={true}
      context="Unlike toxic positivity, self-efficacy is specific, evidence-based, and built through real experience—not affirmations."
      durationInFrames={SCENE_DURATIONS.SELF_EFFICACY}
    />
  );
};

export default SelfEfficacyScene;
