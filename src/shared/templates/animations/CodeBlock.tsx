import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

/**
 * Supported programming languages
 */
export type CodeLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "jsx"
  | "tsx"
  | "css"
  | "html"
  | "json"
  | "bash"
  | "text";

/**
 * Code animation styles
 */
export type CodeAnimation = "typewriter" | "highlight-lines" | "reveal" | "none";

/**
 * Color theme presets
 */
export type CodeTheme = "dark" | "monokai" | "github" | "dracula";

/**
 * Theme color configurations
 */
interface ThemeColors {
  background: string;
  text: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  operator: string;
  lineNumber: string;
  lineHighlight: string;
}

const THEMES: Record<CodeTheme, ThemeColors> = {
  dark: {
    background: "#1e1e1e",
    text: "#d4d4d4",
    keyword: "#569cd6",
    string: "#ce9178",
    number: "#b5cea8",
    comment: "#6a9955",
    function: "#dcdcaa",
    operator: "#d4d4d4",
    lineNumber: "#858585",
    lineHighlight: "rgba(255, 255, 255, 0.1)",
  },
  monokai: {
    background: "#272822",
    text: "#f8f8f2",
    keyword: "#f92672",
    string: "#e6db74",
    number: "#ae81ff",
    comment: "#75715e",
    function: "#a6e22e",
    operator: "#f8f8f2",
    lineNumber: "#90908a",
    lineHighlight: "rgba(255, 255, 255, 0.1)",
  },
  github: {
    background: "#ffffff",
    text: "#24292e",
    keyword: "#d73a49",
    string: "#032f62",
    number: "#005cc5",
    comment: "#6a737d",
    function: "#6f42c1",
    operator: "#24292e",
    lineNumber: "#959da5",
    lineHighlight: "rgba(0, 0, 0, 0.05)",
  },
  dracula: {
    background: "#282a36",
    text: "#f8f8f2",
    keyword: "#ff79c6",
    string: "#f1fa8c",
    number: "#bd93f9",
    comment: "#6272a4",
    function: "#50fa7b",
    operator: "#ff79c6",
    lineNumber: "#6272a4",
    lineHighlight: "rgba(255, 255, 255, 0.1)",
  },
};

/**
 * Props for CodeBlock component
 */
export interface CodeBlockProps {
  /** The code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: CodeLanguage;
  /** Animation style */
  animation?: CodeAnimation;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
  /** Color theme */
  theme?: CodeTheme;
  /** Frame when animation starts */
  startFrame?: number;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Padding around code */
  padding?: number;
  /** Border radius */
  borderRadius?: number;
  /** Title/filename to display */
  title?: string;
  /** Typing speed for typewriter (chars per frame) */
  typingSpeed?: number;
  /** Custom container style */
  containerStyle?: React.CSSProperties;
}

/**
 * Simple token types for basic syntax highlighting
 */
type TokenType = "keyword" | "string" | "number" | "comment" | "function" | "operator" | "text";

interface Token {
  type: TokenType;
  value: string;
}

/**
 * Simple tokenizer for basic syntax highlighting
 * Note: This is a simplified tokenizer. For production use,
 * consider integrating a proper syntax highlighter like Prism.
 */
const tokenize = (code: string, language: CodeLanguage): Token[] => {
  // Language parameter reserved for future language-specific tokenization
  void language;
  const tokens: Token[] = [];
  const patterns: Array<{ type: TokenType; regex: RegExp }> = [
    // Comments
    { type: "comment", regex: /^(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/ },
    // Strings
    { type: "string", regex: /^("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/ },
    // Numbers
    { type: "number", regex: /^(\d+\.?\d*|\.\d+)/ },
    // Keywords
    {
      type: "keyword",
      regex:
        /^(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|true|false|null|undefined|def|print|elif|pass|None|True|False|interface|type|extends|implements)\b/,
    },
    // Function calls
    { type: "function", regex: /^([a-zA-Z_$][\w$]*)\s*(?=\()/ },
    // Operators
    { type: "operator", regex: /^([+\-*/%=<>!&|^~?:;,{}[\]().]+)/ },
    // Regular text/identifiers
    { type: "text", regex: /^[a-zA-Z_$][\w$]*/ },
    // Whitespace
    { type: "text", regex: /^\s+/ },
  ];

  let remaining = code;
  while (remaining.length > 0) {
    let matched = false;
    for (const { type, regex } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push({ type, value: match[0] });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Fallback: push single character
      tokens.push({ type: "text", value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
};

/**
 * Render tokens with syntax highlighting
 */
const renderTokens = (tokens: Token[], colors: ThemeColors): React.ReactNode[] => {
  return tokens.map((token, index) => {
    let color: string;
    switch (token.type) {
      case "keyword":
        color = colors.keyword;
        break;
      case "string":
        color = colors.string;
        break;
      case "number":
        color = colors.number;
        break;
      case "comment":
        color = colors.comment;
        break;
      case "function":
        color = colors.function;
        break;
      case "operator":
        color = colors.operator;
        break;
      default:
        color = colors.text;
    }

    return (
      <span key={index} style={{ color }}>
        {token.value}
      </span>
    );
  });
};

/**
 * CodeBlock - Animated code display component
 *
 * Displays code with syntax highlighting and animation effects.
 * Supports multiple themes and animation styles.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code={`const greeting = "Hello, World!";
 * console.log(greeting);`}
 *   language="javascript"
 *   animation="typewriter"
 *   theme="monokai"
 *   showLineNumbers
 * />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  animation = "typewriter",
  highlightLines = [],
  theme = "dark",
  startFrame = 0,
  showLineNumbers = true,
  fontSize = 24,
  fontFamily = "'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
  padding = 24,
  borderRadius = 12,
  title,
  typingSpeed = 2,
  containerStyle = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = THEMES[theme];
  const lines = code.split("\n");

  // Calculate visible characters for typewriter effect
  const getVisibleCode = (): string => {
    if (animation !== "typewriter") {
      return code;
    }

    const elapsed = frame - startFrame;
    if (elapsed <= 0) {
      return "";
    }

    const charsToShow = Math.floor(elapsed * typingSpeed);
    return code.slice(0, charsToShow);
  };

  // Calculate line highlight opacity
  const getLineHighlight = (lineIndex: number): number => {
    if (!highlightLines.includes(lineIndex + 1)) {
      return 0;
    }

    if (animation === "highlight-lines") {
      // Animate highlight appearance
      const delay = highlightLines.indexOf(lineIndex + 1) * 10;
      return spring({
        frame: frame - startFrame - delay,
        fps,
        config: { damping: 80, mass: 0.5, stiffness: 200 },
      });
    }

    return 1;
  };

  // Calculate reveal progress for reveal animation
  const getRevealProgress = (lineIndex: number): number => {
    if (animation !== "reveal") {
      return 1;
    }

    const linesDelay = 5; // frames between each line
    const lineStartFrame = startFrame + lineIndex * linesDelay;

    return spring({
      frame: frame - lineStartFrame,
      fps,
      config: { damping: 80, mass: 0.5, stiffness: 200 },
    });
  };

  const visibleCode = getVisibleCode();
  const visibleLines = visibleCode.split("\n");

  return (
    <div
      style={{
        backgroundColor: colors.background,
        borderRadius,
        overflow: "hidden",
        fontFamily,
        fontSize,
        ...containerStyle,
      }}
    >
      {/* Title bar */}
      {title && (
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            color: colors.lineNumber,
            fontSize: fontSize * 0.65,
          }}
        >
          {title}
        </div>
      )}

      {/* Code content */}
      <div style={{ padding, overflow: "hidden" }}>
        {lines.map((line, lineIndex) => {
          const highlightOpacity = getLineHighlight(lineIndex);
          const revealProgress = getRevealProgress(lineIndex);
          const isVisible = animation === "typewriter" ? lineIndex < visibleLines.length : true;

          // For typewriter, show partial line content
          const displayLine =
            animation === "typewriter" && lineIndex === visibleLines.length - 1
              ? visibleLines[lineIndex]
              : line;

          if (!isVisible && animation === "typewriter") {
            return null;
          }

          const tokens = tokenize(displayLine || "", language);

          return (
            <div
              key={lineIndex}
              style={{
                display: "flex",
                alignItems: "flex-start",
                backgroundColor:
                  highlightOpacity > 0
                    ? `rgba(${theme === "github" ? "0, 0, 0" : "255, 255, 255"}, ${highlightOpacity * 0.1})`
                    : "transparent",
                opacity: animation === "reveal" ? revealProgress : 1,
                transform: animation === "reveal" ? `translateX(${interpolate(revealProgress, [0, 1], [20, 0])}px)` : undefined,
                minHeight: "1.5em",
                lineHeight: 1.5,
              }}
            >
              {/* Line number */}
              {showLineNumbers && (
                <span
                  style={{
                    width: "3em",
                    textAlign: "right",
                    paddingRight: "1em",
                    color: colors.lineNumber,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {lineIndex + 1}
                </span>
              )}

              {/* Code line */}
              <code style={{ color: colors.text, whiteSpace: "pre" }}>
                {renderTokens(tokens, colors)}
                {/* Cursor for typewriter */}
                {animation === "typewriter" &&
                  lineIndex === visibleLines.length - 1 &&
                  frame > startFrame && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "0.6em",
                        height: "1em",
                        backgroundColor: colors.text,
                        marginLeft: 2,
                        opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                      }}
                    />
                  )}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Calculate the duration needed for typewriter animation
 */
export const calculateCodeTypingDuration = (
  code: string,
  typingSpeed: number,
): number => {
  return Math.ceil(code.length / typingSpeed);
};

export default CodeBlock;
