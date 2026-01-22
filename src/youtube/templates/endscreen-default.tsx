/**
 * Default YouTube endscreen template
 * Displays subscribe CTA and related video placeholders
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

/** Endscreen props */
export interface EndscreenProps {
  /** Channel name */
  channelName?: string;
  /** Subscribe button text */
  subscribeText?: string;
  /** "Watch next" label */
  watchNextLabel?: string;
  /** Background color */
  backgroundColor?: string;
  /** Accent color */
  accentColor?: string;
  /** Text color */
  textColor?: string;
  /** Show subscribe animation */
  showSubscribe?: boolean;
  /** Duration in frames (default: 600 = 20s at 30fps) */
  duration?: number;
}

/**
 * Default YouTube Endscreen Component
 *
 * YouTube endscreens should be 5-20 seconds at the end of a video.
 * This component provides:
 * - Animated subscribe button
 * - Two video placeholder slots (YouTube overlays actual videos)
 * - Clean, professional design
 */
export const EndscreenDefault: React.FC<EndscreenProps> = ({
  channelName = "채널명",
  subscribeText = "구독하기",
  watchNextLabel = "다음 영상 보기",
  backgroundColor = "#0a0a0a",
  accentColor = "#ff0000",
  textColor = "#ffffff",
  showSubscribe = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const progress = Math.min(frame / 30, 1);

  // Spring animations for elements
  const subscribeScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const cardOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardSlide = interpolate(frame, [10, 40], [50, 0], {
    extrapolateRight: "clamp",
  });

  // Pulse animation for subscribe button
  const pulsePhase = (frame % (fps * 2)) / (fps * 2);
  const pulseScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Noto Sans KR', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Channel name */}
      <div
        style={{
          color: textColor,
          fontSize: 32,
          fontWeight: 300,
          marginBottom: 40,
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [-20, 0])}px)`,
        }}
      >
        {channelName}
      </div>

      {/* Subscribe button */}
      {showSubscribe && (
        <div
          style={{
            backgroundColor: accentColor,
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 600,
            padding: "16px 48px",
            borderRadius: 4,
            marginBottom: 60,
            transform: `scale(${subscribeScale * pulseScale})`,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255, 0, 0, 0.3)",
          }}
        >
          {subscribeText}
        </div>
      )}

      {/* Watch next label */}
      <div
        style={{
          color: textColor,
          fontSize: 20,
          fontWeight: 400,
          marginBottom: 30,
          opacity: cardOpacity,
        }}
      >
        {watchNextLabel}
      </div>

      {/* Video card placeholders */}
      <div
        style={{
          display: "flex",
          gap: 30,
          opacity: cardOpacity,
          transform: `translateY(${cardSlide}px)`,
        }}
      >
        {/* Video card 1 */}
        <VideoCardPlaceholder
          index={1}
          textColor={textColor}
          accentColor={accentColor}
        />

        {/* Video card 2 */}
        <VideoCardPlaceholder
          index={2}
          textColor={textColor}
          accentColor={accentColor}
        />
      </div>

      {/* Footer text */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          color: textColor,
          opacity: 0.5,
          fontSize: 14,
        }}
      >
        시청해 주셔서 감사합니다!
      </div>
    </AbsoluteFill>
  );
};

/** Video card placeholder component */
const VideoCardPlaceholder: React.FC<{
  index: number;
  textColor: string;
  accentColor: string;
}> = ({ index, textColor, accentColor }) => {
  return (
    <div
      style={{
        width: 320,
        height: 180,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: `2px dashed ${accentColor}40`,
      }}
    >
      {/* Play icon */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: accentColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            borderLeft: "20px solid white",
            marginLeft: 4,
          }}
        />
      </div>
      <div
        style={{
          color: textColor,
          fontSize: 14,
          opacity: 0.7,
        }}
      >
        추천 영상 {index}
      </div>
    </div>
  );
};

export default EndscreenDefault;
