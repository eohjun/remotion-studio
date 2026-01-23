/**
 * Audio Enhancement System
 *
 * A comprehensive audio system for Remotion compositions including:
 * - Background music with volume automation
 * - Sound effects with precise timing
 * - Multi-track audio management
 * - Volume ducking for narration
 *
 * @example
 * ```tsx
 * import {
 *   BackgroundMusic,
 *   SoundEffect,
 *   AudioLayer,
 *   MUSIC_PRESETS,
 *   duckVolume,
 * } from "../audio";
 *
 * const MyComposition = () => {
 *   const frame = useCurrentFrame();
 *   const bgVolume = duckVolume(frame, [[30, 150]], 0.3, "standard");
 *
 *   return (
 *     <>
 *       <BackgroundMusic
 *         src={staticFile("audio/music/ambient.mp3")}
 *         volume={bgVolume}
 *       />
 *       <SoundEffect
 *         src={staticFile("audio/sfx/whoosh.mp3")}
 *         startFrame={0}
 *       />
 *     </>
 *   );
 * };
 * ```
 */

// Types
export type {
  BackgroundMusicProps,
  SoundEffectProps,
  AudioTrack,
  AudioLayerProps,
  DuckingConfig,
  NarrationRange,
  MusicPreset,
  SFXPreset,
  LoopPoints,
  AudioTiming,
} from "./types";

// Presets
export {
  MUSIC_PRESETS,
  SFX_PRESETS,
  DUCKING_PRESETS,
  VOLUME_LEVELS,
  getMusicPreset,
  getSFXPreset,
  getDuckingPreset,
  createMusicPreset,
  createSFXPreset,
} from "./presets";

// Components
export {
  BackgroundMusic,
  BackgroundMusicWithPreset,
  SoundEffect,
  SoundEffectWithPreset,
  TransitionSound,
  AppearSound,
  EmphasisSound,
  AudioLayer,
  createTrack,
  createMusicTrack,
  createNarrationTrack,
  createSFXTrack,
} from "./components";

// Utilities
export {
  // Volume utilities
  fadeVolume,
  fadeIn,
  fadeOut,
  fadeInOut,
  duckVolume,
  clampVolume,
  dbToLinear,
  linearToDb,
  mixVolumes,
  crossfadeVolumes,
  // Timing utilities
  secondsToFrames,
  framesToSeconds,
  msToFrames,
  framesToMs,
  getAudioTiming,
  calculateLoopPoints,
  calculateAudioOffset,
  framesToTimecode,
  formatDuration,
  calculateBeatFrames,
  isOnBeat,
  getNearestBeatFrame,
} from "./utils";
