import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/i18n";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe("DashboardPage component", () => {
  it("renders loading skeleton initially and loads bento grid cards", async () => {
    renderDashboard();

    // Verify bento elements appear once loaded (default locale is Bangla)
    const varElements = await screen.findAllByText(/Variables/i);
    expect(varElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/68%/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TypeScript/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/সফটওয়্যার কীভাবে কাজ করে/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Type Narrowing/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("learning-streak-card")).toBeInTheDocument();
    expect(screen.getAllByText(/দিন/i).length).toBeGreaterThan(0);
  });
});




