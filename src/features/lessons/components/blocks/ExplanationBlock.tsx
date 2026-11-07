import React from "react";
import { useTranslation } from "@/i18n";
import { ExplanationBlock as ExplanationBlockType } from "../../types/lesson.types";
import "./ExplanationBlock.css";

export interface ExplanationBlockProps {
  data: ExplanationBlockType;
}

export const ExplanationBlock: React.FC<ExplanationBlockProps> = ({ data }) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const content = locale === "bn" ? data.contentBn : data.contentEn;
  const keyIdea = locale === "bn" ? data.keyIdeaBn || data.keyIdeaEn : data.keyIdeaEn;

  return (
    <div className="kodara-explanation" data-testid="explanation-block">
      {title && <h3 className="kodara-explanation__title">{title}</h3>}
      <p className="kodara-explanation__content">{content}</p>

      {keyIdea && (
        <div className="kodara-explanation__key-idea">
          <span className="kodara-explanation__key-label">
            💡 {locale === "bn" ? "মূল ধারণা" : "Key Idea"}
          </span>
          <span className="kodara-explanation__key-text">{keyIdea}</span>
        </div>
      )}
    </div>
  );
};
