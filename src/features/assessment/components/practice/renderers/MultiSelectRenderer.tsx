import React from "react";
import { MultiSelectQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";
import { Check } from "lucide-react";

export const MultiSelectRenderer: React.FC<{
  question: MultiSelectQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();
  const selectedIds = Array.isArray(selectedAnswer) ? (selectedAnswer as string[]) : [];

  const toggleOption = (id: string) => {
    if (isSubmitted) return;
    if (selectedIds.includes(id)) {
      onAnswerChange(selectedIds.filter((item) => item !== id));
    } else {
      onAnswerChange([...selectedIds, id]);
    }
  };

  return (
    <div className="kodara-question-body">
      {question.codeSnippet && (
        <pre className="kodara-question-code">
          <code>{question.codeSnippet}</code>
        </pre>
      )}

      <div className="kodara-question-options-list">
        {question.options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
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
              onClick={() => toggleOption(option.id)}
            >
              <div className="kodara-question-option__checkbox">
                {isSelected && <Check size={14} />}
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
