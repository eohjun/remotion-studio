import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ParticleFieldProps, ParticleData, ParticleType } from "./types";

/**
 * Seeded random number generator for deterministic results
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generate particle data with deterministic randomization
 */
function generateParticles(
  count: number,
  colors: string[],
  sizeRange: [number, number],
  speedRange: [number, number],
  particleType: ParticleType,
  seed: number
): ParticleData[] {
  const random = seededRandom(seed);

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: random() * 100,
    y: random() * 100,
    size: sizeRange[0] + random() * (sizeRange[1] - sizeRange[0]),
    speed: speedRange[0] + random() * (speedRange[1] - speedRange[0]),
    color: colors[Math.floor(random() * colors.length)],
    type: particleType,
    delay: random() * 60, // Random initial delay up to 60 frames
  }));
}

/**
 * Single particle component
 */
const Particle: React.FC<{
  particle: ParticleData;
  frame: number;
  direction: "up" | "down" | "random";
  opacity: number;
  height: number;
}> = ({ particle, frame, direction, opacity, height }) => {
  // Calculate position based on time and direction
  const adjustedFrame = frame + particle.delay;
  const cycleLength = height / particle.speed;

  let yOffset: number;
  switch (direction) {
    case "up":
      yOffset = -((adjustedFrame * particle.speed) % (height + particle.size * 2));
      break;
    case "down":
      yOffset = (adjustedFrame * particle.speed) % (height + particle.size * 2);
      break;
    case "random":
    default:
      // Gentle floating motion
      yOffset = Math.sin(adjustedFrame / cycleLength * Math.PI * 2) * 50;
      break;
  }

  // Subtle horizontal drift
  const xOffset = Math.sin((adjustedFrame + particle.id * 100) * 0.02) * 20;

  // Calculate position
  let y = particle.y + (yOffset / height) * 100;
  if (direction === "up") {
    y = ((y % 100) + 100) % 100;
  } else if (direction === "down") {
    y = ((y % 100) + 100) % 100;
  }

  const x = particle.x + (xOffset / 1920) * 100;

  // Render based on particle type
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    width: particle.size,
    height: particle.size,
    opacity: opacity,
    pointerEvents: "none",
  };

  switch (particle.type) {
    case "blur":
      return (
        <div
          style={{
            ...baseStyle,
            background: particle.color,
            borderRadius: "50%",
            filter: `blur(${particle.size / 2}px)`,
          }}
        />
      );
    case "square":
      return (
        <div
          style={{
            ...baseStyle,
            background: particle.color,
            borderRadius: 2,
          }}
        />
      );
    case "circle":
    default:
      return (
        <div
          style={{
            ...baseStyle,
            background: particle.color,
            borderRadius: "50%",
          }}
        />
      );
  }
};

/**
 * ParticleField - Floating particle background effect
 *
 * Creates a field of animated particles with configurable appearance
 * and movement patterns. Uses seeded randomization for consistent
 * results across renders.
 *
 * Performance note: Recommended max 30 particles for 30fps
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  particleCount = 20,
  particleType = "circle",
  colors = ["rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.3)"],
  sizeRange = [4, 12],
  speedRange = [0.5, 2],
  opacity = 0.6,
  seed = 12345,
  direction = "random",
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Generate particles once with memoization
  const particles = useMemo(
    () =>
      generateParticles(
        Math.min(particleCount, 30), // Cap at 30 for performance
        colors,
        sizeRange,
        speedRange,
        particleType,
        seed
      ),
    [particleCount, colors, sizeRange, speedRange, particleType, seed]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      {/* Particle layer */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            particle={particle}
            frame={frame}
            direction={direction}
            opacity={opacity}
            height={height}
          />
        ))}
      </AbsoluteFill>
      {/* Content layer */}
      {children}
    </AbsoluteFill>
  );
};

export default ParticleField;
