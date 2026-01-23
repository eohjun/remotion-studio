/**
 * Neoliberalism Scene - The broader context
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const NeoliberalismScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE BIGGER PICTURE"
      sectionLabelColor={COLORS.purple}
      title="The Neoliberal Context"
      titleIcon="🏛️"
      content={[
        "Self-help didn't emerge in a vacuum. As welfare states shrank and job security vanished, individuals were told to become their own safety nets.",
        "Structural problems—inequality, precarious employment, rising costs—became reframed as personal failures requiring individual solutions.",
      ]}
      items={[
        { icon: "📉", text: "Welfare state decline", color: COLORS.purple },
        { icon: "💼", text: "Job insecurity normalized", color: COLORS.purple },
        { icon: "🎯", text: "Systemic issues → personal blame", color: COLORS.danger },
      ]}
      highlightContent="When society fails you, you're told to upgrade yourself"
      highlightIcon="🔄"
      durationInFrames={SCENE_DURATIONS.NEOLIBERALISM}
    />
  );
};

export default NeoliberalismScene;
