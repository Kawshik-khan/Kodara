/** Kodara Progress Subsystem - Review Queue Service */

import { ReviewQueue, ReviewItem } from '../types/review.types';
import { MasterySnapshot } from '../types/mastery.types';
import { ProgressRepository, localProgressRepository } from '../repositories/ProgressRepository';
import { generateReviewQueue, ConceptLookup } from '../engines/SpacedReviewEngine';
import { MASTERY_CONFIG, MasteryConfig } from '../config/masteryConfig';

/**
 * Manages the review queue lifecycle.
 */
export class ReviewService {
  constructor(
    private readonly repository: ProgressRepository = localProgressRepository,
    private readonly config: MasteryConfig = MASTERY_CONFIG
  ) {}

  /** Generate and persist a new review queue from current mastery state. */
  public generateQueue(snapshot: MasterySnapshot, lookup: ConceptLookup): ReviewQueue {
    const queue = generateReviewQueue(snapshot, lookup, this.config);
    this.repository.saveReviewItems([...queue.items]);
    return queue;
  }

  /** Get current review queue from storage. */
  public getQueue(): ReviewItem[] {
    return this.repository.getReviewItems();
  }

  /** Get count of pending review items. */
  public getPendingCount(): number {
    return this.repository.getReviewItems().length;
  }

  /** Dismiss a review item (learner completed or skipped it). */
  public dismissItem(itemId: string): void {
    this.repository.dismissReviewItem(itemId);
  }
}

export const reviewService = new ReviewService();
