/** Kodara Progress Subsystem - Mastery Query Service */

import { ConceptMastery, MasterySnapshot, MasteryExplanation } from '../types/mastery.types';
import { ProgressRepository, localProgressRepository } from '../repositories/ProgressRepository';
import { computeMasterySnapshot, explainMastery, applyDecay } from '../engines/MasteryEngine';
import { MASTERY_CONFIG, MasteryConfig, MasteryLevel } from '../config/masteryConfig';

/**
 * Read-only query service for mastery state.
 * All writes go through AssessmentIngestionService.
 */
export class MasteryService {
  constructor(
    private readonly repository: ProgressRepository = localProgressRepository,
    private readonly config: MasteryConfig = MASTERY_CONFIG
  ) {}

  /** Get mastery for a single concept. */
  public getConceptMastery(conceptId: string): ConceptMastery | undefined {
    return this.repository.getMastery(conceptId);
  }

  /** Get mastery level for a single concept. */
  public getConceptLevel(conceptId: string): MasteryLevel {
    const m = this.repository.getMastery(conceptId);
    return m ? m.level : 'not_started';
  }

  /** Get mastery score (0-1) for a single concept. */
  public getConceptScore(conceptId: string): number {
    const m = this.repository.getMastery(conceptId);
    return m ? m.score : 0;
  }

  /** Get all concept masteries. */
  public getAllMasteries(): ConceptMastery[] {
    return this.repository.getAllMasteries();
  }

  /** Compute a full mastery snapshot for dashboard. */
  public getSnapshot(learnerId: string, trackId: string, conceptIds: string[]): MasterySnapshot {
    const allEvidence = this.repository.getAllEvidence();
    return computeMasterySnapshot(learnerId, trackId, allEvidence, conceptIds, this.config);
  }

  /** Get detailed mastery explanation for a concept (for explainability UI). */
  public explainConceptMastery(conceptId: string): MasteryExplanation {
    const evidence = this.repository.getEvidenceForConcept(conceptId);
    return explainMastery(conceptId, evidence, this.config);
  }

  /** Get concepts below mastery threshold (weak concepts). */
  public getWeakConcepts(threshold?: number): ConceptMastery[] {
    const th = threshold ?? this.config.review.reviewTriggerThreshold;
    return this.repository.getAllMasteries().filter(m => m.score < th);
  }

  /** Get concepts at or above mastered level. */
  public getMasteredConcepts(): ConceptMastery[] {
    return this.repository.getAllMasteries().filter(
      m => m.level === 'mastered' || m.level === 'expert'
    );
  }

  /** Count concepts by mastery level. */
  public countByLevel(conceptIds: string[]): Record<MasteryLevel, number> {
    const counts: Record<MasteryLevel, number> = {
      not_started: 0, introduced: 0, developing: 0, proficient: 0, mastered: 0, expert: 0,
    };
    for (const cid of conceptIds) {
      const level = this.getConceptLevel(cid);
      counts[level]++;
    }
    return counts;
  }

  /** Apply decay to all masteries and persist. */
  public applyDecayToAll(): void {
    const all = this.repository.getAllMasteries();
    const now = new Date().toISOString();
    for (const m of all) {
      const decayed = applyDecay(m, this.config, now);
      if (decayed.score !== m.score) {
        this.repository.saveMastery(decayed);
      }
    }
  }
}

export const masteryService = new MasteryService();
