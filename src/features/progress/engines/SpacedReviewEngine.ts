/** Kodara Progress Subsystem - Spaced Review Engine */

import { MasterySnapshot } from '../types/mastery.types';
import { ReviewItem, ReviewQueue, ReviewPriority, ReviewReason } from '../types/review.types';
import { MasteryConfig, MASTERY_CONFIG } from '../config/masteryConfig';
import { uuidv7 } from '@/lib/ids';

/**
 * Minimal concept metadata lookup interface.
 * Keeps the engine decoupled from CurriculumService.
 */
export interface ConceptLookup {
  getImportance(conceptId: string): 'critical' | 'high' | 'standard';
  getNameEn(conceptId: string): string;
  getNameBn(conceptId: string): string;
}

/**
 * Generates a prioritized review queue from a MasterySnapshot.
 *
 * Algorithm:
 *   1. For each concept in snapshot, check if score < reviewTriggerThreshold
 *      or daysSinceLastActivity matches a spaced interval.
 *   2. Assign ReviewReason and ReviewPriority.
 *   3. Suggest activity based on score level.
 *   4. Sort by priority desc, then by days since activity desc.
 *   5. Cap at maxDailyReviewItems.
 */
export function generateReviewQueue(
  snapshot: MasterySnapshot,
  lookup: ConceptLookup,
  config: MasteryConfig = MASTERY_CONFIG,
  now: string = new Date().toISOString()
): ReviewQueue {
  const items: ReviewItem[] = [];
  const nowMs = new Date(now).getTime();
  const threshold = config.review.reviewTriggerThreshold;
  const intervals = config.review.spacedIntervalsDays;

  for (const [conceptId, mastery] of snapshot.concepts) {
    const lastActivityMs = new Date(mastery.lastActivityAt).getTime();
    const daysSinceLastActivity = Math.floor(
      Math.max(0, (nowMs - lastActivityMs) / (1000 * 60 * 60 * 24))
    );
    const score = mastery.score;
    const importance = lookup.getImportance(conceptId);

    let needsReview = false;
    let reason: ReviewReason = 'below_threshold';

    // Check if below mastery threshold
    if (score < threshold) {
      needsReview = true;
      reason = 'below_threshold';
    }

    // Check spaced intervals (only if not already flagged)
    if (!needsReview) {
      for (const interval of intervals) {
        if (daysSinceLastActivity >= interval && daysSinceLastActivity < interval + 3) {
          needsReview = true;
          reason = 'spaced_interval';
          break;
        }
      }
    }

    // Check for long absence
    const maxInterval = intervals[intervals.length - 1] ?? 21;
    if (daysSinceLastActivity > maxInterval) {
      needsReview = true;
      reason = 'long_absence';
    }

    // Check mastery decay
    if (mastery.decayApplied) {
      needsReview = true;
      reason = 'mastery_decay';
    }

    if (!needsReview) continue;

    // --- Determine priority ---
    let priority: ReviewPriority = 'normal';
    if (score < 0.25 && importance === 'critical') {
      priority = 'critical';
    } else if (score < 0.40 || importance === 'critical') {
      priority = 'high';
    } else if (score < threshold) {
      priority = 'normal';
    } else {
      priority = 'low';
    }

    // --- Suggest activity ---
    let suggestedActivityType: 'lesson_review' | 'practice' | 'challenge' = 'challenge';
    if (score < 0.3) suggestedActivityType = 'lesson_review';
    else if (score < 0.6) suggestedActivityType = 'practice';

    // --- Build reason text ---
    const { reasonEn, reasonBn } = buildReasonText(reason, daysSinceLastActivity, score);

    items.push({
      id: uuidv7(),
      conceptId,
      conceptNameEn: lookup.getNameEn(conceptId),
      conceptNameBn: lookup.getNameBn(conceptId),
      priority,
      reason,
      reasonEn,
      reasonBn,
      currentScore: score,
      currentLevel: mastery.level,
      targetScore: threshold,
      daysSinceLastActivity,
      suggestedActivityType,
      scheduledAt: now,
      createdAt: now,
    });
  }

  // --- Sort: priority desc, then days since activity desc ---
  const priorityWeight: Record<ReviewPriority, number> = {
    critical: 4,
    high: 3,
    normal: 2,
    low: 1,
  };

  items.sort((a, b) => {
    const pA = priorityWeight[a.priority];
    const pB = priorityWeight[b.priority];
    if (pA !== pB) return pB - pA;
    return b.daysSinceLastActivity - a.daysSinceLastActivity;
  });

  // --- Cap at max ---
  const cappedItems = items.slice(0, config.review.maxDailyReviewItems);

  const criticalCount = cappedItems.filter((i) => i.priority === 'critical').length;
  const highCount = cappedItems.filter((i) => i.priority === 'high').length;
  const normalCount = cappedItems.filter((i) => i.priority === 'normal').length;

  return {
    learnerId: snapshot.learnerId,
    items: cappedItems,
    totalItems: cappedItems.length,
    criticalCount,
    highCount,
    normalCount,
    generatedAt: now,
  };
}

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                            */
/* -------------------------------------------------------------------------- */

function buildReasonText(
  reason: ReviewReason,
  days: number,
  score: number
): { reasonEn: string; reasonBn: string } {
  switch (reason) {
    case 'mastery_decay':
      return {
        reasonEn: `Your mastery has decayed after ${days} days without practice.`,
        reasonBn: `${days} দিন প্র্যাক্টিস না করায় আপনার দক্ষতা কমে গেছে।`,
      };
    case 'below_threshold':
      return {
        reasonEn: `Current mastery (${Math.round(score * 100)}%) is below the proficiency threshold.`,
        reasonBn: `বর্তমান দক্ষতা (${Math.round(score * 100)}%) প্রয়োজনীয় মানের নিচে।`,
      };
    case 'consecutive_errors':
      return {
        reasonEn: 'Multiple incorrect attempts detected.',
        reasonBn: 'একাধিক ভুল উত্তর সনাক্ত হয়েছে।',
      };
    case 'long_absence':
      return {
        reasonEn: `It has been ${days} days since your last activity on this concept.`,
        reasonBn: `এই কনসেপ্টে আপনার শেষ কাজের ${days} দিন হয়ে গেছে।`,
      };
    case 'spaced_interval':
      return {
        reasonEn: 'Scheduled review to reinforce long-term retention.',
        reasonBn: 'দীর্ঘমেয়াদী স্মৃতি ধরে রাখতে নির্ধারিত রিভিউ।',
      };
    case 'prerequisite_weakness':
      return {
        reasonEn: 'A prerequisite concept needs strengthening.',
        reasonBn: 'একটি পূর্বশর্ত কনসেপ্ট শক্তিশালী করা দরকার।',
      };
    default:
      return { reasonEn: 'Review recommended.', reasonBn: 'রিভিউ প্রয়োজন।' };
  }
}
