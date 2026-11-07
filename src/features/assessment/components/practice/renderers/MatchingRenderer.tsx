import React from "react";
import { MatchingQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";

export const MatchingRenderer: React.FC<{
  question: MatchingQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();
  const currentMatches = (selectedAnswer as Record<string, string>) || {};

  const handleSelectMatch = (leftId: string, rightId: string) => {
    if (isSubmitted) return;
    onAnswerChange({
      ...currentMatches,
      [leftId]: rightId,
    });
  };

  return (
    <div className="kodara-question-body">
      <div className="kodara-matching-instructions">
        {locale === "bn"
          ? "বামপাশের প্রতিটি আইটেমের সাথে সঠিক ডানপাশের আচরণটি মেলাুন:"
          : "Match each left-side concept or symbol with its corresponding right-side behavior:"}
      </div>

      <div className="kodara-matching-grid">
        {question.pairs.map((pair) => {
          const selectedRightId = currentMatches[pair.id] || "";
          let statusClass = "";
          if (isSubmitted) {
            statusClass =
              selectedRightId === pair.id ? "kodara-option--correct" : "kodara-option--incorrect";
          }

          return (
            <div key={pair.id} className={`kodara-matching-row ${statusClass}`}>
              <div className="kodara-matching-left">
                <code>{locale === "bn" ? pair.leftBn : pair.leftEn}</code>
              </div>
              <div className="kodara-matching-arrow">→</div>
              <div className="kodara-matching-right">
                <select
                  disabled={isSubmitted}
                  className="kodara-matching-select"
                  value={selectedRightId}
                  onChange={(e) => handleSelectMatch(pair.id, e.target.value)}
                >
                  <option value="">
                    {locale === "bn" ? "-- আচরণ নির্বাচন করুন --" : "-- Select Behavior --"}
                  </option>
                  {question.pairs.map((target) => (
                    <option key={target.id} value={target.id}>
                      {locale === "bn" ? target.rightBn : target.rightEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
