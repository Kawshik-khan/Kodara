/**
 * Kodara Assessment Subsystem - Curriculum Assessment Cross-Validator
 * Cross-validates practice questions, challenges, curriculum graph, concepts, and lessons.
 */

import { PracticeQuestion } from "../types/practice.types";
import { Challenge } from "../types/challenge.types";
import { CurriculumGraph } from "@/features/curriculum/types/curriculum.types";

export interface CurriculumAssessmentReport {
  isValid: boolean;
  totalQuestions: number;
  totalChallenges: number;
  orphanQuestionIds: string[];
  orphanChallengeIds: string[];
  brokenConceptReferences: Array<{ assessmentId: string; conceptId: string }>;
  brokenLessonReferences: Array<{ assessmentId: string; lessonId: string }>;
  missingAssessmentLessonIds: string[];
}

export class CurriculumAssessmentValidator {
  public static validateCurriculumIntegrity(
    curriculumGraph: CurriculumGraph,
    questions: PracticeQuestion[],
    challenges: Challenge[]
  ): CurriculumAssessmentReport {
    const knownConceptIds = new Set(curriculumGraph.concepts.map((c) => c.id));
    const knownLessonIds = new Set(curriculumGraph.lessons.map((l) => l.id));

    const orphanQuestionIds: string[] = [];
    const orphanChallengeIds: string[] = [];
    const brokenConceptReferences: Array<{ assessmentId: string; conceptId: string }> = [];
    const brokenLessonReferences: Array<{ assessmentId: string; lessonId: string }> = [];

    // Validate Questions
    for (const q of questions) {
      let isReferenced = false;
      if (q.lessonId) {
        if (!knownLessonIds.has(q.lessonId)) {
          brokenLessonReferences.push({ assessmentId: q.id, lessonId: q.lessonId });
        } else {
          isReferenced = true;
        }
      }

      for (const conceptId of q.conceptIds) {
        if (!knownConceptIds.has(conceptId)) {
          brokenConceptReferences.push({ assessmentId: q.id, conceptId });
        } else {
          isReferenced = true;
        }
      }

      if (!isReferenced) {
        orphanQuestionIds.push(q.id);
      }
    }

    // Validate Challenges
    for (const ch of challenges) {
      let isReferenced = false;
      if (ch.lessonId) {
        if (!knownLessonIds.has(ch.lessonId)) {
          brokenLessonReferences.push({ assessmentId: ch.id, lessonId: ch.lessonId });
        } else {
          isReferenced = true;
        }
      }

      for (const conceptId of ch.conceptIds) {
        if (!knownConceptIds.has(conceptId)) {
          brokenConceptReferences.push({ assessmentId: ch.id, conceptId });
        } else {
          isReferenced = true;
        }
      }

      if (!isReferenced) {
        orphanChallengeIds.push(ch.id);
      }
    }

    // Check lessons with no questions or challenges
    const lessonsWithAssessments = new Set<string>();
    questions.forEach((q) => q.lessonId && lessonsWithAssessments.add(q.lessonId));
    challenges.forEach((ch) => ch.lessonId && lessonsWithAssessments.add(ch.lessonId));

    const missingAssessmentLessonIds = Array.from(knownLessonIds).filter(
      (id) => !lessonsWithAssessments.has(id)
    );

    const isValid =
      brokenConceptReferences.length === 0 &&
      brokenLessonReferences.length === 0 &&
      orphanQuestionIds.length === 0 &&
      orphanChallengeIds.length === 0;

    return {
      isValid,
      totalQuestions: questions.length,
      totalChallenges: challenges.length,
      orphanQuestionIds,
      orphanChallengeIds,
      brokenConceptReferences,
      brokenLessonReferences,
      missingAssessmentLessonIds,
    };
  }
}
