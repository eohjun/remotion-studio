import { interpolate, useCurrentFrame } from "remotion";
import React from "react";

export interface SceneTransitionProps {
  children: React.ReactNode;
  durationInFrames: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  durationInFrames,
  fadeInDuration = 15,
  fadeOutDuration = 15,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeInDuration, durationInFrames - fadeOutDuration, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <div style={{ opacity, width: "100%", height: "100%" }}>{children}</div>;
};

export default SceneTransition;
