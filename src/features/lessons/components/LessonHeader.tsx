import React from "react";
import { Link } from "react-router-dom";
import { Clock, BarChart2, Layers, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Lesson } from "../types/lesson.types";
import "./LessonHeader.css";

export interface LessonHeaderProps {
  lesson: Lesson;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({ lesson }) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? lesson.titleBn : lesson.titleEn;
  const subtitle = locale === "bn" ? lesson.subtitleBn : lesson.subtitleEn;
  const objectives =
    locale === "bn" ? lesson.learningObjectivesBn : lesson.learningObjectivesEn;

  return (
    <header className="kodara-lesson-header" data-testid="lesson-header">
      <div className="kodara-lesson-header__top">
        <div className="kodara-lesson-header__badge-group">
          <span className="kodara-lesson-header__track-badge">
            {lesson.trackId}
          </span>
        </div>

        <div className="kodara-lesson-header__meta-chips font-mono">
          <span className="kodara-lesson-header__meta-chip">
            <BarChart2 size={13} style={{ color: "#FF5E1E" }} />
            <span>{lesson.difficulty}</span>
          </span>
          <span>•</span>
          <span className="kodara-lesson-header__meta-chip">
            <Clock size={13} style={{ color: "#FF5E1E" }} />
            <span>
              {lesson.estimatedMinutes} {locale === "bn" ? "মিনিট" : "min"}
            </span>
          </span>
          <span>•</span>
          <span className="kodara-lesson-header__meta-chip">
            <Layers size={13} style={{ color: "#FF5E1E" }} />
            <span>
              {lesson.concepts.length} {locale === "bn" ? "ধারণা" : "concepts"}
            </span>
          </span>
        </div>
      </div>

      <div>
        <h1 className="kodara-lesson-header__title">{title}</h1>
        <p className="kodara-lesson-header__subtitle">{subtitle}</p>
      </div>

      {/* Learning Objectives Box */}
      <div className="kodara-lesson-header__objectives">
        <div className="kodara-lesson-header__objectives-title">
          🎯 {locale === "bn" ? "শিক্ষণীয় উদ্দেশ্যসমূহ" : "Learning Objectives"}
        </div>
        <ul className="kodara-lesson-header__objectives-list">
          {objectives.map((obj, idx) => (
            <li key={idx} className="kodara-lesson-header__objective-item">
              <CheckCircle2
                size={15}
                style={{ color: "#16A34A", flexShrink: 0, marginTop: 2 }}
              />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prerequisites Row */}
      {lesson.prerequisites.length > 0 && (
        <div className="kodara-lesson-header__prereqs">
          <span>{locale === "bn" ? "পূর্বশর্ত:" : "Prerequisites:"}</span>
          {lesson.prerequisites.map((prereq) => (
            <Link
              key={prereq.id}
              to={prereq.slug}
              className="kodara-lesson-header__prereq-tag"
            >
              ✓ {locale === "bn" ? prereq.titleBn : prereq.titleEn}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
