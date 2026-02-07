/**
 * AIImage - Component for displaying AI-generated images
 *
 * Handles loading states and fallback for AI-generated assets
 * stored in public/videos/{compositionId}/ai-assets/
 *
 * @example
 * ```tsx
 * <AIImage
 *   src={staticFile("videos/MyVideo/ai-assets/scene1-bg.png")}
 *   alt="Scene background"
 *   fit="cover"
 * />
 * ```
 */

import React from "react";
import { AbsoluteFill, Img } from "remotion";

export interface AIImageProps {
  /** Image source URL or staticFile path */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Object-fit behavior */
  fit?: React.CSSProperties["objectFit"];
  /** Additional styles */
  style?: React.CSSProperties;
  /** Fallback content when image fails to load */
  fallback?: React.ReactNode;
  /** Fallback background color */
  fallbackColor?: string;
}

export const AIImage: React.FC<AIImageProps> = ({
  src,
  alt = "AI generated image",
  fit = "cover",
  style,
  fallback,
  fallbackColor = "#1a1a2e",
}) => {
  if (!src) {
    return (
      <AbsoluteFill style={{ backgroundColor: fallbackColor }}>
        {fallback}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={style}>
      <Img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
        }}
      />
    </AbsoluteFill>
  );
};

export default AIImage;
