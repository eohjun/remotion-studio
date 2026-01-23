/**
 * Neurophenomenology Scene - Varela's integration
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const NeurophenomenologyScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="SCIENCE MEETS EXPERIENCE"
      sectionLabelColor={COLORS.accent}
      title="Neurophenomenology"
      titleIcon="🧬"
      content={[
        "In 1996, Francisco Varela proposed combining first-person phenomenological reports with third-person brain measurements.",
        "Trained meditators describe inner states while researchers measure brain activity.",
      ]}
      items={[
        { icon: "🧘", text: "1st person: inner experience", color: COLORS.secondary },
        { icon: "🔬", text: "3rd person: neural data", color: COLORS.primary },
        { icon: "🤝", text: "Mutual constraint & enrichment", color: COLORS.success },
      ]}
      highlightContent="The subjective and objective informing each other"
      highlightIcon="🔄"
      durationInFrames={SCENE_DURATIONS.neurophenomenology}
    />
  );
};

export default NeurophenomenologyScene;
