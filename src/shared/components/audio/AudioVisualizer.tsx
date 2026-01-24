/**
 * AudioVisualizer - Unified audio visualization component
 *
 * Provides multiple visualization modes with consistent API.
 * Can be driven by actual audio data or use simulated animation.
 *
 * @example
 * // Simulated visualizer
 * <AudioVisualizer mode="spectrum" animated />
 *
 * // With audio data (from Web Audio API)
 * <AudioVisualizer
 *   mode="waveform"
 *   frequencyData={analyzerData}
 *   waveformData={timedomainData}
 * />
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Spectrum, CircularSpectrum } from "./Spectrum";
import type { SpectrumProps, CircularSpectrumProps } from "./Spectrum";
import { Waveform, AudioPulse } from "./Waveform";
import type { WaveformProps, AudioPulseProps } from "./Waveform";

export type VisualizerMode =
  | "spectrum"
  | "circularSpectrum"
  | "waveform"
  | "mirrorWaveform"
  | "bars"
  | "pulse";

export interface AudioVisualizerProps {
  /** Visualization mode */
  mode?: VisualizerMode;
  /** Width in pixels (for applicable modes) */
  width?: number;
  /** Height in pixels (for applicable modes) */
  height?: number;
  /** Frequency data from Web Audio API analyzer */
  frequencyData?: number[];
  /** Time domain data from Web Audio API analyzer */
  waveformData?: number[];
  /** Audio level (0-1) for pulse mode */
  audioLevel?: number;
  /** Primary color */
  color?: string;
  /** Secondary color for gradients */
  secondaryColor?: string;
  /** Enable simulated animation when no audio data */
  animated?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Entry animation delay in frames */
  delay?: number;
  /** Enable glow effect */
  glow?: boolean;
  /** Container style */
  style?: React.CSSProperties;
  /** Additional props passed to the underlying component */
  componentProps?: Partial<SpectrumProps | CircularSpectrumProps | WaveformProps | AudioPulseProps>;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  mode = "spectrum",
  width = 400,
  height = 200,
  frequencyData,
  waveformData,
  audioLevel,
  color = "#ffffff",
  secondaryColor,
  animated = true,
  animationSpeed = 1,
  delay = 0,
  glow = false,
  style = {},
  componentProps = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 200 },
  });

  const gradientColors: [string, string] | undefined = secondaryColor
    ? [color, secondaryColor]
    : undefined;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: entryProgress,
    ...style,
  };

  switch (mode) {
    case "spectrum":
      return (
        <div style={containerStyle}>
          <Spectrum
            barCount={32}
            maxHeight={height}
            barWidth={Math.max(4, width / 64)}
            barGap={Math.max(2, width / 128)}
            frequencyData={frequencyData}
            color={color}
            gradientColors={gradientColors}
            animated={animated}
            animationSpeed={animationSpeed}
            delay={delay}
            glow={glow}
            {...(componentProps as Partial<SpectrumProps>)}
          />
        </div>
      );

    case "circularSpectrum":
      return (
        <div style={containerStyle}>
          <CircularSpectrum
            barCount={64}
            radius={Math.min(width, height) / 3}
            maxHeight={Math.min(width, height) / 6}
            frequencyData={frequencyData}
            color={color}
            animated={animated}
            animationSpeed={animationSpeed}
            delay={delay}
            {...(componentProps as Partial<CircularSpectrumProps>)}
          />
        </div>
      );

    case "waveform":
      return (
        <div style={containerStyle}>
          <Waveform
            width={width}
            height={height}
            waveformData={waveformData ?? frequencyData}
            color={color}
            gradientColors={gradientColors}
            animated={animated}
            animationSpeed={animationSpeed}
            delay={delay}
            glow={glow}
            mode="line"
            {...(componentProps as Partial<WaveformProps>)}
          />
        </div>
      );

    case "mirrorWaveform":
      return (
        <div style={containerStyle}>
          <Waveform
            width={width}
            height={height}
            waveformData={waveformData ?? frequencyData}
            color={color}
            gradientColors={gradientColors}
            animated={animated}
            animationSpeed={animationSpeed}
            delay={delay}
            glow={glow}
            mode="mirror"
            fill
            {...(componentProps as Partial<WaveformProps>)}
          />
        </div>
      );

    case "bars":
      return (
        <div style={containerStyle}>
          <Waveform
            width={width}
            height={height}
            waveformData={waveformData ?? frequencyData}
            color={color}
            animated={animated}
            animationSpeed={animationSpeed}
            delay={delay}
            glow={glow}
            mode="bars"
            {...(componentProps as Partial<WaveformProps>)}
          />
        </div>
      );

    case "pulse":
      return (
        <div style={containerStyle}>
          <AudioPulse
            radius={Math.min(width, height) / 4}
            maxRadius={Math.min(width, height) / 2}
            audioLevel={audioLevel}
            color={color}
            animated={animated}
            delay={delay}
            {...(componentProps as Partial<AudioPulseProps>)}
          />
        </div>
      );

    default:
      return null;
  }
};

/**
 * useAudioAnalyzer - Hook for setting up Web Audio API analyzer
 *
 * Note: This is a placeholder for documentation.
 * In a real implementation, you would:
 * 1. Create an AudioContext
 * 2. Create an AnalyserNode
 * 3. Connect your audio source
 * 4. Read frequency/time domain data in animation loop
 *
 * @example
 * // In your component:
 * const [frequencyData, setFrequencyData] = useState<number[]>([]);
 * const analyzerRef = useRef<AnalyserNode | null>(null);
 *
 * useEffect(() => {
 *   const audioContext = new AudioContext();
 *   const analyzer = audioContext.createAnalyser();
 *   analyzer.fftSize = 256;
 *   analyzerRef.current = analyzer;
 *
 *   // Connect your audio source to analyzer
 *   // sourceNode.connect(analyzer);
 *   // analyzer.connect(audioContext.destination);
 *
 *   return () => audioContext.close();
 * }, []);
 *
 * // In your render loop:
 * useEffect(() => {
 *   const updateData = () => {
 *     if (analyzerRef.current) {
 *       const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
 *       analyzerRef.current.getByteFrequencyData(dataArray);
 *       setFrequencyData(Array.from(dataArray));
 *     }
 *     requestAnimationFrame(updateData);
 *   };
 *   updateData();
 * }, []);
 */

export default AudioVisualizer;
