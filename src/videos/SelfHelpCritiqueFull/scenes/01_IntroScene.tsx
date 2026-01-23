/**
 * Intro Scene - Hook and overview
 */

import React from "react";
import { IntroTemplate } from "../../../shared/templates/scenes";
import { SCENE_DURATIONS } from "../constants";

export const IntroScene: React.FC = () => {
  return (
    <IntroTemplate
      preTitle="A COMPREHENSIVE CRITICAL ANALYSIS"
      title={"Why Self-Help Books Might Be\nMaking You Worse"}
      subtitle="Uncovering the hidden ideology behind the self-improvement industry"
      background="primary"
      titleSize="3xl"
      subtitleSize="md"
      durationInFrames={SCENE_DURATIONS.INTRO}
    />
  );
};

export default IntroScene;
