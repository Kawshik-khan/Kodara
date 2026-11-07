import React from "react";
import { useTranslation } from "@/i18n";
import "./LessonProgress.css";

export interface LessonProgressProps {
  completedCount: number;
  totalCount: number;
  percent: number;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({
  completedCount,
  totalCount,
  percent,
}) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-lesson-progress" data-testid="lesson-progress">
      <div className="kodara-lesson-progress__top">
        <span className="kodara-lesson-progress__label">
          {locale === "bn" ? "লেসন অগ্রগতি" : "LESSON PROGRESS"}
        </span>
        <span>
          {completedCount} / {totalCount} {locale === "bn" ? "সেকশন" : "sections"}
          {" — "}
          <strong className="kodara-lesson-progress__percent">{percent}%</strong>
        </span>
      </div>

      <div className="kodara-lesson-progress__track">
        <div
          className="kodara-lesson-progress__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
