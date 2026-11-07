import React from "react";
import { Wrench } from "lucide-react";
import { useTranslation } from "@/i18n";
import { EngineeringNoteBlock as EngineeringNoteBlockType } from "../../types/lesson.types";
import "./EngineeringNoteBlock.css";

export interface EngineeringNoteBlockProps {
  data: EngineeringNoteBlockType;
}

export const EngineeringNoteBlock: React.FC<EngineeringNoteBlockProps> = ({
  data,
}) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const content = locale === "bn" ? data.contentBn : data.contentEn;
  const recommendation =
    locale === "bn"
      ? data.recommendationBn || data.recommendationEn
      : data.recommendationEn;

  return (
    <div className="kodara-eng-note" data-testid="engineering-note-block">
      <div className="kodara-eng-note__header">
        <Wrench size={16} style={{ color: "#FF5E1E" }} />
        <span className="kodara-eng-note__badge">
          {locale === "bn" ? "ইঞ্জিনিয়ারিং নোট" : "Engineering Note"}
        </span>
        <span className="kodara-eng-note__title">{title}</span>
      </div>

      <p className="kodara-eng-note__content">{content}</p>

      {recommendation && (
        <div className="kodara-eng-note__recommendation">
          👉 {recommendation}
        </div>
      )}
    </div>
  );
};
