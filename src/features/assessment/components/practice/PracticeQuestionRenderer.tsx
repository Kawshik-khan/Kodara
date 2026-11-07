import React from "react";
import { PracticeQuestion } from "../../types/practice.types";
import { AssessmentFeedback } from "../../types/assessment.types";

import { MultipleChoiceRenderer } from "./renderers/MultipleChoiceRenderer";
import { MultiSelectRenderer } from "./renderers/MultiSelectRenderer";
import { TrueFalseRenderer } from "./renderers/TrueFalseRenderer";
import { PredictTypeRenderer } from "./renderers/PredictTypeRenderer";
import { PredictOutputRenderer } from "./renderers/PredictOutputRenderer";
import { CodeCompletionRenderer } from "./renderers/CodeCompletionRenderer";
import { DebuggingRenderer } from "./renderers/DebuggingRenderer";
import { CodeReadingRenderer } from "./renderers/CodeReadingRenderer";
import { OrderStepsRenderer } from "./renderers/OrderStepsRenderer";
import { MatchingRenderer } from "./renderers/MatchingRenderer";
import { ErrorExplanationRenderer } from "./renderers/ErrorExplanationRenderer";
import { VisualizationPredictionRenderer } from "./renderers/VisualizationPredictionRenderer";

import { MisconceptionBanner } from "../shared/MisconceptionBanner";
import { ProgressiveHintWidget } from "../shared/ProgressiveHintWidget";
import { useTranslation } from "@/i18n";
import { CheckCircle2, XCircle } from "lucide-react";
import "./PracticeQuestionRenderer.css";

export interface PracticeQuestionRendererProps {
  question: PracticeQuestion;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  isSubmitted: boolean;
  feedback?: AssessmentFeedback;
  onHintRequested?: (hint: any) => void;
}

export const PracticeQuestionRenderer: React.FC<PracticeQuestionRendererProps> = ({
  question,
  selectedAnswer,
  onAnswerChange,
  isSubmitted,
  feedback,
  onHintRequested,
}) => {
  const { locale } = useTranslation();

  const renderQuestionBody = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "multiple-select":
        return (
          <MultiSelectRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "true-false":
        return (
          <TrueFalseRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "predict-type":
        return (
          <PredictTypeRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "predict-output":
        return (
          <PredictOutputRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "code-completion":
        return (
          <CodeCompletionRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "debugging":
        return (
          <DebuggingRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "code-reading":
        return (
          <CodeReadingRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "order-steps":
        return (
          <OrderStepsRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "matching":
        return (
          <MatchingRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "error-explanation":
        return (
          <ErrorExplanationRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      case "visualization-prediction":
        return (
          <VisualizationPredictionRenderer
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerChange={onAnswerChange}
            isSubmitted={isSubmitted}
          />
        );
      default:
        return <div>Unknown Question Type</div>;
    }
  };

  return (
    <div className="kodara-practice-question-card" data-testid="practice-question-renderer">
      <div className="kodara-practice-question-header">
        <div className="kodara-practice-question-tags">
          <span className="kodara-difficulty-badge">
            {locale === "bn"
              ? `কঠিনতার মাত্রা ${question.difficulty}/৫`
              : `Difficulty ${question.difficulty}/5`}
          </span>
          <span className="kodara-question-type-badge">{question.type}</span>
        </div>

        <h3 className="kodara-practice-question-prompt">
          {locale === "bn" ? question.promptBn : question.promptEn}
        </h3>

        {question.instructionsEn && (
          <p className="kodara-practice-question-instructions">
            {locale === "bn" ? question.instructionsBn : question.instructionsEn}
          </p>
        )}
      </div>

      {renderQuestionBody()}

      {!isSubmitted && question.hints && (
        <ProgressiveHintWidget hints={question.hints} onHintRequested={onHintRequested} />
      )}

      {isSubmitted && feedback && (
        <div
          className={`kodara-feedback-box ${
            feedback.isCorrect ? "kodara-feedback-box--correct" : "kodara-feedback-box--incorrect"
          }`}
        >
          <div className="kodara-feedback-header">
            {feedback.isCorrect ? (
              <>
                <CheckCircle2 size={20} className="kodara-feedback-icon--correct" />
                <span>{locale === "bn" ? "সঠিক উত্তর!" : "Correct!"}</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="kodara-feedback-icon--incorrect" />
                <span>{locale === "bn" ? "পুনরায় বিবেচনা করুন" : "Incorrect reasoning"}</span>
              </>
            )}
          </div>

          <p className="kodara-feedback-summary">
            {locale === "bn" ? feedback.whatHappenedBn : feedback.whatHappenedEn}
          </p>

          {feedback.whySelectedWrongEn && !feedback.isCorrect && (
            <div className="kodara-feedback-why-wrong">
              <strong>{locale === "bn" ? "আপনার উত্তর নির্দেশ করে:" : "Your answer suggests:"}</strong>{" "}
              {locale === "bn" ? feedback.whySelectedWrongBn : feedback.whySelectedWrongEn}
            </div>
          )}

          <div className="kodara-feedback-mental-model">
            <strong>{locale === "bn" ? "মানসিক মডেল:" : "Mental Model:"}</strong>{" "}
            {locale === "bn" ? feedback.whyHappenedBn : feedback.whyHappenedEn}
          </div>

          {feedback.misconception && (
            <MisconceptionBanner misconception={feedback.misconception} />
          )}
        </div>
      )}
    </div>
  );
};
