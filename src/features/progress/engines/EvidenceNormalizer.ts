/** Kodara Progress Subsystem - Evidence Normalizer */

import { AssessmentEvent } from '@/features/assessment/types/events.types';
import { CognitiveDifficulty } from '@/features/assessment/types/assessment.types';
import { MasteryConfig, MASTERY_CONFIG } from '../config/masteryConfig';
import { EvidenceBatch, EvidenceRecord, EvidenceSignal, EvidenceSource } from '../types/evidence.types';

/**
 * Normalizes a single AssessmentEvent into an EvidenceBatch.
 *
 * One assessment event can produce MULTIPLE evidence records (one per concept involved).
 * Events without conceptIds (challenge.started, challenge.testPassed) produce empty batches.
 *
 * @param event  The assessment event to normalize.
 * @param config The mastery configuration for weight calculation.
 * @returns An EvidenceBatch containing zero or more evidence records.
 */
export function normalizeEvent(
  event: AssessmentEvent,
  config: MasteryConfig = MASTERY_CONFIG
): EvidenceBatch {
  const emptyBatch: EvidenceBatch = {
    sourceEventId: event.id,
    timestamp: event.timestamp,
    records: [],
  };

  switch (event.type) {
    case 'practice.question.completed':
      return normalizePracticeQuestion(event, config);

    case 'practice.session.completed':
      // Session-level events are summarizations; individual question events
      // are the primary evidence source. Return empty to avoid double-counting.
      return emptyBatch;

    case 'challenge.started':
    case 'challenge.testPassed':
      // No concept-level evidence from these lifecycle events.
      return emptyBatch;

    case 'challenge.completed':
      return normalizeChallengeCompleted(event, config);

    case 'concept.demonstrated':
      return normalizeConceptDemonstrated(event, config);

    case 'prediction.made':
      return normalizePrediction(event, config);

    case 'breakIt.resolved':
      return normalizeBreakItResolved(event, config);

    default:
      return emptyBatch;
  }
}

/* -------------------------------------------------------------------------- */
/* Internal normalizers                                                        */
/* -------------------------------------------------------------------------- */

function normalizePracticeQuestion(
  event: Extract<AssessmentEvent, { type: 'practice.question.completed' }>,
  config: MasteryConfig
): EvidenceBatch {
  const signal: EvidenceSignal = event.isCorrect ? 'practice_correct' : 'practice_incorrect';
  const baseWeight = config.signalWeights.practiceAccuracy;

  const records = event.conceptIds.map((conceptId) =>
    buildRecord({
      conceptId,
      signal,
      source: 'practice',
      sourceId: event.questionId,
      sourceEventId: event.id,
      difficulty: event.difficulty,
      baseWeight,
      hintsUsed: event.hintsUsedCount,
      timeSpentSeconds: event.timeSpentSeconds,
      isCorrect: event.isCorrect,
      timestamp: event.timestamp,
      config,
    })
  );

  return { sourceEventId: event.id, timestamp: event.timestamp, records };
}

function normalizeChallengeCompleted(
  event: Extract<AssessmentEvent, { type: 'challenge.completed' }>,
  config: MasteryConfig
): EvidenceBatch {
  let signal: EvidenceSignal;
  switch (event.status) {
    case 'passed':
      signal = 'challenge_passed';
      break;
    case 'partial':
      signal = 'challenge_partial';
      break;
    default:
      signal = 'challenge_failed';
      break;
  }

  const baseWeight = config.signalWeights.challengeCompletion;

  const records = event.conceptIds.map((conceptId) =>
    buildRecord({
      conceptId,
      signal,
      source: 'challenge',
      sourceId: event.challengeId,
      sourceEventId: event.id,
      difficulty: (event.scorePercent >= 90 ? 4 : event.scorePercent >= 60 ? 3 : 2) as CognitiveDifficulty,
      baseWeight,
      hintsUsed: event.hintsUsedCount,
      timeSpentSeconds: event.timeSpentSeconds,
      isCorrect: event.status === 'passed',
      timestamp: event.timestamp,
      config,
    })
  );

  return { sourceEventId: event.id, timestamp: event.timestamp, records };
}

function normalizeConceptDemonstrated(
  event: Extract<AssessmentEvent, { type: 'concept.demonstrated' }>,
  config: MasteryConfig
): EvidenceBatch {
  const record = buildRecord({
    conceptId: event.conceptId,
    signal: 'concept_demonstrated',
    source: event.source,
    sourceId: event.sourceId,
    sourceEventId: event.id,
    difficulty: 3 as CognitiveDifficulty,
    baseWeight: event.confidenceScore,
    hintsUsed: 0,
    timeSpentSeconds: 0,
    isCorrect: true,
    timestamp: event.timestamp,
    config,
  });

  return { sourceEventId: event.id, timestamp: event.timestamp, records: [record] };
}

function normalizePrediction(
  event: Extract<AssessmentEvent, { type: 'prediction.made' }>,
  config: MasteryConfig
): EvidenceBatch {
  // Predictions test the learner's mental model, so they weigh like practice answers.
  const signal: EvidenceSignal = event.isCorrect ? 'prediction_correct' : 'prediction_incorrect';

  const records = event.conceptIds.map((conceptId) =>
    buildRecord({
      conceptId,
      signal,
      source: 'prediction',
      sourceId: event.predictionId,
      sourceEventId: event.id,
      difficulty: event.difficulty,
      baseWeight: config.signalWeights.practiceAccuracy,
      hintsUsed: 0,
      timeSpentSeconds: event.timeSpentSeconds,
      isCorrect: event.isCorrect,
      timestamp: event.timestamp,
      config,
    })
  );

  return { sourceEventId: event.id, timestamp: event.timestamp, records };
}

function normalizeBreakItResolved(
  event: Extract<AssessmentEvent, { type: 'breakIt.resolved' }>,
  config: MasteryConfig
): EvidenceBatch {
  // Diagnosing an injected failure is applied understanding: weighs like a challenge.
  // Time to diagnose feeds the speed dimension (PRODUCT §4.3).
  const records = event.conceptIds.map((conceptId) =>
    buildRecord({
      conceptId,
      signal: 'break_it_resolved',
      source: 'break_it',
      sourceId: event.scenarioId,
      sourceEventId: event.id,
      difficulty: event.difficulty,
      baseWeight: config.signalWeights.challengeCompletion,
      hintsUsed: event.hintsUsedCount,
      timeSpentSeconds: event.timeToDiagnoseSeconds,
      isCorrect: true,
      timestamp: event.timestamp,
      config,
    })
  );

  return { sourceEventId: event.id, timestamp: event.timestamp, records };
}

/* -------------------------------------------------------------------------- */
/* Record builder                                                              */
/* -------------------------------------------------------------------------- */

interface BuildRecordParams {
  conceptId: string;
  signal: EvidenceSignal;
  source: EvidenceSource;
  sourceId: string;
  sourceEventId: string;
  difficulty: CognitiveDifficulty;
  baseWeight: number;
  hintsUsed: number;
  timeSpentSeconds: number;
  isCorrect: boolean;
  timestamp: string;
  config: MasteryConfig;
}

function buildRecord(params: BuildRecordParams): EvidenceRecord {
  const {
    conceptId, signal, source, sourceId, sourceEventId,
    difficulty, baseWeight, hintsUsed, timeSpentSeconds,
    isCorrect, timestamp, config,
  } = params;

  // Apply difficulty multiplier
  const diffMult = config.difficultyMultipliers[difficulty] ?? 1.0;
  let weight = baseWeight * diffMult;

  // Apply hint penalty (sum of penalties for each hint, capped at 3 hints)
  const cappedHints = Math.min(3, hintsUsed);
  const hintPenalty =
    cappedHints >= 1 ? config.hintPenalty.level1Penalty : 0 +
    cappedHints >= 2 ? config.hintPenalty.level2Penalty : 0 +
    cappedHints >= 3 ? config.hintPenalty.level3Penalty : 0;
  weight -= hintPenalty;

  // Clamp to [0.0, 1.0]
  weight = Math.max(0.0, Math.min(1.0, weight));

  return {
    // Deterministic: one event gives at most one record per concept, matching
    // the server's (event_id, concept_id) identity. Replays can't duplicate.
    id: `${sourceEventId}:${conceptId}`,
    timestamp,
    conceptId,
    signal,
    source,
    sourceId,
    sourceEventId,
    difficulty,
    weight,
    hintsUsed,
    timeSpentSeconds,
    isCorrect,
  };
}
