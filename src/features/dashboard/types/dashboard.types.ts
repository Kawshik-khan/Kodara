export interface ContinueLearningData {
  trackId: string;
  trackBadgeText?: string;
  trackTitleEn: string;
  trackTitleBn: string;
  moduleNumber?: number;
  moduleTitleEn: string;
  moduleTitleBn: string;
  lessonNumber?: number;
  lessonTitleEn: string;
  lessonTitleBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  progressPercent: number;
  estimatedMinutesRemaining?: number;
  lessonSlug: string;
}

export interface TrackSummary {
  id: string;
  titleEn: string;
  titleBn: string;
  taglineEn?: string;
  taglineBn?: string;
  progressPercent: number;
  totalLessons?: number;
  completedLessons?: number;
  level?: "beginner" | "intermediate" | "advanced";
}

export interface ActivityItem {
  id: string;
  timestampEn: string;
  timestampBn: string;
  type: "lesson_completed" | "challenge_passed" | "concept_mastered" | "topic_explored";
  titleEn: string;
  titleBn: string;
  trackId?: string;
  meta?: string;
}

export interface Recommendation {
  id: string;
  titleEn: string;
  titleBn: string;
  basedOnEn?: string;
  basedOnBn?: string;
  tags?: string[];
  descriptionEn?: string;
  descriptionBn?: string;
  trackId: string;
  actionUrl: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface ProjectSummary {
  id: string;
  titleEn: string;
  titleBn: string;
  tag: string;
  descriptionEn?: string;
  descriptionBn?: string;
  progressPercent: number;
  status?: "in_progress" | "review" | "completed";
  trackId?: string;
  icon?: "cube" | "doc";
}

export interface StreakDay {
  dayEn: string;
  dayBn: string;
  completed: boolean;
}

export interface LearningStreakData {
  days: number;
  statusEn: string;
  statusBn: string;
  daysOfWeek: StreakDay[];
}

export interface WeeklyMetrics {
  lessonsCompleted: number;
  challengesSolved: number;
  timeMinutes: number;
  conceptsMastered: number;
  streakDays: number;
}

export interface SkillNode {
  id: string;
  labelEn: string;
  labelBn: string;
  status: "mastered" | "in_progress" | "available" | "locked";
  x: number;
  y: number;
}

export interface SkillConnection {
  from: string;
  to: string;
}

export interface SkillMapPreviewData {
  nodes: SkillNode[];
  connections: SkillConnection[];
  masteredCount: number;
  totalCount: number;
}

export interface DashboardData {
  userName: string;
  continueLearning: ContinueLearningData;
  tracks: TrackSummary[];
  recentActivity: ActivityItem[];
  recommendation: Recommendation;
  activeProjects: ProjectSummary[];
  streak: LearningStreakData;
  weekly: WeeklyMetrics;
  skillMap: SkillMapPreviewData;
}

