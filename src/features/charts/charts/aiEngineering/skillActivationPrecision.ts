import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch20_skill_activation_precision.py?raw";

/**
 * Chapter 20 (pp. 143–147, Appendix H.5 p. 506):
 * When a task stream has target prevalence q (and adjacent non-target share 1 − q),
 * a skill with true-positive recall r and per-neighbor false-activation rate f
 * across N adjacent task slices / overlapping catalog skills suffers aggregate
 * false-activation probability:
 *   F(f, N) = 1 − (1 − f)^N
 * and nomination precision:
 *   Precision(q, r, f, N) = (q · r) / (q · r + (1 − q) · F(f, N))
 */
export function aggregateFalseActivation(f: number, neighbors: number): number {
  const clampedF = Math.max(0, Math.min(1, f));
  return 1 - Math.pow(1 - clampedF, Math.max(1, Math.floor(neighbors)));
}

export function nominationPrecision(q: number, r: number, f: number, neighbors: number): number {
  const tp = q * r;
  const fp = (1 - q) * aggregateFalseActivation(f, neighbors);
  if (tp + fp <= 0) return 1;
  return tp / (tp + fp);
}

const q = (params: ChartParams) => params.q / 100;
const fBroad = (params: ChartParams) => params.f / 100;
const RECALL = 0.92;
const F_SCOPED = 0.005; // 0.5% per-neighbor false activation with deterministic exclusion gates

export const SKILL_ACTIVATION_PRECISION_CHART: ChartDefinition = {
  id: "ai-engineering.harness.skill-activation-precision",
  titleEn: "Skill Activation Precision & Catalog Overlap (v4.2.0 vs v4.2.1)",
  titleBn: "Skill Activation Precision এবং ক্যাটালগের ওভারল্যাপ (v4.2.0 বনাম v4.2.1)",
  subtitleEn:
    "Interactive model of Chapter 20 (pp. 143–147). Broadening a skill description ('use whenever charged twice') raises false activations across N adjacent workflows (chargebacks, holds, renewals) and collapses nomination precision.",
  subtitleBn:
    "অধ্যায় ২০ (পৃষ্ঠা 143–147)-এর মডেল। স্কিলের বর্ণনা ঢালাও করলে ('দুবার চার্জ হলেই ব্যবহার করো') পার্শ্ববর্তী Nটি কাজে (চার্জব্যাক, হোল্ড, রিনিউয়াল) ভুল অ্যাক্টিভেশন বাড়ে এবং nomination precision ধসে পড়ে।",
  x: {
    min: 1,
    max: 10,
    tickStep: 1,
    unit: "",
    label: { en: "Adjacent lookalike task slices in catalog (N)", bn: "ক্যাটালগে পার্শ্ববর্তী সদৃশ কাজের সংখ্যা (N)" },
    tracker: { en: "Adjacent slices (N)", bn: "পার্শ্ববর্তী কাজ (N)" },
    initial: 4,
    step: 1,
  },
  y: {
    min: 0,
    max: 100,
    tickStep: 25,
    unit: "%",
    label: { en: "Nomination precision (%)", bn: "Nomination precision (%)" },
  },
  params: [
    {
      id: "q",
      label: { en: "True target task prevalence % (q)", bn: "আসল ডুপ্লিকেট-চার্জ কেসের হার % (q)" },
      options: [15, 30, 50],
      defaultValue: 30,
    },
    {
      id: "f",
      label: { en: "Broad description false-activation % per slice (f)", bn: "ঢালাও বর্ণনায় প্রতি স্লাইসে ভুল অ্যাক্টিভেশন % (f)" },
      options: [4, 8, 15],
      defaultValue: 8,
    },
  ],
  series: [
    {
      id: "scoped-skill",
      label: () => ({
        en: "v4.2.0 scoped contract + exclusion gates (f = 0.5%)",
        bn: "v4.2.0 নির্দিষ্ট চুক্তি + বর্জন গেট (f = 0.5%)",
      }),
      tone: "success",
      marker: "dot",
      markerUnit: { en: "%", bn: "%" },
      fn: (x, params) => nominationPrecision(q(params), RECALL, F_SCOPED, x) * 100,
    },
    {
      id: "broad-skill",
      label: (params) => ({
        en: `v4.2.1 broadened description (f = ${params.f}% per slice)`,
        bn: `v4.2.1 ঢালাও বর্ণনা (প্রতি স্লাইসে f = ${params.f}%)`,
      }),
      tone: "danger",
      marker: "tag",
      fn: (x, params) => nominationPrecision(q(params), RECALL, fBroad(params), x) * 100,
    },
  ],
  barsTitle: { en: "At N adjacent slices per 1,000 support tickets", bn: "প্রতি ১,০০০ সাপোর্ট টিকেটে Nটি পার্শ্ববর্তী কাজে" },
  bars: [
    {
      label: { en: "Nomination precision (%)", bn: "Nomination precision (%)" },
      scaleMax: 100,
      format: "int",
      items: [
        { label: "v4.2.0 Scoped", tone: "success", value: (x, params) => nominationPrecision(q(params), RECALL, F_SCOPED, x) * 100 },
        { label: "v4.2.1 Broadened", tone: "danger", value: (x, params) => nominationPrecision(q(params), RECALL, fBroad(params), x) * 100 },
      ],
    },
    {
      label: { en: "Misrouted adjacent cases per 1,000 tickets", bn: "প্রতি ১,০০০ টিকেটে ভুল পথে যাওয়া কেস" },
      scaleMax: 500,
      format: "int",
      items: [
        { label: "v4.2.0 Scoped", tone: "info", value: (x, params) => 1000 * (1 - q(params)) * aggregateFalseActivation(F_SCOPED, x) },
        { label: "v4.2.1 Broadened", tone: "danger", value: (x, params) => 1000 * (1 - q(params)) * aggregateFalseActivation(fBroad(params), x) },
      ],
    },
  ],
  formula: "Precision(q, r, f, N) = (q · r) / (q · r + (1 − q) · (1 − (1 − f)^N))",
  insight: (x, params) => {
    const qFrac = q(params);
    const fFrac = fBroad(params);
    const scopedPrec = (nominationPrecision(qFrac, RECALL, F_SCOPED, x) * 100).toFixed(1);
    const broadPrec = (nominationPrecision(qFrac, RECALL, fFrac, x) * 100).toFixed(1);
    const misroutes = Math.round(1000 * (1 - qFrac) * aggregateFalseActivation(fFrac, x));
    return {
      en: `With N = ${x} adjacent lookalike slices (chargebacks, holds, renewals, fraud) and q = ${params.q}% target prevalence, broadening the description to f = ${params.f}% per slice drops nomination precision from ${scopedPrec}% down to ${broadPrec}% and misroutes ${misroutes} adjacent cases per 1,000 tickets into the wrong procedure.`,
      bn: `N = ${x}টি পার্শ্ববর্তী সদৃশ কাজে (চার্জব্যাক, হোল্ড, রিনিউয়াল, জালিয়াতি) এবং q = ${params.q}% আসল কেসের হারে বর্ণনা ঢালাও করলে (f = ${params.f}%) nomination precision ${scopedPrec}% থেকে কমে ${broadPrec}%-এ নামে এবং প্রতি ১,০০০ টিকেটে ${misroutes}টি কেস ভুল প্রসিডিউরে ঢুকে পড়ে।`,
    };
  },
  modeledNote: {
    en: "Modeled: Bayesian nomination precision across N adjacent slices with recall r = 92% (Chapter 20 worked case, pp. 143–147). Not a production measurement.",
    bn: "মডেল করা হিসাব: Nটি পার্শ্ববর্তী কাজে r = 92% রিকল ধরে Bayesian nomination precision (অধ্যায় ২০-এর worked case, পৃষ্ঠা 143–147)। আসল production-এর মাপ না।",
  },
  manim: {
    source: manimSource,
    command: "Q=0.30 F=0.08 manimgl ch20_skill_activation_precision.py SkillActivationPrecisionScene -w",
    note: {
      en: "Plots nomination precision for scoped v4.2.0 vs broadened v4.2.1 as adjacent catalog slices N grow.",
      bn: "পার্শ্ববর্তী কাজের সংখ্যা N বাড়ার সাথে সাথে v4.2.0 ও v4.2.1-এর nomination precision আঁকে।",
    },
  },
};

