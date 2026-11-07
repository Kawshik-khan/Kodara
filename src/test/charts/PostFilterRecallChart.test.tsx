import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import { postFilterRecall, scopeFirstRecall } from "@/features/charts/charts/aiEngineering/postFilterRecall";

describe("post-filter recall model", () => {
  it("matches the binomial tail P(Binomial(k, 1−s) >= m)", () => {
    expect(postFilterRecall(0, 5, 2)).toBe(1);
    expect(postFilterRecall(1, 5, 2)).toBe(0);
    // s = 0.4 -> p_valid = 0.6; k = 3, m = 2 -> 3*(0.6^2)*(0.4) + 0.6^3 = 0.432 + 0.216 = 0.648
    expect(postFilterRecall(0.4, 3, 2)).toBeCloseTo(0.648, 10);
    expect(scopeFirstRecall(5, 2)).toBe(1);
  });

  it("decreases monotonically as lookalike crowding s increases", () => {
    for (const k of [3, 5, 8]) {
      for (let s = 0; s < 0.85; s += 0.1) {
        expect(postFilterRecall(s + 0.1, k, 2)).toBeLessThan(postFilterRecall(s, k, 2));
      }
    }
  });
});

describe("post-filter recall chart", () => {
  beforeEach(() => localStorage.clear());

  it("renders the recall gap at default settings and updates when k changes", () => {
    render(
      <I18nProvider>
        <ParametricChart definition={defaultChartRegistry.get("ai-engineering.harness.post-filter-recall")!} />
      </I18nProvider>
    );
    // s = 40%, k = 5, m = 2: P(X >= 2) for Bin(5, 0.6) = 1 - (0.4^5 + 5*0.6*0.4^4) = 1 - (0.01024 + 0.0768) = 0.91296 -> 91.3%
    const insight = screen.getByTestId("chart-insight");
    expect(insight).toHaveTextContent("91.3%");
    expect(insight).toHaveTextContent("87টা");
    fireEvent.click(screen.getAllByRole("button", { name: "3" })[0]);
    // k = 3, m = 2, s = 40% -> 64.8%
    expect(insight).toHaveTextContent("64.8%");
  });
});

