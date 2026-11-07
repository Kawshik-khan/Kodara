import { describe, it, expect } from "vitest";
import { typeScriptChallengeEvaluator } from "./TypeScriptChallengeEvaluator";
import { TYPESCRIPT_CHALLENGES } from "@/content/challenges/typescript/challengeRegistry";

describe("TypeScriptChallengeEvaluator", () => {
  it("should evaluate solution code and pass test suite", async () => {
    const ch = TYPESCRIPT_CHALLENGES.find((item) => item.id === "ts.challenge.02.generic-identity")!;
    const evalRes = await typeScriptChallengeEvaluator.evaluate(ch, ch.solutionCode);

    expect(evalRes.status).toBe("passed");
    expect(evalRes.testsPassed).toBe(ch.testCases.length);
    expect(evalRes.scorePercent).toBe(100);
  });

  it("should detect syntax compile errors safely", async () => {
    const ch = TYPESCRIPT_CHALLENGES[0];
    const evalRes = await typeScriptChallengeEvaluator.evaluate(ch, "function broken( {");

    expect(evalRes.status).toBe("compile-error");
    expect(evalRes.compileError).toBeDefined();
    expect(evalRes.scorePercent).toBe(0);
  });
});
