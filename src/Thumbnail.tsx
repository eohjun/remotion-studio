/**
 * Thumbnail - Dynamic thumbnail composition for video previews
 *
 * This composition is designed for generating static images (thumbnails)
 * via Remotion's renderStill API or the thumbnail server.
 *
 * @example
 * npx remotion still Thumbnail --props='{"title":"My Video"}' out/thumb.png
 */

import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Schema for thumbnail props
export const thumbnailSchema = z.object({
  /** Main title text */
  title: z.string().default("Video Title"),
  /** Subtitle text (optional) */
  subtitle: z.string().optional(),
  /** Primary color for gradient/accents */
  primaryColor: zColor().default("#667eea"),
  /** Secondary color for gradient */
  secondaryColor: zColor().default("#764ba2"),
  /** Background style */
  backgroundStyle: z.enum(["gradient", "solid", "dark"]).default("gradient"),
  /** Show channel logo */
  showLogo: z.boolean().default(true),
  /** Title font size */
  titleSize: z.enum(["small", "medium", "large"]).default("large"),
  /** Emoji or icon to display */
  icon: z.string().optional(),
});

export type ThumbnailProps = z.infer<typeof thumbnailSchema>;

// Font sizes based on size prop
const TITLE_SIZES = {
  small: 64,
  medium: 96,
  large: 128,
};

export const Thumbnail: React.FC<ThumbnailProps> = ({
  title,
  subtitle,
  primaryColor,
  secondaryColor,
  backgroundStyle,
  showLogo,
  titleSize,
  icon,
}) => {
  const getBackground = () => {
    switch (backgroundStyle) {
      case "solid":
        return primaryColor;
      case "dark":
        return "#1a1a2e";
      case "gradient":
      default:
        return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    }
  };

  const fontSize = TITLE_SIZES[titleSize];

  return (
    <AbsoluteFill
      style={{
        background: getBackground(),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Icon */}
      {icon && (
        <div
          style={{
            fontSize: fontSize * 1.2,
            marginBottom: 24,
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Pretendard', 'SF Pro Display', sans-serif",
          fontSize,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.1,
          textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          maxWidth: "90%",
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily: "'Pretendard', 'SF Pro Display', sans-serif",
            fontSize: fontSize * 0.4,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            margin: 0,
            marginTop: 24,
            maxWidth: "80%",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Channel logo placeholder */}
      {showLogo && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: "12px 24px",
            borderRadius: 8,
            fontFamily: "'Pretendard', 'SF Pro Display', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "white",
          }}
        >
          Channel
        </div>
      )}

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default Thumbnail;
