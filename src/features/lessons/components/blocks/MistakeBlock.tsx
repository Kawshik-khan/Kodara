import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { MistakeBlock as MistakeBlockType } from "../../types/lesson.types";
import "./MistakeBlock.css";

export interface MistakeBlockProps {
  data: MistakeBlockType;
}

export const MistakeBlock: React.FC<MistakeBlockProps> = ({ data }) => {
  const { locale } = useTranslation();

  const wrongModel =
    locale === "bn" ? data.wrongMentalModelBn : data.wrongMentalModelEn;
  const correctModel =
    locale === "bn" ? data.correctMentalModelBn : data.correctMentalModelEn;
  const explanation =
    locale === "bn" ? data.explanationBn : data.explanationEn;

  return (
    <div className="kodara-mistake" data-testid="mistake-block">
      <div className="kodara-mistake__header">
        <AlertTriangle size={16} style={{ color: "#DC2626" }} />
        <span className="kodara-mistake__badge">
          {locale === "bn" ? "সাধারণ ভুল" : "Common Mistake"}
        </span>
        <span className="kodara-mistake__title">
          {locale === "bn" ? "ভুল ধারণা বনাম সঠিক উপলব্ধি" : "Mental Model Correction"}
        </span>
      </div>

      <div className="kodara-mistake__grid">
        <div className="kodara-mistake__card kodara-mistake__card--wrong">
          <span className="kodara-mistake__label">
            ❌ {locale === "bn" ? "ভুল ধারণা" : "Wrong Mental Model"}
          </span>
          <p>{wrongModel}</p>
        </div>

        <div className="kodara-mistake__card kodara-mistake__card--correct">
          <span className="kodara-mistake__label">
            ✓ {locale === "bn" ? "সঠিক উপলব্ধি" : "Better Understanding"}
          </span>
          <p>{correctModel}</p>
        </div>
      </div>

      <p className="kodara-mistake__explanation">{explanation}</p>
    </div>
  );
};
