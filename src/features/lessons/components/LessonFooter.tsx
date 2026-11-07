import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useTranslation } from "@/i18n";
import { PracticeCard } from "@/features/assessment/components/practice/PracticeCard";
import { ChallengeCard } from "@/features/assessment/components/challenges/ChallengeCard";
import { mockPracticeRepository } from "@/features/assessment/repositories/MockPracticeRepository";
import { mockChallengeRepository } from "@/features/assessment/repositories/MockChallengeRepository";
import "./LessonFooter.css";

export interface LessonFooterProps {
  lessonId: string;
  isCompleted: boolean;
  onCompleteLesson: () => void;
  previousLesson: { titleEn: string; titleBn: string; url: string } | null;
  nextLesson: { titleEn: string; titleBn: string; url: string } | null;
  onStartPractice?: () => void;
  onStartChallenge?: (challengeId: string) => void;
}

export const LessonFooter: React.FC<LessonFooterProps> = ({
  lessonId,
  isCompleted,
  onCompleteLesson,
  previousLesson,
  nextLesson,
  onStartPractice,
  onStartChallenge,
}) => {
  const { locale } = useTranslation();

  const practiceQuestions = mockPracticeRepository.getByLessonId(lessonId);
  const challenges = mockChallengeRepository.getByLessonId(lessonId);
  const primaryChallenge = challenges[0];

  return (
    <footer className="kodara-lesson-footer" data-testid="lesson-footer">
      {/* Practice & Challenge Section */}
      <div className="kodara-lesson-footer__assessment-grid">
        {practiceQuestions.length > 0 && (
          <PracticeCard
            questionCount={practiceQuestions.length}
            estimatedMinutes={Math.ceil(practiceQuestions.length * 1.5)}
            conceptNames={Array.from(new Set(practiceQuestions.flatMap((q) => q.conceptIds)))}
            onStartPractice={() => onStartPractice && onStartPractice()}
          />
        )}

        {primaryChallenge && (
          <ChallengeCard
            challenge={primaryChallenge}
            onStartChallenge={(cid) => onStartChallenge && onStartChallenge(cid)}
          />
        )}
      </div>

      {/* Lesson Complete Card */}
      <div className="kodara-lesson-footer__complete-card">
        <div className="kodara-lesson-footer__complete-title">
          <Award size={18} style={{ color: "#FF5E1E" }} />
          <span>
            {locale === "bn" ? "লেসন সমাপ্তি নিশ্চিতকরণ" : "Lesson Completion Summary"}
          </span>
        </div>

        <div className="kodara-lesson-footer__checklist">
          <div className="kodara-lesson-footer__check-item">
            <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
            <span>
              {locale === "bn"
                ? "ধারণাভিত্তিক প্র্যাকটিস সেশন সম্পন্ন করেছেন"
                : "Completed conceptual practice session"}
            </span>
          </div>

          <div className="kodara-lesson-footer__check-item">
            <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
            <span>
              {locale === "bn"
                ? "ইঞ্জিনিয়ারিং চ্যালেঞ্জ সমাধান নিশ্চিত করেছেন"
                : "Validated code against challenge test suite"}
            </span>
          </div>
        </div>

        <div className="kodara-lesson-footer__actions">
          <button
            type="button"
            className={`kodara-lesson-footer__complete-btn ${
              isCompleted ? "kodara-lesson-footer__complete-btn--done" : ""
            }`}
            onClick={onCompleteLesson}
          >
            <CheckCircle2 size={16} />
            <span>
              {isCompleted
                ? locale === "bn"
                  ? "✓ লেসন সম্পন্ন হয়েছে"
                  : "✓ Lesson Completed!"
                : locale === "bn"
                ? "লেসন সম্পন্ন হিসেবে চিহ্নিত করুন"
                : "Mark Lesson as Complete"}
            </span>
          </button>

          {nextLesson && (
            <Link
              to={nextLesson.url}
              className="kodara-lesson-footer__nav-link"
              onClick={() => {
                if (!isCompleted) {
                  onCompleteLesson();
                }
              }}
            >
              <span>{locale === "bn" ? "পরবর্তী লেসনে যান" : "Continue to Next Lesson"}</span>
              <ChevronRight size={15} />
            </Link>
          )}
        </div>
      </div>

      {/* Previous / Next Lesson Navigation */}
      <div className="kodara-lesson-footer__nav-row">
        {previousLesson ? (
          <Link to={previousLesson.url} className="kodara-lesson-footer__nav-link">
            <ChevronLeft size={15} />
            <span>{locale === "bn" ? previousLesson.titleBn : previousLesson.titleEn}</span>
          </Link>
        ) : (
          <div className="kodara-lesson-footer__nav-link kodara-lesson-footer__nav-link--disabled">
            <ChevronLeft size={15} />
            <span>{locale === "bn" ? "পূর্ববর্তী লেসন নেই" : "No Previous Lesson"}</span>
          </div>
        )}

        {nextLesson ? (
          <Link
            to={nextLesson.url}
            className="kodara-lesson-footer__nav-link"
            onClick={() => {
              if (!isCompleted) {
                onCompleteLesson();
              }
            }}
          >
            <span>{locale === "bn" ? nextLesson.titleBn : nextLesson.titleEn}</span>
            <ChevronRight size={15} />
          </Link>
        ) : (
          <div className="kodara-lesson-footer__nav-link kodara-lesson-footer__nav-link--disabled">
            <span>{locale === "bn" ? "পরবর্তী লেসন নেই" : "End of Module"}</span>
            <ChevronRight size={15} />
          </div>
        )}
      </div>
    </footer>
  );
};
