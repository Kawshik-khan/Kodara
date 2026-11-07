/** Kodara Progress Subsystem - Recommendation & Next Best Action Types */

import { MasteryLevel } from '../config/masteryConfig';

/** Type of recommended learning action. */
export type ActionType =
  | 'continue_lesson'
  | 'start_lesson'
  | 'practice_weak_concepts'
  | 'take_challenge'
  | 'review_decayed'
  | 'start_project'
  | 'revisit_lesson';

/**
 * A ranked learning recommendation.
 * Deterministically scored and ordered.
 */
export interface LearningRecommendation {
  readonly id: string;
  readonly actionType: ActionType;
  readonly targetId: string;                 // lessonId, challengeId, practiceSessionId
  readonly titleEn: string;
  readonly titleBn: string;
  readonly descriptionEn: string;
  readonly descriptionBn: string;
  readonly reasonEn: string;
  readonly reasonBn: string;
  readonly score: number;                    // 0.0–1.0 relevance ranking
  readonly relatedConceptIds: string[];
  readonly estimatedMinutes?: number;
  readonly difficulty?: string;
  readonly actionUrl: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * The single top recommendation for the learner.
 * Rendered as the "Next Best Action" card.
 */
export interface NextBestAction {
  readonly primary: LearningRecommendation;
  readonly alternatives: readonly LearningRecommendation[];
  readonly generatedAt: string;              // ISO 8601
}

/**
 * Progress summary for the learner dashboard.
 * Aggregated from mastery state.
 */
export interface LearnerProgressSummary {
  readonly learnerId: string;
  readonly trackId: string;
  readonly overallMasteryScore: number;
  readonly overallLevel: MasteryLevel;
  readonly conceptsTotal: number;
  readonly conceptsMastered: number;
  readonly conceptsDeveloping: number;
  readonly conceptsNotStarted: number;
  readonly lessonsCompleted: number;
  readonly lessonsTotal: number;
  readonly challengesPassed: number;
  readonly challengesTotal: number;
  readonly currentStreakDays: number;
  readonly totalLearningMinutes: number;
  readonly reviewItemsCount: number;
  readonly updatedAt: string;
}
