/**
 * Outro Scene - Authentic growth
 */

import React from "react";
import { OutroTemplate } from "../../../shared/templates/scenes";
import { SCENE_DURATIONS } from "../constants";

export const OutroScene: React.FC = () => {
  return (
    <OutroTemplate
      title="Toward Authentic Growth"
      titleIcon="🌟"
      takeaways={[
        { icon: "🔍", text: "Question self-help ideologies—don't just consume them" },
        { icon: "🌱", text: "Choose 'being' over 'having' mode of development" },
        { icon: "💪", text: "Build real self-efficacy through mastery, not mantras" },
        { icon: "👁️", text: "See structural problems—don't only blame yourself" },
        { icon: "🤝", text: "Seek collective solutions alongside personal growth" },
      ]}
      closingMessage="You are already enough. True growth starts with that recognition."
      closingIcon="💫"
      durationInFrames={SCENE_DURATIONS.OUTRO}
    />
  );
};

export default OutroScene;
