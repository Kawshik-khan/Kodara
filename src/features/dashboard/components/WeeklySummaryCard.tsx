import React from "react";
import { Calendar, CheckCircle2, Code2, Clock, Flame } from "lucide-react";
import { BentoCard } from "@/components/ui/Card";
import { useTranslation } from "@/i18n";
import { WeeklyMetrics } from "../types/dashboard.types";
import "./WeeklySummaryCard.css";

export interface WeeklySummaryCardProps {
  weekly: WeeklyMetrics;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ weekly }) => {
  const { t, locale } = useTranslation();

  return (
    <BentoCard
      className="weekly-summary-card"
      header={
        <div className="weekly-summary-card__header">
          <div className="weekly-summary-card__title-wrap">
            <Calendar size={16} className="weekly-summary-card__icon" />
            <h3 className="weekly-summary-card__title">{t("dashboard.weeklySummaryTitle")}</h3>
          </div>
        </div>
      }
    >
      <div className="weekly-summary-card__grid">
        <div className="weekly-stat">
          <div className="weekly-stat__icon weekly-stat__icon--lessons">
            <CheckCircle2 size={16} />
          </div>
          <div className="weekly-stat__info">
            <span className="weekly-stat__value font-mono">{weekly.lessonsCompleted}</span>
            <span className="weekly-stat__label">{t("dashboard.lessonsCount")}</span>
          </div>
        </div>

        <div className="weekly-stat">
          <div className="weekly-stat__icon weekly-stat__icon--challenges">
            <Code2 size={16} />
          </div>
          <div className="weekly-stat__info">
            <span className="weekly-stat__value font-mono">{weekly.challengesSolved}</span>
            <span className="weekly-stat__label">{t("dashboard.challengesCount")}</span>
          </div>
        </div>

        <div className="weekly-stat">
          <div className="weekly-stat__icon weekly-stat__icon--time">
            <Clock size={16} />
          </div>
          <div className="weekly-stat__info">
            <span className="weekly-stat__value font-mono">{weekly.timeMinutes}</span>
            <span className="weekly-stat__label">{t("dashboard.timeSpent")}</span>
          </div>
        </div>

        <div className="weekly-stat">
          <div className="weekly-stat__icon weekly-stat__icon--streak">
            <Flame size={16} />
          </div>
          <div className="weekly-stat__info">
            <span className="weekly-stat__value font-mono">
              {weekly.streakDays} {locale === "bn" ? "দিন" : "d"}
            </span>
            <span className="weekly-stat__label">
              {locale === "bn" ? "অবিচ্ছিন্ন রেকর্ড" : "Active Streak"}
            </span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
