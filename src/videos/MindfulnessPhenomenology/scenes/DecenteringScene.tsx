/**
 * Decentering Scene - Shifting perspective on thoughts
 *
 * Shows the transformation from fusion to decentering with visual comparison.
 */

import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedGradient } from "../../../shared/components/backgrounds/AnimatedGradient";
import { ParticleField } from "../../../shared/components/backgrounds/ParticleField";
import { Vignette } from "../../../shared/components/effects/Vignette";
import { AnimatedText, fadeInUp } from "../../../shared/templates/animations";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from "../../../shared/components/constants";

export const DecenteringScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelProgress = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const titleProgress = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const fusedProgress = spring({ frame: frame - 60, fps, config: { damping: 15 } });
  const transitionProgress = spring({ frame: frame - 150, fps, config: { damping: 12 } });
  const decenteredProgress = spring({ frame: frame - 200, fps, config: { damping: 15 } });

  // Animation for the transformation
  const transformPhase = interpolate(frame, [120, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AnimatedGradient
      colors={["#1a1a2e", COLORS.secondary, "#3d1f5c"]}
      animationMode="rotate"
      cycleDuration={300}
      angle={45}
    >
      <ParticleField
        particleCount={20}
        particleType="blur"
        colors={["rgba(255,255,255,0.25)", "rgba(200,180,255,0.2)"]}
        sizeRange={[3, 8]}
        speedRange={[0.3, 0.8]}
        opacity={0.6}
        direction="up"
      />

      <AbsoluteFill>
        {/* Section label */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            opacity: labelProgress,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.success,
              fontFamily: FONT_FAMILY.body,
              letterSpacing: 4,
              fontWeight: 600,
            }}
          >
            CLINICAL APPLICATION
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
            <span style={{ fontSize: 48 }}>🔄</span>
            <AnimatedText
              text="Decentering"
              animation={fadeInUp(30)}
              stagger="character"
              staggerDuration={2}
              delay={30}
            />
          </h1>
        </div>

        {/* Main comparison visualization */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            gap: 100,
            alignItems: "center",
          }}
        >
          {/* Fused state: "I AM a failure" */}
          <div
            style={{
              opacity: interpolate(fusedProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(transformPhase, [0, 1], [0, -50])}px) scale(${interpolate(transformPhase, [0, 1], [1, 0.85])})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "rgba(220, 53, 69, 0.2)",
                border: "2px solid rgba(220, 53, 69, 0.5)",
                borderRadius: 16,
                padding: "40px 50px",
                marginBottom: SPACING.md,
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#ff6b6b",
                  fontFamily: FONT_FAMILY.title,
                  display: "block",
                }}
              >
                "I AM
              </span>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                a failure"
              </span>
            </div>
            <span
              style={{
                fontSize: FONT_SIZES.sm,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT_FAMILY.body,
                opacity: interpolate(transformPhase, [0, 0.5], [1, 0]),
              }}
            >
              Fused with thought
            </span>
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: transitionProgress,
              transform: `scale(${interpolate(transitionProgress, [0, 1], [0.5, 1])})`,
            }}
          >
            <svg width="80" height="40" viewBox="0 0 80 40">
              <defs>
                <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,107,107,0.8)" />
                  <stop offset="100%" stopColor="rgba(40,167,69,0.8)" />
                </linearGradient>
              </defs>
              <path
                d="M 0 20 L 60 20 M 50 10 L 65 20 L 50 30"
                stroke="url(#arrowGrad)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Decentered state: "I notice the thought..." */}
          <div
            style={{
              opacity: decenteredProgress,
              transform: `translateX(${interpolate(decenteredProgress, [0, 1], [50, 0])}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "rgba(40, 167, 69, 0.2)",
                border: "2px solid rgba(40, 167, 69, 0.5)",
                borderRadius: 16,
                padding: "40px 50px",
                marginBottom: SPACING.md,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#51cf66",
                  fontFamily: FONT_FAMILY.title,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                "I notice the thought
              </span>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                that I am a failure"
              </span>
            </div>
            <span
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.success,
                fontFamily: FONT_FAMILY.body,
              }}
            >
              Observing the thought
            </span>
          </div>
        </div>

        {/* Bottom insight */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: interpolate(decenteredProgress, [0, 1], [0, 1]),
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: FONT_SIZES.lg,
              color: "rgba(255,255,255,0.85)",
              fontFamily: FONT_FAMILY.body,
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            This subtle shift creates{" "}
            <span style={{ color: COLORS.success, fontWeight: 600 }}>
              psychological distance
            </span>
            , allowing us to respond rather than react.
          </p>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.35} size={0.45} softness={0.5} />
    </AnimatedGradient>
  );
};

export default DecenteringScene;
