import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch04_retry_amplification.py?raw";

/**
 * Model (p. 98): when retries happen at multiple layers (model turn, delegated
 * worker, tool adapter), up to r attempts at each of L layers multiply into
 * up to r^L attempts (e.g., 4^3 = 64 attempts for one logical request).
 * An obligation-scoped controller keeps one retry locus capped at r attempts total.
 */

export function singleLayerExpectedAttempts(pFraction: number, r: number): number {
  const p = Math.max(0, Math.min(1, pFraction));
  let sum = 0;
  for (let k = 0; k < Math.floor(r); k++) sum += p ** k;
  return sum;
}

/** Expected provider hits per 100 tasks when L nested layers each retry up to r times. */
export function layeredExpectedHits(pFraction: number, r: number, layers: number): number {
  return 100 * singleLayerExpectedAttempts(pFraction, r) ** Math.floor(layers);
}

/** Expected provider hits per 100 tasks when one obligation-scoped budget owns all retries. */
export function obligationExpectedHits(pFraction: number, r: number): number {
  return 100 * singleLayerExpectedAttempts(pFraction, r);
}

const r = (params: ChartParams) => params.r;
const L = (params: ChartParams) => params.L;

export const RETRY_AMPLIFICATION_CHART: ChartDefinition = {
  id: "ai-engineering.harness.retry-amplification",
  titleEn: "Budget laundering & layered retry amplification",
  titleBn: "Budget laundering এবং বহু-স্তরের retry গুণন",
  subtitleEn: "Retries at several layers (model loop × subagent × tool adapter) multiply. An obligation-scoped ledger enforces one retry ceiling across all layers (p. 98).",
  subtitleBn: "একাধিক স্তরে (model loop × subagent × tool adapter) আলাদা retry থাকলে সেগুলো গুণিতক হারে বাড়ে। Obligation-ভিত্তিক ledger সব স্তর মিলিয়ে একটাই সীমা বজায় রাখে (p. 98)।",
  x: {
    min: 0,
    max: 90,
    tickStep: 15,
    unit: "%",
    label: { en: "Per-attempt failure rate (p)", bn: "প্রতি চেষ্টায় ব্যর্থতার হার (p)" },
    tracker: { en: "Failure rate (p)", bn: "ব্যর্থতার হার (p)" },
    initial: 50,
    step: 5,
  },
  y: {
    min: 0,
    max: 4000,
    tickStep: 1000,
    label: { en: "Expected calls per 100 tasks", bn: "প্রতি ১০০ task-এ গড় কল" },
  },
  params: [
    { id: "r", label: { en: "Attempts per layer / budget (r)", bn: "প্রতি স্তরে সর্বোচ্চ চেষ্টা (r)" }, options: [2, 3, 4], defaultValue: 4 },
    { id: "L", label: { en: "Retry layers (L)", bn: "Retry-এর স্তর সংখ্যা (L)" }, options: [1, 2, 3], defaultValue: 3 },
  ],
  series: [
    {
      id: "obligation",
      label: (params) => ({
        en: `Obligation-scoped ledger (max ${r(params)} attempts total)`,
        bn: `Obligation-ভিত্তিক ledger (মোট সর্বোচ্চ ${r(params)} বার চেষ্টা)`,
      }),
      tone: "success",
      marker: "dot",
      markerUnit: { en: "calls", bn: "কল" },
      fn: (x, params) => obligationExpectedHits(x / 100, r(params)),
    },
    {
      id: "layered",
      label: (params) => ({
        en: `Layered retries (${r(params)}^${L(params)} = ${r(params) ** L(params)} max per task)`,
        bn: `বহু-স্তরের retry (প্রতি task-এ সর্বোচ্চ ${r(params)}^${L(params)} = ${r(params) ** L(params)} বার)`,
      }),
      tone: "danger",
      marker: "tag",
      fn: (x, params) => Math.min(4000, layeredExpectedHits(x / 100, r(params), L(params))),
    },
  ],
  barsTitle: { en: "Per 100 tasks at this failure rate", bn: "এই ব্যর্থতার হারে প্রতি ১০০ task-এ" },
  bars: [
    {
      label: { en: "Expected provider calls", bn: "গড় provider কল" },
      scaleMax: 4000,
      format: "int",
      items: [
        { label: "Obligation ledger", tone: "success", value: (x, params) => obligationExpectedHits(x / 100, r(params)) },
        { label: "Layered retries", tone: "danger", value: (x, params) => layeredExpectedHits(x / 100, r(params), L(params)) },
      ],
    },
    {
      label: { en: "Extra amplified calls (laundered budget)", bn: "গুণিতক হারে বাড়তি কল (অতিরিক্ত খরচ)" },
      scaleMax: 4000,
      format: "int",
      items: [
        { label: "Obligation ledger", tone: "success", value: () => 0 },
        {
          label: "Layered retries",
          tone: "accent",
          value: (x, params) => layeredExpectedHits(x / 100, r(params), L(params)) - obligationExpectedHits(x / 100, r(params)),
        },
      ],
    },
    {
      label: { en: "Worst-case ceiling per task (when p → 100%)", bn: "প্রতি task-এ সর্বোচ্চ সম্ভাব্য কল (p → 100%)" },
      scaleMax: 64,
      format: "int",
      items: [
        { label: "Obligation ledger", tone: "info", value: (_, params) => r(params) },
        { label: "Layered retries", tone: "danger", value: (_, params) => r(params) ** L(params) },
      ],
    },
  ],
  formula: "E[calls_obligation] = 100 · Σ(k=0..r−1) p^k    ·    E[calls_layered] = 100 · (Σ(k=0..r−1) p^k)^L",
  insight: (x, params) => {
    const p = x / 100;
    const gov = Math.round(obligationExpectedHits(p, r(params)));
    const lay = Math.round(layeredExpectedHits(p, r(params), L(params)));
    const worst = r(params) ** L(params);
    return {
      en: `At p = ${x}% failure rate with r = ${r(params)} attempts across L = ${L(params)} layers, independent retries fire ${lay} expected calls per 100 tasks (and up to ${worst} calls on a single failing task). When one obligation-scoped ledger owns the budget across model, subagent and adapter, expected calls stay at ${gov} per 100 tasks (capped at ${r(params)} per task).`,
      bn: `p = ${x}% ব্যর্থতার হারে L = ${L(params)}টি স্তরে প্রতিটিতে r = ${r(params)} বার চেষ্টা করলে প্রতি ১০০ task-এ গড়ে ${lay}টি কল হয় (আর একটি ব্যর্থ task-এ সর্বোচ্চ ${worst}টি পর্যন্ত কল হতে পারে)। যখন মডেল, subagent ও adapter সব মিলিয়ে একটিই obligation-ভিত্তিক ledger বাজেট নিয়ন্ত্রণ করে, তখন গড় কল থাকে মাত্র ${gov}টি (প্রতি task-এ সর্বোচ্চ ${r(params)}টি)।`,
    };
  },
  modeledNote: {
    en: "Modeled: each layer independently retries up to r times with failure probability p (Google SRE multiplicative retry model, p. 98). Not a production measurement.",
    bn: "মডেল করা হিসাব: প্রতিটি স্তর আলাদাভাবে p ব্যর্থতার হারে সর্বোচ্চ r বার চেষ্টা করে (Google SRE গুণিতক retry মডেল, p. 98)। আসল production-এর মাপ না।",
  },
  manim: {
    source: manimSource,
    command: "R=4 L=3 manimgl ch04_retry_amplification.py RetryAmplification -w",
    note: {
      en: "The ValueTracker sweeps the per-attempt failure rate p. Same formulas, same Kodara palette.",
      bn: "ValueTracker প্রতি চেষ্টার ব্যর্থতার হার (p) পরিবর্তন করে। একই সূত্র, একই Kodara palette।",
    },
  },
};

