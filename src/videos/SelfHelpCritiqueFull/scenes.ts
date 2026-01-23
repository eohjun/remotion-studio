/**
 * Scene Configuration for Self-Help Critique Full Video
 *
 * Defines all scenes with their durations, audio, and transitions.
 */
import { SceneDefinition, TRANSITION_PRESETS } from "../../shared/transitions";
import { SCENE_DURATIONS } from "./constants";
import { IntroScene } from "./scenes/01_IntroScene";
import { ParadoxScene } from "./scenes/02_ParadoxScene";
import { HavingModeScene } from "./scenes/03_HavingModeScene";
import { BeingModeScene } from "./scenes/04_BeingModeScene";
import { NeoliberalismScene } from "./scenes/05_NeoliberalismScene";
import { EntrepreneurialSelfScene } from "./scenes/06_EntrepreneurialSelfScene";
import { ToxicPositivityScene } from "./scenes/07_ToxicPositivityScene";
import { BelaboredSelfScene } from "./scenes/08_BelaboredSelfScene";
import { RealWorldExampleScene } from "./scenes/09_RealWorldExampleScene";
import { SelfEfficacyScene } from "./scenes/10_SelfEfficacyScene";
import { FourSourcesScene } from "./scenes/11_FourSourcesScene";
import { GrowthMindsetLimitsScene } from "./scenes/12_GrowthMindsetLimitsScene";
import { StructuralBalanceScene } from "./scenes/13_StructuralBalanceScene";
import { OutroScene } from "./scenes/14_OutroScene";

/**
 * Scene configuration array for TransitionComposition
 *
 * Each scene specifies:
 * - id: Unique identifier
 * - component: React component to render
 * - durationInFrames: Scene duration
 * - audio: Path to audio file (relative to public/)
 * - transition: Transition effect to apply AFTER this scene
 */
export const SCENE_CONFIG: SceneDefinition[] = [
  {
    id: "intro",
    component: IntroScene,
    durationInFrames: SCENE_DURATIONS.INTRO,
    audio: "videos/SelfHelpCritiqueFull/audio/intro.mp3",
    transition: TRANSITION_PRESETS.dissolve,
  },
  {
    id: "paradox",
    component: ParadoxScene,
    durationInFrames: SCENE_DURATIONS.PARADOX,
    audio: "videos/SelfHelpCritiqueFull/audio/paradox.mp3",
    transition: TRANSITION_PRESETS.slideLeft,
  },
  {
    id: "havingMode",
    component: HavingModeScene,
    durationInFrames: SCENE_DURATIONS.HAVING_MODE,
    audio: "videos/SelfHelpCritiqueFull/audio/havingMode.mp3",
    transition: TRANSITION_PRESETS.fade,
  },
  {
    id: "beingMode",
    component: BeingModeScene,
    durationInFrames: SCENE_DURATIONS.BEING_MODE,
    audio: "videos/SelfHelpCritiqueFull/audio/beingMode.mp3",
    transition: TRANSITION_PRESETS.dissolve,
  },
  {
    id: "neoliberalism",
    component: NeoliberalismScene,
    durationInFrames: SCENE_DURATIONS.NEOLIBERALISM,
    audio: "videos/SelfHelpCritiqueFull/audio/neoliberalism.mp3",
    transition: TRANSITION_PRESETS.slideLeft,
  },
  {
    id: "entrepreneurialSelf",
    component: EntrepreneurialSelfScene,
    durationInFrames: SCENE_DURATIONS.ENTREPRENEURIAL_SELF,
    audio: "videos/SelfHelpCritiqueFull/audio/entrepreneurialSelf.mp3",
    transition: TRANSITION_PRESETS.fade,
  },
  {
    id: "toxicPositivity",
    component: ToxicPositivityScene,
    durationInFrames: SCENE_DURATIONS.TOXIC_POSITIVITY,
    audio: "videos/SelfHelpCritiqueFull/audio/toxicPositivity.mp3",
    transition: TRANSITION_PRESETS.wipeLeft,
  },
  {
    id: "belaboredSelf",
    component: BelaboredSelfScene,
    durationInFrames: SCENE_DURATIONS.BELABORED_SELF,
    audio: "videos/SelfHelpCritiqueFull/audio/belaboredSelf.mp3",
    transition: TRANSITION_PRESETS.dissolve,
  },
  {
    id: "realWorldExample",
    component: RealWorldExampleScene,
    durationInFrames: SCENE_DURATIONS.REAL_WORLD_EXAMPLE,
    audio: "videos/SelfHelpCritiqueFull/audio/realWorldExample.mp3",
    transition: TRANSITION_PRESETS.slideLeft,
  },
  {
    id: "selfEfficacy",
    component: SelfEfficacyScene,
    durationInFrames: SCENE_DURATIONS.SELF_EFFICACY,
    audio: "videos/SelfHelpCritiqueFull/audio/selfEfficacy.mp3",
    transition: TRANSITION_PRESETS.fade,
  },
  {
    id: "fourSources",
    component: FourSourcesScene,
    durationInFrames: SCENE_DURATIONS.FOUR_SOURCES,
    audio: "videos/SelfHelpCritiqueFull/audio/fourSources.mp3",
    transition: TRANSITION_PRESETS.dissolve,
  },
  {
    id: "growthMindsetLimits",
    component: GrowthMindsetLimitsScene,
    durationInFrames: SCENE_DURATIONS.GROWTH_MINDSET_LIMITS,
    audio: "videos/SelfHelpCritiqueFull/audio/growthMindsetLimits.mp3",
    transition: TRANSITION_PRESETS.slideLeft,
  },
  {
    id: "structuralBalance",
    component: StructuralBalanceScene,
    durationInFrames: SCENE_DURATIONS.STRUCTURAL_BALANCE,
    audio: "videos/SelfHelpCritiqueFull/audio/structuralBalance.mp3",
    transition: TRANSITION_PRESETS.fadeSlow,
  },
  {
    id: "outro",
    component: OutroScene,
    durationInFrames: SCENE_DURATIONS.OUTRO,
    audio: "videos/SelfHelpCritiqueFull/audio/outro.mp3",
    // No transition after last scene
  },
];

/**
 * Calculate total video duration accounting for transitions
 */
export const calculateVideoDuration = (): number => {
  let total = 0;
  for (let i = 0; i < SCENE_CONFIG.length; i++) {
    total += SCENE_CONFIG[i].durationInFrames;
    // Subtract transition overlap (except for last scene)
    if (i < SCENE_CONFIG.length - 1 && SCENE_CONFIG[i].transition) {
      total -= SCENE_CONFIG[i].transition!.durationInFrames ?? 20;
    }
  }
  return total;
};
