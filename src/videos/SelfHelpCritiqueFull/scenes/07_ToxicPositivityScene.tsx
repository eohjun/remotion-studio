/**
 * Toxic Positivity Scene - Ehrenreich's critique
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const ToxicPositivityScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="BARBARA EHRENREICH'S CRITIQUE"
      sectionLabelColor={COLORS.danger}
      title="The Tyranny of Positive Thinking"
      titleIcon="🎭"
      content={[
        "In 'Bright-Sided,' Ehrenreich exposes how mandatory positivity suppresses legitimate concerns and blinds us to real problems.",
        "She argues the 2008 financial crisis was partly caused by collective positive thinking—a refusal to acknowledge obvious risks.",
      ]}
      items={[
        { icon: "🚫", text: "Negative emotions = personal failure", color: COLORS.danger },
        { icon: "👁️", text: "Reality distortion", color: COLORS.warning },
        { icon: "🤐", text: "Silencing valid concerns", color: COLORS.danger },
        { icon: "💥", text: "2008 crisis as collective denial", color: COLORS.warning },
      ]}
      highlightContent="Sometimes things are genuinely difficult—and that's okay to acknowledge"
      highlightIcon="💬"
      durationInFrames={SCENE_DURATIONS.TOXIC_POSITIVITY}
    />
  );
};

export default ToxicPositivityScene;
