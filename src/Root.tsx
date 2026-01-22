import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { SelfHelpCritiqueEN, selfHelpCritiqueENSchema, TOTAL_DURATION } from "./SelfHelpCritiqueEN";
import { SelfHelpCritiqueFull, selfHelpCritiqueFullSchema, TOTAL_DURATION as TOTAL_DURATION_FULL } from "./SelfHelpCritiqueFull";
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

      {/* Self-Help Ideology Critique - English Version (1 min) */}
      <Composition
        id="SelfHelpCritiqueEN"
        component={SelfHelpCritiqueEN}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={selfHelpCritiqueENSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* Self-Help Ideology Critique - Full Version (6 min) */}
      <Composition
        id="SelfHelpCritiqueFull"
        component={SelfHelpCritiqueFull}
        durationInFrames={TOTAL_DURATION_FULL}
        fps={30}
        width={1920}
        height={1080}
        schema={selfHelpCritiqueFullSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />
    </>
  );
};
