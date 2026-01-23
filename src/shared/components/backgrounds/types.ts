import React from "react";

/**
 * Animation modes for gradient backgrounds
 */
export type GradientAnimationMode = "cycle" | "rotate" | "shift" | "pulse";

/**
 * Props for AnimatedGradient component
 */
export interface AnimatedGradientProps {
  /** Array of colors to use in the gradient */
  colors: string[];
  /** How the gradient animates */
  animationMode: GradientAnimationMode;
  /** Duration of one animation cycle in frames */
  cycleDuration?: number;
  /** Initial angle for gradient (degrees) */
  angle?: number;
  /** Optional children to render on top */
  children?: React.ReactNode;
  /** Additional style overrides */
  style?: React.CSSProperties;
}

/**
 * Particle shape types
 */
export type ParticleType = "circle" | "square" | "blur";

/**
 * Direction of particle movement
 */
export type ParticleDirection = "up" | "down" | "random";

/**
 * Props for ParticleField component
 */
export interface ParticleFieldProps {
  /** Number of particles (default: 20, max recommended: 30) */
  particleCount?: number;
  /** Shape of particles */
  particleType?: ParticleType;
  /** Colors for particles */
  colors?: string[];
  /** Min and max size range in pixels */
  sizeRange?: [number, number];
  /** Min and max speed range */
  speedRange?: [number, number];
  /** Overall opacity (0-1) */
  opacity?: number;
  /** Seed for deterministic randomization */
  seed?: number;
  /** Direction of particle movement */
  direction?: ParticleDirection;
  /** Optional children to render on top */
  children?: React.ReactNode;
  /** Additional style overrides */
  style?: React.CSSProperties;
}

/**
 * Shape types for floating shapes
 */
export type ShapeType = "circle" | "square" | "triangle" | "hexagon";

/**
 * Props for FloatingShapes component
 */
export interface FloatingShapesProps {
  /** Number of shapes (default: 10) */
  shapeCount?: number;
  /** Types of shapes to use */
  shapeTypes?: ShapeType[];
  /** Colors for shapes */
  colors?: string[];
  /** Min and max size range in pixels */
  sizeRange?: [number, number];
  /** Overall opacity (0-1) */
  opacity?: number;
  /** Seed for deterministic randomization */
  seed?: number;
  /** Enable rotation animation */
  rotate?: boolean;
  /** Optional children to render on top */
  children?: React.ReactNode;
  /** Additional style overrides */
  style?: React.CSSProperties;
}

/**
 * Internal particle data structure
 */
export interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  type: ParticleType;
  delay: number;
}

/**
 * Internal shape data structure
 */
export interface ShapeData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  type: ShapeType;
  rotationSpeed: number;
  floatSpeed: number;
  delay: number;
}
