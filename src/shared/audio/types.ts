/**
 * Audio System Types
 *
 * Type definitions for the audio enhancement system.
 */

/**
 * Background music configuration
 */
export interface BackgroundMusicProps {
  /** Audio source path (use staticFile for public/ assets) */
  src: string;
  /** Volume level 0-1 (default: 0.3) */
  volume?: number;
  /** Whether to loop the audio (default: true) */
  loop?: boolean;
  /** Fade in duration in frames */
  fadeInDuration?: number;
  /** Fade out duration in frames */
  fadeOutDuration?: number;
  /** Frames to skip at the start of the audio */
  startFrom?: number;
  /** Start frame within the composition */
  startFrame?: number;
  /** End frame within the composition (for early cutoff) */
  endFrame?: number;
  /** Playback rate (default: 1) */
  playbackRate?: number;
}

/**
 * Sound effect configuration
 */
export interface SoundEffectProps {
  /** Audio source path */
  src: string;
  /** Frame at which to play the sound */
  startFrame?: number;
  /** Volume level 0-1 (default: 1) */
  volume?: number;
  /** Playback rate for speed adjustment (default: 1) */
  playbackRate?: number;
  /** Whether to show this audio in timeline (default: true) */
  showInTimeline?: boolean;
}

/**
 * Individual audio track configuration
 */
export interface AudioTrack {
  /** Unique identifier for the track */
  id: string;
  /** Audio source path */
  src: string;
  /** Volume level 0-1 */
  volume: number;
  /** Start frame within composition */
  startFrame: number;
  /** Duration in frames (optional, plays full audio if not specified) */
  durationInFrames?: number;
  /** Fade in duration in frames */
  fadeIn?: number;
  /** Fade out duration in frames */
  fadeOut?: number;
  /** Loop the track */
  loop?: boolean;
  /** Playback rate */
  playbackRate?: number;
}

/**
 * Multi-track audio layer configuration
 */
export interface AudioLayerProps {
  /** Array of audio tracks to play */
  tracks: AudioTrack[];
  /** Master volume multiplier (default: 1) */
  masterVolume?: number;
}

/**
 * Volume ducking configuration
 */
export interface DuckingConfig {
  /** Volume when ducked (0-1) */
  duckedVolume: number;
  /** Transition duration in frames */
  transitionFrames: number;
}

/**
 * Narration range for ducking
 */
export interface NarrationRange {
  /** Start frame of narration */
  start: number;
  /** End frame of narration */
  end: number;
}

/**
 * Music preset configuration
 */
export interface MusicPreset {
  /** Default volume level */
  volume: number;
  /** Fade in duration in frames */
  fadeIn: number;
  /** Fade out duration in frames */
  fadeOut: number;
}

/**
 * Sound effect preset configuration
 */
export interface SFXPreset {
  /** Default volume level */
  volume: number;
  /** Frame offset from trigger point */
  offset: number;
}

/**
 * Loop calculation result
 */
export interface LoopPoints {
  /** Number of times to loop */
  loopCount: number;
  /** Frame at which to start fade out */
  fadeOutStart: number;
}

/**
 * Audio timing result
 */
export interface AudioTiming {
  /** Duration in frames */
  frames: number;
  /** Duration in seconds */
  seconds: number;
}
