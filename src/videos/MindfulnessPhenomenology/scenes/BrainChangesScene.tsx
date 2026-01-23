/**
 * Brain Changes Scene - Neuroscience findings
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const BrainChangesScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE EVIDENCE"
      sectionLabelColor={COLORS.success}
      title="Reshaping the Brain"
      titleIcon="🧠"
      content={[
        "Richard Davidson found unusual gamma wave synchronization in long-term meditators during compassion meditation.",
        "Sara Lazar discovered structural changes: increased gray matter in attention and emotional regulation areas.",
      ]}
      items={[
        { icon: "📊", text: "Gamma wave synchronization", color: COLORS.primary },
        { icon: "📈", text: "Gray matter increase", color: COLORS.success },
        { icon: "⚡", text: "Enhanced emotional regulation", color: COLORS.accent },
      ]}
      highlightContent="Ancient practice reshaping the modern brain"
      highlightIcon="🔬"
      durationInFrames={SCENE_DURATIONS.brainChanges}
    />
  );
};

export default BrainChangesScene;
