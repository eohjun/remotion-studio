/**
 * Self-Help Ideology Critique - Full Version (English)
 *
 * A comprehensive critical examination of the self-help industry.
 * ~6 minutes runtime with 14 scenes and professional transitions.
 */

import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { TransitionComposition, TRANSITION_PRESETS } from "../../shared/transitions";
import { SCENE_CONFIG, calculateVideoDuration } from "./scenes";
import { TOTAL_DURATION } from "./constants";

export const selfHelpCritiqueFullSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type SelfHelpCritiqueFullProps = z.infer<typeof selfHelpCritiqueFullSchema>;

/**
 * Main composition component using TransitionComposition for scene management
 */
export const SelfHelpCritiqueFull: React.FC<SelfHelpCritiqueFullProps> = () => {
  return (
    <TransitionComposition
      scenes={SCENE_CONFIG}
      defaultTransition={TRANSITION_PRESETS.fade}
    />
  );
};

/**
 * Calculate total duration with transitions
 * Note: TransitionSeries overlaps transitions, so total is slightly less than sum of scene durations
 */
export const TOTAL_DURATION_WITH_TRANSITIONS = calculateVideoDuration();

export { TOTAL_DURATION };
export default SelfHelpCritiqueFull;
