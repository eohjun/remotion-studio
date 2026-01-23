/**
 * Metacognition Scene - Thinking about thinking
 *
 * Features LayeredMind visualization showing consciousness layers.
 */

import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedGradient } from "../../../shared/components/backgrounds/AnimatedGradient";
import { FloatingShapes } from "../../../shared/components/backgrounds/FloatingShapes";
import { Vignette } from "../../../shared/components/effects/Vignette";
import { LayeredMind } from "../../../shared/components/metaphors/LayeredMind";
import { AnimatedText, fadeInUp } from "../../../shared/templates/animations";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from "../../../shared/components/constants";

export const MetacognitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelProgress = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const titleProgress = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const textProgress = spring({ frame: frame - 60, fps, config: { damping: 15 } });
  const quoteProgress = spring({ frame: frame - 280, fps, config: { damping: 15 } });

  // Custom layers for metacognition
  const mindLayers = [
    { label: "Thoughts & Emotions", color: "rgba(102, 126, 234, 0.85)", icon: "💭" },
    { label: "Awareness of Thoughts", color: "rgba(118, 75, 162, 0.85)", icon: "👁️" },
    { label: "Observing the Observer", color: "rgba(236, 72, 153, 0.85)", icon: "🪞" },
  ];

  return (
    <AnimatedGradient
      colors={["#1a1a2e", "#2d1b4e", COLORS.secondary]}
      animationMode="pulse"
      cycleDuration={200}
    >
      {/* Floating geometric shapes */}
      <FloatingShapes
        shapeCount={8}
        shapeTypes={["circle", "hexagon"]}
        colors={["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.08)"]}
        sizeRange={[60, 140]}
        opacity={0.4}
        rotate={true}
      />

      {/* Left side: Title and content */}
      <AbsoluteFill>
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
              color: COLORS.accent,
              fontFamily: FONT_FAMILY.body,
              letterSpacing: 4,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            THE OBSERVER WITHIN
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
            <span style={{ fontSize: 48 }}>🪞</span>
            <AnimatedText
              text="Metacognition"
              animation={fadeInUp(30)}
              stagger="character"
              staggerDuration={2}
              delay={30}
            />
          </h1>
        </div>

        {/* Description text - left side */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 80,
            maxWidth: 500,
            opacity: textProgress,
            transform: `translateY(${interpolate(textProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <p
            style={{
              fontSize: FONT_SIZES.md,
              color: "rgba(255,255,255,0.9)",
              fontFamily: FONT_FAMILY.body,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            <span style={{ color: COLORS.accent, fontWeight: 600 }}>Metacognition</span>:
            thinking about thinking. When you notice your mind wandering and return to breath,
            that's metacognition in action.
          </p>
          <p
            style={{
              fontSize: FONT_SIZES.sm,
              color: "rgba(255,255,255,0.7)",
              fontFamily: FONT_FAMILY.body,
              lineHeight: 1.7,
              marginTop: SPACING.md,
            }}
          >
            John Flavell showed this ability isn't fixed — it can be trained through practice.
          </p>
        </div>

        {/* LayeredMind visualization - right side */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
          }}
        >
          <LayeredMind
            layers={mindLayers}
            separationDelay={80}
            separated={true}
            separationDistance={70}
            layerWidth={380}
            layerHeight={70}
            position="center"
          />
        </div>

        {/* Key points - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: 160,
            left: 80,
            display: "flex",
            gap: SPACING.lg,
          }}
        >
          {[
            { icon: "🎯", text: "Monitor your thinking" },
            { icon: "📊", text: "Know what you don't know" },
            { icon: "🔧", text: "Skill that improves" },
          ].map((item, index) => {
            const itemProgress = spring({
              frame: frame - 160 - index * 12,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={index}
                style={{
                  opacity: itemProgress,
                  transform: `translateY(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px 20px",
                  borderRadius: 30,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: FONT_SIZES.sm,
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

        {/* Quote - bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: `translateX(-50%) translateY(${interpolate(quoteProgress, [0, 1], [20, 0])}px)`,
            opacity: quoteProgress,
          }}
        >
          <div
            style={{
              background: "rgba(236, 72, 153, 0.15)",
              borderLeft: `4px solid ${COLORS.accent}`,
              padding: SPACING.md,
              paddingLeft: SPACING.lg,
              borderRadius: "0 8px 8px 0",
            }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>💡</span>
            <span
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                fontStyle: "italic",
              }}
            >
              "Knowing what you don't know is often more valuable than what you know"
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.35} size={0.45} softness={0.5} />
    </AnimatedGradient>
  );
};

export default MetacognitionScene;
