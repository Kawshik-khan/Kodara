import {
  CodeTraceDefinition,
  RecordedTrace,
  TraceNote,
} from "@/features/code-trace/types/trace.types";
import traceJson from "./controlLoop.trace.json";

// Recorded by courses/harness-playbook/tools/record_trace.py; JSON widens the event unions.
const trace = traceJson as unknown as RecordedTrace;

/**
 * Notes for every traced line of harness/ch00/control_loop.py.
 * Keys: line number, "!" for exception events, "^" for return events.
 * Re-check line numbers whenever the trace is re-recorded.
 */
const NOTES: Record<string, TraceNote> = {
  "43": {
    what: { bn: "`while run.budget > 0`: loop শুরু। Budget এখন {object.run.budget}।", en: "`while run.budget > 0`: the loop starts. Budget is {object.run.budget}." },
    why: { bn: "Harness একটা control loop: প্রতি ধাপে context বানায়, মডেলের প্রস্তাব নেয়, gate দিয়ে যাচাই করে, চালায়, তারপর state আপডেট করে। Budget ঠিক করে loop কতক্ষণ চলতে পারে।", en: "The harness is a control loop: each step it builds context, takes the model's proposal, checks it at a gate, executes, then updates state. The budget decides how long the loop may run." },
    without: { bn: "Budget না থাকলে মডেল যতক্ষণ খুশি চালিয়ে যেত। কাজের ব্যস্ততাকে অগ্রগতি ভেবে ভুল হতো।", en: "Without a budget the model could keep going indefinitely. Activity would be mistaken for progress." },
    ref: "The harness as a control system · p. 23",
    variants: [
      {
        when: { localPresent: "context" },
        what: { bn: "Loop আবার ঘুরছে। Budget এখন {object.run.budget}।", en: "The loop comes round again. Budget is now {object.run.budget}." },
        why: { bn: "আগের ধাপ কাজ শেষ করেনি, তাই নতুন ধাপ। প্রতিবার budget কমে, তাই loop অনন্ত হতে পারে না।", en: "The previous step did not finish the work, so another step runs. The budget drops every time, so the loop cannot run forever." },
      },
    ],
  },
  "44": {
    what: { bn: "`context = {...}`: মডেল কী দেখবে তা harness বানাচ্ছে: task আর এখন পর্যন্ত জানা তথ্য।", en: "`context = {...}`: the harness builds what the model will see: the task and the facts so far." },
    why: { bn: "সূত্রে এটা c_t = Context(s_t)। মডেল নিজে কিছু খুঁজে আনে না; কোন তথ্য তার সামনে যাবে, সেটা harness ঠিক করে। `dict(run.state)` একটা কপি, তাই মডেল আসল state বদলাতে পারে না।", en: "In the formula this is c_t = Context(s_t). The model fetches nothing itself; the harness decides which facts reach it. `dict(run.state)` is a copy, so the model cannot change the real state." },
    without: { bn: "মডেলকে সরাসরি আসল state দিলে সে নিজের মতো করে \"সত্য\" বদলে ফেলতে পারত।", en: "Handing the model the real state would let it rewrite the operational truth." },
    ref: "c_t = Context(s_t, history, policy, budget) · p. 23",
  },
  "45": {
    what: { bn: "`action, args = model(context)`: মডেল পরের পদক্ষেপ প্রস্তাব করছে।", en: "`action, args = model(context)`: the model proposes the next move." },
    why: { bn: "z_t ~ Model(c_t): মডেলের হাতে শুধু এই একটা পদ। বাকি সব (যাচাই, চালানো, থামা) harness-এর। এখানে মডেল হলো `scripted`, যাতে প্রতিবার একই প্রস্তাব আসে আর trace পুনরাবৃত্তিযোগ্য থাকে।", en: "z_t ~ Model(c_t): this is the only term the model controls. Everything else (checking, executing, stopping) belongs to the harness. Here the model is `scripted`, so it proposes the same moves every time and the trace is repeatable." },
    ref: "The model proposes. The harness governs · p. 20",
  },
  "70": {
    what: { bn: "`scripted` মডেল তালিকা থেকে পরের প্রস্তাব বের করছে।", en: "The `scripted` model takes the next proposal from its list." },
    why: { bn: "আসল LLM-এর জায়গায় একটা নির্দিষ্ট তালিকা। এতে harness-এর আচরণ আলাদা করে দেখা যায়, মডেলের এলোমেলো উত্তর ছাড়াই। তালিকা শেষ হলে সে বলে \"done\"।", en: "A fixed list stands in for a real LLM. That isolates the harness's behaviour from model randomness. When the list runs out it says \"done\"." },
  },
  "70^": {
    what: { bn: "মডেলের প্রস্তাব: {detail}", en: "The model proposes: {detail}" },
    why: { bn: "এটা শুধু প্রস্তাব। এটা কাজ হবে কি না, harness এখনো ঠিক করেনি।", en: "This is only a proposal. The harness has not yet decided whether it becomes work." },
    ref: "p. 16",
  },
  "46": {
    what: { bn: "`if action == \"done\"`: মডেল কি বলছে কাজ শেষ?", en: "`if action == \"done\"`: is the model saying the work is finished?" },
    why: { bn: "\"Done\" বলাটা একটা দাবি, প্রমাণ না। তাই এটা আলাদা পথে যায়, যেখানে আসল অবস্থা যাচাই হয়।", en: "Saying \"done\" is a claim, not proof. So it takes a separate path where the real state is checked." },
    ref: "Verify completion · p. 10",
  },
  "47": {
    what: { bn: "`verify(run.state)`: harness নিজে দেখছে কাজ সত্যিই হয়েছে কি না।", en: "`verify(run.state)`: the harness checks for itself whether the work actually happened." },
    why: { bn: "Prompt অনুরোধ করে (\"শেষ করার আগে test চালাও\"), harness ব্যবস্থা করে: প্রমাণ ছাড়া completion গ্রহণই করে না। এখানে প্রমাণ হলো state-এ ledger পড়ার রেকর্ড।", en: "A prompt asks (\"run the test before finishing\"); a harness arranges it: completion without evidence is simply not accepted. Here the evidence is a record in state that the ledger was read." },
    without: { bn: "শুধু মডেলের কথায় কাজ শেষ ধরলে, আত্মবিশ্বাসী কিন্তু ভুল উত্তরও \"সফল\" হিসেবে গণ্য হতো।", en: "If the model's word closed the task, a confident but wrong answer would count as success." },
    ref: "A harness is not a prompt · p. 21",
  },
  "87": {
    what: { bn: "`ledger_was_read`: state-এ `read_ledger`-এর ফল আছে কি?", en: "`ledger_was_read`: does the state hold a `read_ledger` result?" },
    why: { bn: "Verifier মডেলের লেখা পড়ে না, harness-এর রাখা state পড়ে। মডেল এই state সরাসরি বদলাতে পারে না।", en: "The verifier reads the state the harness keeps, not the model's text. The model cannot edit this state directly." },
  },
  "87^": {
    what: { bn: "Verifier-এর রায়: {detail}", en: "The verifier says: {detail}" },
    why: { bn: "True মানে প্রমাণ আছে, run শেষ হতে পারে। False মানে মডেল \"done\" বললেও কাজ শেষ ধরা হবে না।", en: "True means evidence exists and the run may finish. False means the run is not finished, whatever the model said." },
    ref: "Check the world, not the model's final sentence · p. 10",
  },
  "48": {
    what: { bn: "প্রমাণ আছে, তাই `finish(run, Stop.COMPLETE)`।", en: "Evidence exists, so `finish(run, Stop.COMPLETE)`." },
    why: { bn: "COMPLETE শুধু তখনই, যখন verifier প্রমাণ পেয়েছে। এটা মডেলের ঘোষণা না, harness-এর সিদ্ধান্ত।", en: "COMPLETE only when the verifier found evidence. It is the harness's decision, not the model's announcement." },
    ref: "p. 23",
  },
  "48^": {
    what: { bn: "Run শেষ: {detail}", en: "The run ends: {detail}" },
    why: { bn: "Trail-এর শেষ লাইন দেখো: পুরো ইতিহাস আর কেন থামল, দুটোই record-এ আছে।", en: "Look at the end of the trail: the whole history and the reason it stopped are on record." },
  },
  "49": {
    what: { bn: "প্রমাণ নেই। Trail-এ লেখা হচ্ছে: \"claimed done without evidence\"।", en: "No evidence. The trail records \"claimed done without evidence\"." },
    why: { bn: "দাবিটা প্রত্যাখ্যাত, কিন্তু মুছে ফেলা হয়নি। পরে কেউ দেখতে পারবে মডেল কতবার আগেভাগে \"done\" বলেছিল।", en: "The claim is rejected but not erased. Anyone can later see how often the model declared \"done\" too early." },
    ref: "Keep the record · p. 10",
  },
  "50": {
    what: { bn: "`run.budget -= 1`: মিথ্যা দাবিরও খরচ আছে।", en: "`run.budget -= 1`: a false claim still costs budget." },
    why: { bn: "প্রতিটা ধাপে budget কমে, ফল যা-ই হোক। তাই বারবার \"done\" বলে loop আটকে রাখা যায় না।", en: "Every step spends budget, whatever the outcome. So the model cannot stall the loop by repeating \"done\"." },
  },
  "51": {
    what: { bn: "`continue`: loop-এর শুরুতে ফিরে যাওয়া।", en: "`continue`: back to the top of the loop." },
    why: { bn: "Harness এখনো থামছে না, আরেকটা সুযোগ দিচ্ছে, যতক্ষণ budget আছে।", en: "The harness does not stop yet; it gives another chance while budget remains." },
  },
  "52": {
    what: { bn: "`verdict = grant.admits(run.task, action)`: gate-এ প্রস্তাব যাচাই।", en: "`verdict = grant.admits(run.task, action)`: the proposal goes through the gate." },
    why: { bn: "সূত্রে a_t = Gate(z_t, identity, permissions, risk, evidence)। মডেলের প্রস্তাব কাজে পরিণত হবে কি না, সেটা ঠিক করে gate, মডেল না।", en: "In the formula a_t = Gate(z_t, identity, permissions, risk, evidence). The gate, not the model, decides whether a proposal becomes action." },
    without: { bn: "Gate না থাকলে মডেলের প্রতিটা প্রস্তাব সরাসরি বাইরের দুনিয়ায় effect হয়ে যেত।", en: "Without the gate, every proposal would become an external effect directly." },
    ref: "a_t = Gate(...) · p. 23",
  },
  "23": {
    what: { bn: "Gate ১: task `{local.task}` কি qualified task class-এর মধ্যে?", en: "Gate 1: is the task `{local.task}` a qualified task class?" },
    why: { bn: "Warranted autonomy চারটা সীমার ছেদ। প্রথমটা: এই ধরনের কাজের জন্য সিস্টেম কি প্রমাণসহ qualified? না হলে run বিরত থাকে (ABSTAIN)।", en: "Warranted autonomy is the intersection of four boundaries. The first: is the system qualified, with evidence, for this kind of task? If not, the run abstains." },
    ref: "Warranted autonomy · p. 25",
  },
  "25": {
    what: { bn: "Gate ২: action `{local.action}` কি delegated permission-এর মধ্যে?", en: "Gate 2: is the action `{local.action}` within the delegated permissions?" },
    why: { bn: "Tool থাকা আর তা চালানোর অনুমতি থাকা আলাদা। অনুমতি না থাকলে POLICY_DENIED, আর অন্যভাবে লিখে চেষ্টা করলেও লাভ নেই।", en: "Having a tool and being allowed to use it are different things. Without permission the result is POLICY_DENIED, and rephrasing does not help." },
    ref: "Warranted autonomy · p. 25",
  },
  "27": {
    what: { bn: "Gate ৩: operating condition কি যাচাই করা (`conditions_ok`)?", en: "Gate 3: are the operating conditions verified (`conditions_ok`)?" },
    why: { bn: "যেমন policy cache তাজা কি না, তথ্যের উৎস নিশ্চিত কি না। নিশ্চিত না হলে সিস্টেম বিরত থাকে, অনুমান করে এগোয় না।", en: "For example, whether the policy cache is fresh and the data's provenance is established. If not, the system abstains instead of guessing." },
    ref: "Warranted autonomy · p. 25",
  },
  "29": {
    what: { bn: "Gate ৪: action `{local.action}` কি recoverable?", en: "Gate 4: is the action `{local.action}` recoverable?" },
    why: { bn: "পড়া (read) ফেরানো যায়; টাকা পাঠানো সহজে ফেরানো যায় না। অনুমতি থাকলেও অপরিবর্তনীয় কাজ একা করা যায় না।", en: "A read can be undone; a payment cannot easily be. Even with permission, an irreversible action is not taken alone." },
    without: { bn: "শুধু permission দেখলে \"অনুমতি আছে\" মানেই \"একা করতে পারি\" হয়ে যেত। বই বলে: পেমেন্টের জন্য কোনো স্বয়ংক্রিয় অনুমতি নয়।", en: "Checking permission alone would turn \"allowed\" into \"may do it alone\". The book's example: no autonomous authority for payments." },
    ref: "Warranted autonomy · p. 25",
  },
  "30": {
    what: { bn: "`return Stop.ESCALATE`: refund অপরিবর্তনীয়, তাই মানুষের কাছে পাঠানো হচ্ছে।", en: "`return Stop.ESCALATE`: a refund is irreversible, so it goes to a person." },
    why: { bn: "Escalation মানে ব্যর্থতা না। এটা পরিকল্পিত পথ: যে সিদ্ধান্তের দায় সিস্টেম নিতে পারে না, সেটা দায় নিতে পারে এমন মানুষের কাছে যায়।", en: "Escalation is not failure. It is a designed path: a decision the system cannot own goes to someone who can." },
    ref: "Accountable owner · p. 19",
  },
  "30^": {
    what: { bn: "Gate-এর রায়: {detail}", en: "The gate's verdict: {detail}" },
    why: { bn: "পরের ধাপে loop এই রায় দেখে থামবে। Refund tool কখনো চলবে না।", en: "On the next step the loop sees this verdict and stops. The refund tool never runs." },
  },
  "31": {
    what: { bn: "`return None`: চারটা সীমাই পার হলো, action অনুমোদিত।", en: "`return None`: all four boundaries pass; the action is admitted." },
    why: { bn: "None মানে \"আপত্তি নেই\"। শুধু তখনই action চালানো যায়, যখন চারটা শর্তই একসাথে সত্য।", en: "None means \"no objection\". An action runs only when all four conditions hold at once." },
  },
  "53": {
    what: { bn: "`if verdict is not None`: verdict এখন {local.verdict}।", en: "`if verdict is not None`: the verdict is {local.verdict}." },
    why: { bn: "Gate কোনো stop state দিলে loop সাথে সাথে থামে, কিছু না চালিয়েই।", en: "If the gate returned a stop state, the loop stops at once, without executing anything." },
  },
  "54": {
    what: { bn: "`return finish(run, verdict)`: gate-এর রায় অনুযায়ী থামা।", en: "`return finish(run, verdict)`: stop as the gate decided." },
    why: { bn: "থামার কারণ typed: ESCALATE, ABSTAIN আর POLICY_DENIED-এর মালিক, retry নিয়ম আর customer-কে বলার কথা আলাদা।", en: "The reason for stopping is typed: ESCALATE, ABSTAIN and POLICY_DENIED have different owners, retry rules and customer messages." },
    without: { bn: "একটা boolean `done=False` দিয়ে \"অনুমতি নেই\", \"মানুষ লাগবে\" আর \"crash\" সব এক হয়ে যেত।", en: "A boolean `done=False` would merge \"not allowed\", \"needs a person\" and \"crashed\" into one." },
    ref: "Typed termination · p. 23",
  },
  "54^": {
    what: { bn: "Run শেষ: {detail}", en: "The run ends: {detail}" },
    why: { bn: "Object panel-এ দেখো: state-এ শুধু ledger পড়া আছে, কোনো refund নেই।", en: "Look at the Objects panel: the state holds only the ledger read, no refund." },
  },
  "55": {
    what: { bn: "`observation = tools[action](**args)`: অনুমোদিত action চলছে।", en: "`observation = tools[action](**args)`: the admitted action executes." },
    why: { bn: "o_t = Execute(a_t): শুধু gate পার হওয়া action-ই এখানে আসে। ফলাফল একটা observation, যা harness রেকর্ড করবে।", en: "o_t = Execute(a_t): only an admitted action reaches this line. The result is an observation for the harness to record." },
    ref: "o_t = Execute(a_t, sandbox, tools) · p. 23",
  },
  "75": {
    what: { bn: "`read_ledger` tool: case 882-এর ledger পড়ছে।", en: "The `read_ledger` tool reads the ledger for case 882." },
    why: { bn: "এটা একটা read: বাইরের দুনিয়ায় কিছু বদলায় না, তাই grant-এ এটা recoverable।", en: "This is a read: it changes nothing outside, so the grant lists it as recoverable." },
  },
  "75^": {
    what: { bn: "Tool ফেরত দিল {detail}: দুটো €42 charge।", en: "The tool returns {detail}: two €42 charges." },
    why: { bn: "এটা পর্যবেক্ষণ, এখনো state-এ রাখা হয়নি। পরের line সেটা করবে।", en: "This is an observation, not yet stored in state. The next line does that." },
  },
  "56": {
    what: { bn: "`run.state[action] = observation`: state আপডেট।", en: "`run.state[action] = observation`: the state is updated." },
    why: { bn: "s_(t+1) = Update(s_t, a_t, o_t)। State conversation-এর বাইরে থাকে, তাই crash বা handoff-এর পরও টিকে থাকে।", en: "s_(t+1) = Update(s_t, a_t, o_t). State lives outside the conversation, so it survives a crash or handoff." },
    without: { bn: "শুধু chat history-তে রাখলে context ফুরোলেই কাজের সত্য হারিয়ে যেত।", en: "Kept only in chat history, the operational truth would vanish when the context runs out." },
    ref: "Keep the record · p. 10",
  },
  "57": {
    what: { bn: "Trail-এ লেখা হচ্ছে কী চলল আর কী পাওয়া গেল।", en: "The trail records what ran and what came back." },
    why: { bn: "Trail হলো audit-এর জন্য ইতিহাস: কোন সিদ্ধান্ত, কোন action, কোন ফল।", en: "The trail is the history for audit: which decision, which action, which result." },
  },
  "58": {
    what: { bn: "`run.budget -= 1`: এই ধাপের খরচ।", en: "`run.budget -= 1`: this step's cost." },
    why: { bn: "সফল ধাপেরও খরচ আছে। Budget-ই ঠিক করে আরেকটা ধাপ সাশ্রয়ী কি না।", en: "Successful steps cost budget too. The budget decides whether another step is affordable." },
    ref: "Manage continuation · p. 10",
  },
  "59": {
    what: { bn: "Budget শেষ: `finish(run, Stop.BUDGET_EXHAUSTED)`।", en: "Budget spent: `finish(run, Stop.BUDGET_EXHAUSTED)`." },
    why: { bn: "মডেল দুবার \"done\" বলেছে, কিন্তু প্রমাণ কখনো আসেনি। ফল সৎভাবে BUDGET_EXHAUSTED, মিথ্যা COMPLETE না।", en: "The model said \"done\" twice, but evidence never came. The honest outcome is BUDGET_EXHAUSTED, not a false COMPLETE." },
    without: { bn: "Verifier না থাকলে এই run প্রথম ধাপেই \"সফল\" বলে শেষ হতো।", en: "Without a verifier this run would have ended as a \"success\" on its first step." },
    ref: "Typed termination · p. 23",
  },
  "59^": {
    what: { bn: "Run শেষ: {detail}", en: "The run ends: {detail}" },
    why: { bn: "Trail দেখো: দুটো প্রত্যাখ্যাত দাবি আর থামার কারণ, সবই record-এ।", en: "Look at the trail: two rejected claims and the reason for stopping, all on record." },
  },
  "63": {
    what: { bn: "`finish()`: থামার কারণ trail-এ লেখা হচ্ছে।", en: "`finish()`: the reason for stopping is written to the trail." },
    why: { bn: "প্রতিটা run একটা typed কারণে শেষ হয়, আর সেটা record-এ থাকে।", en: "Every run ends with a typed reason, and that reason is kept on record." },
  },
  "64": {
    what: { bn: "`return stop`: stop state ফেরত দিচ্ছে।", en: "`return stop`: returns the stop state." },
    why: { bn: "যে code `control_loop` ডেকেছে, সে জানবে run কেন থামল, শুধু থেমেছে কি না না।", en: "The caller of `control_loop` learns why the run stopped, not just that it stopped." },
  },
  "64^": {
    what: { bn: "`finish()` ফেরত দিল {detail}।", en: "`finish()` returns {detail}." },
    why: { bn: "এই মান সরাসরি `control_loop`-এর ফল হয়ে যায়।", en: "This value becomes the result of `control_loop` directly." },
  },
};

export const CONTROL_LOOP_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch00.control-loop",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn: "The control loop was actually run three times and every line recorded. Watch the gate, the verifier and the typed stop states decide what the model's proposals become.",
  descriptionBn: "Control loop-টা তিনবার আসলে চালিয়ে প্রতিটা line রেকর্ড করা হয়েছে। দেখো gate, verifier আর typed stop state কীভাবে ঠিক করে মডেলের প্রস্তাব কী হবে।",
  displayPath: "harness/ch00/control_loop.py",
  trace,
  scenarios: [
    { id: "verified", title: { en: "Verified completion", bn: "প্রমাণসহ completion" } },
    { id: "premature", title: { en: "\"Done\" without evidence", bn: "প্রমাণ ছাড়া \"done\"" } },
    { id: "payment", title: { en: "Payment needs a person", bn: "Payment-এ মানুষ লাগে" } },
  ],
  notes: NOTES,
  objectTypes: { run: "Run" },
};
