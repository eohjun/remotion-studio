import React from "react";

export interface SplitProps {
  /** Ratio between the two children as [left, right] or [top, bottom] (default: [1, 1]) */
  ratio?: [number, number];
  /** Direction of the split (default: "horizontal") */
  direction?: "horizontal" | "vertical";
  /** Gap between the two sections in pixels (default: 20) */
  gap?: number;
  /** Align items on the cross axis */
  align?: "start" | "center" | "end" | "stretch";
  /** Children elements (must be exactly 2) */
  children: [React.ReactNode, React.ReactNode];
  /** Custom style overrides */
  style?: React.CSSProperties;
}

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

/**
 * Split component - Two-panel layout
 *
 * A flexbox-based layout component that splits content into two panels
 * with customizable ratios.
 *
 * @example
 * ```tsx
 * <Split ratio={[1, 2]} gap={40}>
 *   <Sidebar />
 *   <MainContent />
 * </Split>
 *
 * <Split direction="vertical" ratio={[3, 1]}>
 *   <ContentArea />
 *   <Footer />
 * </Split>
 * ```
 */
export const Split: React.FC<SplitProps> = ({
  ratio = [1, 1],
  direction = "horizontal",
  gap = 20,
  align = "stretch",
  children,
  style,
}) => {
  const [first, second] = children;
  const [firstRatio, secondRatio] = ratio;
  const total = firstRatio + secondRatio;

  const isHorizontal = direction === "horizontal";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap,
        alignItems: alignMap[align],
        width: "100%",
        height: isHorizontal ? undefined : "100%",
        ...style,
      }}
    >
      <div
        style={{
          flex: firstRatio / total,
          minWidth: 0, // Prevent flex item from overflowing
          minHeight: 0,
        }}
      >
        {first}
      </div>
      <div
        style={{
          flex: secondRatio / total,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {second}
      </div>
    </div>
  );
};

export default Split;
