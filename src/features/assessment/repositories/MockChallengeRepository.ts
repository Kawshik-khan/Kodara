/**
 * Kodara Assessment Subsystem - Mock Challenge Repository
 * Provides clean access to engineering challenges by lesson, concept, or module.
 */

import { Challenge } from "../types/challenge.types";
import { TYPESCRIPT_CHALLENGES } from "@/content/challenges/typescript/challengeRegistry";

export class MockChallengeRepository {
  private challenges: Challenge[] = [];

  constructor(initialChallenges: Challenge[] = TYPESCRIPT_CHALLENGES) {
    this.challenges = [...initialChallenges];
  }

  public registerChallenges(challenges: Challenge[]): void {
    challenges.forEach((ch) => {
      if (!this.challenges.some((existing) => existing.id === ch.id)) {
        this.challenges.push(ch);
      }
    });
  }

  public getAll(): Challenge[] {
    return [...this.challenges];
  }

  public getById(id: string): Challenge | undefined {
    return this.challenges.find((ch) => ch.id === id);
  }

  public getByLessonId(lessonId: string): Challenge[] {
    return this.challenges.filter((ch) => ch.lessonId === lessonId);
  }

  public getByConceptId(conceptId: string): Challenge[] {
    return this.challenges.filter((ch) => ch.conceptIds.includes(conceptId));
  }

  public getByModuleId(moduleId: string): Challenge[] {
    return this.challenges.filter((ch) => ch.moduleId === moduleId);
  }
}

export const mockChallengeRepository = new MockChallengeRepository();
