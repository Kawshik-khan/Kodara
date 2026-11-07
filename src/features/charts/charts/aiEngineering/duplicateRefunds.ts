import { ChartDefinition, ChartParams } from "../../types/chart.types";
import manimSource from "../../../../../courses/harness-playbook/scenes/ch02_duplicate_refunds.py?raw";

const REFUND_EUR = 42;

/** Expected duplicate refunds per 1000 when every lost ack triggers a fresh-id retry. */
export function naiveDuplicates(pPercent: number, maxAttempts: number): number {
  const p = pPercent / 100;
  let sum = 0;
  for (let k = 1; k < maxAttempts; k++) sum += p ** k;
  return 1000 * sum;
}

/** Ledger reads per 1000 the keyed harness spends reconciling lost acks instead. */
export function reconcileReads(pPercent: number): number {
  return 10 * pPercent;
}

const pct = (x: number) => `${Number.isInteger(x) ? x : x.toFixed(1)}%`;
const r = (params: ChartParams) => params.attempts;

export const DUPLICATE_REFUNDS_CHART: ChartDefinition = {
  id: "ai-engineering.harness.duplicate-refunds",
  titleEn: "Duplicate refunds vs acknowledgement loss",
  titleBn: "Ack হারানোর হার বনাম duplicate refund",
  subtitleEn: "Change the retry count and the ack-loss rate. You can also click or drag on the chart to set the rate.",
  subtitleBn: "Retry সংখ্যা আর ack হারানোর হার বদলাও। Chart-এর ওপর ক্লিক বা drag করেও হার ঠিক করা যায়।",
  x: {
    min: 0,
    max: 30,
    tickStep: 5,
    unit: "%",
    label: { en: "Ack loss rate (p)", bn: "Ack হারানোর হার (p)" },
    tracker: { en: "Ack loss rate (p)", bn: "Ack হারানোর হার (p)" },
    initial: 8,
    step: 0.5,
  },
  y: {
    min: 0,
    max: 500,
    tickStep: 100,
    label: { en: "Per 1000 refunds", bn: "প্রতি ১০০০ refund-এ" },
  },
  params: [
    {
      id: "attempts",
      label: { en: "Max attempts (r)", bn: "সর্বোচ্চ চেষ্টা (r)" },
      options: [1, 2, 3, 4, 5],
      defaultValue: 3,
    },
  ],
  series: [
    {
      id: "reads",
      label: () => ({ en: "Keyed: reconcile reads (its cost)", bn: "Keyed: reconcile read (খরচ)" }),
      tone: "info",
      dashed: true,
      marker: "dot",
      markerUnit: { en: "reads", bn: "reads" },
      fn: (x) => reconcileReads(x),
    },
    {
      id: "keyed",
      label: () => ({ en: "Keyed: duplicate refunds = 0", bn: "Keyed: duplicate refund = 0" }),
      tone: "success",
      fn: () => 0,
    },
    {
      id: "naive",
      label: (params) => ({
        en: `Naive retry: duplicate refunds (r=${r(params)})`,
        bn: `Naive retry: duplicate refund (r=${r(params)})`,
      }),
      tone: "accent",
      marker: "tag",
      fn: (x, params) => naiveDuplicates(x, r(params)),
    },
  ],
  barsTitle: { en: "Per 1000 refunds", bn: "প্রতি ১০০০ refund-এ তুলনা" },
  bars: [
    {
      label: { en: "Duplicate refunds", bn: "Duplicate refund" },
      scaleMax: 500,
      format: "int",
      items: [
        { label: "Naive", tone: "accent", value: (x, params) => naiveDuplicates(x, r(params)) },
        { label: "Keyed", tone: "success", value: () => 0 },
      ],
    },
    {
      label: { en: "Money paid twice", bn: "দুবার দেওয়া টাকা" },
      scaleMax: 500 * REFUND_EUR,
      format: "euro",
      items: [
        { label: "Naive", tone: "danger", value: (x, params) => naiveDuplicates(x, r(params)) * REFUND_EUR },
        { label: "Keyed", tone: "success", value: () => 0 },
      ],
    },
    {
      label: { en: "Extra ledger reads", bn: "অতিরিক্ত ledger read" },
      scaleMax: 500,
      format: "int",
      items: [
        { label: "Naive", tone: "accent", value: () => 0 },
        { label: "Keyed", tone: "info", value: (x) => reconcileReads(x) },
      ],
    },
  ],
  formula: "E[duplicates per 1000] = 1000 · Σ(k=1..r−1) p^k   ·   E[reconcile reads per 1000] = 1000 · p",
  insight: (x, params) => {
    const dup = Math.round(naiveDuplicates(x, r(params)));
    const reads = Math.round(reconcileReads(x));
    const money = Math.round(naiveDuplicates(x, r(params)) * REFUND_EUR).toLocaleString("en");
    if (r(params) === 1) {
      return {
        en: `Retries off (r=1): no duplicates, but about ${reads} cases with a lost ack stay unknown. The keyed harness reconciles and closes them too.`,
        bn: `Retry বন্ধ (r=1): duplicate নেই, কিন্তু ack হারানো প্রায় ${reads}টা case অজানা অবস্থায় পড়ে থাকে। Keyed harness সেগুলোও reconcile করে বন্ধ করে।`,
      };
    }
    return {
      en: `At p = ${pct(x)} and r = ${r(params)}, the naive harness pays twice about ${dup} times per 1000 refunds (about €${money}). The keyed harness reads the ledger ${reads} times instead, with zero duplicates.`,
      bn: `p = ${pct(x)} আর r = ${r(params)} হলে naive harness প্রতি ১০০০ refund-এ গড়ে ${dup} বার দুবার টাকা দেয় (প্রায় €${money})। Keyed harness তার বদলে ${reads} বার ledger পড়ে, duplicate শূন্য।`,
    };
  },
  modeledNote: {
    en: "Modeled: expected values assuming each attempt loses its ack independently, €42 per refund. Not a production measurement.",
    bn: "মডেল করা হিসাব: প্রতিটা চেষ্টায় ack আলাদাভাবে হারায় ধরে expected value, refund প্রতি €42। আসল production-এর মাপ না।",
  },
  manim: {
    source: manimSource,
    command: "RETRIES=3 manimgl ch02_duplicate_refunds.py DuplicateRefunds -w",
    note: {
      en: "The ValueTracker plays the role of the slider. Same formulas, same Kodara palette.",
      bn: "ValueTracker-টাই এখানে slider-এর কাজ করে। একই সূত্র, একই Kodara palette।",
    },
  },
};
