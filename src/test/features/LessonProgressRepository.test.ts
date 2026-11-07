import { describe, it, expect, beforeEach } from "vitest";
import { LocalProgressRepository } from "@/features/lessons/services/progressRepository";

describe("LocalProgressRepository", () => {
  let repo: LocalProgressRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalProgressRepository();
  });

  it("returns default progress for unstarted lesson", () => {
    const progress = repo.getLessonProgress("ts-variables");
    expect(progress.lessonId).toBe("ts-variables");
    expect(progress.isCompleted).toBe(false);
    expect(progress.completedSectionIds).toEqual([]);
    expect(progress.isBookmarked).toBe(false);
  });

  it("marks a section as completed and computes progress percentage", () => {
    const totalSections = 4;
    const updated = repo.markSectionComplete("ts-variables", "v8-execution-pipeline", totalSections);
    expect(updated.completedSectionIds).toContain("v8-execution-pipeline");
    expect(updated.progressPercent).toBe(25);
    expect(updated.isCompleted).toBe(false);

    const retrieved = repo.getLessonProgress("ts-variables");
    expect(retrieved.completedSectionIds).toContain("v8-execution-pipeline");
  });

  it("marks all sections complete and flags lesson as completed", () => {
    const totalSections = 3;
    repo.markSectionComplete("ts-variables", "sec-1", totalSections);
    repo.markSectionComplete("ts-variables", "sec-2", totalSections);
    const finalProgress = repo.markSectionComplete("ts-variables", "sec-3", totalSections);

    expect(finalProgress.isCompleted).toBe(true);
    expect(finalProgress.progressPercent).toBe(100);
    expect(finalProgress.completedSectionIds).toEqual(["sec-1", "sec-2", "sec-3"]);
  });

  it("toggles bookmark state correctly", () => {
    expect(repo.isBookmarked("ts-variables")).toBe(false);

    const bookmarked = repo.toggleBookmark("ts-variables");
    expect(bookmarked).toBe(true);
    expect(repo.isBookmarked("ts-variables")).toBe(true);

    const unbookmarked = repo.toggleBookmark("ts-variables");
    expect(unbookmarked).toBe(false);
    expect(repo.isBookmarked("ts-variables")).toBe(false);
  });

  it("atomically completes lesson with markLessonComplete", () => {
    const updated = repo.markLessonComplete("ts-variables", ["sec-1", "sec-2", "sec-3"]);
    expect(updated.isCompleted).toBe(true);
    expect(updated.progressPercent).toBe(100);
    expect(updated.completedSectionIds).toEqual(["sec-1", "sec-2", "sec-3"]);

    const retrieved = repo.getLessonProgress("ts-variables");
    expect(retrieved.isCompleted).toBe(true);
    expect(retrieved.progressPercent).toBe(100);
  });

  it("resolves progress across authoring ID and canonical curriculum ID", () => {
    // Save progress using authoring ID
    repo.markLessonComplete("ts-variables", ["sec-1", "sec-2"]);

    // Query using canonical curriculum ID
    const canonicalProgress = repo.getLessonProgress("ts.01.variables-and-bindings");
    expect(canonicalProgress.isCompleted).toBe(true);
    expect(canonicalProgress.progressPercent).toBe(100);

    // Query using URL slug
    const slugProgress = repo.getLessonProgress("variables");
    expect(slugProgress.isCompleted).toBe(true);
  });
});

