import React from "react";
import { AbsoluteFill } from "remotion";
import {
  EffectsComposerProps,
  VignetteProps,
  LightLeakProps,
  FilmGrainProps,
  MotionBlurWrapperProps,
} from "./types";
import { Vignette } from "./Vignette";
import { LightLeak } from "./LightLeak";
import { FilmGrain } from "./FilmGrain";
import { MotionBlurWrapper } from "./MotionBlurWrapper";

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

/**
 * EffectsComposer - Combine multiple cinematic effects
 *
 * Applies effects in the correct layer order:
 * 1. Content (children)
 * 2. Motion Blur (wraps content)
 * 3. Film Grain
 * 4. Light Leak
 * 5. Vignette (outermost)
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
 *     lightLeak: { position: 'top-right' }
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
  const { filmGrain, lightLeak, vignette, motionBlur } = effects;

  // Resolve effect configurations
  const filmGrainConfig =
    filmGrain === true
      ? DEFAULT_FILM_GRAIN
      : filmGrain === false || filmGrain === undefined
        ? null
        : filmGrain;

  const lightLeakConfig =
    lightLeak === true
      ? DEFAULT_LIGHT_LEAK
      : lightLeak === false || lightLeak === undefined
        ? null
        : lightLeak;

  const vignetteConfig =
    vignette === true
      ? DEFAULT_VIGNETTE
      : vignette === false || vignette === undefined
        ? null
        : vignette;

  const motionBlurConfig =
    motionBlur === true
      ? DEFAULT_MOTION_BLUR
      : motionBlur === false || motionBlur === undefined
        ? null
        : motionBlur;

  // Build the effect layers from inside out
  let content: React.ReactNode = children;

  // Layer 1: Motion Blur (wraps the content)
  if (motionBlurConfig && motionBlurConfig.enabled !== false) {
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

  // Layer 2: Film Grain
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

  // Layer 3: Light Leak
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

  // Layer 4: Vignette (outermost)
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
