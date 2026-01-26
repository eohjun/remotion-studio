/**
 * Crossfade Utilities
 *
 * Advanced crossfade functions including equal-power crossfade
 * to prevent volume dips during audio transitions.
 */

import { interpolate } from "remotion";
import { clampVolume } from "./volumeUtils";

/**
 * Crossfade curve types
 */
export type CrossfadeCurve =
  | "linear"
  | "equal-power"
  | "exponential"
  | "s-curve"
  | "logarithmic";

/**
 * Crossfade result with volumes for both tracks
 */
export interface CrossfadeVolumes {
  /** Volume for the outgoing (fading out) track */
  outgoing: number;
  /** Volume for the incoming (fading in) track */
  incoming: number;
}

/**
 * Crossfade configuration
 */
export interface CrossfadeConfig {
  /** Crossfade curve type (default: equal-power) */
  curve?: CrossfadeCurve;
  /** Maximum volume for both tracks (default: 1) */
  maxVolume?: number;
  /** Overlap amount adjustment (default: 1, higher = more overlap) */
  overlap?: number;
}

/**
 * Calculate equal-power crossfade volumes
 *
 * Equal-power crossfade uses sine/cosine curves to maintain
 * constant perceived loudness during the transition.
 * This prevents the "volume dip" that occurs with linear crossfades.
 *
 * The math: outgoing = cos(θ), incoming = sin(θ) where θ goes from 0 to π/2
 * Since sin²(θ) + cos²(θ) = 1, the combined power stays constant.
 *
 * @param progress - Crossfade progress (0 = start, 1 = complete)
 * @returns Volumes for outgoing and incoming tracks
 */
export function equalPowerCrossfade(progress: number): CrossfadeVolumes {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const angle = clampedProgress * Math.PI * 0.5; // 0 to π/2

  return {
    outgoing: Math.cos(angle),
    incoming: Math.sin(angle),
  };
}

/**
 * Calculate linear crossfade volumes
 *
 * Simple linear interpolation between tracks.
 * Can cause perceived volume dip in the middle of the transition.
 *
 * @param progress - Crossfade progress (0 = start, 1 = complete)
 * @returns Volumes for outgoing and incoming tracks
 */
export function linearCrossfade(progress: number): CrossfadeVolumes {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return {
    outgoing: 1 - clampedProgress,
    incoming: clampedProgress,
  };
}

/**
 * Calculate exponential crossfade volumes
 *
 * Exponential curves for more dramatic transitions.
 * Outgoing fades quickly, incoming builds slowly.
 *
 * @param progress - Crossfade progress (0 = start, 1 = complete)
 * @param exponent - Curve steepness (default: 2)
 * @returns Volumes for outgoing and incoming tracks
 */
export function exponentialCrossfade(
  progress: number,
  exponent: number = 2
): CrossfadeVolumes {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return {
    outgoing: Math.pow(1 - clampedProgress, exponent),
    incoming: Math.pow(clampedProgress, exponent),
  };
}

/**
 * Calculate S-curve crossfade volumes
 *
 * Smooth S-curve for gradual start/end with faster middle transition.
 * Good for cinematic transitions.
 *
 * @param progress - Crossfade progress (0 = start, 1 = complete)
 * @returns Volumes for outgoing and incoming tracks
 */
export function sCurveCrossfade(progress: number): CrossfadeVolumes {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  // Using smoothstep: 3x² - 2x³
  const smoothed =
    clampedProgress * clampedProgress * (3 - 2 * clampedProgress);

  // Apply equal-power to the smoothed progress for better loudness
  const angle = smoothed * Math.PI * 0.5;

  return {
    outgoing: Math.cos(angle),
    incoming: Math.sin(angle),
  };
}

/**
 * Calculate logarithmic crossfade volumes
 *
 * Logarithmic curves that better match human perception.
 * Good for audio that needs to maintain presence longer.
 *
 * @param progress - Crossfade progress (0 = start, 1 = complete)
 * @returns Volumes for outgoing and incoming tracks
 */
export function logarithmicCrossfade(progress: number): CrossfadeVolumes {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Log curve for outgoing (holds volume longer)
  const outgoing =
    clampedProgress === 1
      ? 0
      : Math.pow(1 - Math.log10(1 + clampedProgress * 9) / 1, 0.5);

  // Inverse for incoming
  const incoming =
    clampedProgress === 0
      ? 0
      : Math.pow(Math.log10(1 + clampedProgress * 9) / 1, 0.5);

  return {
    outgoing: clampVolume(outgoing),
    incoming: clampVolume(incoming),
  };
}

/**
 * Calculate crossfade volumes using specified curve type
 *
 * @param frame - Current frame
 * @param crossfadeStart - Frame where crossfade begins
 * @param crossfadeDuration - Duration of crossfade in frames
 * @param config - Crossfade configuration
 * @returns Volumes for both tracks
 *
 * @example
 * ```tsx
 * const { outgoing, incoming } = crossfade(
 *   frame,
 *   100, // start at frame 100
 *   60,  // 60 frame (1 second) crossfade
 *   { curve: 'equal-power' }
 * );
 *
 * return (
 *   <>
 *     <Audio src={track1} volume={outgoing} />
 *     <Audio src={track2} volume={incoming} />
 *   </>
 * );
 * ```
 */
export function crossfade(
  frame: number,
  crossfadeStart: number,
  crossfadeDuration: number,
  config: CrossfadeConfig = {}
): CrossfadeVolumes {
  const { curve = "equal-power", maxVolume = 1, overlap = 1 } = config;

  // Calculate progress through crossfade
  let progress = interpolate(
    frame,
    [crossfadeStart, crossfadeStart + crossfadeDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Adjust overlap if specified
  if (overlap !== 1) {
    progress = Math.pow(progress, 1 / overlap);
  }

  // Calculate volumes based on curve type
  let volumes: CrossfadeVolumes;

  switch (curve) {
    case "linear":
      volumes = linearCrossfade(progress);
      break;
    case "exponential":
      volumes = exponentialCrossfade(progress);
      break;
    case "s-curve":
      volumes = sCurveCrossfade(progress);
      break;
    case "logarithmic":
      volumes = logarithmicCrossfade(progress);
      break;
    case "equal-power":
    default:
      volumes = equalPowerCrossfade(progress);
      break;
  }

  // Apply max volume
  return {
    outgoing: volumes.outgoing * maxVolume,
    incoming: volumes.incoming * maxVolume,
  };
}

/**
 * Calculate crossfade for multiple tracks (A → B → C → ...)
 *
 * Useful for playlist-style audio where multiple tracks
 * transition sequentially.
 *
 * @param frame - Current frame
 * @param tracks - Array of track timing info
 * @param crossfadeDuration - Duration of each crossfade in frames
 * @param config - Crossfade configuration
 * @returns Array of volumes for each track
 *
 * @example
 * ```tsx
 * const tracks = [
 *   { start: 0, end: 300 },
 *   { start: 270, end: 600 },
 *   { start: 570, end: 900 },
 * ];
 *
 * const volumes = multiTrackCrossfade(frame, tracks, 30, { curve: 'equal-power' });
 * ```
 */
export function multiTrackCrossfade(
  frame: number,
  tracks: Array<{ start: number; end: number }>,
  crossfadeDuration: number,
  config: CrossfadeConfig = {}
): number[] {
  return tracks.map((track, index) => {
    let volume = 0;

    // Before track starts
    if (frame < track.start) {
      // Check if we're in crossfade with previous track
      if (index > 0) {
        const prevTrack = tracks[index - 1];
        const fadeStart = prevTrack.end - crossfadeDuration;
        if (frame >= fadeStart) {
          const { incoming } = crossfade(
            frame,
            fadeStart,
            crossfadeDuration,
            config
          );
          volume = incoming;
        }
      }
    }
    // During track
    else if (frame <= track.end) {
      volume = config.maxVolume ?? 1;

      // Fade in from previous
      if (index > 0 && frame < track.start + crossfadeDuration) {
        const fadeStart = track.start - crossfadeDuration;
        const { incoming } = crossfade(
          frame,
          fadeStart,
          crossfadeDuration * 2,
          config
        );
        volume = incoming * (config.maxVolume ?? 1);
      }

      // Fade out to next
      if (index < tracks.length - 1 && frame > track.end - crossfadeDuration) {
        const { outgoing } = crossfade(
          frame,
          track.end - crossfadeDuration,
          crossfadeDuration,
          config
        );
        volume = outgoing * (config.maxVolume ?? 1);
      }
    }

    return clampVolume(volume);
  });
}

/**
 * Get combined volume for crossfade (for metering/visualization)
 *
 * Calculates the total perceived loudness during crossfade.
 * For equal-power, this should be constant (~1.0).
 *
 * @param volumes - Crossfade volumes
 * @returns Combined power level (should be ~1.0 for equal-power)
 */
export function getCombinedPower(volumes: CrossfadeVolumes): number {
  // Sum of squares (power)
  return Math.sqrt(
    volumes.outgoing * volumes.outgoing + volumes.incoming * volumes.incoming
  );
}
