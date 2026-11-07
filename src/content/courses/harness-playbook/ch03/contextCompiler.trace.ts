import {
  CodeTraceDefinition,
  RecordedTrace,
  TraceNote,
} from "@/features/code-trace/types/trace.types";
import traceJson from "./contextCompiler.trace.json";

// Recorded by courses/harness-playbook/tools/record_trace.py; JSON widens the event unions.
const trace = traceJson as unknown as RecordedTrace;

/**
 * Notes for every traced line of harness/ch03/context_compiler.py.
 * Keys: line number, "!" for exception events, "^" for return events.
 * Re-check line numbers whenever the trace is re-recorded.
 */
const NOTES: Record<string, TraceNote> = {
  // compile_briefing: candidate inspection and admission
  "36": {
    what: {
      bn: "Candidate pool-এর পরের unit পরীক্ষা করা হচ্ছে (বা সব শেষ হলে পরের ধাপে যাওয়া)।",
      en: "Inspect the next candidate unit from the pool (or move on when all candidates are checked).",
    },
    why: {
      bn: "Retrieval শুধু সম্ভাব্য তথ্য আনে; কোনটা এই সিদ্ধান্তে ব্যবহার করা যাবে, তা ঠিক করে compiler।",
      en: "Retrieval only finds candidates; the compiler decides what this invocation may rely upon.",
    },
    ref: "Retrieval is not admission · pp. 76, 78",
  },
  "37": {
    what: {
      bn: "Unit `{local.unit}` কি `untrusted_data` zone-এর?",
      en: "Is unit `{local.unit}` in the `untrusted_data` zone?",
    },
    why: {
      bn: "Customer-এর ফাইল বা বার্তা অভিযোগের প্রমাণ হতে পারে, কিন্তু নির্দেশনা (instruction) বা নীতি হতে পারে না।",
      en: "A customer upload can be evidence of a complaint, but never an instruction or an authoritative policy.",
    },
    ref: "Context is a security boundary · pp. 77, 83",
  },
  "38": {
    what: {
      bn: "`pkg.untrusted_data`-তে unit যোগ হলো: শুধু data হিসেবে আলাদা রাখা হবে।",
      en: "Added to `pkg.untrusted_data`: kept structurally separated as data-only.",
    },
    why: {
      bn: "Attachment-এর ভেতরে লেখা \"ignore policy\" কখনো instruction zone-এ ঢুকতে বা policy obligation পূরণ করতে পারবে না।",
      en: "Text like \"ignore policy\" inside an attachment can never enter the instruction zone or satisfy a policy obligation.",
    },
    without: {
      bn: "আলাদা না রাখলে indirect prompt injection মডেলের আচরণ ঘুরিয়ে দিতে পারে।",
      en: "Without structural separation, indirect prompt injection can redirect the model.",
    },
    ref: "Customer Resolution Agent build · p. 89",
  },
  "39": {
    what: {
      bn: "এই unit-এর কাজ শেষ; পরের candidate-এ যাওয়া হচ্ছে।",
      en: "Done with this untrusted unit; continue to the next candidate.",
    },
    why: {
      bn: "Data-only unit কখনো identity, settlement বা policy-র authoritative প্রমাণ হতে পারে না।",
      en: "A data-only unit cannot satisfy authority-bearing obligations like identity, settlement or policy.",
    },
    ref: "p. 83",
  },
  "40": {
    what: {
      bn: "Obligation নিয়ম পড়া হচ্ছে: অনুমোদিত source আর সর্বোচ্চ অনুমোদিত বয়স (`max_age`)।",
      en: "Look up the obligation rule: permitted authoritative sources and maximum allowed age (`max_age`).",
    },
    why: {
      bn: "প্রতিটা প্রমাণের নিজস্ব source এবং সময়ের শর্ত থাকে; সব তথ্যের জন্য এক নিয়ম চলে না।",
      en: "Each required claim names which source classes may establish it and how fresh it must be.",
    },
    ref: "Pass 2: Derive evidence obligations · p. 81",
  },
  "41": {
    what: {
      bn: "`{local.unit}`-এর source কি অনুমোদিত `{local.sources}` তালিকায় আছে?",
      en: "Is `{local.unit}`'s source in the permitted `{local.sources}` set?",
    },
    why: {
      bn: "কাছাকাছি দেখতে (similar) মানেই বিশ্বাসযোগ্য না। পুরোনো সমাধান হওয়া টিকেট কখনো বর্তমান নীতি (policy) হতে পারে না।",
      en: "\"Similar\" is not a synonym for \"authoritative\". A resolved ticket is an example, not active policy.",
    },
    ref: "Pass 6: Check admissibility · pp. 82–83",
  },
  "42": {
    what: {
      bn: "বাতিল (`not_authoritative`): এই source এই দাবির প্রমাণ দিতে পারে না।",
      en: "Rejected (`not_authoritative`): this source has no authority to establish the claim.",
    },
    why: {
      bn: "`crm_search` পরিচয়ের চূড়ান্ত প্রমাণ না, আর `case_archive` নীতি নির্ধারণ করে না। কেন বাদ গেল তাও manifest-এ লেখা থাকছে।",
      en: "`crm_search` cannot bind identity and `case_archive` cannot establish refund policy. The rejection reason is recorded.",
    },
    without: {
      bn: "শুধু similarity দেখে নিলে মডেল পুরোনো এক ব্যতিক্রমকে সাধারণ নিয়ম ভেবে বসত।",
      en: "Ranking by similarity alone would let the model treat a past exception as general policy.",
    },
    ref: "pp. 81, 89",
  },
  "43": {
    what: {
      bn: "Unit-এর বয়স কি অনুমোদিত সীমা (`{local.max_age}` সেকেন্ড) ছাড়িয়ে গেছে?",
      en: "Does the unit's age exceed the claim's freshness limit (`{local.max_age}` seconds)?",
    },
    why: {
      bn: "\"পাঁচ সেকেন্ড আগে আনা\" আর \"এখনো বৈধ\" এক কথা না। মেয়াদোত্তীর্ণ নীতি দিয়ে আজকের refund অনুমোদন করা যায় না।",
      en: "\"Retrieved recently\" is not \"valid now\". A policy past its allowed age cannot authorize today's decision.",
    },
    ref: "Freshness requires two clocks · p. 86",
  },
  "44": {
    what: {
      bn: "বাতিল (`stale_evidence`): `policy-v31`-এর বয়স 2820s, সীমা 600s।",
      en: "Rejected (`stale_evidence`): `policy-v31` is 2820s old, above the 600s limit.",
    },
    why: {
      bn: "পুরোনো নীতি চুপচাপ prompt-এ ঢুকিয়ে দিলে মডেল মেয়াদোত্তীর্ণ নিয়ম মেনে ভুল সিদ্ধান্ত নেবে।",
      en: "Silently admitting an expired policy invites the model to act under outdated rules.",
    },
    ref: "pp. 86, 89",
  },
  "46": {
    what: {
      bn: "সব শর্ত পূরণ হয়েছে: `pkg.admitted`-এ unit যোগ হলো।",
      en: "All conjunction checks passed: the unit is admitted into `pkg.admitted`.",
    },
    why: {
      bn: "Admissibility একটি conjunction: অনুমোদিত source এবং সঠিক বয়স দুটোই মিলেছে।",
      en: "Admission is a conjunction: both source authority and claim-specific freshness hold.",
    },
    ref: "Pass 6: Check admissibility · p. 82",
  },

  // compile_briefing: obligation completeness and conflict preservation
  "48": {
    what: {
      bn: "প্রতিটি প্রয়োজনীয় obligation (`identity`, `settlement`, `policy`) যাচাই করা হচ্ছে।",
      en: "Check each required obligation (`identity`, `settlement`, `policy`).",
    },
    why: {
      bn: "কোনো আবশ্যিক প্রমাণ বাদ থাকলে বা দুইটি authoritative source-এর মধ্যে বিরোধ থাকলে তা এখানেই ধরতে হবে।",
      en: "Missing required claims or disagreements between authoritative sources must be surfaced before packing.",
    },
    ref: "Pass 7: Preserve disagreement and absence · p. 83",
  },
  "49": {
    what: {
      bn: "`{local.claim}`-এর জন্য গৃহীত unit-গুলো পড়া হচ্ছে।",
      en: "Look up admitted units for `{local.claim}`.",
    },
    why: {
      bn: "একটা প্রমাণের জন্য শূন্য, এক বা একাধিক authoritative record থাকতে পারে।",
      en: "An obligation may have zero, one or multiple admitted authoritative records.",
    },
  },
  "50": {
    what: {
      bn: "`{local.claim}`-এর জন্য কি কোনো বৈধ unit পাওয়া যায়নি?",
      en: "Did `{local.claim}` end up with no admitted units?",
    },
    why: {
      bn: "প্রয়োজনীয় প্রমাণ ছাড়া মডেলকে অনুমান করতে বলা নিরাপদ না; build এখানেই থামাতে হবে।",
      en: "Never ask the model to improvise around missing or stale required evidence.",
    },
    ref: "A failed build is a legitimate output · p. 78",
  },
  "51": {
    what: {
      bn: "Diagnostic লেখা হলো: `{local.claim}` → `STALE_REQUIRED_EVIDENCE`।",
      en: "Record blocking diagnostic: `{local.claim}` → `STALE_REQUIRED_EVIDENCE`.",
    },
    why: {
      bn: "Diagnostic স্পষ্ট বলে কেন থামা হলো আর কার কাছে (policy adapter) সমাধান চাইতে হবে।",
      en: "The typed diagnostic names why the build stopped and which owner (the policy adapter) can refresh it.",
    },
    ref: "Diagnostic record · pp. 85, 484",
  },
  "52": {
    what: {
      bn: "`{local.claim}`-এ কি একাধিক authoritative unit (`{local.units}`) আছে?",
      en: "Are there multiple authoritative units (`{local.units}`) for `{local.claim}`?",
    },
    why: {
      bn: "`billing_ledger` বলছে দুটো চার্জ, আর `subscription_log` বলছে upgrade ও renewal। দুটোই নিজ নিজ ক্ষেত্রে সত্য।",
      en: "`billing_ledger` shows two charges while `subscription_log` shows an upgrade and renewal. Both are authoritative.",
    },
    ref: "Pass 7: Preserve disagreement · pp. 83, 89",
  },
  "53": {
    what: {
      bn: "`pkg.conflicts`-এ বিরোধপূর্ণ প্রমাণ দুটো একসাথে রাখা হলো: `{local.units}`।",
      en: "Preserve both records in `pkg.conflicts` as an explicit conflict set: `{local.units}`.",
    },
    why: {
      bn: "Summarizer দিয়ে বিরোধ ঢেকে ফেলা যাবে না; মডেল ও মানুষ দুজনকেই দেখতে হবে যে দুই উৎস আলাদা কথা বলছে।",
      en: "Never smooth disagreement into one fluent paragraph; keep the conflict visible for resolution.",
    },
    without: {
      bn: "বিরোধ লুকিয়ে ফেললে বৈধ চার্জকেও ভুল করে duplicate ভেবে refund দেওয়া হতে পারে।",
      en: "Erasing the conflict could cause a legitimate subscription upgrade charge to be refunded as a duplicate.",
    },
    ref: "pp. 83, 89",
  },
  "55": {
    what: {
      bn: "`pkg.diagnostics`-এ কি কোনো অমীমাংসিত বাধা আছে?",
      en: "Are there any blocking diagnostics in `pkg.diagnostics`?",
    },
    why: {
      bn: "একটিও আবশ্যিক প্রমাণ অসম্পূর্ণ বা মেয়াদোত্তীর্ণ থাকলে package `READY` হতে পারে না (Invariant I5)।",
      en: "A package with any blocking diagnostic cannot become `READY` (Invariant I5).",
    },
    ref: "Invariant I5 · pp. 85, 486",
  },
  "56": {
    what: {
      bn: "Build-এর অবস্থা `BLOCKED` করা হলো।",
      en: "Set package status to `BLOCKED`.",
    },
    why: {
      bn: "সুন্দর কিন্তু ভুল prompt বানানোর চেয়ে `BLOCKED` হয়ে policy refresh চাওয়া অনেক নিরাপদ।",
      en: "`BLOCKED` is safer and more useful than a fluent prompt that invites the model to guess.",
    },
    ref: "pp. 78, 85, 89",
  },
  "57": {
    what: {
      bn: "`return pkg.status`: প্রথম build `BLOCKED` অবস্থায় শেষ।",
      en: "`return pkg.status`: the build finishes as `BLOCKED`.",
    },
    why: {
      bn: "এখন policy adapter নতুন `policy-v32` আনবে, তারপর আবার compile হবে।",
      en: "Now the policy adapter fetches fresh `policy-v32` and triggers a rebuild.",
    },
  },
  "57^": {
    what: {
      bn: "`compile_briefing()` ফেরত দিল {detail}।",
      en: "`compile_briefing()` returns {detail}.",
    },
    why: {
      bn: "Objects panel দেখো: `diagnostics`-এ `STALE_REQUIRED_EVIDENCE`, আর `capabilities` খালি।",
      en: "Check the Objects panel: `diagnostics` holds `STALE_REQUIRED_EVIDENCE` and `capabilities` is empty.",
    },
  },
  "58": {
    what: {
      bn: "সব আবশ্যিক প্রমাণ বৈধ: `pkg.status` এখন `READY`।",
      en: "All required obligations are satisfied: `pkg.status` becomes `READY`.",
    },
    why: {
      bn: "নতুন `policy-v32` (বয়স 12s) গৃহীত হয়েছে, তাই এবার আর কোনো blocking diagnostic নেই।",
      en: "Fresh `policy-v32` (age 12s) was admitted, so no blocking diagnostics remain.",
    },
    ref: "Pass 10: Bind, emit, and watch invalidation · pp. 85, 89",
  },
  "59": {
    what: {
      bn: "`resolution_proposal` ধাপের জন্য শুধু `billing.preview_resolution` দেওয়া হলো; `commit_refund` বন্ধ রাখা হলো।",
      en: "Expose only `billing.preview_resolution` for the proposal phase; withhold `billing.commit_refund`.",
    },
    why: {
      bn: "Phase অনুযায়ী capability বদলায়, আর চার্জ দুটো সত্যিই duplicate কি না সেই বিরোধ এখনো মীমাংসিত হয়নি।",
      en: "The phase governs available capabilities, and the billing-vs-subscription conflict is still unresolved.",
    },
    ref: "p. 89",
  },
  "60": {
    what: {
      bn: "`return pkg.status`: প্রস্তুত package ফেরত দেওয়া হচ্ছে।",
      en: "`return pkg.status`: return the `READY` package.",
    },
    why: {
      bn: "Package-টি কেবল `case_version=41`-এর জন্য বৈধ; উৎস বা case বদলালে এটি সাথে সাথে বাতিল হবে।",
      en: "This package is bound to `case_version=41`; any change to its dependencies invalidates it.",
    },
  },
  "60^": {
    what: {
      bn: "`compile_briefing()` ফেরত দিল {detail}।",
      en: "`compile_briefing()` returns {detail}.",
    },
    why: {
      bn: "Objects panel দেখো: `admitted`, `conflicts`, `untrusted_data` আর `capabilities` সব আলাদা ও স্পষ্ট।",
      en: "Look at the Objects panel: `admitted`, `conflicts`, `untrusted_data` and `capabilities` are cleanly separated.",
    },
  },

  // consume: version binding and invalidation
  "65": {
    what: {
      bn: "Package-টি কি `READY` অবস্থায় আছে?",
      en: "Is the package currently in the `READY` state?",
    },
    why: {
      bn: "`BLOCKED`, `STALE` বা `REVOKED` package নিয়ে কখনোই মডেলকে সিদ্ধান্ত নিতে পাঠানো যাবে না।",
      en: "A `BLOCKED`, `STALE` or `REVOKED` package may never be used to invoke the model.",
    },
    ref: "Invariant I5 & I10 · pp. 85, 486",
  },
  "67": {
    what: {
      bn: "Package-এর বাঁধা `case_version` (41) কি বর্তমান `live_case_version` ({local.live_case_version})-এর সমান?",
      en: "Does the package's bound `case_version` (41) still match `live_case_version` ({local.live_case_version})?",
    },
    why: {
      bn: "ইতিমধ্যে একজন মানুষ case-টি ৪১ থেকে ৪২-এ আপডেট করেছে। পুরোনো briefing এখন আর বর্তমান সত্য নয়।",
      en: "A human operator edited the case from version 41 to 42. The compiled briefing no longer matches the world.",
    },
    ref: "Pass 10 & Case 9182 build · pp. 85, 89",
  },
  "68": {
    what: {
      bn: "Package-এর অবস্থা `READY` থেকে `STALE` করে দেওয়া হলো।",
      en: "Transition the package from `READY` to `STALE`.",
    },
    why: {
      bn: "Context এককালীন ও অস্থায়ী (disposable); যে তথ্যের ওপর এটি দাঁড়িয়ে ছিল তা বদলে গেলে নতুন করে compile করতে হয়।",
      en: "Context is disposable; when a bound dependency changes, the ready build is invalidated.",
    },
    ref: "READY -> STALE -> RECOMPILING · p. 85",
  },
  "69": {
    what: {
      bn: "Diagnostic লেখা হলো: `version` → `DEPENDENCY_CHANGED`।",
      en: "Record diagnostic: `version` → `DEPENDENCY_CHANGED`.",
    },
    why: {
      bn: "Runtime এখন জানে কেন package বাতিল হয়েছে: version 42 নিয়ে আবার compile করতে হবে।",
      en: "Tells the runtime why the build was invalidated: recompile against case version 42.",
    },
    ref: "p. 484",
  },
  "70": {
    what: {
      bn: "`raise RuntimeError(...)`: পুরোনো package ব্যবহার করে এগোতে অস্বীকার।",
      en: "`raise RuntimeError(...)`: refuse to proceed with a superseded package.",
    },
    why: {
      bn: "পুরোনো package নিয়ে এগোলে মানুষের দেওয়া credit উপেক্ষা করে ভুল সিদ্ধান্ত নেওয়া হতো।",
      en: "Carrying the old package forward would ignore the human operator's edit on version 42.",
    },
    without: {
      bn: "Version যাচাই না থাকলে agent পুরোনো অবস্থার ওপর ভিত্তি করে কাজ করে ফেলত।",
      en: "Without version invalidation, the agent would act on stale case state.",
    },
    ref: "p. 89",
  },
  "70!": {
    what: {
      bn: "Exception: {detail}",
      en: "Exception: {detail}",
    },
    why: {
      bn: "Objects panel দেখো: `status` এখন `STALE` এবং `diagnostics`-এ `DEPENDENCY_CHANGED`।",
      en: "Look at the Objects panel: `status` is `STALE` and `diagnostics` records `DEPENDENCY_CHANGED`.",
    },
  },

  // naive_rag: accumulation without admissibility
  "77": {
    what: {
      bn: "`naive_rag()`: প্রতিটি candidate কোনো যাচাই ছাড়াই একে একে নেওয়া হচ্ছে।",
      en: "`naive_rag()`: iterate over every candidate in the pool without admissibility checks.",
    },
    why: {
      bn: "সাধারণ RAG শুধু similarity দেখে সব কিছু একসাথে prompt-এ জড়ো করে।",
      en: "Accumulation-style RAG concatenates top-k matches straight into the prompt.",
    },
    ref: "The context window is an execution surface · p. 76",
  },
  "78": {
    what: {
      bn: "`{local.unit}` সরাসরি একই prompt তালিকায় যোগ হচ্ছে।",
      en: "Append `{local.unit}` directly into the flat prompt list.",
    },
    why: {
      bn: "দেখো কী ঢুকছে: `attachment-1` (prompt injection), `policy-v31` (মেয়াদোত্তীর্ণ নীতি), আর `case-8100` (অন্য টিকেটের উদাহরণ)।",
      en: "Watch what enters the prompt: `attachment-1` (injection), `policy-v31` (expired policy) and `case-8100` (non-authoritative example).",
    },
    without: {
      bn: "অধিকার, বয়স আর উৎস যাচাই না করায় মডেল নিজেই ঠিক করতে বাধ্য হয় কোনটা সত্য।",
      en: "Without authority, freshness and zone checks, the model is forced to guess what counts as evidence.",
    },
    ref: "pp. 76, 89",
  },
  "79": {
    what: {
      bn: "`return prompt`: যাচাইহীন পুরো তালিকা ফেরত।",
      en: "`return prompt`: return the unvalidated prompt dump.",
    },
    why: {
      bn: "এখানে কোনো manifest, কোনো conflict set বা কোনো মেয়াদোত্তীর্ণ নীতি আটকানোর ব্যবস্থা নেই।",
      en: "There is no manifest, no preserved conflict set and no guard against stale policy or untrusted instructions.",
    },
  },
  "79^": {
    what: {
      bn: "`naive_rag()` ফেরত দিল ৭টি মিশ্র উপাদান: {detail}",
      en: "`naive_rag()` returns all 7 mixed items: {detail}",
    },
    why: {
      bn: "Compiler-এর `ready` এবং `blocked` scenario-র সাথে তুলনা করো: সেখানে প্রতিটি উপাদানের ভূমিকা ও বৈধতা আলাদা।",
      en: "Compare with the `blocked` and `ready` scenarios: the compiler separates authority, freshness, conflicts and untrusted data.",
    },
    ref: "p. 89",
  },
};

export const CONTEXT_COMPILER_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch03.context-compiler",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn: "Step through the Case 9182 build from p. 89: first build blocked by a stale policy, second build ready with an explicit billing-vs-subscription conflict, invalidation when the case version advances to 42, and a naive RAG dump for contrast.",
  descriptionBn: "পৃষ্ঠা 89-এর Case 9182 build ধাপে ধাপে দেখো: পুরোনো policy-র কারণে প্রথম build BLOCKED, নতুন policy আসার পর billing বনাম subscription বিরোধসহ দ্বিতীয় build READY, case version 42 হলে STALE, আর তুলনার জন্য naive RAG dump।",
  displayPath: "harness/ch03/context_compiler.py",
  trace,
  scenarios: [
    { id: "blocked", title: { en: "1 · Stale policy (BLOCKED)", bn: "১ · পুরোনো policy (BLOCKED)" } },
    { id: "ready", title: { en: "2 · Fresh policy (READY)", bn: "২ · নতুন policy (READY)" } },
    { id: "stale", title: { en: "3 · Case edited v41→v42 (STALE)", bn: "৩ · Case বদল v41→v42 (STALE)" } },
    { id: "naive", title: { en: "4 · Naive top-k dump", bn: "৪ · Naive top-k dump" } },
  ],
  notes: NOTES,
  objectTypes: { pkg: "Package", prompt: "list" },
};

