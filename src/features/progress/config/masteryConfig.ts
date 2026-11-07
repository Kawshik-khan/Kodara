/** Kodara Progress Subsystem - Mastery Configuration */

/**
 * Signal weights for multi-dimensional mastery calculation.
 * All weights must sum to 1.0 within each signal group.
 */
export interface MasterySignalWeights {
  readonly practiceAccuracy: number;      // Weight for practice question correctness
  readonly challengeCompletion: number;   // Weight for passing challenges
  readonly hintsEfficiency: number;       // Weight for minimal hint usage
  readonly speedEfficiency: number;       // Weight for completing within estimated time
  readonly consistencyBonus: number;      // Weight for repeated correct answers
}

export interface MasteryThresholds {
  readonly introduced: number;    // 0.0 — concept has been seen
  readonly developing: number;    // 0.25 — some evidence of understanding
  readonly proficient: number;    // 0.60 — can apply concept independently
  readonly mastered: number;      // 0.85 — reliable under varying conditions
  readonly expert: number;        // 0.95 — can teach it, handles edge cases
}

export type MasteryLevel = 'not_started' | 'introduced' | 'developing' | 'proficient' | 'mastered' | 'expert';

export interface DecayConfig {
  readonly halfLifeDays: number;           // Days until mastery score halves without reinforcement
  readonly minimumDecayedScore: number;    // Floor below which mastery doesn't decay
  readonly graceWindowDays: number;        // Days after last activity before decay starts
}

export interface ReviewConfig {
  readonly maxDailyReviewItems: number;
  readonly reviewTriggerThreshold: number;   // Mastery below this triggers review
  readonly priorityBoostForCritical: number; // Multiplier for 'critical' importance concepts
  readonly spacedIntervalsDays: readonly number[];  // Fibonacci-inspired: [1, 2, 3, 5, 8, 13, 21]
}

export interface HintPenaltyConfig {
  readonly level1Penalty: number;  // 0.05 — small nudge
  readonly level2Penalty: number;  // 0.15 — explicit direction
  readonly level3Penalty: number;  // 0.30 — near-solution
}

export interface MasteryConfig {
  readonly version: string;
  readonly signalWeights: MasterySignalWeights;
  readonly thresholds: MasteryThresholds;
  readonly decay: DecayConfig;
  readonly review: ReviewConfig;
  readonly hintPenalty: HintPenaltyConfig;
  readonly difficultyMultipliers: Readonly<Record<1 | 2 | 3 | 4 | 5, number>>;
}

export const MASTERY_CONFIG: MasteryConfig = Object.freeze({
  version: '1.1.0',   // 1.1.0: prediction and break-it evidence count toward mastery
  signalWeights: Object.freeze({
    practiceAccuracy: 0.30,
    challengeCompletion: 0.35,
    hintsEfficiency: 0.10,
    speedEfficiency: 0.10,
    consistencyBonus: 0.15,
  }),
  thresholds: Object.freeze({
    introduced: 0.0,
    developing: 0.25,
    proficient: 0.60,
    mastered: 0.85,
    expert: 0.95,
  }),
  decay: Object.freeze({
    halfLifeDays: 14,
    minimumDecayedScore: 0.10,
    graceWindowDays: 3,
  }),
  review: Object.freeze({
    maxDailyReviewItems: 10,
    reviewTriggerThreshold: 0.70,
    priorityBoostForCritical: 1.5,
    spacedIntervalsDays: Object.freeze([1, 2, 3, 5, 8, 13, 21]),
  }),
  hintPenalty: Object.freeze({
    level1Penalty: 0.05,
    level2Penalty: 0.15,
    level3Penalty: 0.30,
  }),
  difficultyMultipliers: Object.freeze({
    1: 0.6,
    2: 0.8,
    3: 1.0,
    4: 1.2,
    5: 1.5,
  }),
});

/** Resolve a numeric mastery score (0.0–1.0) to a human-readable MasteryLevel. */
export function resolveLevel(score: number): MasteryLevel {
  const t = MASTERY_CONFIG.thresholds;
  if (score >= t.expert) return 'expert';
  if (score >= t.mastered) return 'mastered';
  if (score >= t.proficient) return 'proficient';
  if (score >= t.developing) return 'developing';
  if (score > t.introduced) return 'introduced';
  return 'not_started';
}
