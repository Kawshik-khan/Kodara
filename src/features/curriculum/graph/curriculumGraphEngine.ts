import {
  CurriculumGraph,
  CurriculumLessonMetadata,
  CurriculumValidationReport,
  PrerequisiteCheckItem,
  PrerequisiteExplanation,
  PrerequisiteRef,
} from "../types/curriculum.types";

/**
 * Cycle Detection using DFS for directed graphs.
 * Returns array of detected cycles (each cycle is an array of IDs forming the closed loop).
 */
export function detectCyclesInAdjacencyList(
  adj: Map<string, string[]>
): string[][] {
  const visited = new Set<string>();
  const recStack = new Set<string>();
  const parentMap = new Map<string, string>();
  const cycles: string[][] = [];

  function dfs(node: string) {
    visited.add(node);
    recStack.add(node);

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        parentMap.set(neighbor, node);
        dfs(neighbor);
      } else if (recStack.has(neighbor)) {
        // Cycle detected: backtrack path from node to neighbor
        const cycle = [neighbor];
        let curr = node;
        while (curr !== neighbor && curr) {
          cycle.unshift(curr);
          curr = parentMap.get(curr) || "";
        }
        cycle.unshift(neighbor);
        cycles.push(cycle);
      }
    }

    recStack.delete(node);
  }

  for (const node of adj.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return cycles;
}

/**
 * Detect hard prerequisite cycles across all entity levels in the curriculum.
 */
export function detectCurriculumCycles(graph: CurriculumGraph): string[][] {
  const allCycles: string[][] = [];

  // 1. Concept DAG (hard prerequisites)
  const conceptAdj = new Map<string, string[]>();
  for (const concept of graph.concepts) {
    conceptAdj.set(
      concept.id,
      concept.prerequisites
        .filter((p) => p.type === "hard" && p.targetType === "concept")
        .map((p) => p.id)
    );
  }
  allCycles.push(...detectCyclesInAdjacencyList(conceptAdj));

  // 2. Lesson DAG (hard prerequisites)
  const lessonAdj = new Map<string, string[]>();
  for (const lesson of graph.lessons) {
    lessonAdj.set(
      lesson.id,
      lesson.prerequisites
        .filter((p) => p.type === "hard" && p.targetType === "lesson")
        .map((p) => p.id)
    );
  }
  allCycles.push(...detectCyclesInAdjacencyList(lessonAdj));

  // 3. Module DAG
  const moduleAdj = new Map<string, string[]>();
  for (const mod of graph.modules) {
    moduleAdj.set(mod.id, [...mod.prerequisiteModuleIds]);
  }
  allCycles.push(...detectCyclesInAdjacencyList(moduleAdj));

  return allCycles;
}

/**
 * Validate the entire curriculum graph for integrity, missing links, cycles, and orphans.
 */
export function validateCurriculumGraph(
  graph: CurriculumGraph,
  validVisualizationIds?: Set<string>
): CurriculumValidationReport {
  const moduleMap = new Map(graph.modules.map((m) => [m.id, m]));
  const lessonMap = new Map(graph.lessons.map((l) => [l.id, l]));
  const conceptMap = new Map(graph.concepts.map((c) => [c.id, c]));
  const projectMap = new Map(graph.projects.map((p) => [p.id, p]));

  const duplicateIds: string[] = [];
  const seenIds = new Set<string>();

  const checkDuplicate = (id: string) => {
    if (seenIds.has(id)) {
      duplicateIds.push(id);
    }
    seenIds.add(id);
  };

  graph.modules.forEach((m) => checkDuplicate(m.id));
  graph.lessons.forEach((l) => checkDuplicate(l.id));
  graph.concepts.forEach((c) => checkDuplicate(c.id));
  graph.projects.forEach((p) => checkDuplicate(p.id));

  // Broken prerequisites
  const brokenPrerequisites: Array<{
    sourceId: string;
    targetId: string;
    targetType: string;
  }> = [];

  const checkPrereq = (sourceId: string, prereq: PrerequisiteRef) => {
    let exists = false;
    switch (prereq.targetType) {
      case "concept":
        exists = conceptMap.has(prereq.id);
        break;
      case "lesson":
        exists = lessonMap.has(prereq.id);
        break;
      case "module":
        exists = moduleMap.has(prereq.id);
        break;
      case "project":
        exists = projectMap.has(prereq.id);
        break;
    }
    if (!exists) {
      brokenPrerequisites.push({
        sourceId,
        targetId: prereq.id,
        targetType: prereq.targetType,
      });
    }
  };

  for (const concept of graph.concepts) {
    concept.prerequisites.forEach((p) => checkPrereq(concept.id, p));
  }

  for (const lesson of graph.lessons) {
    lesson.prerequisites.forEach((p) => checkPrereq(lesson.id, p));
  }

  for (const mod of graph.modules) {
    for (const prereqModId of mod.prerequisiteModuleIds) {
      if (!moduleMap.has(prereqModId)) {
        brokenPrerequisites.push({
          sourceId: mod.id,
          targetId: prereqModId,
          targetType: "module",
        });
      }
    }
  }

  // Broken nextLesson references
  const brokenNextLessonReferences: Array<{
    lessonId: string;
    nextLessonId: string;
  }> = [];
  for (const lesson of graph.lessons) {
    if (lesson.nextLessonId && !lessonMap.has(lesson.nextLessonId)) {
      brokenNextLessonReferences.push({
        lessonId: lesson.id,
        nextLessonId: lesson.nextLessonId,
      });
    }
  }

  // Broken visualization references
  const brokenVisualizationReferences: Array<{
    lessonId: string;
    visualizationId: string;
  }> = [];
  if (validVisualizationIds) {
    for (const lesson of graph.lessons) {
      for (const visId of lesson.visualizationIds) {
        if (!validVisualizationIds.has(visId)) {
          brokenVisualizationReferences.push({
            lessonId: lesson.id,
            visualizationId: visId,
          });
        }
      }
    }
  }

  // Orphan lessons (no valid module)
  const orphanLessons: string[] = [];
  for (const lesson of graph.lessons) {
    if (!moduleMap.has(lesson.moduleId)) {
      orphanLessons.push(lesson.id);
    }
  }

  // Orphan concepts (never introduced by a valid lesson, or not referenced)
  const introducedConceptIds = new Set<string>();
  const referencedConceptIds = new Set<string>();

  for (const concept of graph.concepts) {
    if (concept.introducedInLessonId) {
      introducedConceptIds.add(concept.id);
      referencedConceptIds.add(concept.id);
    }
  }

  for (const lesson of graph.lessons) {
    lesson.conceptIds.forEach((c) => {
      introducedConceptIds.add(c);
      referencedConceptIds.add(c);
    });
  }
  for (const project of graph.projects) {
    project.conceptIds.forEach((c) => referencedConceptIds.add(c));
  }

  const orphanConcepts: string[] = [];
  for (const concept of graph.concepts) {
    const isIntroducedValid =
      concept.introducedInLessonId &&
      lessonMap.has(concept.introducedInLessonId);
    if (!isIntroducedValid && !introducedConceptIds.has(concept.id)) {
      orphanConcepts.push(concept.id);
    }
  }

  // Cycles
  const cycles = detectCurriculumCycles(graph);

  const isValid =
    brokenPrerequisites.length === 0 &&
    cycles.length === 0 &&
    orphanLessons.length === 0 &&
    orphanConcepts.length === 0 &&
    brokenVisualizationReferences.length === 0 &&
    brokenNextLessonReferences.length === 0 &&
    duplicateIds.length === 0;

  // Count unique visualizations referenced
  const allVisIds = new Set<string>();
  graph.lessons.forEach((l) => l.visualizationIds.forEach((v) => allVisIds.add(v)));
  graph.concepts.forEach((c) => c.visualizationIds.forEach((v) => allVisIds.add(v)));

  return {
    trackId: graph.trackId,
    curriculumVersion: graph.curriculumVersion,
    moduleCount: graph.modules.length,
    lessonCount: graph.lessons.length,
    conceptCount: graph.concepts.length,
    projectCount: graph.projects.length,
    visualizationCount: allVisIds.size,
    brokenPrerequisites,
    cycles,
    orphanLessons,
    orphanConcepts,
    brokenVisualizationReferences,
    brokenNextLessonReferences,
    duplicateIds,
    isValid,
  };
}

/**
 * Check if a single prerequisite is satisfied given user progress.
 */
export function isPrerequisiteMet(
  prereq: PrerequisiteRef,
  graph: CurriculumGraph,
  completedLessonIds: Set<string>,
  masteredConceptIds: Set<string>
): boolean {
  switch (prereq.targetType) {
    case "lesson":
      return completedLessonIds.has(prereq.id);

    case "concept": {
      if (masteredConceptIds.has(prereq.id)) return true;
      // If not directly recorded as mastered, check if the lesson introducing it has been completed
      const concept = graph.concepts.find((c) => c.id === prereq.id);
      if (concept && concept.introducedInLessonId) {
        return completedLessonIds.has(concept.introducedInLessonId);
      }
      return false;
    }

    case "module": {
      const mod = graph.modules.find((m) => m.id === prereq.id);
      if (!mod) return false;
      return mod.lessonIds.every((lid) => completedLessonIds.has(lid));
    }

    case "project":
      return false; // Projects are capstones
    default:
      return false;
  }
}

/**
 * Generate human-friendly explanation of why a lesson is locked or available.
 */
export function explainLessonPrerequisites(
  lessonId: string,
  graph: CurriculumGraph,
  completedLessonIds: string[],
  masteredConceptIds: string[] = [],
  _locale: "en" | "bn" = "en"
): PrerequisiteExplanation {
  const lesson = graph.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return {
      lessonId,
      isUnlocked: false,
      canUnlock: false,
      items: [],
      missingHardCount: 0,
      missingSoftCount: 0,
      explanationEn: "Lesson not found.",
      explanationBn: "লেসনটি পাওয়া যায়নি।",
    };
  }

  const completedSet = new Set(completedLessonIds);
  const masteredSet = new Set(masteredConceptIds);

  const items: PrerequisiteCheckItem[] = lesson.prerequisites.map((p) => {
    let titleEn = p.titleEn || p.id;
    let titleBn = p.titleBn || p.id;

    if (p.targetType === "concept") {
      const c = graph.concepts.find((item) => item.id === p.id);
      if (c) {
        titleEn = c.nameEn;
        titleBn = c.nameBn;
      }
    } else if (p.targetType === "lesson") {
      const l = graph.lessons.find((item) => item.id === p.id);
      if (l) {
        titleEn = l.titleEn;
        titleBn = l.titleBn;
      }
    } else if (p.targetType === "module") {
      const m = graph.modules.find((item) => item.id === p.id);
      if (m) {
        titleEn = m.titleEn;
        titleBn = m.titleBn;
      }
    }

    const isMet = isPrerequisiteMet(p, graph, completedSet, masteredSet);
    return {
      id: p.id,
      targetType: p.targetType,
      type: p.type,
      titleEn,
      titleBn,
      isMet,
      reasonEn: p.reasonEn,
      reasonBn: p.reasonBn,
    };
  });

  const missingHard = items.filter((item) => item.type === "hard" && !item.isMet);
  const missingSoft = items.filter((item) => item.type === "soft" && !item.isMet);
  const canUnlock = missingHard.length === 0;

  // Build localized summary
  let explanationEn = "";
  let explanationBn = "";

  if (items.length === 0) {
    explanationEn = "No prerequisites required. Available immediately.";
    explanationBn = "কোনো পূর্বশর্ত নেই। এখনই শুরু করা যাবে।";
  } else if (canUnlock) {
    explanationEn = "All hard prerequisites completed. Lesson is unlocked.";
    explanationBn = "সকল আবশ্যক পূর্বশর্ত সম্পন্ন হয়েছে। লেসনটি উন্মুক্ত।";
  } else {
    const listEn = items
      .map((i) => `${i.isMet ? "✓" : "○"} ${i.titleEn}`)
      .join("\n");
    const listBn = items
      .map((i) => `${i.isMet ? "✓" : "○"} ${i.titleBn}`)
      .join("\n");

    explanationEn = `This lesson requires:\n${listEn}`;
    explanationBn = `এই লেসনটির জন্য আবশ্যক:\n${listBn}`;
  }

  return {
    lessonId,
    isUnlocked: canUnlock,
    canUnlock,
    items,
    missingHardCount: missingHard.length,
    missingSoftCount: missingSoft.length,
    explanationEn,
    explanationBn,
  };
}

/**
 * Retrieve all lessons currently unlocked and available to the learner.
 */
export function getAvailableLessons(
  graph: CurriculumGraph,
  completedLessonIds: string[],
  masteredConceptIds: string[] = []
): CurriculumLessonMetadata[] {
  const completedSet = new Set(completedLessonIds);
  const masteredSet = new Set(masteredConceptIds);

  return graph.lessons.filter((lesson) => {
    // Check all hard prerequisites
    const hardPrereqs = lesson.prerequisites.filter((p) => p.type === "hard");
    const allHardMet = hardPrereqs.every((p) =>
      isPrerequisiteMet(p, graph, completedSet, masteredSet)
    );
    return allHardMet;
  });
}

/**
 * Deterministically recommend the next lesson:
 * First unlocked lesson in curriculum order that is not yet completed.
 */
export function getRecommendedLesson(
  graph: CurriculumGraph,
  completedLessonIds: string[],
  masteredConceptIds: string[] = []
): CurriculumLessonMetadata | undefined {
  const completedSet = new Set(completedLessonIds);
  const availableLessons = getAvailableLessons(
    graph,
    completedLessonIds,
    masteredConceptIds
  );

  // Sort modules by order
  const moduleOrderMap = new Map(graph.modules.map((m) => [m.id, m.order]));

  const sortedAvailable = [...availableLessons].sort((a, b) => {
    const modOrderA = moduleOrderMap.get(a.moduleId) ?? 0;
    const modOrderB = moduleOrderMap.get(b.moduleId) ?? 0;
    if (modOrderA !== modOrderB) return modOrderA - modOrderB;
    return a.order - b.order;
  });

  return sortedAvailable.find((lesson) => !completedSet.has(lesson.id));
}
