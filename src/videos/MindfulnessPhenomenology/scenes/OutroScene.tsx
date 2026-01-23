/**
 * Outro Scene - Final message
 *
 * Enhanced with breathing circle, flowing waves, and cinematic visuals.
 */

import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedGradient } from "../../../shared/components/backgrounds/AnimatedGradient";
import { Vignette } from "../../../shared/components/effects/Vignette";
import { BreathingCircle } from "../../../shared/components/metaphors/BreathingCircle";
import { FlowingWaves } from "../../../shared/components/metaphors/FlowingWaves";
import { AnimatedText, fadeInUp, scaleIn, combine } from "../../../shared/templates/animations";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from "../../../shared/components/constants";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const closingProgress = spring({ frame: frame - 180, fps, config: { damping: 12 } });

  const takeaways = [
    { icon: "🔗", text: "Ancient wisdom meets modern science", color: COLORS.primary },
    { icon: "🔬", text: "First-person investigation of mind", color: COLORS.secondary },
    { icon: "⏳", text: "2,500 years of inquiry continues", color: COLORS.accent },
  ];

  return (
    <AnimatedGradient
      colors={[COLORS.primary, COLORS.secondary, "#1a1a2e"]}
      animationMode="cycle"
      cycleDuration={240}
    >
      {/* Breathing circle in background */}
      <BreathingCircle
        size={800}
        color="rgba(102, 126, 234, 0.15)"
        colorSecondary="rgba(118, 75, 162, 0.1)"
        cycleDuration={180}
        rings={5}
        opacity={0.7}
      />

      {/* Flowing waves at bottom */}
      <FlowingWaves
        colors={[
          "rgba(102, 126, 234, 0.12)",
          "rgba(118, 75, 162, 0.08)",
          "rgba(236, 72, 153, 0.05)",
        ]}
        layers={4}
        amplitude={40}
        frequency={1.5}
        speed={0.8}
        opacity={0.8}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", padding: SPACING.xl, maxWidth: 1000 }}>
          {/* Title */}
          <div
            style={{
              opacity: titleProgress,
              transform: `translateY(${interpolate(titleProgress, [0, 1], [40, 0])}px) scale(${interpolate(titleProgress, [0, 1], [0.9, 1])})`,
              marginBottom: SPACING.xl,
            }}
          >
            <span style={{ fontSize: 64, display: "block", marginBottom: SPACING.md }}>
              🧘
            </span>
            <h1
              style={{
                fontSize: FONT_SIZES["4xl"],
                fontWeight: 800,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.title,
                margin: 0,
                lineHeight: 1.2,
                textShadow: "0 4px 30px rgba(0,0,0,0.3)",
              }}
            >
              <AnimatedText
                text="You're Not Just Relaxing"
                animation={combine([fadeInUp(30), scaleIn(0.95)])}
                stagger="word"
                staggerDuration={6}
                delay={25}
                style={{ fontWeight: 800 }}
              />
            </h1>
          </div>

          {/* Takeaways */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: SPACING.lg,
              marginBottom: SPACING.xl,
              marginTop: SPACING.lg,
            }}
          >
            {takeaways.map((item, index) => {
              const itemProgress = spring({
                frame: frame - 70 - index * 15,
                fps,
                config: { damping: 15 },
              });

              return (
                <div
                  key={index}
                  style={{
                    opacity: itemProgress,
                    transform: `translateY(${interpolate(itemProgress, [0, 1], [30, 0])}px)`,
                    background: `${item.color}15`,
                    border: `2px solid ${item.color}40`,
                    borderRadius: 16,
                    padding: "20px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: SPACING.sm,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: FONT_SIZES.md,
                      color: COLORS.white,
                      fontFamily: FONT_FAMILY.body,
                      fontWeight: 500,
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Closing message */}
          <div
            style={{
              opacity: closingProgress,
              transform: `translateY(${interpolate(closingProgress, [0, 1], [20, 0])}px)`,
              marginTop: SPACING.xl,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: SPACING.sm,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 40,
                padding: "16px 32px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span style={{ fontSize: 24 }}>✨</span>
              <span
                style={{
                  fontSize: FONT_SIZES.lg,
                  color: "rgba(255,255,255,0.95)",
                  fontFamily: FONT_FAMILY.body,
                  fontWeight: 500,
                }}
              >
                You're participating in humanity's deepest exploration of consciousness
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} size={0.4} softness={0.6} />
    </AnimatedGradient>
  );
};

export default OutroScene;
