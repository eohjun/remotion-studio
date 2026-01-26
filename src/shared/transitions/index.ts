/**
 * Scene Transition System
 *
 * Provides a comprehensive transition system for Remotion compositions.
 *
 * @example
 * ```tsx
 * import { TransitionComposition, TRANSITION_PRESETS } from "./transitions";
 *
 * const scenes = [
 *   { id: "intro", component: IntroScene, durationInFrames: 480, audio: "audio/intro.mp3" },
 *   { id: "content", component: ContentScene, durationInFrames: 600, transition: PRESETS.slideLeft },
 * ];
 *
 * export const MyVideo = () => (
 *   <TransitionComposition scenes={scenes} defaultTransition={PRESETS.fade} />
 * );
 * ```
 */

// Types
export type {
  TransitionType,
  TransitionDirection,
  TransitionConfig,
  SceneDefinition,
  SceneComponentProps,
  TransitionCompositionProps,
  TransitionPresetName,
} from "./types";

// Presets
export {
  TRANSITION_PRESETS,
  TRANSITION_SPRING_PRESETS,
  DEFAULT_TRANSITION_DURATION,
  getPreset,
  createTransition,
} from "./presets";

// Utilities
export {
  calculateTotalDuration,
  calculateSceneTimings,
  mapDirection,
  validateScenes,
  getEffectiveTransition,
  formatDuration,
} from "./utils";

// Components
export { TransitionComposition } from "./TransitionComposition";
export { default } from "./TransitionComposition";

// Custom transitions
export { dissolve } from "./custom/dissolve";
export { zoom } from "./custom/zoom";
export { morph } from "./custom/morph";
export { glitch } from "./custom/glitch";
export { blinds } from "./custom/blinds";
export { ripple } from "./custom/ripple";

// Custom transition types
export type { DissolveProps } from "./custom/dissolve";
export type { ZoomProps } from "./custom/zoom";
export type { MorphProps } from "./custom/morph";
export type { GlitchProps } from "./custom/glitch";
export type { BlindsProps } from "./custom/blinds";
export type { RippleProps } from "./custom/ripple";
