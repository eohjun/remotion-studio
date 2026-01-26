// Scene templates barrel export
export { IntroTemplate } from "./IntroTemplate";
export type { IntroTemplateProps } from "./IntroTemplate";

export { ContentTemplate } from "./ContentTemplate";
export type { ContentTemplateProps } from "./ContentTemplate";

export { ComparisonTemplate } from "./ComparisonTemplate";
export type { ComparisonTemplateProps } from "./ComparisonTemplate";

export { QuoteTemplate } from "./QuoteTemplate";
export type { QuoteTemplateProps } from "./QuoteTemplate";

export { OutroTemplate } from "./OutroTemplate";
export type { OutroTemplateProps } from "./OutroTemplate";

// Phase 11: New Templates
export { DataVisualizationTemplate } from "./DataVisualizationTemplate";
export type { DataVisualizationTemplateProps } from "./DataVisualizationTemplate";

export { TimelineTemplate } from "./TimelineTemplate";
export type { TimelineTemplateProps } from "./TimelineTemplate";

export { ImageTemplate } from "./ImageTemplate";
export type { ImageTemplateProps } from "./ImageTemplate";

export { AnnotationTemplate } from "./AnnotationTemplate";
export type { AnnotationTemplateProps } from "./AnnotationTemplate";

export { StoryTemplate } from "./StoryTemplate";
export type { StoryTemplateProps } from "./StoryTemplate";

// Phase 17: Additional Templates
export { NewsTemplate } from "./NewsTemplate";
export type { NewsTemplateProps, NewsStyle } from "./NewsTemplate";

export { InterviewTemplate } from "./InterviewTemplate";
export type {
  InterviewTemplateProps,
  InterviewLayout,
  Speaker,
  DialogueEntry,
} from "./InterviewTemplate";

export { ProductShowcaseTemplate } from "./ProductShowcaseTemplate";
export type {
  ProductShowcaseTemplateProps,
  ShowcaseLayout,
  FeatureItem,
  SpecItem,
  RatingInfo,
} from "./ProductShowcaseTemplate";

// Phase 19: TableListTemplate
export { TableListTemplate } from "./TableListTemplate";
export type {
  TableListTemplateProps,
  DisplayMode,
  TableRow,
  ListItem,
} from "./TableListTemplate";

// SceneBase - Unified base component
export {
  SceneBase,
  CenteredScene,
  FullBleedScene,
  BroadcastSafeScene,
  CinematicScene,
} from "./SceneBase";
export type {
  SceneBaseProps,
  SafeAreaPadding,
  ContentAlignment,
  SceneEntryAnimation,
} from "./SceneBase";

// Types
export type {
  BaseSceneProps,
  SceneAnimationConfig,
  StyledText,
  IconItem,
  CardData,
  // Phase 11 types
  DataItem,
  TimelineEvent,
  ImageItem,
  Annotation,
  StoryPanel,
} from "./types";
