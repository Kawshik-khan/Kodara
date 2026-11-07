import React, { useState, useEffect } from "react";
import { OrderStepsQuestion, OrderStepItem } from "../../../types/practice.types";
import { useTranslation } from "@/i18n";
import { ArrowUp, ArrowDown } from "lucide-react";

export const OrderStepsRenderer: React.FC<{
  question: OrderStepsQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
}> = ({ question, selectedAnswer, onAnswerChange, isSubmitted }) => {
  const { locale } = useTranslation();
  const [items, setItems] = useState<OrderStepItem[]>(() => {
    if (Array.isArray(selectedAnswer)) {
      return (selectedAnswer as string[])
        .map((id) => question.items.find((item) => item.id === id))
        .filter(Boolean) as OrderStepItem[];
    }
    // Default shuffled state
    return [...question.items].sort(() => (question.id.charCodeAt(0) % 2 === 0 ? 1 : -1));
  });

  useEffect(() => {
    onAnswerChange(items.map((i) => i.id));
  }, [items]);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (isSubmitted) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIdx, 0, moved);
    setItems(newItems);
  };

  return (
    <div className="kodara-question-body">
      <div className="kodara-order-instructions">
        {locale === "bn"
          ? "ধাপগুলোকে সঠিক ক্রমানুসারে সাজাতে ওপরে বা নিচে সরান:"
          : "Move the steps up or down to place them in the correct pipeline sequence:"}
      </div>

      <div className="kodara-order-list">
        {items.map((item, idx) => {
          let statusClass = "";
          if (isSubmitted) {
            statusClass =
              item.correctOrder === idx + 1 ? "kodara-option--correct" : "kodara-option--incorrect";
          }

          return (
            <div key={item.id} className={`kodara-order-item ${statusClass}`}>
              <div className="kodara-order-item__index">{idx + 1}</div>
              <div className="kodara-order-item__label">
                {locale === "bn" ? item.labelBn : item.labelEn}
              </div>
              {!isSubmitted && (
                <div className="kodara-order-item__actions">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, "up")}
                    className="kodara-order-btn"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, "down")}
                    className="kodara-order-btn"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
