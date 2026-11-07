/** Kodara Progress Subsystem - Assessment Ingestion Service */

import { AssessmentEvent } from '@/features/assessment/types/events.types';
import { assessmentEventService } from '@/features/assessment/services/AssessmentEventService';
import { normalizeEvent } from '../engines/EvidenceNormalizer';
import { computeConceptMastery } from '../engines/MasteryEngine';
import { ProgressRepository, localProgressRepository } from '../repositories/ProgressRepository';
import { MASTERY_CONFIG, MasteryConfig } from '../config/masteryConfig';

/**
 * Subscribes to AssessmentEventService and processes events into evidence + mastery.
 * Idempotent: duplicate events are detected and skipped.
 * Stateless orchestrator — all state lives in the repository.
 */
export class AssessmentIngestionService {
  private unsubscribe: (() => void) | null = null;

  constructor(
    private readonly repository: ProgressRepository = localProgressRepository,
    private readonly config: MasteryConfig = MASTERY_CONFIG
  ) {}

  /** Start listening for assessment events. */
  public start(): void {
    if (this.unsubscribe) return; // Already started
    this.unsubscribe = assessmentEventService.subscribe((event) => {
      this.processEvent(event);
    });
  }

  /** Stop listening. */
  public stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /** Process a single assessment event through the pipeline. */
  public processEvent(event: AssessmentEvent): void {
    // 1. Idempotency check
    if (this.repository.hasProcessedEvent(event.id)) {
      return;
    }

    // 2. Normalize event → evidence
    const batch = normalizeEvent(event, this.config);
    if (batch.records.length === 0) {
      this.repository.markEventProcessed(event.id);
      return;
    }

    // 3. Save evidence
    this.repository.saveEvidence(batch.records);

    // 4. Recompute mastery for affected concepts
    const affectedConceptIds = new Set(batch.records.map(r => r.conceptId));
    const now = new Date().toISOString();

    for (const conceptId of affectedConceptIds) {
      const allConceptEvidence = this.repository.getEvidenceForConcept(conceptId);
      const mastery = computeConceptMastery(conceptId, allConceptEvidence, this.config, now);
      this.repository.saveMastery(mastery);
    }

    // 5. Mark event as processed
    this.repository.markEventProcessed(event.id);
  }

  /** Reprocess all stored events (useful for config changes or migration). */
  public recomputeAll(): void {
    const allEvidence = this.repository.getAllEvidence();
    const conceptIds = new Set(allEvidence.map(e => e.conceptId));
    const now = new Date().toISOString();

    for (const conceptId of conceptIds) {
      const conceptEvidence = allEvidence.filter(e => e.conceptId === conceptId);
      const mastery = computeConceptMastery(conceptId, conceptEvidence, this.config, now);
      this.repository.saveMastery(mastery);
    }
  }
}

export const assessmentIngestionService = new AssessmentIngestionService();
