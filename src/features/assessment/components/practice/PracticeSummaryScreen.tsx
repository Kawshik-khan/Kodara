import React from "react";
import { AssessmentResultSummary } from "../../types/assessment.types";
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight, Award } from "lucide-react";
import { useTranslation } from "@/i18n";

export interface PracticeSummaryScreenProps {
  summary: AssessmentResultSummary;
  onContinue: () => void;
  onRetake: () => void;
}

export const PracticeSummaryScreen: React.FC<PracticeSummaryScreenProps> = ({
  summary,
  onContinue,
  onRetake,
}) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-practice-summary-card" data-testid="practice-summary-screen">
      <div className="kodara-summary-header">
        <Award size={36} style={{ color: "#FF5E1E" }} />
        <h2>{locale === "bn" ? "প্র্যাকটিস সম্পন্ন হয়েছে!" : "Practice Session Completed!"}</h2>
        <div className="kodara-summary-score">
          {summary.scorePercent}% {locale === "bn" ? "সঠিকতা" : "Accuracy"} ({summary.correctItems} /{" "}
          {summary.totalItems})
        </div>
      </div>

      <div className="kodara-summary-concepts">
        {summary.masteredConceptIds.length > 0 && (
          <div className="kodara-summary-concept-group">
            <h4 className="kodara-concept-heading kodara-concept-heading--mastered">
              <CheckCircle2 size={16} />
              <span>{locale === "bn" ? "দখল এসেছে (Mastered):" : "Strong Understanding:"}</span>
            </h4>
            <ul className="kodara-concept-list">
              {summary.masteredConceptIds.map((cid) => (
                <li key={cid}>{cid}</li>
              ))}
            </ul>
          </div>
        )}

        {summary.weakConceptIds.length > 0 && (
          <div className="kodara-summary-concept-group">
            <h4 className="kodara-concept-heading kodara-concept-heading--weak">
              <AlertCircle size={16} />
              <span>{locale === "bn" ? "পুনর্বিবেচনা প্রয়োজন:" : "Needs Review:"}</span>
            </h4>
            <ul className="kodara-concept-list">
              {summary.weakConceptIds.map((cid) => (
                <li key={cid}>{cid}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="kodara-summary-actions">
        <button type="button" className="kodara-btn-secondary" onClick={onRetake}>
          <RotateCcw size={16} />
          <span>{locale === "bn" ? "পুনরায় প্র্যাকটিস করুন" : "Retake Practice"}</span>
        </button>

        <button type="button" className="kodara-btn-primary" onClick={onContinue}>
          <span>{locale === "bn" ? "শেখা চালিয়ে যান" : "Continue Learning"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
