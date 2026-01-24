/**
 * Audio Visualization Components
 *
 * Provides visual representations of audio for music-based content.
 *
 * @example
 * import { AudioVisualizer, Spectrum, Waveform } from './shared/components/audio';
 *
 * // Simple animated spectrum
 * <Spectrum barCount={32} animated />
 *
 * // Full audio visualizer with mode selection
 * <AudioVisualizer mode="circularSpectrum" color="#ff0066" />
 */

// Main visualizer component
export { AudioVisualizer } from "./AudioVisualizer";
export type { AudioVisualizerProps, VisualizerMode } from "./AudioVisualizer";

// Spectrum components
export { Spectrum, CircularSpectrum } from "./Spectrum";
export type { SpectrumProps, CircularSpectrumProps } from "./Spectrum";

// Waveform components
export { Waveform, AudioPulse } from "./Waveform";
export type { WaveformProps, AudioPulseProps } from "./Waveform";
