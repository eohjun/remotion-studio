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
 * Optimized particle component with GPU acceleration and viewport culling
 */
const OptimizedParticle: React.FC<{
  particle: ParticleData;
  frame: number;
  direction: "up" | "down" | "random";
  opacity: number;
  height: number;
  width: number;
  viewportCulling: boolean;
  useGPUAcceleration: boolean;
}> = ({
  particle,
  frame,
  direction,
  opacity,
  height,
  width,
  viewportCulling,
  useGPUAcceleration,
}) => {
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
      yOffset = Math.sin((adjustedFrame / cycleLength) * Math.PI * 2) * 50;
      break;
  }

  // Subtle horizontal drift
  const xOffset = Math.sin((adjustedFrame + particle.id * 100) * 0.02) * 20;

  // Calculate position as percentages
  let yPercent = particle.y + (yOffset / height) * 100;
  if (direction === "up" || direction === "down") {
    yPercent = ((yPercent % 100) + 100) % 100;
  }
  const xPercent = particle.x + (xOffset / width) * 100;

  // Viewport culling: skip rendering if particle is off-screen
  // Allow 10% margin for particles partially visible
  if (viewportCulling) {
    const margin = 10;
    if (
      xPercent < -margin ||
      xPercent > 100 + margin ||
      yPercent < -margin ||
      yPercent > 100 + margin
    ) {
      return null;
    }
  }

  // Convert percentage to pixel position for GPU-accelerated transform
  const xPixel = (xPercent / 100) * width;
  const yPixel = (yPercent / 100) * height;

  // GPU-accelerated styles using transform instead of top/left
  const gpuStyle: React.CSSProperties = useGPUAcceleration
    ? {
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${xPixel}px, ${yPixel}px, 0)`,
        willChange: "transform",
      }
    : {
        position: "absolute",
        left: `${xPercent}%`,
        top: `${yPercent}%`,
      };

  // Common particle styles
  const particleStyle: React.CSSProperties = {
    ...gpuStyle,
    width: particle.size,
    height: particle.size,
    opacity: opacity,
    pointerEvents: "none",
    background: particle.color,
  };

  // Render based on particle type
  switch (particle.type) {
    case "blur":
      return (
        <div
          style={{
            ...particleStyle,
            borderRadius: "50%",
            filter: `blur(${particle.size / 2}px)`,
          }}
        />
      );
    case "square":
      return (
        <div
          style={{
            ...particleStyle,
            borderRadius: 2,
          }}
        />
      );
    case "circle":
    default:
      return (
        <div
          style={{
            ...particleStyle,
            borderRadius: "50%",
          }}
        />
      );
  }
};

/**
 * Performance configuration for ParticleField
 */
interface PerformanceConfig {
  /** Maximum particle count (default: 50, max: 200) */
  maxParticles?: number;
  /** Enable viewport culling - hide particles outside visible area (default: true) */
  viewportCulling?: boolean;
  /** Use GPU-accelerated transforms (default: true) */
  useGPUAcceleration?: boolean;
}

/**
 * ParticleField - Floating particle background effect
 *
 * Creates a field of animated particles with configurable appearance
 * and movement patterns. Uses seeded randomization for consistent
 * results across renders.
 *
 * Performance optimizations:
 * - GPU-accelerated CSS transforms
 * - Viewport culling for off-screen particles
 * - Configurable particle limits (default 50, max 200)
 * - Memoized particle generation
 */
export const ParticleField: React.FC<ParticleFieldProps & PerformanceConfig> = ({
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
  // Performance options
  maxParticles = 50,
  viewportCulling = true,
  useGPUAcceleration = true,
}) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  // Clamp particle count between 1 and maxParticles (capped at 200)
  const effectiveMax = Math.min(maxParticles, 200);
  const effectiveCount = Math.min(particleCount, effectiveMax);

  // Generate particles once with memoization
  const particles = useMemo(
    () =>
      generateParticles(
        effectiveCount,
        colors,
        sizeRange,
        speedRange,
        particleType,
        seed
      ),
    [effectiveCount, colors, sizeRange, speedRange, particleType, seed]
  );

  // GPU acceleration style for particle container
  const gpuStyle: React.CSSProperties = useGPUAcceleration
    ? {
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }
    : {};

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      {/* Particle layer with GPU acceleration */}
      <AbsoluteFill style={{ pointerEvents: "none", ...gpuStyle }}>
        {particles.map((particle) => (
          <OptimizedParticle
            key={particle.id}
            particle={particle}
            frame={frame}
            direction={direction}
            opacity={opacity}
            height={height}
            width={width}
            viewportCulling={viewportCulling}
            useGPUAcceleration={useGPUAcceleration}
          />
        ))}
      </AbsoluteFill>
      {/* Content layer */}
      {children}
    </AbsoluteFill>
  );
};

export default ParticleField;
