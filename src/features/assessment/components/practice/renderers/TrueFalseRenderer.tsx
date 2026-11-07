import React from "react";
import { TrueFalseQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";

export const TrueFalseRenderer: React.FC<{
  question: TrueFalseQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-question-body">
      {question.codeSnippet && (
        <pre className="kodara-question-code">
          <code>{question.codeSnippet}</code>
        </pre>
      )}

      <div className="kodara-tf-buttons">
        {[true, false].map((val) => {
          const isSelected = selectedAnswer === val;
          let statusClass = "";
          if (isSubmitted) {
            if (val === question.correctAnswer) statusClass = "kodara-option--correct";
            else if (isSelected && val !== question.correctAnswer) statusClass = "kodara-option--incorrect";
          } else if (isSelected) {
            statusClass = "kodara-option--selected";
          }

          return (
            <button
              key={String(val)}
              type="button"
              disabled={isSubmitted}
              className={`kodara-tf-btn ${statusClass}`}
              onClick={() => onAnswerChange(val)}
            >
              <span>
                {val
                  ? locale === "bn"
                    ? "সত্য (True)"
                    : "True"
                  : locale === "bn"
                  ? "মিথ্যা (False)"
                  : "False"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
