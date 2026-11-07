import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useTranslation } from "@/i18n";
import { highlightPythonLine } from "@/features/code-trace/core/highlightPython";
import { ChartDefinition, ChartParams, ChartTone } from "../types/chart.types";
import "./ParametricChart.css";

export interface ParametricChartProps {
  definition: ChartDefinition;
}

// SVG layout in viewBox units
const W = 640;
const H = 380;
const X0 = 64;
const X1 = 616;
const Y0 = 22;
const Y1 = 318;
const SWEEP_MS = 5000;

const TONE: Record<ChartTone, string> = {
  accent: "var(--accent-primary, #FF5E1E)",
  info: "var(--color-info, #0284C7)",
  success: "var(--color-success, #16A34A)",
  danger: "var(--color-danger, #DC2626)",
};

const formatTick = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export const ParametricChart: React.FC<ParametricChartProps> = ({ definition: def }) => {
  const { t, locale } = useTranslation();
  const pick = (text: { en: string; bn: string }) => (locale === "bn" ? text.bn : text.en);
  const [view, setView] = useState<"live" | "manim">("live");
  const [x, setX] = useState(def.x.initial);
  const [params, setParams] = useState<ChartParams>(() =>
    Object.fromEntries(def.params.map((p) => [p.id, p.defaultValue]))
  );
  const [sweeping, setSweeping] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const sweepRef = useRef<number | null>(null);

  const sx = (v: number) => X0 + ((v - def.x.min) / (def.x.max - def.x.min)) * (X1 - X0);
  const sy = (v: number) => {
    const clamped = Math.max(def.y.min, Math.min(def.y.max, v));
    return Y1 - ((clamped - def.y.min) / (def.y.max - def.y.min)) * (Y1 - Y0);
  };

  const paths = useMemo(
    () =>
      def.series.map((s) => {
        let d = "";
        const n = 120;
        for (let i = 0; i <= n; i++) {
          const xv = def.x.min + ((def.x.max - def.x.min) * i) / n;
          d += `${i ? "L" : "M"}${sx(xv).toFixed(1)} ${sy(s.fn(xv, params)).toFixed(1)}`;
        }
        return d;
      }),
    [def, params]
  );
  const paramsKey = JSON.stringify(params);

  const stopSweep = () => {
    if (sweepRef.current !== null) cancelAnimationFrame(sweepRef.current);
    sweepRef.current = null;
    setSweeping(false);
  };
  useEffect(() => () => stopSweep(), []);

  const startSweep = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = x >= def.x.max ? def.x.min : x;
    if (reduce) {
      setX(def.x.max);
      return;
    }
    const t0 = performance.now();
    const dur = ((def.x.max - from) / (def.x.max - def.x.min)) * SWEEP_MS;
    setSweeping(true);
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      setX(Math.round((from + (def.x.max - from) * k) / def.x.step) * def.x.step);
      if (k < 1) sweepRef.current = requestAnimationFrame(tick);
      else stopSweep();
    };
    sweepRef.current = requestAnimationFrame(tick);
  };

  const setFromPointer = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM?.();
    if (!svg || !ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    const raw = def.x.min + ((loc.x - X0) / (X1 - X0)) * (def.x.max - def.x.min);
    const snapped = Math.round(raw / def.x.step) * def.x.step;
    setX(Math.max(def.x.min, Math.min(def.x.max, snapped)));
  };

  const yTicks: number[] = [];
  for (let v = def.y.min; v <= def.y.max; v += def.y.tickStep) yTicks.push(v);
  const xTicks: number[] = [];
  for (let v = def.x.min; v <= def.x.max; v += def.x.tickStep) xTicks.push(v);

  const markers = def.series.filter((s) => s.marker).map((s) => ({ s, y: s.fn(x, params) }));
  const guideTop = Math.min(...markers.map((m) => sy(m.y)), Y1);
  const xLabel = `${formatTick(x)}${def.x.unit ?? ""}`;
  const insight = pick(def.insight(x, params));
  const fmt = (v: number, f: "int" | "euro") =>
    f === "euro" ? `€${Math.round(v).toLocaleString("en")}` : String(Math.round(v));

  return (
    <div className="kodara-chart" data-testid="parametric-chart">
      <div className="kodara-chart__header">
        <div className="kodara-chart__heading">
          <div className="kodara-chart__title-row">
            <span className="kodara-chart__badge">{t("lab.chart.badge")}</span>
            <h3 className="kodara-chart__title">{locale === "bn" ? def.titleBn : def.titleEn}</h3>
          </div>
          <p className="kodara-chart__subtitle">{locale === "bn" ? def.subtitleBn : def.subtitleEn}</p>
        </div>
        {def.manim && (
          <div className="kodara-chart__seg" role="tablist" aria-label={t("lab.chart.view")}>
            <button type="button" role="tab" aria-selected={view === "live"} onClick={() => setView("live")}>
              {t("lab.chart.interactive")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "manim"}
              onClick={() => {
                stopSweep();
                setView("manim");
              }}
            >
              {t("lab.chart.manim")}
            </button>
          </div>
        )}
      </div>

      {view === "manim" && def.manim ? (
        <div className="kodara-chart__manim">
          <p className="kodara-chart__how">
            {t("lab.chart.renderWith")} <code>{def.manim.command}</code> · {pick(def.manim.note)}
          </p>
          <pre className="kodara-chart__source">
            {def.manim.source.replace(/\n$/, "").split("\n").map((line, i) => (
              <div key={i}>{line ? highlightPythonLine(line) : " "}</div>
            ))}
          </pre>
        </div>
      ) : (
        <>
          <div className="kodara-chart__bento">
            <div className="kodara-chart__canvas">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={insight}
                onPointerDown={(e) => {
                  stopSweep();
                  (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                  setFromPointer(e);
                }}
                onPointerMove={(e) => {
                  if (e.buttons) setFromPointer(e);
                }}
              >
                {yTicks.map((v) => (
                  <g key={`y${v}`}>
                    <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} className={v === def.y.min ? "kodara-chart__axis" : "kodara-chart__grid"} />
                    <text x={X0 - 8} y={sy(v) + 4} textAnchor="end" className="kodara-chart__tick">{formatTick(v)}</text>
                  </g>
                ))}
                {xTicks.map((v) => (
                  <g key={`x${v}`}>
                    <line x1={sx(v)} x2={sx(v)} y1={Y1} y2={Y1 + 5} className="kodara-chart__axis" />
                    <text x={sx(v)} y={Y1 + 19} textAnchor="middle" className="kodara-chart__tick">
                      {formatTick(v)}{def.x.unit ?? ""}
                    </text>
                  </g>
                ))}
                <line x1={X0} x2={X0} y1={Y0 - 6} y2={Y1} className="kodara-chart__axis" />
                <text x={(X0 + X1) / 2} y={H - 14} textAnchor="middle" className="kodara-chart__axis-label">{pick(def.x.label)}</text>
                <text x={16} y={(Y0 + Y1) / 2} textAnchor="middle" transform={`rotate(-90 16 ${(Y0 + Y1) / 2})`} className="kodara-chart__axis-label">
                  {pick(def.y.label)}
                </text>

                {def.series.map((s, i) => (
                  <path
                    key={`${s.id}-${paramsKey}`}
                    d={paths[i]}
                    pathLength={1}
                    className={`kodara-chart__series${s.dashed ? " is-dashed" : " is-drawn"}`}
                    style={{ stroke: TONE[s.tone] }}
                  />
                ))}

                <g transform={`translate(${X0 + 14},${Y0 + 8})`}>
                  <rect x={-8} y={-6} width={236} height={def.series.length * 20 + 10} rx={6} className="kodara-chart__legend" />
                  {[...def.series].reverse().map((s, i) => (
                    <g key={s.id}>
                      <line x1={0} x2={22} y1={8 + i * 20} y2={8 + i * 20} strokeWidth={3} strokeDasharray={s.dashed ? "6 5" : undefined} style={{ stroke: TONE[s.tone] }} />
                      <text x={30} y={12 + i * 20} className="kodara-chart__legend-text">{pick(s.label(params))}</text>
                    </g>
                  ))}
                </g>

                <line x1={sx(x)} x2={sx(x)} y1={Y1} y2={guideTop} className="kodara-chart__guide" />
                {markers.map(({ s, y }) => {
                  const px = sx(x);
                  const py = sy(y);
                  if (s.marker === "dot") {
                    return (
                      <g key={s.id}>
                        <circle cx={px} cy={py} r={5} className="kodara-chart__dot" style={{ stroke: TONE[s.tone] }} />
                        <text x={Math.min(px + 10, X1 - 70)} y={Math.min(Y1 - 8, py + 18)} className="kodara-chart__dot-label" style={{ fill: TONE[s.tone] }}>
                          {Math.round(y)} {s.markerUnit ? pick(s.markerUnit) : ""}
                        </text>
                      </g>
                    );
                  }
                  const label = String(Math.round(y));
                  const w = label.length * 8 + 16;
                  const tx = Math.min(px + 10, X1 - w);
                  const ty = Math.max(Y0, py - 34);
                  return (
                    <g key={s.id}>
                      <circle cx={px} cy={py} r={6.5} className="kodara-chart__marker" style={{ fill: TONE[s.tone] }} />
                      <rect x={tx} y={ty} width={w} height={24} rx={4} className="kodara-chart__tag" />
                      <text x={tx + 8} y={ty + 16.5} className="kodara-chart__tag-text">{label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="kodara-chart__side">
              <div className="kodara-chart__panel">
                <label className="kodara-chart__label" htmlFor={`${def.id}-x`}>{pick(def.x.tracker)}</label>
                <div className="kodara-chart__big-row">
                  <span className="kodara-chart__big">{xLabel}</span>
                  <button type="button" className="kodara-chart__sweep" onClick={() => (sweeping ? stopSweep() : startSweep())}>
                    {sweeping ? <Pause size={14} /> : <Play size={14} />}
                    <span>
                      {sweeping
                        ? t("lab.chart.pause")
                        : t("lab.chart.sweep")
                            .replace("{from}", `${def.x.min}`)
                            .replace("{to}", `${def.x.max}${def.x.unit ?? ""}`)}
                    </span>
                  </button>
                </div>
                <input
                  id={`${def.id}-x`}
                  type="range"
                  className="kodara-chart__slider"
                  min={def.x.min}
                  max={def.x.max}
                  step={def.x.step}
                  value={x}
                  onChange={(e) => {
                    stopSweep();
                    setX(Number(e.target.value));
                  }}
                />
              </div>

              {def.params.map((p) => (
                <div key={p.id} className="kodara-chart__panel">
                  <span className="kodara-chart__label" id={`${def.id}-${p.id}`}>{pick(p.label)}</span>
                  <div className="kodara-chart__seg" role="group" aria-labelledby={`${def.id}-${p.id}`}>
                    {p.options.map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={params[p.id] === v}
                        onClick={() => setParams((cur) => ({ ...cur, [p.id]: v }))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {def.bars && (
                <div className="kodara-chart__panel kodara-chart__bars">
                  {def.barsTitle && <span className="kodara-chart__label">{pick(def.barsTitle)}</span>}
                  {def.bars.map((group) => (
                    <div key={group.label.en} className="kodara-chart__bar-group">
                      <span className="kodara-chart__bar-title">{pick(group.label)}</span>
                      {group.items.map((item) => {
                        const v = item.value(x, params);
                        return (
                          <div key={item.label} className="kodara-chart__bar">
                            <span>{item.label}</span>
                            <span className="kodara-chart__track">
                              <span
                                className="kodara-chart__fill"
                                style={{ width: `${Math.min(100, (v / group.scaleMax) * 100)}%`, background: TONE[item.tone] }}
                              />
                            </span>
                            <span className="kodara-chart__bar-value">{fmt(v, group.format)}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="kodara-chart__formula">{def.formula}</div>
          <p className="kodara-chart__insight" aria-live="polite" data-testid="chart-insight">{insight}</p>
          <p className="kodara-chart__modeled">{pick(def.modeledNote)}</p>
        </>
      )}
    </div>
  );
};
