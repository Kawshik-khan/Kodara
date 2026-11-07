/** Kodara Progress Subsystem - Evidence Domain Types */

import { CognitiveDifficulty } from '@/features/assessment/types/assessment.types';

/** The type of evidence signal captured. */
export type EvidenceSignal =
  | 'practice_correct'
  | 'practice_incorrect'
  | 'challenge_passed'
  | 'challenge_failed'
  | 'challenge_partial'
  | 'concept_demonstrated'
  | 'lesson_section_completed'
  | 'hint_used'
  | 'prediction_correct'
  | 'prediction_incorrect'
  | 'break_it_resolved';

/** Source system that generated this evidence. */
export type EvidenceSource = 'practice' | 'challenge' | 'lesson' | 'review' | 'prediction' | 'break_it';

/**
 * A single normalized evidence record.
 * Immutable after creation. Carries full provenance for explainability.
 */
export interface EvidenceRecord {
  readonly id: string;                      // `${sourceEventId}:${conceptId}`, so re-normalizing an event yields the same id
  readonly timestamp: string;               // ISO 8601
  readonly conceptId: string;               // Which concept this evidence is for
  readonly signal: EvidenceSignal;
  readonly source: EvidenceSource;
  readonly sourceId: string;                // questionId, challengeId, lessonId
  readonly sourceEventId: string;           // Original AssessmentEvent.id for provenance
  readonly difficulty: CognitiveDifficulty;
  readonly weight: number;                  // Pre-computed signal weight (0.0–1.0)
  readonly hintsUsed: number;
  readonly timeSpentSeconds: number;
  readonly isCorrect: boolean;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Batch of evidence produced from a single assessment event.
 * One event can produce multiple evidence records (e.g., one per concept).
 */
export interface EvidenceBatch {
  readonly sourceEventId: string;
  readonly timestamp: string;
  readonly records: EvidenceRecord[];
}
