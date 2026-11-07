import React, { useState } from "react";
import { HelpCircle, Lightbulb } from "lucide-react";
import { AssessmentHint } from "../../types/assessment.types";
import { useTranslation } from "@/i18n";
import "./ProgressiveHintWidget.css";

export interface ProgressiveHintWidgetProps {
  hints: AssessmentHint[];
  onHintRequested?: (hint: AssessmentHint) => void;
}

export const ProgressiveHintWidget: React.FC<ProgressiveHintWidgetProps> = ({
  hints,
  onHintRequested,
}) => {
  const { locale } = useTranslation();
  const [unlockedLevel, setUnlockedLevel] = useState<number>(0);

  if (!hints || hints.length === 0) return null;

  const handleUnlockNext = () => {
    const nextLevel = unlockedLevel + 1;
    if (nextLevel <= hints.length) {
      setUnlockedLevel(nextLevel);
      const hintObj = hints[nextLevel - 1];
      if (hintObj && onHintRequested) {
        onHintRequested(hintObj);
      }
    }
  };

  return (
    <div className="kodara-progressive-hint-widget" data-testid="progressive-hint-widget">
      <div className="kodara-progressive-hint-widget__header">
        <div className="kodara-progressive-hint-widget__title">
          <HelpCircle size={16} className="kodara-progressive-hint-widget__icon" />
          <span>{locale === "bn" ? "সহায়ক নির্দেশনা (হিন্ট)" : "Progressive Hints"}</span>
        </div>

        {unlockedLevel < hints.length && (
          <button
            type="button"
            className="kodara-progressive-hint-widget__unlock-btn"
            onClick={handleUnlockNext}
          >
            <Lightbulb size={14} />
            <span>
              {unlockedLevel === 0
                ? locale === "bn"
                  ? "হিন্ট ১ দেখুন (ইঙ্গিত)"
                  : "Get Hint 1 (Nudge)"
                : unlockedLevel === 1
                ? locale === "bn"
                  ? "হিন্ট ২ দেখুন (নির্দেশনা)"
                  : "Get Hint 2 (Direction)"
                : locale === "bn"
                ? "হিন্ট ৩ দেখুন (সমাধান সমতুল্য)"
                : "Get Hint 3 (Near Solution)"}
            </span>
          </button>
        )}
      </div>

      {unlockedLevel > 0 && (
        <div className="kodara-progressive-hint-widget__list">
          {hints.slice(0, unlockedLevel).map((hint, idx) => (
            <div key={hint.id || idx} className="kodara-progressive-hint-widget__item">
              <div className="kodara-progressive-hint-widget__level-badge">
                {locale === "bn" ? `হিন্ট ${idx + 1}` : `Hint ${idx + 1}`}
              </div>
              <div className="kodara-progressive-hint-widget__text">
                {locale === "bn" ? hint.nudgeBn : hint.nudgeEn}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
