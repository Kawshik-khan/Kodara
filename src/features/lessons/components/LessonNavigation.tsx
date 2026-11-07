import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { LessonSection } from "../types/lesson.types";
import "./LessonNavigation.css";

export interface LessonNavigationProps {
  sections: LessonSection[];
  activeSectionId: string;
  isSectionCompleted: (sectionId: string) => boolean;
  onSelectSection: (sectionId: string) => void;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  sections,
  activeSectionId,
  isSectionCompleted,
  onSelectSection,
}) => {
  const { locale } = useTranslation();

  return (
    <nav
      className="kodara-lesson-nav"
      aria-label="Lesson sections navigation"
      data-testid="lesson-navigation"
    >
      <div className="kodara-lesson-nav__header">
        {locale === "bn" ? "সূচিপত্র" : "Contents"}
      </div>

      <div className="kodara-lesson-nav__list">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const isDone = isSectionCompleted(section.id);
          const title = locale === "bn" ? section.titleBn : section.titleEn;

          return (
            <button
              key={section.id}
              type="button"
              className={`kodara-lesson-nav__item ${
                isActive ? "kodara-lesson-nav__item--active" : ""
              }`}
              onClick={() => onSelectSection(section.id)}
              aria-current={isActive ? "true" : undefined}
            >
              <div className="kodara-lesson-nav__item-icon">
                {isDone ? (
                  <CheckCircle2 size={15} style={{ color: "#16A34A" }} />
                ) : (
                  <Circle
                    size={13}
                    style={{
                      color: isActive ? "#FF5E1E" : "#999",
                      strokeWidth: isActive ? 2.5 : 2,
                    }}
                  />
                )}
              </div>

              <span className="kodara-lesson-nav__item-title" title={title}>
                {title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
