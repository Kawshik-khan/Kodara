import { Scene, SceneNode, SceneNodeState, SceneEdge } from "../../types/scene.types";
import { VisualizationDefinition, VisualizationStep } from "../../types/visualization.types";

/**
 * Chapter 20 of The Harness Engineering Playbook: runtime skill linker,
 * grant intersection, context bill of materials, and mid-run revocation
 * (pp. 137–139, 147–148, Appendix H pp. 502–510).
 * Hand-authored, so labeled "modeled" (AGENT.md §10).
 */

type NodeId = "catalog" | "gate" | "grant" | "bom" | "assurance";
type NodeView = { label: string; state: SceneNodeState; sub?: string };

const ORDER: NodeId[] = ["catalog", "gate", "grant", "bom", "assurance"];
const ROW_X = 10;
const ROW_W = 380;
const ROW_H = 58;
const ROW_STEP = 68;
const VIEW = { width: 400, height: 10 + ORDER.length * ROW_STEP };
const TYPE: Record<NodeId, SceneNode["type"]> = {
  catalog: "memory-slot",
  gate: "stack-frame",
  grant: "generic-card",
  bom: "heap-object",
  assurance: "generic-card",
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
    catalog: { label: "Catalog (L0/L1) · duplicate-charge-investigation@4.2.0", state: "idle" },
    gate: { label: "Admission gate · Admissible(s, x)", state: "idle" },
    grant: { label: "Run grant G · PROPOSAL_ONLY", state: "idle" },
    bom: { label: "Context BOM (L2/L3) · []", state: "idle" },
    assurance: { label: "Assurance & dependencies · ACTIVE", state: "idle" },
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

// Excerpt from harness/ch20/skill_linker.py
const EXCERPT = `def admit_skill(rec, skill, signals, run_grant, policy_healthy=True):
    """Deterministic admission gate: discovery or nomination never authorizes loading by itself."""
    if skill.assurance != "ACTIVE":
        rec.status = "DENIED"
        rec.reason = "SKILL_REVOKED"
        return rec.status
    if skill.compat != "QUALIFIED":
        rec.status = "DENIED"
        rec.reason = f"COMPAT_{skill.compat}"
        return rec.status
    for sig in signals:
        if sig in skill.excluded:
            rec.status = "REJECTED"
            rec.reason = f"EXCLUDED:{sig}"
            return rec.status
    if not policy_healthy:
        rec.status = "SUSPENDED"
        rec.reason = "POLICY_DEPENDENCY_UNAVAILABLE"
        return rec.status

    rec.effective_tools = [t for t in skill.tools if t in run_grant]
    rec.bom = [f"{skill.id}@{skill.version}", skill.digest, "example:policy@31(non-authoritative)"]
    rec.status = "ADMITTED"
    rec.reason = "PROPOSAL_ONLY_GRANT"
    return rec.status

def resume_skill_run(rec, skill):
    if skill.assurance != "ACTIVE":
        rec.status = "REVOKED_STOPPED"
        rec.reason = "STOP_AND_RECONCILE"
        return rec.status
    rec.status = "RESUMED"
    return rec.status`;

const STEPS: StepSpec[] = [
  {
    nodes: {
      catalog: { label: "Catalog (L0/L1) · nominate duplicate-charge@4.2.0", sub: "digest: sha256:420a · chargeback-intake rejected", state: "active" },
      gate: { label: "Admission gate · checking compat & exclusions", state: "active" },
    },
    edge: { from: "catalog", to: "gate", label: "nominate v4.2.0", state: "active" },
    titleEn: "Discovery is not admission: check stack & exclusions",
    titleBn: "খুঁজে পাওয়া মানেই অনুমোদন নয়: স্ট্যাক ও বর্জন যাচাই",
    explanationEn: "The router nominates duplicate-charge-investigation@4.2.0 (sha256:420a). Before loading L2 instructions, the admission gate verifies QUALIFIED stack compatibility and ensures no excluded signals (active_chargeback, fraud_claim) are present.",
    explanationBn: "রাউটার duplicate-charge-investigation@4.2.0 (sha256:420a) মনোনীত করে। L2 নির্দেশনা লোড করার আগে অ্যাডমিশন গেট QUALIFIED কম্প্যাটিবিলিটি এবং নিষিদ্ধ সংকেত (active_chargeback, fraud_claim) পরীক্ষা করে।",
    whyEn: "A chargeback ticket often says 'charged twice,' so probabilistic nomination must be filtered by deterministic exclusions.",
    whyBn: "চার্জব্যাক টিকেটেও 'দুবার চার্জ হয়েছে' লেখা থাকতে পারে, তাই প্রোবাবিলিস্টিক মনোনয়নকে ডিটারমিনিস্টিক বর্জন গেট দিয়ে ছাঁকতে হয়।",
    lines: [3, 7, 11, 12],
  },
  {
    nodes: {
      gate: { label: "Admission gate · ADMITTED", state: "changed" },
      grant: { label: "Grant intersection · refund_create stripped!", sub: "effective: [billing_read, policy_read, case_proposal_write]", state: "changed" },
      bom: { label: "Context BOM (L2/L3) · v4.2.0 + example:policy@31", sub: "example typed as non-authoritative", state: "created" },
    },
    edge: { from: "gate", to: "grant", label: "Requested ∩ Grant", state: "active" },
    titleEn: "Intersect authority and record the Skill Bill of Materials",
    titleBn: "ক্ষমতার ছেদ (Intersection) এবং Skill Bill of Materials রেকর্ড",
    explanationEn: "The gate intersects skill.tools with the run's PROPOSAL_ONLY grant—stripping refund_create—and logs the exact digest and non-authoritative example (policy@31) in the Context Bill of Materials.",
    explanationBn: "গেটটি skill.tools-কে রানের PROPOSAL_ONLY অনুমতির সাথে ছেদ করে refund_create ছেঁটে ফেলে এবং Context Bill of Materials-এ ডাইজেস্ট ও অ-প্রামাণ্য উদাহরণ (policy@31) রেকর্ড করে।",
    whyEn: "A skill can never expand the run's permission grant, and every loaded resource must be traceable in the BOM.",
    whyBn: "একটি স্কিল কখনোই রানের অনুমতি বাড়াতে পারে না, এবং লোড হওয়া প্রতিটি রিসোর্স BOM-এ নথিভুক্ত থাকতে হয়।",
    lines: [21, 22, 23, 24],
  },
  {
    nodes: {
      gate: { label: "Admission gate · SUSPENDED", state: "warning" },
      bom: { label: "Context BOM · example:policy@31 blocked as authority", state: "warning" },
      assurance: { label: "Live policy@32 · TIMEOUT (dependency unhealthy)", sub: "missing_policy -> SUSPEND_OR_ESCALATE", state: "error" },
    },
    edge: { from: "assurance", to: "gate", label: "policy timeout", state: "active" },
    titleEn: "Compound adverse case: policy service times out → SUSPEND",
    titleBn: "যৌগিক প্রতিকূল পরিস্থিতি: পলিসি সার্ভিস টাইমআউট → SUSPEND",
    explanationEn: "When the live billing-policy@32 service times out, the harness refuses to treat the skill's embedded billing-policy@31 example as current policy and suspends the run.",
    explanationBn: "যখন লাইভ billing-policy@32 সার্ভিস টাইমআউট হয়, হার্নেস স্কিলের ভেতরের পুরনো billing-policy@31 উদাহরণকে বর্তমান নীতি হিসেবে ব্যবহার করতে অস্বীকার করে এবং রানটি স্থগিত করে।",
    whyEn: "Constitutional policy and current authoritative facts must never be silently sourced from skill prose or examples.",
    whyBn: "বর্তমান প্রামাণ্য নীতি কখনোই স্কিলের গদ্য বা পুরনো উদাহরণ থেকে চুপিসারে নেওয়া যাবে না।",
    lines: [16, 17, 18, 19],
  },
  {
    nodes: {
      gate: { label: "Runtime linker · REVOKED_STOPPED", state: "error" },
      assurance: { label: "Assurance state · REVOKED (dependency compromised)", sub: "active_run_policy: STOP_AND_RECONCILE", state: "error" },
    },
    edge: { from: "assurance", to: "gate", label: "block resume", state: "active" },
    titleEn: "Mid-run revocation blocks resume → STOP_AND_RECONCILE",
    titleBn: "বিরতির মধ্যে স্কিল বাতিল → STOP_AND_RECONCILE",
    explanationEn: "While the run is suspended, security revokes v4.2.0 due to a compromised helper dependency. When the run attempts to resume, resume_skill_run() blocks reactivation and routes the run to STOP_AND_RECONCILE.",
    explanationBn: "রানটি স্থগিত থাকার সময় একটি হেল্পার ডিপেন্ডেন্সি কম্প্রোমাইজড হওয়ায় সিকিউরিটি v4.2.0 বাতিল (REVOKE) করে। রানটি পুনরায় চালু হতে গেলে resume_skill_run() তা আটকে দেয় এবং STOP_AND_RECONCILE-এ পাঠায়।",
    whyEn: "Revocation must reach active and suspended runs, not just future catalog lookups.",
    whyBn: "Revocation কেবল ভবিষ্যতের ক্যাটালগ খোঁজায় নয়, চলমান ও স্থগিত রানেও কার্যকর হতে হবে।",
    lines: [28, 29, 30, 31],
  },
];

export const SKILL_LIFECYCLE_VISUALIZATION: VisualizationDefinition = {
  id: "ai-engineering.harness.skill-lifecycle",
  version: 1,
  category: "ai-engineering",
  titleEn: "Runtime Skill Linker: Grant Intersection, BOM, and Mid-Run Revocation",
  titleBn: "Runtime Skill Linker: Grant ছেদ, BOM এবং মাঝপথে Revocation",
  subtitleEn:
    "Modeled walkthrough of Chapter 20 (pp. 138–139, 147–148) and Appendix H.12 (p. 510): deterministic skill admission, PROPOSAL_ONLY grant intersection, non-authoritative examples during a policy outage, and mid-run revocation.",
  subtitleBn:
    "মডেল করা walkthrough (অধ্যায় ২০, পৃষ্ঠা 138–139, 147–148 এবং পরিশিষ্ট H.12, পৃষ্ঠা 510): ডিটারমিনিস্টিক স্কিল অ্যাডমিশন, PROPOSAL_ONLY grant ছেদ, পলিসি বিভ্রাটে পুরনো উদাহরণ রোধ এবং মাঝপথে revocation।",
  codeLanguage: "python",
  codeSnippet: EXCERPT,
  concepts: ["probabilistic-linker", "skill-admission-gate", "context-bom", "skill-revocation"],
  steps: buildSteps(STEPS),
};

