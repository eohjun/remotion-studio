/**
 * Having Mode Scene - Erich Fromm's Having mode
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const HavingModeScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="ERICH FROMM'S INSIGHT — PART 1"
      sectionLabelColor={COLORS.danger}
      title="The Having Mode of Existence"
      titleIcon="📦"
      content={[
        "Philosopher Erich Fromm identified two fundamental ways of living. The 'Having Mode' treats life as accumulation—more skills, more credentials, more achievements.",
        "In this mode, you are what you have. Your identity depends on possessions, including knowledge as something to own rather than embody.",
      ]}
      items={[
        { icon: "🎓", text: "Collecting certifications", color: COLORS.danger },
        { icon: "📊", text: "Measuring self by metrics", color: COLORS.danger },
        { icon: "😟", text: "Driven by anxiety and comparison", color: COLORS.danger },
        { icon: "∞", text: "Never enough", color: COLORS.danger },
      ]}
      highlightContent="The Having Mode leads to perpetual dissatisfaction"
      highlightIcon="⚠️"
      durationInFrames={SCENE_DURATIONS.HAVING_MODE}
    />
  );
};

export default HavingModeScene;
