/** Kodara Progress Subsystem - Mastery Engine */

import { MasteryConfig, MASTERY_CONFIG, resolveLevel } from '../config/masteryConfig';
import { EvidenceRecord } from '../types/evidence.types';
import { ConceptMastery, MasteryDimensions, MasterySnapshot, MasteryExplanation } from '../types/mastery.types';

/**
 * Computes ConceptMastery for a single concept from its evidence records.
 *
 * Algorithm:
 *   1. Partition evidence by signal type.
 *   2. Compute each mastery dimension independently.
 *   3. Weighted composite: Σ(dimension × weight).
 *   4. Normalize to [0, 1].
 *   5. Resolve to MasteryLevel.
 */
export function computeConceptMastery(
  conceptId: string,
  evidence: EvidenceRecord[],
  config: MasteryConfig = MASTERY_CONFIG,
  now: string = new Date().toISOString()
): ConceptMastery {
  const conceptEvidence = evidence.filter((e) => e.conceptId === conceptId);
  const evidenceCount = conceptEvidence.length;

  if (evidenceCount === 0) {
    return buildEmptyMastery(conceptId, now);
  }

  // --- Partition evidence ---
  let correctPractice = 0;
  let totalPractice = 0;
  let challengesPassed = 0;
  let challengesTotal = 0;
  let totalHintsUsed = 0;
  let speedSum = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  // For streak calculation
  let currentStreak = 0;
  let maxStreak = 0;

  // Sort by timestamp for streak calculation
  const sorted = [...conceptEvidence].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (const record of sorted) {
    totalHintsUsed += record.hintsUsed;

    // Speed: ratio of estimated to actual time (capped at 1.0)
    if (record.timeSpentSeconds > 0) {
      // Estimate ~60s per evidence point as baseline
      const estimatedSeconds = 60;
      speedSum += Math.min(1.0, estimatedSeconds / record.timeSpentSeconds);
    } else {
      speedSum += 1.0; // No time recorded = assume efficient
    }

    if (record.signal === 'practice_correct' || record.signal === 'prediction_correct') {
      totalPractice++;
      correctPractice++;
      correctCount++;
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (record.signal === 'practice_incorrect' || record.signal === 'prediction_incorrect') {
      totalPractice++;
      incorrectCount++;
      currentStreak = 0;
    } else if (record.signal === 'challenge_passed' || record.signal === 'break_it_resolved') {
      challengesPassed++;
      challengesTotal++;
      correctCount++;
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (record.signal === 'challenge_failed' || record.signal === 'challenge_partial') {
      challengesTotal++;
      incorrectCount++;
      currentStreak = 0;
    } else if (record.signal === 'concept_demonstrated') {
      correctCount++;
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (record.signal === 'hint_used') {
      // Hints are tracked via hintsUsed field, not as separate evidence
    }
  }

  // --- Compute dimensions ---
  const practiceAccuracy = totalPractice > 0 ? correctPractice / totalPractice : 0;
  const challengeCompletion = challengesTotal > 0 ? challengesPassed / challengesTotal : 0;
  const hintsEfficiency = Math.max(0, Math.min(1.0, 1.0 - totalHintsUsed / (evidenceCount * 3)));
  const speedEfficiency = evidenceCount > 0 ? speedSum / evidenceCount : 0;
  const consistencyBonus = evidenceCount > 0
    ? Math.max(0, Math.min(1.0, maxStreak / evidenceCount))
    : 0;

  const dimensions: MasteryDimensions = {
    practiceAccuracy,
    challengeCompletion,
    hintsEfficiency,
    speedEfficiency,
    consistencyBonus,
  };

  // --- Weighted composite ---
  const w = config.signalWeights;
  const rawScore =
    practiceAccuracy * w.practiceAccuracy +
    challengeCompletion * w.challengeCompletion +
    hintsEfficiency * w.hintsEfficiency +
    speedEfficiency * w.speedEfficiency +
    consistencyBonus * w.consistencyBonus;

  const finalScore = Math.min(1.0, Math.max(0.0, rawScore));
  const level = resolveLevel(finalScore);

  // Timestamps
  const timestamps = sorted.map((e) => e.timestamp);
  const firstSeenAt = timestamps[0] || now;
  const lastActivityAt = timestamps[timestamps.length - 1] || now;

  return {
    conceptId,
    score: finalScore,
    level,
    dimensions,
    evidenceCount,
    correctCount,
    incorrectCount,
    totalHintsUsed,
    lastActivityAt,
    firstSeenAt,
    decayApplied: false,
    updatedAt: now,
  };
}

/**
 * Computes a complete MasterySnapshot for all given concept IDs.
 */
export function computeMasterySnapshot(
  learnerId: string,
  trackId: string,
  allEvidence: EvidenceRecord[],
  conceptIds: string[],
  config: MasteryConfig = MASTERY_CONFIG,
  now: string = new Date().toISOString()
): MasterySnapshot {
  const concepts = new Map<string, ConceptMastery>();
  let totalScore = 0;
  let masteredCount = 0;
  let introducedCount = 0;

  for (const conceptId of conceptIds) {
    const mastery = computeConceptMastery(conceptId, allEvidence, config, now);
    concepts.set(conceptId, mastery);
    totalScore += mastery.score;
    if (mastery.level === 'mastered' || mastery.level === 'expert') {
      masteredCount++;
    }
    if (mastery.level !== 'not_started') {
      introducedCount++;
    }
  }

  const overallScore = conceptIds.length > 0 ? totalScore / conceptIds.length : 0;
  const overallLevel = resolveLevel(overallScore);

  return {
    learnerId,
    trackId,
    concepts,
    overallScore,
    overallLevel,
    totalConceptsIntroduced: introducedCount,
    totalConceptsMastered: masteredCount,
    computedAt: now,
  };
}

/**
 * Generates a detailed, human-readable explanation of how mastery was computed.
 */
export function explainMastery(
  conceptId: string,
  evidence: EvidenceRecord[],
  config: MasteryConfig = MASTERY_CONFIG,
  now: string = new Date().toISOString()
): MasteryExplanation {
  const mastery = computeConceptMastery(conceptId, evidence, config, now);
  const w = config.signalWeights;

  const dimensionContributions = [
    {
      dimension: 'practiceAccuracy',
      weight: w.practiceAccuracy,
      rawValue: mastery.dimensions.practiceAccuracy,
      contribution: mastery.dimensions.practiceAccuracy * w.practiceAccuracy,
    },
    {
      dimension: 'challengeCompletion',
      weight: w.challengeCompletion,
      rawValue: mastery.dimensions.challengeCompletion,
      contribution: mastery.dimensions.challengeCompletion * w.challengeCompletion,
    },
    {
      dimension: 'hintsEfficiency',
      weight: w.hintsEfficiency,
      rawValue: mastery.dimensions.hintsEfficiency,
      contribution: mastery.dimensions.hintsEfficiency * w.hintsEfficiency,
    },
    {
      dimension: 'speedEfficiency',
      weight: w.speedEfficiency,
      rawValue: mastery.dimensions.speedEfficiency,
      contribution: mastery.dimensions.speedEfficiency * w.speedEfficiency,
    },
    {
      dimension: 'consistencyBonus',
      weight: w.consistencyBonus,
      rawValue: mastery.dimensions.consistencyBonus,
      contribution: mastery.dimensions.consistencyBonus * w.consistencyBonus,
    },
  ];

  // Compute summary stats
  const conceptEvidence = evidence.filter((e) => e.conceptId === conceptId);
  const challengesPassed = conceptEvidence.filter(
    (e) => e.signal === 'challenge_passed'
  ).length;
  const avgDifficulty =
    conceptEvidence.length > 0
      ? conceptEvidence.reduce((sum, e) => sum + e.difficulty, 0) / conceptEvidence.length
      : 0;

  const formula =
    `score = (practiceAccuracy × ${w.practiceAccuracy}) + ` +
    `(challengeCompletion × ${w.challengeCompletion}) + ` +
    `(hintsEfficiency × ${w.hintsEfficiency}) + ` +
    `(speedEfficiency × ${w.speedEfficiency}) + ` +
    `(consistencyBonus × ${w.consistencyBonus})`;

  return {
    conceptId,
    finalScore: mastery.score,
    level: mastery.level,
    formula,
    dimensionContributions,
    evidenceSummary: {
      totalRecords: mastery.evidenceCount,
      correctRecords: mastery.correctCount,
      challengesPassed,
      hintsUsed: mastery.totalHintsUsed,
      avgDifficulty,
      streakLength: Math.round(mastery.dimensions.consistencyBonus * mastery.evidenceCount),
    },
  };
}

/**
 * Applies time-based decay to a mastery score.
 * Uses exponential half-life decay with grace window and minimum floor.
 */
export function applyDecay(
  mastery: ConceptMastery,
  config: MasteryConfig = MASTERY_CONFIG,
  now: string = new Date().toISOString()
): ConceptMastery {
  const lastMs = new Date(mastery.lastActivityAt).getTime();
  const nowMs = new Date(now).getTime();
  const daysSince = Math.max(0, (nowMs - lastMs) / (1000 * 60 * 60 * 24));

  // Grace window: no decay within grace period
  if (daysSince <= config.decay.graceWindowDays) {
    return mastery;
  }

  const activeDays = daysSince - config.decay.graceWindowDays;

  // Exponential decay: score × (0.5 ^ (activeDays / halfLife))
  const decayFactor = Math.pow(0.5, activeDays / config.decay.halfLifeDays);
  const decayedScore = Math.max(config.decay.minimumDecayedScore, mastery.score * decayFactor);

  if (decayedScore === mastery.score) {
    return mastery;
  }

  return {
    ...mastery,
    score: decayedScore,
    level: resolveLevel(decayedScore),
    decayApplied: true,
    decayedFrom: mastery.score,
    updatedAt: now,
  };
}

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                            */
/* -------------------------------------------------------------------------- */

function buildEmptyMastery(conceptId: string, now: string): ConceptMastery {
  return {
    conceptId,
    score: 0,
    level: 'not_started',
    dimensions: {
      practiceAccuracy: 0,
      challengeCompletion: 0,
      hintsEfficiency: 0,
      speedEfficiency: 0,
      consistencyBonus: 0,
    },
    evidenceCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    totalHintsUsed: 0,
    lastActivityAt: now,
    firstSeenAt: now,
    decayApplied: false,
    updatedAt: now,
  };
}
