import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Loop,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  Img,
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
import visualPanelsData from "../../../projects/IKEAEffect/visual-panels.json";

// Helper to get panels for a scene from visual-panels.json
const getPanels = (sceneId: string) => {
  const scene = visualPanelsData.scenes.find((s: { id: string }) => s.id === sceneId);
  return (scene?.panels || []).map((p: { text: string; startFrame: number; endFrame: number }) => ({
    text: p.text,
    start: p.startFrame,
    end: p.endFrame,
  }));
};

// Schema
export const IKEAEffectSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

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
        background: "rgba(255, 255, 255, 0.08)",
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
const CraftBackground: React.FC<{
  sceneId: string;
  overlayOpacity?: number;
}> = ({ sceneId, overlayOpacity = 0.6 }) => {
  const src = staticFile(`${AI_ASSETS_BASE}/${sceneId}-bg.jpg`);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${THEME.background}, ${THEME.secondary}40, ${THEME.background})`,
        }}
      />
      <AbsoluteFill>
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={undefined}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(26,21,16,${overlayOpacity}) 0%, rgba(26,21,16,${overlayOpacity + 0.15}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Panel-based text display with fade in/out */
const PanelText: React.FC<{
  panels: Array<{ text: string; start: number; end: number }>;
  fontSize?: number;
  maxWidth?: number;
}> = ({ panels, fontSize = 68, maxWidth = 1400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 700,
          color: THEME.text,
          fontFamily: FONT_FAMILY.title,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth,
          padding: 80,
          opacity,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [30, 0])}px)`,
          textShadow: `0 4px 30px rgba(0,0,0,0.6), 0 0 80px ${THEME.primary}40`,
          whiteSpace: "pre-line",
        }}
      >
        {activePanel.text}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: INTRO (타이틀)
// ============================================

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const subtitleOpacity = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20 },
  });

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="intro" overlayOpacity={0.55} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            transform: `scale(${titleScale})`,
          }}
        >
          <div
            style={{
              fontSize: 100,
              fontWeight: 800,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              textShadow: `0 4px 30px rgba(0,0,0,0.6), 0 0 80px ${THEME.accent}30`,
              marginBottom: 30,
            }}
          >
            이케아 효과
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.body,
              opacity: subtitleOpacity,
              textShadow: `0 0 40px ${THEME.accent}40`,
            }}
          >
            내가 만든 것이 왜 더 소중한가
          </div>
        </div>
      </AbsoluteFill>

      <OfficialLightLeak
        seed={3}
        hueShift={30}
        durationInFrames={toFrames(SCENES.intro.duration)}
        opacity={0.15}
      />
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: HOOK (조립의 기적)
// ============================================

const HookScene: React.FC = () => {
  const panels = getPanels("hook");

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="hook" />
      <PanelText panels={panels} />
      <Vignette intensity={0.5} />
      <FilmGrain intensity={0.03} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: BETTY CROCKER (케이크 가루의 비밀)
// ============================================

const BettyCrockerScene: React.FC = () => {
  const panels = getPanels("betty_crocker");

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="betty_crocker" />
      <PanelText panels={panels} />
      <Vignette intensity={0.45} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: EXPERIMENT (하버드의 실험)
// ============================================

const ExperimentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneDuration = toFrames(SCENES.experiment.duration);

  // Phase 1: Setup text (first ~30% of scene)
  const allPanels = getPanels("experiment");
  const setupPanels = allPanels.slice(0, 2);

  const setupPanel = setupPanels.find((p) => frame >= p.start && frame < p.end);

  // Phase 2: Data visualization (after ~35% of scene)
  const chartStart = Math.round(sceneDuration * 0.35);
  const showChart = frame >= chartStart;
  const chartProgress = spring({
    frame: frame - chartStart,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  // Bar widths
  const assemblyBarWidth = interpolate(chartProgress, [0, 1], [0, 780]);
  const prebuiltBarWidth = interpolate(chartProgress, [0, 1], [0, 480]);

  // 63% label
  const percentReveal = spring({
    frame: frame - Math.round(sceneDuration * 0.55),
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="experiment" overlayOpacity={0.65} />

      {/* Setup panels */}
      {!showChart && setupPanel && (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 1400,
              padding: 80,
              opacity: spring({
                frame: frame - setupPanel.start,
                fps,
                config: { damping: 20 },
              }),
              textShadow: `0 4px 30px rgba(0,0,0,0.6)`,
              whiteSpace: "pre-line",
            }}
          >
            {setupPanel.text}
          </div>
        </AbsoluteFill>
      )}

      {/* Data visualization */}
      {showChart && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 80,
          }}
        >
          <div style={{ maxWidth: 1400, width: "100%" }}>
            {/* Title */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                marginBottom: 60,
                textAlign: "center",
                opacity: chartProgress,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              지불 의향 비교
            </div>

            {/* Assembly group bar */}
            <div style={{ marginBottom: 40 }}>
              <div
                style={{
                  fontSize: 36,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  marginBottom: 12,
                  opacity: chartProgress,
                }}
              >
                직접 조립 그룹
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    height: 80,
                    width: assemblyBarWidth,
                    background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.primary})`,
                    borderRadius: 12,
                  }}
                />
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    color: THEME.accent,
                    fontFamily: FONT_FAMILY.title,
                    opacity: chartProgress,
                  }}
                >
                  $0.78
                </div>
              </div>
            </div>

            {/* Pre-built group bar */}
            <div style={{ marginBottom: 60 }}>
              <div
                style={{
                  fontSize: 36,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  marginBottom: 12,
                  opacity: chartProgress,
                }}
              >
                완성품 그룹
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    height: 80,
                    width: prebuiltBarWidth,
                    background: `linear-gradient(90deg, ${THEME.tertiary}80, ${THEME.tertiary})`,
                    borderRadius: 12,
                  }}
                />
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    color: THEME.tertiary,
                    fontFamily: FONT_FAMILY.title,
                    opacity: chartProgress,
                  }}
                >
                  $0.48
                </div>
              </div>
            </div>

            {/* 63% premium */}
            <div
              style={{
                textAlign: "center",
                opacity: percentReveal,
                transform: `scale(${percentReveal})`,
              }}
            >
              <span
                style={{
                  fontSize: 120,
                  fontWeight: 800,
                  color: THEME.accent,
                  fontFamily: FONT_FAMILY.title,
                  textShadow: `0 0 60px ${THEME.accent}50`,
                }}
              >
                63%
              </span>
              <span
                style={{
                  fontSize: 48,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.body,
                  marginLeft: 20,
                }}
              >
                더 높은 가격
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: ORIGAMI (종이접기 실험)
// ============================================

const OrigamiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = toFrames(SCENES.origami.duration);

  // Get panels from visual-panels.json
  const allPanels = getPanels("origami");
  // Phase 1: First 2 panels are story text
  const storyEnd = Math.round(sceneDuration * 0.35);
  const storyPanel =
    frame < storyEnd
      ? allPanels.slice(0, 2).find((p: { start: number; end: number }) => frame >= p.start && frame < p.end)
      : null;

  // Phase 2: Dramatic comparison
  const showComparison = frame >= storyEnd;
  const compProgress = spring({
    frame: frame - storyEnd,
    fps,
    config: { damping: 12 },
  });

  const fiveXReveal = spring({
    frame: frame - Math.round(sceneDuration * 0.55),
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  // Phase 3: Closing statement
  const closingStart = Math.round(sceneDuration * 0.75);
  const closingReveal = spring({
    frame: frame - closingStart,
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="origami" />

      {/* Story panels */}
      {storyPanel && (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 1400,
              padding: 80,
              opacity: spring({
                frame: frame - storyPanel.start,
                fps,
                config: { damping: 20 },
              }),
              textShadow: "0 4px 30px rgba(0,0,0,0.6)",
              whiteSpace: "pre-line",
            }}
          >
            {storyPanel.text}
          </div>
        </AbsoluteFill>
      )}

      {/* Comparison: $0.23 vs $0.05 */}
      {showComparison && frame < closingStart && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 100,
              alignItems: "center",
              opacity: compProgress,
            }}
          >
            {/* Maker */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 36,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  marginBottom: 16,
                }}
              >
                만든 사람
              </div>
              <div
                style={{
                  fontSize: 140,
                  fontWeight: 800,
                  color: THEME.accent,
                  fontFamily: FONT_FAMILY.title,
                  textShadow: `0 0 60px ${THEME.accent}50`,
                }}
              >
                23&#162;
              </div>
            </div>

            {/* VS */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: THEME.textMuted,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              vs
            </div>

            {/* Observer */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 36,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  marginBottom: 16,
                }}
              >
                본 사람
              </div>
              <div
                style={{
                  fontSize: 140,
                  fontWeight: 800,
                  color: THEME.tertiary,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                5&#162;
              </div>
            </div>
          </div>

          {/* 5x multiplier */}
          <div
            style={{
              opacity: fiveXReveal,
              transform: `scale(${fiveXReveal})`,
              marginTop: 20,
            }}
          >
            <span
              style={{
                fontSize: 100,
                fontWeight: 800,
                color: THEME.accent,
                fontFamily: FONT_FAMILY.title,
                textShadow: `0 0 80px ${THEME.accent}60`,
              }}
            >
              5배
            </span>
            <span
              style={{
                fontSize: 48,
                color: THEME.text,
                fontFamily: FONT_FAMILY.body,
                marginLeft: 16,
              }}
            >
              차이
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Closing statement */}
      {frame >= closingStart && (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              textAlign: "center",
              maxWidth: 1200,
              opacity: closingReveal,
              transform: `translateY(${interpolate(closingReveal, [0, 1], [30, 0])}px)`,
              textShadow: `0 0 60px ${THEME.accent}40`,
            }}
          >
            노력이 들어가는 순간
            <br />
            그것은 예술이 됩니다
          </div>
        </AbsoluteFill>
      )}

      <Vignette intensity={0.45} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: WHY IT WORKS (왜 이런 일이 일어날까)
// ============================================

const WhyItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mechanisms = [
    {
      icon: "🧠",
      title: "노력 정당화",
      desc: "힘들게 한 일은 가치 있어야 한다는 뇌의 자기 방어",
      color: THEME.primary,
    },
    {
      icon: "🤲",
      title: "소유 효과",
      desc: "내 것은 더 소중하게 느껴지는 본능",
      color: THEME.accent,
    },
    {
      icon: "💪",
      title: "자기 효능감",
      desc: "만들어냈다는 성취감이 물건에 전이",
      color: THEME.tertiary,
    },
  ];

  // Condition warning
  const conditionReveal = spring({
    frame: frame - toFrames(16),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="why_it_works" overlayOpacity={0.65} />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="왜 이런 일이 일어날까"
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

        {/* 3 Mechanism Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 50,
            marginBottom: 50,
          }}
        >
          {mechanisms.map((mech, i) => {
            const progress = spring({
              frame: frame - 20 - i * 25,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  width: 480,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: `2px solid ${mech.color}40`,
                  borderRadius: 24,
                  padding: 45,
                  textAlign: "center",
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
                }}
              >
                <div style={{ fontSize: 80, marginBottom: 20 }}>
                  {mech.icon}
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: mech.color,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 16,
                  }}
                >
                  {mech.title}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.body,
                    lineHeight: 1.5,
                  }}
                >
                  {mech.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Condition: Must complete */}
        <div
          style={{
            textAlign: "center",
            opacity: conditionReveal,
            transform: `translateY(${interpolate(conditionReveal, [0, 1], [20, 0])}px)`,
            background: `${THEME.danger}15`,
            border: `2px solid ${THEME.danger}40`,
            borderRadius: 16,
            padding: "24px 40px",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: THEME.warning,
              fontFamily: FONT_FAMILY.title,
            }}
          >
            단, 반드시 완성해야 합니다
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: REAL WORLD (세상을 바꾼 심리)
// ============================================

const RealWorldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const examples = [
    {
      icon: "👟",
      name: "나이키 바이 유",
      desc: "고객이 직접 디자인",
      color: THEME.accent,
    },
    {
      icon: "🧱",
      name: "레고 MOC",
      desc: "팬이 직접 설계한 조립 세트",
      color: THEME.primary,
    },
    {
      icon: "🍳",
      name: "밀키트",
      desc: "요리 과정을 고객에게",
      color: THEME.tertiary,
    },
  ];

  // Market growth stat
  const marketReveal = spring({
    frame: frame - toFrames(13),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="real_world" />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="세상을 바꾼 심리"
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

        {/* Example Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 50,
            marginBottom: 60,
          }}
        >
          {examples.map((ex, i) => {
            const progress = spring({
              frame: frame - 15 - i * 20,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  width: 460,
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: 24,
                  padding: 40,
                  textAlign: "center",
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
                  borderBottom: `4px solid ${ex.color}`,
                }}
              >
                <div style={{ fontSize: 80, marginBottom: 16 }}>
                  {ex.icon}
                </div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: ex.color,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 10,
                  }}
                >
                  {ex.name}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.body,
                  }}
                >
                  {ex.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Korea DIY market stat */}
        <div
          style={{
            textAlign: "center",
            opacity: marketReveal,
            transform: `scale(${marketReveal})`,
          }}
        >
          <div
            style={{
              fontSize: 36,
              color: THEME.textMuted,
              fontFamily: FONT_FAMILY.body,
              marginBottom: 16,
            }}
          >
            한국 DIY 시장
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: THEME.tertiary,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              7조
            </span>
            <span
              style={{
                fontSize: 48,
                color: THEME.textMuted,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              →
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: THEME.accent,
                fontFamily: FONT_FAMILY.title,
                textShadow: `0 0 40px ${THEME.accent}40`,
              }}
            >
              18조 원
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: DARK SIDE (함정: 매몰 비용)
// ============================================

const DarkSideScene: React.FC = () => {
  const panels = getPanels("dark_side");

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="dark_side" overlayOpacity={0.7} />
      <PanelText panels={panels} />
      <Vignette intensity={0.55} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: TAKEAWAY (현명하게 활용하기)
// ============================================

const TakeawayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tips = [
    {
      num: "01",
      title: "의도적으로 활용하세요",
      desc: "무언가에 애착을 갖고 싶다면,\n직접 만들어보세요.",
      color: THEME.accent,
    },
    {
      num: "02",
      title: "경계하세요",
      desc: "내가 만들었다는 이유만으로\n나쁜 선택을 고수하고 있진 않은지.",
      color: THEME.danger,
    },
  ];

  // Key message
  const keyReveal = spring({
    frame: frame - toFrames(14),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="takeaway" />

      <AbsoluteFill style={{ padding: 80 }}>
        <AnimatedText
          text="현명하게 활용하기"
          animation={fadeInUp()}
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: THEME.text,
            fontFamily: FONT_FAMILY.title,
            marginBottom: 70,
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Two tip cards side by side */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 60,
            marginBottom: 60,
          }}
        >
          {tips.map((tip, i) => {
            const progress = spring({
              frame: frame - 20 - i * 30,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={i}
                style={{
                  width: 620,
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: 24,
                  padding: 50,
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
                  borderLeft: `5px solid ${tip.color}`,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: tip.color,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 12,
                    letterSpacing: 2,
                  }}
                >
                  {tip.num}
                </div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 700,
                    color: THEME.text,
                    fontFamily: FONT_FAMILY.title,
                    marginBottom: 20,
                  }}
                >
                  {tip.title}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    color: THEME.textMuted,
                    fontFamily: FONT_FAMILY.body,
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}
                >
                  {tip.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key insight */}
        <div
          style={{
            textAlign: "center",
            opacity: keyReveal,
            transform: `translateY(${interpolate(keyReveal, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              textShadow: `0 0 40px ${THEME.accent}40`,
            }}
          >
            노력은 가치를 만들지만, 때로는 판단도 흐립니다
          </div>
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: OUTRO (마무리)
// ============================================

const OutroScene: React.FC = () => {
  const duration = toFrames(SCENES.outro.duration);

  const panels = getPanels("outro");

  return (
    <AbsoluteFill>
      <CraftBackground sceneId="outro" overlayOpacity={0.5} />
      <PanelText panels={panels} fontSize={72} />

      <OfficialLightLeak
        seed={7}
        hueShift={30}
        durationInFrames={duration}
        opacity={0.18}
      />

      <Vignette intensity={0.35} />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const IKEAEffect: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* BGM - 전체 영상에 깔림 (Loop로 반복) */}
      <Loop durationInFrames={TOTAL_DURATION}>
        <Html5Audio
          src={staticFile(`${AI_ASSETS_BASE}/bgm.mp3`)}
          volume={0.2}
        />
      </Loop>

      <AnimatedGradient
        colors={[THEME.background, THEME.backgroundAlt]}
        animationMode="pulse"
      />

      <Sequence
        from={toFrames(SCENES.intro.start)}
        durationInFrames={toFrames(SCENES.intro.duration)}
      >
        <IntroScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/intro.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.hook.start)}
        durationInFrames={toFrames(SCENES.hook.duration)}
      >
        <HookScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/hook.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.betty_crocker.start)}
        durationInFrames={toFrames(SCENES.betty_crocker.duration)}
      >
        <BettyCrockerScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/betty_crocker.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.experiment.start)}
        durationInFrames={toFrames(SCENES.experiment.duration)}
      >
        <ExperimentScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/experiment.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.origami.start)}
        durationInFrames={toFrames(SCENES.origami.duration)}
      >
        <OrigamiScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/origami.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.why_it_works.start)}
        durationInFrames={toFrames(SCENES.why_it_works.duration)}
      >
        <WhyItWorksScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/why_it_works.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.real_world.start)}
        durationInFrames={toFrames(SCENES.real_world.duration)}
      >
        <RealWorldScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/real_world.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.dark_side.start)}
        durationInFrames={toFrames(SCENES.dark_side.duration)}
      >
        <DarkSideScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/dark_side.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.takeaway.start)}
        durationInFrames={toFrames(SCENES.takeaway.duration)}
      >
        <TakeawayScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/takeaway.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.outro.start)}
        durationInFrames={toFrames(SCENES.outro.duration)}
      >
        <OutroScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/outro.mp3`)} />
      </Sequence>

      <ProgressBar />
    </AbsoluteFill>
  );
};

// Export for registry
export const ikeaEffectComposition = {
  id: "IKEAEffect",
  component: IKEAEffect,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: IKEAEffectSchema,
  defaultProps: {},
};
