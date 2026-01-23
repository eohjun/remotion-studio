/**
 * Intro Scene - Hook with the paradox of self-help
 */

import React from "react";
import { IntroTemplate } from "../../../shared/templates/scenes";
import { SCENE_DURATION } from "../constants";

export const IntroScene: React.FC = () => {
  return (
    <IntroTemplate
      preTitle="A CRITICAL EXAMINATION"
      title="The Dark Side of Self-Help"
      subtitle="Why personal development might be keeping you stuck"
      background="primary"
      titleSize="3xl"
      subtitleSize="md"
      durationInFrames={SCENE_DURATION}
    />
  );
};

export default IntroScene;
