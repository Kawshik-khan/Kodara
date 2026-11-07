import React from "react";
import { Link } from "react-router-dom";
import { Check, Terminal, Code, Compass } from "lucide-react";
import { useTranslation } from "@/i18n";
import { ActivityItem } from "../types/dashboard.types";
import { ROUTES } from "@/config/routes";
import "./RecentActivityCard.css";

export interface RecentActivityCardProps {
  activity: ActivityItem[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activity }) => {
  const { t, locale } = useTranslation();

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "lesson_completed":
        return <Check size={13} color="#FF5E1E" strokeWidth={2.5} />;
      case "challenge_passed":
        return <Terminal size={13} color="#FF5E1E" strokeWidth={2.5} />;
      case "concept_mastered":
        return <Code size={13} color="#FF5E1E" strokeWidth={2.5} />;
      case "topic_explored":
        return <Compass size={13} color="#FF5E1E" strokeWidth={2.5} />;
      default:
        return <Check size={13} color="#FF5E1E" strokeWidth={2.5} />;
    }
  };

  return (
    <div className="recent-activity-card" data-testid="recent-activity-card">
      <div className="recent-activity-card__header">
        <h3 className="recent-activity-card__title">
          {t("dashboard.recentActivityTitle")}
        </h3>
        <Link to={ROUTES.PROGRESS} className="recent-activity-card__link">
          {t("dashboard.viewAll")}
        </Link>
      </div>

      <div className="recent-activity-card__list">
        {activity.slice(0, 4).map((item) => {
          const title = locale === "bn" ? item.titleBn : item.titleEn;
          const timestamp = locale === "bn" ? item.timestampBn : item.timestampEn;
          return (
            <div key={item.id} className="recent-activity-card__item">
              <div className="recent-activity-card__icon-wrap">
                {getActivityIcon(item.type)}
              </div>
              <span className="recent-activity-card__item-title">{title}</span>
              <span className="recent-activity-card__item-time">{timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

