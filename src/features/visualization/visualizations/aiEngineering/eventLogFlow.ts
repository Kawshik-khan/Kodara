import { Scene, SceneNode, SceneNodeState, SceneEdge } from "../../types/scene.types";
import { VisualizationDefinition, VisualizationStep } from "../../types/visualization.types";

/**
 * Chapter 01 of the Harness Engineering Playbook: a worker crashes after the
 * refund went through, and the run resumes from the event log. Hand-authored,
 * so labeled "modeled" (AGENT.md §10); the recorded trace is in the code-trace block.
 */

type NodeId = "worker" | "transcript" | "log" | "state" | "provider";
type NodeView = { label: string; state: SceneNodeState; sub?: string };

const ORDER: NodeId[] = ["worker", "transcript", "log", "state", "provider"];
const ROW_X = 10;
const ROW_W = 380;
const ROW_H = 58;
const ROW_STEP = 68;
const VIEW = { width: 400, height: 10 + ORDER.length * ROW_STEP };
const TYPE: Record<NodeId, SceneNode["type"]> = {
  worker: "generic-card",
  transcript: "generic-card",
  log: "stack-frame",
  state: "memory-slot",
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
    worker: { label: "Worker · running", state: "idle" },
    transcript: { label: "Transcript · (empty)", state: "idle" },
    log: { label: "Event log · (empty)", state: "idle" },
    state: { label: "Materialized state · —", state: "idle" },
    provider: { label: "Payment provider · no refund", state: "idle" },
  };
  return specs.map((spec, i) => {
    // every node falls back to idle unless this step marks it
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

// worker() and resume_from_log() from harness/ch01/event_log.py; excerpt line = file line − 69.
const EXCERPT = `def worker(log, transcript, provider, crash=False):
    key = "refund-case-882"
    log.append("effect_dispatched", key=key, amount=42.0)   # intent recorded first
    provider.refund(key, 42.0)
    if crash:
        raise Crash("worker died before the response was written")
    log.append("effect_observed", key=key)
    transcript.append("refund confirmed")


def resume_from_transcript(transcript, provider):
    """Narrative reconstruction: no confirmation in the chat, so refund again."""
    if "refund confirmed" not in transcript:
        provider.refund(f"retry-{len(transcript) + 1}", 42.0)  # a new id, a second refund
        transcript.append("refund confirmed")


def resume_from_log(log, provider):
    """Rebuild state from events, reconcile unresolved effects, then finish."""
    if not log.intact():
        raise RuntimeError("event log was edited: refuse to resume")
    state = materialize(log.events)
    for key in list(state["unresolved"]):
        if provider.lookup(key) is not None:
            log.append("effect_reconciled", key=key)
        else:
            log.append("effect_escalated", key=key)
    state = materialize(log.events)
    if not state["unresolved"]:
        log.append("completed", evidence=state["evidence"])
    return materialize(log.events)`;

const STEPS: StepSpec[] = [
  {
    nodes: { worker: { state: "active" }, log: { label: "Event log · 1 effect_dispatched", state: "created" } },
    edge: { from: "worker", to: "log", label: "append", state: "active" },
    titleEn: "Record the intent first",
    titleBn: "আগে intent লেখা",
    explanationEn: "Before any money moves, the worker appends effect_dispatched with the key refund-case-882 to the event log.",
    explanationBn: "টাকা পাঠানোর আগেই worker event log-এ refund-case-882 key-সহ effect_dispatched যোগ করে।",
    whyEn: "If the worker dies a moment later, the log still says an effect may exist.",
    whyBn: "এক মুহূর্ত পরে worker মরে গেলেও log বলবে একটা effect হয়তো ঘটেছে।",
    lines: [2, 3],
  },
  {
    nodes: { worker: { state: "active" }, provider: { label: "Payment provider · 1 refund", state: "changed" } },
    edge: { from: "worker", to: "provider", label: "refund(key)", state: "active" },
    titleEn: "The provider pays",
    titleBn: "Provider টাকা দেয়",
    explanationEn: "The payment API accepts the refund and records it under refund-case-882.",
    explanationBn: "Payment API refund গ্রহণ করে আর refund-case-882 key-তে লিখে রাখে।",
    whyEn: "The provider is the authoritative record of whether money moved.",
    whyBn: "টাকা গেছে কি না, তার authoritative record provider-এর কাছে।",
    lines: [4],
  },
  {
    nodes: { worker: { label: "Worker · crashed", state: "error" }, transcript: { label: "Transcript · no confirmation", state: "warning" } },
    titleEn: "The worker crashes",
    titleBn: "Worker crash করে",
    explanationEn: "The worker dies before the response reaches the conversation. The transcript never says \"refund confirmed\".",
    explanationBn: "উত্তর কথোপকথনে পৌঁছানোর আগেই worker মারা যায়। Transcript-এ কখনো \"refund confirmed\" লেখা হয় না।",
    whyEn: "If the transcript were the state, the next worker would see no refund and pay again.",
    whyBn: "Transcript-কে state ধরলে পরের worker কোনো refund দেখত না, আর আবার টাকা দিত।",
    lines: [5, 6],
  },
  {
    nodes: { worker: { label: "Worker · resumed", state: "active" }, log: { label: "Event log · chain intact ✓", state: "active" } },
    titleEn: "Resume: check the log",
    titleBn: "Resume: log যাচাই",
    explanationEn: "A new worker starts by checking the event log's hash chain. Nobody has edited history.",
    explanationBn: "নতুন worker শুরু করে event log-এর hash chain যাচাই দিয়ে। কেউ ইতিহাস বদলায়নি।",
    whyEn: "Recovery decisions rest on the log, so its integrity comes first.",
    whyBn: "Recovery-র সিদ্ধান্ত log-এর ওপর দাঁড়ায়, তাই আগে তার অখণ্ডতা।",
    lines: [20, 21],
  },
  {
    nodes: { state: { label: "Materialized state · EXECUTING", sub: "unresolved: refund-case-882", state: "warning" } },
    edge: { from: "log", to: "state", label: "materialize", state: "active" },
    titleEn: "Rebuild the state",
    titleBn: "State আবার তৈরি",
    explanationEn: "The state is rebuilt from the events: phase EXECUTING, with one unresolved effect.",
    explanationBn: "Event থেকে state আবার তৈরি হয়: phase EXECUTING, আর একটা অমীমাংসিত effect।",
    whyEn: "Resume uses durable state, not a summary of the conversation. Unknown is not failed.",
    whyBn: "Resume ব্যবহার করে durable state, কথোপকথনের সারাংশ না। অজানা মানে ব্যর্থ না।",
    lines: [22],
  },
  {
    nodes: { provider: { label: "Payment provider · 1 refund", state: "active" } },
    edge: { from: "worker", to: "provider", label: "lookup(key)", state: "traversing" },
    titleEn: "Reconcile with the provider",
    titleBn: "Provider-এর সাথে মীমাংসা",
    explanationEn: "The worker asks the provider about refund-case-882 and finds the refund.",
    explanationBn: "Worker provider-কে refund-case-882 নিয়ে জিজ্ঞেস করে আর refund-টা খুঁজে পায়।",
    whyEn: "The key is known because it was written to the log, not kept in the dead worker's memory.",
    whyBn: "Key জানা আছে কারণ সেটা log-এ লেখা ছিল, মরা worker-এর memory-তে না।",
    lines: [23, 24],
  },
  {
    nodes: { log: { label: "Event log · 2 effect_reconciled", state: "created" } },
    edge: { from: "worker", to: "log", label: "append", state: "active" },
    titleEn: "Append the evidence",
    titleBn: "Evidence যোগ করা",
    explanationEn: "The reconciliation is appended as a new event. Nothing earlier is edited.",
    explanationBn: "মীমাংসার ফল নতুন event হিসেবে যোগ হয়। আগের কিছুই বদলানো হয় না।",
    whyEn: "Corrections are new events; the history shows when and how the uncertainty ended.",
    whyBn: "সংশোধন মানে নতুন event; ইতিহাসে দেখা যায় কখন আর কীভাবে অনিশ্চয়তা শেষ হলো।",
    lines: [25],
  },
  {
    nodes: { state: { label: "Materialized state · EXECUTING", sub: "unresolved: none · evidence: refund-case-882", state: "changed" } },
    edge: { from: "log", to: "state", label: "materialize", state: "active" },
    titleEn: "Rebuild again",
    titleBn: "আবার তৈরি",
    explanationEn: "With the new event the effect moves from unresolved to evidence.",
    explanationBn: "নতুন event-এর ফলে effect অমীমাংসিত থেকে evidence-এ চলে যায়।",
    whyEn: "State is never edited directly, so state and log can never disagree.",
    whyBn: "State সরাসরি বদলানো হয় না, তাই state আর log কখনো আলাদা কথা বলে না।",
    lines: [28],
  },
  {
    nodes: {
      log: { label: "Event log · 3 completed", state: "created" },
      state: { label: "Materialized state · COMPLETED", sub: "evidence: refund-case-882", state: "created" },
      worker: { label: "Worker · done", state: "idle" },
    },
    titleEn: "Completed, with one refund",
    titleBn: "Completed, একটাই refund",
    explanationEn: "No effect is unresolved, so a completed event is appended with its evidence. The provider holds exactly one refund.",
    explanationBn: "কোনো effect অমীমাংসিত নেই, তাই evidence-সহ completed event যোগ হয়। Provider-এর কাছে ঠিক একটা refund।",
    whyEn: "Completion is evidence-bound and on record, so it can be checked later.",
    whyBn: "Completion evidence-এর সাথে বাঁধা আর record-এ আছে, তাই পরে যাচাই করা যায়।",
    lines: [29, 30, 31],
  },
];

export const EVENT_LOG_VISUALIZATION: VisualizationDefinition = {
  id: "ai-engineering.harness.event-log-resume",
  version: 1,
  category: "ai-engineering",
  titleEn: "Resume from the event log, not the transcript",
  titleBn: "Transcript না, event log থেকে resume",
  subtitleEn: "Modeled walkthrough. A worker crashes after the refund went through; the next one rebuilds state from events and reconciles.",
  subtitleBn: "মডেল করা walkthrough। Refund হয়ে যাওয়ার পর worker crash করে; পরের worker event থেকে state তৈরি করে মীমাংসা করে।",
  codeLanguage: "python",
  codeSnippet: EXCERPT,
  concepts: ["event-log", "materialized-state", "unknown_effect", "resume"],
  steps: buildSteps(STEPS),
};
