import {
  CodeTraceDefinition,
  RecordedTrace,
  TraceNote,
} from "@/features/code-trace/types/trace.types";
import traceJson from "./budgetedController.trace.json";

// Recorded by courses/harness-playbook/tools/record_trace.py; JSON widens the event unions.
const trace = traceJson as unknown as RecordedTrace;

/**
 * Notes for every traced line of harness/ch04/budgeted_controller.py.
 * Keys: line number, "!" for exception events, "^" for return events.
 * Re-check line numbers whenever the trace is re-recorded.
 */
const NOTES: Record<string, TraceNote> = {
  "18": {
    what: {
      bn: "কোনো অমীমাংসিত effect (`UNKNOWN_EFFECT`) আছে কি যা আগে মীমাংসা করতে হবে?",
      en: "Is there an `UNKNOWN_EFFECT` that must be reconciled before any other action?",
    },
    why: {
      bn: "Continuation contract-এর নিয়ম: আগের কাজের ফলাফল অজানা থাকলে `reconcile` বা `wait_window` ছাড়া অন্য কিছু চলতে পারে না।",
      en: "The continuation contract forbids new actions while a consequential effect is unresolved.",
    },
    ref: "CONTINUE contract · pp. 96, 103",
  },
  "19": {
    what: {
      bn: "`ctrl.state` রাখা হলো `RECOVERING`।",
      en: "Keep `ctrl.state` in `RECOVERING`.",
    },
    why: {
      bn: "`RECOVERING` মানে কথোপকথন আবার চালানো না; শুধু মীমাংসা বা ক্ষতিপূরণের অনুমতি আছে।",
      en: "`RECOVERING` restricts the next transition to reconciliation or safe reconstruction.",
    },
    ref: "p. 97",
  },
  "20": {
    what: {
      bn: "`return ctrl.state`: মীমাংসা ছাড়া অন্য কাজ আটকানো হলো।",
      en: "`return ctrl.state`: block the non-reconciliation action.",
    },
    why: {
      bn: "অজানা payment অবস্থায় নতুন কাজ শুরু করলে দুবার টাকা চলে যাওয়ার ঝুঁকি থাকে।",
      en: "Acting while a payment effect is unknown risks a duplicate charge or refund.",
    },
  },
  "20^": {
    what: {
      bn: "`step()` ফেরত দিল {detail}।",
      en: "`step()` returns {detail}.",
    },
    why: {
      bn: "Controller নিরাপদে নতুন প্রস্তাব ফিরিয়ে দিয়েছে।",
      en: "The controller refused the unsafe continuation.",
    },
  },
  "22": {
    what: {
      bn: "প্রস্তাবিত পদক্ষেপ কি `wait_window` (বাহ্যিক সিস্টেমের জন্য অপেক্ষা)?",
      en: "Is the proposed transition `wait_window` (waiting for the provider's query window)?",
    },
    why: {
      bn: "বাহ্যিক সিস্টেম প্রস্তুত না হওয়া পর্যন্ত বারবার মডেল ডেকে টোকেন পোড়ানো অপচয়।",
      en: "Waiting is not thinking slowly; polling with the model while nothing can change wastes budget.",
    },
    ref: "Waiting is not thinking slowly · pp. 97, 103",
  },
  "23": {
    what: {
      bn: "`ctrl.state` এখন `WAITING_EXTERNAL`।",
      en: "`ctrl.state` enters `WAITING_EXTERNAL`.",
    },
    why: {
      bn: "`WAITING_EXTERNAL` একটি আলাদা সাসপেনশন অবস্থা; এটি `RUNNING`-এর ধীর সংস্করণ নয়।",
      en: "`WAITING_EXTERNAL` is explicit suspension, not a slow version of `RUNNING`.",
    },
    ref: "pp. 97, 106–107",
  },
  "24": {
    what: {
      bn: "Log-এ লেখা হলো: সাসপেন্ড অবস্থায় ০টি মডেল কল খরচ হয়েছে।",
      en: "Record in the log: suspended with 0 model calls burned.",
    },
    why: {
      bn: "Objects panel দেখো: `calls_left` একটুও কমেনি। নির্ধারিত ঘটনা ঘটলে তবেই আবার কাজ শুরু হবে।",
      en: "Look at the Objects panel: `calls_left` is unchanged. Only a wake condition resumes execution.",
    },
    ref: "Suspension and wakeup · pp. 103, 491",
  },
  "25": {
    what: {
      bn: "`return ctrl.state`: `WAITING_EXTERNAL` অবস্থায় ধাপ শেষ।",
      en: "`return ctrl.state`: finish the step in `WAITING_EXTERNAL`.",
    },
    why: {
      bn: "Provider-এর finality window খুললে পরের ধাপে `reconcile` চলবে।",
      en: "Once the provider's query window opens, the controller will run `reconcile`.",
    },
  },
  "25^": {
    what: {
      bn: "`step()` ফেরত দিল {detail}।",
      en: "`step()` returns {detail}.",
    },
    why: {
      bn: "কোনো মডেল কল খরচ না করেই অপেক্ষা সম্পন্ন হলো।",
      en: "Waiting completed without spending model budget.",
    },
  },
  "27": {
    what: {
      bn: "এই পদক্ষেপ নিলে কি অবশিষ্ট কল (`{object.ctrl.calls_left}`) সংরক্ষিত `reserve` (`{object.ctrl.reserve}`)-এর নিচে নেমে যাবে?",
      en: "Would taking this action drop `calls_left` (`{object.ctrl.calls_left}`) below `reserve` (`{object.ctrl.reserve}`)?",
    },
    why: {
      bn: "সর্বশেষ কল খরচ করে টাকা পাঠালে পরে যাচাই বা মীমাংসা করার মতো কোনো budget বাকি থাকে না।",
      en: "Spending the last call on an external effect leaves nothing to reconcile or verify it.",
    },
    without: {
      bn: "Recovery reserve না রাখলে সিস্টেম কাজ শুরু করে মাঝপথে দেউলিয়া (insolvent) হয়ে পড়ে।",
      en: "Without a recovery reserve, the run creates side effects it cannot afford to close.",
    },
    ref: "B_t - c(a) >= recovery_reserve · pp. 98, 106",
  },
  "28": {
    what: {
      bn: "`ctrl.state` করা হলো `BUDGET_EXHAUSTED`।",
      en: "Transition `ctrl.state` to `BUDGET_EXHAUSTED`.",
    },
    why: {
      bn: "Budget শেষ হওয়া কোনো ক্র্যাশ নয়; এটি একটি সুনির্দিষ্ট শেষ অবস্থা যার নিজস্ব মালিক আছে।",
      en: "Budget exhaustion is an owned terminal state, not an unhandled crash.",
    },
    ref: "Budget exhaustion is a state · p. 99",
  },
  "29": {
    what: {
      bn: "Log-এ লেখা হলো কেন dispatch আটকানো হয়েছে।",
      en: "Log why dispatch was refused: it would dip into the recovery reserve.",
    },
    why: {
      bn: "টাকা পাঠানোর আগেই থামানো হয়েছে, তাই কোনো অর্ধসমাপ্ত বাহ্যিক প্রভাব তৈরি হয়নি।",
      en: "Refusing before dispatch prevents creating an unverified external effect.",
    },
    ref: "p. 106",
  },
  "30": {
    what: {
      bn: "`return ctrl.state`: `BUDGET_EXHAUSTED` ফেরত দেওয়া হচ্ছে।",
      en: "`return ctrl.state`: return `BUDGET_EXHAUSTED`.",
    },
    why: {
      bn: "কেবল অনুমোদিত বাহ্যিক মালিকই এখন budget বাড়াতে বা কাজটি বন্ধ করতে পারেন।",
      en: "Only an authorized principal may expand the envelope or close the case.",
    },
  },
  "30^": {
    what: {
      bn: "`step()` ফেরত দিল {detail}।",
      en: "`step()` returns {detail}.",
    },
    why: {
      bn: "Objects panel দেখো: `effect` এখনো `NONE` এবং `reserve` অক্ষত আছে।",
      en: "Look at the Objects panel: `effect` remains `NONE` and the reserve is untouched.",
    },
  },
  "32": {
    what: {
      bn: "Control state-এর ওপর ভিত্তি করে trajectory fingerprint তৈরি করা হচ্ছে।",
      en: "Compute the trajectory fingerprint over control-relevant state.",
    },
    why: {
      bn: "কথার ভাষা বদলালেও যদি কাজ (`{local.action}`), লক্ষ্য (`{local.target}`), effect আর বাকি দায়িত্ব একই থাকে, তবে কোনো অগ্রগতি হয়নি।",
      en: "Even if prose changes, repeating `{local.action}` on `{local.target}` with the same effect and open obligations means zero progress.",
    },
    ref: "Trajectory fingerprint · p. 100",
  },
  "33": {
    what: {
      bn: "এই fingerprint (`{local.fp}`) কি ইতিমধ্যে `ctrl.history`-তে আছে?",
      en: "Has this fingerprint (`{local.fp}`) already appeared in `ctrl.history`?",
    },
    why: {
      bn: "অগ্রগতি ছাড়া একই অবস্থায় ফিরে আসা মানে চক্রাকার লুপ (oscillation বা no-progress)।",
      en: "Revisiting the same control fingerprint without state progress indicates a loop.",
    },
    ref: "No-progress and oscillation · pp. 100–101",
  },
  "34": {
    what: {
      bn: "চক্র ধরা পড়েছে: `ctrl.state` করা হলো `ABSTAINED`।",
      en: "Cycle detected: transition `ctrl.state` to `ABSTAINED`.",
    },
    why: {
      bn: "অন্ধভাবে সর্বোচ্চ turn পর্যন্ত টোকেন না পুড়িয়ে সৎভাবে থেমে যাওয়াই সঠিক আচরণ।",
      en: "Stopping honestly as `ABSTAINED` beats burning the remaining budget in a circle.",
    },
    ref: "Abstention is an active success mode · pp. 101–102",
  },
  "35": {
    what: {
      bn: "Log-এ কোন fingerprint-এ চক্র ধরা পড়েছে তা লিখে রাখা হলো।",
      en: "Record the repeating fingerprint in `ctrl.log`.",
    },
    why: {
      bn: "এর ফলে অপারেটর দেখতে পান ঠিক কোন শর্ত অপরিবর্তিত থাকায় লুপ থামানো হয়েছে।",
      en: "Shows the operator which unchanged state condition triggered the loop stop.",
    },
  },
  "36": {
    what: {
      bn: "`return ctrl.state`: `ABSTAINED` হিসেবে লুপ সমাপ্ত।",
      en: "`return ctrl.state`: terminate the loop as `ABSTAINED`.",
    },
    why: {
      bn: "বাকি ৪টি কল অযথা খরচ হওয়া থেকে বেঁচে গেল।",
      en: "Preserves the remaining 4 calls instead of wasting them on identical probes.",
    },
  },
  "36^": {
    what: {
      bn: "`step()` ফেরত দিল {detail}।",
      en: "`step()` returns {detail}.",
    },
    why: {
      bn: "Objects panel-এ `history` আর `log` দেখো: দ্বিতীয়বার একই অবস্থার পুনরাবৃত্তি সাথে সাথে ধরা পড়েছে।",
      en: "Check `history` and `log` in the Objects panel: the repeat was caught immediately.",
    },
  },
  "37": {
    what: {
      bn: "নতুন fingerprint `{local.fp}` ইতিহাসে যোগ করা হলো।",
      en: "Append the new fingerprint `{local.fp}` to `ctrl.history`.",
    },
    why: {
      bn: "ভবিষ্যতের যেকোনো ধাপ যদি কোনো অগ্রগতি ছাড়া এই অবস্থায় ফিরে আসে, তবে তা ধরা পড়বে।",
      en: "Any future step that returns to this exact state without progress will be caught.",
    },
    ref: "p. 100",
  },
  "39": {
    what: {
      bn: "Budget ledger থেকে ১টি কল খরচ করা হলো (`calls_left` কমল)।",
      en: "Deduct 1 call from the budget ledger (`calls_left` decreases).",
    },
    why: {
      bn: "প্রতিটি অনুমোদিত পদক্ষেপের খরচ স্থায়ীভাবে লেখা হয়; কোনো worker বা রিস্টার্ট এটি মুছতে পারে না।",
      en: "Every admitted transition charges the durable ledger.",
    },
    ref: "Budget is delegated authority · pp. 97–98",
  },
  "40": {
    what: {
      bn: "পদক্ষেপটি কি `dispatch_refund`?",
      en: "Is the action `dispatch_refund`?",
    },
    why: {
      bn: "বাহ্যিক পেমেন্ট পাঠানোর পর ফলাফল নিশ্চিত বা অনিশ্চিত—দুই-ই হতে পারে।",
      en: "Dispatching an external payment can either confirm immediately or leave an uncertain outcome.",
    },
  },
  "41": {
    what: {
      bn: "Dispatch-এর ফলাফল কি `timeout`?",
      en: "Did the dispatch result in a `timeout`?",
    },
    why: {
      bn: "Timeout একটি জ্ঞানগত (epistemic) ঘটনা: এটি শুধু বলে উত্তর আসেনি, টাকা যায়নি তা প্রমাণ করে না।",
      en: "A timeout is an epistemic event: it says the caller stopped waiting, not that the provider did nothing.",
    },
    ref: "Timeouts are epistemic events · p. 103",
  },
  "42": {
    what: {
      bn: "`ctrl.effect` এখন `UNKNOWN_EFFECT`।",
      en: "Set `ctrl.effect` to `UNKNOWN_EFFECT`.",
    },
    why: {
      bn: "ফলাফল অজানা থাকা অবস্থায় দ্বিতীয়বার টাকা পাঠানো নিষিদ্ধ।",
      en: "While the effect is unknown, re-sending the payment is forbidden.",
    },
    ref: "pp. 103, 106",
  },
  "43": {
    what: {
      bn: "`ctrl.state` গেল `RECOVERING`-এ।",
      en: "Move `ctrl.state` to `RECOVERING`.",
    },
    why: {
      bn: "এখন একমাত্র বৈধ পরবর্তী কাজ হলো অপেক্ষা করা (`wait_window`) বা মীমাংসা করা (`reconcile`)।",
      en: "The only legal next moves are waiting for the query window or reconciling by operation key.",
    },
    ref: "p. 106",
  },
  "47": {
    what: {
      bn: "পদক্ষেপটি কি `reconcile` (ledger যাচাই)?",
      en: "Is the action `reconcile` (authoritative ledger lookup)?",
    },
    why: {
      bn: "`UNKNOWN_EFFECT` দূর করার একমাত্র উপায় হলো একই operation key দিয়ে আসল ledger দেখা।",
      en: "The only way out of `UNKNOWN_EFFECT` is querying the authoritative ledger by operation key.",
    },
    ref: "pp. 103, 107",
  },
  "48": {
    what: {
      bn: "Ledger-এ কি refund-টি পাওয়া গেছে (`outcome == 'found'`)?",
      en: "Did the ledger lookup find the settled refund (`outcome == 'found'`)?",
    },
    why: {
      bn: "মীমাংসার দুটি পথ: হয় পেমেন্ট পাওয়া যাবে, নয়তো সময়সীমা শেষে অমীমাংসিত হিসেবে রিপোর্ট হবে।",
      en: "Reconciliation either confirms the effect or escalates an unresolved effect at the deadline.",
    },
  },
  "49": {
    what: {
      bn: "`ctrl.effect` এখন `CONFIRMED`।",
      en: "Update `ctrl.effect` to `CONFIRMED`.",
    },
    why: {
      bn: "প্রমাণিত হলো যে প্রথমবারই টাকা চলে গিয়েছিল; retry না করায় দ্বিগুণ পেমেন্ট এড়ানো গেছে।",
      en: "Proves the first dispatch succeeded; not retrying prevented a duplicate refund.",
    },
    ref: "p. 107",
  },
  "50": {
    what: {
      bn: "`refund` দায়িত্বটি সম্পন্ন হওয়ায় তালিকা থেকে সরানো হলো।",
      en: "Close the `refund` obligation by removing it from `ctrl.obligations`.",
    },
    why: {
      bn: "Progress vector ছোট হলো (`obligations` ২ থেকে ১-এ নামল): এটিই প্রকৃত অগ্রগতির প্রমাণ।",
      en: "The progress vector shrank (`obligations` dropped from 2 to 1): a verified progress delta.",
    },
    ref: "The progress certificate · pp. 99–100",
  },
  "51": {
    what: {
      bn: "`ctrl.state` এখন `VERIFYING`।",
      en: "Transition `ctrl.state` to `VERIFYING`.",
    },
    why: {
      bn: "কাজ শেষ ঘোষণা করার আগে স্বাধীন যাচাই (`verify`) ধাপ পার হতে হয়।",
      en: "`VERIFYING` prevents the worker from declaring `COMPLETED` before all obligations are checked.",
    },
    ref: "pp. 97, 107",
  },
  "53": {
    what: {
      bn: "সময়সীমা পেরিয়েও মীমাংসা না হওয়ায় `ctrl.state` হলো `UNRESOLVED_EFFECT`।",
      en: "Reconciliation remained unavailable at deadline: transition to `UNRESOLVED_EFFECT`.",
    },
    why: {
      bn: "আন্দাজে দ্বিতীয়বার টাকা না পাঠিয়ে বা মিথ্যা সাফল্যের বার্তা না দিয়ে সৎভাবে payments owner-এর কাছে হস্তান্তর।",
      en: "Rather than guessing or paying twice, hand the frozen operation packet to the payments incident owner.",
    },
    without: {
      bn: "এই অবস্থা না থাকলে সিস্টেম হয় আবার টাকা পাঠাত, নয়তো কাজ শেষ বলে মিথ্যা দাবি করত।",
      en: "Without `UNRESOLVED_EFFECT`, the loop would either duplicate the refund or falsely claim completion.",
    },
    ref: "pp. 101, 107",
  },
  "54": {
    what: {
      bn: "পদক্ষেপটি কি `verify` এবং আর্থিক দায়িত্ব (`refund`) কি ইতিমধ্যে মিটেছে?",
      en: "Is the action `verify` with the `refund` obligation already closed?",
    },
    why: {
      bn: "অমীমাংসিত `refund` রেখে কখনোই যাচাই শেষ করা যাবে না।",
      en: "Verification can succeed only after the underlying refund obligation is closed.",
    },
    ref: "Stop is a protocol · pp. 101–102",
  },
  "55": {
    what: {
      bn: "সর্বশেষ দায়িত্ব `verify` তালিকা থেকে সরানো হলো (`obligations` এখন খালি)।",
      en: "Close the final `verify` obligation (`obligations` is now empty).",
    },
    why: {
      bn: "সব আবশ্যিক দায়িত্ব প্রামাণ্যভাবে পূর্ণ হয়েছে।",
      en: "All required obligations are now qualified with authoritative evidence.",
    },
  },
  "56": {
    what: {
      bn: "`ctrl.state` এখন `COMPLETED`।",
      en: "Transition `ctrl.state` to `COMPLETED`.",
    },
    why: {
      bn: "বৈধ completion certificate-এর মাধ্যমে রানটি সমাপ্ত হলো, এবং এখনো ২টি কল অবশিষ্ট আছে।",
      en: "The run enters `COMPLETED` backed by reconciled evidence, with 2 calls still left.",
    },
    ref: "p. 107",
  },
  "57": {
    what: {
      bn: "`return ctrl.state`: বর্তমান ধাপের পর নতুন state ফেরত।",
      en: "`return ctrl.state`: return the controller's new state.",
    },
    why: {
      bn: "Objects panel-এ `state`, `effect`, `calls_left` আর `obligations`-এর পরিবর্তন দেখো।",
      en: "Inspect `state`, `effect`, `calls_left` and `obligations` in the Objects panel.",
    },
  },
  "57^": {
    what: {
      bn: "`step()` ফেরত দিল {detail}।",
      en: "`step()` returns {detail}.",
    },
    why: {
      bn: "প্রতিটি ধাপ সুনির্দিষ্ট নিয়ম ও প্রমাণের মাধ্যমে নিয়ন্ত্রিত হয়েছে।",
      en: "Every transition was governed by budget, effect state and progress rules.",
    },
  },
};

export const BUDGETED_CONTROLLER_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch04.budgeted-controller",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn: "Step through four controller runs (pp. 96–107): governed timeout recovery via suspension and reconciliation, honest UNRESOLVED_EFFECT when the ledger is down, trajectory-fingerprint cycle stopping, and recovery-reserve protection.",
  descriptionBn: "চারটি controller run ধাপে ধাপে দেখো (pp. 96–107): সাসপেনশন ও মীমাংসার মাধ্যমে timeout recovery, ledger বন্ধ থাকলে সৎভাবে UNRESOLVED_EFFECT, fingerprint দিয়ে চক্রাকার লুপ থামানো, এবং recovery reserve রক্ষা করা।",
  displayPath: "harness/ch04/budgeted_controller.py",
  trace,
  scenarios: [
    { id: "governed", title: { en: "1 · Governed recovery (COMPLETED)", bn: "১ · নিয়ন্ত্রিত recovery (COMPLETED)" } },
    { id: "unresolved", title: { en: "2 · Ledger unavailable (UNRESOLVED_EFFECT)", bn: "২ · Ledger অনুপলব্ধ (UNRESOLVED_EFFECT)" } },
    { id: "cycle", title: { en: "3 · Semantic repeat (ABSTAINED)", bn: "৩ · একই কাজের পুনরাবৃত্তি (ABSTAINED)" } },
    { id: "reserve", title: { en: "4 · Reserve guard (BUDGET_EXHAUSTED)", bn: "৪ · Reserve সুরক্ষা (BUDGET_EXHAUSTED)" } },
  ],
  notes: NOTES,
  objectTypes: { ctrl: "Controller" },
};

