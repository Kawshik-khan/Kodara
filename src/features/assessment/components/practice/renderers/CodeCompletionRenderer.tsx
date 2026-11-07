import React from "react";
import { CodeCompletionQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";

export const CodeCompletionRenderer: React.FC<{
  question: CodeCompletionQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();
  const currentBlanks = (selectedAnswer as Record<string, string>) || {};

  const handleBlankChange = (blankId: string, val: string) => {
    if (isSubmitted) return;
    onAnswerChange({
      ...currentBlanks,
      [blankId]: val,
    });
  };

  return (
    <div className="kodara-question-body">
      <div className="kodara-code-completion-instructions">
        {locale === "bn"
          ? "কোডের শূন্যস্থানসমূহ সঠিক টোকেন বা টাইপ দ্বারা পূরণ করুন:"
          : "Fill in the missing code tokens or type annotations:"}
      </div>

      <pre className="kodara-question-code">
        <code>{question.templateCode}</code>
      </pre>

      <div className="kodara-completion-inputs">
        {question.blanks.map((blank) => {
          const userVal = currentBlanks[blank.id] || "";
          let statusClass = "";
          if (isSubmitted) {
            const isCorrect =
              userVal.trim().toLowerCase() === blank.correctValue.trim().toLowerCase() ||
              (blank.acceptableValues || []).some(
                (v) => v.trim().toLowerCase() === userVal.trim().toLowerCase()
              );
            statusClass = isCorrect ? "kodara-input--correct" : "kodara-input--incorrect";
          }

          return (
            <div key={blank.id} className="kodara-completion-field">
              <label className="kodara-completion-label">
                <code>{blank.label}</code>:
              </label>
              {blank.options && blank.options.length > 0 ? (
                <select
                  disabled={isSubmitted}
                  className={`kodara-completion-select ${statusClass}`}
                  value={userVal}
                  onChange={(e) => handleBlankChange(blank.id, e.target.value)}
                >
                  <option value="">
                    {locale === "bn" ? "-- নির্বাচন করুন --" : "-- Select --"}
                  </option>
                  {blank.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  disabled={isSubmitted}
                  className={`kodara-completion-input ${statusClass}`}
                  placeholder={locale === "bn" ? "সঠিক কোড লিখুন..." : "Enter code..."}
                  value={userVal}
                  onChange={(e) => handleBlankChange(blank.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
