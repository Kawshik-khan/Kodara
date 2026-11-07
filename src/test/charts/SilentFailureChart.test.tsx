import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import { completedShare, silentFailureRate } from "@/features/charts/charts/aiEngineering/silentFailure";

describe("silent failure model", () => {
  it("matches the closed form e(1−d)/(1−ed)", () => {
    expect(silentFailureRate(0.1, 0)).toBeCloseTo(0.1, 10); // no verifier: every error is silent
    expect(silentFailureRate(0.1, 1)).toBe(0); // perfect verifier: none are
    expect(silentFailureRate(0.1, 0.4)).toBeCloseTo(0.06 / 0.96, 10);
    expect(completedShare(0.1, 0.4)).toBeCloseTo(0.96, 10);
  });

  it("falls as detection coverage rises", () => {
    for (const e of [0.05, 0.1, 0.2, 0.3]) {
      for (let d = 0; d < 1; d += 0.05) {
        expect(silentFailureRate(e, d + 0.05)).toBeLessThan(silentFailureRate(e, d));
      }
    }
  });
});

describe("silent failure chart", () => {
  beforeEach(() => localStorage.clear());

  it("reports the silent share at the default settings", () => {
    render(
      <I18nProvider>
        <ParametricChart definition={defaultChartRegistry.get("ai-engineering.harness.silent-failure")!} />
      </I18nProvider>
    );
    // e = 10%, d = 40%: 0.06 / 0.96 = 6.25% → shown as 6.3%, 60 silent and 40 visible per 1000
    const insight = screen.getByTestId("chart-insight");
    expect(insight).toHaveTextContent("6.3%");
    expect(insight).toHaveTextContent("60টা");
    fireEvent.click(screen.getByRole("button", { name: "30" }));
    expect(insight).toHaveTextContent("30% run");
  });
});
