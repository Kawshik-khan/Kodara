import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisualizationEngine } from "@/features/visualization/components/VisualizationEngine";
import { VARIABLES_BASIC_VISUALIZATION } from "@/features/visualization/visualizations/typescript/variablesBasic";
import { I18nProvider } from "@/i18n";

describe("VisualizationEngine Component", () => {
  const renderEngine = (definition = VARIABLES_BASIC_VISUALIZATION) => {
    return render(
      <I18nProvider>
        <VisualizationEngine definition={definition} enableKeyboardShortcuts={true} />
      </I18nProvider>
    );
  };

  it("renders header metadata, category badge, and initial synchronized code", () => {
    renderEngine();

    expect(
      screen.getByText("ভেরিয়েবল: আইডেন্টিফায়ার, বাইন্ডিং এবং মেমোরি স্লট")
    ).toBeInTheDocument();
    expect(screen.getByText("runtime")).toBeInTheDocument();
    expect(screen.getByText("variable-binding")).toBeInTheDocument();

    // Synchronized code panel
    expect(screen.getByTestId("sync-code-panel")).toBeInTheDocument();
    expect(screen.getByText("let")).toBeInTheDocument();

    // Initial step 1 is active (Bangla default)
    expect(screen.getByText(/ধাপ ১: ডিক্লেয়ারেশন এবং এনভায়রনমেন্ট রেকর্ড এন্ট্রি/i)).toBeInTheDocument();
    expect(screen.getByText(/ধাপ 1 \/ 5/i)).toBeInTheDocument();
  });

  it("advances steps using next and prev controls", () => {
    renderEngine();

    const nextBtn = screen.getByRole("button", { name: "Next step" });
    const prevBtn = screen.getByRole("button", { name: "Previous step" });

    expect(prevBtn).toBeDisabled();
    fireEvent.click(nextBtn);

    // Now on step 2
    expect(screen.getByText(/ধাপ ২: মান নির্ধারণ ও মেমোরিতে বরাদ্দ/i)).toBeInTheDocument();
    expect(screen.getByText(/ধাপ 2 \/ 5/i)).toBeInTheDocument();
    expect(prevBtn).not.toBeDisabled();

    // Step back
    fireEvent.click(prevBtn);
    expect(screen.getByText(/ধাপ ১: ডিক্লেয়ারেশন/i)).toBeInTheDocument();
    expect(screen.getByText(/ধাপ 1 \/ 5/i)).toBeInTheDocument();
  });

  it("seeks steps directly via timeline dots", () => {
    renderEngine();

    const step3Dot = screen.getByRole("button", { name: "Jump to step 3" });
    fireEvent.click(step3Dot);

    expect(screen.getByText(/ধাপ ৩: রি-অ্যাসাইনমেন্ট এক্সপ্রেশন যাচাই/i)).toBeInTheDocument();
    expect(screen.getByText(/ধাপ 3 \/ 5/i)).toBeInTheDocument();
  });

  it("opens Inspector when clicking a visual node and closes on dismiss", () => {
    renderEngine();

    // Click binding node
    const bindingNode = screen.getByTestId("vis-node-binding-count");
    fireEvent.click(bindingNode);

    // Inspector should appear
    expect(screen.getByTestId("visualization-inspector")).toBeInTheDocument();
    expect(screen.getByText("বাইন্ডিং: count")).toBeInTheDocument();

    // Click close button
    const closeBtn = screen.getByRole("button", { name: "Close Inspector" });
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("visualization-inspector")).not.toBeInTheDocument();
  });

  it("shows completion banner on final step with replay action", () => {
    renderEngine();

    const step5Dot = screen.getByRole("button", { name: "Jump to step 5" });
    fireEvent.click(step5Dot);

    expect(screen.getByTestId("vis-completed-banner")).toBeInTheDocument();

    // Click Replay button
    const replayBtn = screen.getByRole("button", { name: "পুনরায় দেখুন" });
    fireEvent.click(replayBtn);

    // Returned to step 1
    expect(screen.getByText(/ধাপ 1 \/ 5/i)).toBeInTheDocument();
  });

  it("responds to keyboard shortcuts (j for next, k for prev, r for reset)", () => {
    renderEngine();

    // Press j (next)
    fireEvent.keyDown(window, { key: "j" });
    expect(screen.getByText(/ধাপ 2 \/ 5/i)).toBeInTheDocument();

    // Press k (prev)
    fireEvent.keyDown(window, { key: "k" });
    expect(screen.getByText(/ধাপ 1 \/ 5/i)).toBeInTheDocument();

    // Advance then press r (reset)
    fireEvent.keyDown(window, { key: "j" });
    fireEvent.keyDown(window, { key: "r" });
    expect(screen.getByText(/ধাপ 1 \/ 5/i)).toBeInTheDocument();
  });
});
