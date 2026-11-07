import React, { useState } from "react";
import { Check, Copy, HelpCircle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { CodeBlockData } from "../../types/lesson.types";
import "./CodeBlock.css";

export interface CodeBlockProps {
  data: CodeBlockData;
}

/**
 * Basic syntax tokenizer for clean JS/TS code highlighting.
 */
function renderSyntaxHighlightedLine(codeLine: string): React.ReactNode[] {
  // Simple regex tokenizer for keywords, strings, comments, numbers, types
  const regex =
    /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:let|const|var|function|return|if|else|for|while|type|interface|class|export|import|from|new|true|false|null|undefined)\b)|(\b(?:number|string|boolean|any|unknown|void|never|object)\b)|(\b\d+\b)|([{}()[\].,;:+=<>!&|?-])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(codeLine)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(codeLine.slice(lastIndex, match.index));
    }

    const [_full, comment, str, keyword, typeName, num, punct] = match;

    if (comment) {
      nodes.push(
        <span key={match.index} className="token-comment">
          {comment}
        </span>
      );
    } else if (str) {
      nodes.push(
        <span key={match.index} className="token-string">
          {str}
        </span>
      );
    } else if (keyword) {
      nodes.push(
        <span key={match.index} className="token-keyword">
          {keyword}
        </span>
      );
    } else if (typeName) {
      nodes.push(
        <span key={match.index} className="token-type">
          {typeName}
        </span>
      );
    } else if (num) {
      nodes.push(
        <span key={match.index} className="token-number">
          {num}
        </span>
      );
    } else if (punct) {
      nodes.push(
        <span key={match.index} className="token-punctuation">
          {punct}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < codeLine.length) {
    nodes.push(codeLine.slice(lastIndex));
  }

  return nodes;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ data }) => {
  const { locale } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [expandedExplanationLine, setExpandedExplanationLine] = useState<number | null>(null);

  const lines = data.code.split("\n");
  const explanations =
    locale === "bn"
      ? data.lineExplanationsBn || data.lineExplanationsEn
      : data.lineExplanationsEn;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const toggleLineExplanation = (lineNum: number) => {
    setExpandedExplanationLine((prev) => (prev === lineNum ? null : lineNum));
  };

  return (
    <div className="kodara-code-block" data-testid="code-block">
      <div className="kodara-code-block__header">
        <div className="kodara-code-block__title-group">
          <span className="kodara-code-block__lang-badge">{data.language}</span>
          {data.title && <span className="kodara-code-block__title">{data.title}</span>}
        </div>
        <button
          type="button"
          className="kodara-code-block__copy-btn"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={13} />
              <span>{locale === "bn" ? "কপি হয়েছে!" : "Copied!"}</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>{locale === "bn" ? "কপি" : "Copy"}</span>
            </>
          )}
        </button>
      </div>

      <div className="kodara-code-block__body">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = data.highlightedLines?.includes(lineNum);
          const hasExplanation = Boolean(explanations && explanations[lineNum]);
          const isExplanationOpen = expandedExplanationLine === lineNum;

          return (
            <React.Fragment key={lineNum}>
              <div
                className={`kodara-code-block__line ${
                  isHighlighted ? "kodara-code-block__line--highlighted" : ""
                } ${hasExplanation ? "kodara-code-block__line--interactive" : ""}`}
                onClick={hasExplanation ? () => toggleLineExplanation(lineNum) : undefined}
                title={
                  hasExplanation
                    ? locale === "bn"
                      ? "ব্যাখ্যা দেখতে ক্লিক করুন"
                      : "Click to see explanation for this line"
                    : undefined
                }
              >
                <span className="kodara-code-block__line-num">{lineNum}</span>
                <span className="kodara-code-block__line-content">
                  {renderSyntaxHighlightedLine(line)}
                </span>
                {hasExplanation && (
                  <HelpCircle
                    size={13}
                    style={{
                      color: isExplanationOpen ? "#FF5E1E" : "#666",
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>

              {isExplanationOpen && explanations && explanations[lineNum] && (
                <div className="kodara-code-block__explanation-tray">
                  💡 {explanations[lineNum]}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
