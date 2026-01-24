/**
 * NewFeaturesDemo - Demo video testing Phase 20 components
 *
 * Tests all newly introduced Remotion template pattern components:
 * - 3D: ThreeCanvas, DeviceMockup, Text3D, FloatingText3D
 * - Audio Visualization: Spectrum, CircularSpectrum, Waveform, AudioPulse, AudioVisualizer
 * - Text Effects: StrokedText, AnimatedStrokedText, SubtitleText
 * - Scene Transitions: SceneSequence, SceneWithTransition
 */

import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// 3D Components
import { ThreeCanvas, PhoneMockup, TabletMockup, Text3D, FloatingText3D } from "../shared/components/three";

// Audio Visualization Components
import { Spectrum, CircularSpectrum, Waveform, AudioPulse, AudioVisualizer } from "../shared/components/audio";

// Text Effects
import { StrokedText, AnimatedStrokedText, SubtitleText } from "../shared/templates/animations";

// Scene Transitions
import { SceneSequence, SceneWithTransition } from "../shared/components/SceneTransition";

// Schema
export const newFeaturesDemoSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

export type NewFeaturesDemoProps = z.infer<typeof newFeaturesDemoSchema>;

// Constants
export const NEW_FEATURES_DEMO_DURATION = 1500; // 50 seconds @ 30fps
const SCENE_DURATION = 180; // 6 seconds per scene

// Scene Label Component
const SceneLabel: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, SCENE_DURATION - 15, SCENE_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 60,
        opacity,
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "white",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

// Scene 1: Intro with StrokedText
const IntroScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({
  primaryColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <StrokedText
          text="New Features Demo"
          fontSize={96}
          fillColor="white"
          strokeColor="black"
          strokeWidth={6}
          animated
          delay={10}
        />
        <div style={{ marginTop: 40 }}>
          <AnimatedStrokedText
            text="Phase 20 Components"
            fontSize={48}
            fillColor="rgba(255,255,255,0.9)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={3}
            delay={30}
            staggerDuration={8}
          />
        </div>
      </div>
      <SubtitleText
        text="Testing 3D, Audio Visualization, Text Effects, and Scene Transitions"
        fontSize={32}
        bottomOffset={120}
        animated
        delay={60}
      />
    </AbsoluteFill>
  );
};

// Scene 2: 3D Device Mockups
const DeviceMockupScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({
  primaryColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <SceneLabel title="3D Device Mockups" subtitle="ThreeCanvas + PhoneMockup + TabletMockup" />
      <ThreeCanvas cameraPosition={[0, 0, 6]} backgroundColor="#0a0a0a">
        <PhoneMockup
          position={[-1.5, 0, 0]}
          screenColor={primaryColor}
          float
          floatAmplitude={0.08}
          rotation={[0.1, 0.2, 0]}
          delay={10}
        />
        <TabletMockup
          position={[1.5, 0, 0]}
          screenColor={secondaryColor}
          autoRotate
          rotationSpeed={0.01}
          delay={30}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Scene 3: 3D Text
const Text3DScene: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      <SceneLabel title="3D Text Components" subtitle="Text3D + FloatingText3D" />
      <ThreeCanvas cameraPosition={[0, 0, 8]} backgroundColor="#1a1a2e">
        <Text3D
          text="HELLO"
          size={1.2}
          depth={0.3}
          color={primaryColor}
          position={[0, 1, 0]}
          material="standard"
          metalness={0.5}
          roughness={0.3}
          delay={10}
        />
        <FloatingText3D
          text="3D"
          size={0.8}
          depth={0.2}
          color="#ffffff"
          position={[0, -1, 0]}
          material="phong"
          floatAmplitude={0.15}
          floatSpeed={0.08}
          delay={30}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Scene 4: Spectrum Visualizers
const SpectrumScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({
  primaryColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SceneLabel title="Spectrum Visualization" subtitle="Spectrum + CircularSpectrum" />
      <div style={{ display: "flex", gap: 100, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Spectrum
            barCount={32}
            maxHeight={200}
            barWidth={10}
            barGap={4}
            gradientColors={[primaryColor, secondaryColor]}
            animated
            glow
            delay={10}
          />
          <div style={{ color: "white", marginTop: 20, fontSize: 18 }}>Linear Spectrum</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <CircularSpectrum
            barCount={48}
            radius={80}
            maxHeight={40}
            color={primaryColor}
            animated
            delay={30}
          />
          <div style={{ color: "white", marginTop: 20, fontSize: 18 }}>Circular Spectrum</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Waveform Visualizers
const WaveformScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({
  primaryColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: "#0f0f23",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SceneLabel title="Waveform Visualization" subtitle="Waveform (line, mirror) + AudioPulse" />
      <div style={{ display: "flex", flexDirection: "column", gap: 60, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <Waveform
              width={400}
              height={80}
              mode="line"
              color={primaryColor}
              lineWidth={3}
              glow
              animated
              delay={10}
            />
            <div style={{ color: "white", marginTop: 15, fontSize: 16 }}>Line Mode</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Waveform
              width={400}
              height={100}
              mode="mirror"
              gradientColors={[primaryColor, secondaryColor]}
              lineWidth={2}
              animated
              delay={30}
            />
            <div style={{ color: "white", marginTop: 15, fontSize: 16 }}>Mirror Mode</div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <AudioPulse
            radius={40}
            maxRadius={80}
            color={secondaryColor}
            animated
            delay={50}
          />
          <div style={{ color: "white", marginTop: 15, fontSize: 16 }}>Audio Pulse</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: AudioVisualizer Modes
const AudioVisualizerScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({
  primaryColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  // Cycle through modes every 45 frames
  const modeIndex = Math.floor(frame / 45) % 4;
  const modes = ["spectrum", "circularSpectrum", "bars", "pulse"] as const;
  const currentMode = modes[modeIndex];
  const modeLabels = ["Spectrum", "Circular Spectrum", "Bars", "Pulse"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SceneLabel title="AudioVisualizer Component" subtitle="Unified API with multiple modes" />
      <div style={{ textAlign: "center" }}>
        <AudioVisualizer
          mode={currentMode}
          width={500}
          height={250}
          color={primaryColor}
          secondaryColor={secondaryColor}
          animated
          glow
          delay={0}
        />
        <div
          style={{
            color: "white",
            marginTop: 30,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Mode: {modeLabels[modeIndex]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Stroked Text Variants
const StrokedTextScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SceneLabel title="Stroked Text Effects" subtitle="StrokedText + AnimatedStrokedText + SubtitleText" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 50,
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <StrokedText
            text="Basic Stroked Text"
            fontSize={64}
            fillColor="white"
            strokeColor="black"
            strokeWidth={5}
            animated
            delay={10}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <AnimatedStrokedText
            text="Word by Word Animation"
            fontSize={48}
            fillColor="#FFE66D"
            strokeColor="#333"
            strokeWidth={3}
            delay={40}
            staggerDuration={10}
          />
        </div>
      </div>
      <SubtitleText
        text="SubtitleText - Positioned at screen bottom with shadow"
        fontSize={36}
        fillColor="white"
        strokeColor="black"
        strokeWidth={3}
        bottomOffset={100}
        shadow
        animated
        delay={80}
      />
    </AbsoluteFill>
  );
};

// Scene 8: Scene Transitions Demo
const TransitionsScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({
  primaryColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill>
      {/* Sub-scene 1: SceneSequence with premount */}
      <SceneSequence from={0} durationInFrames={60} premount name="Transition-A">
        <AbsoluteFill
          style={{
            background: primaryColor,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SceneLabel title="Scene Transitions" subtitle="SceneSequence + SceneWithTransition" />
          <StrokedText text="SceneSequence" fontSize={72} fillColor="white" strokeWidth={4} />
          <div style={{ position: "absolute", bottom: 200, color: "white", fontSize: 24 }}>
            With Premounting (smooth loading)
          </div>
        </AbsoluteFill>
      </SceneSequence>

      {/* Sub-scene 2: SceneWithTransition */}
      <SceneWithTransition
        from={60}
        durationInFrames={60}
        fadeInDuration={15}
        fadeOutDuration={15}
        premount
        name="Transition-B"
      >
        <AbsoluteFill
          style={{
            background: secondaryColor,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StrokedText text="SceneWithTransition" fontSize={64} fillColor="white" strokeWidth={4} />
          <div style={{ position: "absolute", bottom: 200, color: "white", fontSize: 24 }}>
            Fade In/Out + Premounting
          </div>
        </AbsoluteFill>
      </SceneWithTransition>

      {/* Sub-scene 3: Outro */}
      <SceneWithTransition
        from={120}
        durationInFrames={60}
        fadeInDuration={20}
        fadeOutDuration={20}
        name="Outro"
      >
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <StrokedText
              text="Demo Complete!"
              fontSize={80}
              fillColor="white"
              strokeWidth={5}
              animated
              delay={5}
            />
            <div style={{ marginTop: 30 }}>
              <AnimatedStrokedText
                text="All Components Working"
                fontSize={40}
                fillColor="rgba(255,255,255,0.9)"
                strokeWidth={2}
                delay={20}
              />
            </div>
          </div>
        </AbsoluteFill>
      </SceneWithTransition>
    </AbsoluteFill>
  );
};

// Main Component
export const NewFeaturesDemo: React.FC<NewFeaturesDemoProps> = ({
  primaryColor,
  secondaryColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Scene 1: Intro (0-180) */}
      <Sequence durationInFrames={SCENE_DURATION}>
        <IntroScene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>

      {/* Scene 2: Device Mockups (180-360) */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <DeviceMockupScene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>

      {/* Scene 3: 3D Text (360-540) */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <Text3DScene primaryColor={primaryColor} />
      </Sequence>

      {/* Scene 4: Spectrum (540-720) */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SpectrumScene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>

      {/* Scene 5: Waveform (720-900) */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <WaveformScene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>

      {/* Scene 6: AudioVisualizer (900-1080) */}
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
        <AudioVisualizerScene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>

      {/* Scene 7: Stroked Text (1080-1260) */}
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION}>
        <StrokedTextScene />
      </Sequence>

      {/* Scene 8: Transitions (1260-1500) - Extended duration */}
      <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION + 60}>
        <TransitionsScene primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default NewFeaturesDemo;
