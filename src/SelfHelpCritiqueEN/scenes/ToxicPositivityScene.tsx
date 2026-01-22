/**
 * Toxic Positivity Scene - Barbara Ehrenreich's Bright-Sided
 */

import React from "react";
import { QuoteTemplate } from "../../templates/scenes";
import { SCENE_DURATION } from "../constants";

export const ToxicPositivityScene: React.FC = () => {
  return (
    <QuoteTemplate
      icon="🎭"
      quote="Positive thinking has become a mandatory part of American culture — one that undermines our ability to see reality clearly."
      attribution="Barbara Ehrenreich, Bright-Sided"
      background="danger"
      showQuoteMarks={true}
      context="The pressure to stay positive suppresses legitimate concerns and blames individuals for systemic problems."
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default ToxicPositivityScene;
