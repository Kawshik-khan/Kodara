import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import {
  DUPLICATE_REFUNDS_CHART,
  naiveDuplicates,
  reconcileReads,
} from "@/features/charts/charts/aiEngineering/duplicateRefunds";

describe("duplicate refunds model", () => {
  it("matches the closed-form expectation 1000 · Σ p^k", () => {
    expect(naiveDuplicates(8, 3)).toBeCloseTo(86.4, 6);
    expect(naiveDuplicates(30, 5)).toBeCloseTo(425.1, 6);
    expect(naiveDuplicates(10, 1)).toBe(0);
    expect(reconcileReads(30)).toBe(300);
  });

  it("stays inside the chart's y range for every option", () => {
    const yMax = DUPLICATE_REFUNDS_CHART.y.max;
    for (const r of DUPLICATE_REFUNDS_CHART.params[0].options) {
      expect(naiveDuplicates(DUPLICATE_REFUNDS_CHART.x.max, r)).toBeLessThanOrEqual(yMax);
    }
  });
});

describe("ParametricChart", () => {
  beforeEach(() => localStorage.clear());

  const renderChart = () =>
    render(
      <I18nProvider>
        <ParametricChart definition={defaultChartRegistry.get("ai-engineering.harness.duplicate-refunds")!} />
      </I18nProvider>
    );

  it("starts at p = 8%, r = 3 and explains the result", () => {
    renderChart();
    expect(screen.getByTestId("chart-insight")).toHaveTextContent("86");
    expect(screen.getByTestId("chart-insight")).toHaveTextContent("80");
  });

  it("updates when the rate and retry count change", () => {
    renderChart();
    fireEvent.change(screen.getByRole("slider"), { target: { value: "30" } });
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    expect(screen.getByTestId("chart-insight")).toHaveTextContent("425");
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByTestId("chart-insight")).toHaveTextContent("Retry বন্ধ");
  });

  it("shows the ManimGL scene source on the Manim tab", () => {
    renderChart();
    fireEvent.click(screen.getByRole("tab", { name: "Manim" }));
    expect(document.querySelector(".kodara-chart__source")?.textContent).toContain(
      "class DuplicateRefunds(Scene):"
    );
    expect(screen.queryByTestId("chart-insight")).not.toBeInTheDocument();
  });
});
