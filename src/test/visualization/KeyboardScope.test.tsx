import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { VisualizationEngine } from "@/features/visualization/components/VisualizationEngine";
import {
  ACI_REFUND_ACK_LOST_VISUALIZATION,
  ACI_REFUND_NAIVE_VISUALIZATION,
} from "@/features/visualization/visualizations/aiEngineering/aciRefundFlow";

describe("keyboard shortcuts with several visualizers on one page", () => {
  it("go to the first one, then to whichever the learner last touched", () => {
    render(
      <I18nProvider>
        <VisualizationEngine definition={ACI_REFUND_ACK_LOST_VISUALIZATION} />
        <VisualizationEngine definition={ACI_REFUND_NAIVE_VISUALIZATION} />
      </I18nProvider>
    );
    const [first, second] = screen.getAllByTestId("visualization-engine");
    const counter = (el: HTMLElement) => el.querySelector(".kodara-vis-controls__counter")?.textContent;

    fireEvent.keyDown(window, { key: "j" });
    expect(counter(first)).toBe("ধাপ 2 / 11");
    expect(counter(second)).toBe("ধাপ 1 / 8");

    fireEvent.pointerDown(second);
    fireEvent.keyDown(window, { key: "j" });
    expect(counter(first)).toBe("ধাপ 2 / 11");
    expect(counter(second)).toBe("ধাপ 2 / 8");
  });
});
