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
