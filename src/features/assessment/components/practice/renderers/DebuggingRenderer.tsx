import React from "react";
import { DebuggingQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";
import { AlertCircle } from "lucide-react";

export const DebuggingRenderer: React.FC<{
  question: DebuggingQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-question-body">
      <div className="kodara-debug-header">
        <AlertCircle size={16} className="kodara-debug-icon" />
        <span>{locale === "bn" ? "ত্রুটিযুক্ত কোড (Broken Code):" : "Broken Code:"}</span>
      </div>

      <pre className="kodara-question-code kodara-question-code--broken">
        <code>{question.brokenCode}</code>
      </pre>

      {question.compilerErrorText && (
        <div className="kodara-compiler-error-box">
          <pre>
            <code>{question.compilerErrorText}</code>
          </pre>
        </div>
      )}

      <div className="kodara-debug-instruction">
        {locale === "bn"
          ? "নিচের কোন কোড ফিক্সটি টাইপ-সেফটি এবং সঠিক আচরণ নিশ্চিত করে?"
          : "Which code fix resolves the error with proper type safety?"}
      </div>

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
              <pre className="kodara-fix-code">
                <code>{option.fixedCode}</code>
              </pre>
            </button>
          );
        })}
      </div>
    </div>
  );
};
