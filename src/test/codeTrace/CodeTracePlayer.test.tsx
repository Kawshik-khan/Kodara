import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import { CodeTracePlayer } from "@/features/code-trace/components/CodeTracePlayer";
import { ACI_REFUND_TRACE } from "@/content/courses/harness-playbook/ch02/aciRefund.trace";

const renderPlayer = () =>
  render(
    <I18nProvider>
      <CodeTracePlayer definition={ACI_REFUND_TRACE} />
    </I18nProvider>
  );

describe("CodeTracePlayer", () => {
  beforeEach(() => localStorage.clear());

  it("opens where the Timeout reaches run(), with what, why and the book reference", () => {
    renderPlayer();
    const note = screen.getByTestId("trace-note");
    expect(within(note).getByText("27/48")).toBeInTheDocument();
    expect(within(note).getByText("exception")).toBeInTheDocument();
    expect(note).toHaveTextContent("Timeout");
    expect(note).toHaveTextContent("কেন?");
    expect(note).toHaveTextContent("Unknown is not failed · p. 41");
    // the current line is highlighted in the code panel
    const current = document.querySelector('[aria-current="step"]');
    expect(current?.getAttribute("data-line")).toBe("87");
  });

  it("steps forward to the except clause and back", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByTestId("trace-note")).toHaveTextContent("except Timeout as err");
    fireEvent.click(screen.getByRole("button", { name: "Previous step" }));
    expect(screen.getByText("27/48")).toBeInTheDocument();
  });

  it("switches scenario and starts the naive retry at step 1", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Naive retry" }));
    expect(screen.getByText("1/19")).toBeInTheDocument();
    expect(screen.getByTestId("trace-note")).toHaveTextContent("range(1, 4)");
  });

  it("uses a scrubber instead of 48 timeline dots", () => {
    renderPlayer();
    const scrubber = screen.getByRole("slider", { name: "টাইমলাইন" });
    fireEvent.change(scrubber, { target: { value: "47" } });
    expect(screen.getByText("48/48")).toBeInTheDocument();
  });

  it("renders in English when the learner picked English", () => {
    localStorage.setItem("kodara_language", "en");
    renderPlayer();
    expect(screen.getByTestId("trace-note")).toHaveTextContent("Why");
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent(
      /Real trace: this exact file run under CPython \d+\.\d+/
    );
  });
});
