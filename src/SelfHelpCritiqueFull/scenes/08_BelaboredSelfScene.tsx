/**
 * Belabored Self Scene - McGee's paradox
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATIONS } from "../constants";

export const BelaboredSelfScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="MICKI MCGEE'S RESEARCH"
      sectionLabelColor={COLORS.orange}
      title="The Belabored Self"
      titleIcon="🔄"
      content={[
        "McGee's research reveals a cruel irony: self-help books promise solutions while simultaneously creating new problems to solve.",
        "The endless pursuit of improvement marks your current self as permanently incomplete. You're never finished, never enough.",
      ]}
      items={[
        { icon: "📖", text: "Read book → Feel inadequate → Buy next book", color: COLORS.orange },
        { icon: "😓", text: "Exhaustion, not empowerment", color: COLORS.danger },
        { icon: "🎯", text: "Focus on traits, ignore situations", color: COLORS.warning },
      ]}
      highlightContent="Self-help creates the very problems it claims to solve"
      highlightIcon="⚡"
      durationInFrames={SCENE_DURATIONS.BELABORED_SELF}
    />
  );
};

export default BelaboredSelfScene;
