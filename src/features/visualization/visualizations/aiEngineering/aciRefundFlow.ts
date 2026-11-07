import { Scene, SceneEdge, SceneNode, SceneNodeState } from "../../types/scene.types";
import { VisualizationDefinition, VisualizationStep } from "../../types/visualization.types";

/**
 * Chapter 02 of the Harness Engineering Playbook: one refund through the six
 * layers of an agent–computer interface. Hand-authored, so labeled "modeled"
 * (AGENT.md §10); the recorded line-by-line trace lives in the code-trace block.
 */

type GateState = "idle" | "pass" | "active" | "warning" | "error";

interface FlowState {
  at: "model" | "provider" | number;
  gates: GateState[];
  token: { label: string; state: SceneNodeState };
  ledger: string[];
  chain: string[];
  link?: "call" | "lost" | "lookup";
}

// Vertical layout: the engine's scene column is narrow next to its code panel.
const LAYERS = [
  "L1 Affordance",
  "L2 Proposal contract",
  "L3 Authority gate",
  "L4 Effect adapter",
  "L5 Observation contract",
  "L6 Evidence hook",
];
const ROW_X = 10;
const ROW_W = 250;
const ROW_H = 50;
const ROW_Y0 = 70;
const ROW_STEP = 58;
const SIDE_X = 272;
const SIDE_W = 118;
const PROVIDER_Y = ROW_Y0 + 6 * ROW_STEP + 4;
const VIEW = { width: 400, height: PROVIDER_Y + 140 };
const rowY = (i: number) => ROW_Y0 + i * ROW_STEP;

const gateSub: Record<GateState, string> = {
  idle: "",
  pass: "✓ pass",
  active: "checking…",
  warning: "unknown",
  error: "blocked",
};

function buildScene(s: FlowState): Scene {
  const tokenY = s.at === "model" ? 10 : s.at === "provider" ? PROVIDER_Y : rowY(s.at);
  const nodes: SceneNode[] = [
    { id: "model", type: "generic-card", label: "MODEL · proposes", x: ROW_X, y: 10, width: ROW_W, height: ROW_H, state: s.at === "model" ? "active" : "idle" },
    ...LAYERS.map((label, i): SceneNode => {
      const g = s.gates[i];
      const current = s.at === i && g === "idle";
      const state: SceneNodeState = current ? "active" : g === "pass" || g === "idle" ? "idle" : g === "active" ? "active" : g;
      return {
        id: `gate-${i}`,
        type: "generic-card",
        label: gateSub[current ? "active" : g] ? `${label} · ${gateSub[current ? "active" : g]}` : label,
        x: ROW_X,
        y: rowY(i),
        width: ROW_W,
        height: ROW_H,
        state,
      };
    }),
    {
      id: "provider",
      type: "heap-object",
      label: `Payment provider · ${s.ledger.length === 0 ? "no refund" : s.ledger.length === 1 ? "1 refund" : `${s.ledger.length} refunds`}`,
      x: ROW_X,
      y: PROVIDER_Y,
      width: ROW_W,
      height: ROW_H + 4,
      state: s.ledger.length > 1 ? "error" : s.at === "provider" ? "active" : "idle",
    },
    { id: "token", type: "memory-slot", label: s.token.label, x: SIDE_X, y: tokenY, width: SIDE_W, height: ROW_H, state: s.token.state },
    { id: "record", type: "stack-frame", label: "Operation record", subLabel: s.chain.slice(-4).join(" → "), x: ROW_X, y: PROVIDER_Y + ROW_H + 18, width: 380, height: 66, state: "idle" },
  ];
  const edges: SceneEdge[] = [];
  if (s.link === "call") edges.push({ id: "e-call", fromNodeId: "gate-3", toNodeId: "provider", type: "call", label: "refund(key)", state: "active" });
  if (s.link === "lost") edges.push({ id: "e-lost", fromNodeId: "provider", toNodeId: "gate-3", type: "return", label: "ack lost", state: "error", dashed: true });
  if (s.link === "lookup") edges.push({ id: "e-lookup", fromNodeId: "gate-3", toNodeId: "provider", type: "scope-lookup", label: "lookup(key)", state: "traversing", dashed: true });
  return { viewBox: VIEW, nodes, edges };
}

interface StepSpec {
  patch: Partial<Omit<FlowState, "gates">> & { gates?: Record<number, GateState> };
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  whyEn: string;
  whyBn: string;
  lines: number[];
}

function buildSteps(specs: StepSpec[], tokenLabel: string): VisualizationStep[] {
  let state: FlowState = {
    at: "model",
    gates: Array<GateState>(6).fill("idle"),
    token: { label: tokenLabel, state: "active" },
    ledger: [],
    chain: [],
  };
  return specs.map((spec, i) => {
    const { gates, ...rest } = spec.patch;
    state = { ...state, link: undefined, ...rest, gates: [...state.gates] };
    if (gates) for (const [k, v] of Object.entries(gates)) state.gates[Number(k)] = v;
    return {
      id: `step-${i + 1}`,
      stepIndex: i,
      titleEn: spec.titleEn,
      titleBn: spec.titleBn,
      explanationEn: spec.explanationEn,
      explanationBn: spec.explanationBn,
      whyEn: spec.whyEn,
      whyBn: spec.whyBn,
      activeLines: spec.lines,
      scene: buildScene(state),
    };
  });
}

const RUN_EXCERPT = `def run(self, op, case_version=17):
    op.move(S.VALIDATED, "schema, bound account, ledger match")
    if op.amount >= self.CEILING:
        return op.move(S.WAITING_APPROVAL, "approval_required")
    op.move(S.AUTHORIZED, "grant refund.write < EUR 100")

    op.key = f"refund-case-{op.case}-v{case_version}"
    op.move(S.PREPARED, f"key={op.key}")
    op.move(S.DISPATCHED)
    try:
        self.provider.refund(op.key, op.amount)
        op.move(S.OBSERVED, "200 OK is transport status only")
    except Timeout as err:
        op.move(S.UNKNOWN_EFFECT, "reconcile, do not retry")

    found = self.provider.lookup(op.key)
    if found is None:
        return op.move(S.ESCALATED, "no effect after finality window")
    op.move(S.RECONCILED, f"ledger holds 1 refund")
    op.move(S.VERIFIED, "effect + message + case version bound")
    op.move(S.COMMITTED)`;

const NAIVE_EXCERPT = `def naive_retry(provider, case, amount):
    """'Retry three times': every attempt mints a fresh id."""
    for attempt in range(1, 4):
        try:
            return provider.refund(f"{case}-attempt-{attempt}", amount)
        except Timeout:
            continue`;

const COMMON: StepSpec[] = [
  {
    patch: { at: "model", chain: ["PROPOSED"] },
    titleEn: "The model proposes",
    titleBn: "মডেল প্রস্তাব দেয়",
    explanationEn: "The model proposes billing.execute_authorized_resolution for case 882, €42. So far it is only a proposal.",
    explanationBn: "মডেল case 882-এর জন্য €42-এর billing.execute_authorized_resolution প্রস্তাব করছে। এখনো এটা শুধুই প্রস্তাব।",
    whyEn: "A tool call is a model output. Nothing in the world has changed yet.",
    whyBn: "Tool call হলো মডেলের output। বাইরের দুনিয়ায় এখনো কিছুই বদলায়নি।",
    lines: [1],
  },
  {
    patch: { at: 0, gates: { 0: "pass" } },
    titleEn: "L1 Affordance",
    titleBn: "L1 Affordance",
    explanationEn: "The run sees a few work-shaped capabilities, not every billing endpoint.",
    explanationBn: "এই run কয়েকটা কাজ-ভিত্তিক capability দেখে, billing-এর সব endpoint না।",
    whyEn: "Overlapping or irrelevant tools make the wrong choice more likely.",
    whyBn: "কাছাকাছি নামের বা অপ্রয়োজনীয় tool থাকলে ভুল tool বাছার সম্ভাবনা বাড়ে।",
    lines: [1],
  },
  {
    patch: { at: 1, gates: { 1: "pass" }, chain: ["PROPOSED", "VALIDATED"] },
    titleEn: "L2 Proposal contract",
    titleBn: "L2 Proposal contract",
    explanationEn: "The schema passes, the harness binds the account ID itself, and €42 matches the duplicate charge.",
    explanationBn: "Schema ঠিক আছে, account ID harness নিজে bind করেছে, আর €42 duplicate charge-এর সাথে মেলে।",
    whyEn: "A valid schema can still carry the wrong customer. Meaning is checked, not only structure.",
    whyBn: "Schema ঠিক থাকলেও customer ভুল হতে পারে। তাই শুধু গঠন না, অর্থও যাচাই হয়।",
    lines: [2],
  },
];

const ACK_STEPS: StepSpec[] = [
  ...COMMON,
  {
    patch: { at: 2, gates: { 2: "pass" }, chain: ["PROPOSED", "VALIDATED", "AUTHORIZED"] },
    titleEn: "L3 Authority gate",
    titleBn: "L3 Authority gate",
    explanationEn: "This run holds refund.write below €100 under Refund Policy v14. €42 is inside the grant.",
    explanationBn: "Refund Policy v14 অনুযায়ী এই run-এর €100-এর নিচে refund.write অনুমতি আছে। €42 সেই সীমার ভেতরে।",
    whyEn: "Seeing a tool is not permission. The grant is checked in code, outside the model.",
    whyBn: "Tool দেখা মানেই অনুমতি না। Grant যাচাই হয় code-এ, মডেলের বাইরে।",
    lines: [3, 5],
  },
  {
    patch: { at: 3, gates: { 3: "pass" }, chain: ["PROPOSED", "VALIDATED", "AUTHORIZED", "PREPARED"] },
    titleEn: "L4 Effect adapter: key first",
    titleBn: "L4 Effect adapter: আগে key",
    explanationEn: "The key refund-case-882-v17 is written to the record before anything is sent.",
    explanationBn: "কিছু পাঠানোর আগেই key refund-case-882-v17 record-এ লেখা হলো।",
    whyEn: "The key names the obligation, so any retry or replacement worker resolves to the same refund.",
    whyBn: "Key দায়িত্বকে চিহ্নিত করে, তাই যেকোনো retry বা নতুন worker একই refund-এ ফিরে আসে।",
    lines: [7, 8],
  },
  {
    patch: { at: "provider", link: "call", ledger: ["1 refund"], chain: ["PROPOSED", "VALIDATED", "AUTHORIZED", "PREPARED", "DISPATCHED"] },
    titleEn: "Dispatch",
    titleBn: "Dispatch",
    explanationEn: "The provider commits one refund under that key.",
    explanationBn: "Provider ওই key-তে একটা refund commit করল।",
    whyEn: "From this moment an external effect may exist, whatever the response says.",
    whyBn: "এই মুহূর্ত থেকে বাইরের দুনিয়ায় effect থাকতে পারে, উত্তর যা-ই আসুক।",
    lines: [9, 11],
  },
  {
    patch: { at: 3, link: "lost", gates: { 3: "warning" }, token: { label: "refund €42", state: "warning" }, chain: ["PROPOSED", "VALIDATED", "AUTHORIZED", "PREPARED", "DISPATCHED", "UNKNOWN_EFFECT"] },
    titleEn: "The acknowledgement is lost",
    titleBn: "উত্তর হারিয়ে গেল",
    explanationEn: "The connection resets after commit. The adapter cannot tell what happened, so the run moves to UNKNOWN_EFFECT instead of retrying.",
    explanationBn: "Commit-এর পর connection কেটে গেল। Adapter বুঝতে পারছে না কী হয়েছে, তাই run retry না করে UNKNOWN_EFFECT-এ যায়।",
    whyEn: "Unknown is not failed. A timeout changes the evidence, not necessarily the world.",
    whyBn: "Unknown মানে failed না। Timeout evidence বদলায়, দুনিয়া নয়।",
    lines: [13, 14],
  },
  {
    patch: { at: "provider", link: "lookup", token: { label: "lookup key", state: "changed" } },
    titleEn: "Reconcile with the same key",
    titleBn: "একই key দিয়ে reconcile",
    explanationEn: "The harness asks the provider about refund-case-882-v17 and finds exactly one refund.",
    explanationBn: "Harness provider-কে refund-case-882-v17 নিয়ে জিজ্ঞেস করে আর ঠিক একটা refund পায়।",
    whyEn: "The authoritative ledger, not the model and not the transcript, decides what happened.",
    whyBn: "কী ঘটেছে তা ঠিক করে authoritative ledger, মডেল বা কথোপকথন না।",
    lines: [16],
  },
  {
    patch: { at: 4, gates: { 3: "pass", 4: "pass" }, token: { label: "refund €42", state: "active" }, chain: ["PREPARED", "DISPATCHED", "UNKNOWN_EFFECT", "RECONCILED"] },
    titleEn: "L5 Observation contract",
    titleBn: "L5 Observation contract",
    explanationEn: "The result comes back typed, with its source and version. One refund is on record as evidence.",
    explanationBn: "ফলাফল আসে typed, উৎস আর version সহ। একটা refund evidence হিসেবে record-এ উঠল।",
    whyEn: "Success-shaped text can hide a partial effect. A typed observation cannot.",
    whyBn: "Success-এর মতো দেখতে লেখা আংশিক effect লুকাতে পারে; typed observation পারে না।",
    lines: [19],
  },
  {
    patch: { at: 5, gates: { 5: "pass" }, chain: ["DISPATCHED", "UNKNOWN_EFFECT", "RECONCILED", "VERIFIED"] },
    titleEn: "L6 Evidence hook",
    titleBn: "L6 Evidence hook",
    explanationEn: "The refund, the customer message and the case version are bound together.",
    explanationBn: "Refund, customer-কে message আর case version একসাথে বাঁধা হলো।",
    whyEn: "An API acknowledgement is not proof that the obligation is met.",
    whyBn: "API-র acknowledgement মানেই দায়িত্ব পূরণের প্রমাণ না।",
    lines: [20],
  },
  {
    patch: { at: 5, token: { label: "refund €42", state: "created" }, chain: ["UNKNOWN_EFFECT", "RECONCILED", "VERIFIED", "COMMITTED"] },
    titleEn: "Committed, with one refund",
    titleBn: "Committed, একটাই refund",
    explanationEn: "Despite the timeout, the ledger holds exactly one refund and the case closes on evidence.",
    explanationBn: "Timeout সত্ত্বেও ledger-এ ঠিক একটা refund, আর case বন্ধ হলো evidence-এর ওপর।",
    whyEn: "Completion rests on evidence, not on the model saying it is done.",
    whyBn: "Completion দাঁড়ায় evidence-এর ওপর, মডেলের \"done\" বলার ওপর না।",
    lines: [21],
  },
];

const NAIVE_STEPS: StepSpec[] = [
  ...COMMON,
  {
    patch: { at: 2, gates: { 2: "pass" }, chain: ["PROPOSED", "VALIDATED", "AUTHORIZED"] },
    titleEn: "L3 Authority gate",
    titleBn: "L3 Authority gate",
    explanationEn: "€42 is inside the grant, exactly as in the keyed run.",
    explanationBn: "€42 grant-এর ভেতরে, keyed run-এর মতোই।",
    whyEn: "Up to here both designs are identical. The difference is in the effect adapter.",
    whyBn: "এখান পর্যন্ত দুই design একই। পার্থক্যটা effect adapter-এ।",
    lines: [1],
  },
  {
    patch: { at: 3, gates: { 3: "pass" } },
    titleEn: "L4 Effect adapter, no key",
    titleBn: "L4 Effect adapter, key ছাড়া",
    explanationEn: "Nothing is written before dispatch. Each attempt gets a fresh id: 882-attempt-1, 882-attempt-2…",
    explanationBn: "Dispatch-এর আগে কিছুই লেখা হয় না। প্রতিটা চেষ্টায় নতুন id: 882-attempt-1, 882-attempt-2…",
    whyEn: "Keying the attempt instead of the obligation makes every retry a new refund.",
    whyBn: "দায়িত্বের বদলে চেষ্টাকে key করলে প্রতিটা retry নতুন refund হয়ে যায়।",
    lines: [3, 5],
  },
  {
    patch: { at: "provider", link: "call", ledger: ["attempt-1"], chain: ["PROPOSED", "VALIDATED", "AUTHORIZED", "DISPATCHED"] },
    titleEn: "Refund #1 is committed",
    titleBn: "Refund #1 commit হলো",
    explanationEn: "The provider commits refund #1, then the response is lost.",
    explanationBn: "Provider refund #1 commit করল, তারপর উত্তর হারিয়ে গেল।",
    whyEn: "The world has changed even though the harness never hears about it.",
    whyBn: "Harness জানতে না পারলেও দুনিয়া বদলে গেছে।",
    lines: [5],
  },
  {
    patch: { at: 3, link: "lost", gates: { 3: "error" }, token: { label: "refund €42", state: "error" }, chain: ["AUTHORIZED", "DISPATCHED", "FAILED?"] },
    titleEn: "Timeout read as failure",
    titleBn: "Timeout-কে failure ধরা",
    explanationEn: "The naive harness reads the timeout as a failure and continues to the next attempt.",
    explanationBn: "Naive harness timeout-কে failure ধরে পরের চেষ্টায় চলে যায়।",
    whyEn: "There is no reconcile step, so the harness never learns that refund #1 exists.",
    whyBn: "Reconcile ধাপ নেই, তাই harness কখনো জানে না যে refund #1 হয়ে গেছে।",
    lines: [6, 7],
  },
  {
    patch: { at: "provider", link: "call", ledger: ["attempt-1", "attempt-2"], token: { label: "refund €42", state: "error" }, chain: ["DISPATCHED", "FAILED?", "DISPATCHED"] },
    titleEn: "Refund #2: paid twice",
    titleBn: "Refund #2: দুবার টাকা",
    explanationEn: "A new attempt id means a new operation. The customer gets €84 for one €42 obligation.",
    explanationBn: "নতুন attempt id মানে নতুন operation। একটা €42 দায়ের জন্য customer পেল €84।",
    whyEn: "The model did nothing wrong. The interface allowed a blind retry.",
    whyBn: "মডেল কোনো ভুল করেনি। Interface অন্ধ retry করতে দিয়েছে।",
    lines: [5],
  },
];

export const ACI_REFUND_ACK_LOST_VISUALIZATION: VisualizationDefinition = {
  id: "ai-engineering.harness.aci-refund.ack-lost",
  version: 1,
  category: "ai-engineering",
  titleEn: "One refund, six layers: acknowledgement lost",
  titleBn: "একটা refund, ছয়টা স্তর: উত্তর হারানো",
  subtitleEn: "Modeled walkthrough. The keyed harness reconciles an unknown effect instead of retrying.",
  subtitleBn: "মডেল করা walkthrough। Keyed harness অজানা effect-কে retry না করে reconcile করে।",
  codeLanguage: "python",
  codeSnippet: RUN_EXCERPT,
  concepts: ["aci", "idempotency", "unknown_effect", "reconcile"],
  steps: buildSteps(ACK_STEPS, "refund €42"),
};

export const ACI_REFUND_NAIVE_VISUALIZATION: VisualizationDefinition = {
  id: "ai-engineering.harness.aci-refund.naive-retry",
  version: 1,
  category: "ai-engineering",
  titleEn: "One refund, six layers: naive retry",
  titleBn: "একটা refund, ছয়টা স্তর: naive retry",
  subtitleEn: "Modeled walkthrough. Same model, same timeout, but the retry mints a new id.",
  subtitleBn: "মডেল করা walkthrough। একই মডেল, একই timeout, কিন্তু retry নতুন id বানায়।",
  codeLanguage: "python",
  codeSnippet: NAIVE_EXCERPT,
  concepts: ["retry", "idempotency", "duplicate-effect"],
  steps: buildSteps(NAIVE_STEPS, "refund €42"),
};
