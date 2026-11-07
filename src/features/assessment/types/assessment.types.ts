/**
 * Kodara Assessment Subsystem - General Assessment Domain Types
 */



/**
 * Cognitive Difficulty Scale (1–5)
 * Represents cognitive complexity rather than question length.
 * 1 — Recall (recognizing facts, definitions)
 * 2 — Understanding (explaining concepts, predicting outcomes)
 * 3 — Application (fixing errors, using concepts in context)
 * 4 — Reasoning (analyzing trade-offs, explaining compiler errors)
 * 5 — Engineering (designing type systems, architecting solutions)
 */
export type CognitiveDifficulty = 1 | 2 | 3 | 4 | 5;

export interface AssessmentMisconception {
  id: string;
  labelEn: string;
  labelBn: string;
  wrongMentalModelEn: string;
  wrongMentalModelBn: string;
  correctionEn: string;
  correctionBn: string;
}

export interface AssessmentHint {
  id: string;
  level: 1 | 2 | 3; // 1: small nudge, 2: explicit direction, 3: near-solution guidance
  nudgeEn: string;
  nudgeBn: string;
}

export interface AssessmentFeedback {
  isCorrect: boolean;
  whatHappenedEn: string;
  whatHappenedBn: string;
  whyHappenedEn: string;
  whyHappenedBn: string;
  whySelectedWrongEn?: string;
  whySelectedWrongBn?: string;
  mentalModelEn: string;
  mentalModelBn: string;
  ruleOfThumbEn?: string;
  ruleOfThumbBn?: string;
  misconception?: AssessmentMisconception;
}

export interface AssessmentResultSummary {
  totalItems: number;
  correctItems: number;
  scorePercent: number;
  timeSpentSeconds: number;
  hintsUsedCount: number;
  masteredConceptIds: string[];
  weakConceptIds: string[];
  recommendedReviewConceptIds: string[];
}
