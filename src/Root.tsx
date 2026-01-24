import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { SelfHelpCritiqueEN, selfHelpCritiqueENSchema, TOTAL_DURATION } from "./videos/SelfHelpCritiqueEN";
import { SelfHelpCritiqueFull, selfHelpCritiqueFullSchema, TOTAL_DURATION as TOTAL_DURATION_FULL } from "./videos/SelfHelpCritiqueFull";
import { MindfulnessPhenomenology, mindfulnessPhenomenologySchema, TOTAL_DURATION as TOTAL_DURATION_MINDFULNESS } from "./videos/MindfulnessPhenomenology";
import { OpenAICrisis, openAICrisisSchema, TOTAL_DURATION as TOTAL_DURATION_OPENAI } from "./videos/OpenAICrisis";
import { AIBasicLawKR, aiBasicLawKRSchema, TOTAL_DURATION as TOTAL_DURATION_AILAW } from "./videos/AIBasicLawKR";
import { VisualEffectsDemo, visualEffectsDemoSchema, DEMO_DURATION, AnimationDemo, animationDemoSchema, ANIMATION_DEMO_DURATION, TemplateDemo, templateDemoSchema, TEMPLATE_DEMO_DURATION, ComponentLibraryDemo, componentLibraryDemoSchema, COMPONENT_LIBRARY_DEMO_DURATION, AudioDemo, audioDemoSchema, AUDIO_DEMO_DURATION } from "./demos";
import "./shared/styles/fonts.css";

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

      {/* Mindfulness Phenomenology - Philosophy of Mindfulness (~5 min) */}
      <Composition
        id="MindfulnessPhenomenology"
        component={MindfulnessPhenomenology}
        durationInFrames={TOTAL_DURATION_MINDFULNESS}
        fps={30}
        width={1920}
        height={1080}
        schema={mindfulnessPhenomenologySchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* OpenAI Crisis - Critical examination of OpenAI's transformation (~3.5 min) */}
      <Composition
        id="OpenAICrisis"
        component={OpenAICrisis}
        durationInFrames={TOTAL_DURATION_OPENAI}
        fps={30}
        width={1920}
        height={1080}
        schema={openAICrisisSchema}
        defaultProps={{
          primaryColor: "#dc3545" as const,
          secondaryColor: "#1a1a2e" as const,
        }}
      />

      {/* AI Basic Law Korea - 대한민국 AI 기본법 완벽 정리 (~3 min) */}
      <Composition
        id="AIBasicLawKR"
        component={AIBasicLawKR}
        durationInFrames={TOTAL_DURATION_AILAW}
        fps={30}
        width={1920}
        height={1080}
        schema={aiBasicLawKRSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#1a1a2e" as const,
        }}
      />

      {/* Visual Effects Demo - Showcases Phase 11-13 components */}
      <Composition
        id="VisualEffectsDemo"
        component={VisualEffectsDemo}
        durationInFrames={DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={visualEffectsDemoSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* Animation Demo - Showcases Phase 10 animation system */}
      <Composition
        id="AnimationDemo"
        component={AnimationDemo}
        durationInFrames={ANIMATION_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={animationDemoSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* Template Demo - Showcases Phase 11 scene templates */}
      <Composition
        id="TemplateDemo"
        component={TemplateDemo}
        durationInFrames={TEMPLATE_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={templateDemoSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* Component Library Demo - Showcases Phase 13 component library */}
      <Composition
        id="ComponentLibraryDemo"
        component={ComponentLibraryDemo}
        durationInFrames={COMPONENT_LIBRARY_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={componentLibraryDemoSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* Audio Demo - Showcases Phase 14 audio enhancement system */}
      <Composition
        id="AudioDemo"
        component={AudioDemo}
        durationInFrames={AUDIO_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={audioDemoSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />
    </>
  );
};
