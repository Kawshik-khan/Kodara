import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { HairlineRing } from "@/components/visual/hairline";
import { SkillMapPreviewData } from "../types/dashboard.types";
import { ROUTES } from "@/config/routes";
import { HairlineSkillGraph } from "./visuals";
import "./SkillMapPreview.css";

export interface SkillMapPreviewProps {
  data: SkillMapPreviewData;
}

export const SkillMapPreview: React.FC<SkillMapPreviewProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="skill-map-card" data-testid="skill-map-card">
      <div className="skill-map-card__header">
        <h3 className="skill-map-card__title">{t("dashboard.skillMapTitle")}</h3>
        <Link to={ROUTES.SKILL_MAP} className="skill-map-card__link">
          {t("dashboard.openSkillMap")}
        </Link>
      </div>

      <div className="skill-map-card__body">
        {/* Left: Hairline concept graph */}
        <div className="skill-map-card__tree">
          <HairlineSkillGraph data={data} />
        </div>

        {/* Right: Mastery ring + Message */}
        <div className="skill-map-card__side">
          <HairlineRing filled={data.masteredCount} total={data.totalCount} />
          <p className="skill-map-card__message">
            {t("dashboard.knowledgeGrows")}
          </p>
        </div>
      </div>
    </div>
  );
};
