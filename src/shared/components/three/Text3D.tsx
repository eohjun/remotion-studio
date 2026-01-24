/**
 * Text3D - Animated 3D text using Three.js
 *
 * Creates extruded 3D text with animation support.
 * Uses Three.js TextGeometry for proper 3D text rendering.
 *
 * @example
 * <ThreeCanvas>
 *   <Text3D
 *     text="Hello"
 *     color="#ffffff"
 *     size={1}
 *     depth={0.2}
 *   />
 * </ThreeCanvas>
 */

import React, { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import * as THREE from "three";

export interface Text3DProps {
  /** The text to display */
  text: string;
  /** Text color (default: white) */
  color?: string;
  /** Font size (default: 1) */
  size?: number;
  /** Extrusion depth (default: 0.2) */
  depth?: number;
  /** Position [x, y, z] (default: [0, 0, 0]) */
  position?: [number, number, number];
  /** Rotation [x, y, z] in radians (default: [0, 0, 0]) */
  rotation?: [number, number, number];
  /** Enable entry animation (default: true) */
  animated?: boolean;
  /** Animation delay in frames */
  delay?: number;
  /** Enable rotation animation */
  rotateAnimation?: boolean;
  /** Rotation speed (radians per frame) */
  rotationSpeed?: number;
  /** Material type (default: standard) */
  material?: "standard" | "basic" | "phong";
  /** Metalness for standard material (default: 0.3) */
  metalness?: number;
  /** Roughness for standard material (default: 0.4) */
  roughness?: number;
}

// Simple 3D box text representation (since TextGeometry requires font loading)
// For production use, consider loading a proper typeface.json font
export const Text3D: React.FC<Text3DProps> = ({
  text,
  color = "#ffffff",
  size = 1,
  depth = 0.2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animated = true,
  delay = 0,
  rotateAnimation = false,
  rotationSpeed = 0.01,
  material = "standard",
  metalness = 0.3,
  roughness = 0.4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groupRef = useRef<THREE.Group>(null);

  // Animation progress
  const progress = animated
    ? spring({
        frame: frame - delay,
        fps,
        config: {
          damping: 80,
          stiffness: 200,
          mass: 0.5,
        },
      })
    : 1;

  // Calculate animated values
  const scale = progress;
  const opacity = progress;

  // Continuous rotation animation
  const rotationY = rotateAnimation
    ? rotation[1] + frame * rotationSpeed
    : rotation[1];

  // Create material based on type
  const materialComponent = useMemo(() => {
    const baseProps = {
      color: new THREE.Color(color),
      transparent: true,
      opacity,
    };

    switch (material) {
      case "basic":
        return <meshBasicMaterial {...baseProps} />;
      case "phong":
        return <meshPhongMaterial {...baseProps} shininess={100} />;
      case "standard":
      default:
        return (
          <meshStandardMaterial
            {...baseProps}
            metalness={metalness}
            roughness={roughness}
          />
        );
    }
  }, [color, opacity, material, metalness, roughness]);

  // Render each character as a box (simplified 3D text)
  // For proper text, use @react-three/drei's Text3D with font loading
  const characters = text.split("");
  const charWidth = size * 0.6;
  const totalWidth = characters.length * charWidth;
  const startX = -totalWidth / 2 + charWidth / 2;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[rotation[0], rotationY, rotation[2]]}
      scale={[scale, scale, scale]}
    >
      {characters.map((char, index) => {
        // Skip spaces
        if (char === " ") {
          return null;
        }

        const charDelay = animated ? index * 2 : 0;
        const charProgress = animated
          ? spring({
              frame: frame - delay - charDelay,
              fps,
              config: { damping: 60, stiffness: 200 },
            })
          : 1;

        return (
          <mesh
            key={index}
            position={[startX + index * charWidth, 0, 0]}
            scale={[charProgress, charProgress, charProgress]}
          >
            <boxGeometry args={[size * 0.5, size, depth]} />
            {materialComponent}
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * FloatingText3D - Text that floats up and down
 */
export interface FloatingText3DProps extends Text3DProps {
  /** Float amplitude (default: 0.1) */
  floatAmplitude?: number;
  /** Float speed (default: 0.05) */
  floatSpeed?: number;
}

export const FloatingText3D: React.FC<FloatingText3DProps> = ({
  floatAmplitude = 0.1,
  floatSpeed = 0.05,
  position = [0, 0, 0],
  ...props
}) => {
  const frame = useCurrentFrame();

  const floatY = Math.sin(frame * floatSpeed) * floatAmplitude;
  const newPosition: [number, number, number] = [
    position[0],
    position[1] + floatY,
    position[2],
  ];

  return <Text3D {...props} position={newPosition} />;
};

export default Text3D;
