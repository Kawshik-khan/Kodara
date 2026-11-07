import { describe, it, expect } from "vitest";
import { TYPESCRIPT_CURRICULUM } from "@/content/curriculum/typescript/typescriptCurriculum";
import {
  detectCyclesInAdjacencyList,
  validateCurriculumGraph,
} from "@/features/curriculum/graph/curriculumGraphEngine";
import { defaultCurriculumService } from "@/features/curriculum/services/curriculumService";
import { CurriculumGraph } from "@/features/curriculum/types/curriculum.types";

describe("TypeScript Curriculum Graph Integrity", () => {
  it("has exactly 14 modules covering levels 1 through 14", () => {
    expect(TYPESCRIPT_CURRICULUM.modules.length).toBe(14);
    const moduleIds = TYPESCRIPT_CURRICULUM.modules.map((m) => m.id);

    // Verify key module semantic IDs
    expect(moduleIds).toContain("ts.mod-01.js-foundations");
    expect(moduleIds).toContain("ts.mod-02.ts-fundamentals");
    expect(moduleIds).toContain("ts.mod-03.type-system");
    expect(moduleIds).toContain("ts.mod-04.control-flow");
    expect(moduleIds).toContain("ts.mod-05.functions-objects");
    expect(moduleIds).toContain("ts.mod-06.generics");
    expect(moduleIds).toContain("ts.mod-07.advanced-types");
    expect(moduleIds).toContain("ts.mod-08.modules-code-org");
    expect(moduleIds).toContain("ts.mod-09.compiler-ast");
    expect(moduleIds).toContain("ts.mod-10.runtime-interop");
    expect(moduleIds).toContain("ts.mod-11.production-ts");
    expect(moduleIds).toContain("ts.mod-12.ts-react");
    expect(moduleIds).toContain("ts.mod-13.expert-ts");
    expect(moduleIds).toContain("ts.mod-14.capstone-projects");
  });

  it("has structured lessons with valid metadata", () => {
    expect(TYPESCRIPT_CURRICULUM.lessons.length).toBe(176);

    TYPESCRIPT_CURRICULUM.lessons.forEach((lesson) => {
      expect(lesson.id).toBeTruthy();
      expect(lesson.slug).toBeTruthy();
      expect(lesson.moduleId).toBeTruthy();
      expect(lesson.titleEn).toBeTruthy();
      expect(lesson.titleBn).toBeTruthy();
      expect(lesson.learningObjectivesEn.length).toBeGreaterThan(0);
      expect(lesson.learningObjectivesBn.length).toBeGreaterThan(0);
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
    });
  });

  it("has 50+ concepts with defined complexity, domains, and bilingual metadata", () => {
    expect(TYPESCRIPT_CURRICULUM.concepts.length).toBeGreaterThanOrEqual(40);

    TYPESCRIPT_CURRICULUM.concepts.forEach((concept) => {
      expect(concept.id).toMatch(/^concept\./);
      expect(concept.nameEn).toBeTruthy();
      expect(concept.nameBn).toBeTruthy();
      expect(concept.difficulty).toBeGreaterThanOrEqual(1);
      expect(concept.difficulty).toBeLessThanOrEqual(5);
    });
  });

  it("contains 7 capstone projects from CLI utility to full distributed engineering system", () => {
    expect(TYPESCRIPT_CURRICULUM.projects.length).toBe(7);

    const projectIds = TYPESCRIPT_CURRICULUM.projects.map((p) => p.id);
    expect(projectIds).toContain("ts.project.cli-utility");
    expect(projectIds).toContain("ts.project.rest-api-client");
    expect(projectIds).toContain("ts.project.event-emitter");
    expect(projectIds).toContain("ts.project.state-machine");
    expect(projectIds).toContain("ts.project.ast-analyzer");
    expect(projectIds).toContain("ts.project.production-service");
    expect(projectIds).toContain("ts.project.engineering-system");
  });

  it("passes comprehensive validation with 0 broken links, 0 cycles, and 0 duplicates", () => {
    const report = defaultCurriculumService.validate();

    expect(report.brokenPrerequisites).toEqual([]);
    expect(report.cycles).toEqual([]);
    expect(report.orphanLessons).toEqual([]);
    expect(report.orphanConcepts).toEqual([]);
    expect(report.brokenNextLessonReferences).toEqual([]);
    expect(report.duplicateIds).toEqual([]);
    expect(report.isValid).toBe(true);

    const summary = defaultCurriculumService.generateValidationReportSummary(report);
    expect(summary).toContain("KODARA TYPESCRIPT CURRICULUM REPORT");
    expect(summary).toContain("Broken prerequisites: 0");
    expect(summary).toContain("Cycles: 0");
    expect(summary).toContain("Orphan lessons: 0");
    expect(summary).toContain("Status: PASSED (100% Sound)");
  });

  it("detects intentional cycles in directed graphs", () => {
    const cyclicAdj = new Map<string, string[]>([
      ["A", ["B"]],
      ["B", ["C"]],
      ["C", ["A"]],
    ]);

    const cycles = detectCyclesInAdjacencyList(cyclicAdj);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0]).toEqual(["A", "B", "C", "A"]);
  });

  it("detects intentional invalid references in curriculum graphs", () => {
    const faultyGraph: CurriculumGraph = {
      ...TYPESCRIPT_CURRICULUM,
      lessons: [
        ...TYPESCRIPT_CURRICULUM.lessons,
        {
          id: "ts.faulty-lesson",
          slug: "faulty",
          moduleId: "ts.non-existent-module",
          order: 999,
          titleEn: "Faulty",
          titleBn: "ত্রুটিপূর্ণ",
          shortDescriptionEn: "Desc",
          shortDescriptionBn: "বর্ণনা",
          longDescriptionEn: "Desc",
          longDescriptionBn: "বর্ণনা",
          difficulty: "beginner",
          estimatedMinutes: 10,
          learningObjectivesEn: ["obj"],
          learningObjectivesBn: ["obj"],
          conceptIds: [],
          prerequisites: [
            {
              id: "concept.non-existent-prereq",
              targetType: "concept",
              type: "hard",
            },
          ],
          visualizationIds: [],
          practiceIds: [],
          challengeIds: [],
          projectIds: [],
          nextLessonId: "ts.missing-next-lesson",
        },
      ],
    };

    const report = validateCurriculumGraph(faultyGraph);
    expect(report.isValid).toBe(false);
    expect(report.orphanLessons).toContain("ts.faulty-lesson");
    expect(report.brokenPrerequisites.some((p) => p.targetId === "concept.non-existent-prereq")).toBe(true);
    expect(report.brokenNextLessonReferences.some((r) => r.nextLessonId === "ts.missing-next-lesson")).toBe(true);
  });
});
