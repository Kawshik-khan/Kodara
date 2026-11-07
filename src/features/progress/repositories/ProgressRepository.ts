/** Kodara Progress Subsystem - Progress Repository */

import { EvidenceRecord } from '../types/evidence.types';
import { ConceptMastery } from '../types/mastery.types';
import { ReviewItem } from '../types/review.types';

/**
 * Repository interface for progress data persistence.
 * Decoupled from storage mechanism for testability.
 */
export interface ProgressRepository {
  // Evidence
  saveEvidence(records: EvidenceRecord[]): void;
  getEvidenceForConcept(conceptId: string): EvidenceRecord[];
  getAllEvidence(): EvidenceRecord[];
  
  // Mastery cache
  saveMastery(mastery: ConceptMastery): void;
  getMastery(conceptId: string): ConceptMastery | undefined;
  getAllMasteries(): ConceptMastery[];
  
  // Review items
  saveReviewItems(items: ReviewItem[]): void;
  getReviewItems(): ReviewItem[];
  dismissReviewItem(itemId: string): void;
  
  // Idempotency
  hasProcessedEvent(eventId: string): boolean;
  markEventProcessed(eventId: string): void;
  
  // Utility
  clear(): void;
}

const EVIDENCE_KEY = 'kodara_evidence_v1';
const MASTERY_KEY = 'kodara_mastery_v1';
const REVIEW_KEY = 'kodara_review_v1';
const PROCESSED_EVENTS_KEY = 'kodara_processed_events_v1';

/**
 * LocalStorage-backed implementation with in-memory fallback.
 * Uses same dual-write pattern as existing lesson progress repository.
 */
export class LocalProgressRepository implements ProgressRepository {
  private memEvidence: EvidenceRecord[] = [];
  private memMastery: Map<string, ConceptMastery> = new Map();
  private memReview: ReviewItem[] = [];
  private memProcessed: Set<string> = new Set();

  constructor() {
    this.hydrate();
  }

  private isStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && Boolean(window.localStorage);
    } catch {
      return false;
    }
  }

  private hydrate(): void {
    if (!this.isStorageAvailable()) return;
    try {
      const evidenceRaw = localStorage.getItem(EVIDENCE_KEY);
      if (evidenceRaw) this.memEvidence = JSON.parse(evidenceRaw);

      const masteryRaw = localStorage.getItem(MASTERY_KEY);
      if (masteryRaw) {
        const arr: ConceptMastery[] = JSON.parse(masteryRaw);
        arr.forEach(m => this.memMastery.set(m.conceptId, m));
      }

      const reviewRaw = localStorage.getItem(REVIEW_KEY);
      if (reviewRaw) this.memReview = JSON.parse(reviewRaw);

      const processedRaw = localStorage.getItem(PROCESSED_EVENTS_KEY);
      if (processedRaw) this.memProcessed = new Set(JSON.parse(processedRaw));
    } catch (e) {
      console.warn('Failed to hydrate progress repository', e);
    }
  }

  private persistEvidence(): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.setItem(EVIDENCE_KEY, JSON.stringify(this.memEvidence));
    } catch { /* quota exceeded fallback to memory */ }
  }

  private persistMastery(): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.setItem(MASTERY_KEY, JSON.stringify(Array.from(this.memMastery.values())));
    } catch { /* quota */ }
  }

  private persistReview(): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.setItem(REVIEW_KEY, JSON.stringify(this.memReview));
    } catch { /* quota */ }
  }

  private persistProcessed(): void {
    if (!this.isStorageAvailable()) return;
    try {
      // Keep only last 1000 event IDs to avoid unbounded growth
      const arr = Array.from(this.memProcessed);
      const trimmed = arr.length > 1000 ? arr.slice(arr.length - 1000) : arr;
      localStorage.setItem(PROCESSED_EVENTS_KEY, JSON.stringify(trimmed));
    } catch { /* quota */ }
  }

  // === Evidence ===
  saveEvidence(records: EvidenceRecord[]): void {
    this.memEvidence.push(...records);
    this.persistEvidence();
  }

  getEvidenceForConcept(conceptId: string): EvidenceRecord[] {
    return this.memEvidence.filter(e => e.conceptId === conceptId);
  }

  getAllEvidence(): EvidenceRecord[] {
    return [...this.memEvidence];
  }

  // === Mastery ===
  saveMastery(mastery: ConceptMastery): void {
    this.memMastery.set(mastery.conceptId, mastery);
    this.persistMastery();
  }

  getMastery(conceptId: string): ConceptMastery | undefined {
    return this.memMastery.get(conceptId);
  }

  getAllMasteries(): ConceptMastery[] {
    return Array.from(this.memMastery.values());
  }

  // === Review ===
  saveReviewItems(items: ReviewItem[]): void {
    this.memReview = items;
    this.persistReview();
  }

  getReviewItems(): ReviewItem[] {
    return [...this.memReview];
  }

  dismissReviewItem(itemId: string): void {
    this.memReview = this.memReview.filter(r => r.id !== itemId);
    this.persistReview();
  }

  // === Idempotency ===
  hasProcessedEvent(eventId: string): boolean {
    return this.memProcessed.has(eventId);
  }

  markEventProcessed(eventId: string): void {
    this.memProcessed.add(eventId);
    this.persistProcessed();
  }

  // === Utility ===
  clear(): void {
    this.memEvidence = [];
    this.memMastery.clear();
    this.memReview = [];
    this.memProcessed.clear();
    if (this.isStorageAvailable()) {
      try {
        localStorage.removeItem(EVIDENCE_KEY);
        localStorage.removeItem(MASTERY_KEY);
        localStorage.removeItem(REVIEW_KEY);
        localStorage.removeItem(PROCESSED_EVENTS_KEY);
      } catch { /* */ }
    }
  }
}

export const localProgressRepository = new LocalProgressRepository();
