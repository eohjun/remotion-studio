import { describe, it, expect } from "vitest";
import {
  framesToSeconds,
  secondsToFrames,
  framesToTimeString,
  calculateSceneTiming,
  calculateSceneTimings,
  getTotalDuration,
  TIMING_PRESETS,
} from "../utils/timing";

describe("Timing Utilities", () => {
  describe("framesToSeconds", () => {
    it("converts frames to seconds at default 30fps", () => {
      expect(framesToSeconds(30)).toBe(1);
      expect(framesToSeconds(60)).toBe(2);
      expect(framesToSeconds(90)).toBe(3);
    });

    it("converts frames to seconds at custom fps", () => {
      expect(framesToSeconds(60, 60)).toBe(1);
      expect(framesToSeconds(120, 60)).toBe(2);
    });
  });

  describe("secondsToFrames", () => {
    it("converts seconds to frames at default 30fps", () => {
      expect(secondsToFrames(1)).toBe(30);
      expect(secondsToFrames(2)).toBe(60);
      expect(secondsToFrames(1.5)).toBe(45);
    });

    it("converts seconds to frames at custom fps", () => {
      expect(secondsToFrames(1, 60)).toBe(60);
      expect(secondsToFrames(2, 60)).toBe(120);
    });

    it("rounds to nearest frame", () => {
      expect(secondsToFrames(1.01)).toBe(30); // 30.3 -> 30
      expect(secondsToFrames(1.02)).toBe(31); // 30.6 -> 31
    });
  });

  describe("framesToTimeString", () => {
    it("formats frames as MM:SS", () => {
      expect(framesToTimeString(0)).toBe("00:00");
      expect(framesToTimeString(30)).toBe("00:01");
      expect(framesToTimeString(60)).toBe("00:02");
      expect(framesToTimeString(1800)).toBe("01:00");
      expect(framesToTimeString(3600)).toBe("02:00");
    });

    it("pads single digit values", () => {
      expect(framesToTimeString(270)).toBe("00:09");
    });
  });

  describe("calculateSceneTiming", () => {
    it("calculates timing with default buffer", () => {
      const timing = calculateSceneTiming(0, 10);
      expect(timing.start).toBe(0);
      expect(timing.duration).toBe(315); // 10 * 30 + 15
      expect(timing.end).toBe(315);
    });

    it("calculates timing with custom buffer", () => {
      const timing = calculateSceneTiming(100, 5, 30, 0);
      expect(timing.start).toBe(100);
      expect(timing.duration).toBe(150); // 5 * 30 + 0
      expect(timing.end).toBe(250);
    });
  });

  describe("calculateSceneTimings", () => {
    it("calculates cumulative timings for multiple scenes", () => {
      const timings = calculateSceneTimings([5, 10, 8]);

      expect(timings).toHaveLength(3);
      expect(timings[0].start).toBe(0);
      expect(timings[1].start).toBe(timings[0].end);
      expect(timings[2].start).toBe(timings[1].end);
    });
  });

  describe("getTotalDuration", () => {
    it("returns 0 for empty timings", () => {
      expect(getTotalDuration([])).toBe(0);
    });

    it("returns end of last scene", () => {
      const timings = calculateSceneTimings([5, 10]);
      expect(getTotalDuration(timings)).toBe(timings[1].end);
    });
  });

  describe("TIMING_PRESETS", () => {
    it("has expected presets", () => {
      expect(TIMING_PRESETS.quick).toBe(10);
      expect(TIMING_PRESETS.normal).toBe(15);
      expect(TIMING_PRESETS.slow).toBe(25);
      expect(TIMING_PRESETS.fadeIn).toBe(15);
      expect(TIMING_PRESETS.fadeOut).toBe(15);
    });
  });
});
