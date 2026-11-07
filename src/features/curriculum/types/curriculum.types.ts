/**
 * Kodara Curriculum Domain Model
 * Strongly-typed domain architecture for engineering knowledge graphs.
 */

export type PrerequisiteType = "hard" | "soft";

export type PrerequisiteTargetType = "concept" | "lesson" | "module" | "project";

export interface PrerequisiteRef {
  id: string;
  targetType: PrerequisiteTargetType;
  type: PrerequisiteType;
  titleEn?: string;
  titleBn?: string;
  reasonEn?: string;
  reasonBn?: string;
}

export type ConceptDomain =
  | "runtime"
  | "type-system"
  | "compiler"
  | "engineering"
  | "react";

export type ConceptDifficulty = 1 | 2 | 3 | 4 | 5; // 1: foundational, 2: beginner, 3: intermediate, 4: advanced, 5: expert

export type ConceptImportance = "critical" | "high" | "standard";

export interface ConceptMisconception {
  misconceptionEn: string;
  misconceptionBn: string;
  correctionEn: string;
  correctionBn: string;
}

export interface ConceptEngineeringConnection {
  contextEn: string;
  contextBn: string;
  applicationEn: string;
  applicationBn: string;
}

export interface Concept {
  id: string; // e.g. "concept.type-narrowing"
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  domain: ConceptDomain;
  difficulty: ConceptDifficulty;
  importance: ConceptImportance;
  prerequisites: PrerequisiteRef[];
  relatedConcepts: string[];
  introducedInLessonId: string;
  reinforcedInLessonIds: string[];
  masteredByChallengeIds: string[];
  visualizationIds: string[];
  misconceptions?: ConceptMisconception[];
  engineeringConnections?: ConceptEngineeringConnection[];
}

export type LessonDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type CurriculumLessonStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed"
  | "mastered"
  | "review";

export interface CurriculumLessonMetadata {
  id: string; // e.g. "ts.type-narrowing"
  slug: string;
  moduleId: string; // e.g. "ts.mod-03.control-flow-narrowing"
  order: number;
  titleEn: string;
  titleBn: string;
  shortDescriptionEn: string;
  shortDescriptionBn: string;
  longDescriptionEn: string;
  longDescriptionBn: string;
  difficulty: LessonDifficulty;
  estimatedMinutes: number;
  learningObjectivesEn: string[];
  learningObjectivesBn: string[];
  conceptIds: string[];
  prerequisites: PrerequisiteRef[];
  visualizationIds: string[];
  practiceIds: string[];
  challengeIds: string[];
  projectIds: string[];
  nextLessonId?: string;
  contentVersion?: string;
}

export interface CurriculumModule {
  id: string; // e.g. "ts.mod-03.control-flow-narrowing"
  slug: string;
  level: number; // 0 to 12
  order: number;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  learningObjectivesEn: string[];
  learningObjectivesBn: string[];
  lessonIds: string[];
  conceptIds: string[];
  prerequisiteModuleIds: string[];
  estimatedDurationMinutes: number;
  difficulty: LessonDifficulty;
  status: "available" | "in_progress" | "locked" | "completed";
  icon: string;
  visualizationCategories: string[];
  projectIds: string[];
  contentVersion?: string;
}

export interface CurriculumProject {
  id: string; // e.g. "ts.project.state-machine"
  slug: string;
  number: number;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  moduleId: string;
  difficulty: LessonDifficulty;
  estimatedHours: number;
  conceptIds: string[];
  prerequisites: PrerequisiteRef[];
  learningObjectivesEn: string[];
  learningObjectivesBn: string[];
  deliverablesEn: string[];
  deliverablesBn: string[];
}

export interface CurriculumGraph {
  trackId: string;
  trackTitleEn: string;
  trackTitleBn: string;
  curriculumVersion: string;
  modules: CurriculumModule[];
  lessons: CurriculumLessonMetadata[];
  concepts: Concept[];
  projects: CurriculumProject[];
}

export interface PrerequisiteCheckItem {
  id: string;
  targetType: PrerequisiteTargetType;
  type: PrerequisiteType;
  titleEn: string;
  titleBn: string;
  isMet: boolean;
  reasonEn?: string;
  reasonBn?: string;
}

export interface PrerequisiteExplanation {
  lessonId: string;
  isUnlocked: boolean;
  canUnlock: boolean;
  items: PrerequisiteCheckItem[];
  missingHardCount: number;
  missingSoftCount: number;
  explanationEn: string;
  explanationBn: string;
}

export interface UserProgressSummary {
  completedLessonIds: string[];
  inProgressLessonIds?: string[];
  masteredConceptIds?: string[];
  currentLessonId?: string;
}

export interface ModuleProgressSummary {
  moduleId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface ConceptProgressSummary {
  conceptId: string;
  isIntroduced: boolean;
  isMastered: boolean;
  reinforcingLessonCount: number;
  masteredChallengeCount: number;
}

export interface CurriculumValidationReport {
  trackId: string;
  curriculumVersion: string;
  moduleCount: number;
  lessonCount: number;
  conceptCount: number;
  projectCount: number;
  visualizationCount: number;
  brokenPrerequisites: Array<{ sourceId: string; targetId: string; targetType: string }>;
  cycles: string[][];
  orphanLessons: string[];
  orphanConcepts: string[];
  brokenVisualizationReferences: Array<{ lessonId: string; visualizationId: string }>;
  brokenNextLessonReferences: Array<{ lessonId: string; nextLessonId: string }>;
  duplicateIds: string[];
  isValid: boolean;
}
