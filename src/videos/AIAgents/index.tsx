import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
} from "remotion";
import { z } from "zod";
import {
  SCENES,
  THEME,
  FPS,
  TOTAL_DURATION,
  AUDIO_BASE,
  AI_ASSETS_BASE,
  toFrames,
} from "./constants";
import { AnimatedText } from "../../shared/templates/animations/AnimatedText";
import { fadeInUp } from "../../shared/templates/animations/presets";
import { FONT_FAMILY } from "../../shared/components/constants";
import { AnimatedGradient } from "../../shared/components/backgrounds";
import { Vignette, FilmGrain } from "../../shared/components/effects";
import { OfficialLightLeak } from "../../shared/components/effects/OfficialLightLeak";

// Schema
export const AIAgentsSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

const NetworkParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 30, color = "rgba(0, 212, 255, 0.08)" }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7) % 100;
    const baseY = (seed * 11) % 100;
    const size = 3 + (seed % 6);
    const speed = 0.1 + (seed % 10) / 50;
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
          boxShadow: `0 0 ${size * 3}px ${color}`,
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
        background: "rgba(255, 255, 255, 0.06)",
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

/** AI-generated background with dark overlay for text readability */
const TechBackground: React.FC<{
  sceneId: string;
  overlayOpacity?: number;
}> = ({ sceneId, overlayOpacity = 0.6 }) => {
  const src = staticFile(`${AI_ASSETS_BASE}/${sceneId}-bg.jpg`);

  return (
    <AbsoluteFill>
      {/* Gradient fallback */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${THEME.backgroundAlt} 0%, ${THEME.background} 70%)`,
        }}
      />
      {/* AI image */}
      <AbsoluteFill>
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={undefined}
        />
      </AbsoluteFill>
      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,15,26,${overlayOpacity}) 0%, rgba(10,15,26,${overlayOpacity + 0.15}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOOK
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.hook.duration);

  const panels = [
    { text: "What if your next coworker\nwasn't human?", start: 0, end: toFrames(5) },
    { text: "Not a chatbot.\nNot an assistant.", start: toFrames(5), end: toFrames(10) },
    { text: "An autonomous digital colleague\nthat plans, decides, and acts.", start: toFrames(10), end: toFrames(18) },
    { text: "In 2026, AI agents are\nalready transforming how we work.", start: toFrames(18), end: duration },
  ];

  const activePanel = panels.find((p) => frame >= p.start && frame < p.end);
  if (!activePanel) return null;

  const localFrame = frame - activePanel.start;
  const panelDuration = activePanel.end - activePanel.start;

  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 15;
  const fadeOut =
    localFrame > fadeOutStart
      ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = fadeIn * fadeOut;
  const isLast = activePanel === panels[panels.length - 1];

  return (
    <AbsoluteFill>
      <TechBackground sceneId="hook" />
      <NetworkParticles color="rgba(0, 212, 255, 0.06)" />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            fontSize: isLast ? 72 : 80,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 1400,
            padding: 80,
            opacity,
            transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
            textShadow: `0 4px 30px rgba(0,0,0,0.6), 0 0 80px ${THEME.primary}30`,
            whiteSpace: "pre-line",
          }}
        >
          {activePanel.text}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.5} />
      <FilmGrain intensity={0.02} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: WHAT ARE AI AGENTS
// ============================================

const WhatAreScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Calculator vs Employee (0-12s)
  const calcProgress = spring({ frame, fps, config: { damping: 18 } });
  const empProgress = spring({
    frame: frame - toFrames(3),
    fps,
    config: { damping: 18 },
  });

  // Phase 2: PRA Loop (13-22s)
  const praReveal = spring({
    frame: frame - toFrames(13),
    fps,
    config: { damping: 15 },
  });

  // Phase 3: Capabilities list (23-end)
  const capReveal = spring({
    frame: frame - toFrames(23),
    fps,
    config: { damping: 15 },
  });

  const showComparison = frame < toFrames(13);
  const showPRA = frame >= toFrames(12) && frame < toFrames(23);
  const showCaps = frame >= toFrames(22);

  return (
    <AbsoluteFill>
      <TechBackground sceneId="what_are" />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="What Is an AI Agent?"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 60,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Calculator vs Employee comparison */}
        {showComparison && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 80,
              flex: 1,
              alignItems: "center",
            }}
          >
            {/* Calculator */}
            <div
              style={{
                width: 550,
                padding: 50,
                borderRadius: 24,
                background: "rgba(255, 255, 255, 0.04)",
                border: `2px solid rgba(255,255,255,0.1)`,
                textAlign: "center",
                opacity: calcProgress,
                transform: `translateX(${interpolate(calcProgress, [0, 1], [-40, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 80, marginBottom: 20 }}>🧮</div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.title,
                  marginBottom: 16,
                }}
              >
                Traditional AI
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  lineHeight: 1.5,
                }}
              >
                Input → Output
                <br />
                Waits for commands
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                fontSize: 60,
                color: THEME.primary,
                opacity: empProgress,
              }}
            >
              →
            </div>

            {/* Employee */}
            <div
              style={{
                width: 550,
                padding: 50,
                borderRadius: 24,
                background: `${THEME.primary}10`,
                border: `2px solid ${THEME.primary}40`,
                textAlign: "center",
                opacity: empProgress,
                transform: `translateX(${interpolate(empProgress, [0, 1], [40, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 80, marginBottom: 20 }}>🤖</div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: THEME.primary,
                  fontFamily: FONT_FAMILY.title,
                  marginBottom: 16,
                }}
              >
                AI Agent
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.body,
                  lineHeight: 1.5,
                }}
              >
                Perceive → Reason → Act
                <br />
                Works autonomously
              </div>
            </div>
          </div>
        )}

        {/* PRA Loop */}
        {showPRA && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${praReveal})`,
              textAlign: "center",
              opacity: frame > toFrames(21)
                ? interpolate(frame, [toFrames(21), toFrames(23)], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : praReveal,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                justifyContent: "center",
              }}
            >
              {["Perceive", "Reason", "Act", "Learn"].map((step, i) => {
                const stepProgress = spring({
                  frame: frame - toFrames(13) - i * 12,
                  fps,
                  config: { damping: 15 },
                });
                const colors = [THEME.primary, THEME.secondary, THEME.accent, THEME.tertiary];
                return (
                  <React.Fragment key={step}>
                    {i > 0 && (
                      <div
                        style={{
                          fontSize: 40,
                          color: THEME.textMuted,
                          opacity: stepProgress,
                        }}
                      >
                        →
                      </div>
                    )}
                    <div
                      style={{
                        background: `${colors[i]}20`,
                        border: `2px solid ${colors[i]}60`,
                        borderRadius: 20,
                        padding: "24px 36px",
                        opacity: stepProgress,
                        transform: `translateY(${interpolate(stepProgress, [0, 1], [20, 0])}px)`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 38,
                          fontWeight: 700,
                          color: colors[i],
                          fontFamily: FONT_FAMILY.title,
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <div
              style={{
                fontSize: 32,
                color: THEME.textMuted,
                fontFamily: FONT_FAMILY.body,
                marginTop: 40,
              }}
            >
              The Perception-Reasoning-Action Loop
            </div>
          </div>
        )}

        {/* Capabilities */}
        {showCaps && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              opacity: capReveal,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 24,
                maxWidth: 1200,
              }}
            >
              {["Browse the web", "Write code", "Manage databases", "Send emails", "Coordinate agents"].map(
                (cap, i) => {
                  const p = spring({
                    frame: frame - toFrames(23) - i * 8,
                    fps,
                    config: { damping: 15 },
                  });
                  return (
                    <div
                      key={cap}
                      style={{
                        background: `${THEME.primary}15`,
                        border: `1px solid ${THEME.primary}40`,
                        borderRadius: 50,
                        padding: "18px 40px",
                        fontSize: 34,
                        fontWeight: 600,
                        color: THEME.text,
                        fontFamily: FONT_FAMILY.body,
                        opacity: p,
                        transform: `scale(${p})`,
                      }}
                    >
                      {cap}
                    </div>
                  );
                }
              )}
            </div>
            <div
              style={{
                fontSize: 36,
                color: THEME.accent,
                fontFamily: FONT_FAMILY.title,
                fontWeight: 700,
                marginTop: 50,
                opacity: spring({
                  frame: frame - toFrames(28),
                  fps,
                  config: { damping: 18 },
                }),
              }}
            >
              All autonomously.
            </div>
          </div>
        )}
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOW THEY WORK
// ============================================

const HowWorkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const components = [
    {
      icon: "👁️",
      name: "Perception",
      desc: "Eyes & ears — processes APIs,\ndocuments, and user inputs",
      color: THEME.primary,
      startFrame: toFrames(2),
    },
    {
      icon: "🧠",
      name: "Reasoning",
      desc: "The brain — LLMs analyze\ncontext and plan actions",
      color: THEME.secondary,
      startFrame: toFrames(10),
    },
    {
      icon: "💾",
      name: "Memory",
      desc: "Short-term for tasks,\nlong-term for learning",
      color: THEME.accent,
      startFrame: toFrames(18),
    },
    {
      icon: "🔧",
      name: "Tools",
      desc: "Interact with the real world —\nbrowse, query, execute",
      color: THEME.tertiary,
      startFrame: toFrames(26),
    },
  ];

  // Final message
  const finalReveal = spring({
    frame: frame - toFrames(34),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <AbsoluteFill>
      <TechBackground sceneId="how_work" />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="How AI Agents Work"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 60,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* 2x2 Grid of Components */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 40,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {components.map((comp, i) => {
            const progress = spring({
              frame: frame - comp.startFrame,
              fps,
              config: { damping: 15 },
            });

            const isActive =
              frame >= comp.startFrame &&
              (i === components.length - 1 ||
                frame < components[i + 1].startFrame);

            return (
              <div
                key={comp.name}
                style={{
                  width: 620,
                  background: isActive
                    ? `${comp.color}12`
                    : "rgba(255, 255, 255, 0.03)",
                  border: `2px solid ${isActive ? comp.color : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 24,
                  padding: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
                }}
              >
                <span style={{ fontSize: 70, flexShrink: 0 }}>
                  {comp.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 700,
                      color: comp.color,
                      fontFamily: FONT_FAMILY.title,
                      marginBottom: 8,
                    }}
                  >
                    {comp.name}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      color: THEME.text,
                      fontFamily: FONT_FAMILY.body,
                      lineHeight: 1.4,
                      whiteSpace: "pre-line",
                      opacity: 0.85,
                    }}
                  >
                    {comp.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final message */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 80,
            right: 80,
            textAlign: "center",
            opacity: finalReveal,
            transform: `scale(${interpolate(finalReveal, [0, 1], [0.95, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: THEME.primary,
              fontFamily: FONT_FAMILY.title,
              textShadow: `0 0 40px ${THEME.primary}40`,
            }}
          >
            Perception + Reasoning + Memory + Tools = Autonomy
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: REAL WORLD EXAMPLES
// ============================================

const ExamplesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    {
      company: "AMD + Kore.ai",
      stat: "80%",
      label: "faster HR resolution",
      detail: "70% employee satisfaction in 90 days",
      color: THEME.primary,
      startFrame: toFrames(3),
    },
    {
      company: "John Deere",
      stat: "70%",
      label: "chemical savings",
      detail: "See & Spray distinguishes crops from weeds",
      color: THEME.accent,
      startFrame: toFrames(13),
    },
    {
      company: "Banking (KYC/AML)",
      stat: "200–2,000%",
      label: "productivity gains",
      detail: "Compliance workflows automated",
      color: THEME.secondary,
      startFrame: toFrames(23),
    },
    {
      company: "Healthcare",
      stat: "Real-time",
      label: "patient management",
      detail: "Records, scheduling, bed prediction",
      color: THEME.tertiary,
      startFrame: toFrames(33),
    },
  ];

  // 72% stat
  const bigStatReveal = spring({
    frame: frame - toFrames(42),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <AbsoluteFill>
      <TechBackground sceneId="examples" />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="Real-World Impact"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 50,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Stats Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 30,
            maxWidth: 1500,
            margin: "0 auto",
          }}
        >
          {stats.map((item) => {
            const progress = spring({
              frame: frame - item.startFrame,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={item.company}
                style={{
                  width: 680,
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: 20,
                  padding: "30px 40px",
                  borderLeft: `4px solid ${item.color}`,
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    marginBottom: 8,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {item.company}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <div
                    style={{
                      fontSize: 64,
                      fontWeight: 800,
                      color: item.color,
                      fontFamily: FONT_FAMILY.title,
                    }}
                  >
                    {item.stat}
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      color: THEME.text,
                      fontFamily: FONT_FAMILY.body,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 26,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    marginTop: 8,
                  }}
                >
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* 72% Big Stat */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            right: 80,
            textAlign: "center",
            opacity: bigStatReveal,
            transform: `scale(${bigStatReveal})`,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              textShadow: `0 0 50px ${THEME.accent}40`,
            }}
          >
            72%
          </span>
          <span
            style={{
              fontSize: 36,
              color: THEME.text,
              fontFamily: FONT_FAMILY.body,
              marginLeft: 20,
            }}
          >
            of enterprises already using agentic AI
          </span>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: MULTI-AGENT FUTURE
// ============================================

const MultiAgentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.multiAgent.duration);

  // Phase 1: Agent team concept (0-12s)
  const agents = [
    { name: "Research", icon: "🔍", color: THEME.primary },
    { name: "Analysis", icon: "📊", color: THEME.secondary },
    { name: "Writing", icon: "✍️", color: THEME.accent },
    { name: "Orchestrator", icon: "🎯", color: THEME.tertiary },
  ];

  // Phase 2: Big stats (13-end)
  const stat1Reveal = spring({
    frame: frame - toFrames(13),
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const stat2Reveal = spring({
    frame: frame - toFrames(20),
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const stat3Reveal = spring({
    frame: frame - toFrames(28),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const showTeam = frame < toFrames(15);
  const showStats = frame >= toFrames(12);

  return (
    <AbsoluteFill>
      <TechBackground sceneId="multi_agent" />
      <NetworkParticles color="rgba(123, 97, 255, 0.06)" count={40} />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="The Multi-Agent Future"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 60,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Agent team */}
        {showTeam && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 50,
              flex: 1,
              alignItems: "center",
              opacity: frame > toFrames(13)
                ? interpolate(frame, [toFrames(13), toFrames(15)], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1,
            }}
          >
            {agents.map((agent, i) => {
              const p = spring({
                frame: frame - toFrames(1) - i * 10,
                fps,
                config: { damping: 15 },
              });

              return (
                <div
                  key={agent.name}
                  style={{
                    width: 300,
                    textAlign: "center",
                    opacity: p,
                    transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: `${agent.color}20`,
                      border: `3px solid ${agent.color}60`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto 20px",
                      fontSize: 50,
                    }}
                  >
                    {agent.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: agent.color,
                      fontFamily: FONT_FAMILY.title,
                    }}
                  >
                    {agent.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Big stats */}
        {showStats && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 50,
              justifyContent: "center",
              flex: 1,
              maxWidth: 1400,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                opacity: stat1Reveal,
                transform: `scale(${stat1Reveal})`,
              }}
            >
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 800,
                  color: THEME.primary,
                  fontFamily: FONT_FAMILY.title,
                  textShadow: `0 0 80px ${THEME.primary}40`,
                }}
              >
                1,445%
              </div>
              <div
                style={{
                  fontSize: 36,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                surge in multi-agent system inquiries since 2024
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 100,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  opacity: stat2Reveal,
                  transform: `translateY(${interpolate(stat2Reveal, [0, 1], [20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 90,
                    fontWeight: 800,
                    color: THEME.accent,
                    fontFamily: FONT_FAMILY.title,
                  }}
                >
                  40%
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    maxWidth: 400,
                  }}
                >
                  of enterprise apps will embed
                  <br />
                  AI agents by end of 2026
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  opacity: stat3Reveal,
                  transform: `translateY(${interpolate(stat3Reveal, [0, 1], [20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 90,
                    fontWeight: 800,
                    color: THEME.secondary,
                    fontFamily: FONT_FAMILY.title,
                  }}
                >
                  $11B
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    maxWidth: 400,
                  }}
                >
                  AI agents market
                  <br />
                  projected for 2026
                </div>
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      <Sequence from={toFrames(15)} durationInFrames={duration - toFrames(15)}>
        <OfficialLightLeak
          seed={3}
          hueShift={200}
          durationInFrames={duration - toFrames(15)}
          opacity={0.12}
        />
      </Sequence>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: RISKS & CHALLENGES
// ============================================

const RisksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const warnings = [
    {
      icon: "⚠️",
      text: "40%+ Projects May Fail",
      desc: "Legacy systems can't support modern AI demands",
    },
    {
      icon: "🔒",
      text: "Security Concerns",
      desc: "Autonomous agents need human-level identity management",
    },
    {
      icon: "🤝",
      text: "Trust & Governance",
      desc: "Explainability and oversight aren't optional — they're essential",
    },
  ];

  return (
    <AbsoluteFill>
      <TechBackground sceneId="risks" overlayOpacity={0.7} />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="Challenges Ahead"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.warning,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 70,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {warnings.map((item, i) => {
            const progress = spring({
              frame: frame - 20 - i * 18,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 36,
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
                  background: "rgba(255, 184, 0, 0.05)",
                  borderRadius: 20,
                  padding: "36px 50px",
                  border: "2px solid rgba(255, 184, 0, 0.15)",
                }}
              >
                <span style={{ fontSize: 70, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 700,
                      color: THEME.warning,
                      fontFamily: FONT_FAMILY.title,
                      marginBottom: 8,
                    }}
                  >
                    {item.text}
                  </div>
                  <div
                    style={{
                      fontSize: 34,
                      color: THEME.text,
                      fontFamily: FONT_FAMILY.body,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: OUTRO
// ============================================

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.outro.duration);

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const ctaProgress = spring({
    frame: frame - toFrames(5),
    fps,
    config: { damping: 15 },
  });

  const finalProgress = spring({
    frame: frame - toFrames(10),
    fps,
    config: { damping: 18 },
  });

  return (
    <AbsoluteFill>
      <TechBackground sceneId="outro" overlayOpacity={0.5} />
      <NetworkParticles color="rgba(0, 255, 136, 0.06)" count={35} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 1300,
            transform: `scale(${titleScale})`,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.5,
              marginBottom: 50,
              textShadow: `0 4px 30px rgba(0,0,0,0.5), 0 0 80px ${THEME.primary}20`,
            }}
          >
            The question isn't whether
            <br />
            AI agents are coming.
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: THEME.primary,
              fontFamily: FONT_FAMILY.title,
              opacity: ctaProgress,
              transform: `translateY(${interpolate(ctaProgress, [0, 1], [20, 0])}px)`,
              textShadow: `0 0 60px ${THEME.primary}50`,
              marginBottom: 50,
            }}
          >
            They're already here.
          </div>

          <div
            style={{
              fontSize: 42,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              fontWeight: 600,
              opacity: finalProgress,
              textShadow: `0 0 40px ${THEME.accent}40`,
            }}
          >
            Human with AI.
          </div>
        </div>
      </AbsoluteFill>

      <OfficialLightLeak
        seed={9}
        hueShift={160}
        durationInFrames={duration}
        opacity={0.18}
      />

      <Vignette intensity={0.35} color="rgba(0,0,0,0.4)" />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const AIAgents: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* Background gradient */}
      <AnimatedGradient
        colors={[THEME.background, THEME.backgroundAlt]}
        animationMode="pulse"
      />

      {/* Scenes */}
      <Sequence
        from={toFrames(SCENES.hook.start)}
        durationInFrames={toFrames(SCENES.hook.duration)}
      >
        <HookScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.whatAre.start)}
        durationInFrames={toFrames(SCENES.whatAre.duration)}
      >
        <WhatAreScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/what_are.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.howWork.start)}
        durationInFrames={toFrames(SCENES.howWork.duration)}
      >
        <HowWorkScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/how_work.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.examples.start)}
        durationInFrames={toFrames(SCENES.examples.duration)}
      >
        <ExamplesScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/examples.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.multiAgent.start)}
        durationInFrames={toFrames(SCENES.multiAgent.duration)}
      >
        <MultiAgentScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/multi_agent.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.risks.start)}
        durationInFrames={toFrames(SCENES.risks.duration)}
      >
        <RisksScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/risks.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.outro.start)}
        durationInFrames={toFrames(SCENES.outro.duration)}
      >
        <OutroScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/outro.mp3`)} />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Export for registry
export const aiAgentsComposition = {
  id: "AIAgents",
  component: AIAgents,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: AIAgentsSchema,
  defaultProps: {},
};
