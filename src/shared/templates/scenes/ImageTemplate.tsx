import React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SPACING,
  RADIUS,
  SPRING_CONFIGS,
} from "../../components/constants";
import { SceneTransition } from "../../components/SceneTransition";
import { AnimatedText, fadeInUp } from "../animations";
import type { BaseSceneProps, ImageItem } from "./types";

export interface ImageTemplateProps extends BaseSceneProps {
  /** Layout type */
  layout: "fullscreen" | "centered" | "side-by-side" | "gallery";
  /** Images to display */
  images: ImageItem[];
  /** Visual effect */
  effect?: "none" | "kenBurns" | "reveal" | "parallax";
  /** Ken Burns direction */
  kenBurnsDirection?: "zoomIn" | "zoomOut" | "panLeft" | "panRight";
  /** Caption text */
  caption?: string;
  /** Caption position */
  captionPosition?: "bottom" | "overlay" | "side";
  /** Enable before/after comparison mode */
  comparisonMode?: boolean;
  /** Labels for comparison mode */
  comparisonLabels?: [string, string];
  /** Background color */
  backgroundColor?: string;
}

// Ken Burns effect calculator (pure function, not a hook)
const getKenBurnsStyle = (
  frame: number,
  durationInFrames: number,
  direction: "zoomIn" | "zoomOut" | "panLeft" | "panRight"
): React.CSSProperties => {
  const progress = frame / durationInFrames;

  switch (direction) {
    case "zoomIn":
      return {
        transform: `scale(${interpolate(progress, [0, 1], [1, 1.15])})`,
      };
    case "zoomOut":
      return {
        transform: `scale(${interpolate(progress, [0, 1], [1.15, 1])})`,
      };
    case "panLeft":
      return {
        transform: `scale(1.1) translateX(${interpolate(progress, [0, 1], [3, -3])}%)`,
      };
    case "panRight":
      return {
        transform: `scale(1.1) translateX(${interpolate(progress, [0, 1], [-3, 3])}%)`,
      };
    default:
      return {};
  }
};

// Sub-component: Fullscreen Image
const FullscreenImage: React.FC<{
  image: ImageItem;
  caption?: string;
  captionPosition: "bottom" | "overlay" | "side";
  effect: "none" | "kenBurns" | "reveal" | "parallax";
  kenBurnsDirection: "zoomIn" | "zoomOut" | "panLeft" | "panRight";
  frame: number;
  fps: number;
  durationInFrames: number;
}> = ({
  image,
  caption,
  captionPosition,
  effect,
  kenBurnsDirection,
  frame,
  fps,
  durationInFrames,
}) => {
  const revealProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const kenBurnsStyle =
    effect === "kenBurns"
      ? getKenBurnsStyle(frame, durationInFrames, kenBurnsDirection)
      : {};

  const revealStyle =
    effect === "reveal"
      ? {
          clipPath: `inset(0 ${interpolate(revealProgress, [0, 1], [100, 0])}% 0 0)`,
        }
      : {};

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={image.src.startsWith("http") ? image.src : staticFile(image.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...kenBurnsStyle,
          ...revealStyle,
        }}
      />

      {/* Overlay gradient for text readability */}
      {caption && captionPosition === "overlay" && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
          }}
        />
      )}

      {/* Caption */}
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: captionPosition === "bottom" ? 0 : SPACING.xl,
            left: 0,
            right: 0,
            padding: SPACING.md,
            backgroundColor:
              captionPosition === "bottom" ? "rgba(0,0,0,0.7)" : "transparent",
            opacity: interpolate(revealProgress, [0.5, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <AnimatedText
            text={caption}
            animation={fadeInUp(15)}
            stagger="word"
            staggerDuration={3}
            delay={30}
            style={{
              fontSize: FONT_SIZES.md,
              color: COLORS.white,
              fontFamily: FONT_FAMILY.body,
              textAlign: "center",
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Sub-component: Centered Image
const CenteredImage: React.FC<{
  image: ImageItem;
  caption?: string;
  frame: number;
  fps: number;
}> = ({ image, caption, frame, fps }) => {
  const progress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: SPACING.xl,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          maxHeight: "70%",
          borderRadius: RADIUS.xl,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          opacity: interpolate(progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
        }}
      >
        <Img
          src={image.src.startsWith("http") ? image.src : staticFile(image.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {(caption || image.caption) && (
        <div
          style={{
            marginTop: SPACING.md,
            opacity: interpolate(progress, [0.5, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <AnimatedText
            text={caption || image.caption || ""}
            animation={fadeInUp(15)}
            stagger="word"
            staggerDuration={3}
            delay={25}
            style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.light,
              fontFamily: FONT_FAMILY.body,
              textAlign: "center",
            }}
          />
        </div>
      )}
    </div>
  );
};

// Sub-component: Side by Side Comparison
const SideBySideImages: React.FC<{
  images: ImageItem[];
  comparisonLabels: [string, string];
  frame: number;
  fps: number;
}> = ({ images, comparisonLabels, frame, fps }) => {
  const leftProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const rightProgress = spring({
    frame: frame - 15,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const dividerProgress = spring({
    frame: frame - 30,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        padding: SPACING.xl,
        gap: SPACING.md,
        alignItems: "center",
      }}
    >
      {/* Left Image */}
      <div
        style={{
          flex: 1,
          height: "80%",
          opacity: interpolate(leftProgress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(leftProgress, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.accent,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 600,
            marginBottom: SPACING.sm,
            textAlign: "center",
          }}
        >
          {comparisonLabels[0]}
        </div>
        <div
          style={{
            height: "calc(100% - 40px)",
            borderRadius: RADIUS.lg,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          <Img
            src={
              images[0]?.src.startsWith("http")
                ? images[0].src
                : staticFile(images[0]?.src || "")
            }
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 4,
          height: "60%",
          backgroundColor: COLORS.accent,
          borderRadius: 2,
          opacity: interpolate(dividerProgress, [0, 1], [0, 1]),
          transform: `scaleY(${interpolate(dividerProgress, [0, 1], [0, 1])})`,
        }}
      />

      {/* Right Image */}
      <div
        style={{
          flex: 1,
          height: "80%",
          opacity: interpolate(rightProgress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(rightProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.accent,
            fontFamily: FONT_FAMILY.body,
            fontWeight: 600,
            marginBottom: SPACING.sm,
            textAlign: "center",
          }}
        >
          {comparisonLabels[1]}
        </div>
        <div
          style={{
            height: "calc(100% - 40px)",
            borderRadius: RADIUS.lg,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          <Img
            src={
              images[1]?.src.startsWith("http")
                ? images[1].src
                : staticFile(images[1]?.src || "")
            }
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-component: Gallery Grid
const GalleryImages: React.FC<{
  images: ImageItem[];
  frame: number;
  fps: number;
}> = ({ images, frame, fps }) => {
  const gridCols = images.length <= 2 ? 2 : images.length <= 4 ? 2 : 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: SPACING.md,
        padding: SPACING.xl,
        height: "100%",
        alignContent: "center",
      }}
    >
      {images.slice(0, 6).map((image, i) => {
        const progress = spring({
          frame: frame - i * 10,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        return (
          <div
            key={i}
            style={{
              borderRadius: RADIUS.lg,
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              opacity: interpolate(progress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
            }}
          >
            <Img
              src={
                image.src.startsWith("http")
                  ? image.src
                  : staticFile(image.src)
              }
              style={{
                width: "100%",
                height: 250,
                objectFit: "cover",
              }}
            />
            {image.caption && (
              <div
                style={{
                  padding: SPACING.sm,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  fontSize: FONT_SIZES.xs,
                  color: COLORS.light,
                  fontFamily: FONT_FAMILY.body,
                  textAlign: "center",
                }}
              >
                {image.caption}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ImageTemplate: React.FC<ImageTemplateProps> = ({
  layout,
  images,
  effect = "none",
  kenBurnsDirection = "zoomIn",
  caption,
  captionPosition = "bottom",
  comparisonMode = false,
  comparisonLabels = ["Before", "After"],
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneContent = (
    <AbsoluteFill style={{ backgroundColor, ...style }}>
      {layout === "fullscreen" && images[0] && (
        <FullscreenImage
          image={images[0]}
          caption={caption || images[0].caption}
          captionPosition={captionPosition}
          effect={effect}
          kenBurnsDirection={kenBurnsDirection}
          frame={frame}
          fps={fps}
          durationInFrames={durationInFrames}
        />
      )}

      {layout === "centered" && images[0] && (
        <CenteredImage
          image={images[0]}
          caption={caption || images[0].caption}
          frame={frame}
          fps={fps}
        />
      )}

      {(layout === "side-by-side" || comparisonMode) && images.length >= 2 && (
        <SideBySideImages
          images={images}
          comparisonLabels={comparisonLabels}
          frame={frame}
          fps={fps}
        />
      )}

      {layout === "gallery" && images.length > 0 && (
        <GalleryImages images={images} frame={frame} fps={fps} />
      )}
    </AbsoluteFill>
  );

  if (useTransition) {
    return (
      <SceneTransition durationInFrames={durationInFrames}>
        {sceneContent}
      </SceneTransition>
    );
  }

  return sceneContent;
};

export default ImageTemplate;
