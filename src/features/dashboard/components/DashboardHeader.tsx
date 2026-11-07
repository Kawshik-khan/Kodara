import React from "react";
import { useTranslation } from "@/i18n";
import { HairlineGlyph } from "@/components/visual/hairline";
import { WeeklyMetrics } from "../types/dashboard.types";
import "./DashboardHeader.css";

export interface DashboardHeaderProps {
  userName?: string;
  weekly?: WeeklyMetrics;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "John",
}) => {
  const { t, locale } = useTranslation();

  return (
    <div className="dashboard-header" data-testid="dashboard-header">
      <div className="dashboard-header__left">
        <h1 className="dashboard-header__title">
          {locale === "bn" ? `শুভ সকাল, ${userName}।` : `Good morning, ${userName}.`}
        </h1>
        <p className="dashboard-header__subtitle">{t("dashboard.subtitle")}</p>
      </div>

      <div className="dashboard-header__quote-card" data-testid="dashboard-quote-card">
        <div className="dashboard-header__quote-grid" aria-hidden="true">
          <HairlineGlyph variant="register" />
        </div>
        <div className="dashboard-header__quote-content">
          <div className="dashboard-header__quote-mark">“</div>
          <div className="dashboard-header__quote-body">
            <p className="dashboard-header__quote-text">{t("dashboard.quoteText")}</p>
            <span className="dashboard-header__quote-author">{t("dashboard.quoteAuthor")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

