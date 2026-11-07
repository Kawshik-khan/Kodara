/**
 * Kodara Assessment Subsystem - Hint Service & Provider Interface
 * Progressive hint engine supporting static hints and future AI hint providers.
 */

import { AssessmentHint } from "../types/assessment.types";

export interface HintProviderContext {
  assessmentId: string;
  learnerAnswer?: unknown;
  codeSnippet?: string;
  attemptCount: number;
  conceptIds: string[];
  misconceptionId?: string;
}

export interface HintProvider {
  getHint(level: 1 | 2 | 3, context: HintProviderContext): Promise<AssessmentHint | null>;
}

export class StaticHintProvider implements HintProvider {
  private hintMap: Map<string, AssessmentHint[]>;

  constructor(hintsByAssessmentId: Record<string, AssessmentHint[]>) {
    this.hintMap = new Map(Object.entries(hintsByAssessmentId));
  }

  public async getHint(
    level: 1 | 2 | 3,
    context: HintProviderContext
  ): Promise<AssessmentHint | null> {
    const hints = this.hintMap.get(context.assessmentId);
    if (!hints || hints.length === 0) return null;

    const matchedHint = hints.find((h) => h.level === level) || hints[level - 1] || hints[0];
    return matchedHint || null;
  }
}

export class HintService {
  private provider: HintProvider;

  constructor(provider?: HintProvider) {
    this.provider = provider || new StaticHintProvider({});
  }

  public setProvider(provider: HintProvider): void {
    this.provider = provider;
  }

  public async requestHint(
    level: 1 | 2 | 3,
    context: HintProviderContext
  ): Promise<AssessmentHint | null> {
    return this.provider.getHint(level, context);
  }
}

export const hintService = new HintService();
