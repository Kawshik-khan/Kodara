/** Kodara Progress Subsystem - Mastery Domain Types */

import { MasteryLevel } from '../config/masteryConfig';

/**
 * Per-concept mastery breakdown.
 * Fully explainable: every dimension can be inspected.
 */
export interface ConceptMastery {
  readonly conceptId: string;
  readonly score: number;                    // 0.0–1.0 composite
  readonly level: MasteryLevel;
  readonly dimensions: MasteryDimensions;
  readonly evidenceCount: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly totalHintsUsed: number;
  readonly lastActivityAt: string;           // ISO 8601
  readonly firstSeenAt: string;              // ISO 8601
  readonly decayApplied: boolean;
  readonly decayedFrom?: number;             // Pre-decay score
  readonly updatedAt: string;                // ISO 8601
}

/** Individual mastery signal dimensions. */
export interface MasteryDimensions {
  readonly practiceAccuracy: number;          // 0.0–1.0
  readonly challengeCompletion: number;       // 0.0–1.0
  readonly hintsEfficiency: number;           // 0.0–1.0 (1.0 = no hints used)
  readonly speedEfficiency: number;           // 0.0–1.0 (1.0 = within estimated time)
  readonly consistencyBonus: number;          // 0.0–1.0 (consecutive correct streak)
}

/**
 * Snapshot of all concept masteries at a point in time.
 * Used for dashboard rendering and recommendation input.
 */
export interface MasterySnapshot {
  readonly learnerId: string;
  readonly trackId: string;
  readonly concepts: ReadonlyMap<string, ConceptMastery>;
  readonly overallScore: number;             // Weighted average across all concepts
  readonly overallLevel: MasteryLevel;
  readonly totalConceptsIntroduced: number;
  readonly totalConceptsMastered: number;
  readonly computedAt: string;               // ISO 8601
}

/**
 * Explanation of how a mastery score was computed.
 * Supports the explainability requirement.
 */
export interface MasteryExplanation {
  readonly conceptId: string;
  readonly finalScore: number;
  readonly level: MasteryLevel;
  readonly formula: string;                  // Human-readable formula
  readonly dimensionContributions: {
    readonly dimension: string;
    readonly weight: number;
    readonly rawValue: number;
    readonly contribution: number;
  }[];
  readonly evidenceSummary: {
    readonly totalRecords: number;
    readonly correctRecords: number;
    readonly challengesPassed: number;
    readonly hintsUsed: number;
    readonly avgDifficulty: number;
    readonly streakLength: number;
  };
  readonly decayInfo?: {
    readonly daysSinceActivity: number;
    readonly decayFactor: number;
    readonly preDecayScore: number;
  };
}
