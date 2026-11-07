import React from "react";
import { Cpu } from "lucide-react";
import { useTranslation } from "@/i18n";
import { UnderTheHoodBlock as UnderTheHoodBlockType } from "../../types/lesson.types";
import "./UnderTheHoodBlock.css";

export interface UnderTheHoodBlockProps {
  data: UnderTheHoodBlockType;
}

export const UnderTheHoodBlock: React.FC<UnderTheHoodBlockProps> = ({ data }) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const explanation = locale === "bn" ? data.explanationBn : data.explanationEn;
  const technicalNote = locale === "bn" ? data.technicalNoteBn : data.technicalNoteEn;

  return (
    <div className="kodara-hood" data-testid="under-the-hood-block">
      <div className="kodara-hood__header">
        <Cpu size={16} style={{ color: "#FF5E1E" }} />
        <span className="kodara-hood__badge">
          {locale === "bn" ? "আন্ডার দ্য হুড" : "Under the Hood"}
        </span>
        <h3 className="kodara-hood__title">{title}</h3>
      </div>

      <p className="kodara-hood__intro">{explanation}</p>

      <div className="kodara-hood__pipeline">
        {data.pipelineSteps.map((step, idx) => (
          <div key={idx} className="kodara-hood__step-card">
            <div className="kodara-hood__step-title">
              {locale === "bn" ? step.titleBn : step.titleEn}
            </div>
            <div className="kodara-hood__step-desc">
              {locale === "bn" ? step.descBn : step.descEn}
            </div>
          </div>
        ))}
      </div>

      <div className="kodara-hood__note">
        <strong>⚡ {locale === "bn" ? "কারিগরি পর্যবেক্ষণ:" : "Engineering Insight:"}</strong>{" "}
        {technicalNote}
      </div>
    </div>
  );
};
