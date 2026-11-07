import React from "react";
import { Code2 } from "lucide-react";
import "./SynchronizedCodePanel.css";

export interface SynchronizedCodePanelProps {
  code: string;
  language: "typescript" | "javascript" | "python";
  activeLines: number[];
}

function renderSyntaxLine(line: string): React.ReactNode[] {
  const regex =
    /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:let|const|var|function|return|if|else|for|while|type|interface|class|export|import|from|new|true|false|null|undefined)\b)|(\b(?:number|string|boolean|any|unknown|void|never|object)\b)|(\b\d+\b)|([{}()[\].,;:+=<>!&|?-])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
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

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

export const SynchronizedCodePanel: React.FC<SynchronizedCodePanelProps> = ({
  code,
  language,
  activeLines,
}) => {
  const lines = code.split("\n");

  return (
    <div className="kodara-sync-code-panel" data-testid="sync-code-panel">
      <div className="kodara-sync-code-panel__header">
        <div className="kodara-sync-code-panel__title">
          <Code2 size={13} style={{ color: "var(--accent-primary, #FF5E1E)" }} />
          <span>সোর্স কোড / Source</span>
        </div>
        <span className="kodara-sync-code-panel__lang">{language}</span>
      </div>

      <div className="kodara-sync-code-panel__body">
        {lines.map((lineContent, idx) => {
          const lineNum = idx + 1;
          const isActive = activeLines.includes(lineNum);

          return (
            <div
              key={lineNum}
              className={`kodara-sync-code-panel__line ${
                isActive ? "kodara-sync-code-panel__line--active" : ""
              }`}
            >
              <span className="kodara-sync-code-panel__num">{lineNum}</span>
              <span className="kodara-sync-code-panel__content">
                {renderSyntaxLine(lineContent)}
              </span>
              {isActive && (
                <span className="kodara-sync-code-panel__active-indicator">
                  ◀
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
