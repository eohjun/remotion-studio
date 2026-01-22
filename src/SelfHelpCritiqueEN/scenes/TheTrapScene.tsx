/**
 * The Trap Scene - Micki McGee's Belabored Self
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATION } from "../constants";

export const TheTrapScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE SELF-HELP PARADOX"
      sectionLabelColor={COLORS.purple}
      title="The Belabored Self"
      titleIcon="🔄"
      content={[
        "Micki McGee reveals how self-help books promise solutions while creating new problems.",
        "The endless pursuit of self-improvement marks your current self as permanently incomplete.",
      ]}
      items={[
        { icon: "📚", text: "More books, more problems", color: COLORS.purple },
        { icon: "😰", text: "Anxiety, not achievement", color: COLORS.danger },
        { icon: "🔥", text: "Burnout, not growth", color: COLORS.warning },
      ]}
      highlightContent="Focus on traits ignores the situations and structures that shape behavior"
      highlightIcon="⚡"
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default TheTrapScene;
