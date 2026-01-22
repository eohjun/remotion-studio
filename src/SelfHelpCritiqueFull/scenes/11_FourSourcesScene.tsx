/**
 * Four Sources Scene - Bandura's framework
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";
import { SCENE_DURATIONS } from "../constants";

export const FourSourcesScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="BANDURA'S FRAMEWORK"
      sectionLabelColor={COLORS.success}
      title="Four Sources of Self-Efficacy"
      titleIcon="🎯"
      content={[
        "Bandura identified four evidence-based ways to build genuine confidence—none of which involve positive affirmations or visualization alone.",
      ]}
      items={[
        { icon: "🏆", text: "Mastery Experiences — Direct success builds strongest belief", color: COLORS.success },
        { icon: "👀", text: "Vicarious Learning — Seeing similar others succeed", color: COLORS.success },
        { icon: "🗣️", text: "Verbal Persuasion — Trusted feedback, not empty praise", color: COLORS.accent },
        { icon: "🧘", text: "Emotional States — Managing anxiety and arousal", color: COLORS.accent },
      ]}
      highlightContent="Real confidence comes from real accomplishment"
      highlightIcon="✅"
      durationInFrames={SCENE_DURATIONS.FOUR_SOURCES}
    />
  );
};

export default FourSourcesScene;
