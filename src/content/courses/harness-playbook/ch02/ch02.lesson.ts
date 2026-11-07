import { Lesson } from "@/features/lessons/types/lesson.types";
import flowSceneSource from "../../../../../courses/harness-playbook/scenes/ch02_aci_refund.py?raw";

/**
 * Chapter 02 of The Harness Engineering Playbook (pp. 55–74).
 * Theory is condensed in our own words with page references. The practical
 * code is written for this course; the book describes the protocol in prose.
 */

const RUN_OUTPUT = `$ python -m harness.ch02.aci_refund
# harness, ack lost
      PROPOSED -> VALIDATED        schema, bound account, ledger match
     VALIDATED -> AUTHORIZED       grant refund.write < EUR 100
    AUTHORIZED -> PREPARED         key=refund-case-882-v17
      PREPARED -> DISPATCHED
    DISPATCHED -> UNKNOWN_EFFECT   connection reset after commit: reconcile, do not retry
UNKNOWN_EFFECT -> RECONCILED       ledger holds 1 refund of EUR 42.00
    RECONCILED -> VERIFIED         effect + message + case version bound
      VERIFIED -> COMMITTED
final=COMMITTED refunds=1

# harness, EUR 140
      PROPOSED -> VALIDATED        schema, bound account, ledger match
     VALIDATED -> WAITING_APPROVAL approval_required: frozen preview to human
final=WAITING_APPROVAL refunds=0

# naive retry, ack lost
refunds=2 {'882-attempt-1': 42.0, '882-attempt-2': 42.0}`;

export const CH02_TOOL_CALLS_LESSON: Lesson = {
  id: "hp.02.tool-calls-to-safe-actions",
  slug: "harness-02-tool-calls-to-safe-actions",
  trackId: "ai-engineering",
  moduleId: "hp-part-1",
  moduleTitleEn: "Harness Engineering · Part I · Foundations",
  moduleTitleBn: "Harness Engineering · পার্ট I · ভিত্তি",

  titleEn: "From Tool Calls to Safe Actions",
  titleBn: "Tool Call থেকে নিরাপদ Action",
  subtitleEn: "A tool call is something the model says. An action is something the organization allows to happen. This chapter is about everything in between.",
  subtitleBn: "মডেল যা বলে, সেটা tool call। প্রতিষ্ঠান যা ঘটতে দেয়, সেটা action। এই অধ্যায় এই দুইয়ের মাঝখানের পুরো সিস্টেম নিয়ে।",
  descriptionEn: "The agent–computer interface (ACI) in six layers, lifecycle verbs instead of CRUD, idempotency keys that name the obligation, and why a timeout after dispatch is unknown, not failed. Book pp. 55–74, with runnable Python, a recorded line-by-line trace and controllable charts.",
  descriptionBn: "ছয় স্তরের agent–computer interface (ACI), CRUD-এর বদলে lifecycle verb, দায়িত্বকে চিহ্নিত করা idempotency key, আর dispatch-এর পর timeout কেন failed না, অজানা। বইয়ের পৃষ্ঠা 55–74, সাথে চালানো যায় এমন Python, রেকর্ড করা line-by-line trace আর নিয়ন্ত্রণযোগ্য chart।",

  difficulty: "advanced",
  estimatedMinutes: 40,

  prerequisites: [],
  learningObjectivesEn: [
    "Explain why a schema-valid tool call is still only a proposal.",
    "Name the six layers of an agent–computer interface and how each one fails.",
    "Key an operation by its business obligation and reconcile an unknown effect before any retry.",
    "Read a recorded trace and point to the line where a naive retry creates a duplicate refund.",
  ],
  learningObjectivesBn: [
    "Schema ঠিক থাকা tool call-ও কেন শুধুই প্রস্তাব, তা ব্যাখ্যা করতে পারবে।",
    "Agent–computer interface-এর ছয়টা স্তর আর প্রতিটা কীভাবে ব্যর্থ হয়, তা বলতে পারবে।",
    "Operation-কে business obligation দিয়ে key করতে আর retry-এর আগে অজানা effect reconcile করতে পারবে।",
    "রেকর্ড করা trace পড়ে দেখাতে পারবে কোন line-এ naive retry duplicate refund বানায়।",
  ],
  concepts: [
    { id: "aci", nameEn: "Agent–computer interface", nameBn: "Agent–computer interface", descriptionEn: "The full contract between a probabilistic model and deterministic systems.", descriptionBn: "Probabilistic মডেল আর deterministic সিস্টেমের মধ্যে পুরো চুক্তি।", trackId: "ai-engineering", difficulty: "advanced" },
    { id: "idempotency", nameEn: "Idempotency key", nameBn: "Idempotency key", descriptionEn: "A key that names one business obligation, so retries cannot create a second effect.", descriptionBn: "একটা business obligation-কে চিহ্নিত করা key, যাতে retry দ্বিতীয় effect বানাতে না পারে।", trackId: "ai-engineering", difficulty: "advanced" },
    { id: "unknown-effect", nameEn: "Unknown effect", nameBn: "অজানা effect", descriptionEn: "Dispatch may have happened but the outcome is unobserved. Reconcile, never re-send.", descriptionBn: "Dispatch হয়ে থাকতে পারে, কিন্তু ফল দেখা যায়নি। Reconcile করো, আবার পাঠিও না।", trackId: "ai-engineering", difficulty: "advanced" },
  ],

  sections: [
    {
      id: "hp02-theory",
      order: 1,
      titleEn: "1. Theory",
      titleBn: "১. তত্ত্ব",
      blocks: [
        {
          id: "hp02-lead",
          type: "explanation",
          titleEn: "Five tools say very little",
          titleBn: "পাঁচটা tool মানে খুব কম কিছু",
          contentEn: "Teams say an agent \"has five tools.\" Usually that means five schemas sit in the model's context and five handlers accept whatever arguments come back. That says almost nothing about whether the system can act safely. Giving an agent a tool is like giving a new employee a button labelled \"refund\": the label does not say which account may change, whether pressing twice is safe, what approval is needed, or how to confirm the result.",
          contentBn: "অনেক টিম বলে, \"আমাদের agent-এর পাঁচটা tool আছে।\" আসলে এর মানে হলো মডেলের context-এ পাঁচটা schema বসানো আছে, আর পাঁচটা handler যেকোনো argument নিতে প্রস্তুত। এতে বোঝা যায় না সিস্টেমটা নিরাপদে কাজ করতে পারবে কি না। Agent-কে tool দেওয়া মানে নতুন কর্মীর হাতে \"refund\" লেখা একটা বোতাম দেওয়া: লেবেল বলে না কোন account বদলানো যাবে, দুবার চাপলে কী হবে, কার approval লাগবে, বা ফল কীভাবে নিশ্চিত হবে।",
          keyIdeaEn: "\"A valid tool call is still only a proposal.\" (p. 55)",
          keyIdeaBn: "সঠিক tool call-ও শুধুই একটা প্রস্তাব। (\"A valid tool call is still only a proposal.\" p. 55)",
        },
        {
          id: "hp02-portfolio",
          type: "comparison",
          titleEn: "The expensive confusion: endpoints vs work-shaped capabilities (pp. 55–58)",
          titleBn: "যে ভুলের দাম অনেক: endpoint বনাম কাজ-ভিত্তিক capability (pp. 55–58)",
          headers: ["", "Endpoint dump", "Work-shaped capability"],
          rows: [
            { featureEn: "Find the customer", featureBn: "Customer খোঁজা", values: ["search_customer", "identity.bind_case_account"] },
            { featureEn: "Billing facts", featureBn: "Billing-এর তথ্য", values: ["get_billing", "resolution.get_evidence_bundle"] },
            { featureEn: "Check the effect first", featureBn: "আগে effect যাচাই", values: ["—", "resolution.preview"] },
            { featureEn: "Pay the refund", featureBn: "Refund দেওয়া", values: ["refund_payment", "billing.execute_authorized_resolution"] },
            { featureEn: "Confirm what happened", featureBn: "কী ঘটেছে নিশ্চিত করা", values: ["—", "billing.reconcile_resolution"] },
            { featureEn: "Talk to the customer", featureBn: "Customer-কে জানানো", values: ["send_message", "communication.send_authorized_message"] },
          ],
          footnoteEn: "Schema validation cannot repair the left column: a model can send perfectly valid arguments for the wrong customer, under a stale policy, after another worker changed the case.",
          footnoteBn: "Schema validation বাঁ দিকের কলাম ঠিক করতে পারে না: মডেল একদম সঠিক format-এ ভুল customer-এর জন্য, পুরোনো policy দিয়ে, এমনকি অন্য worker case বদলে ফেলার পরেও argument দিতে পারে।",
        },
        {
          id: "hp02-layers",
          type: "under-the-hood",
          titleEn: "The six layers of an agent–computer interface (pp. 56–57)",
          titleBn: "ACI-এর ছয়টা স্তর (pp. 56–57)",
          explanationEn: "The ACI is the full contract between a probabilistic decision-maker and deterministic systems. Each layer fails in its own way.",
          explanationBn: "ACI হলো probabilistic মডেল আর deterministic সিস্টেমের মধ্যে পুরো চুক্তি। প্রতিটা স্তর নিজের মতো করে ব্যর্থ হয়।",
          pipelineSteps: [
            { titleEn: "Affordance", titleBn: "Affordance", descEn: "Which capability exists and when it applies. Fails when overlapping names lead to the wrong choice.", descBn: "কোন capability আছে, কখন প্রযোজ্য। কাছাকাছি নামের কারণে ভুল tool বাছলে ব্যর্থ হয়।" },
            { titleEn: "Proposal contract", titleBn: "Proposal contract", descEn: "Structure and meaning of the requested intent. Fails when a valid schema allows an invalid business target.", descBn: "অনুরোধের গঠন আর অর্থ। Schema ঠিক কিন্তু business target ভুল হলে ব্যর্থ হয়।" },
            { titleEn: "Authority gate", titleBn: "Authority gate", descEn: "Binds intent to identity, scope, policy and approval. Fails when a visible tool is mistaken for a granted permission.", descBn: "Identity, scope, policy আর approval-এর সাথে বাঁধে। Tool দেখা যাচ্ছে মানেই অনুমতি আছে ধরে নিলে ব্যর্থ হয়।" },
            { titleEn: "Effect adapter", titleBn: "Effect adapter", descEn: "Executes against real systems with concurrency and retry rules. Fails when a timeout is treated as a safe failure.", descBn: "আসল সিস্টেমে execute করে, concurrency আর retry নিয়মসহ। Timeout-কে নিরাপদ failure ধরলে ব্যর্থ হয়।" },
            { titleEn: "Observation contract", titleBn: "Observation contract", descEn: "Bounded, typed results that say where they came from. Fails when success-shaped text hides a partial effect.", descBn: "সীমিত, typed ফলাফল, উৎসসহ। Success-এর মতো দেখতে লেখা আংশিক effect লুকালে ব্যর্থ হয়।" },
            { titleEn: "Evidence hook", titleBn: "Evidence hook", descEn: "Which independent observation closes the obligation. Fails when an API acknowledgement is accepted as proof.", descBn: "কোন স্বাধীন পর্যবেক্ষণ কাজ শেষ প্রমাণ করে। API acknowledgement-কে প্রমাণ ধরলে ব্যর্থ হয়।" },
          ],
          technicalNoteEn: "A framework may implement the affordance and effect layers. The application still owns the business meaning that connects all six.",
          technicalNoteBn: "Framework হয়তো affordance আর effect স্তর বানিয়ে দেয়। কিন্তু ছয়টা স্তরকে জোড়া লাগানো business অর্থের দায় application-এর।",
        },
        {
          id: "hp02-law",
          type: "engineering-note",
          titleEn: "First design law (p. 57)",
          titleBn: "প্রথম design নীতি (p. 57)",
          contentEn: "Tool availability is discoverability. A capability grant is authorization. Never collapse the two.",
          contentBn: "Tool দেখতে পাওয়া মানে শুধু জানা (discoverability)। Capability grant মানে অনুমতি (authorization)। দুটোকে কখনো এক করো না।",
          recommendationEn: "Do not advertise power the run does not need, and do not treat hiding a tool as the enforcement boundary.",
          recommendationBn: "অপ্রয়োজনীয় ক্ষমতা মডেলকে দেখিও না, আর tool লুকিয়ে রাখাকেই নিরাপত্তা ভেবো না।",
        },
        {
          id: "hp02-verbs",
          type: "under-the-hood",
          titleEn: "Lifecycle verbs, not CRUD (p. 59)",
          titleBn: "CRUD না, lifecycle verb (p. 59)",
          explanationEn: "Consequential work moves through five verbs. The most powerful one takes the narrowest input.",
          explanationBn: "গুরুত্বপূর্ণ কাজ পাঁচটা ধাপে চলে। সবচেয়ে শক্তিশালী ধাপের input সবচেয়ে সরু।",
          pipelineSteps: [
            { titleEn: "inspect", titleBn: "inspect", descEn: "A bounded read, with source version and freshness.", descBn: "সীমিত read, source version আর freshness সহ।" },
            { titleEn: "preview", titleBn: "preview", descEn: "Compute and freeze the exact effect without changing anything.", descBn: "ঠিক কী effect হবে তা হিসাব করে freeze, কিছু বদলায় না।" },
            { titleEn: "commit", titleBn: "commit", descEn: "Execute a frozen, approved proposal by its id only.", descBn: "শুধু ID দিয়ে frozen, approved proposal execute।" },
            { titleEn: "reconcile", titleBn: "reconcile", descEn: "Ask the authoritative system what actually happened.", descBn: "আসল সিস্টেমকে জিজ্ঞেস করা আসলে কী ঘটেছে।" },
            { titleEn: "compensate", titleBn: "compensate", descEn: "A new authorized action that amends an earlier effect. It is not time travel.", descBn: "পুরোনো effect সংশোধনে নতুন অনুমোদিত action। এটা সময় পিছিয়ে নেওয়া না।" },
          ],
          technicalNoteEn: "Commit receives proposal_id and approval_ref, never a second copy of a model-written amount and destination.",
          technicalNoteBn: "Commit নেয় proposal_id আর approval_ref, মডেলের লেখা amount আর destination-এর দ্বিতীয় কপি কখনো না।",
        },
        {
          id: "hp02-idempotency",
          type: "engineering-note",
          titleEn: "Key the obligation, not the attempt (pp. 63–65)",
          titleBn: "চেষ্টাকে না, দায়িত্বকে key করো (pp. 63–65)",
          contentEn: "idempotency_key = H(tenant_id, durable_operation_id)\n\nReplacement workers and regenerated proposals must map back to the same operation, so the model cannot mint a new refund by renaming its request. The mapping is persisted before dispatch.",
          contentBn: "idempotency_key = H(tenant_id, durable_operation_id)\n\nনতুন worker বা নতুন করে লেখা proposal একই operation-এ ফিরে আসে, তাই request-এর নাম বদলে মডেল নতুন refund বানাতে পারে না। এই mapping dispatch-এর আগেই durable record-এ লেখা হয়।",
          recommendationEn: "Retry order: was dispatch definitely prevented? Yes: retry only if the error is transient and the budget allows. No: reconcile the existing operation.",
          recommendationBn: "Retry-এর ক্রম: dispatch কি নিশ্চিতভাবে আটকানো গেছে? হ্যাঁ: error সাময়িক আর budget থাকলে তবেই retry। না: আগের operation-টাই reconcile করো।",
        },
        {
          id: "hp02-mistake",
          type: "mistake",
          wrongMentalModelEn: "A timeout means the refund failed, so retrying is safe.",
          wrongMentalModelBn: "Timeout মানে refund ব্যর্থ হয়েছে, তাই আবার চেষ্টা করা নিরাপদ।",
          correctMentalModelEn: "A timeout after dispatch is unknown_effect: the provider may already have paid. Reconcile with the same key first.",
          correctMentalModelBn: "Dispatch-এর পর timeout হলো unknown_effect: provider হয়তো আগেই টাকা দিয়ে দিয়েছে। আগে একই key দিয়ে reconcile করো।",
          explanationEn: "A timeout changes the evidence, not necessarily the world. Retrying under a new id pays the customer twice. The line chart in the Visual section shows how fast this gets expensive (pp. 62–64).",
          explanationBn: "Timeout evidence বদলায়, দুনিয়া নয়। নতুন id দিয়ে retry করলে customer দুবার টাকা পায়। Visual অংশের line chart দেখায় এই ভুলের খরচ কত দ্রুত বাড়ে (pp. 62–64)।",
        },
        {
          id: "hp02-approval",
          type: "explanation",
          titleEn: "Approval binds a frozen effect (pp. 65–66)",
          titleBn: "Approval মানে frozen effect-এ সই (pp. 65–66)",
          contentEn: "A generic \"Allow?\" dialog approves tool syntax. A real approval binds a person to the exact consequence, through a channel the requesting agent cannot read or write. If the amount, target or policy version changes, the approval is void.",
          contentBn: "সাধারণ \"Allow?\" dialog শুধু tool syntax অনুমোদন করে। আসল approval একজন মানুষকে ঠিক সেই পরিণতির সাথে বাঁধে, এমন channel দিয়ে যেটা agent পড়তে বা লিখতে পারে না। Amount, target বা policy version বদলালে approval বাতিল।",
          keyIdeaEn: "What the approver sees: Refund €84.00 to the card used for charge ch_381, for verified account ac_72, under Refund Policy v14 §3.2. Visible to the customer; cannot be cancelled after settlement.",
          keyIdeaBn: "Approver যা দেখেন: Refund €84.00 to the card used for charge ch_381, for verified account ac_72, under Refund Policy v14 §3.2. Customer দেখতে পাবেন; settlement-এর পর বাতিল করা যাবে না।",
        },
        {
          id: "hp02-summary",
          type: "summary",
          titleEn: "Carry forward",
          titleBn: "মনে রাখো",
          takeawaysEn: [
            "Schema correctness proves a proposal is well formed. It does not prove it is true, authorized, current or safe.",
            "Design tools around business obligations, each with one authority rule, risk class and recovery policy.",
            "A timeout after dispatch is unknown_effect. Reconcile with the same key before anything else.",
            "Tool results are untrusted observations. External text is evidence, never authority.",
          ],
          takeawaysBn: [
            "Schema সঠিক মানে proposal-এর গঠন ঠিক। সেটা সত্য, অনুমোদিত, হালনাগাদ বা নিরাপদ কি না, তা প্রমাণ করে না।",
            "Tool সাজাও business obligation ধরে: প্রতিটার একটা authority নিয়ম, risk class আর recovery policy।",
            "Dispatch-এর পর timeout হলো unknown_effect। অন্য কিছুর আগে একই key দিয়ে reconcile করো।",
            "Tool-এর ফলাফল অবিশ্বস্ত পর্যবেক্ষণ। বাইরের লেখা evidence, কখনো authority না।",
          ],
          checklistEn: [
            "Every side-effecting tool declares idempotency, timeout meaning and reconciliation.",
            "The idempotency key is written before dispatch.",
            "Commit takes a frozen proposal id, not fresh model-written values.",
            "Approval goes through a channel the agent cannot write to.",
          ],
          checklistBn: [
            "প্রতিটা side-effect tool idempotency, timeout-এর অর্থ আর reconciliation ঘোষণা করে।",
            "Idempotency key dispatch-এর আগেই লেখা হয়।",
            "Commit নেয় frozen proposal id, মডেলের নতুন লেখা value না।",
            "Approval যায় এমন channel দিয়ে যেখানে agent লিখতে পারে না।",
          ],
        },
      ],
    },
    {
      id: "hp02-visual",
      order: 2,
      titleEn: "2. Visual",
      titleBn: "২. ভিজ্যুয়াল",
      blocks: [
        {
          id: "hp02-flow-ack",
          type: "visualization",
          visualizationId: "ai-engineering.harness.aci-refund.ack-lost",
          titleEn: "One refund, six layers: acknowledgement lost",
          titleBn: "একটা refund, ছয়টা স্তর: উত্তর হারানো",
        },
        {
          id: "hp02-flow-naive",
          type: "visualization",
          visualizationId: "ai-engineering.harness.aci-refund.naive-retry",
          titleEn: "One refund, six layers: naive retry",
          titleBn: "একটা refund, ছয়টা স্তর: naive retry",
        },
        {
          id: "hp02-chart",
          type: "chart",
          chartId: "ai-engineering.harness.duplicate-refunds",
        },
        {
          id: "hp02-manim-flow",
          type: "code",
          title: "scenes/ch02_aci_refund.py · ManimGL · SCENARIO=ack_lost manimgl ch02_aci_refund.py AciRefund -w",
          language: "python",
          code: flowSceneSource.replace(/\n$/, ""),
        },
      ],
    },
    {
      id: "hp02-practical",
      order: 3,
      titleEn: "3. Practical",
      titleBn: "৩. প্র্যাকটিক্যাল",
      blocks: [
        {
          id: "hp02-practical-intro",
          type: "explanation",
          titleEn: "Code written for this course",
          titleBn: "এই কোর্সের জন্য লেখা code",
          contentEn: "The book describes the action protocol in prose only. The file below turns it into about 120 lines of standard-library Python: guarded transitions, an idempotency key written before dispatch, a provider that loses the first acknowledgement, reconciliation, and a naive retry for comparison. Run it from courses/harness-playbook with python -m harness.ch02.aci_refund, and run the tests with python -m unittest.",
          contentBn: "বইয়ে action protocol শুধু লেখায় আছে। নিচের file সেটাকে প্রায় ১২০ লাইনের standard-library Python-এ রূপ দেয়: guard-সহ transition, dispatch-এর আগে লেখা idempotency key, প্রথম উত্তর হারানো provider, reconcile, আর তুলনার জন্য naive retry। courses/harness-playbook থেকে python -m harness.ch02.aci_refund দিয়ে চালাও, আর python -m unittest দিয়ে test চালাও।",
        },
        {
          id: "hp02-trace",
          type: "code-trace",
          traceId: "ai-engineering.harness.ch02.aci-refund",
        },
        {
          id: "hp02-output",
          type: "code",
          title: "Real output",
          language: "bash",
          code: RUN_OUTPUT,
        },
        {
          id: "hp02-exercise",
          type: "engineering-note",
          titleEn: "Exercise: reject a stale proposal",
          titleBn: "অনুশীলন: পুরোনো proposal আটকাও",
          contentEn: "Add a version check to Harness.run(): before dispatch, call self.current_case_version(op.case) and compare it with case_version. If they differ, raise RuntimeError(\"version_conflict\") without calling the provider.",
          contentBn: "Harness.run()-এ একটা version check যোগ করো: dispatch-এর আগে self.current_case_version(op.case) ডাকো আর case_version-এর সাথে মেলাও। না মিললে provider না ডেকেই RuntimeError(\"version_conflict\") raise করো।",
          recommendationEn: "tests/test_ch02.py already holds the test, marked expectedFailure. When your change works, remove the decorator and the test must pass (p. 63, concurrency).",
          recommendationBn: "tests/test_ch02.py-তে test আগে থেকেই আছে, expectedFailure চিহ্ন দেওয়া। তোমার change কাজ করলে decorator সরাও; তখন test পাস করতে হবে (p. 63, concurrency)।",
        },
      ],
    },
    {
      id: "hp02-qa",
      order: 4,
      titleEn: "4. Q&A",
      titleBn: "৪. প্রশ্নোত্তর",
      blocks: [
        {
          id: "hp02-q1",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "The model emits a refund_payment call that passes strict schema validation. What does that establish?",
          questionBn: "মডেল একটা refund_payment call দিল যেটা strict schema validation পাস করেছে। এতে কী প্রমাণ হলো?",
          options: [
            { id: "a", textEn: "The refund is authorized for this run", textBn: "এই run-এর জন্য refund অনুমোদিত", isCorrect: false, explanationEn: "Authorization is the authority gate's job, a separate layer.", explanationBn: "অনুমতি যাচাই authority gate-এর কাজ, আলাদা স্তর।" },
            { id: "b", textEn: "The proposal is well formed, and nothing more", textBn: "Proposal-এর গঠন ঠিক, এর বেশি কিছু না", isCorrect: true, explanationEn: "Schema correctness says a proposal is well formed. Truth, authority, freshness and safety are checked by other layers (p. 56).", explanationBn: "Schema সঠিক মানে শুধু proposal well-formed। সত্যতা, authority, freshness আর নিরাপত্তা অন্য স্তরগুলো যাচাই করে (p. 56)।" },
            { id: "c", textEn: "Retrying it is safe", textBn: "আবার retry করা নিরাপদ", isCorrect: false, explanationEn: "Retry safety depends on idempotency and on whether dispatch happened.", explanationBn: "Retry নিরাপদ কি না নির্ভর করে idempotency আর dispatch হয়েছে কি না তার ওপর।" },
            { id: "d", textEn: "The customer identity is verified", textBn: "Customer-এর identity যাচাই হয়েছে", isCorrect: false, explanationEn: "A valid field can still hold the wrong customer id.", explanationBn: "Field ঠিক থাকলেও সেখানে ভুল customer id থাকতে পারে।" },
          ],
        },
        {
          id: "hp02-q2",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "A refund request times out after it was sent. What should the harness do first?",
          questionBn: "Refund request পাঠানোর পর timeout হলো। Harness প্রথমে কী করবে?",
          options: [
            { id: "a", textEn: "Send it again with a new request id", textBn: "নতুন request id দিয়ে আবার পাঠাবে", isCorrect: false, explanationEn: "A new id is a new operation: this is how duplicates happen.", explanationBn: "নতুন id মানে নতুন operation: duplicate এভাবেই হয়।" },
            { id: "b", textEn: "Mark the case FAILED and tell the customer", textBn: "Case-কে FAILED করে customer-কে জানাবে", isCorrect: false, explanationEn: "The refund may already exist; FAILED would be a false claim.", explanationBn: "Refund হয়তো আগেই হয়ে গেছে; FAILED বলা ভুল দাবি হবে।" },
            { id: "c", textEn: "Reconcile using the original operation key", textBn: "আসল operation key দিয়ে reconcile করবে", isCorrect: true, explanationEn: "A timeout after dispatch is unknown_effect. Read the authoritative ledger with the same key (pp. 62–64).", explanationBn: "Dispatch-এর পর timeout হলো unknown_effect। একই key দিয়ে authoritative ledger পড়ো (pp. 62–64)।" },
            { id: "d", textEn: "Ask the model whether the refund went through", textBn: "মডেলকে জিজ্ঞেস করবে refund হয়েছে কি না", isCorrect: false, explanationEn: "A confident model statement is not evidence.", explanationBn: "মডেলের আত্মবিশ্বাসী উত্তর evidence না।" },
          ],
        },
        {
          id: "hp02-q3",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "What should an idempotency key identify?",
          questionBn: "Idempotency key কী চিহ্নিত করা উচিত?",
          options: [
            { id: "a", textEn: "One HTTP attempt", textBn: "একটা HTTP চেষ্টা", isCorrect: false, explanationEn: "Keying the attempt is exactly the naive-retry bug.", explanationBn: "চেষ্টাকে key করাই naive retry-এর bug।" },
            { id: "b", textEn: "The model's proposal text", textBn: "মডেলের proposal-এর লেখা", isCorrect: false, explanationEn: "A regenerated proposal would get a new key.", explanationBn: "নতুন করে লেখা proposal নতুন key পেয়ে যেত।" },
            { id: "c", textEn: "One business obligation for one tenant", textBn: "একটা tenant-এর একটা business obligation", isCorrect: true, explanationEn: "Key the obligation: H(tenant_id, durable_operation_id). Replacement workers resolve to the same operation (p. 64).", explanationBn: "দায়িত্বকে key করো: H(tenant_id, durable_operation_id)। নতুন worker-ও একই operation-এ পৌঁছায় (p. 64)।" },
            { id: "d", textEn: "The worker process that sent it", textBn: "যে worker process পাঠিয়েছে", isCorrect: false, explanationEn: "A replacement worker would then create a second effect.", explanationBn: "তাহলে নতুন worker দ্বিতীয় effect বানাত।" },
          ],
        },
        {
          id: "hp02-q4",
          type: "practice",
          practiceType: "code-reasoning",
          questionEn: "Look at naive_retry. On which line does the duplicate refund become possible?",
          questionBn: "naive_retry দেখো। কোন line-এর কারণে duplicate refund সম্ভব হয়?",
          codeSnippet: `for attempt in range(1, 4):\n    try:\n        return provider.refund(f"{case}-attempt-{attempt}", amount)\n    except Timeout:\n        continue`,
          options: [
            { id: "a", textEn: "for attempt in range(1, 4)", textBn: "for attempt in range(1, 4)", isCorrect: false, explanationEn: "Retrying is not the bug by itself; a same-key retry would be harmless.", explanationBn: "শুধু retry-ই bug না; একই key দিয়ে retry ক্ষতিকর হতো না।" },
            { id: "b", textEn: "provider.refund(f\"{case}-attempt-{attempt}\", amount)", textBn: "provider.refund(f\"{case}-attempt-{attempt}\", amount)", isCorrect: true, explanationEn: "The key contains the attempt number, so each try is a new operation to the provider.", explanationBn: "Key-তে attempt নম্বর আছে, তাই provider-এর কাছে প্রতিটা চেষ্টা নতুন operation।" },
            { id: "c", textEn: "except Timeout:", textBn: "except Timeout:", isCorrect: false, explanationEn: "Catching the timeout is fine; what follows is the problem.", explanationBn: "Timeout ধরা ঠিকই আছে; এরপর যা হয় সেটাই সমস্যা।" },
          ],
          hintEn: "Compare with line 83 of the full file, where the key is built from the case and version.",
          hintBn: "পুরো file-এর line 83-এর সাথে মেলাও, যেখানে key case আর version থেকে বানানো।",
        },
        {
          id: "hp02-q5",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "Why does commit take a proposal_id and approval_ref instead of an amount and destination?",
          questionBn: "Commit কেন amount আর destination না নিয়ে proposal_id আর approval_ref নেয়?",
          options: [
            { id: "a", textEn: "It uses fewer tokens", textBn: "Token কম লাগে", isCorrect: false, explanationEn: "Token cost is not the reason.", explanationBn: "Token খরচ কারণ না।" },
            { id: "b", textEn: "The most powerful step gets the narrowest input, so it cannot drift from what was approved", textBn: "সবচেয়ে শক্তিশালী ধাপের input সবচেয়ে সরু, তাই approve করা জিনিস থেকে সরে যেতে পারে না", isCorrect: true, explanationEn: "Execution accepts only a previously checked commitment (p. 59).", explanationBn: "Execution শুধু আগে যাচাই করা commitment নেয় (p. 59)।" },
            { id: "c", textEn: "Payment APIs require it", textBn: "Payment API এটাই চায়", isCorrect: false, explanationEn: "It is a harness design choice, not an API rule.", explanationBn: "এটা harness-এর design সিদ্ধান্ত, API-র নিয়ম না।" },
            { id: "d", textEn: "It allows parallel tool calls", textBn: "Parallel tool call করা যায়", isCorrect: false, explanationEn: "Parallelism is unrelated here.", explanationBn: "Parallelism-এর সাথে এর সম্পর্ক নেই।" },
          ],
        },
        {
          id: "hp02-faq",
          type: "faq",
          titleEn: "Questions learners ask about this chapter",
          titleBn: "এই অধ্যায় নিয়ে সাধারণ প্রশ্ন",
          items: [
            {
              questionEn: "A timeout means it failed, so why not just retry?",
              questionBn: "Timeout হলেই তো fail। তাহলে আবার retry করলে সমস্যা কী?",
              answerEn: "A timeout only means the answer never arrived. The provider may already have paid. Sending again under a new id can refund the customer twice. Check the ledger with the same key first, and retry with that same key only if no refund exists and the provider's finality window has passed.",
              answerBn: "Timeout মানে শুধু উত্তরটা আসেনি; provider হয়তো refund আগেই করে ফেলেছে। নতুন id দিয়ে আবার পাঠালে customer দুবার টাকা পেতে পারে। তাই আগে একই key দিয়ে ledger দেখো। Refund না পাওয়া গেলে, আর provider-এর finality window পার হলে, তবেই একই key দিয়ে retry।",
              ref: "pp. 62–64",
            },
            {
              questionEn: "If my provider is idempotent, do I still need reconciliation?",
              questionBn: "Provider যদি idempotent হয়, তাহলেও কি reconcile লাগবে?",
              answerEn: "Yes. Idempotency stops a second effect for the same key. It does not tell you whether the first effect happened, was correct, or hit the right target. Completion still needs an authoritative read.",
              answerBn: "হ্যাঁ। Idempotency একই key-তে দ্বিতীয় effect আটকায়। কিন্তু প্রথম effect হয়েছে কি না, ঠিক হয়েছে কি না, সঠিক target-এ গেছে কি না, তা বলে না। কাজ শেষ বলতে authoritative read লাগবেই।",
              ref: "p. 64",
            },
            {
              questionEn: "Why not let the model decide whether to retry?",
              questionBn: "Retry করবে কি না, সেটা মডেলকে ঠিক করতে দিলে সমস্যা কী?",
              answerEn: "A model can \"retry\" by picking a similar tool, changing a harmless-looking field or spawning another worker. The retry budget and the legality of a retry must follow the business obligation across tools and workers, so the harness owns them.",
              answerBn: "মডেল কাছাকাছি আরেকটা tool বেছে, নিরীহ দেখতে একটা field বদলে বা আরেকটা worker চালু করে \"retry\" করে ফেলতে পারে। Retry-এর budget আর বৈধতা tool আর worker পেরিয়ে business obligation-কে অনুসরণ করতে হয়, তাই এটা harness-এর দায়িত্ব।",
              ref: "p. 65",
            },
            {
              questionEn: "Is a read-only tool always safe?",
              questionBn: "শুধু read করে এমন tool কি সবসময় নিরাপদ?",
              answerEn: "No. A read can bring back hostile text, such as instructions hidden in a customer attachment. Tool results are untrusted observations: external text can be evidence to check, never authority to follow.",
              answerBn: "না। Read-ও ক্ষতিকর লেখা নিয়ে আসতে পারে, যেমন customer-এর attachment-এ লুকানো নির্দেশ। Tool-এর ফলাফল অবিশ্বস্ত পর্যবেক্ষণ: বাইরের লেখা যাচাই করার evidence হতে পারে, মেনে চলার authority কখনো না।",
              ref: "p. 66",
            },
            {
              questionEn: "Does the code in this lesson come from the book?",
              questionBn: "এই lesson-এর code কি বই থেকে নেওয়া?",
              answerEn: "No. The book describes the protocol in prose and pseudocode. The Python, the tests and the Manim scenes were written for this course, and the trace you step through was recorded by actually running that code.",
              answerBn: "না। বইয়ে protocol-টা লেখা আর pseudocode-এ আছে। Python, test আর Manim scene এই কোর্সের জন্য লেখা, আর যে trace তুমি ধাপে ধাপে দেখো সেটা ওই code আসলে চালিয়ে রেকর্ড করা।",
            },
          ],
        },
      ],
    },
  ],

  relatedLessons: [
    {
      id: "hp.03.building-the-right-briefing",
      titleEn: "Building the Right Briefing",
      titleBn: "সঠিক briefing তৈরি",
      slug: "harness-03-building-the-right-briefing",
      trackId: "ai-engineering",
      estimatedMinutes: 35,
    },
  ],
};
