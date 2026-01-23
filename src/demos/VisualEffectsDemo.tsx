import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";

// Backgrounds
import {
  AnimatedGradient,
  ParticleField,
  FloatingShapes,
} from "../shared/components/backgrounds";

// Effects
import {
  Vignette,
  LightLeak,
  FilmGrain,
  EffectsComposer,
} from "../shared/components/effects";

// Text Animations
import {
  TypewriterText,
  HighlightText,
  RevealText,
  GlitchText,
} from "../shared/templates/animations";

import { COLORS, FONT_FAMILY } from "../shared/components/constants";

// Schema for the demo composition
export const visualEffectsDemoSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

type VisualEffectsDemoProps = z.infer<typeof visualEffectsDemoSchema>;

// Duration constants (in frames at 30fps)
const SCENE_DURATION = 150; // 5 seconds per scene
const TOTAL_SCENES = 8;
export const DEMO_DURATION = SCENE_DURATION * TOTAL_SCENES; // 40 seconds total

// Common text styles
const titleStyle: React.CSSProperties = {
  fontSize: 72,
  fontWeight: 700,
  fontFamily: FONT_FAMILY.title,
  color: COLORS.white,
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 400,
  fontFamily: FONT_FAMILY.body,
  color: "rgba(255, 255, 255, 0.8)",
  textAlign: "center",
  marginTop: 20,
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 40,
  left: 0,
  right: 0,
  fontSize: 24,
  fontFamily: FONT_FAMILY.body,
  color: "rgba(255, 255, 255, 0.6)",
  textAlign: "center",
};

/**
 * Scene 1: AnimatedGradient Demo
 */
const AnimatedGradientScene: React.FC = () => {
  return (
    <AnimatedGradient
      colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
      animationMode="cycle"
      cycleDuration={90}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={titleStyle}>Animated Gradient</div>
        <div style={subtitleStyle}>Smooth color transitions</div>
        <div style={labelStyle}>AnimatedGradient • mode: cycle</div>
      </AbsoluteFill>
    </AnimatedGradient>
  );
};

/**
 * Scene 2: ParticleField Demo
 */
const ParticleFieldScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <ParticleField
        particleCount={25}
        particleType="blur"
        colors={["rgba(102, 126, 234, 0.6)", "rgba(118, 75, 162, 0.4)"]}
        sizeRange={[8, 24]}
        direction="up"
        opacity={0.8}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={titleStyle}>Particle Field</div>
          <div style={subtitleStyle}>Floating particles with blur effect</div>
          <div style={labelStyle}>ParticleField • type: blur • direction: up</div>
        </AbsoluteFill>
      </ParticleField>
    </AbsoluteFill>
  );
};

/**
 * Scene 3: FloatingShapes Demo
 */
const FloatingShapesScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.darkAlt }}>
      <FloatingShapes
        shapeCount={12}
        shapeTypes={["circle", "square", "hexagon"]}
        colors={[
          "rgba(102, 126, 234, 0.3)",
          "rgba(118, 75, 162, 0.3)",
          "rgba(0, 194, 255, 0.2)",
        ]}
        sizeRange={[60, 140]}
        rotate={true}
        opacity={0.6}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={titleStyle}>Floating Shapes</div>
          <div style={subtitleStyle}>Geometric shapes with rotation</div>
          <div style={labelStyle}>
            FloatingShapes • shapes: circle, square, hexagon
          </div>
        </AbsoluteFill>
      </FloatingShapes>
    </AbsoluteFill>
  );
};

/**
 * Scene 4: TypewriterText Demo
 */
const TypewriterScene: React.FC = () => {
  return (
    <AnimatedGradient
      colors={[COLORS.dark, COLORS.darkAlt]}
      animationMode="shift"
      cycleDuration={120}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 100,
        }}
      >
        <TypewriterText
          text="The typewriter effect reveals text character by character..."
          speed={0.6}
          cursor={true}
          cursorChar="|"
          style={{
            ...titleStyle,
            fontSize: 48,
            maxWidth: 1200,
            lineHeight: 1.4,
          }}
        />
        <div style={labelStyle}>TypewriterText • speed: 0.6 • cursor: on</div>
      </AbsoluteFill>
    </AnimatedGradient>
  );
};

/**
 * Scene 5: HighlightText Demo
 */
const HighlightScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 60,
        }}
      >
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ ...titleStyle, fontSize: 48 }}>Text with </span>
          <HighlightText
            text="background"
            highlightType="background"
            highlightColor="rgba(102, 126, 234, 0.6)"
            triggerFrame={15}
            style={{ ...titleStyle, fontSize: 48 }}
          />
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ ...titleStyle, fontSize: 48 }}>Text with </span>
          <HighlightText
            text="underline"
            highlightType="underline"
            highlightColor={COLORS.accent}
            triggerFrame={45}
            thickness={4}
            style={{ ...titleStyle, fontSize: 48 }}
          />
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ ...titleStyle, fontSize: 48 }}>Text with </span>
          <HighlightText
            text="strikethrough"
            highlightType="strike"
            highlightColor={COLORS.danger}
            triggerFrame={75}
            thickness={4}
            style={{ ...titleStyle, fontSize: 48 }}
          />
        </div>

        <div style={labelStyle}>
          HighlightText • types: background, underline, strike
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Scene 6: RevealText & GlitchText Demo
 */
const RevealGlitchScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <ParticleField
        particleCount={15}
        particleType="circle"
        colors={["rgba(255, 255, 255, 0.2)"]}
        sizeRange={[4, 8]}
        direction="random"
        opacity={0.5}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 80,
          }}
        >
          <RevealText
            text="Reveal Text Animation"
            revealMode="word"
            direction="bottom"
            staggerDelay={6}
            delay={10}
            style={titleStyle}
          />

          <GlitchText
            text="GLITCH EFFECT"
            intensity="medium"
            triggerFrame={60}
            duration={30}
            style={{
              ...titleStyle,
              fontSize: 64,
              color: COLORS.accent,
              letterSpacing: 8,
            }}
          />

          <div style={labelStyle}>
            RevealText (word mode) • GlitchText (medium intensity)
          </div>
        </AbsoluteFill>
      </ParticleField>
    </AbsoluteFill>
  );
};

/**
 * Scene 7: Cinematic Effects Demo
 */
const CinematicEffectsScene: React.FC = () => {
  return (
    <AnimatedGradient
      colors={[COLORS.dark, "#2d1f4e"]}
      animationMode="pulse"
      cycleDuration={60}
    >
      <Vignette intensity={0.5} size={0.4} softness={0.6}>
        <LightLeak
          color="rgba(255, 120, 50, 0.4)"
          position="top-right"
          intensity={0.35}
          animated={true}
          type="gradient"
        >
          <FilmGrain intensity={0.12} animated={true} monochrome={true}>
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div style={titleStyle}>Cinematic Effects</div>
              <div style={subtitleStyle}>
                Vignette + Light Leak + Film Grain
              </div>
              <div style={labelStyle}>
                Layered effects for cinematic look
              </div>
            </AbsoluteFill>
          </FilmGrain>
        </LightLeak>
      </Vignette>
    </AnimatedGradient>
  );
};

/**
 * Scene 8: EffectsComposer Demo
 */
const EffectsComposerScene: React.FC = () => {
  return (
    <EffectsComposer
      effects={{
        vignette: { intensity: 0.4, size: 0.5 },
        filmGrain: { intensity: 0.1, animated: true },
        lightLeak: {
          color: "rgba(100, 200, 255, 0.3)",
          position: "bottom-left",
          animated: true,
          type: "flare",
        },
      }}
    >
      <FloatingShapes
        shapeCount={8}
        shapeTypes={["circle", "triangle"]}
        colors={["rgba(102, 126, 234, 0.2)", "rgba(0, 194, 255, 0.15)"]}
        sizeRange={[80, 160]}
        opacity={0.5}
      >
        <AnimatedGradient
          colors={[COLORS.dark, COLORS.darkAlt, "#1a1a3e"]}
          animationMode="rotate"
          cycleDuration={180}
        >
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TypewriterText
              text="EffectsComposer"
              speed={0.8}
              cursor={false}
              delay={10}
              style={titleStyle}
            />
            <RevealText
              text="Combine all effects with a single component"
              revealMode="clip"
              direction="left"
              delay={50}
              style={{ ...subtitleStyle, marginTop: 30 }}
            />
            <div style={labelStyle}>
              EffectsComposer • vignette + filmGrain + lightLeak + backgrounds
            </div>
          </AbsoluteFill>
        </AnimatedGradient>
      </FloatingShapes>
    </EffectsComposer>
  );
};

/**
 * Main Demo Composition
 */
export const VisualEffectsDemo: React.FC<VisualEffectsDemoProps> = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      {/* Scene 1: AnimatedGradient */}
      <Sequence durationInFrames={SCENE_DURATION}>
        <AnimatedGradientScene />
      </Sequence>

      {/* Scene 2: ParticleField */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <ParticleFieldScene />
      </Sequence>

      {/* Scene 3: FloatingShapes */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <FloatingShapesScene />
      </Sequence>

      {/* Scene 4: TypewriterText */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <TypewriterScene />
      </Sequence>

      {/* Scene 5: HighlightText */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <HighlightScene />
      </Sequence>

      {/* Scene 6: RevealText & GlitchText */}
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
        <RevealGlitchScene />
      </Sequence>

      {/* Scene 7: Cinematic Effects */}
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION}>
        <CinematicEffectsScene />
      </Sequence>

      {/* Scene 8: EffectsComposer */}
      <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION}>
        <EffectsComposerScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default VisualEffectsDemo;
