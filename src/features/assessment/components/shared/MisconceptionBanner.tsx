import React from "react";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { AssessmentMisconception } from "../../types/assessment.types";
import { useTranslation } from "@/i18n";
import "./MisconceptionBanner.css";

export interface MisconceptionBannerProps {
  misconception: AssessmentMisconception;
}

export const MisconceptionBanner: React.FC<MisconceptionBannerProps> = ({ misconception }) => {
  const { locale } = useTranslation();

  const label = locale === "bn" ? misconception.labelBn : misconception.labelEn;
  const wrongModel = locale === "bn" ? misconception.wrongMentalModelBn : misconception.wrongMentalModelEn;
  const correction = locale === "bn" ? misconception.correctionBn : misconception.correctionEn;

  return (
    <div className="kodara-misconception-banner" data-testid="misconception-banner">
      <div className="kodara-misconception-banner__header">
        <AlertTriangle size={18} className="kodara-misconception-banner__icon" />
        <span className="kodara-misconception-banner__title">
          {locale === "bn" ? "ভুল ধারণাসংক্রান্ত সতর্কাংশ:" : "Common Misconception Detected:"} {label}
        </span>
      </div>

      <div className="kodara-misconception-banner__content">
        <div className="kodara-misconception-banner__wrong">
          <strong>{locale === "bn" ? "ভুল মানসিক মডেল:" : "Wrong Mental Model:"}</strong> {wrongModel}
        </div>
        <div className="kodara-misconception-banner__correct">
          <Lightbulb size={16} className="kodara-misconception-banner__correct-icon" />
          <span>
            <strong>{locale === "bn" ? "সঠিক কনসেপ্ট:" : "Correct Mental Model:"}</strong> {correction}
          </span>
        </div>
      </div>
    </div>
  );
};
