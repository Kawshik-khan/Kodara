/** Kodara Progress Subsystem - Public API */

// Configuration
export { MASTERY_CONFIG, resolveLevel } from './config/masteryConfig';
export type { MasteryConfig, MasteryLevel, MasteryThresholds } from './config/masteryConfig';

// Types
export type { EvidenceRecord, EvidenceBatch } from './types/evidence.types';
export type { ConceptMastery, MasterySnapshot, MasteryExplanation, MasteryDimensions } from './types/mastery.types';
export type { ReviewItem, ReviewQueue } from './types/review.types';
export type { LearningRecommendation, NextBestAction, LearnerProgressSummary } from './types/recommendation.types';

// Engines
export { normalizeEvent } from './engines/EvidenceNormalizer';
export { computeConceptMastery, computeMasterySnapshot, explainMastery } from './engines/MasteryEngine';
export { generateReviewQueue } from './engines/SpacedReviewEngine';
export { generateRecommendations } from './engines/RecommendationEngine';

// Services
export { assessmentIngestionService } from './services/AssessmentIngestionService';
export { masteryService } from './services/MasteryService';
export { reviewService } from './services/ReviewService';
export { recommendationService } from './services/RecommendationService';

// Repository
export { localProgressRepository } from './repositories/ProgressRepository';
export type { ProgressRepository } from './repositories/ProgressRepository';
