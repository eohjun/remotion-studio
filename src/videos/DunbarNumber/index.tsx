import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  Img,
  OffthreadVideo,
  Loop,
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
import { FONT_FAMILY } from "../../shared/components/constants";
import { Vignette } from "../../shared/components/effects";
import { OfficialLightLeak } from "../../shared/components/effects/OfficialLightLeak";

// Schema
export const DunbarNumberSchema = z.object({});

// ============================================
// SHARED COMPONENTS
// ============================================

const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 25, color = "rgba(99, 102, 241, 0.12)" }) => {
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

/** AI-generated background with dark overlay */
const DunbarBackground: React.FC<{
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
          background: `linear-gradient(180deg, rgba(15,10,26,${overlayOpacity}) 0%, rgba(15,10,26,${overlayOpacity + 0.15}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Reusable panel fade logic */
const getPanelFade = (
  frame: number,
  start: number,
  end: number,
  fps: number,
) => {
  const startF = toFrames(start);
  const endF = toFrames(end);
  const localFrame = frame - startF;
  const panelDuration = endF - startF;
  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 20 } });
  const fadeOutStart = panelDuration - 15;
  const fadeOut =
    localFrame > fadeOutStart
      ? interpolate(localFrame, [fadeOutStart, panelDuration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  return { opacity: fadeIn * fadeOut, translateY: interpolate(fadeIn, [0, 1], [30, 0]) };
};

// ============================================
// SCENE: HOOK (150명의 한계)
// - Kie.ai Veo 3 video background
// Timestamps from visual-panels.json (seconds)
// ============================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel timings from Whisper timestamps (seconds)
  const panels = [
    { text: "당신의 휴대폰에는\n몇 명의 연락처가 저장되어 있나요?", start: 0, end: 3.36 },
    { text: "아마 수백 명,\n어쩌면 천명이 넘을 수도 있습니다", start: 3.96, end: 6.70 },
    { text: "하지만 정말 힘든 순간,\n전화를 걸 수 있는 사람은\n몇 명인가요?", start: 7.58, end: 11.98 },
    { text: "우리의 뇌에는\n의미 있는 관계를 유지할 수 있는\n한계가 있습니다", start: 13.28, end: 16.78 },
    { text: "150", start: 17.60, end: 19.88 },
  ];

  const activePanel = panels.find(
    (p) => frame >= toFrames(p.start) && frame < toFrames(p.end),
  );

  const videoSrc = staticFile(`${AI_ASSETS_BASE}/hook-motion.mp4`);

  return (
    <AbsoluteFill>
      {/* Kie.ai Veo 3 video background */}
      <AbsoluteFill>
        <Loop durationInFrames={toFrames(8)}>
          <OffthreadVideo
            src={videoSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Loop>
      </AbsoluteFill>
      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(15,10,26,0.5) 0%, rgba(15,10,26,0.7) 100%)",
        }}
      />
      <FloatingParticles color="rgba(99, 102, 241, 0.08)" />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {activePanel && (() => {
          const { opacity, translateY } = getPanelFade(frame, activePanel.start, activePanel.end, fps);
          const isLast = activePanel === panels[panels.length - 1];

          return (
            <div
              style={{
                fontSize: isLast ? 84 : 64,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                textAlign: "center",
                lineHeight: 1.5,
                maxWidth: 1400,
                padding: 80,
                opacity,
                transform: `translateY(${translateY}px)`,
                textShadow: `0 4px 30px rgba(0,0,0,0.6), 0 0 80px ${THEME.primary}40`,
                whiteSpace: "pre-line",
              }}
            >
              {isLast ? (
                <>
                  그 숫자는 바로
                  <br />
                  <span
                    style={{
                      fontSize: 160,
                      color: THEME.accent,
                      textShadow: `0 0 80px ${THEME.accent}60`,
                    }}
                  >
                    150
                  </span>
                  입니다
                </>
              ) : (
                activePanel.text
              )}
            </div>
          );
        })()}
      </AbsoluteFill>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: SCIENCE (던바의 발견)
// Panels: 0-5.98s | 6.66-14.72s | 15.6-19.8s | 20.84-30.46s
// ============================================

const ScienceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Robin Dunbar intro (0 - 5.98s)
  const introOpacity = spring({ frame, fps, config: { damping: 20 } });
  const introFade = frame > toFrames(4.5)
    ? interpolate(frame, [toFrames(4.5), toFrames(5.98)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Phase 2: Brain correlation (6.66 - 14.72s)
  const brainReveal = spring({
    frame: frame - toFrames(6.66),
    fps,
    config: { damping: 15 },
  });
  const brainFade = frame > toFrames(13)
    ? interpolate(frame, [toFrames(13), toFrames(14.72)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Phase 3: The number 150 (15.6 - 19.8s)
  const numberScale = spring({
    frame: frame - toFrames(15.6),
    fps,
    config: { damping: 10, mass: 0.8 },
  });
  const numberFade = frame > toFrames(18.5)
    ? interpolate(frame, [toFrames(18.5), toFrames(19.8)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Phase 4: Examples (20.84 - 30.46s)
  const examplesReveal = spring({
    frame: frame - toFrames(20.84),
    fps,
    config: { damping: 15 },
  });

  const showIntro = frame < toFrames(6.3);
  const showBrain = frame >= toFrames(6.3) && frame < toFrames(15.2);
  const showNumber = frame >= toFrames(15.2) && frame < toFrames(20.5);
  const showExamples = frame >= toFrames(20.5);

  const examples = [
    { icon: "🏹", label: "수렵 채집 부족", value: "~150명" },
    { icon: "⚔️", label: "로마 군단 단위", value: "~150명" },
    { icon: "🏢", label: "효율적 조직 규모", value: "~150명" },
  ];

  return (
    <AbsoluteFill>
      <DunbarBackground sceneId="science" />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
      >
        {/* Robin Dunbar intro */}
        {showIntro && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1400,
              opacity: introOpacity * introFade,
            }}
          >
            <div
              style={{
                fontSize: 36,
                color: THEME.textMuted,
                fontFamily: FONT_FAMILY.body,
                marginBottom: 20,
              }}
            >
              1990년대, 영국
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                lineHeight: 1.5,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              인류학자{" "}
              <span style={{ color: THEME.accent }}>로빈 던바</span>는
              <br />
              흥미로운 연구를 시작했습니다
            </div>
          </div>
        )}

        {/* Brain-group size correlation */}
        {showBrain && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1400,
              opacity: brainReveal * brainFade,
              transform: `translateY(${interpolate(brainReveal, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 24,
                padding: "50px 60px",
                borderLeft: `4px solid ${THEME.primary}`,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: THEME.primary,
                  fontFamily: FONT_FAMILY.title,
                  marginBottom: 24,
                }}
              >
                대뇌신피질 크기 = 사회적 집단 규모
              </div>
              <div
                style={{
                  fontSize: 38,
                  color: THEME.text,
                  fontFamily: FONT_FAMILY.body,
                  lineHeight: 1.6,
                }}
              >
                영장류의 뇌 크기와 사회적 집단 규모 사이에
                <br />
                강한 상관관계를 발견
              </div>
            </div>
          </div>
        )}

        {/* The number 150 */}
        {showNumber && (
          <div
            style={{
              textAlign: "center",
              opacity: numberScale * numberFade,
              transform: `scale(${numberScale})`,
            }}
          >
            <div
              style={{
                fontSize: 220,
                fontWeight: 800,
                color: THEME.accent,
                fontFamily: FONT_FAMILY.title,
                textShadow: `0 0 100px ${THEME.accent}60`,
              }}
            >
              150
            </div>
            <div
              style={{
                fontSize: 42,
                color: THEME.textMuted,
                fontFamily: FONT_FAMILY.body,
                marginTop: 10,
              }}
            >
              인간의 뇌에 적용한 결과
            </div>
          </div>
        )}

        {/* Historical examples */}
        {showExamples && (
          <div
            style={{
              display: "flex",
              gap: 50,
              opacity: examplesReveal,
              transform: `translateY(${interpolate(examplesReveal, [0, 1], [40, 0])}px)`,
            }}
          >
            {examples.map((ex, i) => {
              const delay = spring({
                frame: frame - toFrames(20.84) - i * 15,
                fps,
                config: { damping: 15 },
              });

              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 24,
                    padding: "50px 60px",
                    textAlign: "center",
                    opacity: delay,
                    border: `2px solid ${THEME.primary}30`,
                    minWidth: 350,
                  }}
                >
                  <div style={{ fontSize: 80, marginBottom: 20 }}>{ex.icon}</div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: THEME.text,
                      fontFamily: FONT_FAMILY.title,
                      marginBottom: 12,
                    }}
                  >
                    {ex.label}
                  </div>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 800,
                      color: THEME.accent,
                      fontFamily: FONT_FAMILY.title,
                    }}
                  >
                    {ex.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: LAYERS (사회적 계층 - 동심원)
// Panels: 0-4.54s | 4.96-7.74s | 8.7-13.94s | 14.6-18.42s | 19.46-26s | 26-31.66s
// ============================================

const LayersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro text covers panels 1-2 (0 - 7.74s)
  const introProgress = spring({ frame, fps, config: { damping: 20 } });
  const introFade = frame > toFrames(6)
    ? interpolate(frame, [toFrames(6), toFrames(7.74)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const showIntro = frame < toFrames(8);

  // Concentric circles - each layer appears when narration mentions it
  const layers = [
    { count: 5, label: "핵심 (위로가 필요할 때)", radius: 100, color: THEME.accent, startSec: 8.7 },
    { count: 15, label: "가까운 친구", radius: 200, color: "#f97316", startSec: 14.6 },
    { count: 50, label: "사회적 관계", radius: 310, color: THEME.primary, startSec: 19.46 },
    { count: 150, label: "의미 있는 관계의 최대치", radius: 420, color: "#818cf8", startSec: 21.5 },
  ];

  // "3x rule" text (panel 6: 26 - 31.66s)
  const ruleProgress = spring({
    frame: frame - toFrames(26),
    fps,
    config: { damping: 15 },
  });
  const showRule = frame >= toFrames(25.5);

  return (
    <AbsoluteFill>
      <DunbarBackground sceneId="layers" overlayOpacity={0.7} />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {/* Intro text */}
        {showIntro && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1200,
              opacity: introProgress * introFade,
              position: "absolute",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                lineHeight: 1.5,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              던바의 수는 단순히{" "}
              <span style={{ color: THEME.accent }}>150</span>이라는
              <br />
              하나의 숫자가 아닙니다
            </div>
          </div>
        )}

        {/* Concentric circles */}
        {!showIntro && (
          <div style={{ position: "relative", width: 900, height: 900 }}>
            {layers.map((layer, i) => {
              const progress = spring({
                frame: frame - toFrames(layer.startSec),
                fps,
                config: { damping: 12, mass: 0.8 },
              });
              const size = layer.radius * 2;

              return (
                <React.Fragment key={i}>
                  {/* Circle ring */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: size,
                      height: size,
                      marginTop: -size / 2,
                      marginLeft: -size / 2,
                      borderRadius: "50%",
                      border: `3px solid ${layer.color}`,
                      background: `${layer.color}08`,
                      opacity: progress,
                      transform: `scale(${progress})`,
                    }}
                  />
                  {/* Count label */}
                  <div
                    style={{
                      position: "absolute",
                      top: `calc(50% - ${layer.radius + 30}px)`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      textAlign: "center",
                      opacity: progress,
                    }}
                  >
                    <div
                      style={{
                        fontSize: i === 0 ? 64 : 48,
                        fontWeight: 800,
                        color: layer.color,
                        fontFamily: FONT_FAMILY.title,
                        textShadow: `0 0 40px ${layer.color}50`,
                      }}
                    >
                      {layer.count}
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        color: THEME.textMuted,
                        fontFamily: FONT_FAMILY.body,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {layer.label}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* 3x Rule */}
        {showRule && (
          <div
            style={{
              position: "absolute",
              bottom: 100,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: ruleProgress,
              transform: `translateY(${interpolate(ruleProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: THEME.accent,
                fontFamily: FONT_FAMILY.title,
                textShadow: `0 0 40px ${THEME.accent}40`,
              }}
            >
              각 층은 약 3배씩 늘어나며, 관계의 깊이는 반비례합니다
            </div>
          </div>
        )}
      </AbsoluteFill>

      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: DIGITAL (디지털 시대의 역설)
// Panels: 0-4.26 | 5.28-7.34 | 8.48-10.04 | 11-15.62 | 15.62-18.32 | 18.58-23.26 | 23.26-28.38
// ============================================

const DigitalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text panels (panels 1-3: 0 - 10.04s)
  const textPanels = [
    { text: "소셜미디어 시대,\n우리는 수천명과 연결되어 있다고 믿습니다", start: 0, end: 4.26 },
    { text: "팔로워 천명, 친구 오백명", start: 5.28, end: 7.34 },
    { text: "하지만 연구 결과는 냉정합니다", start: 8.48, end: 10.04 },
  ];

  const activeTextPanel = textPanels.find(
    (p) => frame >= toFrames(p.start) && frame < toFrames(p.end),
  );

  // SNS vs Reality split (panels 4-5: 11 - 18.32s)
  const splitReveal = spring({
    frame: frame - toFrames(11),
    fps,
    config: { damping: 15 },
  });
  const showSplit = frame >= toFrames(10.5) && frame < toFrames(18.5);

  // "Still 150" right side (panel 5: 15.62s)
  const still150 = spring({
    frame: frame - toFrames(13),
    fps,
    config: { damping: 10, mass: 0.8 },
  });

  // Tech conclusion (panel 6: 18.58 - 23.26s)
  const techReveal = spring({
    frame: frame - toFrames(18.58),
    fps,
    config: { damping: 15 },
  });
  const techFade = frame > toFrames(21.5)
    ? interpolate(frame, [toFrames(21.5), toFrames(23.26)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const showTech = frame >= toFrames(18.3) && frame < toFrames(23.5);

  // Stone age brain (panel 7: 23.26 - 28.38s)
  const stoneReveal = spring({
    frame: frame - toFrames(23.26),
    fps,
    config: { damping: 15 },
  });
  const showStone = frame >= toFrames(23);

  return (
    <AbsoluteFill>
      <DunbarBackground sceneId="digital" />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
      >
        {/* Text panels (0-10s) */}
        {activeTextPanel && (() => {
          const { opacity, translateY } = getPanelFade(frame, activeTextPanel.start, activeTextPanel.end, fps);
          return (
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                textAlign: "center",
                lineHeight: 1.5,
                maxWidth: 1400,
                opacity,
                transform: `translateY(${translateY}px)`,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                whiteSpace: "pre-line",
              }}
            >
              {activeTextPanel.text}
            </div>
          );
        })()}

        {/* SNS vs Reality split */}
        {showSplit && (
          <div
            style={{
              display: "flex",
              gap: 80,
              alignItems: "center",
              opacity: splitReveal,
            }}
          >
            {/* SNS side */}
            <div
              style={{
                textAlign: "center",
                flex: 1,
                opacity: splitReveal,
                transform: `translateX(${interpolate(splitReveal, [0, 1], [-50, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 100, marginBottom: 20 }}>📱</div>
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: THEME.tertiary,
                  fontFamily: FONT_FAMILY.title,
                }}
              >
                1,000+
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  marginTop: 10,
                }}
              >
                온라인 친구
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: 3,
                height: 300,
                background: `linear-gradient(180deg, transparent, ${THEME.textMuted}, transparent)`,
              }}
            />

            {/* Reality side */}
            <div
              style={{
                textAlign: "center",
                flex: 1,
                opacity: still150,
                transform: `translateX(${interpolate(still150, [0, 1], [50, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 100, marginBottom: 20 }}>🤝</div>
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: THEME.accent,
                  fontFamily: FONT_FAMILY.title,
                  textShadow: `0 0 60px ${THEME.accent}40`,
                }}
              >
                150
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: THEME.textMuted,
                  fontFamily: FONT_FAMILY.body,
                  marginTop: 10,
                }}
              >
                실제 의미 있는 관계
              </div>
            </div>
          </div>
        )}

        {/* Tech conclusion */}
        {showTech && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1400,
              opacity: techReveal * techFade,
              transform: `translateY(${interpolate(techReveal, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: THEME.text,
                fontFamily: FONT_FAMILY.title,
                lineHeight: 1.6,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              기술은 연결의 <span style={{ color: THEME.tertiary }}>양</span>을 늘렸지만
              <br />
              관계의 <span style={{ color: THEME.accent }}>질</span>까지 바꾸지는 못했습니다
            </div>
          </div>
        )}

        {/* Stone age brain */}
        {showStone && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1400,
              opacity: stoneReveal,
              transform: `scale(${stoneReveal})`,
            }}
          >
            <div style={{ fontSize: 100, marginBottom: 30 }}>🧠</div>
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: THEME.primary,
                fontFamily: FONT_FAMILY.title,
                lineHeight: 1.6,
                textShadow: `0 0 40px ${THEME.primary}40`,
              }}
            >
              우리의 뇌는 여전히
              <br />
              석기 시대의 사회적 프로세서로 작동합니다
            </div>
          </div>
        )}
      </AbsoluteFill>

      <Sequence from={toFrames(18)} durationInFrames={toFrames(11)}>
        <OfficialLightLeak
          seed={3}
          hueShift={200}
          durationInFrames={toFrames(11)}
          opacity={0.12}
        />
      </Sequence>

      <Vignette intensity={0.45} />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: OUTRO (진짜 관계에 투자하라)
// Panels: 0-2.24 | 3.06-5.12 | 5.94-8.22 | 9.14-11.22
// ============================================

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = toFrames(SCENES.outro.duration);

  // Each line appears when narration says it
  const q1Progress = spring({ frame, fps, config: { damping: 15 } });
  const q2Progress = spring({
    frame: frame - toFrames(3.06),
    fps,
    config: { damping: 15 },
  });
  const ctaProgress = spring({
    frame: frame - toFrames(5.94),
    fps,
    config: { damping: 15 },
  });
  const finalProgress = spring({
    frame: frame - toFrames(9.14),
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <AbsoluteFill>
      <DunbarBackground sceneId="outro" overlayOpacity={0.5} />
      <FloatingParticles color="rgba(245, 158, 11, 0.08)" count={30} />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
      >
        <div style={{ textAlign: "center", maxWidth: 1300 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: THEME.text,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.6,
              marginBottom: 30,
              opacity: q1Progress,
              transform: `translateY(${interpolate(q1Progress, [0, 1], [20, 0])}px)`,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            당신의 <span style={{ color: THEME.accent }}>150명</span>은 누구인가요?
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: THEME.accent,
              fontFamily: FONT_FAMILY.title,
              lineHeight: 1.6,
              marginBottom: 40,
              opacity: q2Progress,
              transform: `translateY(${interpolate(q2Progress, [0, 1], [20, 0])}px)`,
              textShadow: `0 0 60px ${THEME.accent}50`,
            }}
          >
            더 중요하게, 당신의 5명은 누구인가요?
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: THEME.text,
              fontFamily: FONT_FAMILY.body,
              marginBottom: 50,
              opacity: ctaProgress,
              transform: `translateY(${interpolate(ctaProgress, [0, 1], [20, 0])}px)`,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            오늘, 그 사람들에게 연락해 보세요
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: THEME.primary,
              fontFamily: FONT_FAMILY.title,
              opacity: finalProgress,
              transform: `scale(${finalProgress})`,
              textShadow: `0 0 60px ${THEME.primary}50`,
            }}
          >
            진짜 관계는 숫자가 아니라, 깊이입니다
          </div>
        </div>
      </AbsoluteFill>

      <OfficialLightLeak
        seed={7}
        hueShift={45}
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

export const DunbarNumber: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.background }}>
      {/* BGM - Kie.ai Suno generated background music */}
      <Html5Audio
        src={staticFile(`${AI_ASSETS_BASE}/bgm.mp3`)}
        volume={0.15}
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
        from={toFrames(SCENES.science.start)}
        durationInFrames={toFrames(SCENES.science.duration)}
      >
        <ScienceScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/science.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.layers.start)}
        durationInFrames={toFrames(SCENES.layers.duration)}
      >
        <LayersScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/layers.mp3`)} />
      </Sequence>

      <Sequence
        from={toFrames(SCENES.digital.start)}
        durationInFrames={toFrames(SCENES.digital.duration)}
      >
        <DigitalScene />
        <Html5Audio src={staticFile(`${AUDIO_BASE}/digital.mp3`)} />
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
export const dunbarNumberComposition = {
  id: "DunbarNumber",
  component: DunbarNumber,
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
  schema: DunbarNumberSchema,
  defaultProps: {},
};
