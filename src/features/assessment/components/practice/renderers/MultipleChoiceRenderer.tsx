import React from "react";
import { MultipleChoiceQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";

export interface QuestionRendererProps<T> {
  question: T;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}

export const MultipleChoiceRenderer: React.FC<QuestionRendererProps<MultipleChoiceQuestion>> = ({
  question,
  selectedAnswer,
  onAnswerChange,
  isSubmitted,
}) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-question-body">
      {question.codeSnippet && (
        <pre className="kodara-question-code">
          <code>{question.codeSnippet}</code>
        </pre>
      )}

      <div className="kodara-question-options-list" role="radiogroup">
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
              <div className="kodara-question-option__radio">
                {isSelected && <div className="kodara-question-option__radio-dot" />}
              </div>
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
