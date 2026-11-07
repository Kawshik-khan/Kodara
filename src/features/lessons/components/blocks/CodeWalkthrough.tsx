import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useTranslation } from "@/i18n";
import { CodeWalkthroughBlock } from "../../types/lesson.types";
import "./CodeWalkthrough.css";

export interface CodeWalkthroughProps {
  data: CodeWalkthroughBlock;
}

export const CodeWalkthrough: React.FC<CodeWalkthroughProps> = ({ data }) => {
  const { locale } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = data.steps[currentStepIndex];
  const totalSteps = data.steps.length;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const lines = data.initialCode.split("\n");
  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const stepTitle = locale === "bn" ? step.titleBn : step.titleEn;
  const explanation = locale === "bn" ? step.explanationBn : step.explanationEn;

  return (
    <div className="kodara-walkthrough" data-testid="code-walkthrough">
      <div className="kodara-walkthrough__header">
        <div className="kodara-walkthrough__title">
          <Play size={14} style={{ color: "#FF5E1E" }} />
          <span>{title}</span>
        </div>
        <span className="kodara-walkthrough__step-badge">
          {locale === "bn"
            ? `ধাপ ${currentStepIndex + 1} / ${totalSteps}`
            : `Step ${currentStepIndex + 1} / ${totalSteps}`}
        </span>
      </div>

      <div className="kodara-walkthrough__body">
        {/* Left: Code with active line highlighted */}
        <div className="kodara-walkthrough__code-pane">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === step.activeLine;
            return (
              <div
                key={lineNum}
                className={`kodara-walkthrough__code-line ${
                  isActive ? "kodara-walkthrough__code-line--active" : ""
                }`}
              >
                <span style={{ width: 28, color: "#666", marginRight: 12, textAlign: "right" }}>
                  {lineNum}
                </span>
                <span>{line}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Runtime Environment State Box */}
        <div className="kodara-walkthrough__state-pane">
          <div className="kodara-walkthrough__state-title">
            {step.environmentState.title}
          </div>

          <div className="kodara-walkthrough__bindings-box">
            {step.environmentState.bindings.map((b) => (
              <div
                key={b.identifier}
                className={`kodara-walkthrough__binding-row ${
                  b.isReassigned ? "kodara-walkthrough__binding-row--updated" : ""
                }`}
              >
                <span className="kodara-walkthrough__binding-name">{b.identifier}</span>
                <span className="kodara-walkthrough__binding-arrow">→</span>
                <span className="kodara-walkthrough__binding-val">{b.value}</span>
              </div>
            ))}
          </div>

          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
            {stepTitle}
          </div>
          <p className="kodara-walkthrough__explanation">{explanation}</p>
        </div>
      </div>

      <div className="kodara-walkthrough__footer">
        <button
          type="button"
          className="kodara-walkthrough__btn"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft size={14} />
          <span>{locale === "bn" ? "পূর্ববর্তী" : "Previous"}</span>
        </button>

        <button
          type="button"
          className="kodara-walkthrough__btn"
          onClick={handleNext}
          disabled={currentStepIndex === totalSteps - 1}
        >
          <span>{locale === "bn" ? "পরবর্তী" : "Next"}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
