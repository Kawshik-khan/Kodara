/**
 * Kodara Challenge Subsystem - Challenge Service
 * Orchestrates challenge runner state, code submission evaluation, hint escalation, and completion events.
 */

import { Challenge, ChallengeState, ChallengeAttempt, ChallengeEvaluation } from "../types/challenge.types";
import { typeScriptChallengeEvaluator } from "../evaluators/TypeScriptChallengeEvaluator";
import { assessmentEventService } from "./AssessmentEventService";
import { newEventIdentity, uuidv7 } from "@/lib/ids";

export class ChallengeService {
  /**
   * Initializes a Challenge state.
   */
  public createChallengeState(challenge: Challenge, initialCode?: string): ChallengeState {
    assessmentEventService.emit({
      ...newEventIdentity(),
      type: "challenge.started",
      challengeId: challenge.id,
      lessonId: challenge.lessonId,
      conceptIds: challenge.conceptIds,
    });

    return {
      challengeId: challenge.id,
      code: initialCode !== undefined ? initialCode : challenge.starterCode,
      attempts: [],
      activeHintIndex: -1,
      isSubmitting: false,
      isSolutionRevealed: false,
      status: "not_started",
    };
  }

  /**
   * Evaluates submitted code for a challenge.
   */
  public async evaluateSubmission(
    challenge: Challenge,
    currentState: ChallengeState,
    submittedCode: string,
    timeSpentSeconds: number,
    hintsUsedCount = 0,
    hintsViewedIds: string[] = []
  ): Promise<{ state: ChallengeState; evaluation: ChallengeEvaluation; attempt: ChallengeAttempt }> {
    const evaluation = await typeScriptChallengeEvaluator.evaluate(challenge, submittedCode);

    const attempt: ChallengeAttempt = {
      id: uuidv7(),
      challengeId: challenge.id,
      submittedCode,
      evaluation,
      hintsUsedCount,
      hintsViewedIds,
      timeSpentSeconds,
      attemptNumber: currentState.attempts.length + 1,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      isCompleted: evaluation.status === "passed",
    };

    const isPassed = evaluation.status === "passed";
    const updatedState: ChallengeState = {
      ...currentState,
      code: submittedCode,
      lastEvaluation: evaluation,
      attempts: [...currentState.attempts, attempt],
      status: isPassed ? "passed" : "failed",
    };

    // Emit test passed events
    evaluation.testResults.forEach((tr) => {
      if (tr.status === "passed") {
        assessmentEventService.emit({
          ...newEventIdentity(),
          type: "challenge.testPassed",
          challengeId: challenge.id,
          testCaseId: tr.testCaseId,
          isCompileTimeOnly: false,
        });
      }
    });

    // Emit challenge completed event if passed
    if (isPassed) {
      assessmentEventService.emit({
        ...newEventIdentity(),
        type: "challenge.completed",
        challengeId: challenge.id,
        lessonId: challenge.lessonId,
        conceptIds: challenge.conceptIds,
        status: evaluation.status,
        testsPassed: evaluation.testsPassed,
        testsTotal: evaluation.testsTotal,
        scorePercent: evaluation.scorePercent,
        hintsUsedCount,
        timeSpentSeconds,
        attemptCount: updatedState.attempts.length,
      });

      // Emit concept demonstrated events
      challenge.conceptIds.forEach((cid) => {
        assessmentEventService.emit({
          ...newEventIdentity(),
          type: "concept.demonstrated",
          conceptId: cid,
          source: "challenge",
          sourceId: challenge.id,
          confidenceScore: 0.9,
        });
      });
    }

    return {
      state: updatedState,
      evaluation,
      attempt,
    };
  }
}

export const challengeService = new ChallengeService();
