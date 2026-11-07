/**
 * Kodara Assessment Subsystem - Challenge Validator
 * Validates challenge definitions, test suite completeness, starter code, and solutions.
 */

import { Challenge } from "../types/challenge.types";

export interface ChallengeValidationIssue {
  challengeId: string;
  field: string;
  rule: string;
  message: string;
  severity: "error" | "warning";
}

export interface ChallengeValidationResult {
  isValid: boolean;
  errors: ChallengeValidationIssue[];
  warnings: ChallengeValidationIssue[];
}

export class ChallengeValidator {
  public static validateChallenge(c: Challenge): ChallengeValidationResult {
    const issues: ChallengeValidationIssue[] = [];

    if (!c.id || typeof c.id !== "string") {
      issues.push({
        challengeId: c.id || "unknown",
        field: "id",
        rule: "required",
        message: "Challenge ID is required",
        severity: "error",
      });
    }

    if (!c.titleEn || !c.titleBn) {
      issues.push({
        challengeId: c.id,
        field: "title",
        rule: "bilingual-required",
        message: "Challenge must have both English and Bangla titles",
        severity: "error",
      });
    }

    if (!c.conceptIds || !Array.isArray(c.conceptIds) || c.conceptIds.length === 0) {
      issues.push({
        challengeId: c.id,
        field: "conceptIds",
        rule: "concept-association",
        message: "Challenge must map to at least one conceptId",
        severity: "error",
      });
    }

    if (!c.starterCode) {
      issues.push({
        challengeId: c.id,
        field: "starterCode",
        rule: "required",
        message: "Challenge must provide starterCode for the learner",
        severity: "error",
      });
    }

    if (!c.solutionCode) {
      issues.push({
        challengeId: c.id,
        field: "solutionCode",
        rule: "required",
        message: "Challenge must provide reference solutionCode",
        severity: "error",
      });
    }

    if (!c.testCases || !Array.isArray(c.testCases) || c.testCases.length === 0) {
      issues.push({
        challengeId: c.id,
        field: "testCases",
        rule: "test-suite-required",
        message: "Challenge must contain at least one test case",
        severity: "error",
      });
    } else {
      const hasVisibleTest = c.testCases.some((tc) => !tc.hidden);
      if (!hasVisibleTest) {
        issues.push({
          challengeId: c.id,
          field: "testCases",
          rule: "visible-test-required",
          message: "Challenge test suite should have at least one non-hidden test case for feedback",
          severity: "warning",
        });
      }
    }

    if (!c.hints || c.hints.length === 0) {
      issues.push({
        challengeId: c.id,
        field: "hints",
        rule: "hints-recommended",
        message: "Challenge should provide progressive hints",
        severity: "warning",
      });
    }

    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public static validateChallenges(challenges: Challenge[]): ChallengeValidationResult {
    const allErrors: ChallengeValidationIssue[] = [];
    const allWarnings: ChallengeValidationIssue[] = [];
    const seenIds = new Set<string>();

    for (const c of challenges) {
      if (seenIds.has(c.id)) {
        allErrors.push({
          challengeId: c.id,
          field: "id",
          rule: "unique-id",
          message: `Duplicate challenge ID detected: ${c.id}`,
          severity: "error",
        });
      }
      seenIds.add(c.id);

      const res = ChallengeValidator.validateChallenge(c);
      allErrors.push(...res.errors);
      allWarnings.push(...res.warnings);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}
