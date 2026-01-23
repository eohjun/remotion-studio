/**
 * Custom zoom transition presentation
 *
 * Creates a zoom transition where one scene zooms in/out
 * while the other appears/disappears.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

export type ZoomProps = {
  /** Zoom direction: "in" zooms the exiting scene out, "out" zooms it in */
  direction?: "in" | "out";
  /** Maximum scale factor (default: 1.5) */
  scaleFactor?: number;
  /** Whether to fade during zoom (default: true) */
  withFade?: boolean;
};

const ZoomPresentation: React.FC<
  TransitionPresentationComponentProps<ZoomProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const { direction = "in", scaleFactor = 1.5, withFade = true } = passedProps;
  const isEntering = presentationDirection === "entering";

  let scale: number;
  let opacity: number;

  if (direction === "in") {
    // Zoom in: exiting scene scales up and fades, entering scene appears at normal scale
    if (isEntering) {
      scale = interpolate(presentationProgress, [0, 1], [0.8, 1]);
      opacity = presentationProgress;
    } else {
      scale = interpolate(presentationProgress, [0, 1], [1, scaleFactor]);
      opacity = withFade ? 1 - presentationProgress : 1;
    }
  } else {
    // Zoom out: exiting scene scales down and fades, entering scene zooms in from large
    if (isEntering) {
      scale = interpolate(presentationProgress, [0, 1], [scaleFactor, 1]);
      opacity = presentationProgress;
    } else {
      scale = interpolate(presentationProgress, [0, 1], [1, 0.8]);
      opacity = withFade ? 1 - presentationProgress : 1;
    }
  }

  return (
    <AbsoluteFill
      style={{
        opacity: withFade ? opacity : 1,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Create a zoom transition presentation
 */
export const zoom = (props: ZoomProps = {}): TransitionPresentation<ZoomProps> => {
  return {
    component: ZoomPresentation,
    props,
  };
};

export default zoom;
