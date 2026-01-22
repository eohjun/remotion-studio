import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { SelfHelpCritique, selfHelpCritiqueSchema } from "./SelfHelpCritique";
import { TOTAL_DURATION } from "./SelfHelpCritique/constants";
import { SelfHelpCritiqueV2, selfHelpCritiqueV2Schema } from "./SelfHelpCritiqueV2";
import { TOTAL_DURATION as TOTAL_DURATION_V2 } from "./SelfHelpCritiqueV2/constants";
import "./styles/fonts.css";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />

      {/* 자기개발 비판 영상 V1 */}
      <Composition
        id="SelfHelpCritique"
        component={SelfHelpCritique}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={selfHelpCritiqueSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* 자기개발 비판 영상 V2 - 옵시디언 노트 기반 풍성한 버전 */}
      <Composition
        id="SelfHelpCritiqueV2"
        component={SelfHelpCritiqueV2}
        durationInFrames={TOTAL_DURATION_V2}
        fps={30}
        width={1920}
        height={1080}
        schema={selfHelpCritiqueV2Schema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />
    </>
  );
};
