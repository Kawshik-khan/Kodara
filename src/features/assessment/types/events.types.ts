/**
 * Kodara Assessment Subsystem - Assessment Event Types
 * Standardized telemetry event payloads consumed by Progress & Mastery subsystems.
 */

import { CognitiveDifficulty } from "./assessment.types";
import { ChallengeEvaluationStatus } from "./challenge.types";

export interface BaseAssessmentEvent {
  id: string;
  timestamp: string;
  learnerId?: string;
}

export interface PracticeQuestionCompletedEvent extends BaseAssessmentEvent {
  type: "practice.question.completed";
  questionId: string;
  lessonId?: string;
  conceptIds: string[];
  isCorrect: boolean;
  difficulty: CognitiveDifficulty;
  hintsUsedCount: number;
  timeSpentSeconds: number;
}

export interface PracticeSessionCompletedEvent extends BaseAssessmentEvent {
  type: "practice.session.completed";
  sessionId: string;
  lessonId?: string;
  mode: string;
  totalQuestions: number;
  correctQuestions: number;
  scorePercent: number;
  conceptIds: string[];
  masteredConceptIds: string[];
  weakConceptIds: string[];
  timeSpentSeconds: number;
}

export interface ChallengeStartedEvent extends BaseAssessmentEvent {
  type: "challenge.started";
  challengeId: string;
  lessonId?: string;
  conceptIds: string[];
}

export interface ChallengeTestPassedEvent extends BaseAssessmentEvent {
  type: "challenge.testPassed";
  challengeId: string;
  testCaseId: string;
  isCompileTimeOnly: boolean;
}

export interface ChallengeCompletedEvent extends BaseAssessmentEvent {
  type: "challenge.completed";
  challengeId: string;
  lessonId?: string;
  conceptIds: string[];
  status: ChallengeEvaluationStatus;
  testsPassed: number;
  testsTotal: number;
  scorePercent: number;
  hintsUsedCount: number;
  timeSpentSeconds: number;
  attemptCount: number;
}

export interface ConceptDemonstratedEvent extends BaseAssessmentEvent {
  type: "concept.demonstrated";
  conceptId: string;
  source: "practice" | "challenge";
  sourceId: string;
  confidenceScore: number; // 0 to 1
}

/** Story Mode "Play" door: the learner predicted order, placement or a value before the reveal. */
export interface PredictionMadeEvent extends BaseAssessmentEvent {
  type: "prediction.made";
  predictionId: string;
  kind: "order" | "placement" | "value";
  lessonId?: string;
  conceptIds: string[];
  isCorrect: boolean;
  misconceptionId?: string;
  attemptNumber: number;
  difficulty: CognitiveDifficulty;
  timeSpentSeconds: number;
}

/** Break-It mode: the learner diagnosed and fixed an injected failure. */
export interface BreakItResolvedEvent extends BaseAssessmentEvent {
  type: "breakIt.resolved";
  scenarioId: string;
  lessonId?: string;
  conceptIds: string[];
  difficulty: CognitiveDifficulty;
  timeToDiagnoseSeconds: number;
  attempts: number;
  hintsUsedCount: number;
}

export type AssessmentEvent =
  | PracticeQuestionCompletedEvent
  | PracticeSessionCompletedEvent
  | ChallengeStartedEvent
  | ChallengeTestPassedEvent
  | ChallengeCompletedEvent
  | ConceptDemonstratedEvent
  | PredictionMadeEvent
  | BreakItResolvedEvent;
