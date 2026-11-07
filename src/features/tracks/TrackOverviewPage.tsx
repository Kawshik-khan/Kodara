import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  Terminal,
  Code2,
  X,
  BookOpen,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { useTranslation } from "@/i18n";
import { ROUTES } from "@/config/routes";
import {
  defaultCurriculumService,
  LEGACY_CURRICULUM_ALIASES,
} from "@/features/curriculum/services/curriculumService";
import { PrerequisiteExplanation } from "@/features/curriculum/types/curriculum.types";
import { TRACK_DATA } from "./trackData";
import { TrackDetail, TrackLessonItem, TrackModule } from "./types";
import "./TrackOverviewPage.css";

interface SelectedLockedLessonInfo {
  id: string;
  title: string;
  explanation: PrerequisiteExplanation;
  targetPrereqLessonSlug?: string;
  targetPrereqLessonTitle?: string;
}

/**
 * Load and normalize all completed lesson IDs and aliases from localStorage.
 */
function loadCompletedLessonIds(): string[] {
  const list = new Set<string>(["ts.01.how-js-ts-differ", "how-js-ts-differ"]);
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith("kodara_progress_")) {
          const raw = window.localStorage.getItem(key);
          if (raw) {
            const data = JSON.parse(raw);
            if (data.isCompleted || (data.progressPercent && data.progressPercent >= 100)) {
              const rawId = data.lessonId || key.replace("kodara_progress_", "");
              list.add(rawId);

              // Add canonical ID and slug
              const meta = defaultCurriculumService.getLesson(rawId);
              if (meta) {
                list.add(meta.id);
                if (meta.slug) list.add(meta.slug);
              }
              const canonical = LEGACY_CURRICULUM_ALIASES[rawId];
              if (canonical) {
                list.add(canonical);
              }
              for (const [alias, c] of Object.entries(LEGACY_CURRICULUM_ALIASES)) {
                if (c === rawId || (canonical && c === canonical)) {
                  list.add(alias);
                }
              }
            }
          }
        }
      }
    } catch {
      // Fallback to baseline
    }
  }
  return Array.from(list);
}

export const TrackOverviewPage: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const [selectedLockedLesson, setSelectedLockedLesson] =
    useState<SelectedLockedLessonInfo | null>(null);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(loadCompletedLessonIds);

  useEffect(() => {
    setCompletedLessonIds(loadCompletedLessonIds());
    const handleStorage = () => setCompletedLessonIds(loadCompletedLessonIds());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const currentTrack = trackId ? TRACK_DATA[trackId] : TRACK_DATA["typescript"];

  // Dynamically compute module and lesson statuses, progress counts, and unlock states
  const track = useMemo<TrackDetail>(() => {
    if (!currentTrack || currentTrack.id !== "typescript") {
      return currentTrack || TRACK_DATA["typescript"];
    }

    const graph = defaultCurriculumService.getCurriculum();
    const completedSet = new Set(completedLessonIds);

    // Lessons unlocked according to the curriculum DAG
    const availableLessons = defaultCurriculumService.getAvailableLessons({
      completedLessonIds,
      masteredConceptIds: [],
    });
    const availableSet = new Set(availableLessons.map((l) => l.id));

    let completedCount = 0;
    const modules: TrackModule[] = graph.modules.map((mod, modIdx) => {
      const modLessons = graph.lessons.filter((l) => l.moduleId === mod.id);
      return {
        id: mod.id,
        number: mod.order || modIdx + 1,
        titleEn: mod.titleEn,
        titleBn: mod.titleBn,
        descriptionEn: mod.descriptionEn,
        descriptionBn: mod.descriptionBn,
        lessons: modLessons.map((l): TrackLessonItem => {
          const isDone =
            completedSet.has(l.id) ||
            Boolean(l.slug && completedSet.has(l.slug)) ||
            (l.id === "ts.01.how-js-ts-differ" && completedSet.has("ts.01.how-js-ts-differ"));

          if (isDone) {
            completedCount++;
          }

          // Unlocked if completed, or in availableSet, or no hard prerequisites, or baseline first 2 lessons
          const isUnlocked =
            isDone ||
            availableSet.has(l.id) ||
            l.prerequisites.length === 0 ||
            l.id === "ts.01.how-js-ts-differ" ||
            l.id === "ts.01.variables-and-bindings";

          const status: "completed" | "in_progress" | "locked" = isDone
            ? "completed"
            : isUnlocked
            ? "in_progress"
            : "locked";

          return {
            id: l.id,
            slug: l.slug,
            number: l.order,
            titleEn: l.titleEn,
            titleBn: l.titleBn,
            duration: `${l.estimatedMinutes} min`,
            status,
          };
        }),
      };
    });

    const totalLessons = graph.lessons.length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      ...currentTrack,
      completedLessons: completedCount,
      totalLessons,
      progressPercent,
      modules,
    };
  }, [currentTrack, completedLessonIds]);

  // Compute recommended lesson for resume / start button
  const recommendedLesson = useMemo(() => {
    if (track.id !== "typescript") return null;
    return defaultCurriculumService.getRecommendedLesson({
      completedLessonIds,
      masteredConceptIds: [],
    });
  }, [track.id, completedLessonIds]);

  if (!currentTrack) {
    return (
      <PageContainer>
        <div className="track-not-found">
          <h2>{locale === "bn" ? "ট্র্যাক পাওয়া যায়নি" : "Track Not Found"}</h2>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="solid" size="md">
              <ArrowLeft size={16} />
              <span>{t("common.backToDashboard")}</span>
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const title = locale === "bn" ? track.titleBn : track.titleEn;
  const tagline = locale === "bn" ? track.taglineBn : track.taglineEn;
  const description = locale === "bn" ? track.descriptionBn : track.descriptionEn;

  const handleLessonClick = (lesson: TrackLessonItem) => {
    const lessonTitle = locale === "bn" ? lesson.titleBn : lesson.titleEn;

    if (track.id === "typescript") {
      if (lesson.status !== "locked") {
        navigate(`/learn/typescript/${lesson.slug || lesson.id}`);
        return;
      }

      // If locked, compute prerequisite explanation and show modal
      const explanation = defaultCurriculumService.explainPrerequisites(
        lesson.id,
        { completedLessonIds },
        locale === "bn" ? "bn" : "en"
      );

      let targetPrereqLessonSlug: string | undefined;
      let targetPrereqLessonTitle: string | undefined;

      for (const item of explanation.items) {
        if (!item.isMet) {
          if (item.targetType === "lesson") {
            const targetL = defaultCurriculumService.getLesson(item.id);
            if (targetL) {
              targetPrereqLessonSlug = targetL.slug || targetL.id;
              targetPrereqLessonTitle =
                locale === "bn" ? targetL.titleBn : targetL.titleEn;
              break;
            }
          } else if (item.targetType === "concept") {
            const c = defaultCurriculumService.getConcept(item.id);
            if (c && c.introducedInLessonId) {
              const targetL = defaultCurriculumService.getLesson(
                c.introducedInLessonId
              );
              if (targetL) {
                targetPrereqLessonSlug = targetL.slug || targetL.id;
                targetPrereqLessonTitle =
                  locale === "bn" ? targetL.titleBn : targetL.titleEn;
                break;
              }
            }
          }
        }
      }

      setSelectedLockedLesson({
        id: lesson.id,
        title: lessonTitle,
        explanation,
        targetPrereqLessonSlug,
        targetPrereqLessonTitle,
      });
      return;
    }

    // Other tracks: authored lessons open; planned and locked ones do nothing
    if (lesson.slug && lesson.status !== "locked" && lesson.status !== "planned") {
      navigate(`/learn/${track.id}/${lesson.slug}`);
      return;
    }
    if (lesson.status !== "locked" && lesson.status !== "planned") {
      alert(
        locale === "bn"
          ? `লেসন: "${lessonTitle}" — পরবর্তী মাইলস্টোনে ইন্টারঅ্যাক্টিভ ট্রেস ইঞ্জিন সহ যুক্ত হবে।`
          : `Lesson: "${lessonTitle}" — opens with interactive trace engine in the next milestone.`
      );
    }
  };

  const firstOpenLesson = track.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.slug && (l.status === "in_progress" || l.status === "completed"));

  return (
    <PageContainer>
      {/* Back to Dashboard Navigation */}
      <div className="track-back-nav">
        <Link to={ROUTES.DASHBOARD} className="track-back-link">
          <ArrowLeft size={16} />
          <span>{t("common.backToDashboard")}</span>
        </Link>
      </div>

      {/* Track Hero Banner */}
      <div className="track-hero">
        <div className="track-hero__badge-row">
          <Badge variant="orange" size="md">
            <Terminal size={12} />
            <span>KODARA TRACK</span>
          </Badge>
          <span className="track-hero__id">id: {track.id}</span>
        </div>

        <h1 className="track-hero__title">{title}</h1>
        <p className="track-hero__tagline">{tagline}</p>
        <p className="track-hero__description">{description}</p>

        <div className="track-hero__metrics">
          <div className="track-hero__metric">
            <span className="track-hero__metric-value">
              {track.completedLessons} / {track.totalLessons}
            </span>
            <span className="track-hero__metric-label">
              {locale === "bn" ? "লেসন সম্পন্ন" : "Lessons Completed"}
            </span>
          </div>

          <div className="track-hero__metric">
            <span className="track-hero__metric-value">{track.progressPercent}%</span>
            <span className="track-hero__metric-label">
              {locale === "bn" ? "সামগ্রিক অগ্রগতি" : "Overall Progress"}
            </span>
          </div>

          <div className="track-hero__progress-wrapper">
            <ProgressBar value={track.progressPercent} height={8} />
          </div>
        </div>

        <div className="track-hero__cta-row">
          <Button
            variant="solid"
            size="lg"
            onClick={() => {
              if (track.id === "typescript") {
                const targetSlug = recommendedLesson?.slug || "variables";
                navigate(`/learn/typescript/${targetSlug}`);
              } else if (firstOpenLesson?.slug) {
                navigate(`/learn/${track.id}/${firstOpenLesson.slug}`);
              } else {
                alert(
                  locale === "bn"
                    ? "পরবর্তী মাইলস্টোনে ১৬-স্টেপ ইন্টারঅ্যাক্টিভ লেসন রানটাইম ওপেন হবে।"
                    : "The 16-step interactive lesson runtime opens in the next milestone."
                );
              }
            }}
          >
            <Play size={18} />
            <span>
              {track.progressPercent > 0
                ? locale === "bn"
                  ? "চলমান লেসনে ফিরে যান"
                  : "Resume Current Lesson"
                : locale === "bn"
                ? "ট্র্যাক শুরু করুন"
                : "Start Track"}
            </span>
          </Button>

          <Link to={ROUTES.PLAYGROUND}>
            <Button variant="outline" size="lg">
              <Code2 size={18} />
              <span>{locale === "bn" ? "স্যান্ডবক্স খুলুন" : "Open in Sandbox"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Modules & Lessons Section */}
      <div className="track-modules-section">
        <h2 className="track-modules-title">
          {locale === "bn" ? "কোর্সওয়ার্ক মডিউল ও লেসনসমূহ" : "Curriculum Modules & Lessons"}
        </h2>

        <div className="track-modules-list">
          {track.modules.map((module) => {
            const modTitle = locale === "bn" ? module.titleBn : module.titleEn;
            const modDesc = locale === "bn" ? module.descriptionBn : module.descriptionEn;


            return (
              <Card key={module.id} className="track-module-card">
                <div className="track-module-card__header">
                  <div className="track-module-card__number">
                    <span>{String(module.number).padStart(2, "0")}</span>
                  </div>
                  <div className="track-module-card__header-text">
                    <h3 className="track-module-card__title">{modTitle}</h3>
                    <p className="track-module-card__desc">{modDesc}</p>
                  </div>
                </div>

                <div className="track-module-card__lessons">
                  {module.lessons.map((lesson) => {
                    const lessonTitle = locale === "bn" ? lesson.titleBn : lesson.titleEn;

                    return (
                      <div
                        key={lesson.id}
                        className={`track-lesson-item track-lesson-item--${lesson.status}`}
                        onClick={() => handleLessonClick(lesson)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleLessonClick(lesson);
                          }
                        }}
                      >
                        <div className="track-lesson-item__left">
                          {lesson.status === "completed" && (
                            <CheckCircle2 size={18} className="lesson-icon lesson-icon--completed" />
                          )}
                          {lesson.status === "in_progress" && (
                            <Play size={18} className="lesson-icon lesson-icon--in-progress" />
                          )}
                          {lesson.status === "locked" && (
                            <Lock size={18} className="lesson-icon lesson-icon--locked" />
                          )}
                          {lesson.status === "planned" && (
                            <Clock size={18} className="lesson-icon lesson-icon--locked" />
                          )}

                          <span className="track-lesson-item__number">
                            {lesson.label ?? String(lesson.number).padStart(2, "0")}
                          </span>
                          <span className="track-lesson-item__title">{lessonTitle}</span>
                        </div>

                        <div className="track-lesson-item__right">
                          {lesson.status === "locked" && (
                            <span className="track-lesson-item__prereq-badge">
                              {locale === "bn" ? "পূর্বশর্ত দেখুন" : "Prerequisites"}
                            </span>
                          )}

                          <span className="track-lesson-item__duration">
                            <Clock size={12} />
                            <span>{lesson.duration}</span>
                          </span>

                          <Badge
                            variant={
                              lesson.status === "completed"
                                ? "success"
                                : lesson.status === "in_progress"
                                ? "orange"
                                : "outline"
                            }
                            size="sm"
                          >
                            {lesson.status === "completed"
                              ? locale === "bn"
                                ? "সম্পন্ন"
                                : "Completed"
                              : lesson.status === "in_progress"
                              ? locale === "bn"
                                ? "চলমান"
                                : "In Progress"
                              : lesson.status === "planned"
                              ? t("common.comingSoonBadge")
                              : locale === "bn"
                              ? "লক করা"
                              : "Locked"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Prerequisite Explanation Modal */}
      {selectedLockedLesson && (
        <div
          className="prereq-modal-overlay"
          onClick={() => setSelectedLockedLesson(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="prereq-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prereq-modal-header">
              <div className="prereq-modal-header__title-row">
                <Lock size={18} className="prereq-modal-lock-icon" />
                <h3 className="prereq-modal-title">
                  {selectedLockedLesson.title}
                </h3>
              </div>
              <button
                className="prereq-modal-close"
                onClick={() => setSelectedLockedLesson(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="prereq-modal-body">
              <div className="prereq-modal-banner">
                <AlertCircle size={16} />
                <span>
                  {locale === "bn"
                    ? "এই লেসনটি আনলক করতে নিচের আবশ্যক পূর্বশর্তগুলো সম্পন্ন করতে হবে:"
                    : "Complete these required prerequisites to unlock this lesson:"}
                </span>
              </div>

              <div className="prereq-items-list">
                {selectedLockedLesson.explanation.items.length === 0 ? (
                  <p className="prereq-empty-text">
                    {locale === "bn"
                      ? "কোনো পূর্বশর্ত তালিকাভুক্ত নেই।"
                      : "No prerequisites listed."}
                  </p>
                ) : (
                  selectedLockedLesson.explanation.items.map((item) => {
                    const itemTitle = locale === "bn" ? item.titleBn : item.titleEn;
                    const itemReason = locale === "bn" ? item.reasonBn : item.reasonEn;

                    return (
                      <div
                        key={item.id}
                        className={`prereq-item-card ${
                          item.isMet ? "prereq-item-card--met" : "prereq-item-card--missing"
                        }`}
                      >
                        <div className="prereq-item-icon">
                          {item.isMet ? (
                            <CheckCircle2 size={16} className="text-success" />
                          ) : (
                            <div className="prereq-missing-dot" />
                          )}
                        </div>

                        <div className="prereq-item-content">
                          <div className="prereq-item-top">
                            <span className="prereq-item-title">{itemTitle}</span>
                            <div className="prereq-item-badges">
                              <Badge
                                variant={item.type === "hard" ? "orange" : "outline"}
                                size="sm"
                              >
                                {item.type === "hard"
                                  ? locale === "bn"
                                    ? "আবশ্যক"
                                    : "Required"
                                  : locale === "bn"
                                  ? "পরামর্শিত"
                                  : "Recommended"}
                              </Badge>
                              <Badge variant="outline" size="sm">
                                {item.targetType === "concept"
                                  ? locale === "bn"
                                    ? "ধারণা"
                                    : "Concept"
                                  : item.targetType === "lesson"
                                  ? locale === "bn"
                                    ? "লেসন"
                                    : "Lesson"
                                  : locale === "bn"
                                  ? "মডিউল"
                                  : "Module"}
                              </Badge>
                            </div>
                          </div>

                          {itemReason && (
                            <p className="prereq-item-reason">{itemReason}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="prereq-modal-footer">
              {selectedLockedLesson.targetPrereqLessonSlug ? (
                <Button
                  variant="solid"
                  size="md"
                  onClick={() => {
                    const slug = selectedLockedLesson.targetPrereqLessonSlug;
                    setSelectedLockedLesson(null);
                    if (slug) {
                      navigate(`/learn/typescript/${slug}`);
                    }
                  }}
                >
                  <BookOpen size={16} />
                  <span>
                    {locale === "bn"
                      ? `পূর্বশর্ত শুরু করুন: ${selectedLockedLesson.targetPrereqLessonTitle || ""}`
                      : `Start Prerequisite: ${selectedLockedLesson.targetPrereqLessonTitle || ""}`}
                  </span>
                  <ArrowRight size={14} />
                </Button>
              ) : (
                <Button
                  variant="solid"
                  size="md"
                  onClick={() => {
                    setSelectedLockedLesson(null);
                    const fallbackSlug = recommendedLesson?.slug || "variables";
                    navigate(`/learn/typescript/${fallbackSlug}`);
                  }}
                >
                  <BookOpen size={16} />
                  <span>
                    {locale === "bn" ? "ফাউন্ডেশন লেসন শুরু করুন" : "Start Foundation Lesson"}
                  </span>
                  <ArrowRight size={14} />
                </Button>
              )}

              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedLockedLesson(null)}
              >
                <span>{locale === "bn" ? "বন্ধ করুন" : "Close"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
