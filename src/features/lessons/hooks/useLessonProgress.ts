import { useState, useCallback, useEffect } from "react";
import { LessonProgress } from "../types/lesson.types";
import {
  ProgressRepository,
  defaultProgressRepository,
} from "../services/progressRepository";

export interface UseLessonProgressOptions {
  lessonId: string;
  totalSections: number;
  initialSectionId?: string;
  repository?: ProgressRepository;
}

export function useLessonProgress({
  lessonId,
  totalSections,
  initialSectionId = "section-1",
  repository = defaultProgressRepository,
}: UseLessonProgressOptions) {
  const [progress, setProgress] = useState<LessonProgress>(() =>
    repository.getLessonProgress(lessonId)
  );

  const [activeSectionId, setActiveSectionId] = useState<string>(
    progress.currentSectionId || initialSectionId
  );

  // Sync state if lessonId changes
  useEffect(() => {
    const current = repository.getLessonProgress(lessonId);
    setProgress(current);
    if (current.currentSectionId) {
      setActiveSectionId(current.currentSectionId);
    }
  }, [lessonId, repository]);

  const markSectionComplete = useCallback(
    (sectionId: string) => {
      const updated = repository.markSectionComplete(
        lessonId,
        sectionId,
        totalSections
      );
      setProgress(updated);
    },
    [lessonId, totalSections, repository]
  );

  const markLessonComplete = useCallback(
    (sectionIds?: string[]) => {
      const updated = repository.markLessonComplete(lessonId, sectionIds);
      setProgress(updated);
    },
    [lessonId, repository]
  );

  const toggleBookmark = useCallback(() => {
    const nextBookmarked = repository.toggleBookmark(lessonId);
    setProgress((prev) => ({ ...prev, isBookmarked: nextBookmarked }));
    return nextBookmarked;
  }, [lessonId, repository]);

  const isSectionCompleted = useCallback(
    (sectionId: string) => {
      return progress.completedSectionIds.includes(sectionId);
    },
    [progress.completedSectionIds]
  );

  return {
    progress,
    activeSectionId,
    setActiveSectionId,
    markSectionComplete,
    markLessonComplete,
    toggleBookmark,
    isSectionCompleted,
  };
}

