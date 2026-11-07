/**
 * Kodara Assessment Subsystem - Practice Service & Evaluation Engine
 * Handles answer checking, detailed feedback construction, misconception identification,
 * and practice session state updates.
 */

import {
  PracticeQuestion,
  PracticeAttempt,
  PracticeSessionState,
  PracticeSessionMode,
} from "../types/practice.types";
import { AssessmentFeedback, AssessmentResultSummary } from "../types/assessment.types";
import { QuestionSelectionStrategy, SequentialStrategy } from "../strategies/QuestionSelectionStrategy";
import { assessmentEventService } from "./AssessmentEventService";
import { newEventIdentity, uuidv7 } from "@/lib/ids";

export class PracticeService {
  /**
   * Evaluates a learner's answer against a PracticeQuestion.
   * Returns complete AssessmentFeedback.
   */
  public evaluateAnswer(question: PracticeQuestion, learnerAnswer: unknown): AssessmentFeedback {
    let isCorrect = false;
    let selectedOptionExplanationEn = "";
    let selectedOptionExplanationBn = "";

    switch (question.type) {
      case "multiple-choice":
      case "predict-type":
      case "predict-output":
      case "code-reading":
      case "error-explanation":
      case "visualization-prediction": {
        const optionId = String(learnerAnswer);
        const options = (question as any).options || [];
        const selectedOpt = options.find((opt: any) => opt.id === optionId);

        if (selectedOpt) {
          isCorrect = Boolean(selectedOpt.isCorrect);
          selectedOptionExplanationEn = selectedOpt.explanationEn || "";
          selectedOptionExplanationBn = selectedOpt.explanationBn || "";
        }
        break;
      }

      case "multiple-select": {
        const selectedIds = Array.isArray(learnerAnswer) ? (learnerAnswer as string[]) : [];
        const options = question.options || [];
        const correctIds = options.filter((opt) => opt.isCorrect).map((opt) => opt.id);

        const hasAllCorrect = correctIds.every((id) => selectedIds.includes(id));
        const hasNoIncorrect = selectedIds.every((id) => correctIds.includes(id));

        isCorrect = hasAllCorrect && hasNoIncorrect && selectedIds.length === correctIds.length;
        break;
      }

      case "true-false": {
        const userBool = Boolean(learnerAnswer);
        isCorrect = userBool === question.correctAnswer;
        selectedOptionExplanationEn = isCorrect
          ? userBool
            ? question.trueExplanationEn
            : question.falseExplanationEn
          : userBool
          ? question.trueExplanationEn
          : question.falseExplanationEn;
        selectedOptionExplanationBn = isCorrect
          ? userBool
            ? question.trueExplanationBn
            : question.falseExplanationBn
          : userBool
          ? question.trueExplanationBn
          : question.falseExplanationBn;
        break;
      }

      case "code-completion": {
        const userBlanks = (learnerAnswer as Record<string, string>) || {};
        const blanks = question.blanks || [];

        isCorrect = blanks.every((blank) => {
          const userVal = (userBlanks[blank.id] || "").trim().toLowerCase();
          const targetVal = blank.correctValue.trim().toLowerCase();
          const acceptable = (blank.acceptableValues || []).map((v) => v.trim().toLowerCase());
          return userVal === targetVal || acceptable.includes(userVal);
        });
        break;
      }

      case "debugging": {
        const optionId = String(learnerAnswer);
        const selectedOpt = question.options.find((opt) => opt.id === optionId);
        if (selectedOpt) {
          isCorrect = Boolean(selectedOpt.isCorrect);
          selectedOptionExplanationEn = selectedOpt.explanationEn;
          selectedOptionExplanationBn = selectedOpt.explanationBn;
        }
        break;
      }

      case "order-steps": {
        const orderedItemIds = Array.isArray(learnerAnswer) ? (learnerAnswer as string[]) : [];
        const items = question.items || [];

        if (orderedItemIds.length !== items.length) {
          isCorrect = false;
        } else {
          isCorrect = orderedItemIds.every((id, idx) => {
            const item = items.find((i) => i.id === id);
            return item ? item.correctOrder === idx + 1 : false;
          });
        }
        break;
      }

      case "matching": {
        const userPairs = (learnerAnswer as Record<string, string>) || {};
        const pairs = question.pairs || [];

        if (Object.keys(userPairs).length !== pairs.length) {
          isCorrect = false;
        } else {
          isCorrect = pairs.every((p) => userPairs[p.id] === p.id);
        }
        break;
      }
    }

    const whatHappenedEn = isCorrect
      ? "Your answer matches the expected mental model."
      : "Your answer indicates a misunderstanding or incomplete mental model.";
    const whatHappenedBn = isCorrect
      ? "আপনার উত্তরটি সঠিক কনসেপ্টুয়াল মডেল প্রকাশ করছে।"
      : "আপনার উত্তরে একটি ধারণাভিত্তিক ভুল প্রকাশ পেয়েছে।";

    const whyHappenedEn = question.explanationEn;
    const whyHappenedBn = question.explanationBn;

    const feedback: AssessmentFeedback = {
      isCorrect,
      whatHappenedEn,
      whatHappenedBn,
      whyHappenedEn,
      whyHappenedBn,
      whySelectedWrongEn: !isCorrect ? selectedOptionExplanationEn : undefined,
      whySelectedWrongBn: !isCorrect ? selectedOptionExplanationBn : undefined,
      mentalModelEn: question.explanationEn,
      mentalModelBn: question.explanationBn,
      misconception: !isCorrect ? question.misconception : undefined,
    };

    return feedback;
  }

  /**
   * Initializes a Practice Session State with chosen strategy.
   */
  public createSession(
    mode: PracticeSessionMode,
    targetId: string,
    allQuestions: PracticeQuestion[],
    strategy: QuestionSelectionStrategy = new SequentialStrategy(),
    limit = 5
  ): PracticeSessionState {
    const selectedQuestions = strategy.selectQuestions({
      targetId,
      questions: allQuestions,
      limit,
    });

    return {
      sessionId: uuidv7(),
      mode,
      targetId,
      questions: selectedQuestions,
      currentIndex: 0,
      answers: {},
      attempts: [],
      startedAt: new Date().toISOString(),
      isFinished: false,
    };
  }

  /**
   * Submits an answer for the current question in a practice session.
   */
  public submitAnswer(
    session: PracticeSessionState,
    learnerAnswer: unknown,
    timeSpentSeconds: number,
    hintsUsedCount = 0,
    hintsViewedIds: string[] = []
  ): { session: PracticeSessionState; attempt: PracticeAttempt; feedback: AssessmentFeedback } {
    const currentQ = session.questions[session.currentIndex];
    if (!currentQ) {
      throw new Error("No active question in practice session");
    }

    const feedback = this.evaluateAnswer(currentQ, learnerAnswer);

    const attempt: PracticeAttempt = {
      id: uuidv7(),
      sessionId: session.sessionId,
      questionId: currentQ.id,
      answer: learnerAnswer,
      isCorrect: feedback.isCorrect,
      timeSpentSeconds,
      hintsUsedCount,
      hintsViewedIds,
      attemptNumber: (session.attempts.filter((a) => a.questionId === currentQ.id).length || 0) + 1,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      feedbackShown: feedback,
      conceptIds: currentQ.conceptIds,
      difficulty: currentQ.difficulty,
    };

    const updatedAnswers = { ...session.answers, [currentQ.id]: learnerAnswer };
    const updatedAttempts = [...session.attempts, attempt];
    const isLastQuestion = session.currentIndex >= session.questions.length - 1;

    const updatedSession: PracticeSessionState = {
      ...session,
      answers: updatedAnswers,
      attempts: updatedAttempts,
      currentIndex: isLastQuestion ? session.currentIndex : session.currentIndex + 1,
      isFinished: isLastQuestion,
      completedAt: isLastQuestion ? new Date().toISOString() : undefined,
    };

    // Emit telemetry event
    assessmentEventService.emit({
      ...newEventIdentity(),
      type: "practice.question.completed",
      questionId: currentQ.id,
      lessonId: currentQ.lessonId,
      conceptIds: currentQ.conceptIds,
      isCorrect: feedback.isCorrect,
      difficulty: currentQ.difficulty,
      hintsUsedCount,
      timeSpentSeconds,
    });

    if (isLastQuestion) {
      const summary = this.computeSessionSummary(updatedSession);
      assessmentEventService.emit({
        ...newEventIdentity(),
        type: "practice.session.completed",
        sessionId: session.sessionId,
        lessonId: currentQ.lessonId,
        mode: session.mode,
        totalQuestions: summary.totalItems,
        correctQuestions: summary.correctItems,
        scorePercent: summary.scorePercent,
        conceptIds: Array.from(new Set(session.questions.flatMap((q) => q.conceptIds))),
        masteredConceptIds: summary.masteredConceptIds,
        weakConceptIds: summary.weakConceptIds,
        timeSpentSeconds: summary.timeSpentSeconds,
      });
    }

    return {
      session: updatedSession,
      attempt,
      feedback,
    };
  }

  /**
   * Computes summary metrics for a completed practice session.
   */
  public computeSessionSummary(session: PracticeSessionState): AssessmentResultSummary {
    const totalItems = session.questions.length;
    const latestAttemptsByQ = new Map<string, PracticeAttempt>();

    session.attempts.forEach((att) => {
      latestAttemptsByQ.set(att.questionId, att);
    });

    let correctItems = 0;
    let timeSpentSeconds = 0;
    let hintsUsedCount = 0;

    const conceptStats: Record<string, { total: number; correct: number }> = {};

    session.questions.forEach((q) => {
      const att = latestAttemptsByQ.get(q.id);
      if (att) {
        if (att.isCorrect) correctItems++;
        timeSpentSeconds += att.timeSpentSeconds;
        hintsUsedCount += att.hintsUsedCount;

        q.conceptIds.forEach((cid) => {
          if (!conceptStats[cid]) conceptStats[cid] = { total: 0, correct: 0 };
          conceptStats[cid].total += 1;
          if (att.isCorrect) conceptStats[cid].correct += 1;
        });
      }
    });

    const scorePercent = totalItems > 0 ? Math.round((correctItems / totalItems) * 100) : 0;
    const masteredConceptIds: string[] = [];
    const weakConceptIds: string[] = [];

    Object.entries(conceptStats).forEach(([cid, stat]) => {
      if (stat.correct / stat.total >= 0.75) {
        masteredConceptIds.push(cid);
      } else {
        weakConceptIds.push(cid);
      }
    });

    return {
      totalItems,
      correctItems,
      scorePercent,
      timeSpentSeconds,
      hintsUsedCount,
      masteredConceptIds,
      weakConceptIds,
      recommendedReviewConceptIds: weakConceptIds,
    };
  }
}

export const practiceService = new PracticeService();
