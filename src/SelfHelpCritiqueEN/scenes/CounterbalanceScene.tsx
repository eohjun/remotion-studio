/**
 * Counterbalance Scene - Bandura's Self-Efficacy
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATION } from "../constants";

export const CounterbalanceScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="WHAT ACTUALLY WORKS"
      sectionLabelColor={COLORS.success}
      title="The Power of Self-Efficacy"
      titleIcon="💪"
      content={[
        "Albert Bandura's research shows that belief in your ability to succeed directly impacts actual performance.",
        "Unlike toxic positivity, self-efficacy is built on real mastery experiences and specific capabilities.",
      ]}
      items={[
        { icon: "🎯", text: "Mastery experiences", color: COLORS.success },
        { icon: "👀", text: "Learning from others", color: COLORS.success },
        { icon: "🗣️", text: "Trusted feedback", color: COLORS.accent },
        { icon: "🧘", text: "Emotional regulation", color: COLORS.accent },
      ]}
      highlightContent="Task-specific confidence, not blind optimism"
      highlightIcon="✅"
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default CounterbalanceScene;
