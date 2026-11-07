import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CodeBlock } from "@/features/lessons/components/blocks/CodeBlock";
import { I18nProvider } from "@/i18n";
import { CodeBlockData } from "@/features/lessons/types/lesson.types";

const sampleData: CodeBlockData = {
  id: "sample-block",
  type: "code",
  code: `let count = 10;
count = 20;`,
  language: "typescript",
  lineExplanationsEn: {
    1: "Declaration of mutable binding 'count'",
  },
  lineExplanationsBn: {
    1: "পরিবর্তনযোগ্য বাইন্ডিং 'count' এর ডিক্লেয়ারেশন",
  },
};

describe("CodeBlock component", () => {
  it("renders code with line numbers and language badge", () => {
    render(
      <I18nProvider>
        <CodeBlock data={sampleData} />
      </I18nProvider>
    );

    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("let")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy code to clipboard/i })).toBeInTheDocument();
  });

  it("toggles line explanation tray when clicking annotated line", () => {
    render(
      <I18nProvider>
        <CodeBlock data={sampleData} />
      </I18nProvider>
    );

    // Initial state: explanation tray is hidden
    expect(screen.queryByText(/পরিবর্তনযোগ্য বাইন্ডিং 'count'/i)).not.toBeInTheDocument();

    // Click on the interactive line container to toggle explanation
    const line1 = screen.getByText("let").closest(".kodara-code-block__line");
    expect(line1).not.toBeNull();
    fireEvent.click(line1!);

    // Explanation tray should now be visible
    expect(screen.getByText(/পরিবর্তনযোগ্য বাইন্ডিং 'count'/i)).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(line1!);
    expect(screen.queryByText(/পরিবর্তনযোগ্য বাইন্ডিং 'count'/i)).not.toBeInTheDocument();
  });
});
