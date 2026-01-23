import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Components
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SPACING,
} from "../shared/components/constants";
import { TitleCard } from "../shared/components/cards";
import { Stack, Grid, Split } from "../shared/components/layouts";
import { CountUp, ProgressBar, ProgressCircle, StepIndicator } from "../shared/components/progress";
import { BarChart, LineChart, PieChart } from "../shared/components/charts";
import { Icon, AnimatedIcon } from "../shared/components/icons";

// Duration constants
const SCENE_DURATION = 180; // 6 seconds per scene
const TOTAL_SCENES = 6;
export const COMPONENT_LIBRARY_DEMO_DURATION = SCENE_DURATION * TOTAL_SCENES;

// Schema
export const componentLibraryDemoSchema = z.object({
  primaryColor: zColor().optional(),
  secondaryColor: zColor().optional(),
});

type ComponentLibraryDemoProps = z.infer<typeof componentLibraryDemoSchema>;

// Scene components
const TitleScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <TitleCard
      title="Component Library"
      subtitle="Phase 13: Reusable Components"
      titleSize={FONT_SIZES["3xl"]}
      subtitleSize={FONT_SIZES.lg}
      durationInFrames={SCENE_DURATION}
    />
  </AbsoluteFill>
);

const ProgressScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
      padding: SPACING.xl,
    }}
  >
    <h2
      style={{
        fontSize: FONT_SIZES["2xl"],
        fontWeight: 700,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.title,
        marginBottom: SPACING.lg,
      }}
    >
      Progress Components
    </h2>
    <Stack gap={40}>
      {/* CountUp */}
      <Stack direction="horizontal" gap={60} align="center">
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.light, fontSize: FONT_SIZES.sm, marginBottom: 8 }}>
            Revenue
          </div>
          <CountUp value={12500} prefix="$" suffix="K" />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.light, fontSize: FONT_SIZES.sm, marginBottom: 8 }}>
            Users
          </div>
          <CountUp value={8432} delay={10} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.light, fontSize: FONT_SIZES.sm, marginBottom: 8 }}>
            Growth
          </div>
          <CountUp value={23.5} suffix="%" decimals={1} delay={20} color={COLORS.success} />
        </div>
      </Stack>

      {/* ProgressBars */}
      <Stack gap={16} style={{ maxWidth: 600 }}>
        <ProgressBar value={85} showLabel color={COLORS.primary} delay={30} />
        <ProgressBar value={62} showLabel color={COLORS.secondary} delay={40} />
        <ProgressBar value={45} showLabel color={COLORS.accent} delay={50} />
      </Stack>

      {/* ProgressCircles */}
      <Stack direction="horizontal" gap={40} justify="center">
        <ProgressCircle value={75} color={COLORS.primary} delay={60} />
        <ProgressCircle value={90} color={COLORS.success} delay={70} />
        <ProgressCircle value={45} color={COLORS.warning} delay={80} />
      </Stack>

      {/* StepIndicator */}
      <StepIndicator
        steps={["Research", "Design", "Develop", "Test", "Deploy"]}
        currentStep={2}
        delay={90}
      />
    </Stack>
  </AbsoluteFill>
);

const ChartScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
      padding: SPACING.xl,
    }}
  >
    <h2
      style={{
        fontSize: FONT_SIZES["2xl"],
        fontWeight: 700,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.title,
        marginBottom: SPACING.lg,
      }}
    >
      Chart Components
    </h2>
    <Split ratio={[1, 1]} gap={60}>
      <Stack gap={30}>
        <h3
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
          }}
        >
          Bar Chart
        </h3>
        <BarChart
          data={[
            { label: "React", value: 85, color: "#61DAFB" },
            { label: "Vue", value: 72, color: "#42B883" },
            { label: "Angular", value: 58, color: "#DD0031" },
            { label: "Svelte", value: 45, color: "#FF3E00" },
          ]}
          orientation="vertical"
        />
      </Stack>
      <Stack gap={30}>
        <h3
          style={{
            fontSize: FONT_SIZES.lg,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
          }}
        >
          Line Chart
        </h3>
        <LineChart
          data={[
            { x: "Jan", y: 30 },
            { x: "Feb", y: 45 },
            { x: "Mar", y: 35 },
            { x: "Apr", y: 60 },
            { x: "May", y: 55 },
            { x: "Jun", y: 80 },
          ]}
          showArea
          showDots
          showXLabels
          strokeColor={COLORS.accent}
          delay={20}
        />
      </Stack>
    </Split>
  </AbsoluteFill>
);

const PieChartScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
      padding: SPACING.xl,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h2
      style={{
        fontSize: FONT_SIZES["2xl"],
        fontWeight: 700,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.title,
        marginBottom: SPACING.lg,
      }}
    >
      Pie & Donut Charts
    </h2>
    <Stack direction="horizontal" gap={80} justify="center" style={{ flex: 1 }} align="center">
      <Stack gap={20} align="center">
        <h3
          style={{
            fontSize: FONT_SIZES.md,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
          }}
        >
          Traffic Sources
        </h3>
        <PieChart
          data={[
            { label: "Direct", value: 35 },
            { label: "Organic", value: 28 },
            { label: "Referral", value: 22 },
            { label: "Social", value: 15 },
          ]}
          size={250}
        />
      </Stack>
      <Stack gap={20} align="center">
        <h3
          style={{
            fontSize: FONT_SIZES.md,
            color: COLORS.light,
            fontFamily: FONT_FAMILY.body,
          }}
        >
          Device Usage
        </h3>
        <PieChart
          data={[
            { label: "Desktop", value: 55 },
            { label: "Mobile", value: 35 },
            { label: "Tablet", value: 10 },
          ]}
          size={250}
          innerRadius={0.6}
          delay={30}
        />
      </Stack>
    </Stack>
  </AbsoluteFill>
);

const LayoutScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
      padding: SPACING.xl,
    }}
  >
    <h2
      style={{
        fontSize: FONT_SIZES["2xl"],
        fontWeight: 700,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.title,
        marginBottom: SPACING.lg,
      }}
    >
      Layout Components
    </h2>
    <Stack gap={40}>
      {/* Stack Demo */}
      <div>
        <h3 style={{ fontSize: FONT_SIZES.md, color: COLORS.accent, marginBottom: 16 }}>
          Stack (horizontal)
        </h3>
        <Stack direction="horizontal" gap={20}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                width: 100,
                height: 60,
                backgroundColor: COLORS.primary,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                fontWeight: 600,
              }}
            >
              Item {n}
            </div>
          ))}
        </Stack>
      </div>

      {/* Grid Demo */}
      <div>
        <h3 style={{ fontSize: FONT_SIZES.md, color: COLORS.accent, marginBottom: 16 }}>
          Grid (3 columns)
        </h3>
        <Grid columns={3} gap={16}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              style={{
                height: 60,
                backgroundColor: COLORS.secondary,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.white,
                fontFamily: FONT_FAMILY.body,
                fontWeight: 600,
              }}
            >
              Cell {n}
            </div>
          ))}
        </Grid>
      </div>

      {/* Split Demo */}
      <div>
        <h3 style={{ fontSize: FONT_SIZES.md, color: COLORS.accent, marginBottom: 16 }}>
          Split (1:2 ratio)
        </h3>
        <Split ratio={[1, 2]} gap={20}>
          <div
            style={{
              height: 80,
              backgroundColor: COLORS.accent,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.dark,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 600,
            }}
          >
            Sidebar
          </div>
          <div
            style={{
              height: 80,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.white,
              fontFamily: FONT_FAMILY.body,
              fontWeight: 600,
            }}
          >
            Main Content
          </div>
        </Split>
      </div>
    </Stack>
  </AbsoluteFill>
);

const IconScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkAlt} 100%)`,
      padding: SPACING.xl,
    }}
  >
    <h2
      style={{
        fontSize: FONT_SIZES["2xl"],
        fontWeight: 700,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.title,
        marginBottom: SPACING.lg,
      }}
    >
      Icon Components
    </h2>
    <Stack gap={50}>
      {/* Static Icons */}
      <div>
        <h3 style={{ fontSize: FONT_SIZES.md, color: COLORS.accent, marginBottom: 20 }}>
          Static Icons (Lucide)
        </h3>
        <Stack direction="horizontal" gap={30}>
          <Stack align="center" gap={8}>
            <Icon name="Home" size={36} color={COLORS.primary} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Home</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="Settings" size={36} color={COLORS.secondary} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Settings</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="User" size={36} color={COLORS.accent} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>User</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="Mail" size={36} color={COLORS.success} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Mail</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="Bell" size={36} color={COLORS.warning} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Bell</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="Heart" size={36} color={COLORS.danger} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Heart</span>
          </Stack>
        </Stack>
      </div>

      {/* Animated Icons */}
      <div>
        <h3 style={{ fontSize: FONT_SIZES.md, color: COLORS.accent, marginBottom: 20 }}>
          Continuous Animations
        </h3>
        <Stack direction="horizontal" gap={40}>
          <Stack align="center" gap={8}>
            <Icon name="Loader" size={40} color={COLORS.primary} animate="spin" />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Spin</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="Heart" size={40} color={COLORS.danger} animate="pulse" />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Pulse</span>
          </Stack>
          <Stack align="center" gap={8}>
            <Icon name="ArrowDown" size={40} color={COLORS.accent} animate="bounce" />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Bounce</span>
          </Stack>
        </Stack>
      </div>

      {/* Entry Animations */}
      <div>
        <h3 style={{ fontSize: FONT_SIZES.md, color: COLORS.accent, marginBottom: 20 }}>
          Entry Animations
        </h3>
        <Stack direction="horizontal" gap={40}>
          <Stack align="center" gap={8}>
            <AnimatedIcon name="Check" size={40} color={COLORS.success} animation="scaleIn" delay={0} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Scale In</span>
          </Stack>
          <Stack align="center" gap={8}>
            <AnimatedIcon name="Star" size={40} color={COLORS.warning} animation="popIn" delay={15} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Pop In</span>
          </Stack>
          <Stack align="center" gap={8}>
            <AnimatedIcon name="ArrowRight" size={40} color={COLORS.primary} animation="slideIn" slideDirection="left" delay={30} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Slide In</span>
          </Stack>
          <Stack align="center" gap={8}>
            <AnimatedIcon name="Zap" size={40} color={COLORS.accent} animation="fadeIn" delay={45} />
            <span style={{ color: COLORS.light, fontSize: FONT_SIZES.xs }}>Fade In</span>
          </Stack>
        </Stack>
      </div>
    </Stack>
  </AbsoluteFill>
);

// Main component
export const ComponentLibraryDemo: React.FC<ComponentLibraryDemoProps> = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_DURATION}>
        <TitleScene />
      </Sequence>

      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <ProgressScene />
      </Sequence>

      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <ChartScene />
      </Sequence>

      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <PieChartScene />
      </Sequence>

      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <LayoutScene />
      </Sequence>

      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
        <IconScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ComponentLibraryDemo;
