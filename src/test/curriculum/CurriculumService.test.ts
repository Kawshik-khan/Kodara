import { describe, it, expect } from "vitest";
import { defaultCurriculumService } from "@/features/curriculum/services/curriculumService";
import { getLesson as getRegistryLesson } from "@/content/curriculum/curriculumRegistry";

describe("CurriculumService Query & Recommendation Engine", () => {
  it("retrieves modules by ID", () => {
    const mod = defaultCurriculumService.getModule("ts.mod-04.control-flow");
    expect(mod).toBeDefined();
    expect(mod?.titleEn).toContain("Control Flow");
    expect(mod?.level).toBe(4);
    expect(mod?.lessonIds).toContain("ts.04.why-narrowing-exists");
  });

  it("retrieves lessons by stable semantic ID or slug", () => {
    const byId = defaultCurriculumService.getLesson("ts.04.why-narrowing-exists");
    expect(byId).toBeDefined();
    expect(byId?.titleEn).toContain("Why Narrowing Exists");

    const bySlug = defaultCurriculumService.getLesson("narrowing");
    expect(bySlug).toBeDefined();
    expect(bySlug?.id).toBe("ts.04.why-narrowing-exists");

    const variablesLesson = defaultCurriculumService.getLesson("ts.01.variables-and-bindings");
    expect(variablesLesson).toBeDefined();
    expect(variablesLesson?.slug).toBe("variables-and-bindings");
  });

  it("retrieves concepts and their relations", () => {
    const concept = defaultCurriculumService.getConcept("concept.type-narrowing");
    expect(concept).toBeDefined();
    expect(concept?.nameEn).toBe("Type Narrowing");
    expect(concept?.domain).toBe("type-system");
    expect(concept?.difficulty).toBe(3);
    expect(concept?.prerequisites.some((p) => p.id === "concept.union-types")).toBe(true);
  });

  it("retrieves prerequisites and dependents accurately", () => {
    const prereqs = defaultCurriculumService.getPrerequisites("ts.04.why-narrowing-exists");
    expect(prereqs.length).toBeGreaterThan(0);
    expect(prereqs.some((p) => p.id === "concept.union-types")).toBe(true);

    const dependents = defaultCurriculumService.getDependents("concept.union-types");
    expect(dependents.length).toBeGreaterThan(0);
    expect(dependents).toContain("ts.04.why-narrowing-exists");
  });

  it("navigates forward and backward sequentially across lessons", () => {
    const nextOfFirst = defaultCurriculumService.getNextLesson("ts.01.how-js-ts-differ");
    expect(nextOfFirst).toBeDefined();
    expect(nextOfFirst?.id).toBe("ts.01.variables-and-bindings");

    const prevOfSecond = defaultCurriculumService.getPreviousLesson("ts.01.variables-and-bindings");
    expect(prevOfSecond).toBeDefined();
    expect(prevOfSecond?.id).toBe("ts.01.how-js-ts-differ");
  });

  it("calculates available lessons based on completed hard prerequisites", () => {
    // Unstarted learner
    const unstartedAvailable = defaultCurriculumService.getAvailableLessons({
      completedLessonIds: [],
    });
    // Lesson 01.1 has no prerequisites, so it must be available
    expect(unstartedAvailable.some((l) => l.id === "ts.01.how-js-ts-differ")).toBe(true);
    // Lesson 01.2 requires Lesson 01.1, so it must NOT be available yet
    expect(unstartedAvailable.some((l) => l.id === "ts.01.variables-and-bindings")).toBe(false);

    // After completing Lesson 01.1
    const step1Available = defaultCurriculumService.getAvailableLessons({
      completedLessonIds: ["ts.01.how-js-ts-differ"],
    });
    expect(step1Available.some((l) => l.id === "ts.01.variables-and-bindings")).toBe(true);
  });

  it("deterministically recommends the next available uncompleted lesson", () => {
    // Unstarted learner -> recommends 01.1
    const rec0 = defaultCurriculumService.getRecommendedLesson({
      completedLessonIds: [],
    });
    expect(rec0).toBeDefined();
    expect(rec0?.id).toBe("ts.01.how-js-ts-differ");

    // After completing 01.1 -> recommends 01.2
    const rec1 = defaultCurriculumService.getRecommendedLesson({
      completedLessonIds: ["ts.01.how-js-ts-differ"],
    });
    expect(rec1).toBeDefined();
    expect(rec1?.id).toBe("ts.01.variables-and-bindings");
  });

  it("explains why a lesson is locked with an itemized checklist in English and Bangla", () => {
    // Lesson 04.1 requires Lesson 03.union-types and concept.union-types
    const explanation = defaultCurriculumService.explainPrerequisites(
      "ts.04.why-narrowing-exists",
      { completedLessonIds: [] },
      "en"
    );

    expect(explanation.canUnlock).toBe(false);
    expect(explanation.isUnlocked).toBe(false);
    expect(explanation.missingHardCount).toBeGreaterThan(0);
    expect(explanation.explanationEn).toContain("This lesson requires:");
    expect(explanation.explanationEn).toContain("○");

    const explanationBn = defaultCurriculumService.explainPrerequisites(
      "ts.04.why-narrowing-exists",
      { completedLessonIds: [] },
      "bn"
    );
    expect(explanationBn.explanationBn).toContain("এই লেসনটির জন্য আবশ্যক:");

    // Unlock once prerequisites are completed
    const unlockedExplanation = defaultCurriculumService.explainPrerequisites(
      "ts.04.why-narrowing-exists",
      {
        completedLessonIds: ["ts.03.union-types"],
        masteredConceptIds: ["concept.union-types"],
      }
    );
    expect(unlockedExplanation.canUnlock).toBe(true);
    expect(unlockedExplanation.isUnlocked).toBe(true);
    expect(unlockedExplanation.missingHardCount).toBe(0);
  });

  it("calculates module progress and lock status", () => {
    const mod0 = defaultCurriculumService.getModuleProgress("ts.mod-01.js-foundations", {
      completedLessonIds: ["ts.01.how-js-ts-differ", "ts.01.variables-and-bindings"],
    });

    expect(mod0.totalLessons).toBe(8);
    expect(mod0.completedLessons).toBe(2);
    expect(mod0.progressPercent).toBe(25);
    expect(mod0.isCompleted).toBe(false);
    expect(mod0.isLocked).toBe(false);
  });

  it("tracks concept introduction and mastery", () => {
    const progressBefore = defaultCurriculumService.getConceptProgress("concept.variable-binding", {
      completedLessonIds: [],
    });
    expect(progressBefore.isIntroduced).toBe(false);
    expect(progressBefore.isMastered).toBe(false);

    const progressAfter = defaultCurriculumService.getConceptProgress("concept.variable-binding", {
      completedLessonIds: ["ts.0-2.variables-and-bindings"],
      masteredConceptIds: ["concept.variable-binding"],
    });
    expect(progressAfter.isIntroduced).toBe(true);
    expect(progressAfter.isMastered).toBe(true);
  });

  it("ensures gold standard reference lesson is retrievable via curriculumRegistry", () => {
    const lesson = getRegistryLesson("typescript", "narrowing");
    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe("ts.type-narrowing");
    expect(lesson?.titleEn).toContain("Type Narrowing");
    expect(lesson?.sections.length).toBe(10);
  });
});
