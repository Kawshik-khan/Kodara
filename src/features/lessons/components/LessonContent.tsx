import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "@/i18n";
import { LessonSection, LessonBlock } from "../types/lesson.types";
import { ExplanationBlock } from "./blocks/ExplanationBlock";
import { CodeBlock } from "./blocks/CodeBlock";
import { CodeWalkthrough } from "./blocks/CodeWalkthrough";
import { VisualizationBlock } from "./blocks/VisualizationBlock";
import { ComparisonBlock } from "./blocks/ComparisonBlock";
import { UnderTheHoodBlock } from "./blocks/UnderTheHoodBlock";
import { MistakeBlock } from "./blocks/MistakeBlock";
import { EngineeringNoteBlock } from "./blocks/EngineeringNoteBlock";
import { PracticeBlock } from "./blocks/PracticeBlock";
import { SummaryBlock } from "./blocks/SummaryBlock";
import { ChartBlock, CodeTraceBlock, FaqBlock } from "./blocks/LabBlocks";
import "./LessonContent.css";

export interface LessonContentProps {
  sections: LessonSection[];
  isSectionCompleted: (sectionId: string) => boolean;
  onMarkSectionComplete: (sectionId: string) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  sections,
  isSectionCompleted,
  onMarkSectionComplete,
}) => {
  const { locale } = useTranslation();

  const renderBlock = (block: LessonBlock) => {
    switch (block.type) {
      case "explanation":
        return <ExplanationBlock key={block.id} data={block} />;
      case "code":
        return <CodeBlock key={block.id} data={block} />;
      case "code-walkthrough":
        return <CodeWalkthrough key={block.id} data={block} />;
      case "visualization":
        return <VisualizationBlock key={block.id} data={block} />;
      case "comparison":
        return <ComparisonBlock key={block.id} data={block} />;
      case "under-the-hood":
        return <UnderTheHoodBlock key={block.id} data={block} />;
      case "mistake":
        return <MistakeBlock key={block.id} data={block} />;
      case "engineering-note":
        return <EngineeringNoteBlock key={block.id} data={block} />;
      case "practice":
        return <PracticeBlock key={block.id} data={block} />;
      case "summary":
        return <SummaryBlock key={block.id} data={block} />;
      case "code-trace":
        return <CodeTraceBlock key={block.id} data={block} />;
      case "chart":
        return <ChartBlock key={block.id} data={block} />;
      case "faq":
        return <FaqBlock key={block.id} data={block} />;
      default:
        return null;
    }
  };

  return (
    <div className="kodara-lesson-content" data-testid="lesson-content">
      {sections.map((section) => {
        const isDone = isSectionCompleted(section.id);
        const sectionTitle = locale === "bn" ? section.titleBn : section.titleEn;

        return (
          <section
            key={section.id}
            id={section.id}
            className="kodara-lesson-section"
            data-testid={`lesson-section-${section.id}`}
          >
            <div className="kodara-lesson-section__header">
              <h2 className="kodara-lesson-section__title">{sectionTitle}</h2>
              <button
                type="button"
                className={`kodara-lesson-section__complete-btn ${
                  isDone ? "kodara-lesson-section__complete-btn--done" : ""
                }`}
                onClick={() => onMarkSectionComplete(section.id)}
                aria-label={`Mark ${sectionTitle} as complete`}
              >
                <Check size={13} />
                <span>
                  {isDone
                    ? locale === "bn"
                      ? "সম্পন্ন হয়েছে"
                      : "Completed"
                    : locale === "bn"
                    ? "সম্পন্ন হিসেবে চিহ্নিত করুন"
                    : "Mark Complete"}
                </span>
              </button>
            </div>

            <div className="kodara-lesson-section__blocks">
              {section.blocks.map(renderBlock)}
            </div>
          </section>
        );
      })}
    </div>
  );
};
