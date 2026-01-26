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
import { SCENES, COLORS, FPS, TOTAL_DURATION } from "./constants";
import { AnimatedText } from "../../shared/templates/animations/AnimatedText";
import { fadeInUp, scaleIn } from "../../shared/templates/animations/presets";
import { FONT_FAMILY } from "../../shared/components/constants";
import { AnimatedGradient } from "../../shared/components/backgrounds";
import { Vignette } from "../../shared/components/effects";

// Schema
export const ProcessAndInterbeingSchema = z.object({});

const AUDIO_BASE = "videos/ProcessAndInterbeing/audio";

const toFrames = (seconds: number) => Math.round(seconds * FPS);

// ============================================
// SHARED COMPONENTS
// ============================================

const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 30, color = "rgba(102, 126, 234, 0.12)" }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 7) % 100;
    const baseY = (seed * 11) % 100;
    const size = 20 + (seed % 50);
    const speed = 0.15 + (seed % 10) / 40;
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
          filter: "blur(4px)",
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
          background: `linear-gradient(90deg, ${COLORS.eastern}, ${COLORS.western})`,
        }}
      />
    </div>
  );
};

// Interconnected nodes visualization
const InterconnectedNodes: React.FC<{
  nodeCount?: number;
  connectionColor?: string;
}> = ({ nodeCount = 12, connectionColor = "rgba(102, 126, 234, 0.3)" }) => {
  const frame = useCurrentFrame();

  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2 + frame * 0.005;
    const radius = 250 + Math.sin(i * 1.5 + frame * 0.02) * 50;
    const x = 960 + Math.cos(angle) * radius;
    const y = 540 + Math.sin(angle) * radius;
    const size = 8 + Math.sin(i * 2 + frame * 0.03) * 4;

    return { x, y, size };
  });

  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        {/* Draw connections */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((other, j) => {
            const distance = Math.sqrt(
              Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
            );
            if (distance < 400) {
              const opacity = 1 - distance / 400;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={other.x}
                  y2={other.y}
                  stroke={connectionColor}
                  strokeWidth={1}
                  opacity={opacity * 0.5}
                />
              );
            }
            return null;
          })
        )}
        {/* Draw nodes */}
        {nodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={i % 2 === 0 ? COLORS.eastern : COLORS.western}
            opacity={0.6}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Flowing wave pattern
const FlowingWaves: React.FC<{ color?: string }> = ({ color = COLORS.primary }) => {
  const frame = useCurrentFrame();

  const paths = Array.from({ length: 5 }, (_, i) => {
    const offset = i * 40;
    const amplitude = 30 + i * 10;
    const frequency = 0.005 + i * 0.001;
    const speed = 0.02 + i * 0.005;

    let d = `M 0 ${540 + offset}`;
    for (let x = 0; x <= 1920; x += 20) {
      const y = 540 + offset + Math.sin(x * frequency + frame * speed) * amplitude;
      d += ` L ${x} ${y}`;
    }

    return (
      <path
        key={i}
        d={d}
        stroke={color}
        strokeWidth={2}
        fill="none"
        opacity={0.2 - i * 0.03}
      />
    );
  });

  return (
    <AbsoluteFill>
      <svg width="1920" height="1080">{paths}</svg>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOOK
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftScale = spring({ frame, fps, config: { damping: 15 } });
  const rightScale = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  const mergeProgress = interpolate(frame, [180, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.backgroundAlt} 0%, ${COLORS.background} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles count={25} />

      {/* Split imagery - West and East */}
      <div style={{
        display: "flex",
        gap: interpolate(mergeProgress, [0, 1], [200, 0]),
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Western philosophy symbol */}
        <div style={{
          transform: `scale(${leftScale}) translateX(${mergeProgress * 100}px)`,
          fontSize: 120,
          opacity: 1 - mergeProgress * 0.5,
        }}>
          🎓
        </div>

        {/* Merged symbol */}
        <div style={{
          position: "absolute",
          fontSize: 150,
          opacity: mergeProgress,
          transform: `scale(${0.5 + mergeProgress * 0.5})`,
        }}>
          ☯️
        </div>

        {/* Eastern wisdom symbol */}
        <div style={{
          transform: `scale(${rightScale}) translateX(${-mergeProgress * 100}px)`,
          fontSize: 120,
          opacity: 1 - mergeProgress * 0.5,
        }}>
          🪷
        </div>
      </div>

      {/* Hook text */}
      <div style={{
        position: "absolute",
        bottom: 200,
        textAlign: "center",
        opacity: textOpacity,
        padding: "0 100px",
      }}>
        <AnimatedText
          text="What if they arrived at the same radical insight?"
          animation={fadeInUp()}
          style={{
            fontSize: 48,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            color: COLORS.text,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: PROBLEM
// ============================================

const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const objectOpacity = interpolate(frame, [0, 30], [0, 1]);
  const revealProgress = interpolate(frame, [180, 400], [0, 1], { extrapolateRight: "clamp" });

  const objects = ["🪑", "🏠", "👤", "🌳"];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <InterconnectedNodes nodeCount={15} />

      {/* Objects that seem solid */}
      <div style={{
        display: "flex",
        gap: 80,
        marginBottom: 100,
        opacity: objectOpacity,
      }}>
        {objects.map((obj, i) => (
          <div key={i} style={{
            fontSize: 80,
            opacity: 1 - revealProgress * 0.7,
            filter: `blur(${revealProgress * 3}px)`,
            transform: `scale(${1 - revealProgress * 0.3})`,
          }}>
            {obj}
          </div>
        ))}
      </div>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 120,
        textAlign: "center",
      }}>
        <AnimatedText
          text="The Illusion We Live In"
          animation={fadeInUp()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Revelation text */}
      <div style={{
        position: "absolute",
        bottom: 150,
        textAlign: "center",
        opacity: interpolate(frame, [200, 250], [0, 1]),
        padding: "0 150px",
      }}>
        <AnimatedText
          text="Two wisdom traditions say: this is our deepest illusion"
          animation={fadeInUp()}
          style={{
            fontSize: 40,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 500,
            color: COLORS.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: PROMISE
// ============================================

const PromiseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pathProgress = spring({ frame, fps, config: { damping: 20, mass: 2 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlowingWaves color={COLORS.primary} />

      {/* Journey path */}
      <svg width="800" height="200" style={{ marginBottom: 60 }}>
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.eastern} />
            <stop offset="100%" stopColor={COLORS.western} />
          </linearGradient>
        </defs>
        <path
          d="M 50 100 Q 200 50 400 100 Q 600 150 750 100"
          stroke="url(#pathGradient)"
          strokeWidth={4}
          fill="none"
          strokeDasharray={700}
          strokeDashoffset={700 * (1 - pathProgress)}
        />
        <circle cx={50} cy={100} r={15} fill={COLORS.eastern} opacity={pathProgress} />
        <circle cx={750} cy={100} r={15} fill={COLORS.western} opacity={pathProgress} />
        <text x={50} y={150} fill={COLORS.text} fontSize={20} textAnchor="middle">East</text>
        <text x={750} y={150} fill={COLORS.text} fontSize={20} textAnchor="middle">West</text>
      </svg>

      {/* Title */}
      <AnimatedText
        text="What You'll Discover"
        animation={scaleIn()}
        style={{
          fontSize: 56,
          fontFamily: FONT_FAMILY.title,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: 4,
          marginBottom: 40,
        }}
      />

      <AnimatedText
        text="How ancient wisdom and modern philosophy reached the same truth"
        animation={fadeInUp()}
        style={{
          fontSize: 36,
          fontFamily: FONT_FAMILY.body,
          color: COLORS.textMuted,
          textAlign: "center",
          maxWidth: 900,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: WHITEHEAD INTRO
// ============================================

const WhiteheadIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const portraitScale = spring({ frame, fps, config: { damping: 15 } });
  const textOpacity = interpolate(frame, [60, 100], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        padding: 100,
      }}
    >
      <FlowingWaves color={COLORS.western} />

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 80,
        height: "100%",
      }}>
        {/* Portrait area */}
        <div style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.western}40, ${COLORS.primary}40)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${portraitScale})`,
          border: `3px solid ${COLORS.western}`,
        }}>
          <div style={{ fontSize: 150 }}>🧠</div>
        </div>

        {/* Text content */}
        <div style={{
          flex: 1,
          opacity: textOpacity,
        }}>
          <div style={{
            fontSize: 28,
            color: COLORS.western,
            fontFamily: FONT_FAMILY.body,
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}>
            Western Philosophy
          </div>

          <AnimatedText
            text="Alfred North Whitehead"
            animation={fadeInUp()}
            style={{
              fontSize: 56,
              fontFamily: FONT_FAMILY.title,
              fontWeight: 800,
              color: COLORS.text,
              marginBottom: 30,
            }}
          />

          <AnimatedText
            text="Reality isn't made of things. It's made of events."
            animation={fadeInUp()}
            style={{
              fontSize: 36,
              fontFamily: FONT_FAMILY.body,
              color: COLORS.textMuted,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: ACTUAL OCCASIONS
// ============================================

const ActualOccasionsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Wave animation
  const waveAmplitude = 80;
  const waveFrequency = 0.01;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated wave */}
      <svg width="1920" height="600" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.western} stopOpacity={0.8} />
            <stop offset="50%" stopColor={COLORS.primary} stopOpacity={0.6} />
            <stop offset="100%" stopColor={COLORS.western} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        {Array.from({ length: 3 }, (_, waveIndex) => {
          const offset = waveIndex * 30;
          let d = `M 0 ${300 + offset}`;
          for (let x = 0; x <= 1920; x += 10) {
            const y = 300 + offset + Math.sin((x + frame * 3) * waveFrequency + waveIndex) * waveAmplitude;
            d += ` L ${x} ${y}`;
          }
          return (
            <path
              key={waveIndex}
              d={d}
              stroke="url(#waveGrad)"
              strokeWidth={3 - waveIndex}
              fill="none"
              opacity={0.6 - waveIndex * 0.15}
            />
          );
        })}

        {/* Floating moments/occasions */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = 150 + i * 220;
          const baseY = 300;
          const y = baseY + Math.sin((x + frame * 3) * waveFrequency) * waveAmplitude;
          const scale = 0.8 + Math.sin(frame * 0.05 + i) * 0.2;

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={20 * scale}
                fill={COLORS.accent}
                opacity={0.7}
              />
              <circle
                cx={x}
                cy={y}
                r={30 * scale}
                stroke={COLORS.accent}
                strokeWidth={2}
                fill="none"
                opacity={0.3}
              />
            </g>
          );
        })}
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
        textAlign: "center",
      }}>
        <AnimatedText
          text="Actual Occasions"
          animation={scaleIn()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Description */}
      <div style={{
        position: "absolute",
        bottom: 120,
        textAlign: "center",
        padding: "0 150px",
      }}>
        <AnimatedText
          text="Each moment grasps the past, transforms it, becomes something new"
          animation={fadeInUp()}
          style={{
            fontSize: 36,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.textMuted,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: DEPENDENT ORIGINATION
// ============================================

const DependentOriginationScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 12 links of dependent origination
  const links = [
    "무명", "행", "식", "명색", "육처", "촉",
    "수", "애", "취", "유", "생", "노사"
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles count={20} color={`${COLORS.eastern}20`} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 80,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 28,
          color: COLORS.eastern,
          fontFamily: FONT_FAMILY.body,
          marginBottom: 15,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}>
          Buddhist Teaching
        </div>
        <AnimatedText
          text="Dependent Origination"
          animation={scaleIn()}
          style={{
            fontSize: 56,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
        <div style={{
          fontSize: 32,
          color: COLORS.textMuted,
          fontFamily: FONT_FAMILY.body,
          marginTop: 10,
        }}>
          प्रतीत्यसमुत्पाद
        </div>
      </div>

      {/* Circular chain of 12 links */}
      <svg width="800" height="500" style={{ marginTop: 80 }}>
        {links.map((link, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const radius = 180;
          const x = 400 + Math.cos(angle) * radius;
          const y = 250 + Math.sin(angle) * radius;

          const nextAngle = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
          const nextX = 400 + Math.cos(nextAngle) * radius;
          const nextY = 250 + Math.sin(nextAngle) * radius;

          const linkOpacity = interpolate(
            frame,
            [i * 30, i * 30 + 40],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          return (
            <g key={i} opacity={linkOpacity}>
              {/* Connection line */}
              <line
                x1={x}
                y1={y}
                x2={nextX}
                y2={nextY}
                stroke={COLORS.eastern}
                strokeWidth={2}
                opacity={0.4}
              />
              {/* Node */}
              <circle
                cx={x}
                cy={y}
                r={25}
                fill={COLORS.eastern}
                opacity={0.8}
              />
              <text
                x={x}
                y={y + 5}
                fill={COLORS.text}
                fontSize={12}
                textAnchor="middle"
                fontFamily={FONT_FAMILY.body}
              >
                {link}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Quote */}
      <div style={{
        position: "absolute",
        bottom: 100,
        textAlign: "center",
        padding: "0 200px",
      }}>
        <AnimatedText
          text="When this exists, that comes to be. When this ceases, that ceases."
          animation={fadeInUp()}
          style={{
            fontSize: 32,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.accent,
            fontStyle: "italic",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: EMPTINESS
// ============================================

const EmptinessScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Expanding circles representing infinite interconnection */}
      <svg width="1920" height="1080">
        {Array.from({ length: 15 }, (_, i) => {
          const delay = i * 20;
          const circleProgress = interpolate(
            frame - delay,
            [0, 200],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const radius = circleProgress * 600;
          const opacity = 1 - circleProgress;

          return (
            <circle
              key={i}
              cx={960}
              cy={540}
              r={radius}
              fill="none"
              stroke={i % 2 === 0 ? COLORS.primary : COLORS.accent}
              strokeWidth={2}
              opacity={opacity * 0.5}
            />
          );
        })}

        {/* Center point */}
        <circle
          cx={960}
          cy={540}
          r={10}
          fill={COLORS.gold}
        />
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
        textAlign: "center",
      }}>
        <AnimatedText
          text="空 · Emptiness"
          animation={scaleIn()}
          style={{
            fontSize: 72,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Explanation */}
      <div style={{
        position: "absolute",
        bottom: 150,
        textAlign: "center",
        padding: "0 200px",
        opacity: interpolate(frame, [100, 150], [0, 1]),
      }}>
        <AnimatedText
          text="Not nothingness, but the absence of fixed essence"
          animation={fadeInUp()}
          style={{
            fontSize: 36,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.textMuted,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: JOURNEY
// ============================================

const JourneyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { label: "Ordinary Experience", icon: "👁️" },
    { label: "Notice Dependence", icon: "🔗" },
    { label: "See the Flowing", icon: "🌊" },
    { label: "New Vision", icon: "✨" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlowingWaves color={COLORS.accent} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
      }}>
        <AnimatedText
          text="The Journey of Understanding"
          animation={scaleIn()}
          style={{
            fontSize: 56,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Steps */}
      <div style={{
        display: "flex",
        gap: 60,
        alignItems: "center",
        marginTop: 50,
      }}>
        {steps.map((step, i) => {
          const stepProgress = spring({
            frame: frame - i * 60,
            fps,
            config: { damping: 15 },
          });

          return (
            <React.Fragment key={i}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                transform: `scale(${stepProgress}) translateY(${(1 - stepProgress) * 50}px)`,
                opacity: stepProgress,
              }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.primary}40, ${COLORS.accent}40)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 50,
                  border: `2px solid ${COLORS.primary}`,
                }}>
                  {step.icon}
                </div>
                <div style={{
                  fontSize: 24,
                  color: COLORS.text,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "center",
                  maxWidth: 150,
                }}>
                  {step.label}
                </div>
              </div>

              {i < steps.length - 1 && (
                <div style={{
                  fontSize: 40,
                  color: COLORS.primary,
                  opacity: stepProgress,
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: CONVERGENCE
// ============================================

const ConvergenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mergeProgress = spring({ frame: frame - 60, fps, config: { damping: 12 } });

  const sharedInsights = [
    "Reject fixed substances",
    "Reality is relational",
    "Identity as pattern",
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <InterconnectedNodes nodeCount={20} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 80,
      }}>
        <AnimatedText
          text="Where East Meets West"
          animation={scaleIn()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Venn diagram style */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginTop: 60,
      }}>
        {/* East circle */}
        <div style={{
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `${COLORS.eastern}30`,
          border: `4px solid ${COLORS.eastern}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${mergeProgress * 100}px)`,
          padding: 40,
        }}>
          <div style={{ fontSize: 70, marginBottom: 20 }}>🪷</div>
          <div style={{
            fontSize: 36,
            color: COLORS.eastern,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            letterSpacing: 2,
          }}>
            Buddhism
          </div>
        </div>

        {/* Shared center */}
        <div style={{
          position: "absolute",
          width: 260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: mergeProgress,
        }}>
          {sharedInsights.map((insight, i) => (
            <div key={i} style={{
              fontSize: 22,
              color: COLORS.gold,
              fontFamily: FONT_FAMILY.body,
              textAlign: "center",
              background: `${COLORS.background}cc`,
              padding: "8px 15px",
              borderRadius: 20,
            }}>
              {insight}
            </div>
          ))}
        </div>

        {/* West circle */}
        <div style={{
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `${COLORS.western}30`,
          border: `4px solid ${COLORS.western}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${-mergeProgress * 100}px)`,
          padding: 40,
        }}>
          <div style={{ fontSize: 70, marginBottom: 20 }}>🎓</div>
          <div style={{
            fontSize: 36,
            color: COLORS.western,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            letterSpacing: 2,
          }}>
            Process Philosophy
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: INTERBEING
// ============================================

const InterbeingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const revealSteps = ["☁️", "🌲", "☀️", "👷", "📄"];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles count={25} color={`${COLORS.accent}15`} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
      }}>
        <AnimatedText
          text="Interbeing"
          animation={scaleIn()}
          style={{
            fontSize: 72,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
        <div style={{
          fontSize: 28,
          color: COLORS.textMuted,
          textAlign: "center",
          marginTop: 10,
        }}>
          Thich Nhat Hanh
        </div>
      </div>

      {/* Paper revealing its origins */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        marginTop: 50,
      }}>
        {revealSteps.map((icon, i) => {
          const opacity = interpolate(
            frame,
            [i * 50 + 60, i * 50 + 100],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          return (
            <React.Fragment key={i}>
              <div style={{
                fontSize: 70,
                opacity,
                transform: `scale(${opacity})`,
              }}>
                {icon}
              </div>
              {i < revealSteps.length - 1 && (
                <div style={{
                  fontSize: 30,
                  color: COLORS.primary,
                  opacity,
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Quote */}
      <div style={{
        position: "absolute",
        bottom: 150,
        textAlign: "center",
        padding: "0 200px",
        opacity: interpolate(frame, [300, 350], [0, 1]),
      }}>
        <AnimatedText
          text="Look at paper and see the cloud, the tree, the sun"
          animation={fadeInUp()}
          style={{
            fontSize: 36,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.accent,
            fontStyle: "italic",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: DIFFERENCES
// ============================================

const DifferencesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({ frame, fps, config: { damping: 15 } });
  const rightProgress = spring({ frame: frame - 30, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
      }}>
        <AnimatedText
          text="Different Paths"
          animation={scaleIn()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Two paths */}
      <div style={{
        display: "flex",
        gap: 100,
        marginTop: 50,
      }}>
        {/* Western path */}
        <div style={{
          width: 400,
          padding: 40,
          background: `${COLORS.western}20`,
          borderRadius: 20,
          border: `2px solid ${COLORS.western}`,
          transform: `translateY(${(1 - leftProgress) * 50}px)`,
          opacity: leftProgress,
        }}>
          <div style={{ fontSize: 60, textAlign: "center", marginBottom: 20 }}>🌌</div>
          <div style={{
            fontSize: 32,
            color: COLORS.western,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 20,
          }}>
            Whitehead
          </div>
          <div style={{
            fontSize: 24,
            color: COLORS.textMuted,
            fontFamily: FONT_FAMILY.body,
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            Builds a cosmic theory with creativity at its heart
          </div>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}>
          <div style={{
            width: 2,
            height: 100,
            background: `linear-gradient(180deg, transparent, ${COLORS.textMuted}, transparent)`,
          }} />
          <div style={{
            fontSize: 28,
            color: COLORS.textMuted,
          }}>
            vs
          </div>
          <div style={{
            width: 2,
            height: 100,
            background: `linear-gradient(180deg, transparent, ${COLORS.textMuted}, transparent)`,
          }} />
        </div>

        {/* Eastern path */}
        <div style={{
          width: 400,
          padding: 40,
          background: `${COLORS.eastern}20`,
          borderRadius: 20,
          border: `2px solid ${COLORS.eastern}`,
          transform: `translateY(${(1 - rightProgress) * 50}px)`,
          opacity: rightProgress,
        }}>
          <div style={{ fontSize: 60, textAlign: "center", marginBottom: 20 }}>🧘</div>
          <div style={{
            fontSize: 32,
            color: COLORS.eastern,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 20,
          }}>
            Buddhism
          </div>
          <div style={{
            fontSize: 24,
            color: COLORS.textMuted,
            fontFamily: FONT_FAMILY.body,
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            Stays practical, focused on ending suffering
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: ETHICS
// ============================================

const EthicsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <InterconnectedNodes nodeCount={25} connectionColor={`${COLORS.gold}40`} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
      }}>
        <AnimatedText
          text="Ethics of Connection"
          animation={scaleIn()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Central message */}
      <div style={{
        textAlign: "center",
        padding: "40px 60px",
        background: `${COLORS.background}ee`,
        borderRadius: 20,
        border: `2px solid ${COLORS.gold}40`,
        maxWidth: 800,
      }}>
        <div style={{ fontSize: 80, marginBottom: 30 }}>🤝</div>
        <AnimatedText
          text="If nothing exists separately, harming others means harming yourself"
          animation={fadeInUp()}
          style={{
            fontSize: 36,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.text,
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute",
        bottom: 120,
        opacity: interpolate(frame, [200, 250], [0, 1]),
      }}>
        <AnimatedText
          text="Care flows from seeing how things really are"
          animation={fadeInUp()}
          style={{
            fontSize: 32,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: MODERN RELEVANCE
// ============================================

const ModernRelevanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const icons = [
    { icon: "🌍", label: "Ecology" },
    { icon: "🔗", label: "Systems Thinking" },
    { icon: "🤖", label: "AI Networks" },
    { icon: "🌡️", label: "Climate" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlowingWaves color={COLORS.primary} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
      }}>
        <AnimatedText
          text="Why This Matters Today"
          animation={scaleIn()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Modern applications */}
      <div style={{
        display: "flex",
        gap: 60,
        marginTop: 30,
      }}>
        {icons.map((item, i) => {
          const itemProgress = spring({
            frame: frame - i * 40,
            fps,
            config: { damping: 15 },
          });

          return (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              transform: `scale(${itemProgress})`,
              opacity: itemProgress,
            }}>
              <div style={{
                width: 150,
                height: 150,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${COLORS.primary}30, ${COLORS.accent}30)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 60,
                border: `2px solid ${COLORS.primary}40`,
              }}>
                {item.icon}
              </div>
              <div style={{
                fontSize: 24,
                color: COLORS.textMuted,
                fontFamily: FONT_FAMILY.body,
              }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div style={{
        position: "absolute",
        bottom: 120,
        textAlign: "center",
        opacity: interpolate(frame, [300, 350], [0, 1]),
      }}>
        <AnimatedText
          text="Perhaps this century will finally understand"
          animation={fadeInUp()}
          style={{
            fontSize: 32,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: CONCLUSION
// ============================================

const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const dissolveProgress = interpolate(frame, [100, 400], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.backgroundAlt} 0%, ${COLORS.background} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Expanding cosmic connection */}
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        {Array.from({ length: 50 }, (_, i) => {
          const angle = (i / 50) * Math.PI * 2;
          const baseRadius = 100;
          const expandedRadius = baseRadius + dissolveProgress * 400;
          const x = 960 + Math.cos(angle) * expandedRadius;
          const y = 540 + Math.sin(angle) * expandedRadius;

          return (
            <g key={i}>
              <line
                x1={960}
                y1={540}
                x2={x}
                y2={y}
                stroke={i % 3 === 0 ? COLORS.eastern : i % 3 === 1 ? COLORS.western : COLORS.accent}
                strokeWidth={1}
                opacity={0.3 * dissolveProgress}
              />
              <circle
                cx={x}
                cy={y}
                r={3}
                fill={COLORS.gold}
                opacity={dissolveProgress}
              />
            </g>
          );
        })}

        {/* Central figure */}
        <circle
          cx={960}
          cy={540}
          r={50 * (1 - dissolveProgress * 0.5)}
          fill={COLORS.accent}
          opacity={0.8}
        />
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
      }}>
        <AnimatedText
          text="Living This Truth"
          animation={scaleIn()}
          style={{
            fontSize: 64,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: 4,
          }}
        />
      </div>

      {/* Message */}
      <div style={{
        position: "absolute",
        bottom: 150,
        textAlign: "center",
        padding: "0 200px",
        opacity: interpolate(frame, [150, 200], [0, 1]),
      }}>
        <AnimatedText
          text="The mountain, the river, the stars — you are their continuation"
          animation={fadeInUp()}
          style={{
            fontSize: 36,
            fontFamily: FONT_FAMILY.body,
            color: COLORS.text,
            lineHeight: 1.5,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: TAKEAWAY
// ============================================

const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textScale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.primary}30 0%, ${COLORS.background} 70%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles count={40} color={`${COLORS.gold}15`} />

      {/* Central message */}
      <div style={{
        textAlign: "center",
        transform: `scale(${textScale})`,
        padding: "0 150px",
      }}>
        <div style={{ fontSize: 100, marginBottom: 40 }}>☯️</div>

        <AnimatedText
          text="You are not a thing."
          animation={fadeInUp()}
          style={{
            fontSize: 56,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.text,
            marginBottom: 20,
          }}
        />

        <AnimatedText
          text="You are an event."
          animation={fadeInUp()}
          style={{
            fontSize: 56,
            fontFamily: FONT_FAMILY.title,
            fontWeight: 800,
            color: COLORS.accent,
            marginBottom: 40,
          }}
        />

        <div style={{
          opacity: interpolate(frame, [180, 240], [0, 1]),
        }}>
          <AnimatedText
            text="A momentary gathering of the universe, experiencing itself."
            animation={fadeInUp()}
            style={{
              fontSize: 32,
              fontFamily: FONT_FAMILY.body,
              color: COLORS.textMuted,
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const ProcessAndInterbeing: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Global background */}
      <AnimatedGradient
        colors={[COLORS.background, COLORS.backgroundAlt]}
        animationMode="pulse"
      />
      <Vignette intensity={0.4} />

      {/* Scenes */}
      <Sequence from={toFrames(SCENES.hook.start)} durationInFrames={toFrames(SCENES.hook.duration)}>
        <HookScene />
        <Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.problem.start)} durationInFrames={toFrames(SCENES.problem.duration)}>
        <ProblemScene />
        <Audio src={staticFile(`${AUDIO_BASE}/problem.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.promise.start)} durationInFrames={toFrames(SCENES.promise.duration)}>
        <PromiseScene />
        <Audio src={staticFile(`${AUDIO_BASE}/promise.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.whiteheadIntro.start)} durationInFrames={toFrames(SCENES.whiteheadIntro.duration)}>
        <WhiteheadIntroScene />
        <Audio src={staticFile(`${AUDIO_BASE}/whitehead-intro.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.actualOccasions.start)} durationInFrames={toFrames(SCENES.actualOccasions.duration)}>
        <ActualOccasionsScene />
        <Audio src={staticFile(`${AUDIO_BASE}/actual-occasions.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.dependentOrigination.start)} durationInFrames={toFrames(SCENES.dependentOrigination.duration)}>
        <DependentOriginationScene />
        <Audio src={staticFile(`${AUDIO_BASE}/dependent-origination.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.emptiness.start)} durationInFrames={toFrames(SCENES.emptiness.duration)}>
        <EmptinessScene />
        <Audio src={staticFile(`${AUDIO_BASE}/emptiness.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.journey.start)} durationInFrames={toFrames(SCENES.journey.duration)}>
        <JourneyScene />
        <Audio src={staticFile(`${AUDIO_BASE}/journey.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.convergence.start)} durationInFrames={toFrames(SCENES.convergence.duration)}>
        <ConvergenceScene />
        <Audio src={staticFile(`${AUDIO_BASE}/convergence.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.interbeing.start)} durationInFrames={toFrames(SCENES.interbeing.duration)}>
        <InterbeingScene />
        <Audio src={staticFile(`${AUDIO_BASE}/interbeing.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.differences.start)} durationInFrames={toFrames(SCENES.differences.duration)}>
        <DifferencesScene />
        <Audio src={staticFile(`${AUDIO_BASE}/differences.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.ethics.start)} durationInFrames={toFrames(SCENES.ethics.duration)}>
        <EthicsScene />
        <Audio src={staticFile(`${AUDIO_BASE}/ethics.mp3`)} />
      </Sequence>

      <Sequence from={toFrames(SCENES.modernRelevance.start)} durationInFrames={toFrames(SCENES.modernRelevance.duration)}>
        <ModernRelevanceScene />
        <Audio src={staticFile(`${AUDIO_BASE}/modern-relevance.mp3`)} />
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
export const processAndInterbeingComposition = {
  id: "ProcessAndInterbeing",
  component: ProcessAndInterbeing,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: ProcessAndInterbeingSchema,
  defaultProps: {},
};
