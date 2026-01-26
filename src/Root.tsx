import { Composition, Still } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { VIDEO_REGISTRY } from "./videos/registry";
import { Thumbnail, thumbnailSchema } from "./Thumbnail";
import {
  TwoMinuteRule,
  TwoMinuteRuleSchema,
} from "./videos/TwoMinuteRule";
import {
  TOTAL_DURATION as TOTAL_DURATION_2MIN,
  FPS as FPS_2MIN,
  WIDTH as WIDTH_2MIN,
  HEIGHT as HEIGHT_2MIN,
} from "./videos/TwoMinuteRule/constants";
import {
  ParkinsonsLaw,
  ParkinsonsLawSchema,
} from "./videos/ParkinsonsLaw";
import {
  TOTAL_DURATION as TOTAL_DURATION_PL,
  FPS as FPS_PL,
} from "./videos/ParkinsonsLaw/constants";
import {
  VisualEffectsDemo,
  visualEffectsDemoSchema,
  DEMO_DURATION,
  AnimationDemo,
  animationDemoSchema,
  ANIMATION_DEMO_DURATION,
  TemplateDemo,
  templateDemoSchema,
  TEMPLATE_DEMO_DURATION,
  ComponentLibraryDemo,
  componentLibraryDemoSchema,
  COMPONENT_LIBRARY_DEMO_DURATION,
  AudioDemo,
  audioDemoSchema,
  AUDIO_DEMO_DURATION,
  NewFeaturesDemo,
  newFeaturesDemoSchema,
  NEW_FEATURES_DEMO_DURATION,
} from "./demos";
import "./shared/styles/fonts.css";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Example compositions */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
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

      {/* Video compositions from registry */}
      {VIDEO_REGISTRY.map((video) => (
        <Composition
          key={video.id}
          id={video.id}
          component={video.component}
          durationInFrames={video.durationInFrames}
          fps={video.fps ?? 30}
          width={video.width ?? 1920}
          height={video.height ?? 1080}
          schema={video.schema}
          defaultProps={video.defaultProps}
        />
      ))}

      {/* YouTube Shorts compositions */}
      <Composition
        id="TwoMinuteRule"
        component={TwoMinuteRule}
        durationInFrames={TOTAL_DURATION_2MIN}
        fps={FPS_2MIN}
        width={WIDTH_2MIN}
        height={HEIGHT_2MIN}
        schema={TwoMinuteRuleSchema}
        defaultProps={{}}
      />

      {/* Educational videos */}
      <Composition
        id="ParkinsonsLaw"
        component={ParkinsonsLaw}
        durationInFrames={TOTAL_DURATION_PL}
        fps={FPS_PL}
        width={1920}
        height={1080}
        schema={ParkinsonsLawSchema}
        defaultProps={{}}
      />

      {/* Demo compositions */}
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
      <Composition
        id="NewFeaturesDemo"
        component={NewFeaturesDemo}
        durationInFrames={NEW_FEATURES_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={newFeaturesDemoSchema}
        defaultProps={{
          primaryColor: "#667eea" as const,
          secondaryColor: "#764ba2" as const,
        }}
      />

      {/* Thumbnail composition for static image generation */}
      <Still
        id="Thumbnail"
        component={Thumbnail}
        width={1920}
        height={1080}
        schema={thumbnailSchema}
        defaultProps={{
          title: "Video Title",
          subtitle: undefined,
          primaryColor: "#667eea",
          secondaryColor: "#764ba2",
          backgroundStyle: "gradient",
          showLogo: true,
          titleSize: "large",
          icon: undefined,
        }}
      />
    </>
  );
};
