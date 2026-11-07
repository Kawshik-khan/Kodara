import React from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Recommendation } from "../types/dashboard.types";
import "./RecommendationCard.css";

export interface RecommendationCardProps {
  data: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const basedOn =
    locale === "bn"
      ? data.basedOnBn || "TypeScript-এ আপনার অগ্রগতির ওপর ভিত্তি করে"
      : data.basedOnEn || "Based on your progress in TypeScript";
  const description =
    locale === "bn"
      ? data.descriptionBn || data.titleBn
      : data.descriptionEn || data.titleEn;

  return (
    <div className="recommendation-card" data-testid="recommendation-card">
      <div className="recommendation-card__header">
        <div className="recommendation-card__icon-badge">
          <Lightbulb size={15} color="#FF5E1E" />
        </div>
        <h3 className="recommendation-card__header-title">
          {t("dashboard.recommendedTitle")}
        </h3>
      </div>

      <div className="recommendation-card__body">
        <div className="recommendation-card__title-group">
          <h4 className="recommendation-card__concept-title">{title}</h4>
          <span className="recommendation-card__based-on">{basedOn}</span>
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="recommendation-card__tags">
            {data.tags.map((tag) => (
              <span key={tag} className="recommendation-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="recommendation-card__desc">{description}</p>

        <button
          type="button"
          className="recommendation-card__cta-btn"
          onClick={() => navigate(data.actionUrl)}
        >
          {t("dashboard.recommendedAction")}
        </button>
      </div>
    </div>
  );
};

