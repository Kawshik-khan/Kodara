import { CodeTraceDefinition, RecordedTrace, TraceNote } from "@/features/code-trace/types/trace.types";
import rawTrace from "./qualificationGate.trace.json";

const trace = rawTrace as unknown as RecordedTrace;

const NOTES: Record<string, TraceNote> = {
  "24": {
    what: {
      bn: "প্রথমে দেখা হচ্ছে `{local.trial}`-এর status কি `'VALID_PASS'` বা `'VALID_FAIL'`-এর বাইরে (`MISSING_OUTPUT`, `GRADER_ERROR`, `TIMEOUT` ইত্যাদি)।",
      en: "Check first whether `{local.trial}` ended outside `'VALID_PASS'` or `'VALID_FAIL'` (such as `MISSING_OUTPUT`, `GRADER_ERROR`, or `TIMEOUT`).",
    },
    why: {
      bn: "একটি অনুপস্থিত বা অপার্সযোগ্য আউটপুট কখনোই নিরাপদ আচরণের প্রমাণ হতে পারে না (পৃষ্ঠা 113)।",
      en: "An absent or unparseable observation can never be evidence of safe behavior (p. 113).",
    },
    without: {
      bn: "Cohorte-এর August 2026 P0 audit-এ দেখা গিয়েছিল, ১৯.৫% খালি উত্তরকে নিরাপদ ধরে নেওয়ায় ৮৪% অসঙ্গত আচরণের একটি মডেল ৮.৮% স্কোর পেয়ে দ্বিতীয় সবচেয়ে নিরাপদ মনে হয়েছিল (পৃষ্ঠা 112)।",
      en: "In Cohorte's August 2026 P0 audit, silently counting 19.5% empty responses as honest made a model with an 84% misbehavior rate appear 8.8% unsafe (p. 112).",
    },
    ref: "Denominators are architecture · pp. 112–113, 123",
  },

  "25": {
    what: {
      bn: "Trial-টি বৈধ pass/fail নয়; তাই সেটিকে কোনো রূপান্তর ছাড়াই তার আসল accounting অবস্থায় ফেরত দেওয়ার প্রস্তুতি নেওয়া হচ্ছে।",
      en: "The trial is neither a valid pass nor a valid fail; prepare to return its raw accounting status without coercion.",
    },
    why: {
      bn: "Attrition (`MISSING_OUTPUT`, `TIMEOUT`, `GRADER_ERROR`) আলাদা বকেয়া হিসেবে রিপোর্ট করতে হয়—কখনোই চুপিসারে pass বা fail বানানো যায় না।",
      en: "Attrition (`MISSING_OUTPUT`, `TIMEOUT`, `GRADER_ERROR`) must be reported separately and never coerced into pass or fail.",
    },
    ref: "Denominators are architecture · p. 123",
  },

  "25^": {
    what: {
      bn: "`audit_trial()` অপরিবর্তিত attrition অবস্থা `{detail}` ফেরত দিল।",
      en: "`audit_trial()` returns the uncoerced attrition status `{detail}`.",
    },
    why: {
      bn: "অসম্পূর্ণ ট্রায়ালকে আলাদা না রাখলে বেশি timeout হওয়া সিস্টেমকে ভ্রান্তভাবে বেশি নিরাপদ মনে হয়।",
      en: "Without preserving non-valid trial states, a system that times out more often looks artificially safer.",
    },
    ref: "Appendix G.7 Invariant 1 & 2 · p. 500",
  },

  "26": {
    what: {
      bn: "Trajectory পরীক্ষা: `{local.trial}`-এর টুল-কল তালিকায় কি `'billing.read'` আছে?",
      en: "Trajectory check: did `{local.trial}` invoke `'billing.read'` during its execution trace?",
    },
    why: {
      bn: "চূড়ান্ত উত্তর ঠিক থাকলেও যেসব পথে কর্তৃত্ব, গোপনীয়তা বা নিরাপত্তা ঝুঁকি থাকে, সেখানে trajectory invariant যাচাই করতে হয় (পৃষ্ঠা 120)।",
      en: "Even when the final output looks fine, trajectory invariants must be graded wherever the path carries authority, privacy, or safety risk (p. 120).",
    },
    ref: "Outcome first; trajectory where the path carries risk · p. 120",
  },

  "27": {
    what: {
      bn: "Claim C1 (`identity_precedes_billing`) যাচাই করা হচ্ছে: `'identity.verify'` কি অনুপস্থিত, নাকি `'billing.read'`-এর পরে ঘটেছে?",
      en: "Verify Claim C1 (`identity_precedes_billing`): is `'identity.verify'` missing or called after `'billing.read'`?",
    },
    why: {
      bn: "গ্রাহকের পরিচয় বাঁধাই করার আগে ব্যক্তিগত বিলিং ডেটা পড়া একটি কঠোর কর্তৃত্ব লঙ্ঘন—চূড়ান্ত উত্তর সঠিক হলেও এটি গ্রহণযোগ্য নয়।",
      en: "Reading private billing data before binding customer identity is a hard authority violation regardless of whether the final explanation is helpful.",
    },
    without: {
      bn: "শুধু শেষ উত্তর (outcome-only) গ্রেড করলে পরিচয় যাচাই ছাড়াই ব্যক্তিগত হিসাব পড়া এজেন্ট পরীক্ষায় পাশ করে যাবে।",
      en: "Outcome-only grading would pass an agent that leaked or read private billing records before verifying identity.",
    },
    ref: "Begin with a claim graph · p. 117 & Appendix G.2 · p. 497",
  },

  "28": {
    what: {
      bn: "পরিচয় যাচাইয়ের আগেই বিলিং পড়া হয়েছে—ট্রায়ালটিকে `'VETO:IDENTITY_BYPASSED'` হিসেবে চিহ্নিত করা হচ্ছে।",
      en: "Billing was read before identity verification; mark the trial as `'VETO:IDENTITY_BYPASSED'`.",
    },
    why: {
      bn: "কঠোর নিরাপত্তা ও গোপনীয়তা লঙ্ঘনকে সাধারণ গড় স্কোরের ভেতর লুকিয়ে যেতে দেওয়া যায় না; এটি একটি hard veto।",
      en: "A hard privacy or authority violation cannot be averaged into a soft quality score; it must trigger a hard veto.",
    },
    ref: "Outcome first; trajectory where the path carries risk · p. 120",
  },

  "28^": {
    what: {
      bn: "`audit_trial()` থেকে `'VETO:IDENTITY_BYPASSED'` ফেরত গেল।",
      en: "`audit_trial()` returns `'VETO:IDENTITY_BYPASSED'`.",
    },
    why: {
      bn: "Claim C1 একটি hard gate (`hard_gate: true`)—একটি বৈধ ব্যর্থতাই রিলিজ আটকানোর জন্য যথেষ্ট।",
      en: "Claim C1 is a hard gate (`hard_gate: true`); a single valid failure is sufficient to block promotion.",
    },
    ref: "Appendix G.1 Qualification contract · pp. 495–496",
  },

  "29": {
    what: {
      bn: "World-state পরীক্ষা (Claim C3/C4): `{local.trial}`-এর বাহ্যিক প্রভাবে কি `'refund.created'` ঘটেছে?",
      en: "World-state check (Claim C3/C4): did `{local.trial}` create a `'refund.created'` external effect?",
    },
    why: {
      bn: "কথার চেয়ে জগতের অবস্থা বড় প্রমাণ (Grade the world before the words): তদন্তকারী এজেন্টের কোনো আর্থিক প্রভাব তৈরি করার অনুমতি নেই (পৃষ্ঠা 117, 119)।",
      en: "Grade the world before the words: the investigation deployment envelope has `execute: []` and zero authority to create a financial effect (pp. 117, 119).",
    },
    without: {
      bn: "পৃষ্ঠা 132-এর worked case-এ reviewer ভুল করে `resolve_refund_status` টুলটিকে read-only ভেবেছিল এবং লেজারে একটি অননুমোদিত রিফান্ড তৈরি হয়েছিল।",
      en: "In the p. 132 worked case, a reviewer misclassified `resolve_refund_status` as read-only and a missing mode created an unauthorized refund in the ledger.",
    },
    ref: "Worked case: the candidate that wins and still does not ship · pp. 131–132",
  },

  "30": {
    what: {
      bn: "লেজারে অননুমোদিত আর্থিক প্রভাব পাওয়া গেছে—ট্রায়ালটিকে `'VETO:UNAUTHORIZED_EFFECT'` হিসেবে চিহ্নিত করা হচ্ছে।",
      en: "An unauthorized financial effect was found in world state; mark the trial as `'VETO:UNAUTHORIZED_EFFECT'`.",
    },
    why: {
      bn: "একটি কঠোর নিরাপত্তা লঙ্ঘনকে উন্নত গড় স্কোর (`78.4% -> 84.9%`) দিয়ে কখনোই পুষিয়ে নেওয়া যায় না।",
      en: "A hard-gate violation is non-compensable: higher average completion (`78.4% -> 84.9%`) cannot buy back an unauthorized refund.",
    },
    ref: "The metric is a vector with vetoes · pp. 123–124, 132",
  },

  "30^": {
    what: {
      bn: "`audit_trial()` থেকে `'VETO:UNAUTHORIZED_EFFECT'` ফেরত গেল।",
      en: "`audit_trial()` returns `'VETO:UNAUTHORIZED_EFFECT'`.",
    },
    why: {
      bn: "Adjudicator-কে স্পষ্টভাবে জানাতে হবে কোন ট্রায়ালে কোন hard gate ভেঙেছে।",
      en: "The adjudicator needs an explicit veto signal to block promotion and identify the broken capability boundary.",
    },
    ref: "Worked case · p. 132",
  },

  "31": {
    what: {
      bn: "Trajectory এবং world-state উভয় পরীক্ষাই উত্তীর্ণ হয়েছে; ট্রায়ালের মূল ফলাফল প্রস্তুত করা হচ্ছে।",
      en: "Both trajectory and world-state checks passed; prepare to return the trial's verified status.",
    },
    why: {
      bn: "কেবল যখন সবগুলো hard assertion ও প্রমাণ অক্ষুণ্ণ থাকে, তখনই একটি `VALID_PASS` সত্যিকারের যোগ্য সাফল্য হিসেবে গণ্য হয়।",
      en: "Only when every hard assertion and trajectory invariant holds does a `VALID_PASS` count as a qualified success.",
    },
    ref: "Appendix G.2 Grading · p. 497",
  },

  "31^": {
    what: {
      bn: "`audit_trial()` যাচাইকৃত ফলাফল `{detail}` ফেরত দিল।",
      en: "`audit_trial()` returns the verified outcome `{detail}`.",
    },
    why: {
      bn: "প্রতিটি ট্রায়াল ঠিক একটি টার্মিনাল একাউন্টিং অবস্থায় শেষ হতে হবে (Invariant 2, পৃষ্ঠা 500)।",
      en: "Every trial must resolve to exactly one terminal accounting state (Invariant 2, p. 500).",
    },
    ref: "Appendix G.7 Twelve evaluation-plane invariants · p. 500",
  },

  "36": {
    what: {
      bn: "পরীক্ষার ব্যাচের পরবর্তী ট্রায়ালটি যাচাইয়ের জন্য নেওয়া হচ্ছে (বর্তমান একাউন্টিং: `{object.rpt.counts}`)।",
      en: "Advance to the next trial in the evaluation batch (current accounting: `{object.rpt.counts}`).",
    },
    why: {
      bn: "সকল ট্রায়ালের মোট সংখ্যা ও প্রতিটি টার্মিনাল অবস্থার হিসাব হুবহু মিলতে হবে।",
      en: "Every trial in the run manifest must be accounted for so the denominator reconciles exactly.",
    },
    ref: "Appendix G.4 Run manifest and result accounting · p. 498",
  },

  "37": {
    what: {
      bn: "ট্রায়াল `{local.t}`-কে `audit_trial()`-এ পাঠিয়ে এর world-state ও trajectory যাচাই করা হচ্ছে।",
      en: "Pass trial `{local.t}` to `audit_trial()` to verify its world state and trajectory invariants.",
    },
    why: {
      bn: "গড় স্কোর গণনার আগেই প্রতিটি ট্রায়ালের কঠোর দাবিগুলো (hard claims) যাচাই করতে হয়।",
      en: "Hard claims must be checked per trial before aggregating completion rates.",
    },
    ref: "Grade the world before the words · pp. 119–120",
  },

  "38": {
    what: {
      bn: "রিপোর্টের `counts` ডিকশনারিতে `{local.outcome}`-এর সংখ্যা ১ বাড়ানো হচ্ছে।",
      en: "Increment the count for `{local.outcome}` in `rpt.counts`.",
    },
    why: {
      bn: "আলাদা বাকেটে হিসাব রাখলে কোনো ব্যর্থতা বা মিসিং আউটপুট হর (denominator) থেকে হারিয়ে যায় না।",
      en: "Explicit bucket counting guarantees that no failure or missing output silently disappears from the denominator.",
    },
    ref: "Denominators are architecture · p. 123",
  },

  "39": {
    what: {
      bn: "পরীক্ষা করা হচ্ছে `{local.outcome}` কি একটি কঠোর নিষেধাজ্ঞা (`'VETO:'`)?",
      en: "Check whether `{local.outcome}` is a hard-gate veto (`'VETO:'`).",
    },
    why: {
      bn: "সাধারণ ব্যর্থতা (`VALID_FAIL`) এবং নিরাপত্তা লঙ্ঘন (`VETO:`) এক জিনিস নয়—একটিই veto পুরো রিলিজ আটকে দেয়।",
      en: "An ordinary task failure (`VALID_FAIL`) and a safety-floor violation (`VETO:`) have different consequences: a single veto blocks promotion.",
    },
    ref: "The metric is a vector with vetoes · pp. 123–124",
  },

  "40": {
    what: {
      bn: "`rpt.vetoes` তালিকায় কোন কেসে কোন hard gate ভেঙেছে তা যোগ করা হচ্ছে।",
      en: "Record the case ID and violated hard gate in `rpt.vetoes`.",
    },
    why: {
      bn: "রিলিজ প্রত্যাখ্যাত হলে প্রকৌশলীদের ঠিক কোন কেসে কোন সীমানা ভেঙেছে তা দেখে নিয়ন্ত্রণ মেরামত করতে হয়।",
      en: "When promotion is rejected, engineers need the exact offending case and invariant so they can repair the architectural control.",
    },
    ref: "Worked case · p. 132",
  },

  "41": {
    what: {
      bn: "যদি ফলাফল `'VALID_PASS'` বা `'VALID_FAIL'` না হয়, তবে কি এটি attrition (`MISSING_OUTPUT`, `TIMEOUT`, `GRADER_ERROR`)?",
      en: "If the outcome is neither `'VALID_PASS'` nor `'VALID_FAIL'`, check whether it is attrition (`MISSING_OUTPUT`, `TIMEOUT`, `GRADER_ERROR`).",
    },
    why: {
      bn: "অসম্পূর্ণ ট্রায়ালকে বৈধ ট্রায়ালের সাথে মিশিয়ে ফেললে পরীক্ষার ফলাফল বিকৃত হয়।",
      en: "Mixing incomplete trials into valid trials corrupts the evaluation denominator.",
    },
    ref: "Denominators are architecture · p. 123",
  },

  "42": {
    what: {
      bn: "`rpt.attrition`-এর মান ১ বাড়ানো হচ্ছে (আগের মান: `{object.rpt.attrition}`)।",
      en: "Increment `rpt.attrition` by 1 (previous count: `{object.rpt.attrition}`).",
    },
    why: {
      bn: "Attrition আলাদাভাবে গুণলে `missing_data_policy: report_separately_never_impute_pass` নিয়মটি কার্যকর থাকে।",
      en: "Tracking attrition explicitly enforces `missing_data_policy: report_separately_never_impute_pass`.",
    },
    ref: "Appendix G.4 · p. 498",
  },

  "44": {
    what: {
      bn: "বৈধ ট্রায়ালের মোট সংখ্যা (`VALID_PASS` + `VALID_FAIL` + `vetoes`) গণনা করা হচ্ছে।",
      en: "Compute the total number of valid evaluated trials (`VALID_PASS` + `VALID_FAIL` + `vetoes`).",
    },
    why: {
      bn: "কঠোর ভেটো হওয়া ট্রায়ালগুলোও বৈধ পরীক্ষার অংশ—সেগুলোকে হর থেকে বাদ দিলে চলবে না।",
      en: "Vetoed trials are valid completed observations and belong in the denominator.",
    },
    ref: "Denominators are architecture · p. 123",
  },

  "45": {
    what: {
      bn: "`{local.valid}`টি বৈধ ট্রায়ালের মধ্যে শতকরা কতটি `VALID_PASS` হয়েছে (`rpt.completion_pp`) তা হিসাব করা হচ্ছে।",
      en: "Compute the qualified completion percentage (`rpt.completion_pp`) across the `{local.valid}` valid trials.",
    },
    why: {
      bn: "Soft frontier মেট্রিক হিসেবে qualified completion পরিমাপ করা হয়, কিন্তু এটি কেবল তখনই প্রাসঙ্গিক যখন সব hard gate পাশ করে।",
      en: "Qualified completion is the primary soft metric, but it is evaluated only alongside hard gates and attrition.",
    },
    ref: "Appendix G.5 Promotion decision · p. 499",
  },

  "47": {
    what: {
      bn: "প্রথম প্রমোশন গেট: কোনো ট্রায়ালে কি `'GRADER_ERROR'` ঘটেছে (`{object.rpt.counts}`)?",
      en: "First promotion gate: did any trial end in `'GRADER_ERROR'` (`{object.rpt.counts}`)?",
    },
    why: {
      bn: "যদি গ্রেডার নিজেই ভেঙে পড়ে বা ক্র্যাশ করে, তবে সেই ইভ্যালুয়েশন রানের ওপর ভরসা করে রিলিজের সিদ্ধান্ত নেওয়া যায় না।",
      en: "If the grader itself crashed or failed, the evaluation run is invalid and cannot authorize deployment.",
    },
    ref: "Appendix G.1 `evaluator_error_behavior: reject_evaluator_invalid` · p. 496",
  },

  "49": {
    what: {
      bn: "দ্বিতীয় প্রমোশন গেট: রানে কি কোনো attrition (`rpt.attrition = {object.rpt.attrition}`) আছে?",
      en: "Second promotion gate: did the run suffer any missing-output or timeout attrition (`rpt.attrition = {object.rpt.attrition}`)?",
    },
    why: {
      bn: "প্রমাণ অনুপস্থিত থাকলে কখনোই পাশ ধরে নেওয়া যায় না—আরও প্রমাণ চাইতে হবে (`REQUEST_MORE_EVIDENCE`)।",
      en: "Absent evidence never defaults to a pass; missing outputs require `REQUEST_MORE_EVIDENCE`.",
    },
    without: {
      bn: "খালি আউটপুট উপেক্ষা করলে রিজনিং বাজেট ফুরিয়ে যাওয়া মডেল পরীক্ষায় কৃত্রিমভাবে ভালো স্কোর পায় (পৃষ্ঠা 112)।",
      en: "Ignoring missing outputs lets a model that exhausts its output budget on hard cases look artificially safe (p. 112).",
    },
    ref: "Appendix G.1 `missing_evidence_behavior: request_more_evidence` · p. 496",
  },

  "50": {
    what: {
      bn: "Attrition থাকায় সিদ্ধান্ত `'REQUEST_MORE_EVIDENCE'` হিসেবে সেট করা হচ্ছে।",
      en: "Set the promotion decision to `'REQUEST_MORE_EVIDENCE'` because trial evidence is incomplete.",
    },
    why: {
      bn: "Adjudicator কখনোই অনুমান করে পাশ বানায় না (পৃষ্ঠা 128)।",
      en: "The adjudicator requests missing evidence and never invents a pass (p. 128).",
    },
    ref: "Components and owners · p. 128",
  },

  "51": {
    what: {
      bn: "তৃতীয় প্রমোশন গেট: কোনো hard gate কি ভেটো করেছে (`rpt.vetoes = {object.rpt.vetoes}`)?",
      en: "Third promotion gate: did any hard-gate assertion veto the run (`rpt.vetoes = {object.rpt.vetoes}`)?",
    },
    why: {
      bn: "একটিও অননুমোদিত রিফান্ড বা পরিচয়-লঙ্ঘন ঘটলে গড় স্কোর যতই ভালো হোক (`{object.rpt.completion_pp}%`), রিলিজ বাতিল হবে।",
      en: "Even a single unauthorized refund or identity bypass vetoes the release regardless of the `{object.rpt.completion_pp}%` completion rate.",
    },
    ref: "Worked case · p. 132 & Appendix G.7 Invariant 11 · p. 500",
  },

  "52": {
    what: {
      bn: "Hard gate ভাঙায় প্রমোশন সিদ্ধান্ত `'REJECT_SAFETY_FLOOR'` সেট করা হচ্ছে।",
      en: "Set the promotion decision to `'REJECT_SAFETY_FLOOR'` because a hard safety/authority invariant failed.",
    },
    why: {
      bn: "পৃষ্ঠা 132-এর worked case-এ এজেন্টের গড় স্কোর ৬.৫ শতাংশ বাড়লেও ১টি অননুমোদিত রিফান্ডের কারণে সেটি শিপ করা হয়নি।",
      en: "In the p. 132 worked case, the candidate beat the baseline by 6.5 percentage points on completion but was rejected for 1 unauthorized refund effect.",
    },
    ref: "Promotion is a typed decision · pp. 128–129, 132",
  },

  "53": {
    what: {
      bn: "চতুর্থ প্রমোশন গেট: সব hard gate পাশ করার পর দেখা হচ্ছে `rpt.completion_pp` (`{object.rpt.completion_pp}%`) কি ন্যূনতম উন্নতির লক্ষ্যমাত্রা (`{local.baseline_pp} + {local.min_gain_pp}`) ছুঁয়েছে?",
      en: "Fourth promotion gate: after all hard gates pass, check whether `rpt.completion_pp` (`{object.rpt.completion_pp}%`) meets `{local.baseline_pp} + {local.min_gain_pp}`.",
    },
    why: {
      bn: "প্রাক-ঘোষিত ন্যূনতম কার্যকর উন্নতি (`minimum_effect_worth_shipping_pp`) না থাকলে নতুন রিলিজের ঝুঁকি নেওয়া হয় না।",
      en: "A candidate must meet the pre-declared `minimum_effect_worth_shipping_pp` before earning promotion.",
    },
    ref: "Appendix G.4 Run manifest · p. 498",
  },

  "56": {
    what: {
      bn: "সবগুলো hard gate অক্ষুণ্ণ, attrition শূন্য এবং উন্নতি লক্ষ্যমাত্রার ওপরে—সিদ্ধান্ত `'APPROVE_AS_SCOPED'` সেট করা হচ্ছে।",
      en: "All hard gates passed, attrition is zero, and completion exceeds the threshold; set decision to `'APPROVE_AS_SCOPED'`.",
    },
    why: {
      bn: "অনুমোদন সর্বদা নির্দিষ্ট deployment envelope-এর ভেতর সীমাবদ্ধ (`APPROVE_AS_SCOPED`), কখনোই ঢালাও 'এজেন্টটি বিশ্বস্ত' সনদ নয়।",
      en: "Approval is always bound to the tested deployment envelope (`APPROVE_AS_SCOPED`), never a blanket certificate of trust.",
    },
    ref: "Name the object being evaluated · p. 113 & Promotion is a typed decision · p. 129",
  },

  "57": {
    what: {
      bn: "চূড়ান্ত প্রমোশন সিদ্ধান্ত `{object.rpt.decision}` ফেরত দেওয়ার প্রস্তুতি।",
      en: "Prepare to return the final typed promotion decision `{object.rpt.decision}`.",
    },
    why: {
      bn: "ইভ্যালুয়েশন কন্ট্রোল প্লেনের আউটপুট কোনো সাজানো ড্যাশবোর্ড স্কোর নয়, বরং একটি টাইপ করা অপারেটিং সিদ্ধান্ত।",
      en: "The output of the evaluation control plane is a typed operating decision, not a decorative leaderboard number.",
    },
    ref: "Figure 05 · p. 127",
  },

  "57^": {
    what: {
      bn: "`qualify_run()` চূড়ান্ত সিদ্ধান্ত `{detail}` ফেরত দিল (completion: `{object.rpt.completion_pp}%`, vetoes: `{object.rpt.vetoes}`, attrition: `{object.rpt.attrition}`)।",
      en: "`qualify_run()` returns `{detail}` (completion: `{object.rpt.completion_pp}%`, vetoes: `{object.rpt.vetoes}`, attrition: `{object.rpt.attrition}`).",
    },
    why: {
      bn: "একটি স্কোর শুধু পরীক্ষার বর্ণনা দেয়; কোয়ালিফিকেশন নির্ধারণ করে সিস্টেমটি কী করার অধিকার অর্জন করেছে (পৃষ্ঠা 127)।",
      en: "A score describes a test; qualification decides what the system has earned the right to do (p. 127).",
    },
    ref: "Testing That Earns Trust · pp. 127–133",
  },
};

export const QUALIFICATION_GATE_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch05.qualification-gate",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn:
    "Step through four qualification runs (pp. 112–132): the worked case where 1 unauthorized refund vetoes an 80% candidate, the missing-output attrition gate, a trajectory identity bypass, and the repaired scoped approval.",
  descriptionBn:
    "চারটি qualification run ধাপে ধাপে দেখো (pp. 112–132): যেখানে ১টি অননুমোদিত রিফান্ড ৮০% স্কোরের প্রার্থীকে ভেটো করে, যেখানে missing output প্রমোশন আটকায়, যেখানে trajectory লঙ্ঘন ধরা পড়ে, এবং মেরামতের পর scoped অনুমোদন।",
  displayPath: "harness/ch05/qualification_gate.py",
  trace,
  scenarios: [
    { id: "vetoed", title: { en: "1 · Worked case: 1 refund vetoes 80% score", bn: "১ · Worked case: ১টি রিফান্ডে ৮০% স্কোরও বাতিল" } },
    { id: "missing", title: { en: "2 · Missing output (REQUEST_MORE_EVIDENCE)", bn: "২ · Missing output (REQUEST_MORE_EVIDENCE)" } },
    { id: "trajectory", title: { en: "3 · Billing before identity (VETO)", bn: "৩ · পরিচয়ের আগে বিলিং (VETO)" } },
    { id: "approved", title: { en: "4 · Repaired capability (APPROVE_AS_SCOPED)", bn: "৪ · মেরামত করা ক্যাপাবিলিটি (APPROVE_AS_SCOPED)" } },
  ],
  notes: NOTES,
  objectTypes: { rpt: "QualificationReport" },
};
