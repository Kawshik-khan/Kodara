import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { PracticeBlock as PracticeBlockType } from "../../types/lesson.types";
import "./PracticeBlock.css";

export interface PracticeBlockProps {
  data: PracticeBlockType;
}

export const PracticeBlock: React.FC<PracticeBlockProps> = ({ data }) => {
  const { locale } = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const selectedOption = data.options.find((o) => o.id === selectedOptionId);
  const question = locale === "bn" ? data.questionBn : data.questionEn;

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const getBadgeLabel = () => {
    switch (data.practiceType) {
      case "prediction":
        return locale === "bn" ? "প্রেডিকশন কুইজ" : "Code Prediction";
      case "code-reasoning":
        return locale === "bn" ? "কোড রিজনিং" : "Code Reasoning";
      default:
        return locale === "bn" ? "অনুশীলন প্রশ্ন" : "Practice Question";
    }
  };

  return (
    <div className="kodara-practice" data-testid="practice-block">
      <div className="kodara-practice__header">
        <span className="kodara-practice__badge">{getBadgeLabel()}</span>
      </div>

      <div className="kodara-practice__question">{question}</div>

      {data.codeSnippet && (
        <div className="kodara-practice__code">{data.codeSnippet}</div>
      )}

      <div className="kodara-practice__options">
        {data.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const showResult = isSelected;
          let btnClass = "kodara-practice__option-btn";

          if (showResult) {
            btnClass += opt.isCorrect
              ? " kodara-practice__option-btn--correct"
              : " kodara-practice__option-btn--wrong";
          }

          const optText = locale === "bn" ? opt.textBn : opt.textEn;

          return (
            <button
              key={opt.id}
              type="button"
              className={btnClass}
              onClick={() => handleSelect(opt.id)}
            >
              <span>{optText}</span>
              {showResult && (
                opt.isCorrect ? (
                  <CheckCircle2 size={16} style={{ color: "#16A34A", flexShrink: 0 }} />
                ) : (
                  <XCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} />
                )
              )}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div
          className={`kodara-practice__feedback ${
            selectedOption.isCorrect
              ? "kodara-practice__feedback--correct"
              : "kodara-practice__feedback--wrong"
          }`}
        >
          <strong>
            {selectedOption.isCorrect
              ? locale === "bn"
                ? "✓ সঠিক!"
                : "✓ Correct!"
              : locale === "bn"
              ? "✕ ভুল হয়েছে:"
              : "✕ Not quite:"}
          </strong>{" "}
          {locale === "bn"
            ? selectedOption.explanationBn
            : selectedOption.explanationEn}
        </div>
      )}
    </div>
  );
};
