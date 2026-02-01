/**
 * Media Components
 *
 * GIF and video media playback utilities.
 * - GIF playback using @remotion/gif
 * - Optimized video playback with environment-aware component selection
 */

export { GifPlayer, ReactionGif, BannerGif } from "./GifPlayer";
export type { GifPlayerProps, ReactionGifProps } from "./GifPlayer";

export {
  OptimizedVideo,
  MemorySafeVideo,
} from "./OptimizedVideo";
export type { OptimizedVideoProps } from "./OptimizedVideo";
