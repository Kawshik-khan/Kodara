import { describe, it, expect } from "vitest";
import {
  calculateStepDuration,
  clampStepIndex,
  getNextStepIndex,
  getPrevStepIndex,
  BASE_STEP_DURATION_MS,
} from "@/features/visualization/core/playback";

describe("Visualization Playback Core", () => {
  it("calculates step duration inversely proportional to speed", () => {
    expect(calculateStepDuration(1)).toBe(BASE_STEP_DURATION_MS);
    expect(calculateStepDuration(2)).toBe(Math.round(BASE_STEP_DURATION_MS / 2));
    expect(calculateStepDuration(0.5)).toBe(BASE_STEP_DURATION_MS * 2);
  });

  it("clamps step index safely within bounds", () => {
    expect(clampStepIndex(-5, 5)).toBe(0);
    expect(clampStepIndex(2, 5)).toBe(2);
    expect(clampStepIndex(10, 5)).toBe(4);
    expect(clampStepIndex(0, 0)).toBe(0);
  });

  it("computes next and previous step indices correctly", () => {
    expect(getNextStepIndex(0, 4)).toBe(1);
    expect(getNextStepIndex(3, 4)).toBe(3); // capped at last step
    expect(getPrevStepIndex(2)).toBe(1);
    expect(getPrevStepIndex(0)).toBe(0); // capped at 0
  });
});
