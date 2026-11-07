import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch01_silent_failure.py?raw";

/**
 * Model: a fraction e of runs produce a wrong or policy-violating outcome.
 * An independent verifier catches a fraction d of those and routes them to a
 * visible stop (escalate / abstain). It never rejects a correct outcome.
 */

/** Share of runs recorded as completed. */
export function completedShare(e: number, d: number): number {
  return 1 - e * d;
}

/** silent_failure_rate = wrong outcomes recorded as completed / all completed outcomes (p. 50). */
export function silentFailureRate(e: number, d: number): number {
  const completed = completedShare(e, d);
  return completed === 0 ? 0 : (e * (1 - d)) / completed;
}

const e = (params: ChartParams) => params.e / 100;
const pct1 = (v: number) => (Math.round(v * 1000) / 10).toFixed(1);

export const SILENT_FAILURE_CHART: ChartDefinition = {
  id: "ai-engineering.harness.silent-failure",
  titleEn: "Turning silent failures into visible ones",
  titleBn: "নীরব ব্যর্থতাকে দৃশ্যমান করা",
  subtitleEn: "Change how many wrong outcomes the independent verifier catches, and how often runs go wrong in the first place.",
  subtitleBn: "স্বাধীন verifier কত শতাংশ ভুল ফল ধরতে পারে আর শুরুতেই কত run ভুল হয়, সেটা বদলাও।",
  x: {
    min: 0,
    max: 100,
    tickStep: 20,
    unit: "%",
    label: { en: "Verifier detection coverage (d)", bn: "Verifier কত ভুল ধরে (d)" },
    tracker: { en: "Detection coverage (d)", bn: "ভুল ধরার হার (d)" },
    initial: 40,
    step: 5,
  },
  y: {
    min: 0,
    max: 100,
    tickStep: 20,
    label: { en: "% (see legend)", bn: "% (legend দেখো)" },
  },
  params: [
    { id: "e", label: { en: "Runs that go wrong (e, %)", bn: "ভুল হওয়া run (e, %)" }, options: [5, 10, 20, 30], defaultValue: 10 },
  ],
  series: [
    {
      id: "completed",
      label: () => ({ en: "Recorded as COMPLETED (% of runs)", bn: "COMPLETED হিসেবে লেখা (run-এর %)" }),
      tone: "info",
      dashed: true,
      marker: "dot",
      markerUnit: { en: "%", bn: "%" },
      fn: (x, params) => 100 * completedShare(e(params), x / 100),
    },
    {
      id: "silent",
      label: () => ({ en: "Silent failure rate (% of completed)", bn: "নীরব ব্যর্থতার হার (completed-এর %)" }),
      tone: "danger",
      marker: "tag",
      fn: (x, params) => 100 * silentFailureRate(e(params), x / 100),
    },
  ],
  barsTitle: { en: "Per 1000 runs", bn: "প্রতি ১০০০ run-এ" },
  bars: [
    {
      label: { en: "Correct and completed", bn: "সঠিক আর completed" },
      scaleMax: 1000,
      format: "int",
      items: [{ label: "Runs", tone: "success", value: (_, params) => 1000 * (1 - e(params)) }],
    },
    {
      label: { en: "Wrong but recorded COMPLETED (silent)", bn: "ভুল, তবু COMPLETED (নীরব)" },
      scaleMax: 300,
      format: "int",
      items: [{ label: "Runs", tone: "danger", value: (x, params) => 1000 * e(params) * (1 - x / 100) }],
    },
    {
      label: { en: "Caught: escalated or abstained (visible)", bn: "ধরা পড়েছে: escalate বা বিরত (দৃশ্যমান)" },
      scaleMax: 300,
      format: "int",
      items: [{ label: "Runs", tone: "info", value: (x, params) => 1000 * e(params) * (x / 100) }],
    },
  ],
  formula: "silent_failure_rate = e·(1−d) / (1 − e·d)    ·    completed = 1 − e·d    ·    visible = e·d",
  insight: (x, params) => {
    const d = x / 100;
    const silent = pct1(silentFailureRate(e(params), d));
    const visible = Math.round(1000 * e(params) * d);
    const hidden = Math.round(1000 * e(params) * (1 - d));
    return {
      en: `With ${params.e}% of runs going wrong and a verifier that catches ${x}% of them, ${silent}% of the runs recorded as COMPLETED are actually wrong (${hidden} per 1000). The other ${visible} per 1000 become visible escalations or abstentions. Fewer runs say COMPLETED, and that is the point: the dashboard gets less flattering and more true.`,
      bn: `${params.e}% run ভুল হলে আর verifier তার ${x}% ধরতে পারলে, COMPLETED হিসেবে লেখা run-এর ${silent}% আসলে ভুল (প্রতি ১০০০-এ ${hidden}টা)। বাকি প্রতি ১০০০-এ ${visible}টা দৃশ্যমান escalation বা বিরতি হয়। COMPLETED কমে, আর সেটাই উদ্দেশ্য: dashboard কম চমকপ্রদ, কিন্তু বেশি সত্য।`,
    };
  },
  modeledNote: {
    en: "Modeled: errors occur independently at rate e, the verifier catches a fraction d of them and never rejects a correct outcome. Not a production measurement.",
    bn: "মডেল করা হিসাব: ভুল আলাদাভাবে e হারে ঘটে, verifier তার d অংশ ধরে আর কখনো সঠিক ফল বাতিল করে না। আসল production-এর মাপ না।",
  },
  manim: {
    source: manimSource,
    command: "E=10 manimgl ch01_silent_failure.py SilentFailure -w",
    note: {
      en: "The ValueTracker raises detection coverage like the slider. Same formulas, same Kodara palette.",
      bn: "ValueTracker slider-এর মতো ভুল ধরার হার বাড়ায়। একই সূত্র, একই Kodara palette।",
    },
  },
};
