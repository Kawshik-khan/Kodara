import { Scene, SceneNode, SceneNodeState, SceneEdge } from "../../types/scene.types";
import { VisualizationDefinition, VisualizationStep } from "../../types/visualization.types";

/**
 * Chapter 04 of the Harness Engineering Playbook: the budgeted controller
 * across a payment timeout, suspension, reconciliation and completion (pp. 106–107).
 * Hand-authored, so labeled "modeled" (AGENT.md §10).
 */

type NodeId = "controller" | "ledger" | "effect" | "progress" | "provider";
type NodeView = { label: string; state: SceneNodeState; sub?: string };

const ORDER: NodeId[] = ["controller", "ledger", "effect", "progress", "provider"];
const ROW_X = 10;
const ROW_W = 380;
const ROW_H = 58;
const ROW_STEP = 68;
const VIEW = { width: 400, height: 10 + ORDER.length * ROW_STEP };
const TYPE: Record<NodeId, SceneNode["type"]> = {
  controller: "stack-frame",
  ledger: "memory-slot",
  effect: "generic-card",
  progress: "generic-card",
  provider: "heap-object",
};

function buildScene(view: Record<NodeId, NodeView>, edges: SceneEdge[]): Scene {
  const nodes: SceneNode[] = ORDER.map((id, i) => ({
    id,
    type: TYPE[id],
    label: view[id].label,
    subLabel: view[id].sub,
    x: ROW_X,
    y: 10 + i * ROW_STEP,
    width: ROW_W,
    height: ROW_H,
    state: view[id].state,
  }));
  return { viewBox: VIEW, nodes, edges };
}

interface StepSpec {
  nodes: Partial<Record<NodeId, Partial<NodeView>>>;
  edge?: { from: NodeId; to: NodeId; label: string; state: SceneEdge["state"] };
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  whyEn: string;
  whyBn: string;
  lines: number[];
}

function buildSteps(specs: StepSpec[]): VisualizationStep[] {
  let view: Record<NodeId, NodeView> = {
    controller: { label: "Controller · RUNNING", state: "idle" },
    ledger: { label: "Budget ledger · 5 calls (1 reserve)", state: "idle" },
    effect: { label: "Effect state · NONE", state: "idle" },
    progress: { label: "Obligations · [refund, verify]", state: "idle" },
    provider: { label: "Payment provider · op-7391", state: "idle" },
  };
  return specs.map((spec, i) => {
    const next = Object.fromEntries(
      ORDER.map((id) => [id, { ...view[id], state: "idle" as SceneNodeState, ...spec.nodes[id] }])
    ) as Record<NodeId, NodeView>;
    view = next;
    const edges: SceneEdge[] = spec.edge
      ? [{ id: `e-${i}`, fromNodeId: spec.edge.from, toNodeId: spec.edge.to, type: "call", label: spec.edge.label, state: spec.edge.state }]
      : [];
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
      scene: buildScene(view, edges),
    };
  });
}

// Excerpt from harness/ch04/budgeted_controller.py; excerpt line = file line − 15.
const EXCERPT = `def step(ctrl, action, target="op-7391", outcome="ok"):
    """Admit and execute one governed controller transition."""
    if ctrl.effect == "UNKNOWN_EFFECT" and action not in ("reconcile", "wait_window"):
        ctrl.state = "RECOVERING"
        return ctrl.state

    if action == "wait_window":
        ctrl.state = "WAITING_EXTERNAL"
        ctrl.log.append("suspended: 0 model calls burned")
        return ctrl.state

    if action not in ("reconcile", "verify") and ctrl.calls_left - 1 < ctrl.reserve:
        ctrl.state = "BUDGET_EXHAUSTED"
        ctrl.log.append("blocked: would dip into recovery reserve")
        return ctrl.state

    fp = f"{action}:{target}:{ctrl.effect}:{len(ctrl.obligations)}"
    if fp in ctrl.history:
        ctrl.state = "ABSTAINED"
        ctrl.log.append(f"cycle detected on {fp}")
        return ctrl.state
    ctrl.history.append(fp)

    ctrl.calls_left -= 1
    if action == "dispatch_refund":
        if outcome == "timeout":
            ctrl.effect = "UNKNOWN_EFFECT"
            ctrl.state = "RECOVERING"
        else:
            ctrl.effect = "CONFIRMED"
            ctrl.obligations.remove("refund")
    elif action == "reconcile":
        if outcome == "found":
            ctrl.effect = "CONFIRMED"
            ctrl.obligations.remove("refund")
            ctrl.state = "VERIFYING"
        else:
            ctrl.state = "UNRESOLVED_EFFECT"
    elif action == "verify" and "refund" not in ctrl.obligations:
        ctrl.obligations.remove("verify")
        ctrl.state = "COMPLETED"
    return ctrl.state`;

const STEPS: StepSpec[] = [
  {
    nodes: {
      controller: { label: "Controller · admit dispatch_refund", state: "active" },
      ledger: { label: "Budget ledger · 5 − 1 ≥ 1 reserve ✓", sub: "calls_left: 4 (reserve: 1)", state: "changed" },
      progress: { label: "Fingerprint · dispatch_refund:op-7391:NONE:2", state: "created" },
    },
    edge: { from: "controller", to: "ledger", label: "check reserve", state: "active" },
    titleEn: "Verify recovery reserve and fingerprint",
    titleBn: "Recovery reserve এবং fingerprint যাচাই",
    explanationEn: "Before dispatching op-7391, the controller verifies that 1 call remains reserved for recovery and records the control-state fingerprint.",
    explanationBn: "op-7391 পাঠানোর আগে controller নিশ্চিত করে যে recovery-র জন্য অন্তত ১টি কল সংরক্ষিত থাকবে এবং বর্তমান অবস্থার fingerprint লিখে রাখে।",
    whyEn: "A system that spends its last call creating an external effect with nothing left to reconcile it is insolvent.",
    whyBn: "যে সিস্টেম শেষ কল খরচ করে বাহ্যিক কাজ শুরু করে কিন্তু মীমাংসার জন্য কিছু রাখে না, সেটি দেউলিয়া।",
    lines: [12, 17, 22, 24],
  },
  {
    nodes: {
      controller: { label: "Controller · RECOVERING", state: "warning" },
      effect: { label: "Effect state · UNKNOWN_EFFECT", sub: "timeout after dispatch", state: "error" },
      provider: { label: "Payment provider · timeout (no reply)", state: "warning" },
    },
    edge: { from: "controller", to: "provider", label: "dispatch -> timeout", state: "active" },
    titleEn: "Timeout moves run to RECOVERING, not retry",
    titleBn: "Timeout হলে retry না, RECOVERING অবস্থায় গমন",
    explanationEn: "The provider does not reply in time. The controller sets effect to UNKNOWN_EFFECT and enters RECOVERING, blocking any new refund call.",
    explanationBn: "Provider সময়মতো উত্তর দেয় না। Controller effect-কে UNKNOWN_EFFECT চিহ্নিত করে এবং RECOVERING অবস্থায় যায়, যাতে নতুন কোনো refund কল চলতে না পারে।",
    whyEn: "Timeouts are epistemic events: they say the caller stopped waiting, not that the payment failed.",
    whyBn: "Timeout কেবল বলে যে অপেক্ষা শেষ হয়েছে; এটি প্রমাণ করে না যে টাকা যায়নি।",
    lines: [3, 4, 25, 26, 27, 28],
  },
  {
    nodes: {
      controller: { label: "Controller · WAITING_EXTERNAL", state: "active" },
      ledger: { label: "Budget ledger · 4 calls left (0 burned)", state: "idle" },
      provider: { label: "Payment provider · waiting for query window", state: "idle" },
    },
    edge: { from: "controller", to: "provider", label: "suspend until wake", state: "traversing" },
    titleEn: "Suspend in WAITING_EXTERNAL without burning calls",
    titleBn: "কল খরচ না করে WAITING_EXTERNAL অবস্থায় অপেক্ষা",
    explanationEn: "Until the provider's reconciliation window opens, the controller suspends in WAITING_EXTERNAL. Zero model turns are consumed.",
    explanationBn: "Provider-এর মীমাংসার সময় না খোলা পর্যন্ত controller WAITING_EXTERNAL অবস্থায় স্থগিত থাকে। এতে একটিও মডেল কল খরচ হয় না।",
    whyEn: "WAITING_EXTERNAL is explicit suspension, not a slow version of RUNNING that polls in a chat loop.",
    whyBn: "WAITING_EXTERNAL মানে সুনির্দিষ্ট বিরতি; চ্যাট লুপে বারবার জিজ্ঞেস করে টোকেন পোড়ানো নয়।",
    lines: [7, 8, 9, 10],
  },
  {
    nodes: {
      controller: { label: "Controller · VERIFYING", state: "changed" },
      ledger: { label: "Budget ledger · 3 calls left", state: "changed" },
      effect: { label: "Effect state · CONFIRMED", sub: "1 settled refund on ledger", state: "created" },
      progress: { label: "Obligations · [verify] (refund closed)", state: "changed" },
      provider: { label: "Payment provider · lookup(op-7391) -> found", state: "active" },
    },
    edge: { from: "controller", to: "provider", label: "reconcile(op-7391)", state: "active" },
    titleEn: "Reconcile by operation key → VERIFYING",
    titleBn: "Operation key দিয়ে মীমাংসা → VERIFYING",
    explanationEn: "Querying the ledger by op-7391 finds the settled refund. The effect becomes CONFIRMED, the refund obligation closes, and the run enters VERIFYING.",
    explanationBn: "op-7391 দিয়ে ledger খুঁজে দেখা যায় refund আগেই সম্পন্ন হয়েছে। Effect হয় CONFIRMED, refund দায়িত্বটি বন্ধ হয় এবং রান VERIFYING-এ যায়।",
    whyEn: "Progress is observable: open obligations decreased from 2 to 1 without sending a second payment.",
    whyBn: "অগ্রগতি স্পষ্টভাবে দৃশ্যমান: দ্বিতীয়বার টাকা না পাঠিয়েই বাকি দায়িত্ব ২ থেকে ১-এ নেমেছে।",
    lines: [32, 33, 34, 35, 36],
  },
  {
    nodes: {
      controller: { label: "Controller · COMPLETED", state: "created" },
      ledger: { label: "Budget ledger · 2 calls left", state: "idle" },
      progress: { label: "Obligations · [] (all closed)", state: "created" },
    },
    edge: { from: "controller", to: "progress", label: "verify obligations", state: "active" },
    titleEn: "Verify final obligations → COMPLETED",
    titleBn: "চূড়ান্ত যাচাই সম্পন্ন → COMPLETED",
    explanationEn: "With the refund obligation closed, the verify step qualifies completion. The controller enters COMPLETED with 2 calls remaining.",
    explanationBn: "Refund দায়িত্ব মিটে যাওয়ায় verify ধাপটি কাজ শেষের শর্ত পূরণ করে। ২টি কল হাতে রেখেই controller COMPLETED অবস্থায় পৌঁছায়।",
    whyEn: "The worker may propose stopping, but only the controller writes COMPLETED after every obligation is closed.",
    whyBn: "Worker থামার প্রস্তাব দিতে পারে, কিন্তু সব দায়িত্ব পূর্ণ হওয়ার পর কেবল controller-ই COMPLETED লিখতে পারে।",
    lines: [39, 40, 41, 42],
  },
  {
    nodes: {
      controller: { label: "Controller · UNRESOLVED_EFFECT (if ledger down)", state: "error" },
      effect: { label: "Effect state · UNKNOWN_EFFECT", sub: "routed to payments incident owner", state: "error" },
      progress: { label: "Obligations · [refund, verify] (preserved)", state: "warning" },
    },
    titleEn: "Alternative: ledger down at deadline → UNRESOLVED_EFFECT",
    titleBn: "বিকল্প: শেষ সময় পর্যন্ত ledger বন্ধ থাকলে → UNRESOLVED_EFFECT",
    explanationEn: "If the reconciliation endpoint stays unavailable until the deadline, the controller terminates as UNRESOLVED_EFFECT and routes the frozen packet to the payments owner.",
    explanationBn: "যদি শেষ সময়সীমা পর্যন্ত মীমাংসার ব্যবস্থা অচল থাকে, তবে controller UNRESOLVED_EFFECT হিসেবে থামে এবং পুরো তথ্য payments owner-এর কাছে পাঠায়।",
    whyEn: "Termination is not completion: when truth cannot be established, stop honestly without guessing or paying twice.",
    whyBn: "থেমে যাওয়া মানেই কাজ শেষ হওয়া নয়: সত্য নিশ্চিত করা না গেলে আন্দাজ না করে বা দুবার টাকা না দিয়ে সৎভাবে থামতে হয়।",
    lines: [37, 38],
  },
];

export const BUDGETED_CONTROLLER_VISUALIZATION: VisualizationDefinition = {
  id: "ai-engineering.harness.budgeted-controller",
  version: 1,
  category: "ai-engineering",
  titleEn: "Continue, wait, reconcile, or stop honestly",
  titleBn: "চালিয়ে যাওয়া, অপেক্ষা, মীমাংসা কিংবা সৎভাবে থামা",
  subtitleEn: "Modeled walkthrough of the refund controller (pp. 106–107): reserve check, timeout to RECOVERING, suspension in WAITING_EXTERNAL, reconciliation, and UNRESOLVED_EFFECT.",
  subtitleBn: "মডেল করা walkthrough (পৃষ্ঠা 106–107, refund controller): reserve যাচাই, timeout থেকে RECOVERING, WAITING_EXTERNAL-এ বিরতি, মীমাংসা এবং UNRESOLVED_EFFECT।",
  codeLanguage: "python",
  codeSnippet: EXCERPT,
  concepts: ["budgeted-controller", "recovery-reserve", "progress-certificate", "typed-termination"],
  steps: buildSteps(STEPS),
};

