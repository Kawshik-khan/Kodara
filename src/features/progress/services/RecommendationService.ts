/** Kodara Progress Subsystem - Recommendation Service */

import { NextBestAction, LearnerProgressSummary } from '../types/recommendation.types';
import { MasterySnapshot } from '../types/mastery.types';
import { ReviewQueue } from '../types/review.types';
import { generateRecommendations, CurriculumContext } from '../engines/RecommendationEngine';
import { MasteryService, masteryService } from './MasteryService';
import { ReviewService, reviewService } from './ReviewService';

/**
 * High-level service combining mastery + review into learning recommendations.
 */
export class RecommendationService {
  constructor(
    private readonly mastery: MasteryService = masteryService,
    private readonly review: ReviewService = reviewService
  ) {}

  /** Generate the next best action for the learner. */
  public getNextBestAction(
    snapshot: MasterySnapshot,
    reviewQueue: ReviewQueue,
    curriculum: CurriculumContext,
    maxResults?: number
  ): NextBestAction {
    return generateRecommendations(snapshot, reviewQueue, curriculum, maxResults);
  }

  /** Build a learner progress summary for the dashboard. */
  public buildProgressSummary(
    learnerId: string,
    trackId: string,
    conceptIds: string[],
    lessonsTotal: number,
    completedLessonIds: string[],
    challengesTotal: number,
    challengesPassed: number
  ): LearnerProgressSummary {
    const snapshot = this.mastery.getSnapshot(learnerId, trackId, conceptIds);
    const reviewItems = this.review.getQueue();
    const counts = this.mastery.countByLevel(conceptIds);
    const allEvidence = this.mastery.getAllMasteries();
    const totalMinutes = allEvidence.reduce((sum, m) => {
      // Approximate from evidence count * avg 2 min per evidence
      return sum + m.evidenceCount * 2;
    }, 0);

    return {
      learnerId,
      trackId,
      overallMasteryScore: snapshot.overallScore,
      overallLevel: snapshot.overallLevel,
      conceptsTotal: conceptIds.length,
      conceptsMastered: counts.mastered + counts.expert,
      conceptsDeveloping: counts.developing + counts.proficient,
      conceptsNotStarted: counts.not_started,
      lessonsCompleted: completedLessonIds.length,
      lessonsTotal,
      challengesPassed,
      challengesTotal,
      currentStreakDays: 0, // TODO: compute from evidence timestamps
      totalLearningMinutes: totalMinutes,
      reviewItemsCount: reviewItems.length,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const recommendationService = new RecommendationService();
