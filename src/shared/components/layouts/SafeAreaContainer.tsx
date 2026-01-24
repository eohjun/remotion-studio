import React from "react";
import { AbsoluteFill } from "remotion";
import { LAYOUT } from "../constants";

export interface SafeAreaContainerProps {
  children: React.ReactNode;
  /** Override horizontal padding (default: LAYOUT.safeArea.horizontal = 80) */
  horizontalPadding?: number;
  /** Override vertical padding (default: LAYOUT.safeArea.vertical = 60) */
  verticalPadding?: number;
  /** Additional style overrides */
  style?: React.CSSProperties;
}

/**
 * Container that applies safe area padding for broadcast-safe content placement.
 * Use this to ensure content stays within visible area on all displays.
 *
 * Default padding: 80px horizontal, 60px vertical (from LAYOUT.safeArea)
 */
export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  horizontalPadding = LAYOUT.safeArea.horizontal,
  verticalPadding = LAYOUT.safeArea.vertical,
  style,
}) => (
  <AbsoluteFill
    style={{
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

export default SafeAreaContainer;
