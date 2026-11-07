import { Lesson } from "@/features/lessons/types/lesson.types";
import evalPlaneSceneSource from "../../../../../courses/harness-playbook/scenes/ch05_evaluation_control_plane.py?raw";

/**
 * Chapter 05 of The Harness Engineering Playbook (pp. 112–134, Appendix G pp. 495–501).
 */

const RUN_OUTPUT = `$ python -m harness.ch05.qualification_gate
# worked case: completion=80.0% vetoes=['c5:VETO:UNAUTHORIZED_EFFECT'] decision=REJECT_SAFETY_FLOOR
# missing output: attrition=1 decision=REQUEST_MORE_EVIDENCE`;

export const CH05_TESTING_TRUST_LESSON: Lesson = {
  id: "hp.05.testing-that-earns-trust",
  slug: "harness-05-testing-that-earns-trust",
  trackId: "ai-engineering",
  moduleId: "hp-part-2",
  moduleTitleEn: "Harness Engineering · Part II · Runtime",
  moduleTitleBn: "Harness Engineering · পার্ট II · রানটাইম",

  titleEn: "Testing That Earns Trust",
  titleBn: "যে testing আস্থা অর্জন করে",
  subtitleEn:
    "An evaluation is not a leaderboard attached to an agent. It is the independent decision system that determines what this exact model–harness configuration has earned the right to do.",
  subtitleBn:
    "Evaluation কোনো এজেন্টের গায়ে লাগানো লিডারবোর্ড নয়। এটি একটি স্বাধীন সিদ্ধান্ত-ব্যবস্থা যা নির্ধারণ করে এই নির্দিষ্ট model–harness কনফিগারেশনটি কী করার অধিকার অর্জন করেছে।",
  descriptionEn:
    "The evaluation control plane: separating measurement, evaluation, qualification, and assurance; the August 2026 P0 audit and honest denominators; claim graphs, world-before-words verification, and trajectory invariants; judge correlation and verifier harmfulness; pass@k vs pass^k and the zero-failure upper bound; metric vectors with hard vetoes; and typed promotion decisions. Book pp. 112–134 & Appendix G pp. 495–501.",
  descriptionBn:
    "Evaluation control plane: measurement, evaluation, qualification ও assurance আলাদা করা; August 2026 P0 audit এবং সৎ হর (denominator); claim graph, কথার আগে জগতের অবস্থা যাচাই এবং trajectory invariant; জাজ কোরিলেশন ও verifier harmfulness; pass@k বনাম pass^k এবং শূন্য-ব্যর্থতার উচ্চসীমা; hard veto-সহ মেট্রিক ভেক্টর এবং টাইপ করা প্রমোশন সিদ্ধান্ত। বইয়ের পৃষ্ঠা 112–134 ও পরিশিষ্ট G পৃষ্ঠা 495–501।",

  difficulty: "intermediate",
  estimatedMinutes: 40,

  prerequisites: [
    {
      id: "hp.03.building-the-right-briefing",
      titleEn: "Building the Right Briefing",
      titleBn: "সঠিক briefing তৈরি",
      slug: "harness-03-building-the-right-briefing",
    },
    {
      id: "hp.04.knowing-when-to-continue-wait-or-stop",
      titleEn: "Knowing When to Continue, Wait, or Stop",
      titleBn: "কখন চালিয়ে যাবে, অপেক্ষা করবে, না থামবে",
      slug: "harness-04-knowing-when-to-continue-wait-or-stop",
    },
  ],
  learningObjectivesEn: [
    "Separate measurement, evaluation, qualification, and assurance, and bind every claim to a versioned SUT and EVAL tuple.",
    "Preserve all 8 terminal accounting states without coercing missing outputs or timeouts into safe passes.",
    "Grade authoritative world state for task completion and trajectory invariants wherever authority, privacy, safety, or recovery depends on the path.",
    "Compare pass@k against pass^k across repeated trials and explain why one hard-gate violation vetoes a candidate with higher average completion.",
  ],
  learningObjectivesBn: [
    "Measurement, evaluation, qualification ও assurance আলাদা করতে এবং প্রতিটি দাবিকে নির্দিষ্ট SUT ও EVAL টাপলের সাথে বাঁধতে পারবে।",
    "কোনো খালি আউটপুট বা timeout-কে চুপিসারে পাস না বানিয়ে ৮টি টার্মিনাল একাউন্টিং অবস্থা অক্ষুণ্ণ রাখতে পারবে।",
    "কাজ সম্পন্ন হয়েছে কি না তা দেখতে বাহ্যিক জগতের আসল অবস্থা (world state) এবং ঝুঁকির পথে trajectory invariant যাচাই করতে পারবে।",
    "পুনরাবৃত্ত ট্রায়ালে pass@k ও pass^k তুলনা করতে এবং কেন একটি hard-gate লঙ্ঘন উচ্চতর গড় স্কোরের প্রার্থীকেও ভেটো করে তা ব্যাখ্যা করতে পারবে।",
  ],
  concepts: [
    {
      id: "evaluation-control-plane",
      nameEn: "Evaluation control plane & qualification envelope",
      nameBn: "Evaluation control plane ও qualification envelope",
      descriptionEn: "A second harness around the production harness that turns claims, world-state evidence, and hard vetoes into typed promotion decisions.",
      descriptionBn: "প্রোডাকশন হার্নেসের চারপাশে দ্বিতীয় একটি হার্নেস যা দাবি, জগতের প্রমাণ এবং hard veto-কে টাইপ করা প্রমোশন সিদ্ধান্তে রূপ দেয়।",
      trackId: "ai-engineering",
      difficulty: "intermediate",
    },
    {
      id: "honest-denominators",
      nameEn: "Honest denominators & attrition accounting",
      nameBn: "সৎ হর (Denominator) ও attrition হিসাব",
      descriptionEn: "Every trial ends in one of 8 accounting states; absent or unparseable observations never default to safe behavior.",
      descriptionBn: "প্রতিটি ট্রায়াল ৮টি নির্দিষ্ট একাউন্টিং অবস্থার একটিতে শেষ হয়; অনুপস্থিত বা অপার্সযোগ্য আউটপুট কখনোই নিরাপদ আচরণ হিসেবে গণ্য হয় না।",
      trackId: "ai-engineering",
      difficulty: "intermediate",
    },
    {
      id: "pass-power-k",
      nameEn: "pass^k repeated-trial reliability & zero-failure bounds",
      nameBn: "pass^k পুনরাবৃত্ত নির্ভরযোগ্যতা ও শূন্য-ব্যর্থতার সীমা",
      descriptionEn: "Measures whether all k attempts succeed (p^k) rather than at least one (1 − (1 − p)^k), bounded by 1 − 0.05^(1/n) when zero failures are observed.",
      descriptionBn: "অন্তত একবার সফল হওয়ার বদলে k বারের প্রতিবারই সফল হওয়ার সম্ভাবনা (p^k) এবং শূন্য ব্যর্থতায় 1 − 0.05^(1/n) উচ্চসীমা পরিমাপ করে।",
      trackId: "ai-engineering",
      difficulty: "intermediate",
    },
  ],

  sections: [
    {
      id: "hp05-theory",
      order: 1,
      titleEn: "1. Theory",
      titleBn: "১. তত্ত্ব",
      blocks: [
        {
          id: "hp05-lead",
          type: "explanation",
          titleEn: "A score does not grant authority (pp. 112–114)",
          titleBn: "শুধু একটি স্কোর কাজের অনুমতি দেয় না (pp. 112–114)",
          contentEn:
            "Suppose an agent scores 94 percent on a benchmark. May it draft a reply? Read a customer record? Issue a refund? Change a contract? The score alone cannot answer because each action carries a different consequence, and the missing six percent may contain every case that matters. Evaluation is not a stage after engineering—it is a second harness around the first one. While the production harness controls what the model can perceive, retain, and do, the evaluation control plane controls what claims may be made about that harness and which deployment transitions those claims authorize.",
          contentBn:
            "ধরা যাক একটি এজেন্ট বেঞ্চমার্কে ৯৪ শতাংশ স্কোর করেছে। সে কি উত্তরের খসড়া লিখতে পারবে? গ্রাহকের রেকর্ড পড়তে পারবে? রিফান্ড দিতে পারবে? চুক্তি বদলাতে পারবে? শুধু ওই স্কোরটি এর উত্তর দিতে পারে না, কারণ প্রতিটি কাজের ফলাফল আলাদা এবং বাকি ৬ শতাংশের ভেতরেই থাকতে পারে সবচেয়ে গুরুত্বপূর্ণ কেসগুলো। ইভ্যালুয়েশন ইঞ্জিনিয়ারিংয়ের পরের কোনো ধাপ নয়—এটি প্রথম হার্নেসের চারপাশে দ্বিতীয় একটি হার্নেস। প্রোডাকশন হার্নেস নিয়ন্ত্রণ করে মডেল কী দেখবে ও করবে, আর evaluation control plane নিয়ন্ত্রণ করে সেই হার্নেস সম্পর্কে কী দাবি করা যাবে এবং কোন রিলিজ বা ক্ষমতা অনুমোদন পাবে।",
          keyIdeaEn: "\"An absent or unparseable observation can never be evidence of safe behavior.\" (p. 113)",
          keyIdeaBn: "একটি অনুপস্থিত বা অপার্সযোগ্য পর্যবেক্ষণ কখনোই নিরাপদ আচরণের প্রমাণ হতে পারে না। (p. 113)",
        },
        {
          id: "hp05-four-activities",
          type: "comparison",
          titleEn: "Measurement, evaluation, qualification, and assurance (pp. 113–114)",
          titleBn: "Measurement, evaluation, qualification এবং assurance (pp. 113–114)",
          headers: ["Activity", "Core question", "Operational output"],
          rows: [
            {
              featureEn: "Measurement",
              featureBn: "Measurement (পরিমাপ)",
              values: ["What happened in these trials?", "Raw observations, labels, rates, and distributions"],
            },
            {
              featureEn: "Evaluation",
              featureBn: "Evaluation (মূল্যায়ন)",
              values: ["Did the observed behavior satisfy declared criteria?", "Per-case and aggregate judgments"],
            },
            {
              featureEn: "Qualification",
              featureBn: "Qualification (যোগ্যতা নির্ধারণ)",
              values: ["Is the evidence sufficient for a named deployment envelope?", "Approve, restrict, shadow, reject, or request evidence"],
            },
            {
              featureEn: "Assurance",
              featureBn: "Assurance (আশ্বাস ও জবাবদিহি)",
              values: ["Why should stakeholders believe the qualification remains warranted?", "Claims, evidence, assumptions, residual risk, controls, owner"],
            },
          ],
          footnoteEn:
            "The evaluated object is SUT = <model, harness, tools, permissions, context sources, environment, resource envelope, policy versions>, conditional on EVAL = <task distribution, initial states, perturbations, user model, graders, outcome window, infrastructure, sampling design> (p. 113).",
          footnoteBn:
            "পরীক্ষার বিষয় হলো SUT = <model, harness, tools, permissions, context sources, environment, resource envelope, policy versions>, যা নির্ভর করে EVAL = <task distribution, initial states, perturbations, user model, graders, outcome window, infrastructure, sampling design>-এর ওপর (p. 113)।",
        },
        {
          id: "hp05-p0-audit",
          type: "engineering-note",
          titleEn: "Denominators are architecture: the August 2026 P0 audit (pp. 112–113, 123)",
          titleBn: "হরই (Denominator) আর্কিটেকচার: August 2026 P0 audit (pp. 112–113, 123)",
          contentEn:
            "In August 2026, an internal audit of a 2,160-trial experiment found that its summary table reported DeepSeek-R1 misbehaving on 8.8% of cases—making it appear to be the second-safest model tested. But 421 trials (19.5% of the run) had returned empty responses after reasoning tokens exhausted the output budget, and the evaluator silently counted every empty response as honest. On valid trials, the measured rate was 84%. The missing-data policy had inverted the ranking.\n\nEvery trial must end in exactly one of 8 observable accounting states:\nVALID_PASS | VALID_FAIL | SYSTEM_ERROR | GRADER_ERROR | TIMEOUT | MISSING_OUTPUT | INVALID_CASE | CENSORED_OUTCOME",
          contentBn:
            "আগস্ট ২০২৬-এ ২,১৬০টি ট্রায়ালের একটি অভ্যন্তরীণ অডিটে দেখা যায়, সামারি টেবিলে DeepSeek-R1-এর অসঙ্গত আচরণের হার দেখানো হয়েছে ৮.৮%—যাতে সেটিকে দ্বিতীয় সবচেয়ে নিরাপদ মডেল মনে হচ্ছিল। কিন্তু ৪২১টি ট্রায়ালে (১৯.৫%) রিজনিং টোকেন আউটপুট বাজেট শেষ করে ফেলায় খালি উত্তর এসেছিল, আর ইভ্যালুয়েটর চুপিসারে প্রতিটি খালি উত্তরকে 'সৎ/নিরাপদ' হিসেবে গণেছিল! বৈধ ট্রায়ালে আসল অসঙ্গতির হার ছিল ৮৪%। ভুল missing-data policy পুরো র‍্যাঙ্কিং উল্টে দিয়েছিল।\n\nপ্রতিটি ট্রায়ালকে নিচের ৮টি টার্মিনাল একাউন্টিং অবস্থার ঠিক একটিতে শেষ হতে হবে:\nVALID_PASS | VALID_FAIL | SYSTEM_ERROR | GRADER_ERROR | TIMEOUT | MISSING_OUTPUT | INVALID_CASE | CENSORED_OUTCOME",
          recommendationEn:
            "Never coerce the last six states into pass or fail silently. Report attrition by candidate and task slice, and emit REQUEST_MORE_EVIDENCE or REJECT_EVALUATOR_INVALID when required observations are missing.",
          recommendationBn:
            "শেষের ছয়টি অবস্থাকে কখনোই চুপিসারে pass বা fail বানাবে না। প্রতিটি প্রার্থী ও স্লাইসের attrition আলাদা রিপোর্ট করো এবং প্রয়োজনীয় পর্যবেক্ষণ অনুপস্থিত থাকলে REQUEST_MORE_EVIDENCE বা REJECT_EVALUATOR_INVALID ঘোষণা করো।",
        },
        {
          id: "hp05-world-and-judges",
          type: "under-the-hood",
          titleEn: "Claim graphs, world-before-words verification, and fallible judges (pp. 117–122)",
          titleBn: "Claim graph, কথার আগে জগতের অবস্থা যাচাই এবং ত্রুটিপূর্ণ জাজ (pp. 117–122)",
          explanationEn:
            "Start with the authority the system wants (e.g., investigate duplicate charges and prepare a proposal, but execute zero refunds) and decompose it into supporting claims C1–C10.",
          explanationBn:
            "সিস্টেম কোন ক্ষমতা চায় তা দিয়ে শুরু করো (যেমন ডুপ্লিকেট চার্জ তদন্ত করে প্রস্তাব তৈরি করা, কিন্তু কোনো রিফান্ড কার্যকর না করা) এবং সেটিকে C1–C10 দাবিতে ভাগ করো।",
          pipelineSteps: [
            {
              titleEn: "1. Grade the world before the words (p. 119)",
              titleBn: "১. কথার আগে জগতের অবস্থা যাচাই (p. 119)",
              descEn: "Exploit verification asymmetry: inspect database state, immutable tool receipts, signed capability grants, and executable tests rather than asking an LLM judge whether an action succeeded.",
              descBn: "Verification asymmetry ব্যবহার করো: কাজটি হয়েছে কি না তা LLM জাজকে না জিজ্ঞেস করে সরাসরি ডাটাবেস স্টেট, অপরিবর্তনীয় রিসিট, সাইন করা অনুমতি এবং এক্সিকিউটেবল টেস্ট পরীক্ষা করো।",
            },
            {
              titleEn: "2. Outcome first; trajectory where the path carries risk (p. 120)",
              titleBn: "২. ফলাফল আগে; তবে ঝুঁকির পথে trajectory invariant (p. 120)",
              descEn: "Accept any equivalent valid tool sequence for completion, but enforce trajectory invariants whenever the path changes authority, privacy, safety, or recoverability (e.g., identity.verify must precede billing.read).",
              descBn: "কাজ শেষ করার জন্য সমতুল্য যেকোনো বৈধ টুল-ক্রম গ্রহণ করো, কিন্তু যেখানে পথের ওপর কর্তৃত্ব, গোপনীয়তা বা নিরাপত্তা নির্ভর করে সেখানে trajectory invariant বাধ্যতামূলক করো (যেমন billing.read-এর আগে identity.verify)।",
            },
            {
              titleEn: "3. Correlated judge panels (p. 121)",
              titleBn: "৩. জাজ প্যানেলের ত্রুটির সহ-সম্পর্ক (p. 121)",
              descEn: "Apple's nine-judge study found correlated blind spots reduced seven model families to roughly two effective votes. Diversify with external tools, state reads, and human references rather than more models reading the same trace.",
              descBn: "Apple-এর ৯-জাজের গবেষণায় দেখা গেছে একই ধরনের অন্ধবিন্দুর কারণে ৭টি মডেল পরিবার মিলে কার্যত মাত্র ২টি স্বাধীন ভোটের সমান কাজ করে। তাই শুধু মডেলের সংখ্যা না বাড়িয়ে বাহ্যিক টুল, স্টেট রিড ও মানব বিশেষজ্ঞের প্রমাণ যোগ করো।",
            },
            {
              titleEn: "4. Verifier helpfulness vs. harmfulness (p. 122)",
              titleBn: "৪. Verifier helpfulness বনাম harmfulness (p. 122)",
              descEn: "Measure both helpfulness = P(incorrect proposal -> acceptable) and harmfulness = P(acceptable proposal -> unacceptable) on matched compute budgets.",
              descBn: "একই কম্পিউট বাজেটে helpfulness = P(ভুল প্রস্তাব -> গ্রহণযোগ্য) এবং harmfulness = P(সঠিক প্রস্তাব -> অগ্রহণযোগ্য)—উভয়ই পরিমাপ করো।",
            },
          ],
          technicalNoteEn:
            "Every case must also pass case qualification before it can judge the agent: a known reference solution passes, a known bad strategy fails, and a planted vulnerability triggers on a vulnerable fixture (pp. 124–125, 497).",
          technicalNoteBn:
            "এজেন্টকে পরীক্ষা করার আগে প্রতিটি টেস্ট কেসকেও যোগ্যতা পরীক্ষায় উত্তীর্ণ হতে হয়: জানা সঠিক কৌশল পাশ করবে, জানা ভুল কৌশল ব্যর্থ হবে এবং দুর্বল ফিক্সচারে রোপণ করা আক্রমণটি ধরা পড়বে (pp. 124–125, 497)।",
        },
        {
          id: "hp05-reliability-and-vetoes",
          type: "engineering-note",
          titleEn: "Repeated trials (pass@k vs pass^k), zero-failure bounds, and hard vetoes (pp. 122–132)",
          titleBn: "পুনরাবৃত্ত ট্রায়াল (pass@k বনাম pass^k), শূন্য-ব্যর্থতার সীমা এবং hard veto (pp. 122–132)",
          contentEn:
            "• pass@k = 1 − (1 − p)^k asks if at least 1 of k attempts succeeds (useful only with search + oracle). pass^k = p^k (Sierra τ-bench) asks if all k attempts succeed—exposing brittle agents when users expect every run to work.\n• Zero observed failures is not zero risk: with 0 failures in n independent trials, the one-sided 95% upper confidence bound is 1 − 0.05^(1/n) (2.95% at n = 100; 0.30% at n = 1,000; needs n ≈ 2,995 for < 0.1%). Catastrophic hazards require structural prevention.\n• Economic denominator: cost_per_qualified_success = total_system_cost / qualified_successes.\n• Typed promotion decisions (pp. 128–129): APPROVE_AS_SCOPED | APPROVE_SHADOW_ONLY | APPROVE_WITH_REDUCED_AUTHORITY | REJECT_REGRESSION | REJECT_SAFETY_FLOOR | REJECT_EVALUATOR_INVALID | REQUEST_MORE_EVIDENCE.",
          contentBn:
            "• pass@k = 1 − (1 − p)^k দেখে k বারের মধ্যে অন্তত ১ বার সফল হয়েছে কি না। আর pass^k = p^k (Sierra τ-bench) দেখে k বারের প্রতিবারই সফল হয়েছে কি না—গ্রাহক যখন প্রতিবার সঠিক কাজ আশা করেন তখন এটিই আসল মাপকাঠি।\n• শূন্য পর্যবেক্ষিত ব্যর্থতা মানে শূন্য ঝুঁকি নয়: nটি স্বাধীন ট্রায়ালে ০টি ব্যর্থতা থাকলে প্রকৃত ব্যর্থতার হারের একমুখী ৯৫% উচ্চসীমা হলো 1 − 0.05^(1/n) (n = 100-এ ২.৯৫%; n = 1,000-এ ০.৩০%; < ০.১% পেতে প্রায় ২,৯৯৫টি ট্রায়াল লাগে)। তাই মারাত্মক ঝুঁকিতে কাঠামোগত প্রতিরোধ অপরিহার্য।\n• অর্থনৈতিক হিসাব: cost_per_qualified_success = total_system_cost / qualified_successes।\n• টাইপ করা প্রমোশন সিদ্ধান্ত (pp. 128–129): APPROVE_AS_SCOPED | APPROVE_SHADOW_ONLY | APPROVE_WITH_REDUCED_AUTHORITY | REJECT_REGRESSION | REJECT_SAFETY_FLOOR | REJECT_EVALUATOR_INVALID | REQUEST_MORE_EVIDENCE।",
          recommendationEn:
            "In the worked case (pp. 131–132), a candidate improved qualified completion from 78.4% to 84.9% (+6.5 pp) and cut human minutes from 86 to 73, but created 1 unauthorized refund when resolve_refund_status defaulted a missing mode to create_or_lookup. The qualification gate rejected it (REJECT_SAFETY_FLOOR) until the capability was split into refund.lookup and refund.create.",
          recommendationBn:
            "পৃষ্ঠা 131–132-এর worked case-এ নতুন প্রার্থীটির qualified completion ৭৮.৪% থেকে বেড়ে ৮৪.৯% (+৬.৫%) হয়েছিল এবং মানুষের সময় ৮৬ থেকে ৭৩ মিনিটে নেমেছিল, কিন্তু resolve_refund_status টুলে mode না থাকায় ১টি অননুমোদিত রিফান্ড তৈরি হয়েছিল। Qualification gate সেটিকে সাথে সাথে প্রত্যাখ্যান করে (REJECT_SAFETY_FLOOR), যতক্ষণ না টুলটিকে refund.lookup ও refund.create-এ ভাগ করা হয়।",
        },
        {
          id: "hp05-mistake",
          type: "mistake",
          wrongMentalModelEn:
            "Build one golden dataset, run LLM-as-a-judge over final answers, drop failed/empty API calls from the denominator, and ship whenever the average score beats baseline.",
          wrongMentalModelBn:
            "একটি গোল্ডেন ডেটাসেট বানাও, চূড়ান্ত উত্তরের ওপর LLM-as-a-judge চালাও, খালি বা টাইমআউট হওয়া কলগুলো হিসাব থেকে বাদ দাও এবং গড় স্কোর আগের চেয়ে বাড়লেই শিপ করে দাও।",
          correctMentalModelEn:
            "Dropping or coercing missing outputs distorts rankings, prose judges cannot verify external state or trajectory authority invariants, and an average score lets soft quality gains hide a hard safety-floor breach.",
          correctMentalModelBn:
            "খালি আউটপুট বাদ দিলে বা পাস ধরলে র‍্যাঙ্কিং উল্টে যায়, গদ্য-জাজ লেজারের স্টেট বা trajectory-র কর্তৃত্ব যাচাই করতে পারে না, আর গড় স্কোরের আড়ালে মারাত্মক নিরাপত্তা লঙ্ঘন লুকিয়ে যায়।",
          explanationEn:
            "An evaluation control plane preserves all 8 accounting states, grades authoritative world state and trajectory invariants first, and binds metric vectors with non-compensable hard vetoes to a scoped deployment envelope (pp. 112–133).",
          explanationBn:
            "একটি প্রকৃত evaluation control plane ৮টি একাউন্টিং অবস্থাই অক্ষুণ্ণ রাখে, আগে জগতের স্টেট ও trajectory invariant যাচাই করে এবং অপূরণীয় hard veto-সহ নির্দিষ্ট deployment envelope-এর জন্য সিদ্ধান্ত দেয় (pp. 112–133)।",
        },
        {
          id: "hp05-summary",
          type: "summary",
          titleEn: "Carry forward",
          titleBn: "মনে রাখো",
          takeawaysEn: [
            "Separate measurement, evaluation, qualification, and assurance; qualify a versioned SUT tuple for a specific deployment envelope.",
            "An absent or unparseable observation is never a pass: account for all 8 trial states explicitly.",
            "Grade authoritative world state for outcomes and trajectory invariants where the path affects authority, privacy, safety, or recovery.",
            "One hard-gate violation triggers REJECT_SAFETY_FLOOR regardless of soft quality gains.",
          ],
          takeawaysBn: [
            "Measurement, evaluation, qualification ও assurance আলাদা রাখো; নির্দিষ্ট deployment envelope-এর জন্য সংস্করণযুক্ত SUT টাপলকে যোগ্য প্রমাণ করো।",
            "অনুপস্থিত বা অপার্সযোগ্য আউটপুট কখনোই পাস নয়: ৮টি ট্রায়াল অবস্থার প্রতিটি আলাদাভাবে হিসাব করো।",
            "ফলাফলের জন্য জগতের আসল স্টেট এবং যেখানে পথের ওপর কর্তৃত্ব, গোপনীয়তা বা নিরাপত্তা নির্ভর করে সেখানে trajectory invariant যাচাই করো।",
            "একটিও hard-gate লঙ্ঘন ঘটলে গড় মানের উন্নতি যতই হোক, সিদ্ধান্ত হবে REJECT_SAFETY_FLOOR।",
          ],
          checklistEn: [
            "Every claim C1–C10 in the qualification contract maps to an independent truth surface and owner.",
            "Missing outputs, timeouts, and grader errors increment explicit attrition counters and never inflate pass rates.",
            "Repeated-run consistency is measured with pass^k clustered by task, not inflated into n × k independent trials.",
            "Cases and learned graders pass their own qualification and calibration checks before gating promotion.",
          ],
          checklistBn: [
            "Qualification contract-এর প্রতিটি দাবি (C1–C10) স্বাধীন প্রমাণ-উৎস ও মালিকের সাথে যুক্ত।",
            "Missing output, timeout ও grader error স্পষ্টভাবে attrition হিসেবে গণনা হয় এবং কখনোই পাশের হার বাড়ায় না।",
            "পুনরাবৃত্ত রানের ধারাবাহিকতা টাস্ক অনুযায়ী ক্লাস্টার করে pass^k দিয়ে মাপা হয়।",
            "প্রমোশন গেটে ব্যবহারের আগে প্রতিটি টেস্ট কেস ও মডেল জাজ নিজস্ব যোগ্যতা ও ক্যালিব্রেশন পরীক্ষায় উত্তীর্ণ হয়।",
          ],
        },
      ],
    },
    {
      id: "hp05-visual",
      order: 2,
      titleEn: "2. Visual",
      titleBn: "২. ভিজ্যুয়াল",
      blocks: [
        {
          id: "hp05-flow",
          type: "visualization",
          visualizationId: "ai-engineering.harness.evaluation-control-plane",
          titleEn: "Evaluation Control Plane: Why the 84.9% Winner Does Not Ship",
          titleBn: "Evaluation Control Plane: ৮৪.৯% স্কোর করেও কেন বিজয়ী প্রার্থী শিপ হয় না",
        },
        {
          id: "hp05-chart",
          type: "chart",
          chartId: "ai-engineering.harness.pass-power-k",
        },
        {
          id: "hp05-manim-plane",
          type: "code",
          title: "scenes/ch05_evaluation_control_plane.py · ManimGL · manimgl ch05_evaluation_control_plane.py EvaluationControlPlaneScene -w",
          language: "python",
          code: evalPlaneSceneSource.replace(/\n$/, ""),
        },
      ],
    },
    {
      id: "hp05-practical",
      order: 3,
      titleEn: "3. Practical",
      titleBn: "৩. প্র্যাকটিক্যাল",
      blocks: [
        {
          id: "hp05-practical-intro",
          type: "explanation",
          titleEn: "Code written for this course",
          titleBn: "এই কোর্সের জন্য লেখা code",
          contentEn:
            "The file below implements the Chapter 05 trial auditor and qualification adjudicator: trajectory invariant checking (identity.verify before billing.read), world-state effect checking (no refund.created), honest attrition accounting for MISSING_OUTPUT and GRADER_ERROR, and typed promotion decisions. Run it from courses/harness-playbook with python -m harness.ch05.qualification_gate, and run the tests with python -m unittest.",
          contentBn:
            "নিচের ফাইলটি অধ্যায় ০৫-এর ট্রায়াল অডিটর ও কোয়ালিফিকেশন অ্যাজুডিকেটর বাস্তবায়ন করে: trajectory invariant যাচাই (billing.read-এর আগে identity.verify), world-state যাচাই (কোনো refund.created নয়), MISSING_OUTPUT ও GRADER_ERROR-এর জন্য সৎ attrition হিসাব এবং টাইপ করা প্রমোশন সিদ্ধান্ত। courses/harness-playbook থেকে python -m harness.ch05.qualification_gate দিয়ে চালাও এবং python -m unittest দিয়ে test করো।",
        },
        {
          id: "hp05-trace",
          type: "code-trace",
          traceId: "ai-engineering.harness.ch05.qualification-gate",
        },
        {
          id: "hp05-output",
          type: "code",
          title: "Real output",
          language: "bash",
          code: RUN_OUTPUT,
        },
        {
          id: "hp05-exercise",
          type: "engineering-note",
          titleEn: "Exercise: qualify the evaluation case before it qualifies the agent",
          titleBn: "অনুশীলন: এজেন্টকে পরীক্ষা করার আগে টেস্ট কেসটিকে যোগ্য প্রমাণ করো",
          contentEn:
            "On pages 124–125 and 500 (Invariants 5 & 6), a case is qualified to evaluate an agent only if a known-valid reference strategy passes, a known-invalid strategy fails, and a planted perturbation triggers a veto against a vulnerable fixture. Right now qualify_case(ref_trial, bad_trial, vulnerable_trial) returns True unconditionally. Update it to return audit_trial(ref_trial) == \"VALID_PASS\" and audit_trial(bad_trial) != \"VALID_PASS\" and audit_trial(vulnerable_trial).startswith(\"VETO:\").",
          contentBn:
            "পৃষ্ঠা 124–125 ও 500 (Invariant 5 ও 6) অনুযায়ী, একটি টেস্ট কেস কেবল তখনই এজেন্টকে পরীক্ষা করার যোগ্য যখন জানা সঠিক কৌশলটি পাশ করে, জানা ভুল কৌশলটি ব্যর্থ হয় এবং দুর্বল ফিক্সচারে রোপণ করা আক্রমণটি ভেটো ট্রিগার করে। এখন qualify_case(ref_trial, bad_trial, vulnerable_trial) সবসময় True ফেরত দেয়। এটিকে আপডেট করো যাতে এটি audit_trial(ref_trial) == \"VALID_PASS\" and audit_trial(bad_trial) != \"VALID_PASS\" and audit_trial(vulnerable_trial).startswith(\"VETO:\") ফেরত দেয়।",
          recommendationEn:
            "tests/test_ch05.py has ExerciseTest marked @unittest.expectedFailure. Remove the decorator once your change passes.",
          recommendationBn:
            "tests/test_ch05.py-তে ExerciseTest আগে থেকেই @unittest.expectedFailure দিয়ে রাখা আছে। তোমার কোড কাজ করলে decorator-টি সরিয়ে দাও।",
        },
      ],
    },
    {
      id: "hp05-qa",
      order: 4,
      titleEn: "4. Q&A",
      titleBn: "৪. প্রশ্নোত্তর",
      blocks: [
        {
          id: "hp05-q1",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn:
            "In Cohorte's August 2026 P0 audit of 2,160 trials (p. 112), why did DeepSeek-R1 appear to have an 8.8% misbehavior rate when its measured rate on valid trials was 84%?",
          questionBn:
            "Cohorte-এর আগস্ট ২০২৬-এর ২,১৬০ ট্রায়ালের P0 audit-এ (পৃষ্ঠা 112), বৈধ ট্রায়ালে DeepSeek-R1-এর অসঙ্গত আচরণের হার ৮৪% হওয়া সত্ত্বেও কেন টেবিলে সেটি মাত্র ৮.৮% দেখাচ্ছিল?",
          options: [
            {
              id: "a",
              textEn: "19.5% of trials returned empty responses after reasoning tokens exhausted the output budget, and the evaluator silently counted every empty response as honest",
              textBn: "রিজনিং টোকেন বাজেট শেষ করে ফেলায় ১৯.৫% ট্রায়ালে খালি উত্তর এসেছিল, এবং ইভ্যালুয়েটর চুপিসারে প্রতিটি খালি উত্তরকে 'সৎ/নিরাপদ' হিসেবে গণেছিল",
              isCorrect: true,
              explanationEn:
                "Coercing 421 empty responses into honest passes inverted the safety ranking—motivating the invariant that an absent observation can never be evidence of safe behavior (pp. 112–113).",
              explanationBn:
                "৪২১টি খালি উত্তরকে নিরাপদ পাস হিসেবে গণনা করায় পুরো র‍্যাঙ্কিং উল্টে গিয়েছিল—এ কারণেই মূল নীতি হলো অনুপস্থিত পর্যবেক্ষণ কখনোই নিরাপদ আচরণের প্রমাণ হতে পারে না (pp. 112–113)।",
            },
            {
              id: "b",
              textEn: "The model retrieved the benchmark answer key from the web",
              textBn: "মডেলটি ওয়েব থেকে বেঞ্চমার্কের উত্তরপত্র খুঁজে বের করেছিল",
              isCorrect: false,
              explanationEn: "That occurred in Anthropic's BrowseComp eval-awareness incident (p. 125), not the P0 missing-output audit.",
              explanationBn: "সেটি ঘটেছিল Anthropic-এর BrowseComp পরীক্ষায় (p. 125), P0 missing-output অডিটে নয়।",
            },
            {
              id: "c",
              textEn: "The benchmark graded trajectory order instead of final state",
              textBn: "বেঞ্চমার্কটি চূড়ান্ত অবস্থার বদলে টুলের ক্রম গ্রেড করেছিল",
              isCorrect: false,
              explanationEn: "The inversion was caused by missing-data coercion in the denominator.",
              explanationBn: "র‍্যাঙ্কিং উল্টে যাওয়ার কারণ ছিল হরের ভেতর খালি আউটপুটকে পাস হিসেবে ধরা।",
            },
          ],
        },
        {
          id: "hp05-q2",
          type: "practice",
          practiceType: "code-reasoning",
          questionEn:
            "In the worked case (pp. 131–132) and the first scenario of our recorded trace, 4 trials pass cleanly and 1 trial creates an unauthorized refund effect (completion_pp = 80.0%, beating the 78.4% baseline). What does qualify_run() return?",
          questionBn:
            "পৃষ্ঠা 131–132-এর worked case এবং আমাদের রেকর্ড করা ট্রেসের প্রথম scenario-তে ৪টি ট্রায়াল পাশ করে এবং ১টি ট্রায়ালে অননুমোদিত রিফান্ড তৈরি হয় (completion_pp = 80.0%, যা 78.4% baseline-এর চেয়ে বেশি)। qualify_run() তখন কী ফেরত দেয়?",
          codeSnippet: `if rpt.counts.get("GRADER_ERROR", 0) > 0:\n    rpt.decision = "REJECT_EVALUATOR_INVALID"\nelif rpt.attrition > 0:\n    rpt.decision = "REQUEST_MORE_EVIDENCE"\nelif rpt.vetoes:\n    rpt.decision = "REJECT_SAFETY_FLOOR"\nelif rpt.completion_pp < baseline_pp + min_gain_pp:\n    rpt.decision = "REJECT_REGRESSION"`,
          options: [
            {
              id: "a",
              textEn: "APPROVE_AS_SCOPED, because 80.0% beats the baseline",
              textBn: "APPROVE_AS_SCOPED, কারণ ৮০.০% স্কোর baseline-কে ছাড়িয়ে গেছে",
              isCorrect: false,
              explanationEn: "Soft completion is checked only after all hard gates pass.",
              explanationBn: "সবগুলো hard gate পাশ করার পরেই কেবল soft completion দেখা হয়।",
            },
            {
              id: "b",
              textEn: "REJECT_SAFETY_FLOOR, because a hard-gate veto cannot be averaged away by higher completion",
              textBn: "REJECT_SAFETY_FLOOR, কারণ উচ্চতর গড় স্কোর দিয়ে hard-gate ভেটো পুষিয়ে নেওয়া যায় না",
              isCorrect: true,
              explanationEn: "rpt.vetoes contains 'c5:VETO:UNAUTHORIZED_EFFECT', so line 52 sets REJECT_SAFETY_FLOOR before soft completion is ever compared (pp. 124, 132).",
              explanationBn: "rpt.vetoes-এ 'c5:VETO:UNAUTHORIZED_EFFECT' থাকায় লাইন 52 সরাসরি REJECT_SAFETY_FLOOR সেট করে (pp. 124, 132)।",
            },
            {
              id: "c",
              textEn: "REQUEST_MORE_EVIDENCE, because one trial failed",
              textBn: "REQUEST_MORE_EVIDENCE, কারণ একটি ট্রায়াল ব্যর্থ হয়েছে",
              isCorrect: false,
              explanationEn: "REQUEST_MORE_EVIDENCE is emitted when trials suffer missing-output/timeout attrition, not when a confirmed safety violation occurs.",
              explanationBn: "REQUEST_MORE_EVIDENCE দেওয়া হয় যখন আউটপুট অনুপস্থিত থাকে (attrition); প্রমাণিত নিরাপত্তা লঙ্ঘনে নয়।",
            },
          ],
          hintEn: "Step through scenario 1 (Worked case) in the code-trace player to lines 51–52.",
          hintBn: "Code-trace প্লেয়ারে scenario ১-এর লাইন 51–52 দেখো।",
        },
        {
          id: "hp05-q3",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn:
            "An agent has a single-trial valid pass rate of p = 80% on a customer support task. If a customer workflow requires k = 5 runs to all succeed without error, which metric reflects that requirement and what is its value?",
          questionBn:
            "একটি গ্রাহক-সেবা টাস্কে এজেন্টের একক ট্রায়ালে পাশের হার p = 80%। যদি ৫ বারের প্রতিবারই (k = 5) নির্ভুলভাবে সফল হওয়া প্রয়োজন হয়, তবে কোন মেট্রিকটি প্রযোজ্য এবং এর মান কত?",
          options: [
            {
              id: "a",
              textEn: "pass@5 = 1 − 0.2^5 = 99.97%",
              textBn: "pass@5 = 1 − 0.2^5 = 99.97%",
              isCorrect: false,
              explanationEn: "pass@5 measures whether at least one of 5 attempts succeeded, which hides the 4 failures.",
              explanationBn: "pass@5 কেবল দেখে ৫ বারের মধ্যে অন্তত একবার কাজ করেছে কি না, যা বাকি ৪টি ব্যর্থতাকে লুকিয়ে ফেলে।",
            },
            {
              id: "b",
              textEn: "pass^5 = 0.8^5 ≈ 32.8%",
              textBn: "pass^5 = 0.8^5 ≈ 32.8%",
              isCorrect: true,
              explanationEn: "Sierra's pass^k = p^k measures the probability that all k attempts succeed: 0.8^5 = 32.768% (p. 122).",
              explanationBn: "Sierra-র pass^k = p^k পরিমাপ করে k বারের প্রতিবারই সফল হওয়ার সম্ভাবনা: 0.8^5 = 32.768% (p. 122)।",
            },
            {
              id: "c",
              textEn: "Average pass rate = 80.0%",
              textBn: "গড় পাশের হার = 80.0%",
              isCorrect: false,
              explanationEn: "80% is the single-trial rate (k = 1), not the 5-trial consistency rate.",
              explanationBn: "৮০% হলো একক ট্রায়ালের হার (k = 1), টানা ৫ বার সফল হওয়ার হার নয়।",
            },
          ],
        },
        {
          id: "hp05-faq",
          type: "faq",
          titleEn: "Questions learners ask about this chapter",
          titleBn: "এই অধ্যায় নিয়ে সাধারণ প্রশ্ন",
          items: [
            {
              questionEn: "Why shouldn't we always grade outcomes only and ignore the agent's trajectory?",
              questionBn: "কেন আমাদের সবসময় শুধু চূড়ান্ত ফলাফল (outcome) দেখা উচিত নয় এবং কখন trajectory গ্রেড করা জরুরি?",
              answerEn:
                "Grading only outcomes is right when multiple equivalent tool sequences are equally safe (e.g., reading a table directly vs searching first). It becomes dangerous whenever the path itself changes authority, privacy, safety, or recoverability—such as reading private billing records before verifying customer identity or attempting a secret exfiltration that the firewall happened to block.",
              answerBn:
                "যখন একাধিক ভিন্ন পথে সমান নিরাপদে কাজটি করা যায়, তখন নির্দিষ্ট টুল-ক্রমের ওপর জোর না দেওয়াই সঠিক। কিন্তু যেখানে পথের ওপরই কর্তৃত্ব, গোপনীয়তা বা নিরাপত্তা নির্ভর করে—যেমন পরিচয় যাচাইয়ের আগেই গোপন বিলিং রেকর্ড পড়া—সেখানে চূড়ান্ত উত্তর ঠিক থাকলেও trajectory invariant যাচাই করা বাধ্যতামূলক।",
              ref: "p. 120",
            },
            {
              questionEn: "If we use a panel of 7–9 LLM judges from different model families, can we treat their majority vote as independent ground truth?",
              questionBn: "আমরা যদি ভিন্ন ভিন্ন মডেল পরিবারের ৭–৯টি LLM জাজের প্যানেল ব্যবহার করি, তবে কি তাদের সংখ্যাগরিষ্ঠ ভোটকে স্বাধীন সত্য বলে ধরা যাবে?",
              answerEn:
                "No. Apple's nine-judge study showed that correlated blind spots across seven model families reduced the panel to roughly two effective votes, and the best single judge matched or beat the panel. Real independence comes from new evidence—such as authoritative state reads, code execution, or human experts with primary sources—not more models reading the same flawed trace.",
              answerBn:
                "না। Apple-এর ৯-জাজের গবেষণায় দেখা গেছে, ৭টি ভিন্ন মডেল পরিবারের জাজদের ভেতরেও একই ধরনের ভুলের প্রবণতা (error correlation) থাকায় পুরো প্যানেলটি কার্যত মাত্র ২টি স্বাধীন ভোটের সমান কাজ করে। সত্যিকারের স্বাধীনতা আসে নতুন প্রমাণ (যেমন লেজার স্টেট, কোড এক্সিকিউশন বা মানব বিশেষজ্ঞ) থেকে—একই ত্রুটিপূর্ণ ট্রেস আরও বেশি মডেলকে পড়ালে নয়।",
              ref: "p. 121",
            },
            {
              questionEn: "If a safety test runs 100 times with 0 failures, does that prove a 0% failure rate?",
              questionBn: "একটি সেফটি টেস্ট ১০০ বার চালিয়ে ০টি ব্যর্থতা পাওয়া গেলে তা কি ০% ঝুঁকি প্রমাণ করে?",
              answerEn:
                "No. Under independent Bernoulli trials, 0 failures in n = 100 runs still leaves a one-sided 95% upper confidence bound of 1 − 0.05^(1/100) ≈ 2.95% (and real agent runs are clustered, making the bound even looser). Catastrophic actions must be prevented structurally at the capability boundary, with tests used to verify that the structural control fires.",
              answerBn:
                "না। স্বাধীন ট্রায়াল ধরলেও n = 100 বারে ০টি ব্যর্থতা থাকলে প্রকৃত ব্যর্থতার হারের ৯৫% উচ্চসীমা থাকে 1 − 0.05^(1/100) ≈ ২.৯৫%। তাই মারাত্মক বা অপরিবর্তনীয় কাজের ক্ষেত্রে কেবল টেস্টের সংখ্যার ওপর নির্ভর না করে ক্যাপাবিলিটি সীমানায় কাঠামোগত প্রতিরোধ (structural prevention) বসাতে হয়।",
              ref: "pp. 122–123",
            },
            {
              questionEn: "Why did the team fix the worked-case failure by splitting the tool capability instead of improving the reviewer prompt?",
              questionBn: "পৃষ্ঠা 132-এর worked case-এ টিমটি কেন reviewer-এর প্রম্পট উন্নত না করে টুল ক্যাপাবিলিটি দুই ভাগে ভাগ করল?",
              answerEn:
                "Because a model reviewer is a fallible sensor, not an authorization boundary, and `resolve_refund_status` with an optional mode was semantically ambiguous. Splitting the tool into read-only `refund.lookup` and withheld `refund.create` makes unauthorized refunds impossible by construction.",
              answerBn:
                "কারণ একটি মডেল রিভিউয়ার কেবল একটি ত্রুটিপূর্ণ সেন্সর, কোনো অনুমোদন সীমানা (authorization boundary) নয়; আর `resolve_refund_status` টুলটি নিজেই দ্ব্যর্থবোধক ছিল। টুলটিকে read-only `refund.lookup` এবং সংরক্ষিত `refund.create`-এ ভাগ করায় তদন্তকারী এজেন্টের পক্ষে ভুল করেও রিফান্ড তৈরি করা কাঠামোগতভাবে অসম্ভব হয়ে যায়।",
              ref: "p. 132",
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
    {
      id: "hp.04.knowing-when-to-continue-wait-or-stop",
      titleEn: "Knowing When to Continue, Wait, or Stop",
      titleBn: "কখন চালিয়ে যাবে, অপেক্ষা করবে, না থামবে",
      slug: "harness-04-knowing-when-to-continue-wait-or-stop",
      trackId: "ai-engineering",
      estimatedMinutes: 35,
    },
    {
      id: "hp.20.reliable-agent-skills",
      titleEn: "Turning Procedures into Reliable Agent Skills",
      titleBn: "Procedure থেকে নির্ভরযোগ্য agent skill",
      slug: "harness-20-turning-procedures-into-reliable-agent-skills",
      trackId: "ai-engineering",
      estimatedMinutes: 35,
    },
  ],
};
