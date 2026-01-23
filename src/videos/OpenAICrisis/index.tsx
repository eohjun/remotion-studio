/**
 * OpenAI Crisis Video
 * "OpenAI의 위기 - 인류를 위한 AI, 그 약속은 어디로 갔는가"
 *
 * A critical examination of OpenAI's turbulent transformation
 * from a nonprofit research lab to a $500B tech giant.
 */

import React from "react";
import { Sequence, Audio, staticFile, AbsoluteFill } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

import {
  DataVisualizationTemplate,
  ContentTemplate,
  NewsTemplate,
  QuoteTemplate,
  TimelineTemplate,
  OutroTemplate,
} from "../../shared/templates/scenes";
import { AnimatedGradient } from "../../shared/components/backgrounds";
import { EffectsComposer, Vignette, FilmGrain } from "../../shared/components/effects";
import { SCENES, TOTAL_DURATION, THEME } from "./constants";

/** Composition props schema */
export const openAICrisisSchema = z.object({
  primaryColor: zColor(),
  secondaryColor: zColor(),
});

type OpenAICrisisProps = z.infer<typeof openAICrisisSchema>;

// Background component for consistent visual style
const VideoBackground: React.FC = () => (
  <AbsoluteFill>
    <AnimatedGradient
      colors={["#1a1a2e", "#16213e", "#0d1117"]}
      animationMode="pulse"
      cycleDuration={90}
    />
  </AbsoluteFill>
);

// Effects wrapper for cinematic look
const VideoEffects: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EffectsComposer>
    {children}
    <Vignette intensity={0.6} color="#000000" />
    <FilmGrain intensity={0.03} animated />
  </EffectsComposer>
);

export const OpenAICrisis: React.FC<OpenAICrisisProps> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.backgroundColor }}>
      <VideoBackground />
      <VideoEffects>
        {/* Scene 1: Hook - 충격적 통계 */}
        <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
          <DataVisualizationTemplate
            title=""
            chartType="metric"
            data={[
              { label: "포기한 금액", value: 1700000, color: THEME.primaryColor },
              { label: "가족 재산의", value: 85, color: THEME.accentColor },
              { label: "안전팀 퇴사율", value: 50, color: THEME.warningColor },
            ]}
            showValues
            showLabels
            highlight={0}
            durationInFrames={SCENES.HOOK.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/hook.mp3")} />
        </Sequence>

        {/* Scene 2: Promise - 4가지 사건 예고 */}
        <Sequence from={SCENES.PROMISE.start} durationInFrames={SCENES.PROMISE.duration}>
          <ContentTemplate
            sectionLabel="오늘의 주제"
            title="OpenAI의 충격적인 4가지 사건"
            titleIcon="⚠️"
            items={[
              { icon: "👔", text: "CEO 해임 드라마", color: THEME.primaryColor },
              { icon: "🚪", text: "안전팀 대탈주", color: THEME.accentColor },
              { icon: "📜", text: "NDA 스캔들", color: THEME.warningColor },
              { icon: "💰", text: "비영리에서 영리로", color: THEME.successColor },
            ]}
            durationInFrames={SCENES.PROMISE.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/promise.mp3")} />
        </Sequence>

        {/* Scene 3: Board Drama - CEO 해임 */}
        <Sequence from={SCENES.BOARD_DRAMA.start} durationInFrames={SCENES.BOARD_DRAMA.duration}>
          <NewsTemplate
            newsStyle="breaking"
            banner="BREAKING NEWS"
            headline="OpenAI CEO Sam Altman 전격 해임"
            subheadline="2023년 11월 17일 금요일"
            keyPoints={[
              "Microsoft 단 1분 전 통보",
              "Greg Brockman 당일 밤 퇴출",
              "Helen Toner: '이사회에 일관되게 거짓말'",
            ]}
            timestamp="2023.11.17"
            showTicker
            tickerText="BREAKING: OpenAI Board fires CEO Sam Altman | Microsoft notified 1 minute before announcement"
            durationInFrames={SCENES.BOARD_DRAMA.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/boardDrama.mp3")} />
        </Sequence>

        {/* Scene 4: Board Drama Resolution - 복귀 */}
        <Sequence
          from={SCENES.BOARD_DRAMA_RESOLUTION.start}
          durationInFrames={SCENES.BOARD_DRAMA_RESOLUTION.duration}
        >
          <DataVisualizationTemplate
            sectionLabel="직원들의 반응"
            title="CEO 복귀 요구 서명"
            chartType="horizontalBar"
            data={[
              { label: "서명한 직원", value: 700, color: THEME.successColor },
              { label: "전체 직원", value: 800, color: "rgba(255,255,255,0.3)" },
            ]}
            maxValue={800}
            showValues
            showLabels
            highlight={0}
            source="OpenAI Employee Letter, November 2023"
            durationInFrames={SCENES.BOARD_DRAMA_RESOLUTION.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/boardDramaResolution.mp3")} />
        </Sequence>

        {/* Scene 5: Safety Exodus - 안전팀 퇴사 */}
        <Sequence from={SCENES.SAFETY_EXODUS.start} durationInFrames={SCENES.SAFETY_EXODUS.duration}>
          <DataVisualizationTemplate
            sectionLabel="2024년"
            title="AGI 안전 연구팀 현황"
            chartType="bar"
            data={[
              { label: "잔류", value: 16, color: THEME.successColor },
              { label: "퇴사", value: 14, color: THEME.primaryColor },
            ]}
            showValues
            showLabels
            highlight={1}
            source="2024 Reports"
            durationInFrames={SCENES.SAFETY_EXODUS.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/safetyExodus.mp3")} />
        </Sequence>

        {/* Scene 6: Safety Quotes - Jan Leike 인용 */}
        <Sequence from={SCENES.SAFETY_QUOTES.start} durationInFrames={SCENES.SAFETY_QUOTES.duration}>
          <QuoteTemplate
            quote="안전 문화와 프로세스가 화려한 제품에 뒷자리를 차지하게 됐다"
            attribution="Jan Leike, 슈퍼얼라인먼트팀 공동 리더"
            showQuoteMarks
            background={THEME.secondaryColor}
            quoteColor={THEME.textColor}
            context="슈퍼얼라인먼트팀: 설립 1년 만에 해체 | AGI 준비팀: 5개월 뒤 해체"
            durationInFrames={SCENES.SAFETY_QUOTES.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/safetyQuotes.mp3")} />
        </Sequence>

        {/* Scene 7: NDA Scandal */}
        <Sequence from={SCENES.NDA_SCANDAL.start} durationInFrames={SCENES.NDA_SCANDAL.duration}>
          <ContentTemplate
            sectionLabel="주식으로 입막음"
            sectionLabelColor={THEME.primaryColor}
            title="퇴사자 NDA 조건"
            titleIcon="📜"
            content={[
              "평생 전 고용주 비판 금지 서약",
              "거부 시 기득 주식 전액 몰수",
            ]}
            highlightContent="AGI 시점에 OpenAI가 책임감 있게 행동할 것이라는 신뢰를 잃었다 - Daniel Kokotajlo ($1.7M 포기)"
            highlightIcon="💬"
            durationInFrames={SCENES.NDA_SCANDAL.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/ndaScandal.mp3")} />
        </Sequence>

        {/* Scene 8: Altman Response */}
        <Sequence
          from={SCENES.ALTMAN_RESPONSE.start}
          durationInFrames={SCENES.ALTMAN_RESPONSE.duration}
        >
          <QuoteTemplate
            quote="진심으로 부끄럽다"
            attribution="Sam Altman, CEO"
            showQuoteMarks
            background={THEME.secondaryColor}
            quoteColor={THEME.warningColor}
            context="하지만 유출된 문서에는 그와 고위 임원들이 직접 서명한 주식 몰수 조항이 포함"
            durationInFrames={SCENES.ALTMAN_RESPONSE.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/altmanResponse.mp3")} />
        </Sequence>

        {/* Scene 9: Structure Change - 타임라인 */}
        <Sequence
          from={SCENES.STRUCTURE_CHANGE.start}
          durationInFrames={SCENES.STRUCTURE_CHANGE.duration}
        >
          <TimelineTemplate
            title="OpenAI 구조 변화"
            layout="horizontal"
            events={[
              {
                date: "2015",
                title: "비영리 연구소",
                description: "인류 전체를 위한 AI",
                color: THEME.successColor,
              },
              {
                date: "2019",
                title: "이익 상한 자회사",
                description: "Capped-profit",
                color: THEME.warningColor,
              },
              {
                date: "2024",
                title: "영리 법인 개편",
                description: "For-profit 전환",
                color: "#e67e22",
              },
              {
                date: "2025",
                title: "공익법인",
                description: "$500B 가치",
                color: THEME.primaryColor,
                highlight: true,
              },
            ]}
            revealMode="sequential"
            staggerDelay={25}
            connectorColor={THEME.accentColor}
            durationInFrames={SCENES.STRUCTURE_CHANGE.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/structureChange.mp3")} />
        </Sequence>

        {/* Scene 10: Structure Numbers - 지분 구조 */}
        <Sequence
          from={SCENES.STRUCTURE_NUMBERS.start}
          durationInFrames={SCENES.STRUCTURE_NUMBERS.duration}
        >
          <DataVisualizationTemplate
            sectionLabel="새로운 지분 구조"
            title="$500B 기업가치"
            chartType="progress"
            data={[
              { label: "OpenAI 재단", value: 26, color: THEME.successColor },
              { label: "Microsoft, 직원, 투자자", value: 74, color: "#667eea" },
            ]}
            showValues
            showLabels
            highlight={1}
            source="2025 Restructuring Plan"
            durationInFrames={SCENES.STRUCTURE_NUMBERS.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/structureNumbers.mp3")} />
        </Sequence>

        {/* Scene 11: Resolution - 마무리 */}
        <Sequence from={SCENES.RESOLUTION.start} durationInFrames={SCENES.RESOLUTION.duration}>
          <OutroTemplate
            title="질문"
            titleIcon="❓"
            takeaways={[
              { icon: "⏱️", text: "4일 만에 복귀한 CEO" },
              { icon: "🚪", text: "절반이 퇴사한 안전팀" },
              { icon: "💵", text: "170만 달러를 포기한 연구원" },
            ]}
            closingMessage="성장통인가, 사명의 배신인가?"
            closingIcon="🤔"
            background={THEME.secondaryColor}
            closingBackgroundColor={THEME.primaryColor}
            closingTextColor={THEME.textColor}
            durationInFrames={SCENES.RESOLUTION.duration}
            useTransition={false}
          />
          <Audio src={staticFile("videos/OpenAICrisis/audio/resolution.mp3")} />
        </Sequence>
      </VideoEffects>
    </AbsoluteFill>
  );
};

export { TOTAL_DURATION };
export default OpenAICrisis;
