/**
 * Kodara Lesson Domain Model
 * Strongly-typed domain architecture for content-driven interactive lessons.
 */

export type TrackId =
  | "typescript"
  | "python"
  | "react"
  | "system-design"
  | "ai-engineering";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type LessonStatus = "available" | "completed" | "in_progress" | "locked";

export interface ConceptReference {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  trackId: TrackId;
  difficulty: DifficultyLevel;
  slug?: string;
}

export interface PrerequisiteReference {
  id: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  completed?: boolean;
}

export interface RelatedLessonReference {
  id: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  trackId: TrackId;
  estimatedMinutes: number;
}

/* ========================================================================== */
/* Content Block Types (Discriminated Union)                                   */
/* ========================================================================== */

export interface BaseBlock {
  id: string;
}

export interface ExplanationBlock extends BaseBlock {
  type: "explanation";
  titleEn?: string;
  titleBn?: string;
  contentEn: string;
  contentBn: string;
  keyIdeaEn?: string;
  keyIdeaBn?: string;
}

export interface ConceptBlock extends BaseBlock {
  type: "concept";
  concept: ConceptReference;
}

export interface CodeBlockData extends BaseBlock {
  type: "code";
  title?: string;
  code: string;
  language: "typescript" | "javascript" | "python" | "json" | "bash";
  highlightedLines?: number[];
  lineExplanationsEn?: Record<number, string>;
  lineExplanationsBn?: Record<number, string>;
  annotations?: Record<number, string>;
}

export interface CodeWalkthroughStep {
  stepNumber: number;
  activeLine: number;
  codeSnippet: string;
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  environmentState: {
    title: string;
    bindings: { identifier: string; value: string; type?: string; isReassigned?: boolean }[];
    noteEn?: string;
    noteBn?: string;
  };
}

export interface CodeWalkthroughBlock extends BaseBlock {
  type: "code-walkthrough";
  titleEn: string;
  titleBn: string;
  initialCode: string;
  language: "typescript" | "javascript" | "python";
  steps: CodeWalkthroughStep[];
}

export interface VisualizationBlock extends BaseBlock {
  type: "visualization";
  visualizationId: string;
  titleEn: string;
  titleBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
}

export interface ComparisonRow {
  featureEn: string;
  featureBn: string;
  values: string[];
}

export interface ComparisonBlock extends BaseBlock {
  type: "comparison";
  titleEn: string;
  titleBn: string;
  headers: string[];
  rows: ComparisonRow[];
  footnoteEn?: string;
  footnoteBn?: string;
}

export interface StepItem {
  stepNumber: number;
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  code?: string;
}

export interface StepByStepBlock extends BaseBlock {
  type: "step-by-step";
  titleEn: string;
  titleBn: string;
  steps: StepItem[];
}

export interface UnderTheHoodBlock extends BaseBlock {
  type: "under-the-hood";
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  pipelineSteps: { titleEn: string; titleBn: string; descEn: string; descBn: string }[];
  technicalNoteEn: string;
  technicalNoteBn: string;
}

export interface MistakeBlock extends BaseBlock {
  type: "mistake";
  wrongMentalModelEn: string;
  wrongMentalModelBn: string;
  correctMentalModelEn: string;
  correctMentalModelBn: string;
  explanationEn: string;
  explanationBn: string;
}

export interface EngineeringNoteBlock extends BaseBlock {
  type: "engineering-note";
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  recommendationEn?: string;
  recommendationBn?: string;
}

export interface PracticeOption {
  id: string;
  textEn: string;
  textBn: string;
  isCorrect: boolean;
  explanationEn: string;
  explanationBn: string;
}

export interface PracticeBlock extends BaseBlock {
  type: "practice";
  questionEn: string;
  questionBn: string;
  practiceType: "multiple-choice" | "prediction" | "code-reasoning";
  codeSnippet?: string;
  options: PracticeOption[];
  hintEn?: string;
  hintBn?: string;
}

export interface SummaryBlock extends BaseBlock {
  type: "summary";
  titleEn: string;
  titleBn: string;
  takeawaysEn: string[];
  takeawaysBn: string[];
  checklistEn: string[];
  checklistBn: string[];
}

/** A recorded line-by-line execution trace (ADR-008). */
export interface CodeTraceBlock extends BaseBlock {
  type: "code-trace";
  traceId: string;
}

/** A parameterized, controllable chart (ADR-008). */
export interface ChartBlock extends BaseBlock {
  type: "chart";
  chartId: string;
}

export interface FaqItem {
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
  /** Where the book answers it, e.g. "pp. 62–64" */
  ref?: string;
}

/** Chapter questions and answers. */
export interface FaqBlock extends BaseBlock {
  type: "faq";
  titleEn: string;
  titleBn: string;
  items: FaqItem[];
}

export type LessonBlock =
  | CodeTraceBlock
  | ChartBlock
  | FaqBlock
  | ExplanationBlock
  | ConceptBlock
  | CodeBlockData
  | CodeWalkthroughBlock
  | VisualizationBlock
  | ComparisonBlock
  | StepByStepBlock
  | UnderTheHoodBlock
  | MistakeBlock
  | EngineeringNoteBlock
  | PracticeBlock
  | SummaryBlock;

/* ========================================================================== */
/* Lesson Section Schema                                                       */
/* ========================================================================== */

export interface LessonSection {
  id: string;
  order: number;
  titleEn: string;
  titleBn: string;
  blocks: LessonBlock[];
}

/* ========================================================================== */
/* Complete Lesson Interface                                                   */
/* ========================================================================== */

export interface Lesson {
  id: string;
  slug: string;
  trackId: TrackId;
  moduleId: string;
  moduleTitleEn: string;
  moduleTitleBn: string;

  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;

  difficulty: DifficultyLevel;
  estimatedMinutes: number;

  prerequisites: PrerequisiteReference[];
  learningObjectivesEn: string[];
  learningObjectivesBn: string[];
  concepts: ConceptReference[];

  sections: LessonSection[];

  relatedLessons: RelatedLessonReference[];
  challengeIds?: string[];
  status?: LessonStatus;
}

/* ========================================================================== */
/* Learner Progress Schema                                                     */
/* ========================================================================== */

export interface LessonProgress {
  lessonId: string;
  completedSectionIds: string[];
  currentSectionId: string;
  progressPercent: number;
  isCompleted: boolean;
  isBookmarked: boolean;
  lastVisitedAt: string;
}
