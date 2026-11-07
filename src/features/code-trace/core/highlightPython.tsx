import React from "react";

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "break", "class", "continue", "def",
  "elif", "else", "except", "finally", "for", "from", "if", "import", "in", "is",
  "lambda", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
]);

// strings (incl. f-strings and docstrings on one line), comments, numbers, decorators, words
const TOKEN = /([rbfRBF]{0,2}"""[^]*?"""|[rbfRBF]{0,2}"(?:\\.|[^"\\])*"|[rbfRBF]{0,2}'(?:\\.|[^'\\])*')|(#.*$)|(\b\d+(?:\.\d+)?\b)|(@\w+)|(\b[A-Za-z_]\w*\b)/g;

/** Tokenize one line of Python into styled spans. Unknown text passes through. */
export function highlightPythonLine(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let prevWord = "";
  for (const m of line.matchAll(TOKEN)) {
    const index = m.index ?? 0;
    if (index > last) out.push(line.slice(last, index));
    const [text, str, comment, num, deco, word] = m;
    let cls = "";
    if (str) cls = "tok-string";
    else if (comment) cls = "tok-comment";
    else if (num) cls = "tok-number";
    else if (deco) cls = "tok-decorator";
    else if (word && KEYWORDS.has(word)) cls = "tok-keyword";
    else if (word && (prevWord === "def" || prevWord === "class")) cls = "tok-title";
    out.push(cls ? <span key={index} className={cls}>{text}</span> : text);
    if (word) prevWord = word;
    last = index + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** Render `inline code` spans in explanation text without innerHTML. */
export function renderInlineCode(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    )
  );
}
