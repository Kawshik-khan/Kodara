import React from "react";
import { CheckCircle2, Award } from "lucide-react";
import { useTranslation } from "@/i18n";
import { SummaryBlock as SummaryBlockType } from "../../types/lesson.types";
import "./SummaryBlock.css";

export interface SummaryBlockProps {
  data: SummaryBlockType;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ data }) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const takeaways = locale === "bn" ? data.takeawaysBn : data.takeawaysEn;
  const checklist = locale === "bn" ? data.checklistBn : data.checklistEn;

  return (
    <div className="kodara-summary" data-testid="summary-block">
      <div className="kodara-summary__title">
        <Award size={18} style={{ color: "#FF5E1E" }} />
        <span>{title}</span>
      </div>

      <div>
        <div className="kodara-summary__section-subtitle">
          {locale === "bn" ? "মূল শিক্ষণীয় পয়েন্ট" : "Key Takeaways"}
        </div>
        <ul className="kodara-summary__list">
          {takeaways.map((item, idx) => (
            <li key={idx} className="kodara-summary__item">
              <span style={{ color: "#FF5E1E", fontWeight: 700 }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="kodara-summary__checklist">
        <div className="kodara-summary__section-subtitle">
          {locale === "bn" ? "দক্ষতা চেকলিস্ট" : "Concept Mastery Checklist"}
        </div>
        {checklist.map((check, idx) => (
          <div key={idx} className="kodara-summary__check-row">
            <CheckCircle2 size={16} style={{ color: "#16A34A", flexShrink: 0 }} />
            <span>{check}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
