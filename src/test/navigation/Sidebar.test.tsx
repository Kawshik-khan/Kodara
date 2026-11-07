import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Sidebar } from "@/components/navigation/Sidebar";
import { I18nProvider } from "@/i18n";

describe("Sidebar component", () => {
  it("renders navigation items in Bangla by default", () => {
    render(
      <I18nProvider>
        <BrowserRouter>
          <Sidebar collapsed={false} onToggleCollapse={vi.fn()} />
        </BrowserRouter>
      </I18nProvider>
    );

    // Default locale is Bangla ("bn")
    expect(screen.getByText("ড্যাশবোর্ড")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("calls onToggleCollapse when collapse button is clicked", async () => {
    const handleToggle = vi.fn();
    render(
      <I18nProvider>
        <BrowserRouter>
          <Sidebar collapsed={false} onToggleCollapse={handleToggle} />
        </BrowserRouter>
      </I18nProvider>
    );

    const toggleBtn = screen.getByRole("button", { name: /collapse sidebar/i });
    await userEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
