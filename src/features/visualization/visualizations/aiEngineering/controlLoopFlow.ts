import { Scene, SceneEdge, SceneNode, SceneNodeState } from "../../types/scene.types";
import { VisualizationDefinition, VisualizationStep } from "../../types/visualization.types";

/**
 * Chapter 00 of the Harness Engineering Playbook: one run of the harness
 * control loop. Hand-authored, so labeled "modeled" (AGENT.md §10); the
 * recorded line-by-line trace lives in the code-trace block.
 */

type Stage = "context" | "model" | "gate" | "execute" | "update" | "stop";
type StageState = "idle" | "active" | "pass" | "warning" | "error";

const STAGES: Array<{ id: Stage; label: string }> = [
  { id: "context", label: "Context  c_t" },
  { id: "model", label: "Model  z_t" },
  { id: "gate", label: "Gate  a_t" },
  { id: "execute", label: "Execute  o_t" },
  { id: "update", label: "Update  s_t+1" },
  { id: "stop", label: "Stop rule" },
];

const ROW_X = 10;
const ROW_W = 250;
const ROW_H = 50;
const ROW_Y0 = 10;
const ROW_STEP = 58;
const SIDE_X = 272;
const SIDE_W = 118;
const STATE_Y = ROW_Y0 + STAGES.length * ROW_STEP + 6;
const VIEW = { width: 400, height: STATE_Y + 80 };
const rowY = (i: number) => ROW_Y0 + i * ROW_STEP;

interface LoopState {
  at: Stage;
  stages: Partial<Record<Stage, { state: StageState; note?: string }>>;
  token: { label: string; state: SceneNodeState };
  budget: number;
  facts: string;
  loopBack?: boolean;
}

function buildScene(s: LoopState): Scene {
  const index = STAGES.findIndex((st) => st.id === s.at);
  const nodes: SceneNode[] = [
    ...STAGES.map(({ id, label }, i): SceneNode => {
      const st = s.stages[id];
      const current = id === s.at;
      const state: SceneNodeState =
        st?.state === "warning" || st?.state === "error" ? st.state : current ? "active" : "idle";
      return {
        id: `stage-${id}`,
        type: "generic-card",
        label: st?.note ? `${label} · ${st.note}` : label,
        x: ROW_X,
        y: rowY(i),
        width: ROW_W,
        height: ROW_H,
        state,
      };
    }),
    { id: "token", type: "memory-slot", label: s.token.label, x: SIDE_X, y: rowY(index), width: SIDE_W, height: ROW_H, state: s.token.state },
    {
      id: "state",
      type: "stack-frame",
      label: `Run state · budget ${s.budget}`,
      subLabel: s.facts,
      x: ROW_X,
      y: STATE_Y,
      width: 380,
      height: 66,
      state: "idle",
    },
  ];
  const edges: SceneEdge[] = s.loopBack
    ? [{ id: "e-loop", fromNodeId: "stage-update", toNodeId: "stage-context", type: "return", label: "next step", state: "active", dashed: true }]
    : [];
  return { viewBox: VIEW, nodes, edges };
}

interface StepSpec {
  patch: Partial<LoopState>;
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  whyEn: string;
  whyBn: string;
  lines: number[];
}

function buildSteps(specs: StepSpec[]): VisualizationStep[] {
  let state: LoopState = {
    at: "context",
    stages: {},
    token: { label: "—", state: "active" },
    budget: 4,
    facts: "facts: {}",
  };
  return specs.map((spec, i) => {
    state = { ...state, loopBack: false, ...spec.patch, stages: { ...state.stages, ...spec.patch.stages } };
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

const LOOP_EXCERPT = `def control_loop(run, model, grant, tools, verify):
    while run.budget > 0:
        context = {"task": run.task, "facts": dict(run.state)}  # c_t = Context(s_t)
        action, args = model(context)                         # z_t ~ Model(c_t)
        if action == "done":
            if verify(run.state):                             # check the world, not the sentence
                return finish(run, Stop.COMPLETE)
            run.trail.append("claimed done without evidence")
            run.budget -= 1
            continue
        verdict = grant.admits(run.task, action)              # a_t = Gate(z_t)
        if verdict is not None:
            return finish(run, verdict)
        observation = tools[action](**args)                   # o_t = Execute(a_t)
        run.state[action] = observation                       # s_t+1 = Update(s_t, a_t, o_t)
        run.trail.append(f"{action} -> {observation}")
        run.budget -= 1
    return finish(run, Stop.BUDGET_EXHAUSTED)`;

const STEPS: StepSpec[] = [
  {
    patch: { at: "context", token: { label: "task", state: "active" } },
    titleEn: "Build the briefing",
    titleBn: "Briefing তৈরি",
    explanationEn: "Task: resolve the duplicate charge on case 882. The harness assembles what the model may see: the task and the facts it has so far (none yet).",
    explanationBn: "Task: case 882-এর duplicate charge সমাধান। মডেল কী দেখবে তা harness সাজায়: task আর এখন পর্যন্ত জানা তথ্য (এখনো কিছু নেই)।",
    whyEn: "The model fetches nothing on its own. Which facts reach it is the harness's decision.",
    whyBn: "মডেল নিজে কিছু আনে না। কোন তথ্য তার কাছে যাবে, সেটা harness-এর সিদ্ধান্ত।",
    lines: [2, 3],
  },
  {
    patch: { at: "model", token: { label: "read_ledger", state: "active" } },
    titleEn: "The model proposes",
    titleBn: "মডেলের প্রস্তাব",
    explanationEn: "The model proposes read_ledger(case=882). It is only a proposal.",
    explanationBn: "মডেল প্রস্তাব করে read_ledger(case=882)। এটা শুধুই প্রস্তাব।",
    whyEn: "The proposal is the only term the model controls in the loop.",
    whyBn: "পুরো loop-এ মডেলের হাতে শুধু এই প্রস্তাবটাই।",
    lines: [4],
  },
  {
    patch: { at: "gate", stages: { gate: { state: "idle", note: "4 checks ✓" } } },
    titleEn: "The gate admits a read",
    titleBn: "Gate একটা read অনুমোদন করে",
    explanationEn: "Qualified task, delegated permission, verified conditions, and a read is recoverable. All four boundaries pass.",
    explanationBn: "Qualified task, অনুমতি আছে, অবস্থা যাচাই করা, আর read ফেরানো যায়। চারটা সীমাই পার।",
    whyEn: "Warranted autonomy is the intersection of all four. One failing check is enough to stop.",
    whyBn: "Warranted autonomy মানে চারটার ছেদ। একটাও না মিললে থামতে হয়।",
    lines: [11, 12],
  },
  {
    patch: { at: "execute", token: { label: "[42, 42]", state: "created" } },
    titleEn: "Execute and observe",
    titleBn: "চালানো আর পর্যবেক্ষণ",
    explanationEn: "The tool reads the ledger and returns two €42 charges.",
    explanationBn: "Tool ledger পড়ে আর দুটো €42 charge ফেরত দেয়।",
    whyEn: "Only an admitted action ever reaches execution.",
    whyBn: "শুধু অনুমোদিত action-ই চালানো পর্যন্ত পৌঁছায়।",
    lines: [14],
  },
  {
    patch: { at: "update", budget: 3, facts: "facts: { read_ledger: [42, 42] }", loopBack: true },
    titleEn: "Update the durable state",
    titleBn: "Durable state আপডেট",
    explanationEn: "The observation is stored in the run state, outside the conversation, and one unit of budget is spent.",
    explanationBn: "পর্যবেক্ষণটা run state-এ রাখা হয়, কথোপকথনের বাইরে, আর budget থেকে এক ইউনিট খরচ হয়।",
    whyEn: "State that lives outside the context window survives a crash, a retry or a handoff.",
    whyBn: "Context window-এর বাইরের state crash, retry বা handoff-এর পরও টিকে থাকে।",
    lines: [15, 16, 17],
  },
  {
    patch: { at: "context", token: { label: "task + facts", state: "active" } },
    titleEn: "Next step, richer briefing",
    titleBn: "পরের ধাপ, আরও তথ্যসহ briefing",
    explanationEn: "The loop comes round. This time the briefing includes the ledger read.",
    explanationBn: "Loop আবার ঘোরে। এবার briefing-এ ledger পড়ার ফলও আছে।",
    whyEn: "Each step's context is compiled from current state, not from a growing transcript.",
    whyBn: "প্রতি ধাপের context বানানো হয় বর্তমান state থেকে, লম্বা হতে থাকা কথোপকথন থেকে না।",
    lines: [2, 3],
  },
  {
    patch: { at: "model", token: { label: "refund €42", state: "active" } },
    titleEn: "The model proposes a refund",
    titleBn: "মডেল refund প্রস্তাব করে",
    explanationEn: "Seeing two identical charges, the model proposes refund(case=882, amount=42).",
    explanationBn: "দুটো একই charge দেখে মডেল প্রস্তাব করে refund(case=882, amount=42)।",
    whyEn: "The proposal may well be correct. Correct is not the same as permitted to act alone.",
    whyBn: "প্রস্তাবটা হয়তো ঠিকই। কিন্তু ঠিক হওয়া আর একা করার অনুমতি থাকা এক জিনিস না।",
    lines: [4],
  },
  {
    patch: { at: "gate", stages: { gate: { state: "warning", note: "not recoverable" } }, token: { label: "refund €42", state: "warning" } },
    titleEn: "The gate stops an irreversible action",
    titleBn: "Gate অপরিবর্তনীয় action আটকায়",
    explanationEn: "The refund is permitted but not recoverable. The gate returns ESCALATE instead of letting it run.",
    explanationBn: "Refund-এর অনুমতি আছে, কিন্তু সেটা ফেরানো যায় না। Gate সেটা চলতে না দিয়ে ESCALATE ফেরত দেয়।",
    whyEn: "A more capable model does not automatically get more authority. Authority needs evidence and an owner.",
    whyBn: "আরও দক্ষ মডেল মানেই বেশি ক্ষমতা না। ক্ষমতার জন্য লাগে evidence আর একজন দায়িত্বশীল মালিক।",
    lines: [11, 12, 13],
  },
  {
    patch: { at: "stop", stages: { stop: { state: "warning", note: "ESCALATE" } }, token: { label: "to a person", state: "changed" } },
    titleEn: "A typed stop",
    titleBn: "Typed stop",
    explanationEn: "The run ends as ESCALATE. The refund tool never ran; the state still holds only the ledger read.",
    explanationBn: "Run শেষ হয় ESCALATE হিসেবে। Refund tool কখনো চলেনি; state-এ এখনো শুধু ledger পড়া আছে।",
    whyEn: "ESCALATE, ABSTAIN, POLICY_DENIED and BUDGET_EXHAUSTED have different owners and next moves. A boolean done would hide that.",
    whyBn: "ESCALATE, ABSTAIN, POLICY_DENIED আর BUDGET_EXHAUSTED-এর মালিক আর পরের পদক্ষেপ আলাদা। একটা boolean done সেটা লুকিয়ে ফেলত।",
    lines: [13],
  },
];

export const CONTROL_LOOP_VISUALIZATION: VisualizationDefinition = {
  id: "ai-engineering.harness.control-loop",
  version: 1,
  category: "ai-engineering",
  titleEn: "The harness as a control loop",
  titleBn: "Control loop হিসেবে harness",
  subtitleEn: "Modeled walkthrough. The model proposes; context, gate, execution, state and the stop rule belong to the harness.",
  subtitleBn: "মডেল করা walkthrough। মডেল প্রস্তাব দেয়; context, gate, execution, state আর থামার নিয়ম harness-এর।",
  codeLanguage: "python",
  codeSnippet: LOOP_EXCERPT,
  concepts: ["control-loop", "gate", "warranted-autonomy", "typed-termination"],
  steps: buildSteps(STEPS),
};
