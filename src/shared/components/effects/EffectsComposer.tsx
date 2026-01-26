import React from "react";
import { AbsoluteFill } from "remotion";
import {
  EffectsComposerProps,
  VignetteProps,
  LightLeakProps,
  FilmGrainProps,
  MotionBlurWrapperProps,
  CameraMotionBlurProps,
  ChromaticAberrationProps,
  GlitchEffectProps,
  ColorGradingProps,
  BloomProps,
} from "./types";
import { Vignette } from "./Vignette";
import { LightLeak } from "./LightLeak";
import { FilmGrain } from "./FilmGrain";
import { MotionBlurWrapper } from "./MotionBlurWrapper";
import { CameraMotionBlur } from "./CameraMotionBlur";
import { ChromaticAberration } from "./ChromaticAberration";
import { GlitchEffect } from "./GlitchEffect";
import { ColorGrading } from "./ColorGrading";
import { Bloom } from "./Bloom";

/**
 * Default configurations for effects when passed as boolean
 */
const DEFAULT_VIGNETTE: VignetteProps = {
  intensity: 0.3,
  color: "black",
  size: 0.5,
  softness: 0.5,
};

const DEFAULT_LIGHT_LEAK: LightLeakProps = {
  color: "rgba(255, 150, 50, 0.4)",
  position: "top-left",
  intensity: 0.25,
  animated: true,
  type: "gradient",
};

const DEFAULT_FILM_GRAIN: FilmGrainProps = {
  intensity: 0.12,
  animated: true,
  monochrome: true,
  blendMode: "overlay",
};

const DEFAULT_MOTION_BLUR: MotionBlurWrapperProps = {
  children: null,
  samples: 10,
  shutterAngle: 180,
  enabled: true,
};

const DEFAULT_CAMERA_MOTION_BLUR: CameraMotionBlurProps = {
  children: null,
  samples: 10,
  shutterAngle: 180,
  enabled: true,
};

const DEFAULT_CHROMATIC_ABERRATION: ChromaticAberrationProps = {
  children: null,
  intensity: 0.3,
  direction: "radial",
};

const DEFAULT_GLITCH: GlitchEffectProps = {
  children: null,
  intensity: "medium",
  animated: true,
  showScanlines: true,
  colorShift: true,
  sliceDisplacement: true,
};

const DEFAULT_COLOR_GRADING: ColorGradingProps = {
  children: null,
  preset: "cinematic",
  intensity: 1,
};

const DEFAULT_BLOOM: BloomProps = {
  children: null,
  intensity: 0.5,
  radius: 15,
  threshold: 0.7,
  blendMode: "screen",
};

/**
 * EffectsComposer - Combine multiple cinematic effects
 *
 * Applies effects in the correct layer order:
 * 1. Content (children)
 * 2. Camera Motion Blur (or Trail-based Motion Blur)
 * 3. Bloom (glow on bright areas)
 * 4. Chromatic Aberration (color fringing)
 * 5. Glitch (digital distortion)
 * 6. Film Grain
 * 7. Color Grading
 * 8. Light Leak
 * 9. Vignette (outermost)
 *
 * Each effect can be:
 * - Disabled: undefined or false
 * - Enabled with defaults: true
 * - Customized: pass props object
 *
 * @example
 * ```tsx
 * <EffectsComposer
 *   effects={{
 *     vignette: { intensity: 0.3 },
 *     filmGrain: true,
 *     lightLeak: { position: 'top-right' },
 *     colorGrading: { preset: 'cinematic' },
 *     bloom: { intensity: 0.4 },
 *   }}
 * >
 *   <MyScene />
 * </EffectsComposer>
 * ```
 */
export const EffectsComposer: React.FC<EffectsComposerProps> = ({
  children,
  effects = {},
}) => {
  const {
    filmGrain,
    lightLeak,
    vignette,
    motionBlur,
    cameraMotionBlur,
    chromaticAberration,
    glitch,
    colorGrading,
    bloom,
  } = effects;

  // Resolve effect configurations
  const resolveConfig = <T,>(
    effect: T | boolean | undefined,
    defaultConfig: T
  ): T | null => {
    if (effect === true) return defaultConfig;
    if (effect === false || effect === undefined) return null;
    return effect as T;
  };

  const filmGrainConfig = resolveConfig(filmGrain, DEFAULT_FILM_GRAIN);
  const lightLeakConfig = resolveConfig(lightLeak, DEFAULT_LIGHT_LEAK);
  const vignetteConfig = resolveConfig(vignette, DEFAULT_VIGNETTE);
  const motionBlurConfig = resolveConfig(motionBlur, DEFAULT_MOTION_BLUR);
  const cameraMotionBlurConfig = resolveConfig(
    cameraMotionBlur,
    DEFAULT_CAMERA_MOTION_BLUR
  );
  const chromaticAberrationConfig = resolveConfig(
    chromaticAberration,
    DEFAULT_CHROMATIC_ABERRATION
  );
  const glitchConfig = resolveConfig(glitch, DEFAULT_GLITCH);
  const colorGradingConfig = resolveConfig(colorGrading, DEFAULT_COLOR_GRADING);
  const bloomConfig = resolveConfig(bloom, DEFAULT_BLOOM);

  // Build the effect layers from inside out
  let content: React.ReactNode = children;

  // Layer 1: Camera Motion Blur (preferred) or Trail-based Motion Blur
  if (cameraMotionBlurConfig && cameraMotionBlurConfig.enabled !== false) {
    content = (
      <CameraMotionBlur
        samples={cameraMotionBlurConfig.samples}
        shutterAngle={cameraMotionBlurConfig.shutterAngle}
        enabled={cameraMotionBlurConfig.enabled}
      >
        {content}
      </CameraMotionBlur>
    );
  } else if (motionBlurConfig && motionBlurConfig.enabled !== false) {
    content = (
      <MotionBlurWrapper
        samples={motionBlurConfig.samples}
        shutterAngle={motionBlurConfig.shutterAngle}
        enabled={motionBlurConfig.enabled}
      >
        {content}
      </MotionBlurWrapper>
    );
  }

  // Layer 2: Bloom (glow effect)
  if (bloomConfig) {
    content = (
      <Bloom
        intensity={bloomConfig.intensity}
        radius={bloomConfig.radius}
        threshold={bloomConfig.threshold}
        color={bloomConfig.color}
        blendMode={bloomConfig.blendMode}
      >
        {content}
      </Bloom>
    );
  }

  // Layer 3: Chromatic Aberration
  if (chromaticAberrationConfig) {
    content = (
      <ChromaticAberration
        intensity={chromaticAberrationConfig.intensity}
        direction={chromaticAberrationConfig.direction}
        offsetX={chromaticAberrationConfig.offsetX}
        offsetY={chromaticAberrationConfig.offsetY}
        animated={chromaticAberrationConfig.animated}
        animationSpeed={chromaticAberrationConfig.animationSpeed}
      >
        {content}
      </ChromaticAberration>
    );
  }

  // Layer 4: Glitch Effect
  if (glitchConfig) {
    content = (
      <GlitchEffect
        intensity={glitchConfig.intensity}
        animated={glitchConfig.animated}
        seed={glitchConfig.seed}
        showScanlines={glitchConfig.showScanlines}
        colorShift={glitchConfig.colorShift}
        sliceDisplacement={glitchConfig.sliceDisplacement}
      >
        {content}
      </GlitchEffect>
    );
  }

  // Layer 5: Film Grain
  if (filmGrainConfig) {
    content = (
      <FilmGrain
        intensity={filmGrainConfig.intensity}
        animated={filmGrainConfig.animated}
        monochrome={filmGrainConfig.monochrome}
        blendMode={filmGrainConfig.blendMode}
        speed={filmGrainConfig.speed}
      >
        {content}
      </FilmGrain>
    );
  }

  // Layer 6: Color Grading
  if (colorGradingConfig) {
    content = (
      <ColorGrading
        preset={colorGradingConfig.preset}
        intensity={colorGradingConfig.intensity}
        custom={colorGradingConfig.custom}
      >
        {content}
      </ColorGrading>
    );
  }

  // Layer 7: Light Leak
  if (lightLeakConfig) {
    content = (
      <LightLeak
        color={lightLeakConfig.color}
        position={lightLeakConfig.position}
        intensity={lightLeakConfig.intensity}
        animated={lightLeakConfig.animated}
        type={lightLeakConfig.type}
        cycleDuration={lightLeakConfig.cycleDuration}
      >
        {content}
      </LightLeak>
    );
  }

  // Layer 8: Vignette (outermost)
  if (vignetteConfig) {
    content = (
      <Vignette
        intensity={vignetteConfig.intensity}
        color={vignetteConfig.color}
        size={vignetteConfig.size}
        softness={vignetteConfig.softness}
      >
        {content}
      </Vignette>
    );
  }

  return <AbsoluteFill>{content}</AbsoluteFill>;
};

export default EffectsComposer;
