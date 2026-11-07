import React, { useState } from "react";
import { Challenge, ChallengeState } from "../../types/challenge.types";
import { challengeService } from "../../services/ChallengeService";
import { localAttemptRepository } from "../../repositories/LocalAttemptRepository";
import { TestRunnerPanel } from "./TestRunnerPanel";
import { SolutionModal } from "./SolutionModal";
import { ProgressiveHintWidget } from "../shared/ProgressiveHintWidget";
import { useTranslation } from "@/i18n";
import {
  ChevronLeft,
  Play,
  CheckSquare,
  Eye,
  RotateCcw,
  Award,
} from "lucide-react";
import "./ChallengeRunner.css";

export interface ChallengeRunnerProps {
  challenge: Challenge;
  onBack: () => void;
  onComplete?: () => void;
}

export const ChallengeRunner: React.FC<ChallengeRunnerProps> = ({
  challenge,
  onBack,
  onComplete,
}) => {
  const { locale } = useTranslation();
  const [state, setState] = useState<ChallengeState>(() => {
    const savedDraft = localAttemptRepository.getChallengeDraft(challenge.id);
    return challengeService.createChallengeState(challenge, savedDraft);
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [hintsViewedIds, setHintsViewedIds] = useState<string[]>([]);

  const handleCodeChange = (newCode: string) => {
    setState((prev) => ({ ...prev, code: newCode }));
    localAttemptRepository.saveChallengeDraft(challenge.id, newCode);
  };

  const handleResetCode = () => {
    setState((prev) => ({ ...prev, code: challenge.starterCode }));
    localAttemptRepository.saveChallengeDraft(challenge.id, challenge.starterCode);
  };

  const handleRunTests = async () => {
    setIsEvaluating(true);
    try {
      const res = await challengeService.evaluateSubmission(
        challenge,
        state,
        state.code,
        60, // time spent estimate
        hintsUsedCount,
        hintsViewedIds
      );
      setState(res.state);
      localAttemptRepository.saveChallengeAttempt(res.attempt);

      if (res.evaluation.status === "passed" && onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const isPassed = state.lastEvaluation?.status === "passed";

  return (
    <div className="kodara-challenge-runner" data-testid="challenge-runner">
      {/* Header */}
      <div className="kodara-challenge-runner__header">
        <button type="button" className="kodara-challenge-back-btn" onClick={onBack}>
          <ChevronLeft size={18} />
          <span>{locale === "bn" ? "লেসনে ফিরে যান" : "Back to Lesson"}</span>
        </button>

        <div className="kodara-challenge-runner__title-group">
          <h2>{locale === "bn" ? challenge.titleBn : challenge.titleEn}</h2>
          <div className="kodara-challenge-runner__tags">
            <span className="kodara-diff-badge">{challenge.difficulty}</span>
            {challenge.conceptIds.map((cid) => (
              <span key={cid} className="kodara-concept-tag">
                {cid}
              </span>
            ))}
          </div>
        </div>

        <div className="kodara-challenge-runner__top-actions">
          {challenge.solutionCode && (
            <button
              type="button"
              className="kodara-solution-btn"
              onClick={() => setIsSolutionOpen(true)}
            >
              <Eye size={15} />
              <span>{locale === "bn" ? "সমাধান দেখুন" : "Show Solution"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="kodara-challenge-runner__body">
        {/* Left Specs Panel */}
        <div className="kodara-challenge-runner__specs-panel">
          <div className="kodara-specs-section">
            <h3>{locale === "bn" ? "সমস্যা ও পটভূমি" : "Problem & Context"}</h3>
            <p>{locale === "bn" ? challenge.descriptionBn : challenge.descriptionEn}</p>
          </div>

          <div className="kodara-specs-section">
            <h3>{locale === "bn" ? "প্রয়োজনীয় শর্তাবলী (Requirements)" : "Requirements & Constraints"}</h3>
            <ul className="kodara-requirements-checklist">
              {(locale === "bn" ? challenge.requirementsBn : challenge.requirementsEn).map(
                (req, idx) => (
                  <li key={idx}>
                    <CheckSquare size={16} className="kodara-req-icon" />
                    <span>{req}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {challenge.hints && challenge.hints.length > 0 && (
            <ProgressiveHintWidget
              hints={challenge.hints}
              onHintRequested={(hint) => {
                setHintsUsedCount((prev) => prev + 1);
                setHintsViewedIds((prev) => [...prev, hint.id]);
              }}
            />
          )}
        </div>

        {/* Right Code & Test Panel */}
        <div className="kodara-challenge-runner__editor-panel">
          <div className="kodara-editor-toolbar">
            <span className="kodara-editor-lang-badge">
              {challenge.language.toUpperCase()}
            </span>

            <button
              type="button"
              className="kodara-editor-reset-btn"
              onClick={handleResetCode}
              title={locale === "bn" ? "কোড রিসেট করুন" : "Reset Code"}
            >
              <RotateCcw size={14} />
              <span>{locale === "bn" ? "রিসেট" : "Reset"}</span>
            </button>
          </div>

          {/* Simple Clean Code Editor Area */}
          <textarea
            className="kodara-code-editor-textarea"
            value={state.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="// Write your TypeScript solution here..."
            spellCheck={false}
          />

          {/* Action Bar & Test Output */}
          <div className="kodara-runner-action-bar">
            <button
              type="button"
              disabled={isEvaluating}
              className="kodara-btn-run-tests"
              onClick={handleRunTests}
            >
              <Play size={16} />
              <span>
                {isEvaluating
                  ? locale === "bn"
                    ? "যাচায় হচ্ছে..."
                    : "Running..."
                  : locale === "bn"
                  ? "টেস্ট সুইট রান করুন"
                  : "Run Tests"}
              </span>
            </button>

            {isPassed && (
              <div className="kodara-challenge-passed-banner">
                <Award size={18} />
                <span>
                  {locale === "bn"
                    ? "চ্যালেঞ্জ অর্জিত হয়েছে!"
                    : "Challenge Successfully Mastered!"}
                </span>
              </div>
            )}
          </div>

          <TestRunnerPanel evaluation={state.lastEvaluation} isEvaluating={isEvaluating} />
        </div>
      </div>

      <SolutionModal
        isOpen={isSolutionOpen}
        onClose={() => setIsSolutionOpen(false)}
        challenge={challenge}
      />
    </div>
  );
};
