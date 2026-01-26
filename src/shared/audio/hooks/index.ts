/**
 * Audio Hooks Barrel Export
 */

// Narration ducking hook
export {
  useNarrationDucking,
  createNarrationSegments,
  mergeNarrationSegments,
} from "./useNarrationDucking";
export type {
  NarrationSegment,
  UseNarrationDuckingOptions,
  UseNarrationDuckingResult,
} from "./useNarrationDucking";

// Beat sync hook
export {
  useBeatSync,
  getBarNumber,
  getBeatInBar,
  isDownbeat,
} from "./useBeatSync";
export type {
  BeatConfig,
  BeatInfo,
  UseBeatSyncResult,
} from "./useBeatSync";

// Audio transition hook
export {
  useAudioTransition,
  useMultiSceneAudio,
  createTransitionTiming,
} from "./useAudioTransition";
export type {
  TransitionTiming,
  UseAudioTransitionOptions,
  UseAudioTransitionResult,
  SceneAudioConfig,
  UseMultiSceneAudioOptions,
} from "./useAudioTransition";
