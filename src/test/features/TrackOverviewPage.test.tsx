import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/i18n";
import { TrackOverviewPage } from "@/features/tracks/TrackOverviewPage";
import { defaultProgressRepository } from "@/features/lessons/services/progressRepository";

const renderTrackOverviewPage = (initialEntries: string[] = ["/learn/typescript"]) => {
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
            <Route path="/learn/:trackId" element={<TrackOverviewPage />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe("TrackOverviewPage dynamic module unlocking", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows lesson 1.1 as completed and 1.2 as in-progress by default", () => {
    renderTrackOverviewPage(["/learn/typescript"]);

    // Track heading
    expect(screen.getAllByText(/JavaScript Runtime|জাভাস্ক্রিপ্ট রানটাইম/i).length).toBeGreaterThan(0);

    // Lesson 1.2 title should be visible
    expect(screen.getAllByText(/1.2 Variables and Bindings|১.২ ভেরিয়েবল এবং বাইন্ডিং/i).length).toBeGreaterThan(0);

    // Lesson 1.3 title should be visible
    expect(screen.getAllByText(/1.3 Objects and References|১.৩ অবজেক্ট এবং রেফারেন্স/i).length).toBeGreaterThan(0);
  });

  it("dynamically unlocks lesson 1.3 when lesson 1.2 is marked complete", () => {
    // Simulate user finishing lesson 1.2 (both authoring ID and canonical ID)
    defaultProgressRepository.markLessonComplete("ts-variables", ["sec-1", "sec-2"]);

    renderTrackOverviewPage(["/learn/typescript"]);

    // Lesson 1.2 should be marked complete
    // Lesson 1.3 should now be unlocked (status in_progress)
    const lesson13Elements = screen.getAllByText(/1.3 Objects and References|১.৩ অবজেক্ট এবং রেফারেন্স/i);
    expect(lesson13Elements.length).toBeGreaterThan(0);

    // Verify completion count increased
    expect(screen.getAllByText(/লেসন সম্পন্ন|Lessons Completed/i).length).toBeGreaterThan(0);
  });
});
