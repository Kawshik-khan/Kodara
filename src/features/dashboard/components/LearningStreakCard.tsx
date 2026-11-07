import React from "react";
import { Flame } from "lucide-react";
import { useTranslation } from "@/i18n";
import { LearningStreakData } from "../types/dashboard.types";
import { HairlineStreak } from "./visuals";
import "./LearningStreakCard.css";

export interface LearningStreakCardProps {
  data: LearningStreakData;
}

export const LearningStreakCard: React.FC<LearningStreakCardProps> = ({ data }) => {
  const { t, locale } = useTranslation();

  const statusText = locale === "bn" ? data.statusBn : data.statusEn;
  const daysCount = locale === "bn" ? `${data.days} দিন` : `${data.days} days`;

  return (
    <div className="learning-streak-card" data-testid="learning-streak-card">
      <div className="learning-streak-card__header">
        <div className="learning-streak-card__icon-badge">
          <Flame size={15} color="#FF5E1E" strokeWidth={1.5} />
        </div>
        <h3 className="learning-streak-card__header-title">
          {t("dashboard.learningStreak")}
        </h3>
      </div>

      <div className="learning-streak-card__body">
        <div className="learning-streak-card__stat-group">
          <div className="learning-streak-card__days font-mono">{daysCount}</div>
          <span className="learning-streak-card__status">{statusText}</span>
        </div>

        <HairlineStreak days={data.daysOfWeek} />
      </div>
    </div>
  );
};
