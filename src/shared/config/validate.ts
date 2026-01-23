import { CompositionConfigSchema, type CompositionConfig } from "./schema";

/**
 * Validation utilities for composition configs
 */

export interface ValidationResult {
  success: boolean;
  data?: CompositionConfig;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Validate a composition config against the schema
 */
export function validateConfig(config: unknown): ValidationResult {
  const result = CompositionConfigSchema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    success: false,
    errors,
  };
}

/**
 * Parse and validate JSON config string
 */
export function parseConfig(jsonString: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonString);
    return validateConfig(parsed);
  } catch (e) {
    return {
      success: false,
      errors: [
        {
          path: "root",
          message: `Invalid JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
        },
      ],
    };
  }
}

/**
 * Validate scene order and dependencies
 */
export function validateSceneOrder(config: CompositionConfig): ValidationError[] {
  const errors: ValidationError[] = [];
  const sceneIds = new Set<string>();

  for (let i = 0; i < config.scenes.length; i++) {
    const scene = config.scenes[i];

    // Check for duplicate IDs
    if (sceneIds.has(scene.id)) {
      errors.push({
        path: `scenes[${i}].id`,
        message: `Duplicate scene ID: ${scene.id}`,
      });
    }
    sceneIds.add(scene.id);

    // Recommend intro at start
    if (i === 0 && scene.type !== "intro") {
      errors.push({
        path: `scenes[0]`,
        message: `First scene is typically an intro, found: ${scene.type}`,
      });
    }

    // Recommend outro at end
    if (i === config.scenes.length - 1 && scene.type !== "outro") {
      errors.push({
        path: `scenes[${i}]`,
        message: `Last scene is typically an outro, found: ${scene.type}`,
      });
    }
  }

  return errors;
}

/**
 * Full validation with warnings
 */
export function fullValidation(config: unknown): {
  validation: ValidationResult;
  warnings: ValidationError[];
} {
  const validation = validateConfig(config);

  if (!validation.success || !validation.data) {
    return { validation, warnings: [] };
  }

  const warnings = validateSceneOrder(validation.data);

  return { validation, warnings };
}
