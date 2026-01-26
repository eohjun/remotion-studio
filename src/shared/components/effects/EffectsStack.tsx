import React from "react";
import { EffectsComposer } from "./EffectsComposer";
import { EffectsConfig } from "./types";
import { getQualityPreset } from "../../config/qualityPresets";

/**
 * Props for EffectsStack component
 */
export interface EffectsStackProps {
  /** Children to apply effects to */
  children: React.ReactNode;
  /**
   * Quality preset name or custom effects config.
   * When string, uses quality preset from qualityPresets.ts
   * When object, uses custom effects configuration
   */
  preset?: string | EffectsConfig;
  /**
   * Override specific effects in the preset
   * Merged with preset effects
   */
  overrides?: Partial<EffectsConfig>;
  /**
   * Disable all effects (useful for preview mode)
   */
  disabled?: boolean;
}

/**
 * EffectsStack - Unified effects management component
 *
 * Simplifies applying consistent visual effects across scenes by:
 * 1. Using quality presets from qualityPresets.ts
 * 2. Allowing preset overrides for customization
 * 3. Supporting direct effects configuration
 *
 * @example
 * ```tsx
 * // Using quality preset
 * <EffectsStack preset="cinematic">
 *   <MyScene />
 * </EffectsStack>
 *
 * // Using preset with overrides
 * <EffectsStack preset="high" overrides={{ filmGrain: { intensity: 0.2 } }}>
 *   <MyScene />
 * </EffectsStack>
 *
 * // Using custom effects directly
 * <EffectsStack preset={{ vignette: true, colorGrading: { preset: "warm" } }}>
 *   <MyScene />
 * </EffectsStack>
 *
 * // Disabled for preview
 * <EffectsStack preset="premium" disabled>
 *   <MyScene />
 * </EffectsStack>
 * ```
 */
export const EffectsStack: React.FC<EffectsStackProps> = ({
  children,
  preset = "standard",
  overrides,
  disabled = false,
}) => {
  // If disabled, render children directly without effects
  if (disabled) {
    return <>{children}</>;
  }

  // Resolve effects configuration
  let effectsConfig: EffectsConfig = {};

  if (typeof preset === "string") {
    // Load from quality preset
    const qualityPreset = getQualityPreset(preset);
    if (qualityPreset?.effects) {
      effectsConfig = qualityPreset.effects as EffectsConfig;
    }
  } else {
    // Use provided effects config directly
    effectsConfig = preset;
  }

  // Merge with overrides if provided
  if (overrides) {
    effectsConfig = {
      ...effectsConfig,
      ...overrides,
    };
  }

  return (
    <EffectsComposer effects={effectsConfig}>
      {children}
    </EffectsComposer>
  );
};

/**
 * Get resolved effects config from quality preset
 */
export function getEffectsFromPreset(presetName: string): EffectsConfig | null {
  const preset = getQualityPreset(presetName);
  return preset?.effects as EffectsConfig | null;
}

/**
 * Merge two effects configs with second taking precedence
 */
export function mergeEffectsConfigs(
  base: EffectsConfig,
  override: Partial<EffectsConfig>
): EffectsConfig {
  return {
    ...base,
    ...override,
  };
}

export default EffectsStack;
