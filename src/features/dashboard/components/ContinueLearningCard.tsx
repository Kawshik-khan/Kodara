import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { TsBadgeIcon } from "@/components/navigation/NavIcons";
import { ContinueLearningData } from "../types/dashboard.types";
import { HairlineMeter } from "@/components/visual/hairline";
import { HairlineMemoryStack } from "./visuals";
import "./ContinueLearningCard.css";

export interface ContinueLearningCardProps {
  data: ContinueLearningData;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ data }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const trackTitle = locale === "bn" ? data.trackTitleBn : data.trackTitleEn;
  const moduleTitle = locale === "bn" ? data.moduleTitleBn : data.moduleTitleEn;
  const lessonTitle = locale === "bn" ? data.lessonTitleBn : data.lessonTitleEn;
  const description =
    locale === "bn"
      ? data.descriptionBn || data.moduleTitleBn
      : data.descriptionEn || data.moduleTitleEn;

  return (
    <div className="continue-learning-card" data-testid="continue-learning-card">
      <div className="continue-learning-card__header-label">
        {t("dashboard.continueLearningTitle")}
      </div>

      <div className="continue-learning-card__grid">
        <div className="continue-learning-card__content">
          <div className="continue-learning-card__badge-row">
            <div className="continue-learning-card__ts-badge">
              <TsBadgeIcon size={18} />
            </div>
            <span className="continue-learning-card__track-name">{trackTitle}</span>
          </div>

          <h2 className="continue-learning-card__title">{lessonTitle}</h2>
          <div className="continue-learning-card__subtitle">{moduleTitle}</div>

          <p className="continue-learning-card__desc">{description}</p>

          <div className="continue-learning-card__progress-wrap">
            <HairlineMeter value={data.progressPercent} />
            <span className="continue-learning-card__progress-val font-mono">
              {data.progressPercent}%
            </span>
          </div>

          <button
            type="button"
            className="continue-learning-card__cta-btn"
            onClick={() => navigate(data.lessonSlug)}
          >
            {t("dashboard.continueLessonBtn")}
          </button>
        </div>

        <div className="continue-learning-card__illustration" aria-hidden="true">
          <HairlineMemoryStack caption={t("dashboard.sameConceptDifferentRules")} />
        </div>
      </div>
    </div>
  );
};

