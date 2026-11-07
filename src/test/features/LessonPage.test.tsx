import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/i18n";
import { LessonPage } from "@/features/lessons/pages/LessonPage";

const renderLessonPage = (initialEntries: string[] = ["/learn/typescript/variables"]) => {
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
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/learn/:trackId/:lessonSlug" element={<LessonPage />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe("LessonPage component", () => {
  it("renders typescript variables lesson with all core sections and header metadata", async () => {
    renderLessonPage(["/learn/typescript/variables"]);

    // Track badge and title
    expect(screen.getByText("TYPESCRIPT")).toBeInTheDocument();
    expect(screen.getAllByText("ভেরিয়েবল: বাইন্ডিং, মেমোরি এবং স্কোপ").length).toBeGreaterThan(0);

    // Context Panel items
    expect(screen.getByText(/বুকমার্ক করুন|বুকমার্কড/i)).toBeInTheDocument();
    expect(screen.getAllByText(/লেক্সিক্যাল স্কোপ/i).length).toBeGreaterThan(0);

    // Navigation sections exist in sidebar and content
    expect(screen.getAllByText("১. ভেরিয়েবল কী?").length).toBeGreaterThan(0);
    expect(screen.getAllByText("২. বাইন্ডিং বনাম ভ্যালু").length).toBeGreaterThan(0);

    // Check practice question works
    const practiceOption = screen.getByText(/const এনভায়রনমেন্ট রেকর্ডে আইডেন্টিফায়ারের রি-অ্যাসাইনমেন্ট প্রতিহত করে/i);
    expect(practiceOption).toBeInTheDocument();
    fireEvent.click(practiceOption);

    // Feedback explanation appears
    expect(
      screen.getByText(/বাইন্ডিং স্লটটি তার প্রাথমিক রেফারেন্সে লক হয়ে যায়/i)
    ).toBeInTheDocument();
  });

  it("renders 404 lesson not found state for invalid slug", () => {
    renderLessonPage(["/learn/typescript/non-existent-lesson"]);

    expect(screen.getByText("অনুরোধকৃত লেসনটি পাওয়া যায়নি")).toBeInTheDocument();
    expect(screen.getByText("ট্র্যাক ওভারভিউতে ফিরুন")).toBeInTheDocument();
  });

  it("renders typescript type narrowing gold standard reference lesson", async () => {
    renderLessonPage(["/learn/typescript/narrowing"]);

    // Track badge and title
    expect(screen.getByText("TYPESCRIPT")).toBeInTheDocument();
    expect(screen.getAllByText(/টাইপ ন্যারোয়িং এবং কন্ট্রোল ফ্লো অ্যানালাইসিস/i).length).toBeGreaterThan(0);

    // Section 1: Problem / Section 2: Mental model
    expect(screen.getAllByText(/১\. সূচনা: টাইপ ন্যারোয়িং কেন প্রয়োজন\?/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/২\. মেন্টাল মডেল: অসম্ভব সম্ভাবনা ছাঁটাই/i).length).toBeGreaterThan(0);

    // Visualizer step 1
    expect(screen.getByText(/ধাপ ১: সার্বিক ইউনিয়ন \(অনিশ্চয়তা\)/i)).toBeInTheDocument();

    // Practice options
    expect(screen.getByText(/৬ নম্বর লাইনে কোনো এরর নেই; '\"fly\" in animal' সফলভাবে Bird এ ন্যারো করে/i)).toBeInTheDocument();

    // Challenge section
    expect(screen.getAllByText(/৯\. চ্যালেঞ্জ: নিরাপদ স্টেট রিডিউসার বাস্তবায়ন/i).length).toBeGreaterThan(0);
  });
});

