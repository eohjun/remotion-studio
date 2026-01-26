import { useMemo } from "react";
import { EffectsConfig } from "./types";
import {
  getQualityPreset,
  QualityPreset,
  QUALITY_PRESETS,
} from "../../config/qualityPresets";

/**
 * Hook return type
 */
export interface UseEffectsPresetResult {
  /** Resolved effects configuration */
  effects: EffectsConfig;
  /** Quality preset details (if using preset name) */
  preset: QualityPreset | null;
  /** Motion blur samples for the preset */
  motionBlurSamples: number;
  /** Output scaling factor */
  outputScaling: number;
  /** Whether effects are enabled */
  hasEffects: boolean;
}

/**
 * Hook options
 */
export interface UseEffectsPresetOptions {
  /** Preset name from qualityPresets.ts */
  preset?: string;
  /** Custom effects to merge/override */
  customEffects?: Partial<EffectsConfig>;
  /** Disable all effects */
  disabled?: boolean;
}

/**
 * useEffectsPreset - Hook for easy effects preset management
 *
 * Returns resolved effects configuration based on quality preset name,
 * with support for custom overrides.
 *
 * @example
 * ```tsx
 * function MyScene() {
 *   const { effects, motionBlurSamples } = useEffectsPreset({
 *     preset: "cinematic",
 *     customEffects: { filmGrain: { intensity: 0.15 } }
 *   });
 *
 *   return (
 *     <EffectsComposer effects={effects}>
 *       <SceneContent />
 *     </EffectsComposer>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Access individual effect configs
 * function MyScene() {
 *   const { effects } = useEffectsPreset({ preset: "high" });
 *
 *   return (
 *     <>
 *       {effects.vignette && <Vignette {...effects.vignette} />}
 *       {effects.colorGrading && <ColorGrading {...effects.colorGrading} />}
 *       <Content />
 *     </>
 *   );
 * }
 * ```
 */
export function useEffectsPreset(
  options: UseEffectsPresetOptions = {}
): UseEffectsPresetResult {
  const { preset = "standard", customEffects, disabled = false } = options;

  return useMemo(() => {
    // Return empty config if disabled
    if (disabled) {
      return {
        effects: {},
        preset: null,
        motionBlurSamples: 0,
        outputScaling: 1,
        hasEffects: false,
      };
    }

    // Get quality preset
    const qualityPreset = getQualityPreset(preset);

    // Get base effects from preset
    const baseEffects = (qualityPreset?.effects as EffectsConfig) || {};

    // Merge with custom effects
    const mergedEffects: EffectsConfig = customEffects
      ? { ...baseEffects, ...customEffects }
      : baseEffects;

    // Check if any effects are enabled
    const hasEffects = Object.values(mergedEffects).some(
      (effect) => effect !== undefined && effect !== false
    );

    return {
      effects: mergedEffects,
      preset: qualityPreset,
      motionBlurSamples: qualityPreset?.motionBlurSamples || 0,
      outputScaling: qualityPreset?.outputScaling || 1,
      hasEffects,
    };
  }, [preset, customEffects, disabled]);
}

/**
 * Get all available quality preset names
 */
export function getAvailablePresets(): string[] {
  return Object.keys(QUALITY_PRESETS);
}

/**
 * Get effects configuration by preset name (non-hook version)
 */
export function getEffectsConfig(presetName: string): EffectsConfig {
  const preset = getQualityPreset(presetName);
  return (preset?.effects as EffectsConfig) || {};
}

/**
 * Preset categories for UI selection
 */
export const PRESET_CATEGORIES = {
  preview: ["draft"],
  standard: ["standard", "high", "clean"],
  premium: ["premium", "4k-premium", "cinematic"],
  stylized: ["vintage", "retina", "supersampled"],
  specialized: ["shorts", "broadcast", "master"],
} as const;

export default useEffectsPreset;
