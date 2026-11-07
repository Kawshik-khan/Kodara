import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import {
  singleLayerExpectedAttempts,
  layeredExpectedHits,
  obligationExpectedHits,
} from "@/features/charts/charts/aiEngineering/retryAmplification";

describe("retry amplification model", () => {
  it("computes the finite geometric sum at one layer and compounds across L layers", () => {
    expect(singleLayerExpectedAttempts(0, 4)).toBe(1);
    expect(singleLayerExpectedAttempts(1, 4)).toBe(4);
    // p = 0.5, r = 4 -> 1 + 0.5 + 0.25 + 0.125 = 1.875
    expect(singleLayerExpectedAttempts(0.5, 4)).toBeCloseTo(1.875, 10);
    expect(obligationExpectedHits(0.5, 4)).toBeCloseTo(187.5, 10);
    // L = 3 -> 100 * 1.875^3 = 659.1796875
    expect(layeredExpectedHits(0.5, 4, 3)).toBeCloseTo(659.1796875, 6);
  });

  it("amplifies strictly faster with more retry layers when p > 0 and r > 1", () => {
    for (const p of [0.2, 0.5, 0.8]) {
      expect(layeredExpectedHits(p, 4, 2)).toBeGreaterThan(obligationExpectedHits(p, 4));
      expect(layeredExpectedHits(p, 4, 3)).toBeGreaterThan(layeredExpectedHits(p, 4, 2));
      expect(layeredExpectedHits(p, 4, 4)).toBeGreaterThan(layeredExpectedHits(p, 4, 3));
    }
  });
});

describe("retry amplification chart", () => {
  beforeEach(() => localStorage.clear());

  it("renders the compounding downstream hits at default settings and updates when L changes", () => {
    render(
      <I18nProvider>
        <ParametricChart definition={defaultChartRegistry.get("ai-engineering.harness.retry-amplification")!} />
      </I18nProvider>
    );
    // p = 50%, r = 4, L = 3: layered = 659, governed = 188, worstCase = 64
    const insight = screen.getByTestId("chart-insight");
    expect(insight).toHaveTextContent("659");
    expect(insight).toHaveTextContent("188");
    expect(insight).toHaveTextContent("64টি");
    fireEvent.click(screen.getAllByRole("button", { name: "2" })[1]);
    // L = 2: 100 * 1.875^2 = 351.5625 -> 352
    expect(insight).toHaveTextContent("352");
  });
});
