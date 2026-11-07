import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import { ROUTES } from "@/config/routes";
import "./LessonBreadcrumbs.css";

export interface LessonBreadcrumbsProps {
  trackTitle: string;
  trackId: string;
  moduleTitle: string;
  lessonTitle: string;
}

export const LessonBreadcrumbs: React.FC<LessonBreadcrumbsProps> = ({
  trackTitle,
  trackId,
  moduleTitle,
  lessonTitle,
}) => {
  const { locale } = useTranslation();

  return (
    <nav className="kodara-breadcrumbs" aria-label="Breadcrumbs">
      <Link to={ROUTES.LEARN} className="kodara-breadcrumbs__link">
        {locale === "bn" ? "শিক্ষা" : "Learn"}
      </Link>
      <ChevronRight size={11} className="kodara-breadcrumbs__separator" />

      <Link to={`/learn/${trackId}`} className="kodara-breadcrumbs__link">
        {trackTitle}
      </Link>
      <ChevronRight size={11} className="kodara-breadcrumbs__separator" />

      <span className="kodara-breadcrumbs__link" style={{ cursor: "default" }}>
        {moduleTitle}
      </span>
      <ChevronRight size={11} className="kodara-breadcrumbs__separator" />

      <span className="kodara-breadcrumbs__current" aria-current="page">
        {lessonTitle}
      </span>
    </nav>
  );
};
