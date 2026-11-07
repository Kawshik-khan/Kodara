export interface TrackLessonItem {
  id: string;
  slug?: string;
  number: number;
  /** Shown instead of the zero-padded number, e.g. "02", "FC", "A–V". */
  label?: string;
  titleEn: string;
  titleBn: string;
  duration: string;
  /** "planned": listed in the outline but not authored yet. */
  status: "completed" | "in_progress" | "locked" | "planned";
}

export interface TrackModule {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  lessons: TrackLessonItem[];
}

export interface TrackDetail {
  id: string;
  titleEn: string;
  titleBn: string;
  taglineEn: string;
  taglineBn: string;
  descriptionEn: string;
  descriptionBn: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  modules: TrackModule[];
}
