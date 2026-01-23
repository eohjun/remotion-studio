import React from "react";

export interface StackProps {
  /** Stack direction (default: "vertical") */
  direction?: "horizontal" | "vertical";
  /** Gap between items in pixels (default: 16) */
  gap?: number;
  /** Align items on the cross axis */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify content on the main axis */
  justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
  /** Whether to wrap items (default: false) */
  wrap?: boolean;
  /** Children elements */
  children: React.ReactNode;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
} as const;

/**
 * Stack component - Flexible layout container
 *
 * A simple flexbox-based layout component for stacking items horizontally or vertically.
 *
 * @example
 * ```tsx
 * <Stack direction="horizontal" gap={20} align="center">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Stack>
 * ```
 */
export const Stack: React.FC<StackProps> = ({
  direction = "vertical",
  gap = 16,
  align = "stretch",
  justify = "start",
  wrap = false,
  children,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Stack;
