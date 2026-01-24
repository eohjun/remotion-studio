/**
 * ThreeCanvas - Wrapper for @remotion/three canvas
 *
 * Provides a standardized Three.js canvas with Remotion integration.
 * Handles camera setup, lighting, and responsive sizing.
 *
 * @example
 * <ThreeCanvas>
 *   <mesh>
 *     <boxGeometry args={[1, 1, 1]} />
 *     <meshStandardMaterial color="orange" />
 *   </mesh>
 * </ThreeCanvas>
 */

import React from "react";
import { ThreeCanvas as RemotionThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";

export interface ThreeCanvasProps {
  children: React.ReactNode;
  /** Camera field of view (default: 75) */
  fov?: number;
  /** Camera position [x, y, z] (default: [0, 0, 5]) */
  cameraPosition?: [number, number, number];
  /** Background color (default: transparent) */
  backgroundColor?: string;
  /** Enable orbit controls for development (default: false) */
  enableControls?: boolean;
  /** Ambient light intensity (default: 0.5) */
  ambientIntensity?: number;
  /** Point light intensity (default: 1) */
  pointLightIntensity?: number;
  /** Point light position [x, y, z] (default: [10, 10, 10]) */
  pointLightPosition?: [number, number, number];
  /** Additional style for the canvas container */
  style?: React.CSSProperties;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  children,
  fov = 75,
  cameraPosition = [0, 0, 5],
  backgroundColor,
  ambientIntensity = 0.5,
  pointLightIntensity = 1,
  pointLightPosition = [10, 10, 10],
  style = {},
}) => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <RemotionThreeCanvas
        linear
        width={width}
        height={height}
        camera={{
          fov,
          position: cameraPosition,
          near: 0.1,
          far: 1000,
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: backgroundColor ?? "transparent",
        }}
      >
        {/* Default lighting setup */}
        <ambientLight intensity={ambientIntensity} />
        <pointLight
          position={pointLightPosition}
          intensity={pointLightIntensity}
        />

        {/* User content */}
        {children}
      </RemotionThreeCanvas>
    </div>
  );
};

export default ThreeCanvas;
