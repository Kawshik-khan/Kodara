import React, { useEffect, useMemo, useRef, useState } from "react";
import { Copy, ScanLine } from "lucide-react";
import { useTranslation } from "@/i18n";
import { useVisualizationPlayback } from "@/features/visualization/hooks/useVisualizationPlayback";
import { VisualizationControls } from "@/features/visualization/components/VisualizationControls";
import {
  CodeTraceDefinition,
  TraceScenarioMeta,
  TraceStep,
  TraceValue,
} from "../types/trace.types";
import { formatValue, initialStepIndex, resolveNote } from "../core/explain";
import { highlightPythonLine, renderInlineCode } from "../core/highlightPython";
import "./CodeTracePlayer.css";

export interface CodeTracePlayerProps {
  definition: CodeTraceDefinition;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export const CodeTracePlayer: React.FC<CodeTracePlayerProps> = ({ definition }) => {
  const { t, locale } = useTranslation();
  const [scenarioId, setScenarioId] = useState(definition.scenarios[0]?.id);
  const scenario = definition.scenarios.find((s) => s.id === scenarioId) ?? definition.scenarios[0];

  return (
    <div className="kodara-trace" data-testid="code-trace-player">
      <div className="kodara-trace__header">
        <div className="kodara-trace__heading">
          <div className="kodara-trace__title-row">
            <span className="kodara-trace__badge">{t("lab.trace.badge")}</span>
            <h3 className="kodara-trace__title">
              {locale === "bn" ? definition.titleBn : definition.titleEn}
            </h3>
          </div>
          <p className="kodara-trace__subtitle">
            {locale === "bn" ? definition.descriptionBn : definition.descriptionEn}
          </p>
        </div>
        {definition.scenarios.length > 1 && (
          <div className="kodara-trace__scenarios" role="group" aria-label={t("lab.trace.scenario")}>
            {definition.scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === scenario.id}
                onClick={() => setScenarioId(s.id)}
              >
                {locale === "bn" ? s.title.bn : s.title.en}
              </button>
            ))}
          </div>
        )}
      </div>

      <TraceStage key={scenario.id} definition={definition} scenario={scenario} />

      <p className="kodara-trace__recorded">
        <ScanLine size={13} />
        <span>{t("lab.trace.recorded").replace("{python}", definition.trace.python)}</span>
      </p>
    </div>
  );
};

interface TraceStageProps {
  definition: CodeTraceDefinition;
  scenario: TraceScenarioMeta;
}

const TraceStage: React.FC<TraceStageProps> = ({ definition, scenario }) => {
  const { t, locale } = useTranslation();
  const steps = definition.trace.scenarios[scenario.id] ?? [];
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const { playbackState, goToStep, nextStep, prevStep, reset, togglePlay, setSpeed } =
    useVisualizationPlayback({
      totalSteps: steps.length,
      initialStepIndex: initialStepIndex(steps, scenario.initialStep),
      scopeRef: rootRef,
    });

  const index = playbackState.currentStepIndex;
  const step = steps[index];
  const prev: TraceStep | undefined = steps[index - 1];
  const note = step ? resolveNote(definition, steps, index) : undefined;
  const pick = (text: { en: string; bn: string }) => (locale === "bn" ? text.bn : text.en);

  const lines = useMemo(
    () => definition.trace.source.split("\n").map((line) => highlightPythonLine(line)),
    [definition.trace.source]
  );
  const seen = useMemo(() => new Set(steps.slice(0, index).map((s) => s.line)), [steps, index]);

  // keep the current line centred inside the code panel (never scroll the page)
  const currentLine = step?.line;
  const centerCurrentLine = useRef<(smooth: boolean) => void>(() => {});
  centerCurrentLine.current = (smooth) => {
    const body = bodyRef.current;
    const el = body?.querySelector<HTMLElement>(`[data-line="${currentLine}"]`);
    if (!body || !el || typeof body.scrollTo !== "function") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    body.scrollTo({
      top: Math.max(0, el.offsetTop - body.clientHeight / 2 + el.offsetHeight / 2),
      behavior: smooth && !reduce ? "smooth" : "auto",
    });
  };
  useEffect(() => centerCurrentLine.current(true), [currentLine]);
  // re-centre without animation once layout settles: panel resizes, web fonts load
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const settle = () => centerCurrentLine.current(false);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(settle) : null;
    observer?.observe(body);
    document.fonts?.ready.then(settle).catch(() => {});
    return () => observer?.disconnect();
  }, []);

  const [copyLabel, setCopyLabel] = useState<string | null>(null);
  const copySource = () => {
    navigator.clipboard
      ?.writeText(definition.trace.source)
      .then(() => setCopyLabel(t("lab.trace.copied")))
      .catch(() => {
        const range = document.createRange();
        if (bodyRef.current) range.selectNodeContents(bodyRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        setCopyLabel(t("lab.trace.selected"));
      })
      .finally(() => window.setTimeout(() => setCopyLabel(null), 1800));
  };

  if (!step) return null;

  const renderValue = (key: string, value: TraceValue, before: TraceValue | undefined) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return t("lab.trace.empty");
      const known = Array.isArray(before) ? before.length : value.length;
      return (
        <ol className="kodara-trace__list">
          {value.map((item, i) => (
            <li key={i} className={prev && i >= known ? "is-new" : undefined}>
              {formatValue(item).replace(/\s+/g, " ").trim()}
            </li>
          ))}
        </ol>
      );
    }
    if (value && typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) return "{}";
      return entries.map(([k, v]) => (
        <span key={k} className="kodara-trace__entry">
          {k}: {formatValue(v)}
        </span>
      ));
    }
    if (key === "state") return <span className="kodara-trace__state">{formatValue(value)}</span>;
    return formatValue(value);
  };

  return (
    <div className="kodara-trace__stage" ref={rootRef}>
      <div className="kodara-trace__grid">
        <div className="kodara-trace__code">
          <div className="kodara-trace__code-head">
            <span className="kodara-trace__path">{definition.displayPath}</span>
            <span className="kodara-trace__own">{t("lab.trace.courseCode")}</span>
            <button type="button" className="kodara-trace__copy" onClick={copySource}>
              <Copy size={13} />
              <span>{copyLabel ?? t("lab.trace.copy")}</span>
            </button>
          </div>
          <div
            className="kodara-trace__code-body"
            ref={bodyRef}
            tabIndex={0}
            aria-label={t("lab.trace.sourceLabel")}
          >
            {lines.map((tokens, i) => {
              const n = i + 1;
              const current = n === step.line;
              const cls = current ? ` is-current is-${step.event}` : seen.has(n) ? " is-seen" : "";
              return (
                <div key={n} data-line={n} className={`kodara-trace__line${cls}`} aria-current={current ? "step" : undefined}>
                  <span className="kodara-trace__num">{n}</span>
                  <span className="kodara-trace__src">{tokens.length ? tokens : " "}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="kodara-trace__note" aria-live="polite" data-testid="trace-note">
            <div className="kodara-trace__note-top">
              <span className="kodara-trace__step">
                {index + 1}/{steps.length}
              </span>
              <span className={`kodara-trace__event is-${step.event}`}>
                {t(`lab.trace.event.${step.event}`)}
              </span>
            </div>
            <p className="kodara-trace__what">
              {renderInlineCode(
                note ? pick(note.what) : t("lab.trace.runningLine").replace("{line}", String(step.line))
              )}
            </p>
            {(note?.why || note?.without) && (
              <dl className="kodara-trace__rows">
                {note.why && (
                  <>
                    <dt className="is-why">{t("lab.trace.why")}</dt>
                    <dd>{renderInlineCode(pick(note.why))}</dd>
                  </>
                )}
                {note.without && (
                  <>
                    <dt className="is-without">{t("lab.trace.without")}</dt>
                    <dd>{renderInlineCode(pick(note.without))}</dd>
                  </>
                )}
              </dl>
            )}
            {note?.ref && (
              <div className="kodara-trace__ref">
                {t("lab.trace.inBook")}: <b>{note.ref}</b>
              </div>
            )}
        </div>

        <div className="kodara-trace__side">
          <div>
            <div className="kodara-trace__label">{t("lab.trace.callStack")}</div>
            <div className="kodara-trace__cards">
              {[...step.frames].reverse().map((frame, ri) => {
                const depth = step.frames.length - 1 - ri;
                const before = prev?.frames[depth]?.fn === frame.fn ? prev.frames[depth].locals : undefined;
                const entries = Object.entries(frame.locals);
                return (
                  <div key={`${frame.fn}-${depth}`} className={`kodara-trace__card${ri === 0 ? " is-top" : ""}`}>
                    <div className="kodara-trace__card-head">
                      <span>{frame.fn}()</span>
                      <span>line {frame.line}</span>
                    </div>
                    <div className="kodara-trace__kv">
                      {entries.length === 0 ? (
                        <span className="kodara-trace__muted">{t("lab.trace.noLocals")}</span>
                      ) : (
                        entries.map(([k, v]) => (
                          <React.Fragment key={k}>
                            <span className="kodara-trace__k">{k}</span>
                            <span className={`kodara-trace__v${before && before[k] !== v ? " is-changed" : ""}`}>{v}</span>
                          </React.Fragment>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="kodara-trace__label">{t("lab.trace.objects")}</div>
            <div className="kodara-trace__cards">
              {Object.entries(step.objects).map(([name, attrs]) => {
                const before = prev?.objects[name];
                return (
                  <div key={name} className="kodara-trace__card">
                    <div className="kodara-trace__card-head">
                      <span>
                        {name}
                        {definition.objectTypes?.[name] ? `: ${definition.objectTypes[name]}` : ""}
                      </span>
                    </div>
                    <div className="kodara-trace__kv">
                      {Object.entries(attrs).map(([k, v]) => (
                        <React.Fragment key={k}>
                          <span className="kodara-trace__k">{k}</span>
                          <span className={`kodara-trace__v${before && !same(before[k], v) ? " is-changed" : ""}`}>
                            {renderValue(k, v, before?.[k])}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <VisualizationControls
        playbackState={playbackState}
        onNext={nextStep}
        onPrev={prevStep}
        onReset={reset}
        onTogglePlay={togglePlay}
        onSeek={goToStep}
        onSetSpeed={setSpeed}
      />
    </div>
  );
};
