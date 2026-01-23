/**
 * AudioDemo Composition
 *
 * Demonstrates the Phase 14 audio enhancement system including:
 * - BackgroundMusic with fade in/out
 * - SoundEffect timing
 * - AudioLayer multi-track management
 * - Volume ducking for narration
 *
 * Note: This demo uses placeholder/silent audio for demonstration.
 * Replace with actual audio files for production use.
 */

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

import {
  duckVolume,
  fadeInOut,
  MUSIC_PRESETS,
  framesToTimecode,
  calculateBeatFrames,
} from "../shared/audio";

import { AnimatedGradient, ParticleField } from "../shared/components/backgrounds";
import { TypewriterText, RevealText } from "../shared/templates/animations";
import { COLORS, FONT_FAMILY } from "../shared/components/constants";

// Schema for the demo composition
export const audioDemoSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

type AudioDemoProps = z.infer<typeof audioDemoSchema>;

// Duration constants (in frames at 30fps)
const SCENE_DURATION = 180; // 6 seconds per scene
const TOTAL_SCENES = 5;
export const AUDIO_DEMO_DURATION = SCENE_DURATION * TOTAL_SCENES; // 30 seconds total

// Common text styles
const titleStyle: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 700,
  fontFamily: FONT_FAMILY.title,
  color: COLORS.white,
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 32,
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

const codeStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: 20,
  color: COLORS.accent,
  background: "rgba(0, 0, 0, 0.3)",
  padding: "4px 12px",
  borderRadius: 8,
};

/**
 * Scene 1: Introduction to Audio System
 */
const IntroScene: React.FC = () => {
  return (
    <AnimatedGradient
      colors={[COLORS.dark, COLORS.darkAlt, "#1a1a3e"]}
      animationMode="cycle"
      cycleDuration={120}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 60,
        }}
      >
        <RevealText
          text="Phase 14: Audio Enhancement"
          revealMode="word"
          direction="bottom"
          staggerDelay={5}
          delay={15}
          style={titleStyle}
        />
        <TypewriterText
          text="Background Music • Sound Effects • Volume Automation • Multi-track"
          speed={0.5}
          cursor={false}
          delay={60}
          style={{ ...subtitleStyle, marginTop: 40 }}
        />
        <div style={labelStyle}>
          Audio system for professional video production
        </div>
      </AbsoluteFill>
    </AnimatedGradient>
  );
};

/**
 * Scene 2: Background Music Demo with Volume Meter
 */
const BackgroundMusicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simulate volume with fadeInOut
  const volume = fadeInOut(frame, SCENE_DURATION, 45, 45, MUSIC_PRESETS.ambient.volume);

  // Calculate visual meter height
  const meterHeight = volume * 200;

  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <ParticleField
        particleCount={15}
        particleType="blur"
        colors={["rgba(102, 126, 234, 0.4)", "rgba(118, 75, 162, 0.3)"]}
        sizeRange={[6, 16]}
        direction="up"
        opacity={0.6}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
          }}
        >
          <div style={titleStyle}>BackgroundMusic</div>
          <div style={subtitleStyle}>Automatic fade in/out</div>

          {/* Volume Meter Visualization */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 200,
              marginTop: 20,
            }}
          >
            {[0.6, 0.8, 1, 0.9, 0.7, 0.85, 0.95, 0.75, 0.65].map((mult, i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: meterHeight * mult,
                  background: `linear-gradient(to top, ${COLORS.primary}, ${COLORS.accent})`,
                  borderRadius: 4,
                  transition: "height 0.1s ease-out",
                }}
              />
            ))}
          </div>

          {/* Current state */}
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span style={codeStyle}>
              Volume: {(volume * 100).toFixed(0)}%
            </span>
            <span style={codeStyle}>
              Frame: {frame} / {SCENE_DURATION}
            </span>
            <span style={codeStyle}>
              Time: {framesToTimecode(frame, fps)}
            </span>
          </div>

          <div style={labelStyle}>
            BackgroundMusic • fadeIn: 45 frames • fadeOut: 45 frames
          </div>
        </AbsoluteFill>
      </ParticleField>
    </AbsoluteFill>
  );
};

/**
 * Scene 3: Volume Ducking Demo
 */
const DuckingScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Define narration ranges within this scene
  const narrationRanges: [number, number][] = [
    [30, 75], // First narration segment
    [110, 150], // Second narration segment
  ];

  // Calculate ducked volume
  const bgVolume = duckVolume(frame, narrationRanges, 0.3, "standard");

  // Check if currently in narration
  const inNarration = narrationRanges.some(
    ([start, end]) => frame >= start && frame <= end
  );

  return (
    <AbsoluteFill style={{ background: COLORS.darkAlt }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={titleStyle}>Volume Ducking</div>
        <div style={subtitleStyle}>
          Auto-lower music during narration
        </div>

        {/* Visual representation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginTop: 30,
          }}
        >
          {/* Music track */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 100,
                height: 150,
                background: `linear-gradient(to top, ${COLORS.primary} ${bgVolume * 100}%, rgba(0,0,0,0.3) ${bgVolume * 100}%)`,
                borderRadius: 12,
                border: `2px solid ${COLORS.primary}`,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <span style={{ color: COLORS.white, fontSize: 14 }}>
                {(bgVolume * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ color: COLORS.white, marginTop: 10, fontSize: 18 }}>
              🎵 Music
            </div>
          </div>

          {/* Narration indicator */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 100,
                height: 150,
                background: inNarration
                  ? `linear-gradient(to top, ${COLORS.accent}, ${COLORS.accent}88)`
                  : "rgba(0,0,0,0.3)",
                borderRadius: 12,
                border: `2px solid ${inNarration ? COLORS.accent : "rgba(255,255,255,0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: inNarration ? COLORS.white : "rgba(255,255,255,0.4)",
                  fontSize: 32,
                }}
              >
                {inNarration ? "🎤" : "⏸️"}
              </span>
            </div>
            <div style={{ color: COLORS.white, marginTop: 10, fontSize: 18 }}>
              🎙️ Voice
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            width: "80%",
            marginTop: 40,
            position: "relative",
          }}
        >
          <div
            style={{
              height: 8,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            {/* Progress */}
            <div
              style={{
                width: `${(frame / SCENE_DURATION) * 100}%`,
                height: "100%",
                background: COLORS.primary,
              }}
            />
          </div>

          {/* Narration markers */}
          {narrationRanges.map(([start, end], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(start / SCENE_DURATION) * 100}%`,
                width: `${((end - start) / SCENE_DURATION) * 100}%`,
                height: 8,
                background: `${COLORS.accent}66`,
                top: 0,
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        <div style={labelStyle}>
          duckVolume() • duckedVolume: 10% • transition: 15 frames
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Scene 4: Sound Effects Timing Demo
 */
const SoundEffectsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Define SFX trigger points
  const sfxTriggers = [
    { name: "Whoosh", frame: 30, icon: "💨" },
    { name: "Pop", frame: 60, icon: "🎈" },
    { name: "Click", frame: 90, icon: "🖱️" },
    { name: "Chime", frame: 120, icon: "🔔" },
    { name: "Swoosh", frame: 150, icon: "✨" },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={titleStyle}>SoundEffect</div>
        <div style={subtitleStyle}>Precise frame-based timing</div>

        {/* SFX Timeline */}
        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 40,
          }}
        >
          {sfxTriggers.map((sfx, i) => {
            const isActive = frame >= sfx.frame && frame < sfx.frame + 15;
            const isPast = frame >= sfx.frame + 15;

            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  opacity: isPast ? 0.4 : 1,
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.1s ease-out",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: isActive
                      ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
                      : isPast
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    boxShadow: isActive
                      ? `0 0 30px ${COLORS.primary}88`
                      : "none",
                  }}
                >
                  {sfx.icon}
                </div>
                <div
                  style={{
                    color: COLORS.white,
                    marginTop: 10,
                    fontSize: 16,
                  }}
                >
                  {sfx.name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                  }}
                >
                  @{sfx.frame}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "70%",
            marginTop: 40,
            height: 8,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(frame / SCENE_DURATION) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
            }}
          />
        </div>

        <div style={labelStyle}>
          SoundEffect • startFrame prop for precise timing
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Scene 5: Beat Sync Demo
 */
const BeatSyncScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate beat frames (120 BPM)
  const bpm = 120;
  const beats = calculateBeatFrames(bpm, fps, 0, 16);

  // Find current beat
  const currentBeatIndex = beats.findIndex(
    (beat, i) => frame >= beat && (i === beats.length - 1 || frame < beats[i + 1])
  );

  // Check if on a beat (within 2 frames)
  const onBeat = beats.some((beat) => Math.abs(frame - beat) <= 2);

  return (
    <AnimatedGradient
      colors={[COLORS.dark, "#2d1f4e", COLORS.darkAlt]}
      animationMode="pulse"
      cycleDuration={beats[1] || 30}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={titleStyle}>Beat Synchronization</div>
        <div style={subtitleStyle}>
          calculateBeatFrames() for music sync
        </div>

        {/* Beat visualization */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 30,
          }}
        >
          {beats.slice(0, 8).map((beat, i) => {
            const isCurrent = i === currentBeatIndex;
            const isPast = frame > beat;

            return (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: isCurrent
                    ? COLORS.accent
                    : isPast
                      ? COLORS.primary
                      : "rgba(255,255,255,0.2)",
                  transform: isCurrent ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.05s ease-out",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* BPM and beat info */}
        <div style={{ display: "flex", gap: 30, marginTop: 30 }}>
          <span style={codeStyle}>BPM: {bpm}</span>
          <span style={codeStyle}>
            Beat: {currentBeatIndex >= 0 ? currentBeatIndex + 1 : "-"}
          </span>
          <span
            style={{
              ...codeStyle,
              background: onBeat ? COLORS.accent : "rgba(0,0,0,0.3)",
              color: onBeat ? COLORS.white : COLORS.accent,
            }}
          >
            {onBeat ? "ON BEAT ●" : "○"}
          </span>
        </div>

        <div style={labelStyle}>
          {bpm} BPM • {Math.round((60 / bpm) * fps)} frames per beat
        </div>
      </AbsoluteFill>
    </AnimatedGradient>
  );
};

/**
 * Main Demo Composition
 *
 * Note: Audio components are commented out as they require actual audio files.
 * Uncomment and provide real audio sources for production use.
 */
export const AudioDemo: React.FC<AudioDemoProps> = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      {/*
        Uncomment to add background music:
        <BackgroundMusic
          src={staticFile("audio/music/ambient.mp3")}
          volume={0.2}
          fadeInDuration={60}
          fadeOutDuration={90}
          loop={true}
        />
      */}

      {/* Scene 1: Introduction */}
      <Sequence durationInFrames={SCENE_DURATION}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Background Music */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <BackgroundMusicScene />
      </Sequence>

      {/* Scene 3: Volume Ducking */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <DuckingScene />
      </Sequence>

      {/* Scene 4: Sound Effects */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SoundEffectsScene />
        {/*
          Uncomment to add sound effects:
          <SoundEffect src={staticFile("audio/sfx/whoosh.mp3")} startFrame={30} volume={0.5} />
          <SoundEffect src={staticFile("audio/sfx/pop.mp3")} startFrame={60} volume={0.4} />
        */}
      </Sequence>

      {/* Scene 5: Beat Sync */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <BeatSyncScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default AudioDemo;
