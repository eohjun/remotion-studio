/**
 * Epoché Scene - Husserl's phenomenological method
 *
 * Features bracket animation to visualize "bracketing" assumptions.
 */

import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedGradient } from "../../../shared/components/backgrounds/AnimatedGradient";
import { ParticleField } from "../../../shared/components/backgrounds/ParticleField";
import { Vignette } from "../../../shared/components/effects/Vignette";
import { BracketAnimation } from "../../../shared/components/metaphors/BracketAnimation";
import { AnimatedText, fadeInUp } from "../../../shared/templates/animations";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from "../../../shared/components/constants";

export const EpocheScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelProgress = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const titleProgress = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const conceptProgress = spring({ frame: frame - 80, fps, config: { damping: 15 } });
  const quoteProgress = spring({ frame: frame - 220, fps, config: { damping: 15 } });

  const items = [
    { icon: "🧠", text: "Suspend natural assumptions", color: COLORS.primary },
    { icon: "👁️", text: "Observe experience directly", color: COLORS.secondary },
    { icon: "✨", text: "Reveal hidden structures", color: COLORS.accent },
  ];

  return (
    <AnimatedGradient
      colors={["#1a1a2e", COLORS.primary, "#2d1b4e"]}
      animationMode="shift"
      cycleDuration={240}
    >
      {/* Subtle particles */}
      <ParticleField
        particleCount={15}
        particleType="blur"
        colors={["rgba(255,255,255,0.2)", "rgba(200,200,255,0.15)"]}
        sizeRange={[2, 6]}
        speedRange={[0.2, 0.5]}
        opacity={0.5}
        direction="random"
      />

      {/* Main content area */}
      <AbsoluteFill style={{ padding: SPACING.xl }}>
        {/* Section label */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            opacity: labelProgress,
            transform: `translateX(${interpolate(labelProgress, [0, 1], [-20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.primary,
              fontFamily: FONT_FAMILY.body,
              letterSpacing: 4,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            PHENOMENOLOGY
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 80,
            opacity: titleProgress,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <h1
            style={{
              fontSize: FONT_SIZES["3xl"],
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.title,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: SPACING.md,
            }}
          >
            <span style={{ fontSize: 48 }}>🔍</span>
            <AnimatedText
              text="Husserl's Epoché"
              animation={fadeInUp(30)}
              stagger="character"
              staggerDuration={2}
              delay={35}
            />
          </h1>
        </div>

        {/* Bracket animation with concept */}
        <BracketAnimation
          delay={60}
          showSuspend={true}
          color="rgba(102, 126, 234, 0.6)"
          thickness={3}
          size={50}
          gap={60}
        >
          <div
            style={{
              opacity: conceptProgress,
              textAlign: "center",
              maxWidth: 800,
              padding: SPACING.xl,
            }}
          >
            <p
              style={{
                fontSize: FONT_SIZES.lg,
                color: "rgba(255,255,255,0.9)",
                fontFamily: FONT_FAMILY.body,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              In 1913, Edmund Husserl introduced{" "}
              <span style={{ color: COLORS.primary, fontWeight: 600 }}>epoché</span> —
              the practice of "bracketing" our assumptions about the world.
            </p>
            <p
              style={{
                fontSize: FONT_SIZES.md,
                color: "rgba(255,255,255,0.7)",
                fontFamily: FONT_FAMILY.body,
                lineHeight: 1.7,
                marginTop: SPACING.md,
              }}
            >
              Not doubting reality, but suspending judgment to see experience as it truly is.
            </p>
          </div>
        </BracketAnimation>

        {/* Items - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 80,
            display: "flex",
            flexDirection: "column",
            gap: SPACING.sm,
          }}
        >
          {items.map((item, index) => {
            const itemDelay = index * 15;
            const itemProgress = spring({
              frame: frame - 150 - itemDelay,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={index}
                style={{
                  opacity: itemProgress,
                  transform: `translateX(${interpolate(itemProgress, [0, 1], [-30, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.sm,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${item.color}20`,
                    borderRadius: 8,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: FONT_SIZES.md,
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quote - bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            maxWidth: 500,
            opacity: quoteProgress,
            transform: `translateY(${interpolate(quoteProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              background: "rgba(102, 126, 234, 0.15)",
              borderLeft: `4px solid ${COLORS.primary}`,
              padding: SPACING.md,
              borderRadius: "0 8px 8px 0",
            }}
          >
            <span style={{ fontSize: 24, marginRight: 8 }}>💡</span>
            <span
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                fontStyle: "italic",
              }}
            >
              "Return to the things themselves"
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.35} size={0.45} softness={0.5} />
    </AnimatedGradient>
  );
};

export default EpocheScene;
