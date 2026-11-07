import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch00_verification_budget.py?raw";

/** Successful work steps a task needs in this model. */
export const WORK_STEPS = 6;

function choose(n: number, k: number): number {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
}

/** Probability of at least `k` successes in `n` independent steps that each succeed with probability `q`. */
export function finishWithin(n: number, q: number, k = WORK_STEPS): number {
  const steps = Math.floor(n);
  if (steps < k) return 0;
  let p = 0;
  for (let j = k; j <= steps; j++) p += choose(steps, j) * q ** j * (1 - q) ** (steps - j);
  return Math.min(1, p);
}

/** Share of runs that end in verified completion when `v` steps are reserved for the verifier. */
export function verifiedShare(budget: number, q: number, v: number): number {
  return finishWithin(budget - v, q);
}

/** Share of runs whose work finishes inside the whole budget, verified or not. */
export function workDoneShare(budget: number, q: number): number {
  return finishWithin(budget, q);
}

const q = (params: ChartParams) => params.q / 100;
const v = (params: ChartParams) => params.v;
const pct = (share: number) => Math.round(share * 100);

export const VERIFICATION_BUDGET_CHART: ChartDefinition = {
  id: "ai-engineering.harness.verification-budget",
  titleEn: "Reserve budget for verification",
  titleBn: "Verification-এর জন্য budget রাখো",
  subtitleEn: `A task needs ${WORK_STEPS} successful work steps and a verifier needs v more. Change the step budget, the per-step success rate and the verifier cost.`,
  subtitleBn: `একটা task-এ ${WORK_STEPS}টা সফল কাজের ধাপ লাগে, আর verifier-এর লাগে আরও v ধাপ। Step budget, প্রতি ধাপের সাফল্যের হার আর verifier-এর খরচ বদলাও।`,
  x: {
    min: 0,
    max: 30,
    tickStep: 5,
    label: { en: "Step budget (B)", bn: "Step budget (B)" },
    tracker: { en: "Step budget (B)", bn: "Step budget (B)" },
    initial: 10,
    step: 1,
  },
  y: {
    min: 0,
    max: 100,
    tickStep: 20,
    unit: "%",
    label: { en: "% of runs", bn: "run-এর %" },
  },
  params: [
    { id: "q", label: { en: "Per-step success (q, %)", bn: "প্রতি ধাপে সাফল্য (q, %)" }, options: [50, 60, 70, 80, 90], defaultValue: 70 },
    { id: "v", label: { en: "Verifier steps (v)", bn: "Verifier-এর ধাপ (v)" }, options: [1, 2, 3, 4], defaultValue: 2 },
  ],
  series: [
    {
      id: "work",
      label: () => ({ en: "Work finished within B (verified or not)", bn: "B-এর মধ্যে কাজ শেষ (যাচাই হোক বা না হোক)" }),
      tone: "info",
      dashed: true,
      marker: "dot",
      markerUnit: { en: "%", bn: "%" },
      fn: (x, params) => 100 * workDoneShare(x, q(params)),
    },
    {
      id: "verified",
      label: (params) => ({ en: `Verified COMPLETE (v=${v(params)} reserved)`, bn: `যাচাইসহ COMPLETE (v=${v(params)} রাখা)` }),
      tone: "accent",
      marker: "tag",
      fn: (x, params) => 100 * verifiedShare(x, q(params), v(params)),
    },
  ],
  barsTitle: { en: "Per 100 runs at this budget", bn: "এই budget-এ প্রতি ১০০ run-এ" },
  bars: [
    {
      label: { en: "Verified COMPLETE", bn: "যাচাইসহ COMPLETE" },
      scaleMax: 100,
      format: "int",
      items: [
        { label: "Reserve", tone: "success", value: (x, params) => 100 * verifiedShare(x, q(params), v(params)) },
        { label: "No reserve", tone: "success", value: (x, params) => 100 * verifiedShare(x, q(params), v(params)) },
      ],
    },
    {
      label: { en: "\"Done\" with no evidence", bn: "প্রমাণ ছাড়া \"done\"" },
      scaleMax: 100,
      format: "int",
      items: [
        { label: "Reserve", tone: "success", value: () => 0 },
        {
          label: "No reserve",
          tone: "danger",
          value: (x, params) => 100 * (workDoneShare(x, q(params)) - verifiedShare(x, q(params), v(params))),
        },
      ],
    },
    {
      label: { en: "Honest BUDGET_EXHAUSTED", bn: "সৎ BUDGET_EXHAUSTED" },
      scaleMax: 100,
      format: "int",
      items: [
        { label: "Reserve", tone: "info", value: (x, params) => 100 * (1 - verifiedShare(x, q(params), v(params))) },
        { label: "No reserve", tone: "info", value: (x, params) => 100 * (1 - workDoneShare(x, q(params))) },
      ],
    },
  ],
  formula: `P(verified) = P(≥${WORK_STEPS} successes in B − v steps) = Σ(j=${WORK_STEPS}..B−v) C(B−v, j) q^j (1−q)^(B−v−j)`,
  insight: (x, params) => {
    const verified = pct(verifiedShare(x, q(params), v(params)));
    const unverified = pct(workDoneShare(x, q(params))) - verified;
    return {
      en: `With B = ${x}, q = ${params.q}% and a ${v(params)}-step verifier, ${verified}% of runs end in verified COMPLETE either way. Without a reserve, another ${unverified}% finish the work with no budget left to check it and report "done" without evidence. With the reserve, those runs end honestly as BUDGET_EXHAUSTED.`,
      bn: `B = ${x}, q = ${params.q}% আর ${v(params)} ধাপের verifier হলে, দুই ক্ষেত্রেই ${verified}% run যাচাইসহ COMPLETE হয়। Budget না রাখলে আরও ${unverified}% run কাজ শেষ করে কিন্তু যাচাইয়ের budget থাকে না, তাই প্রমাণ ছাড়াই "done" বলে। Budget রাখলে সেই run-গুলো সৎভাবে BUDGET_EXHAUSTED হয়।`,
    };
  },
  modeledNote: {
    en: `Modeled: each work step succeeds independently with probability q, a task needs ${WORK_STEPS} successes, and the verifier costs v steps. Not a production measurement.`,
    bn: `মডেল করা হিসাব: প্রতিটা কাজের ধাপ আলাদাভাবে q সম্ভাবনায় সফল হয়, task-এ ${WORK_STEPS}টা সাফল্য লাগে, আর verifier-এর খরচ v ধাপ। আসল production-এর মাপ না।`,
  },
  manim: {
    source: manimSource,
    command: "Q=70 V=2 manimgl ch00_verification_budget.py VerificationBudget -w",
    note: {
      en: "The ValueTracker sweeps the budget like the slider. Same formulas, same Kodara palette.",
      bn: "ValueTracker slider-এর মতো budget বাড়ায়। একই সূত্র, একই Kodara palette।",
    },
  },
};
