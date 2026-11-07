import { LessonProgress } from "../types/lesson.types";
import {
  defaultCurriculumService,
  LEGACY_CURRICULUM_ALIASES,
} from "@/features/curriculum/services/curriculumService";

/**
 * ProgressRepository: Clean architectural abstraction for lesson progress and bookmark storage.
 * Decouples the UI completely from localStorage so it can easily swap with API/database persistence.
 */
export interface ProgressRepository {
  getLessonProgress(lessonId: string): LessonProgress;
  saveLessonProgress(progress: LessonProgress): void;
  markSectionComplete(
    lessonId: string,
    sectionId: string,
    totalSections: number
  ): LessonProgress;
  markLessonComplete(
    lessonId: string,
    sectionIds?: string[]
  ): LessonProgress;
  toggleBookmark(lessonId: string): boolean;
  isBookmarked(lessonId: string): boolean;
}

const PROGRESS_STORAGE_PREFIX = "kodara_progress_";
const BOOKMARK_STORAGE_KEY = "kodara_bookmarked_lessons";

/**
 * Resolve all known aliases, slugs, and canonical IDs for a given lessonId
 * to guarantee interoperability between authoring IDs and curriculum DAG IDs.
 */
export function getLessonAliases(lessonId: string): string[] {
  const aliases = new Set<string>([lessonId]);

  // 1. Direct legacy alias lookup
  const canonicalFromLegacy = LEGACY_CURRICULUM_ALIASES[lessonId];
  if (canonicalFromLegacy) {
    aliases.add(canonicalFromLegacy);
  }

  // 2. Reverse legacy alias lookup
  for (const [alias, canonical] of Object.entries(LEGACY_CURRICULUM_ALIASES)) {
    if (canonical === lessonId || (canonicalFromLegacy && canonical === canonicalFromLegacy)) {
      aliases.add(alias);
    }
  }

  // 3. Query CurriculumService metadata
  try {
    const meta = defaultCurriculumService.getLesson(lessonId);
    if (meta) {
      aliases.add(meta.id);
      if (meta.slug) aliases.add(meta.slug);
    }
  } catch {
    // Curriculum might not be loaded in early test setups
  }

  return Array.from(aliases);
}

export class LocalProgressRepository implements ProgressRepository {
  private memoryStore: Map<string, LessonProgress> = new Map();
  private memoryBookmarks: Set<string> = new Set();

  private isStorageAvailable(): boolean {
    try {
      return typeof window !== "undefined" && Boolean(window.localStorage);
    } catch {
      return false;
    }
  }

  getLessonProgress(lessonId: string): LessonProgress {
    const aliases = getLessonAliases(lessonId);

    // 1. Check storage across all known aliases (prefer completed / in-progress)
    if (this.isStorageAvailable()) {
      try {
        for (const alias of aliases) {
          const raw = window.localStorage.getItem(PROGRESS_STORAGE_PREFIX + alias);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && (parsed.isCompleted || parsed.progressPercent > 0)) {
              return { ...parsed, lessonId };
            }
          }
        }

        // Check direct key even if not completed
        const directRaw = window.localStorage.getItem(PROGRESS_STORAGE_PREFIX + lessonId);
        if (directRaw) {
          return JSON.parse(directRaw);
        }
      } catch {
        // Fallback to memory
      }
    }

    // 2. Check in-memory store
    for (const alias of aliases) {
      const inMem = this.memoryStore.get(alias);
      if (inMem && (inMem.isCompleted || inMem.progressPercent > 0)) {
        return { ...inMem, lessonId };
      }
    }

    const directInMem = this.memoryStore.get(lessonId);
    if (directInMem) return directInMem;

    // 3. Fallback initial unstarted state
    const initial: LessonProgress = {
      lessonId,
      completedSectionIds: [],
      currentSectionId: "section-1",
      progressPercent: 0,
      isCompleted: false,
      isBookmarked: this.isBookmarked(lessonId),
      lastVisitedAt: new Date().toISOString(),
    };

    return initial;
  }

  saveLessonProgress(progress: LessonProgress): void {
    const aliases = getLessonAliases(progress.lessonId);

    if (this.isStorageAvailable()) {
      try {
        for (const alias of aliases) {
          const toSave = { ...progress, lessonId: alias };
          window.localStorage.setItem(
            PROGRESS_STORAGE_PREFIX + alias,
            JSON.stringify(toSave)
          );
        }
      } catch {
        // Fallback
      }
    }

    for (const alias of aliases) {
      this.memoryStore.set(alias, { ...progress, lessonId: alias });
    }
  }

  markSectionComplete(
    lessonId: string,
    sectionId: string,
    totalSections: number
  ): LessonProgress {
    const current = this.getLessonProgress(lessonId);
    const completedSet = new Set(current.completedSectionIds);
    completedSet.add(sectionId);

    const completedSectionIds = Array.from(completedSet);
    const progressPercent = Math.min(
      100,
      Math.round((completedSectionIds.length / Math.max(1, totalSections)) * 100)
    );

    const updated: LessonProgress = {
      ...current,
      completedSectionIds,
      currentSectionId: sectionId,
      progressPercent,
      isCompleted: progressPercent >= 100,
      lastVisitedAt: new Date().toISOString(),
    };

    this.saveLessonProgress(updated);
    return updated;
  }

  markLessonComplete(
    lessonId: string,
    sectionIds?: string[]
  ): LessonProgress {
    const current = this.getLessonProgress(lessonId);
    const completedSectionIds =
      sectionIds && sectionIds.length > 0
        ? sectionIds
        : current.completedSectionIds;

    const updated: LessonProgress = {
      ...current,
      completedSectionIds,
      progressPercent: 100,
      isCompleted: true,
      lastVisitedAt: new Date().toISOString(),
    };

    this.saveLessonProgress(updated);
    return updated;
  }

  isBookmarked(lessonId: string): boolean {
    const aliases = getLessonAliases(lessonId);

    if (this.isStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (raw) {
          const list: string[] = JSON.parse(raw);
          return aliases.some((a) => list.includes(a));
        }
      } catch {
        // Fallback
      }
    }

    return aliases.some((a) => this.memoryBookmarks.has(a));
  }

  toggleBookmark(lessonId: string): boolean {
    const aliases = getLessonAliases(lessonId);
    const currentlyBookmarked = this.isBookmarked(lessonId);
    const nextBookmarked = !currentlyBookmarked;

    if (this.isStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
        let list: string[] = raw ? JSON.parse(raw) : [];
        if (nextBookmarked) {
          for (const a of aliases) {
            if (!list.includes(a)) list.push(a);
          }
        } else {
          list = list.filter((id) => !aliases.includes(id));
        }
        window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(list));
      } catch {
        // Fallback
      }
    }

    if (nextBookmarked) {
      for (const a of aliases) this.memoryBookmarks.add(a);
    } else {
      for (const a of aliases) this.memoryBookmarks.delete(a);
    }

    // Also update cached lesson progress if it exists
    const current = this.getLessonProgress(lessonId);
    this.saveLessonProgress({ ...current, isBookmarked: nextBookmarked });

    return nextBookmarked;
  }
}

export const defaultProgressRepository = new LocalProgressRepository();

