/**
 * DeviceMockup - 3D phone and tablet mockups
 *
 * Renders a 3D device with customizable screen content.
 * Useful for app demos, UI showcases, and product videos.
 *
 * @example
 * <ThreeCanvas>
 *   <DeviceMockup
 *     device="phone"
 *     screenContent={<MyAppScreen />}
 *     rotation={[0.1, 0.3, 0]}
 *   />
 * </ThreeCanvas>
 */

import React, { useRef } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import * as THREE from "three";

export type DeviceType = "phone" | "tablet" | "laptop";

// Device dimensions (normalized units)
const DEVICE_SPECS = {
  phone: {
    width: 0.75,
    height: 1.6,
    depth: 0.08,
    screenInset: 0.05,
    cornerRadius: 0.1,
    bezelColor: "#1a1a1a",
  },
  tablet: {
    width: 1.5,
    height: 2,
    depth: 0.06,
    screenInset: 0.08,
    cornerRadius: 0.08,
    bezelColor: "#2a2a2a",
  },
  laptop: {
    width: 2.4,
    height: 1.5,
    depth: 0.04,
    screenInset: 0.1,
    cornerRadius: 0.05,
    bezelColor: "#3a3a3a",
  },
};

export interface DeviceMockupProps {
  /** Device type (default: phone) */
  device?: DeviceType;
  /** Position [x, y, z] (default: [0, 0, 0]) */
  position?: [number, number, number];
  /** Rotation [x, y, z] in radians (default: [0, 0, 0]) */
  rotation?: [number, number, number];
  /** Scale (default: 1) */
  scale?: number;
  /** Screen color (default: gradient blue) */
  screenColor?: string;
  /** Bezel color override */
  bezelColor?: string;
  /** Enable entry animation (default: true) */
  animated?: boolean;
  /** Animation delay in frames */
  delay?: number;
  /** Enable floating animation */
  float?: boolean;
  /** Float amplitude (default: 0.05) */
  floatAmplitude?: number;
  /** Enable rotation animation */
  autoRotate?: boolean;
  /** Rotation speed (default: 0.005) */
  rotationSpeed?: number;
  /** Screen texture (for advanced use) */
  screenTexture?: THREE.Texture;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  device = "phone",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screenColor = "#0066ff",
  bezelColor,
  animated = true,
  delay = 0,
  float = false,
  floatAmplitude = 0.05,
  autoRotate = false,
  rotationSpeed = 0.005,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groupRef = useRef<THREE.Group>(null);

  const specs = DEVICE_SPECS[device];

  // Entry animation
  const progress = animated
    ? spring({
        frame: frame - delay,
        fps,
        config: {
          damping: 80,
          stiffness: 150,
          mass: 0.8,
        },
      })
    : 1;

  // Floating animation
  const floatY = float ? Math.sin(frame * 0.03) * floatAmplitude : 0;

  // Auto rotation
  const autoRotateY = autoRotate ? frame * rotationSpeed : 0;

  // Calculate animated position and scale
  const animatedScale = scale * progress;
  const animatedY = position[1] + floatY + (1 - progress) * 0.5;

  return (
    <group
      ref={groupRef}
      position={[position[0], animatedY, position[2]]}
      rotation={[rotation[0], rotation[1] + autoRotateY, rotation[2]]}
      scale={[animatedScale, animatedScale, animatedScale]}
    >
      {/* Device body (bezel) */}
      <mesh position={[0, 0, -specs.depth / 2]}>
        <boxGeometry args={[specs.width, specs.height, specs.depth]} />
        <meshStandardMaterial
          color={bezelColor ?? specs.bezelColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry
          args={[
            specs.width - specs.screenInset * 2,
            specs.height - specs.screenInset * 2,
          ]}
        />
        <meshBasicMaterial color={screenColor} />
      </mesh>

      {/* Screen glow effect */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry
          args={[
            specs.width - specs.screenInset,
            specs.height - specs.screenInset,
          ]}
        />
        <meshBasicMaterial
          color={screenColor}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Camera notch (for phone) */}
      {device === "phone" && (
        <mesh position={[0, specs.height / 2 - 0.12, 0.002]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      )}

      {/* Home button area (for tablet) */}
      {device === "tablet" && (
        <mesh position={[0, -specs.height / 2 + 0.12, 0.002]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
      )}
    </group>
  );
};

/**
 * PhoneMockup - Convenience component for phone mockups
 */
export const PhoneMockup: React.FC<Omit<DeviceMockupProps, "device">> = (
  props
) => <DeviceMockup {...props} device="phone" />;

/**
 * TabletMockup - Convenience component for tablet mockups
 */
export const TabletMockup: React.FC<Omit<DeviceMockupProps, "device">> = (
  props
) => <DeviceMockup {...props} device="tablet" />;

/**
 * LaptopMockup - Convenience component for laptop mockups
 */
export const LaptopMockup: React.FC<Omit<DeviceMockupProps, "device">> = (
  props
) => <DeviceMockup {...props} device="laptop" />;

export default DeviceMockup;
