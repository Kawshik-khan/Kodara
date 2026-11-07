import React from "react";
import { Info, HelpCircle } from "lucide-react";
import { VisualizationStep } from "../types/visualization.types";
import { useTranslation } from "@/i18n";
import "./VisualizationExplanation.css";

export interface VisualizationExplanationProps {
  step: VisualizationStep;
}

export const VisualizationExplanation: React.FC<VisualizationExplanationProps> = ({
  step,
}) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? step.titleBn : step.titleEn;
  const explanation = locale === "bn" ? step.explanationBn : step.explanationEn;
  const why = locale === "bn" ? step.whyBn : step.whyEn;

  return (
    <div
      className="kodara-vis-explanation"
      data-testid="visualization-explanation"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="kodara-vis-explanation__header">
        <div className="kodara-vis-explanation__title">
          <Info size={16} style={{ color: "var(--accent-primary, #FF5E1E)" }} />
          <span>{title}</span>
        </div>
      </div>

      <div className="kodara-vis-explanation__body">
        <div className="kodara-vis-explanation__row">
          <span className="kodara-vis-explanation__tag">
            {locale === "bn" ? "কী ঘটছে?" : "What's happening?"}
          </span>
          <p className="kodara-vis-explanation__text">{explanation}</p>
        </div>

        {why && (
          <div className="kodara-vis-explanation__row kodara-vis-explanation__row--why">
            <span className="kodara-vis-explanation__tag kodara-vis-explanation__tag--why">
              <HelpCircle size={12} />
              <span>{locale === "bn" ? "কেন ঘটছে?" : "Why?"}</span>
            </span>
            <p className="kodara-vis-explanation__text">{why}</p>
          </div>
        )}
      </div>
    </div>
  );
};
