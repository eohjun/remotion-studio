/**
 * Outro Scene - What Real Growth Looks Like
 */

import React from "react";
import { OutroTemplate } from "../../templates/scenes";
import { SCENE_DURATION } from "../constants";

export const OutroScene: React.FC = () => {
  return (
    <OutroTemplate
      title="Authentic Growth"
      titleIcon="🌟"
      takeaways={[
        { icon: "🔍", text: "Question self-help ideologies, not just consume them" },
        { icon: "🧠", text: "Build real self-efficacy through mastery, not mantras" },
        { icon: "👁️", text: "See structural problems, don't only blame yourself" },
        { icon: "🌱", text: "Choose 'being' over 'having' mode of growth" },
      ]}
      closingMessage="True development starts with critical awareness"
      closingIcon="💫"
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default OutroScene;
