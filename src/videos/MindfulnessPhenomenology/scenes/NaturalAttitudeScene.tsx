/**
 * Natural Attitude Scene - The everyday autopilot
 */

import React from "react";
import { ContentTemplate } from "../../../shared/templates/scenes";
import { COLORS } from "../../../shared/components/constants";
import { SCENE_DURATIONS } from "../constants";

export const NaturalAttitudeScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE PROBLEM"
      sectionLabelColor={COLORS.warning}
      title="The Natural Attitude"
      titleIcon="🤖"
      content={[
        "In everyday life, we operate on autopilot. We take the world for granted.",
        "We react automatically, confusing our thoughts with reality itself.",
      ]}
      items={[
        { icon: "⚡", text: "Automatic reactions", color: COLORS.warning },
        { icon: "🔄", text: "Thoughts feel like facts", color: COLORS.warning },
        { icon: "😶‍🌫️", text: "Experience filtered", color: COLORS.dark },
      ]}
      highlightContent="Both traditions offer escape from mental autopilot"
      highlightIcon="🚪"
      durationInFrames={SCENE_DURATIONS.naturalAttitude}
    />
  );
};

export default NaturalAttitudeScene;
