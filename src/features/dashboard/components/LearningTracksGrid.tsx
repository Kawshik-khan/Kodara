import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { TrackSummary } from "../types/dashboard.types";
import { LearningTrackCard } from "./LearningTrackCard";
import { ROUTES } from "@/config/routes";
import { HairlineGlyph } from "@/components/visual/hairline";
import "./LearningTracks.css";

export interface LearningTracksGridProps {
  tracks: TrackSummary[];
}

export const LearningTracksGrid: React.FC<LearningTracksGridProps> = ({ tracks }) => {
  const { t } = useTranslation();

  return (
    <div className="learning-tracks-card" data-testid="learning-tracks-card">
      <div className="learning-tracks-card__header">
        <h2 className="learning-tracks-card__title">
          {t("dashboard.tracksTitle")}
        </h2>
        <Link to={ROUTES.LEARN} className="learning-tracks-card__view-all">
          {t("dashboard.viewAll")}
        </Link>
      </div>

      <div className="learning-tracks-grid">
        {tracks.slice(0, 5).map((track) => (
          <LearningTrackCard key={track.id} track={track} />
        ))}

        {/* 6th Card: Teaser Card with mini coordinate grid */}
        <div className="learning-track-teaser">
          <div className="learning-track-teaser__grid" aria-hidden="true">
            <HairlineGlyph variant="orbit" width={40} height={34} />
          </div>
          <p className="learning-track-teaser__text">
            {t("dashboard.teaserCardText")}
          </p>
        </div>
      </div>
    </div>
  );
};

