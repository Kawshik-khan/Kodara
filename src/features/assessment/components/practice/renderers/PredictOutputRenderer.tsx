import React from "react";
import { PredictOutputQuestion } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";
import { Terminal } from "lucide-react";

export const PredictOutputRenderer: React.FC<{
  question: PredictOutputQuestion;
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

      <div className="kodara-predict-output-header">
        <Terminal size={16} />
        <span>
          {locale === "bn"
            ? "এই কোডটি এক্সিকিউট করলে আউটপুট কী হবে?"
            : "What will this code produce upon execution?"}
        </span>
      </div>

      <div className="kodara-question-options-list">
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
              className={`kodara-question-option ${statusClass}`}
              onClick={() => onAnswerChange(opt.id)}
            >
              <pre className="kodara-output-chip">
                <code>{opt.outputString}</code>
              </pre>
            </button>
          );
        })}
      </div>
    </div>
  );
};
