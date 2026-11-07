import { describe, it, expect } from "vitest";
import { ChallengeValidator } from "./ChallengeValidator";
import { TYPESCRIPT_CHALLENGES } from "@/content/challenges/typescript/challengeRegistry";

describe("ChallengeValidator", () => {
  it("should validate all production TypeScript challenges cleanly", () => {
    const res = ChallengeValidator.validateChallenges(TYPESCRIPT_CHALLENGES);
    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("should flag challenges missing test cases or starter code", () => {
    const invalidCh: any = {
      id: "ch-invalid",
      titleEn: "Broken Challenge",
      titleBn: "ভাঙ্গা চ্যালেঞ্জ",
      conceptIds: [],
      starterCode: "",
      solutionCode: "",
      testCases: [],
    };

    const res = ChallengeValidator.validateChallenge(invalidCh);
    expect(res.isValid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});
