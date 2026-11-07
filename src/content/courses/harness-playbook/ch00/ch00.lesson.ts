import { Lesson } from "@/features/lessons/types/lesson.types";
import flowSceneSource from "../../../../../courses/harness-playbook/scenes/ch00_control_loop.py?raw";

/**
 * Chapter 00 of The Harness Engineering Playbook (pp. 16–29).
 * Theory is condensed in our own words with page references. The practical
 * code is written for this course; the book gives the loop as formulas.
 */

const RUN_OUTPUT = `$ python -m harness.ch00.control_loop
# verified: COMPLETE
  read_ledger -> [42.0, 42.0]
  STOP complete
# premature: BUDGET_EXHAUSTED
  claimed done without evidence
  claimed done without evidence
  STOP budget_exhausted
# payment: ESCALATE
  read_ledger -> [42.0, 42.0]
  STOP escalate`;

export const CH00_WHY_HARNESS_LESSON: Lesson = {
  id: "hp.00.why-harness-engineering",
  slug: "harness-00-why-harness-engineering",
  trackId: "ai-engineering",
  moduleId: "hp-part-1",
  moduleTitleEn: "Harness Engineering · Part I · Foundations",
  moduleTitleBn: "Harness Engineering · পার্ট I · ভিত্তি",

  titleEn: "Why Harness Engineering Matters",
  titleBn: "Harness Engineering কেন জরুরি",
  subtitleEn: "The model produces a possible next move. The harness decides whether that move becomes work, evidence, a retry, an escalation, or nothing at all.",
  subtitleBn: "মডেল সম্ভাব্য পরের পদক্ষেপ দেয়। সেটা কাজ, evidence, retry, escalation নাকি কিছুই হবে না, তা ঠিক করে harness।",
  descriptionEn: "What a harness is and why production agents make it unavoidable: the three equations, the anatomy of a harness, the harness as a control loop with typed stops, the assurance kernel, warranted autonomy and the baseline ladder. Book pp. 16–29, with a runnable control loop, a recorded trace and a controllable budget chart.",
  descriptionBn: "Harness কী, আর production agent-এ কেন এটা এড়ানো যায় না: তিনটা সমীকরণ, harness-এর গঠন, typed stop-সহ control loop হিসেবে harness, assurance kernel, warranted autonomy আর baseline ladder। বইয়ের পৃষ্ঠা 16–29, সাথে চালানো যায় এমন control loop, রেকর্ড করা trace আর নিয়ন্ত্রণযোগ্য budget chart।",

  difficulty: "intermediate",
  estimatedMinutes: 35,

  prerequisites: [],
  learningObjectivesEn: [
    "Define a harness and say what it adds to a model, using the three equations.",
    "Describe the harness as a control loop and name its typed stop states.",
    "Compute warranted autonomy as the intersection of four boundaries.",
    "Explain why completion needs evidence and a reserved verification budget.",
  ],
  learningObjectivesBn: [
    "তিনটা সমীকরণ দিয়ে harness কী আর মডেলের সাথে এটা কী যোগ করে, তা বলতে পারবে।",
    "Harness-কে control loop হিসেবে ব্যাখ্যা করতে আর তার typed stop state-গুলোর নাম বলতে পারবে।",
    "চারটা সীমার ছেদ হিসেবে warranted autonomy হিসাব করতে পারবে।",
    "Completion-এর জন্য কেন evidence আর verification-এর budget রাখা দরকার, তা ব্যাখ্যা করতে পারবে।",
  ],
  concepts: [
    { id: "harness", nameEn: "Harness", nameBn: "Harness", descriptionEn: "The runtime and control system that couples a model to an environment.", descriptionBn: "যে runtime আর control system মডেলকে পরিবেশের সাথে যুক্ত করে।", trackId: "ai-engineering", difficulty: "intermediate" },
    { id: "warranted-autonomy", nameEn: "Warranted autonomy", nameBn: "Warranted autonomy", descriptionEn: "Permission to act, computed as qualified tasks ∩ permissions ∩ verified conditions ∩ recoverable actions.", descriptionBn: "কাজ করার অনুমতি, হিসাব হয় qualified task ∩ অনুমতি ∩ যাচাই করা অবস্থা ∩ ফেরানো যায় এমন action দিয়ে।", trackId: "ai-engineering", difficulty: "intermediate" },
    { id: "assurance-kernel", nameEn: "Assurance kernel", nameBn: "Assurance kernel", descriptionEn: "The boundary the adaptive runtime may not change by itself: identity, permission ceilings, audit, promotion, kill switch.", descriptionBn: "যে সীমা adaptive runtime নিজে বদলাতে পারে না: identity, অনুমতির সর্বোচ্চ সীমা, audit, promotion, kill switch।", trackId: "ai-engineering", difficulty: "intermediate" },
  ],

  sections: [
    {
      id: "hp00-theory",
      order: 1,
      titleEn: "1. Theory",
      titleBn: "১. তত্ত্ব",
      blocks: [
        {
          id: "hp00-lead",
          type: "explanation",
          titleEn: "Same model, two systems",
          titleBn: "একই মডেল, দুটো সিস্টেম",
          contentEn: "Imagine two systems using the same model. One gets a task, a terminal, broad access and a large context window, and runs until it declares success. The other starts clean, separates read from write, exposes typed tools, needs independent approval for dangerous operations, checkpoints state, verifies the final result, enforces a budget and records who did what. When success cannot be established, it retries, escalates or abstains. The model is identical; the systems are not. The difference is the harness.",
          contentBn: "একই মডেল ব্যবহার করে এমন দুটো সিস্টেম ভাবো। একটা পায় task, terminal, অনেক access আর বড় context window, আর চলতে থাকে যতক্ষণ না নিজে সফল ঘোষণা করে। অন্যটা পরিষ্কার অবস্থা থেকে শুরু করে, read আর write আলাদা রাখে, typed tool দেয়, বিপজ্জনক কাজে স্বাধীন approval চায়, state checkpoint করে, শেষ ফল যাচাই করে, budget মানে আর কে কী করল রেকর্ড রাখে। সাফল্য প্রমাণ করা না গেলে সে retry, escalate বা বিরত থাকে। মডেল একই; সিস্টেম আলাদা। পার্থক্যটাই harness।",
          keyIdeaEn: "A harness is the runtime and control system that couples a model to an environment (p. 17).",
          keyIdeaBn: "Harness হলো সেই runtime আর control system যা মডেলকে পরিবেশের সাথে যুক্ত করে (p. 17)।",
        },
        {
          id: "hp00-mapping",
          type: "comparison",
          titleEn: "Coding agents made the harness visible (pp. 17–18)",
          titleBn: "Coding agent harness-কে চোখে পড়ার মতো করেছে (pp. 17–18)",
          headers: ["", "Coding harness", "Enterprise harness"],
          rows: [
            { featureEn: "Where the work lives", featureBn: "কাজ কোথায় থাকে", values: ["repository and worktree", "bounded case workspace"] },
            { featureEn: "Durable state", featureBn: "টেকসই state", values: ["files and commits", "typed records, event history"] },
            { featureEn: "Tools", featureBn: "Tool", values: ["shell, editor, browser", "CRM, ERP, payment capabilities"] },
            { featureEn: "Checks", featureBn: "যাচাই", values: ["compiler and tests", "policy checks, independent verification"] },
            { featureEn: "Proposal", featureBn: "প্রস্তাব", values: ["pull request", "frozen proposal for an action"] },
            { featureEn: "Permission to act", featureBn: "কাজ করার অনুমতি", values: ["merge permission", "authority for the real effect"] },
            { featureEn: "Undo", featureBn: "ফেরানো", values: ["revert", "compensation or redress"] },
          ],
          footnoteEn: "The mapping is structural. What changes is the evidence economy: a failed test is immediate and cheap, while a lost payment response or a silent customer is ambiguous and slow.",
          footnoteBn: "মিলটা গঠনগত। যা বদলায় তা হলো evidence-এর অর্থনীতি: failed test সাথে সাথে আর সস্তায় জানা যায়, কিন্তু হারানো payment উত্তর বা চুপ থাকা customer অস্পষ্ট আর ধীর।",
        },
        {
          id: "hp00-equations",
          type: "engineering-note",
          titleEn: "The three equations (pp. 18–19)",
          titleBn: "তিনটা সমীকরণ (pp. 18–19)",
          contentEn: "Agent = Model + Harness\nAgentic outcome = f(model, harness, task, environment, budget, policy)\nTrustable agentic system = model + harness + independent evidence + accountable owner\n\nThe second function is not additive: a better tool can help one model and confuse another. The third names what the first leaves out.",
          contentBn: "Agent = Model + Harness\nAgentic outcome = f(model, harness, task, environment, budget, policy)\nTrustable agentic system = model + harness + independent evidence + accountable owner\n\nদ্বিতীয় function যোগফল না: ভালো একটা tool এক মডেলকে সাহায্য করে, আরেকটাকে বিভ্রান্ত করতে পারে। তৃতীয়টা বলে প্রথমটায় কী বাদ পড়েছে।",
          recommendationEn: "Without independent evidence, \"trust\" is only confidence. Without an owner, governance is a dashboard nobody has to act on.",
          recommendationBn: "স্বাধীন evidence ছাড়া \"trust\" শুধু আত্মবিশ্বাস। মালিক ছাড়া governance এমন একটা dashboard যা দেখে কাউকে কিছু করতে হয় না।",
        },
        {
          id: "hp00-not-a-prompt",
          type: "mistake",
          wrongMentalModelEn: "If the agent declares success before running the test, a better prompt (\"always run the test first\") fixes it.",
          wrongMentalModelBn: "Agent test না চালিয়েই সফল ঘোষণা করলে ভালো একটা prompt (\"আগে সবসময় test চালাও\") দিলেই ঠিক হয়ে যাবে।",
          correctMentalModelEn: "The prompt asks; the harness arranges. Make the test a tool, reject completion without fresh test evidence, reserve budget for verification and log the evidence used.",
          correctMentalModelBn: "Prompt অনুরোধ করে; harness ব্যবস্থা করে। Test-কে tool বানাও, নতুন test evidence ছাড়া completion প্রত্যাখ্যান করো, verification-এর জন্য budget রাখো আর কোন evidence ব্যবহার হলো তা লিখে রাখো।",
          explanationEn: "A harness is also not a workflow (a workflow is one route; the harness is the environment routes run in) and not a framework (a framework is a library you build from). In one 2026 study, replacing only the system prompt made a coding harness worse while changes to tools and middleware helped (p. 21).",
          explanationBn: "Harness workflow-ও না (workflow একটা পথ; harness সেই পরিবেশ যেখানে পথ চলে), framework-ও না (framework একটা library যা দিয়ে বানাও)। ২০২৬-এর এক গবেষণায় শুধু system prompt বদলালে coding harness খারাপ হয়েছিল, অথচ tool আর middleware বদলে উন্নতি হয়েছিল (p. 21)।",
        },
        {
          id: "hp00-anatomy",
          type: "under-the-hood",
          titleEn: "The anatomy of a harness (pp. 22–23)",
          titleBn: "Harness-এর গঠন (pp. 22–23)",
          explanationEn: "Nine surfaces, each one something a team must own, with its own failure to design for.",
          explanationBn: "নয়টা অংশ। প্রতিটার একজন মালিক লাগে, আর প্রতিটা নিজের মতো করে ব্যর্থ হয়।",
          pipelineSteps: [
            { titleEn: "Model integration", titleBn: "Model integration", descEn: "Messages, structured outputs, routing, fallback. Fails by silently using an unqualified fallback.", descBn: "Message, structured output, routing, fallback। চুপচাপ অযাচাইকৃত fallback ব্যবহার করলে ব্যর্থ হয়।" },
            { titleEn: "Context and memory", titleBn: "Context আর memory", descEn: "Retrieval, compaction, provenance, freshness. Fails by staleness, poisoning or leakage.", descBn: "Retrieval, compaction, উৎস, হালনাগাদ থাকা। পুরোনো, বিষাক্ত বা ফাঁস হওয়া তথ্যে ব্যর্থ হয়।" },
            { titleEn: "Tools and actions", titleBn: "Tool আর action", descEn: "Work-shaped capabilities, side effects, idempotency. Fails when valid syntax makes the wrong or a duplicated effect.", descBn: "কাজ-ভিত্তিক capability, side effect, idempotency। সঠিক syntax ভুল বা দ্বিগুণ effect বানালে ব্যর্থ হয়।" },
            { titleEn: "Control loop", titleBn: "Control loop", descEn: "Budgets, continuation, retry, stop, recovery. Fails when activity is mistaken for progress.", descBn: "Budget, চালিয়ে যাওয়া, retry, থামা, recovery। ব্যস্ততাকে অগ্রগতি ভাবলে ব্যর্থ হয়।" },
            { titleEn: "Safety and permissions", titleBn: "নিরাপত্তা আর অনুমতি", descEn: "Identity, delegated scope, sandbox, approval, circuit breakers. Fails when a bad decision reaches a real consequence.", descBn: "Identity, অর্পিত scope, sandbox, approval, circuit breaker। খারাপ সিদ্ধান্ত আসল পরিণতিতে পৌঁছালে ব্যর্থ হয়।" },
            { titleEn: "Orchestration", titleBn: "Orchestration", descEn: "Delegation, sequencing, synthesis, escalation. Fails by adding agents without task structure.", descBn: "দায়িত্ব ভাগ, ক্রম, সমন্বয়, escalation। কাজের গঠন ছাড়া agent যোগ করলে ব্যর্থ হয়।" },
            { titleEn: "Extensibility", titleBn: "Extensibility", descEn: "Skills, plugins, connectors, hooks. Fails as supply-chain growth without provenance or revocation.", descBn: "Skill, plugin, connector, hook। উৎস যাচাই বা বাতিলের ব্যবস্থা ছাড়া বাড়লে ব্যর্থ হয়।" },
            { titleEn: "Human interface", titleBn: "মানুষের interface", descEn: "Steering, approval, interruption, review. Fails as approval fatigue: one vendor saw about 93% approval on repeated prompts.", descBn: "দিকনির্দেশ, approval, থামানো, review। Approval-এর ক্লান্তিতে ব্যর্থ হয়: এক vendor বারবার আসা prompt-এ প্রায় ৯৩% approval দেখেছে।" },
            { titleEn: "Session substrate", titleBn: "Session substrate", descEn: "Events, artifacts, checkpoints, versions, resume. Fails by treating disposable context as durable state.", descBn: "Event, artifact, checkpoint, version, resume। অস্থায়ী context-কে টেকসই state ভাবলে ব্যর্থ হয়।" },
          ],
          technicalNoteEn: "The transcript is evidence about state change, not the task state itself.",
          technicalNoteBn: "কথোপকথন state বদলের evidence, task-এর state নিজে না।",
        },
        {
          id: "hp00-loop",
          type: "engineering-note",
          titleEn: "The harness as a control system (p. 23)",
          titleBn: "Control system হিসেবে harness (p. 23)",
          contentEn: "c_t = Context(s_t, history, policy, budget)\nz_t ~ Model(c_t)\na_t = Gate(z_t, identity, permissions, risk, evidence)\no_t = Execute(a_t, sandbox, tools)\ns_(t+1) = Update(s_t, a_t, o_t)\n\nStops: complete | abstain | escalate | budget_exhausted | policy_denied | failed_recoverably | failed_terminally",
          contentBn: "c_t = Context(s_t, history, policy, budget)\nz_t ~ Model(c_t)\na_t = Gate(z_t, identity, permissions, risk, evidence)\no_t = Execute(a_t, sandbox, tools)\ns_(t+1) = Update(s_t, a_t, o_t)\n\nথামার অবস্থা: complete | abstain | escalate | budget_exhausted | policy_denied | failed_recoverably | failed_terminally",
          recommendationEn: "The model directly controls only z_t, and even that is shaped by the context the harness chose. A boolean done hides the difference between verified completion, a denied action and a crash.",
          recommendationBn: "মডেল সরাসরি নিয়ন্ত্রণ করে শুধু z_t, আর সেটাও harness-এর বাছাই করা context দিয়ে প্রভাবিত। একটা boolean done যাচাইসহ completion, আটকানো action আর crash-এর পার্থক্য লুকিয়ে ফেলে।",
        },
        {
          id: "hp00-kernel",
          type: "explanation",
          titleEn: "The assurance kernel (p. 24)",
          titleBn: "Assurance kernel (p. 24)",
          contentEn: "A harness may adapt: pick another model, fetch more context, add a verifier, retry with a tighter plan or escalate. What it may not do is change its own boundary. The adaptive runtime picks tactics inside an approved boundary; the assurance kernel controls the boundary itself: identity, permission ceilings, sandbox floor, audit integrity, approval for irreversible actions, qualification tests, promotion, version pinning, rollback, circuit breaker and kill switch. The runtime may propose a change to the kernel, but may not enact it because its own evaluator predicts a better score.",
          contentBn: "Harness নিজেকে মানিয়ে নিতে পারে: অন্য মডেল বাছা, আরও context আনা, verifier যোগ করা, কড়া plan নিয়ে retry, বা escalate। যা পারে না তা হলো নিজের সীমা বদলানো। Adaptive runtime অনুমোদিত সীমার ভেতরে কৌশল বাছে; সীমাটা নিয়ন্ত্রণ করে assurance kernel: identity, অনুমতির সর্বোচ্চ সীমা, sandbox-এর ন্যূনতম স্তর, audit-এর অখণ্ডতা, অপরিবর্তনীয় কাজের approval, qualification test, promotion, version pinning, rollback, circuit breaker আর kill switch। Runtime kernel বদলের প্রস্তাব দিতে পারে, কিন্তু নিজের evaluator ভালো score দেখাচ্ছে বলে নিজেই বদলাতে পারে না।",
          keyIdeaEn: "An adaptive system needs a constitution outside the adaptive loop (p. 25).",
          keyIdeaBn: "Adaptive সিস্টেমের এমন একটা সংবিধান দরকার যা adaptive loop-এর বাইরে (p. 25)।",
        },
        {
          id: "hp00-autonomy",
          type: "engineering-note",
          titleEn: "Warranted autonomy (p. 25)",
          titleBn: "Warranted autonomy (p. 25)",
          contentEn: "warranted autonomy = qualified task classes ∩ delegated permissions ∩ verified operating conditions ∩ recoverable actions\n\nThe same system may have autonomous read access for a qualified retrieval task, draft-only access for customer messages, supervised writes for a CRM update, and no autonomous authority for payments.",
          contentBn: "warranted autonomy = qualified task class ∩ অর্পিত অনুমতি ∩ যাচাই করা operating অবস্থা ∩ ফেরানো যায় এমন action\n\nএকই সিস্টেমের থাকতে পারে qualified retrieval task-এ স্বয়ংক্রিয় read access, customer message-এ শুধু draft, CRM update-এ তত্ত্বাবধানে write, আর payment-এ কোনো স্বয়ংক্রিয় অনুমতি নেই।",
          recommendationEn: "When an action falls outside any boundary, constrain, escalate or abstain. A more capable model does not automatically receive more authority.",
          recommendationBn: "কোনো action যেকোনো একটা সীমার বাইরে গেলে সীমিত করো, escalate করো বা বিরত থাকো। আরও দক্ষ মডেল আপনাআপনি বেশি ক্ষমতা পায় না।",
        },
        {
          id: "hp00-ladder",
          type: "comparison",
          titleEn: "Baseline ladder: qualify the boundary before choosing the machinery (pp. 27–28)",
          titleBn: "Baseline ladder: যন্ত্রপাতি বাছার আগে সীমা যাচাই করো (pp. 27–28)",
          headers: ["", "What it contains", "Question it answers"],
          rows: [
            { featureEn: "B0 model + prompt", featureBn: "B0 মডেল + prompt", values: ["conversation only, no external effect", "can the task be done as advice or a draft?"] },
            { featureEn: "B1 single bounded loop", featureBn: "B1 একটা সীমিত loop", values: ["one agent, few tools, typed stops", "does acting add value over advice?"] },
            { featureEn: "B2 recoverable harness", featureBn: "B2 recoverable harness", values: ["B1 + durable state, effect ids, verification, rollback", "do recovery and evidence justify their cost?"] },
            { featureEn: "B3 coordinated or adaptive", featureBn: "B3 সমন্বিত বা adaptive", values: ["B2 + delegation, routing, learning", "does more machinery beat B2 at equal cost?"] },
          ],
          footnoteEn: "The strongest baseline is the simplest system that can legitimately do the job. For a read-only draft that may be B0; for a payment whose response can be lost, it cannot be.",
          footnoteBn: "সবচেয়ে শক্ত baseline হলো সবচেয়ে সরল সিস্টেম যা বৈধভাবে কাজটা করতে পারে। শুধু পড়ে draft লেখার কাজে সেটা B0 হতে পারে; যে payment-এর উত্তর হারাতে পারে, সেখানে পারে না।",
        },
        {
          id: "hp00-agents",
          type: "explanation",
          titleEn: "One agent until the work earns another (pp. 25–26)",
          titleBn: "কাজ দাবি না করা পর্যন্ত একটা agent-ই (pp. 25–26)",
          contentEn: "A multi-agent system is a resource and coordination policy run by the harness, not a collection of personalities. Another agent is justified by parallel search, scarce specialist tools, clean context separation, adversarial review or genuinely different error modes. One reported research setup used about fifteen times the tokens of a chat and fitted poorly to tightly dependent tasks.",
          contentBn: "Multi-agent সিস্টেম কয়েকটা চরিত্রের দল না; এটা harness-এর চালানো resource আর সমন্বয়ের নীতি। আরেকটা agent যুক্তিসঙ্গত হয় parallel search, দুর্লভ বিশেষ tool, পরিষ্কার context ভাগ, বিরোধী review বা সত্যিই আলাদা ধরনের ভুলের জন্য। এক রিপোর্টে research setup chat-এর প্রায় পনেরো গুণ token খরচ করেছিল, আর পরস্পর-নির্ভর কাজে ভালো খাপ খায়নি।",
          keyIdeaEn: "More agents are justified by useful difference, not by headcount.",
          keyIdeaBn: "আরও agent যুক্তিসঙ্গত হয় কাজের পার্থক্যে, সংখ্যায় না।",
        },
        {
          id: "hp00-summary",
          type: "summary",
          titleEn: "Carry forward",
          titleBn: "মনে রাখো",
          takeawaysEn: [
            "The model proposes; the harness decides what becomes consequential.",
            "A harness is not a prompt, a workflow or a framework. It is the runtime that arranges what prose can only ask for.",
            "The loop ends in a typed stop, and completion needs evidence from the world.",
            "Autonomy is computed per action as the intersection of four boundaries, and it expands only with new evidence.",
          ],
          takeawaysBn: [
            "মডেল প্রস্তাব দেয়; কোনটা আসল পরিণতি হবে, তা ঠিক করে harness।",
            "Harness prompt, workflow বা framework না। এটা সেই runtime যা ব্যবস্থা করে, যেখানে লেখা শুধু অনুরোধ করতে পারে।",
            "Loop শেষ হয় একটা typed stop-এ, আর completion-এর জন্য বাস্তব দুনিয়ার evidence লাগে।",
            "Autonomy প্রতিটা action-এর জন্য চারটা সীমার ছেদ হিসেবে হিসাব হয়, আর বাড়ে শুধু নতুন evidence পেলে।",
          ],
          checklistEn: [
            "Bound one valuable task class and start with the smallest controllable loop.",
            "Persist task state and artifacts outside the context window.",
            "Build independent outcome evidence before optimizing behavior.",
            "Keep identity, permission ceilings, audit and deployment qualification outside the adaptive loop.",
          ],
          checklistBn: [
            "একটা মূল্যবান task class বেছে নাও, আর সবচেয়ে ছোট নিয়ন্ত্রণযোগ্য loop দিয়ে শুরু করো।",
            "Task-এর state আর artifact context window-এর বাইরে রাখো।",
            "আচরণ optimize করার আগে ফলাফলের স্বাধীন evidence তৈরি করো।",
            "Identity, অনুমতির সর্বোচ্চ সীমা, audit আর deployment qualification adaptive loop-এর বাইরে রাখো।",
          ],
        },
      ],
    },
    {
      id: "hp00-visual",
      order: 2,
      titleEn: "2. Visual",
      titleBn: "২. ভিজ্যুয়াল",
      blocks: [
        {
          id: "hp00-flow",
          type: "visualization",
          visualizationId: "ai-engineering.harness.control-loop",
          titleEn: "The harness as a control loop",
          titleBn: "Control loop হিসেবে harness",
        },
        {
          id: "hp00-chart",
          type: "chart",
          chartId: "ai-engineering.harness.verification-budget",
        },
        {
          id: "hp00-manim-flow",
          type: "code",
          title: "scenes/ch00_control_loop.py · ManimGL · manimgl ch00_control_loop.py ControlLoop -w",
          language: "python",
          code: flowSceneSource.replace(/\n$/, ""),
        },
      ],
    },
    {
      id: "hp00-practical",
      order: 3,
      titleEn: "3. Practical",
      titleBn: "৩. প্র্যাকটিক্যাল",
      blocks: [
        {
          id: "hp00-practical-intro",
          type: "explanation",
          titleEn: "Code written for this course",
          titleBn: "এই কোর্সের জন্য লেখা code",
          contentEn: "The book gives the control loop as five formulas and a list of stop states. The file below turns them into standard-library Python: a loop that compiles context, asks a scripted stand-in for the model, checks every proposal against a four-part grant, executes only what passes, keeps state outside the conversation, and accepts \"done\" only with evidence. Run it from courses/harness-playbook with python -m harness.ch00.control_loop, and the tests with python -m unittest.",
          contentBn: "বইয়ে control loop পাঁচটা সূত্র আর থামার অবস্থার একটা তালিকা হিসেবে আছে। নিচের file সেগুলোকে standard-library Python-এ রূপ দেয়: একটা loop যা context বানায়, মডেলের বদলে একটা scripted সংস্করণকে জিজ্ঞেস করে, প্রতিটা প্রস্তাব চার অংশের grant দিয়ে যাচাই করে, শুধু পাস করা action চালায়, state কথোপকথনের বাইরে রাখে, আর \"done\" মানে শুধু তখনই যখন প্রমাণ আছে। courses/harness-playbook থেকে python -m harness.ch00.control_loop দিয়ে চালাও, আর python -m unittest দিয়ে test।",
        },
        {
          id: "hp00-trace",
          type: "code-trace",
          traceId: "ai-engineering.harness.ch00.control-loop",
        },
        {
          id: "hp00-output",
          type: "code",
          title: "Real output",
          language: "bash",
          code: RUN_OUTPUT,
        },
        {
          id: "hp00-exercise",
          type: "engineering-note",
          titleEn: "Exercise: a crash is not a silent failure",
          titleBn: "অনুশীলন: crash নীরব ব্যর্থতা না",
          contentEn: "Add Stop.FAILED_RECOVERABLY to the enum. In control_loop, wrap the tool call in try/except: if the tool raises, end the run with finish(run, Stop.FAILED_RECOVERABLY) instead of letting the exception escape.",
          contentBn: "Enum-এ Stop.FAILED_RECOVERABLY যোগ করো। control_loop-এ tool call-টা try/except দিয়ে ঘিরে দাও: tool exception দিলে exception বাইরে যেতে না দিয়ে finish(run, Stop.FAILED_RECOVERABLY) দিয়ে run শেষ করো।",
          recommendationEn: "tests/test_ch00.py already holds the test, marked expectedFailure. Remove the decorator once your change works (p. 23, typed termination).",
          recommendationBn: "tests/test_ch00.py-তে test আগে থেকেই আছে, expectedFailure চিহ্ন দেওয়া। তোমার change কাজ করলে decorator সরাও (p. 23, typed termination)।",
        },
      ],
    },
    {
      id: "hp00-qa",
      order: 4,
      titleEn: "4. Q&A",
      titleBn: "৪. প্রশ্নোত্তর",
      blocks: [
        {
          id: "hp00-q1",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "Two systems use the same model. One verifies results, checkpoints state and needs approval for risky writes; the other runs until it declares success. What explains the difference in their outcomes?",
          questionBn: "দুটো সিস্টেম একই মডেল ব্যবহার করে। একটা ফল যাচাই করে, state checkpoint করে আর ঝুঁকিপূর্ণ write-এ approval চায়; অন্যটা নিজে সফল ঘোষণা না করা পর্যন্ত চলে। ফলাফলের পার্থক্য কীসের কারণে?",
          options: [
            { id: "a", textEn: "Random variation in the model", textBn: "মডেলের এলোমেলো আচরণ", isCorrect: false, explanationEn: "The model is the same in both systems.", explanationBn: "দুই সিস্টেমেই মডেল একই।" },
            { id: "b", textEn: "The harness", textBn: "Harness", isCorrect: true, explanationEn: "The model is identical; the surrounding runtime is not. That runtime is the harness (p. 16).", explanationBn: "মডেল একই; চারপাশের runtime আলাদা। সেই runtime-ই harness (p. 16)।" },
            { id: "c", textEn: "A longer system prompt", textBn: "লম্বা system prompt", isCorrect: false, explanationEn: "Prompt prose cannot substitute for executable structure.", explanationBn: "Prompt-এর লেখা executable গঠনের বিকল্প হতে পারে না।" },
          ],
        },
        {
          id: "hp00-q2",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "In the control loop, which term does the model directly control?",
          questionBn: "Control loop-এ মডেল সরাসরি কোন পদ নিয়ন্ত্রণ করে?",
          options: [
            { id: "a", textEn: "c_t, the context", textBn: "c_t, context", isCorrect: false, explanationEn: "The harness compiles the context.", explanationBn: "Context বানায় harness।" },
            { id: "b", textEn: "z_t, the proposal", textBn: "z_t, প্রস্তাব", isCorrect: true, explanationEn: "Only the proposal, and even that is shaped by the context the harness chose (p. 23).", explanationBn: "শুধু প্রস্তাব, আর সেটাও harness-এর বাছাই করা context দিয়ে প্রভাবিত (p. 23)।" },
            { id: "c", textEn: "a_t, the admitted action", textBn: "a_t, অনুমোদিত action", isCorrect: false, explanationEn: "The gate decides which proposals become actions.", explanationBn: "কোন প্রস্তাব action হবে তা gate ঠিক করে।" },
            { id: "d", textEn: "s_(t+1), the next state", textBn: "s_(t+1), পরের state", isCorrect: false, explanationEn: "The harness updates state from the observation.", explanationBn: "পর্যবেক্ষণ থেকে state আপডেট করে harness।" },
          ],
        },
        {
          id: "hp00-q3",
          type: "practice",
          practiceType: "code-reasoning",
          questionEn: "In the trace's payment scenario, read_ledger and refund are both in permissions. Why does the run end as ESCALATE?",
          questionBn: "Trace-এর payment scenario-তে read_ledger আর refund দুটোই permissions-এ আছে। তবু run কেন ESCALATE হয়ে শেষ হয়?",
          codeSnippet: `recoverable=frozenset({"read_ledger"}),\n...\nif action not in self.recoverable:\n    return Stop.ESCALATE`,
          options: [
            { id: "a", textEn: "The model asked for help", textBn: "মডেল সাহায্য চেয়েছে", isCorrect: false, explanationEn: "The model proposed the refund; the gate decided.", explanationBn: "মডেল refund প্রস্তাব করেছিল; সিদ্ধান্ত নিয়েছে gate।" },
            { id: "b", textEn: "A refund is permitted but not recoverable, so the fourth boundary fails", textBn: "Refund-এর অনুমতি আছে কিন্তু ফেরানো যায় না, তাই চতুর্থ সীমা পার হয় না", isCorrect: true, explanationEn: "Warranted autonomy needs all four boundaries; an irreversible action goes to a person (p. 25).", explanationBn: "Warranted autonomy-তে চারটা সীমাই লাগে; অপরিবর্তনীয় action মানুষের কাছে যায় (p. 25)।" },
            { id: "c", textEn: "The budget ran out", textBn: "Budget শেষ হয়ে গেছে", isCorrect: false, explanationEn: "Budget was still 3 when the gate stopped it.", explanationBn: "Gate যখন থামায়, budget তখনো 3।" },
          ],
          hintEn: "Step through the payment scenario to the second call of admits().",
          hintBn: "Payment scenario-তে admits()-এর দ্বিতীয় call পর্যন্ত ধাপে ধাপে যাও।",
        },
        {
          id: "hp00-q4",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "Why is a boolean done=True/False not enough to end a run?",
          questionBn: "Run শেষ করতে একটা boolean done=True/False কেন যথেষ্ট না?",
          options: [
            { id: "a", textEn: "Booleans are slow", textBn: "Boolean ধীর", isCorrect: false, explanationEn: "Speed is not the issue.", explanationBn: "গতি সমস্যা না।" },
            { id: "b", textEn: "It hides whether the run completed, abstained, was denied, ran out of budget or crashed", textBn: "Run শেষ হলো, বিরত থাকল, আটকানো হলো, budget ফুরাল নাকি crash করল, তা লুকিয়ে ফেলে", isCorrect: true, explanationEn: "Each stop has a different owner, retry rule and customer message (p. 23).", explanationBn: "প্রতিটা stop-এর মালিক, retry নিয়ম আর customer-কে বলার কথা আলাদা (p. 23)।" },
            { id: "c", textEn: "Python has no booleans in enums", textBn: "Python-এর enum-এ boolean হয় না", isCorrect: false, explanationEn: "This is a design question, not a language limit.", explanationBn: "এটা design-এর প্রশ্ন, ভাষার সীমা না।" },
          ],
        },
        {
          id: "hp00-q5",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "An automated optimizer predicts a higher score if it loosens a permission ceiling. What should the harness allow?",
          questionBn: "একটা স্বয়ংক্রিয় optimizer বলছে অনুমতির সীমা একটু ঢিলা করলে score বাড়বে। Harness কী করতে দেবে?",
          options: [
            { id: "a", textEn: "Apply it, since the score improves", textBn: "Score বাড়ছে, তাই চালু করে দেবে", isCorrect: false, explanationEn: "That is the system grading itself.", explanationBn: "এটা নিজের খাতা নিজে দেখা।" },
            { id: "b", textEn: "It may propose the change; it may not enact it on its own prediction", textBn: "প্রস্তাব দিতে পারে; নিজের অনুমানে চালু করতে পারে না", isCorrect: true, explanationEn: "Permission ceilings belong to the assurance kernel, outside the adaptive loop (p. 24).", explanationBn: "অনুমতির সীমা assurance kernel-এর, adaptive loop-এর বাইরে (p. 24)।" },
            { id: "c", textEn: "Ask the model whether it is safe", textBn: "মডেলকে জিজ্ঞেস করবে নিরাপদ কি না", isCorrect: false, explanationEn: "A model statement is not independent evidence.", explanationBn: "মডেলের কথা স্বাধীন evidence না।" },
          ],
        },
        {
          id: "hp00-faq",
          type: "faq",
          titleEn: "Questions learners ask about this chapter",
          titleBn: "এই অধ্যায় নিয়ে সাধারণ প্রশ্ন",
          items: [
            {
              questionEn: "Isn't a harness just a framework like an agent SDK?",
              questionBn: "Harness কি শুধু agent SDK-এর মতো একটা framework না?",
              answerEn: "No. A framework is a library you build from; the harness is the runtime your agent works in. A platform sits one level higher and serves many harnesses. Someone still has to own the loop, state, actions, permissions, evidence and lifecycle, whichever product holds the code.",
              answerBn: "না। Framework হলো library যা দিয়ে বানাও; harness হলো সেই runtime যেখানে তোমার agent কাজ করে। Platform তার এক ধাপ ওপরে, অনেক harness-কে সেবা দেয়। Code যে product-এই থাকুক, loop, state, action, অনুমতি, evidence আর lifecycle-এর মালিক কাউকে না কাউকে হতেই হয়।",
              ref: "p. 22",
            },
            {
              questionEn: "Will a smarter model make the harness less important?",
              questionBn: "আরও বুদ্ধিমান মডেল এলে কি harness-এর গুরুত্ব কমবে?",
              answerEn: "The opposite. A weak model fails visibly; a capable one can move quickly through the wrong account or policy while sounding reasonable. More capability means more reach and a larger blast radius, so the controls matter more.",
              answerBn: "উল্টো। দুর্বল মডেল চোখে পড়ার মতো ভুল করে; দক্ষ মডেল যুক্তিসঙ্গত শোনাতে শোনাতে দ্রুত ভুল account বা policy-তে চলে যেতে পারে। দক্ষতা বাড়লে নাগাল বাড়ে, ক্ষতির পরিসরও বাড়ে, তাই নিয়ন্ত্রণ আরও জরুরি হয়।",
              ref: "p. 8",
            },
            {
              questionEn: "Do I always need the full B2 or B3 harness?",
              questionBn: "সবসময় কি পুরো B2 বা B3 harness লাগবে?",
              answerEn: "No. Harness engineering is a method for finding the minimum system that can bear the claim. If B2 adds cost but changes no outcome, recovery or exposure metric on a read-only task, keep B0 or B1 for that task.",
              answerBn: "না। Harness engineering হলো দাবিটা বহন করতে পারে এমন সবচেয়ে ছোট সিস্টেম খুঁজে বের করার পদ্ধতি। শুধু-পড়ার কাজে B2 যদি খরচ বাড়ায় কিন্তু কোনো ফলাফল, recovery বা ঝুঁকির মাপ না বদলায়, তাহলে সেই কাজে B0 বা B1-ই রাখো।",
              ref: "p. 28",
            },
            {
              questionEn: "What does the budget chart in this lesson show?",
              questionBn: "এই lesson-এর budget chart কী দেখায়?",
              answerEn: "Reserving budget for verification does not raise the share of verified completions. It turns runs that would have claimed \"done\" without evidence into honest BUDGET_EXHAUSTED stops. That is what the book means by reserving enough budget for the verification step.",
              answerBn: "Verification-এর জন্য budget রাখলে যাচাইসহ completion-এর হার বাড়ে না। যে run-গুলো প্রমাণ ছাড়া \"done\" বলত, সেগুলো সৎ BUDGET_EXHAUSTED-এ পরিণত হয়। বই এটাকেই বলে verification-এর জন্য যথেষ্ট budget রাখা।",
              ref: "p. 21",
            },
            {
              questionEn: "Does the code in this lesson come from the book?",
              questionBn: "এই lesson-এর code কি বই থেকে নেওয়া?",
              answerEn: "No. The book gives the loop as formulas. The Python, the tests and the Manim scenes were written for this course, and the trace was recorded by actually running that code.",
              answerBn: "না। বইয়ে loop-টা সূত্র হিসেবে আছে। Python, test আর Manim scene এই কোর্সের জন্য লেখা, আর trace ওই code আসলে চালিয়ে রেকর্ড করা।",
            },
          ],
        },
      ],
    },
  ],

  relatedLessons: [
    {
      id: "hp.02.tool-calls-to-safe-actions",
      titleEn: "From Tool Calls to Safe Actions",
      titleBn: "Tool Call থেকে নিরাপদ Action",
      slug: "harness-02-tool-calls-to-safe-actions",
      trackId: "ai-engineering",
      estimatedMinutes: 40,
    },
  ],
};
