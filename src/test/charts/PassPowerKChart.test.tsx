import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import { passAtK, passPowerK, honestPassPowerK } from "@/features/charts/charts/aiEngineering/passPowerK";

describe("pass@k vs pass^k reliability model", () => {
  it("computes pass@k = 1 - (1 - p)^k, pass^k = p^k, and honest pass^k = ((1 - m)p)^k", () => {
    expect(passAtK(0.85, 5)).toBeCloseTo(1 - Math.pow(0.15, 5), 10);
    expect(passPowerK(0.85, 5)).toBeCloseTo(Math.pow(0.85, 5), 10);
    expect(honestPassPowerK(0.85, 5, 0.15)).toBeCloseTo(Math.pow(0.85 * 0.85, 5), 10);
  });

  it("diverges monotonically as k grows for 0 < p < 1", () => {
    for (const k of [1, 3, 5]) {
      expect(passAtK(0.8, k + 2)).toBeGreaterThan(passAtK(0.8, k));
      expect(passPowerK(0.8, k + 2)).toBeLessThan(passPowerK(0.8, k));
      expect(honestPassPowerK(0.8, k, 0.15)).toBeLessThan(passPowerK(0.8, k));
    }
  });
});

describe("pass@k vs pass^k chart", () => {
  beforeEach(() => localStorage.clear());

  it("renders the reliability gap at default settings and updates when k changes", () => {
    render(
      <I18nProvider>
        <ParametricChart definition={defaultChartRegistry.get("ai-engineering.harness.pass-power-k")!} />
      </I18nProvider>
    );
    // p = 85%, k = 5, m = 15%: pass@5 = 100.0%, pass^5 = 44.4%, honest pass^5 = (0.7225)^5 = 19.7%
    const insight = screen.getByTestId("chart-insight");
    expect(insight).toHaveTextContent("100.0%");
    expect(insight).toHaveTextContent("44.4%");
    expect(insight).toHaveTextContent("19.7%");
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    // k = 3: (0.7225)^3 = 37.7%
    expect(insight).toHaveTextContent("37.7%");
  });
});

