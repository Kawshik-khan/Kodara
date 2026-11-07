/**
 * Kodara Assessment Subsystem - Question Validator
 * Validates integrity, schema correctness, and pedagogical requirements of practice questions.
 */

import { PracticeQuestion } from "../types/practice.types";

export interface ValidationIssue {
  questionId: string;
  field: string;
  rule: string;
  message: string;
  severity: "error" | "warning";
}

export interface QuestionValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export class QuestionValidator {
  public static validateQuestion(q: PracticeQuestion): QuestionValidationResult {
    const issues: ValidationIssue[] = [];

    // Base validation
    if (!q.id || typeof q.id !== "string") {
      issues.push({
        questionId: q.id || "unknown",
        field: "id",
        rule: "required",
        message: "Question ID is required and must be a string",
        severity: "error",
      });
    }

    if (!q.conceptIds || !Array.isArray(q.conceptIds) || q.conceptIds.length === 0) {
      issues.push({
        questionId: q.id,
        field: "conceptIds",
        rule: "concept-association",
        message: "Question must be associated with at least one conceptId",
        severity: "error",
      });
    }

    if (!q.promptEn || !q.promptBn) {
      issues.push({
        questionId: q.id,
        field: "prompt",
        rule: "bilingual-required",
        message: "Question prompt must have both English (promptEn) and Bangla (promptBn)",
        severity: "error",
      });
    }

    if (!q.explanationEn || !q.explanationBn) {
      issues.push({
        questionId: q.id,
        field: "explanation",
        rule: "bilingual-required",
        message: "Question explanation must have both English and Bangla text",
        severity: "error",
      });
    }

    // Type-specific validations
    switch (q.type) {
      case "multiple-choice":
      case "predict-type":
      case "predict-output":
      case "code-reading":
      case "error-explanation":
      case "visualization-prediction": {
        const options = (q as any).options;
        if (!options || !Array.isArray(options) || options.length < 2) {
          issues.push({
            questionId: q.id,
            field: "options",
            rule: "minimum-options",
            message: `Question of type ${q.type} must have at least 2 options`,
            severity: "error",
          });
        } else {
          const correctOptions = options.filter((opt: any) => opt.isCorrect);
          if (correctOptions.length !== 1) {
            issues.push({
              questionId: q.id,
              field: "options",
              rule: "single-correct-answer",
              message: `Multiple choice question must have exactly 1 correct answer, found ${correctOptions.length}`,
              severity: "error",
            });
          }
        }
        break;
      }

      case "multiple-select": {
        const options = q.options;
        if (!options || !Array.isArray(options) || options.length < 2) {
          issues.push({
            questionId: q.id,
            field: "options",
            rule: "minimum-options",
            message: "Multi-select question must have at least 2 options",
            severity: "error",
          });
        } else {
          const correctOptions = options.filter((opt) => opt.isCorrect);
          if (correctOptions.length === 0) {
            issues.push({
              questionId: q.id,
              field: "options",
              rule: "at-least-one-correct",
              message: "Multi-select question must have at least 1 correct answer",
              severity: "error",
            });
          }
        }
        break;
      }

      case "true-false": {
        if (typeof (q as any).correctAnswer !== "boolean") {
          issues.push({
            questionId: q.id,
            field: "correctAnswer",
            rule: "boolean-required",
            message: "True/False question must specify a boolean correctAnswer",
            severity: "error",
          });
        }
        break;
      }

      case "code-completion": {
        const templateCode = q.templateCode;
        const blanks = q.blanks;
        if (!templateCode) {
          issues.push({
            questionId: q.id,
            field: "templateCode",
            rule: "required",
            message: "Code completion question must specify templateCode",
            severity: "error",
          });
        }
        if (!blanks || blanks.length === 0) {
          issues.push({
            questionId: q.id,
            field: "blanks",
            rule: "non-empty",
            message: "Code completion question must specify at least one blank",
            severity: "error",
          });
        }
        break;
      }

      case "debugging": {
        if (!q.brokenCode) {
          issues.push({
            questionId: q.id,
            field: "brokenCode",
            rule: "required",
            message: "Debugging question must provide brokenCode",
            severity: "error",
          });
        }
        if (!q.options || q.options.length < 2) {
          issues.push({
            questionId: q.id,
            field: "options",
            rule: "minimum-options",
            message: "Debugging question must provide options to fix code",
            severity: "error",
          });
        }
        break;
      }

      case "order-steps": {
        const items = q.items;
        if (!items || items.length < 2) {
          issues.push({
            questionId: q.id,
            field: "items",
            rule: "minimum-items",
            message: "Ordering question must contain at least 2 items to order",
            severity: "error",
          });
        } else {
          const orders = items.map((i) => i.correctOrder).sort((a, b) => a - b);
          const isSequential = orders.every((order, idx) => order === idx + 1);
          if (!isSequential) {
            issues.push({
              questionId: q.id,
              field: "items",
              rule: "sequential-ordering",
              message: "Ordering items must have sequential correctOrder indices starting at 1",
              severity: "error",
            });
          }
        }
        break;
      }

      case "matching": {
        const pairs = q.pairs;
        if (!pairs || pairs.length < 2) {
          issues.push({
            questionId: q.id,
            field: "pairs",
            rule: "minimum-pairs",
            message: "Matching question must contain at least 2 pairs",
            severity: "error",
          });
        }
        break;
      }
    }

    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public static validateQuestions(questions: PracticeQuestion[]): QuestionValidationResult {
    const allErrors: ValidationIssue[] = [];
    const allWarnings: ValidationIssue[] = [];
    const seenIds = new Set<string>();

    for (const q of questions) {
      if (seenIds.has(q.id)) {
        allErrors.push({
          questionId: q.id,
          field: "id",
          rule: "unique-id",
          message: `Duplicate question ID detected: ${q.id}`,
          severity: "error",
        });
      }
      seenIds.add(q.id);

      const res = QuestionValidator.validateQuestion(q);
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
