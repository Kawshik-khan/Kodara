import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VariableRuntimeVisualizer } from "@/features/lessons/components/visualizations/VariableRuntimeVisualizer";
import { I18nProvider } from "@/i18n";

describe("VariableRuntimeVisualizer", () => {
  it("renders pipeline nodes and initial state in default let mode", () => {
    render(
      <I18nProvider>
        <VariableRuntimeVisualizer />
      </I18nProvider>
    );

    expect(screen.getByText("সোর্স কোড")).toBeInTheDocument();
    expect(screen.getByText("এনভায়রনমেন্ট বাইন্ডিং")).toBeInTheDocument();
    expect(screen.getByText("মেমোরি ভ্যালু")).toBeInTheDocument();
    expect(screen.getByText("let count = 10;")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /পরবর্তী/i })).toBeInTheDocument();
  });

  it("steps through execution using stepper controls", () => {
    render(
      <I18nProvider>
        <VariableRuntimeVisualizer />
      </I18nProvider>
    );

    const nextButton = screen.getByRole("button", { name: /পরবর্তী/i });
    fireEvent.click(nextButton);

    // Should now be on step 2 (reassignment: let count = 20;)
    expect(screen.getByText("count = 20;")).toBeInTheDocument();
  });

  it("handles const mode and surfaces runtime error on reassignment attempt", () => {
    render(
      <I18nProvider>
        <VariableRuntimeVisualizer />
      </I18nProvider>
    );

    // Switch mode to const
    const constButton = screen.getByRole("button", { name: /const \(immutable\)/i });
    fireEvent.click(constButton);

    // Step to reassignment
    const nextButton = screen.getByRole("button", { name: /পরবর্তী/i });
    fireEvent.click(nextButton);

    // Should demonstrate const reassignment error
    expect(screen.getByText(/অপরিবর্তনীয় বাইন্ডিং তৈরি করে/i)).toBeInTheDocument();
  });
});
