import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

// Easing functions
import {
  easeOutBounce,
  easeOutElastic,
  easeOutBack,
  easeInOutCubic,
  easeOutExpo,
  cubicBezier,
  EASING_PRESETS,
} from "../shared/templates/animations";

// Color utilities
import {
  interpolateColor,
  interpolateColors,
  pulsingGradient,
  lighten,
  darken,
} from "../shared/templates/animations";

// SVG utilities
import {
  calculateStrokeDraw,
  progressRing,
  animatedRotation,
} from "../shared/templates/animations";

// Eased presets
import {
  fadeInEased,
  slideInEased,
  getEasedAnimatedStyle,
} from "../shared/templates/animations";

import { COLORS, FONT_FAMILY } from "../shared/components/constants";

// Schema for the demo composition
export const animationDemoSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

type AnimationDemoProps = z.infer<typeof animationDemoSchema>;

// Duration constants (in frames at 30fps)
const SCENE_DURATION = 180; // 6 seconds per scene
const TOTAL_SCENES = 5;
export const ANIMATION_DEMO_DURATION = SCENE_DURATION * TOTAL_SCENES;

// Common text styles
const titleStyle: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 700,
  fontFamily: FONT_FAMILY.title,
  color: COLORS.white,
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 28,
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
  fontSize: 20,
  fontFamily: FONT_FAMILY.body,
  color: "rgba(255, 255, 255, 0.6)",
  textAlign: "center",
};

/**
 * Scene 1: Easing Functions Showcase
 */
const EasingShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate progress with loop (restart every 3 seconds)
  const loopDuration = fps * 3;
  const progress = (frame % loopDuration) / loopDuration;

  // Different easing functions
  const easings = [
    { name: "linear", fn: (t: number) => t },
    { name: "easeOut", fn: EASING_PRESETS.easeOut },
    { name: "easeOutBounce", fn: easeOutBounce },
    { name: "easeOutElastic", fn: easeOutElastic },
    { name: "easeOutBack", fn: easeOutBack },
  ];

  const boxWidth = 60;
  const trackWidth = 800;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <div style={{ ...titleStyle, marginBottom: 40 }}>Easing Functions</div>

      {easings.map((easing, index) => {
        const easedProgress = easing.fn(progress);
        const xPosition = easedProgress * (trackWidth - boxWidth);

        return (
          <div
            key={easing.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: trackWidth + 150,
            }}
          >
            <div
              style={{
                width: 140,
                fontSize: 18,
                fontFamily: FONT_FAMILY.body,
                color: COLORS.white,
                textAlign: "right",
              }}
            >
              {easing.name}
            </div>
            <div
              style={{
                position: "relative",
                width: trackWidth,
                height: 50,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: xPosition,
                  top: 5,
                  width: boxWidth,
                  height: 40,
                  background: `hsl(${220 + index * 20}, 70%, 60%)`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}

      <div style={labelStyle}>Easing Functions • Looping every 3 seconds</div>
    </AbsoluteFill>
  );
};

/**
 * Scene 2: Color Interpolation Demo
 */
const ColorInterpolationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = (frame % (fps * 4)) / (fps * 4);

  // Multi-color interpolation
  const colors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success];
  const currentColor = interpolateColors(colors, progress, "hsl");

  // Two-color interpolation
  const twoColorProgress = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
  const interpolatedColor = interpolateColor(
    COLORS.primary,
    COLORS.accent,
    twoColorProgress,
    "hsl"
  );

  // Pulsing gradient
  const gradientBg = pulsingGradient(colors, progress);

  return (
    <AbsoluteFill
      style={{
        background: gradientBg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <div style={{ ...titleStyle, marginBottom: 20 }}>Color Interpolation</div>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* Multi-color interpolation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              background: currentColor,
              boxShadow: `0 8px 32px ${currentColor}88`,
            }}
          />
          <div style={{ color: COLORS.white, fontFamily: FONT_FAMILY.body }}>
            Multi-color (HSL)
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: FONT_FAMILY.body }}>
            {currentColor}
          </div>
        </div>

        {/* Two-color interpolation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              background: interpolatedColor,
              boxShadow: `0 8px 32px ${interpolatedColor}88`,
            }}
          />
          <div style={{ color: COLORS.white, fontFamily: FONT_FAMILY.body }}>
            Two-color (sine wave)
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: FONT_FAMILY.body }}>
            {interpolatedColor}
          </div>
        </div>

        {/* Lighten/Darken */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 90,
                height: 200,
                borderRadius: 20,
                background: lighten(COLORS.primary, 30),
              }}
            />
            <div
              style={{
                width: 90,
                height: 200,
                borderRadius: 20,
                background: darken(COLORS.primary, 20),
              }}
            />
          </div>
          <div style={{ color: COLORS.white, fontFamily: FONT_FAMILY.body }}>
            lighten / darken
          </div>
        </div>
      </div>

      <div style={labelStyle}>
        interpolateColors • interpolateColor • pulsingGradient
      </div>
    </AbsoluteFill>
  );
};

/**
 * Scene 3: SVG Stroke Animation
 */
const SVGStrokeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = Math.min(1, frame / (fps * 2.5));

  // Stroke draw for path
  const pathLength = 1200;
  const strokeDraw = calculateStrokeDraw({
    pathLength,
    progress: easeInOutCubic(progress),
  });

  // Progress ring
  const ringProgress = progressRing(easeOutExpo(progress), 80);

  // Rotation
  const rotation = animatedRotation(progress, {
    startAngle: 0,
    endAngle: 360,
    centerX: 100,
    centerY: 100,
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <div style={{ ...titleStyle, marginBottom: 20 }}>SVG Animations</div>

      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        {/* Stroke Draw Path */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <svg width="300" height="200" viewBox="0 0 300 200">
            <path
              d="M10,100 C60,10 120,10 150,100 S240,190 290,100"
              stroke={COLORS.accent}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: strokeDraw.strokeDasharray,
                strokeDashoffset: strokeDraw.strokeDashoffset,
              }}
            />
          </svg>
          <div style={{ color: COLORS.white, fontFamily: FONT_FAMILY.body }}>
            Stroke Draw (useStrokeDraw)
          </div>
        </div>

        {/* Progress Ring */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke={COLORS.primary}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={ringProgress}
            />
            <text
              x="100"
              y="110"
              textAnchor="middle"
              fill={COLORS.white}
              fontSize="32"
              fontFamily={FONT_FAMILY.title}
            >
              {Math.round(easeOutExpo(progress) * 100)}%
            </text>
          </svg>
          <div style={{ color: COLORS.white, fontFamily: FONT_FAMILY.body }}>
            Progress Ring (progressRing)
          </div>
        </div>

        {/* Rotation */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <g transform={rotation}>
              <rect
                x="60"
                y="60"
                width="80"
                height="80"
                fill={COLORS.secondary}
                rx="10"
              />
              <circle cx="100" cy="100" r="10" fill={COLORS.white} />
            </g>
          </svg>
          <div style={{ color: COLORS.white, fontFamily: FONT_FAMILY.body }}>
            Animated Rotation
          </div>
        </div>
      </div>

      <div style={labelStyle}>
        SVG Animation Utilities • useStrokeDraw • progressRing • animatedRotation
      </div>
    </AbsoluteFill>
  );
};

/**
 * Scene 4: Eased Presets Demo
 */
const EasedPresetsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Custom bezier easing
  const customBezier = cubicBezier(0.68, -0.55, 0.265, 1.55);

  // Different presets with different easings
  const items = [
    { text: "Bounce In", config: fadeInEased(easeOutBounce, 45), startFrame: 0 },
    { text: "Elastic Slide", config: slideInEased("left", easeOutElastic, 100, 60), startFrame: 20 },
    { text: "Back Ease", config: slideInEased("right", easeOutBack, 80, 40), startFrame: 40 },
    { text: "Custom Bezier", config: fadeInEased(customBezier, 50), startFrame: 60 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <div style={{ ...titleStyle, marginBottom: 40 }}>Eased Animation Presets</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {items.map((item, index) => {
          const style = getEasedAnimatedStyle(frame, item.startFrame, item.config);

          return (
            <div
              key={item.text}
              style={{
                ...style,
                padding: "20px 60px",
                background: `linear-gradient(90deg,
                  hsl(${220 + index * 25}, 70%, 50%) 0%,
                  hsl(${240 + index * 25}, 70%, 60%) 100%)`,
                borderRadius: 12,
                fontSize: 32,
                fontFamily: FONT_FAMILY.title,
                color: COLORS.white,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {item.text}
            </div>
          );
        })}
      </div>

      <div style={labelStyle}>
        fadeInEased • slideInEased • getEasedAnimatedStyle • cubicBezier
      </div>
    </AbsoluteFill>
  );
};

/**
 * Scene 5: Combined Animation Showcase
 */
const CombinedShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Looping progress
  const loopProgress = (frame % (fps * 4)) / (fps * 4);

  // Color cycling
  const colors = [COLORS.primary, COLORS.secondary, COLORS.accent, "#ff6b6b", COLORS.primary];
  const bgColor = interpolateColors(colors, loopProgress, "hsl");

  // Eased values
  const bounceValue = easeOutBounce(loopProgress);
  const elasticValue = easeOutElastic(Math.min(1, loopProgress * 1.5));

  // SVG progress
  const svgProgress = progressRing(easeInOutCubic(loopProgress), 60);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${bgColor}33 0%, ${COLORS.dark} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ ...titleStyle, marginBottom: 60 }}>Phase 10 Complete</div>

      <div style={{ display: "flex", gap: 100, alignItems: "center" }}>
        {/* Bouncing circles */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: bgColor,
              transform: `scale(${0.5 + bounceValue * 0.5})`,
              boxShadow: `0 ${20 * bounceValue}px ${40 * bounceValue}px ${bgColor}66`,
            }}
          />
          <div style={subtitleStyle}>Bounce + Color</div>
        </div>

        {/* SVG ring */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke={bgColor}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              style={svgProgress}
            />
          </svg>
          <div style={subtitleStyle}>SVG + Easing</div>
        </div>

        {/* Elastic box */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${bgColor} 0%, ${darken(bgColor, 20)} 100%)`,
              transform: `rotate(${elasticValue * 360}deg) scale(${0.8 + elasticValue * 0.2})`,
            }}
          />
          <div style={subtitleStyle}>Elastic Transform</div>
        </div>
      </div>

      <div style={labelStyle}>
        Animation System Enhancement • Easings • Colors • SVG
      </div>
    </AbsoluteFill>
  );
};

/**
 * Main Demo Composition
 */
export const AnimationDemo: React.FC<AnimationDemoProps> = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      {/* Scene 1: Easing Functions */}
      <Sequence durationInFrames={SCENE_DURATION}>
        <EasingShowcase />
      </Sequence>

      {/* Scene 2: Color Interpolation */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <ColorInterpolationScene />
      </Sequence>

      {/* Scene 3: SVG Animations */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SVGStrokeScene />
      </Sequence>

      {/* Scene 4: Eased Presets */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <EasedPresetsScene />
      </Sequence>

      {/* Scene 5: Combined Showcase */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <CombinedShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};

export default AnimationDemo;
