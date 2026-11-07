import {
  Concept,
  ConceptProgressSummary,
  CurriculumGraph,
  CurriculumLessonMetadata,
  CurriculumModule,
  CurriculumValidationReport,
  ModuleProgressSummary,
  PrerequisiteExplanation,
  PrerequisiteRef,
  UserProgressSummary,
} from "../types/curriculum.types";
import { TYPESCRIPT_CURRICULUM } from "@/content/curriculum/typescript/typescriptCurriculum";
import {
  explainLessonPrerequisites,
  getAvailableLessons as engineGetAvailableLessons,
  getRecommendedLesson as engineGetRecommendedLesson,
  validateCurriculumGraph,
} from "../graph/curriculumGraphEngine";

export const LEGACY_CURRICULUM_ALIASES: Record<string, string> = {
  variables: "ts.01.variables-and-bindings",
  "ts-variables": "ts.01.variables-and-bindings",
  narrowing: "ts.04.why-narrowing-exists",
  "type-narrowing": "ts.04.why-narrowing-exists",
  "ts.type-narrowing": "ts.04.why-narrowing-exists",
  "ts.0-1.how-js-ts-differ": "ts.01.how-js-ts-differ",
  "ts.0-2.variables-and-bindings": "ts.01.variables-and-bindings",
  "ts.0-3.objects-and-references": "ts.01.objects-and-references",
  "ts.0-4.functions-and-execution": "ts.01.functions-and-execution",
  "ts.0-5.scope-and-closures": "ts.01.closures-and-scope",
  "ts.1-1.what-ts-does": "ts.02.what-ts-does",
  "ts.1-2.primitive-types": "ts.02.primitive-types",
  "ts.1-3.type-annotations": "ts.02.type-annotations-inference",
  "ts.1-4.type-inference": "ts.02.type-annotations-inference",
  "ts.1-5.arrays-and-tuples": "ts.02.arrays-and-tuples",
  "ts.1-7.any-unknown-never-void": "ts.02.any-vs-unknown",
  "ts.2-1.what-is-a-type": "ts.03.what-is-a-type",
  "ts.2-2.structural-typing": "ts.03.structural-typing",
  "ts.2-3.type-aliases": "ts.03.type-aliases-interfaces",
  "ts.2-4.interfaces": "ts.03.type-aliases-interfaces",
  "ts.2-5.union-types": "ts.03.union-types",
  "ts.2-6.intersection-types": "ts.03.intersection-types",
  "ts.2-7.literal-types": "ts.03.literal-types",
  "ts.3-1.why-narrowing-exists": "ts.04.why-narrowing-exists",
  "ts.3-2.typeof-narrowing": "ts.04.typeof-narrowing",
  "ts.3-3.equality-narrowing": "ts.04.truthiness-equality-narrowing",
  "ts.3-6.user-defined-type-guards": "ts.04.user-defined-type-guards",
  "ts.3-7.assertion-functions": "ts.04.assertion-functions",
  "ts.3-8.exhaustiveness-checking": "ts.04.never-and-impossible-states",
  "ts.4-1.function-types": "ts.05.function-types",
  "ts.4-4.function-overloads": "ts.05.function-overloads",
  "ts.4-7.object-types": "ts.05.object-types-interfaces",
  "ts.4-8.classes": "ts.05.classes-in-typescript",
  "ts.4-9.composition-vs-inheritance": "ts.05.composition-vs-inheritance",
  "ts.5-1.why-generics-exist": "ts.06.why-generics-exist",
  "ts.5-2.generic-functions": "ts.06.generic-functions",
  "ts.5-3.generic-interfaces": "ts.06.generic-interfaces",
  "ts.5-5.generic-constraints": "ts.06.generic-constraints",
  "ts.5-6.keyof": "ts.06.keyof-operator",
  "ts.5-7.indexed-access-types": "ts.03.indexed-access-types",
  "ts.6-1.conditional-types": "ts.07.conditional-types",
  "ts.6-2.distributive-conditional-types": "ts.07.distributive-conditional-types",
  "ts.6-3.infer": "ts.07.infer-keyword",
  "ts.6-4.mapped-types": "ts.07.mapped-types",
  "ts.6-5.key-remapping": "ts.07.key-remapping",
  "ts.6-6.template-literal-types": "ts.07.template-literal-types",
  "ts.6-8.utility-types": "ts.07.custom-utility-types",
  "ts.7-1.types-as-transformations": "ts.07.advanced-type-composition",
  "ts.8-1.es-modules": "ts.08.es-modules",
  "ts.8-2.import-export": "ts.08.import-export",
  "ts.8-6.type-only-imports": "ts.08.type-only-imports",
  "ts.8-7.declaration-files": "ts.08.declaration-files",
  "ts.9-1.compiler-pipeline": "ts.09.what-compiler-does",
  "ts.9-2.ast": "ts.09.ast-introduction",
  "ts.9-8.module-resolution": "ts.08.module-resolution",
  "ts.10-1.type-erasure": "ts.10.type-erasure",
  "ts.10-4.runtime-validation": "ts.10.runtime-validation",
  "ts.11-1.strict-mode": "ts.11.strict-mode",
  "ts.11-2.error-modeling": "ts.11.error-handling-patterns",
  "ts.12-3.state-machines": "ts.14.state-machine-walkthrough",
  "ts.13-1.typed-components": "ts.12.typing-components",
  "ts.14-2.variance": "ts.13.covariance-contravariance",
};

export class CurriculumService {
  private curriculum: CurriculumGraph;
  private moduleMap: Map<string, CurriculumModule>;
  private lessonMap: Map<string, CurriculumLessonMetadata>;
  private lessonSlugMap: Map<string, CurriculumLessonMetadata>;
  private conceptMap: Map<string, Concept>;

  constructor(curriculum: CurriculumGraph = TYPESCRIPT_CURRICULUM) {
    this.curriculum = curriculum;
    this.moduleMap = new Map(curriculum.modules.map((m) => [m.id, m]));
    this.lessonMap = new Map(curriculum.lessons.map((l) => [l.id, l]));
    this.lessonSlugMap = new Map(curriculum.lessons.map((l) => [l.slug, l]));
    this.conceptMap = new Map(curriculum.concepts.map((c) => [c.id, c]));
  }

  public getCurriculum(): CurriculumGraph {
    return this.curriculum;
  }

  public getModule(idOrSlug: string): CurriculumModule | undefined {
    const direct = this.moduleMap.get(idOrSlug);
    if (direct) return direct;
    const aliasedId = LEGACY_CURRICULUM_ALIASES[idOrSlug];
    if (aliasedId) return this.moduleMap.get(aliasedId);
    return undefined;
  }

  public getLesson(idOrSlug: string): CurriculumLessonMetadata | undefined {
    const direct = this.lessonMap.get(idOrSlug) || this.lessonSlugMap.get(idOrSlug);
    if (direct) return direct;

    const aliasedId = LEGACY_CURRICULUM_ALIASES[idOrSlug];
    if (aliasedId) {
      return this.lessonMap.get(aliasedId) || this.lessonSlugMap.get(aliasedId);
    }

    return undefined;
  }

  public getConcept(id: string): Concept | undefined {
    return this.conceptMap.get(id);
  }

  public getPrerequisites(id: string): PrerequisiteRef[] {
    const lesson = this.getLesson(id);
    if (lesson) return lesson.prerequisites;

    const concept = this.getConcept(id);
    if (concept) return concept.prerequisites;

    const mod = this.getModule(id);
    if (mod) {
      return mod.prerequisiteModuleIds.map((pid) => ({
        id: pid,
        targetType: "module",
        type: "hard",
      }));
    }

    return [];
  }

  /**
   * Find which concepts or lessons depend on the given ID.
   */
  public getDependents(id: string): string[] {
    const dependents: string[] = [];

    for (const lesson of this.curriculum.lessons) {
      if (lesson.prerequisites.some((p) => p.id === id)) {
        dependents.push(lesson.id);
      }
    }

    for (const concept of this.curriculum.concepts) {
      if (concept.prerequisites.some((p) => p.id === id)) {
        dependents.push(concept.id);
      }
    }

    for (const mod of this.curriculum.modules) {
      if (mod.prerequisiteModuleIds.includes(id)) {
        dependents.push(mod.id);
      }
    }

    return dependents;
  }

  public getNextLesson(idOrSlug: string): CurriculumLessonMetadata | undefined {
    const current = this.getLesson(idOrSlug);
    if (!current) return undefined;

    if (current.nextLessonId) {
      return this.lessonMap.get(current.nextLessonId);
    }

    // Fallback: next lesson in module, or first lesson in next module
    const currentModule = this.moduleMap.get(current.moduleId);
    if (!currentModule) return undefined;

    const lessonIdx = currentModule.lessonIds.indexOf(current.id);
    if (lessonIdx !== -1 && lessonIdx < currentModule.lessonIds.length - 1) {
      const nextId = currentModule.lessonIds[lessonIdx + 1];
      return this.lessonMap.get(nextId);
    }

    // Next module
    const currentModOrder = currentModule.order;
    const nextMod = this.curriculum.modules
      .filter((m) => m.order > currentModOrder)
      .sort((a, b) => a.order - b.order)[0];

    if (nextMod && nextMod.lessonIds.length > 0) {
      return this.lessonMap.get(nextMod.lessonIds[0]);
    }

    return undefined;
  }

  public getPreviousLesson(idOrSlug: string): CurriculumLessonMetadata | undefined {
    const current = this.getLesson(idOrSlug);
    if (!current) return undefined;

    // Check if any lesson points to current as nextLessonId
    const pointingPrev = this.curriculum.lessons.find(
      (l) => l.nextLessonId === current.id
    );
    if (pointingPrev) return pointingPrev;

    // Fallback: previous lesson in same module
    const currentModule = this.moduleMap.get(current.moduleId);
    if (!currentModule) return undefined;

    const lessonIdx = currentModule.lessonIds.indexOf(current.id);
    if (lessonIdx > 0) {
      const prevId = currentModule.lessonIds[lessonIdx - 1];
      return this.lessonMap.get(prevId);
    }

    // Previous module's last lesson
    const currentModOrder = currentModule.order;
    const prevMod = this.curriculum.modules
      .filter((m) => m.order < currentModOrder)
      .sort((a, b) => b.order - a.order)[0];

    if (prevMod && prevMod.lessonIds.length > 0) {
      const lastId = prevMod.lessonIds[prevMod.lessonIds.length - 1];
      return this.lessonMap.get(lastId);
    }

    return undefined;
  }

  public getAvailableLessons(
    progress: UserProgressSummary
  ): CurriculumLessonMetadata[] {
    return engineGetAvailableLessons(
      this.curriculum,
      progress.completedLessonIds,
      progress.masteredConceptIds
    );
  }

  public getRecommendedLesson(
    progress: UserProgressSummary
  ): CurriculumLessonMetadata | undefined {
    return engineGetRecommendedLesson(
      this.curriculum,
      progress.completedLessonIds,
      progress.masteredConceptIds
    );
  }

  public explainPrerequisites(
    lessonIdOrSlug: string,
    progress: UserProgressSummary,
    locale: "en" | "bn" = "en"
  ): PrerequisiteExplanation {
    const lesson = this.getLesson(lessonIdOrSlug);
    const id = lesson ? lesson.id : lessonIdOrSlug;
    return explainLessonPrerequisites(
      id,
      this.curriculum,
      progress.completedLessonIds,
      progress.masteredConceptIds,
      locale
    );
  }

  public getModuleProgress(
    moduleId: string,
    progress: UserProgressSummary
  ): ModuleProgressSummary {
    const mod = this.getModule(moduleId);
    if (!mod) {
      return {
        moduleId,
        totalLessons: 0,
        completedLessons: 0,
        progressPercent: 0,
        isCompleted: false,
        isLocked: true,
      };
    }

    const completedSet = new Set(progress.completedLessonIds);
    const completedCount = mod.lessonIds.filter((lid) =>
      completedSet.has(lid)
    ).length;

    const total = mod.lessonIds.length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const isCompleted = completedCount === total && total > 0;

    // Locked if any prerequisite module is not completed
    const isLocked = mod.prerequisiteModuleIds.some((reqModId) => {
      const reqMod = this.moduleMap.get(reqModId);
      if (!reqMod) return false;
      return !reqMod.lessonIds.every((lid) => completedSet.has(lid));
    });

    return {
      moduleId,
      totalLessons: total,
      completedLessons: completedCount,
      progressPercent: percent,
      isCompleted,
      isLocked,
    };
  }

  public getConceptProgress(
    conceptId: string,
    progress: UserProgressSummary
  ): ConceptProgressSummary {
    const concept = this.conceptMap.get(conceptId);
    if (!concept) {
      return {
        conceptId,
        isIntroduced: false,
        isMastered: false,
        reinforcingLessonCount: 0,
        masteredChallengeCount: 0,
      };
    }

    const completedSet = new Set(progress.completedLessonIds);
    const isIntroduced = completedSet.has(concept.introducedInLessonId);

    const masteredSet = new Set(progress.masteredConceptIds || []);
    const isMastered = masteredSet.has(conceptId);

    return {
      conceptId,
      isIntroduced,
      isMastered,
      reinforcingLessonCount: concept.reinforcedInLessonIds.length,
      masteredChallengeCount: concept.masteredByChallengeIds.length,
    };
  }

  public validate(): CurriculumValidationReport {
    return validateCurriculumGraph(this.curriculum);
  }

  public generateValidationReportSummary(
    report: CurriculumValidationReport = this.validate()
  ): string {
    const lines = [
      "============================================================",
      "KODARA TYPESCRIPT CURRICULUM REPORT",
      "============================================================",
      `Track: ${report.trackId} (v${report.curriculumVersion})`,
      `Modules: ${report.moduleCount}`,
      `Lessons: ${report.lessonCount}`,
      `Concepts: ${report.conceptCount}`,
      `Projects: ${report.projectCount}`,
      `Visualizations: ${report.visualizationCount}`,
      "",
      `Broken prerequisites: ${report.brokenPrerequisites.length}`,
      `Cycles: ${report.cycles.length}`,
      `Orphan lessons: ${report.orphanLessons.length}`,
      `Orphan concepts: ${report.orphanConcepts.length}`,
      `Broken visualization references: ${report.brokenVisualizationReferences.length}`,
      `Broken next-lesson references: ${report.brokenNextLessonReferences.length}`,
      `Duplicate IDs: ${report.duplicateIds.length}`,
      "",
      `Status: ${report.isValid ? "PASSED (100% Sound)" : "FAILED (Integrity Violations Found)"}`,
      "============================================================",
    ];

    if (!report.isValid) {
      if (report.brokenPrerequisites.length > 0) {
        lines.push("Broken Prerequisites:");
        report.brokenPrerequisites.forEach((p) =>
          lines.push(`  - [${p.sourceId}] -> missing ${p.targetType} [${p.targetId}]`)
        );
      }
      if (report.cycles.length > 0) {
        lines.push("Cycles Detected:");
        report.cycles.forEach((c) => lines.push(`  - Cycle: ${c.join(" -> ")}`));
      }
      if (report.orphanLessons.length > 0) {
        lines.push(`Orphan Lessons: ${report.orphanLessons.join(", ")}`);
      }
      if (report.orphanConcepts.length > 0) {
        lines.push(`Orphan Concepts: ${report.orphanConcepts.join(", ")}`);
      }
      if (report.brokenNextLessonReferences.length > 0) {
        lines.push("Broken NextLesson References:");
        report.brokenNextLessonReferences.forEach((r) =>
          lines.push(`  - [${r.lessonId}] -> missing next [${r.nextLessonId}]`)
        );
      }
      if (report.duplicateIds.length > 0) {
        lines.push(`Duplicate IDs: ${report.duplicateIds.join(", ")}`);
      }
    }

    return lines.join("\n");
  }
}

export const defaultCurriculumService = new CurriculumService();
