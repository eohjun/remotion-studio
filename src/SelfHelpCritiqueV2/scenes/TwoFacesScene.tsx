import React from "react";
import { ComparisonLayout, COLORS } from "../../components";
import { SCENES } from "../constants";

export const TwoFacesScene: React.FC = () => {
  return (
    <ComparisonLayout
      sectionTitle="에리히 프롬"
      heading="자기개발의 두 양식"
      leftCard={{
        icon: "📦",
        title: "소유 양식",
        color: COLORS.danger,
        items: [
          { text: "더 많은 지식을 갖는 것", highlight: false },
          { text: "자격증, 스펙 수집", highlight: false },
          { text: "불안과 비교에서 시작", highlight: false },
          { text: "결코 만족에 이르지 못함", highlight: true, color: COLORS.danger },
        ],
      }}
      rightCard={{
        icon: "🌱",
        title: "존재 양식",
        color: COLORS.success,
        items: [
          { text: "더 깊이 이해하고 되는 것", highlight: false },
          { text: "진정성 있는 성장", highlight: false },
          { text: "내면의 충만함 추구", highlight: false },
          { text: "지속 가능한 만족", highlight: true, color: COLORS.success },
        ],
      }}
      backgroundColor={COLORS.dark}
      durationInFrames={SCENES.twoFaces.duration}
      separator="VS"
    />
  );
};
