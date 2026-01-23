import React from "react";

export interface GridProps {
  /** Number of columns or "auto" for auto-fit (default: "auto") */
  columns?: number | "auto";
  /** Minimum column width when using auto columns (default: 200) */
  minColumnWidth?: number;
  /** Gap between items in pixels (default: 16) */
  gap?: number;
  /** Row gap (overrides gap for rows) */
  rowGap?: number;
  /** Column gap (overrides gap for columns) */
  columnGap?: number;
  /** Align items within their cells */
  alignItems?: "start" | "center" | "end" | "stretch";
  /** Justify items within their cells */
  justifyItems?: "start" | "center" | "end" | "stretch";
  /** Children elements */
  children: React.ReactNode;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

const alignMap = {
  start: "start",
  center: "center",
  end: "end",
  stretch: "stretch",
} as const;

/**
 * Grid component - CSS Grid layout container
 *
 * A CSS Grid-based layout component for creating grid layouts.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap={20}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 *
 * <Grid columns="auto" minColumnWidth={250}>
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </Grid>
 * ```
 */
export const Grid: React.FC<GridProps> = ({
  columns = "auto",
  minColumnWidth = 200,
  gap = 16,
  rowGap,
  columnGap,
  alignItems = "stretch",
  justifyItems = "stretch",
  children,
  style,
}) => {
  const gridTemplateColumns =
    columns === "auto"
      ? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`
      : `repeat(${columns}, 1fr)`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns,
        gap,
        rowGap: rowGap ?? gap,
        columnGap: columnGap ?? gap,
        alignItems: alignMap[alignItems],
        justifyItems: alignMap[justifyItems],
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
