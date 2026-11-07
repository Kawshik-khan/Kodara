import React, { useState } from "react";
import { PracticeQuestion, PracticeSessionState } from "../../types/practice.types";
import { AssessmentFeedback, AssessmentResultSummary } from "../../types/assessment.types";
import { practiceService } from "../../services/PracticeService";
import { PracticeQuestionRenderer } from "./PracticeQuestionRenderer";
import { PracticeSummaryScreen } from "./PracticeSummaryScreen";
import { useTranslation } from "@/i18n";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import "./PracticeSessionModal.css";

export interface PracticeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: PracticeQuestion[];
  targetId: string;
  onSessionComplete?: (summary: AssessmentResultSummary) => void;
}

export const PracticeSessionModal: React.FC<PracticeSessionModalProps> = ({
  isOpen,
  onClose,
  questions,
  targetId,
  onSessionComplete,
}) => {
  const { locale } = useTranslation();
  const [session, setSession] = useState<PracticeSessionState>(() =>
    practiceService.createSession("lesson", targetId, questions)
  );

  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<AssessmentFeedback | undefined>(undefined);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [hintsViewedIds, setHintsViewedIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<AssessmentResultSummary | null>(null);

  if (!isOpen) return null;

  const currentQ = session.questions[session.currentIndex];

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;
    const res = practiceService.submitAnswer(
      session,
      selectedAnswer,
      15, // time spent estimate
      hintsUsed,
      hintsViewedIds
    );

    setSession(res.session);
    setIsSubmitted(true);
    setFeedback(res.feedback);

    if (res.session.isFinished) {
      const finalSummary = practiceService.computeSessionSummary(res.session);
      setSummary(finalSummary);
      if (onSessionComplete) onSessionComplete(finalSummary);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setFeedback(undefined);
    setHintsUsed(0);
    setHintsViewedIds([]);
  };

  const handleRetakeSession = () => {
    const newSession = practiceService.createSession("lesson", targetId, questions);
    setSession(newSession);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setFeedback(undefined);
    setSummary(null);
  };

  return (
    <div className="kodara-practice-modal-backdrop" data-testid="practice-session-modal">
      <div className="kodara-practice-modal">
        <div className="kodara-practice-modal__topbar">
          <div className="kodara-practice-modal__progress-info">
            <span>
              {locale === "bn"
                ? `প্রশ্ন ${session.currentIndex + 1} / ${session.questions.length}`
                : `Question ${session.currentIndex + 1} of ${session.questions.length}`}
            </span>
          </div>

          <button type="button" className="kodara-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="kodara-practice-modal__progress-bar">
          <div
            className="kodara-practice-modal__progress-fill"
            style={{
              width: `${((session.currentIndex + (isSubmitted ? 1 : 0)) / session.questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="kodara-practice-modal__content">
          {summary ? (
            <PracticeSummaryScreen
              summary={summary}
              onContinue={onClose}
              onRetake={handleRetakeSession}
            />
          ) : currentQ ? (
            <>
              <PracticeQuestionRenderer
                question={currentQ}
                selectedAnswer={selectedAnswer}
                onAnswerChange={setSelectedAnswer}
                isSubmitted={isSubmitted}
                feedback={feedback}
                onHintRequested={(hint) => {
                  setHintsUsed((prev) => prev + 1);
                  setHintsViewedIds((prev) => [...prev, hint.id]);
                }}
              />

              <div className="kodara-practice-modal__footer">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedAnswer === null}
                    className="kodara-btn-primary"
                    onClick={handleSubmitAnswer}
                  >
                    <CheckCircle size={16} />
                    <span>{locale === "bn" ? "উত্তর যাচায় করুন" : "Check Answer"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="kodara-btn-primary"
                    onClick={handleNextQuestion}
                  >
                    <span>
                      {session.currentIndex >= session.questions.length - 1
                        ? locale === "bn"
                          ? "ফলাফল দেখুন"
                          : "View Results"
                        : locale === "bn"
                        ? "পরবর্তী প্রশ্ন"
                        : "Next Question"}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
