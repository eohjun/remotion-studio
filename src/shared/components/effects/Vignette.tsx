import React from "react";
import { AbsoluteFill } from "remotion";
import { VignetteProps } from "./types";

/**
 * Vignette - Cinematic edge darkening effect
 *
 * Creates a radial gradient overlay that darkens the edges
 * of the frame, drawing focus to the center content.
 *
 * Uses CSS radial gradient for GPU-accelerated rendering.
 */
export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.3,
  color = "black",
  size = 0.5,
  softness = 0.5,
  children,
}) => {
  // Calculate the gradient stops based on size and softness
  // Size controls where the darkening starts (larger = more visible center)
  // Softness controls the gradient transition smoothness
  const innerStop = Math.max(0, size * 100);
  const outerStop = Math.min(100, innerStop + softness * 100);

  const vignetteStyle: React.CSSProperties = {
    background: `radial-gradient(ellipse at center, transparent ${innerStop}%, ${color} ${outerStop}%)`,
    opacity: intensity,
    pointerEvents: "none",
  };

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={vignetteStyle} />
    </AbsoluteFill>
  );
};

export default Vignette;
