/**
 * Real World Example Scene - IT worker burnout
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATIONS } from "../constants";

export const RealWorldExampleScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="REAL-WORLD EXAMPLE"
      sectionLabelColor={COLORS.accent}
      title="The IT Worker's Trap"
      titleIcon="💻"
      content={[
        "Consider a software developer pressured to learn new frameworks yearly, maintain side projects, study English, and build a personal brand—all while working full-time.",
        "When exhaustion hits, the self-help answer is always the same: try harder, wake earlier, optimize more. But maybe the problem is structural.",
      ]}
      items={[
        { icon: "📚", text: "Endless skill requirements", color: COLORS.accent },
        { icon: "⏰", text: "24/7 improvement pressure", color: COLORS.warning },
        { icon: "🔥", text: "Burnout blamed on individual", color: COLORS.danger },
      ]}
      highlightContent="Industry instability isn't a personal failure"
      highlightIcon="🎯"
      durationInFrames={SCENE_DURATIONS.REAL_WORLD_EXAMPLE}
    />
  );
};

export default RealWorldExampleScene;
