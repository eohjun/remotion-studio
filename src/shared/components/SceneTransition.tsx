import { interpolate, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
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

/**
 * SceneSequence - Enhanced Sequence wrapper with premounting support
 *
 * Premounting pre-renders the next scene before it becomes visible,
 * ensuring smooth transitions without loading delays.
 *
 * @example
 * <SceneSequence from={100} durationInFrames={200} premount>
 *   <MyScene />
 * </SceneSequence>
 */
export interface SceneSequenceProps {
  children: React.ReactNode;
  from: number;
  durationInFrames: number;
  /** Enable premounting (default: true). Set to false for heavy scenes */
  premount?: boolean;
  /** Number of frames to premount (default: 3 seconds worth of frames) */
  premountFrames?: number;
  /** Optional name for debugging */
  name?: string;
}

export const SceneSequence: React.FC<SceneSequenceProps> = ({
  children,
  from,
  durationInFrames,
  premount = true,
  premountFrames,
  name,
}) => {
  const { fps } = useVideoConfig();

  // Default to 3 seconds of premounting
  const defaultPremountFrames = 3 * fps;
  const actualPremountFrames = premount ? (premountFrames ?? defaultPremountFrames) : 0;

  return (
    <Sequence
      from={from}
      durationInFrames={durationInFrames}
      premountFor={actualPremountFrames}
      name={name}
    >
      {children}
    </Sequence>
  );
};

/**
 * SceneWithTransition - Combines SceneSequence with SceneTransition
 *
 * Provides both premounting and fade in/out transitions in one component.
 *
 * @example
 * <SceneWithTransition
 *   from={100}
 *   durationInFrames={200}
 *   fadeInDuration={15}
 *   fadeOutDuration={15}
 * >
 *   <MyScene />
 * </SceneWithTransition>
 */
export interface SceneWithTransitionProps extends SceneSequenceProps {
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

export const SceneWithTransition: React.FC<SceneWithTransitionProps> = ({
  children,
  from,
  durationInFrames,
  premount = true,
  premountFrames,
  name,
  fadeInDuration = 15,
  fadeOutDuration = 15,
}) => {
  return (
    <SceneSequence
      from={from}
      durationInFrames={durationInFrames}
      premount={premount}
      premountFrames={premountFrames}
      name={name}
    >
      <SceneTransition
        durationInFrames={durationInFrames}
        fadeInDuration={fadeInDuration}
        fadeOutDuration={fadeOutDuration}
      >
        {children}
      </SceneTransition>
    </SceneSequence>
  );
};

export default SceneTransition;
