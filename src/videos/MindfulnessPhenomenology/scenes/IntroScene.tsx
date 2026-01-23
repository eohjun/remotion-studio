/**
 * Intro Scene - Hook with the philosophy/mindfulness connection
 *
 * Enhanced with breathing circle animation, particles, and dynamic gradient.
 */

import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedGradient } from "../../../shared/components/backgrounds/AnimatedGradient";
import { ParticleField } from "../../../shared/components/backgrounds/ParticleField";
import { Vignette } from "../../../shared/components/effects/Vignette";
import { BreathingCircle } from "../../../shared/components/metaphors/BreathingCircle";
import { AnimatedText, fadeInUp, scaleIn, combine } from "../../../shared/templates/animations";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from "../../../shared/components/constants";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const preTitleProgress = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const titleProgress = spring({ frame: frame - 40, fps, config: { damping: 12 } });
  const subtitleProgress = spring({ frame: frame - 70, fps, config: { damping: 15 } });

  return (
    <AnimatedGradient
      colors={[COLORS.primary, COLORS.secondary, "#1a1a2e"]}
      animationMode="cycle"
      cycleDuration={180}
    >
      {/* Breathing circle - meditation visual */}
      <BreathingCircle
        size={600}
        color="rgba(102, 126, 234, 0.2)"
        colorSecondary="rgba(118, 75, 162, 0.15)"
        cycleDuration={150}
        rings={4}
        opacity={0.8}
      />

      {/* Floating particles */}
      <ParticleField
        particleCount={25}
        particleType="blur"
        colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)", "rgba(200,200,255,0.3)"]}
        sizeRange={[3, 10]}
        speedRange={[0.3, 1]}
        opacity={0.7}
        direction="up"
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", padding: SPACING.xl, maxWidth: 1400 }}>
          {/* Pre-title */}
          <div
            style={{
              opacity: interpolate(preTitleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(preTitleProgress, [0, 1], [30, 0])}px)`,
              marginBottom: SPACING.md,
            }}
          >
            <AnimatedText
              text="PHILOSOPHY MEETS PRACTICE"
              animation={fadeInUp(20)}
              stagger="character"
              staggerDuration={2}
              delay={25}
              style={{
                fontSize: FONT_SIZES.lg,
                color: "rgba(255,255,255,0.7)",
                fontFamily: FONT_FAMILY.body,
                letterSpacing: 6,
                fontWeight: 500,
              }}
            />
          </div>

          {/* Main Title */}
          <div
            style={{
              opacity: interpolate(titleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(titleProgress, [0, 1], [50, 0])}px) scale(${interpolate(titleProgress, [0, 1], [0.9, 1])})`,
            }}
          >
            <h1
              style={{
                fontSize: FONT_SIZES["4xl"],
                fontWeight: 800,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                margin: 0,
                lineHeight: 1.1,
                textShadow: "0 4px 30px rgba(0,0,0,0.3)",
              }}
            >
              <AnimatedText
                text="The Philosophy of"
                animation={combine([fadeInUp(40), scaleIn(0.95)])}
                stagger="word"
                staggerDuration={6}
                delay={45}
                style={{ fontWeight: 800 }}
              />
            </h1>
            <h1
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                margin: 0,
                marginTop: SPACING.xs,
                lineHeight: 1.1,
                textShadow: "0 4px 30px rgba(0,0,0,0.3)",
                background: `linear-gradient(135deg, ${COLORS.white} 0%, rgba(200,180,255,1) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <AnimatedText
                text="Mindfulness"
                animation={combine([fadeInUp(50), scaleIn(0.9)])}
                stagger="character"
                staggerDuration={3}
                delay={60}
                style={{ fontWeight: 800 }}
              />
            </h1>
          </div>

          {/* Subtitle */}
          <div
            style={{
              opacity: interpolate(subtitleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
              marginTop: SPACING.lg,
            }}
          >
            <AnimatedText
              text="From Husserl to Your Brain"
              animation={fadeInUp(15)}
              stagger="word"
              staggerDuration={8}
              delay={80}
              style={{
                fontSize: FONT_SIZES.xl,
                color: "rgba(255,255,255,0.8)",
                fontFamily: FONT_FAMILY.body,
                fontWeight: 400,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Cinematic vignette */}
      <Vignette intensity={0.4} size={0.4} softness={0.6} />
    </AnimatedGradient>
  );
};

export default IntroScene;
