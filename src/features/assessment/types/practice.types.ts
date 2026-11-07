/**
 * Kodara Practice Subsystem - Practice Question & Session Types
 * Discriminated union architecture for 12 interactive question types.
 */

import { CognitiveDifficulty, AssessmentHint, AssessmentMisconception, AssessmentFeedback } from "./assessment.types";

export type PracticeQuestionKind =
  | "multiple-choice"
  | "multiple-select"
  | "true-false"
  | "predict-type"
  | "predict-output"
  | "code-completion"
  | "debugging"
  | "code-reading"
  | "order-steps"
  | "matching"
  | "error-explanation"
  | "visualization-prediction";

export interface BaseQuestion {
  id: string;
  lessonId?: string;
  moduleId?: string;
  conceptIds: string[];
  type: PracticeQuestionKind;
  difficulty: CognitiveDifficulty;
  estimatedSeconds: number;
  promptEn: string;
  promptBn: string;
  instructionsEn?: string;
  instructionsBn?: string;
  explanationEn: string;
  explanationBn: string;
  misconception?: AssessmentMisconception;
  hints?: AssessmentHint[];
  metadata?: Record<string, unknown>;
}

/* --- Type 1: Multiple Choice --- */
export interface PracticeOption {
  id: string;
  textEn: string;
  textBn: string;
  isCorrect: boolean;
  explanationEn?: string;
  explanationBn?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  codeSnippet?: string;
  options: PracticeOption[];
}

/* --- Type 2: Multiple Select --- */
export interface MultiSelectQuestion extends BaseQuestion {
  type: "multiple-select";
  codeSnippet?: string;
  options: PracticeOption[];
}

/* --- Type 3: True / False --- */
export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  codeSnippet?: string;
  correctAnswer: boolean;
  trueExplanationEn: string;
  trueExplanationBn: string;
  falseExplanationEn: string;
  falseExplanationBn: string;
}

/* --- Type 4: Predict the Type --- */
export interface TypePredictionOption {
  id: string;
  typeString: string;
  isCorrect: boolean;
  explanationEn?: string;
  explanationBn?: string;
}

export interface PredictTypeQuestion extends BaseQuestion {
  type: "predict-type";
  codeSnippet: string;
  targetIdentifier?: string;
  options: TypePredictionOption[];
}

/* --- Type 5: Predict Output --- */
export interface OutputPredictionOption {
  id: string;
  outputString: string;
  isCorrect: boolean;
  explanationEn?: string;
  explanationBn?: string;
}

export interface PredictOutputQuestion extends BaseQuestion {
  type: "predict-output";
  codeSnippet: string;
  options: OutputPredictionOption[];
}

/* --- Type 6: Code Completion --- */
export interface CodeBlankItem {
  id: string;
  label: string; // e.g. "___1___"
  correctValue: string;
  acceptableValues?: string[];
  options?: string[]; // Multiple choice options per blank if provided
}

export interface CodeCompletionQuestion extends BaseQuestion {
  type: "code-completion";
  templateCode: string; // Contains placeholders like ___1___
  blanks: CodeBlankItem[];
}

/* --- Type 7: Debugging --- */
export interface DebuggingOption {
  id: string;
  fixedCode: string;
  isCorrect: boolean;
  explanationEn: string;
  explanationBn: string;
}

export interface DebuggingQuestion extends BaseQuestion {
  type: "debugging";
  brokenCode: string;
  compilerErrorText?: string;
  options: DebuggingOption[];
}

/* --- Type 8: Code Reading --- */
export interface CodeReadingQuestion extends BaseQuestion {
  type: "code-reading";
  codeSnippet: string;
  options: PracticeOption[];
}

/* --- Type 9: Order the Steps --- */
export interface OrderStepItem {
  id: string;
  labelEn: string;
  labelBn: string;
  correctOrder: number; // 1-indexed correct position
}

export interface OrderStepsQuestion extends BaseQuestion {
  type: "order-steps";
  items: OrderStepItem[];
}

/* --- Type 10: Matching --- */
export interface MatchingPair {
  id: string;
  leftEn: string;
  leftBn: string;
  rightEn: string;
  rightBn: string;
  codeSnippetLeft?: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  pairs: MatchingPair[];
}

/* --- Type 11: Error Explanation --- */
export interface ErrorExplanationQuestion extends BaseQuestion {
  type: "error-explanation";
  codeSnippet: string;
  compilerError: string;
  options: PracticeOption[];
}

/* --- Type 12: Visualization Prediction --- */
export interface VisualizationPredictionQuestion extends BaseQuestion {
  type: "visualization-prediction";
  visualizationId: string;
  codeSnippet?: string;
  stepToEvaluate: number;
  options: PracticeOption[];
}

export type PracticeQuestion =
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | TrueFalseQuestion
  | PredictTypeQuestion
  | PredictOutputQuestion
  | CodeCompletionQuestion
  | DebuggingQuestion
  | CodeReadingQuestion
  | OrderStepsQuestion
  | MatchingQuestion
  | ErrorExplanationQuestion
  | VisualizationPredictionQuestion;

/* --- Practice Session & Attempts --- */

export type PracticeSessionMode =
  | "lesson"
  | "concept"
  | "module"
  | "review"
  | "weak-concept";

export interface PracticeAttempt {
  id: string;
  sessionId: string;
  questionId: string;
  learnerId?: string;
  answer: unknown; // Answer payload depending on question type
  isCorrect: boolean;
  timeSpentSeconds: number;
  hintsUsedCount: number;
  hintsViewedIds: string[];
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  feedbackShown: AssessmentFeedback;
  conceptIds: string[];
  difficulty: CognitiveDifficulty;
}

export interface PracticeSessionState {
  sessionId: string;
  mode: PracticeSessionMode;
  targetId: string; // lessonId, conceptId, or moduleId
  questions: PracticeQuestion[];
  currentIndex: number;
  answers: Record<string, unknown>;
  attempts: PracticeAttempt[];
  startedAt: string;
  completedAt?: string;
  isFinished: boolean;
}
