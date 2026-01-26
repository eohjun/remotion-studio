import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
} from "remotion";
import { z } from "zod";
import { SCENES, THEME, FPS, TOTAL_DURATION, AUDIO_BASE, toFrames } from "./constants";
import { AnimatedText } from "../../shared/templates/animations/AnimatedText";
import { fadeInUp, scaleIn } from "../../shared/templates/animations/presets";
import { FONT_FAMILY } from "../../shared/components/constants";
import { AnimatedGradient } from "../../shared/components/backgrounds";
import { Vignette } from "../../shared/components/effects";
import { ComparisonBars } from "../../shared/components/charts";

// Schema
export const ParkinsonsLawSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = "rgba(102, 126, 234, 0.15)" }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7) % 100;
    const baseY = (seed * 11) % 100;
    const size = 30 + (seed % 60);
    const speed = 0.2 + (seed % 10) / 30;
    const y = (baseY + frame * speed) % 130 - 15;

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
          filter: "blur(3px)",
        }}
      />
    );
  });

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

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
        height: 4,
        background: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})`,
        }}
      />
    </div>
  );
};

// ============================================
// SCENE: HOOK
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clockScale = spring({ frame, fps, config: { damping: 15 } });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const questionOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, ${THEME.backgroundAlt})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles />

      {/* Animated clock icon */}
      <div
        style={{
          fontSize: 120,
          transform: `scale(${clockScale})`,
          marginBottom: 40,
        }}
      >
        ⏰
      </div>

      {/* Main question */}
      <div
        style={{
          opacity: textOpacity,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <AnimatedText
          text="Why does a task that could take an hour"
          animation={fadeInUp()}
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 16,
          }}
        />
        <AnimatedText
          text="somehow take all day?"
          animation={fadeInUp()}
          delay={10}
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: THEME.accent,
            fontFamily: FONT_FAMILY.title,
          }}
        />
      </div>

      {/* Second question */}
      <div
        style={{
          opacity: questionOpacity,
          marginTop: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.body,
          }}
        >
          You're not lazy. Your brain is following an{" "}
          <span style={{ color: THEME.primary, fontWeight: 700 }}>invisible law</span>.
        </div>
      </div>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: INTRO (Origin Story)
// ============================================

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const yearScale = spring({ frame, fps, config: { damping: 12 } });
  const quoteProgress = spring({ frame: frame - 40, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${THEME.backgroundAlt}, ${THEME.background})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <FloatingParticles color="rgba(118, 75, 162, 0.1)" />

      {/* Year badge */}
      <div
        style={{
          position: "absolute",
          top: 100,
          transform: `scale(${yearScale})`,
          background: THEME.primary,
          padding: "16px 40px",
          borderRadius: 50,
          fontSize: 36,
          fontWeight: 800,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
        }}
      >
        1955
      </div>

      {/* Main content */}
      <div style={{ textAlign: "center", maxWidth: 1000 }}>
        <AnimatedText
          text="Cyril Northcote Parkinson"
          animation={fadeInUp()}
          delay={20}
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 24,
          }}
        />
        <AnimatedText
          text="British Naval Historian"
          animation={fadeInUp()}
          delay={35}
          style={{
            fontSize: 28,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 60,
          }}
        />

        {/* The Law */}
        <div
          style={{
            opacity: quoteProgress,
            transform: `translateY(${interpolate(quoteProgress, [0, 1], [30, 0])}px)`,
            background: "rgba(102, 126, 234, 0.1)",
            border: `2px solid ${THEME.primary}`,
            borderRadius: 20,
            padding: "40px 60px",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.5,
            }}
          >
            "Work expands to fill the time
            <br />
            available for its completion."
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 24,
              color: THEME.accent,
              fontWeight: 600,
            }}
          >
            — Parkinson's Law
          </div>
        </div>
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: PROBLEM (Psychology)
// ============================================

const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brainPulse = Math.sin(frame * 0.1) * 0.05 + 1;
  const bulletProgress = (index: number) =>
    spring({ frame: frame - 30 - index * 15, fps, config: { damping: 15 } });

  const bullets = [
    { icon: "🧠", text: "Perceives task as more complex" },
    { icon: "😴", text: "Defaults to procrastination" },
    { icon: "🔄", text: "Adds unnecessary details" },
    { icon: "⏳", text: "Overthinks and waits" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        display: "flex",
        flexDirection: "row",
        padding: 80,
        gap: 60,
      }}
    >
      <FloatingParticles />

      {/* Left: Brain visualization */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 200,
            transform: `scale(${brainPulse})`,
            filter: `drop-shadow(0 0 40px ${THEME.primary})`,
          }}
        >
          🧠
        </div>
      </div>

      {/* Right: Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AnimatedText
          text="What happens in your brain?"
          animation={fadeInUp()}
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 40,
          }}
        />

        {bullets.map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 24,
              opacity: bulletProgress(i),
              transform: `translateX(${interpolate(bulletProgress(i), [0, 1], [-30, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 36 }}>{bullet.icon}</span>
            <span
              style={{
                fontSize: 28,
                color: THEME.text,
                fontFamily: FONT_FAMILY.body,
              }}
            >
              {bullet.text}
            </span>
          </div>
        ))}
      </div>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: EVIDENCE (Study Results)
// ============================================

const EvidenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartProgress = spring({ frame: frame - 30, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.backgroundAlt}, ${THEME.background})`,
        padding: 80,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FloatingParticles color="rgba(102, 126, 234, 0.08)" />

      {/* Title */}
      <AnimatedText
        text="The Research"
        animation={fadeInUp()}
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
          marginBottom: 16,
        }}
      />
      <AnimatedText
        text="Same task. Different time limits."
        animation={fadeInUp()}
        delay={15}
        style={{
          fontSize: 32,
          color: THEME.textMuted,
          fontFamily: FONT_FAMILY.body,
          marginBottom: 40,
        }}
      />

      {/* Comparison bars - centered and large */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: chartProgress,
        }}
      >
        <ComparisonBars
          data={[
            { label: "Time Given", valueA: 5, valueB: 15 },
            { label: "Time Spent", valueA: 4.8, valueB: 14.2 },
          ]}
          labelA="Group A (5 min)"
          labelB="Group B (15 min)"
          colorA={THEME.success}
          colorB={THEME.warning}
          showChange={false}
          barHeight={70}
          gap={80}
          barMaxWidth={800}
          labelWidth={180}
          style={{ width: "100%", maxWidth: 1600 }}
        />
      </div>

      {/* Key insight */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 80,
          right: 80,
          textAlign: "center",
        }}
      >
        <AnimatedText
          text="Work literally expanded to fill the time."
          animation={fadeInUp()}
          delay={60}
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: THEME.accent,
            fontFamily: FONT_FAMILY.title,
          }}
        />
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: REAL WORLD (New Zealand Study)
// ============================================

const RealWorldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statScale = spring({ frame: frame - 40, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <FloatingParticles />

      <div style={{ textAlign: "center", maxWidth: 900 }}>
        {/* Location badge */}
        <AnimatedText
          text="🇳🇿 New Zealand, 2018"
          animation={scaleIn()}
          style={{
            fontSize: 32,
            color: THEME.textMuted,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 40,
          }}
        />

        {/* Main stat */}
        <div
          style={{
            transform: `scale(${statScale})`,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              color: THEME.success,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            4-Day
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            Work Week
          </div>
        </div>

        {/* Result */}
        <AnimatedText
          text="Productivity didn't drop. It improved."
          animation={fadeInUp()}
          delay={50}
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: THEME.text,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 24,
          }}
        />
        <AnimatedText
          text="Less time → Less waste"
          animation={fadeInUp()}
          delay={65}
          style={{
            fontSize: 28,
            color: THEME.accent,
            fontFamily: FONT_FAMILY.body,
          }}
        />
      </div>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: SOLUTIONS
// ============================================

const SolutionScene: React.FC<{
  number: number;
  title: string;
  description: string;
  icon: string;
}> = ({ number, title, description, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 15 } });
  const contentOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.background}, ${THEME.backgroundAlt})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <FloatingParticles />

      {/* Solution number badge */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          background: THEME.primary,
          width: 60,
          height: 60,
          borderRadius: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 800,
          color: THEME.text,
        }}
      >
        {number}
      </div>

      <div style={{ textAlign: "center", maxWidth: 800 }}>
        {/* Icon */}
        <div
          style={{
            fontSize: 100,
            transform: `scale(${iconScale})`,
            marginBottom: 40,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <AnimatedText
          text={title}
          animation={fadeInUp()}
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 30,
          }}
        />

        {/* Description */}
        <div style={{ opacity: contentOpacity }}>
          <div
            style={{
              fontSize: 28,
              color: THEME.textMuted,
              fontFamily: FONT_FAMILY.body,
              lineHeight: 1.6,
            }}
          >
            {description}
          </div>
        </div>
      </div>

      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: CONCLUSION
// ============================================

const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${THEME.backgroundAlt}, ${THEME.background})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <FloatingParticles color="rgba(240, 147, 251, 0.1)" />

      <div style={{ textAlign: "center", maxWidth: 900, opacity: textOpacity }}>
        <AnimatedText
          text="The Uncomfortable Truth"
          animation={fadeInUp()}
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: THEME.accent,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 50,
          }}
        />

        <div
          style={{
            fontSize: 36,
            color: THEME.text,
            fontFamily: FONT_FAMILY.body,
            lineHeight: 1.7,
          }}
        >
          We're not naturally <span style={{ color: THEME.success, fontWeight: 700 }}>efficient</span>.
          <br />
          We're naturally <span style={{ color: THEME.warning, fontWeight: 700 }}>adaptive</span>.
          <br />
          <br />
          Give us time, and we'll use it —
          <br />
          whether we need to or not.
        </div>
      </div>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: TAKEAWAY
// ============================================

const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteScale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 900,
          transform: `scale(${quoteScale})`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            lineHeight: 1.5,
            marginBottom: 50,
          }}
        >
          Work expands to fill the time.
          <br />
          <span style={{ opacity: 0.9 }}>So give it less time to fill.</span>
        </div>

        <AnimatedText
          text="What will you finish faster this week?"
          animation={fadeInUp()}
          delay={40}
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: FONT_FAMILY.body,
          }}
        />
      </div>

      <Vignette intensity={0.3} color="rgba(0,0,0,0.4)" />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const ParkinsonsLaw: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* Background gradient */}
      <AnimatedGradient
        colors={[THEME.background, THEME.backgroundAlt]}
        animationMode="pulse"
      />

      {/* Scenes */}
      <Sequence from={toFrames(SCENES.hook.start)} durationInFrames={toFrames(SCENES.hook.duration)}>
        <HookScene />
        <Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.intro.start)} durationInFrames={toFrames(SCENES.intro.duration)}>
        <IntroScene />
        <Audio src={staticFile(`${AUDIO_BASE}/intro.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.problem.start)} durationInFrames={toFrames(SCENES.problem.duration)}>
        <ProblemScene />
        <Audio src={staticFile(`${AUDIO_BASE}/problem.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.evidence.start)} durationInFrames={toFrames(SCENES.evidence.duration)}>
        <EvidenceScene />
        <Audio src={staticFile(`${AUDIO_BASE}/evidence.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.realworld.start)} durationInFrames={toFrames(SCENES.realworld.duration)}>
        <RealWorldScene />
        <Audio src={staticFile(`${AUDIO_BASE}/realworld.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.solution1.start)} durationInFrames={toFrames(SCENES.solution1.duration)}>
        <SolutionScene
          number={1}
          title="Set Artificial Deadlines"
          description="If you have a week, tell yourself you have three days. Create the urgency your brain needs."
          icon="⏰"
        />
        <Audio src={staticFile(`${AUDIO_BASE}/solution1.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.solution2.start)} durationInFrames={toFrames(SCENES.solution2.duration)}>
        <SolutionScene
          number={2}
          title="Use Timeboxing"
          description="Give yourself exactly 90 minutes. When time's up, stop. The constraint forces focus."
          icon="📦"
        />
        <Audio src={staticFile(`${AUDIO_BASE}/solution2.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.solution3.start)} durationInFrames={toFrames(SCENES.solution3.duration)}>
        <SolutionScene
          number={3}
          title="Apply the 80/20 Rule"
          description="Focus on the 20% of work that produces 80% of results. Cut the rest."
          icon="📊"
        />
        <Audio src={staticFile(`${AUDIO_BASE}/solution3.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.conclusion.start)} durationInFrames={toFrames(SCENES.conclusion.duration)}>
        <ConclusionScene />
        <Audio src={staticFile(`${AUDIO_BASE}/conclusion.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.takeaway.start)} durationInFrames={toFrames(SCENES.takeaway.duration)}>
        <TakeawayScene />
        <Audio src={staticFile(`${AUDIO_BASE}/takeaway.mp3`)} />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Export composition config for Root.tsx
export const parkinsonsLawComposition = {
  id: "ParkinsonsLaw",
  component: ParkinsonsLaw,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: ParkinsonsLawSchema,
  defaultProps: {},
};
