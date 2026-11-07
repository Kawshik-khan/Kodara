/**
 * Kodara Challenge Subsystem - Challenge & Test Case Types
 * Discriminated union architecture for 6 challenge types.
 */

import { CognitiveDifficulty, AssessmentHint } from "./assessment.types";
import { DifficultyLevel } from "@/features/lessons/types/lesson.types";

export type ChallengeKind =
  | "code-implementation"
  | "debugging-challenge"
  | "refactoring-challenge"
  | "type-design-challenge"
  | "code-reasoning-challenge"
  | "architecture-challenge";

export type ChallengeEvaluationStatus =
  | "passed"
  | "failed"
  | "partial"
  | "timeout"
  | "compile-error"
  | "runtime-error";

export interface ChallengeTestCase {
  id: string;
  descriptionEn: string;
  descriptionBn: string;
  inputSnippet?: string;
  expectedOutputSnippet?: string;
  hidden: boolean; // Hidden tests do not reveal expected output on failure
  weight: number; // Point weight for partial credit calculation
  timeoutMs?: number;
  testFunctionCode?: string; // Assertions for execution engine
  isCompileTimeOnly?: boolean; // Evaluated at compile-time e.g., @ts-expect-error
}

export interface TestCaseResult {
  testCaseId: string;
  descriptionEn: string;
  descriptionBn: string;
  status: "passed" | "failed" | "error";
  hidden: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  errorMessage?: string;
  executionTimeMs?: number;
}

export interface ChallengeEvaluation {
  status: ChallengeEvaluationStatus;
  scorePercent: number;
  testsTotal: number;
  testsPassed: number;
  testResults: TestCaseResult[];
  compileError?: string;
  runtimeError?: string;
  executionTimeMs: number;
  typeCheckPassed: boolean;
  runtimePassed: boolean;
  feedbackEn: string;
  feedbackBn: string;
}

export interface BaseChallenge {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  lessonId?: string;
  moduleId?: string;
  conceptIds: string[];
  difficulty: DifficultyLevel;
  cognitiveDifficulty: CognitiveDifficulty;
  estimatedMinutes: number;
  objectivesEn: string[];
  objectivesBn: string[];
  requirementsEn: string[];
  requirementsBn: string[];
  constraintsEn?: string[];
  constraintsBn?: string[];
  starterCode: string;
  solutionCode: string;
  solutionExplanationEn: string;
  solutionExplanationBn: string;
  alternativeApproachesEn?: string[];
  alternativeApproachesBn?: string[];
  commonMistakesEn?: string[];
  commonMistakesBn?: string[];
  language: "typescript" | "python" | "react";
  testCases: ChallengeTestCase[];
  hints: AssessmentHint[];
  visualizationId?: string;
  prerequisiteConceptIds?: string[];
}

export interface CodeImplementationChallenge extends BaseChallenge {
  type: "code-implementation";
}

export interface DebuggingChallenge extends BaseChallenge {
  type: "debugging-challenge";
  brokenCode: string;
}

export interface RefactoringChallenge extends BaseChallenge {
  type: "refactoring-challenge";
  legacyCode: string;
}

export interface TypeDesignChallenge extends BaseChallenge {
  type: "type-design-challenge";
}

export interface CodeReasoningChallenge extends BaseChallenge {
  type: "code-reasoning-challenge";
}

export interface ArchitectureChallenge extends BaseChallenge {
  type: "architecture-challenge";
}

export type Challenge =
  | CodeImplementationChallenge
  | DebuggingChallenge
  | RefactoringChallenge
  | TypeDesignChallenge
  | CodeReasoningChallenge
  | ArchitectureChallenge;

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  learnerId?: string;
  submittedCode: string;
  evaluation: ChallengeEvaluation;
  hintsUsedCount: number;
  hintsViewedIds: string[];
  timeSpentSeconds: number;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface ChallengeState {
  challengeId: string;
  code: string;
  lastEvaluation?: ChallengeEvaluation;
  attempts: ChallengeAttempt[];
  activeHintIndex: number;
  isSubmitting: boolean;
  isSolutionRevealed: boolean;
  status: "not_started" | "in_progress" | "passed" | "failed";
}
