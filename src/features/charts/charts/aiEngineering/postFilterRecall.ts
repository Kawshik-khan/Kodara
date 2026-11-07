import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch03_post_filter_recall.py?raw";

/**
 * Model (pp. 81–82): a global top-k retriever returns k candidate slots before
 * permission/authority/freshness filtering. A fraction s of the index consists
 * of restricted, stale or non-authoritative lookalikes that occupy top-k slots.
 * If an obligation needs m valid units, post-filtering drops the s slots after
 * retrieval, creating a recall gap. Scope-first compilation filters before ranking.
 */

function choose(n: number, k: number): number {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
}

/** Probability that at least `m` valid units survive in `k` slots when each slot is crowded out with probability `s`. */
export function postFilterRecall(sFraction: number, k: number, m: number): number {
  const slots = Math.floor(k);
  const req = Math.floor(m);
  if (slots < req) return 0;
  const pValid = Math.max(0, Math.min(1, 1 - sFraction));
  let total = 0;
  for (let j = req; j <= slots; j++) {
    total += choose(slots, j) * pValid ** j * (1 - pValid) ** (slots - j);
  }
  return Math.min(1, total);
}

/** Scope-first compilation pushes scope/authority/freshness before ranking. */
export function scopeFirstRecall(k: number, m: number): number {
  return k >= m ? 1 : 0;
}

const k = (params: ChartParams) => params.k;
const m = (params: ChartParams) => params.m;
const pct1 = (v: number) => (Math.round(v * 1000) / 10).toFixed(1);

export const POST_FILTER_RECALL_CHART: ChartDefinition = {
  id: "ai-engineering.harness.post-filter-recall",
  titleEn: "Scope-first compilation vs post-filtered top-k",
  titleBn: "Scope-first compilation বনাম post-filter করা top-k",
  subtitleEn: "When global top-k retrieves first and filters unauthorized or stale items afterward, restricted lookalikes crowd out the k slots (pp. 81–82).",
  subtitleBn: "Global top-k আগে এনে পরে অনুমোদনহীন বা পুরোনো তথ্য বাদ দিলে, নিষিদ্ধ বা পুরোনো ফলাফল k-টা জায়গা দখল করে আসল প্রমাণকে বাইরে ঠেলে দেয় (pp. 81–82)।",
  x: {
    min: 0,
    max: 90,
    tickStep: 15,
    unit: "%",
    label: { en: "Restricted / stale lookalikes in top-k (s)", bn: "Top-k-এ নিষিদ্ধ / পুরোনো lookalike-এর হার (s)" },
    tracker: { en: "Lookalike crowding (s)", bn: "জায়গা দখলের হার (s)" },
    initial: 40,
    step: 5,
  },
  y: {
    min: 0,
    max: 100,
    tickStep: 20,
    unit: "%",
    label: { en: "% (see legend)", bn: "% (legend দেখো)" },
  },
  params: [
    { id: "k", label: { en: "Top-k slots (k)", bn: "Top-k স্লট (k)" }, options: [3, 5, 8, 10], defaultValue: 5 },
    { id: "m", label: { en: "Required valid units (m)", bn: "প্রয়োজনীয় বৈধ unit (m)" }, options: [1, 2, 3], defaultValue: 2 },
  ],
  series: [
    {
      id: "scoped",
      label: () => ({ en: "Scope-first compiler: obligation recall", bn: "Scope-first compiler: প্রমাণের প্রাপ্যতা" }),
      tone: "success",
      fn: (_, params) => 100 * scopeFirstRecall(k(params), m(params)),
    },
    {
      id: "wasted",
      label: () => ({ en: "Post-filter: top-k slots crowded out", bn: "Post-filter: নষ্ট হওয়া top-k স্লট" }),
      tone: "info",
      dashed: true,
      marker: "dot",
      markerUnit: { en: "%", bn: "%" },
      fn: (x) => x,
    },
    {
      id: "post",
      label: (params) => ({
        en: `Post-filter top-${k(params)}: recall of ≥${m(params)} valid units`,
        bn: `Post-filter top-${k(params)}: ≥${m(params)}টা বৈধ unit পাওয়ার হার`,
      }),
      tone: "danger",
      marker: "tag",
      fn: (x, params) => 100 * postFilterRecall(x / 100, k(params), m(params)),
    },
  ],
  barsTitle: { en: "Per 1000 builds", bn: "প্রতি ১০০০ build-এ" },
  bars: [
    {
      label: { en: "Builds with all required evidence", bn: "সব প্রয়োজনীয় প্রমাণ পাওয়া build" },
      scaleMax: 1000,
      format: "int",
      items: [
        { label: "Scope-first", tone: "success", value: (_, params) => 1000 * scopeFirstRecall(k(params), m(params)) },
        { label: "Post-filter", tone: "accent", value: (x, params) => 1000 * postFilterRecall(x / 100, k(params), m(params)) },
      ],
    },
    {
      label: { en: "False absence (crowded out by post-filter)", bn: "ভুল ঘাটতি (জায়গা দখলের কারণে বাদ পড়া)" },
      scaleMax: 1000,
      format: "int",
      items: [
        { label: "Scope-first", tone: "success", value: () => 0 },
        {
          label: "Post-filter",
          tone: "danger",
          value: (x, params) => 1000 * (scopeFirstRecall(k(params), m(params)) - postFilterRecall(x / 100, k(params), m(params))),
        },
      ],
    },
    {
      label: { en: "Top-k slots wasted per 1000 slots", bn: "প্রতি ১০০০ স্লটে নষ্ট হওয়া স্লট" },
      scaleMax: 1000,
      format: "int",
      items: [
        { label: "Scope-first", tone: "success", value: () => 0 },
        { label: "Post-filter", tone: "info", value: (x) => 10 * x },
      ],
    },
  ],
  formula: "P(recall_post) = Σ(j=m..k) C(k, j) (1−s)^j s^(k−j)    ·    P(recall_scoped) = 1 (when k ≥ m)",
  insight: (x, params) => {
    const s = x / 100;
    const recall = pct1(postFilterRecall(s, k(params), m(params)));
    const missed = Math.round(1000 * (1 - postFilterRecall(s, k(params), m(params))));
    return {
      en: `When ${x}% of top-${k(params)} candidates are restricted or stale lookalikes and the decision needs ${m(params)} valid units, post-filtering finds enough evidence in only ${recall}% of builds (${missed} per 1000 fail from slot crowding, even though valid records exist). Pushing scope and authority into the query before ranking keeps all ${k(params)} slots for admissible evidence.`,
      bn: `Top-${k(params)} ফলাফলের ${x}% যখন নিষিদ্ধ বা পুরোনো lookalike হয় আর সিদ্ধান্তের জন্য ${m(params)}টা বৈধ unit লাগে, তখন post-filter মাত্র ${recall}% build-এ পর্যাপ্ত প্রমাণ পায় (প্রতি ১০০০-এ ${missed}টা build স্লট দখলের কারণে ব্যর্থ হয়, যদিও বৈধ তথ্য সিস্টেমে আছে)। Ranking-এর আগেই scope ও authority ছেঁকে নিলে পুরো ${k(params)}টা স্লটই বৈধ প্রমাণের জন্য থাকে।`,
    };
  },
  modeledNote: {
    en: "Modeled: each top-k slot is independently occupied by an inadmissible lookalike with probability s. Not a production measurement.",
    bn: "মডেল করা হিসাব: প্রতিটি top-k স্লট আলাদাভাবে s সম্ভাবনায় অনুপযুক্ত lookalike দিয়ে পূর্ণ হয় ধরা হয়েছে। আসল production-এর মাপ না।",
  },
  manim: {
    source: manimSource,
    command: "K=5 M=2 manimgl ch03_post_filter_recall.py PostFilterRecall -w",
    note: {
      en: "The ValueTracker increases lookalike crowding s across top-k slots. Same formulas, same Kodara palette.",
      bn: "ValueTracker top-k স্লটে lookalike-এর ভিড় (s) বাড়ায়। একই সূত্র, একই Kodara palette।",
    },
  },
};

