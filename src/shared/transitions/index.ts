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
