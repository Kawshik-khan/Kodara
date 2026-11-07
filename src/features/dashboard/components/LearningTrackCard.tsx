import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Box, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import { TsBadgeIcon, PythonIcon, ReactIcon } from "@/components/navigation/NavIcons";
import { TrackSummary } from "../types/dashboard.types";
import "./LearningTracks.css";

export interface LearningTrackCardProps {
  track: TrackSummary;
}

export const LearningTrackCard: React.FC<LearningTrackCardProps> = ({ track }) => {
  const { locale } = useTranslation();
  const navigate = useNavigate();

  const title = locale === "bn" ? track.titleBn : track.titleEn;

  const getTrackIcon = (id: string) => {
    switch (id) {
      case "typescript":
        return <TsBadgeIcon size={22} />;
      case "python":
        return <PythonIcon size={20} />;
      case "react":
        return <ReactIcon size={20} />;
      case "system-design":
        return <Box size={18} color="#FF5E1E" />;
      case "ai-engineering":
        return <Sparkles size={18} color="#FF5E1E" />;
      default:
        return <Box size={18} color="#FF5E1E" />;
    }
  };

  return (
    <div
      className="learning-track-card"
      onClick={() => navigate(`/learn/${track.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/learn/${track.id}`);
        }
      }}
    >
      <div className="learning-track-card__icon-wrap">
        {getTrackIcon(track.id)}
      </div>

      <div className="learning-track-card__info">
        <span className="learning-track-card__title">{title}</span>
        <span className="learning-track-card__percent font-mono">
          {track.progressPercent}%
        </span>
      </div>

      <ChevronRight size={15} className="learning-track-card__chevron" />
    </div>
  );
};

