import React from "react";
import { CheckCircle, HelpCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import "./PracticeCard.css";

export interface PracticeCardProps {
  titleEn?: string;
  titleBn?: string;
  questionCount: number;
  estimatedMinutes: number;
  conceptNames: string[];
  isCompleted?: boolean;
  onStartPractice: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  titleEn = "Practice & Mental Models",
  titleBn = "প্র্যাকটিস ও মেন্টাল মডেল",
  questionCount,
  estimatedMinutes,
  conceptNames,
  isCompleted = false,
  onStartPractice,
}) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-practice-card" data-testid="practice-card">
      <div className="kodara-practice-card__header">
        <div className="kodara-practice-card__tag">
          <HelpCircle size={14} />
          <span>{locale === "bn" ? "প্র্যাকটিস সেশন" : "PRACTICE SESSION"}</span>
        </div>
        {isCompleted && (
          <div className="kodara-practice-card__completed-badge">
            <CheckCircle size={14} />
            <span>{locale === "bn" ? "সম্পন্ন" : "Completed"}</span>
          </div>
        )}
      </div>

      <h4 className="kodara-practice-card__title">
        {locale === "bn" ? titleBn : titleEn}
      </h4>

      <p className="kodara-practice-card__subtitle">
        {locale === "bn"
          ? "ধারণাভিত্তিক বোঝাপড়া নিরীক্ষা করুন ও মেন্টাল মডেল শক্ত করুন।"
          : "Test conceptual understanding, type reasoning, and mental models."}
      </p>

      <div className="kodara-practice-card__meta">
        <span className="kodara-practice-card__meta-item">
          <strong>{questionCount}</strong> {locale === "bn" ? "টি প্রশ্ন" : "questions"}
        </span>
        <span className="kodara-practice-card__meta-dot">•</span>
        <span className="kodara-practice-card__meta-item">
          ~<strong>{estimatedMinutes}</strong> {locale === "bn" ? "মি" : "min"}
        </span>
      </div>

      {conceptNames.length > 0 && (
        <div className="kodara-practice-card__concepts">
          {conceptNames.map((name, idx) => (
            <span key={idx} className="kodara-practice-card__concept-pill">
              {name}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className="kodara-practice-card__start-btn"
        onClick={onStartPractice}
      >
        <span>
          {isCompleted
            ? locale === "bn"
              ? "পুনরায় প্র্যাকটিস শুরু করুন"
              : "Re-take Practice"
            : locale === "bn"
            ? "প্র্যাকটিস শুরু করুন"
            : "Start Practice"}
        </span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
