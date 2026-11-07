import React from "react";
import { Challenge } from "../../types/challenge.types";
import { X, CheckCircle, Lightbulb, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n";
import "./SolutionModal.css";

export interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  onClose,
  challenge,
}) => {
  const { locale } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="kodara-solution-modal-backdrop" data-testid="solution-modal">
      <div className="kodara-solution-modal">
        <div className="kodara-solution-modal__header">
          <div className="kodara-solution-modal__title-row">
            <CheckCircle size={20} style={{ color: "#16A34A" }} />
            <h3>
              {locale === "bn" ? "অফিসিয়াল সমাধান ও ব্যাখ্যা" : "Official Solution & Explanation"}
            </h3>
          </div>

          <button type="button" className="kodara-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="kodara-solution-modal__content">
          <div className="kodara-solution-section">
            <h4>{locale === "bn" ? "রেফারেন্স সমাধান কোড:" : "Reference Solution Code:"}</h4>
            <pre className="kodara-solution-code">
              <code>{challenge.solutionCode}</code>
            </pre>
          </div>

          <div className="kodara-solution-section">
            <h4>{locale === "bn" ? "ধাপে ধাপে কৌশল ও ব্যাখ্যা:" : "Step-by-Step Rationale:"}</h4>
            <p className="kodara-solution-explanation">
              {locale === "bn"
                ? challenge.solutionExplanationBn
                : challenge.solutionExplanationEn}
            </p>
          </div>

          {challenge.alternativeApproachesEn && challenge.alternativeApproachesEn.length > 0 && (
            <div className="kodara-solution-section">
              <h4>
                <Lightbulb size={16} style={{ color: "#FF5E1E" }} />
                <span>
                  {locale === "bn" ? "বিকল্প সমাধান পদ্ধতি:" : "Alternative Architectural Approaches:"}
                </span>
              </h4>
              <ul className="kodara-solution-list">
                {(locale === "bn"
                  ? challenge.alternativeApproachesBn || challenge.alternativeApproachesEn
                  : challenge.alternativeApproachesEn
                ).map((alt, idx) => (
                  <li key={idx}>{alt}</li>
                ))}
              </ul>
            </div>
          )}

          {challenge.commonMistakesEn && challenge.commonMistakesEn.length > 0 && (
            <div className="kodara-solution-section">
              <h4>
                <AlertTriangle size={16} style={{ color: "#DC2626" }} />
                <span>
                  {locale === "bn" ? "সাধারণ ভুলসমূহ (Common Pitfalls):" : "Common Pitfalls to Avoid:"}
                </span>
              </h4>
              <ul className="kodara-solution-list kodara-solution-list--mistakes">
                {(locale === "bn"
                  ? challenge.commonMistakesBn || challenge.commonMistakesEn
                  : challenge.commonMistakesEn
                ).map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="kodara-solution-modal__footer">
          <button type="button" className="kodara-btn-primary" onClick={onClose}>
            {locale === "bn" ? "বুঝেছি, বন্ধ করুন" : "Understood, Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
