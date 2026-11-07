import React from "react";
import { AlertCircle, ChevronDown, MessagesSquare } from "lucide-react";
import { useTranslation } from "@/i18n";
import {
  ChartBlock as ChartBlockType,
  CodeTraceBlock as CodeTraceBlockType,
  FaqBlock as FaqBlockType,
} from "../../types/lesson.types";
import { defaultTraceRegistry } from "@/features/code-trace/core/registry";
import { CodeTracePlayer } from "@/features/code-trace/components/CodeTracePlayer";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import { ParametricChart } from "@/features/charts/components/ParametricChart";
import "./LabBlocks.css";

const Missing: React.FC<{ message: string; id: string }> = ({ message, id }) => (
  <div className="kodara-lab-missing" role="alert">
    <AlertCircle size={18} />
    <span>{message}</span>
    <code>{id}</code>
  </div>
);

export const CodeTraceBlock: React.FC<{ data: CodeTraceBlockType }> = ({ data }) => {
  const { t } = useTranslation();
  const definition = defaultTraceRegistry.get(data.traceId);
  if (!definition) return <Missing message={t("lab.trace.notFound")} id={data.traceId} />;
  return <CodeTracePlayer definition={definition} />;
};

export const ChartBlock: React.FC<{ data: ChartBlockType }> = ({ data }) => {
  const { t } = useTranslation();
  const definition = defaultChartRegistry.get(data.chartId);
  if (!definition) return <Missing message={t("lab.chart.notFound")} id={data.chartId} />;
  return <ParametricChart definition={definition} />;
};

export const FaqBlock: React.FC<{ data: FaqBlockType }> = ({ data }) => {
  const { t, locale } = useTranslation();
  const bn = locale === "bn";
  return (
    <div className="kodara-faq" data-testid="faq-block">
      <div className="kodara-faq__head">
        <MessagesSquare size={16} />
        <span className="kodara-faq__badge">{t("lab.faq.badge")}</span>
        <h3>{bn ? data.titleBn : data.titleEn}</h3>
      </div>
      {data.items.map((item, i) => (
        <details key={i} className="kodara-faq__item" open={i === 0}>
          <summary>
            <span>{bn ? item.questionBn : item.questionEn}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <p>
            {bn ? item.answerBn : item.answerEn}
            {item.ref && <span className="kodara-faq__ref">{item.ref}</span>}
          </p>
        </details>
      ))}
    </div>
  );
};
