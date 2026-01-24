// Layout utilities for consistent safe area and content dimensions
import { LAYOUT } from "../components/constants";

/**
 * Get padding values for safe area (keeps content within broadcast-safe zones)
 */
export const getSafeAreaPadding = () => ({
  paddingLeft: LAYOUT.safeArea.horizontal,
  paddingRight: LAYOUT.safeArea.horizontal,
  paddingTop: LAYOUT.safeArea.vertical,
  paddingBottom: LAYOUT.safeArea.vertical,
});

/**
 * Get usable content dimensions after safe area padding
 */
export const getContentDimensions = () => ({
  width: LAYOUT.contentArea.width,
  height: LAYOUT.contentArea.height,
});

/**
 * Get safe area bounds for absolute positioning
 */
export const getSafeAreaBounds = () => ({
  left: LAYOUT.safeArea.horizontal,
  right: LAYOUT.safeArea.horizontal,
  top: LAYOUT.safeArea.vertical,
  bottom: LAYOUT.safeArea.vertical,
});
