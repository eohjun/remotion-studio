/**
 * Audio Utilities Barrel Export
 */

export {
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
} from "./volumeUtils";

export {
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
} from "./audioTiming";

// Advanced ducking utilities
export {
  advancedDuckVolume,
  getDuckingEnvelope,
  getMultiBandDuckingParams,
  getGainReductionDb,
  ADVANCED_DUCKING_PRESETS,
} from "./advancedDucking";
export type {
  AdvancedDuckingConfig,
  DuckingCurve,
  MultiBandDuckingConfig,
} from "./advancedDucking";

// Crossfade utilities
export {
  crossfade,
  equalPowerCrossfade,
  linearCrossfade,
  exponentialCrossfade,
  sCurveCrossfade,
  logarithmicCrossfade,
  multiTrackCrossfade,
  getCombinedPower,
} from "./crossfade";
export type {
  CrossfadeCurve,
  CrossfadeVolumes,
  CrossfadeConfig,
} from "./crossfade";
