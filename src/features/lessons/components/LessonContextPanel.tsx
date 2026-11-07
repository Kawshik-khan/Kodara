import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronRight, Layers, BookOpen } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Lesson } from "../types/lesson.types";
import "./LessonContextPanel.css";

export interface LessonContextPanelProps {
  lesson: Lesson;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const LessonContextPanel: React.FC<LessonContextPanelProps> = ({
  lesson,
  isBookmarked,
  onToggleBookmark,
}) => {
  const { locale } = useTranslation();

  return (
    <aside
      className="kodara-lesson-context"
      aria-label="Lesson context and references"
      data-testid="lesson-context-panel"
    >
      {/* Bookmark Action */}
      <div className="kodara-lesson-context__card">
        <button
          type="button"
          className={`kodara-lesson-context__bookmark-btn ${
            isBookmarked ? "kodara-lesson-context__bookmark-btn--active" : ""
          }`}
          onClick={onToggleBookmark}
        >
          <Bookmark
            size={15}
            fill={isBookmarked ? "#FF5E1E" : "none"}
            style={{ color: isBookmarked ? "#FF5E1E" : "inherit" }}
          />
          <span>
            {isBookmarked
              ? locale === "bn"
                ? "বুকমার্ক করা হয়েছে"
                : "Bookmarked"
              : locale === "bn"
              ? "লেসন বুকমার্ক করুন"
              : "Bookmark Lesson"}
          </span>
        </button>
      </div>

      {/* Concepts Taught */}
      <div className="kodara-lesson-context__card">
        <div className="kodara-lesson-context__header">
          <Layers size={13} style={{ color: "#FF5E1E", display: "inline", marginRight: 4 }} />
          <span>{locale === "bn" ? "প্রাসঙ্গিক ধারণা" : "Concepts Taught"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.concepts.map((concept) => (
            <div key={concept.id} className="kodara-lesson-context__concept-item">
              <span className="kodara-lesson-context__concept-title">
                {locale === "bn" ? concept.nameBn : concept.nameEn}
              </span>
              <span className="kodara-lesson-context__concept-desc">
                {locale === "bn" ? concept.descriptionBn : concept.descriptionEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Lessons */}
      {lesson.relatedLessons.length > 0 && (
        <div className="kodara-lesson-context__card">
          <div className="kodara-lesson-context__header">
            <BookOpen size={13} style={{ color: "#FF5E1E", display: "inline", marginRight: 4 }} />
            <span>{locale === "bn" ? "সম্পর্কিত লেসন" : "Related Lessons"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lesson.relatedLessons.map((rel) => (
              <Link
                key={rel.id}
                to={rel.slug}
                className="kodara-lesson-context__related-link"
              >
                <span>{locale === "bn" ? rel.titleBn : rel.titleEn}</span>
                <ChevronRight size={13} style={{ color: "#FF5E1E", flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
