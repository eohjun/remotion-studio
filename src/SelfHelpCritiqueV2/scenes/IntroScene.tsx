import React from "react";
import { TitleCard } from "../../components";
import { SCENES } from "../constants";

export const IntroScene: React.FC = () => {
  return (
    <TitleCard
      preSubtitleIcon="🔍 비판적 시각으로 바라보는"
      title="자기개발 이데올로기"
      subtitle="왜 더 노력할수록 더 지치는 걸까요?"
      background="primary"
      durationInFrames={SCENES.intro.duration}
      titleSize="3xl"
      subtitleSize="md"
    />
  );
};
