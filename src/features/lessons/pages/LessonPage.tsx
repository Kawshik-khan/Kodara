import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, List, X } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/Button";
import {
  getLesson,
  getPreviousLesson,
  getNextLesson,
} from "@/content/curriculum/curriculumRegistry";
import { useLessonProgress } from "../hooks/useLessonProgress";
import { LessonBreadcrumbs } from "../components/LessonBreadcrumbs";
import { LessonHeader } from "../components/LessonHeader";
import { LessonProgress } from "../components/LessonProgress";
import { LessonNavigation } from "../components/LessonNavigation";
import { LessonContent } from "../components/LessonContent";
import { LessonContextPanel } from "../components/LessonContextPanel";
import { LessonFooter } from "../components/LessonFooter";
import { PracticeSessionModal } from "@/features/assessment/components/practice/PracticeSessionModal";
import { ChallengeRunner } from "@/features/assessment/components/challenges/ChallengeRunner";
import { mockPracticeRepository } from "@/features/assessment/repositories/MockPracticeRepository";
import { mockChallengeRepository } from "@/features/assessment/repositories/MockChallengeRepository";
import "./LessonPage.css";

export const LessonPage: React.FC = () => {
  const { trackId = "typescript", lessonSlug = "variables" } = useParams<{
    trackId: string;
    lessonSlug: string;
  }>();
  const { locale } = useTranslation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  const lesson = getLesson(trackId, lessonSlug);

  const {
    progress,
    activeSectionId,
    setActiveSectionId,
    markSectionComplete,
    markLessonComplete,
    toggleBookmark,
    isSectionCompleted,
  } = useLessonProgress({
    lessonId: lesson ? lesson.id : "unknown",
    totalSections: lesson ? lesson.sections.length : 1,
  });

  if (!lesson) {
    return (
      <div className="kodara-lesson-page">
        <div className="kodara-lesson-page__not-found" data-testid="lesson-not-found">
          <BookOpen size={42} style={{ color: "#FF5E1E" }} />
          <h2>
            {locale === "bn"
              ? "অনুরোধকৃত লেসনটি পাওয়া যায়নি"
              : "Lesson Not Found"}
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 440 }}>
            {locale === "bn"
              ? "আপনি যে লেসনটিতে প্রবেশের চেষ্টা করছেন তা এই ট্র্যাকে উপস্থিত নেই অথবা সরানো হয়েছে।"
              : "The requested lesson is not registered in this track or might have been relocated."}
          </p>
          <Link to={`/learn/${trackId}`}>
            <Button variant="solid" size="md">
              <ArrowLeft size={16} />
              <span>
                {locale === "bn" ? "ট্র্যাক ওভারভিউতে ফিরুন" : "Back to Track Overview"}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Active Challenge Full Workspace Mode
  if (activeChallengeId) {
    const activeChallenge = mockChallengeRepository.getById(activeChallengeId);
    if (activeChallenge) {
      return (
        <ChallengeRunner
          challenge={activeChallenge}
          onBack={() => setActiveChallengeId(null)}
          onComplete={() => {
            handleCompleteLesson();
          }}
        />
      );
    }
  }

  const previousLesson = getPreviousLesson(trackId, lessonSlug);
  const nextLesson = getNextLesson(trackId, lessonSlug);
  const practiceQuestions = mockPracticeRepository.getByLessonId(lesson.id);

  const trackTitle =
    locale === "bn" ? lesson.trackId.toUpperCase() : lesson.trackId.toUpperCase();
  const moduleTitle =
    locale === "bn" ? lesson.moduleTitleBn : lesson.moduleTitleEn;
  const lessonTitle = locale === "bn" ? lesson.titleBn : lesson.titleEn;

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setMobileDrawerOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCompleteLesson = () => {
    if (lesson) {
      markLessonComplete(lesson.sections.map((sec) => sec.id));
    }
  };

  return (
    <div className="kodara-lesson-page" data-testid="lesson-page">
      <div className="kodara-lesson-page__layout">
        {/* Left Column: Lesson Navigation */}
        <LessonNavigation
          sections={lesson.sections}
          activeSectionId={activeSectionId}
          isSectionCompleted={isSectionCompleted}
          onSelectSection={handleSelectSection}
        />

        {/* Center Column: Main Learning Experience */}
        <main className="kodara-lesson-page__center">
          <LessonBreadcrumbs
            trackTitle={trackTitle}
            trackId={trackId}
            moduleTitle={moduleTitle}
            lessonTitle={lessonTitle}
          />

          <LessonHeader lesson={lesson} />

          <LessonProgress
            completedCount={progress.completedSectionIds.length}
            totalCount={lesson.sections.length}
            percent={progress.progressPercent}
          />

          <LessonContent
            sections={lesson.sections}
            isSectionCompleted={isSectionCompleted}
            onMarkSectionComplete={markSectionComplete}
          />

          <LessonFooter
            lessonId={lesson.id}
            isCompleted={progress.isCompleted}
            onCompleteLesson={handleCompleteLesson}
            previousLesson={previousLesson}
            nextLesson={nextLesson}
            onStartPractice={() => setIsPracticeOpen(true)}
            onStartChallenge={(cid) => setActiveChallengeId(cid)}
          />
        </main>

        {/* Right Column: Context & Metadata Panel */}
        <LessonContextPanel
          lesson={lesson}
          isBookmarked={progress.isBookmarked}
          onToggleBookmark={toggleBookmark}
        />
      </div>

      {/* Practice Session Modal */}
      {isPracticeOpen && (
        <PracticeSessionModal
          isOpen={isPracticeOpen}
          onClose={() => setIsPracticeOpen(false)}
          questions={practiceQuestions}
          targetId={lesson.id}
        />
      )}

      {/* Mobile Navigation Trigger Button */}
      <button
        type="button"
        className="kodara-lesson-page__mobile-nav-trigger"
        onClick={() => setMobileDrawerOpen(true)}
      >
        <List size={16} />
        <span>{locale === "bn" ? "সূচিপত্র" : "Contents"}</span>
      </button>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="kodara-lesson-page__mobile-drawer-overlay"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="kodara-lesson-page__mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 12,
                borderBottom: "1px solid var(--border-card-subtle)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {locale === "bn" ? "লেসন সূচিপত্র" : "Lesson Contents"}
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {lesson.sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleSelectSection(sec.id)}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid transparent",
                    background:
                      sec.id === activeSectionId ? "#FFF1EB" : "transparent",
                    color:
                      sec.id === activeSectionId
                        ? "#FF5E1E"
                        : "var(--text-primary)",
                    fontWeight: sec.id === activeSectionId ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {locale === "bn" ? sec.titleBn : sec.titleEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
