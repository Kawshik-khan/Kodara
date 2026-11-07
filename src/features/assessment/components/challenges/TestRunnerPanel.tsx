import React from "react";
import { ChallengeEvaluation } from "../../types/challenge.types";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n";
import "./TestRunnerPanel.css";

export interface TestRunnerPanelProps {
  evaluation?: ChallengeEvaluation;
  isEvaluating: boolean;
}

export const TestRunnerPanel: React.FC<TestRunnerPanelProps> = ({
  evaluation,
  isEvaluating,
}) => {
  const { locale } = useTranslation();

  if (isEvaluating) {
    return (
      <div className="kodara-test-runner-panel kodara-test-runner-panel--loading">
        <div className="kodara-test-runner-spinner" />
        <span>
          {locale === "bn"
            ? "টাইপ-চেকিং ও টেস্ট সুইট এক্সিকিউট হচ্ছে..."
            : "Running Type Check & Test Suite..."}
        </span>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="kodara-test-runner-panel kodara-test-runner-panel--empty">
        <span>
          {locale === "bn"
            ? "'Run Tests' বাটনে ক্লিক করে কোড যাচায় করুন।"
            : "Click 'Run Tests' to evaluate your solution against requirements."}
        </span>
      </div>
    );
  }

  return (
    <div className="kodara-test-runner-panel" data-testid="test-runner-panel">
      <div className="kodara-test-runner-summary">
        <div className="kodara-test-runner-badge-row">
          <span
            className={`kodara-status-pill kodara-status-pill--${evaluation.status}`}
          >
            {evaluation.status.toUpperCase()}
          </span>

          <span className="kodara-test-runner-counts">
            {evaluation.testsPassed} / {evaluation.testsTotal}{" "}
            {locale === "bn" ? "টেস্ট পাস করেছে" : "passed"}
          </span>

          <span className="kodara-test-runner-time">
            <Clock size={13} />
            <span>{evaluation.executionTimeMs}ms</span>
          </span>
        </div>

        <p className="kodara-test-runner-feedback">
          {locale === "bn" ? evaluation.feedbackBn : evaluation.feedbackEn}
        </p>
      </div>

      {evaluation.compileError && (
        <div className="kodara-test-runner-compile-error">
          <div className="kodara-compile-error-header">
            <AlertTriangle size={15} />
            <span>{locale === "bn" ? "কম্পাইলেশন ভুলের বিবরণ:" : "Compilation Diagnostic Error:"}</span>
          </div>
          <pre>
            <code>{evaluation.compileError}</code>
          </pre>
        </div>
      )}

      <div className="kodara-test-cases-list">
        {evaluation.testResults.map((tr) => (
          <div
            key={tr.testCaseId}
            className={`kodara-test-case-item kodara-test-case-item--${tr.status}`}
          >
            <div className="kodara-test-case-icon">
              {tr.status === "passed" ? (
                <CheckCircle2 size={16} className="kodara-icon--passed" />
              ) : (
                <XCircle size={16} className="kodara-icon--failed" />
              )}
            </div>

            <div className="kodara-test-case-details">
              <div className="kodara-test-case-desc">
                {locale === "bn" ? tr.descriptionBn : tr.descriptionEn}
              </div>

              {tr.errorMessage && (
                <div className="kodara-test-case-error">{tr.errorMessage}</div>
              )}

              {!tr.hidden && tr.expectedOutput && (
                <div className="kodara-test-case-outputs">
                  <span className="kodara-output-label">Expected:</span>{" "}
                  <code>{tr.expectedOutput}</code>
                  {tr.actualOutput && (
                    <>
                      {" "}
                      <span className="kodara-output-label">Actual:</span>{" "}
                      <code>{tr.actualOutput}</code>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
