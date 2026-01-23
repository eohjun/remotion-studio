import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { noise2D } from "@remotion/noise";
import { FilmGrainProps, GrainBlendMode } from "./types";

/**
 * Get CSS mix-blend-mode from our blend mode type
 */
function getBlendMode(mode: GrainBlendMode): React.CSSProperties["mixBlendMode"] {
  switch (mode) {
    case "overlay":
      return "overlay";
    case "multiply":
      return "multiply";
    case "soft-light":
      return "soft-light";
    case "screen":
      return "screen";
    default:
      return "overlay";
  }
}

/**
 * Generate a grain canvas using noise
 */
function generateGrainPattern(
  width: number,
  height: number,
  seed: number,
  monochrome: boolean
): string {
  // Create smaller canvas for performance (will be scaled up)
  const scale = 4; // 4x downscale for performance
  const canvasWidth = Math.ceil(width / scale);
  const canvasHeight = Math.ceil(height / scale);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  const imageData = ctx.createImageData(canvasWidth, canvasHeight);
  const data = imageData.data;

  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      const index = (y * canvasWidth + x) * 4;

      // Use noise2D for organic grain pattern
      const noiseValue = noise2D(seed, x * 0.1, y * 0.1);
      const normalizedNoise = (noiseValue + 1) / 2; // 0 to 1

      // Add some random variation for more natural grain
      const randomOffset = random(`grain-${seed}-${x}-${y}`) * 0.3;
      const grainValue = Math.max(
        0,
        Math.min(255, (normalizedNoise + randomOffset) * 255)
      );

      if (monochrome) {
        data[index] = grainValue;
        data[index + 1] = grainValue;
        data[index + 2] = grainValue;
      } else {
        // Slight color variation for color grain
        data[index] = grainValue + random(`r-${seed}-${x}-${y}`) * 20 - 10;
        data[index + 1] = grainValue + random(`g-${seed}-${x}-${y}`) * 20 - 10;
        data[index + 2] = grainValue + random(`b-${seed}-${x}-${y}`) * 20 - 10;
      }
      data[index + 3] = 255; // Full alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

/**
 * FilmGrain - Cinematic film grain overlay effect
 *
 * Adds organic noise texture to simulate analog film grain.
 * Uses @remotion/noise for consistent, deterministic patterns.
 *
 * Performance note: Animated grain generates new patterns each frame,
 * which may impact rendering performance. Use static grain for better
 * performance on longer videos.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  intensity = 0.15,
  animated = true,
  monochrome = true,
  blendMode = "overlay",
  speed = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate seed based on frame for animation
  const seed = animated ? Math.floor(frame * speed) : 0;

  // Generate grain pattern (memoized for static grain)
  const grainDataUrl = useMemo(() => {
    // Check if we're in a browser environment
    if (typeof document === "undefined") {
      return "";
    }
    return generateGrainPattern(width, height, seed, monochrome);
  }, [width, height, seed, monochrome]);

  const grainStyle: React.CSSProperties = {
    backgroundImage: grainDataUrl ? `url(${grainDataUrl})` : undefined,
    backgroundSize: "cover",
    opacity: intensity,
    mixBlendMode: getBlendMode(blendMode),
    pointerEvents: "none",
    // Slight scaling to hide pattern edges
    transform: "scale(1.1)",
  };

  return (
    <AbsoluteFill>
      {children}
      {grainDataUrl && <AbsoluteFill style={grainStyle} />}
    </AbsoluteFill>
  );
};

export default FilmGrain;
