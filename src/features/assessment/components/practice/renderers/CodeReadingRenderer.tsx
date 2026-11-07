import React from "react";
import { CodeReadingQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";

export const CodeReadingRenderer: React.FC<{
  question: CodeReadingQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-question-body">
      <pre className="kodara-question-code">
        <code>{question.codeSnippet}</code>
      </pre>

      <div className="kodara-question-options-list">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          let statusClass = "";
          if (isSubmitted) {
            if (option.isCorrect) statusClass = "kodara-option--correct";
            else if (isSelected && !option.isCorrect) statusClass = "kodara-option--incorrect";
          } else if (isSelected) {
            statusClass = "kodara-option--selected";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isSubmitted}
              className={`kodara-question-option ${statusClass}`}
              onClick={() => onAnswerChange(option.id)}
            >
              <span className="kodara-question-option__text">
                {locale === "bn" ? option.textBn : option.textEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
