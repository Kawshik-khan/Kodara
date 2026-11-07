/**
 * Kodara Assessment Subsystem - Question Selection Strategy Pattern
 * Strategy interface and implementations for deterministic question selection.
 */

import { PracticeQuestion, PracticeAttempt } from "../types/practice.types";

export interface SelectionContext {
  targetId: string; // lessonId, conceptId, or moduleId
  questions: PracticeQuestion[];
  previousAttempts?: PracticeAttempt[];
  weakConceptIds?: string[];
  limit?: number;
}

export interface QuestionSelectionStrategy {
  selectQuestions(context: SelectionContext): PracticeQuestion[];
}

/**
 * Sequential Strategy: Preserves curriculum author order.
 */
export class SequentialStrategy implements QuestionSelectionStrategy {
  public selectQuestions(context: SelectionContext): PracticeQuestion[] {
    const limit = context.limit || 5;
    return context.questions.slice(0, limit);
  }
}

/**
 * Difficulty Adaptive Strategy: Reinforces lower difficulty if struggling, moves up if succeeding.
 */
export class DifficultyAdaptiveStrategy implements QuestionSelectionStrategy {
  public selectQuestions(context: SelectionContext): PracticeQuestion[] {
    const limit = context.limit || 5;
    const questions = [...context.questions];

    if (!context.previousAttempts || context.previousAttempts.length === 0) {
      // Sort by difficulty ascending
      return questions.sort((a, b) => a.difficulty - b.difficulty).slice(0, limit);
    }

    const recent = context.previousAttempts.slice(-3);
    const correctCount = recent.filter((a) => a.isCorrect).length;

    let targetDiff = 3;
    if (correctCount === 3) targetDiff = 4;
    else if (correctCount <= 1) targetDiff = 1;

    // Pick questions nearest to target difficulty
    return questions
      .sort((a, b) => Math.abs(a.difficulty - targetDiff) - Math.abs(b.difficulty - targetDiff))
      .slice(0, limit);
  }
}

/**
 * Weak Concept Strategy: Prioritizes questions mapping to identified weak concepts.
 */
export class WeakConceptStrategy implements QuestionSelectionStrategy {
  public selectQuestions(context: SelectionContext): PracticeQuestion[] {
    const limit = context.limit || 5;
    const weakSet = new Set(context.weakConceptIds || []);

    if (weakSet.size === 0) {
      return context.questions.slice(0, limit);
    }

    // Rank questions that match weak concepts higher
    const scored = context.questions.map((q) => {
      const matchCount = q.conceptIds.filter((cid) => weakSet.has(cid)).length;
      return { question: q, score: matchCount };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.question).slice(0, limit);
  }
}

/**
 * Random Strategy: Shuffles questions deterministically or pseudo-randomly.
 */
export class RandomStrategy implements QuestionSelectionStrategy {
  public selectQuestions(context: SelectionContext): PracticeQuestion[] {
    const limit = context.limit || 5;
    const shuffled = [...context.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }
}
