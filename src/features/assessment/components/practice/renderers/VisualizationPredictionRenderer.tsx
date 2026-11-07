import React from "react";
import { VisualizationPredictionQuestion } from "../../../types/practice.types";
import { VisualizationBlock } from "@/features/lessons/components/blocks/VisualizationBlock";
import { useTranslation } from "@/i18n";

export const VisualizationPredictionRenderer: React.FC<{
  question: VisualizationPredictionQuestion;
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

      <div className="kodara-viz-question-embed">
        <VisualizationBlock
          data={{
            id: `viz_block_${question.id}`,
            type: "visualization",
            visualizationId: question.visualizationId,
            titleEn: "Interactive Visualization State Check",
            titleBn: "ইন্টারেক্টিভ ভিজ্যুয়ালাইজেশন স্টেট নিরীক্ষা",
          }}
        />
      </div>

      <div className="kodara-question-options-list" style={{ marginTop: 20 }}>
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
