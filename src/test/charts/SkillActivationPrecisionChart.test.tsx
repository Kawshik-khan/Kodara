import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import {
  aggregateFalseActivation,
  nominationPrecision,
} from "@/features/charts/charts/aiEngineering/skillActivationPrecision";

describe("skill activation precision model", () => {
  it("computes F(f, N) = 1 - (1 - f)^N and Bayesian nomination precision", () => {
    expect(aggregateFalseActivation(0.08, 4)).toBeCloseTo(1 - Math.pow(0.92, 4), 10);
    const tp = 0.3 * 0.92;
    const fp = 0.7 * (1 - Math.pow(0.92, 4));
    expect(nominationPrecision(0.3, 0.92, 0.08, 4)).toBeCloseTo(tp / (tp + fp), 10);
  });

  it("decreases precision monotonically as adjacent slices N or per-slice false activation f grow", () => {
    for (const n of [1, 3, 5]) {
      expect(nominationPrecision(0.3, 0.92, 0.08, n + 2)).toBeLessThan(
        nominationPrecision(0.3, 0.92, 0.08, n)
      );
      expect(nominationPrecision(0.3, 0.92, 0.15, n)).toBeLessThan(
        nominationPrecision(0.3, 0.92, 0.04, n)
      );
    }
  });
});

describe("skill activation precision chart", () => {
  beforeEach(() => localStorage.clear());

  it("renders scoped vs broadened precision at default settings and updates when N changes", () => {
    render(
      <I18nProvider>
        <ParametricChart
          definition={defaultChartRegistry.get("ai-engineering.harness.skill-activation-precision")!}
        />
      </I18nProvider>
    );
    // N = 4, q = 30%, f = 8%, r = 0.92: scopedPrec = 95.2%, broadPrec = 58.2%, misroutes = 199
    const insight = screen.getByTestId("chart-insight");
    expect(insight).toHaveTextContent("95.2%");
    expect(insight).toHaveTextContent("58.2%");
    expect(insight).toHaveTextContent("199");
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    // N = 4, q = 30%, f = 4%: misroutes = round(1000 * 0.7 * (1 - 0.96^4)) = 105, broadPrec = 72.4%
    expect(insight).toHaveTextContent("72.4%");
    expect(insight).toHaveTextContent("105");
  });
});
