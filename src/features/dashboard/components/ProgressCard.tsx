import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { TrackSummary } from "../types/dashboard.types";
import { ROUTES } from "@/config/routes";
import { HairlineMeter } from "@/components/visual/hairline";
import "./ProgressCard.css";

export interface ProgressCardProps {
  tracks: TrackSummary[];
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ tracks }) => {
  const { t, locale } = useTranslation();

  return (
    <div className="progress-card" data-testid="progress-card">
      <div className="progress-card__header">
        <h3 className="progress-card__title">{t("dashboard.yourProgress")}</h3>
        <Link to={ROUTES.PROGRESS} className="progress-card__link">
          {t("dashboard.viewDetails")}
        </Link>
      </div>

      <div className="progress-card__tracks-list">
        {tracks.map((track) => {
          const trackName = locale === "bn" ? track.titleBn : track.titleEn;
          return (
            <div key={track.id} className="progress-card__track-row">
              <span className="progress-card__track-name">{trackName}</span>
              <HairlineMeter value={track.progressPercent} label={trackName} />
              <span className="progress-card__track-val font-mono">
                {track.progressPercent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

