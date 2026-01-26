/**
 * Video Style Linting Script
 *
 * Validates video compositions against design system standards:
 * - Font size range validation
 * - Color palette compliance
 * - WCAG AA contrast ratio (4.5:1)
 * - Typography consistency
 *
 * Usage:
 *   node scripts/lint-video-styles.mjs src/videos/TwoMinuteRule/
 *   node scripts/lint-video-styles.mjs src/videos/TwoMinuteRule/ --strict
 *   node scripts/lint-video-styles.mjs src/videos/TwoMinuteRule/ --fix
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// CLI argument parsing
const args = process.argv.slice(2);
const targetPath = args.find((arg) => !arg.startsWith("-"));
const strictMode = args.includes("--strict") || args.includes("-s");
const outputJson = args.includes("--json") || args.includes("-j");
const showFix = args.includes("--fix") || args.includes("-f");

if (!targetPath) {
  console.error("Usage: node scripts/lint-video-styles.mjs <path>");
  console.error("Options:");
  console.error("  -s, --strict  Treat warnings as errors");
  console.error("  -j, --json    Output results as JSON");
  console.error("  -f, --fix     Show suggested fixes");
  process.exit(1);
}

// ============================================
// Design System Constants
// ============================================

const MIN_READABLE_SIZE = 24;
const MAX_FONT_SIZES = {
  landscape: 72,
  portrait: 56,
  square: 56,
};

const VALID_FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

// Approved color palettes
const APPROVED_PALETTES = {
  philosophical: ["#667eea", "#764ba2", "#1a1a2e", "#ffffff", "#a0a0b0", "#f093fb"],
  datadriven: ["#00c2ff", "#667eea", "#16213e", "#ffffff", "#8b9dc3", "#00ff88"],
  narrative: ["#ff6b6b", "#4ecdc4", "#2d1b4e", "#ffffff", "#b8a9c9", "#ffe66d"],
  professional: ["#3498db", "#2c3e50", "#1a252f", "#ecf0f1", "#95a5a6", "#e74c3c"],
  warm: ["#ff7e5f", "#feb47b", "#2d2438", "#ffffff", "#c4b8d4", "#ffe66d"],
  calm: ["#56ccf2", "#2f80ed", "#1f2937", "#f3f4f6", "#9ca3af", "#10b981"],
  tech: ["#00ff88", "#0077ff", "#0a0a0f", "#ffffff", "#6b7280", "#ff00ff"],
  light: ["#6366f1", "#8b5cf6", "#ffffff", "#1f2937", "#6b7280", "#f59e0b"],
};

// Common neutral/utility colors always allowed
const NEUTRAL_COLORS = [
  "#000000", "#ffffff", "#000", "#fff",
  "black", "white", "transparent", "inherit", "currentColor",
];

// ============================================
// Contrast Calculation
// ============================================

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1, color2) {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// ============================================
// Pattern Detection
// ============================================

// Regex patterns for style detection
const PATTERNS = {
  // Font size patterns
  fontSize: /fontSize\s*[:=]\s*(\d+)/g,
  fontSizePixel: /fontSize\s*[:=]\s*['"]?(\d+)(?:px)?['"]?/g,
  fontSizeInterpolate: /interpolate[^)]*\[\s*(\d+)\s*,\s*(\d+)\s*\]/g,

  // Font weight patterns
  fontWeight: /fontWeight\s*[:=]\s*['"]?(\d+|bold|normal|lighter|bolder)['"]?/g,

  // Color patterns (hex)
  hexColor: /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b/g,

  // RGB/RGBA patterns
  rgbaColor: /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g,

  // Color property patterns
  colorProperty: /(color|backgroundColor|background|borderColor|fill|stroke)\s*[:=]\s*['"]?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})['"]?/g,
};

// ============================================
// Lint Rules
// ============================================

const issues = [];
const warnings = [];
const fixes = [];

function addIssue(file, line, rule, message, severity = "error") {
  const item = { file, line, rule, message, severity };
  if (severity === "error") {
    issues.push(item);
  } else {
    warnings.push(item);
  }
}

function addFix(file, line, original, suggested, reason) {
  fixes.push({ file, line, original, suggested, reason });
}

/**
 * Check font sizes in file content
 */
function checkFontSizes(content, filePath, lines) {
  let match;

  // Check direct fontSize assignments
  const fontSizeRegex = /fontSize\s*[:=]\s*(\d+)/g;
  while ((match = fontSizeRegex.exec(content)) !== null) {
    const size = parseInt(match[1], 10);
    const lineNum = getLineNumber(content, match.index);

    if (size < MIN_READABLE_SIZE) {
      addIssue(
        filePath,
        lineNum,
        "min-font-size",
        `Font size ${size}px is below minimum readable size (${MIN_READABLE_SIZE}px)`,
        strictMode ? "error" : "warning"
      );
      addFix(
        filePath,
        lineNum,
        `fontSize: ${size}`,
        `fontSize: ${MIN_READABLE_SIZE}`,
        "Increase to minimum readable size"
      );
    }

    if (size > MAX_FONT_SIZES.landscape) {
      addIssue(
        filePath,
        lineNum,
        "max-font-size",
        `Font size ${size}px exceeds recommended maximum (${MAX_FONT_SIZES.landscape}px)`,
        "warning"
      );
    }
  }
}

/**
 * Check font weights
 */
function checkFontWeights(content, filePath) {
  const fontWeightRegex = /fontWeight\s*[:=]\s*['"]?(\d+)['"]?/g;
  let match;

  while ((match = fontWeightRegex.exec(content)) !== null) {
    const weight = parseInt(match[1], 10);
    const lineNum = getLineNumber(content, match.index);

    if (!VALID_FONT_WEIGHTS.includes(weight)) {
      addIssue(
        filePath,
        lineNum,
        "invalid-font-weight",
        `Invalid font weight: ${weight}. Use standard values: ${VALID_FONT_WEIGHTS.join(", ")}`,
        "warning"
      );
    }
  }
}

/**
 * Check color usage
 */
function checkColors(content, filePath) {
  const hexRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b/g;
  let match;

  const foundColors = new Set();

  while ((match = hexRegex.exec(content)) !== null) {
    const color = match[0].toLowerCase();
    const lineNum = getLineNumber(content, match.index);

    // Normalize 3-char hex to 6-char
    let normalizedColor = color;
    if (color.length === 4) {
      normalizedColor = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }

    foundColors.add(normalizedColor);

    // Check if color is in approved palettes or neutrals
    const isApproved = Object.values(APPROVED_PALETTES).some((palette) =>
      palette.some((c) => c.toLowerCase() === normalizedColor)
    );
    const isNeutral = NEUTRAL_COLORS.some((c) => c.toLowerCase() === normalizedColor);

    if (!isApproved && !isNeutral) {
      // Only warn, don't error - custom colors are sometimes needed
      addIssue(
        filePath,
        lineNum,
        "unapproved-color",
        `Color ${color} is not in approved palettes. Consider using a standard palette color.`,
        "warning"
      );
    }
  }

  return foundColors;
}

/**
 * Check for hardcoded strings that should be design tokens
 */
function checkDesignTokens(content, filePath) {
  // Check for common hardcoded values that should be tokens
  const hardcodedPatterns = [
    { pattern: /padding:\s*(\d+)(?!.*SPACING)/g, token: "SPACING" },
    { pattern: /margin:\s*(\d+)(?!.*SPACING)/g, token: "SPACING" },
    { pattern: /borderRadius:\s*(\d+)(?!.*BORDER_RADIUS)/g, token: "BORDER_RADIUS" },
  ];

  for (const { pattern, token } of hardcodedPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const value = match[1];
      const lineNum = getLineNumber(content, match.index);

      // Only warn for significant values
      if (parseInt(value, 10) > 4) {
        addIssue(
          filePath,
          lineNum,
          "hardcoded-value",
          `Consider using design token (${token}) instead of hardcoded value: ${value}`,
          "warning"
        );
      }
    }
  }
}

/**
 * Check for potential contrast issues
 */
function checkContrastPatterns(content, filePath) {
  // Look for color/backgroundColor pairs in same object
  const styleObjectRegex = /\{[^}]*color\s*:\s*['"]?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})['"]?[^}]*backgroundColor\s*:\s*['"]?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})['"]?[^}]*\}/g;
  let match;

  while ((match = styleObjectRegex.exec(content)) !== null) {
    const colorMatch = match[0].match(/color\s*:\s*['"]?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})['"]?/);
    const bgMatch = match[0].match(/backgroundColor\s*:\s*['"]?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})['"]?/);

    if (colorMatch && bgMatch) {
      let textColor = colorMatch[1].toLowerCase();
      let bgColor = bgMatch[1].toLowerCase();

      // Normalize 3-char hex
      if (textColor.length === 4) {
        textColor = `#${textColor[1]}${textColor[1]}${textColor[2]}${textColor[2]}${textColor[3]}${textColor[3]}`;
      }
      if (bgColor.length === 4) {
        bgColor = `#${bgColor[1]}${bgColor[1]}${bgColor[2]}${bgColor[2]}${bgColor[3]}${bgColor[3]}`;
      }

      const ratio = getContrastRatio(textColor, bgColor);
      const lineNum = getLineNumber(content, match.index);

      if (ratio < 4.5) {
        addIssue(
          filePath,
          lineNum,
          "low-contrast",
          `Low contrast ratio: ${ratio.toFixed(2)} between ${textColor} and ${bgColor} (minimum 4.5:1 for WCAG AA)`,
          strictMode ? "error" : "warning"
        );
      }
    }
  }
}

// ============================================
// Utility Functions
// ============================================

function getLineNumber(content, index) {
  const lines = content.substring(0, index).split("\n");
  return lines.length;
}

// ============================================
// Main Linting
// ============================================

async function lintPath(targetPath) {
  const resolvedPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.join(projectRoot, targetPath);

  const isDirectory = fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory();
  const pattern = isDirectory ? `${resolvedPath}/**/*.tsx` : resolvedPath;

  const files = await glob(pattern);

  if (files.length === 0) {
    console.error(`No .tsx files found in: ${targetPath}`);
    process.exit(1);
  }

  console.log(`\n========================================`);
  console.log(`  VIDEO STYLE LINT`);
  console.log(`========================================\n`);
  console.log(`Checking ${files.length} file(s)...\n`);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(projectRoot, file);
    const lines = content.split("\n");

    checkFontSizes(content, relativePath, lines);
    checkFontWeights(content, relativePath);
    checkColors(content, relativePath);
    checkDesignTokens(content, relativePath);
    checkContrastPatterns(content, relativePath);
  }

  // Results
  const result = {
    files: files.length,
    errors: issues.length,
    warnings: warnings.length,
    fixes: fixes.length,
    passed: issues.length === 0 && (!strictMode || warnings.length === 0),
    issues,
    warnings,
    fixes: showFix ? fixes : undefined,
  };

  if (outputJson) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // Console output
  if (issues.length > 0) {
    console.log("❌ ERRORS:");
    for (const issue of issues) {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   [${issue.rule}] ${issue.message}\n`);
    }
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS:");
    for (const warn of warnings) {
      console.log(`   ${warn.file}:${warn.line}`);
      console.log(`   [${warn.rule}] ${warn.message}\n`);
    }
  }

  if (showFix && fixes.length > 0) {
    console.log("💡 SUGGESTED FIXES:");
    for (const fix of fixes) {
      console.log(`   ${fix.file}:${fix.line}`);
      console.log(`   ${fix.original} → ${fix.suggested}`);
      console.log(`   Reason: ${fix.reason}\n`);
    }
  }

  // Summary
  console.log("----------------------------------------");
  if (result.passed) {
    console.log("✅ LINT PASSED");
  } else if (issues.length > 0) {
    console.log("❌ LINT FAILED");
  } else {
    console.log("⚠️  LINT PASSED WITH WARNINGS");
  }
  console.log(`   ${files.length} files, ${issues.length} errors, ${warnings.length} warnings`);
  console.log("");

  process.exit(result.passed ? 0 : 1);
}

lintPath(targetPath).catch((err) => {
  console.error("Lint error:", err);
  process.exit(1);
});
