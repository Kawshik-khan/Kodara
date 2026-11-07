import { describe, it, expect } from "vitest";
import { practiceService } from "./PracticeService";
import { TYPESCRIPT_PRACTICE_QUESTIONS } from "@/content/practice/typescript/practiceRegistry";

describe("PracticeService", () => {
  it("should evaluate multiple choice questions correctly", () => {
    const q = TYPESCRIPT_PRACTICE_QUESTIONS.find((item) => item.type === "predict-type")!;
    const feedbackCorrect = practiceService.evaluateAnswer(q, "opt-1");
    expect(feedbackCorrect.isCorrect).toBe(true);

    const feedbackIncorrect = practiceService.evaluateAnswer(q, "opt-2");
    expect(feedbackIncorrect.isCorrect).toBe(false);
  });

  it("should create and manage a practice session state cleanly", () => {
    const session = practiceService.createSession("lesson", "ts.variables", TYPESCRIPT_PRACTICE_QUESTIONS);
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.currentIndex).toBe(0);
    expect(session.isFinished).toBe(false);

    const res = practiceService.submitAnswer(session, "opt-1", 10);
    expect(res.session.attempts).toHaveLength(1);
  });
});
