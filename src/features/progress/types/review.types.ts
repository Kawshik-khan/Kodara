/** Kodara Progress Subsystem - Review & Spaced Repetition Types */

import { MasteryLevel } from '../config/masteryConfig';

/** Priority classification for review scheduling. */
export type ReviewPriority = 'critical' | 'high' | 'normal' | 'low';

/** Reason why a concept was flagged for review. */
export type ReviewReason =
  | 'mastery_decay'
  | 'below_threshold'
  | 'consecutive_errors'
  | 'long_absence'
  | 'spaced_interval'
  | 'prerequisite_weakness';

/**
 * A single item in the review queue.
 * Deterministically computed from mastery state + time.
 */
export interface ReviewItem {
  readonly id: string;
  readonly conceptId: string;
  readonly conceptNameEn: string;
  readonly conceptNameBn: string;
  readonly priority: ReviewPriority;
  readonly reason: ReviewReason;
  readonly reasonEn: string;
  readonly reasonBn: string;
  readonly currentScore: number;
  readonly currentLevel: MasteryLevel;
  readonly targetScore: number;
  readonly daysSinceLastActivity: number;
  readonly suggestedActivityType: 'practice' | 'challenge' | 'lesson_review';
  readonly suggestedActivityId?: string;
  readonly scheduledAt: string;              // ISO 8601
  readonly createdAt: string;                // ISO 8601
}

/**
 * Complete review queue for a learner.
 */
export interface ReviewQueue {
  readonly learnerId: string;
  readonly items: readonly ReviewItem[];
  readonly totalItems: number;
  readonly criticalCount: number;
  readonly highCount: number;
  readonly normalCount: number;
  readonly generatedAt: string;              // ISO 8601
}
