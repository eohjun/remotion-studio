import { describe, it, expect } from "vitest";
import {
  validateConfig,
  parseConfig,
  validateSceneOrder,
  fullValidation,
} from "../config/validate";
import type { CompositionConfig } from "../config/schema";

describe("Config Validation", () => {
  const validConfig: CompositionConfig = {
    id: "test-video",
    name: "Test Video",
    width: 1920,
    height: 1080,
    fps: 30,
    scenes: [
      {
        id: "intro",
        type: "intro",
        title: "Welcome",
        background: "primary",
      },
      {
        id: "content1",
        type: "content",
        title: "Main Content",
        sectionLabel: "Section 1",
      },
      {
        id: "outro",
        type: "outro",
        title: "Thank You",
        closingMessage: "See you next time!",
        background: "primary",
      },
    ],
    transitionDuration: 15,
    sceneBuffer: 15,
  };

  describe("validateConfig", () => {
    it("validates a correct config", () => {
      const result = validateConfig(validConfig);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("fails on missing required fields", () => {
      const result = validateConfig({ id: "test" });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it("fails on invalid scene type", () => {
      const invalidConfig = {
        ...validConfig,
        scenes: [{ id: "test", type: "invalid" }],
      };
      const result = validateConfig(invalidConfig);
      expect(result.success).toBe(false);
    });
  });

  describe("parseConfig", () => {
    it("parses valid JSON config", () => {
      const json = JSON.stringify(validConfig);
      const result = parseConfig(json);
      expect(result.success).toBe(true);
    });

    it("fails on invalid JSON", () => {
      const result = parseConfig("{ invalid json }");
      expect(result.success).toBe(false);
      expect(result.errors![0].message).toContain("Invalid JSON");
    });
  });

  describe("validateSceneOrder", () => {
    it("warns if first scene is not intro", () => {
      const config: CompositionConfig = {
        ...validConfig,
        scenes: [
          { id: "content", type: "content", title: "Test" },
        ],
      };
      const errors = validateSceneOrder(config);
      expect(errors.some(e => e.message.includes("intro"))).toBe(true);
    });

    it("warns if last scene is not outro", () => {
      const config: CompositionConfig = {
        ...validConfig,
        scenes: [
          { id: "intro", type: "intro", title: "Welcome", background: "primary" },
          { id: "content", type: "content", title: "Test" },
        ],
      };
      const errors = validateSceneOrder(config);
      expect(errors.some(e => e.message.includes("outro"))).toBe(true);
    });

    it("detects duplicate scene IDs", () => {
      const config: CompositionConfig = {
        ...validConfig,
        scenes: [
          { id: "scene1", type: "intro", title: "Welcome", background: "primary" },
          { id: "scene1", type: "content", title: "Duplicate" },
        ],
      };
      const errors = validateSceneOrder(config);
      expect(errors.some(e => e.message.includes("Duplicate"))).toBe(true);
    });
  });

  describe("fullValidation", () => {
    it("returns validation and warnings", () => {
      const { validation, warnings } = fullValidation(validConfig);
      expect(validation.success).toBe(true);
      expect(Array.isArray(warnings)).toBe(true);
    });

    it("returns validation errors for invalid config", () => {
      const { validation } = fullValidation({ invalid: true });
      expect(validation.success).toBe(false);
    });
  });
});
