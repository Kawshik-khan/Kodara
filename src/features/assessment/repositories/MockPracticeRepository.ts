/**
 * Kodara Assessment Subsystem - Mock Practice Question Repository
 * Provides clean access to practice questions by lesson, concept, or module.
 */

import { PracticeQuestion } from "../types/practice.types";
import { TYPESCRIPT_PRACTICE_QUESTIONS } from "@/content/practice/typescript/practiceRegistry";

export class MockPracticeRepository {
  private questions: PracticeQuestion[] = [];

  constructor(initialQuestions: PracticeQuestion[] = TYPESCRIPT_PRACTICE_QUESTIONS) {
    this.questions = [...initialQuestions];
  }

  public registerQuestions(questions: PracticeQuestion[]): void {
    questions.forEach((q) => {
      if (!this.questions.some((existing) => existing.id === q.id)) {
        this.questions.push(q);
      }
    });
  }

  public getAll(): PracticeQuestion[] {
    return [...this.questions];
  }

  public getById(id: string): PracticeQuestion | undefined {
    return this.questions.find((q) => q.id === id);
  }

  public getByLessonId(lessonId: string): PracticeQuestion[] {
    return this.questions.filter((q) => q.lessonId === lessonId);
  }

  public getByConceptId(conceptId: string): PracticeQuestion[] {
    return this.questions.filter((q) => q.conceptIds.includes(conceptId));
  }

  public getByModuleId(moduleId: string): PracticeQuestion[] {
    return this.questions.filter((q) => q.moduleId === moduleId);
  }
}

export const mockPracticeRepository = new MockPracticeRepository();
