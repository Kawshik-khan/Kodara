import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import {
  finishWithin,
  verifiedShare,
  workDoneShare,
} from "@/features/charts/charts/aiEngineering/verificationBudget";

describe("verification budget model", () => {
  it("matches the binomial tail computed independently with Python math.comb", () => {
    // python: sum(comb(n,j)*q**j*(1-q)**(n-j) for j in range(6, n+1))
    expect(finishWithin(8, 0.7)).toBeCloseTo(0.551774, 5);
    expect(finishWithin(10, 0.7)).toBeCloseTo(0.849732, 5);
    expect(finishWithin(5, 0.9)).toBe(0);
    expect(finishWithin(6, 1)).toBe(1);
  });

  it("never verifies more runs than finish the work", () => {
    for (let b = 0; b <= 30; b++) {
      for (const q of [0.5, 0.7, 0.9]) {
        for (const v of [1, 2, 3, 4]) {
          expect(verifiedShare(b, q, v)).toBeLessThanOrEqual(workDoneShare(b, q) + 1e-12);
        }
      }
    }
  });
});

describe("verification budget chart", () => {
  beforeEach(() => localStorage.clear());

  it("explains the gap between verified and unverified \"done\"", () => {
    render(
      <I18nProvider>
        <ParametricChart definition={defaultChartRegistry.get("ai-engineering.harness.verification-budget")!} />
      </I18nProvider>
    );
    // B = 10, q = 70%, v = 2: 55% verified, 85% finish the work
    const insight = screen.getByTestId("chart-insight");
    expect(insight).toHaveTextContent("55%");
    expect(insight).toHaveTextContent("30%");
    // v = 4 leaves 6 steps for 6 successes: 0.7^6 ≈ 12%
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    expect(insight).toHaveTextContent("4 ধাপের verifier");
    expect(insight).toHaveTextContent("12%");
  });
});
