import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, FileText, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import { ProjectSummary } from "../types/dashboard.types";
import { ROUTES } from "@/config/routes";
import { HairlineMeter } from "@/components/visual/hairline";
import "./ProjectsCard.css";

export interface ProjectsCardProps {
  projects: ProjectSummary[];
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const getProjectIcon = (icon?: ProjectSummary["icon"]) => {
    if (icon === "doc") {
      return <FileText size={16} color="#FF5E1E" />;
    }
    return <Box size={16} color="#FF5E1E" />;
  };

  return (
    <div className="projects-card" data-testid="projects-card">
      <div className="projects-card__header">
        <h3 className="projects-card__title">{t("dashboard.projectsTitle")}</h3>
        <Link to={ROUTES.PROJECTS} className="projects-card__link">
          {t("dashboard.viewAll")}
        </Link>
      </div>

      <div className="projects-card__list">
        {projects.map((proj) => {
          const title = locale === "bn" ? proj.titleBn : proj.titleEn;

          return (
            <div
              key={proj.id}
              className="projects-card__item"
              onClick={() => navigate(ROUTES.PROJECTS)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(ROUTES.PROJECTS);
                }
              }}
            >
              <div className="projects-card__item-icon">
                {getProjectIcon(proj.icon)}
              </div>

              <div className="projects-card__item-content">
                <div className="projects-card__item-top">
                  <span className="projects-card__item-title">{title}</span>
                  <span className="projects-card__item-tag">{proj.tag}</span>
                </div>

                <div className="projects-card__progress-row">
                  <HairlineMeter value={proj.progressPercent} size="sm" label={title} />
                  <span className="projects-card__progress-val font-mono">
                    {proj.progressPercent}%
                  </span>
                </div>
              </div>

              <ChevronRight size={15} className="projects-card__chevron" />
            </div>
          );
        })}

        <button
          type="button"
          className="projects-card__new-btn"
          onClick={() => navigate(ROUTES.PROJECTS)}
        >
          {t("dashboard.startNewProject")}
        </button>
      </div>
    </div>
  );
};

