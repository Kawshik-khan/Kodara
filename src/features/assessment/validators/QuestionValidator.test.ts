import { describe, it, expect } from "vitest";
import { QuestionValidator } from "./QuestionValidator";
import { TYPESCRIPT_PRACTICE_QUESTIONS } from "@/content/practice/typescript/practiceRegistry";

describe("QuestionValidator", () => {
  it("should validate all production TypeScript practice questions cleanly", () => {
    const res = QuestionValidator.validateQuestions(TYPESCRIPT_PRACTICE_QUESTIONS);
    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("should detect invalid questions missing prompt or correct option", () => {
    const invalidQ: any = {
      id: "q-invalid",
      type: "multiple-choice",
      conceptIds: [],
      promptEn: "",
      promptBn: "প্রশ্ন",
      explanationEn: "exp",
      explanationBn: "ব্যাখ্যা",
      options: [
        { id: "1", textEn: "A", textBn: "ক", isCorrect: false },
        { id: "2", textEn: "B", textBn: "খ", isCorrect: false },
      ],
    };

    const res = QuestionValidator.validateQuestion(invalidQ);
    expect(res.isValid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});
