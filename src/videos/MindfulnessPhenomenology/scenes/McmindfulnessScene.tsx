/**
 * McMindfulness Scene - Critical perspective
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const McmindfulnessScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE CRITIQUE"
      sectionLabelColor={COLORS.danger}
      title="McMindfulness"
      titleIcon="⚠️"
      content={[
        "Ronald Purser warns: corporations strip mindfulness of its ethical context.",
        "Teaching employees to meditate while maintaining exploitative conditions.",
      ]}
      items={[
        { icon: "🏢", text: "Corporate appropriation", color: COLORS.warning },
        { icon: "🔇", text: "Ethics removed", color: COLORS.danger },
        { icon: "🤔", text: "Acceptance vs. transformation", color: COLORS.dark },
      ]}
      highlightContent="Can we reclaim the connection to ethical action?"
      highlightIcon="❓"
      durationInFrames={SCENE_DURATIONS.mcmindfulness}
    />
  );
};

export default McmindfulnessScene;
