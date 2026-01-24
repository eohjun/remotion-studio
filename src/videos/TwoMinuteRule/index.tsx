import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  Easing,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
import { getAudioData } from "@remotion/media-utils";
import { z } from "zod";
import { SCENES, THEME, SHORTS_LAYOUT, TOTAL_DURATION } from "./constants";
import { AnimatedText } from "../../shared/templates/animations/AnimatedText";
import { fadeInUp, scaleIn } from "../../shared/templates/animations/presets";
import { FONT_FAMILY } from "../../shared/components/constants";
import { BarWaveform } from "../../shared/components/waveforms";

// Type for audio data
type AudioDataType = Awaited<ReturnType<typeof getAudioData>>;

// Hook to load audio data with proper delay/continue render handling
const useAudioData = (src: string) => {
  const [audioData, setAudioData] = useState<AudioDataType | null>(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    getAudioData(src)
      .then((data) => {
        setAudioData(data);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load audio data:", err);
        cancelRender(err);
      });
  }, [src, handle]);

  return audioData;
};

// Schema for props
export const TwoMinuteRuleSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

// Animated gradient background
const AnimatedBackground: React.FC<{
  colors: string[];
  speed?: number;
}> = ({ colors, speed = 0.02 }) => {
  const frame = useCurrentFrame();
  const angle = (frame * speed * 360) % 360;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
      }}
    />
  );
};

// Floating particles
const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
  maxSize?: number;
}> = ({ count = 15, color = "rgba(255,255,255,0.1)", maxSize = 80 }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7) % 100;
    const baseY = (seed * 11) % 100;
    const size = 20 + (seed % maxSize);
    const speed = 0.3 + (seed % 10) / 20;
    const y = (baseY + frame * speed) % 120 - 10;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          filter: "blur(2px)",
        }}
      />
    );
  });

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

// Audio waveform visualization at bottom
const WaveformDisplay: React.FC<{
  color?: string;
  audioData?: AudioDataType | null;
}> = ({ color = THEME.primaryColor, audioData }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <BarWaveform
        audioData={audioData}
        numberOfSamples={48}
        barColor={color}
        barWidth={6}
        barGap={4}
        waveAmplitude={60}
        waveSpeed={0.08}
        width={800}
        height={80}
        growUpwardsOnly
        style={{ opacity: 0.8 }}
      />
    </div>
  );
};

// Progress bar at bottom
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = (frame / TOTAL_DURATION) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        background: "rgba(255,255,255,0.2)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${THEME.primaryColor}, ${THEME.accentColor})`,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
};

// Scene transition (fade + scale)
const SceneTransition: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity: enterProgress,
        transform: `scale(${0.9 + enterProgress * 0.1})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Pulsing glow effect
const PulsingGlow: React.FC<{
  color: string;
  size?: number;
  children: React.ReactNode;
}> = ({ color, size = 30, children }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        filter: `drop-shadow(0 0 ${size * pulse}px ${color})`,
      }}
    >
      {children}
    </div>
  );
};

// Audio file paths
const AUDIO_FILES = {
  hook: staticFile("videos/TwoMinuteRule/audio/hook.mp3"),
  problem: staticFile("videos/TwoMinuteRule/audio/problem.mp3"),
  solution: staticFile("videos/TwoMinuteRule/audio/solution.mp3"),
  takeaway: staticFile("videos/TwoMinuteRule/audio/takeaway.mp3"),
};

// ============================================
// SCENE COMPONENTS
// ============================================

// Hook Scene - Brain freezing effect
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(AUDIO_FILES.hook);

  const scale = spring({
    frame,
    fps,
    config: { damping: 50, stiffness: 200 },
  });

  // Glitch/shake effect for "brain freezing"
  const glitchX = frame < 30 ? Math.sin(frame * 2) * 5 : 0;
  const glitchY = frame < 30 ? Math.cos(frame * 3) * 3 : 0;

  // Brain "freeze" effect - stuttering opacity
  const freezeOpacity = interpolate(
    frame,
    [0, 20, 25, 30, 35, 40],
    [0, 1, 0.7, 1, 0.8, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <AnimatedBackground
        colors={[THEME.backgroundColor, "#2a1a3e", "#1a2a3e"]}
        speed={0.01}
      />
      <FloatingParticles color="rgba(255,107,107,0.15)" count={20} />

      <SceneTransition>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: SHORTS_LAYOUT.padding.horizontal,
            textAlign: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${0.8 + scale * 0.2}) translate(${glitchX}px, ${glitchY}px)`,
              opacity: freezeOpacity,
            }}
          >
            {/* Brain with glitch effect */}
            <PulsingGlow color={THEME.primaryColor} size={40}>
              <div
                style={{
                  fontSize: 100,
                  marginBottom: 40,
                  filter: frame < 30 ? `hue-rotate(${frame * 10}deg)` : "none",
                }}
              >
                🧠
              </div>
            </PulsingGlow>

            <AnimatedText
              text="You're not lazy."
              animation={fadeInUp()}
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: THEME.textColor,
                marginBottom: 20,
                fontFamily: FONT_FAMILY.title,
              }}
            />

            {/* Highlighted text with background */}
            <div
              style={{
                background: `linear-gradient(90deg, ${THEME.primaryColor}dd, ${THEME.primaryColor}88)`,
                padding: "10px 30px",
                borderRadius: 16,
                marginTop: 10,
              }}
            >
              <AnimatedText
                text="Your brain just hates starting."
                animation={fadeInUp()}
                delay={20}
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: THEME.textColor,
                  fontFamily: FONT_FAMILY.title,
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </SceneTransition>

      <WaveformDisplay color={THEME.primaryColor} audioData={audioData} />
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Problem Scene - Growing mountain metaphor
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(AUDIO_FILES.problem);

  // Mountain grows and looms over
  const mountainScale = interpolate(
    frame,
    [0, 60, 120],
    [0.5, 1.2, 1.3],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const mountainY = interpolate(
    frame,
    [0, 60],
    [100, 0],
    { extrapolateRight: "clamp" }
  );

  // Dark overlay increasing
  const darkOverlay = interpolate(frame, [0, 90], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  // Text emphasis animation
  const emphasisScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 50, stiffness: 300 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground
        colors={["#1a1a2e", "#2d1b3d", "#1b2d3d"]}
        speed={0.015}
      />
      <FloatingParticles color="rgba(78,205,196,0.1)" count={12} />

      {/* Dark vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, transparent 20%, rgba(0,0,0,${darkOverlay}) 80%)`,
        }}
      />

      <SceneTransition>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: SHORTS_LAYOUT.padding.horizontal,
            textAlign: "center",
          }}
        >
          {/* Growing mountain */}
          <div
            style={{
              fontSize: 140,
              marginBottom: 40,
              transform: `scale(${mountainScale}) translateY(${mountainY}px)`,
              filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.5))`,
            }}
          >
            ⛰️
          </div>

          <AnimatedText
            text="The hardest part of any task"
            animation={fadeInUp()}
            delay={15}
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: THEME.textColor,
              marginBottom: 15,
              fontFamily: FONT_FAMILY.title,
            }}
          />

          <AnimatedText
            text="isn't doing it."
            animation={fadeInUp()}
            delay={35}
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: THEME.secondaryColor,
              marginBottom: 50,
              fontFamily: FONT_FAMILY.title,
            }}
          />

          {/* Big emphasis on "starting" */}
          <div
            style={{
              transform: `scale(${Math.max(0, emphasisScale)})`,
              background: `linear-gradient(135deg, ${THEME.primaryColor}, ${THEME.secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              padding: "0 20px",
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              It's STARTING.
            </span>
          </div>
        </AbsoluteFill>
      </SceneTransition>

      <WaveformDisplay color={THEME.secondaryColor} audioData={audioData} />
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Solution Scene - Timer countdown with energy
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(AUDIO_FILES.solution);

  const badgeScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 60, stiffness: 200 },
  });

  // Rotating ring animation
  const ringRotation = frame * 2;

  // Countdown feeling
  const countdownPulse = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [0.95, 1.05]
  );

  // Checkmark appears
  const checkmarkProgress = spring({
    frame: frame - 150,
    fps,
    config: { damping: 50, stiffness: 200 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground
        colors={[THEME.backgroundColor, "#1e3a5f", "#2d1b4e"]}
        speed={0.02}
      />
      <FloatingParticles color="rgba(255,230,109,0.12)" count={18} />

      {/* Radial burst effect */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 35%, ${THEME.accentColor}22 0%, transparent 50%)`,
        }}
      />

      <SceneTransition>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: SHORTS_LAYOUT.padding.horizontal,
            textAlign: "center",
          }}
        >
          {/* Timer badge with rotating ring */}
          <div
            style={{
              position: "relative",
              marginBottom: 50,
              transform: `scale(${badgeScale * countdownPulse})`,
            }}
          >
            {/* Rotating outer ring */}
            <div
              style={{
                position: "absolute",
                top: -15,
                left: -15,
                right: -15,
                bottom: -15,
                borderRadius: 45,
                border: `4px solid transparent`,
                borderTopColor: THEME.accentColor,
                borderRightColor: THEME.primaryColor,
                transform: `rotate(${ringRotation}deg)`,
              }}
            />

            <div
              style={{
                background: `linear-gradient(135deg, ${THEME.primaryColor}, ${THEME.secondaryColor})`,
                borderRadius: 30,
                padding: "25px 45px",
                display: "flex",
                alignItems: "center",
                boxShadow: `0 0 60px ${THEME.primaryColor}66`,
              }}
            >
              <span style={{ fontSize: 52, marginRight: 15 }}>⏱️</span>
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: THEME.textColor,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                2 MIN
              </span>
            </div>
          </div>

          <AnimatedText
            text="The Two Minute Rule"
            animation={fadeInUp()}
            delay={20}
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: THEME.accentColor,
              marginBottom: 45,
              fontFamily: FONT_FAMILY.title,
            }}
          />

          {/* Rule 1 with checkmark */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <span
              style={{
                fontSize: 36,
                marginRight: 15,
                opacity: checkmarkProgress > 0.5 ? 1 : 0.3,
                transform: `scale(${0.5 + checkmarkProgress * 0.5})`,
              }}
            >
              ✅
            </span>
            <AnimatedText
              text="Less than 2 min? Do it NOW."
              animation={fadeInUp()}
              delay={60}
              stagger="none"
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: THEME.textColor,
                fontFamily: FONT_FAMILY.title,
              }}
            />
          </div>

          {/* Rule 2 */}
          <div
            style={{
              marginTop: 30,
              padding: "15px 30px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 20,
              borderLeft: `4px solid ${THEME.secondaryColor}`,
            }}
          >
            <AnimatedText
              text="Bigger task?"
              animation={fadeInUp()}
              delay={110}
              stagger="none"
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                fontFamily: FONT_FAMILY.title,
              }}
            />
            <AnimatedText
              text="Just commit to 2 minutes."
              animation={fadeInUp()}
              delay={130}
              stagger="none"
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: THEME.secondaryColor,
                marginTop: 10,
                fontFamily: FONT_FAMILY.title,
              }}
            />
          </div>
        </AbsoluteFill>
      </SceneTransition>

      <WaveformDisplay color={THEME.accentColor} audioData={audioData} />
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Takeaway Scene - Victory/achievement feeling
const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(AUDIO_FILES.takeaway);

  const checkScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 40, stiffness: 300 },
  });

  // Celebration particles burst
  const burstProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 80, stiffness: 150 },
  });

  // Pulsing CTA
  const ctaPulse = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [1, 1.08]
  );

  // Confetti-like elements
  const confetti = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const distance = 150 + (i % 3) * 50;
    const x = Math.cos(angle) * distance * burstProgress;
    const y = Math.sin(angle) * distance * burstProgress;
    const colors = [THEME.primaryColor, THEME.secondaryColor, THEME.accentColor];

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "25%",
          width: 12,
          height: 12,
          borderRadius: i % 2 === 0 ? "50%" : 2,
          background: colors[i % 3],
          transform: `translate(${x}px, ${y}px) rotate(${frame * 5 + i * 30}deg)`,
          opacity: Math.max(0, 1 - burstProgress * 0.8),
        }}
      />
    );
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground
        colors={["#1a2e1a", "#1a1a2e", "#2e1a2e"]}
        speed={0.025}
      />
      <FloatingParticles color="rgba(40,167,69,0.15)" count={15} />

      {/* Success radial gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${THEME.accentColor}33 0%, transparent 40%)`,
        }}
      />

      {/* Confetti burst */}
      {confetti}

      <SceneTransition>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: SHORTS_LAYOUT.padding.horizontal,
            textAlign: "center",
          }}
        >
          {/* Big checkmark with glow */}
          <PulsingGlow color="#28a745" size={50}>
            <div
              style={{
                fontSize: 120,
                marginBottom: 40,
                transform: `scale(${checkScale})`,
              }}
            >
              ✅
            </div>
          </PulsingGlow>

          <AnimatedText
            text="2 minutes"
            animation={scaleIn()}
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: THEME.accentColor,
              marginBottom: 15,
              fontFamily: FONT_FAMILY.title,
            }}
          />

          <AnimatedText
            text="beats all resistance."
            animation={fadeInUp()}
            delay={20}
            stagger="none"
            style={{
              fontSize: 44,
              fontWeight: 600,
              color: THEME.textColor,
              marginBottom: 50,
              fontFamily: FONT_FAMILY.title,
            }}
          />

          {/* Big CTA */}
          <div
            style={{
              background: `linear-gradient(135deg, ${THEME.primaryColor}, ${THEME.secondaryColor})`,
              padding: "20px 50px",
              borderRadius: 60,
              transform: `scale(${ctaPulse})`,
              boxShadow: `0 10px 40px ${THEME.primaryColor}66`,
            }}
          >
            <AnimatedText
              text="Start small. Start NOW."
              animation={fadeInUp()}
              delay={50}
              stagger="none"
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: THEME.textColor,
                fontFamily: FONT_FAMILY.title,
              }}
            />
          </div>

          {/* Subscribe CTA */}
          <div
            style={{
              marginTop: 60,
              opacity: interpolate(frame, [80, 110], [0, 1], {
                extrapolateRight: "clamp",
              }),
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 32 }}>👆</span>
            <span
              style={{
                fontSize: 32,
                color: "rgba(255,255,255,0.7)",
                fontFamily: FONT_FAMILY.body,
              }}
            >
              Follow for more tips
            </span>
          </div>
        </AbsoluteFill>
      </SceneTransition>

      <WaveformDisplay color="#28a745" audioData={audioData} />
      <ProgressBar />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const TwoMinuteRule: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.backgroundColor }}>
      {/* Scenes with Audio */}
      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
        <Audio src={staticFile("videos/TwoMinuteRule/audio/hook.mp3")} />
        <HookScene />
      </Sequence>

      <Sequence from={SCENES.PROBLEM.start} durationInFrames={SCENES.PROBLEM.duration}>
        <Audio src={staticFile("videos/TwoMinuteRule/audio/problem.mp3")} />
        <ProblemScene />
      </Sequence>

      <Sequence from={SCENES.SOLUTION.start} durationInFrames={SCENES.SOLUTION.duration}>
        <Audio src={staticFile("videos/TwoMinuteRule/audio/solution.mp3")} />
        <SolutionScene />
      </Sequence>

      <Sequence from={SCENES.TAKEAWAY.start} durationInFrames={SCENES.TAKEAWAY.duration}>
        <Audio src={staticFile("videos/TwoMinuteRule/audio/takeaway.mp3")} />
        <TakeawayScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default TwoMinuteRule;
