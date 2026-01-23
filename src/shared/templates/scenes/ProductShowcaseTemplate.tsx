import React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
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
import { AnimatedText, fadeInUp, fadeInLeft, scaleIn, popIn, combine } from "../animations";
import type { BaseSceneProps } from "./types";

/**
 * Layout style for product showcase
 */
export type ShowcaseLayout = "hero" | "features" | "specs" | "comparison" | "pricing";

/**
 * Feature item
 */
export interface FeatureItem {
  /** Feature icon or emoji */
  icon: string;
  /** Feature title */
  title: string;
  /** Feature description */
  description?: string;
}

/**
 * Specification item
 */
export interface SpecItem {
  /** Spec label */
  label: string;
  /** Spec value */
  value: string;
  /** Optional highlight */
  highlight?: boolean;
}

/**
 * Rating display
 */
export interface RatingInfo {
  /** Rating value (0-5) */
  score: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Rating source */
  source?: string;
}

/**
 * Props for ProductShowcaseTemplate component
 */
export interface ProductShowcaseTemplateProps extends BaseSceneProps {
  /** Layout style */
  layout?: ShowcaseLayout;
  /** Product name */
  productName: string;
  /** Product tagline or subtitle */
  tagline?: string;
  /** Product image URL */
  productImage?: string;
  /** Product badge (e.g., "NEW", "SALE") */
  badge?: string;
  /** Badge color */
  badgeColor?: string;
  /** Feature list */
  features?: FeatureItem[];
  /** Specification list */
  specs?: SpecItem[];
  /** Price display */
  price?: string;
  /** Original price (for discount display) */
  originalPrice?: string;
  /** Rating information */
  rating?: RatingInfo;
  /** Call to action text */
  ctaText?: string;
  /** Accent color for highlights */
  accentColor?: string;
  /** Background color */
  backgroundColor?: string;
}

/**
 * Star rating component
 */
const StarRating: React.FC<{ score: number; size: number }> = ({ score, size }) => {
  const fullStars = Math.floor(score);
  const hasHalf = score % 1 >= 0.5;

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i < fullStars || (i === fullStars && hasHalf) ? "#ffc107" : "rgba(255,255,255,0.2)",
          }}
        >
          {i < fullStars ? "★" : i === fullStars && hasHalf ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

/**
 * ProductShowcaseTemplate - Product presentation and review style
 *
 * Designed for product reviews, feature presentations, and promotional content.
 * Supports multiple layouts for different use cases.
 *
 * @example
 * ```tsx
 * <ProductShowcaseTemplate
 *   layout="hero"
 *   productName="Amazing Product"
 *   tagline="The future of innovation"
 *   productImage="/images/product.png"
 *   badge="NEW"
 *   features={[
 *     { icon: "⚡", title: "Fast", description: "Lightning quick" },
 *     { icon: "🛡️", title: "Secure", description: "Bank-level security" }
 *   ]}
 *   price="$99"
 *   rating={{ score: 4.5, reviewCount: 1234 }}
 *   durationInFrames={300}
 * />
 * ```
 */
export const ProductShowcaseTemplate: React.FC<ProductShowcaseTemplateProps> = ({
  layout = "hero",
  productName,
  tagline,
  productImage,
  badge,
  badgeColor = "#dc3545",
  features,
  specs,
  price,
  originalPrice,
  rating,
  ctaText,
  accentColor = COLORS.accent,
  backgroundColor = COLORS.dark,
  durationInFrames,
  useTransition = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const titleProgress = spring({ frame, fps, config: SPRING_CONFIGS.snappy });
  const imageProgress = spring({ frame: frame - 10, fps, config: SPRING_CONFIGS.bouncy });
  const featuresProgress = spring({ frame: frame - 25, fps, config: SPRING_CONFIGS.normal });
  const priceProgress = spring({ frame: frame - 40, fps, config: SPRING_CONFIGS.snappy });

  const renderHeroLayout = () => (
    <div
      style={{
        display: "flex",
        flex: 1,
        padding: SPACING.xl,
        gap: SPACING.xl,
      }}
    >
      {/* Left: Product Info */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {badge && (
          <div
            style={{
              display: "inline-block",
              backgroundColor: badgeColor,
              padding: "6px 16px",
              borderRadius: 20,
              marginBottom: SPACING.sm,
              width: "fit-content",
              opacity: interpolate(titleProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(titleProgress, [0, 1], [0.8, 1])})`,
            }}
          >
            <span
              style={{
                fontSize: FONT_SIZES.xs,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                letterSpacing: 1,
              }}
            >
              {badge}
            </span>
          </div>
        )}

        <h1
          style={{
            fontSize: FONT_SIZES["3xl"],
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            lineHeight: 1.1,
            margin: "0 0 16px 0",
          }}
        >
          <AnimatedText
            text={productName}
            animation={combine([fadeInUp(20), scaleIn(0.95)])}
            stagger="word"
            staggerDuration={5}
            delay={5}
            style={{ fontWeight: 800 }}
          />
        </h1>

        {tagline && (
          <p
            style={{
              fontSize: FONT_SIZES.lg,
              color: "rgba(255,255,255,0.7)",
              fontFamily: FONT_FAMILY.body,
              lineHeight: 1.5,
              margin: "0 0 24px 0",
            }}
          >
            <AnimatedText
              text={tagline}
              animation={fadeInLeft(15)}
              stagger="word"
              staggerDuration={3}
              delay={20}
            />
          </p>
        )}

        {/* Rating */}
        {rating && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: SPACING.md,
              opacity: interpolate(featuresProgress, [0, 1], [0, 1]),
            }}
          >
            <StarRating score={rating.score} size={24} />
            <span
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.white,
                fontWeight: 600,
              }}
            >
              {rating.score}
            </span>
            {rating.reviewCount && (
              <span
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                ({rating.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        {/* Price */}
        {price && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              opacity: interpolate(priceProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(priceProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: FONT_SIZES["2xl"],
                fontWeight: 800,
                color: accentColor,
                fontFamily: FONT_FAMILY.title,
              }}
            >
              {price}
            </span>
            {originalPrice && (
              <span
                style={{
                  fontSize: FONT_SIZES.lg,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "line-through",
                }}
              >
                {originalPrice}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        {ctaText && (
          <div
            style={{
              marginTop: SPACING.md,
              opacity: interpolate(priceProgress, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: accentColor,
                padding: "14px 32px",
                borderRadius: 30,
              }}
            >
              <span
                style={{
                  fontSize: FONT_SIZES.md,
                  fontWeight: 700,
                  color: COLORS.dark,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {ctaText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Product Image */}
      {productImage && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(imageProgress, [0, 1], [0, 1]),
            transform: `scale(${interpolate(imageProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          <Img
            src={productImage}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.3))`,
            }}
          />
        </div>
      )}
    </div>
  );

  const renderFeaturesLayout = () => (
    <div
      style={{
        flex: 1,
        padding: SPACING.xl,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: SPACING.lg, textAlign: "center" }}>
        <h2
          style={{
            fontSize: FONT_SIZES["2xl"],
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: 0,
          }}
        >
          <AnimatedText
            text={productName}
            animation={fadeInUp(15)}
            stagger="word"
            staggerDuration={4}
            delay={0}
            style={{ fontWeight: 700 }}
          />
        </h2>
        {tagline && (
          <p
            style={{
              fontSize: FONT_SIZES.md,
              color: "rgba(255,255,255,0.6)",
              margin: "8px 0 0 0",
            }}
          >
            {tagline}
          </p>
        )}
      </div>

      {/* Features Grid */}
      {features && features.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(features.length, 3)}, 1fr)`,
            gap: SPACING.md,
            flex: 1,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: RADIUS.lg,
                padding: SPACING.md,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                opacity: interpolate(
                  spring({
                    frame: frame - 20 - i * 8,
                    fps,
                    config: SPRING_CONFIGS.normal,
                  }),
                  [0, 1],
                  [0, 1],
                ),
                transform: `translateY(${interpolate(
                  spring({
                    frame: frame - 20 - i * 8,
                    fps,
                    config: SPRING_CONFIGS.normal,
                  }),
                  [0, 1],
                  [30, 0],
                )}px)`,
              }}
            >
              <AnimatedText
                text={feature.icon}
                animation={popIn()}
                stagger="none"
                delay={25 + i * 8}
                style={{ fontSize: 48, marginBottom: 12 }}
              />
              <h3
                style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 700,
                  color: COLORS.white,
                  fontFamily: FONT_FAMILY.title,
                  margin: "0 0 8px 0",
                }}
              >
                <AnimatedText
                  text={feature.title}
                  animation={fadeInUp(12)}
                  stagger="none"
                  delay={30 + i * 8}
                  style={{ fontWeight: 700 }}
                />
              </h3>
              {feature.description && (
                <p
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: FONT_FAMILY.body,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSpecsLayout = () => (
    <div
      style={{
        flex: 1,
        padding: SPACING.xl,
        display: "flex",
        gap: SPACING.xl,
      }}
    >
      {/* Product Image */}
      {productImage && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(imageProgress, [0, 1], [0, 1]),
          }}
        >
          <Img
            src={productImage}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* Specs List */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: FONT_SIZES.xl,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONT_FAMILY.title,
            margin: "0 0 24px 0",
          }}
        >
          Specifications
        </h2>

        {specs &&
          specs.map((spec, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom:
                  i < specs.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                opacity: interpolate(
                  spring({
                    frame: frame - 25 - i * 6,
                    fps,
                    config: SPRING_CONFIGS.normal,
                  }),
                  [0, 1],
                  [0, 1],
                ),
              }}
            >
              <span
                style={{
                  fontSize: FONT_SIZES.md,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {spec.label}
              </span>
              <span
                style={{
                  fontSize: FONT_SIZES.md,
                  fontWeight: spec.highlight ? 700 : 500,
                  color: spec.highlight ? accentColor : COLORS.white,
                  fontFamily: FONT_FAMILY.body,
                }}
              >
                {spec.value}
              </span>
            </div>
          ))}
      </div>
    </div>
  );

  const sceneContent = (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {layout === "hero" && renderHeroLayout()}
      {layout === "features" && renderFeaturesLayout()}
      {layout === "specs" && renderSpecsLayout()}
      {layout === "comparison" && renderFeaturesLayout()}
      {layout === "pricing" && renderHeroLayout()}
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

export default ProductShowcaseTemplate;
