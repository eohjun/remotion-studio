/**
 * Caption Utilities for Remotion
 *
 * Functions for parsing and rendering captions within Remotion compositions.
 */

import { interpolate } from "remotion";

// ============================================
// Types
// ============================================

export interface CaptionWord {
  word: string;
  startFrame: number;
  endFrame: number;
  startTime?: number;
  endTime?: number;
}

export interface CaptionSegment {
  text: string;
  startFrame: number;
  endFrame: number;
  words?: CaptionWord[];
}

export interface CaptionSceneTiming {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  segments: CaptionSegment[];
}

export interface CaptionTimingData {
  compositionId: string;
  fps: number;
  scenes: CaptionSceneTiming[];
}

export interface NarrationScene {
  id: string;
  text: string;
  duration?: number;
}

// ============================================
// Parsing Functions
// ============================================

/**
 * Parse narration.json scenes into caption words with frame timing
 */
export function parseNarrationForCaptions(
  scenes: NarrationScene[],
  fps: number = 30
): CaptionWord[] {
  const words: CaptionWord[] = [];
  let currentFrame = 0;

  for (const scene of scenes) {
    const sceneWords = scene.text.split(/\s+/).filter(Boolean);
    const sceneDuration = scene.duration || 5;
    const sceneDurationFrames = sceneDuration * fps;
    const framesPerWord = sceneDurationFrames / sceneWords.length;

    for (let i = 0; i < sceneWords.length; i++) {
      const word = sceneWords[i];
      const startFrame = Math.round(currentFrame + i * framesPerWord);
      let wordDuration = framesPerWord;

      // Add pause after punctuation
      if (/[.!?]$/.test(word)) {
        wordDuration *= 1.3;
      } else if (/[,;:]$/.test(word)) {
        wordDuration *= 1.15;
      }

      const endFrame = Math.min(
        Math.round(startFrame + wordDuration),
        Math.round(currentFrame + sceneDurationFrames)
      );

      words.push({
        word,
        startFrame,
        endFrame,
        startTime: startFrame / fps,
        endTime: endFrame / fps,
      });
    }

    currentFrame += sceneDurationFrames;
  }

  return words;
}

/**
 * Group caption words into display segments
 */
export function groupWordsIntoSegments(
  words: CaptionWord[],
  maxWordsPerSegment: number = 7
): CaptionSegment[] {
  const segments: CaptionSegment[] = [];
  let currentGroup: CaptionWord[] = [];

  for (const word of words) {
    currentGroup.push(word);

    const shouldBreak =
      currentGroup.length >= maxWordsPerSegment || /[.!?]$/.test(word.word);

    if (shouldBreak && currentGroup.length > 0) {
      segments.push({
        text: currentGroup.map((w) => w.word).join(" "),
        startFrame: currentGroup[0].startFrame,
        endFrame: currentGroup[currentGroup.length - 1].endFrame,
        words: [...currentGroup],
      });
      currentGroup = [];
    }
  }

  // Handle remaining words
  if (currentGroup.length > 0) {
    segments.push({
      text: currentGroup.map((w) => w.word).join(" "),
      startFrame: currentGroup[0].startFrame,
      endFrame: currentGroup[currentGroup.length - 1].endFrame,
      words: [...currentGroup],
    });
  }

  return segments;
}

// ============================================
// Frame-based Utilities
// ============================================

/**
 * Get the current caption segment for a given frame
 */
export function getCurrentSegment(
  segments: CaptionSegment[],
  frame: number
): CaptionSegment | null {
  return (
    segments.find(
      (segment) => frame >= segment.startFrame && frame <= segment.endFrame
    ) || null
  );
}

/**
 * Get the current word being spoken at a frame
 */
export function getCurrentWord(
  words: CaptionWord[],
  frame: number
): CaptionWord | null {
  return (
    words.find((word) => frame >= word.startFrame && frame <= word.endFrame) ||
    null
  );
}

/**
 * Calculate word highlight progress (0-1) for karaoke-style captions
 */
export function getWordHighlightProgress(
  word: CaptionWord,
  frame: number
): number {
  if (frame < word.startFrame) return 0;
  if (frame > word.endFrame) return 1;

  return interpolate(frame, [word.startFrame, word.endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Get opacity for a caption segment based on current frame
 * Includes fade in/out transitions
 */
export function getSegmentOpacity(
  segment: CaptionSegment,
  frame: number,
  fadeFrames: number = 5
): number {
  const { startFrame, endFrame } = segment;

  if (frame < startFrame - fadeFrames || frame > endFrame + fadeFrames) {
    return 0;
  }

  // Fade in
  if (frame < startFrame) {
    return interpolate(frame, [startFrame - fadeFrames, startFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Fade out
  if (frame > endFrame) {
    return interpolate(frame, [endFrame, endFrame + fadeFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return 1;
}

// ============================================
// Timing Estimation
// ============================================

/**
 * Estimate word timing from text and duration
 * Uses average speaking rate with punctuation adjustments
 */
export function estimateWordTiming(
  text: string,
  startTimeSeconds: number,
  durationSeconds: number,
  fps: number = 30
): CaptionWord[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const baseTimePerWord = durationSeconds / words.length;
  const result: CaptionWord[] = [];
  let currentTime = startTimeSeconds;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let wordDuration = baseTimePerWord;

    // Add pause after punctuation
    if (/[.!?]$/.test(word)) {
      wordDuration *= 1.3;
    } else if (/[,;:]$/.test(word)) {
      wordDuration *= 1.15;
    }

    const endTime = Math.min(
      currentTime + wordDuration,
      startTimeSeconds + durationSeconds
    );

    result.push({
      word,
      startFrame: Math.round(currentTime * fps),
      endFrame: Math.round(endTime * fps),
      startTime: currentTime,
      endTime,
    });

    currentTime = endTime;
  }

  return result;
}

// ============================================
// SRT/VTT Parsing
// ============================================

/**
 * Parse SRT time format (HH:MM:SS,mmm) to seconds
 */
export function parseSrtTime(timeStr: string): number {
  const [time, ms] = timeStr.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
}

/**
 * Parse VTT time format (HH:MM:SS.mmm) to seconds
 */
export function parseVttTime(timeStr: string): number {
  const [time, ms] = timeStr.split(".");
  const parts = time.split(":").map(Number);

  // VTT can have HH:MM:SS.mmm or MM:SS.mmm
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds + Number(ms) / 1000;
  }

  const [hours, minutes, seconds] = parts;
  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
}

/**
 * Parse SRT content to caption segments
 */
export function parseSrt(content: string, fps: number = 30): CaptionSegment[] {
  const blocks = content.trim().split(/\n\n+/);
  const segments: CaptionSegment[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length < 3) continue;

    // Skip index line, parse time line
    const timeLine = lines[1];
    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (!timeMatch) continue;

    const startTime = parseSrtTime(timeMatch[1]);
    const endTime = parseSrtTime(timeMatch[2]);
    const text = lines.slice(2).join(" ");

    segments.push({
      text,
      startFrame: Math.round(startTime * fps),
      endFrame: Math.round(endTime * fps),
    });
  }

  return segments;
}

/**
 * Parse VTT content to caption segments
 */
export function parseVtt(content: string, fps: number = 30): CaptionSegment[] {
  const lines = content.split("\n");
  const segments: CaptionSegment[] = [];

  let i = 0;
  // Skip WEBVTT header
  while (i < lines.length && !lines[i].includes("-->")) {
    i++;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Look for timestamp line
    const timeMatch = line.match(
      /(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})/
    );

    if (timeMatch) {
      const startTime = parseVttTime(timeMatch[1]);
      const endTime = parseVttTime(timeMatch[2]);

      // Collect text lines until empty line or next timestamp
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() && !lines[i].includes("-->")) {
        // Skip cue identifiers (lines that are just numbers)
        if (!/^\d+$/.test(lines[i].trim())) {
          textLines.push(lines[i]);
        }
        i++;
      }

      if (textLines.length > 0) {
        segments.push({
          text: textLines.join(" "),
          startFrame: Math.round(startTime * fps),
          endFrame: Math.round(endTime * fps),
        });
      }
    } else {
      i++;
    }
  }

  return segments;
}
