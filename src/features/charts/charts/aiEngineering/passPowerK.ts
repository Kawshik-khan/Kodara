import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch05_pass_power_k.py?raw";

/**
 * Chapter 05 (pp. 112–113, 122–123):
 *   pass@k = 1 - (1 - p)^k     (probability at least 1 of k attempts succeeds)
 *   pass^k = p^k               (probability all k attempts succeed on valid runs)
 *   honest pass^k = ((1 - m) * p)^k   (probability all k attempts succeed when
 *                                      fraction m of trials end in MISSING_OUTPUT / TIMEOUT)
 */
export function passAtK(p: number, k: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  return 1 - Math.pow(1 - clamped, k);
}

export function passPowerK(p: number, k: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  return Math.pow(clamped, k);
}

export function honestPassPowerK(p: number, k: number, attritionShare: number): number {
  const clampedP = Math.max(0, Math.min(1, p));
  const clampedM = Math.max(0, Math.min(1, attritionShare));
  return Math.pow((1 - clampedM) * clampedP, k);
}

const k = (params: ChartParams) => params.k;
const m = (params: ChartParams) => params.m;

export const PASS_POWER_K_CHART: ChartDefinition = {
  id: "ai-engineering.harness.pass-power-k",
  titleEn: "pass@k vs pass^k and Missing-Output Denominator Distortion",
  titleBn: "pass@k বনাম pass^k এবং Missing-Output হরের বিকৃতি",
  subtitleEn:
    "Repeated-trial reliability model from Chapter 05 (pp. 112–113, 122–123). Compare search optimism (pass@k) against customer-facing consistency (pass^k) and honest attrition accounting.",
  subtitleBn:
    "অধ্যায় ০৫ (পৃষ্ঠা 112–113, 122–123)-এর নির্ভরযোগ্যতা মডেল। pass@k-এর আশাবাদী চিত্রের সাথে গ্রাহক-পর্যায়ের ধারাবাহিক নির্ভরযোগ্যতা (pass^k) এবং সৎ attrition হিসাবের তুলনা করো।",
  x: {
    min: 50,
    max: 99,
    tickStep: 10,
    unit: "%",
    label: { en: "Single-trial valid pass rate (p)", bn: "একক ট্রায়ালে বৈধ পাশের হার (p)" },
    tracker: { en: "Valid pass rate (p)", bn: "বৈধ পাশের হার (p)" },
    initial: 85,
    step: 5,
  },
  y: {
    min: 0,
    max: 100,
    tickStep: 25,
    unit: "%",
    label: { en: "k-trial outcome probability", bn: "k-ট্রায়ালে সফলতার সম্ভাবনা" },
  },
  params: [
    {
      id: "k",
      label: { en: "Repeated trials per task (k)", bn: "প্রতি টাস্কে পুনরাবৃত্ত ট্রায়াল (k)" },
      options: [1, 3, 5, 8],
      defaultValue: 5,
    },
    {
      id: "m",
      label: { en: "Missing-output attrition % (m)", bn: "Missing-output ঘাটতি % (m)" },
      options: [0, 15, 20],
      defaultValue: 15,
    },
  ],
  series: [
    {
      id: "pass-at-k",
      label: (params) => ({
        en: `pass@${k(params)}: at least 1 of ${k(params)} succeeds`,
        bn: `pass@${k(params)}: ${k(params)}টির অন্তত ১টি সফল`,
      }),
      tone: "info",
      marker: "dot",
      markerUnit: { en: "%", bn: "%" },
      fn: (x, params) => passAtK(x / 100, k(params)) * 100,
    },
    {
      id: "pass-pow-k",
      label: (params) => ({
        en: `pass^${k(params)} ignoring attrition (p^${k(params)})`,
        bn: `Attrition বাদ দিয়ে pass^${k(params)} (p^${k(params)})`,
      }),
      tone: "accent",
      marker: "dot",
      markerUnit: { en: "%", bn: "%" },
      fn: (x, params) => passPowerK(x / 100, k(params)) * 100,
    },
    {
      id: "honest-pass-pow-k",
      label: (params) => ({
        en: `Honest pass^${k(params)} with m = ${m(params)}% attrition`,
        bn: `m = ${m(params)}% attrition-সহ সৎ pass^${k(params)}`,
      }),
      tone: "danger",
      marker: "tag",
      fn: (x, params) => honestPassPowerK(x / 100, k(params), m(params) / 100) * 100,
    },
  ],
  barsTitle: { en: "Reliability across k repeated runs at this p", bn: "এই p-তে k বার পুনরাবৃত্ত রানে নির্ভরযোগ্যতা" },
  bars: [
    {
      label: { en: "At least 1 success vs all-k success (%)", bn: "অন্তত ১ বার বনাম প্রতিবার সফল (%)" },
      scaleMax: 100,
      format: "int",
      items: [
        { label: "pass@k (≥1 succeeds)", tone: "info", value: (x, params) => passAtK(x / 100, k(params)) * 100 },
        { label: "pass^k (valid only)", tone: "accent", value: (x, params) => passPowerK(x / 100, k(params)) * 100 },
        { label: "Honest pass^k (with attrition)", tone: "danger", value: (x, params) => honestPassPowerK(x / 100, k(params), m(params) / 100) * 100 },
      ],
    },
  ],
  formula: "pass@k = 1 − (1 − p)^k    ·    pass^k = p^k    ·    honest_pass^k = ((1 − m) · p)^k",
  insight: (x, params) => {
    const pFrac = x / 100;
    const kVal = k(params);
    const mVal = m(params);
    const atK = (passAtK(pFrac, kVal) * 100).toFixed(1);
    const powK = (passPowerK(pFrac, kVal) * 100).toFixed(1);
    const honestPowK = (honestPassPowerK(pFrac, kVal, mVal / 100) * 100).toFixed(1);
    return {
      en: `At p = ${x}% across k = ${kVal} trials, pass@${kVal} looks like ${atK}% ("it worked at least once!"), but pass^${kVal} on valid trials is ${powK}%. When m = ${mVal}% of runs fail with MISSING_OUTPUT or TIMEOUT and are honestly kept in the denominator instead of dropped or coerced, true all-${kVal} reliability is ${honestPowK}%.`,
      bn: `p = ${x}% এবং k = ${kVal}টি ট্রায়ালে pass@${kVal} দেখায় ${atK}% ("অন্তত একবার তো কাজ করেছে!"), কিন্তু বৈধ ট্রায়ালে pass^${kVal} নেমে আসে ${powK}%-এ। আর যখন m = ${mVal}% ট্রায়াল MISSING_OUTPUT বা TIMEOUT-এ শেষ হয় এবং হর থেকে লুকিয়ে না ফেলে সৎভাবে গণনা করা হয়, তখন সবকটি ট্রায়ালে ধারাবাহিক সাফল্যের হার থাকে মাত্র ${honestPowK}%।`,
    };
  },
  modeledNote: {
    en: "Modeled: independent Bernoulli trials per task with valid pass rate p and attrition rate m (Sierra τ-bench pass^k & Cohorte P0 audit, pp. 112, 122). Not a production measurement.",
    bn: "মডেল করা হিসাব: বৈধ পাশের হার p এবং ঘাটতির হার m ধরে স্বাধীন ট্রায়ালের হিসাব (Sierra τ-bench pass^k ও Cohorte P0 audit, পৃষ্ঠা 112, 122)। আসল production-এর মাপ না।",
  },
  manim: {
    source: manimSource,
    command: "K=5 M=0.15 manimgl ch05_pass_power_k.py PassPowerKScene -w",
    note: {
      en: "Plots pass@k, naive pass^k, and honest pass^k across single-trial pass rate p.",
      bn: "একক ট্রায়ালের পাশের হার p-এর বিপরীতে pass@k, সাধারণ pass^k এবং সৎ pass^k আঁকে।",
    },
  },
};
