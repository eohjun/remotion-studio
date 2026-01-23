/**
 * Template Demo - Showcases Phase 11 scene templates
 *
 * Demonstrates:
 * - DataVisualizationTemplate (bar, horizontalBar, progress, metric)
 * - TimelineTemplate (horizontal, vertical)
 * - ImageTemplate (fullscreen, centered, side-by-side, gallery)
 * - AnnotationTemplate (arrow, line, dot pointers)
 * - StoryTemplate (single, split, sequence)
 */

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { COLORS } from "../shared/components/constants";
import {
  DataVisualizationTemplate,
  TimelineTemplate,
  ImageTemplate,
  AnnotationTemplate,
  StoryTemplate,
} from "../shared/templates/scenes";
import type {
  DataItem,
  TimelineEvent,
  ImageItem,
  Annotation,
  StoryPanel,
} from "../shared/templates/scenes";

// Scene durations
const SCENE_DURATION = 150; // 5 seconds at 30fps

// Total duration
export const TEMPLATE_DEMO_DURATION = SCENE_DURATION * 8;

// Schema
export const templateDemoSchema = z.object({
  primaryColor: zColor().default(COLORS.primary),
  secondaryColor: zColor().default(COLORS.secondary),
});

type TemplateDemoProps = z.infer<typeof templateDemoSchema>;

// Sample data for demonstrations
const barChartData: DataItem[] = [
  { label: "React", value: 85, icon: "⚛️", color: "#61dafb" },
  { label: "Vue", value: 65, icon: "💚", color: "#42b883" },
  { label: "Angular", value: 55, icon: "🔴", color: "#dd0031" },
  { label: "Svelte", value: 45, icon: "🧡", color: "#ff3e00" },
];

const progressData: DataItem[] = [
  { label: "Performance", value: 92, icon: "⚡", color: COLORS.success },
  { label: "Security", value: 78, icon: "🔒", color: COLORS.warning },
  { label: "Accessibility", value: 85, icon: "♿", color: COLORS.accent },
];

const metricData: DataItem[] = [
  { label: "Total Users", value: 12500, icon: "👥", color: COLORS.accent },
  { label: "Active Sessions", value: 3420, icon: "🔥", color: COLORS.success },
  { label: "Conversions", value: 847, icon: "💰", color: COLORS.warning },
];

const timelineEvents: TimelineEvent[] = [
  { date: "2020", title: "Project Started", description: "Initial concept and planning", icon: "🚀", highlight: true },
  { date: "2021", title: "Beta Release", description: "First public beta", icon: "📦" },
  { date: "2022", title: "V1.0 Launch", description: "Production ready", icon: "✨", color: COLORS.success },
  { date: "2023", title: "Major Update", description: "New features added", icon: "🎉" },
  { date: "2024", title: "Global Scale", description: "International expansion", icon: "🌍", highlight: true },
];

const sampleImages: ImageItem[] = [
  { src: "https://picsum.photos/seed/demo1/1920/1080", alt: "Sample Image 1", caption: "Beautiful landscape" },
  { src: "https://picsum.photos/seed/demo2/1920/1080", alt: "Sample Image 2", caption: "Urban architecture" },
  { src: "https://picsum.photos/seed/demo3/800/600", alt: "Sample Image 3", caption: "Nature close-up" },
  { src: "https://picsum.photos/seed/demo4/800/600", alt: "Sample Image 4", caption: "Abstract art" },
];

const sampleAnnotations: Annotation[] = [
  { id: "1", x: 25, y: 30, text: "Header Section", pointerDirection: "right", icon: "📍", highlight: true },
  { id: "2", x: 75, y: 30, text: "Navigation Menu", pointerDirection: "left", icon: "🔗" },
  { id: "3", x: 50, y: 60, text: "Main Content Area", pointerDirection: "top", icon: "📝", color: COLORS.success },
  { id: "4", x: 50, y: 85, text: "Footer Links", pointerDirection: "bottom", icon: "⬇️" },
];

const storyPanels: StoryPanel[] = [
  { content: "Once upon a time...", mood: "neutral", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { content: "A developer discovered a powerful tool", mood: "positive", background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" },
  { content: "That changed everything!", mood: "dramatic", background: "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)" },
];

// Annotation base content component
const DiagramContent: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      border: "2px solid rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{
        width: "80%",
        height: "70%",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gap: 20,
      }}
    >
      {/* Mock Header */}
      <div
        style={{
          height: 60,
          backgroundColor: "rgba(102, 126, 234, 0.3)",
          borderRadius: 12,
        }}
      />
      {/* Mock Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 20,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 194, 255, 0.2)",
            borderRadius: 12,
          }}
        />
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 12,
          }}
        />
      </div>
      {/* Mock Footer */}
      <div
        style={{
          height: 40,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 12,
        }}
      />
    </div>
  </div>
);

export const TemplateDemo: React.FC<TemplateDemoProps> = ({
  primaryColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Scene 1: Bar Chart */}
      <Sequence durationInFrames={SCENE_DURATION}>
        <DataVisualizationTemplate
          sectionLabel="Data Visualization"
          title="Framework Popularity"
          titleIcon="📊"
          chartType="bar"
          data={barChartData}
          showValues={true}
          showLabels={true}
          barColor={primaryColor}
          highlight={0}
          source="Developer Survey 2024"
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 2: Horizontal Bar Chart */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <DataVisualizationTemplate
          sectionLabel="Performance Metrics"
          title="System Health Overview"
          titleIcon="📈"
          chartType="horizontalBar"
          data={barChartData}
          showValues={true}
          showLabels={true}
          barColor={COLORS.accent}
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 3: Progress Rings */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <DataVisualizationTemplate
          sectionLabel="Quality Scores"
          title="Project Health Status"
          titleIcon="🎯"
          chartType="progress"
          data={progressData}
          showValues={true}
          showLabels={true}
          highlight={0}
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 4: Metrics */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <DataVisualizationTemplate
          sectionLabel="Key Metrics"
          title="Dashboard Overview"
          titleIcon="💹"
          chartType="metric"
          data={metricData}
          showLabels={true}
          highlight={1}
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 5: Horizontal Timeline */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <TimelineTemplate
          title="Project Evolution"
          events={timelineEvents}
          layout="horizontal"
          showConnector={true}
          connectorColor={COLORS.accent}
          revealMode="sequential"
          staggerDelay={12}
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 6: Image Gallery */}
      <Sequence from={SCENE_DURATION * 5} durationInFrames={SCENE_DURATION}>
        <ImageTemplate
          layout="gallery"
          images={sampleImages}
          effect="none"
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 7: Annotation */}
      <Sequence from={SCENE_DURATION * 6} durationInFrames={SCENE_DURATION}>
        <AnnotationTemplate
          baseContent={<DiagramContent />}
          annotations={sampleAnnotations}
          pointerStyle="arrow"
          pointerColor={COLORS.accent}
          annotationStyle="tooltip"
          revealMode="sequential"
          staggerDelay={25}
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>

      {/* Scene 8: Story Sequence */}
      <Sequence from={SCENE_DURATION * 7} durationInFrames={SCENE_DURATION}>
        <StoryTemplate
          panels={storyPanels}
          layout="sequence"
          narrator={{
            text: "Phase 11: Template Expansion Complete!",
            position: "bottom",
            style: "subtitle",
          }}
          durationInFrames={SCENE_DURATION}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default TemplateDemo;
