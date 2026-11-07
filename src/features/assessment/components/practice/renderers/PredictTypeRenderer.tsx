import React from "react";
import { PredictTypeQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";

export const PredictTypeRenderer: React.FC<{
  question: PredictTypeQuestion;
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

      <div className="kodara-predict-type-header">
        {locale === "bn"
          ? `টাইপস্ক্রিপ্ট কোন টাইপটি অনুমিত (infer) করবে?`
          : `What type does TypeScript infer?`}
      </div>

      <div className="kodara-type-options-grid">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.id;
          let statusClass = "";
          if (isSubmitted) {
            if (opt.isCorrect) statusClass = "kodara-option--correct";
            else if (isSelected && !opt.isCorrect) statusClass = "kodara-option--incorrect";
          } else if (isSelected) {
            statusClass = "kodara-option--selected";
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isSubmitted}
              className={`kodara-type-option-chip ${statusClass}`}
              onClick={() => onAnswerChange(opt.id)}
            >
              <code>{opt.typeString}</code>
            </button>
          );
        })}
      </div>
    </div>
  );
};
