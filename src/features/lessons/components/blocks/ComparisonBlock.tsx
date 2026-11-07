import React from "react";
import { useTranslation } from "@/i18n";
import { ComparisonBlock as ComparisonBlockType } from "../../types/lesson.types";
import "./ComparisonBlock.css";

export interface ComparisonBlockProps {
  data: ComparisonBlockType;
}

export const ComparisonBlock: React.FC<ComparisonBlockProps> = ({ data }) => {
  const { locale } = useTranslation();

  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const footnote = locale === "bn" ? data.footnoteBn || data.footnoteEn : data.footnoteEn;

  return (
    <div className="kodara-comparison" data-testid="comparison-block">
      <div className="kodara-comparison__header">
        <div className="kodara-comparison__title">{title}</div>
      </div>

      <div className="kodara-comparison__table-wrap">
        <table className="kodara-comparison__table">
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th key={i} className="kodara-comparison__th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={idx} className="kodara-comparison__tr">
                <td className="kodara-comparison__td kodara-comparison__feature">
                  {locale === "bn" ? row.featureBn : row.featureEn}
                </td>
                {row.values.map((val, vIdx) => (
                  <td key={vIdx} className="kodara-comparison__td">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && <div className="kodara-comparison__footnote">{footnote}</div>}
    </div>
  );
};
